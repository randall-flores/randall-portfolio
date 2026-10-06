"use client";

import Image from "next/image";
import { useRef, useState } from "react";

// The case-study trailer: a 20-second cut of the live product, shown as its
// title-card poster until the reader asks for it. Nothing but the poster
// loads up front (preload="none", and the <video> isn't even mounted), so
// the page pays for the clip only on click. It plays with sound and native
// controls; there is no autoplay, so reduced-motion needs nothing extra.
// Assets are always /trailers/{slug}.mp4 + {slug}.webp.
type Props = {
  slug: string;
  title: string;
  description: string; // what the trailer shows, for screen readers
  duration: string; // display length, e.g. "0:21"
};

export function CaseTrailer({ slug, title, description, duration }: Props) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <figure className="ct" aria-label={`${title} trailer`}>
      <div className="ct-frame">
        {playing ? (
          <video
            ref={videoRef}
            className="ct-video"
            src={`/trailers/${slug}.mp4`}
            poster={`/trailers/${slug}.webp`}
            controls
            autoPlay
            playsInline
            preload="none"
            aria-label={`${title} trailer: ${description}`}
            onPlay={() => videoRef.current?.focus()}
          />
        ) : (
          <button
            type="button"
            className="ct-poster"
            onClick={() => setPlaying(true)}
            aria-label={`Play the ${title} trailer, ${duration}, with sound`}
          >
            <Image
              src={`/trailers/${slug}.webp`}
              alt=""
              fill
              sizes="(max-width: 1099px) 94vw, 1040px"
              priority
              className="ct-img"
            />
            <span className="ct-play" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M8 5.5v13l10.5-6.5L8 5.5z" fill="currentColor" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <figcaption className="cg-bar">
        <span className="cg-cap">Trailer</span>
        <span className="cg-count">{duration}</span>
      </figcaption>
    </figure>
  );
}
