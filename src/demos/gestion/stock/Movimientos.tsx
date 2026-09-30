"use client";

import { useMemo, useState } from "react";
import { Icon } from "../shared/Icon";
import { diaDiff, diaRelativo, hora, normalizar, ordenar, useSort } from "../shared/util";
import { TIPOS, type Movimiento, type TipoMov } from "./data";
import { useStock } from "./context";
import { Titulo } from "./Resumen";
import { mono, TipoBadge } from "./ui";

type Col = "fecha" | "producto" | "tipo" | "cantidad" | "final" | "usuario";
const PAGINA = 25;

export function Movimientos() {
  const { state, now, producto, abrirAjuste } = useStock();
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState<"todos" | TipoMov>("todos");
  const [rango, setRango] = useState<"hoy" | "7" | "todo">("7");
  const [limite, setLimite] = useState(PAGINA);
  const sort = useSort<Col>("fecha", "desc");

  const filas = useMemo(() => {
    const n = normalizar(q.trim());
    const base = state.movimientos.filter((m) => {
      const p = producto(m.productoId);
      const d = diaDiff(m.fecha, now);
      return (
        (tipo === "todos" || m.tipo === tipo) &&
        (rango === "todo" || (rango === "hoy" ? d === 0 : d >= -6)) &&
        (!n || normalizar(`${p?.nombre ?? ""} ${p?.sku ?? ""} ${m.nota} ${m.usuario}`).includes(n))
      );
    });
    const get = (m: Movimiento): string | number => {
      switch (sort.key) {
        case "fecha": return Date.parse(m.fecha);
        case "producto": return producto(m.productoId)?.nombre ?? "";
        case "tipo": return TIPOS[m.tipo].nombre;
        case "cantidad": return m.cantidad;
        case "final": return m.stockFinal;
        case "usuario": return m.usuario;
      }
    };
    return ordenar(base, get, sort.dir);
  }, [state.movimientos, q, tipo, rango, sort.key, sort.dir, producto, now]);

  const totales = useMemo(() => ({
    entradas: filas.filter((m) => m.cantidad > 0).reduce((a, m) => a + m.cantidad, 0),
    salidas: filas.filter((m) => m.cantidad < 0).reduce((a, m) => a - m.cantidad, 0),
  }), [filas]);

  const visibles = filas.slice(0, limite);
  const COLS: { id: Col; label: string; num?: boolean }[] = [
    { id: "fecha", label: "Fecha" },
    { id: "producto", label: "Producto" },
    { id: "tipo", label: "Tipo" },
    { id: "cantidad", label: "Cant.", num: true },
    { id: "final", label: "Stock result.", num: true },
    { id: "usuario", label: "Usuario" },
  ];

  return (
    <div>
      <Titulo titulo="Historial de movimientos" sub="Trazabilidad de cada unidad" />

      <div className="border border-[#D9D6CF] bg-white">
        <div className="flex flex-col gap-2 border-b border-[#D9D6CF] bg-[#F6F5F2] p-2.5 lg:flex-row lg:items-center">
          <div className="relative lg:w-72">
            <label htmlFor="mv-q" className="sr-only">Buscar movimientos</label>
            <Icon name="search" className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-[#9A968D]" />
            <input id="mv-q" type="search" value={q} onChange={(e) => { setQ(e.target.value); setLimite(PAGINA); }} placeholder="Producto, SKU, nota o usuario" className="h-9 w-full rounded-[4px] border border-[#BDB9B0] bg-white pl-8 pr-2 text-sm focus:border-[#1C1E22] focus:outline-none focus:ring-3 focus:ring-[#F26B1D]/30" />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <label htmlFor="mv-tipo" className="sr-only">Tipo</label>
            <select id="mv-tipo" value={tipo} onChange={(e) => { setTipo(e.target.value as TipoMov | "todos"); setLimite(PAGINA); }} className="h-9 rounded-[4px] border border-[#BDB9B0] bg-white px-2 text-sm font-semibold focus:border-[#1C1E22] focus:outline-none">
              <option value="todos">Todos los tipos</option>
              {(Object.keys(TIPOS) as TipoMov[]).map((t) => <option key={t} value={t}>{TIPOS[t].nombre}</option>)}
            </select>
            <label htmlFor="mv-rango" className="sr-only">Período</label>
            <select id="mv-rango" value={rango} onChange={(e) => { setRango(e.target.value as "hoy" | "7" | "todo"); setLimite(PAGINA); }} className="h-9 rounded-[4px] border border-[#BDB9B0] bg-white px-2 text-sm font-semibold focus:border-[#1C1E22] focus:outline-none">
              <option value="hoy">Hoy</option>
              <option value="7">Últimos 7 días</option>
              <option value="todo">Todo</option>
            </select>
          </div>
          <p className={`${mono} text-xs font-semibold text-[#55524B] lg:ml-auto`} aria-live="polite">
            {filas.length} mov. · <span className="text-[#1F7A3E]">+{totales.entradas}</span> · <span className="text-[#B4400C]">−{totales.salidas}</span>
          </p>
        </div>

        {filas.length === 0 ? (
          <p className="p-8 text-center text-sm text-[#6B6860]">No hay movimientos con esos filtros.</p>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[820px] text-[13px]">
                <caption className="sr-only">Historial de movimientos de stock</caption>
                <thead>
                  <tr className="border-b-2 border-[#1C1E22] text-left">
                    {COLS.map((c) => (
                      <th key={c.id} scope="col" aria-sort={sort.aria(c.id)} className={`px-2.5 py-2 first:pl-3.5 ${c.num ? "text-right" : ""}`}>
                        <button type="button" onClick={() => sort.toggle(c.id)} className={`inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.08em] ${sort.key === c.id ? "text-[#B4400C]" : "text-[#55524B] hover:text-[#1C1E22]"}`}>
                          {c.label}
                          <Icon name={sort.key === c.id ? (sort.dir === "asc" ? "arrow-up" : "arrow-down") : "sort"} className={`size-3 ${sort.key === c.id ? "" : "opacity-40"}`} strokeWidth={2.4} />
                        </button>
                      </th>
                    ))}
                    <th scope="col" className="px-3 py-2 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-[#55524B]">Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {visibles.map((m, i) => {
                    const p = producto(m.productoId);
                    return (
                      <tr key={m.id} className={`border-b border-[#EEEDE9] hover:bg-[#FFF8F2] ${i % 2 ? "bg-[#FBFAF8]" : ""}`}>
                        <td className={`${mono} whitespace-nowrap py-2 pl-3.5 pr-2.5 text-xs text-[#55524B]`}>{diaRelativo(m.fecha, now)} · {hora(m.fecha)}</td>
                        <td className="px-2.5 py-2">
                          {p ? (
                            <button type="button" onClick={() => abrirAjuste(p.id)} className="block max-w-[300px] truncate text-left font-semibold hover:text-[#B4400C] hover:underline">
                              <span className={`${mono} mr-2 text-[11px] font-normal text-[#9A968D]`}>{p.sku}</span>{p.nombre}
                            </button>
                          ) : "—"}
                        </td>
                        <td className="px-2.5 py-2"><TipoBadge tipo={m.tipo} /></td>
                        <td className={`${mono} px-2.5 py-2 text-right font-bold ${m.cantidad > 0 ? "text-[#1F7A3E]" : "text-[#B4400C]"}`}>{m.cantidad > 0 ? "+" : ""}{m.cantidad}</td>
                        <td className={`${mono} px-2.5 py-2 text-right`}>{m.stockFinal}</td>
                        <td className="whitespace-nowrap px-2.5 py-2 text-[#55524B]">{m.usuario}</td>
                        <td className="max-w-[220px] truncate px-3 py-2 text-[#6B6860]">{m.nota}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <ul className="divide-y divide-[#E2DFD8] md:hidden">
              {visibles.map((m) => {
                const p = producto(m.productoId);
                return (
                  <li key={m.id} className="flex items-start gap-3 p-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <TipoBadge tipo={m.tipo} />
                        <span className={`${mono} text-[11px] text-[#6B6860]`}>{diaRelativo(m.fecha, now)} · {hora(m.fecha)}</span>
                      </div>
                      <p className="mt-1 text-sm font-semibold leading-snug">{p?.nombre ?? "—"}</p>
                      <p className="mt-0.5 text-xs text-[#6B6860]">{m.nota} · {m.usuario}</p>
                    </div>
                    <div className="text-right">
                      <p className={`${mono} text-lg font-bold ${m.cantidad > 0 ? "text-[#1F7A3E]" : "text-[#B4400C]"}`}>{m.cantidad > 0 ? "+" : ""}{m.cantidad}</p>
                      <p className={`${mono} text-[11px] text-[#6B6860]`}>queda {m.stockFinal}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            {filas.length > limite ? (
              <div className="border-t border-[#D9D6CF] p-2.5 text-center">
                <button type="button" onClick={() => setLimite((l) => l + PAGINA)} className="text-xs font-bold uppercase tracking-[0.08em] text-[#B4400C] hover:underline">
                  Ver {Math.min(PAGINA, filas.length - limite)} más ({filas.length - limite} restantes)
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
