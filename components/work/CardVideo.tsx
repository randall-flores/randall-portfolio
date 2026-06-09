"use client";

import { useEffect, useRef } from "react";

// Preview video that fills a .p-visual media area. Two playback modes, both
// respecting prefers-reduced-motion (never play, poster only):
//   - Default (Work cards): light. preload="none", no autoplay. Fine pointer
//     plays on card hover; coarse pointer plays while the card is in view.
//   - autoplayInView (case-study hero): the video is the focus of the page, so
//     it autoplays the loop whenever it's in view regardless of pointer.
// webm is listed first so capable browsers pick the lighter file over the mp4.
type Props = {
  slug: string;
  poster: string;
  dark?: boolean; // hairline border for near-black media on the near-black page
  autoplayInView?: boolean; // play whenever in view (not just on hover)
  preload?: "none" | "metadata";
};

export function CardVideo({
  slug,
  poster,
  dark,
  autoplayInView = false,
  preload = "none",
}: Props) {
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

    // Cards on a fine pointer: hover drives playback. Everything else (touch
    // cards, and the always-autoplay hero) plays while in view.
    if (fine && !autoplayInView) {
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
  }, [autoplayInView]);

  return (
    <video
      ref={ref}
      className={dark ? "p-video dark" : "p-video"}
      poster={poster}
      muted
      loop
      playsInline
      preload={preload}
      aria-hidden="true"
    >
      <source src={`/cards/${slug}.webm`} type="video/webm" />
      <source src={`/cards/${slug}.mp4`} type="video/mp4" />
    </video>
  );
}
