/**
 * Íconos propios, geométricos, en grilla de 24. Usan `currentColor` para la forma principal
 * y `var(--ic2)` para el detalle, así cada ficha elige sus dos colores.
 */

export type IconName =
  | "cursor"
  | "tienda"
  | "mercado"
  | "camara"
  | "app"
  | "grafico"
  | "gestion"
  | "calendario"
  | "catalogo"
  | "pluma"
  | "codigo"
  | "chispa"
  | "chat"
  | "rayo"
  | "capas"
  | "frame"
  | "texto"
  | "flecha";

const paths: Record<IconName, React.ReactNode> = {
  cursor: (
    <>
      <path d="M5 3l14 7.5-6.2 1.6L9.6 18z" />
      <circle cx="17.5" cy="18" r="2.5" fill="var(--ic2)" />
    </>
  ),
  tienda: (
    <>
      <path d="M3 9l2-5h14l2 5z" />
      <path d="M4 10h16v10H4z" opacity=".35" />
      <path d="M9.5 20v-5.5h5V20z" fill="var(--ic2)" />
    </>
  ),
  mercado: (
    <>
      <rect x="2.5" y="3" width="8.5" height="8.5" rx="2" />
      <rect x="13" y="3" width="8.5" height="8.5" rx="4.25" fill="var(--ic2)" />
      <rect x="2.5" y="13" width="8.5" height="8.5" rx="4.25" fill="var(--ic2)" />
      <rect x="13" y="13" width="8.5" height="8.5" rx="2" />
    </>
  ),
  camara: (
    <>
      <path d="M3 8a2 2 0 012-2h2.5l1.5-2h6l1.5 2H19a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <circle cx="12" cy="13" r="4" fill="var(--ic2)" />
      <circle cx="12" cy="13" r="1.6" />
    </>
  ),
  app: (
    <>
      <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
      <rect x="2.5" y="4" width="19" height="4" rx="2" fill="var(--ic2)" />
      <circle cx="5.5" cy="6" r=".9" />
      <circle cx="8.3" cy="6" r=".9" />
    </>
  ),
  grafico: (
    <>
      <rect x="3" y="12" width="4" height="9" rx="1" />
      <rect x="10" y="7" width="4" height="14" rx="1" fill="var(--ic2)" />
      <rect x="17" y="3" width="4" height="18" rx="1" />
    </>
  ),
  gestion: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <rect x="6" y="6.5" width="3" height="3" rx=".8" fill="var(--ic2)" />
      <rect x="11" y="7.2" width="7" height="1.6" rx=".8" fill="var(--ic2)" />
      <rect x="6" y="11" width="3" height="3" rx=".8" fill="var(--ic2)" />
      <rect x="11" y="11.7" width="7" height="1.6" rx=".8" fill="var(--ic2)" />
      <rect x="6" y="15.5" width="3" height="3" rx=".8" fill="var(--ic2)" />
      <rect x="11" y="16.2" width="5" height="1.6" rx=".8" fill="var(--ic2)" />
    </>
  ),
  calendario: (
    <>
      <rect x="3" y="4.5" width="18" height="16.5" rx="3" />
      <rect x="3" y="4.5" width="18" height="5" rx="2.5" fill="var(--ic2)" />
      <rect x="7" y="2.5" width="2" height="4" rx="1" />
      <rect x="15" y="2.5" width="2" height="4" rx="1" />
      <circle cx="15.5" cy="15.5" r="2.2" fill="var(--ic2)" />
    </>
  ),
  catalogo: (
    <>
      <path d="M11 3h8a2 2 0 012 2v8L12 22l-9-9z" />
      <circle cx="16.5" cy="7.5" r="2" fill="var(--ic2)" />
    </>
  ),
  pluma: (
    <>
      <path d="M6.5 3h11v5.5L12 21.5 6.5 8.5z" />
      <rect x="6.5" y="7" width="11" height="1.6" fill="var(--ic2)" />
      <rect x="11.3" y="10.5" width="1.4" height="7" fill="var(--ic2)" />
      <circle cx="12" cy="11.8" r="1.7" fill="var(--ic2)" />
    </>
  ),
  codigo: (
    <>
      <path d="M8.5 6L2.5 12l6 6 1.6-1.6L5.7 12l4.4-4.4zM15.5 6l6 6-6 6-1.6-1.6 4.4-4.4-4.4-4.4z" />
      <path d="M13.2 4.5l1.8.5-4.2 14.5-1.8-.5z" fill="var(--ic2)" />
    </>
  ),
  chispa: (
    <>
      {[0, 45, 90, 135].map((a) => (
        <rect key={a} x="10.5" y="2" width="3" height="20" rx="1.5" transform={`rotate(${a} 12 12)`} />
      ))}
      <circle cx="12" cy="12" r="3.5" fill="var(--ic2)" />
    </>
  ),
  chat: (
    <>
      <path d="M4 4h16a1.5 1.5 0 011.5 1.5v10A1.5 1.5 0 0120 17h-9l-5 4v-4H4a1.5 1.5 0 01-1.5-1.5v-10A1.5 1.5 0 014 4z" />
      <circle cx="8" cy="10.5" r="1.4" fill="var(--ic2)" />
      <circle cx="12" cy="10.5" r="1.4" fill="var(--ic2)" />
      <circle cx="16" cy="10.5" r="1.4" fill="var(--ic2)" />
    </>
  ),
  rayo: (
    <>
      <path d="M13.5 2L4 13.5h6.5L9 22l11-12.5h-6.8z" />
    </>
  ),
  capas: (
    <>
      <path d="M12 3l9 5-9 5-9-5z" />
      <path d="M3 12.5l9 5 9-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M3 16.5l9 5 9-5" fill="none" stroke="var(--ic2)" strokeWidth="2" strokeLinejoin="round" />
    </>
  ),
  frame: (
    <>
      <path d="M7 3v18M17 3v18M3 7h18M3 17h18" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </>
  ),
  texto: (
    <>
      <path d="M5 5h14v3h-2V7h-4v11h2v2H9v-2h2V7H7v1H5z" />
    </>
  ),
  flecha: (
    <>
      <path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
    </>
  ),
};

export function Icon({
  name,
  className = "size-6",
  secondary = "currentColor",
}: {
  name: IconName;
  className?: string;
  secondary?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
      focusable="false"
      style={{ "--ic2": secondary } as React.CSSProperties}
    >
      {paths[name]}
    </svg>
  );
}

/** Ícono dentro de un cuadrado de color, para usar en línea dentro de titulares. */
export function IconTile({
  name,
  bg,
  fg = "#111111",
  secondary,
  className = "",
}: {
  name: IconName;
  bg: string;
  fg?: string;
  secondary?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`inline-flex size-[0.95em] items-center justify-center rounded-[0.14em] align-[-0.12em] ${className}`}
      style={{ background: bg, color: fg }}
    >
      <Icon name={name} className="size-[62%]" secondary={secondary ?? bg} />
    </span>
  );
}
