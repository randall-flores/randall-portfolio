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

Picked up in that order next session.

**Unverified — I have never seen these rendered.** Chrome-extension screenshots
could not reach localhost for the whole 2026-08-10 session, so every visual
judgment came from Randall.

- [ ] **The carousel on a phone.** Below 900px the ring becomes a single card
      with swipe. Never seen on a real device.
- [ ] **Run `pnpm perf` once for a median.** The carousel adds five transformed
      layers to the home page. Worth a number, not a guess — and never act on a
      single run (PSI read TBT 320ms → 1,720ms → 7,930ms → score 97 on
      identical deployed code).
- [ ] Contrast and touch targets on the silver palette, checked on a device
      rather than in the arithmetic.

**Content — Randall's, not the build's.**

- [ ] **FareWise has no live link and no repo**, and it is the featured project.
      A visitor reads the case study and finds nothing to click. Highest-value
      gap on the site: deploy it, or say in the copy why it is not up.
- [ ] **No project links a repo.** FareWise and Vox public would be the strongest
      signal for a technical reviewer. Sana and Caseflow must stay private.
- [ ] **Vox has two conflicting URLs.** `lib/projects.ts` points at
      `vox-voiceover.vercel.app`; the old docs said `leonie-dubuc.vercel.app`.
      Confirm which is live — a broken link on a client project is worse than
      no link.
- [ ] Real screenshots for the confidential projects (Sana, Caseflow),
      anonymized — dummy content only, no client data.
- [ ] Content pass: copy, spacing, and the case-study bodies.

**Design, parked mid-thought.**

- [ ] The `/work` page still uses the old editorial list. It is deliberately the
      scannable counterpart to the carousel, but it has not been looked at since
      the identity changed.
- [ ] Ring radius is `28vw` clamped 300–430px. May crowd on a 1280px laptop.

## Guardrail

Sana and Caseflow are `confidential` in `lib/projects.ts`. Anonymized
screenshots and dummy content only — never real case data, names, or client
details. When in doubt, leave it out and ask.
