// The arrival moment: an aperture that opens onto the page.
//
// Server-rendered on purpose. This markup has to be in the very first HTML,
// because anything mounted later would appear *after* the page has painted —
// the page would flash, then get covered, which is the opposite of an entry.
//
// It is also driven entirely by CSS. No JS starts it, so it cannot be delayed
// by hydration, and if JS never arrives the animation still completes and the
// page is revealed. <Field /> only cleans the element up afterwards.
export function Portal() {
  return (
    <div className="portal" aria-hidden="true">
      <div className="portal-flash" />
      <div className="portal-mask" />
      <div className="portal-ring" />
    </div>
  );
}
