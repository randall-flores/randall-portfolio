import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import {
  projects,
  type Capability,
  type ProjectStatus,
} from "@/lib/projects";

const CAP_LABELS: Record<Capability, string> = {
  ai: "AI",
  fullstack: "Full-Stack",
  design: "Design",
  client: "Client",
};

const STATUS_LABELS: Record<ProjectStatus, string> = {
  live: "Live",
  anonymized: "Anonymized",
  confidential: "Confidential",
};

// Confidential note copy. Generic by design — no firm name, client names, or
// case details anywhere (CLAUDE.md client-data guardrail).
const CONFIDENTIAL_NOTE: Record<string, string> = {
  anonymized:
    "Every screen referenced here is anonymized and uses dummy content. No real client, case, or personal data appears anywhere in this case study.",
  confidential:
    "This was an internal tool built for a law firm. Everything described is generic and fully anonymized — no real firm name, client names, or case details are included.",
};

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return { title: project.title, description: project.tagline };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  const confidential = project.visibility === "confidential";
  const liveUrl = !confidential ? project.links.live : undefined;
  const repoUrl = !confidential ? project.links.repo : undefined;

  return (
    <main className="cs wrap">
      <Reveal>
        <Link href="/work" className="cs-back" data-cursor="Back">
          ← All work
        </Link>
      </Reveal>

      <Reveal delay={0.05}>
        <header className="cs-head">
          <p className="cs-num">{String(index + 1).padStart(2, "0")}</p>
          <h1 className="cs-title">{project.title}</h1>
          <p className="cs-tagline">{project.tagline}</p>

          <div className="cs-actions">
            {project.status ? (
              <span className="cs-status">
                <span
                  className={`sdot ${project.status === "live" ? "live" : "muted"}`}
                  aria-hidden="true"
                />
                {STATUS_LABELS[project.status]}
              </span>
            ) : null}

            {liveUrl ? (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cs-act"
                data-cursor="Open"
              >
                Visit live site →
              </a>
            ) : null}

            {repoUrl ? (
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cs-act ghost"
                data-cursor="Open"
              >
                View repo →
              </a>
            ) : null}
          </div>
        </header>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="cs-hero">
          <div
            className="p-visual"
            role="img"
            aria-label={`${project.title} interface preview (placeholder visual)`}
          >
            <div className="p-chrome" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <div className="p-ghost" aria-hidden="true">
              {project.initials}
            </div>
            <div className="p-cap">
              {project.status ? (
                <span
                  className={`sdot ${project.status === "live" ? "live" : "muted"}`}
                  aria-hidden="true"
                />
              ) : null}
              {project.mediaCaption}
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <dl className="cs-meta">
          <div>
            <dt className="label">Role</dt>
            <dd className="val">{project.role}</dd>
          </div>
          <div>
            <dt className="label">Year</dt>
            <dd className="val">{project.year}</dd>
          </div>
          <div>
            <dt className="label">Stack</dt>
            <dd className="val">
              <div className="chips">
                {project.stack.map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </div>
            </dd>
          </div>
          <div>
            <dt className="label">Capabilities</dt>
            <dd className="val">
              {project.capabilities.map((c) => CAP_LABELS[c]).join(", ")}
            </dd>
          </div>
        </dl>
      </Reveal>

      <div className="cs-body">
        <Reveal>
          <section className="cs-section">
            <h2>The problem</h2>
            <p>{project.problem}</p>
          </section>
        </Reveal>

        <Reveal>
          <section className="cs-section">
            <h2>What I built</h2>
            <p>{project.whatIBuilt}</p>
            {confidential && project.status ? (
              <p className="cs-note">{CONFIDENTIAL_NOTE[project.status]}</p>
            ) : null}
          </section>
        </Reveal>

        <Reveal>
          <section className="cs-section">
            <h2>My role</h2>
            <p>{project.role}</p>
          </section>
        </Reveal>

        <Reveal>
          <section className="cs-section">
            <h2>Outcomes</h2>
            <p>{project.outcomes}</p>
          </section>
        </Reveal>
      </div>

      <Reveal>
        <nav className="cs-nav" aria-label="More projects">
          <Link href={`/work/${prev.slug}`} data-cursor="View case">
            <span className="dir">← Previous</span>
            <span className="nm">{prev.title}</span>
          </Link>
          <Link href={`/work/${next.slug}`} className="next" data-cursor="View case">
            <span className="dir">Next →</span>
            <span className="nm">{next.title}</span>
          </Link>
        </nav>
      </Reveal>
    </main>
  );
}
