# Portfolio Copy Rewrite — Design

**Date:** 2026-08-11
**Status:** approved, ready for implementation plan

## Problem

The site's copy reads as AI-generated. The concrete evidence, not a vibe:

- **The word "real" appears 22 times** across the visible copy. Real work, real
  workflows, real client, real pressure, real fares, real production use, real
  API integration, real security boundaries. One word carrying all the
  persuasion, which is why it stops persuading.
- **"hold up under real workflows"** appears three times near-verbatim: home
  hero, home meta description, and the About lead.
- **"Let's build something worth shipping"** is the footer `h2` on every page
  except /contact, and the `h1` of /contact. It is the most-seen line on the
  site and it reads as LinkedIn bait.
- Template constructions throughout: *Half developer, half operator*; *the
  result is more shipped, not less understood*; *freelance builds, and good
  problems*.
- **Defensive phrasing** that plants the accusation it denies: *"a working AI
  product rather than a demo"*, *"AI working as a production tool inside a real
  pipeline instead of a gimmick"*.
- **"Polished frontends"** in the hero undersells the work. Supabase row-level
  security, headless commerce, PDF generation and prompt design are not
  frontend.

## Positioning decisions

These were decided with Randall on 2026-08-11 and supersede the Positioning
section of `CLAUDE.md`.

1. **Audience: freelance clients first, hiring managers second.** Outcome-led
   copy, but every claim anchored to a technology, a number, or an artifact so
   an engineer reading it still nods.
2. **The pre-code decade appears exactly once**, on /about, doing one job:
   explaining why two of the five projects are legal-workflow tools. Never a
   career-change story. Never the headline. The word "crossover" is retired.
3. **The hero's job is range**: he builds the whole product, not the front of
   it, proven with four concrete artifacts rather than adjectives.
4. **/about argues "how I work"**, not "who I am". It answers what it is like
   to hire him.

## Voice rules

Applies to every string a visitor can read, including metadata descriptions.

**Banned words:** real, actually, hold up under, crossover, polished, ship /
shipping / shipped as a virtue, craft, journey, passionate, seamless, robust,
leverage, solutions.

**Banned constructions:**

