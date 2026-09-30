"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { precioARS } from "../shared/formato";
import { Icono } from "../shared/Icono";
import { categoriaPorId, categorias, duraciones, tratamientos, type CategoriaId, type DuracionId } from "./datos";
import { useTurno } from "./Turno";

const serif = "[font-family:var(--font-ac-serif)]";

export function Tratamientos() {
  const [categoria, setCategoria] = useState<CategoriaId | "todas">("todas");
  const [duracion, setDuracion] = useState<DuracionId>("todas");
  const { setServicio } = useTurno();

  const lista = useMemo(() => {
    const test = duraciones.find((d) => d.id === duracion)!.test;
    return tratamientos.filter((t) => (categoria === "todas" || t.categoria === categoria) && test(t.minutos));
  }, [categoria, duracion]);

  const cats: { id: CategoriaId | "todas"; nombre: string }[] = [{ id: "todas", nombre: "Todos" }, ...categorias];

  function reservar(id: string) {
    setServicio(id);
    const destino = document.getElementById("turno");
    destino?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    window.setTimeout(() => document.getElementById("ac-servicio")?.focus({ preventScroll: true }), 500);
  }

  return (
    <div>
      <div className="flex flex-col gap-6 border-b border-[#3E4C43]/15 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div role="group" aria-label="Filtrar por categoría" className="-mx-5 flex gap-1 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {cats.map((c) => {
            const activo = categoria === c.id;
            const n = c.id === "todas" ? tratamientos.length : tratamientos.filter((t) => t.categoria === c.id).length;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={activo}
                onClick={() => setCategoria(c.id)}
                className={`group inline-flex shrink-0 items-baseline gap-1.5 rounded-full px-4 py-2 text-[15px] transition-colors duration-300 ${
                  activo ? "bg-[#3E4C43] text-[#F6F4EE]" : "text-[#3E4C43] hover:bg-[#3E4C43]/[0.07]"
                }`}
              >
                {c.nombre}
                <sup className={`text-[11px] ${activo ? "text-[#F6F4EE]/70" : "text-[#3E4C43]/80"}`}>{n}</sup>
              </button>
            );
          })}
        </div>
        <fieldset className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
          <legend className="sr-only">Filtrar por duración</legend>
          <span aria-hidden="true" className="flex items-center gap-2 text-sm text-[#3E4C43]/80">
            <Icono nombre="reloj" grosor={1.3} className="size-4" />
            Duración
          </span>
          <div className="flex flex-wrap gap-1.5">
            {duraciones.map((d) => (
              <label
                key={d.id}
                className={`relative cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#6E5D84] ${
                  duracion === d.id
                    ? "border-[#8F7FA3] bg-[#E9E3EF] text-[#4A3D5C]"
                    : "border-[#3E4C43]/20 text-[#3E4C43]/80 hover:border-[#3E4C43]/45"
                }`}
              >
                <input
                  type="radio"
                  name="ac-duracion"
                  value={d.id}
                  checked={duracion === d.id}
                  onChange={() => setDuracion(d.id)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                {d.nombre}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <p className="mt-5 text-sm text-[#3E4C43]/80" aria-live="polite">
        {lista.length === 0
          ? "No hay tratamientos con esos filtros."
          : `${lista.length} ${lista.length === 1 ? "tratamiento" : "tratamientos"}${
              categoria !== "todas" ? ` de ${categoriaPorId[categoria].nombre.toLowerCase()}` : ""
            }`}
      </p>

      {lista.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-[28px] border border-dashed border-[#3E4C43]/25 px-6 py-14 text-center">
          <p className={`${serif} text-2xl text-[#3E4C43]`}>Nada por acá… todavía.</p>
          <p className="mt-2 max-w-sm text-[#3E4C43]/80">Probá con otra duración o mirá todos los tratamientos.</p>
          <button
            type="button"
            onClick={() => {
              setCategoria("todas");
              setDuracion("todas");
            }}
            className="mt-6 rounded-full border border-[#3E4C43] px-5 py-2.5 text-sm text-[#3E4C43] transition-colors hover:bg-[#3E4C43] hover:text-[#F6F4EE]"
          >
            Ver todos
          </button>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {lista.map((t) => {
            const cat = categoriaPorId[t.categoria];
            return (
              <li key={t.id} className="ac-aparecer">
                <article className="group flex h-full gap-4 rounded-[28px] bg-white/60 p-4 ring-1 ring-[#3E4C43]/[0.08] transition-[background-color,box-shadow] duration-500 hover:bg-white hover:shadow-[0_20px_50px_-30px_rgba(62,76,67,0.45)] sm:p-5">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl sm:size-28 sm:rounded-[20px]">
                    <Image
                      src={cat.imagen}
                      alt={cat.alt}
                      fill
                      sizes="112px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="flex flex-wrap items-center gap-2 text-xs tracking-[0.16em] text-[#6E5D84] uppercase">
                      {cat.nombre}
                      {t.etiqueta && (
                        <span className="rounded-full bg-[#E9E3EF] px-2 py-0.5 text-[10px] tracking-[0.12em] text-[#4A3D5C]">{t.etiqueta}</span>
                      )}
                    </p>
                    <h3 className={`${serif} mt-1.5 text-[1.35rem] leading-tight text-[#26302A]`}>{t.nombre}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-[#3E4C43]/80">{t.descripcion}</p>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                      <p className="text-sm whitespace-nowrap text-[#3E4C43]">
                        <span className="tabular-nums">{t.minutos} min</span>
                        <span aria-hidden="true" className="mx-2 text-[#3E4C43]/30">
                          |
                        </span>
                        <span className="font-medium tabular-nums">{precioARS(t.precio)}</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => reservar(t.id)}
                        aria-label={`Reservar ${t.nombre}`}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#3E4C43]/30 px-3.5 py-2 text-sm sm:px-4 text-[#3E4C43] transition-colors duration-300 hover:border-[#3E4C43] hover:bg-[#3E4C43] hover:text-[#F6F4EE]"
                      >
                        Reservar
                        <Icono nombre="flecha" grosor={1.4} className="hidden size-4 sm:block" />
                      </button>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
