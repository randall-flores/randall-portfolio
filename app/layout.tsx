import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { Grain } from "@/components/layout/Grain";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/providers/SmoothScroll";

export const metadata: Metadata = {
  metadataBase: new URL("https://randall-portfolio.vercel.app"),
  title: {
    default: "Randall — Frontend & Full-Stack Developer",
    template: "%s — Randall",
  },
  description:
    "Bilingual (EN/ES) frontend and full-stack developer in Costa Rica. Polished web apps that hold up under real workflows.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Randall",
    title: "Randall — Frontend & Full-Stack Developer",
    description:
      "Bilingual (EN/ES) frontend and full-stack developer in Costa Rica. Polished web apps that hold up under real workflows.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body>
        <Grain />
        <Nav />
        <SmoothScroll>
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
