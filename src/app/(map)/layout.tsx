"use client";

import dynamic from "next/dynamic";
import { MapProvider } from "react-map-gl";

const InteractiveMap = dynamic(
  () => import("~/app/_components/InteractiveMap"),
  {
    ssr: false,
  },
);

export default function MapLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <InteractiveMap />
      <MapProvider>{children}</MapProvider>
    </section>
  );
}
