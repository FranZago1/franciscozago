import type { CSSProperties } from "react";
import { estadoPorId, type Estado } from "./data";

export const display = "[font-family:var(--font-sv-display)]";
export const sans = "[font-family:var(--font-sv-sans)]";

export const tokens = {
  "--sv-fondo": "#FFF6E5",
  "--sv-negro": "#141414",
  "--sv-violeta": "#7B5CFF",
  "--sv-amarillo": "#FFE14D",
  "--sv-rosa": "#FF5CA8",
  "--sv-verde": "#3DDC97",
  "--sv-naranja": "#FF8A3D",
  "--sv-celeste": "#4CC9F0",
  "--sv-gris": "#5E5A52",
} as CSSProperties;

export const foco = "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--sv-violeta)";
/** Borde marcado + sombra dura: la firma visual de Segunda Vuelta. */
export const caja = "border-[2.5px] border-(--sv-negro) shadow-[4px_4px_0_#141414]";
export const boton = `inline-flex items-center justify-center gap-2 rounded-full border-[2.5px] border-(--sv-negro) font-bold shadow-[3px_3px_0_#141414] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#141414] hover:-translate-y-0.5 hover:shadow-[4px_5px_0_#141414] ${foco}`;

export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <svg viewBox="0 0 40 40" aria-hidden="true" className="size-9 sm:size-10">
        <circle cx="20" cy="20" r="18" fill="#FFE14D" stroke="#141414" strokeWidth="2.5" />
        <path d="M11 20a9 9 0 0 1 15.5-6.2" fill="none" stroke="#141414" strokeWidth="3" strokeLinecap="round" />
        <path d="m27.5 9.5-.8 5.3-5.2-.9" fill="none" stroke="#141414" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M29 20a9 9 0 0 1-15.5 6.2" fill="none" stroke="#7B5CFF" strokeWidth="3" strokeLinecap="round" />
        <path d="m12.5 30.5.8-5.3 5.2.9" fill="none" stroke="#7B5CFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={`${display} text-[1.15rem] font-extrabold leading-none tracking-[-0.03em] sm:text-[1.35rem]`}>
        segunda<span className="text-(--sv-violeta)">vuelta</span>
      </span>
    </span>
  );
}

export function EstadoTag({ estado, chico = false }: { estado: Estado; chico?: boolean }) {
  const e = estadoPorId[estado];
  return (
    <span
      className={`inline-flex items-center rounded-full border-2 border-(--sv-negro) font-bold ${chico ? "px-2 py-0.5 text-[0.7rem]" : "px-2.5 py-0.5 text-xs"}`}
      style={{ background: e.color }}
    >
      {e.nombre}
    </span>
  );
}

export function Avatar({ nombre, color, size = 40 }: { nombre: string; color: string; size?: number }) {
  const ini = nombre
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2);
  return (
    <span
      className={`${display} grid shrink-0 place-items-center rounded-full border-[2.5px] border-(--sv-negro) font-extrabold`}
      style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}
      aria-hidden="true"
    >
      {ini}
    </span>
  );
}
