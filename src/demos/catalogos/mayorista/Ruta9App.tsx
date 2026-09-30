"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Dialogo } from "../shared/Dialogo";
import { ars, normalizar, numero } from "../shared/formato";
import { ModalConsulta, type TemaConsulta } from "../shared/ModalConsulta";
import { useAviso } from "../shared/useAviso";
import { claveItem, useLista } from "../shared/useLista";
import { ARTICULOS, EMPRESA, MARCAS, PEDIDO_MINIMO, RUBROS, codigo, imagen, precioBulto, type Articulo, type Rubro } from "./datos";
import { Pedido, textoPedido, totales } from "./Pedido";
import { Bultos, IcBuscar, IcCamion, IcCarro, IcEtiqueta, IcGrilla, IcLista, IcReloj, IcX } from "./ui";

const mono = "font-[family-name:var(--font-r9-mono)]";

type Orden = "rubro" | "codigo" | "nombre" | "precio";

const temaConsulta: TemaConsulta = {
  dialogo:
    "m-auto max-h-[calc(100dvh-16px)] w-[min(980px,calc(100%-16px))] max-w-none overflow-y-auto overscroll-contain rounded-xl bg-white text-[#0F1B2D] shadow-2xl backdrop:bg-[#0F1B2D]/60 font-[family-name:var(--font-r9-sans)]",
  panel: "p-5 sm:p-7",
  titulo: "text-[26px] leading-tight font-bold tracking-[-0.01em] sm:text-[30px]",
  bajada: "mt-1 max-w-md text-[14px] text-[#5B6778]",
  label: "text-[12px] font-semibold tracking-[0.06em] text-[#5B6778] uppercase",
  input:
    "h-10 rounded-md border border-[#C9D1DC] bg-white px-3 py-2 text-[15px] placeholder:text-[#9AA4B2] focus:border-[#1747A6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1747A6]/25",
  primario:
    "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#1747A6] px-5 text-[15px] font-semibold text-white transition hover:bg-[#0F3380] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1747A6]",
  secundario:
    "inline-flex h-11 items-center justify-center rounded-md border border-[#C9D1DC] px-5 text-[15px] font-medium hover:border-[#1747A6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1747A6]",
  aviso: "text-[13px] leading-relaxed text-[#5B6778]",
  cerrar: "grid size-9 shrink-0 place-items-center rounded-md hover:bg-[#EEF1F5] focus-visible:outline-2 focus-visible:outline-[#1747A6]",
  separador: "border-[#E3E8EF]",
};

/** Marca en el texto la parte que coincide con la búsqueda (sin distinguir tildes). */
function Resaltado({ texto, q }: { texto: string; q: string }) {
  const t = q.trim();
  if (!t) return <>{texto}</>;
  const i = normalizar(texto).indexOf(normalizar(t));
  if (i < 0) return <>{texto}</>;
  return (
    <>
      {texto.slice(0, i)}
      <mark className="rounded-[2px] bg-[#FFE58A] px-px text-inherit">{texto.slice(i, i + t.length)}</mark>
      {texto.slice(i + t.length)}
    </>
  );
}

function Stock({ s }: { s: Articulo["stock"] }) {
  const m = {
    ok: ["bg-[#1E8E4F]", "Disponible"],
    bajo: ["bg-[#E0A21B]", "Últimos bultos"],
    sin: ["bg-[#D62B2B]", "Sin stock"],
  }[s];
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] whitespace-nowrap text-[#5B6778]">
      <span className={`size-2 rounded-full ${m[0]}`} aria-hidden="true" />
      {m[1]}
    </span>
  );
}

function Precio({ a }: { a: Articulo }) {
  return (
    <span className="flex flex-col items-end leading-tight">
      {a.antes ? <span className={`${mono} text-[11.5px] text-[#8A94A3] line-through`}>{ars(a.antes)}</span> : null}
      <span className={`${mono} text-[14px] font-semibold tabular-nums ${a.antes ? "text-[#D62B2B]" : "text-[#0F1B2D]"}`}>
        {ars(a.precio)}
      </span>
    </span>
  );
}

