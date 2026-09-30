"use client";

import Image from "next/image";
import { useState } from "react";
import { pesos } from "../shared/formato";
import { Estrellas, IconoCheck, IconoMas } from "../shared/Iconos";
import { categorias, productos, type Categoria, type ProductoNatural } from "./datos";
import { Ilustracion } from "./Ilustracion";
import { quiz, serif, tienda } from "./tienda";

const foco = "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4A5634]";

export function Catalogo() {
  const [cat, setCat] = useState<Categoria | "Todo">("Todo");
  const lista = cat === "Todo" ? productos : productos.filter((p) => p.categoria === cat);
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Filtrar por categoría" className="flex flex-wrap gap-2">
          {(["Todo", ...categorias] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={c === cat}
              onClick={() => setCat(c)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${foco} ${
                c === cat ? "border-[#4A5634] bg-[#4A5634] text-[#F6F5EF]" : "border-[#2D3524]/15 bg-white/60 hover:border-[#2D3524]/40 hover:bg-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <p className="text-sm text-[#2D3524]/60" aria-live="polite">
          {lista.length} productos
        </p>
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
        {lista.map((p) => (
          <li key={p.id}>
            <Tarjeta p={p} />
          </li>
        ))}
        {cat === "Todo" ? (
          <li className="col-span-1 md:col-span-2 lg:col-span-3">
            <div className="relative flex h-full min-h-[260px] flex-col justify-end overflow-hidden rounded-[1.75rem] bg-[#E3B9AC] p-6 sm:p-10">
              <div className="pointer-events-none absolute -top-6 -right-6 opacity-90 sm:top-6 sm:right-10" aria-hidden="true">
                <Ilustracion id="calendula" className="size-40 sm:size-56" />
              </div>
              <p className="relative text-sm font-medium text-[#5E2F26]">Kit de regalo</p>
              <p className={`${serif} relative mt-2 max-w-md text-2xl leading-tight sm:text-4xl`}>Armá una caja con 3 productos y la envolvemos en tela, sin cargo.</p>
              <button type="button" onClick={() => quiz.set(true)} className={`relative mt-5 w-fit rounded-full bg-[#2D3524] px-5 py-2.5 text-sm font-semibold text-[#F6F5EF] transition-colors hover:bg-[#4A5634] ${foco}`}>
                ¿No sabés qué elegir? Hacé el test
              </button>
            </div>
          </li>
        ) : null}
      </ul>
    </div>
  );
}

function Tarjeta({ p }: { p: ProductoNatural }) {
  const [hecho, setHecho] = useState(false);
  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-[#E3E6D8]">
        <Image src={p.imagen} alt={p.alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none" />
        {p.sello ? <span className="absolute top-3 left-3 rounded-full bg-[#F6F5EF]/95 px-3 py-1 text-xs font-semibold text-[#8E4F43]">{p.sello}</span> : null}
        <button
          type="button"
          onClick={() => {
            tienda.agregar(p.id, { nombre: p.nombre });
            setHecho(true);
            window.setTimeout(() => setHecho(false), 1600);
          }}
          className={`absolute right-3 bottom-3 z-10 flex h-11 items-center gap-1.5 rounded-full bg-[#F6F5EF] pr-4 pl-3 text-sm font-semibold shadow-[0_6px_18px_-8px_rgba(45,53,36,0.5)] transition-all hover:bg-[#4A5634] hover:text-[#F6F5EF] active:scale-95 ${foco}`}
          aria-label={`Agregar ${p.nombre} al carrito`}
        >
          {hecho ? <IconoCheck className="size-4" trazo={2.2} /> : <IconoMas className="size-4" trazo={2.2} />}
          {hecho ? "Listo" : "Agregar"}
        </button>
      </div>
      <div className="mt-3 flex flex-1 flex-col px-1">
        <div className="flex items-center gap-1.5 text-xs text-[#2D3524]/65">
          <Estrellas valor={p.rating} className="size-3.5" colorLleno="#B8743F" colorVacio="#2D3524" />
          <span>
            {String(p.rating).replace(".", ",")} ({p.resenas})
          </span>
        </div>
        <h3 className={`${serif} mt-1.5 text-lg leading-snug sm:text-xl`}>
          <button type="button" onClick={() => tienda.verDetalle(p.id)} className={`text-left after:absolute after:inset-x-0 after:top-0 after:bottom-0 after:rounded-[1.75rem] hover:underline hover:decoration-[#B8C4A6] hover:decoration-2 hover:underline-offset-4 ${foco}`}>
            {p.nombre}
          </button>
        </h3>
        <p className="mt-1 hidden text-sm leading-snug text-[#2D3524]/65 sm:block">{p.bajada}</p>
        <p className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="font-semibold tabular-nums">{pesos(p.precio)}</span>
          <span className="text-xs text-[#2D3524]/55">{p.tamano}</span>
        </p>
      </div>
    </article>
  );
}
