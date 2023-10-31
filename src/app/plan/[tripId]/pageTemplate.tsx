"use client";
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { clear } from "console";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import type { InferGetServerSidePropsType } from "next";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import {
  beginBatch,
  endBatch,
  mergeIntoObservable,
  observable,
  type ObservablePrimitiveBaseFns,
} from "@legendapp/state";
import {
  observer,
  useIsMounted,
  useMount,
  useObservable,
  useObserve,
  useObserveEffect,
} from "@legendapp/state/react";
import { type UseTRPCMutationResult } from "@trpc/react-query/shared";
// import va from "@vercel/analytics";
import {
  GithubIcon,
  LoadingCircle,
  SendIcon,
  VercelIcon,
} from "~/assets/icons";
import OptionsMenu from "~/components/OptionsMenu";
import RoundIconButton from "~/components/ui/RoundIconButton";
import { BaseLayout, MapLayout } from "~/layouts";
import { api } from "~/lib/api/client";
import { functionCallHandler } from "~/lib/api/functions";
import { type LocationCity } from "~/lib/api/types/amadeus";
import { apiAuthState$ } from "~/state/auth";
import { mapState$, type FocusedLocation } from "~/state/map";
import { $currentPlan, type LocationCategory } from "~/state/plan";
import { cnMerge } from "~/styles/utils";
import { type ChatRequest, type FunctionCallHandler } from "ai";
import { useChat, type Message } from "ai/react";
import { getSession, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { type ChatCompletionRequestMessageFunctionCall } from "openai-edge";
import {
  LuBot,
  LuHotel,
  LuMoon,
  LuSun,
  LuSunMoon,
  LuTent,
  LuUser,
  LuUtensils,
} from "react-icons/lu";
import { MdAttractions } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import Textarea from "react-textarea-autosize";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

import { type NextPageWithLayout } from "../_app";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
function wait(ms: number) {
  const start = new Date().getTime();
  let end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}

const Plan: NextPageWithLayout = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isMounted$ = useIsMounted();
  const nearbyLocationDetails$ = useObservable<{
    hotels: Location[];
    attractions: Location[];
    restaurants: Location[];
    geos: Location[];
    airports: LocationCity[];
  }>({
    hotels: [],
    attractions: [],
    restaurants: [],
    geos: [],
    airports: [],
  });

  const destinationPlan$ = useObservable<{
    name: string;
    locationId: string | null;
    latitude: number | null;
    longitude: number | null;
    latLong: string | null;
    hotel?: Location;
    airport?: LocationCity;
    itinerary?: {
      date: Date;
      startTime: Date;
      endTime: Date;
      activities: Location & {
        arrivalTime: Date;
        departureTime: Date;
        reservation?: unknown;
      };
    }[];
  }>({
    name: "",
    locationId: null,
    latLong: null,
    latitude: null,
    longitude: null,
  });

  const { data: currentTripDetails, isSuccess: tripDataLoaded } =
    api.trip.getDetailsById.useQuery({
      tripId: router.query.tripId as string,
    });
  const searchCitiesByCountryMutator = api.cities.search.useMutation();
  const citySearchMutator = api.destinationSearch.searchCity.useMutation();
  const locationDetailsMutator =
    api.destinationSearch.getLocationDetails.useMutation();

  // status === "unauthenticated" && console.log("unauthenticated session");
  tripDataLoaded && console.log("currentTripDetails: ", currentTripDetails);

  const { messages, input, setInput, setMessages, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat2",
      experimental_onFunctionCall: functionCallHandler,
      onResponse: (response) => {
        if (response.status === 429) {
          toast.error("You have reached your request limit for the day.");
          va.track("Rate limited");
          return;
        } else {
          va.track("Chat initiated");
          console.log("response: ", messages);
        }
      },
      onError: (error) => {
        va.track("Chat errored", {
          input,
          error: error.message,
        });
      },
    });

  const interval: ObservablePrimitiveBaseFns<Timer | undefined> =
    useObservable(undefined);
  useObserve($currentPlan.locationCountry, async ({ value }) => {
    if (!value) return;
    clearInterval(interval.get());
    console.log("fetching cities for country: ", value);
    const citiesByCountry = await searchCitiesByCountryMutator.mutateAsync({
      country: value,
    });
    console.log("citiesData: ", citiesByCountry);
    if (citiesByCountry.length < 1) return;
    function navigateCities() {
      selectedCityIndex = (selectedCityIndex + 1) % 5;
      const city = citiesByCountry[selectedCityIndex];
      if (!city) return;
      mapState$.updateFocusedLocation({
        latitude: city.latitude,
        longitude: city.longitude,
        zoom: 10,
        name: city.name,
      });
    }
    const firstCity = citiesByCountry[0];
    if (!firstCity) return;
    mapState$.updateFocusedLocation({
      latitude: firstCity.latitude,
      longitude: firstCity.longitude,
      zoom: 11,
      name: firstCity.name,
    });
    let selectedCityIndex = 0;
    interval.set(setInterval(navigateCities, 15000));
  });

  useObserve($currentPlan.locationCity, async ({ value }) => {
    if (!value) return;
    clearInterval(interval.get());
    await citySearchMutator.mutateAsync({
      accessToken: apiAuthState$.access_token.get(),
      keyword: value,
    });
  });

  useEffect(() => {
    if (!citySearchMutator.isSuccess) return;
    const citySearchResultData = citySearchMutator.data.data;
    let foundCity = false;
    nearbyLocationDetails$.airports.set([]);
    for (const data of citySearchResultData) {
      if (!foundCity && data.subType === "CITY") {
        mergeIntoObservable(destinationPlan$, {
          name: data.name,
          locationId: data.id,
          latitude: Number(data.geoCode.latitude),
          longitude: Number(data.geoCode.longitude),
          latLong: `${data.geoCode.latitude},${data.geoCode.longitude}`,
        });
        mapState$.updateFocusedLocation({
          latitude: Number(data.geoCode.latitude),
          longitude: Number(data.geoCode.longitude),
          zoom: 12,
          name: data.name,
        });
        foundCity = true;
      } else if (data.subType === "AIRPORT") {
        nearbyLocationDetails$.airports.push(data);
      }
    }
    console.log("nearbyLocationDetails: ", nearbyLocationDetails$);
    console.log("airports: ", nearbyLocationDetails$.airports.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [citySearchMutator.status]);

  // useObserve(destinationPlan$.locationId, async ({ value }) => {
  //   if (!value) return;
  //   await locationDetailsMutator.mutateAsync({
  //     accessToken: apiAuthState$.access_token.get(),
  //     locationId: value,
  //   });
  // });

  useEffect(() => {
    if (!locationDetailsMutator.isSuccess) return;
    console.log("location details: ", locationDetailsMutator.data);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationDetailsMutator.status]);

  // fetch location data mainly for latLong Coordinates
  // useEffect(() => {
  //   if (currentPlanLocation$) {
  //     // console.log("fetched location info: ", locationInfo);
  //     const ancestorCount = locationInfo.ancestors.length;
  //     mapState$.updateFocusedLocation({
  //       longitude: +locationInfo.longitude,
  //       latitude: +locationInfo.latitude,
  //       zoom: ancestorCount > 2 ? 15 : ancestorCount > 1 ? 10 : 5,
  //       name: currentPlanLocation$,
  //     } as FocusedLocation);
  //     $currentPlan.updatePlanDetails({
  //       latLong: `${locationInfo.latitude ?? ""},${
  //         locationInfo.longitude ?? ""
  //       }`,
  //     });
  //   }
  // }, [currentPlanLocation$]);

  function handleLocationSearch(e: React.MouseEvent<HTMLButtonElement>) {
    const latLong = $currentPlan.latLong?.get();
    if (!latLong || latLong.length < 1) return;
    const locationCategory = e.currentTarget
      .value as keyof typeof nearbyLocationDetails$;
    // const { data: nearbyLocationSearchResults } =
    //   await destinationSearchMutator.mutateAsync({
    //     accessToken: apiAuthState$.access_token.get(),
    //     keyword: locationCategory as string,
    //   });

    // if (!nearbyLocationSearchResults) return;

    // for (let i = 0; i < nearbyLocationSearchResults.length; i++) {
    //   const tempLocation = nearbyLocationSearchResults[i];
    //   const nearbyLocationDetailedInfo =
    //     await locationDataMutator.mutateAsync({
    //       accessToken: apiAuthState$.access_token.get(),
    //       locationId: `${tempLocation.location_id}`,
    //     });

    //   $currentPlan.addNearbyLocationDetailsToPlan(
    //     nearbyLocationDetailedInfo,
    //     locationCategory as LocationCategory
    //   );
    // }
  }

  // useObserve(() => {
  //   console.log("current plan hotels ", $currentPlan.hotels.get());
  // });

  const disabled = isLoading || input.length === 0;

  return (
    <div className="z-10 flex flex-col items-center justify-between pb-40">
      <div className="absolute top-5 hidden w-full justify-between px-5 sm:flex">
        <a
          href="/deploy"
          target="_blank"
          className="rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100 sm:bottom-auto"
        >
          <VercelIcon />
        </a>
        {isMounted$.get() && (
          <div
            className="hover:text-tgPrimary ml-4 cursor-pointer px-2 transition-colors duration-500 xl:ml-24"
            onClick={() => {
              if (theme === "system") {
                setTheme("light");
              } else if (theme === "light") {
                setTheme("dark");
              } else {
                setTheme("system");
              }
            }}
          >
            {theme === "system" ? (
              <LuSunMoon />
            ) : theme === "dark" ? (
              <LuMoon />
            ) : (
              <LuSun />
            )}
          </div>
        )}
      </div>
      <div className="container relative isolate px-6 pt-14 lg:px-8">
        <div className="z-0 mx-auto max-w-2xl">
          <OptionsMenu />
        </div>
      </div>
      {/* {messages.length > 0 &&
        messages.map((message, i) => (
          <div
            key={i}
            className={cnMerge(
              "flex w-full items-center z-10 justify-center border-b border-gray-200 py-8",
              message.role === "user" ? "bg-white" : "bg-gray-100"
            )}
          >
            <div className="flex w-full max-w-screen-md items-start space-x-4 px-5 sm:px-0">
              <div
                className={cnMerge(
                  "p-1.5 text-white",
                  message.role === "assistant" ? "bg-green-500" : "bg-black"
                )}
              >
                {message.role === "user" ? (
                  <User width={20} />
                ) : (
                  <Bot width={20} />
                )}
              </div>
              <ReactMarkdown
                className="prose mt-1 w-full break-words prose-p:leading-relaxed"
                remarkPlugins={[remarkGfm]}
                components={{
                  // open links in new tab
                  a: (props) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))} */}
      <div className="text-tgText to-tgBackground fixed bottom-0 flex w-full max-w-xl flex-col items-center space-y-3 bg-gradient-to-b from-transparent p-5 pb-3 sm:px-0">
        <div className="absolute -top-4 right-0 mr-6 flex gap-2">
          <RoundIconButton onClick={handleLocationSearch} value="hotels">
            <LuHotel />
          </RoundIconButton>
          <RoundIconButton onClick={handleLocationSearch} value="attractions">
            <MdAttractions />
          </RoundIconButton>
          <RoundIconButton onClick={handleLocationSearch} value="restaurants">
            <LuUtensils />
          </RoundIconButton>
          <RoundIconButton onClick={handleLocationSearch} value="geos">
            <LuTent />
          </RoundIconButton>
        </div>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="border-tgText bg-tgBackground bg-tgBackgroundLight dark:bg-tgBackgroundDark relative w-full max-w-screen-md rounded-xl border px-4 pb-2 pt-3 shadow-lg sm:pb-3 sm:pt-4"
        >
          <div className="absolute -top-[1.35rem] left-4">
            Search Destination
          </div>
          <Textarea
            ref={inputRef}
            tabIndex={0}
            required
            rows={1}
            autoFocus
            placeholder="Send a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                formRef.current?.requestSubmit();
                e.preventDefault();
              }
            }}
            spellCheck={false}
            className="w-full bg-inherit pr-10 focus:outline-none"
          />
          <button
            className={cnMerge(
              "absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
              disabled
                ? "cursor-not-allowed"
                : "bg-tgPrimary hover:bg-tgPrimary-700",
            )}
            disabled={disabled}
          >
            {isLoading ? (
              <LoadingCircle />
            ) : (
              <SendIcon
                className={cnMerge(
                  "h-4 w-4",
                  input.length === 0 ? "text-gray-300" : "text-white",
                )}
              />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

Plan.getLayout = function getLayout(page: ReactElement) {
  return (
    <BaseLayout>
      <MapLayout>{page}</MapLayout>
    </BaseLayout>
  );
};

export default Plan;
