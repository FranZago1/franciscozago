"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { pesos, cuota } from "../shared/formato";
import { categorias, config, productos, type Categoria, type ProductoUrbano } from "./datos";
import { display, tienda } from "./tienda";

type Orden = "destacados" | "menor" | "mayor";
const foco = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B0B0B]";

export function Catalogo() {
  const [cat, setCat] = useState<Categoria | "Todo">("Todo");
  const [orden, setOrden] = useState<Orden>("destacados");
  const [ocultarAgotados, setOcultarAgotados] = useState(false);

  const lista = useMemo(() => {
    const base = productos.filter((p) => (cat === "Todo" || p.categoria === cat) && (!ocultarAgotados || !p.agotado));
    if (orden === "menor") return [...base].sort((a, b) => a.precio - b.precio);
    if (orden === "mayor") return [...base].sort((a, b) => b.precio - a.precio);
    return base;
  }, [cat, orden, ocultarAgotados]);

  const conteo = (c: Categoria | "Todo") => (c === "Todo" ? productos.length : productos.filter((p) => p.categoria === c).length);

  return (
    <div>
      <div className="flex flex-col gap-5 border-y-2 border-[#0B0B0B] py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0" role="group" aria-label="Filtrar por categoría">
          <ul className="flex w-max gap-1.5">
            {(["Todo", ...categorias] as const).map((c) => {
              const on = c === cat;
              return (
                <li key={c}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setCat(c)}
                    className={`flex h-10 items-center gap-1.5 border-2 px-4 text-xs font-bold tracking-[0.14em] uppercase transition-colors ${foco} ${
                      on ? "border-[#0B0B0B] bg-[#0B0B0B] text-[#D4FF2E]" : "border-[#0B0B0B]/15 hover:border-[#0B0B0B]"
                    }`}
                  >
                    {c}
                    <sup className={`text-[10px] ${on ? "text-white/60" : "text-[#0B0B0B]/45"}`}>{conteo(c)}</sup>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-bold tracking-[0.12em] uppercase">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input type="checkbox" checked={ocultarAgotados} onChange={(e) => setOcultarAgotados(e.target.checked)} className="peer sr-only" />
            <span
              className="relative h-6 w-11 border-2 border-[#0B0B0B] bg-white transition-colors peer-checked:bg-[#0B0B0B] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#0B0B0B] after:absolute after:top-0.5 after:left-0.5 after:size-4 after:bg-[#0B0B0B] after:transition-transform peer-checked:after:translate-x-5 peer-checked:after:bg-[#D4FF2E]"
              aria-hidden="true"
            />
            Ocultar agotados
          </label>
          <label className="flex items-center gap-2">
            <span className="text-[#0B0B0B]/55">Ordenar</span>
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value as Orden)}
              className={`h-10 border-2 border-[#0B0B0B]/15 bg-white px-2 text-xs font-bold tracking-[0.1em] uppercase ${foco}`}
            >
              <option value="destacados">Destacados</option>
              <option value="menor">Menor precio</option>
              <option value="mayor">Mayor precio</option>
            </select>
          </label>
        </div>
      </div>

      <p className="mt-4 text-xs font-bold tracking-[0.14em] text-[#0B0B0B]/55 uppercase" aria-live="polite">
        {lista.length} {lista.length === 1 ? "producto" : "productos"}
        {cat !== "Todo" ? ` en ${cat.toLowerCase()}` : ""}
      </p>

      <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4">
        {lista.map((p, i) => {
          const editorial = cat === "Todo" && orden === "destacados" && !ocultarAgotados;
          const variante: Variante = editorial && i === 0 ? "grande" : editorial && (i === 9 || i === 14) ? "ancha" : "normal";
          const clase = variante === "grande" ? "col-span-2 md:col-span-1 lg:col-span-2 lg:row-span-2" : variante === "ancha" ? "col-span-2 md:col-span-1 lg:col-span-2" : "";
          return (
            <li key={p.id} className={clase}>
              <Tarjeta p={p} variante={variante} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type Variante = "normal" | "grande" | "ancha";

function Tarjeta({ p, variante }: { p: ProductoUrbano; variante: Variante }) {
  const disponibles = p.talles.filter((t) => !p.sinStock?.includes(t));
  const etiqueta = `${p.nombre}, ${pesos(p.precio)}${p.agotado ? ", agotado" : ""}. Ver detalle`;
  const badges = (
    <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
      {p.nuevo ? <span className="bg-[#D4FF2E] px-2 py-1 text-[10px] font-black tracking-[0.16em] text-[#0B0B0B] uppercase">Nuevo</span> : null}
      {p.agotado ? <span className="bg-[#0B0B0B] px-2 py-1 text-[10px] font-black tracking-[0.16em] text-white uppercase">Agotado</span> : null}
      {!p.agotado && p.sinStock?.length ? <span className="bg-white px-2 py-1 text-[10px] font-black tracking-[0.16em] text-[#0B0B0B] uppercase">Últimos talles</span> : null}
    </div>
  );
  const imagen = (sizes: string, extra = "") => (
    <Image
      src={p.imagen}
      alt={p.alt}
      fill
      sizes={sizes}
      className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none ${p.agotado ? "opacity-60 grayscale" : ""} ${extra}`}
    />
  );

  if (variante === "ancha") {
    return (
      <button type="button" onClick={() => tienda.verDetalle(p.id)} className={`group grid w-full grid-cols-2 bg-[#0B0B0B] text-left text-[#F3F2EE] md:block md:bg-transparent md:text-inherit lg:grid lg:h-full lg:bg-[#0B0B0B] lg:text-[#F3F2EE] ${foco}`} aria-label={etiqueta}>
        <div className="relative aspect-[4/5] overflow-hidden bg-[#E4E2DC] lg:aspect-auto lg:h-full lg:min-h-[420px]">
          {imagen("(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw")}
          {badges}
        </div>
        <div className="flex flex-col justify-between gap-4 p-4 sm:p-6 md:hidden lg:flex lg:p-8">
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#D4FF2E] uppercase">{p.categoria} / destacado</p>
          <div>
            <h3 className={`${display} text-3xl leading-[0.95] uppercase sm:text-5xl`}>{p.nombre}</h3>
            <p className="mt-3 hidden text-sm leading-relaxed text-white/65 sm:block">{p.descripcion}</p>
          </div>
          <div className="flex items-end justify-between gap-3">
            <p className="text-lg font-bold tabular-nums">{pesos(p.precio)}</p>
            <span className="border-b-2 border-[#D4FF2E] pb-0.5 text-[11px] font-bold tracking-[0.16em] uppercase transition-colors group-hover:text-[#D4FF2E]">Ver</span>
          </div>
        </div>
        <div className="hidden md:block lg:hidden">
          <Info p={p} />
        </div>
      </button>
    );
  }

  const grande = variante === "grande";
  return (
    <button type="button" onClick={() => tienda.verDetalle(p.id)} className={`group flex w-full flex-col text-left ${grande ? "h-full" : ""} ${foco}`} aria-label={etiqueta}>
      <div className={`relative overflow-hidden bg-[#E4E2DC] ${grande ? "aspect-[4/5] md:aspect-[4/5] lg:aspect-auto lg:min-h-[560px] lg:flex-1" : "aspect-[4/5]"}`}>
        {imagen(grande ? "(min-width: 1024px) 50vw, (min-width: 768px) 33vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw")}
        {badges}
        {!p.agotado ? (
          <div className="absolute inset-x-0 bottom-0 hidden translate-y-full items-center justify-between gap-2 bg-[#0B0B0B] px-3 py-2.5 text-[11px] font-bold tracking-[0.12em] text-white uppercase transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:transition-none sm:flex">
            <span className="truncate">{disponibles.join(" · ")}</span>
            <span className="shrink-0 text-[#D4FF2E]">Elegir talle</span>
          </div>
        ) : null}
      </div>
      <Info p={p} grande={grande} />
    </button>
  );
}

function Info({ p, grande = false }: { p: ProductoUrbano; grande?: boolean }) {
  return (
    <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
      <div className="min-w-0">
        <h3 className={`${display} text-lg leading-tight uppercase sm:text-xl ${grande ? "lg:text-4xl" : ""}`}>{p.nombre}</h3>
        <p className="mt-0.5 text-xs text-[#0B0B0B]/55">{p.color}</p>
      </div>
      <div className="shrink-0 sm:text-right">
        <p className={`text-sm font-bold tabular-nums ${p.agotado ? "text-[#0B0B0B]/40 line-through" : ""}`}>{pesos(p.precio)}</p>
        {!p.agotado ? (
          <p className="hidden text-[11px] text-[#0B0B0B]/55 sm:block">
            {config.cuotasSinInteres} × {pesos(cuota(p.precio, config.cuotasSinInteres))}
          </p>
        ) : null}
      </div>
    </div>
  );
}
