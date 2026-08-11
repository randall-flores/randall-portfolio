"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { EMAIL, SOCIAL } from "@/lib/social";

export function Footer() {
  const pathname = usePathname();

  // /contact already opens with this exact CTA plus the same links — the
  // footer would repeat the whole page one viewport later.
  if (pathname === "/contact") return null;

  return (
    <footer className="mt-24">
      <div className="wrap py-27.5">
        <h2 className="font-display text-[clamp(34px,6.5vw,84px)] font-medium leading-[0.95] tracking-[-0.02em]">
          {/* Deliberately the same sentence as the /contact h1: the footer asks
              the question, the link leads to the page that asks it again. This
              footer hides itself on /contact, so the two never both appear. */}
          Tell me what you&apos;re{" "}
          <Link
            href="/contact"
            className="ulink transition-colors hover:text-accent"
          >
            building
          </Link>
        </h2>

        <ul className="mt-11.5 flex flex-wrap items-center gap-x-8 gap-y-4 font-mono text-xs uppercase tracking-wider text-muted">
          <li>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2.5 py-1 transition-colors hover:text-accent"
            >
              <SocialIcon name="email" />
              <span className="normal-case tracking-normal">{EMAIL}</span>
            </a>
          </li>
          {SOCIAL.map((s) => (
            <li key={s.key}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 py-1 transition-colors hover:text-accent"
              >
                <SocialIcon name={s.key} />
                <span>{s.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
