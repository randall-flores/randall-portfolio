"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import type { Shot } from "@/lib/projects";

// The case-study hero: captioned screenshots the reader pages through.
// Manual navigation only (no autoplay), so reduced-motion needs nothing
// special — the crossfade is a single opacity transition and the slide
// never moves. All slides render up front; non-active ones are lazy,
// hidden from AT, and revealed by class so paging is instant.
type Props = {
  title: string;
  shots: Shot[];
  dark?: boolean; // hairline border for near-black media on the near-black page
};

export function CaseGallery({ title, shots, dark }: Props) {
  const [index, setIndex] = useState(0);
  const go = useCallback(
    (dir: number) =>
      setIndex((i) => (i + dir + shots.length) % shots.length),
    [shots.length],
  );

  return (
    <figure
      className={dark ? "cg dark" : "cg"}
      aria-roledescription="carousel"
      aria-label={`${title} screens`}
    >
      <div className="cg-frame">
        {shots.map((s, i) => (
          <Image
            key={s.src}
            src={s.src}
            alt={s.alt}
            fill
            sizes="(max-width: 1099px) 94vw, 1040px"
            priority={i === 0}
            className={i === index ? "cg-img is-on" : "cg-img"}
            aria-hidden={i !== index}
          />
        ))}
      </div>
      <figcaption className="cg-bar">
        <span className="cg-cap" aria-live="polite">
          {shots[index].caption}
        </span>
        {shots.length > 1 ? (
          <span className="cg-nav">
            <span className="cg-count">
              {index + 1} / {shots.length}
            </span>
            <button
              type="button"
              className="cg-btn"
              onClick={() => go(-1)}
              aria-label="Previous screen"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              className="cg-btn"
              onClick={() => go(1)}
              aria-label="Next screen"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}
