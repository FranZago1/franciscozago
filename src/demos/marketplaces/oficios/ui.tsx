import type { CSSProperties } from "react";
import { Icon } from "../shared/Icon";
import { oficioPorId, type OficioId } from "./data";

export const ancho = "[font-stretch:118%]";
export const mono = "[font-family:var(--font-ma-mono)]";
export const sans = "[font-family:var(--font-ma-sans)]";

export const tokens = {
  "--ma-azul": "#0B2A5B",
  "--ma-azul2": "#123C7C",
  "--ma-azul3": "#2156A8",
  "--ma-amarillo": "#FFC928",
  "--ma-amarillo2": "#FFB800",
  "--ma-fondo": "#F2F5FA",
  "--ma-tinta": "#0E1726",
  "--ma-gris": "#56627A",
  "--ma-linea": "#DAE1EC",
  "--ma-verde": "#12805A",
  "--ma-rojo": "#C8372D",
} as CSSProperties;

export const foco = "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--ma-amarillo2)";

/** Cinta de seguridad amarilla y negra, sello visual de la marca. */
export const cinta = "bg-[repeating-linear-gradient(-45deg,#FFC928_0_16px,#0E1726_16px_32px)]";

export function Logo({ claro = false }: { claro?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
        <rect width="36" height="36" rx="9" fill="#FFC928" />
        <path d="M8 19.5 18 11l10 8.5V28H8z" fill="#0B2A5B" />
        <path d="M14.5 28v-5.5a3.5 3.5 0 0 1 7 0V28" fill="#FFC928" />
        <path d="M22.5 13.5 26 10" stroke="#0B2A5B" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
      <span className={`${ancho} text-[1.3rem] font-extrabold tracking-[-0.02em] ${claro ? "text-white" : "text-(--ma-azul)"}`}>
        Mano<span className={claro ? "text-(--ma-amarillo)" : "text-(--ma-azul3)"}>Amiga</span>
      </span>
    </span>
  );
}

export function Estrellas({ valor, size = 16 }: { valor: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon
          key={i}
          name="star"
          size={size}
          stroke={1.2}
          filled={valor >= i - 0.25}
          className={valor >= i - 0.25 ? "text-(--ma-amarillo2)" : "text-(--ma-linea)"}
        />
      ))}
    </span>
  );
}

export function ChipOficio({ id, claro = false }: { id: OficioId; claro?: boolean }) {
  const o = oficioPorId[id];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[0.78rem] font-bold ${claro ? "bg-white/12 text-white" : "bg-(--ma-fondo) text-(--ma-azul)"}`}
    >
      <span className="grid size-5 place-items-center rounded" style={{ background: o.color, color: "#fff" }}>
        <Icon name={o.icono} size={13} stroke={2.4} />
      </span>
      {o.nombre}
    </span>
  );
}

export function Verificado({ matricula, chico = false }: { matricula: string; chico?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border border-(--ma-verde)/25 bg-(--ma-verde)/8 px-2 py-1 text-[#117D57] ${chico ? "text-[0.72rem]" : "text-[0.78rem]"}`}>
      <Icon name="shield" size={chico ? 14 : 15} stroke={2.2} />
      <span className={`${mono} font-medium`}>{matricula}</span>
      <span className="font-semibold">verificada</span>
    </span>
  );
}
