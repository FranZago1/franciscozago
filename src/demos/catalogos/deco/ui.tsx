"use client";

/* Piezas chicas de la demo Nido: íconos de trazo fino, swatches y selector de cantidad. */

type P = { className?: string };
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IcLista = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}>
    <path d="M6 7.5h12l-1 12H7z" />
    <path d="M9 7.5V6a3 3 0 0 1 6 0v1.5" />
  </svg>
);
export const IcMas = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const IcMenos = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <path d="M5 12h14" />
  </svg>
);
export const IcBuscar = ({ className = "size-4.5" }: P) => (
  <svg {...base} className={className}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.2-4.2" />
  </svg>
);
export const IcFlecha = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const IcFiltros = ({ className = "size-4.5" }: P) => (
  <svg {...base} className={className}>
    <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="10" cy="17" r="2" />
  </svg>
);
export const IcBasura = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" />
  </svg>
);
export const IcChat = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}>
    <path d="M4.5 19.5l1.2-3.6A7.5 7.5 0 1 1 8.4 18.6z" />
    <path d="M9 11h6M9 14h3.5" />
  </svg>
);
export const IcCheck = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
export const IcRegla = ({ className = "size-4.5" }: P) => (
  <svg {...base} className={className}>
    <rect x="3" y="8" width="18" height="8" rx="1" />
    <path d="M7 8v3M11 8v4M15 8v3M19 8v2" />
  </svg>
);
export const IcCamion = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}>
    <path d="M3 6.5h11v9H3zM14 9.5h4l3 3v3h-7" />
    <circle cx="7" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </svg>
);
export const IcTaller = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}>
    <path d="M4 20h16M6 20V10l6-5 6 5v10" />
    <path d="M10 20v-5h4v5" />
  </svg>
);

export function Swatch({
  hex,
  nombre,
  activo,
  onClick,
  size = "md",
}: {
  hex: string;
  nombre: string;
  activo: boolean;
  onClick: () => void;
  size?: "sm" | "md";
}) {
  const s = size === "sm" ? "size-5" : "size-7";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      aria-label={nombre}
      title={nombre}
      className={`${s} relative shrink-0 rounded-full ring-offset-2 ring-offset-[#F4EFE7] transition-[box-shadow,transform] duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2F4538] ${
        activo ? "ring-[1.5px] ring-[#221C17]" : "ring-0"
      }`}
    >
      <span className="absolute inset-0 rounded-full border border-black/10" style={{ background: hex }} />
    </button>
  );
}

export function Cantidad({
  valor,
  onChange,
  etiqueta,
  min = 1,
  max = 20,
}: {
  valor: number;
  onChange: (n: number) => void;
  etiqueta: string;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex h-10 items-center rounded-full border border-[#CFC4B3] bg-[#FBF8F3]" role="group" aria-label={etiqueta}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, valor - 1))}
        disabled={valor <= min}
        aria-label="Restar uno"
        className="grid size-10 place-items-center rounded-full text-[#221C17] transition hover:bg-[#EDE6DA] disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-[#2F4538]"
      >
        <IcMenos />
      </button>
      <output className="w-7 text-center text-[15px] tabular-nums" aria-live="polite">
        {valor}
      </output>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, valor + 1))}
        disabled={valor >= max}
        aria-label="Sumar uno"
        className="grid size-10 place-items-center rounded-full text-[#221C17] transition hover:bg-[#EDE6DA] disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-[#2F4538]"
      >
        <IcMas />
      </button>
    </div>
  );
}
