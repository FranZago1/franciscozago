import type { CSSProperties } from "react";
import { Icon } from "../shared/Icon";
import type { CategoriaId } from "./data";

export const display = "[font-family:var(--font-dv-display)]";
export const sans = "[font-family:var(--font-dv-sans)]";

export const tokens = {
  "--dv-papel": "#F6EFDF",
  "--dv-papel2": "#EDE2C8",
  "--dv-crema": "#FFFBF2",
  "--dv-verde": "#1F4D2B",
  "--dv-verde2": "#2F6B3F",
  "--dv-brote": "#9CCB6E",
  "--dv-mostaza": "#E3A72F",
  "--dv-tomate": "#B33F26",
  "--dv-tinta": "#1D2A1F",
  "--dv-gris": "#566150",
  "--dv-linea": "#DACDAF",
} as CSSProperties;

export const foco =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--dv-tomate)";

export function Logo({ claro = false }: { claro?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="38" height="38" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="19" fill={claro ? "#F6EFDF" : "#1F4D2B"} />
        <path d="M20 31V19" stroke={claro ? "#1F4D2B" : "#F6EFDF"} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M20 21c0-5 3-8.5 8.5-9 0 5.5-3.5 9-8.5 9z" fill="#9CCB6E" />
        <path d="M20 24c0-4.2-2.6-7.2-7.2-7.6 0 4.6 3 7.6 7.2 7.6z" fill="#E3A72F" />
        <path d="M11 31h18" stroke={claro ? "#1F4D2B" : "#F6EFDF"} strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`${display} text-[1.35rem] font-semibold tracking-[-0.01em]`}>Del Valle</span>{" "}
        <span className="mt-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.28em] opacity-80">Mercado</span>
      </span>
    </span>
  );
}

export function Estrellas({ valor, resenas, claro = false }: { valor: number; resenas?: number; claro?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <Icon name="star" size={15} filled stroke={1.4} className="text-(--dv-mostaza)" />
      <span className="font-semibold">{valor.toFixed(1).replace(".", ",")}</span>
      {resenas !== undefined && (
        <span className={claro ? "text-white/70" : "text-(--dv-gris)"}>({resenas} reseñas)</span>
      )}
    </span>
  );
}

export function Stepper({
  cant,
  onCambiar,
  nombre,
  chico = false,
}: {
  cant: number;
  onCambiar: (n: number) => void;
  nombre: string;
  chico?: boolean;
}) {
  const btn = `grid place-items-center rounded-full text-(--dv-verde) transition hover:bg-(--dv-verde)/10 active:scale-95 ${foco} ${chico ? "size-8" : "size-10"}`;
  return (
    <div
      className={`inline-flex items-center rounded-full border border-(--dv-verde)/25 bg-(--dv-crema) ${chico ? "p-0.5" : "p-1"}`}
      role="group"
      aria-label={`Cantidad de ${nombre}`}
    >
      <button type="button" className={btn} onClick={() => onCambiar(cant - 1)} aria-label={cant === 1 ? `Quitar ${nombre}` : `Restar uno de ${nombre}`}>
        <Icon name={cant === 1 ? "trash" : "minus"} size={chico ? 15 : 17} stroke={2} />
      </button>
      <span className={`min-w-7 text-center font-semibold tabular-nums ${chico ? "text-sm" : ""}`} aria-live="polite">
        {cant}
      </span>
      <button type="button" className={btn} onClick={() => onCambiar(cant + 1)} aria-label={`Sumar uno de ${nombre}`}>
        <Icon name="plus" size={chico ? 15 : 17} stroke={2} />
      </button>
    </div>
  );
}

/** Íconos ilustrados de categoría, a dos tintas. */
export function IconoCategoria({ id, size = 44 }: { id: CategoriaId; size?: number }) {
  const s = { width: size, height: size };
  switch (id) {
    case "quesos":
      return (
        <svg viewBox="0 0 48 48" style={s} aria-hidden="true">
          <path d="M6 30 34 14l8 12v10H6z" fill="#F2C75A" />
          <path d="M6 30h36v6H6z" fill="#D9A441" />
          <circle cx="18" cy="31" r="2.2" fill="#C98A2B" />
          <circle cx="30" cy="25" r="2.6" fill="#D9A441" />
          <circle cx="24" cy="21" r="1.6" fill="#D9A441" />
          <path d="M6 30 34 14l8 12" fill="none" stroke="#1F4D2B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M6 30v6h36V26" fill="none" stroke="#1F4D2B" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case "miel":
      return (
        <svg viewBox="0 0 48 48" style={s} aria-hidden="true">
          <path d="M24 6 38 14v16L24 38 10 30V14z" fill="#E3A72F" />
          <path d="M24 13 31 17v8l-7 4-7-4v-8z" fill="#F6D27A" />
          <path d="M24 6 38 14v16L24 38 10 30V14z" fill="none" stroke="#1F4D2B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M31 30c0 4 1.5 7 3 10" stroke="#C4452A" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "verduras":
      return (
        <svg viewBox="0 0 48 48" style={s} aria-hidden="true">
          <path d="M16 20c6-3 14 3 12 9L14 42c-3 1-6-2-5-5z" fill="#E8742B" />
          <path d="M14 26l4 3M12 32l4 3" stroke="#B85A1C" strokeWidth="2" strokeLinecap="round" />
          <path d="M24 20c1-6 5-11 12-12M26 22c4-3 9-4 14-2M22 18c-1-5 0-9 3-12" stroke="#2F6B3F" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M16 20c6-3 14 3 12 9L14 42c-3 1-6-2-5-5z" fill="none" stroke="#1F4D2B" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case "dulces":
      return (
        <svg viewBox="0 0 48 48" style={s} aria-hidden="true">
          <rect x="11" y="16" width="26" height="26" rx="6" fill="#C4452A" />
          <rect x="15" y="25" width="18" height="10" rx="2" fill="#FFFBF2" />
          <path d="M9 16c3-6 27-6 30 0l-2 4H11z" fill="#9CCB6E" />
          <path d="M13 12h22" stroke="#1F4D2B" strokeWidth="2" strokeLinecap="round" />
          <rect x="11" y="16" width="26" height="26" rx="6" fill="none" stroke="#1F4D2B" strokeWidth="2" />
        </svg>
      );
    case "panificados":
      return (
        <svg viewBox="0 0 48 48" style={s} aria-hidden="true">
          <path d="M6 34c0-13 9-20 18-20s18 7 18 20z" fill="#D9974A" />
          <path d="M16 24c3-3 6-3 8 0M24 22c3-3 6-3 8 0" stroke="#F6DDAE" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M4 34h40" stroke="#1F4D2B" strokeWidth="2" strokeLinecap="round" />
          <path d="M6 34c0-13 9-20 18-20s18 7 18 20" fill="none" stroke="#1F4D2B" strokeWidth="2" />
        </svg>
      );
    case "vinos":
      return (
        <svg viewBox="0 0 48 48" style={s} aria-hidden="true">
          <path d="M14 42V22c0-4 3-5 3-9V6h6v7c0 4 3 5 3 9v20z" fill="#6E1E2B" />
          <rect x="15.5" y="26" width="9" height="9" fill="#F6EFDF" />
          <path d="M14 42V22c0-4 3-5 3-9V6h6v7c0 4 3 5 3 9v20z" fill="none" stroke="#1F4D2B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M31 22h10c0 6-2 9-5 9s-5-3-5-9z" fill="#C4452A" />
          <path d="M31 18h10c0 9-2 13-5 13s-5-4-5-13zM36 31v10M32 41h8" fill="none" stroke="#1F4D2B" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}
