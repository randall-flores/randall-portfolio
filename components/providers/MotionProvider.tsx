"use client";

import { LazyMotion } from "framer-motion";

// Loads framer-motion's animation features asynchronously. Components use the
// lightweight <m.*> primitives (Reveal, Magnetic, WorkList); the feature code
// arrives in its own chunk after first paint. `strict` throws if anyone
// imports the full <motion.*> again and silently re-bloats the main bundle.
const loadFeatures = () =>
  import("@/lib/motion-features").then((mod) => mod.default);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
