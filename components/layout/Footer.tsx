import Link from "next/link";

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
  return (
    <footer className="mt-16 border-t border-line">
      <div className="wrap py-[110px]">
        <h2 className="font-display text-[clamp(34px,6.5vw,84px)] font-medium leading-[0.95] tracking-[-0.02em]">
          Let&apos;s build something
          <br />
          worth{" "}
          <Link
            href="/contact"
            className="border-b-[3px] border-accent transition-colors hover:text-accent"
          >
            shipping →
          </Link>
        </h2>

        <ul className="mt-[46px] flex flex-wrap justify-between gap-5 font-mono text-xs uppercase tracking-[0.05em] text-muted">
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
