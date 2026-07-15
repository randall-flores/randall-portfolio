"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MobileMenu } from "@/components/layout/MobileMenu";

const links = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Nav() {
  const pathname = usePathname();

  // Live Costa Rica clock. Rendered client-side only to avoid a
  // server/client time mismatch; falls back to "CR" before mount.
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      try {
        setTime(
          new Intl.DateTimeFormat("en-US", {
            timeZone: "America/Costa_Rica",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(new Date()),
        );
      } catch {
        setTime(null);
      }
    };
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[100] border-b border-line-soft bg-bg/50 backdrop-blur-[10px]">
      <div className="wrap flex h-[66px] items-center justify-between">
        <Link
          href="/"
          aria-label="Randall, home"
          className="font-display text-[19px] font-semibold tracking-[-0.01em]"
        >
          RANDALL<span className="text-accent">.</span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden gap-[26px] font-mono text-xs uppercase tracking-[0.04em] text-muted md:flex"
        >
          {links.map((l) => {
            const active =
              pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                // py-[25px] stretches the tap target to the full 66px header
                // height (16px text + 50px padding) without moving the text.
                className={
                  active
                    ? "py-[25px] text-accent transition-colors"
                    : "py-[25px] transition-colors hover:text-fg"
                }
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.05em] text-muted">
            <span
              aria-hidden="true"
              className="size-[7px] rounded-full bg-accent [animation:pulse_2.4s_infinite]"
            />
            <span suppressHydrationWarning>
              Available · {time ? `${time} ` : ""}CR
            </span>
          </div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
