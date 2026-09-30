"use client";

import Image from "next/image";
import { IconoBolsa, IconoBuscar, IconoCerrar, IconoComparar, IconoRayo } from "../shared/Iconos";
import { unidades } from "../shared/tienda";
import { porId } from "./datos";
import { alternarComparar, avisoComparar, busqueda, comparadorAbierto, comparar, MAX_COMPARAR, tienda } from "./tienda";

const foco = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F5BFF]";

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2 text-[1.35rem] font-extrabold tracking-[-0.04em]">
      <span className="grid size-8 place-items-center rounded-lg bg-[#2F5BFF] text-white shadow-[0_6px_14px_-6px_rgba(47,91,255,0.9)]">
        <IconoRayo className="size-[18px]" trazo={2.2} />
      </span>
      voltio
    </span>
  );
}

export function Cabecera() {
  const n = tienda.useTienda(unidades);
  const q = busqueda.use();
  const lista = comparar.use();
  const aviso = avisoComparar.use();

  const buscador = (id: string, clase: string) => (
    <div className={`relative ${clase}`}>
      <label htmlFor={id} className="sr-only">
        Buscar productos
      </label>
      <IconoBuscar className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-[#16181D]/45" />
      <input
        id={id}
        type="search"
        value={q}
        onChange={(e) => {
          busqueda.set(e.target.value);
          if (e.target.value && window.scrollY < 400) document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        placeholder="Buscá auriculares, notebooks, marcas…"
        className="h-11 w-full rounded-xl border border-transparent bg-[#F0F2F6] pr-4 pl-10 text-[15px] outline-none transition-all placeholder:text-[#16181D]/45 focus:border-[#2F5BFF] focus:bg-white focus:ring-4 focus:ring-[#2F5BFF]/15"
      />
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-[#16181D]/8 bg-white/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-4 px-4 sm:px-6 lg:gap-8">
        <a href="#top" className={`shrink-0 rounded-lg ${foco}`} aria-label="Voltio, inicio">
          <Logo />
        </a>
        {buscador("vt-buscar", "hidden flex-1 md:block md:max-w-xl")}
        <nav aria-label="Secciones" className="ml-auto hidden lg:block">
          <ul className="flex gap-6 text-sm font-medium text-[#16181D]/70">
            <li>
              <a href="#catalogo" className={`rounded hover:text-[#16181D] ${foco}`}>
                Catálogo
              </a>
            </li>
            <li>
              <a href="#ofertas" className={`rounded hover:text-[#16181D] ${foco}`}>
                Ofertas
              </a>
            </li>
            <li>
              <a href="#ayuda" className={`rounded hover:text-[#16181D] ${foco}`}>
                Envíos y garantía
              </a>
            </li>
          </ul>
        </nav>
        <button
          type="button"
          onClick={() => tienda.abrir("carrito")}
          className={`relative ml-auto flex h-11 items-center gap-2 rounded-xl bg-[#16181D] px-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#2F5BFF] lg:ml-0 ${foco}`}
          aria-label={`Abrir carrito, ${n} ${n === 1 ? "producto" : "productos"}`}
        >
          <IconoBolsa className="size-5" trazo={1.8} />
          <span className="font-[inherit] tabular-nums">{n}</span>
        </button>
      </div>
      <div className="px-4 pb-3 md:hidden">{buscador("vt-buscar-movil", "")}</div>

      {lista.length ? (
        <div className="border-t border-[#16181D]/8 bg-[#F4F7FF]">
          <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 sm:px-6">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#2F5BFF]">
              <IconoComparar className="size-[18px]" /> Comparando {lista.length} de {MAX_COMPARAR}
            </p>
            <ul className="flex gap-2">
              {lista.map((id) => {
                const p = porId[id];
                if (!p) return null;
                return (
                  <li key={id} className="flex items-center gap-1.5 rounded-lg border border-[#2F5BFF]/20 bg-white py-1 pr-1 pl-1">
                    <span className="relative size-7 overflow-hidden rounded bg-[#EEF1F5]">
                      <Image src={p.imagen} alt="" fill sizes="28px" className="object-cover" />
                    </span>
                    <span className="hidden max-w-[9rem] truncate text-xs font-medium sm:inline">{p.nombre}</span>
                    <button type="button" onClick={() => alternarComparar(id)} className={`grid size-6 place-items-center rounded text-[#16181D]/55 hover:bg-[#16181D]/6 hover:text-[#16181D] ${foco}`} aria-label={`Quitar ${p.nombre} del comparador`}>
                      <IconoCerrar className="size-3.5" trazo={2.2} />
                    </button>
                  </li>
                );
              })}
            </ul>
            {aviso.startsWith("Podés") ? <p className="text-xs font-medium text-[#C4231A]">{aviso}</p> : null}
            <div className="ml-auto flex items-center gap-2">
              <button type="button" onClick={() => comparar.set([])} className={`rounded-lg px-3 py-2 text-sm font-medium text-[#16181D]/65 hover:bg-white ${foco}`}>
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => comparadorAbierto.set(true)}
                disabled={lista.length < 2}
                className={`rounded-lg bg-[#2F5BFF] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2249E0] disabled:bg-[#2F5BFF]/35 ${foco}`}
              >
                {lista.length < 2 ? "Elegí otro para comparar" : "Ver comparación"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <p className="sr-only" role="status" aria-live="polite">
        {aviso}
      </p>
    </header>
  );
}
