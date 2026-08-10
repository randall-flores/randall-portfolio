import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/site";
import { Grain } from "@/components/layout/Grain";
import { Field } from "@/components/motion/Field";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { MotionProvider } from "@/components/providers/MotionProvider";

export const metadata: Metadata = {
  // metadataBase resolves relative URLs (OG images, etc). Set from lib/site.ts
  // — update SITE_URL there when a custom domain is added.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Randall",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    url: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body>
        {/* Reveal renders SSR content at opacity 0 and animates it in with
            JS. Without JS that would blank every section, so force-visible
            (stylesheet !important beats the inline style). */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {/* Keyboard users jump straight past nav to the page content. */}
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Field />
        <Grain />
        <Nav />
        <SmoothScroll>
          <MotionProvider>
            {children}
            <Footer />
          </MotionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
