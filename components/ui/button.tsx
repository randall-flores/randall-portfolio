import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Two variants, per docs/DESIGN-SYSTEM.md:
//   primary — silver fill, near-black text, a squared 3px corner
//   ghost   — no box at all: a text link whose underline grows on hover
// Sentence-case Newsreader label. The old uppercase pill pair (filled + outlined)
// was the stock SaaS button kit; one filled action and one plain link is how
// the page reads now. The global text-shadow keeps the link legible over the field.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 font-body text-[17px] font-medium transition-[color,background-color,border-color,transform,filter] duration-300 ease-brand",
  {
    variants: {
      variant: {
        // dark label on a light fill: the global body text-shadow would muddy it
        primary:
          "rounded-[3px] border border-accent-btn bg-accent-btn px-6 py-[13px] text-bg [text-shadow:none] hover:brightness-110",
        ghost: "px-1 py-[13px] text-fg hover:text-accent",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

type ButtonProps = VariantProps<typeof buttonVariants> & {
  children: React.ReactNode;
  className?: string;
  href?: string;
  ariaLabel?: string;
};

export function Button({
  variant,
  className,
  children,
  href,
  ariaLabel,
}: ButtonProps) {
  const cls = cn(buttonVariants({ variant }), className);
  // The ghost variant's underline sits under the words, not the padded box.
  const label =
    variant === "ghost" ? <span className="ulink">{children}</span> : children;

  if (href) {
    const external = /^(https?:|mailto:|tel:)/.test(href);
    if (external) {
      const isHttp = href.startsWith("http");
      return (
        <a
          href={href}
          className={cls}
          aria-label={ariaLabel}
          {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {label}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" className={cls} aria-label={ariaLabel}>
      {label}
    </button>
  );
}

export { buttonVariants };
