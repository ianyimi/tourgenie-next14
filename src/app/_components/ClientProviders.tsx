// app/providers.jsx

"use client";

import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useRef } from "react";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const context = useContext(LayoutRouterContext);
  const frozen = useRef(context).current;
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AnimatePresence mode="wait">
        {/**
         * We use `motion.div` as the first child of `<AnimatePresence />` Component so we can specify page animations at the page level.
         * The `motion.div` Component gets re-evaluated when the `key` prop updates, triggering the animation's lifecycles.
         * During this re-evaluation, the `<FrozenRoute />` Component also gets updated with the new route components.
         */}
        <motion.div key={pathname}>
          <LayoutRouterContext.Provider value={frozen}>
            {children}
          </LayoutRouterContext.Provider>
        </motion.div>
      </AnimatePresence>
    </ThemeProvider>
  );
}
