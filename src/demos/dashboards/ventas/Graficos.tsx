"use client";

import { useState } from "react";
import { delta, deltaPp, numero, pesos, pesosCompacto, porcentaje } from "../shared/formato";
import { useAncho, useRecorrido } from "../shared/hooks";
import { TipFila, TipTitulo, Tooltip } from "../shared/Tooltip";
import type { EstadoPedido, Resumen } from "./datos";
import { PEDIDOS_RECIENTES } from "./datos";
import { IcoCamion, IcoCancelado, IcoCheck, IcoReloj } from "./Iconos";

const AZUL = "#2a78d6";
/** Paleta categórica validada (modo claro, superficie blanca). Se asigna en orden fijo por canal. */
export const COLORES_CANAL = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4"];
/** Rampa ordinal azul para el embudo (validada con --ordinal). */
const RAMPA_EMBUDO = ["#104281", "#1c5cab", "#2a78d6", "#5598e7", "#86b6ef"];

function Variacion({ v, pp = false }: { v: number; pp?: boolean }) {
  const sube = v >= 0;
  return (
    <span className={`text-[12px] font-semibold tabular-nums ${sube ? "text-[#067647]" : "text-[#b42318]"}`}>
      <span aria-hidden="true">{sube ? "▲" : "▼"}</span> {pp ? deltaPp(v) : delta(v)}
    </span>
  );
}

// ---------------------------------------------------------------- Categorías