function Variante({ a, valor, onChange }: { a: Articulo; valor: string; onChange: (v: string) => void }) {
  if (!a.variantes) return null;
  return (
    <label className="inline-flex items-center">
      <span className="sr-only">Variedad de {a.nombre}</span>
      <select
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 rounded border border-[#C9D1DC] bg-white pr-6 pl-2 text-[12.5px] text-[#0F1B2D] focus:border-[#1747A6] focus:outline-none"
      >
        {a.variantes.map((v) => (
          <option key={v}>{v}</option>
        ))}
      </select>
    </label>
  );
}

export function Ruta9App() {
  const pedido = useLista("ruta9-pedido-v1", { max: 999 });
  const [aviso, avisar] = useAviso(2400);
  const [q, setQ] = useState("");
  const [rubro, setRubro] = useState<Rubro | null>(null);
  const [marcas, setMarcas] = useState<string[]>([]);
  const [ofertas, setOfertas] = useState(false);
  const [ocultarSin, setOcultarSin] = useState(false);
  const [orden, setOrden] = useState<Orden>("rubro");
  const [vista, setVista] = useState<"lista" | "grilla">("lista");
  const [variantes, setVariantes] = useState<Record<string, string>>({});
  const [panel, setPanel] = useState(false);
  const [consulta, setConsulta] = useState(false);
  const buscador = useRef<HTMLInputElement>(null);
  const uid = useId();

  // Preferencia de vista por visitante.
  useEffect(() => {
    try {
      const v = window.localStorage.getItem("ruta9-vista");
      if (v === "grilla" || v === "lista") setVista(v);
    } catch {
      /* sin almacenamiento */
    }
  }, []);
  const cambiarVista = (v: "lista" | "grilla") => {
    setVista(v);
    try {
      window.localStorage.setItem("ruta9-vista", v);
    } catch {
      /* sin almacenamiento */
    }
  };

  // Atajo "/" para ir al buscador, como en las herramientas de escritorio.
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName) && !document.querySelector("dialog[open]")) {
        e.preventDefault();
        buscador.current?.focus();
      }
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, []);

  const base = useMemo(() => {
    const t = normalizar(q.trim());
    return ARTICULOS.filter((a) => {
      if (ofertas && !a.antes) return false;
      if (ocultarSin && a.stock === "sin") return false;
      if (marcas.length && !marcas.includes(a.marca)) return false;
      if (t) {
        const txt = normalizar(`${a.id} ${a.nombre} ${a.marca} ${a.presentacion} ${(a.variantes ?? []).join(" ")}`);
        if (!t.split(/\s+/).every((p) => txt.includes(p))) return false;
      }
      return true;
    });
  }, [q, ofertas, ocultarSin, marcas]);

  const conteo = useMemo(() => {
    const c: Record<string, number> = {};
    for (const a of base) c[a.rubro] = (c[a.rubro] ?? 0) + 1;
    return c;
  }, [base]);

  const resultados = useMemo(() => {
    const r = base.filter((a) => !rubro || a.rubro === rubro);
    const o = [...r];
    if (orden === "codigo") o.sort((a, b) => a.id.localeCompare(b.id));
    if (orden === "nombre") o.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    if (orden === "precio") o.sort((a, b) => a.precio - b.precio);
    return o;
  }, [base, rubro, orden]);

  const cantidadDe = (a: Articulo) => {
    const v = a.variantes ? (variantes[a.id] ?? a.variantes[0]) : undefined;
    const key = claveItem(a.id, v);
    return { key, v, n: pedido.items.find((i) => i.key === key)?.cantidad ?? 0 };
  };

  const fijar = (a: Articulo, n: number) => {
    const { key, v, n: antes } = cantidadDe(a);
    pedido.fijarCantidad(key, n, { id: a.id, variante: v });
    if (antes === 0 && n > 0) avisar(`${a.nombre} ${a.marca}: ${n} ${n === 1 ? "bulto" : "bultos"} al pedido`);
    if (n === 0 && antes > 0) avisar(`${a.nombre} ${a.marca} salió del pedido`);
  };

  const { total, bultos } = totales(pedido.items);
  const construir = useCallback((d: Record<string, string>) => textoPedido(pedido.items, d), [pedido.items]);
  const filtrosActivos = marcas.length + (ofertas ? 1 : 0) + (ocultarSin ? 1 : 0);
  const tituloRubro = rubro ? RUBROS.find((r) => r.id === rubro)!.nombre : "Todos los artículos";

  const lateral = (
    <div className="space-y-6">
      <nav aria-label="Rubros">
        <p className="px-3 text-[11px] font-semibold tracking-[0.1em] text-[#5B6778] uppercase">Rubros</p>
        <ul className="mt-2 space-y-0.5">
          {[{ id: null, nombre: "Todos" } as { id: Rubro | null; nombre: string }, ...RUBROS].map((r) => {
            const on = rubro === r.id;
            const n = r.id ? (conteo[r.id] ?? 0) : base.length;
            return (
              <li key={r.nombre}>
                <button
                  type="button"
                  onClick={() => setRubro(r.id)}
                  aria-current={on ? "true" : undefined}
                  className={`relative flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[14.5px] transition-colors focus-visible:outline-2 focus-visible:outline-[#1747A6] ${
                    on ? "bg-white font-semibold text-[#1747A6] shadow-[0_1px_2px_rgba(15,27,45,0.08)]" : "text-[#27344A] hover:bg-white/70"
                  }`}
                >
                  {on ? <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-[#D62B2B]" aria-hidden="true" /> : null}
                  {r.nombre}
                  <span className={`${mono} text-[12px] ${on ? "text-[#1747A6]" : "text-[#8A94A3]"}`}>{n}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <fieldset className="px-3">
        <legend className="text-[11px] font-semibold tracking-[0.1em] text-[#5B6778] uppercase">Filtros</legend>
        <div className="mt-2 space-y-2 text-[14px] text-[#27344A]">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input type="checkbox" checked={ofertas} onChange={(e) => setOfertas(e.target.checked)} className="size-4 accent-[#1747A6]" />
            Solo ofertas
          </label>
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={ocultarSin}
              onChange={(e) => setOcultarSin(e.target.checked)}
              className="size-4 accent-[#1747A6]"
            />
            Ocultar sin stock
          </label>
        </div>
      </fieldset>
      <fieldset className="px-3">
        <legend className="text-[11px] font-semibold tracking-[0.1em] text-[#5B6778] uppercase">Marcas</legend>
        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[13.5px] text-[#27344A] lg:grid-cols-1">
          {MARCAS.map((m) => (
            <label key={m} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={marcas.includes(m)}
                onChange={(e) => setMarcas((x) => (e.target.checked ? [...x, m] : x.filter((y) => y !== m)))}
                className="size-4 accent-[#1747A6]"
              />
              {m}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );

  return (
    <>
      <div className="bg-[#0F1B2D] text-[12px] text-[#C3CCD9]">
        <div className="mx-auto flex max-w-[1600px] items-center gap-5 overflow-x-auto px-4 py-1.5 whitespace-nowrap [scrollbar-width:none] sm:px-6">
          <span className="inline-flex items-center gap-1.5">
            <IcReloj className="size-3.5" /> {EMPRESA.atencion}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IcCamion className="size-3.5" /> {EMPRESA.entregas}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IcEtiqueta className="size-3.5" /> Pedido mínimo {ars(PEDIDO_MINIMO)} · precios sin IVA
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-30 bg-[#1747A6] text-white shadow-[0_2px_0_#0F3380]">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-4 gap-y-2.5 px-4 py-2.5 sm:px-6 lg:flex-nowrap">
          <a
            href="#catalogo"
            className="flex shrink-0 items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span className="grid h-9 w-11 place-items-center rounded-[5px] bg-[#D62B2B] text-[22px] leading-none font-bold tracking-[-0.04em] shadow-[inset_0_-3px_0_rgba(0,0,0,0.18)]">
              R9
            </span>
            <span className="leading-none">
              <span className="block text-[19px] font-bold tracking-[-0.01em]">RUTA 9</span>
              <span className="block text-[10.5px] tracking-[0.18em] text-white/75 uppercase">Distribuidora</span>
            </span>
          </a>
          <button
            type="button"
            onClick={() => setPanel(true)}
            className="ml-auto inline-flex h-10 items-center gap-2 rounded-md bg-white px-3 text-[14px] font-semibold text-[#1747A6] shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:order-3 xl:hidden"
          >
            <IcCarro className="size-5" />
            <span className={`${mono} tabular-nums`}>{ars(total)}</span>
            <span className="grid h-6 min-w-6 place-items-center rounded bg-[#D62B2B] px-1.5 text-[12px] text-white">{bultos}</span>
          </button>
          <label className="relative order-last w-full lg:order-2 lg:mx-auto lg:max-w-[640px] lg:flex-1">
            <span className="sr-only">Buscar por código, descripción o marca</span>
            <IcBuscar className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-[#5B6778]" />
            <input
              ref={buscador}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscá por código, producto o marca"
              className="h-11 w-full rounded-md border-0 bg-white pr-12 pl-10 text-[15.5px] text-[#0F1B2D] placeholder:text-[#8A94A3] focus:outline-none focus-visible:ring-3 focus-visible:ring-[#F2B705]"
            />
            {q ? (
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  buscador.current?.focus();
                }}
                aria-label="Borrar búsqueda"
                className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded text-[#5B6778] hover:bg-[#EEF1F5]"
              >
                <IcX />
              </button>
            ) : (
              <kbd
                className={`${mono} pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded border border-[#C9D1DC] px-1.5 text-[12px] text-[#5B6778] sm:block`}
              >
                /
              </kbd>
            )}
          </label>
          <p className="hidden shrink-0 text-right text-[12px] leading-tight text-white/80 xl:order-3 xl:block">
            Cliente
            <span className="block text-[14px] font-semibold text-white">Comercio de prueba</span>
          </p>
        </div>
        {pedido.items.length ? (
          <div className="border-t border-white/15 bg-[#0F3380] xl:hidden">
            <button
              type="button"
              onClick={() => setPanel(true)}
              className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-3 px-4 py-2 text-left text-[13px] focus-visible:outline-2 focus-visible:outline-white sm:px-6"
            >
              <span>
                {pedido.items.length} {pedido.items.length === 1 ? "artículo" : "artículos"} · {numero(bultos)} bultos ·{" "}
                <strong className={mono}>{ars(total)}</strong>
              </span>
              <span className="font-semibold underline underline-offset-2">Ver pedido</span>
            </button>
          </div>
        ) : null}
      </header>

      <div
        id="catalogo"
        className="mx-auto grid max-w-[1600px] gap-6 px-4 pt-5 sm:px-6 lg:grid-cols-[210px_minmax(0,1fr)] xl:grid-cols-[210px_minmax(0,1fr)_340px]"
      >
        <aside className="hidden lg:block">
          <div className="sticky top-[84px] max-h-[calc(100dvh-100px)] overflow-y-auto pb-6">{lateral}</div>
        </aside>

        <main className="min-w-0">
          <div className="relative overflow-hidden rounded-lg bg-[#D62B2B] px-4 py-3 text-white sm:px-5">
            <svg viewBox="0 0 200 60" className="absolute top-0 -right-6 h-full opacity-20" aria-hidden="true">
              <path d="M40 0h40L40 60H0zM110 0h40l-40 60H70zM180 0h40l-40 60h-40z" fill="#fff" />
            </svg>
            <p className="relative text-[11px] font-semibold tracking-[0.14em] text-white/80 uppercase">Ofertas de la semana</p>
            <p className="relative text-[16px] font-bold sm:text-[18px]">
              Yerba, aceite, lavandina y cerveza rubia con precio especial por bulto.
            </p>
            <button
              type="button"
              onClick={() => {
                setOfertas(true);
                setRubro(null);
              }}
              className="relative mt-2 inline-flex h-8 items-center rounded bg-white px-3 text-[13px] font-semibold text-[#D62B2B] hover:bg-[#FFF1F1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Ver ofertas
            </button>
          </div>

          <div
            className="mt-4 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:hidden"
            role="group"
            aria-label="Rubros"
          >
            {[{ id: null, nombre: "Todos" } as { id: Rubro | null; nombre: string }, ...RUBROS].map((r) => (
              <button
                key={r.nombre}
                type="button"
                aria-pressed={rubro === r.id}
                onClick={() => setRubro(r.id)}
                className={`h-9 shrink-0 rounded-full border px-3.5 text-[13.5px] font-medium ${
                  rubro === r.id ? "border-[#1747A6] bg-[#1747A6] text-white" : "border-[#C9D1DC] bg-white text-[#27344A]"
                }`}
              >
                {r.nombre} <span className={`${mono} text-[11.5px] opacity-70`}>{r.id ? (conteo[r.id] ?? 0) : base.length}</span>
              </button>
            ))}
          </div>

          <details className="mt-3 rounded-lg border border-[#D8DEE7] bg-white lg:hidden">
            <summary className="flex cursor-pointer items-center justify-between px-4 py-2.5 text-[14px] font-semibold">
              Filtros y marcas{" "}
              {filtrosActivos ? <span className="rounded bg-[#1747A6] px-1.5 text-[12px] text-white">{filtrosActivos}</span> : null}
            </summary>
            <div className="border-t border-[#E3E8EF] py-4">{lateral}</div>
          </details>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-[22px] leading-tight font-bold tracking-[-0.01em] sm:text-[26px]">{tituloRubro}</h1>
              <p className="text-[13px] text-[#5B6778]" aria-live="polite">
                {resultados.length} {resultados.length === 1 ? "artículo" : "artículos"}
                {q.trim() ? ` para “${q.trim()}”` : ""} · {EMPRESA.actualizada}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-2 text-[13px] text-[#5B6778]">
                <span className="hidden sm:inline">Ordenar</span>
                <span className="sr-only sm:hidden">Ordenar</span>
                <select
                  value={orden}
                  onChange={(e) => setOrden(e.target.value as Orden)}
                  className="h-9 rounded-md border border-[#C9D1DC] bg-white px-2 text-[13.5px] text-[#0F1B2D] focus:border-[#1747A6] focus:outline-none"
                >
                  <option value="rubro">Por rubro</option>
                  <option value="codigo">Código</option>
                  <option value="nombre">Descripción A-Z</option>
                  <option value="precio">Menor precio</option>
                </select>
              </label>
              <div className="inline-flex rounded-md border border-[#C9D1DC] bg-white p-0.5" role="group" aria-label="Vista">
                {(
                  [
                    ["lista", "Lista", IcLista],
                    ["grilla", "Grilla", IcGrilla],
                  ] as const
                ).map(([k, l, Ic]) => (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={vista === k}
                    onClick={() => cambiarVista(k)}
                    className={`inline-flex h-8 items-center gap-1.5 rounded px-2.5 text-[13px] font-medium focus-visible:outline-2 focus-visible:outline-[#1747A6] ${
                      vista === k ? "bg-[#1747A6] text-white" : "text-[#27344A] hover:bg-[#EEF1F5]"
                    }`}
                  >
                    <Ic className="size-4" />
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {resultados.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed border-[#C9D1DC] bg-white px-6 py-14 text-center">
              <p className="text-[17px] font-semibold">No hay artículos con esa búsqueda.</p>
              <p className="mt-1 text-[14px] text-[#5B6778]">Probá con el código (por ejemplo, AL-1020) o con menos palabras.</p>
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setRubro(null);
                  setMarcas([]);
                  setOfertas(false);
                  setOcultarSin(false);
                }}
                className="mt-4 h-10 rounded-md bg-[#1747A6] px-4 text-[14px] font-semibold text-white"
              >
                Ver todos los artículos
              </button>
            </div>
          ) : vista === "lista" ? (
            <div className="mt-3 overflow-hidden rounded-lg border border-[#D8DEE7] bg-white">
              <div
                className="hidden grid-cols-[44px_78px_minmax(0,1fr)_84px_96px_118px] items-center gap-2.5 border-b border-[#D8DEE7] bg-[#F5F7FA] px-3 py-2 text-[11px] font-semibold tracking-[0.06em] text-[#5B6778] uppercase md:grid"
                aria-hidden="true"
              >
                <span />
                <span>Código</span>
                <span>Descripción</span>
                <span className="text-right">P. unidad</span>
                <span className="text-right">P. bulto</span>
                <span className="text-right">Bultos</span>
              </div>
              <ul className="divide-y divide-[#E3E8EF]">
                {resultados.map((a) => {
                  const { n, v } = cantidadDe(a);
                  return (
                    <li
                      key={a.id}
                      className={`grid grid-cols-[52px_minmax(0,1fr)] gap-x-3 gap-y-2 px-3 md:gap-x-2.5 py-2.5 transition-colors md:grid-cols-[44px_78px_minmax(0,1fr)_84px_96px_118px] md:items-center ${
                        n ? "bg-[#F0F5FF]" : "hover:bg-[#FAFBFC]"
                      } ${a.stock === "sin" ? "opacity-60" : ""}`}
                    >
                      <div className="relative row-span-2 size-[52px] overflow-hidden rounded-md bg-[#F3F5F8] md:row-span-1 md:size-11">
                        <Image
                          src={imagen(a.id)}
                          alt={`${a.nombre} ${a.marca} ${a.presentacion}`}
                          fill
                          sizes="52px"
                          className="object-cover"
                        />
                      </div>
                      <span className={`${mono} hidden text-[13px] text-[#27344A] md:block`}>
                        <Resaltado texto={codigo(a.id)} q={q} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[14.5px] leading-snug font-semibold text-[#0F1B2D]">
                          <Resaltado texto={a.nombre} q={q} />{" "}
                          <span className="font-normal text-[#27344A]">
                            <Resaltado texto={a.marca} q={q} />
                          </span>
                          {a.antes ? (
                            <span className="ml-1.5 rounded bg-[#FDECEC] px-1.5 py-0.5 align-[1px] text-[10.5px] font-bold tracking-[0.04em] text-[#D62B2B] uppercase">
                              Oferta
                            </span>
                          ) : null}
                          {a.nuevo ? (
                            <span className="ml-1.5 rounded bg-[#E8EEFA] px-1.5 py-0.5 align-[1px] text-[10.5px] font-bold tracking-[0.04em] text-[#1747A6] uppercase">
                              Nuevo
                            </span>
                          ) : null}
                        </p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-[#5B6778]">
                          <span className={`${mono} md:hidden`}>{codigo(a.id)}</span>
                          <span>{a.presentacion}</span>
                          <span>· Bulto × {a.bulto} u.</span>
                          {a.stock !== "ok" ? <Stock s={a.stock} /> : null}
                          {a.variantes ? <Variante a={a} valor={v!} onChange={(x) => setVariantes((s) => ({ ...s, [a.id]: x }))} /> : null}
                        </p>
                      </div>
                      <span className="hidden md:block">
                        <Precio a={a} />
                      </span>
                      <span className={`${mono} hidden text-right text-[14px] tabular-nums md:block`}>{ars(precioBulto(a))}</span>
                      <div className="col-start-2 flex items-center justify-between gap-3 md:col-start-auto md:justify-end">
                        <span className="flex flex-col text-[12.5px] leading-tight text-[#5B6778] md:hidden">
                          <span>
                            <span className={`${mono} text-[14px] font-semibold ${a.antes ? "text-[#D62B2B]" : "text-[#0F1B2D]"}`}>
                              {ars(a.precio)}
                            </span>{" "}
                            por unidad
                          </span>
                          <span>
                            <span className={mono}>{ars(precioBulto(a))}</span> por bulto
                          </span>
                        </span>
                        <Bultos
                          valor={n}
                          onChange={(x) => fijar(a, x)}
                          nombre={`${a.nombre} ${a.marca}`}
                          deshabilitado={a.stock === "sin"}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-4">
              {resultados.map((a) => {
                const { n, v } = cantidadDe(a);
                return (
                  <li
                    key={a.id}
                    className={`flex flex-col rounded-lg border bg-white p-3 transition-shadow hover:shadow-[0_4px_14px_-6px_rgba(15,27,45,0.2)] ${n ? "border-[#1747A6] ring-1 ring-[#1747A6]" : "border-[#D8DEE7]"} ${a.stock === "sin" ? "opacity-60" : ""}`}
                  >
                    <div className="relative aspect-square overflow-hidden rounded-md bg-[#F3F5F8]">
                      <Image
                        src={imagen(a.id)}
                        alt={`${a.nombre} ${a.marca} ${a.presentacion}`}
                        fill
                        sizes="(min-width: 1536px) 260px, (min-width: 640px) 30vw, 45vw"
                        className="object-cover"
                      />
                      {a.antes ? (
                        <span className="absolute top-2 left-2 rounded bg-[#D62B2B] px-1.5 py-0.5 text-[10.5px] font-bold tracking-[0.04em] text-white uppercase">
                          Oferta
                        </span>
                      ) : null}
                    </div>
                    <p className={`${mono} mt-2.5 text-[12px] text-[#5B6778]`}>
                      <Resaltado texto={codigo(a.id)} q={q} />
                    </p>
                    <p className="text-[14px] leading-snug font-semibold">
                      <Resaltado texto={a.nombre} q={q} />{" "}
                      <span className="font-normal">
                        <Resaltado texto={a.marca} q={q} />
                      </span>
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-[#5B6778]">
                      {a.presentacion} · Bulto × {a.bulto}
                    </p>
                    {a.variantes ? (
                      <div className="mt-1.5">
                        <Variante a={a} valor={v!} onChange={(x) => setVariantes((s) => ({ ...s, [a.id]: x }))} />
                      </div>
                    ) : null}
                    <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                      <div className="leading-tight">
                        {a.antes ? <span className={`${mono} block text-[11.5px] text-[#8A94A3] line-through`}>{ars(a.antes)}</span> : null}
                        <span className={`${mono} text-[15px] font-semibold ${a.antes ? "text-[#D62B2B]" : ""}`}>{ars(a.precio)}</span>
                        <span className="text-[11.5px] text-[#5B6778]"> u.</span>
                        <span className={`${mono} block text-[12px] text-[#5B6778]`}>{ars(precioBulto(a))} bulto</span>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between">
                      <Stock s={a.stock} />
                      <Bultos
                        valor={n}
                        onChange={(x) => fijar(a, x)}
                        nombre={`${a.nombre} ${a.marca}`}
                        deshabilitado={a.stock === "sin"}
                        tam="sm"
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </main>

        <aside className="hidden xl:block" aria-labelledby={`${uid}-pedido`}>
          <div className="sticky top-[84px] h-[calc(100dvh-200px)] min-h-[520px] overflow-hidden rounded-lg border border-[#D8DEE7] bg-white">
            <h2
              id={`${uid}-pedido`}
              className="flex items-center gap-2 border-b border-[#D8DEE7] bg-[#0F1B2D] px-4 py-2.5 text-[15px] font-bold text-white"
            >
              <IcCarro className="size-4.5" /> Tu pedido
            </h2>
            <div className="h-[calc(100%-44px)]">
              <Pedido pedido={pedido} onEnviar={() => setConsulta(true)} avisar={avisar} />
            </div>
          </div>
        </aside>
      </div>

      <Dialogo
        abierto={panel}
        onCerrar={() => setPanel(false)}
        labelledBy={`${uid}-pedido-movil`}
        className="mt-0 mr-0 mb-0 ml-auto h-dvh max-h-dvh w-full max-w-[420px] bg-white text-[#0F1B2D] shadow-2xl backdrop:bg-[#0F1B2D]/55 font-[family-name:var(--font-r9-sans)]"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between bg-[#0F1B2D] px-4 py-3 text-white">
            <h2 id={`${uid}-pedido-movil`} className="flex items-center gap-2 text-[16px] font-bold">
              <IcCarro className="size-5" /> Tu pedido
            </h2>
            <button
              type="button"
              onClick={() => setPanel(false)}
              aria-label="Cerrar pedido"
              className="grid size-9 place-items-center rounded-md hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
            >
              <IcX className="size-5" />
            </button>
          </div>
          <div className="min-h-0 flex-1">
            <Pedido pedido={pedido} onEnviar={() => setConsulta(true)} avisar={avisar} />
          </div>
        </div>
      </Dialogo>

      <ModalConsulta
        abierto={consulta}
        onCerrar={() => setConsulta(false)}
        titulo="Así llega tu pedido"
        bajada="Completá los datos del comercio. El mensaje se arma solo con códigos, bultos y totales."
        negocio="Ruta 9 · Ventas mayoristas"
        iniciales="R9"
        campos={[
          { id: "comercio", label: "Comercio", placeholder: "Ej.: Almacén Los Pinos", autoComplete: "organization" },
          { id: "contacto", label: "Tu nombre", placeholder: "Ej.: Marta Quiroga", autoComplete: "name" },
          { id: "localidad", label: "Localidad", placeholder: "Ej.: Villa Allende", autoComplete: "address-level2" },
          { id: "entrega", label: "Día de entrega preferido", placeholder: "Ej.: viernes a la mañana" },
          { id: "observaciones", label: "Observaciones", placeholder: "Ej.: facturar a nombre de…", multilinea: true },
        ]}
        construir={construir}
        tema={temaConsulta}
      />

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-36 z-40 flex justify-center px-4 sm:bottom-32">
        {aviso ? <p className="rounded-md bg-[#0F1B2D] px-4 py-2.5 text-[13.5px] font-medium text-white shadow-lg">{aviso}</p> : null}
      </div>
    </>
  );
}
