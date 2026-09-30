"use client";

/* Íconos finos y controles de Cava Aldea. */

type P = { className?: string };
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IcCopa = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}>
    <path d="M7 3.5h10c.5 4.5-.5 9-5 9s-5.5-4.5-5-9zM12 12.5V20M8.5 20.5h7M7.3 7.5h9.4" />
  </svg>
);
export const IcCaja = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}>
    <path d="M3.5 8.5h17v11h-17zM3.5 8.5L6 4.5h12l2.5 4M9 8.5v11M15 8.5v11M3.5 14h17" />
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
export const IcFiltro = ({ className = "size-4.5" }: P) => (
  <svg {...base} className={className}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </svg>
);
export const IcBuscar = ({ className = "size-4.5" }: P) => (
  <svg {...base} className={className}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.2-4.2" />
  </svg>
);
export const IcChat = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}>
    <path d="M4.5 19.5l1.2-3.6A7.5 7.5 0 1 1 8.4 18.6z" />
  </svg>
);
export const IcFlecha = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const IcChispa = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" />
  </svg>
);

export function Cantidad({
  valor,
  onChange,
  etiqueta,
  min = 1,
  max = 24,
}: {
  valor: number;
  onChange: (n: number) => void;
  etiqueta: string;
  min?: number;
  max?: number;
}) {
  const btn =
    "grid size-9 place-items-center text-[#EFE6D6] transition hover:text-[#E3C88A] disabled:opacity-30 focus-visible:outline-1 focus-visible:outline-[#C9A55A]";
  return (
    <div className="inline-flex h-10 items-center border border-[#4A3A36]" role="group" aria-label={etiqueta}>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.max(min, valor - 1))}
        disabled={valor <= min}
        aria-label="Una botella menos"
      >
        <IcMenos />
      </button>
      <output className="w-8 text-center text-[15px] tabular-nums" aria-live="polite">
        {valor}
      </output>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.min(max, valor + 1))}
        disabled={valor >= max}
        aria-label="Una botella más"
      >
        <IcMas />
      </button>
    </div>
  );
}
