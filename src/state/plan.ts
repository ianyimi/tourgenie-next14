import { mergeIntoObservable, observable } from "@legendapp/state";
import type { LocationCity } from "~/types/api/amadeus";

export const Accomodation = {
  hotel: "Hotel",
  hostel: "Hostel",
  airbnb: "Airbnb",
  friendRelative: "Friend/Relative",
  other: "Other",
} as const;

export type TripDestination = {
  name: string;
  city: string;
  country: string;
  latLong: string;
  airport: string;
  arrivalDate: Date;
  departureDate: Date;
  accommodation: {
    name: string;
    type: (typeof Accomodation)[keyof typeof Accomodation];
    address?: string;
    phone?: string;
    latLong?: string;
  };
  restuarants?: {
    name: string;
    address: string;
    phone?: string;
    latLong: string;
  }[];
  attractions?: {
    name: string;
    address: string;
    phone?: string;
    latLong: string;
  }[];
  purpose: string;
  additionalContext?: string;
  activities?: string[];
};

export type TripDetails = {
  title: string;
  location: string;
  locationCity: string;
  locationCountry: string;
  summary: string;
  latLong?: string;
  startDate: Date;
  endDate: Date;
  startDestination?: TripDestination;
  endDestination?: TripDestination;
  purpose?: string;
  additionalContext?: string;
};

export type PlanDetails = {
  hotels: Location[];
  restaurants: Location[];
  attractions: Location[];
  geos: Location[];
  airports: LocationCity[];
  flights?: Location[];
  transportation?: Location[];
} & TripDetails;

export type LocationCategory =
  | "hotels"
  | "restaurants"
  | "attractions"
  | "geos";

type CurrentPlanState = PlanDetails & {
  addNearbyLocationDetailsToPlan: (
    location: Location,
    category: LocationCategory,
  ) => void;
};

const startDate = new Date();
export const $currentPlan = observable<CurrentPlanState>({
  title: "",
  location: "",
  locationCity: "",
  locationCountry: "",
  latLong: "",
  summary: "",
  startDate: startDate,
  endDate: new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate() + 7,
  ),
  purpose: "",
  hotels: [],
  restaurants: [],
  attractions: [],
  geos: [],
  airports: [],
  addNearbyLocationDetailsToPlan(
    location: Location,
    category: LocationCategory,
  ) {
    switch (category) {
      case "hotels":
        $currentPlan.hotels.push(location);
        break;
      case "attractions":
        $currentPlan.attractions.push(location);
        break;
      case "restaurants":
        $currentPlan.restaurants.push(location);
        break;
      case "geos":
        $currentPlan.geos.push(location);
        break;
      default:
        break;
    }
  },
});

type CurrentTripState = {
  currentTrip: TripDetails;
};

export const currentTrip$ = observable<CurrentTripState>({
  currentTrip: {
    title: "",
    location: "",
    locationCity: "",
    locationCountry: "",
    summary: "",
    latLong: "",
    startDate: startDate,
    endDate: new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + 7,
    ),
    purpose: "",
  },
});
