export type Hotel = {
  name: string;
  address: string;
  checkInDate: number;
  checkOutDate: number;
  latitude: number;
  longitude: number;
};

export type Activity = {
  name: string;
  type: string;
  address: string;
  description?: string;
  startTime: number;
  endTime: number;
  latitude: number;
  longitude: number;
};

export type TransportationRoute = {
  id: string;
  name: string;
  departureTime: number;
  departureLocationId: number;
  departureLocation: string;
  departureLatitude: number;
  departureLongitude: number;
  arrivalTime: number;
  arrivalLocationId: number;
  arrivalLocation: string;
  arrivalLatitude: number;
  arrivalLongitude: number;
};

export type DailyAgenda = {
  date: number;
  activities: Activity[];
  routes: TransportationRoute[];
};

export type Destination = {
  name: string;
  iataCode: string;
  countryName: string;
  countryCode: string;
  arrivalDate: number;
  departureDate: number;
  hotel: Hotel;
  transportation: string;
  intinerary: DailyAgenda[];
};

export type DestinationSummary = Pick<
  Destination,
  "name" | "countryName" | "arrivalDate" | "departureDate"
>;

export interface Trip {
  id: string;
  userId: string;
  name: string;
  summary: DestinationSummary[];
  itinerary: Destination[];
}
