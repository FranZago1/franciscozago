import type { ReactNode } from "react";
import type { Categoria, EstadoMesa } from "./data";

export const cond = "[font-family:var(--font-brasa-cond)]";

export const btn = {
  brasa:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[#D2460F] px-4 py-2.5 text-sm font-bold text-white shadow-[0_6px_16px_-6px_rgba(217,72,15,.7)] transition hover:bg-[#C23F0C] active:translate-y-px disabled:opacity-50 disabled:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9480F]",
  carbon:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F1A17] px-4 py-2.5 text-sm font-bold text-[#F5EEE3] transition hover:bg-[#3A302A] active:translate-y-px disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9480F]",
  suave:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-[#E4D8C6] bg-[#FFFCF7] px-4 py-2.5 text-sm font-bold text-[#1F1A17] transition hover:border-[#C9B9A1] hover:bg-white active:translate-y-px disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9480F]",
  icono:
    "inline-grid size-9 place-items-center rounded-lg text-[#6B5E53] transition hover:bg-[#EFE5D6] hover:text-[#1F1A17] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9480F]",
};

export const input =
  "h-11 w-full rounded-xl border border-[#E0D3C0] bg-white px-3.5 text-[15px] text-[#1F1A17] placeholder:text-[#A89A8A] transition focus:border-[#D9480F] focus:outline-none focus:ring-3 focus:ring-[#D9480F]/15 aria-[invalid=true]:border-[#C4301C] aria-[invalid=true]:bg-[#FFF6F4]";

export const label = "mb-1.5 block text-[13px] font-bold text-[#4A3F37]";

export const ESTADO_MESA: Record<EstadoMesa, { nombre: string; fill: string; stroke: string; texto: string; chip: string }> = {
  libre: { nombre: "Libre", fill: "#FBF7F0", stroke: "#CDBDA6", texto: "#6B5E53", chip: "bg-[#EFE7DA] text-[#5D5047]" },
  ocupada: { nombre: "Ocupada", fill: "#3A302A", stroke: "#1F1A17", texto: "#F5EEE3", chip: "bg-[#3A302A] text-[#F5EEE3]" },
  pidiendo: { nombre: "Pidiendo", fill: "#F0B24A", stroke: "#B97A12", texto: "#3A2606", chip: "bg-[#F6D08C] text-[#5A3A05]" },
  cuenta: { nombre: "Cuenta", fill: "#D2460F", stroke: "#9E300A", texto: "#FFFFFF", chip: "bg-[#D2460F] text-white" },
};

/** "mm:ss" o "h:mm:ss" */
export function cronometro(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${String(m).padStart(2, "0")}:${ss}`;
}

export function minutos(ms: number) {
  return Math.max(0, Math.floor(ms / 60000));
}

/** Umbrales de demora de cocina. */
export const AMARILLO_MIN = 10;
export const ROJO_MIN = 18;

export function nivelDemora(ms: number): "ok" | "amarillo" | "rojo" {
  const m = ms / 60000;
  return m >= ROJO_MIN ? "rojo" : m >= AMARILLO_MIN ? "amarillo" : "ok";
}

/** Ilustración de plato por categoría (SVG propio). */
export function Plato({ cat, className = "size-16" }: { cat: Categoria; className?: string }) {
  const arte: Record<Categoria, ReactNode> = {
    Parrilla: (
      <>
        <ellipse cx="32" cy="34" rx="17" ry="11" fill="#8A3B1C" />
        <ellipse cx="30" cy="32" rx="14" ry="8.5" fill="#A5502A" />
        <path d="M20 27l6 12M27 25l6 13M34 25l6 12" stroke="#5E2410" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M44 25c2 1 3 3 2 5" stroke="#F4E3C8" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="47" cy="41" r="3" fill="#5B7F3A" /><circle cx="44" cy="44" r="2.4" fill="#78A04F" />
      </>
    ),
    Achuras: (
      <>
        <rect x="14" y="24" width="32" height="9" rx="4.5" fill="#9C3D22" transform="rotate(-12 30 28)" />
        <rect x="18" y="34" width="30" height="9" rx="4.5" fill="#3B1D17" transform="rotate(8 33 38)" />
        <path d="M20 26l2 4M27 24l2 4M34 23l2 4" stroke="#6E2512" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
    Entradas: (
      <>
        <circle cx="32" cy="33" r="14" fill="#F2D27A" />
        <circle cx="32" cy="33" r="14" fill="none" stroke="#C98F2E" strokeWidth="2.5" />
        <circle cx="27" cy="30" r="1.6" fill="#B23B14" /><circle cx="35" cy="36" r="1.6" fill="#B23B14" /><circle cx="36" cy="28" r="1.2" fill="#5B7F3A" /><circle cx="28" cy="37" r="1.2" fill="#5B7F3A" />
      </>
    ),
    Guarniciones: (
      <>
        {[[22, 36, -20], [27, 33, 10], [32, 37, -5], [37, 32, 25], [41, 37, -15], [30, 29, 40], [35, 40, 5]].map(([x, y, r], i) => (
          <rect key={i} x={x! - 2.2} y={y! - 8} width="4.4" height="16" rx="1.6" fill={i % 2 ? "#F2C14E" : "#E8AE2E"} transform={`rotate(${r} ${x} ${y})`} />
        ))}
      </>
    ),
    Ensaladas: (
      <>
        <path d="M18 34c2-9 9-13 14-13s12 4 14 13c-5 4-23 4-28 0z" fill="#6E9E45" />
        <path d="M22 30c3-4 7-6 10-6M32 24c4 0 8 3 10 7" stroke="#A7CC75" strokeWidth="2" fill="none" />
        <circle cx="28" cy="33" r="3.2" fill="#D8412B" /><circle cx="37" cy="31" r="3" fill="#D8412B" />
        <path d="M31 36c2-1 4-1 6 0" stroke="#EDE3F0" strokeWidth="1.6" fill="none" />
      </>
    ),
    Postres: (
      <>
        <path d="M22 40l3-15h14l3 15z" fill="#F2C46A" />
        <path d="M25 25h14l-1 4H26z" fill="#8A4A17" />
        <path d="M21 40h22" stroke="#C98F2E" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="44" cy="30" rx="4" ry="3" fill="#FFF7EA" />
      </>
    ),
    Bebidas: (
      <>
        <path d="M26 18h12l-1.5 22a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2z" fill="#E7EEF0" opacity=".9" />
        <path d="M26.8 27h10.4l-1 13a2 2 0 0 1-2 2h-4.4a2 2 0 0 1-2-2z" fill="#6B1F2A" />
        <path d="M35 20v10" stroke="#fff" strokeWidth="1.2" opacity=".7" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="33" r="27" fill="#E9DFD0" />
      <circle cx="32" cy="32" r="26" fill="#FFFDF9" />
      <circle cx="32" cy="32" r="20" fill="none" stroke="#EFE5D6" strokeWidth="1.5" />
      {arte[cat]}
    </svg>
  );
}
