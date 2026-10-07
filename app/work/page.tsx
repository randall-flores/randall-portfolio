import type { Metadata } from "next";
import { WorkList } from "@/components/work/WorkList";

const description =
  "Selected work, 2025 to 2026. Full-stack builds, AI integration, design systems, headless commerce, and bilingual sites.";

export const metadata: Metadata = {
  title: "Work",
  description,
  openGraph: { title: "Work", description, type: "website" },
  twitter: { title: "Work", description },
};

// No kicker and no capability list above the filters: the filter row directly
// below names the same capabilities, and the years sit on every card.
export default function WorkPage() {
  return (
    <main id="main">
      <section className="phead">
        <div className="wrap">
          {/* CSS entrance (.rise) — above the fold, so no JS-gated reveal. */}
          <div className="rise">
            <h1>Things I&apos;ve built.</h1>
          </div>
        </div>
      </section>

      <WorkList />
    </main>
  );
}
