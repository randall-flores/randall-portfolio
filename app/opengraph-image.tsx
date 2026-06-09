import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Randall Flores — Full-Stack Developer";

export default function Image() {
  return renderOgImage({
    eyebrow: "Portfolio",
    title: "Randall Flores",
    subtitle: "Full-Stack Developer",
    accentDot: true,
  });
}
