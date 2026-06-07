# Build Plan

Work phase by phase. Each phase ends in something that builds, deploys, and is testable on a phone. Never leave `main` broken. Check items off as you go.

## Phase 1 — Foundation (live on day one)

- [ ] Scaffold Next.js (App Router) + TypeScript with pnpm.
- [ ] Add Tailwind, init shadcn/ui, install framer-motion and lenis.
- [ ] Put color tokens in `app/globals.css` and map them into Tailwind.
- [ ] Wire fonts with `next/font/google`: Fraunces, Hanken Grotesk, JetBrains Mono.
- [ ] Base `layout.tsx`: html lang, font variables, metadata defaults, grain overlay, Nav, Footer, Lenis provider.
- [ ] Build Nav and Footer components.
- [ ] Add a private `/styleguide` page that renders the tokens, type scale, buttons, and a sample project row (proof the system works).
- [ ] Init git, push to GitHub, connect Vercel, confirm a live URL.

## Phase 2 — Motion primitives

- [ ] `components/motion/`: Reveal, Magnetic, Cursor, ScrollVelocity, Loader, PageTransition.
- [ ] All honor `prefers-reduced-motion` and disable cleanly on touch where relevant.
- [ ] Demo each on `/styleguide`.

## Phase 3 — Home

- [ ] Hero: big RANDALL wordmark, positioning line with a lime accent word, lead, two CTAs (magnetic).
- [ ] Tech marquee strip.
- [ ] Work as the editorial Index (default), with Gallery toggle.
- [ ] Cursor "View case" + row hover + reveal-on-scroll wired in.
- [ ] Footer CTA.

## Phase 4 — Work page (`/work`)

- [ ] Page head: "Things I've built" + capability range line.
- [ ] Sticky filter bar (All, AI, Full-Stack, Design, Client) with live count and reflow.
- [ ] Project blocks, alternating, app-screenshot visuals with parallax, reveal-on-scroll.
- [ ] FareWise featured first.

## Phase 5 — Case studies (`/work/[slug]`)

- [ ] Typed project data in `lib/projects.ts` from `docs/PROJECTS.md`.
- [ ] One reusable case-study template: problem, what I built, stack, my role, outcomes, live + repo links, next/prev project.
- [ ] Apply the client-data guardrail to Sana and Shaked (anonymized, dummy data only).

## Phase 6 — About and Contact

- [ ] About: the crossover story, bilingual + legal-tech, location, what I'm looking for.
- [ ] Contact: email, GitHub, LinkedIn, Contra, CV download (`public/cv.pdf`).

## Phase 7 — Polish, performance, SEO, a11y

- [ ] Replace placeholder visuals with real (anonymized where needed) `next/image` screenshots.
- [ ] Per-page metadata + dynamic Open Graph image (`next/og`).
- [ ] `sitemap.ts` and `robots.ts`.
- [ ] Add `@vercel/speed-insights` and `@vercel/analytics`.
- [ ] Keyboard pass, focus states, contrast check, alt text audit.
- [ ] Lighthouse / PageSpeed on mobile, fix regressions.

## Phase 8 — Launch

- [ ] Final cross-device QA (real phone).
- [ ] Custom domain when ready (until then, the .vercel.app URL is fine).
- [ ] Ship and share.

## Decisions still open

- [ ] Custom domain name (later, default Vercel URL for now).
- [ ] Final email address and the GitHub / LinkedIn / Contra URLs.
- [ ] Headshot or photo (optional).
- [ ] Final CV PDF.
- [ ] Confirm exactly what is safe to show for Sana and the Shaked Law Tool.
