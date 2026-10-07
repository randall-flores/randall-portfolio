# De-slop Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove every AI-template tell the 2026-10-06 audit found, swap the body face to Newsreader, and cut text that does no work.

**Architecture:** Type and metadata live in `lib/fonts.ts` + `app/globals.css`; copy lives in page files and `lib/projects.ts`. Changes are token- and class-level so one edit fixes every page that uses the role.

**Tech Stack:** Next.js 16 App Router, Tailwind v4, next/font/google.

**Spec:** Audit in this session (Impeccable detector, desktop 1280x800 + mobile 390x844, plus screenshots). Copy rules: `CLAUDE.md` and `docs/superpowers/specs/2026-08-11-portfolio-copy-rewrite-design.md`.

## Global Constraints

- Display face stays Bodoni Moda with its opsz axis. Body + metadata become Newsreader (opsz axis). Karla and Fragment Mono are removed.
- No monospace, no tracked uppercase labels, no `·` joined meta strings, no "Name — fragment" captions.
- No single italic/silver accent word inside a headline.
- No status dot, no live clock, no pill buttons with uppercase labels.
- Silver `#C3CAD3` stays the only accent. No new colours.
- Banned words/constructions from CLAUDE.md apply to every string touched. No em dashes in prose.
- Functional text never below 14px.
- `pnpm lint` and `pnpm build` pass before each commit.

## Review Focus

1. Text over the bright nebula on the right side of the viewport must stay readable (body text-shadow stays).
2. Mobile 390px nav: wordmark on one line, menu button reachable.
3. Bodoni italic instance is still needed for `.cs`/other uses; remove only if nothing references `--font-bodoni-it`.
4. Font swap must not shift the LCP wordmark (Bodoni preload unchanged).
5. Confidential/anonymized status must still show on cards and case studies (client-data guardrail).

---

### Task 1: Newsreader replaces Karla and Fragment Mono

**Files:** Modify `lib/fonts.ts`, `app/globals.css` (tokens, body, every rule using `--font-fragment`)

- [ ] Replace `karla` and `fragment` exports with `newsreader` (`Newsreader`, `axes: ["opsz"]`, `style: ["normal","italic"]`, `display: "swap"`, `preload: false`, variable `--font-news`).
- [ ] `--font-body: var(--font-news), Georgia, serif;` and `--font-mono` removed from `@theme`. `body` uses `var(--font-news)` at 18px.
- [ ] Every rule using `--font-fragment`: switch to `--font-news`, drop `text-transform: uppercase` and positive letter-spacing, raise size to 15 to 16px. Metadata roles (kick, p-cat, orbit-meta, cs-status, cg-cap, cs-meta label, cs-nav dir, fcount, ct-copied) get `font-style: italic`.
- [ ] Bump body-copy roles one step for Newsreader's smaller x-height.
- [ ] `pnpm lint && pnpm build`, commit `feat: set body and metadata in Newsreader, drop Karla and Fragment Mono`.

### Task 2: Nav, buttons, headline accents

**Files:** `components/layout/Nav.tsx`, `components/ui/button.tsx`, `app/page.tsx`, `app/work/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `components/layout/Footer.tsx`, `app/globals.css`

- [ ] Remove the status dot, "Available", and the clock (and its effect). Remove `@keyframes pulse`.
- [ ] Nav links + footer links in Newsreader, sentence case.
- [ ] Button: 3px radius, sentence case, Newsreader 17px medium. Ghost variant becomes a text link with the hover-grown underline.
- [ ] Remove `<em>` accents from headlines: home hero, `/work` h1, about `.ab-look`, `/contact` h1.
- [ ] Hero line becomes "I build whole products and hand them over."
- [ ] Commit `feat: drop status clock, pill buttons and accent italics`.

### Task 3: Cut text that does no work

- [ ] Home: meta line becomes "Full-stack developer in San José, Costa Rica. Open to remote work." Remove "6 projects · 2025—2026".
- [ ] `/work`: remove the kicker and the capability list (the filters below say the same). Count reads "6 of 6".
- [ ] Work cards: remove the hover "View case" label, the "Featured" suffix, and the caption except the guardrail flag (Anonymized / Confidential). Stack chips become one comma-separated line.
- [ ] Orbit readout: category and year only, plus the guardrail flag. No dot, no `·`.
- [ ] About: remove the facts aside (lead already says location and languages) and the "What I'm looking for" kicker. "five projects" becomes "six projects".
- [ ] Case study: remove the year above the title (the meta row has it) and the Capabilities row. Status loses its dot.
- [ ] Commit `feat: cut labels and captions that repeat nearby text`.

### Task 4: Copy slop in project data

**Files:** `lib/projects.ts`

- [ ] Categories use commas, sentence case.
- [ ] FareWise `whatIBuilt` "the honest read" becomes "a plain-language read"; `outcomes` drops "rather than mocked data".
- [ ] Hollow Ronin `outcomes` stops repeating `whatIBuilt`.
- [ ] Sana `tagline` stops being a fragment list.
- [ ] Remove `mediaCaption` field and its type.
- [ ] Commit `fix: project copy that repeated itself or argued with nobody`.

### Task 5: Detector findings

- [ ] Portal ring glow: blue `rgba(180,210,255)` becomes silver `rgba(var(--accent-rgb))`.
- [ ] Active orbit card: shadow only, no inset hairline.
- [ ] Featured card `sizes` matches its 1220px frame.
- [ ] Commit `fix: neutral portal glow, single-edge orbit card, sharp featured still`.

### Task 6: Docs + verification

- [ ] Rewrite the typography, button and nav sections of `docs/DESIGN-SYSTEM.md` to match what ships.
- [ ] Rerun the detector desktop + mobile; rerun screenshots; one fix round max.
- [ ] Commit `docs: design system matches the de-slop pass`.
