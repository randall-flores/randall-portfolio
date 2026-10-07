# Design System

The locked visual identity for the portfolio. Read this before building any UI. The goal is a confident, editorial, type-led dark site with one accent and purposeful motion. It should look designed, not templated.

## Aesthetic direction

A live, cinematic background (a silver nebula rendered in WebGL, with a red bokeh light-field that comes through it as you scroll) under quiet, type-led content. Near-black canvas, generous whitespace, oversized Bodoni headlines over a serif text face, and a silver accent. The background carries the drama so the content does not have to. Motion is calm by default and reactive on intent (hover, scroll, click).

Reference: the Tau Ceti and astrophage sequences in *Project Hail Mary*: a slow-flowing field, lens bokeh with flat interiors and bright rims, and light that reads as a single-channel sensor image rather than a colour filter.

## Color tokens

Defined as CSS variables in `app/globals.css` and mapped into Tailwind through `@theme`. Never hardcode hex in components.

```css
:root{
  --bg:         #06070A;                  /* near-black, page background */
  --bg-rgb:     6, 7, 10;                 /* for scrims and plates */
  --bg-2:       rgba(233,235,239,0.05);   /* film lit by the field */
  --fg:         #E9EBEF;                  /* cool off-white, primary text */
  --muted:      #8A929C;                  /* secondary text, metadata */
  --line:       rgba(233,235,239,0.12);
  --line-soft:  rgba(233,235,239,0.08);
  --accent:     #C3CAD3;                  /* silver, the only accent */
  --accent-rgb: 195, 202, 211;

  /* the field's five ramp stops, mirror of SILVER_RAMP in lib/field.ts */
  --field-void: #06070A;
  --field-deep: #171A20;
  --field-mid:  #3C424B;
  --field-soft: #A6AEB8;
  --field-foam: #F0F2F5;
}
```

Chroma is deliberately low across the whole palette: the red light-field is the only saturated thing on screen, and it only appears on scroll. Glows (the portal ring) use the silver accent, never a tinted white.

Content below the first viewport sits on a scrim painted on `<main>` with a full-bleed `border-image`, and `<footer>` continues its end value, so no panel edge ever shows over the field.

## The field (`components/motion/Field.tsx`, `lib/field.ts`)

One component owns the only `requestAnimationFrame` loop on the page.

- **Nebula**: a WebGL fragment shader, domain-warped fbm over the silver ramp. Follows the cursor, shifts with scroll, blooms under whatever is hovered or focused, ripples on click, and desaturates while the mobile menu is open.
- **Cloud**: lens-bokeh particles in four depth layers, additive, `mix-blend-mode: screen`. Driven by scroll, hard-capped at 0.88.
- **Portal**: first visit per session opens an aperture while the cloud is pushed radially outward.

Skipped entirely for `prefers-reduced-motion` and on touch phones, which get the static CSS gradient fallback in the same ramp.

## Typography

Two families, both loaded with `next/font/google` (`lib/fonts.ts`).

- **Display: Bodoni Moda** (variable, opsz axis). Wordmark, page titles, project titles, section heads. Runs at LOW optical sizes (14 to 34) so the hairlines survive over the field. Only Bodoni is preloaded: the RANDALL wordmark is the home LCP.
- **Body, UI and metadata: Newsreader** (variable, opsz axis, roman and italic). Paragraphs, nav, buttons, links. Metadata (categories, years, captions, labels, counts) is set in the italic, sentence case, in `--muted`.

A didone headline over a text serif is the magazine pairing. It replaced Karla + Fragment Mono, whose sans-plus-monospace metadata read as template.

Rules:

- No monospace anywhere. No tracked uppercase labels. No `·` joined meta strings: join with commas.
- No italic or coloured accent word inside a headline. Headlines are one voice.
- No eyebrow/kicker label above a heading.
- Functional text is never below 14px. Body is 18px, line-height 1.55.

Type scale (fluid, mobile-first):

```
wordmark      min((100vw - pad) / 5.15, 236px)  line-height .82
h1 / page     clamp(56px, 13vw, 180px)          line-height .86
section head  clamp(22px, 3vw, 34px)            line-height 1.12
project title clamp(36px, 5.5vw, 72px)
lead          clamp(19px, 2vw, 21px)            line-height 1.5
body          18px                              line-height 1.55
metadata      15px to 17px italic
```

## Spacing and layout

- Container max-width 1280px, side padding 30px (24px on small screens).
- Section rhythm ~90px to 110px between major sections.
- Asymmetry and a clear grid over centered-everything. Whitespace separates sections, not rules.
- Film-grain overlay (fixed, pointer-events none, ~5% opacity, overlay blend).

## Motion

No animation library: entrances, magnetic hover and the field are owned in-repo. Lenis for smooth scroll. Honor `prefers-reduced-motion` everywhere.

- **Reveal** (`components/motion/Reveal.tsx`): fade + rise on scroll, CSS-driven from one IntersectionObserver class.
- **Magnetic** (`components/motion/Magnetic.tsx`): wraps a button, drifts toward the cursor, springs back.
- Above-the-fold content uses the CSS `.rise` entrance, never a JS-gated reveal.

Default ease: `cubic-bezier(.16,1,.3,1)`.

## Components

- **Nav**: fixed, blurred. Left wordmark "RANDALL FLORES". Right, sentence-case links in Newsreader; the current page is italic in `--fg`. No status dot, no clock. Hamburger + overlay on small screens.
- **Button** (`components/ui/button.tsx`): primary is a silver fill with a 3px corner and a sentence-case Newsreader label. Ghost is not a box: a plain text link whose underline grows on hover (`.ulink`). One filled action per group.
- **Orbit carousel** (home): project stills on a ring, title under it, then an italic line `category, year`, plus "Anonymized screens" or "Confidential" where the guardrail requires it.
- **Work card** (`/work`): screenshot with the phone capture overlapping, then title, italic `category, year`, description, the stack as one comma-separated line, and "View case". The only caption on the image is the guardrail flag.
- **Filter bar** (`/work`): sticky, sentence-case text buttons, live count `n of 6`.
- **Footer**: big Bodoni line "Tell me what you're building" with the link on "building", then sentence-case links with icons.

## Accessibility

- Semantic landmarks, real heading order, skip link.
- Every image has meaningful `alt`; decorative visuals get `alt=""`.
- All interactive elements keyboard reachable with a visible silver focus ring.
- Color is never the only signal.
- Respect `prefers-reduced-motion` for everything above.
