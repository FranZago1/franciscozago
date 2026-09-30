"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { fechaCorta, numero, pesos } from "../shared/formato";
import { NOMBRE_CATEGORIA, type CategoriaId, type Movimiento } from "./datos";
import { COLOR_GASTO } from "./Graficos";

const normalizar = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const COLOR_INGRESO: Record<string, string> = { ventas: "#3987e5", senas: "#6da7ec" };

export type FiltroTipo = "todos" | "ingreso" | "egreso";

export function Movimientos({
  movs,
  categoria,
  onCategoria,
}: {
  movs: Movimiento[];
  categoria: CategoriaId | "todas";
  onCategoria: (c: CategoriaId | "todas") => void;
}) {
  const [texto, setTexto] = useState("");
  const [tipo, setTipo] = useState<FiltroTipo>("todos");
  const [cantidad, setCantidad] = useState(12);
  const busqueda = useDeferredValue(texto);

  const filtrados = useMemo(() => {
    const q = normalizar(busqueda.trim());
    return movs.filter(
      (m) =>
        (tipo === "todos" || m.tipo === tipo) &&
        (categoria === "todas" || m.categoria === categoria) &&
        (!q || normalizar(`${m.concepto} ${m.contraparte} ${m.id}`).includes(q)),
    );
  }, [movs, busqueda, tipo, categoria]);

  const visibles = filtrados.slice(0, cantidad);
  const totalIn = filtrados.filter((m) => m.tipo === "ingreso").reduce((a, m) => a + m.monto, 0);
  const totalOut = filtrados.filter((m) => m.tipo === "egreso").reduce((a, m) => a + m.monto, 0);
  const hayFiltros = texto !== "" || tipo !== "todos" || categoria !== "todas";

  const campo =
    "h-9 rounded-[8px] border border-white/10 bg-[#0d1014] px-3 text-[13px] text-[var(--dv-ink)] placeholder:text-[var(--dv-muted)] focus:border-[var(--dv-focus)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dv-focus)]/40";

  return (
    <div>
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Buscar movimientos</span>
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--dv-muted)]"
          >
            <circle cx="9" cy="9" r="5.5" />
            <path d="m13.2 13.2 3.3 3.3" />
          </svg>
          <input
            type="search"
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value);
              setCantidad(12);
            }}
            placeholder="Buscar por concepto, cliente o proveedor…"
            className={`${campo} w-full pl-9`}
          />
        </label>
        <div className="flex flex-wrap items-center gap-2.5">
          <div role="group" aria-label="Tipo de movimiento" className="inline-flex rounded-[8px] border border-white/10 bg-[#0d1014] p-0.5">
            {(
              [
                ["todos", "Todos"],
                ["ingreso", "Ingresos"],
                ["egreso", "Egresos"],
              ] as const
            ).map(([id, t]) => (
              <button
                key={id}
                type="button"
                aria-pressed={tipo === id}
                onClick={() => {
                  setTipo(id);
                  setCantidad(12);
                }}
                className={`rounded-[6px] px-3 py-1.5 text-[12.5px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--dv-focus)] ${
                  tipo === id ? "bg-white/[0.1] text-[var(--dv-ink)]" : "text-[var(--dv-ink2)] hover:text-[var(--dv-ink)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2">
            <span className="sr-only">Categoría</span>
            <select
              value={categoria}
              onChange={(e) => {
                onCategoria(e.target.value as CategoriaId | "todas");
                setCantidad(12);
              }}
              className={`${campo} pr-8`}
            >
              <option value="todas">Todas las categorías</option>
              {(Object.keys(NOMBRE_CATEGORIA) as CategoriaId[]).map((c) => (
                <option key={c} value={c}>
                  {NOMBRE_CATEGORIA[c]}
                </option>
              ))}
            </select>
          </label>
          {hayFiltros ? (
            <button
              type="button"
              onClick={() => {
                setTexto("");
                setTipo("todos");
                onCategoria("todas");
              }}
              className="text-[12.5px] text-[var(--dv-ink2)] underline underline-offset-4 hover:text-[var(--dv-ink)]"
            >
              Limpiar
            </button>
          ) : null}
        </div>
      </div>

      <p className="mt-3 text-[12.5px] text-[var(--dv-ink2)]" aria-live="polite">
        {numero(filtrados.length)} movimientos · <span className="text-[#8cbcf5]">+{pesos(totalIn)}</span> ·{" "}
        <span className="text-[#f19a9a]">−{pesos(totalOut)}</span>
      </p>

      <div className="dv-scroll mt-3 overflow-x-auto">
        <table className="w-full border-collapse text-left text-[13px]">
          <caption className="sr-only">Movimientos de caja del período</caption>
          <thead>
            <tr className="border-b border-white/[0.07] font-[family-name:var(--font-tc-mono)] text-[11px] tracking-[0.04em] text-[var(--dv-muted)] uppercase">
              <th scope="col" className="py-2 pr-3 font-normal">
                Fecha
              </th>
              <th scope="col" className="py-2 pr-3 font-normal">
                Concepto
              </th>
              <th scope="col" className="hidden py-2 pr-3 font-normal md:table-cell">
                Categoría
              </th>
              <th scope="col" className="hidden py-2 pr-3 font-normal lg:table-cell">
                Medio
              </th>
              <th scope="col" className="py-2 text-right font-normal">
                Monto
              </th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((m) => {
              const color = m.tipo === "ingreso" ? COLOR_INGRESO[m.categoria] : COLOR_GASTO[m.categoria];
              return (
                <tr key={m.id} className="border-b border-white/[0.05] transition-colors hover:bg-white/[0.025]">
                  <td className="py-2.5 pr-3 align-top font-[family-name:var(--font-tc-mono)] text-[12px] whitespace-nowrap text-[var(--dv-ink2)]">
                    {fechaCorta(m.t)}
                  </td>
                  <td className="py-2.5 pr-3 align-top">
                    <span className="block text-[var(--dv-ink)]">{m.concepto}</span>
                    <span className="block text-[12px] text-[var(--dv-muted)]">
                      {m.contraparte}
                      <span className="md:hidden"> · {NOMBRE_CATEGORIA[m.categoria]}</span>
                    </span>
                  </td>
                  <td className="hidden py-2.5 pr-3 align-top whitespace-nowrap md:table-cell">
                    <span className="inline-flex items-center gap-2 text-[var(--dv-ink2)]">
                      <span aria-hidden="true" className="size-2 rounded-[2px]" style={{ background: color }} />
                      {NOMBRE_CATEGORIA[m.categoria]}
                    </span>
                  </td>
                  <td className="hidden py-2.5 pr-3 align-top text-[12.5px] whitespace-nowrap text-[var(--dv-muted)] lg:table-cell">{m.medio}</td>
                  <td
                    className={`py-2.5 text-right align-top font-medium whitespace-nowrap tabular-nums ${
                      m.tipo === "ingreso" ? "text-[#8cbcf5]" : "text-[var(--dv-ink)]"
                    }`}
                  >
                    {m.tipo === "ingreso" ? "+" : "−"}
                    {pesos(m.monto)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!filtrados.length ? (
          <p className="py-10 text-center text-[13.5px] text-[var(--dv-ink2)]">No hay movimientos que coincidan con la búsqueda.</p>
        ) : null}
      </div>
      {filtrados.length > cantidad ? (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setCantidad((c) => c + 20)}
            className="rounded-[8px] px-4 py-2 text-[13px] font-medium text-[var(--dv-ink)] ring-1 ring-white/15 transition-colors hover:bg-white/[0.05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dv-focus)]"
          >
            Mostrar más ({numero(filtrados.length - cantidad)} restantes)
          </button>
        </div>
      ) : null}
    </div>
  );
}
