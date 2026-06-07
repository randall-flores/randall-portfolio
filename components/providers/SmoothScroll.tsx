"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";

// Smooth-scroll provider. Wraps the page and drives window scroll through
// Lenis. Disabled for users who ask for reduced motion — they get native,
// instant scrolling instead.
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.1, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
