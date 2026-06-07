# Projects

Content for the five featured projects. Model this as typed data in `lib/projects.ts`. Each project has a slug, title, tagline, capabilities (used by the `/work` filters), stack, role, the case-study fields, links, and a visibility flag.

Capabilities vocabulary (for filters): `ai`, `fullstack`, `design`, `client`.
Visibility: `public` (show freely) or `confidential` (anonymized screenshots, dummy data only, no real client info).

Fill the blanks marked TODO with Randall before publishing.

---

## 1. FareWise

- **slug:** farewise
- **featured:** yes (lead project, AI-forward)
- **tagline:** AI flight search that turns plain-language travel intent into real fare options.
- **capabilities:** ai, fullstack
- **stack:** Next.js, TypeScript, Claude API, SerpApi
- **role:** Design and build, end to end.
- **problem:** Flight search is tedious and rigid. People think in intent ("cheap and direct, mid-March, flexible by a day"), not in form fields.
- **what I built:** A search experience that interprets natural-language intent with the Claude API and pulls live results through SerpApi, then presents fares clearly.
- **outcomes / highlights:** Practical AI product, real API integration, clean results UI.
- **links:** live TODO, repo TODO
- **visibility:** public

## 2. Leonie Dubuc

- **slug:** leonie-dubuc
- **tagline:** Production site for a German voice-over actress. A custom liquid-glass design system, bilingual, shipped.
- **capabilities:** design, client
- **stack:** Next.js, Tailwind, framer-motion, i18n (EN/DE), Vercel
- **role:** Design and build for a real client, in production.
- **problem:** A voice-over actress needed a distinctive, professional presence with bilingual reach and German legal compliance.
- **what I built:** A custom "liquid-glass" design system, magnetic hover interactions, bilingual EN/DE routing, and German legal compliance pages (Impressum, Datenschutz).
- **outcomes / highlights:** Design craft, internationalization, a real client site live in production.
- **links:** live https://leonie-dubuc.vercel.app , repo TODO (confirm if public)
- **visibility:** public (client site is already live; do not add private client details beyond what is public)

## 3. Hollow Ronin

- **slug:** hollow-ronin
- **tagline:** Drop-based streetwear brand built end to end on headless commerce, with AI-generated art.
- **capabilities:** design, fullstack
- **stack:** Headless Shopify, Printify, Next.js, AI art (Midjourney, Adobe Firefly)
- **role:** Founder, designer, developer. End-to-end brand and store.
- **problem:** Launch a drop-based streetwear brand with a strong identity and a real storefront, solo.
- **what I built:** A headless Shopify + Printify storefront, the brand identity, and an AI-driven art pipeline for the drops.
- **outcomes / highlights:** Headless commerce, full brand build, AI in a real production pipeline.
- **links:** live TODO, repo TODO
- **visibility:** public

## 4. Sana

- **slug:** sana
- **tagline:** A bilingual personal-injury companion app. Full-stack, auth, internationalized.
- **capabilities:** fullstack  (add `ai` only if it actually ships AI features)
- **stack:** Next.js, Tailwind, shadcn/ui, next-intl, Supabase auth with row-level security
- **role:** Full-stack design and build.
- **problem:** Personal-injury clients are anxious and underinformed. They need a calm, bilingual companion to understand their situation and next steps.
- **what I built:** A bilingual (EN/ES) app with Supabase authentication and row-level security, internationalized with next-intl, built on Next.js and shadcn/ui.
- **outcomes / highlights:** Full-stack, real auth with RLS, i18n.
- **links:** live TODO (confirm if public), repo TODO
- **visibility:** confidential — anonymized screenshots and dummy content only, no real case data or client details. Confirm with Randall what is safe to show.

## 5. Shaked Law Tool

- **slug:** shaked-law-tool
- **tagline:** Case management and records-request automation. An internal tool that removes manual steps from a real legal workflow.
- **capabilities:** fullstack, client
- **stack:** Next.js, React, TypeScript, Tailwind, PDF generation / document automation, Vercel
- **role:** Design and build of an internal firm tool.
- **problem:** A law firm's records-request and case-management workflow was repetitive and manual.
- **what I built:** Automation for records requests and document generation, plus case management, that removes repetitive manual steps.
- **outcomes / highlights:** Solving a real workflow, document automation, internal production use.
- **links:** internal, no public link; repo private
- **visibility:** confidential — fully anonymized. Generic UI screenshots only, no real firm name, client names, or case data. When in doubt, leave it out.
