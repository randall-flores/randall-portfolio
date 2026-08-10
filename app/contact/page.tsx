import type { Metadata } from "next";
import { EmailCopy } from "@/components/contact/EmailCopy";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { SOCIAL } from "@/lib/social";

const description =
  "Get in touch with Randall. Open to remote full-stack roles. Email, GitHub, LinkedIn, Instagram, Contra, and CV.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  openGraph: { title: "Contact", description, type: "website" },
  twitter: { title: "Contact", description },
};


export default function ContactPage() {
  return (
    <main id="main" className="ct wrap">
      {/* No "CONTACT" kicker — the title is the page. Everything here is
          above the fold, so entrances are CSS (.rise), never JS-gated. */}
      <div className="rise">
        <h1 className="ct-title">
          Let&apos;s build something worth <em>shipping.</em>
        </h1>
      </div>

      <div className="rise rise-1">
        <p className="ct-lead">
          Open to remote full-stack roles, freelance builds, and
          good problems. The fastest way to reach me is email.
        </p>
      </div>

      <div className="rise rise-2">
        <EmailCopy />
      </div>

      <div className="rise rise-3">
        <nav className="ct-links" aria-label="Elsewhere">
          {SOCIAL.map((l) => (
            <a
              key={l.key}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5"
            >
              <SocialIcon name={l.key} />
              {l.label}
            </a>
          ))}
          <a href="/cv.pdf" download className="inline-flex items-center gap-2.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 19h16" />
            </svg>
            Download CV
          </a>
        </nav>
      </div>
    </main>
  );
}
