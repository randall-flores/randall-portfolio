"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Reveal-on-scroll primitive. One source of truth for entrance motion across
// the site (don't re-implement per page).
//
// No animation library: an IntersectionObserver adds one class and CSS does the
// rest. The transition is compositor-only (opacity + transform), so this costs
// nothing on the main thread once the class lands.
//
// data-reveal lets the <noscript> rule in the root layout force this visible
// when JS is off — the CSS hides it at opacity 0 until .is-in arrives.
type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function Reveal({ children, className, delay = 0, y = 22 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-in");
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      className={className}
      style={
        {
          "--reveal-y": `${y}px`,
          "--reveal-delay": `${delay}s`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
