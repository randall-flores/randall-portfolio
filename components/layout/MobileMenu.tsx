"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Accessible mobile menu. The toggle lives in the header (small screens only);
// the overlay panel is portalled to <body> so the header's backdrop-filter
// can't trap its fixed positioning. Desktop nav is untouched. Home appears
// only here (the logo is the desktop home link).
const items = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Portal target only exists on the client; this guard avoids an SSR mismatch.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const close = useCallback(() => {
    setOpen(false);
    btnRef.current?.focus();
  }, []);

  // While open: lock body scroll, move focus into the panel, trap Tab, Escape
  // closes. Cleanup restores scroll.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  const overlay = (
    <div
      className={open ? "menu-overlay is-open" : "menu-overlay"}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      <button
        type="button"
        className="menu-backdrop"
        tabIndex={-1}
        aria-hidden="true"
        onClick={close}
      />
      <nav id="mobile-menu" ref={panelRef} aria-label="Mobile" className="menu-panel">
        {items.map((item, i) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              ref={i === 0 ? firstLinkRef : undefined}
              className={active ? "active" : undefined}
              aria-current={active ? "page" : undefined}
              onClick={close}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="menu-btn"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
      </button>
      {mounted ? createPortal(overlay, document.body) : null}
    </>
  );
}
