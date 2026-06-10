import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Private proof-of-system page. Not linked in nav, kept out of search.
export const metadata: Metadata = {
  title: "Style guide",
  robots: { index: false, follow: false },
};

const colorTokens = [
  { name: "--bg", value: "#0A0A0C", cls: "bg-bg", note: "page background" },
  { name: "--bg-2", value: "#101014", cls: "bg-bg-2", note: "raised surfaces" },
  { name: "--fg", value: "#ECECE6", cls: "bg-fg", note: "primary text" },
  { name: "--muted", value: "#7E7E78", cls: "bg-muted", note: "metadata" },
  { name: "--accent", value: "#C8F24E", cls: "bg-accent", note: "the only accent" },
  {
    name: "--accent-dim",
    value: "rgba(200,242,78,.12)",
    cls: "bg-accent-dim",
    note: "hover bleeds",
  },
  {
    name: "--line",
    value: "rgba(236,236,230,.12)",
    cls: "bg-transparent border border-line",
    note: "dividers",
  },
  {
    name: "--line-soft",
    value: "rgba(236,236,230,.06)",
    cls: "bg-transparent border border-line-soft",
    note: "faint dividers",
  },
];

const typeScale = [
  { label: "wordmark", cls: "t-wordmark", sample: "Aa" },
  { label: "h1 / page", cls: "t-h1", sample: "Things I've built" },
  { label: "h2 / section", cls: "t-h2", sample: "Selected work" },
  { label: "project title", cls: "t-project", sample: "FareWise" },
  { label: "lead", cls: "t-lead max-w-[46ch] text-fg/80", sample: "A decade across legal, executive, and customer-facing roles, now building web apps that hold up under real workflows." },
  { label: "body — 16px Hanken Grotesk", cls: "text-base max-w-[46ch] text-fg/80", sample: "Body copy is set in Hanken Grotesk at 16px with a 1.5 line height for comfortable reading." },
];

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line py-14">
      <h2 className="mb-8 font-mono text-xs uppercase tracking-[0.14em] text-muted">
        {label}
      </h2>
      {children}
    </section>
  );
}

export default function StyleGuide() {
  return (
    <main className="wrap pt-30 pb-10">
      <header className="pb-10">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
          Internal · not indexed
        </p>
        <h1 className="t-h2 mt-4">Style guide</h1>
        <p className="t-lead mt-3 max-w-[52ch] text-fg/80">
          Proof the locked design system works: color tokens, the type scale,
          the two button variants, and a sample project row.
        </p>
      </header>

      {/* Color tokens */}
      <Section label="Color tokens">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {colorTokens.map((t) => (
            <li
              key={t.name}
              className="rounded-lg border border-line-soft bg-bg-2 p-3"
            >
              <div className={`h-20 w-full rounded-sm ${t.cls}`} />
              <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.04em]">
                <span className="text-fg">{t.name}</span>
              </div>
              <div className="mt-1 font-mono text-[11px] text-muted">
                {t.value}
              </div>
              <div className="mt-0.5 font-mono text-[10px] text-muted">
                {t.note}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Type scale */}
      <Section label="Type scale">
        <div className="flex flex-col gap-10">
          {typeScale.map((t) => (
            <div key={t.label}>
              <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
                {t.label}
              </div>
              <div className={t.cls}>{t.sample}</div>
            </div>
          ))}
          <div>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
              mono label
            </div>
            <div className="t-mono text-fg">Available · 14:09 CR</div>
          </div>
        </div>
      </Section>

      {/* Buttons */}
      <Section label="Buttons">
        <div className="flex flex-wrap items-center gap-3.5">
          <Button href="/work">
            See my work →
          </Button>
          <Button href="/about" variant="ghost">
            The crossover
          </Button>
        </div>
      </Section>

      {/* Sample project index row */}
      <Section label="Project index row">
        <Link
          href="/work/farewise"
          className="group grid grid-cols-1 items-center gap-3 border-b border-line-soft px-3 py-7 transition-[padding,background] duration-300 ease-brand hover:bg-[linear-gradient(90deg,var(--accent-dim),transparent_55%)] hover:pl-6 sm:grid-cols-[60px_1fr_auto] sm:gap-5"
        >
          <span className="font-mono text-[13px] text-muted transition-colors group-hover:text-accent">
            01
          </span>
          <span className="t-project transition-transform duration-300 ease-brand group-hover:translate-x-1.5">
            FareWise
          </span>
          <span className="flex flex-col items-start gap-2 sm:items-end">
            <span className="flex flex-wrap gap-1.5 sm:justify-end">
              {["AI Product", "Claude API", "SerpApi"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-xs border border-line px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.04em] text-muted"
                >
                  {tag}
                </span>
              ))}
            </span>
            <span className="font-mono text-xs text-muted">2025</span>
          </span>
        </Link>
      </Section>
    </main>
  );
}
