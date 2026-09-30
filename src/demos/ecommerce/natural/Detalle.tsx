"use client";

import Image from "next/image";
import { useState } from "react";
import { Dialogo } from "../shared/Dialogo";
import { cuota, pesos } from "../shared/formato";
import { Estrellas, IconoCerrar, IconoCheck, IconoHoja, IconoMas, IconoMenos } from "../shared/Iconos";
import { config, ingredientePorId, porId, resenas, rutinas, type ProductoNatural } from "./datos";
import { Ilustracion } from "./Ilustracion";
import { agregarRutina, ficha, precioRutina, serif, tienda } from "./tienda";

const foco = "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4A5634]";

export function Detalle() {
  const id = tienda.useTienda((e) => e.detalle);
  const p = id ? porId[id] : undefined;
  return (
    <Dialogo
      abierto={Boolean(p)}
      onCerrar={() => tienda.verDetalle(null)}
      titulo="hb-detalle-titulo"
      className="rounded-t-[2rem] bg-[#F6F5EF] text-[#2D3524] sm:max-w-5xl sm:rounded-[2rem]"
      overlayClassName="bg-[#2D3524]/40 backdrop-blur-sm"
    >
      {p ? <Contenido key={p.id} p={p} /> : null}
    </Dialogo>
  );
}

function Contenido({ p }: { p: ProductoNatural }) {
  const [cantidad, setCantidad] = useState(1);
  const [hecho, setHecho] = useState(false);
  const propias = resenas.filter((r) => r.producto === p.id);
  const rutina = rutinas.find((r) => r.pasos.some((x) => x.id === p.id));

  return (
    <div className="grid gap-0 md:grid-cols-[1fr_1.1fr]">
      <div className="p-3 pb-0 sm:p-4 md:sticky md:top-0 md:self-start md:pb-4">
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[1.5rem] bg-[#E3E6D8]">
          <Image src={p.imagen} alt={p.alt} fill priority sizes="(min-width: 768px) 460px, 100vw" className="object-cover" />
        </div>
      </div>
      <div className="relative p-5 pb-8 sm:p-8 md:py-10 md:pr-10 md:pl-6">
        <button type="button" onClick={() => tienda.verDetalle(null)} className={`absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-[#F6F5EF] transition-colors hover:bg-[#2D3524]/8 ${foco}`} aria-label="Cerrar detalle">
          <IconoCerrar />
        </button>
        <p className="text-sm text-[#2D3524]/72">
          {p.categoria} · {p.tamano}
        </p>
        <h2 id="hb-detalle-titulo" className={`${serif} mt-2 pr-10 text-4xl leading-[1.05] sm:text-5xl`}>
          {p.nombre}
        </h2>
        <a href="#resenas" onClick={() => tienda.verDetalle(null)} className={`mt-3 inline-flex items-center gap-2 rounded-full text-sm ${foco}`}>
          <Estrellas valor={p.rating} colorLleno="#B8743F" colorVacio="#2D3524" />
          <span className="underline decoration-[#2D3524]/25 underline-offset-4">
            {String(p.rating).replace(".", ",")} · {p.resenas} reseñas
          </span>
        </a>
        <p className="mt-5 text-lg leading-relaxed text-[#2D3524]/85">{p.paraQue}</p>

        <div className="mt-6 flex items-baseline gap-3">
          <p className="text-2xl font-semibold tabular-nums">{pesos(p.precio)}</p>
          <p className="text-sm text-[#2D3524]/72">
            o {config.cuotasSinInteres} cuotas sin interés de {pesos(cuota(p.precio, config.cuotasSinInteres))}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <div className="inline-flex h-12 items-center rounded-full border border-[#2D3524]/20 bg-white" role="group" aria-label="Cantidad">
            <button type="button" className={`grid size-12 place-items-center rounded-full disabled:opacity-35 ${foco}`} onClick={() => setCantidad((c) => Math.max(1, c - 1))} disabled={cantidad <= 1} aria-label="Restar una unidad">
              <IconoMenos className="size-4" />
            </button>
            <span className="w-8 text-center tabular-nums" aria-live="polite" aria-label={`${cantidad} unidades`}>
              {cantidad}
            </span>
            <button type="button" className={`grid size-12 place-items-center rounded-full disabled:opacity-35 ${foco}`} onClick={() => setCantidad((c) => Math.min(10, c + 1))} disabled={cantidad >= 10} aria-label="Sumar una unidad">
              <IconoMas className="size-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              tienda.agregar(p.id, { cantidad, nombre: cantidad > 1 ? `${cantidad} × ${p.nombre}` : p.nombre });
              setHecho(true);
              window.setTimeout(() => setHecho(false), 1800);
            }}
            className={`inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-7 font-semibold transition-all active:scale-[0.98] ${foco} ${
              hecho ? "bg-[#B8C4A6] text-[#2D3524]" : "bg-[#4A5634] text-[#F6F5EF] hover:bg-[#3A452A]"
            }`}
          >
            {hecho ? (
              <>
                <IconoCheck className="size-5" trazo={2.2} /> Agregado
              </>
            ) : (
              `Agregar · ${pesos(p.precio * cantidad)}`
            )}
          </button>
        </div>
        <p className="mt-3 text-sm text-[#2D3524]/72">Envío gratis desde {pesos(config.envioGratisDesde)} · Caja compostable</p>

        <section aria-labelledby="hb-uso" className="mt-8 rounded-3xl bg-[#ECEEE3] p-5">
          <h3 id="hb-uso" className="flex items-center gap-2 font-semibold">
            <IconoHoja className="size-5 text-[#6F7A4E]" /> Cómo se usa
          </h3>
          <p className="mt-2 leading-relaxed text-[#2D3524]/80">{p.uso}</p>
        </section>

        <section aria-labelledby="hb-ing" className="mt-6">
          <h3 id="hb-ing" className="font-semibold">
            Ingredientes clave
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {p.ingredientes.map((i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => {
                    tienda.verDetalle(null);
                    ficha.set(i);
                  }}
                  className={`flex items-center gap-2 rounded-full border border-[#2D3524]/15 bg-white py-1 pr-4 pl-1 text-sm transition-colors hover:border-[#4A5634] ${foco}`}
                >
                  <span className="grid size-8 place-items-center rounded-full bg-[#ECEEE3]">
                    <Ilustracion id={i} className="size-7" />
                  </span>
                  {ingredientePorId[i].nombre}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {rutina ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-dashed border-[#2D3524]/25 p-4">
            <p className="text-sm">
              Es parte de la <strong>{rutina.nombre}</strong> ({rutina.pasos.length} pasos, {pesos(precioRutina(rutina))}).
            </p>
            <button type="button" onClick={() => agregarRutina(rutina)} className={`rounded-full bg-white px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#4A5634] hover:text-[#F6F5EF] ${foco}`}>
              Agregar rutina completa
            </button>
          </div>
        ) : null}

        {propias.length ? (
          <section aria-labelledby="hb-res" className="mt-8">
            <h3 id="hb-res" className="font-semibold">
              Lo que dicen
            </h3>
            <ul className="mt-3 space-y-3">
              {propias.map((r) => (
                <li key={r.autor} className="rounded-3xl bg-white p-4">
                  <Estrellas valor={r.estrellas} className="size-3.5" colorLleno="#B8743F" colorVacio="#2D3524" />
                  <p className={`${serif} mt-2 text-lg`}>{r.titulo}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#2D3524]/75">{r.texto}</p>
                  <p className="mt-2 text-xs text-[#2D3524]/72">
                    {r.autor}, {r.ciudad} · {r.hace}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  );
}
