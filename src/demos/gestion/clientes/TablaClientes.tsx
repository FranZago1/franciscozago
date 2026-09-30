"use client";

import { useMemo, useState } from "react";
import { Icon } from "../shared/Icon";
import { diaDiff, diaRelativo, haceDias, hora, normalizar, ordenar, pesosCorto, usd, useSort } from "../shared/util";
import { ASESORES, ETAPAS, ORIGENES, type Cliente, type Etapa } from "./data";
import { useCrm } from "./context";
import { Avatar, btn, EtapaBadge, PrioridadFlag, Vacio } from "./ui";

type Col = "nombre" | "etapa" | "operacion" | "zona" | "presupuesto" | "asesor" | "ultimo" | "proxima";

const COLS: { id: Col; label: string; className?: string }[] = [
  { id: "nombre", label: "Cliente" },
  { id: "etapa", label: "Etapa" },
  { id: "presupuesto", label: "Presupuesto", className: "text-right" },
  { id: "zona", label: "Zona" },
  { id: "asesor", label: "Asesor" },
  { id: "ultimo", label: "Último contacto" },
  { id: "proxima", label: "Próxima acción" },
];

const ORDEN_ETAPA: Record<Etapa, number> = { nuevo: 0, contactado: 1, visita: 2, negociacion: 3, cerrado: 4 };

