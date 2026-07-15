import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { WorkIndex } from "@/components/work/WorkIndex";

const description =
  "Portfolio of Randall Flores, a bilingual full-stack developer in Costa Rica. AI products, client sites, and internal tools built to hold up under real workflows.";

export const metadata: Metadata = {
  description,
  openGraph: { title: "Randall — Full-Stack Developer", description },
  twitter: { title: "Randall — Full-Stack Developer", description },
};

// Marquee tech list. Duplicated inline so the CSS translateX(-50%) loop is
// seamless. Decorative, so the whole strip is aria-hidden.
const tech = [
  "Next.js",
  "TypeScript",
  "Tailwind",
  "shadcn/ui",
  "Framer Motion",
  "Supabase",
  "API Integration",
  "Vercel",
];
const strong = new Set(["TypeScript", "shadcn/ui", "API Integration"]);

function TechRun() {
  return (
    <>
      {tech.map((t, i) => (
        <span key={`${t}-${i}`} className="contents">
          <span>{strong.has(t) ? <b>{t}</b> : t}</span>
          <span>·</span>
        </span>
      ))}
    </>
  );
}

export default function Home() {
  return (
    <main id="main">
      <section className="wrap pt-35 pb-15">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
            Full-stack developer · Bilingual EN/ES · San José, CR ·{" "}
            <b className="font-medium text-accent">Open to remote</b>
          </p>
        </Reveal>

        {/* Server-rendered, visible in the initial HTML so it paints as the
            LCP element without waiting for JS. CSS entrance below animates
            transform only (opacity stays 1), so it never blocks first paint. */}
        <h1 className="t-wordmark hero-wordmark mt-5">RANDALL</h1>

        <Reveal delay={0.1}>
          <div className="hero-sub">
            <h2 className="h-head">
              Polished frontends for people doing{" "}
              <em>real work.</em>
            </h2>

            <p className="h-lead">
              A decade across legal, executive, and customer-facing roles, now
              building web apps that hold up under real workflows.
            </p>

            <div className="h-cta">
              <Magnetic>
                <Button href="/work">
                  See my work →
                </Button>
              </Magnetic>
              <Magnetic>
                <Button href="/contact" variant="ghost">
                  Get in touch
                </Button>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </section>

      <div className="strip" aria-hidden="true">
        <div className="marquee">
          <TechRun />
          <TechRun />
        </div>
      </div>

      <section className="work" id="work">
        <div className="wrap">
          <Reveal>
            <WorkIndex />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
