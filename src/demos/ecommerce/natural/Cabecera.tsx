"use client";

import { useState } from "react";
import { Dialogo } from "../shared/Dialogo";
import { IconoBolsa, IconoCerrar, IconoMenu } from "../shared/Iconos";
import { unidades } from "../shared/tienda";
import { quiz, serif, tienda } from "./tienda";

const links = [
  ["#tienda", "Tienda"],
  ["#rutinas", "Rutinas"],
  ["#ingredientes", "Ingredientes"],
  ["#resenas", "Reseñas"],
] as const;

const foco = "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4A5634]";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`${serif} inline-flex items-baseline gap-1 tracking-tight ${className}`}>
      Hoja <em className="font-light text-[#8E4F43]">&amp;</em> Barro
    </span>
  );
}

export function Cabecera() {
  const n = tienda.useTienda(unidades);
  const [menu, setMenu] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-[#2D3524]/10 bg-[#F6F5EF]/90 backdrop-blur-md">
      <div className="mx-auto grid h-[68px] max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-8">
        <div className="flex items-center">
          <button type="button" onClick={() => setMenu(true)} className={`-ml-2 grid size-10 place-items-center rounded-full lg:hidden ${foco}`} aria-label="Abrir menú">
            <IconoMenu />
          </button>
          <nav aria-label="Secciones" className="hidden lg:block">
            <ul className="flex gap-7 text-[15px]">
              {links.map(([h, l]) => (
                <li key={h}>
                  <a href={h} className={`rounded-full py-1 text-[#2D3524]/75 transition-colors hover:text-[#2D3524] ${foco}`}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <a href="#top" className={`rounded-lg text-[1.65rem] leading-none sm:text-3xl ${foco}`} aria-label="Hoja & Barro, inicio">
          <Logo />
        </a>
        <div className="flex items-center justify-end gap-1 sm:gap-3">
          <button type="button" onClick={() => quiz.set(true)} className={`hidden rounded-full border border-[#2D3524]/20 px-4 py-2 text-sm font-medium transition-colors hover:bg-white md:inline-flex ${foco}`}>
            Encontrá tu rutina
          </button>
          <button type="button" onClick={() => tienda.abrir("carrito")} className={`relative -mr-2 grid size-11 place-items-center rounded-full transition-colors hover:bg-[#2D3524]/6 ${foco}`} aria-label={`Abrir carrito, ${n} ${n === 1 ? "producto" : "productos"}`}>
            <IconoBolsa className="size-6" trazo={1.5} />
            {n ? (
              <span className="absolute top-1 right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#8E4F43] px-1 text-[11px] font-semibold text-white" aria-hidden="true">
                {n}
              </span>
            ) : null}
          </button>
        </div>
      </div>
      <Dialogo abierto={menu} onCerrar={() => setMenu(false)} titulo="texto:Menú" variante="izquierda" className="rounded-r-3xl bg-[#F6F5EF] text-[#2D3524]" overlayClassName="bg-[#2D3524]/40 backdrop-blur-sm">
        <div className="flex h-[68px] items-center justify-between px-5">
          <Logo className="text-2xl" />
          <button type="button" onClick={() => setMenu(false)} className={`grid size-10 place-items-center rounded-full ${foco}`} aria-label="Cerrar menú">
            <IconoCerrar />
          </button>
        </div>
        <nav aria-label="Secciones" className="px-5 pt-4">
          <ul>
            {links.map(([h, l]) => (
              <li key={h}>
                <a href={h} onClick={() => setMenu(false)} className={`${serif} block border-b border-[#2D3524]/10 py-4 text-3xl ${foco}`}>
                  {l}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              setMenu(false);
              quiz.set(true);
            }}
            className={`mt-8 w-full rounded-full bg-[#4A5634] px-6 py-3.5 font-semibold text-[#F6F5EF] ${foco}`}
          >
            Encontrá tu rutina
          </button>
        </nav>
      </Dialogo>
    </header>
  );
}
