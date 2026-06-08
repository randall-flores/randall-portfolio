import { ImageResponse } from "next/og";

// Shared dynamic OG image renderer (next/og ImageResponse). Brand palette,
// system fonts for reliability — no build-time font fetch to flake on. Used by
// the site-wide image and the per-project case-study images.
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const BG = "#0A0A0C";
const FG = "#ECECE6";
const ACCENT = "#C8F24E";
const MUTED = "#7E7E78";

type OgInput = {
  title: string;
  subtitle: string;
  eyebrow: string;
  accentDot?: boolean;
};

export function renderOgImage({
  title,
  subtitle,
  eyebrow,
  accentDot = false,
}: OgInput) {
  const titleSize = title.length > 16 ? 92 : 116;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "9999px",
              background: ACCENT,
            }}
          />
          <div
            style={{
              fontSize: "26px",
              letterSpacing: "5px",
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: `${titleSize}px`,
              fontWeight: 700,
              letterSpacing: "-4px",
              lineHeight: 1,
              color: FG,
            }}
          >
            {title}
            {accentDot ? <span style={{ color: ACCENT }}>.</span> : null}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "28px",
              fontSize: "38px",
              lineHeight: 1.3,
              letterSpacing: "-1px",
              color: ACCENT,
              maxWidth: "980px",
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "23px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          Randall Flores · Costa Rica
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
