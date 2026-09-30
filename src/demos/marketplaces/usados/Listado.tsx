"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useId, useState } from "react";
import { Icon } from "../shared/Icon";
import { pesos } from "../shared/utils";
import { barrios, categorias, estados, haceTexto, type Aviso } from "./data";
import { filtrosIniciales, useUsados, type Filtros } from "./store";
import { EstadoTag, boton, caja, display, foco } from "./ui";

export function Corazon({ id, titulo, grande = false }: { id: string; titulo: string; grande?: boolean }) {
  const { favs, toggleFav } = useUsados();
  const reducir = useReducedMotion();
  const activo = favs.includes(id);
  return (
    <button
      type="button"
      onClick={() => toggleFav(id)}
      aria-pressed={activo}
      aria-label={activo ? `Quitar “${titulo}” de favoritos` : `Guardar “${titulo}” en favoritos`}
      className={`grid place-items-center rounded-full border-[2.5px] border-(--sv-negro) shadow-[2px_2px_0_#141414] transition active:scale-90 motion-reduce:active:scale-100 ${foco} ${
        activo ? "bg-(--sv-rosa) text-white" : "bg-white text-(--sv-negro) hover:bg-(--sv-rosa)/15"
      } ${grande ? "size-12" : "size-10"}`}
    >
      <motion.span key={String(activo)} initial={reducir || !activo ? false : { scale: 1.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
        <Icon name="heart" size={grande ? 22 : 19} stroke={2.4} filled={activo} />
      </motion.span>
    </button>
  );
}

function Tarjeta({ a }: { a: Aviso }) {
  const { setDetalle } = useUsados();
  const img = a.imagenes[0]!;
  return (
    <article className={`group relative flex h-full flex-col overflow-hidden rounded-3xl ${caja} bg-white transition hover:-translate-y-1 hover:shadow-[6px_7px_0_#141414]`}>
      <div className="relative aspect-square overflow-hidden border-b-[2.5px] border-(--sv-negro)">
        <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1 sm:left-3 sm:top-3">
          <EstadoTag estado={a.estado} chico />
          {a.propio && <span className="rounded-full border-2 border-(--sv-negro) bg-(--sv-amarillo) px-2 py-0.5 text-[0.7rem] font-extrabold">Tu aviso</span>}
        </div>
        <div className="absolute right-2 top-2 z-10 sm:right-3 sm:top-3">
          <Corazon id={a.id} titulo={a.titulo} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className={`${display} text-2xl font-extrabold tracking-[-0.02em] sm:text-[1.7rem]`}>{pesos(a.precio)}</p>
        <h3 className="mt-1 line-clamp-2 text-[0.95rem] font-semibold leading-snug">
          <button type="button" onClick={() => setDetalle(a.id)} className={`text-left after:absolute after:inset-0 after:content-[''] ${foco} rounded`}>
            {a.titulo}
          </button>
        </h3>
        <p className="mt-auto flex flex-wrap items-center gap-x-1.5 pt-3 text-[0.8rem] font-medium text-(--sv-gris)">
          <Icon name="pin" size={14} stroke={2.2} />
          {a.barrio}
          <span aria-hidden="true">·</span>
          {a.propio ? "recién publicado" : haceTexto(a.minutos)}
        </p>
      </div>
    </article>
  );
}

export function Listado() {
  const { lista, filtros, setFiltro, limpiar, favs } = useUsados();
  const [mas, setMas] = useState(false);
  const id = useId();
  const hayFiltros = JSON.stringify(filtros) !== JSON.stringify(filtrosIniciales);
  const chip = (activo: boolean, color?: string) =>
    `shrink-0 rounded-full border-[2.5px] border-(--sv-negro) px-3.5 py-1.5 text-sm font-bold transition ${foco} ${activo ? "shadow-[2px_2px_0_#141414]" : "bg-white hover:bg-(--sv-fondo)"} ${activo && !color ? "bg-(--sv-negro) text-white" : ""}`;
  const input = `w-full rounded-xl border-[2.5px] border-(--sv-negro) bg-white px-3 py-2 text-sm font-semibold outline-none focus:shadow-[3px_3px_0_#7B5CFF]`;

  function toggleEstado(e: Filtros["estados"][number]) {
    setFiltro("estados", filtros.estados.includes(e) ? filtros.estados.filter((x) => x !== e) : [...filtros.estados, e]);
  }

  return (
    <section id="avisos" aria-labelledby="avisos-titulo" className="scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="avisos-titulo" className={`${display} text-4xl font-extrabold tracking-[-0.03em] sm:text-6xl`}>
            {filtros.soloFavs ? "Tus favoritos" : "Recién publicados"}
          </h2>
          <p className="font-semibold text-(--sv-gris)" aria-live="polite">
            {lista.length === 1 ? "1 aviso" : `${lista.length} avisos`}
            {favs.length > 0 && !filtros.soloFavs && ` · ${favs.length} en favoritos`}
          </p>
        </div>

        <div className={`mt-8 rounded-3xl ${caja} bg-white p-3 sm:p-4`}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex min-w-0 items-center gap-2 rounded-full border-[2.5px] border-(--sv-negro) bg-(--sv-fondo) px-3.5 md:hidden">
              <Icon name="search" size={18} stroke={2.4} />
              <label htmlFor={`${id}-q`} className="sr-only">
                Buscar avisos
              </label>
              <input
                id={`${id}-q`}
                type="search"
                value={filtros.q}
                onChange={(e) => setFiltro("q", e.target.value)}
                placeholder="Buscar en avisos"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-[0.95rem] font-medium outline-none"
              />
            </div>
            <div className="-mx-3 flex gap-2 overflow-x-auto px-3 py-1 sm:-mx-4 sm:px-4 lg:mx-0 lg:flex-1 lg:px-0" role="group" aria-label="Categoría">
              <button type="button" aria-pressed={filtros.categoria === null} onClick={() => setFiltro("categoria", null)} className={chip(filtros.categoria === null)}>
                Todo
              </button>
              {categorias.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={filtros.categoria === c.id}
                  onClick={() => setFiltro("categoria", filtros.categoria === c.id ? null : c.id)}
                  className={chip(filtros.categoria === c.id, c.color)}
                  style={filtros.categoria === c.id ? { background: c.color } : undefined}
                >
                  {c.nombre}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMas((m) => !m)}
                aria-expanded={mas}
                aria-controls={`${id}-mas`}
                className={`${boton} bg-(--sv-amarillo) px-4 py-2 text-sm lg:hidden`}
              >
                <Icon name="filter" size={17} stroke={2.6} />
                {mas ? "Menos filtros" : "Más filtros"}
              </button>
              <label className={`${boton} cursor-pointer px-4 py-2 text-sm has-[:checked]:bg-(--sv-rosa) has-[:checked]:text-white has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-(--sv-violeta) bg-white`}>
                <input type="checkbox" checked={filtros.soloFavs} onChange={(e) => setFiltro("soloFavs", e.target.checked)} className="sr-only" />
                <Icon name="heart" size={16} stroke={2.6} filled={filtros.soloFavs} />
                Favoritos
              </label>
            </div>
          </div>

          <div id={`${id}-mas`} className={`${mas ? "grid" : "hidden"} mt-4 gap-4 border-t-2 border-dashed border-(--sv-negro)/25 pt-4 sm:grid-cols-2 lg:grid lg:grid-cols-[1.3fr_1fr_1fr_1fr]`}>
            <fieldset>
              <legend className="mb-2 text-xs font-extrabold uppercase tracking-wider">Estado</legend>
              <div className="flex flex-wrap gap-2">
                {estados.map((e) => {
                  const on = filtros.estados.includes(e.id);
                  return (
                    <button
                      key={e.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleEstado(e.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full border-2 border-(--sv-negro) px-3 py-1 text-sm font-bold transition ${foco} ${on ? "shadow-[2px_2px_0_#141414]" : "bg-white"}`}
                      style={on ? { background: e.color } : undefined}
                    >
                      {on && <Icon name="check" size={14} stroke={3} />}
                      {e.nombre}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-xs font-extrabold uppercase tracking-wider">Precio</legend>
              <div className="flex items-center gap-2">
                <label className="sr-only" htmlFor={`${id}-min`}>
                  Precio mínimo
                </label>
                <input id={`${id}-min`} inputMode="numeric" placeholder="Mín." value={filtros.min} onChange={(e) => setFiltro("min", e.target.value.replace(/\D/g, ""))} className={input} />
                <span aria-hidden="true" className="font-bold">
                  –
                </span>
                <label className="sr-only" htmlFor={`${id}-max`}>
                  Precio máximo
                </label>
                <input id={`${id}-max`} inputMode="numeric" placeholder="Máx." value={filtros.max} onChange={(e) => setFiltro("max", e.target.value.replace(/\D/g, ""))} className={input} />
              </div>
            </fieldset>
            <div>
              <label htmlFor={`${id}-barrio`} className="mb-2 block text-xs font-extrabold uppercase tracking-wider">
                Barrio
              </label>
              <select id={`${id}-barrio`} value={filtros.barrio} onChange={(e) => setFiltro("barrio", e.target.value)} className={`${input} ${foco}`}>
                <option value="">Todos</option>
                {barrios.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${id}-orden`} className="mb-2 block text-xs font-extrabold uppercase tracking-wider">
                Ordenar por
              </label>
              <select id={`${id}-orden`} value={filtros.orden} onChange={(e) => setFiltro("orden", e.target.value as Filtros["orden"])} className={`${input} ${foco}`}>
                <option value="recientes">Más recientes</option>
                <option value="menor">Menor precio</option>
                <option value="mayor">Mayor precio</option>
              </select>
            </div>
          </div>
        </div>

        {hayFiltros && (
          <button type="button" onClick={limpiar} className={`mt-4 inline-flex items-center gap-1.5 rounded-full text-sm font-bold underline decoration-2 underline-offset-4 ${foco}`}>
            <Icon name="close" size={15} stroke={2.6} />
            Limpiar filtros
          </button>
        )}

        {lista.length === 0 ? (
          <div className={`mt-8 rounded-3xl ${caja} bg-white px-6 py-16 text-center`}>
            <span className="mx-auto grid size-20 place-items-center rounded-full border-[2.5px] border-(--sv-negro) bg-(--sv-amarillo)">
              <Icon name={filtros.soloFavs ? "heart" : "search"} size={34} stroke={2.4} />
            </span>
            <p className={`${display} mt-5 text-3xl font-extrabold tracking-[-0.02em]`}>
              {filtros.soloFavs && favs.length === 0 ? "Todavía no guardaste nada" : "No hay avisos así (todavía)"}
            </p>
            <p className="mx-auto mt-2 max-w-sm font-medium text-(--sv-gris)">
              {filtros.soloFavs && favs.length === 0
                ? "Tocá el corazón de un aviso y lo vas a encontrar acá, aunque cierres la página."
                : "Probá con otro precio o barrio. O publicá vos lo que buscás: alguien lo tiene."}
            </p>
            <button type="button" onClick={limpiar} className={`${boton} mt-6 bg-(--sv-negro) px-5 py-3 text-white`}>
              Ver todos los avisos
            </button>
          </div>
        ) : (
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
            {lista.map((a) => (
              <li key={a.id}>
                <Tarjeta a={a} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
