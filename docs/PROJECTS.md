# Projects

**The project data lives in `lib/projects.ts`. That file is the only source of
truth.** Every project surface — the home index, `/work`, each case study, and
the per-project OG images — renders from it.

This document used to hold a second copy of the same content, and the two had
already drifted: it listed a different live URL for Vox than the site links to,
and still showed Hollow Ronin's link as TODO after it had shipped. So it is a
guide now, not data.

## Adding or editing a project

Edit the `projects` array in `lib/projects.ts`. The `Project` type documents
every field; TypeScript will tell you if one is missing.

The fields worth thinking about rather than filling in mechanically:

- **`featured`** — puts the project first and full-width. One project at a time.
- **`capabilities`** — drives the `/work` filters: `ai`, `fullstack`, `design`,
  `client`. Only claim what the project actually demonstrates.
- **`visibility`** — `public` or `confidential`. This is a guardrail, not a
  label; see below.
- **`problem` / `whatIBuilt` / `outcomes`** — the case-study body. Write these
  as what was actually true, not as marketing. The problem statement is the part
  people read.
- **`links`** — `live` and `repo`. Both optional, but a public project with
  neither reads as unfinished. If there is a reason a link is missing, say it in
  the copy rather than leaving silence.
- **`video`** — expects `public/cards/{slug}.webm`, `{slug}.mp4`, and
  `{slug}-poster.jpg`.

## Client-data guardrail

`sana` and `caseflow` are `confidential`. Real personal-injury and law-firm
work sits behind them.

- Anonymized screenshots and dummy content only. Never real case data, client
  names, or firm details.
- The case-study template already suppresses `links.live` and `links.repo` for
  confidential projects and renders an explanatory note instead, so those repos
  must stay private.
- When in doubt, leave it out and ask Randall.

## Open content gaps

Tracked in `docs/BUILD-PLAN.md`:

- FareWise has no `live` or `repo` link. It is the featured project, so this is
  the most visible gap on the site.
- No project links a repo yet.
- Confirm Vox's live URL. `lib/projects.ts` points at
  `vox-voiceover.vercel.app`.
