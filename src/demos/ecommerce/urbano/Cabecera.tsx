"use client";

import { useState } from "react";
import { Dialogo } from "../shared/Dialogo";
import { IconoBolsa, IconoCerrar, IconoMenu } from "../shared/Iconos";
import { unidades } from "../shared/tienda";
import { display, tienda } from "./tienda";

const links = [
  ["#drop", "Drop 07"],
  ["#tienda", "Tienda"],
  ["#lookbook", "Lookbook"],
  ["#club", "El club"],
] as const;

const foco = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4FF2E]";

export function Cabecera() {
  const cantidad = tienda.useTienda(unidades);
  const [menu, setMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0B0B] text-[#F3F2EE]">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-8">
        <button type="button" className={`-ml-2 grid size-10 place-items-center md:hidden ${foco}`} onClick={() => setMenu(true)} aria-label="Abrir menú">
          <IconoMenu trazo={2.25} />
        </button>
        <a href="#top" className={`${display} text-[1.7rem] leading-none tracking-tight uppercase ${foco}`}>
          Pampa<span className="text-[#D4FF2E]">/</span>Club
        </a>
        <nav aria-label="Secciones" className="hidden md:block">
          <ul className="flex gap-8 text-xs font-bold tracking-[0.18em] uppercase">
            {links.map(([href, label]) => (
              <li key={href}>
                <a href={href} className={`relative py-2 text-white/75 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[#D4FF2E] after:transition-transform hover:text-white hover:after:scale-x-100 ${foco}`}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          onClick={() => tienda.abrir("carrito")}
          className={`group relative -mr-2 flex h-10 items-center gap-2 px-2 text-xs font-bold tracking-[0.18em] uppercase ${foco}`}
          aria-label={`Abrir carrito, ${cantidad} ${cantidad === 1 ? "producto" : "productos"}`}
        >
          <span className="hidden sm:inline">Carrito</span>
          <span className="relative">
            <IconoBolsa className="size-6 transition-transform group-hover:-rotate-6" trazo={2} />
            <span
              className={`absolute -top-1.5 -right-2 grid h-[18px] min-w-[18px] place-items-center bg-[#D4FF2E] px-1 text-[10px] font-black text-[#0B0B0B] transition-transform ${cantidad ? "scale-100" : "scale-0"}`}
              aria-hidden="true"
            >
              {cantidad}
            </span>
          </span>
        </button>
      </div>

      <Dialogo abierto={menu} onCerrar={() => setMenu(false)} titulo="texto:Menú" variante="izquierda" className="bg-[#0B0B0B] text-[#F3F2EE]" overlayClassName="bg-black/60">
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <span className={`${display} text-2xl uppercase`}>Menú</span>
          <button type="button" className={`grid size-10 place-items-center ${foco}`} onClick={() => setMenu(false)} aria-label="Cerrar menú">
            <IconoCerrar trazo={2.25} />
          </button>
        </div>
        <nav aria-label="Secciones">
          <ul className="px-4 py-6">
            {links.map(([href, label]) => (
              <li key={href}>
                <a href={href} onClick={() => setMenu(false)} className={`${display} block border-b border-white/10 py-4 text-4xl uppercase transition-colors hover:text-[#D4FF2E] ${foco}`}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Dialogo>
    </header>
  );
}
