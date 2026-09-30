"use client";

import Image from "next/image";
import { useState } from "react";
import { Aviso } from "../shared/Aviso";
import { CarritoDrawer } from "../shared/CarritoDrawer";
import { Checkout } from "../shared/Checkout";
import { Dialogo } from "../shared/Dialogo";
import { pesos } from "../shared/formato";
import { Estrellas, IconoCerrar, IconoCheck } from "../shared/Iconos";
import { config, ingredientePorId, porId, productos, rutinas, type IngredienteId, type Resena } from "./datos";
import { Detalle } from "./Detalle";
import { Ilustracion } from "./Ilustracion";
import { Quiz } from "./Quiz";
import { agregarRutina, ficha, serif, tema, tienda } from "./tienda";

const foco = "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4A5634]";

export function Capas() {
  return (
    <>
      <Detalle />
      <Quiz />
      <Ficha />
      <CarritoDrawer tienda={tienda} productos={porId} tema={{ ...tema, panel: `${tema.panel} sm:rounded-l-[2rem]` }} config={config} trazo={1.5} />
      <Checkout tienda={tienda} productos={porId} tema={{ ...tema, panel: `${tema.panel} md:rounded-[2rem]` }} config={config} trazo={1.5} />
      <Aviso
        tienda={tienda}
        className="rounded-2xl bg-[#2D3524] px-4 py-3 text-[#F6F5EF] shadow-[0_18px_40px_-12px_rgba(45,53,36,0.55)]"
        botonClassName="shrink-0 rounded-full bg-[#F6F5EF] px-3 py-1.5 text-xs font-semibold text-[#2D3524]"
      />
    </>
  );
}

