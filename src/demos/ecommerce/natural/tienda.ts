"use client";

import { crearTienda } from "../shared/tienda";
import type { TemaTienda } from "../shared/tipos";
import { crearValor } from "../shared/valor";
import { porId, productos, type IngredienteId, type Rutina } from "./datos";

export const tienda = crearTienda("demo-hoja-barro-carrito", productos.map((p) => p.id));

/** Modales propios de esta demo. */
export const quiz = crearValor(false);
export const ficha = crearValor<IngredienteId | null>(null);

export const serif = "[font-family:var(--font-hb-serif)]";

export function agregarRutina(r: Rutina) {
  tienda.agregarVarios(
    r.pasos.map((p) => p.id),
    `Agregaste la ${r.nombre} al carrito: ${r.pasos.map((p) => porId[p.id]?.nombre).join(", ")}.`,
  );
}

export const precioRutina = (r: Rutina) => r.pasos.reduce((s, p) => s + (porId[p.id]?.precio ?? 0), 0);

const foco = "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4A5634]";

export const tema: TemaTienda = {
  panel: "bg-[#F6F5EF] text-[#2D3524]",
  overlay: "bg-[#2D3524]/40 backdrop-blur-sm",
  titulo: `${serif} text-[1.75rem] leading-tight font-normal`,
  borde: "border-[#2D3524]/12",
  suave: "text-[#2D3524]/72",
  superficie: "bg-[#ECEEE3]",
  boton: `inline-flex min-h-12 items-center justify-center rounded-full bg-[#4A5634] px-7 text-[15px] font-semibold text-[#F6F5EF] transition-all hover:bg-[#3A452A] hover:shadow-[0_6px_20px_-8px_rgba(58,69,42,0.6)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${foco}`,
  botonSec: `inline-flex min-h-12 items-center justify-center rounded-full border border-[#2D3524]/25 px-6 text-[15px] font-semibold transition-colors hover:border-[#2D3524] hover:bg-white ${foco}`,
  botonIcono: `grid size-10 place-items-center rounded-full transition-colors hover:bg-[#2D3524]/8 ${foco}`,
  input: "min-h-12 rounded-2xl border border-[#2D3524]/20 bg-white px-4 text-base outline-none transition-shadow focus:border-[#4A5634] focus:ring-4 focus:ring-[#B8C4A6]/50 aria-[invalid=true]:border-[#B4493A]",
  label: "text-sm font-medium",
  error: "text-[#A63F31]",
  opcion: "rounded-2xl border border-[#2D3524]/15 bg-white p-4 transition-colors hover:border-[#2D3524]/40 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[#B8C4A6]/60",
  opcionOn: "!border-[#4A5634] bg-[#F1F4EA] ring-1 ring-[#4A5634]",
  barra: "bg-[#6F7A4E] text-[#F6F5EF]",
  pista: "bg-[#2D3524]/10",
  imagen: "rounded-2xl bg-[#E3E6D8]",
  acento: "text-[#8E4F43]",
  toast: "",
  paso: "rounded-full bg-[#2D3524]/6 px-3 py-2 text-center text-xs font-medium text-[#2D3524]/72",
  pasoOn: "!bg-[#4A5634] !text-[#F6F5EF]",
  control: "rounded-full border-[#2D3524]/20 bg-white",
};
