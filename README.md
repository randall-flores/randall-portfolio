# randall-portfolio

Personal portfolio for **Randall Flores** — a bilingual (EN/ES) full-stack
developer in Costa Rica. AI products, client sites, and internal tools built to
hold up under real workflows.

Live: <https://randallflores.dev>

The site is itself a portfolio piece, so the background is a live WebGL field
rather than a static image, and craft is held to a higher bar than the content
strictly requires.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript strict |
| Styling | Tailwind CSS v4, design tokens as CSS variables |
| Type | Bodoni Moda (display), Karla (body), Fragment Mono (data) |
| Scroll | Lenis |
| Background | Hand-written WebGL + Canvas 2D, no animation library |
| Hosting | Vercel |

No animation or icon dependencies: entrance motion, the magnetic hover, and the
social icons are all owned in-repo. See `lib/field.ts` for the background.

## Commands

```bash
pnpm dev      # local dev server
pnpm build    # production build — must pass before deploying
pnpm lint     # eslint
```

pnpm only. Don't mix in npm or yarn; the lockfile is pnpm's.

## Layout

```
app/            routes: / , /work , /work/[slug] , /about , /contact , /styleguide
  globals.css   design tokens + every page-level style
components/
  layout/       Nav, Footer, MobileMenu, Grain
  motion/       Field (the background), Reveal, Magnetic
  work/         WorkIndex, WorkList, CardVideo
  ui/           Button, SocialIcon
lib/
  field.ts      WebGL nebula + Canvas 2D particle cloud
  projects.ts   typed project data — the single source for every project surface
  social.ts     every off-site link
  fonts.ts      next/font setup
docs/           DESIGN-SYSTEM.md, PROJECTS.md, BUILD-PLAN.md
```

## The background field

One component (`components/motion/Field.tsx`) owns the only
`requestAnimationFrame` loop on the page:

- **Nebula** — a WebGL fragment shader. Follows the cursor, blooms under
  whatever is hovered or focused, ripples on click, and dims itself as you
  scroll so content reads without a scrim over it.
- **Cloud** — red bokeh particles that come through the nebula on scroll,
  capped so they never replace it. Built on an idle callback after `load`, never
  during it.
- **Portal** — an aperture that opens on arrival.

It is skipped entirely for `prefers-reduced-motion` and on touch phones, which
get a CSS gradient in the same palette. Quality steps down only if the GPU
cannot keep up.

## Conventions

- Server Components by default; `"use client"` only where interaction or a
  browser API requires it.
- Never hardcode a colour. Use the tokens in `app/globals.css`.
- Project content lives in `lib/projects.ts` and nowhere else.
- Two projects are marked `confidential` — anonymized screens and dummy content
  only, never real client data.
- Accessibility is not optional: semantic landmarks, visible focus, keyboard
  operable, `prefers-reduced-motion` honoured everywhere.

`/styleguide` renders the tokens, type scale, and components as a live proof of
the system. It is `noindex` and not linked from the nav.
