# Design System

The locked visual identity for the portfolio. Read this before building any UI. The goal is a confident, editorial, type-led dark site with one sharp accent and purposeful motion. It should look designed, not templated.

## Aesthetic direction

Cool near-black canvas, generous whitespace, oversized Fraunces headlines, monospace metadata, hairline dividers, and a single electric-lime accent used sparingly for emphasis and interaction. Motion is calm by default and reactive on intent (hover, scroll, click). Reference feel: award-tier developer portfolios (precise, minimal, alive), executed in our own palette and voice.

## Color tokens

Define these as CSS variables in `app/globals.css` and map them into Tailwind (Tailwind v4: `@theme`; v3: `tailwind.config` theme.extend). Never hardcode hex in components.

```css
:root{
  --bg:           #0A0A0C;  /* cool near-black, page background */
  --bg-2:         #101014;  /* raised surfaces, cards */
  --fg:           #ECECE6;  /* warm off-white, primary text */
  --muted:        #7E7E78;  /* secondary text, metadata */
  --line:         rgba(236,236,230,0.12); /* dividers, borders */
  --line-soft:    rgba(236,236,230,0.06); /* faint dividers */
  --accent:       #C8F24E;  /* electric lime, the only accent */
  --accent-dim:   rgba(200,242,78,0.12);  /* accent washes/hover bleeds */
}
```

Contrast notes: `--fg` on `--bg` passes AA comfortably. Lime `--accent` is for large text, borders, dots, and fills, not small body copy. When the accent is a background (buttons, cursor pill), text on it is `#0A0A0C`.

## Typography

Load with `next/font/google` (no layout shift, self-hosted). Expose as CSS variables on `<html>`.

- Display: **Fraunces** (variable, optical size). Weights 400/500/600. Use for the wordmark, headlines, project titles. Italic is available and good for accent words (set in lime).
- Body / UI: **Hanken Grotesk**. Weights 400/500/600. Paragraphs, labels, nav.
- Mono: **JetBrains Mono**. Weights 400/500. Eyebrows, tags, years, counts, status, anything that should read as "data".

Type scale (fluid, mobile-first). Use `clamp()`:

```
wordmark      clamp(72px, 21vw, 300px)   line-height .82  tracking -.02em
h1 / page     clamp(56px, 13vw, 180px)   line-height .86
h2 / section  clamp(22px, 3vw, 34px)
project title clamp(36px, 5.5vw, 72px)
lead          clamp(16px, 2vw, 19px)     line-height 1.55
body          16px
mono label    11px to 13px               tracking .04em to .14em  UPPERCASE
```

## Spacing and layout

- Container max-width 1280px, side padding 30px (24px on small screens).
- Section rhythm: ~90px to 110px vertical between major sections, ~70px between large project blocks.
- Prefer asymmetry and a clear grid over centered-everything. Hairline dividers (`--line`) separate sections.
- Add a subtle film-grain overlay (fixed, pointer-events none, ~5% opacity, mix-blend overlay) for atmosphere over flat fills.

## Motion

Library: framer-motion for component motion, lenis for smooth scroll. Honor `prefers-reduced-motion` everywhere: disable the cursor, magnetic, velocity skew, and parallax, and fall back to instant or simple fades.

Build each as ONE reusable primitive in `components/motion/`:

1. **Loader** (`Loader.tsx`): full-screen intro, a counter ticks 0 to 100 in the display font, then the panel wipes up to reveal the page. Has a max-time fallback so it never hangs. Runs once per session.
2. **Cursor** (`Cursor.tsx`): a small dot that tracks instantly plus a ring that eases behind it. Over interactive elements with a `data-cursor` label, the ring grows into a lime pill showing the label ("View case", "Say hi"). Desktop fine-pointer only.
3. **Magnetic** (`Magnetic.tsx`): wraps a button or link; translates it slightly toward the cursor on hover, springs back on leave.
4. **Reveal** (`Reveal.tsx`): fade + rise into place when scrolled into view (use framer-motion `whileInView`, once: true). Stagger children for orchestrated entrances.
5. **ScrollVelocity** (`ScrollVelocity.tsx`): subtle skew/scale on a scrolling list driven by Lenis scroll velocity, settles to zero when idle. Keep it tasteful, max ~5deg.
6. **PageTransition** (`PageTransition.tsx`): a lime/near-black wipe between routes on navigation (App Router). Keep it under ~600ms.

Default ease: `cubic-bezier(.16,1,.3,1)`. Durations 0.3s for micro, 0.8s to 0.9s for entrances.

## Components

- **Nav**: fixed, blurred, hairline bottom border. Left wordmark "RANDALL." (period in lime). Center mono links. Right status pill with a pulsing lime dot and a live Costa Rica clock. Links hidden on small screens (hamburger or simplified).
- **Button**: two variants. Primary = lime fill, near-black text. Ghost = hairline border, lime border + text on hover. Mono label, uppercase, slight tracking. Both wrappable in Magnetic.
- **Project index row** (home `/`): grid of number, big Fraunces name, tags, year. Hover lights the row with an accent bleed, accentuates the number, nudges the name, and shows a preview. Cursor reads "View case".
- **Project card / gallery** (home toggle + `/work`): large tactile block, app-screenshot styling (chrome bar with three dots, ghosted initials that parallax), stack chips, "View case" link with an arrow that extends on hover.
- **Filter bar** (`/work`): sticky, mono pills (All, AI, Full-Stack, Design, Client), active pill is lime, live result count. Filtering reflows the list with a fade.
- **Footer**: big Fraunces CTA line with a lime-underlined link, then a mono row of email, GitHub, LinkedIn, Contra, CV download.

## Accessibility (build it in, do not bolt it on)

- Semantic landmarks: `header`, `main`, `nav`, `footer`, real heading order.
- Every image has meaningful `alt`. Decorative visuals get `alt=""`.
- All interactive elements reachable and operable by keyboard, with a visible focus ring (can be a lime outline).
- The custom cursor is cosmetic only; native focus and click behavior must still work, and the cursor is disabled for touch and reduced-motion users.
- Color is never the only signal (e.g. "Live" has a dot and a label, not just color).
- Respect `prefers-reduced-motion` for every animation listed above.
