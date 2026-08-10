"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const social = [
  {
    label: "randall.floresespinoza@gmail.com",
    href: "mailto:randall.floresespinoza@gmail.com",
  },
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

export function Footer() {
  const pathname = usePathname();

  // /contact already opens with this exact CTA plus the same links — the
  // footer would repeat the whole page one viewport later.
  if (pathname === "/contact") return null;

  return (
    <footer className="mt-24">
      <div className="wrap py-27.5">
        <h2 className="font-display text-[clamp(34px,6.5vw,84px)] font-medium leading-[0.95] tracking-[-0.02em]">
          {/* Space before the <br> so the accessible name doesn't read
              "somethingworth". */}
          Let&apos;s build something{" "}
          <br />
          worth{" "}
          <Link
            href="/contact"
            className="ulink transition-colors hover:text-accent"
          >
            shipping
          </Link>
        </h2>

        <ul className="mt-11.5 flex flex-wrap justify-between gap-5 font-mono text-xs uppercase tracking-wider text-muted">
          {social.map((s) => {
            const external = s.href.startsWith("http");
            return (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="transition-colors hover:text-accent"
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
