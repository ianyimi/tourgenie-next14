"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { type ReactNode } from "react";

const fadeInOut: Variants = {
  initial: {
    opacity: 0,
    pointerEvents: "none",
  },
  animate: {
    opacity: 1,
    pointerEvents: "all",
  },
  exit: {
    opacity: 0,
    pointerEvents: "none",
  },
};

const transition: HTMLMotionProps<"div">["transition"] = {
  duration: 0.2,
  staggerChildren: 0.1,
};

export default function PageFadeInOut(
  props: { children: ReactNode } & HTMLMotionProps<"div">,
) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeInOut}
      transition={transition}
      {...props}
    >
      {props.children}
    </motion.div>
  );
}
