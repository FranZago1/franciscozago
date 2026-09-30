"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { Dialog } from "../shared/Dialog";
import { Icon } from "../shared/Icon";
import { pesos } from "../shared/utils";
import { barrios, dispTexto, oficioPorId, oficios, type Profesional } from "./data";
import { filtrosIniciales, useOficios, type Filtros } from "./store";
import { ChipOficio, Estrellas, Verificado, ancho, foco, mono } from "./ui";

const ordenes: [Filtros["orden"], string][] = [
  ["recomendados", "Recomendados"],
  ["rating", "Mejor puntuados"],
  ["resenas", "Más reseñas"],
  ["respuesta", "Responden más rápido"],
];

function PanelFiltros({ idBase }: { idBase: string }) {
  const { filtros, setFiltro } = useOficios();
  const opcion = (activo: boolean) =>
    `flex w-full items-center gap-2.5 rounded-lg border-2 px-3 py-2 text-left text-sm font-semibold transition ${foco} ${
      activo ? "border-(--ma-azul) bg-(--ma-azul) text-white" : "border-(--ma-linea) bg-white text-(--ma-tinta) hover:border-(--ma-azul)/40"
    }`;
  return (
    <div className="space-y-7">
      <fieldset>
        <legend className="text-xs font-extrabold uppercase tracking-[0.14em] text-(--ma-gris)">Oficio</legend>
        <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-1">
          <button type="button" aria-pressed={filtros.oficio === null} onClick={() => setFiltro("oficio", null)} className={opcion(filtros.oficio === null)}>
            <Icon name="wrench" size={17} stroke={2.2} />
            Todos
          </button>
          {oficios.map((o) => (
            <button key={o.id} type="button" aria-pressed={filtros.oficio === o.id} onClick={() => setFiltro("oficio", o.id)} className={opcion(filtros.oficio === o.id)}>
              <Icon name={o.icono} size={17} stroke={2.2} style={{ color: filtros.oficio === o.id ? "#FFC928" : o.color }} />
              {o.nombre}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor={`${idBase}-barrio`} className="text-xs font-extrabold uppercase tracking-[0.14em] text-(--ma-gris)">
          Barrio
        </label>
        <div className="relative mt-3">
          <select
            id={`${idBase}-barrio`}
            value={filtros.barrio}
            onChange={(e) => setFiltro("barrio", e.target.value)}
            className={`w-full appearance-none rounded-lg border-2 border-(--ma-linea) bg-white py-2.5 pl-3 pr-9 text-sm font-semibold ${foco}`}
          >
            <option value="">Todos los barrios</option>
            {barrios.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <Icon name="chevronDown" size={16} stroke={2.4} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--ma-gris)" />
        </div>
      </div>

      <fieldset>
        <legend className="text-xs font-extrabold uppercase tracking-[0.14em] text-(--ma-gris)">Disponibilidad</legend>
        <div className="mt-3 grid grid-cols-3 gap-2 lg:grid-cols-1">
          {(
            [
              ["cualquiera", "Cualquier día"],
              ["hoy", "Hoy"],
              ["semana", "Esta semana"],
            ] as const
          ).map(([v, t]) => (
            <label
              key={v}
              className={`flex cursor-pointer items-center justify-center gap-2.5 rounded-lg border-2 px-2 py-2 text-center text-sm font-semibold transition has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--ma-amarillo2) lg:justify-start lg:px-3 lg:text-left ${
                filtros.disp === v ? "border-(--ma-azul) bg-(--ma-azul) text-white" : "border-(--ma-linea) bg-white text-(--ma-tinta) hover:border-(--ma-azul)/40"
              }`}
            >
              <input type="radio" name={`${idBase}-disp`} value={v} checked={filtros.disp === v} onChange={() => setFiltro("disp", v)} className="sr-only" />
              <span className={`hidden size-4 shrink-0 place-items-center rounded-full border-2 lg:grid ${filtros.disp === v ? "border-(--ma-amarillo)" : "border-(--ma-linea)"}`}>
                {filtros.disp === v && <span className="size-1.5 rounded-full bg-(--ma-amarillo)" />}
              </span>
              {t}
            </label>
          ))}
        </div>
        <label className="mt-3 flex cursor-pointer items-center justify-between gap-3 rounded-lg border-2 border-(--ma-linea) bg-white px-3 py-2.5 text-sm font-semibold has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-(--ma-amarillo2)">
          <span className="flex items-center gap-2">
            <Icon name="bolt" size={17} stroke={2.2} className="text-(--ma-rojo)" />
            Atiende urgencias 24 h
          </span>
          <input type="checkbox" checked={filtros.urgencias} onChange={(e) => setFiltro("urgencias", e.target.checked)} className="peer sr-only" />
          <span className="relative h-6 w-11 shrink-0 rounded-full bg-(--ma-linea) transition peer-checked:bg-(--ma-verde) after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
        </label>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-extrabold uppercase tracking-[0.14em] text-(--ma-gris)">Puntuación</legend>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(
            [
              [0, "Todas"],
              [4.5, "4,5+"],
              [4.8, "4,8+"],
            ] as const
          ).map(([v, t]) => (
            <label
              key={v}
              className={`flex cursor-pointer items-center justify-center gap-1 rounded-lg border-2 py-2 text-sm font-bold transition has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-(--ma-amarillo2) ${
                filtros.ratingMin === v ? "border-(--ma-azul) bg-(--ma-azul) text-white" : "border-(--ma-linea) bg-white hover:border-(--ma-azul)/40"
              }`}
            >
              <input type="radio" name={`${idBase}-rating`} checked={filtros.ratingMin === v} onChange={() => setFiltro("ratingMin", v)} className="sr-only" />
              {v > 0 && <Icon name="star" size={14} filled stroke={1.2} className="text-(--ma-amarillo2)" />}
              {t}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

function Tarjeta({ p }: { p: Profesional }) {
  const { setPerfil, pedir } = useOficios();
  const o = oficioPorId[p.oficio];
  const hoy = p.disp === "hoy";
  return (
    <article className="group relative rounded-2xl border-2 border-(--ma-linea) bg-white p-4 transition hover:border-(--ma-azul)/35 hover:shadow-[0_18px_40px_-26px_rgba(11,42,91,0.55)] sm:p-5">
      <div className="flex gap-4">
        <div className="relative shrink-0">
          <Image src={p.imagen} alt={`Retrato ilustrado de ${p.nombre}`} width={96} height={96} sizes="96px" className="size-20 rounded-xl sm:size-24" />
          <span className="absolute -bottom-1.5 -right-1.5 grid size-7 place-items-center rounded-full border-2 border-white bg-(--ma-verde) text-white" title="Identidad y matrícula verificadas">
            <Icon name="check" size={14} stroke={3} />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
            <h3 className={`${ancho} text-xl font-extrabold leading-tight text-(--ma-tinta)`}>{p.nombre}</h3>
            <span className={`inline-flex items-center gap-1.5 text-[0.8rem] font-bold ${hoy ? "text-(--ma-verde)" : "text-(--ma-gris)"}`}>
              <span className={`size-2 rounded-full ${hoy ? "bg-(--ma-verde) shadow-[0_0_0_3px_rgba(18,128,90,0.18)]" : "bg-(--ma-gris)/50"}`} />
              {dispTexto[p.disp]}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-(--ma-gris)">
            {o.persona} · {p.anios} años de oficio
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <Estrellas valor={p.rating} size={15} />
            <strong className="text-(--ma-tinta)">{p.rating.toFixed(1).replace(".", ",")}</strong>
            <span className="text-(--ma-gris)">({p.resenas} reseñas)</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <ChipOficio id={p.oficio} />
        <Verificado matricula={p.matricula} />
        {p.urgencias && (
          <span className="inline-flex items-center gap-1 rounded-md bg-(--ma-rojo)/8 px-2 py-1 text-[0.78rem] font-bold text-(--ma-rojo)">
            <Icon name="bolt" size={14} stroke={2.4} />
            Urgencias 24 h
          </span>
        )}
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-(--ma-fondo) p-3 text-center">
        <div>
          <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-(--ma-gris)">Responde</dt>
          <dd className={`${mono} mt-0.5 text-[0.95rem] font-semibold text-(--ma-azul)`}>~{p.respuestaMin} min</dd>
        </div>
        <div>
          <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-(--ma-gris)">Trabajos</dt>
          <dd className={`${mono} mt-0.5 text-[0.95rem] font-semibold text-(--ma-azul)`}>{p.trabajos}</dd>
        </div>
        <div>
          <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-(--ma-gris)">Visita</dt>
          <dd className={`${mono} mt-0.5 text-[0.95rem] font-semibold text-(--ma-azul)`}>{p.visita ? pesos(p.visita) : "Sin cargo"}</dd>
        </div>
      </dl>

      <p className="mt-3 flex items-start gap-1.5 text-[0.82rem] text-(--ma-gris)">
        <Icon name="pin" size={15} className="mt-0.5 shrink-0" />
        {p.barrios.join(" · ")}
      </p>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setPerfil(p.id)}
          className={`flex-1 rounded-lg border-2 border-(--ma-azul) px-3 py-2.5 text-sm font-bold text-(--ma-azul) transition hover:bg-(--ma-azul) hover:text-white ${foco}`}
          aria-label={`Ver perfil de ${p.nombre}`}
        >
          Ver perfil
        </button>
        <button
          type="button"
          onClick={() => pedir(p.id)}
          className={`flex-[1.3] rounded-lg bg-(--ma-amarillo) px-3 py-2.5 text-sm font-extrabold text-(--ma-azul) shadow-[0_3px_0_#C99400] transition hover:bg-(--ma-amarillo2) active:translate-y-px active:shadow-[0_2px_0_#C99400] ${foco}`}
          aria-label={`Pedir presupuesto a ${p.nombre}`}
        >
          Pedir presupuesto
        </button>
      </div>
    </article>
  );
}

export function Resultados() {
  const { filtros, setFiltro, limpiar, resultados, problema, setProblema } = useOficios();
  const [panelMovil, setPanelMovil] = useState(false);
  const idBase = useId();
  const idSheet = useId();
  const activos = [
    filtros.oficio && { k: "oficio" as const, t: oficioPorId[filtros.oficio].nombre },
    filtros.barrio && { k: "barrio" as const, t: filtros.barrio },
    filtros.disp !== "cualquiera" && { k: "disp" as const, t: filtros.disp === "hoy" ? "Disponible hoy" : "Esta semana" },
    filtros.urgencias && { k: "urgencias" as const, t: "Urgencias 24 h" },
    filtros.ratingMin > 0 && { k: "ratingMin" as const, t: `${String(filtros.ratingMin).replace(".", ",")}+ estrellas` },
  ].filter(Boolean) as { k: keyof Filtros; t: string }[];

  const previsualizacion = resultados.length;

  return (
    <section id="profesionales" aria-labelledby="res-titulo" className="scroll-mt-16 bg-(--ma-fondo)">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={`${mono} text-sm font-medium text-(--ma-azul3)`}>Córdoba Capital · {resultados.length} disponibles</p>
            <h2 id="res-titulo" className={`${ancho} mt-1 text-3xl font-extrabold tracking-[-0.02em] text-(--ma-azul) sm:text-[2.6rem]`}>
              {filtros.oficio ? `${oficioPorId[filtros.oficio].nombre}: profesionales cerca tuyo` : "Profesionales cerca tuyo"}
            </h2>
          </div>
        </div>

        {problema && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border-2 border-dashed border-(--ma-azul3)/35 bg-white px-4 py-3 text-sm">
            <Icon name="wrench" size={18} className="shrink-0 text-(--ma-azul3)" />
            <p className="min-w-0 flex-1">
              Tu problema: <strong>“{problema}”</strong>. Lo vamos a incluir en el pedido de presupuesto.
            </p>
            <button type="button" onClick={() => setProblema("")} className={`shrink-0 rounded-md p-1 text-(--ma-gris) hover:bg-(--ma-fondo) ${foco}`} aria-label="Borrar problema">
              <Icon name="close" size={16} />
            </button>
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[17rem_1fr]">
          <aside className="hidden lg:block" aria-label="Filtros">
            <div className="sticky top-24 rounded-2xl border-2 border-(--ma-linea) bg-white/60 p-5">
              <div className="mb-5 flex items-center justify-between">
                <p className={`${ancho} text-lg font-extrabold text-(--ma-azul)`}>Filtros</p>
                {activos.length > 0 && (
                  <button type="button" onClick={limpiar} className={`rounded text-sm font-semibold text-(--ma-azul3) underline underline-offset-2 ${foco}`}>
                    Limpiar
                  </button>
                )}
              </div>
              <PanelFiltros idBase={`${idBase}-d`} />
            </div>
          </aside>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setPanelMovil(true)}
                className={`inline-flex items-center gap-2 rounded-lg border-2 border-(--ma-azul) bg-white px-3.5 py-2 text-sm font-bold text-(--ma-azul) lg:hidden ${foco}`}
              >
                <Icon name="filter" size={17} stroke={2.4} />
                Filtros
                {activos.length > 0 && <span className="grid size-5 place-items-center rounded-full bg-(--ma-amarillo) text-xs">{activos.length}</span>}
              </button>
              <div className="relative ml-auto">
                <label htmlFor={`${idBase}-orden`} className="sr-only">
                  Ordenar resultados
                </label>
                <select
                  id={`${idBase}-orden`}
                  value={filtros.orden}
                  onChange={(e) => setFiltro("orden", e.target.value as Filtros["orden"])}
                  className={`appearance-none rounded-lg border-2 border-(--ma-linea) bg-white py-2 pl-3 pr-9 text-sm font-bold text-(--ma-tinta) ${foco}`}
                >
                  {ordenes.map(([v, t]) => (
                    <option key={v} value={v}>
                      {t}
                    </option>
                  ))}
                </select>
                <Icon name="chevronDown" size={16} stroke={2.4} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--ma-gris)" />
              </div>
            </div>

            {activos.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Filtros activos">
                {activos.map((a) => (
                  <li key={a.k}>
                    <button
                      type="button"
                      onClick={() => setFiltro(a.k, filtrosIniciales[a.k])}
                      className={`inline-flex items-center gap-1.5 rounded-full bg-(--ma-azul) py-1 pl-3 pr-2 text-sm font-semibold text-white ${foco}`}
                      aria-label={`Quitar filtro ${a.t}`}
                    >
                      {a.t}
                      <Icon name="close" size={14} stroke={2.6} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-4 text-sm text-(--ma-gris)" aria-live="polite">
              {resultados.length === 0
                ? "No hay profesionales con esos filtros."
                : `${resultados.length} ${resultados.length === 1 ? "profesional" : "profesionales"}`}
            </p>

            {resultados.length === 0 ? (
              <div className="mt-4 rounded-2xl border-2 border-dashed border-(--ma-linea) bg-white px-6 py-14 text-center">
                <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-(--ma-fondo) text-(--ma-azul3)">
                  <Icon name="search" size={30} stroke={2} />
                </span>
                <p className={`${ancho} mt-4 text-xl font-extrabold text-(--ma-azul)`}>Nadie cumple todo eso a la vez</p>
                <p className="mx-auto mt-2 max-w-sm text-(--ma-gris)">Probá con otro barrio o sacá algún filtro. Siempre hay alguien disponible esta semana.</p>
                <button type="button" onClick={limpiar} className={`mt-5 rounded-lg bg-(--ma-azul) px-5 py-2.5 text-sm font-bold text-white ${foco}`}>
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <ul className="mt-3 grid gap-4 xl:grid-cols-2">
                {resultados.map((p) => (
                  <li key={p.id}>
                    <Tarjeta p={p} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={panelMovil}
        onClose={() => setPanelMovil(false)}
        labelledBy={idSheet}
        variant="sheet"
        panelClassName="rounded-t-2xl sm:rounded-2xl bg-(--ma-fondo) text-(--ma-tinta) [font-family:var(--font-ma-sans)] overflow-hidden"
        overlayClassName="bg-(--ma-azul)/60"
      >
        <div className="flex items-center justify-between border-b border-(--ma-linea) bg-white px-5 py-4">
          <h2 id={idSheet} className={`${ancho} text-xl font-extrabold text-(--ma-azul)`}>
            Filtros
          </h2>
          <button type="button" onClick={() => setPanelMovil(false)} className={`grid size-10 place-items-center rounded-lg border-2 border-(--ma-linea) ${foco}`} aria-label="Cerrar filtros">
            <Icon name="close" size={18} stroke={2.2} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <PanelFiltros idBase={`${idBase}-m`} />
        </div>
        <div className="flex gap-3 border-t border-(--ma-linea) bg-white px-5 py-4">
          <button type="button" onClick={limpiar} className={`rounded-lg border-2 border-(--ma-linea) px-4 py-3 text-sm font-bold ${foco}`}>
            Limpiar
          </button>
          <button type="button" onClick={() => setPanelMovil(false)} className={`flex-1 rounded-lg bg-(--ma-azul) px-4 py-3 text-sm font-bold text-white ${foco}`}>
            Ver {previsualizacion} {previsualizacion === 1 ? "profesional" : "profesionales"}
          </button>
        </div>
      </Dialog>
    </section>
  );
}
