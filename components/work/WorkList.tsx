"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { CardVideo } from "@/components/work/CardVideo";
import { projects, type Capability } from "@/lib/projects";

// Sticky capability filter + the editorial project spread. Client-side because
// the filter holds state and drives the live count and reflow. Scroll reveal
// reuses <Reveal>; the cursor "View case" label reuses the global <Cursor />
// via data-cursor. Featured project (FareWise) renders first, full-width.
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

  // Parallax on the ghosted initials. Re-queries the DOM each frame so it keeps
  // working across filter re-renders. Desktop fine-pointer only, off for
  // reduced-motion.
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let raf = 0;
    const loop = () => {
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>(".p-ghost").forEach((g) => {
        const r = g.getBoundingClientRect();
        const off = (r.top + r.height / 2 - vh / 2) / vh;
        g.style.transform = `translateY(${off * -40}px)`;
      });
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

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
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
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
                    data-cursor="View case"
                    aria-label={`${p.title} case study`}
                  >
                    <div className="p-media">
                      <div
                        className={
                          p.slug === "hollow-ronin"
                            ? "p-visual dark"
                            : "p-visual"
                        }
                      >
                        <div className="p-chrome" aria-hidden="true">
                          <i />
                          <i />
                          <i />
                        </div>
                        {p.video ? (
                          <CardVideo
                            slug={p.slug}
                            poster={`/cards/${p.slug}-poster.jpg`}
                            dark={p.slug === "hollow-ronin"}
                          />
                        ) : (
                          <div className="p-ghost" aria-hidden="true">
                            {p.initials}
                          </div>
                        )}
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
                      <div className="p-num">
                        {String(index + 1).padStart(2, "0")}
                        {p.featured ? " — Featured" : ""}
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
                      <span className="p-link">View case →</span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </motion.div>
        </div>
      </section>
    </>
  );
}
