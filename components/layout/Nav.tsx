"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileMenu } from "@/components/layout/MobileMenu";

const links = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// No status dot or live clock: "Available · 17:30 CR" told a visitor nothing
// the hero and /contact don't already say, and the pulsing dot is one of the
// most common generated-portfolio tells.
export function Nav() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-[100] bg-bg/40 backdrop-blur-[14px]">
      <div className="wrap flex h-[66px] items-center justify-between">
        <Link
          href="/"
          aria-label="Randall Flores, home"
          className="whitespace-nowrap font-display text-[19px] font-semibold tracking-[-0.01em]"
        >
          RANDALL FLORES
        </Link>

        <nav
          aria-label="Primary"
          className="hidden gap-[30px] text-[17px] text-muted md:flex"
        >
          {links.map((l) => {
            const active =
              pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                // py-[21px] stretches the tap target to the full 66px header
                // height without moving the text.
                className={
                  active
                    ? "py-[21px] text-fg italic transition-colors"
                    : "py-[21px] transition-colors hover:text-fg"
                }
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
}
