"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { Dialogo, IconoCerrar } from "../shared/Dialogo";
import { ars } from "../shared/formato";
import { AMBIENTES, MATERIALES, imagenProducto, type Producto } from "./datos";
import { Cantidad, IcCheck, IcRegla, Swatch } from "./ui";

const serif = "[font-family:var(--font-nido-serif)]";

/** Dibujo de medidas: frente con cotas de ancho y alto. */
function Cotas({ ancho, alto, prof }: { ancho: number; alto: number; prof: number }) {
  const W = 220;
  const H = 120;
  const k = Math.min((W - 60) / ancho, (H - 40) / Math.max(alto, 8));
  const w = Math.max(ancho * k, 30);
  const h = Math.max(alto * k, 6);
  const x = (W - w) / 2 + 8;
  const y = H - 22 - h;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full max-w-[260px] text-[#221C17]"
      role="img"
      aria-label={`Medidas: ${ancho} de ancho por ${prof} de profundidad por ${alto} centímetros de alto`}
    >
      <rect x={x} y={y} width={w} height={h} rx="2" fill="#E6DDCF" stroke="currentColor" strokeWidth="0.8" />
      <g stroke="currentColor" strokeWidth="0.7">
        <line x1={x} y1={H - 10} x2={x + w} y2={H - 10} />
        <line x1={x} y1={H - 14} x2={x} y2={H - 6} />
        <line x1={x + w} y1={H - 14} x2={x + w} y2={H - 6} />
        <line x1={x - 12} y1={y} x2={x - 12} y2={y + h} />
        <line x1={x - 16} y1={y} x2={x - 8} y2={y} />
        <line x1={x - 16} y1={y + h} x2={x - 8} y2={y + h} />
      </g>
      <text x={x + w / 2} y={H - 13} textAnchor="middle" fontSize="9" fill="currentColor" className="[font-family:var(--font-nido-sans)]">
        {ancho} cm
      </text>
      <text
        x={x - 16}
        y={y + h / 2}
        textAnchor="middle"
        fontSize="9"
        fill="currentColor"
        transform={`rotate(-90 ${x - 16} ${y + h / 2})`}
        dy="-2"
        className="[font-family:var(--font-nido-sans)]"
      >
        {alto} cm
      </text>
    </svg>
  );
}

export function Ficha({
  producto,
  varianteInicial,
  onCerrar,
  onAgregar,
  onVerLista,
}: {
  producto: Producto | null;
  varianteInicial: string;
  onCerrar: () => void;
  onAgregar: (p: Producto, variante: string, cantidad: number, nota: string) => void;
  onVerLista: () => void;
}) {
  const uid = useId();
  return (
    <Dialogo
      abierto={!!producto}
      onCerrar={onCerrar}
      labelledBy={`${uid}-t`}
      className="m-auto max-h-[calc(100dvh-16px)] w-[min(1100px,calc(100%-16px))] max-w-none overflow-y-auto overscroll-contain rounded-[20px] bg-[#F4EFE7] text-[#221C17] shadow-2xl backdrop:bg-[#221C17]/55 backdrop:backdrop-blur-[2px] sm:max-h-[calc(100dvh-48px)]"
    >
      {producto ? (
        <Contenido
          key={producto.id}
          p={producto}
          v0={varianteInicial}
          tituloId={`${uid}-t`}
          onCerrar={onCerrar}
          onAgregar={onAgregar}
          onVerLista={onVerLista}
        />
      ) : null}
    </Dialogo>
  );
}

