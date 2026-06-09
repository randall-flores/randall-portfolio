"use client";

import { useRef, useState } from "react";

// Email as a real mailto link (works for anyone with a mail client) that ALSO
// copies the address on click for everyone else. We don't preventDefault, so
// both behaviors run: the browser attempts the mailto, the clipboard copy
// fires, and a polite aria-live note confirms it. The address stays visible
// text so it can always be selected manually.
const EMAIL = "randall.floresespinoza@gmail.com";

export function EmailCopy() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleCopy() {
    try {
      await navigator.clipboard?.writeText(EMAIL);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context). The mailto still fires
      // and the address is selectable, so nothing is lost.
    }
  }

  return (
    <div className="ct-email-wrap">
      <a className="ct-email" href={`mailto:${EMAIL}`} onClick={handleCopy}>
        {EMAIL}
      </a>
      <span className="ct-copied" role="status" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  );
}
