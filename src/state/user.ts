import { observable } from "@legendapp/state";

export const DietaryRestrictions = {
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  glutenFree: "Gluten Free",
  kosher: "Kosher",
  halal: "Halal",
  lactoseIntolerant: "Lactose Intolerant",
  none: "None",
} as const;

export const AccessibilityRequirements = {
  wheelchair: "Wheelchair",
  blind: "Blind",
  deaf: "Deaf",
  none: "None",
} as const;

export const Activities = {
  none: "None",
  beach: "Beach",
  mountains: "Mountains",
  food: "Food",
  shopping: "Shopping",
  nightlife: "Nightlife",
  history: "History",
  architecture: "Architecture",
  museums: "Museums",
  art: "Art",
  music: "Music",
  sports: "Sports",
  hiking: "Hiking",
  winterSports: "Winter Sports",
  camping: "Camping",
} as const;

export type LocationCategory =
  | "hotels"
  | "restaurants"
  | "attractions"
  | "geos";

export type UserDetails = {
  userId: number;
  subscriptionTier: "Free" | "Premium";
  tripIds?: number[];
  travelPreferences: {
    budget?: string;
    preferredTransportation?: string;
    preferredAccommodation?: string;
    preferredActivities?: string;
    dietaryRestrictions: (typeof DietaryRestrictions)[keyof typeof DietaryRestrictions][];
    accessibilityRequirements: (typeof AccessibilityRequirements)[keyof typeof AccessibilityRequirements][];
    travelerIds?: string[];
    travelGroup?: string[];
    activities: (typeof Activities)[keyof typeof Activities][];
  };
  personalInfo?: {
    name?: string;
    firstName?: string;
    lastName?: string;
    hobbies?: string[];
    languages?: string[];
    age?: number;
  };
};

// export const userDetails$ = observable<UserDetails>({
//   ...DEFAULT_USER_DETAILS,
//   updateUserDetails(userDetails) {
//     mergeIntoObservable(userDetails$, {
//       ...userDetails,
//     });
//   },
// });

type UserState = {
  user: UserDetails;
  updateUserDetails?: (userDetails: Partial<UserDetails>) => void;
};

export const userState$ = observable<UserState>({
  user: {
    userId: -1,
    subscriptionTier: "Free",
    travelPreferences: {
      activities: [],
      dietaryRestrictions: [],
      accessibilityRequirements: [],
    },
  },
});
