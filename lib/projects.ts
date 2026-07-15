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
  role: string; // short form, shown in the case-study meta row
  roleDetail: string; // full prose for the "My role" section
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
    roleDetail:
      "Solo project, end to end: the product concept, the interface design, and the full build. That includes the prompt design that turns free-form requests into structured queries, the SerpApi integration, and the results UI.",
    problem:
      "Flight search is tedious and rigid. People think in intent (\"cheap and direct, mid-March, flexible by a day\"), not in form fields. Translating that intent into a dozen filter clicks is exactly the friction that makes people settle for a worse fare.",
    whatIBuilt:
      "A search experience that takes a plain-language request, interprets it with the Claude API, and turns it into structured search parameters. SerpApi supplies live fare data, and the results UI presents the trade-offs plainly instead of burying them in filter tabs.",
    outcomes:
      "A working AI product rather than a demo: real API integration on both ends, sensible handling of vague or ambiguous requests, and a results UI that stays readable when the fare data gets messy.",
    links: {},
    visibility: "public",
    featured: true,
    year: 2026,
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
    roleDetail:
      "Design and build for a real client: the visual identity, the design system, and the full Next.js implementation through to the production deploy on Vercel.",
    problem:
      "A working voice-over actress needed a professional presence that could carry her brand in two languages, meet German legal requirements, and still feel distinctive instead of template-built. Her site is her storefront — it has to sound like her voice looks.",
    whatIBuilt:
      "A custom liquid-glass design system with magnetic hover interactions, bilingual EN/DE routing, and the German legal compliance pages (Impressum, Datenschutz). Built on Next.js with Tailwind and framer-motion.",
    outcomes:
      "A real client site, live in production. The design system holds together across both languages, the motion work gives it a signature feel, and the compliance pages cover what a professional site in Germany legally needs.",
    links: { live: "https://vox-voiceover.vercel.app" },
    visibility: "public",
    year: 2026,
    tags: ["Voice-over", "Design System", "EN/DE"],
    gradient: "linear-gradient(135deg,#171225,#241b33)",
    description:
      "Production site for a German voice-over actress. A custom liquid-glass design system, magnetic interactions, bilingual routing, and German legal compliance pages.",
    category: "Client · Design System · EN/DE",
    initials: "VX",
    mediaCaption: "Vox — Production site",
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
    roleDetail:
      "Founder, designer, and developer. The brand identity, the art direction, the storefront build, and the product pipeline — all of it solo.",
    problem:
      "Launch a drop-based streetwear brand with a strong identity and a real storefront, solo. That means brand design, a product pipeline, and commerce infrastructure with no team behind any of it.",
    whatIBuilt:
      "A headless Shopify storefront with Printify handling fulfillment, the full brand identity, and an AI-driven art pipeline (Midjourney, Adobe Firefly) that generates and refines the artwork behind each drop.",
    outcomes:
      "A live store built end to end: headless commerce wired to print-on-demand fulfillment, a coherent brand, and AI working as a production tool inside a real pipeline instead of a gimmick.",
    links: { live: "https://hollowronin.com" },
    visibility: "public",
    year: 2026,
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
    roleDetail:
      "Full-stack design and build: the information architecture, the interface, the auth and data-access model, and the bilingual content structure.",
    problem:
      "Personal-injury clients are anxious and underinformed, and many navigate the process in Spanish while the paperwork happens in English. They need a calm, bilingual companion that explains where their case stands and what happens next.",
    whatIBuilt:
      "A bilingual (EN/ES) companion app built on Next.js and shadcn/ui, internationalized with next-intl. Supabase handles authentication with row-level security, so each client can only ever reach their own data.",
    outcomes:
      "A full-stack app with real security boundaries: RLS enforced at the database rather than trusted to the UI, i18n structured for full parity across both languages, and screens designed to stay calm for people in a stressful situation.",
    links: {},
    visibility: "confidential",
    year: 2026,
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
    roleDetail:
      "Design and build of an internal tool for a real law firm, from mapping the existing workflow with the people running it to shipping the tool they now use.",
    problem:
      "A law firm's records-request and case-management workflow was repetitive and manual: the same client details re-entered across forms, letters, and requests, and every re-entry was another chance for a typo in a legal document.",
    whatIBuilt:
      "Automation for records requests and document generation, plus case management. Client data is entered once and flows into the generated document packets, which removes the repetitive manual steps from the workflow.",
    outcomes:
      "An internal tool in real production use. Document generation replaced hand-assembled packets, the duplicate data entry is gone, and the workflow it automates is one I understood from the operator's side first.",
    links: {},
    visibility: "confidential",
    year: 2025,
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
