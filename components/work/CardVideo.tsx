"use client";

import { useEffect, useRef } from "react";

// Preview video that lives inside a Work card's .p-visual media area. The poster
// is the resting state, so initial load stays light (preload="none", no
// autoplay). Playback is opt-in:
//   - Fine pointer (desktop): play on card hover, pause + reset on leave.
//   - Coarse pointer (touch): play while the card is in view (Intersection
//     observer), pause + reset when it scrolls away.
//   - prefers-reduced-motion: never play. The poster is all the user sees.
// webm is listed first so capable browsers pick the lighter file over the mp4.
type Props = {
  slug: string;
  poster: string;
  dark?: boolean; // hairline border for near-black media on the near-black page
};

export function CardVideo({ slug, poster, dark }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const play = () => {
      void video.play().catch(() => {});
    };
    const reset = () => {
      video.pause();
      video.currentTime = 0;
    };

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (fine) {
      const card = video.closest(".project");
      if (!card) return;
      card.addEventListener("mouseenter", play);
      card.addEventListener("mouseleave", reset);
      return () => {
        card.removeEventListener("mouseenter", play);
        card.removeEventListener("mouseleave", reset);
      };
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else reset();
      },
      { threshold: 0.5 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={dark ? "p-video dark" : "p-video"}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    >
      <source src={`/cards/${slug}.webm`} type="video/webm" />
      <source src={`/cards/${slug}.mp4`} type="video/mp4" />
    </video>
  );
}
