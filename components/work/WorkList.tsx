"use client";

import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { CardStill } from "@/components/work/CardStill";
import { projects, type Capability } from "@/lib/projects";

// Sticky capability filter + the editorial project spread. Client-side because
// the filter holds state and drives the live count and reflow. Scroll reveal
// reuses <Reveal>. Featured project (FareWise) renders first, full-width.
type Filter = "all" | Capability;

const STATUS_LABEL = {
  anonymized: "Anonymized screens",
  confidential: "Confidential",
} as const;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ai", label: "AI" },
  { value: "fullstack", label: "Full-stack" },
  { value: "design", label: "Design" },
  { value: "client", label: "Client" },
];

export function WorkList() {
  const [active, setActive] = useState<Filter>("all");

  const visible = projects.filter(
    (p) => active === "all" || p.capabilities.includes(active),
  );

  return (
    <>
      <div className="filters">
        <div className="wrap">
          <div className="filters-inner">
            <div
              className="fpills"
              role="group"
              aria-label="Filter projects by capability"
            >
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  className={active === f.value ? "active" : undefined}
                  aria-pressed={active === f.value}
                  onClick={() => setActive(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <p className="fcount" aria-live="polite">
              {visible.length} of {projects.length}
            </p>
          </div>
        </div>
      </div>

      <section className="projects" id="projects" aria-label="Projects">
        <div className="wrap">
          {/* key change remounts the list, which replays the CSS crossfade */}
          <div key={active} className="filter-fade">
            {visible.map((p) => {
              const index = projects.indexOf(p);
              const reversed = !p.featured && index % 2 === 1;
              const className = [
                "project",
                p.featured ? "feat" : "",
                reversed ? "reversed" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <Reveal key={p.slug}>
                  <Link
                    href={`/work/${p.slug}`}
                    className={className}
                  >
                    <div className="p-media">
                      <div
                        className={
                          p.slug === "hollow-ronin"
                            ? "p-visual dark"
                            : "p-visual"
                        }
                      >
                        <CardStill
                          slug={p.slug}
                          sizes={
                            p.featured
                              ? "(max-width: 767px) 92vw, 1220px"
                              : undefined
                          }
                        />
                        {/* Only the client-data guardrail earns a caption.
                            The title sits right under the image, so a
                            "Name: what it is" label just repeated it. */}
                        {p.status === "anonymized" ||
                        p.status === "confidential" ? (
                          <p className="p-cap">{STATUS_LABEL[p.status]}</p>
                        ) : null}
                      </div>
                    </div>

                    <div className="p-info">
                      <h2 className="p-title">{p.title}</h2>
                      {/* The year rides on the category line instead of
                          sitting above the title as its own label. */}
                      <p className="p-cat">
                        {p.category}, {p.year}
                      </p>
                      <p className="p-desc">{p.description}</p>
                      <p className="p-stack">{p.stack.join(", ")}</p>
                      <span className="p-link">
                        <span className="ulink">View case</span>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
