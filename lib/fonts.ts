import { Bodoni_Moda, Fragment_Mono, Karla } from "next/font/google";

// Display — Bodoni Moda (variable didone). Drives the hero RANDALL wordmark,
// which is the home LCP element, so this is the ONLY font we preload.
//
// The opsz axis matters more here than weight. Bodoni's display cut (opsz 96)
// draws its hairlines for billboard sizes and they disappear over the field, so
// the wordmark and headings run at LOW optical sizes — the sturdier text cut of
// the same letterforms. Those values live in app/globals.css, not here.
//
// display:"swap" paints fallback text immediately; adjustFontFallback (on by
// default) plus the serif fallback stack keep the swap from shifting layout.
export const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal"],
  display: "swap",
  preload: true,
  fallback: ["Didot", "Georgia", "Times New Roman", "serif"],
  variable: "--font-bodoni",
});

// Display italic — accent words only (em inside display headings). Not
// preloaded: never the LCP, always mid-heading, swaps in cleanly.
export const bodoniItalic = Bodoni_Moda({
  subsets: ["latin"],
  style: ["italic"],
  display: "swap",
  preload: false,
  fallback: ["Didot", "Georgia", "Times New Roman", "serif"],
  variable: "--font-bodoni-it",
});

// Body / UI — Karla. Slightly quirky grotesque; its wider apertures keep body
// copy readable at small sizes against the didone's high contrast. Not
// preloaded: body copy sits below the hero and is not the LCP.
export const karla = Karla({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  fallback: ["system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
  variable: "--font-karla",
});

// Mono — Fragment Mono. Eyebrows, tags, metadata. Now that the tag outlines are
// gone, this carries all the metadata on its own. Not needed for first paint.
export const fragment = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
  variable: "--font-fragment",
});

// Convenience: every font variable, ready to drop on <html className>.
export const fontVariables = `${bodoni.variable} ${bodoniItalic.variable} ${karla.variable} ${fragment.variable}`;
