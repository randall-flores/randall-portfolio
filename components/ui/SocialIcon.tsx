import type { SocialKey } from "@/lib/social";

// Inline icons rather than an icon dependency — four marks do not justify a
// package that has to be parsed on every page.
//
// GitHub, LinkedIn and Instagram use their brand geometry. Contra publishes no
// simple open mark, so it gets a neutral monogram in the same stroke weight as
// the rest of the set; drop an official SVG into public/ if they provide one.
const paths: Record<SocialKey, React.ReactNode> = {
  email: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3 7 8.13 5.42a1.6 1.6 0 0 0 1.74 0L21 7" />
    </>
  ),
  github: (
    <path d="M12 2.2a9.8 9.8 0 0 0-3.1 19.1c.49.09.67-.21.67-.47v-1.8c-2.73.59-3.3-1.16-3.3-1.16-.45-1.13-1.1-1.44-1.1-1.44-.9-.61.07-.6.07-.6 1 .07 1.52 1.02 1.52 1.02.88 1.51 2.32 1.08 2.89.82.09-.64.34-1.08.63-1.33-2.18-.25-4.47-1.09-4.47-4.85 0-1.07.38-1.95 1.01-2.64-.1-.25-.44-1.25.1-2.6 0 0 .83-.27 2.72 1.01a9.4 9.4 0 0 1 4.96 0c1.89-1.28 2.72-1.01 2.72-1.01.54 1.35.2 2.35.1 2.6.63.69 1.01 1.57 1.01 2.64 0 3.77-2.3 4.6-4.49 4.84.35.31.67.91.67 1.84v2.73c0 .26.18.57.68.47A9.8 9.8 0 0 0 12 2.2Z" />
  ),
  linkedin: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="3" />
      <path d="M7 10.5V17" />
      <circle cx="7" cy="7.2" r="1.05" />
      <path d="M11.4 17v-3.6a2.6 2.6 0 0 1 5.2 0V17" />
      <path d="M11.4 10.5V17" />
    </>
  ),
  instagram: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" />
    </>
  ),
  contra: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M15.4 9.1a4.4 4.4 0 1 0 0 5.8" />
    </>
  ),
};

// GitHub's mark is a filled silhouette; the rest are drawn as strokes.
const filled: Partial<Record<SocialKey, boolean>> = { github: true };

export function SocialIcon({
  name,
  size = 18,
  className,
}: {
  name: SocialKey;
  size?: number;
  className?: string;
}) {
  const isFilled = filled[name] ?? false;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill={isFilled ? "currentColor" : "none"}
      stroke={isFilled ? "none" : "currentColor"}
      strokeWidth={isFilled ? undefined : 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
