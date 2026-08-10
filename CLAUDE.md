# CLAUDE.md

Project memory for Claude Code. Read this first, every session. Keep it accurate as the project evolves.

## What this is

Randall's personal developer portfolio. A Next.js site that showcases frontend and full-stack work and lands remote roles. The site itself is a portfolio piece, so craft and polish matter more than usual. Built locally in VS Code with Claude Code, deployed to Vercel.

## Positioning

Randall is a bilingual (EN/ES) developer in Costa Rica, pivoting into web development after a decade across legal assistance, executive support, customer service, and hospitality. The angle is the crossover: builds polished frontends AND understands real business and legal workflows, so he ships tools people actually use. The site should read as full-stack capable, design literate, and current on AI integration.

## Tech stack

- Next.js (App Router) + TypeScript (strict)
- Tailwind CSS + shadcn/ui
- lenis for smooth scroll
- No animation or icon libraries. Entrance motion, magnetic hover, the
  background field, and the social icons are all owned in-repo — framer-motion
  and lucide-react were removed for the main-thread cost they carried.
- Deployed on Vercel
- Package manager: pnpm (use it for everything, never mix with npm)

Keep dependencies lean. Suggest a library only when it clearly beats hand-rolling, and say why.

## Design system

The visual identity is locked. Full spec in `docs/DESIGN-SYSTEM.md`. Read it before building any UI. Summary:

- Dark, cinematic, type-led. Near-black canvas under a live WebGL field, with a silver accent.
- Display font Bodoni Moda (didone, driven by its optical-size axis), body Karla, metadata in Fragment Mono.
- Signature interactions: the portal entry, the field reacting to cursor/hover/scroll, the red cloud arriving on scroll, magnetic buttons, reveal-on-scroll.
- Never the generic AI/SaaS look: no Inter or Space Grotesk, no purple-on-white, no centered-everything, no stock gradients.

## Site structure (routes)

- `/` Home, editorial index of projects, hero with the big RANDALL wordmark and one signature motion moment.
- `/work` Immersive, filterable project showcase (filters by capability: AI, Full-Stack, Design, Client).
- `/work/[slug]` Case study per project (problem, what I built, stack, my role, live + repo links).
- `/about` The crossover story, bilingual + legal-tech, where I am, what I want.
- `/contact` Email, links, CV download.

Content for each project lives in `docs/PROJECTS.md` and should be modeled as typed data in `lib/projects.ts`.

## Non-negotiables

- Mobile-first and fully responsive. Test small screens every time.
- Accessible: semantic HTML, real landmarks, alt text on every image, keyboard navigable, visible focus states, color contrast that passes AA, and `prefers-reduced-motion` honored on all motion.
- Fast: `next/image` for all images, lazy where sensible, watch the PageSpeed score on mobile.
- SEO: per-page metadata via the App Router Metadata API, a dynamic Open Graph image, and a sitemap.

## Client-data guardrail (important)

Some projects touch a real law firm and sensitive personal-injury data. For Sana and Caseflow: anonymized screenshots only, dummy content only, never real case data, names, or client details. When in doubt, leave it out and ask Randall. Mark each project public or confidential in `lib/projects.ts`.

## How to work with Randall

- He is a beginner who learns by doing. Give direct answers and working code by default. Explain only when he asks, though a one-line offer to explain is fine.
- Let him drive when he wants to figure something out.
- Write in natural, human-sounding prose. No em dashes. Avoid AI-typical filler.
- Proactively suggest tools, VS Code extensions, npm packages, or skills that get to the goal faster, and say why in one line.
- Move in small, shippable steps. The site should never be broken on `main`. Work phase by phase per `docs/BUILD-PLAN.md`.

## Commands

```bash
pnpm dev            # local dev server
pnpm build          # production build (must pass before deploy)
pnpm lint           # eslint
pnpm perf           # Lighthouse x3, median vs budget (mobile)
pnpm perf:desktop   # same, desktop profile
```

Never act on a single performance number. TBT swings by an order of magnitude
with machine load — use `pnpm perf` for a median, or Vercel's real-user data.
Accessibility, best-practices and SEO are deterministic and safe to read from
one run.

## Conventions

- Components in `components/`, grouped: `layout/`, `motion/`, `work/`, and shadcn primitives in `components/ui/`.
- Project data and helpers in `lib/`.
- Design tokens as CSS variables in `app/globals.css`, mapped into Tailwind. Never hardcode hex values in components, use the tokens.
- Server Components by default. Add `"use client"` only where interaction or browser APIs require it (Field, magnetic, Lenis, filters).
- One reusable motion primitive per effect. Do not re-implement reveals or magnetic logic per page.
