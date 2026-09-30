import type { ReactNode } from "react";
import { estadoDe, TIPOS, type Categoria, type Producto, type TipoMov } from "./data";

export const mono = "[font-family:var(--font-stk-mono)]";

export const btn = {
  primario:
    "inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#F26B1D] px-3.5 py-2 text-sm font-bold uppercase tracking-[0.04em] text-[#1C1E22] shadow-[inset_0_-2px_0_rgba(0,0,0,.18)] transition hover:bg-[#FF7A2B] active:translate-y-px disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F26B1D]",
  oscuro:
    "inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#1C1E22] px-3.5 py-2 text-sm font-bold uppercase tracking-[0.04em] text-white shadow-[inset_0_-2px_0_rgba(0,0,0,.35)] transition hover:bg-[#2F3238] active:translate-y-px disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F26B1D]",
  secundario:
    "inline-flex items-center justify-center gap-2 rounded-[4px] border border-[#BDB9B0] bg-white px-3.5 py-2 text-sm font-bold uppercase tracking-[0.04em] text-[#1C1E22] transition hover:border-[#1C1E22] active:translate-y-px disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F26B1D]",
  chico:
    "inline-grid size-8 place-items-center rounded-[4px] border border-[#CFCBC3] bg-white text-[#1C1E22] transition hover:border-[#1C1E22] hover:bg-[#F6F5F2] active:translate-y-px disabled:opacity-35 disabled:hover:border-[#CFCBC3] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#F26B1D]",
};

export const input =
  "h-10 w-full rounded-[4px] border border-[#BDB9B0] bg-white px-3 text-sm text-[#1C1E22] placeholder:text-[#9A968D] transition focus:border-[#1C1E22] focus:outline-none focus:ring-3 focus:ring-[#F26B1D]/30 aria-[invalid=true]:border-[#C0262D] aria-[invalid=true]:bg-[#FFF7F7]";

export const label = "mb-1 block text-xs font-bold uppercase tracking-[0.06em] text-[#55524B]";

export function Panel({ titulo, accion, children, className = "", sinPadding = false }: { titulo?: ReactNode; accion?: ReactNode; children: ReactNode; className?: string; sinPadding?: boolean }) {
  return (
    <section className={`border border-[#D9D6CF] bg-white ${className}`}>
      {titulo ? (
        <header className="flex min-h-11 items-center justify-between gap-3 border-b border-[#D9D6CF] bg-[#F6F5F2] px-3.5 py-2">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#1C1E22]">{titulo}</h2>
          {accion}
        </header>
      ) : null}
      <div className={sinPadding ? "" : "p-3.5"}>{children}</div>
    </section>
  );
}

export function EstadoBadge({ p }: { p: Producto }) {
  const e = estadoDe(p);
  const map = {
    ok: { t: "OK", c: "bg-[#E3F2E7] text-[#1F7A3E]" },
    bajo: { t: "Bajo mínimo", c: "bg-[#FFF1D6] text-[#8A5A00]" },
    sin: { t: "Sin stock", c: "bg-[#C0262D] text-white" },
  }[e];
  return <span className={`inline-block whitespace-nowrap rounded-[3px] px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.05em] ${map.c}`}>{map.t}</span>;
}

export function TipoBadge({ tipo }: { tipo: TipoMov }) {
  const t = TIPOS[tipo];
  return (
    <span className="inline-block whitespace-nowrap rounded-[3px] px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.05em]" style={{ background: t.fondo, color: t.color }}>
      {t.nombre}
    </span>
  );
}

/** Barra de stock vs mínimo: la marca vertical es el mínimo. */
export function BarraStock({ p, ancho = "w-24" }: { p: Producto; ancho?: string }) {
  const tope = Math.max(p.minimo * 2.5, p.stock, 1);
  const pct = Math.min(100, (p.stock / tope) * 100);
  const min = (p.minimo / tope) * 100;
  const e = estadoDe(p);
  const color = e === "ok" ? "#2F9E57" : e === "bajo" ? "#E0A100" : "#C0262D";
  return (
    <span className={`relative block h-2 ${ancho} overflow-hidden rounded-[2px] bg-[#E7E5E0]`} aria-hidden="true">
      <span className="absolute inset-y-0 left-0 transition-[width] duration-500" style={{ width: `${pct}%`, background: color }} />
      <span className="absolute inset-y-[-2px] w-[2px] bg-[#1C1E22]" style={{ left: `${min}%` }} />
    </span>
  );
}

/** Miniatura de categoría dibujada en SVG. */
export function CatIcono({ c, className = "size-9" }: { c: Categoria; className?: string }) {
  const art: Record<Categoria, ReactNode> = {
    Tornillería: (
      <>
        <path d="M14 6h12l-2 6H16z" fill="#8E949C" />
        <path d="M17 12h6v20l-3 4-3-4z" fill="#B7BCC3" />
        <path d="M17 15l6 2M17 19l6 2M17 23l6 2M17 27l6 2" stroke="#6F757D" strokeWidth="1.4" />
      </>
    ),
    Herramientas: (
      <>
        <rect x="18" y="16" width="5" height="20" rx="2" fill="#F26B1D" />
        <path d="M9 9h22v7H9z" fill="#5C6168" />
        <path d="M9 9h6v7H9z" fill="#3E4248" />
      </>
    ),
    Eléctricas: (
      <>
        <path d="M8 14h20v9H8z" fill="#F26B1D" />
        <path d="M28 16h6v5h-6z" fill="#8E949C" />
        <path d="M14 23h7l-2 12h-5z" fill="#2A2D33" />
        <path d="M10 16h8" stroke="#FFD3B8" strokeWidth="1.6" />
      </>
    ),
    Electricidad: (
      <>
        <circle cx="20" cy="17" r="9" fill="#FFE08A" />
        <path d="M16 25h8v5h-8z" fill="#B7BCC3" />
        <path d="M17 31h6v3h-6z" fill="#8E949C" />
        <path d="M18 14l3 3-3 3" stroke="#C98A00" strokeWidth="1.6" fill="none" />
      </>
    ),
    Plomería: (
      <>
        <path d="M8 22h14v-8h8v6h-4v8H8z" fill="#4E86B8" />
        <path d="M8 20h3v10H8zM28 12h4v8h-4z" fill="#2F5F8A" />
      </>
    ),
    Pinturería: (
      <>
        <path d="M10 12h20v20a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3z" fill="#C9CDD2" />
        <path d="M10 12h20v6H10z" fill="#2F9E57" />
        <path d="M14 9h12" stroke="#5C6168" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    Jardín: (
      <>
        <path d="M19 6h2v20h-2z" fill="#8B5E3C" />
        <path d="M14 24h12l-2 11h-8z" fill="#5C6168" />
      </>
    ),
    Seguridad: (
      <>
        <path d="M8 20c0-6 5-10 12-10s12 4 12 10v3H8z" fill="#F2C12E" />
        <path d="M6 23h28v3H6z" fill="#C99A00" />
      </>
    ),
  };
  return (
    <span className={`grid shrink-0 place-items-center rounded-[4px] border border-[#E2DFD8] bg-[#F6F5F2] ${className}`} aria-hidden="true">
      <svg viewBox="0 0 40 40" className="size-[82%]" aria-hidden="true">
        {art[c]}
      </svg>
    </span>
  );
}
