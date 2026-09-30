import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-base font-medium leading-none transition-colors";
const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-accent",
  secondary: "border border-line text-ink hover:border-ink",
};

type Props = ComponentProps<typeof Link> & { variant?: Variant; external?: boolean };

export function Button({ variant = "primary", external, className = "", ...props }: Props) {
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return <Link className={`${base} ${variants[variant]} ${className}`} {...ext} {...props} />;
}
