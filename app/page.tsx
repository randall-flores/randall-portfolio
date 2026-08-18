import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { OrbitCarousel } from "@/components/work/OrbitCarousel";
import { projects } from "@/lib/projects";

const description =
  "Portfolio of Randall Flores, a full-stack developer in Costa Rica working in English and Spanish. AI products, client sites, storefronts, and internal tools.";

export const metadata: Metadata = {
  description,
  openGraph: { title: "Randall — Full-Stack Developer", description },
  twitter: { title: "Randall — Full-Stack Developer", description },
};

export default function Home() {
  return (
    <main id="main">
      <section className="wrap pt-35 pb-15">
        {/* Above-the-fold content animates with CSS (.rise), not <Reveal> —
            a JS-gated reveal here would hold the hero at opacity 0 until
            hydration and wreck LCP / Speed Index on slow devices. */}
        <div className="rise">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
            Full-stack developer · Bilingual EN/ES · San José, CR ·{" "}
            <b className="font-medium text-accent">Open to remote</b>
          </p>
        </div>

        {/* Server-rendered, visible in the initial HTML so it paints as the
            LCP element without waiting for JS. CSS entrance below animates
            transform only (opacity stays 1), so it never blocks first paint. */}
        <h1 className="t-wordmark hero-wordmark mt-5">RANDALL</h1>

        <div className="rise rise-1">
          <div className="hero-sub">
            <h2 className="h-head">
              I build the whole product,{" "}
              <em>not the front of it.</em>
            </h2>

            <p className="h-lead">
              An AI flight search running on the Claude API. A production site
              for a client in Germany. A storefront wired to print-on-demand
              fulfillment. A hand-curated product feed on Supabase. Two apps
              built around data that has to stay private.
            </p>

            <div className="h-cta">
              <Magnetic>
                <Button href="/work">
                  See the work
                </Button>
              </Magnetic>
              <Magnetic>
                <Button href="/contact" variant="ghost">
                  Get in touch
                </Button>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>

      <section className="work" id="work">
        <div className="wrap">
          <Reveal>
            <div className="sec-head">
              <h2>Selected work</h2>
              <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
                {projects.length} projects · 2025—2026
              </p>
            </div>
          </Reveal>
          {/* The carousel is the front door. /work keeps the scannable list. */}
          <OrbitCarousel />
        </div>
      </section>
    </main>
  );
}
