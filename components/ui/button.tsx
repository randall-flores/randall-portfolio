import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Two variants, per docs/DESIGN-SYSTEM.md:
//   primary — lime fill, near-black text
//   ghost   — hairline border, lime border + text on hover
// Body-font label (Hanken), uppercase, tracked. Primary runs heavier (700)
// so the near-black text holds its strokes on the bright lime fill.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 rounded-[2px] px-6 py-[15px] font-body text-[13px] font-semibold uppercase tracking-[0.05em] transition-[color,background-color,border-color] duration-300 ease-brand",
  {
    variants: {
      variant: {
        primary:
          "border border-accent bg-accent font-bold text-bg hover:brightness-110",
        ghost:
          "border border-line text-fg hover:border-accent hover:text-accent",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

type ButtonProps = VariantProps<typeof buttonVariants> & {
  children: React.ReactNode;
  className?: string;
  href?: string;
  dataCursor?: string;
  ariaLabel?: string;
};

export function Button({
  variant,
  className,
  children,
  href,
  dataCursor,
  ariaLabel,
}: ButtonProps) {
  const cls = cn(buttonVariants({ variant }), className);

  if (href) {
    const external = /^(https?:|mailto:|tel:)/.test(href);
    if (external) {
      const isHttp = href.startsWith("http");
      return (
        <a
          href={href}
          className={cls}
          data-cursor={dataCursor}
          aria-label={ariaLabel}
          {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} data-cursor={dataCursor} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={cls} data-cursor={dataCursor} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

export { buttonVariants };
