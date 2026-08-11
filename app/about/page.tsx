import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/Reveal";

const description =
  "How Randall works: scoping and mockups before code, written changes, and full handover of the repository, deployment, and accounts.";

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
    <main id="main" className="ab wrap">
      {/* No "ABOUT" kicker — the nav already says where we are, and the
          title carries the page. Label-only eyebrows read as scaffolding.
          Above-the-fold entrances are CSS (.rise), never JS-gated. */}
      <div className="rise">
        <h1 className="ab-title">How I work</h1>
      </div>

      <div className="rise rise-1">
        <div className="ab-grid">
          <div className="ab-main">
            {/* The only mention of the pre-code decade anywhere on the site,
                and it is here to explain why two projects are legal-workflow
                tools. Not a career-change story. See the copy spec in
                docs/superpowers/specs/. */}
            <p className="ab-lead">
              I&apos;m Randall, a full-stack developer in Costa Rica, working in
              English and Spanish. I spent about ten years in legal and
              operations work before I wrote code for a living, which is why two
              of the five projects here are tools for legal workflows.
            </p>

            <div className="ab-prose">
              {/* The {" "} after each lead-in is load-bearing, not styling.
                  JSX drops a literal space between </strong> and text that
                  begins with an entity, which ran "with." into "I'll". */}
              <p>
                <strong>Scoping.</strong>{" "}
                Before I build anything I scope the idea and mock it up, then
                review the mock with you. Anything that changes gets written
                down while it still costs nothing to change.
              </p>
              <p>
                <strong>When things change.</strong>{" "}
                If something needs to change halfway through, I check what it
                affects, explain it, and tell you what it does to the timeline
                before I start on it.
              </p>
              <p>
                <strong>What you get.</strong>{" "}
                The project is yours. You paid for it, so you get all of it: the
                repository, the deployment, the accounts. I walk you through it
                and I stay available afterwards.
              </p>
              <p>
                <strong>What I&apos;ll argue with.</strong>{" "}
                I&apos;ll tell you when I think something is a bad idea,
                particularly around legal exposure, security, and how data gets
                stored. If a request puts you, the project, or me at risk, I say
                so before it&apos;s built.
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
      </div>

      <Reveal>
        <section className="ab-look" aria-label="What I'm looking for">
          <div>
            <p className="k">What I&apos;m looking for</p>
            <p className="t">
              Remote full-stack roles and freelance projects where I own the{" "}
              <em>whole build.</em>
            </p>
          </div>
          <Button href="/contact">
            Get in touch
          </Button>
        </section>
      </Reveal>
    </main>
  );
}
