"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// Reveal-on-scroll primitive. One source of truth for entrance motion across
// the site (don't re-implement per page). Renders an already-visible default
// for reduced-motion users instead of gating content behind a transition.
type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function Reveal({ children, className, delay = 0, y = 22 }: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      // data-reveal lets the <noscript> rule in the root layout force this
      // visible when JS is off (the SSR inline opacity: 0 would otherwise
      // hide content forever).
      data-reveal=""
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
