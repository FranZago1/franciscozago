"use client";

import Image from "next/image";
import { useState, type KeyboardEvent } from "react";
import { Icon } from "../shared/Icon";
import { pesos } from "../shared/utils";
import { productores, zonaPorId, zonas, type ZonaId } from "./data";
import { useMercado } from "./store";
import { display, foco } from "./ui";

/** Mapa ilustrado de las zonas de Córdoba (esquemático, no a escala). */
export function MapaSvg({
  seleccionada,
  resaltadas,
  onSelect,
  pins = true,
  titulo,
}: {
  seleccionada?: ZonaId;
  resaltadas?: ZonaId[];
  onSelect?: (z: ZonaId) => void;
  pins?: boolean;
  titulo: string;
}) {
  const interactivo = !!onSelect;
  function onKey(e: KeyboardEvent, id: ZonaId) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect?.(id);
    }
  }
  return (
    <svg viewBox="0 0 600 560" className="h-auto w-full" role={interactivo ? "group" : "img"} aria-label={titulo}>
      <defs>
        <pattern id="dv-rayado" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="10" height="10" fill="#E7DEC8" />
          <rect width="4" height="10" fill="#D6CBB0" />
        </pattern>
      </defs>
      {/* Sombra dura del recorte de papel */}
      <g transform="translate(5 7)" opacity="0.9">
        {zonas.map((z) => (
          <polygon key={z.id} points={z.puntos} fill="#1F4D2B" stroke="#1F4D2B" strokeWidth="8" strokeLinejoin="round" />
        ))}
      </g>
      {[...zonas.filter((z) => z.id !== seleccionada), ...zonas.filter((z) => z.id === seleccionada)].map((z) => {
        const sel = seleccionada === z.id;
        const res = resaltadas ? resaltadas.includes(z.id) : true;
        const fill = z.proximamente ? "url(#dv-rayado)" : res ? z.color : "#E9E1CD";
        return (
          <g
            key={z.id}
            role={interactivo ? "button" : undefined}
            tabIndex={interactivo ? 0 : undefined}
            aria-pressed={interactivo ? sel : undefined}
            aria-label={interactivo ? `${z.nombre}${z.proximamente ? ", próximamente" : ""}` : undefined}
            onClick={interactivo ? () => onSelect?.(z.id) : undefined}
            onKeyDown={interactivo ? (e) => onKey(e, z.id) : undefined}
            className={interactivo ? "group cursor-pointer outline-none" : undefined}
          >
            <polygon
              points={z.puntos}
              fill={fill}
              stroke={sel ? "#1F4D2B" : "#F6EFDF"}
              strokeWidth={sel ? 6 : 7}
              strokeLinejoin="round"
              className={interactivo ? "transition-[filter] duration-200 group-hover:brightness-95 group-focus-visible:brightness-90" : undefined}
            />
            {interactivo && (
              <polygon
                points={z.puntos}
                fill="none"
                stroke="#C4452A"
                strokeWidth="4"
                strokeDasharray="8 6"
                strokeLinejoin="round"
                className="opacity-0 transition-opacity group-focus-visible:opacity-100"
              />
            )}
          </g>
        );
      })}
      {/* Sierras, lagos y ríos decorativos */}
      <g fill="none" stroke="#1F4D2B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" pointerEvents="none">
        <path d="M188 128l10-14 10 14M214 140l10-14 10 14M250 118l9-12 9 12" />
        <path d="M296 176l9-12 9 12M318 280l9-12 9 12M296 300l8-11 8 11" />
        <path d="M110 200l10-14 10 14M86 360l10-14 10 14M130 400l9-12 9 12" />
        <path d="M212 380l9-12 9 12M240 492l9-12 9 12" />
      </g>
      <g pointerEvents="none">
        <ellipse cx="248" cy="262" rx="20" ry="12" fill="#7FB6D6" stroke="#1F4D2B" strokeWidth="2" />
        <path d="M352 404c10-6 22-6 30 2-6 10-22 10-30-2z" fill="#7FB6D6" stroke="#1F4D2B" strokeWidth="2" />
        <path d="M268 262c40 8 60 0 100 6s90-8 140 4" fill="none" stroke="#7FB6D6" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g pointerEvents="none" className="[font-family:var(--font-dv-display)]">
        {zonas.map((z) => (
          <text
            key={z.id}
            x={z.etiqueta[0]}
            y={z.etiqueta[1]}
            textAnchor="middle"
            fontSize={z.id === "capital" ? 17 : 16}
            fontStyle="italic"
            fontWeight={seleccionada === z.id ? 700 : 500}
            fill="#1D2A1F"
          >
            {z.id === "capital" ? "Capital" : z.nombre}
          </text>
        ))}
        <text x="104" y="320" textAnchor="middle" fontSize="11" fill="#566150" fontFamily="system-ui, sans-serif" letterSpacing="1.5">
          PRÓXIMAMENTE
        </text>
      </g>
      {pins &&
        productores.map((p) => (
          <g key={p.id} transform={`translate(${p.pin[0]} ${p.pin[1]})`} pointerEvents="none">
            <path d="M0 0c-7-9-11-14-11-19a11 11 0 0 1 22 0c0 5-4 10-11 19z" fill="#C4452A" stroke="#1F4D2B" strokeWidth="2" />
            <circle cx="0" cy="-19" r="4" fill="#FFFBF2" />
          </g>
        ))}
      {/* Rosa de los vientos */}
      <g transform="translate(548 486)" pointerEvents="none">
        <circle r="26" fill="#FFFBF2" stroke="#1F4D2B" strokeWidth="2" />
        <path d="M0-20 5 0 0 20-5 0z" fill="#1F4D2B" />
        <path d="M0-20 5 0H-5z" fill="#C4452A" />
        <text y="-30" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1F4D2B" fontFamily="system-ui, sans-serif">
          N
        </text>
      </g>
    </svg>
  );
}

