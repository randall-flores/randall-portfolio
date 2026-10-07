# Portfolio Copy Rewrite — Design

**Date:** 2026-08-11
**Status:** approved, implemented. Revised 2026-10-06 (see below).

## Revision 2026-10-06: de-slop pass

An audit with Impeccable's detector plus a visual review found the copy clean
of banned words but wrapped in template chrome. Approved by Randall the same
day; plan in `docs/superpowers/plans/2026-10-06-de-slop-pass.md`. The
**Final copy** sections below are updated in place to match.

- Hero line "I build the whole product, not the front of it." was a "not X"
  construction. Now: "I build whole products and hand them over."
- About said "two of the five projects"; there are six.
- Every headline lost its single italic accent word (`built.`, `building.`,
  `whole build.`, `not the front of it.`).
- Cut as repeating nearby text: home project count, /work kicker and range
  list, card captions and hover labels, the "Featured" suffix, the About fact
  sidebar and its "What I'm looking for" kicker, the case-study year above the
  title, the Capabilities row, and the nav status ("Available" + clock).
- FareWise lost "the honest read" and "rather than mocked data". Hollow Ronin's
  outcomes stopped restating its build. Sana's tagline is a sentence.
- Meta strings join with commas, sentence case. No `·` separators in visible
  copy.

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
   explaining why two of the six projects are legal-workflow tools. Never a
   career-change story. Never the headline. The word "crossover" is retired.
3. **The hero's job is range**: he builds whole products and hands them over,
   proven with concrete artifacts, not adjectives.
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

**Banned display patterns** (added 2026-10-06):

- One word or phrase in a headline set apart in italic or colour
- Kicker or eyebrow labels above a heading
- Tracked uppercase or monospace labels; `·` joined meta strings
- "Name — what it is" captions
- Any label that repeats text within one screen of it

**Required:**

- Every claim names a technology, a number, or an artifact.
- If a sentence survives having its meaning deleted, cut it.
- Sentence case, active voice, no em dashes in prose.
- No promise that cannot be verified (no response-time claims).

## Final copy

### `app/page.tsx` — Home

Intro line, italic:

> Full-stack developer in San José, Costa Rica. Open to remote work.

`h2`:

> I build whole products and hand them over.

Lead:

> An AI flight search running on the Claude API. A production site for a client
> in Germany. A storefront wired to print-on-demand fulfillment. A hand-curated
> product feed on Supabase. Two apps built around data that has to stay
> private.

Buttons: `See the work` (filled), `Get in touch` (text link).

Section heading `Selected work`, with no count beside it. The orbit readout
under each project is `category, year`, plus "Anonymized screens" or
"Confidential" where the guardrail requires it.

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
> code for a living, which is why two of the six projects here are tools for
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

Closing `ab-look` section, no kicker:

> Remote full-stack roles and freelance projects where I own the whole build.

Button `Get in touch`. Portrait stays. The `facts` sidebar (Location,
Languages, Focus) is removed: the lead already states location and languages,
and "Focus: Full-stack" said nothing.

Metadata description:

> How Randall works: scoping and mockups before code, written changes, and full
> handover of the repository, deployment, and accounts.

Note: the paragraph beginning "Modern AI tooling is part of how I build" is
**deleted**, not rewritten. It ends in "The result is more shipped, not less
understood", and the AI-tooling claim it makes is already carried by FareWise
and Hollow Ronin in the work itself.

### `app/contact/page.tsx` — Contact

`h1`:

> Tell me what you're building.

Lead:

> Open to remote full-stack roles and freelance projects. Email reaches me
> fastest.

Metadata description:

> Get in touch with Randall. Open to remote full-stack roles and freelance
> projects. Email, GitHub, LinkedIn, Instagram, Contra, and CV.

### `app/work/page.tsx` — Work

`h1` "Things I've built." is plain and unpretentious and stays, without the
italic accent.

The kicker and the `range` list are removed (2026-10-06): the filter row
directly below names the same capabilities. Filters read `All, AI,
Full-stack, Design, Client`; the count reads `6 of 6`.

Metadata description:

> Selected work, 2025 to 2026. Full-stack builds, AI integration, design
> systems, headless commerce, and bilingual sites.

Work cards: title, italic `category, year`, description, the stack as one
comma-separated line, then `View case`. The only text on the image is the
guardrail flag.

### `app/work/[slug]/page.tsx` — Case studies

