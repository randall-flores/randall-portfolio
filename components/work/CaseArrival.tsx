"use client";

import { useEffect, useRef } from "react";
import { ARRIVAL_KEY } from "@/components/work/OrbitCarousel";

// Arriving at a case study from the carousel plays the site's entry portal —
// the same markup, the same CSS, the same timing. Not a second transition that
// resembles it, the actual one. Opening a project should feel like arriving at
// the site, because that is what it is.
//
// It only plays when the carousel set the flag, so a visitor from search or a
// shared link never sees it. The element is display:none until then, which is
// why this drives the DOM directly rather than holding React state: nothing
// re-renders, and a cold visit pays nothing for a transition it is not having.
export function CaseArrival() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let flagged = false;
    try {
      flagged = sessionStorage.getItem(ARRIVAL_KEY) === "1";
      if (flagged) sessionStorage.removeItem(ARRIVAL_KEY);
    } catch {
      /* private mode — no arrival, no harm */
    }
    if (!flagged) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.dataset.arriving = "1";
    // matches the portal animation length in globals.css
    const t = window.setTimeout(() => {
      el.dataset.arriving = "0";
    }, 1600);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div
      ref={ref}
      className="portal portal-arrival"
      data-arriving="0"
      aria-hidden="true"
    >
      <div className="portal-flash" />
      <div className="portal-mask" />
      <div className="portal-ring" />
    </div>
  );
}