- *Half X, half Y*
- "not X, but Y" aphorisms
- Lists of three where the third item is abstract
- Arguing with an accusation nobody made ("rather than a demo", "instead of a
  gimmick", "instead of template-built")
- Chiasmus and other cute symmetry ("it has to sound like her voice looks")

**Required:**

- Every claim names a technology, a number, or an artifact.
- If a sentence survives having its meaning deleted, cut it.
- Sentence case, active voice, no em dashes in prose.
- No promise that cannot be verified (no response-time claims).

## Final copy

### `app/page.tsx` — Home

Eyebrow, unchanged:

> Full-stack developer · Bilingual EN/ES · San José, CR · **Open to remote**

`h2`:

> I build the whole product, not the front of it.

Lead:

> An AI flight search running on the Claude API. A production site for a client
> in Germany. A storefront wired to print-on-demand fulfillment. Two apps built
> around data that has to stay private.

Buttons: `See the work` (was "See my work"), `Get in touch` unchanged.

Section heading `Selected work` unchanged.

Metadata description:

> Portfolio of Randall Flores, a full-stack developer in Costa Rica working in
> English and Spanish. AI products, client sites, storefronts, and internal
> tools.

### `components/layout/Footer.tsx`

`h2`, with the final word linking to /contact as it does now:

> Tell me what you're **building**

Deliberately the same sentence as the /contact `h1`. The footer asks the
question and the link leads to the page that asks it again. The footer already
hides itself on /contact, so the two never appear together.

### `app/about/page.tsx` — About

`h1`:

> How I work

Lead. This is the only place the pre-code decade appears anywhere on the site:

> I'm Randall, a full-stack developer in Costa Rica, working in English and
> Spanish. I spent about ten years in legal and operations work before I wrote
> code for a living, which is why two of the five projects here are tools for
> legal workflows.

Four blocks, replacing the three `ab-prose` paragraphs. Each has a bold lead-in:

> **Scoping.** Before I build anything I scope the idea and mock it up, then
> review the mock with you. Anything that changes gets written down while it
> still costs nothing to change.

> **When things change.** If something needs to change halfway through, I check
> what it affects, explain it, and tell you what it does to the timeline before
> I start on it.

> **What you get.** The project is yours. You paid for it, so you get all of it:
> the repository, the deployment, the accounts. I walk you through it and I stay
> available afterwards.

> **What I'll argue with.** I'll tell you when I think something is a bad idea,
> particularly around legal exposure, security, and how data gets stored. If a
> request puts you, the project, or me at risk, I say so before it's built.

Closing `ab-look` section:

> **What I'm looking for**
> Remote full-stack roles and freelance projects where I own the whole build.

Button `Get in touch` unchanged. Portrait and the `facts` sidebar (Location,
Languages, Focus) unchanged.

Metadata description:

> How Randall works: scoping and mockups before code, written changes, and full
> handover of the repository, deployment, and accounts.

Note: the paragraph beginning "Modern AI tooling is part of how I build" is
**deleted**, not rewritten. It ends in "The result is more shipped, not less
understood", and the AI-tooling claim it makes is already carried by FareWise
and Hollow Ronin in the work itself.

### `app/contact/page.tsx` — Contact

`h1`:

> Tell me what you're *building.*

Lead:

> Open to remote full-stack roles and freelance projects. Email reaches me
> fastest.

Metadata description:

> Get in touch with Randall. Open to remote full-stack roles and freelance
> projects. Email, GitHub, LinkedIn, Instagram, Contra, and CV.

### `app/work/page.tsx` — Work

No copy changes. "Things I've *built.*" is plain and unpretentious and stays.

### `lib/projects.ts`

Only the fields listed change. All other fields keep their current values.

#### farewise

- `tagline`: Flight search that reads a plain-language request and returns live fares.
- `roleDetail`: Solo, end to end: the product concept, the interface, and the full build. That includes the prompt design that turns free-form requests into structured queries, the SerpApi integration, and the results UI.
- `outcomes`: Two live integrations rather than mocked data: Claude interprets the request, SerpApi returns the fares. Ambiguous requests resolve to sensible queries, and the results stay readable when the fare data is messy.
- `description`: Flight search that reads a plain-language request and returns live fares. Claude interprets the request, SerpApi supplies the results.

#### vox

- `tagline`: Production site for a German voice-over actress, with a custom liquid-glass design system and bilingual routing.
- `role`: Design and build for a client, in production.
- `roleDetail`: Design and build for a client: the visual identity, the design system, and the full Next.js implementation through to the production deploy on Vercel.
- `problem`: A working voice-over actress needed a presence that carried her brand in both English and German and satisfied German legal requirements. The site is where prospective clients form their first impression of her work.
- `outcomes`: Live in production. The design system holds across both languages, and the Impressum and Datenschutz pages cover what German law requires of a professional site.

#### hollow-ronin

- `roleDetail`: Founder, designer, and developer. The brand identity, the art direction, the storefront build, and the product pipeline, all of it solo.
- `problem`: Launch a drop-based streetwear brand with a strong identity and a working storefront, solo. That means brand design, a product pipeline, and commerce infrastructure with no team behind any of it.
- `outcomes`: A live store built end to end: headless Shopify wired to Printify for fulfillment, a coherent brand, and Midjourney and Firefly generating the artwork behind each drop.

#### sana

- `outcomes`: Row-level security is enforced in Postgres rather than trusted to the UI, so a client can only ever reach their own records. The i18n structure keeps full parity across both languages.

#### caseflow

- `tagline`: Case management and records-request automation for a law firm, replacing repeated manual data entry.
- `roleDetail`: Design and build of an internal tool for a law firm, from mapping the existing workflow with the people running it to the version they use now.
- `outcomes`: In production at the firm. Generated document packets replaced hand-assembled ones, and client details are entered once instead of re-keyed across every form.

The `outcomes` rewrite for caseflow drops "the workflow it automates is one I
understood from the operator's side first", per positioning decision 2.

### `CLAUDE.md`

Replace the **Positioning** section with:

> Randall is a full-stack developer in Costa Rica, working in English and
> Spanish. The site is aimed at freelance clients first and hiring managers
> second: outcome-led copy, with every claim anchored to a technology, a number,
> or an artifact so an engineer reading it still nods.
>
> The argument is that he builds complete products alone and hands them over.
> Five in two years: an AI product, a client site in production, a headless
> storefront, and two apps built around private data.
>
> He worked about a decade in legal and operations before writing code. That
> appears exactly once on the site, on /about, as the reason two projects are
> legal-workflow tools. It is never a career-change story, never the headline,
> and never called a "crossover". Clients do not hire him for it.

In **Site structure**, change the /about line to:

> `/about` How I work: scoping, changes, handover, and what I push back on.

In **How to work with Randall**, add a pointer to the voice rules in this
document so they survive future sessions.

## Out of scope

- No layout, component, or styling changes. This is a copy pass only. If a new
  string does not fit its existing container at any breakpoint, that is a bug to
  report, not a licence to restyle.

  Two markup edits are required by the copy itself and are therefore in scope:
  the four About blocks each open with a `<strong>` lead-in inside the existing
  `<p>`, and the footer `h2` loses its `<br>` because the new sentence is one
  line. No CSS changes accompany either.
- `mediaCaption` values keep their existing " — " separator. It is a consistent
  display convention across all five projects, not prose.
- `/work` page copy.
- The `facts` sidebar and portrait on /about.

## Verification

- `pnpm lint` and `pnpm build` pass.
- `grep -ri '\breal\b' app lib components` returns zero hits in visible copy.
- Grep for each banned word returns zero hits in visible copy.
- Visual check at 390px and 1440px that no new string overflows or wraps badly,
  particularly the four-sentence home lead and the About block lead-ins.
