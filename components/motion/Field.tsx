"use client";

import { useEffect, useRef } from "react";
import {
  createCloud,
  createNebula,
  type Cloud,
  type Nebula,
} from "@/lib/field";

// The site's background field, and the only rAF loop on the page.
//
//   nebula  — always running, reacts to cursor, scroll, hover and menu state
//   cloud   — red bokeh lights, driven by scroll: ambient floor plus a
//             velocity kick, capped below 1 so it never replaces the nebula
//   portal  — server-rendered in <Portal /> and started by CSS; this only
//             retires the element and pushes the cloud outward during it
//
// Skipped entirely for reduced motion and on touch phones, which fall back to
// the CSS gradient in globals.css (.field-fallback).

// Must match the portal animation duration in globals.css.
const PORTAL_MS = 1500;

export function Field() {
  const glRef = useRef<HTMLCanvasElement>(null);
  const cloudRef = useRef<HTMLCanvasElement>(null);
  const washRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touchPhone =
      window.matchMedia("(pointer: coarse)").matches && window.innerWidth < 900;

    const glCanvas = glRef.current;
    const cloudCanvas = cloudRef.current;
    const wash = washRef.current;
    if (!glCanvas || !cloudCanvas || !wash) return;

    let nebula: Nebula | null = null;
    if (!touchPhone) nebula = createNebula(glCanvas);
    if (!nebula) root.classList.add("no-field");

    // The cloud is the expensive half. It is not created during load at all:
    // it is built on an idle callback after `load`, or on the first scroll,
    // whichever comes first. Nothing it does can land inside the LCP window.
    let cloud: Cloud | null = null;
    let cloudRequested = false;
    const ensureCloud = () => {
      if (cloudRequested || touchPhone || reduced) return;
      cloudRequested = true;
      cloud = createCloud(cloudCanvas);
      cloud?.resize();
      cloud?.rebuild();
    };

    // ---- state ------------------------------------------------------------
    const state = {
      mx: 0.5,
      my: 0.5,
      scroll: 0,
      bloomX: 0.5,
      bloomY: 0.5,
      bloomZ: 0,
      waveX: 0.5,
      waveY: 0.5,
      waveZ: 0,
      calm: 0,
    };
    const target = {
      mx: 0.5,
      my: 0.5,
      scroll: 0,
      bloomX: 0.5,
      bloomY: 0.5,
      bloomZ: 0,
      calm: 0,
    };

    let scale = 1;
    let frames = 0;
    let accum = 0;
    let lastFrame = 0;
    let running = false;
    let raf = 0;
    const start = performance.now();

    let cloudLevel = 0;
    let rush = 0;
    let velocity = 0;
    let velocitySmooth = 0;
    let lastScrollY = window.scrollY;

    const resize = () => {
      nebula?.resize(scale);
      cloud?.resize();
      cloud?.rebuild();
    };

    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    };
    const idle = (cb: () => void) => {
      const w = window as IdleWindow;
      if (w.requestIdleCallback) w.requestIdleCallback(cb, { timeout: 2000 });
      else window.setTimeout(cb, 600);
    };
    const afterLoad = (cb: () => void) => {
      if (document.readyState === "complete") idle(cb);
      else window.addEventListener("load", () => idle(cb), { once: true });
    };

    // Ambient floor rises early and holds across the body of the page; the
    // velocity kick is what makes it feel alive. Capped below 1 on purpose —
    // the cloud visits the nebula, it never replaces it.
    const cloudTarget = () => {
      const doc = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const progress = window.scrollY / doc;
      const band =
        Math.min(1, Math.max(0, (progress - 0.02) / 0.16)) *
        Math.min(1, Math.max(0, (1.02 - progress) / 0.16));
      const kick = Math.min(1, Math.abs(velocitySmooth) / 30) * 0.52;
      return Math.min(0.88, band * 0.58 + kick);
    };

    const frame = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      const dt = lastFrame ? Math.min(50, now - lastFrame) : 16;
      lastFrame = now;

      velocitySmooth += (velocity - velocitySmooth) * 0.16;
      velocity *= 0.82;

      state.mx += (target.mx - state.mx) * 0.06;
      state.my += (target.my - state.my) * 0.06;
      state.scroll += (target.scroll - state.scroll) * 0.05;
      state.bloomX += (target.bloomX - state.bloomX) * 0.1;
      state.bloomY += (target.bloomY - state.bloomY) * 0.1;
      state.bloomZ += (target.bloomZ - state.bloomZ) * 0.09;
      state.calm += (target.calm - state.calm) * 0.1;
      state.waveZ = state.waveZ > 0.001 ? state.waveZ * 0.965 : 0;

      nebula?.draw(state, (now - start) / 1000);

      if (cloud) {
        rush = rush > 0.0015 ? rush * 0.955 : 0;
        const want = Math.max(cloudTarget(), rush * 0.95);
        // Rises quickly, falls away slowly, so it lingers after you stop.
        cloudLevel += (want - cloudLevel) * (want > cloudLevel ? 0.14 : 0.035);
        if (cloudLevel > 0.006) {
          if (cloudCanvas.style.display !== "block") {
            cloudCanvas.style.display = "block";
            wash.style.display = "block";
          }
          cloud.draw(dt, cloudLevel, velocitySmooth, rush);
          cloudCanvas.style.opacity = String(Math.min(0.94, cloudLevel * 1.3));
          wash.style.opacity = String(cloudLevel * 0.5);
        } else if (cloudCanvas.style.display !== "none") {
          // Hidden rather than transparent: a screen-blended fixed canvas costs
          // a full-viewport composite on every scroll even at opacity 0.
          cloud.clear();
          cloudCanvas.style.opacity = "0";
          cloudCanvas.style.display = "none";
          wash.style.opacity = "0";
          wash.style.display = "none";
        }
      }

      // Adaptive quality: only step the buffer down if the GPU genuinely
      // cannot hold ~50fps. Never pre-emptively degrade.
      accum += dt;
      frames++;
      if (frames >= 45) {
        const avg = accum / frames;
        frames = 0;
        accum = 0;
        if (nebula) {
          if (avg > 21 && scale > 0.6) {
            scale = Math.max(0.6, scale - 0.2);
            nebula.resize(scale);
          } else if (avg < 13.5 && scale < 1) {
            scale = Math.min(1, scale + 0.2);
            nebula.resize(scale);
          }
        }
      }
    };

    const play = () => {
      if (running || reduced) return;
      running = true;
      lastFrame = 0;
      raf = requestAnimationFrame(frame);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();

    if (reduced) {
      nebula?.draw(state, 8);
      root.classList.add("no-portal");
    } else {
      play();
    }

    // ---- input ------------------------------------------------------------
    const onPointerMove = (e: PointerEvent) => {
      target.mx = e.clientX / window.innerWidth;
      target.my = 1 - e.clientY / window.innerHeight;
    };
    const onScroll = () => {
      ensureCloud();
      velocity = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      target.scroll = Math.min(1.5, window.scrollY / Math.max(1, window.innerHeight));
    };
    const onPointerDown = (e: PointerEvent) => {
      if ((e.target as Element | null)?.closest?.("[data-field-ignore]")) return;
      state.waveX = e.clientX / window.innerWidth;
      state.waveY = 1 - e.clientY / window.innerHeight;
      state.waveZ = 1;
    };

    // The field blooms under whatever you are pointing at. Delegated so no
    // component has to opt in.
    const bloomAt = (el: Element) => {
      const r = el.getBoundingClientRect();
      target.bloomX = (r.left + r.width / 2) / window.innerWidth;
      target.bloomY = 1 - (r.top + r.height / 2) / window.innerHeight;
      target.bloomZ = 1;
    };
    const interactive = (e: Event) =>
      (e.target as Element | null)?.closest?.("a[href], button");
    const onOver = (e: Event) => {
      const el = interactive(e);
      if (el) bloomAt(el);
    };
    const onOut = (e: Event) => {
      if (interactive(e)) target.bloomZ = 0;
    };

    const onVisibility = () => (document.hidden ? pause() : play());
    const onResize = () => {
      resize();
      if (!running) nebula?.draw(state, (performance.now() - start) / 1000);
    };
    // The mobile menu drains the colour so its overlay type stays readable.
    const onCalm = (e: Event) => {
      target.calm = (e as CustomEvent<{ on: boolean }>).detail?.on ? 1 : 0;
      if (target.calm) target.bloomZ = 0;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    document.addEventListener("focusin", onOver, { passive: true });
    document.addEventListener("focusout", onOut, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("field:calm", onCalm);

    // ---- portal -----------------------------------------------------------
    // CSS already started it in the first paint. All that is left is to retire
    // the element once the animation has finished, and to push the cloud
    // outward if it happens to exist while the aperture is still opening.
    let portalTimer: number | undefined;

    if (reduced) {
      root.classList.add("portal-done");
    } else {
      const elapsed = performance.now();
      if (elapsed < PORTAL_MS) rush = 1;
      portalTimer = window.setTimeout(
        () => root.classList.add("portal-done"),
        Math.max(0, PORTAL_MS - elapsed),
      );
    }

    afterLoad(ensureCloud);

    return () => {
      pause();
      window.clearTimeout(portalTimer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("focusin", onOver);
      document.removeEventListener("focusout", onOut);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("field:calm", onCalm);
      nebula?.dispose();
    };
  }, []);

  return (
    <>
      <canvas ref={glRef} className="field-gl" aria-hidden="true" />
      <canvas ref={cloudRef} className="field-cloud" aria-hidden="true" />
      <div ref={washRef} className="field-wash" aria-hidden="true" />
      <div className="field-fallback" aria-hidden="true" />
    </>
  );
}
