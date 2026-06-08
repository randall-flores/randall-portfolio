import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { WorkList } from "@/components/work/WorkList";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected work, 2024–2026. Frontend, full-stack, design systems, AI integration, and i18n, filterable by capability.",
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
    <main>
      <section className="phead">
        <div className="wrap">
          <Reveal>
            <p className="kick">Selected work · 2024 — 2026</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1>
              Things I&apos;ve <em>built.</em>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="range">
              {range.map((r) => (
                <span key={r}>
                  <b>{r}</b>
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <WorkList />
    </main>
  );
}
