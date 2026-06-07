// Fixed film-grain overlay for atmosphere over flat fills.
// Cosmetic only — pointer-events none, hidden from the a11y tree.
export function Grain() {
  return <div className="grain" aria-hidden="true" />;
}
