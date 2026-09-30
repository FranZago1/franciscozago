"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { Dialogo } from "../shared/Dialogo";
import { FormEmail } from "../shared/FormEmail";
import { cuota, pesos } from "../shared/formato";
import { IconoCamion, IconoCerrar, IconoCheck, IconoDevolucion, IconoRegla } from "../shared/Iconos";
import { config, guias, porId, productos, type ProductoUrbano } from "./datos";
import { display, tienda } from "./tienda";

const foco = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B0B0B]";

export function Detalle() {
  const id = tienda.useTienda((e) => e.detalle);
  const p = id ? porId[id] : undefined;
  return (
    <Dialogo
      abierto={Boolean(p)}
      onCerrar={() => tienda.verDetalle(null)}
      titulo="detalle-titulo"
      variante="centro"
      className="bg-[#F3F2EE] text-[#0B0B0B] sm:max-w-5xl"
      overlayClassName="bg-[#0B0B0B]/70 backdrop-blur-[2px]"
    >
      {p ? <Contenido key={p.id} p={p} /> : null}
    </Dialogo>
  );
}

function Contenido({ p }: { p: ProductoUrbano }) {
  const unico = p.talles.length === 1;
  const [talle, setTalle] = useState<string | null>(unico ? (p.talles[0] ?? null) : null);
  const [error, setError] = useState(false);
  const [agregado, setAgregado] = useState(false);
  const [guia, setGuia] = useState(false);
  const grupo = useRef<HTMLFieldSetElement>(null);
  const uid = useId();

  useEffect(() => {
    if (!agregado) return;
    const t = window.setTimeout(() => setAgregado(false), 1800);
    return () => window.clearTimeout(t);
  }, [agregado]);

  function agregar() {
    if (!talle) {
      setError(true);
      grupo.current?.querySelector<HTMLInputElement>("input:not(:disabled)")?.focus();
      return;
    }
    tienda.agregar(p.id, { variante: talle, nombre: p.nombre });
    setAgregado(true);
  }

  const relacionados = productos.filter((x) => x.id !== p.id && !x.agotado && x.categoria !== p.categoria).slice(0, 3);
  const tabla = p.guia ? guias[p.guia] : null;

  return (
    <div className="grid md:grid-cols-2">
      <div className="md:sticky md:top-0 md:self-start">
      <div className="relative aspect-[4/5] bg-[#E4E2DC] md:aspect-auto md:h-[min(92dvh,780px)]">
        <Image src={p.imagen} alt={p.alt} fill sizes="(min-width: 768px) 512px, 100vw" className={`object-cover ${p.agotado ? "grayscale" : ""}`} priority />
        {p.agotado ? (
          <span className={`${display} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-6 bg-[#0B0B0B] px-6 py-2 text-4xl text-white uppercase`}>Agotado</span>
        ) : null}
      </div>
      </div>

      <div className="relative p-5 pb-8 sm:p-8 md:p-10">
        <button type="button" onClick={() => tienda.verDetalle(null)} className={`absolute top-3 right-3 grid size-10 place-items-center bg-[#F3F2EE] transition-colors hover:bg-[#0B0B0B] hover:text-[#D4FF2E] ${foco}`} aria-label="Cerrar detalle">
          <IconoCerrar trazo={2.25} />
        </button>
        <p className="text-[11px] font-bold tracking-[0.2em] text-[#0B0B0B]/55 uppercase">
          {p.categoria}
          {p.nuevo ? <span className="ml-2 bg-[#D4FF2E] px-1.5 py-0.5 text-[#0B0B0B]">Nuevo</span> : null}
        </p>
        <h2 id="detalle-titulo" className={`${display} mt-3 pr-10 text-5xl leading-[0.92] uppercase sm:text-6xl`}>
          {p.nombre}
        </h2>
        <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-2xl font-bold tabular-nums">{pesos(p.precio)}</p>
          <p className="text-sm text-[#0B0B0B]/60">
            {config.cuotasSinInteres} cuotas sin interés de {pesos(cuota(p.precio, config.cuotasSinInteres))}
          </p>
        </div>
        <p className="mt-2 text-sm">
          Color: <strong>{p.color}</strong>
        </p>

        {p.agotado ? (
          <div className="mt-8 border-2 border-[#0B0B0B] p-5">
            <p className="font-bold">Se agotó todo el stock.</p>
            <p className="mt-1 text-sm text-[#0B0B0B]/65">Dejanos tu email y te avisamos cuando vuelva a entrar.</p>
            <FormEmail
              etiqueta={`Email para el aviso de ${p.nombre}`}
              boton="Avisame"
              ok={(e) => `Listo, te avisamos a ${e}.`}
              clases={{
                form: "mt-4 grid gap-2",
                input: "min-h-12 border-2 border-[#0B0B0B]/20 bg-white px-3.5 outline-none focus:border-[#0B0B0B]",
                boton: `min-h-12 bg-[#0B0B0B] px-6 text-sm font-bold tracking-[0.12em] text-white uppercase hover:bg-[#D4FF2E] hover:text-[#0B0B0B] ${foco}`,
                mensaje: "text-[#0B0B0B]/70",
                error: "font-medium text-[#C21F16]",
              }}
            />
          </div>
        ) : (
          <>
            <fieldset ref={grupo} className="mt-8" aria-describedby={error ? `${uid}-error` : undefined}>
              <div className="flex items-center justify-between gap-4">
                <legend className="text-xs font-bold tracking-[0.16em] uppercase">
                  Talle{talle && !unico ? <span className="ml-2 font-normal tracking-normal normal-case text-[#0B0B0B]/60">Elegiste {talle}</span> : null}
                </legend>
                {tabla ? (
                  <button type="button" onClick={() => setGuia(true)} className={`inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.1em] uppercase underline decoration-2 underline-offset-4 hover:decoration-[#D4FF2E] ${foco}`}>
                    <IconoRegla className="size-4" trazo={2} /> Guía de talles
                  </button>
                ) : null}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.talles.map((t) => {
                  const sin = p.sinStock?.includes(t) ?? false;
                  return (
                    <label key={t} className="relative">
                      <input
                        type="radio"
                        name={`talle-${p.id}`}
                        value={t}
                        checked={talle === t}
                        disabled={sin}
                        onChange={() => {
                          setTalle(t);
                          setError(false);
                        }}
                        className="peer sr-only"
                        aria-label={sin ? `${t}, sin stock` : t}
                      />
                      <span
                        className={`grid h-12 min-w-12 cursor-pointer place-items-center border-2 px-3 text-sm font-bold transition-all peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#0B0B0B] peer-checked:border-[#0B0B0B] peer-checked:bg-[#0B0B0B] peer-checked:text-[#D4FF2E] peer-disabled:cursor-not-allowed peer-disabled:border-dashed peer-disabled:text-[#0B0B0B]/30 peer-disabled:line-through ${
                          error ? "border-[#C21F16] bg-[#C21F16]/5" : "border-[#0B0B0B]/20 bg-white hover:border-[#0B0B0B]"
                        }`}
                        aria-hidden="true"
                      >
                        {t}
                      </span>
                    </label>
                  );
                })}
              </div>
              <p id={`${uid}-error`} className="mt-2 min-h-5 text-sm font-semibold text-[#C21F16]" aria-live="assertive">
                {error ? "Elegí un talle para agregarlo al carrito." : ""}
              </p>
            </fieldset>

            <button
              type="button"
              onClick={agregar}
              className={`mt-3 flex min-h-14 w-full items-center justify-center gap-2 text-sm font-black tracking-[0.16em] uppercase transition-colors active:translate-y-px ${foco} ${
                agregado ? "bg-[#D4FF2E] text-[#0B0B0B]" : "bg-[#0B0B0B] text-[#F3F2EE] hover:bg-[#D4FF2E] hover:text-[#0B0B0B]"
              }`}
            >
              {agregado ? (
                <>
                  <IconoCheck className="size-5" trazo={2.5} /> Agregado al carrito
                </>
              ) : (
                <>Agregar al carrito · {pesos(p.precio)}</>
              )}
            </button>
            {agregado ? (
              <button type="button" onClick={() => tienda.abrir("carrito")} className={`mt-2 w-full py-2 text-xs font-bold tracking-[0.14em] uppercase underline underline-offset-4 ${foco}`}>
                Ver carrito y pagar
              </button>
            ) : null}
          </>
        )}

        <ul className="mt-6 grid gap-2 text-sm">
          <li className="flex items-center gap-2.5">
            <IconoCamion className="size-5 shrink-0" trazo={2} /> Envío gratis desde {pesos(config.envioGratisDesde)}. En Córdoba Capital, moto en el día.
          </li>
          <li className="flex items-center gap-2.5">
            <IconoDevolucion className="size-5 shrink-0" trazo={2} /> Primer cambio gratis dentro de los 30 días.
          </li>
        </ul>

        <div className="mt-8 divide-y-2 divide-[#0B0B0B]/10 border-y-2 border-[#0B0B0B]/10">
          {(
            [
              ["Descripción", p.descripcion],
              ["Materiales y cuidado", p.materiales],
              ["Envíos y cambios", "Despachamos en 24 h hábiles. Si no te queda, lo cambiás gratis una vez en el showroom o por correo dentro de los 30 días."],
            ] as const
          ).map(([t, texto], i) => (
            <details key={t} className="group" open={i === 0}>
              <summary className={`flex cursor-pointer list-none items-center justify-between py-4 text-xs font-bold tracking-[0.16em] uppercase [&::-webkit-details-marker]:hidden ${foco}`}>
                {t}
                <span className="text-lg leading-none transition-transform group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-[#0B0B0B]/75">{texto}</p>
            </details>
          ))}
        </div>

        {relacionados.length ? (
          <div className="mt-8">
            <p className="text-xs font-bold tracking-[0.16em] uppercase">Completá el look</p>
            <ul className="mt-3 grid grid-cols-3 gap-2">
              {relacionados.map((r) => (
                <li key={r.id}>
                  <button type="button" onClick={() => tienda.verDetalle(r.id)} className={`group block w-full text-left ${foco}`}>
                    <span className="relative block aspect-[4/5] overflow-hidden bg-[#E4E2DC]">
                      <Image src={r.imagen} alt={r.alt} fill sizes="120px" className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none" />
                    </span>
                    <span className="mt-1.5 block truncate text-xs font-bold uppercase">{r.nombre}</span>
                    <span className="block text-xs text-[#0B0B0B]/60 tabular-nums">{pesos(r.precio)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {tabla ? (
        <Dialogo abierto={guia} onCerrar={() => setGuia(false)} titulo="guia-titulo" variante="centro" className="bg-[#F3F2EE] text-[#0B0B0B] sm:max-w-xl" overlayClassName="bg-[#0B0B0B]/50">
          <div className="p-5 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] text-[#0B0B0B]/55 uppercase">Guía de talles</p>
                <h3 id="guia-titulo" className={`${display} mt-1 text-4xl uppercase`}>
                  {tabla.titulo}
                </h3>
              </div>
              <button type="button" onClick={() => setGuia(false)} className={`grid size-10 shrink-0 place-items-center hover:bg-[#0B0B0B] hover:text-[#D4FF2E] ${foco}`} aria-label="Cerrar guía de talles">
                <IconoCerrar trazo={2.25} />
              </button>
            </div>
            <div className="mt-6 grid items-center gap-6 sm:grid-cols-[1fr_140px]">
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">Medidas de {tabla.titulo.toLowerCase()} en centímetros</caption>
                <thead>
                  <tr className="bg-[#0B0B0B] text-left text-[11px] tracking-[0.1em] text-white uppercase">
                    {tabla.columnas.map((c) => (
                      <th key={c} scope="col" className="px-3 py-2.5 font-bold">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tabla.filas.map((f) => (
                    <tr key={f[0]} className={`border-b border-[#0B0B0B]/10 ${talle === f[0] ? "bg-[#D4FF2E]" : ""}`}>
                      {f.map((v, i) =>
                        i === 0 ? (
                          <th key={i} scope="row" className="px-3 py-2.5 text-left font-bold">
                            {v}
                          </th>
                        ) : (
                          <td key={i} className="px-3 py-2.5 tabular-nums">
                            {v}
                          </td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              <FiguraMedida tipo={p.guia ?? "superior"} />
            </div>
            <p className="mt-5 border-l-4 border-[#D4FF2E] bg-white p-3 text-sm">{tabla.consejo}</p>
          </div>
        </Dialogo>
      ) : null}
    </div>
  );
}

/** Esquema de cómo medir, en SVG propio. */
function FiguraMedida({ tipo }: { tipo: "superior" | "inferior" | "calzado" }) {
  const flecha = "stroke-[#0B0B0B] [stroke-width:2]";
  return (
    <svg viewBox="0 0 140 160" className="mx-auto hidden w-[140px] sm:block" role="img" aria-label="Esquema de cómo tomar las medidas">
      {tipo === "superior" ? (
        <>
          <path d="M48 22c6 8 38 8 44 0l20 4 22 32-16 10-10-10v80H32V58L22 68 6 58l22-32 20-4Z" fill="#E4E2DC" stroke="#0B0B0B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M34 72h72" className={flecha} markerEnd="url(#pc-f)" markerStart="url(#pc-f)" />
          <path d="M122 30v116" className={flecha} strokeDasharray="4 3" />
          <text x="70" y="66" textAnchor="middle" fontSize="9" fontWeight="700">PECHO</text>
        </>
      ) : tipo === "inferior" ? (
        <>
          <path d="M42 14h56l8 132H78L70 60l-8 86H34Z" fill="#E4E2DC" stroke="#0B0B0B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M44 24h52" className={flecha} markerEnd="url(#pc-f)" markerStart="url(#pc-f)" />
          <text x="70" y="38" textAnchor="middle" fontSize="9" fontWeight="700">CINTURA</text>
        </>
      ) : (
        <>
          <path d="M40 30c12-12 48-12 56 8 6 18 6 60 0 88-6 20-50 20-56 0-6-28-8-78 0-96Z" fill="#E4E2DC" stroke="#0B0B0B" strokeWidth="2" />
          <path d="M112 20v122" className={flecha} markerEnd="url(#pc-f)" markerStart="url(#pc-f)" />
          <text x="68" y="84" textAnchor="middle" fontSize="9" fontWeight="700">LARGO</text>
        </>
      )}
      <defs>
        <marker id="pc-f" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10Z" fill="#0B0B0B" />
        </marker>
      </defs>
    </svg>
  );
}