export function TablaClientes() {
  const { state, now, abrirFicha, abrirForm, proximaTarea } = useCrm();
  const [q, setQ] = useState("");
  const [etapa, setEtapa] = useState<"todas" | Etapa>("todas");
  const [operacion, setOperacion] = useState("todas");
  const [asesor, setAsesor] = useState("todos");
  const [origen, setOrigen] = useState("todos");
  const sort = useSort<Col>("ultimo", "desc");

  const filas = useMemo(() => {
    const n = normalizar(q.trim());
    const base = state.clientes.filter(
      (c) =>
        (etapa === "todas" || c.etapa === etapa) &&
        (operacion === "todas" || c.operacion === operacion) &&
        (asesor === "todos" || c.asesor === asesor) &&
        (origen === "todos" || c.origen === origen) &&
        (!n || normalizar(`${c.nombre} ${c.email} ${c.telefono} ${c.zona}`).includes(n)),
    );
    const get = (c: Cliente): string | number => {
      switch (sort.key) {
        case "nombre":
          return c.nombre;
        case "etapa":
          return ORDEN_ETAPA[c.etapa];
        case "operacion":
          return c.operacion;
        case "zona":
          return c.zona;
        // Normaliza alquileres a US$ aproximados para poder ordenar mezclado.
        case "presupuesto":
          return c.operacion === "Compra" ? c.presupuesto : c.presupuesto / 1200;
        case "asesor":
          return c.asesor;
        case "ultimo":
          return Date.parse(c.ultimoContacto);
        case "proxima": {
          const t = proximaTarea(c.id);
          return t ? Date.parse(t.fecha) : sort.dir === "asc" ? Infinity : -Infinity;
        }
      }
    };
    return ordenar(base, get, sort.dir);
  }, [state.clientes, q, etapa, operacion, asesor, origen, sort.key, sort.dir, proximaTarea]);

  const filtrosActivos = [etapa !== "todas", operacion !== "todas", asesor !== "todos", origen !== "todos", q !== ""].filter(Boolean).length;

  function exportar() {
    const head = ["Nombre", "Teléfono", "Email", "Etapa", "Operación", "Presupuesto", "Zona", "Origen", "Asesor"];
    const rows = filas.map((c) => [c.nombre, c.telefono, c.email, c.etapa, c.operacion, c.presupuesto, c.zona, c.origen, c.asesor]);
    const csv = [head, ...rows].map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "clientes-portal-sur.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const select =
    "h-9 rounded-lg border border-[#D5DDE5] bg-white px-2.5 text-sm font-semibold text-[#334155] focus:border-[#0F4C5C] focus:outline-none focus:ring-3 focus:ring-[#0F4C5C]/15";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0C3440] sm:text-[28px]">Clientes</h1>
          <p className="mt-1 text-sm text-[#5F6E84]">
            {state.clientes.length} clientes en la cartera · {state.clientes.filter((c) => c.etapa !== "cerrado").length} activos
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" className={btn.secundario} onClick={exportar}>
            <Icon name="arrow-down" className="size-4" /> Exportar CSV
          </button>
          <button type="button" className={btn.primario} onClick={() => abrirForm()}>
            <Icon name="plus" className="size-4" strokeWidth={2.4} /> Nuevo cliente
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,.04)]">
        <div className="flex flex-col gap-2.5 border-b border-[#E6EBF0] p-3 sm:p-4 lg:flex-row lg:flex-wrap lg:items-center">
          <div className="relative lg:w-72">
            <label htmlFor="tc-q" className="sr-only">
              Buscar en la tabla
            </label>
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
            <input
              id="tc-q"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Nombre, email, teléfono o zona"
              className="h-9 w-full rounded-lg border border-[#D5DDE5] bg-white pl-9 pr-3 text-sm placeholder:text-[#94A3B8] focus:border-[#0F4C5C] focus:outline-none focus:ring-3 focus:ring-[#0F4C5C]/15"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <label className="sr-only" htmlFor="tc-etapa">Etapa</label>
            <select id="tc-etapa" className={select} value={etapa} onChange={(e) => setEtapa(e.target.value as Etapa | "todas")}>
              <option value="todas">Todas las etapas</option>
              {ETAPAS.map((e) => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor="tc-op">Operación</label>
            <select id="tc-op" className={select} value={operacion} onChange={(e) => setOperacion(e.target.value)}>
              <option value="todas">Compra y alquiler</option>
              <option value="Compra">Compra</option>
              <option value="Alquiler">Alquiler</option>
            </select>
            <label className="sr-only" htmlFor="tc-as">Asesor</label>
            <select id="tc-as" className={select} value={asesor} onChange={(e) => setAsesor(e.target.value)}>
              <option value="todos">Todos los asesores</option>
              {ASESORES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor="tc-or">Origen</label>
            <select id="tc-or" className={select} value={origen} onChange={(e) => setOrigen(e.target.value)}>
              <option value="todos">Todos los orígenes</option>
              {ORIGENES.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between gap-3 lg:ml-auto">
            <p className="text-xs font-semibold text-[#5F6E84]" aria-live="polite">
              {filas.length} {filas.length === 1 ? "resultado" : "resultados"}
            </p>
            {filtrosActivos > 0 ? (
              <button
                type="button"
                className={btn.fantasma}
                onClick={() => {
                  setQ("");
                  setEtapa("todas");
                  setOperacion("todas");
                  setAsesor("todos");
                  setOrigen("todos");
                }}
              >
                Limpiar ({filtrosActivos})
              </button>
            ) : null}
          </div>
        </div>

        {filas.length === 0 ? (
          <div className="p-4">
            <Vacio icono="search" titulo="Sin resultados" texto="Probá con otro nombre o sacá algún filtro." />
          </div>
        ) : (
          <>
            {/* Escritorio: tabla */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px] text-sm">
                <caption className="sr-only">Clientes. Hacé clic en un encabezado para ordenar.</caption>
                <thead>
                  <tr className="border-b border-[#E6EBF0] bg-[#F8FAFC] text-left">
                    {COLS.map((col) => (
                      <th key={col.id} scope="col" aria-sort={sort.aria(col.id)} className={`px-3 py-2.5 first:pl-5 ${col.className ?? ""}`}>
                        <button
                          type="button"
                          onClick={() => sort.toggle(col.id)}
                          className={`group inline-flex items-center gap-1 whitespace-nowrap rounded text-xs font-bold uppercase tracking-[0.06em] transition ${sort.key === col.id ? "text-[#0F4C5C]" : "text-[#5F6E84] hover:text-[#0F172A]"}`}
                        >
                          {col.label}
                          <Icon
                            name={sort.key === col.id ? (sort.dir === "asc" ? "arrow-up" : "arrow-down") : "sort"}
                            className={`size-3.5 ${sort.key === col.id ? "" : "opacity-0 group-hover:opacity-60"}`}
                            strokeWidth={2.2}
                          />
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filas.map((c) => {
                    const t = proximaTarea(c.id);
                    return (
                      <tr
                        key={c.id}
                        onClick={() => abrirFicha(c.id)}
                        className="cursor-pointer border-b border-[#EEF2F6] transition last:border-0 hover:bg-[#F6FAFB]"
                      >
                        <td className="py-3 pl-5 pr-4">
                          <div className="flex items-center gap-3">
                            <Avatar nombre={c.nombre} />
                            <div className="min-w-0">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  abrirFicha(c.id);
                                }}
                                className="flex items-center gap-1.5 truncate text-left font-bold text-[#0F172A] hover:text-[#0F4C5C] hover:underline"
                              >
                                {c.nombre}
                                <PrioridadFlag p={c.prioridad} />
                              </button>
                              <p className="max-w-[190px] truncate text-xs text-[#5F6E84]">{c.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3"><EtapaBadge etapa={c.etapa} /></td>
                        <td className="whitespace-nowrap px-3 py-3 text-right">
                          <span className="block font-bold tabular-nums">
                            {c.operacion === "Compra" ? usd(c.presupuesto) : <>{pesosCorto(c.presupuesto)}<span className="font-medium text-[#5F6E84]">/mes</span></>}
                          </span>
                          <span className="text-xs font-medium text-[#5F6E84]">{c.operacion}</span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-[#334155]">{c.zona}</td>
                        <td className="px-3 py-3">
                          <span className="flex items-center gap-2 whitespace-nowrap text-[#334155]"><Avatar nombre={c.asesor} size="sm" />{c.asesor.split(" ")[0]}</span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-[#475569]">{haceDias(c.ultimoContacto, now)}</td>
                        <td className="px-3 py-3 pr-5">
                          <ProximaCelda t={t} now={now} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile: tarjetas */}
            <div className="border-b border-[#EEF2F6] px-3 py-2 md:hidden">
              <label htmlFor="tc-sort" className="mr-2 text-xs font-semibold text-[#5F6E84]">Ordenar por</label>
              <select
                id="tc-sort"
                className="h-8 rounded-md border border-[#D5DDE5] bg-white px-2 text-xs font-semibold"
                value={`${sort.key}:${sort.dir}`}
                onChange={(e) => {
                  const [key, dir] = e.target.value.split(":") as [Col, "asc" | "desc"];
                  sort.setSort({ key, dir });
                }}
              >
                <option value="ultimo:desc">Último contacto (reciente)</option>
                <option value="proxima:asc">Próxima acción</option>
                <option value="nombre:asc">Nombre (A–Z)</option>
                <option value="presupuesto:desc">Presupuesto (mayor)</option>
                <option value="etapa:asc">Etapa</option>
              </select>
            </div>
            <ul className="divide-y divide-[#EEF2F6] md:hidden">
              {filas.map((c) => {
                const t = proximaTarea(c.id);
                return (
                  <li key={c.id}>
                    <button type="button" onClick={() => abrirFicha(c.id)} className="flex w-full gap-3 px-4 py-3.5 text-left active:bg-[#F6FAFB]">
                      <Avatar nombre={c.nombre} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-bold">{c.nombre}</p>
                          <PrioridadFlag p={c.prioridad} />
                          <span className="ml-auto"><EtapaBadge etapa={c.etapa} /></span>
                        </div>
                        <p className="mt-0.5 text-xs text-[#5F6E84]">
                          {c.operacion} · {c.zona} ·{" "}
                          <span className="font-bold text-[#0F172A]">
                            {c.operacion === "Compra" ? usd(c.presupuesto) : `${pesosCorto(c.presupuesto)}/mes`}
                          </span>
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                          <ProximaCelda t={t} now={now} />
                          <span className="shrink-0 text-[#677180]">{haceDias(c.ultimoContacto, now)}</span>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

function ProximaCelda({ t, now }: { t: ReturnType<ReturnType<typeof useCrm>["proximaTarea"]>; now: number }) {
  if (!t) return <span className="text-xs font-medium text-[#677180]">Sin agendar</span>;
  const d = diaDiff(t.fecha, now);
  const cls = d < 0 ? "text-[#B42318]" : d === 0 ? "text-[#9A5B0B]" : "text-[#475569]";
  return (
    <span className={`inline-flex min-w-0 items-center gap-1.5 whitespace-nowrap text-xs font-semibold ${cls}`}>
      <Icon name="clock" className="size-3.5 shrink-0" />
      {d < 0 ? "Atrasada · " : ""}
      {diaRelativo(t.fecha, now)} {hora(t.fecha)}
    </span>
  );
}
