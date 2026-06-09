// Typed project data, modeled from docs/PROJECTS.md.
// Used by the home Work index now, and the /work + /work/[slug] pages later.
// Client-data guardrail: `confidential` projects show anonymized, dummy
// content only — never real client names or case data.

export type Capability = "ai" | "fullstack" | "design" | "client";
export type Visibility = "public" | "confidential";

// Status shown on the /work card media: a live site, or a guardrail marker for
// confidential projects (anonymized screens / fully confidential).
export type ProjectStatus = "live" | "anonymized" | "confidential";

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  capabilities: Capability[];
  stack: string[];
  role: string;
  problem: string;
  whatIBuilt: string;
  outcomes: string;
  links: { live?: string; repo?: string };
  visibility: Visibility;
  featured?: boolean;
  // Home / Work index display fields
  year: number;
  live?: boolean; // show the "● Live" marker
  tags: string[]; // short display tags (the case study carries the full stack)
  gradient: string; // placeholder visual until real screenshots land (Phase 7)
  wide?: boolean; // spans full width in the Gallery view
  // /work page display fields
  description: string; // one-to-two sentence card blurb
  category: string; // mono category line, e.g. "AI Product · Full-Stack"
  initials: string; // ghosted monogram on the app-screenshot visual
  mediaCaption: string; // small caption inside the visual
  status?: ProjectStatus; // dot marker on the visual (omit for none)
  // Preview video in the Work card media area. Assets live in public/cards/ as
  // {slug}.webm, {slug}.mp4, {slug}-poster.jpg. Omit to keep the static poster.
  video?: boolean;
};

export const projects: Project[] = [
  {
    slug: "farewise",
    title: "FareWise",
    tagline:
      "AI flight search that turns plain-language travel intent into real fare options.",
    capabilities: ["ai", "fullstack"],
    stack: ["Next.js", "TypeScript", "Claude API", "SerpApi"],
    role: "Design and build, end to end.",
    problem:
      "Flight search is tedious and rigid. People think in intent (\"cheap and direct, mid-March, flexible by a day\"), not in form fields.",
    whatIBuilt:
      "A search experience that interprets natural-language intent with the Claude API and pulls live results through SerpApi, then presents fares clearly.",
    outcomes: "Practical AI product, real API integration, clean results UI.",
    links: {},
    visibility: "public",
    featured: true,
    year: 2025,
    tags: ["AI Product", "Claude API", "SerpApi"],
    gradient: "linear-gradient(135deg,#1a2030,#0d1118)",
    description:
      "An AI-powered flight search that turns plain-language travel intent into real fare options. Built on the Claude API for reasoning and SerpApi for live results.",
    category: "AI Product · Full-Stack · API Integration",
    initials: "FW",
    mediaCaption: "FareWise — AI flight results",
    video: true,
  },
  {
    slug: "vox",
    title: "Vox",
    tagline:
      "Production site for a German voice-over actress. A custom liquid-glass design system, bilingual, shipped.",
    capabilities: ["design", "client"],
    stack: ["Next.js", "Tailwind", "framer-motion", "i18n (EN/DE)", "Vercel"],
    role: "Design and build for a real client, in production.",
    problem:
      "A voice-over actress needed a distinctive, professional presence with bilingual reach and German legal compliance.",
    whatIBuilt:
      "A custom liquid-glass design system, magnetic hover interactions, bilingual EN/DE routing, and German legal compliance pages (Impressum, Datenschutz).",
    outcomes:
      "Design craft, internationalization, a real client site live in production.",
    links: { live: "https://leonie-dubuc.vercel.app" },
    visibility: "public",
    year: 2025,
    live: true,
    tags: ["Voice-over", "Design System", "EN/DE"],
    gradient: "linear-gradient(135deg,#171225,#241b33)",
    description:
      "Production site for a German voice-over actress. A custom liquid-glass design system, magnetic interactions, bilingual routing, and German legal compliance pages.",
    category: "Client · Design System · EN/DE",
    initials: "VX",
    mediaCaption: "Vox — Live",
    status: "live",
    video: true,
  },
  {
    slug: "hollow-ronin",
    title: "Hollow Ronin",
    tagline:
      "Drop-based streetwear brand built end to end on headless commerce, with AI-generated art.",
    capabilities: ["design", "fullstack"],
    stack: ["Headless Shopify", "Printify", "Next.js", "Midjourney", "Adobe Firefly"],
    role: "Founder, designer, developer. End-to-end brand and store.",
    problem:
      "Launch a drop-based streetwear brand with a strong identity and a real storefront, solo.",
    whatIBuilt:
      "A headless Shopify + Printify storefront, the brand identity, and an AI-driven art pipeline for the drops.",
    outcomes:
      "Headless commerce, full brand build, AI in a real production pipeline.",
    links: {},
    visibility: "public",
    year: 2025,
    tags: ["Headless Shopify", "Printify", "Brand"],
    gradient: "linear-gradient(120deg,#161616,#21201a,#101010)",
    wide: true,
    description:
      "A drop-based streetwear brand built end to end on headless Shopify and Printify, with AI-generated art driving the visual identity.",
    category: "Brand · Headless Commerce · Design",
    initials: "HR",
    mediaCaption: "Hollow Ronin — Drop store",
    video: true,
  },
  {
    slug: "sana",
    title: "Sana",
    tagline:
      "A bilingual personal-injury companion app. Full-stack, auth, internationalized.",
    capabilities: ["fullstack"],
    stack: ["Next.js", "Tailwind", "shadcn/ui", "next-intl", "Supabase (RLS)"],
    role: "Full-stack design and build.",
    problem:
      "Personal-injury clients are anxious and underinformed. They need a calm, bilingual companion to understand their situation and next steps.",
    whatIBuilt:
      "A bilingual (EN/ES) app with Supabase authentication and row-level security, internationalized with next-intl, built on Next.js and shadcn/ui.",
    outcomes: "Full-stack, real auth with RLS, i18n.",
    links: {},
    visibility: "confidential",
    year: 2025,
    tags: ["Full-stack", "Supabase RLS", "next-intl"],
    gradient: "linear-gradient(135deg,#0f1a17,#13241f)",
    description:
      "A bilingual personal-injury companion app. Next.js front to back, Supabase auth with row-level security, and next-intl for EN/ES. Screens anonymized.",
    category: "Full-Stack · Auth · i18n",
    initials: "SA",
    mediaCaption: "Sana — Anonymized",
    status: "anonymized",
    video: true,
  },
  {
    slug: "caseflow",
    title: "Caseflow",
    tagline:
      "Case management and records-request automation. An internal tool that removes manual steps from a real legal workflow.",
    capabilities: ["fullstack", "client"],
    stack: ["Next.js", "React", "TypeScript", "Tailwind", "PDF generation", "Vercel"],
    role: "Design and build of an internal firm tool.",
    problem:
      "A law firm's records-request and case-management workflow was repetitive and manual.",
    whatIBuilt:
      "Automation for records requests and document generation, plus case management, that removes repetitive manual steps.",
    outcomes:
      "Solving a real workflow, document automation, internal production use.",
    links: {},
    visibility: "confidential",
    year: 2024,
    tags: ["Internal", "Doc Automation", "Confidential"],
    gradient: "linear-gradient(135deg,#1a1518,#231a1d)",
    description:
      "Case management and records-request automation for a law firm. Generates documents and removes repetitive manual steps from a real legal workflow. Fully anonymized.",
    category: "Internal · Workflow · Document Automation",
    initials: "CF",
    mediaCaption: "Internal tool — Confidential",
    status: "confidential",
    video: true,
  },
];
