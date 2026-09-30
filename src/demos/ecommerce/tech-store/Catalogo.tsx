"use client";

import Image from "next/image";
import { useId, useMemo, useState } from "react";
import { Dialogo } from "../shared/Dialogo";
import { cuota, pesos } from "../shared/formato";
import { Estrellas, IconoCamion, IconoCerrar, IconoCheck, IconoFiltro, IconoRayo } from "../shared/Iconos";
import { categorias, config, marcas, productos, type Categoria, type Marca, type ProductoTech } from "./datos";
import { alternarComparar, busqueda, comparar, mono, tienda } from "./tienda";

type Orden = "relevancia" | "menor" | "mayor" | "rating";
type Filtros = { cats: Categoria[]; marcas: Marca[]; min: string; max: string; stock: boolean; ofertas: boolean };
const VACIO: Filtros = { cats: [], marcas: [], min: "", max: "", stock: false, ofertas: false };

const foco = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F5BFF]";
const PRESETS: [string, string, string][] = [
  ["Hasta $ 150.000", "", "150000"],
  ["$ 150.000 a $ 700.000", "150000", "700000"],
  ["Más de $ 700.000", "700000", ""],
];

const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export function Catalogo() {
  const [f, setF] = useState<Filtros>(VACIO);
  const [orden, setOrden] = useState<Orden>("relevancia");
  const [panel, setPanel] = useState(false);
  const q = busqueda.use();

  const lista = useMemo(() => {
    const texto = normalizar(q.trim());
    const min = Number(f.min) || 0;
    const max = Number(f.max) || Infinity;
    const r = productos.filter(
      (p) =>
        (!f.cats.length || f.cats.includes(p.categoria)) &&
        (!f.marcas.length || f.marcas.includes(p.marca)) &&
        p.precio >= min &&
        p.precio <= max &&
        (!f.stock || p.stock) &&
        (!f.ofertas || p.precioAnterior) &&
        (!texto || normalizar(`${p.nombre} ${p.marca} ${p.categoria} ${p.destacados.join(" ")}`).includes(texto)),
    );
    if (orden === "menor") r.sort((a, b) => a.precio - b.precio);
    if (orden === "mayor") r.sort((a, b) => b.precio - a.precio);
    if (orden === "rating") r.sort((a, b) => b.rating - a.rating);
    return r;
  }, [f, orden, q]);

  const chips: { texto: string; quitar: () => void }[] = [
    ...(q ? [{ texto: `“${q}”`, quitar: () => busqueda.set("") }] : []),
    ...f.cats.map((c) => ({ texto: c, quitar: () => setF((x) => ({ ...x, cats: x.cats.filter((y) => y !== c) })) })),
    ...f.marcas.map((m) => ({ texto: m, quitar: () => setF((x) => ({ ...x, marcas: x.marcas.filter((y) => y !== m) })) })),
    ...(f.min || f.max
      ? [{ texto: `${f.min ? pesos(Number(f.min)) : "$ 0"} – ${f.max ? pesos(Number(f.max)) : "sin tope"}`, quitar: () => setF((x) => ({ ...x, min: "", max: "" })) }]
      : []),
    ...(f.stock ? [{ texto: "Con stock", quitar: () => setF((x) => ({ ...x, stock: false })) }] : []),
    ...(f.ofertas ? [{ texto: "En oferta", quitar: () => setF((x) => ({ ...x, ofertas: false })) }] : []),
  ];
  const limpiar = () => {
    setF(VACIO);
    busqueda.set("");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[250px_1fr] lg:gap-10">
      <aside aria-label="Filtros" className="hidden lg:block">
        <div className="sticky top-24">
          <PanelFiltros f={f} setF={setF} />
        </div>
      </aside>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setPanel(true)} className={`inline-flex h-11 items-center gap-2 rounded-xl border border-[#16181D]/15 px-4 text-sm font-semibold lg:hidden ${foco}`}>
            <IconoFiltro className="size-[18px]" /> Filtros{chips.length ? <span className="rounded-md bg-[#2F5BFF] px-1.5 text-xs text-white">{chips.length}</span> : null}
          </button>
          <p className="text-sm text-[#16181D]/65" aria-live="polite">
            <strong className="text-[#16181D]">{lista.length}</strong> {lista.length === 1 ? "resultado" : "resultados"}
          </p>
          <label className="ml-auto flex items-center gap-2 text-sm">
            <span className="hidden text-[#16181D]/62 sm:inline">Ordenar por</span>
            <select value={orden} onChange={(e) => setOrden(e.target.value as Orden)} className={`h-11 rounded-xl border border-[#16181D]/15 bg-white px-3 font-medium ${foco}`} aria-label="Ordenar por">
              <option value="relevancia">Relevancia</option>
              <option value="menor">Menor precio</option>
              <option value="mayor">Mayor precio</option>
              <option value="rating">Mejor puntuados</option>
            </select>
          </label>
        </div>

        {chips.length ? (
          <ul className="mt-4 flex flex-wrap items-center gap-2" aria-label="Filtros activos">
            {chips.map((c) => (
              <li key={c.texto}>
                <button type="button" onClick={c.quitar} className={`inline-flex items-center gap-1.5 rounded-lg bg-[#EEF2FF] py-1.5 pr-2 pl-3 text-sm font-medium text-[#2340B8] hover:bg-[#E0E7FF] ${foco}`} aria-label={`Quitar filtro ${c.texto}`}>
                  {c.texto} <IconoCerrar className="size-3.5" trazo={2.2} />
                </button>
              </li>
            ))}
            <li>
              <button type="button" onClick={limpiar} className={`rounded-lg px-2 py-1.5 text-sm font-medium text-[#16181D]/62 underline underline-offset-4 hover:text-[#16181D] ${foco}`}>
                Limpiar todo
              </button>
            </li>
          </ul>
        ) : null}

        {lista.length ? (
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
            {lista.map((p) => (
              <li key={p.id}>
                <Tarjeta p={p} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-[#16181D]/20 px-6 py-16 text-center">
            <p className="text-lg font-semibold">No encontramos productos con esos filtros.</p>
            <p className="mt-1 text-[#16181D]/62">Probá con otra marca o ampliá el rango de precio.</p>
            <button type="button" onClick={limpiar} className={`mt-5 rounded-xl bg-[#16181D] px-5 py-3 text-sm font-semibold text-white ${foco}`}>
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      <Dialogo abierto={panel} onCerrar={() => setPanel(false)} titulo="vt-filtros-titulo" variante="izquierda" className="flex flex-col bg-white text-[#16181D]" overlayClassName="bg-[#0B0D12]/55">
        <div className="flex items-center justify-between border-b border-[#16181D]/10 px-5 py-4">
          <h2 id="vt-filtros-titulo" className="text-lg font-bold">
            Filtros
          </h2>
          <button type="button" onClick={() => setPanel(false)} className={`grid size-10 place-items-center rounded-lg hover:bg-[#16181D]/6 ${foco}`} aria-label="Cerrar filtros">
            <IconoCerrar />
          </button>
        </div>
        <div className="flex-1 px-5 py-5">
          <PanelFiltros f={f} setF={setF} />
        </div>
        <div className="sticky bottom-0 flex gap-2 border-t border-[#16181D]/10 bg-white p-4">
          <button type="button" onClick={limpiar} className={`rounded-xl border border-[#16181D]/15 px-4 py-3 text-sm font-semibold ${foco}`}>
            Limpiar
          </button>
          <button type="button" onClick={() => setPanel(false)} className={`flex-1 rounded-xl bg-[#2F5BFF] px-4 py-3 text-sm font-semibold text-white ${foco}`}>
            Ver {lista.length} resultados
          </button>
        </div>
      </Dialogo>
    </div>
  );
}

function PanelFiltros({ f, setF }: { f: Filtros; setF: React.Dispatch<React.SetStateAction<Filtros>> }) {
  const id = useId();
  const alternar = <K extends "cats" | "marcas">(k: K, v: Filtros[K][number]) =>
    setF((x) => {
      const arr = x[k] as string[];
      return { ...x, [k]: arr.includes(v) ? arr.filter((y) => y !== v) : [...arr, v] };
    });
  const conteo = (fn: (p: ProductoTech) => boolean) => productos.filter(fn).length;
  const check = "size-[18px] shrink-0 rounded accent-[#2F5BFF]";

  return (
    <div className="space-y-7 text-sm">
      <fieldset>
        <legend className={`${mono} text-[11px] font-medium tracking-[0.12em] text-[#16181D]/62 uppercase`}>Categoría</legend>
        <ul className="mt-3 space-y-1">
          {categorias.map((c) => (
            <li key={c}>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-[#F3F5F8]">
                <input type="checkbox" checked={f.cats.includes(c)} onChange={() => alternar("cats", c)} className={check} />
                <span className="flex-1">{c}</span>
                <span className={`${mono} text-xs text-[#16181D]/62`}>{conteo((p) => p.categoria === c)}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <fieldset>
        <legend className={`${mono} text-[11px] font-medium tracking-[0.12em] text-[#16181D]/62 uppercase`}>Marca</legend>
        <ul className="mt-3 grid grid-cols-2 gap-1">
          {marcas.map((m) => (
            <li key={m}>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-[#F3F5F8]">
                <input type="checkbox" checked={f.marcas.includes(m)} onChange={() => alternar("marcas", m)} className={check} />
                <span className="flex-1">{m}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <fieldset>
        <legend className={`${mono} text-[11px] font-medium tracking-[0.12em] text-[#16181D]/62 uppercase`}>Precio</legend>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(
            [
              ["min", "Desde"],
              ["max", "Hasta"],
            ] as const
          ).map(([k, l]) => (
            <div key={k}>
              <label htmlFor={`${id}-${k}`} className="text-xs text-[#16181D]/62">
                {l} ($)
              </label>
              <input
                id={`${id}-${k}`}
                type="number"
                inputMode="numeric"
                min={0}
                step={10000}
                placeholder={k === "min" ? "0" : "Sin tope"}
                value={f[k]}
                onChange={(e) => setF((x) => ({ ...x, [k]: e.target.value }))}
                className={`${mono} mt-1 h-10 w-full rounded-lg border border-[#16181D]/15 px-2.5 text-sm outline-none focus:border-[#2F5BFF] focus:ring-4 focus:ring-[#2F5BFF]/15`}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {PRESETS.map(([t, a, b]) => {
            const on = f.min === a && f.max === b;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                onClick={() => setF((x) => (on ? { ...x, min: "", max: "" } : { ...x, min: a, max: b }))}
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${foco} ${on ? "border-[#2F5BFF] bg-[#F4F7FF] text-[#2F5BFF]" : "border-[#16181D]/12 hover:border-[#16181D]/30"}`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </fieldset>
      <fieldset className="space-y-2">
        <legend className={`${mono} mb-3 text-[11px] font-medium tracking-[0.12em] text-[#16181D]/62 uppercase`}>Disponibilidad</legend>
        {(
          [
            ["stock", "Solo con stock"],
            ["ofertas", "Solo ofertas"],
          ] as const
        ).map(([k, l]) => (
          <label key={k} className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-[#F3F5F8]">
            {l}
            <input type="checkbox" role="switch" checked={f[k]} onChange={(e) => setF((x) => ({ ...x, [k]: e.target.checked }))} className="peer sr-only" />
            <span
              aria-hidden="true"
              className="relative h-6 w-10 rounded-full bg-[#16181D]/15 transition-colors peer-checked:bg-[#2F5BFF] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#2F5BFF] after:absolute after:top-1 after:left-1 after:size-4 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-4"
            />
          </label>
        ))}
      </fieldset>
    </div>
  );
}

export function EnvioBadge({ p }: { p: ProductoTech }) {
  if (!p.stock) return <span className="text-xs font-medium text-[#16181D]/62">Sin stock por ahora</span>;
  if (p.entrega <= 1)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D8259]">
        <IconoRayo className="size-3.5" trazo={2.2} /> Llega mañana
      </span>
    );
  if (p.precio >= config.envioGratisDesde)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D8259]">
        <IconoCamion className="size-3.5" trazo={2} /> Envío gratis
      </span>
    );
  return <span className="inline-flex items-center gap-1 text-xs font-medium text-[#16181D]/62">Llega en {p.entrega} días hábiles</span>;
}

export const descuento = (p: ProductoTech) => (p.precioAnterior ? Math.round((1 - p.precio / p.precioAnterior) * 100) : 0);

function Tarjeta({ p }: { p: ProductoTech }) {
  const enComparar = comparar.use().includes(p.id);
  const [hecho, setHecho] = useState(false);
  const off = descuento(p);
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-[#16181D]/8 bg-white p-2.5 transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(22,24,29,0.35)] sm:p-3">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-[#EEF1F5]">
        <Image src={p.imagen} alt={p.alt} fill sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 50vw" className={`object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none ${p.stock ? "" : "opacity-60 grayscale"}`} />
        <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
          {off ? <span className={`${mono} rounded-md bg-[#2F5BFF] px-1.5 py-0.5 text-[11px] font-semibold text-white`}>-{off}%</span> : null}
          {!p.stock ? <span className="rounded-md bg-[#16181D] px-1.5 py-0.5 text-[11px] font-semibold text-white">Sin stock</span> : null}
        </div>
        <label className={`absolute top-2 right-2 z-10 flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/92 px-2 py-1 text-[11px] font-semibold shadow-sm backdrop-blur has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#2F5BFF] ${enComparar ? "text-[#2F5BFF]" : "text-[#16181D]/70"}`}>
          <input type="checkbox" checked={enComparar} onChange={() => alternarComparar(p.id)} className="size-3.5 accent-[#2F5BFF]" aria-label={`Comparar ${p.nombre}`} />
          <span className="hidden min-[400px]:inline sm:inline">Comparar</span>
        </label>
      </div>
      <div className="flex flex-1 flex-col px-1 pt-3">
        <p className={`${mono} text-[11px] tracking-[0.1em] text-[#16181D]/62 uppercase`}>
          {p.marca} · {p.categoria}
        </p>
        <h3 className="mt-1 text-[15px] leading-snug font-semibold sm:text-base">
          <button type="button" onClick={() => tienda.verDetalle(p.id)} className={`text-left after:absolute after:inset-0 after:rounded-2xl hover:text-[#2F5BFF] ${foco}`}>
            {p.nombre}
          </button>
        </h3>
        <ul className="mt-2 hidden flex-wrap gap-1 sm:flex" aria-label="Características">
          {p.destacados.map((d) => (
            <li key={d} className={`${mono} rounded-md bg-[#F3F5F8] px-1.5 py-0.5 text-[11px] text-[#16181D]/70`}>
              {d}
            </li>
          ))}
        </ul>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-[#16181D]/62">
          <Estrellas valor={p.rating} className="size-3.5" colorLleno="#F5A524" colorVacio="#16181D" />
          <span className={mono}>{String(p.rating).replace(".", ",")}</span>
          <span>({p.opiniones})</span>
        </div>
        <div className="mt-auto pt-3">
          {p.precioAnterior ? <p className="text-xs text-[#16181D]/62 line-through tabular-nums">{pesos(p.precioAnterior)}</p> : null}
          <p className="text-lg font-bold tracking-[-0.02em] tabular-nums sm:text-xl">{pesos(p.precio)}</p>
          <p className="text-xs text-[#0D8259]">
            {config.cuotasSinInteres} × {pesos(cuota(p.precio, config.cuotasSinInteres))} sin interés
          </p>
          <div className="mt-1.5">
            <EnvioBadge p={p} />
          </div>
          <button
            type="button"
            disabled={!p.stock}
            onClick={() => {
              tienda.agregar(p.id, { nombre: p.nombre });
              setHecho(true);
              window.setTimeout(() => setHecho(false), 1500);
            }}
            className={`relative z-10 mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-xl text-sm font-semibold transition-colors disabled:bg-[#16181D]/6 disabled:text-[#16181D]/40 ${foco} ${hecho ? "bg-[#0D8259] text-white" : "bg-[#16181D] text-white hover:bg-[#2F5BFF]"}`}
          >
            {hecho ? (
              <>
                <IconoCheck className="size-4" trazo={2.4} /> Agregado
              </>
            ) : p.stock ? (
              "Agregar al carrito"
            ) : (
              "Sin stock"
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
