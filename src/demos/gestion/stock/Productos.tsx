"use client";

import { useMemo, useState } from "react";
import { Icon } from "../shared/Icon";
import { normalizar, ordenar, pesos, useSort } from "../shared/util";
import { CATEGORIAS, estadoDe, type Categoria, type Estado, type Producto } from "./data";
import { useStock } from "./context";
import { Titulo } from "./Resumen";
import { BarraStock, btn, CatIcono, EstadoBadge, mono } from "./ui";

type Col = "sku" | "nombre" | "categoria" | "stock" | "minimo" | "costo" | "venta" | "margen" | "estado";

const COLS: { id: Col; label: string; num?: boolean }[] = [
  { id: "sku", label: "SKU" },
  { id: "nombre", label: "Producto" },
  { id: "stock", label: "Stock / mín." },
  { id: "costo", label: "Costo", num: true },
  { id: "venta", label: "Venta", num: true },
  { id: "margen", label: "Margen", num: true },
  { id: "estado", label: "Estado" },
];

const ORDEN_ESTADO: Record<Estado, number> = { sin: 0, bajo: 1, ok: 2 };
const margen = (p: Producto) => (p.venta - p.costo) / p.venta;

export function Productos() {
  const { state, mover, abrirAjuste, abrirAlta } = useStock();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"todas" | Categoria>("todas");
  const [est, setEst] = useState<"todos" | Estado>("todos");
  const sort = useSort<Col>("estado", "asc");

  const filas = useMemo(() => {
    const n = normalizar(q.trim());
    const base = state.productos.filter(
      (p) =>
        (cat === "todas" || p.categoria === cat) &&
        (est === "todos" || estadoDe(p) === est) &&
        (!n || normalizar(`${p.nombre} ${p.sku} ${p.ean} ${p.proveedor}`).includes(n)),
    );
    const get = (p: Producto): string | number => {
      switch (sort.key) {
        case "sku": return p.sku;
        case "nombre": return p.nombre;
        case "categoria": return p.categoria;
        case "stock": return p.stock / Math.max(1, p.minimo);
        case "minimo": return p.minimo;
        case "costo": return p.costo;
        case "venta": return p.venta;
        case "margen": return margen(p);
        case "estado": return ORDEN_ESTADO[estadoDe(p)] * 1000 + p.stock / Math.max(1, p.minimo);
      }
    };
    return ordenar(base, get, sort.dir);
  }, [state.productos, q, cat, est, sort.key, sort.dir]);

  const cuenta = useMemo(() => {
    const c = { todos: state.productos.length, ok: 0, bajo: 0, sin: 0 };
    for (const p of state.productos) c[estadoDe(p)]++;
    return c;
  }, [state.productos]);

  const rapido = (p: Producto, signo: 1 | -1) => {
    const err = mover(p.id, signo > 0 ? "ingreso" : "venta", 1, signo > 0 ? "Ajuste rápido" : "Venta mostrador");
    if (err) abrirAjuste(p.id, "venta");
  };

  return (
    <div>
      <Titulo titulo="Productos" sub={`${state.productos.length} artículos · ${state.productos.reduce((a, p) => a + p.stock, 0).toLocaleString("es-AR")} unidades`}>
        <button type="button" className={btn.primario} onClick={() => abrirAlta()}>
          <Icon name="plus" className="size-4" strokeWidth={2.6} /> Alta de producto
        </button>
      </Titulo>

      <div className="border border-[#D9D6CF] bg-white">
        <div className="flex flex-col gap-2 border-b border-[#D9D6CF] bg-[#F6F5F2] p-2.5 lg:flex-row lg:items-center">
          <div className="relative lg:w-72">
            <label htmlFor="pr-q" className="sr-only">Filtrar productos</label>
            <Icon name="search" className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-[#9A968D]" />
            <input id="pr-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nombre, SKU, código o proveedor" className="h-9 w-full rounded-[4px] border border-[#BDB9B0] bg-white pl-8 pr-2 text-sm focus:border-[#1C1E22] focus:outline-none focus:ring-3 focus:ring-[#F26B1D]/30" />
          </div>
          <label htmlFor="pr-cat" className="sr-only">Categoría</label>
          <select id="pr-cat" value={cat} onChange={(e) => setCat(e.target.value as Categoria | "todas")} className="h-9 rounded-[4px] border border-[#BDB9B0] bg-white px-2 text-sm font-semibold focus:border-[#1C1E22] focus:outline-none focus:ring-3 focus:ring-[#F26B1D]/30">
            <option value="todas">Todas las categorías</option>
            {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
          </select>
          <div role="group" aria-label="Estado" className="flex overflow-x-auto border border-[#BDB9B0] bg-white lg:ml-auto">
            {([["todos", "Todos"], ["ok", "OK"], ["bajo", "Bajo"], ["sin", "Sin stock"]] as const).map(([k, t]) => (
              <button
                key={k}
                type="button"
                aria-pressed={est === k}
                onClick={() => setEst(k)}
                className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap border-r border-[#BDB9B0] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.05em] last:border-0 ${est === k ? "bg-[#1C1E22] text-white" : "hover:bg-[#F6F5F2]"}`}
              >
                {t}
                <span className={`${mono} text-[11px] ${est === k ? "text-[#F26B1D]" : "text-[#6F6C66]"}`}>{cuenta[k]}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="sr-only" aria-live="polite">{filas.length} productos</p>

        {filas.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-bold uppercase">Sin resultados</p>
            <p className="mt-1 text-sm text-[#6B6860]">Probá con otro término o sacá filtros.</p>
            <button type="button" className={`${btn.secundario} mt-3`} onClick={() => { setQ(""); setCat("todas"); setEst("todos"); }}>Limpiar filtros</button>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px] text-[13px]">
                <caption className="sr-only">Productos del inventario. Los encabezados ordenan la tabla.</caption>
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
                    <th scope="col" className="px-3 py-2 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-[#55524B]">Ajuste</th>
                  </tr>
                </thead>
                <tbody>
                  {filas.map((p, i) => {
                    const e = estadoDe(p);
                    return (
                      <tr key={p.id} className={`border-b border-[#EEEDE9] hover:bg-[#FFF8F2] ${i % 2 ? "bg-[#FBFAF8]" : ""} ${e === "sin" ? "shadow-[inset_3px_0_0_#C0262D]" : e === "bajo" ? "shadow-[inset_3px_0_0_#E0A100]" : ""}`}>
                        <td className={`${mono} whitespace-nowrap py-2 pl-3.5 pr-2.5 text-xs font-semibold text-[#55524B]`}>{p.sku}</td>
                        <td className="px-2.5 py-2">
                          <button type="button" onClick={() => abrirAjuste(p.id)} className="flex items-center gap-2.5 text-left hover:text-[#B4400C]">
                            <CatIcono c={p.categoria} className="size-8" />
                            <span className="min-w-0">
                              <span className="block max-w-[300px] truncate font-semibold">{p.nombre}</span>
                              <span className="text-[11px] text-[#8A867D]">{p.categoria} · <span className={mono}>{p.ubicacion}</span></span>
                            </span>
                          </button>
                        </td>
                        <td className="px-2.5 py-2">
                          <div className="flex items-center gap-2.5">
                            <span className={`${mono} w-16 whitespace-nowrap text-right font-bold ${e === "ok" ? "" : e === "bajo" ? "text-[#8A5A00]" : "text-[#C0262D]"}`}>
                              {p.stock}<span className="font-normal text-[#6F6C66]">/{p.minimo}</span>
                            </span>
                            <BarraStock p={p} />
                          </div>
                        </td>
                        <td className={`${mono} whitespace-nowrap px-2.5 py-2 text-right text-[#55524B]`}>{pesos(p.costo)}</td>
                        <td className={`${mono} whitespace-nowrap px-2.5 py-2 text-right font-semibold`}>{pesos(p.venta)}</td>
                        <td className={`${mono} px-2.5 py-2 text-right text-[#55524B]`}>{Math.round(margen(p) * 100)}%</td>
                        <td className="px-2.5 py-2"><EstadoBadge p={p} /></td>
                        <td className="px-3 py-2">
                          <div className="flex items-center justify-end gap-1">
                            <button type="button" className={btn.chico} onClick={() => rapido(p, -1)} disabled={p.stock <= 0} aria-label={`Restar 1 (venta) a ${p.nombre}`} title="Venta de 1 unidad">
                              <Icon name="minus" className="size-4" strokeWidth={2.6} />
                            </button>
                            <button type="button" className={btn.chico} onClick={() => rapido(p, 1)} aria-label={`Sumar 1 a ${p.nombre}`} title="Ingreso de 1 unidad">
                              <Icon name="plus" className="size-4" strokeWidth={2.6} />
                            </button>
                            <button type="button" className={btn.chico} onClick={() => abrirAjuste(p.id)} aria-label={`Ajustar stock de ${p.nombre}`} title="Ajustar stock">
                              <Icon name="edit" className="size-4" strokeWidth={2.2} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="flex items-center gap-2 border-b border-[#D9D6CF] px-3 py-2 md:hidden">
              <label htmlFor="pr-sort" className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#55524B]">Orden</label>
              <select
                id="pr-sort"
                className="h-8 flex-1 rounded-[4px] border border-[#BDB9B0] bg-white px-2 text-xs font-semibold"
                value={`${sort.key}:${sort.dir}`}
                onChange={(e) => { const [key, dir] = e.target.value.split(":") as [Col, "asc" | "desc"]; sort.setSort({ key, dir }); }}
              >
                <option value="estado:asc">Urgencia (sin stock primero)</option>
                <option value="nombre:asc">Nombre A–Z</option>
                <option value="sku:asc">SKU</option>
                <option value="venta:desc">Precio de venta (mayor)</option>
                <option value="margen:desc">Margen (mayor)</option>
              </select>
            </div>
            <ul className="divide-y divide-[#E2DFD8] md:hidden">
              {filas.map((p) => {
                const e = estadoDe(p);
                return (
                  <li key={p.id} className={`p-3 ${e === "sin" ? "shadow-[inset_3px_0_0_#C0262D]" : e === "bajo" ? "shadow-[inset_3px_0_0_#E0A100]" : ""}`}>
                    <div className="flex gap-3">
                      <CatIcono c={p.categoria} className="size-11" />
                      <div className="min-w-0 flex-1">
                        <button type="button" onClick={() => abrirAjuste(p.id)} className="block text-left text-sm font-semibold leading-snug">{p.nombre}</button>
                        <p className={`${mono} mt-0.5 text-[11px] text-[#6B6860]`}>{p.sku} · {p.ubicacion}</p>
                      </div>
                      <EstadoBadge p={p} />
                    </div>
                    <div className="mt-2.5 flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between">
                          <span className={`${mono} text-lg font-bold ${e === "ok" ? "" : e === "bajo" ? "text-[#8A5A00]" : "text-[#C0262D]"}`}>
                            {p.stock} <span className="text-xs font-normal text-[#6F6C66]">mín. {p.minimo}</span>
                          </span>
                          <span className={`${mono} text-sm font-semibold`}>{pesos(p.venta)}</span>
                        </div>
                        <BarraStock p={p} ancho="w-full" />
                      </div>
                      <div className="flex gap-1">
                        <button type="button" className={`${btn.chico} size-10`} onClick={() => rapido(p, -1)} disabled={p.stock <= 0} aria-label={`Restar 1 (venta) a ${p.nombre}`}>
                          <Icon name="minus" className="size-4" strokeWidth={2.6} />
                        </button>
                        <button type="button" className={`${btn.chico} size-10`} onClick={() => rapido(p, 1)} aria-label={`Sumar 1 a ${p.nombre}`}>
                          <Icon name="plus" className="size-4" strokeWidth={2.6} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
      <p className="mt-2 text-xs text-[#6B6860]">
        La marca negra en cada barra es el stock mínimo. <span className="font-semibold">−</span> registra una venta y <span className="font-semibold">+</span> un ingreso de 1 unidad.
      </p>
    </div>
  );
}
