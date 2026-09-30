"use client";

import Image from "next/image";
import { useState } from "react";
import { ars, copiarTexto, fechaHoy, numero } from "../shared/formato";
import type { ItemLista, Lista } from "../shared/useLista";
import { ARTICULO_POR_ID, EMPRESA, PEDIDO_MINIMO, codigo, imagen, precioBulto } from "./datos";
import { Bultos, IcChat, IcCopiar, IcDescargar, IcNota, IcX } from "./ui";

const mono = "font-[family-name:var(--font-r9-mono)]";

export function totales(items: ItemLista[]) {
  let total = 0;
  let bultos = 0;
  let unidades = 0;
  for (const it of items) {
    const a = ARTICULO_POR_ID.get(it.id);
    if (!a) continue;
    total += precioBulto(a) * it.cantidad;
    bultos += it.cantidad;
    unidades += a.bulto * it.cantidad;
  }
  return { total, bultos, unidades };
}

export function descripcion(it: ItemLista) {
  const a = ARTICULO_POR_ID.get(it.id);
  if (!a) return "";
  return `${a.nombre} ${a.marca} ${a.presentacion}${it.variante ? ` (${it.variante})` : ""}`;
}

/** Texto plano del pedido: se usa para el mensaje de WhatsApp y para "Copiar lista". */
export function textoPedido(items: ItemLista[], datos: Record<string, string> = {}, conEncabezado = true) {
  const { total, bultos, unidades } = totales(items);
  const renglones = items.flatMap((it) => {
    const a = ARTICULO_POR_ID.get(it.id);
    if (!a) return [];
    const r = [
      `• ${codigo(a.id)} · ${descripcion(it)}`,
      `   ${it.cantidad} ${it.cantidad === 1 ? "bulto" : "bultos"} × ${a.bulto} u. = ${numero(a.bulto * it.cantidad)} u. · ${ars(precioBulto(a) * it.cantidad)}`,
    ];
    if (it.nota?.trim()) r.push(`   Nota: ${it.nota.trim()}`);
    return r;
  });
  const cab = conEncabezado
    ? [
        `*PEDIDO MAYORISTA · ${EMPRESA.nombre.toUpperCase()}*`,
        `Fecha: ${fechaHoy()}`,
        `Comercio: ${datos.comercio?.trim() || "[nombre del comercio]"}`,
        `Contacto: ${datos.contacto?.trim() || "[tu nombre]"}`,
        `Localidad: ${datos.localidad?.trim() || "[localidad]"}`,
        "",
      ]
    : [];
  const pie = ["", `Total: ${numero(bultos)} bultos · ${numero(unidades)} unidades`, `*Total estimado: ${ars(total)}* (precios sin IVA)`];
  if (conEncabezado) {
    pie.push(`Entrega: ${datos.entrega?.trim() || "a coordinar"}`);
    if (datos.observaciones?.trim()) pie.push(`Observaciones: ${datos.observaciones.trim()}`);
    pie.push("", "Quedo atento a la confirmación de stock. ¡Gracias!");
  }
  return [...cab, ...renglones, ...pie].join("\n");
}

