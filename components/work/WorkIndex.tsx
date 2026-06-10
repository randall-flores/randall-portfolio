"use client";

import Link from "next/link";
import { useState } from "react";
import { CardVideo } from "@/components/work/CardVideo";
import { projects } from "@/lib/projects";

// The editorial Work index: a typographic list by default, a card Gallery on
// toggle. Same project data either way; the CSS in globals.css owns the two
// layouts (.track / .track.gallery). Each row links to the case study.
export function WorkIndex() {
  const [view, setView] = useState<"index" | "gallery">("index");

  return (
    <>
      <div className="sec-head">
        <h2>Selected Work</h2>
        <div className="toggle" role="group" aria-label="Work view">
          <button
            type="button"
            className={view === "index" ? "active" : undefined}
            aria-pressed={view === "index"}
            onClick={() => setView("index")}
          >
            Index
          </button>
          <button
            type="button"
            className={view === "gallery" ? "active" : undefined}
            aria-pressed={view === "gallery"}
            onClick={() => setView("gallery")}
          >
            Gallery
          </button>
        </div>
      </div>

      <div className={view === "gallery" ? "track gallery" : "track"}>
        {projects.map((p, i) => (
          <Link
            key={p.slug}
            href={`/work/${p.slug}`}
            className={p.wide ? "item wide" : "item"}
            aria-label={`${p.title} case study`}
          >
            <div className="num">{String(i + 1).padStart(2, "0")}</div>
            <div>
              <div className="name">{p.title}</div>
              <div
                className="vis"
                style={{ background: p.gradient }}
                aria-hidden="true"
              >
                {p.video ? (
                  <CardVideo
                    slug={p.slug}
                    poster={`/cards/${p.slug}-poster.jpg`}
                    dark={p.slug === "hollow-ronin"}
                  />
                ) : null}
                <span className="p-view">View case →</span>
              </div>
            </div>
            <div className="meta">
              <div className="tags">
                {p.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
              <div className="yr">
                {p.live ? <span className="live">● Live</span> : null}
                {p.live ? " · " : ""}
                {p.year}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
