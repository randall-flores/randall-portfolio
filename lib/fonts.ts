import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";

// Display — Fraunces (variable serif). Drives the hero RANDALL wordmark, which
// is the home LCP element, so this is the ONLY font we preload. Italic is kept
// in the same instance so the lime accent words (em { font-style: italic })
// render in real Fraunces italic, not a synthesized slant.
// display:"swap" paints fallback text immediately; adjustFontFallback (on by
// default) + the serif fallback stack keep the swap from shifting layout.
// Italic lives in its own non-preloaded instance below — accent <em>s can
// swap in late, and dropping it from the preload path halves the font bytes
// competing with first paint.
export const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal"],
  display: "swap",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
  variable: "--font-fraunces",
});

// Fraunces italic — the lime accent words only (em inside display headings).
// Not preloaded: never the LCP, always mid-heading, swaps in cleanly.
export const frauncesItalic = Fraunces({
  subsets: ["latin"],
  style: ["italic"],
  display: "swap",
  preload: false,
  fallback: ["Georgia", "Times New Roman", "serif"],
  variable: "--font-fraunces-it",
});

// Body / UI — Hanken Grotesk. Not preloaded: body copy sits below the hero and
// is not the LCP, so we keep preload bandwidth on Fraunces. Swaps in cleanly.
export const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  fallback: ["system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
  variable: "--font-hanken",
});

// Mono — JetBrains Mono. Eyebrows, tags, metadata. Not needed for first paint,
// so not preloaded.
export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
  variable: "--font-jetbrains",
});

// Convenience: every font variable, ready to drop on <html className>.
export const fontVariables = `${fraunces.variable} ${frauncesItalic.variable} ${hanken.variable} ${jetbrains.variable}`;
