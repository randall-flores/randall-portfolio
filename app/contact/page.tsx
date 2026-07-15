import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { EmailCopy } from "@/components/contact/EmailCopy";

const description =
  "Get in touch with Randall. Open to remote full-stack roles. Email, GitHub, LinkedIn, Contra, and CV.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  openGraph: { title: "Contact", description, type: "website" },
  twitter: { title: "Contact", description },
};

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
    <main id="main" className="ct wrap">
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
          Open to remote full-stack roles, freelance builds, and
          good problems. The fastest way to reach me is email.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <EmailCopy />
      </Reveal>

      <Reveal>
        <nav className="ct-links" aria-label="Elsewhere">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {l.label} ↗
            </a>
          ))}
          <a href="/cv.pdf" download>
            Download CV ↓
          </a>
        </nav>
      </Reveal>
    </main>
  );
}
