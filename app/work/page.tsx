import type { Metadata } from "next";
import { WorkList } from "@/components/work/WorkList";

const description =
  "Selected work, 2025–2026. Full-stack builds, AI integration, design systems, headless commerce, and bilingual sites.";

export const metadata: Metadata = {
  title: "Work",
  description,
  openGraph: { title: "Work", description, type: "website" },
  twitter: { title: "Work", description },
};

// Order matters: full-stack leads, because "Frontend" first was the same
// undersell the hero used to make. Headless commerce earns its place from
// Hollow Ronin and was missing entirely.
const range = [
  "Full-stack",
  "AI integration",
  "Design systems",
  "Headless commerce",
  // Not "i18n": the chips uppercase, and "I18N" means nothing to the freelance
  // client this page is written for.
  "Bilingual sites",
];

export default function WorkPage() {
  return (
    <main id="main">
      <section className="phead">
        <div className="wrap">
          {/* CSS entrance (.rise) — above the fold, so no JS-gated reveal. */}
          <div className="rise">
            <p className="kick">Selected work · 2025 — 2026</p>
          </div>
          <div className="rise rise-1">
            <h1>
              Things I&apos;ve <em>built.</em>
            </h1>
          </div>
          <div className="rise rise-2">
            <div className="range">
              {range.map((r) => (
                <span key={r}>
                  <b>{r}</b>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WorkList />
    </main>
  );
}
