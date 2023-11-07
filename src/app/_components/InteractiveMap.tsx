"use client";

import Map, {
  GeolocateControl,
  Marker,
  NavigationControl,
  type MapRef,
  type Projection,
} from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { type ObservableObject } from "@legendapp/state";
import { observer, useMount, useObserve } from "@legendapp/state/react";
import { cities } from "~/data/cities";
import { env } from "~/env.mjs";
import { mapState$ } from "~/state/map";
import { $currentPlan } from "~/state/plan";
import { nanoid } from "nanoid";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { LuHotel, LuTent, LuUtensils } from "react-icons/lu";
import { MdAttractions } from "react-icons/md";

import LocationMarker from "./LocationMarker";

const InteractiveMap = observer(() => {
  const mapRef = useRef<MapRef>(null);
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const mapLoaded = mapState$.mapLoaded.get();
  const viewState = mapState$.viewState.get();

  useMount(() => {
    mapState$.mapRef.set(mapRef);
  });

  // useObserve(mapState$.focusedLocation, ({ value }) => {
  //   if (!value || !mapLoaded || !mapRef.current || !pathname.includes("/plan"))
  //     return;
  //   console.log("focusedLocation", value);
  //   mapRef.current.flyTo({
  //     center: [value.longitude, value.latitude],
  //     zoom: value.zoom,
  //     essential: true,
  //     duration: 7000,
  //   });
  // });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: mapLoaded ? 1 : 0 }}
    >
      <Map
        {...viewState}
        mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        ref={mapRef}
        projection={{ name: "globe" }}
        onMove={(evt) => mapLoaded && mapState$.viewState.set(evt.viewState)}
        onLoad={() => mapState$.mapLoaded.set(true)}
        mapStyle={
          resolvedTheme === "dark"
            ? "mapbox://styles/ianyimi/clj9twzbr003f01pwf5r148kk"
            : "mapbox://styles/ianyimi/clm8uqxxk011001r69a3pg9vu"
        }
        style={{
          position: "absolute",
          zIndex: 0,
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        attributionControl={false}
      >
        {$currentPlan.hotels.map((hotel) => (
          <LocationMarker location={hotel} icon={<LuHotel />} key={nanoid()} />
        ))}
        {$currentPlan.attractions.map((attraction) => (
          <LocationMarker
            location={attraction}
            icon={<MdAttractions />}
            key={nanoid()}
          />
        ))}
        {$currentPlan.restaurants.map((restaurant) => (
          <LocationMarker
            location={restaurant}
            icon={<LuUtensils />}
            key={nanoid()}
          />
        ))}
        {$currentPlan.geos.map((geo) => (
          <LocationMarker location={geo} icon={<LuTent />} key={nanoid()} />
        ))}
        {$currentPlan.airports.map((airport) => (
          <LocationMarker
            airportLocation={airport}
            icon={<LuTent />}
            key={nanoid()}
          />
        ))}
        {/* <AttributionControl compact /> */}
        {/* <NavigationControl position="bottom-right" visualizePitch /> */}
        {/* <GeolocateControl
          ref={geolocateControlRef}
          position="bottom-right"
          trackUserLocation
          showUserHeading
        /> */}
      </Map>
    </motion.div>
  );
});

export default InteractiveMap;
