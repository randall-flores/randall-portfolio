"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { projects } from "@/lib/projects";

// The home page's work index: five project stills on a ring you turn. The card
// is the image and nothing else — the name sits under the ring, so the work is
// what you look at rather than five miniature layouts.
//
// Selecting one closes an aperture over the card and navigates to the real
// /work/[slug] route, where the site's entry portal opens back up. Deep links,
// the back button and search all keep working.
//
// The wheel is deliberately not captured: turning the ring on scroll fights the
// page's own scrolling, and it is not discoverable enough to be worth that.

const SECTOR = 360 / projects.length;
const EXIT_MS = 300;
/** Read once on the case study so it can play the portal on arrival. */
export const ARRIVAL_KEY = "orbit:arriving";

export function OrbitCarousel() {
  const router = useRouter();
  const ringRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [active, setActive] = useState(0);
  const [wide, setWide] = useState(true);
  const [leaving, setLeaving] = useState(false);

  const angle = useRef(0);
  const target = useRef(0);
  const activeRef = useRef(0);
  const dragged = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!wide) return;
    const ring = ringRef.current;
    if (!ring) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const radius = Math.max(300, Math.min(430, window.innerWidth * 0.28));
    let raf = 0;

    const layout = () => {
      const cards = cardRefs.current;
      for (let i = 0; i < cards.length; i++) {
        const el = cards[i];
        if (!el) continue;
        const a = i * SECTOR + angle.current;
        const z = Math.cos((a * Math.PI) / 180);
        el.style.transform =
          `rotateY(${a}deg) translateZ(${radius}px) rotateY(${-a}deg) scale(${(0.78 + 0.22 * (z * 0.5 + 0.5)).toFixed(3)})`;
        el.style.opacity = (0.2 + 0.8 * Math.max(0, z)).toFixed(3);
        el.style.zIndex = String(Math.round(100 + z * 100));
        el.style.pointerEvents = z > 0.55 ? "auto" : "none";
      }
      const idx =
        ((Math.round(-angle.current / SECTOR) % projects.length) + projects.length) % projects.length;
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
      ring.style.transform = `translateZ(-${radius}px)`;
    };

    if (reduced) {
      layout();
      return;
    }
    const loop = () => {
      raf = requestAnimationFrame(loop);
      angle.current += (target.current - angle.current) * 0.09;
      layout();
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [wide]);

  const goTo = useCallback(
    (i: number) => {
      if (wide) target.current = -i * SECTOR;
      else {
        activeRef.current = i;
        setActive(i);
      }
    },
    [wide],
  );

  const step = useCallback(
    (dir: number) => {
      if (wide) target.current -= dir * SECTOR;
      else {
        const next = (activeRef.current + dir + projects.length) % projects.length;
        activeRef.current = next;
        setActive(next);
      }
    },
    [wide],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let dragging = false;
    let startX = 0;
    let startT = 0;
    let moved = 0;

    const down = (e: PointerEvent) => {
      dragging = true;
      startX = e.clientX;
      startT = target.current;
      moved = 0;
      dragged.current = false;
      stage.dataset.grabbing = "1";
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      moved = Math.abs(e.clientX - startX);
      if (moved > 6) dragged.current = true;
      if (wide) target.current = startT + (e.clientX - startX) * 0.32;
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      stage.dataset.grabbing = "0";
      if (wide) target.current = Math.round(target.current / SECTOR) * SECTOR;
      else if (moved > 40) step(e.clientX < startX ? 1 : -1);
    };

    stage.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      stage.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [wide, step]);

  const open = useCallback(
    (index: number) => {
      if (dragged.current) return;
      const project = projects[index];
      const el = cardRefs.current[index] ?? stageRef.current;
      if (!el || !project) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(`/work/${project.slug}`);
        return;
      }
      const r = el.getBoundingClientRect();
      const root = document.documentElement;
      root.style.setProperty("--ap-x", `${((r.left + r.width / 2) / window.innerWidth) * 100}%`);
      root.style.setProperty("--ap-y", `${((r.top + r.height / 2) / window.innerHeight) * 100}%`);
      try {
        sessionStorage.setItem(ARRIVAL_KEY, "1");
      } catch {
        /* private mode — the case study just loads normally */
      }
      setLeaving(true);
      window.setTimeout(() => router.push(`/work/${project.slug}`), EXIT_MS);
    },
    [router],
  );

  useEffect(() => {
    const p = projects[active];
    if (p) router.prefetch(`/work/${p.slug}`);
  }, [active, router]);

  const current = projects[active];
  const flag =
    current.status === "confidential"
      ? "Confidential"
      : current.status === "anonymized"
        ? "Anonymized"
        : null;

  return (
    <div
      className="orbit"
      ref={stageRef}
      role="group"
      aria-roledescription="carousel"
      aria-label="Selected work"
      tabIndex={-1}
      onKeyDown={onKeyDown}
    >
      <div className="orbit-stage">
        <div className="orbit-ring" ref={ringRef}>
          {projects.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`orbit-card${i === active ? " is-active" : ""}`}
              aria-label={`${p.title} — ${p.category}. Open case study.`}
              aria-hidden={!wide && i !== active}
              tabIndex={!wide && i !== active ? -1 : 0}
              onFocus={() => goTo(i)}
              onClick={() => {
                if (i !== active) {
                  goTo(i);
                  return;
                }
                open(i);
              }}
            >
              <Image
                src={`/cards/${p.slug}-poster.jpg`}
                alt=""
                fill
                sizes="(max-width: 899px) 88vw, 400px"
                className="orbit-img"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="orbit-readout">
        <h3 key={current.slug} className="orbit-title">
          {current.title}
        </h3>
        <p key={`${current.slug}-m`} className="orbit-meta font-mono">
          {current.category}
          <span aria-hidden="true"> · </span>
          {current.live ? (
            <>
              <i className="orbit-dot" aria-hidden="true" />
              Live<span aria-hidden="true"> · </span>
            </>
          ) : null}
          {flag ? (
            <>
              {flag}
              <span aria-hidden="true"> · </span>
            </>
          ) : null}
          {current.year}
        </p>
      </div>

      <div className="orbit-controls">
        <button
          type="button"
          className="orbit-arrow"
          onClick={() => step(-1)}
          aria-label="Previous project"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          className="orbit-arrow"
          onClick={() => step(1)}
          aria-label="Next project"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {leaving ? <div className="orbit-aperture" aria-hidden="true" /> : null}

      <noscript>
        <style>{`.orbit-stage,.orbit-readout,.orbit-controls{display:none!important}.orbit-fallback{display:block!important}`}</style>
      </noscript>
      <ul className="orbit-fallback">
        {projects.map((p) => (
          <li key={p.slug}>
            <a href={`/work/${p.slug}`}>
              <span className="orbit-fallback-title">{p.title}</span>
              <span className="font-mono">
                {p.category} · {p.year}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
