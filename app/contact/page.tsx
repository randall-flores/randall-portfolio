import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Randall. Open to remote frontend and full-stack roles. Email, GitHub, LinkedIn, Contra, and CV.",
};

const EMAIL = "randall.floresespinoza@gmail.com";

const links = [
  { label: "GitHub", href: "https://github.com/randallfloresespinoza-coder" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/randallflores1493/",
  },
  {
    label: "Contra",
    href: "https://contra.com/randall_flores_n1w62fvm/work?r=randall_flores_n1w62fvm",
  },
];

export default function ContactPage() {
  return (
    <main className="ct wrap">
      <Reveal>
        <p className="ct-kick">Contact</p>
      </Reveal>

      <Reveal delay={0.05}>
        <h1 className="ct-title">
          Let&apos;s build something worth <em>shipping.</em>
        </h1>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="ct-lead">
          Open to remote frontend and full-stack roles, freelance builds, and
          good problems. The fastest way to reach me is email.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <a className="ct-email" href={`mailto:${EMAIL}`} data-cursor="Email">
          {EMAIL}
        </a>
      </Reveal>

      <Reveal>
        <nav className="ct-links" aria-label="Elsewhere">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Open"
            >
              {l.label} ↗
            </a>
          ))}
          {/* TODO(Randall): drop your CV at public/cv.pdf — this link 404s until then. */}
          <a href="/cv.pdf" download data-cursor="Download">
            Download CV ↓
          </a>
        </nav>
      </Reveal>
    </main>
  );
}
