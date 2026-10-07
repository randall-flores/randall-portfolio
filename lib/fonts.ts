import { Bodoni_Moda, Newsreader } from "next/font/google";

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

// Body, UI and metadata — Newsreader, a text serif with its own optical-size
// axis. A didone headline over a serif text face is the magazine pairing; it
// replaced Karla (body) and Fragment Mono (metadata), whose sans-plus-mono
// combination read as template. Metadata is set in the italic, so the one
// family carries every role below the display. Not preloaded: body copy sits
// below the wordmark and is never the LCP.
export const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  preload: false,
  fallback: ["Georgia", "Times New Roman", "serif"],
  variable: "--font-news",
});

// Convenience: every font variable, ready to drop on <html className>.
export const fontVariables = `${bodoni.variable} ${newsreader.variable}`;
