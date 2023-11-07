"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <InteractiveMap />
      <MapProvider>
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            key={pathname}
            layout
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </MapProvider>
    </section>
  );
}
