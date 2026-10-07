import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Private proof-of-system page. Not linked in nav, kept out of search.
export const metadata: Metadata = {
  title: "Style guide",
  robots: { index: false, follow: false },
};

const colorTokens = [
  { name: "--bg", value: "#06070A", cls: "bg-bg", note: "page background" },
  { name: "--bg-2", value: "rgba(18,21,27,.72)", cls: "bg-bg-2", note: "glass surfaces" },
  { name: "--fg", value: "#E9EBEF", cls: "bg-fg", note: "primary text" },
  { name: "--muted", value: "#8A929C", cls: "bg-muted", note: "metadata" },
  { name: "--accent", value: "#C3CAD3", cls: "bg-accent", note: "the only accent" },
  {
    name: "--accent-dim",
    value: "rgba(195,202,211,.12)",
    cls: "bg-accent-dim",
    note: "hover bleeds",
  },
  {
    name: "--line",
    value: "rgba(233,235,239,.18)",
    cls: "bg-transparent border border-line",
    note: "dividers",
  },
  {
    name: "--line-soft",
    value: "rgba(233,235,239,.08)",
    cls: "bg-transparent border border-line-soft",
    note: "faint dividers",
  },
];

const typeScale = [
  { label: "wordmark", cls: "t-wordmark", sample: "Aa" },
  { label: "h1 / page", cls: "t-h1", sample: "Things I've built" },
  { label: "h2 / section", cls: "t-h2", sample: "Selected work" },
  { label: "project title", cls: "t-project", sample: "FareWise" },
  { label: "lead", cls: "t-lead max-w-[46ch] text-fg/80", sample: "An AI flight search running on the Claude API. A production site for a client in Germany. A storefront wired to print-on-demand fulfillment." },
  { label: "body, 18px Newsreader", cls: "text-[18px] max-w-[60ch] text-fg/80", sample: "Body copy is set in Newsreader at 18px with a 1.55 line height for comfortable reading." },
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
      <h2 className="mb-8 text-xs text-muted">
        {label}
      </h2>
      {children}
    </section>
  );
}

export default function StyleGuide() {
  return (
    <main id="main" className="wrap pt-30 pb-10">
      <header className="pb-10">
        <p className=" text-xs text-muted">
          Internal, not indexed
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
              <div className="mt-3 text-[15px]">
                <span className="text-fg">{t.name}</span>
              </div>
              <div className="mt-1 text-[15px] text-muted">
                {t.value}
              </div>
              <div className="mt-0.5 text-[15px] text-muted">
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
              <div className="mb-3 text-[15px] text-muted">
                {t.label}
              </div>
              <div className={t.cls}>{t.sample}</div>
            </div>
          ))}
          <div>
            <div className="mb-3 text-[15px] text-muted">
              mono label
            </div>
          </div>
        </div>
      </Section>

      {/* Buttons */}
      <Section label="Buttons">
        <div className="flex flex-wrap items-center gap-3.5">
          <Button href="/work">
            See the work
          </Button>
          <Button href="/about" variant="ghost">
            How I work
          </Button>
        </div>
      </Section>

      {/* Sample project index row */}
      <Section label="Project index row">
        <Link
          href="/work/farewise"
          className="group grid grid-cols-1 items-center gap-3 border-b border-line-soft px-3 py-7 transition-[padding,background] duration-300 ease-brand hover:bg-[linear-gradient(90deg,var(--accent-dim),transparent_55%)] hover:pl-6 sm:grid-cols-[60px_1fr_auto] sm:gap-5"
        >
          <span className=" text-[13px] text-muted transition-colors group-hover:text-accent">
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
                  className="rounded-xs border border-line px-2.5 py-1 text-[15px] text-muted"
                >
                  {tag}
                </span>
              ))}
            </span>
            <span className=" text-xs text-muted">2025</span>
          </span>
        </Link>
      </Section>
    </main>
  );
}
