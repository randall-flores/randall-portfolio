"use client";

import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { CardStill } from "@/components/work/CardStill";
import { projects, type Capability } from "@/lib/projects";

// Sticky capability filter + the editorial project spread. Client-side because
// the filter holds state and drives the live count and reflow. Scroll reveal
// reuses <Reveal>; hovering a card scales the media up and reveals a
// "View case" label in the media corner. Featured project (FareWise)
// renders first, full-width.
type Filter = "all" | Capability;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ai", label: "AI" },
  { value: "fullstack", label: "Full-Stack" },
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
              <b>{visible.length}</b> / {projects.length} projects
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
                        <CardStill slug={p.slug} />
                        <span className="p-view" aria-hidden="true">
                          View case
                        </span>
                        <div className="p-cap">
                          {p.status ? (
                            <span
                              className={`sdot ${p.status === "live" ? "live" : "muted"}`}
                              aria-hidden="true"
                            />
                          ) : null}
                          {p.mediaCaption}
                        </div>
                      </div>
                    </div>

                    <div className="p-info">
                      {/* The year, not an index. A numbered marker promises
                          the order carries meaning a reader needs, and this
                          list is not a sequence — "01" only said FareWise is
                          first in an array. Recency is what someone actually
                          scans a portfolio index for. */}
                      <div className="p-num">
                        {p.year}
                        {p.featured ? " · Featured" : ""}
                      </div>
                      <h2 className="p-title">{p.title}</h2>
                      <p className="p-cat">{p.category}</p>
                      <p className="p-desc">{p.description}</p>
                      <div className="chips">
                        {p.stack.map((s) => (
                          <span key={s} className="chip">
                            {s}
                          </span>
                        ))}
                      </div>
                      <span className="p-link">View case</span>
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
