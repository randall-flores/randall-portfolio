"use client";

import { useEffect, useRef } from "react";

// Custom cursor: a small dot that tracks 1:1 and a lerped ring that grows and
// shows a context label for elements carrying `data-cursor`. Fine pointers
// only — hidden on touch and for reduced-motion users (CSS + the early return
// here). Mounted once globally in the root layout.
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const lblRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const lbl = lblRef.current;
    if (!dot || !ring || !lbl) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    document.body.style.cursor = "none";

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      raf = requestAnimationFrame(loop);
    };

    const over = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest<HTMLElement>(
        "a, button, [data-cursor]",
      );
      if (!el) return;
      const label = el.getAttribute("data-cursor");
      if (label) {
        lbl.textContent = label;
        ring.classList.add("lg");
        ring.classList.remove("sm");
      } else {
        ring.classList.add("sm");
        ring.classList.remove("lg");
      }
    };

    const out = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest("a, button, [data-cursor]");
      if (el) ring.classList.remove("lg", "sm");
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    loop();

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      cancelAnimationFrame(raf);
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cur" aria-hidden="true" />
      <div ref={ringRef} className="cur-ring" aria-hidden="true">
        <span ref={lblRef} className="lbl" />
      </div>
    </>
  );
}
