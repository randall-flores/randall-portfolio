import type { Metadata } from "next";
import { WorkList } from "@/components/work/WorkList";

const description =
  "Selected work, 2025–2026. Frontend, full-stack, design systems, AI integration, and i18n, filterable by capability.";

export const metadata: Metadata = {
  title: "Work",
  description,
  openGraph: { title: "Work", description, type: "website" },
  twitter: { title: "Work", description },
};

const range = [
  "Frontend",
  "Full-stack",
  "Design systems",
  "AI integration",
  "i18n",
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
