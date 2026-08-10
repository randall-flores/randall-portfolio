"use client";

import dynamic from "next/dynamic";

// The field is decorative and never server-rendered, so its code has no
// business in the initial bundle. Loading it lazily keeps the WebGL + particle
// modules out of the chunk that has to evaluate before the hero can paint —
// that evaluation was most of the LCP render delay.
const Field = dynamic(() => import("./Field").then((m) => m.Field), {
  ssr: false,
});

export function FieldMount() {
  return <Field />;
}
