import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Two variants, per docs/DESIGN-SYSTEM.md:
//   primary — silver fill, near-black text
//   ghost   — glass panel with a hairline border, brightening on hover
// Body-font label (Karla), uppercase, tracked. Ghost is frosted rather than
// transparent so its label stays readable wherever the field runs bright.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-[15px] font-body text-[13px] font-semibold uppercase tracking-[0.05em] transition-[color,background-color,border-color,transform] duration-300 ease-brand",
  {
    variants: {
      variant: {
        // dark label on a light fill: the global body text-shadow would muddy it
        primary:
          "border border-accent-btn bg-accent-btn font-bold text-bg [text-shadow:none] hover:brightness-110",
        ghost:
          "border border-line bg-white/[0.06] text-fg backdrop-blur-md hover:border-fg",
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
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={cls} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

export { buttonVariants };
