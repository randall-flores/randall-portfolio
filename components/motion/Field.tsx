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
const FRAME_MS = 1000 / 30;

// The red cloud's presence. Grouped here because this is the one part of the
// field that is a taste judgement rather than a performance one — everything
// else in this file is tuned by measurement, these are tuned by eye.
const CLOUD = {
  // Ambient level once you are properly into the page.
  floor: 0.62,
  // How far the ramps run. Each is the smaller of a viewport measure and a
  // fraction of the range the page can actually scroll.
  //
  // Viewport measures alone were the bug. They were sized for a long page, and
  // the home page only scrolls 1.34 viewports: a 0.66vh rise plus a 0.5vh
  // settle left the cloud at full strength for about 160px out of 1200. It
  // arrived and left inside the same gesture, which is what read as the red
  // disappearing too fast.
  riseVh: 0.5,
  riseRange: 0.25,
  settleVh: 0.4,
  settleRange: 0.18,
  // How far the settle is allowed to pull it down. It never leaves entirely —
  // the footer keeps an ember rather than going cold.
  settleMin: 0.7,
  // A page with nothing to scroll would otherwise never light at all. Below
  // this much scrollable range the cloud simply starts lit.
  staticRange: 0.35,
  // Extra the scroll surge adds on top of the floor.
  kick: 0.34,
  // Half-life of that surge, in seconds. This is what stops the cloud snapping
  // back the moment you stop scrolling.
  surgeHalfLife: 1.1,
  // It visits the nebula, it never replaces it.
  cap: 0.88,
  // How fast the level chases its target. Rising is quick so a flick of the
  // wheel registers; falling is very slow so the cloud lingers behind you.
  riseEase: 0.14,
  fallEase: 0.013,
};

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
      // The nebula normally starts the loop; without WebGL the cloud must.
      play();
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
    let surge = 0;
    let rush = 0;
    let velocity = 0;
    let velocitySmooth = 0;
    let lastScrollY = window.scrollY;

    // Writing canvas.width wipes the drawing buffer — that is the spec, not a
    // quirk — and this context is alpha:false, so a wiped buffer composites as
    // opaque black. Resizing and then waiting for the next frame to redraw
    // therefore ships one entirely black frame: a visible blink. The adaptive
    // quality below steps the buffer down four times on a slow machine, which
    // is where the four blinks on load came from. So every resize redraws
    // immediately, in the same task, before anything is composited.
    const sizeNebula = (s: number) => {
      if (!nebula) return;
      nebula.resize(s);
      nebula.draw(state, (performance.now() - start) / 1000);
    };

    const resize = () => {
      sizeNebula(scale);
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
    // surge on top is what makes it feel alive. Capped below 1 on purpose —
    // the cloud visits the nebula, it never replaces it.
    //
    // Both ramps are bounded by the scrollable range as well as by the
    // viewport, so a short page gets a short rise and a short settle instead of
    // spending its entire length ramping. See the note on CLOUD above.
    //
    // The settle at the end is partial. Easing it to nothing meant the cloud
    // was at its weakest exactly where the page asks you to stay — the footer.
    const cloudTarget = () => {
      const vh = Math.max(1, window.innerHeight);
      const range = Math.max(0, document.body.scrollHeight - vh);
      if (range < vh * CLOUD.staticRange) {
        return Math.min(CLOUD.cap, CLOUD.floor + surge);
      }

      const y = window.scrollY;
      const riseOver = Math.max(
        1,
        Math.min(vh * CLOUD.riseVh, range * CLOUD.riseRange),
      );
      const settleOver = Math.max(
        1,
        Math.min(vh * CLOUD.settleVh, range * CLOUD.settleRange),
      );
      const risen = Math.min(1, y / riseOver);
      const settling =
        CLOUD.settleMin +
        (1 - CLOUD.settleMin) *
          Math.min(1, Math.max(0, range - y) / settleOver);
      return Math.min(CLOUD.cap, risen * settling * CLOUD.floor + surge);
    };

    const frame = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      // 30fps. The field drifts slowly enough that this is invisible, and it
      // halves the work whether the GPU or the CPU ends up doing it.
      if (now - lastFrame < FRAME_MS) return;
      const dt = lastFrame ? Math.min(50, now - lastFrame) : 16;
      lastFrame = now;

      // Every smoothing constant below was written per-frame at 60fps. With
      // the 30fps cap that would halve every response, so they are converted
      // to the equivalent for this frame's actual duration — the field now
      // feels identical whatever rate it ends up running at.
      const steps = dt / 16.667;
      const ease = (k: number) => 1 - Math.pow(1 - k, steps);
      const decay = (k: number) => Math.pow(k, steps);

      velocitySmooth += (velocity - velocitySmooth) * ease(0.16);
      velocity *= decay(0.82);

      state.mx += (target.mx - state.mx) * ease(0.06);
      state.my += (target.my - state.my) * ease(0.06);
      state.scroll += (target.scroll - state.scroll) * ease(0.05);
      state.bloomX += (target.bloomX - state.bloomX) * ease(0.1);
      state.bloomY += (target.bloomY - state.bloomY) * ease(0.1);
      state.bloomZ += (target.bloomZ - state.bloomZ) * ease(0.09);
      state.calm += (target.calm - state.calm) * ease(0.1);
      state.waveZ = state.waveZ > 0.001 ? state.waveZ * decay(0.965) : 0;

      nebula?.draw(state, (now - start) / 1000);

      if (cloud) {
        rush = rush > 0.0015 ? rush * decay(0.955) : 0;

        // Scroll velocity dies within a few frames, so a surge read straight
        // off it vanished the moment you stopped — the cloud arrived and left
        // in the same gesture. This holds the peak and lets it fall on its own
        // clock instead, measured in seconds.
        const kick = Math.min(1, Math.abs(velocitySmooth) / 30) * CLOUD.kick;
        const surgeDecay = Math.pow(0.5, dt / (CLOUD.surgeHalfLife * 1000));
        surge = Math.max(kick, surge * surgeDecay);

        const want = Math.max(cloudTarget(), rush * 0.95);
        // Rises quickly, falls away slowly, so it lingers after you stop.
        cloudLevel +=
          (want - cloudLevel) *
          ease(want > cloudLevel ? CLOUD.riseEase : CLOUD.fallEase);
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

      // Adaptive quality, targeting the 30fps cap: step the buffer down when
      // frames are late, back up when there is headroom, and give up entirely
      // if the lowest setting still cannot hold it.
      accum += dt;
      frames++;
      if (frames >= 30) {
        const avg = accum / frames;
        frames = 0;
        accum = 0;
        // Step the buffer down when frames are late and back up when there is
        // headroom, and stop there. An earlier version tore the field down
        // entirely when it could not hold the rate — which meant the whole
        // design vanished a few seconds after load on any page busy enough to
        // miss a few frames. A slightly softer field beats no field.
        if (nebula) {
          if (avg > 42 && scale > 0.5) {
            scale = Math.max(0.5, scale - 0.15);
            sizeNebula(scale);
          } else if (avg < 26 && scale < 1) {
            scale = Math.min(1, scale + 0.15);
            sizeNebula(scale);
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
      // One static frame: reduced motion still gets the real field, just still.
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
    // resize() redraws as part of resizing, so a paused field stays painted.
    const onResize = () => resize();
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
