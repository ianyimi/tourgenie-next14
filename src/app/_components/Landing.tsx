"use client";

// import { isMobile, isTablet } from "react-device-detect";
import { useRef } from "react";
import Link from "next/link";
import { SpaceGrotesk, Vercetti } from "~/styles/fonts";
import { cnJoin } from "~/styles/utils";
import {
  LuBriefcase,
  LuChevronsDown,
  LuHome,
  LuPersonStanding,
  LuPiggyBank,
} from "react-icons/lu";

import SimpleHref from "./ui/SimpleHref";

const features = [
  {
    name: "Plan for any Occassion",
    description:
      "Business or Leisure? Customize your plans to suit your specific travel goals and make the most of every moment.",
    icon: LuBriefcase,
  },
  {
    name: "Pre-Existing Accomodations",
    description:
      "Visiting Freinds & Family? Incorporate your pre-existing plans with ease, and let us build your dream trip around them.",
    icon: LuHome,
  },
  {
    name: "Personalized Preferences",
    description:
      "Save your preferences and let TourGenie do the heavy lifting, ensuring your trip aligns with your interests!",
    icon: LuPersonStanding,
  },
  {
    name: "Budget Friendly",
    description:
      "Never sweat the cost; we help create amazing experiences tailored to your budget!",
    icon: LuPiggyBank,
  },
];

export default function Landing() {
  const sectionTwo = useRef<HTMLDivElement>(null);
  const sectionThree = useRef<HTMLDivElement>(null);

  return (
    // <div>
    <div
      className={cnJoin(
        "absolute inset-0 min-h-[100dvh] min-w-full snap-y snap-mandatory overflow-x-hidden text-tgBackgroundDark dark:text-tgBackgroundLight",
        Vercetti.className,
      )}
    >
      <section className="relative min-h-[100dvh] min-w-full snap-start">
        <div
          className={cnJoin(
            "container relative top-[20dvh] mx-auto",
            // isTablet ? "max-w-4xl" : !isMobile ? "max-w-6xl" : ""
          )}
        >
          <div className="max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <h2
              className={cnJoin(
                "relative text-2xl font-bold tracking-tight sm:text-4xl",
                SpaceGrotesk.className,
              )}
            >
              Rediscover the Magic of Travel.
              <br />
              Plan with TourGenie Today.
            </h2>
            <div className="mt-10 flex items-center gap-x-6">
              <SimpleHref href="dashboard" hideNav>
                Try Now
              </SimpleHref>
              <div
                // href="#"
                className="cursor-pointer text-sm font-semibold leading-6 transition-colors duration-500 hover:text-tgPrimary"
                onClick={() =>
                  sectionTwo.current?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
              >
                Learn More <span aria-hidden="true">→</span>
              </div>
            </div>
          </div>
          <LuChevronsDown
            className="absolute -bottom-24 left-1/2 h-14 w-14 -translate-x-1/2 cursor-pointer text-tgSecondary transition-colors duration-500 hover:text-tgPrimary dark:text-tgPrimary dark:hover:text-tgAccent md:-bottom-[25dvh] md:h-16 md:w-16 2xl:-bottom-[30dvh]"
            onClick={() =>
              sectionTwo.current?.scrollIntoView({
                behavior: "smooth",
              })
            }
          />
        </div>
      </section>
      <section
        ref={sectionTwo}
        className="relative grid min-h-[100dvh] min-w-full snap-start place-items-center overflow-hidden"
      >
        <div className="rounded-xl border-2 border-tgSecondary backdrop-blur dark:border-tgPrimary">
          <div className="mx-auto max-w-7xl p-8 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7">
                Discover Features
              </h2>
              <p
                className={cnJoin(
                  "mt-2 text-3xl font-bold tracking-tight sm:text-4xl",
                  SpaceGrotesk.className,
                )}
              >
                Experience Your Dream Getaway
              </p>
              <p className="mt-6 text-lg leading-8">
                Craft the perfect adventure like never before. TourGenie blends
                AI precision with your unique desires, building trips that
                memories are made of.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-16">
                    <dt className="text-base font-semibold leading-7">
                      <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-tgSecondary dark:bg-tgPrimary">
                        <feature.icon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="mt-2 text-base leading-7">
                      {feature.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <LuChevronsDown
              className="absolute -bottom-20 left-1/2 h-14 w-14 -translate-x-1/2 cursor-pointer text-tgSecondary transition-colors duration-500 hover:text-tgPrimary dark:text-tgPrimary dark:hover:text-tgAccent"
              onClick={() =>
                sectionThree.current?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            />
          </div>
        </div>
      </section>
      <section
        ref={sectionThree}
        className="relative grid min-h-[100dvh] min-w-full snap-start place-items-center overflow-hidden"
      >
        <div className="rounded-xl border-2 border-tgSecondary backdrop-blur dark:border-tgPrimary">
          <div className="px-6 py-20 sm:px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2
                className={cnJoin(
                  "text-3xl font-bold tracking-tight sm:text-4xl",
                  SpaceGrotesk.className,
                )}
              >
                Start Planning Today
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8">
                Get Started for Free Today! Your first three trip plans are on
                us.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/sign-in"
                  className="rounded-md bg-tgSecondary px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:bg-tgPrimary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tgSecondary dark:bg-tgPrimary dark:hover:bg-tgAccent dark:focus-visible:outline-tgPrimary"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    // </div>
  );
}
