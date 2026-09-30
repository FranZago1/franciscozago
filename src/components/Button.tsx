import Link from "next/link";
import type { ComponentProps } from "react";
import { Icon, type IconName } from "./canvas/Icons";

type Variant = "primary" | "secondary";

type Props = ComponentProps<typeof Link> & {
  variant?: Variant;
  external?: boolean;
  icono?: IconName;
  /** Color de fondo del cuadrito del ícono (solo primary). */
  iconoBg?: string;
};

/** Botón rectangular con etiqueta mono. El primario lleva un cuadrito de color con ícono. */
export function Button({
  variant = "primary",
  external,
  icono,
  iconoBg = "var(--color-celeste)",
  className = "",
  children,
  ...props
}: Props) {
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  const estilos =
    variant === "primary"
      ? "bg-ink text-white hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_var(--color-accent)]"
      : "border-[1.5px] border-ink bg-white text-ink hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#111]";
  return (
    <Link
      className={`label-mono inline-flex items-center gap-3 rounded-[4px] p-1.5 pr-4 text-sm font-medium transition-[translate,box-shadow] duration-150 md:text-[15px] ${
        icono ? "" : "pl-4"
      } ${estilos} ${className}`}
      {...ext}
      {...props}
    >
      {icono ? (
        <span className="inline-flex size-9 items-center justify-center rounded-[3px]" style={{ background: iconoBg }}>
          <Icon name={icono} className="size-5 text-ink" secondary="#111" />
        </span>
      ) : null}
      <span className="py-2">{children}</span>
    </Link>
  );
}
