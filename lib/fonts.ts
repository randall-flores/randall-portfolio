import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";

// Display — Fraunces (variable serif, optical size). Wordmark, headlines,
// project titles. Italic is loaded for lime accent words.
export const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-fraunces",
});

// Body / UI — Hanken Grotesk. Paragraphs, labels, nav.
export const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hanken",
});

// Mono — JetBrains Mono. Eyebrows, tags, years, counts, status, "data".
export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

// Convenience: every font variable, ready to drop on <html className>.
export const fontVariables = `${fraunces.variable} ${hanken.variable} ${jetbrains.variable}`;
