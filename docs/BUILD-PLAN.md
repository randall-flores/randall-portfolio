# Build status

The original phase plan is done and the site is live. This file now tracks what
exists and what is still open, so it stops describing a build that already
happened.

Rule that still holds: never leave `main` broken. Every change should build,
deploy, and be checkable on a phone.

## Shipped

- **Foundation** — Next.js App Router + TypeScript strict, Tailwind v4, design
  tokens in `app/globals.css`, fonts via `next/font`, Nav / Footer / layout,
  private `/styleguide`, deployed on Vercel.
- **Motion** — `Reveal` and `Magnetic` as the two reusable primitives, both
  dependency-free. `Field` owns the background and the page's only rAF loop.
- **Home** — hero wordmark, positioning line, two CTAs, editorial project index
  with an Index/Gallery toggle.
- **/work** — sticky capability filters (All, AI, Full-Stack, Design, Client),
  live result count, editorial project spread with preview video.
- **/work/[slug]** — case-study template driven entirely by `lib/projects.ts`,
  with prev/next.
- **/about**, **/contact** — the crossover story; email copy-to-clipboard,
  social links, CV download.
- **SEO** — per-page metadata, dynamic OG images per project, sitemap, robots.
- **Identity rebuild** — the silver WebGL field, Bodoni Moda / Karla /
  Fragment Mono, the portal entry, and the removal of every templated tell
  (tech marquee, tag outlines, section rules, permanent underlines, arrows).
- **Performance** — TBT brought down from 15.7s, framer-motion and lucide-react
  removed, the field deferred off the critical path.

## Open

- [ ] Fill the `TODO` links in `docs/PROJECTS.md` (live URLs and repos), then
      mirror them into `lib/projects.ts`.
- [ ] Point `SITE_URL` in `lib/site.ts` at the custom domain once connected.
- [ ] Real screenshots for the confidential projects (Sana, Caseflow),
      anonymized — dummy content only, no client data.
- [ ] Re-check contrast and touch targets on the silver palette on a real
      device, not just in the numbers.
- [ ] Content pass: copy, spacing, and the case-study bodies.

## Guardrail

Sana and Caseflow are `confidential` in `lib/projects.ts`. Anonymized
screenshots and dummy content only — never real case data, names, or client
details. When in doubt, leave it out and ask.