export function MapaZonas() {
  const { zona, setZona, setTiendita } = useMercado();
  const [avisado, setAvisado] = useState(false);
  const z = zonaPorId[zona];
  const locales = productores.filter((p) => p.zona === zona);
  const entregan = productores.filter((p) => p.entregaEn.includes(zona));

  return (
    <section id="zonas" aria-labelledby="zonas-titulo" className="scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-(--dv-tomate)">Zonas de entrega</p>
          <h2 id="zonas-titulo" className={`${display} mt-2 text-4xl font-medium text-(--dv-verde) sm:text-5xl`}>
            ¿Hasta dónde llega cada uno?
          </h2>
          <p className="mt-4 text-(--dv-gris)">
            Tocá una zona del mapa para ver quién produce ahí y quién te entrega. Cada productor tiene su propio recorrido
            y su costo de envío.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <div className="min-w-0 rounded-[2rem] border-2 border-(--dv-verde) bg-(--dv-crema) p-4 shadow-[6px_6px_0_#1F4D2B] sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-dashed border-(--dv-linea) pb-3">
              <p className={`${display} text-lg italic text-(--dv-verde)`}>Provincia de Córdoba · zonas del mercado</p>
              <span className="hidden items-center gap-1.5 text-xs text-(--dv-gris) sm:flex">
                <svg width="12" height="16" viewBox="-11 -30 22 30" aria-hidden="true">
                  <path d="M0 0c-7-9-11-14-11-19a11 11 0 0 1 22 0c0 5-4 10-11 19z" fill="#C4452A" />
                </svg>
                Productor
              </span>
            </div>
            <div className="mt-2">
              <MapaSvg seleccionada={zona} onSelect={setZona} titulo="Mapa ilustrado de las zonas de entrega. Elegí una zona." />
            </div>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1 lg:hidden" role="group" aria-label="Elegir zona">
              {zonas.map((zz) => (
                <button
                  key={zz.id}
                  type="button"
                  aria-pressed={zona === zz.id}
                  onClick={() => setZona(zz.id)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-sm ${foco} ${
                    zona === zz.id ? "border-(--dv-verde) bg-(--dv-verde) text-(--dv-papel)" : "border-(--dv-linea) bg-(--dv-papel)"
                  }`}
                >
                  {zz.id === "capital" ? "Capital" : zz.nombre}
                </button>
              ))}
            </div>
          </div>

          <div aria-live="polite" className="flex min-w-0 flex-col">
            <div className="flex items-center gap-3">
              <span className="size-5 rounded-md border-2 border-(--dv-verde)" style={{ background: z.proximamente ? "#E7DEC8" : z.color }} />
              <h3 className={`${display} text-3xl font-medium text-(--dv-verde)`}>{z.nombre}</h3>
            </div>
            <p className="mt-1 text-(--dv-gris)">{z.localidades}</p>

            {z.proximamente ? (
              <div className="mt-6 rounded-2xl border-2 border-dashed border-(--dv-linea) bg-(--dv-crema) p-6">
                <p className={`${display} text-xl text-(--dv-tinta)`}>Todavía no llegamos a Traslasierra.</p>
                <p className="mt-2 text-(--dv-gris)">
                  Estamos sumando productores del valle para armar un recorrido propio. Si querés, te avisamos cuando arranque.
                </p>
                <button
                  type="button"
                  onClick={() => setAvisado(true)}
                  disabled={avisado}
                  className={`mt-5 inline-flex items-center gap-2 rounded-xl bg-(--dv-verde) px-4 py-2.5 text-sm font-semibold text-(--dv-papel) disabled:bg-(--dv-verde2) ${foco}`}
                >
                  {avisado ? <Icon name="check" size={18} stroke={2.2} /> : <Icon name="sparkle" size={18} />}
                  {avisado ? "Listo, te avisamos (es una demo)" : "Avisame cuando lleguen"}
                </button>
              </div>
            ) : (
              <>
                <h4 className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-(--dv-gris)">Te entregan en esta zona</h4>
                <ul className="mt-3 divide-y divide-(--dv-linea) overflow-hidden rounded-2xl border border-(--dv-linea) bg-(--dv-crema)">
                  {entregan.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => setTiendita(p.id)}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-(--dv-papel) ${foco}`}
                      >
                        <span className="relative size-11 shrink-0 overflow-hidden rounded-full border border-(--dv-linea)">
                          <Image src={p.imagen} alt="" fill sizes="44px" className="object-cover object-[25%_60%]" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold text-(--dv-tinta)">{p.nombre}</span>
                          <span className="block text-[0.82rem] text-(--dv-gris)">
                            {p.dias} · envío {pesos(p.envio)}
                          </span>
                        </span>
                        {p.zona === zona && (
                          <span className="hidden rounded-full bg-(--dv-brote)/35 px-2 py-0.5 text-[0.7rem] font-semibold text-(--dv-verde) sm:inline">
                            De acá
                          </span>
                        )}
                        <Icon name="chevronRight" size={18} className="text-(--dv-gris)" />
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-(--dv-gris)">
                  {locales.length > 0
                    ? `${locales.length === 1 ? "Un productor tiene" : `${locales.length} productores tienen`} su chacra en ${z.nombre}.`
                    : "En esta zona no hay productores todavía, pero te llegan pedidos de los valles vecinos."}
                </p>
              </>
            )}
            <div className="mt-auto pt-6">
              <p className="flex items-start gap-2 rounded-xl bg-(--dv-papel2) p-3 text-sm text-(--dv-tinta)">
                <Icon name="pin" size={18} className="mt-0.5 shrink-0 text-(--dv-tomate)" />
                ¿No te llega a tu zona? Retirá sin costo en el Punto Del Valle, en barrio Güemes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
