"use client";

import { crearTienda } from "../shared/tienda";
import type { TemaTienda } from "../shared/tipos";
import { productos } from "./datos";

export const tienda = crearTienda("demo-pampa-club-carrito", productos.map((p) => p.id));

export const display = "[font-family:var(--font-pc-display)]";

const foco = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B0B0B]";

export const tema: TemaTienda = {
  panel: "bg-[#F3F2EE] text-[#0B0B0B]",
  overlay: "bg-[#0B0B0B]/70 backdrop-blur-[2px]",
  titulo: `${display} text-3xl uppercase leading-none tracking-tight`,
  borde: "border-[#0B0B0B]/15",
  suave: "text-[#0B0B0B]/60",
  superficie: "bg-[#E7E5DF]",
  boton: `inline-flex min-h-12 items-center justify-center bg-[#0B0B0B] px-6 text-sm font-bold tracking-[0.12em] text-[#F3F2EE] uppercase transition-colors hover:bg-[#D4FF2E] hover:text-[#0B0B0B] active:translate-y-px disabled:pointer-events-none disabled:opacity-40 ${foco}`,
  botonSec: `inline-flex min-h-12 items-center justify-center border-2 border-[#0B0B0B] px-6 text-sm font-bold tracking-[0.12em] uppercase transition-colors hover:bg-[#0B0B0B] hover:text-[#F3F2EE] ${foco}`,
  botonIcono: `grid size-10 place-items-center transition-colors hover:bg-[#0B0B0B] hover:text-[#D4FF2E] ${foco}`,
  input: `min-h-12 border-2 border-[#0B0B0B]/20 bg-white px-3.5 text-base outline-none transition-colors focus:border-[#0B0B0B] aria-[invalid=true]:border-[#D1261C]`,
  label: "text-xs font-bold tracking-[0.14em] uppercase",
  error: "font-medium text-[#C21F16]",
  opcion: `border-2 border-[#0B0B0B]/15 bg-white p-4 transition-colors hover:border-[#0B0B0B]/50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#0B0B0B]`,
  opcionOn: "!border-[#0B0B0B] shadow-[4px_4px_0_#D4FF2E]",
  barra: "bg-[#D4FF2E] text-[#0B0B0B]",
  pista: "bg-[#0B0B0B]/10",
  imagen: "bg-[#E4E2DC]",
  acento: "text-[#0B0B0B]",
  toast: "",
  paso: "border-t-4 border-[#0B0B0B]/15 pt-2 text-xs font-bold tracking-[0.1em] uppercase text-[#0B0B0B]/50",
  pasoOn: "!border-[#0B0B0B] !text-[#0B0B0B]",
  control: "border-2 border-[#0B0B0B]/20 bg-white",
};