No changes. "The problem / What I built / My role / Outcomes" are conventional
wayfinding, and the two confidentiality notes keep "real" deliberately.

### Numbered markers

Third pass, same day, requested after the second deploy. The `01` markers on
`cs-num` and `p-num` promised that the order carried meaning a reader needed.
It did not: `01` only said FareWise is first in an array.

Superseded 2026-10-06: both `p-num` and `cs-num` are gone. On cards the year
rides on the category line (`AI product, full-stack, API integration, 2026`);
on case studies it lives only in the Role / Year / Stack row. "Featured" is
dropped: the full-width card already says it.

`components/work/WorkIndex.tsx` carries the same pattern at line 48 and was
**deliberately left alone**: nothing imports it, so it is dead code. Editing it
would imply it is maintained. Delete it or revive it, but do not maintain it.

### `lib/projects.ts`

Only the fields listed change. All other fields keep their current values.

`category` on every project is comma-separated and sentence case (2026-10-06), e.g. `AI product, full-stack, API integration`.

#### farewise

- `tagline`: Flight search that returns live fares and explains each one in plain language.
- `roleDetail`: Solo, end to end: the product concept, the interface, and the full build. That includes the SerpApi integration and the prompt design behind the per-fare analysis.
- `problem`: A fare list ranks prices. The reasons a cheap fare is cheap (two stops each way, an overnight arrival, a price so low the airline may cancel it) sit in the fine print, and that is where bad bookings happen.
- `whatIBuilt`: A round-trip search backed by live SerpApi fare data. Claude reads the results and writes a plain-language read: what each fare trades away, whether the price is typical for the route, and a warning when a fare looks like a mistake the airline can cancel.
- `outcomes`: SerpApi returns live fares and Claude writes the read on each one. The route summary states the typical price range, and suspiciously low fares carry an explicit mistake-fare warning.
- `description`: Flight search with live fares. SerpApi supplies the results, Claude explains each fare's trade-offs and flags likely mistake fares.
- `category`: AI product, full-stack, API integration

#### leonie-dubuc

- `tagline`: Production site for a German voice-over actress, with a custom liquid-glass design system and bilingual routing.
- `role`: Design and build for a client, in production.
- `roleDetail`: Design and build for a client: the visual identity, the design system, and the full Next.js implementation through to the production deploy on Vercel.
- `problem`: A working voice-over actress needed a presence that carried her brand in both English and German and satisfied German legal requirements. The site is where prospective clients form their first impression of her work.
- `outcomes`: Live in production. The design system holds across both languages, and the Impressum and Datenschutz pages cover what German law requires of a professional site.

#### hollow-ronin

- `roleDetail`: Founder, designer, and developer. The brand identity, the art direction, the storefront build, and the product pipeline, all of it solo.
- `problem`: Launch a drop-based streetwear brand with a strong identity and a working storefront, solo. That means brand design, a product pipeline, and commerce infrastructure with no team behind any of it.
- `whatIBuilt`: A headless Shopify storefront with Printify handling fulfillment, the full brand identity, and an art pipeline where Midjourney and Adobe Firefly generate and refine the artwork behind each drop.
- `outcomes`: The store is live with Drop 001 lined up. An order placed at the Shopify checkout goes straight to Printify for printing and shipping, with no manual step in between.

#### sana

- `tagline`: A bilingual companion app for personal-injury clients, with Supabase auth and full EN/ES parity.
- `outcomes`: Row-level security is enforced in Postgres rather than trusted to the UI, so a client can only ever reach their own records. The i18n structure keeps full parity across both languages.

#### caseflow

- `tagline`: Case management and records-request automation for a law firm, replacing repeated manual data entry.
- `roleDetail`: Design and build of an internal tool for a law firm, from mapping the existing workflow with the people running it to the version they use now.
- `whatIBuilt`: Records-request automation, document generation, and case management. Client details are entered once and flow into every generated packet. (The old version ended by restating its own Outcomes section one scroll later.)
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
- ~~`mediaCaption` values keep their " — " separator.~~ Removed 2026-10-06
  along with the field: the captions repeated the title beneath each card.
- `/work` page copy.
- The `facts` sidebar and portrait on /about.

## Verification

- `pnpm lint` and `pnpm build` pass.
- `grep -ri '\breal\b' app lib components` returns zero hits in visible copy.
- Grep for each banned word returns zero hits in visible copy.
- Visual check at 390px and 1440px that no new string overflows or wraps badly,
  particularly the four-sentence home lead and the About block lead-ins.