function Ficha() {
  const id = ficha.use();
  const ing = id ? ingredientePorId[id] : null;
  const en = ing ? productos.filter((p) => p.ingredientes.includes(ing.id)) : [];
  return (
    <Dialogo abierto={Boolean(ing)} onCerrar={() => ficha.set(null)} titulo="hb-ficha-titulo" className="rounded-t-[2rem] bg-[#F6F5EF] text-[#2D3524] sm:max-w-xl sm:rounded-[2rem]" overlayClassName="bg-[#2D3524]/40 backdrop-blur-sm">
      {ing ? (
        <div className="p-5 pb-8 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="grid size-24 place-items-center rounded-full bg-[#ECEEE3]">
              <Ilustracion id={ing.id} className="size-20" />
            </div>
            <button type="button" onClick={() => ficha.set(null)} className={`grid size-10 place-items-center rounded-full hover:bg-[#2D3524]/8 ${foco}`} aria-label="Cerrar ficha">
              <IconoCerrar />
            </button>
          </div>
          <p className="mt-5 text-sm text-[#2D3524]/72 italic">{ing.cientifico}</p>
          <h2 id="hb-ficha-titulo" className={`${serif} mt-1 text-4xl`}>
            {ing.nombre}
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-[#2D3524]/85">{ing.resumen}</p>
          <dl className="mt-6 grid gap-4 rounded-3xl bg-white p-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[#2D3524]/72">Origen</dt>
              <dd className="mt-0.5 font-medium">{ing.origen}</dd>
            </div>
            <div>
              <dt className="text-[#2D3524]/72">Ideal para</dt>
              <dd className="mt-0.5 font-medium">{ing.apto}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[#2D3524]/72">Qué hace</dt>
              <dd className="mt-2">
                <ul className="grid gap-1.5">
                  {ing.beneficios.map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <IconoCheck className="size-4 text-[#6F7A4E]" trazo={2.2} /> {b}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
          <h3 className="mt-6 font-semibold">Lo encontrás en</h3>
          <ul className="mt-3 grid gap-2">
            {en.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => {
                    ficha.set(null);
                    tienda.verDetalle(p.id);
                  }}
                  className={`flex w-full items-center gap-3 rounded-2xl bg-white p-2 pr-4 text-left transition-colors hover:bg-[#ECEEE3] ${foco}`}
                >
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[#E3E6D8]">
                    <Image src={p.imagen} alt="" fill sizes="56px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1 font-medium">{p.nombre}</span>
                  <span className="text-sm tabular-nums">{pesos(p.precio)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Dialogo>
  );
}

/** Botones chicos para islas dentro de secciones server. */
export function BotonProducto({ id, className, children }: { id: string; className?: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={() => tienda.verDetalle(id)} className={className}>
      {children}
    </button>
  );
}

export function BotonFicha({ id, className, children }: { id: IngredienteId; className?: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={() => ficha.set(id)} className={className}>
      {children}
    </button>
  );
}

export function BotonRutina({ id }: { id: string }) {
  const [hecho, setHecho] = useState(false);
  const r = rutinas.find((x) => x.id === id);
  if (!r) return null;
  return (
    <button
      type="button"
      onClick={() => {
        agregarRutina(r);
        setHecho(true);
        window.setTimeout(() => setHecho(false), 2000);
      }}
      className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-6 font-semibold transition-all active:scale-[0.98] ${foco} ${hecho ? "bg-[#B8C4A6] text-[#2D3524]" : "bg-[#4A5634] text-[#F6F5EF] hover:bg-[#3A452A]"}`}
    >
      {hecho ? (
        <>
          <IconoCheck className="size-5" trazo={2.2} /> Rutina agregada
        </>
      ) : (
        `Agregar rutina (${r.pasos.length} productos)`
      )}
    </button>
  );
}

export function Resenas({ lista }: { lista: Resena[] }) {
  const [filtro, setFiltro] = useState<0 | 5 | 4>(0);
  const vis = filtro ? lista.filter((r) => r.estrellas === filtro) : lista;
  return (
    <div>
      <div role="group" aria-label="Filtrar reseñas" className="flex flex-wrap gap-2">
        {(
          [
            [0, "Todas"],
            [5, "5 estrellas"],
            [4, "4 estrellas"],
          ] as const
        ).map(([v, t]) => (
          <button
            key={v}
            type="button"
            aria-pressed={filtro === v}
            onClick={() => setFiltro(v)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${foco} ${filtro === v ? "border-[#2D3524] bg-[#2D3524] text-[#F6F5EF]" : "border-[#2D3524]/15 bg-white/60 hover:bg-white"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {vis.length} reseñas
      </p>
      <ul className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {vis.map((r) => {
          const p = porId[r.producto];
          return (
            <li key={r.autor} className="mb-4 break-inside-avoid rounded-[1.75rem] bg-white p-6 shadow-[0_1px_0_rgba(45,53,36,0.06)]">
              <Estrellas valor={r.estrellas} colorLleno="#B8743F" colorVacio="#2D3524" />
              <p className={`${serif} mt-3 text-xl leading-snug`}>“{r.titulo}”</p>
              <p className="mt-2 leading-relaxed text-[#2D3524]/75">{r.texto}</p>
              <div className="mt-5 flex items-center gap-3 border-t border-[#2D3524]/8 pt-4">
                <span className="grid size-9 place-items-center rounded-full bg-[#E3B9AC] text-sm font-semibold text-[#5E2F26]" aria-hidden="true">
                  {r.autor[0]}
                </span>
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-medium">
                    {r.autor} <span className="font-normal text-[#2D3524]/72">· {r.ciudad}</span>
                  </p>
                  <p className="text-xs text-[#2D3524]/72">
                    Compra verificada · {r.hace}
                  </p>
                </div>
              </div>
              {p ? (
                <button type="button" onClick={() => tienda.verDetalle(p.id)} className={`mt-4 flex w-full items-center gap-3 rounded-2xl bg-[#F6F5EF] p-2 text-left text-sm transition-colors hover:bg-[#ECEEE3] ${foco}`}>
                  <span className="relative size-10 shrink-0 overflow-hidden rounded-xl bg-[#E3E6D8]">
                    <Image src={p.imagen} alt="" fill sizes="40px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{p.nombre}</span>
                  <span className="pr-2 text-[#2D3524]/72" aria-hidden="true">
                    →
                  </span>
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
