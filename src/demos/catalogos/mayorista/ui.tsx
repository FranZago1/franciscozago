"use client";

import { useEffect, useState } from "react";

/* Íconos de trazo firme y controles compactos de la demo Ruta 9. */

type P = { className?: string };
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IcBuscar = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4-4" />
  </svg>
);
export const IcCarro = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}>
    <path d="M3 4h2.5l2.2 10.5h10.6L20.5 7H7" />
    <circle cx="9.5" cy="19" r="1.5" />
    <circle cx="17" cy="19" r="1.5" />
  </svg>
);
export const IcLista = ({ className = "size-4.5" }: P) => (
  <svg {...base} className={className}>
    <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
  </svg>
);
export const IcGrilla = ({ className = "size-4.5" }: P) => (
  <svg {...base} className={className}>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
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
export const IcX = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const IcCopiar = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
    <path d="M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" />
  </svg>
);
export const IcDescargar = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" />
  </svg>
);
export const IcNota = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <path d="M5 4h14v11l-5 5H5z" />
    <path d="M14 20v-5h5M8.5 9h7M8.5 12.5h4" />
  </svg>
);
export const IcChat = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}>
    <path d="M4.5 19.5l1.2-3.6A7.5 7.5 0 1 1 8.4 18.6z" />
  </svg>
);
export const IcCamion = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <path d="M3 6.5h11v9H3zM14 9.5h4l3 3v3h-7" />
    <circle cx="7" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </svg>
);
export const IcReloj = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4l2.5 2" />
  </svg>
);
export const IcEtiqueta = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <path d="M4 4h7l9 9-7 7-9-9z" />
    <circle cx="8.5" cy="8.5" r="1.2" />
  </svg>
);

/** Selector de bultos: con 0 muestra "Agregar"; con cantidad, − número +. El número se puede tipear. */
export function Bultos({
  valor,
  onChange,
  nombre,
  deshabilitado = false,
  tam = "md",
}: {
  valor: number;
  onChange: (n: number) => void;
  nombre: string;
  deshabilitado?: boolean;
  tam?: "sm" | "md";
}) {
  const [texto, setTexto] = useState(String(valor));
  useEffect(() => setTexto(String(valor)), [valor]);
  const h = tam === "sm" ? "h-8" : "h-9";
  const w = tam === "sm" ? "w-8" : "w-9";

  if (deshabilitado) {
    return <span className={`inline-flex ${h} items-center rounded-md bg-[#EEF1F5] px-3 text-[13px] text-[#626D7E]`}>Sin stock</span>;
  }
  if (valor === 0) {
    return (
      <button
        type="button"
        onClick={() => onChange(1)}
        aria-label={`Agregar un bulto de ${nombre}`}
        className={`inline-flex ${h} items-center gap-1.5 rounded-md border border-[#1747A6] px-3 text-[13px] font-semibold text-[#1747A6] transition hover:bg-[#1747A6] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1747A6] active:translate-y-px`}
      >
        <IcMas className="size-3.5" /> Agregar
      </button>
    );
  }
  return (
    <div
      className={`inline-flex ${h} items-stretch overflow-hidden rounded-md border border-[#1747A6] bg-white`}
      role="group"
      aria-label={`Bultos de ${nombre}`}
    >
      <button
        type="button"
        onClick={() => onChange(valor - 1)}
        aria-label={valor === 1 ? `Quitar ${nombre} del pedido` : "Restar un bulto"}
        className={`grid ${w} place-items-center text-[#1747A6] transition hover:bg-[#E8EEFA] focus-visible:bg-[#E8EEFA] focus-visible:outline-none`}
      >
        {valor === 1 ? <IcX className="size-3.5" /> : <IcMenos className="size-3.5" />}
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={texto}
        aria-label={`Cantidad de bultos de ${nombre}`}
        onChange={(e) => setTexto(e.target.value.replace(/\D/g, "").slice(0, 3))}
        onBlur={() => onChange(Number(texto) || 0)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onChange(Number(texto) || 0);
        }}
        className="w-10 border-x border-[#1747A6]/25 bg-[#1747A6] text-center font-[family-name:var(--font-r9-mono)] text-[14px] font-semibold text-white tabular-nums focus:bg-[#0F3380] focus:outline-none"
      />
      <button
        type="button"
        onClick={() => onChange(valor + 1)}
        aria-label="Sumar un bulto"
        className={`grid ${w} place-items-center text-[#1747A6] transition hover:bg-[#E8EEFA] focus-visible:bg-[#E8EEFA] focus-visible:outline-none`}
      >
        <IcMas className="size-3.5" />
      </button>
    </div>
  );
}
