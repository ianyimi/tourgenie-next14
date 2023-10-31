import { number } from "zod";

interface AuthServerResponse {
  type: string;
  username: string;
  application_name: string;
  client_id: string;
  token_type: string;
  access_token: string;
  expires_in: number;
  state: string;
  scope: string;
}

interface ProcessedAuthServerResponse extends AuthServerResponse {
  expires_at: number;
}

type LocationAddress = {
  category?: string;
  lines?: string[];
  postalCode?: string;
  countryCode: string;
  cityName?: string;
  stateCode?: string;
  postalBox?: string;
  text?: string;
  state?: string;
};

type AirportLocation = {
  name?: string;
  address: LocationAddress;
};

type FlightDetails = {
  localDateTime: string;
  iataCode?: string;
  terminal?: string;
};

type FlightOperationDetails = {
  carrier: {
    name: string;
  };
};

type FlightCraftDetails = {
  aircraftType: string;
  aircraftDescription?: string;
};

type Meal = {
  code: string;
  description: string;
};

type Baggages = {
  quantity: number;
  weight: {
    amount: string;
  };
};

type Seat = {
  number: string;
  cabin: string;
};

type FlightSeat = Seat & {
  associationRefs: {
    id: string;
    type: string;
  };
};

interface Air {
  confirmationNumber?: string;
  baggages?: Baggages;
  meal?: Meal;
  departureAirportLocation?: AirportLocation;
  arrivalAirportLocation?: AirportLocation;
  departure: FlightDetails;
  arrival: FlightDetails;
  operating?: FlightOperationDetails;
  aircraft?: FlightCraftDetails;
  seats?: FlightSeat[];
}

interface Hotel {
  confirmationNumber: string;
  checkInDate: string;
  checkOutDate: string;
  roomQuantity: number;
  contact?: {
    phone: string;
  };
  address: LocationAddress;
  amenities?: string[];
  name: string;
  description?: {
    text: string;
  };
  policies?: {
    cancellation?: {
      description?: {
        text: string;
      };
    };
  };
  guests?: {
    // number of adults (1-9) per room
    adults?: number;
    /* 
      Comma separated list of ages of each child
      at the time of check-out from the hotel. If 
      several children have the same age, the ages
      will be repeated. 
    */
    childAge?: number[];
  };
  room?: {
    /*
      pattern: ^[A-Z0-9*]{3}$
      Room type code, 3 character identifier of the room.
      The first character identifies the room type category.
      The second numeric character identifies the number
      of beds. The third character identifies the bed type.
      There is a special case where ROH is returned, this
      value stands for Run Of House.
    */
    type?: string;
    typeEstimated?: {
      category?: string;
      beds?: number;
      bedType?: string;
    };
  };
}

type RentalCarLocation = {
  localDateTime: string;
  location: {
    iaCode: string;
    address: LocationAddress;
  };
};

type IntlPhoneNumber = {
  category: string;
  countryCode: string;
  number: string;
};

interface Car {
  confirmationNumber: string;
  serviceProviderName: string;
  associatedEquipments?: {
    name: string;
  }[];
  pickUp: RentalCarLocation;
  dropOff: RentalCarLocation;
  driver?: {
    contacts: {
      phone: IntlPhoneNumber;
    }[];
  };
  vehicle: {
    acrissCode: string;
    model: string;
    doors?: number;
  };
}

type LocationDeparture = {
  subType: string;
  name: string;
  iataCode: string;
};
interface Train {
  ["confirmNbr" | "confirmationNumber"]: string;
  serviceProviderName: string;
  bookingClass?: string;
  departure: LocationDeparture;
  departureDateTime: string;
  arrivalDateTime: string;
  arrival: LocationDeparture;
  duration?: string;
  departureTrack?: string;
  arrivalTrack?: string;
  seats: Seat[];
  vehicle: {
    vehicleType?: string;
    code: string;
    number?: string;
    displayName: string;
  };
}

interface Product {
  air?: Air;
  hotel?: Hotel;
  car?: Car;
  train?: Train;
}
[];

interface Stakeholder {
  name: {
    firstName: string;
    lastName: string;
  };
}

interface AmadeusTrip {
  title: string;
  description?: string;
  stakeholders: Stakeholder[];
  products: Product[];
  price?: {
    currency: string;
    total: string;
    base: string;
    totalTaxes: string;
  };
  creationDateTime?: string;
}

interface LocationCitySearchResponse {
  meta: Meta;
  data: LocationCity[];
}

interface LocationCityDetailsResponse {
  meta: Meta;
  data: LocationCity;
}

interface Meta {
  count: number;
  links: Links;
}

interface Links {
  self: string;
}

interface LocationCity {
  type: string;
  subType: string;
  name: string;
  detailedName: string;
  id: string;
  self: Self;
  timeZoneOffset: string;
  iataCode: string;
  geoCode: GeoCode;
  address: LocationAddress;
  analytics: LocationAnalytics;
}

interface Self {
  href: string;
  methods: string[];
}

interface GeoCode {
  latitude: number;
  longitude: number;
}

interface LocationAddress {
  cityName: string;
  cityCode: string;
  countryName: string;
  countryCode: string;
  regionCode: string;
}

interface LocationAnalytics {
  travelers: Travelers;
}

interface Travelers {
  score: number;
}

export interface Airports {
  CDG: Cdg;
  ORY: Ory;
}

export interface Cdg {
  name: string;
  iataCode: string;
  subType: string;
}

export interface Ory {
  name: string;
  iataCode: string;
  subType: string;
}
