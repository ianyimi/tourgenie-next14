/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type {
  LocationCityDetailsResponse,
  LocationCitySearchResponse,
} from "~/types/api/amadeus";
import { createApiAuthRequestOptions } from "~/lib/api/utils";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
// import type { CitySearchResponse } from "~/types/searchCities";
import { z } from "zod";

const GET_OPTIONS = {
  method: "GET",
};

export const destinationSearchRouter = createTRPCRouter({
  searchCity: publicProcedure
    .input(
      z.object({
        accessToken: z.string().min(1),
        keyword: z.string(),
        countryCode: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      console.info(
        `AMADEUS - fetching location for ${input.keyword}... access token: ${input.accessToken}`,
      );
      const citySearchUrl = `https://test.api.amadeus.com/v1/reference-data/locations?keyword=${
        input.keyword
      }&subType=AIRPORT,CITY${
        input.countryCode ? `&countryCode=${input.countryCode}` : ""
      }`;
      // const citySearchResponseData = await authorizedApiRequest(
      //   citySearchUrl,
      //   GET_OPTIONS
      // );
      // console.log("sv2: ", citySearchResponseData);
      const citySearchResponse = await fetch(
        citySearchUrl,
        createApiAuthRequestOptions(input.accessToken, GET_OPTIONS),
      );
      const citySearchResult: LocationCitySearchResponse =
        await citySearchResponse.json();
      return citySearchResult;
    }),
  getLocationDetails: publicProcedure
    .input(z.object({ accessToken: z.string().min(1), locationId: z.string() }))
    .mutation(async ({ input }) => {
      console.info(
        `AMADEUS - fetching location details for location id ${input.locationId}... access token: ${input.accessToken}`,
      );
      const citySearchUrl = `https://test.api.amadeus.com/v1/reference-data/locations/${input.locationId}`;
      const citySearchResponse = await fetch(
        citySearchUrl,
        createApiAuthRequestOptions(input.accessToken, GET_OPTIONS),
      );
      const citySearchResult: LocationCityDetailsResponse =
        await citySearchResponse.json();
      return citySearchResult;
    }),
  findNearbyPois: publicProcedure
    .input(
      z.object({
        accessToken: z.string().min(1),
        latitude: z.string(),
        longitude: z.string(),
        radius: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      console.info(
        `AMADEUS - fetching nearby pois for location id ${input.latitude}, ${input.longitude}... access token: ${input.accessToken}`,
      );
      const poiSearchUrl = `https://test.api.amadeus.com/v1/reference-data/locations/pois?latitude=${
        input.latitude
      }&longitude=${input.longitude}&radius=${
        input.radius ? input.radius : 20
      }`;
      const poiSearchResponse = await fetch(
        poiSearchUrl,
        createApiAuthRequestOptions(input.accessToken, GET_OPTIONS),
      );
      const poiSearchResult: LocationCitySearchResponse =
        await poiSearchResponse.json();
      return poiSearchResult;
    }),
});
