import { Button } from "@/components/ui/button";

// Phase 1 placeholder home. The full editorial index, marquee and motion
// land in Phase 3 — this keeps `main` shippable and on-brand in the meantime.
export default function Home() {
  return (
    <main className="wrap pt-[140px] pb-[60px]">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
        Frontend developer · Bilingual EN/ES · San José, CR ·{" "}
        <b className="font-medium text-accent">Open to remote</b>
      </p>

      <h1 className="t-wordmark mt-5">RANDALL</h1>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
        <h2 className="t-h2 max-w-[16ch]">
          Polished frontends for people doing{" "}
          <em className="accent-italic">real work.</em>
        </h2>

        <div className="max-w-[38ch]">
          <p className="t-lead text-fg/80">
            A decade across legal, executive, and customer-facing roles, now
            building web apps that hold up under real workflows.
          </p>
          <div className="mt-[34px] flex flex-wrap gap-3.5">
            <Button href="/work" dataCursor="View">
              See my work →
            </Button>
            <Button href="/about" variant="ghost">
              The crossover
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