function Contenido({
  p,
  v0,
  tituloId,
  onCerrar,
  onAgregar,
  onVerLista,
}: {
  p: Producto;
  v0: string;
  tituloId: string;
  onCerrar: () => void;
  onAgregar: (p: Producto, variante: string, cantidad: number, nota: string) => void;
  onVerLista: () => void;
}) {
  const [v, setV] = useState(p.variantes.some((x) => x.id === v0) ? v0 : p.variantes[0]!.id);
  const [cantidad, setCantidad] = useState(1);
  const [nota, setNota] = useState("");
  const [agregado, setAgregado] = useState(false);
  const variante = p.variantes.find((x) => x.id === v)!;
  const notaId = useId();

  return (
    <div className="grid md:grid-cols-[1.05fr_1fr]">
      <div className="relative bg-[#EEE6DA] md:sticky md:top-0 md:self-start">
        <div className="relative aspect-square">
          {p.variantes.map((x) => (
            <Image
              key={x.id}
              src={imagenProducto(p.id, x.id)}
              alt={x.id === v ? `${p.nombre} en terminación ${x.nombre}` : ""}
              aria-hidden={x.id !== v}
              fill
              sizes="(min-width: 768px) 560px, 100vw"
              className={`object-cover transition-opacity duration-500 motion-reduce:transition-none ${x.id === v ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          <p className="absolute bottom-4 left-4 rounded-full bg-[#FBF8F3]/90 px-3 py-1 text-[12px] text-[#4A4039] backdrop-blur">
            Terminación: {variante.nombre}
          </p>
        </div>
        {p.variantes.length > 1 ? (
          <div className="hidden gap-3 p-4 md:flex">
            {p.variantes.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setV(x.id)}
                aria-label={`Ver en ${x.nombre}`}
                aria-pressed={x.id === v}
                className={`relative aspect-square w-24 overflow-hidden rounded-lg bg-[#E6DDCF] ring-offset-2 ring-offset-[#EEE6DA] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4538] ${
                  x.id === v ? "ring-[1.5px] ring-[#221C17]" : "opacity-80 hover:opacity-100"
                }`}
              >
                <Image src={imagenProducto(p.id, x.id)} alt="" fill sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        ) : null}
        <p className="hidden px-4 pb-5 text-[12px] tracking-[0.04em] text-[#6E6258] md:block">
          Hecho a mano en Córdoba · Garantía de 5 años en estructura
        </p>
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar ficha"
          className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-[#FBF8F3]/90 text-[#221C17] backdrop-blur transition hover:bg-white focus-visible:outline-2 focus-visible:outline-[#2F4538] md:hidden"
        >
          <IconoCerrar />
        </button>
      </div>

      <div className="relative px-5 pt-6 pb-8 sm:px-10 sm:pt-10">
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar ficha"
          className="absolute top-5 right-5 hidden size-10 place-items-center rounded-full text-[#221C17] transition hover:bg-[#EDE6DA] focus-visible:outline-2 focus-visible:outline-[#2F4538] md:grid"
        >
          <IconoCerrar />
        </button>
        <p className="text-[11px] tracking-[0.18em] text-[#6E6258] uppercase">
          {p.tipo} · Colección {p.coleccion}
        </p>
        <h2 id={tituloId} className={`${serif} mt-2 text-[44px] leading-[1] sm:text-[56px]`}>
          {p.nombre}
        </h2>
        <p className="mt-3 text-[20px] tabular-nums">{p.precio ? ars(p.precio) : "Precio a consultar"}</p>
        <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-[#4A4039]">{p.descripcion}</p>

        <fieldset className="mt-7">
          <legend className="text-[12px] font-semibold tracking-[0.12em] uppercase">
            Terminación <span className="font-normal tracking-normal text-[#6E6258] normal-case">— {variante.nombre}</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-3">
            {p.variantes.map((x) => (
              <Swatch key={x.id} hex={x.hex} nombre={x.nombre} activo={x.id === v} onClick={() => setV(x.id)} />
            ))}
          </div>
        </fieldset>

        <div className="mt-7 grid gap-5 border-y border-[#DCD2C3] py-5 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.12em] uppercase">
              <IcRegla /> Medidas
            </p>
            <dl className="mt-3 grid grid-cols-3 gap-x-6 gap-y-3 text-[14px] sm:w-max">
              {(
                [
                  ["Ancho", p.medidas.ancho],
                  ["Prof.", p.medidas.prof],
                  ["Alto", p.medidas.alto],
                ] as const
              ).map(([k, n]) => (
                <div key={k}>
                  <dt className="text-[12px] text-[#6E6258]">{k}</dt>
                  <dd className="tabular-nums">{n} cm</dd>
                </div>
              ))}
            </dl>
            {p.medidas.nota ? <p className="mt-2 text-[13px] text-[#6E6258]">{p.medidas.nota}</p> : null}
          </div>
          <Cotas ancho={p.medidas.ancho} alto={p.medidas.alto} prof={p.medidas.prof} />
        </div>

        <ul className="mt-5 space-y-1.5 text-[14px] text-[#4A4039]">
          {p.detalles.map((d) => (
            <li key={d} className="flex gap-2">
              <IcCheck className="mt-0.5 size-4 shrink-0 text-[#2F4538]" />
              {d}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[13px] text-[#6E6258]">
          {p.plazo} · Ambientes: {p.ambientes.map((a) => AMBIENTES.find((x) => x.id === a)?.nombre).join(", ")} ·{" "}
          {p.materiales.map((m) => MATERIALES.find((x) => x.id === m)?.nombre).join(", ")}
        </p>

        <div className="mt-7 flex flex-col gap-2">
          <label htmlFor={notaId} className="text-[12px] font-semibold tracking-[0.12em] uppercase">
            Nota para el taller <span className="font-normal tracking-normal text-[#6E6258] normal-case">(opcional)</span>
          </label>
          <textarea
            id={notaId}
            rows={2}
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Ej.: ¿se puede hacer de 200 cm de ancho?"
            className="resize-none rounded-xl border border-[#CFC4B3] bg-[#FBF8F3] px-4 py-3 text-[14px] placeholder:text-[#9A8E82] focus:border-[#2F4538] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4538]/25"
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Cantidad valor={cantidad} onChange={setCantidad} etiqueta="Cantidad" />
          <button
            type="button"
            onClick={() => {
              onAgregar(p, v, cantidad, nota);
              setAgregado(true);
            }}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#2F4538] px-6 text-[15px] font-semibold text-[#F4EFE7] transition hover:bg-[#243629] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4538] sm:flex-none"
          >
            {agregado ? <IcCheck /> : null}
            {agregado ? "Agregado a tu lista" : "Agregar a mi lista"}
          </button>
        </div>
        {agregado ? (
          <p className="mt-3 text-[14px] text-[#4A4039]">
            Listo. Podés seguir sumando piezas o{" "}
            <button type="button" onClick={onVerLista} className="font-semibold text-[#2F4538] underline underline-offset-4">
              ver tu lista y consultar
            </button>
            .
          </p>
        ) : null}
      </div>
    </div>
  );
}