function descargarCsv(items: ItemLista[]) {
  const filas = [["codigo", "descripcion", "unidades_por_bulto", "bultos", "unidades", "precio_unitario", "subtotal", "nota"]];
  for (const it of items) {
    const a = ARTICULO_POR_ID.get(it.id);
    if (!a) continue;
    filas.push([
      codigo(a.id),
      descripcion(it),
      String(a.bulto),
      String(it.cantidad),
      String(a.bulto * it.cantidad),
      String(a.precio),
      String(precioBulto(a) * it.cantidad),
      it.nota ?? "",
    ]);
  }
  const csv = filas.map((f) => f.map((c) => `"${c.replace(/"/g, '""')}"`).join(";")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `pedido-ruta9-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function Pedido({ pedido, onEnviar, avisar }: { pedido: Lista; onEnviar: () => void; avisar: (m: string) => void }) {
  const [notas, setNotas] = useState<Record<string, boolean>>({});
  const { total, bultos, unidades } = totales(pedido.items);
  const falta = Math.max(0, PEDIDO_MINIMO - total);
  const pct = Math.min(100, (total / PEDIDO_MINIMO) * 100);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#D8DEE7] px-4 py-3">
        <div className="flex items-baseline justify-between">
          <p className="text-[12px] font-semibold tracking-[0.08em] text-[#5B6778] uppercase">
            {pedido.items.length} {pedido.items.length === 1 ? "artículo" : "artículos"} · {numero(bultos)} bultos
          </p>
          {pedido.items.length ? (
            <button
              type="button"
              onClick={pedido.vaciar}
              className="text-[12px] text-[#5B6778] underline underline-offset-2 hover:text-[#D62B2B] focus-visible:outline-2 focus-visible:outline-[#1747A6]"
            >
              Vaciar
            </button>
          ) : null}
        </div>
        <div className="mt-2.5">
          <div
            className="h-2 overflow-hidden rounded-full bg-[#E3E8EF]"
            role="progressbar"
            aria-label="Avance hacia el pedido mínimo"
            aria-valuemin={0}
            aria-valuemax={PEDIDO_MINIMO}
            aria-valuenow={Math.min(total, PEDIDO_MINIMO)}
          >
            <div
              className={`h-full rounded-full transition-[width] duration-300 ${falta ? "bg-[#1747A6]" : "bg-[#1E8E4F]"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1.5 text-[12.5px] text-[#5B6778]">
            {falta ? (
              <>
                Te faltan <strong className="text-[#0F1B2D]">{ars(falta)}</strong> para el mínimo de {ars(PEDIDO_MINIMO)}
              </>
            ) : (
              <span className="font-semibold text-[#1E8E4F]">Superaste el pedido mínimo</span>
            )}
          </p>
        </div>
      </div>

      {pedido.items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
          <svg viewBox="0 0 80 64" className="w-24 text-[#B9C2CF]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M8 22h64v34H8zM8 22l8-12h48l8 12M30 34h20" />
          </svg>
          <p className="mt-4 text-[15px] font-semibold text-[#0F1B2D]">Tu pedido está vacío</p>
          <p className="mt-1 text-[13px] text-[#5B6778]">Sumá bultos con el botón Agregar de cada artículo.</p>
        </div>
      ) : (
        <ul className="flex-1 divide-y divide-[#E3E8EF] overflow-y-auto">
          {pedido.items.map((it) => {
            const a = ARTICULO_POR_ID.get(it.id);
            if (!a) return null;
            const abierta = notas[it.key] || !!it.nota;
            return (
              <li key={it.key} className="px-4 py-3">
                <div className="flex gap-3">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-md bg-[#F3F5F8]">
                    <Image src={imagen(a.id)} alt="" fill sizes="44px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] leading-tight font-semibold text-[#0F1B2D]">
                      {a.nombre} {a.marca}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#5B6778]">
                      <span className={mono}>{codigo(a.id)}</span> · {a.presentacion}
                      {it.variante ? ` · ${it.variante}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => pedido.quitar(it.key)}
                    aria-label={`Quitar ${a.nombre} del pedido`}
                    className="grid size-7 shrink-0 place-items-center rounded text-[#8A94A3] hover:bg-[#FDECEC] hover:text-[#D62B2B] focus-visible:outline-2 focus-visible:outline-[#1747A6]"
                  >
                    <IcX className="size-3.5" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 pl-14">
                  <Bultos valor={it.cantidad} onChange={(n) => pedido.fijarCantidad(it.key, n)} nombre={a.nombre} tam="sm" />
                  <button
                    type="button"
                    onClick={() => setNotas((n) => ({ ...n, [it.key]: !abierta }))}
                    aria-expanded={abierta}
                    className={`inline-flex h-8 items-center gap-1 rounded px-2 text-[12px] ${abierta ? "text-[#1747A6]" : "text-[#5B6778]"} hover:bg-[#EEF1F5] focus-visible:outline-2 focus-visible:outline-[#1747A6]`}
                  >
                    <IcNota className="size-3.5" /> Nota
                  </button>
                  <p className={`${mono} text-[13.5px] font-semibold text-[#0F1B2D] tabular-nums`}>{ars(precioBulto(a) * it.cantidad)}</p>
                </div>
                {abierta ? (
                  <label className="mt-2 block pl-14">
                    <span className="sr-only">Nota para {a.nombre}</span>
                    <input
                      type="text"
                      value={it.nota ?? ""}
                      onChange={(e) => pedido.fijarNota(it.key, e.target.value)}
                      placeholder="Ej.: si no hay, mandar el de 500 g"
                      className="h-8 w-full rounded border border-[#D8DEE7] bg-[#F8FAFC] px-2 text-[12.5px] focus:border-[#1747A6] focus:outline-none"
                    />
                  </label>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <div className="border-t border-[#D8DEE7] bg-[#F8FAFC] px-4 py-4">
        <dl className="space-y-1 text-[13px] text-[#5B6778]">
          <div className="flex justify-between">
            <dt>Unidades</dt>
            <dd className={`${mono} tabular-nums`}>{numero(unidades)}</dd>
          </div>
          <div className="flex items-baseline justify-between">
            <dt className="font-semibold text-[#0F1B2D]">Total estimado</dt>
            <dd className={`${mono} text-[22px] font-semibold text-[#0F1B2D] tabular-nums`}>{ars(total)}</dd>
          </div>
        </dl>
        <p className="text-[11.5px] text-[#626D7E]">Precios sin IVA. Sujeto a confirmación de stock.</p>
        <button
          type="button"
          onClick={onEnviar}
          disabled={!pedido.items.length || falta > 0}
          className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#1E8E4F] text-[15px] font-semibold text-white transition hover:bg-[#18743F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E8E4F] disabled:cursor-not-allowed disabled:bg-[#B9C2CF]"
        >
          <IcChat className="size-4.5" /> Enviar pedido por WhatsApp
        </button>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={!pedido.items.length}
            onClick={async () =>
              avisar((await copiarTexto(textoPedido(pedido.items, {}, false))) ? "Lista copiada al portapapeles" : "No se pudo copiar")
            }
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-[#C9D1DC] bg-white text-[13px] font-medium text-[#0F1B2D] hover:border-[#1747A6] focus-visible:outline-2 focus-visible:outline-[#1747A6] disabled:opacity-50"
          >
            <IcCopiar className="size-3.5" /> Copiar lista
          </button>
          <button
            type="button"
            disabled={!pedido.items.length}
            onClick={() => {
              descargarCsv(pedido.items);
              avisar("Pedido exportado en CSV");
            }}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-[#C9D1DC] bg-white text-[13px] font-medium text-[#0F1B2D] hover:border-[#1747A6] focus-visible:outline-2 focus-visible:outline-[#1747A6] disabled:opacity-50"
          >
            <IcDescargar className="size-3.5" /> Exportar CSV
          </button>
        </div>
      </div>
    </div>
  );
}
