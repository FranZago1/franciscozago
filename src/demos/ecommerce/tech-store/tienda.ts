"use client";

import { crearTienda } from "../shared/tienda";
import type { TemaTienda } from "../shared/tipos";
import { crearValor } from "../shared/valor";
import { productos } from "./datos";

export const tienda = crearTienda("demo-voltio-carrito", productos.map((p) => p.id));

/** Productos elegidos para comparar (máximo 3), búsqueda del header y modal del comparador. */
export const MAX_COMPARAR = 3;
export const comparar = crearValor<string[]>([]);
export const comparadorAbierto = crearValor(false);
export const busqueda = crearValor("");
export const avisoComparar = crearValor("");

export function alternarComparar(id: string) {
  const actual = comparar.get();
  if (actual.includes(id)) {
    comparar.set(actual.filter((x) => x !== id));
    avisoComparar.set("Producto quitado del comparador.");
    return;
  }
  if (actual.length >= MAX_COMPARAR) {
    avisoComparar.set(`Podés comparar hasta ${MAX_COMPARAR} productos. Quitá uno para sumar otro.`);
    return;
  }
  comparar.set([...actual, id]);
  avisoComparar.set(`Sumado al comparador (${actual.length + 1} de ${MAX_COMPARAR}).`);
}

export const mono = "[font-family:var(--font-vt-mono)]";

const foco = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F5BFF]";

export const tema: TemaTienda = {
  panel: "bg-white text-[#16181D]",
  overlay: "bg-[#0B0D12]/55 backdrop-blur-[3px]",
  titulo: "text-2xl font-bold tracking-[-0.02em]",
  borde: "border-[#16181D]/10",
  suave: "text-[#16181D]/62",
  superficie: "bg-[#F3F5F8]",
  boton: `inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2F5BFF] px-6 text-[15px] font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_6px_16px_-8px_rgba(47,91,255,0.8)] transition-all hover:bg-[#2249E0] active:translate-y-px disabled:pointer-events-none disabled:opacity-45 ${foco}`,
  botonSec: `inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#16181D]/15 bg-white px-5 text-[15px] font-semibold transition-colors hover:border-[#16181D]/35 hover:bg-[#F3F5F8] ${foco}`,
  botonIcono: `grid size-10 place-items-center rounded-lg transition-colors hover:bg-[#16181D]/6 ${foco}`,
  input: "min-h-12 rounded-xl border border-[#16181D]/15 bg-white px-3.5 text-base outline-none transition-shadow focus:border-[#2F5BFF] focus:ring-4 focus:ring-[#2F5BFF]/15 aria-[invalid=true]:border-[#D92D20] aria-[invalid=true]:ring-[#D92D20]/10",
  label: "text-sm font-semibold",
  error: "text-[#C4231A]",
  opcion: "rounded-xl border border-[#16181D]/12 bg-white p-4 transition-colors hover:border-[#16181D]/30 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[#2F5BFF]/20",
  opcionOn: "!border-[#2F5BFF] bg-[#F4F7FF] ring-1 ring-[#2F5BFF]",
  barra: "bg-[#2F5BFF] text-white",
  pista: "bg-[#16181D]/8",
  imagen: "rounded-lg bg-[#EEF1F5]",
  acento: "text-[#2F5BFF]",
  toast: "",
  paso: "rounded-lg border border-[#16181D]/10 px-3 py-2 text-xs font-semibold text-[#16181D]/62",
  pasoOn: "!border-[#2F5BFF] !text-[#2F5BFF] bg-[#F4F7FF]",
  control: "rounded-lg border-[#16181D]/15 bg-white",
};
