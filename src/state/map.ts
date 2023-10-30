import type React from "react";
import { observable } from "@legendapp/state";
import { type MapRef } from "react-map-gl";

export type ViewState = {
  longitude: number;
  latitude: number;
  zoom: number;
};

export type FocusedLocation = {
  name: string;
} & ViewState;

interface MapState {
  cycleDestinations: boolean;
  mapRef: React.RefObject<MapRef> | undefined;
  mapLoaded: boolean;
  allowDragControls: boolean;
  viewState: ViewState;
  focusedLocation: FocusedLocation;
  updateFocusedLocation: (props: FocusedLocation) => void;
}

const LOCATION_TRANSITION_DURATION = 7000;

export const mapState$ = observable<MapState>({
  cycleDestinations: false,
  mapLoaded: false,
  mapRef: undefined,
  allowDragControls: true,
  viewState: {
    longitude: -122.41669,
    latitude: 37.7853,
    zoom: 1.75,
  },
  focusedLocation: {
    longitude: -122.41669,
    latitude: 37.7853,
    zoom: 1.75,
    name: "San Francisco",
  },
  updateFocusedLocation: (props: FocusedLocation) => {
    mapState$.focusedLocation.set(props);
    if (!mapState$.mapRef.get()) return;
    mapState$.mapRef.get()?.current?.flyTo({
      center: [props.longitude, props.latitude],
      zoom: props.zoom,
      duration: LOCATION_TRANSITION_DURATION,
      essential: true,
    });
  },
});
