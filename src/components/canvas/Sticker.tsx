import Image from "next/image";

export type StickerColor = "mostaza" | "menta" | "rosa" | "celeste" | "choco" | "ink" | "white";

export const stickerBg: Record<StickerColor, string> = {
  mostaza: "bg-mostaza text-ink",
  menta: "bg-menta text-ink",
  rosa: "bg-rosa text-white",
  celeste: "bg-celeste text-ink",
  choco: "bg-choco text-white",
  ink: "bg-ink text-white",
  white: "bg-white text-ink",
};

export const stickerFill: Record<StickerColor, string> = {
  mostaza: "var(--color-mostaza)",
  menta: "var(--color-menta)",
  rosa: "var(--color-rosa)",
  celeste: "var(--color-celeste)",
  choco: "var(--color-choco)",
  ink: "#111111",
  white: "#ffffff",
};

/** Etiqueta rectangular de color. */
export function Cinta({ children, color }: { children: React.ReactNode; color: StickerColor }) {
  return (
    <span
      className={`inline-block px-3.5 py-2 text-[15px] font-medium tracking-tight whitespace-nowrap md:px-4 md:py-2.5 md:text-base ${stickerBg[color]}`}
    >
      {children}
    </span>
  );
}

/** Cursor de colaboración, como en un editor de diseño: flecha + etiqueta con nombre. */
export function CursorTag({
  children,
  color,
  lado = "izq",
}: {
  children: React.ReactNode;
  color: StickerColor;
  lado?: "izq" | "der";
}) {
  const flecha = (
    <svg viewBox="0 0 16 16" className={`size-5 shrink-0 ${lado === "der" ? "-scale-x-100" : ""}`} aria-hidden>
      <path d="M1.5 1.5l12 4.6-5.3 1.6-1.9 5.8z" fill={stickerFill[color]} stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
  return (
    <span className={`inline-flex items-start gap-0.5 ${lado === "der" ? "flex-row-reverse" : ""}`}>
      {flecha}
      <span className={`label-mono mt-3.5 -ml-1 rounded-[3px] px-2 py-1 text-[12px] font-medium whitespace-nowrap md:text-[13px] ${stickerBg[color]}`}>
        {children}
      </span>
    </span>
  );
}

/** Tarjeta con imagen y epígrafe mono, como una captura suelta sobre el lienzo. */
export function Polaroid({
  src,
  alt,
  epigrafe,
  className = "w-56",
  aspect = "aspect-[4/3]",
  sizes = "240px",
}: {
  src: string;
  alt: string;
  epigrafe?: string;
  className?: string;
  aspect?: string;
  sizes?: string;
}) {
  return (
    <span className={`block bg-white p-2 pb-0 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.28),0_0_0_1px_rgb(0_0_0/0.06)] ${className}`}>
      <span className={`relative block overflow-hidden bg-surface ${aspect}`}>
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover object-top" draggable={false} />
      </span>
      <span className="label-mono block truncate py-2 text-[11px] leading-none text-muted">{epigrafe ?? " "}</span>
    </span>
  );
}