export function Categorias({ datos }: { datos: Resumen["categorias"] }) {
  const { ref, ancho } = useAncho<HTMLDivElement>(520);
  const { activo, marcar, contenedor } = useRecorrido(datos.length);
  const max = Math.max(...datos.map((d) => d.valor));
  const total = datos.reduce((a, d) => a + d.valor, 0);
  const FILA = 46;
  const anchoBarra = Math.max(60, ancho - 88);

  return (
    <div ref={ref} className="relative">
      <div
        {...contenedor}
        role="group"
        aria-label="Ventas por categoría. Usá las flechas para recorrer las categorías."
        className="dv-chart"
      >
        <ul className="flex flex-col" onPointerLeave={() => marcar(null)}>
          {datos.map((d, i) => {
            const pct = d.valor / max;
            const on = activo === i;
            return (
              <li
                key={d.id}
                className="grid cursor-default grid-cols-[1fr_auto] items-center gap-x-3"
                style={{ height: FILA }}
                onPointerEnter={() => marcar(i)}
              >
                <div className="min-w-0">
                  <div className="mb-1.5 flex items-baseline justify-between gap-2 text-[13px]">
                    <span className={`truncate ${on ? "text-[#101828]" : "text-[#344054]"}`}>{d.nombre}</span>
                  </div>
                  <div className="relative h-2.5 rounded-full bg-[#f1f3f6]">
                    <div
                      className="dv-barra absolute inset-y-0 left-0 rounded-full"
                      style={{ width: `${Math.max(2, pct * 100)}%`, background: on || activo === null ? AZUL : "#9ec5f4" }}
                    />
                  </div>
                </div>
                <div className="w-[76px] text-right">
                  <div className="text-[13px] font-semibold text-[#101828] tabular-nums">{pesosCompacto(d.valor)}</div>
                  <div className="text-[11.5px] text-[#667085] tabular-nums">{porcentaje(d.valor / total, 0)}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      {activo !== null ? (
        <Tooltip
          x={Math.min(anchoBarra, (datos[activo]!.valor / max) * anchoBarra)}
          y={activo * FILA + 14}
          ancho={ancho}
          visible
        >
          <TipTitulo>{datos[activo]!.nombre}</TipTitulo>
          <TipFila color={AZUL} forma="cuadro" valor={pesos(datos[activo]!.valor)} nombre="en ventas" />
          <div className="mt-1 flex items-center gap-2 text-[12px] text-[#667085]">
            <Variacion v={datos[activo]!.var} /> vs. período anterior
          </div>
        </Tooltip>
      ) : null}
      <p className="sr-only" aria-live="polite">
        {activo !== null ? `${datos[activo]!.nombre}: ${pesos(datos[activo]!.valor)}, ${delta(datos[activo]!.var)}` : ""}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------- Embudo

export function Embudo({ datos }: { datos: Resumen["embudo"] }) {
  const { ref, ancho } = useAncho<HTMLDivElement>(520);
  const { activo, marcar, contenedor } = useRecorrido(datos.length);
  const max = datos[0]!.valor;
  const FILA = 58;

  return (
    <div ref={ref} className="relative">
      <div
        {...contenedor}
        role="group"
        aria-label="Embudo de conversión. Usá las flechas para recorrer las etapas."
        className="dv-chart"
      >
        <ol className="flex flex-col" onPointerLeave={() => marcar(null)}>
          {datos.map((d, i) => {
            const pct = d.valor / max;
            const previo = i > 0 ? d.valor / datos[i - 1]!.valor : null;
            return (
              <li key={d.id} style={{ height: FILA }} onPointerEnter={() => marcar(i)} className="flex flex-col justify-center">
                <div className="mb-1.5 flex items-baseline justify-between gap-2 text-[13px]">
                  <span className="truncate text-[#344054]">
                    <span className="mr-1.5 text-[11px] font-semibold text-[#98a2b3] tabular-nums">{i + 1}</span>
                    {d.nombre}
                  </span>
                  <span className="shrink-0 tabular-nums">
                    <span className="font-semibold text-[#101828]">{numero(d.valor)}</span>
                    {previo !== null ? (
                      <span className="ml-2 text-[12px] text-[#667085]">
                        {porcentaje(previo)}
                        <span className="hidden sm:inline"> del paso anterior</span>
                      </span>
                    ) : null}
                  </span>
                </div>
                <div className="h-3.5 rounded-[4px] bg-[#f1f3f6]">
                  <div
                    className="dv-barra h-full rounded-[4px]"
                    style={{
                      width: `max(4px, ${pct * 100}%)`,
                      background: RAMPA_EMBUDO[i],
                      opacity: activo === null || activo === i ? 1 : 0.45,
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      {activo !== null ? (
        <Tooltip
          x={Math.max(60, (datos[activo]!.valor / max) * ancho)}
          y={activo * FILA + 30}
          ancho={ancho}
          visible
        >
          <TipTitulo>
            Paso {activo + 1}: {datos[activo]!.nombre}
          </TipTitulo>
          <TipFila color={RAMPA_EMBUDO[activo]} forma="cuadro" valor={numero(datos[activo]!.valor)} nombre="personas" />
          <TipFila valor={porcentaje(datos[activo]!.valor / max, 2)} nombre="de las visitas" />
          {activo > 0 ? (
            <TipFila
              valor={porcentaje(1 - datos[activo]!.valor / datos[activo - 1]!.valor)}
              nombre="se fue en este paso"
            />
          ) : null}
        </Tooltip>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------- Canales

export function Canales({ datos }: { datos: Resumen["canales"] }) {
  const [activo, setActivo] = useState<number | null>(null);
  return (
    <div>
      <div
        className="flex h-3.5 w-full gap-[2px] overflow-hidden rounded-[5px]"
        role="img"
        aria-label={`Participación por canal: ${datos.map((d) => `${d.nombre} ${porcentaje(d.share, 0)}`).join(", ")}`}
        onPointerLeave={() => setActivo(null)}
      >
        {datos.map((d, i) => (
          <div
            key={d.id}
            className="dv-barra h-full first:rounded-l-[4px] last:rounded-r-[4px]"
            onPointerEnter={() => setActivo(i)}
            style={{
              width: `${d.share * 100}%`,
              background: COLORES_CANAL[i],
              opacity: activo === null || activo === i ? 1 : 0.35,
              transition: "width 520ms cubic-bezier(.2,.7,.2,1), opacity 160ms",
            }}
          />
        ))}
      </div>
      <ul className="mt-4 divide-y divide-[#f0f2f5]" onPointerLeave={() => setActivo(null)}>
        {datos.map((d, i) => (
          <li
            key={d.id}
            tabIndex={0}
            onPointerEnter={() => setActivo(i)}
            onFocus={() => setActivo(i)}
            onBlur={() => setActivo(null)}
            className={`dv-chart grid grid-cols-[auto_1fr_auto] items-center gap-x-3 rounded-lg px-1.5 py-2.5 transition-colors ${
              activo === i ? "bg-[#f6f8fb]" : ""
            }`}
          >
            <span aria-hidden="true" className="size-2.5 rounded-[3px]" style={{ background: COLORES_CANAL[i] }} />
            <span className="min-w-0">
              <span className="block truncate text-[13px] text-[#344054]">{d.nombre}</span>
              <span className="block text-[11.5px] text-[#667085] tabular-nums">{pesosCompacto(d.valor)}</span>
            </span>
            <span className="text-right">
              <span className="block text-[13px] font-semibold text-[#101828] tabular-nums">{porcentaje(d.share)}</span>
              <Variacion v={d.varPp} pp />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------- Top productos

export function TopProductos({ datos }: { datos: Resumen["productos"] }) {
  const max = Math.max(...datos.map((d) => d.ingresos));
  return (
    <div className="dv-scroll -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <table className="w-full border-collapse text-left text-[13px]">
        <caption className="sr-only">Productos más vendidos del período</caption>
        <thead>
          <tr className="text-[11.5px] tracking-wide text-[#667085] uppercase">
            <th scope="col" className="pb-2.5 font-medium">
              Producto
            </th>
            <th scope="col" className="hidden pb-2.5 text-right font-medium sm:table-cell">
              Unidades
            </th>
            <th scope="col" className="pb-2.5 pl-4 font-medium">
              Ingresos
            </th>
            <th scope="col" className="hidden pb-2.5 text-right font-medium md:table-cell">
              Var.
            </th>
          </tr>
        </thead>
        <tbody>
          {datos.map((p, i) => (
            <tr key={p.id} className="border-t border-[#f0f2f5] transition-colors hover:bg-[#f8f9fb]">
              <td className="py-3 pr-2">
                <div className="flex items-center gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#f2f5fa] text-[12px] font-semibold text-[#2a5ea8] tabular-nums">
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium text-[#101828]">{p.nombre}</span>
                    <span className="block text-[12px] text-[#667085]">
                      {p.cat}
                      <span className="sm:hidden"> · {numero(p.unidades)} u.</span>
                    </span>
                  </span>
                </div>
              </td>
              <td className="hidden py-3 text-right text-[#344054] tabular-nums sm:table-cell">{numero(p.unidades)}</td>
              <td className="py-3 pl-4">
                <div className="flex min-w-[88px] flex-col gap-1.5">
                  <span className="font-semibold text-[#101828] tabular-nums">{pesosCompacto(p.ingresos)}</span>
                  <span className="h-1.5 w-full rounded-full bg-[#f1f3f6]">
                    <span
                      className="dv-barra block h-full rounded-full bg-[#2a78d6]"
                      style={{ width: `${(p.ingresos / max) * 100}%` }}
                    />
                  </span>
                </div>
              </td>
              <td className="hidden py-3 text-right md:table-cell">
                <Variacion v={p.var} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------- Pedidos recientes

const ESTADOS: Record<EstadoPedido, { texto: string; clase: string; icono: React.ReactNode }> = {
  entregado: { texto: "Entregado", clase: "bg-[#ecfdf3] text-[#067647] ring-[#abefc6]", icono: <IcoCheck className="size-3.5" /> },
  "en-camino": { texto: "En camino", clase: "bg-[#eff4ff] text-[#1d4ed8] ring-[#c7d7fe]", icono: <IcoCamion className="size-3.5" /> },
  preparando: { texto: "Preparando", clase: "bg-[#fffaeb] text-[#a15c07] ring-[#fedf89]", icono: <IcoReloj className="size-3.5" /> },
  cancelado: { texto: "Cancelado", clase: "bg-[#fef3f2] text-[#b42318] ring-[#fecdca]", icono: <IcoCancelado className="size-3.5" /> },
};

export function PedidosRecientes() {
  return (
    <ul className="divide-y divide-[#f0f2f5]">
      {PEDIDOS_RECIENTES.map((p) => {
        const e = ESTADOS[p.estado];
        const iniciales = p.cliente
          .split(" ")
          .map((x) => x[0])
          .join("");
        return (
          <li key={p.id} className="flex items-center gap-3 py-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#eef2f7] text-[12px] font-semibold text-[#344054]">
              {iniciales}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-[#101828]">{p.cliente}</p>
              <p className="truncate text-[12px] text-[#667085]">
                <span className="hidden tabular-nums sm:inline">{p.id} · </span>
                {p.items} productos · {p.hace}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="text-[13px] font-semibold text-[#101828] tabular-nums">{pesos(p.total)}</span>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-medium ring-1 ring-inset ${e.clase}`}>
                {e.icono}
                {e.texto}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
