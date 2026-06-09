import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/Reveal";

const description =
  "Randall is a bilingual (EN/ES) full-stack developer in Costa Rica, with a decade in legal, executive, and customer-facing roles. The crossover: he ships tools people actually use.";

export const metadata: Metadata = {
  title: "About",
  description,
  openGraph: { title: "About", description, type: "profile" },
  twitter: { title: "About", description },
};

const facts = [
  { label: "Location", value: "San José, Costa Rica" },
  { label: "Languages", value: "English · Spanish" },
  { label: "Focus", value: "Full-stack" },
];

export default function AboutPage() {
  return (
    <main className="ab wrap">
      <Reveal>
        <p className="ab-kick">About</p>
      </Reveal>

      <Reveal delay={0.05}>
        <h1 className="ab-title">
          Half developer,
          <br />
          half <em>operator.</em>
        </h1>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="ab-grid">
          <div className="ab-main">
            <p className="ab-lead">
              I&apos;m Randall, a bilingual full-stack developer
              based in Costa Rica. Before code, I spent about a decade in legal
              assistance, executive support, customer service, and hospitality.
            </p>

            <div className="ab-prose">
              <p>
                That background is the point. I&apos;ve sat on the operator&apos;s
                side of the desk, running real workflows under real pressure, so
                I build software that fits how people actually work instead of
                how a demo wishes they did.
              </p>
              <p>
                I read a business or legal process quickly, find the manual steps
                that waste people&apos;s time, and turn them into tools that hold
                up in production. FareWise turns plain-language travel intent
                into real fares. Caseflow removes repetitive steps from a legal
                records workflow. Vox shipped as a bilingual production
                site for a real client.
              </p>
              <p>
                Modern AI tooling is part of how I build. I use it to reason
                through hard problems and move faster, and it shows up in the
                work: FareWise runs on the Claude API, and AI-generated art
                drives the Hollow Ronin pipeline. The result is more shipped, not
                less understood.
              </p>
            </div>
          </div>

          <figure className="ab-portrait">
            <Image
              src="/randall.jpg"
              alt="Randall Flores, full-stack developer"
              width={500}
              height={749}
              sizes="(max-width: 860px) 100vw, 360px"
            />
          </figure>

          <aside className="ab-aside">
            <dl className="ab-facts">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </Reveal>

      <Reveal>
        <section className="ab-look" aria-label="What I'm looking for">
          <div>
            <p className="k">What I&apos;m looking for</p>
            <p className="t">
              Open to remote full-stack roles where the{" "}
              <em>crossover</em> matters.
            </p>
          </div>
          <Button href="/contact">
            Get in touch →
          </Button>
        </section>
      </Reveal>
    </main>
  );
}
