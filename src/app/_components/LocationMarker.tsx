/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
"use client";

import { type ReactNode } from "react";
import { type ObservableObject } from "@legendapp/state";
import type { LocationCity } from "~/types/api/amadeus";
import { mapState$, type FocusedLocation } from "~/state/map";
import { nanoid } from "nanoid";
import { motion } from "framer-motion";
import { Marker } from "react-map-gl";

import RoundIconButton from "./ui/RoundIconButton";

interface CustomMarkerProps {
  location?: ObservableObject<Location>;
  airportLocation?: ObservableObject<LocationCity>;
  icon?: ReactNode;
}

export default function LocationMarker({
  location,
  airportLocation,
  icon,
}: CustomMarkerProps) {
  if (!location && !airportLocation) return null;
  const longitude =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    airportLocation?.geoCode.longitude.get() ?? +location!.longitude.get();
  const latitude =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    airportLocation?.geoCode.latitude.get() ?? +location!.latitude.get();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const name = airportLocation?.name.get() ?? location!.name.get();
  return (
    <motion.div
      key={nanoid()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Marker
        longitude={longitude}
        latitude={latitude}
        onClick={() => {
          return mapState$.updateFocusedLocation({
            longitude: longitude,
            latitude: latitude,
            zoom: 15,
            name: name,
          } as FocusedLocation);
        }}
      >
        {icon && <RoundIconButton value={name}>{icon}</RoundIconButton>}
      </Marker>
    </motion.div>
  );
}
