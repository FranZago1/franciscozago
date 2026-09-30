"use client";

import Image from "next/image";
import { useId, useMemo, useState } from "react";
import { ars, normalizar } from "../shared/formato";
import {
  AMBIENTES,
  COLECCIONES,
  COLORES,
  MATERIALES,
  PRODUCTOS,
  imagenProducto,
  type Ambiente,
  type Coleccion,
  type ColorFiltro,
  type Material,
  type Producto,
} from "./datos";
import { IcBuscar, IcFiltros, IcMas } from "./ui";

const serif = "[font-family:var(--font-nido-serif)]";

export type Filtros = {
  q: string;
  ambiente: Ambiente | null;
  materiales: Material[];
  color: ColorFiltro | null;
  coleccion: Coleccion | null;
  orden: "destacados" | "precio-asc" | "precio-desc";
};

export const FILTROS_VACIOS: Filtros = { q: "", ambiente: null, materiales: [], color: null, coleccion: null, orden: "destacados" };

function Chip({ activo, onClick, children }: { activo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4538] ${
        activo ? "border-[#221C17] bg-[#221C17] text-[#F4EFE7]" : "border-[#D3C8B8] text-[#3B322B] hover:border-[#221C17]"
      }`}
    >
      {children}
    </button>
  );
}

function Tarjeta({
  p,
  colorFiltro,
  onVer,
  onAgregar,
}: {
  p: Producto;
  colorFiltro: ColorFiltro | null;
  onVer: (id: string, v: string) => void;
  onAgregar: (id: string, v: string) => void;
}) {
  const inicial = (colorFiltro && p.variantes.find((v) => v.color === colorFiltro)?.id) || p.variantes[0]!.id;
  const [elegida, setElegida] = useState<string | null>(null);
  const v = elegida ?? inicial;
  const variante = p.variantes.find((x) => x.id === v)!;
  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden rounded-[14px] bg-[#EEE6DA]">
        <button
          type="button"
          onClick={() => onVer(p.id, v)}
          className="relative block aspect-[4/5] w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4538]"
          aria-label={`Ver ficha de ${p.nombre}, ${variante.nombre}`}
        >
          <Image
            src={imagenProducto(p.id, v)}
            alt={`${p.nombre} en ${variante.nombre}`}
            fill
            sizes="(min-width: 1280px) 300px, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
          />
        </button>
        {p.nuevo ? (
          <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-[#FBF8F3] px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.14em] text-[#2F4538] uppercase">
            Nuevo
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => onAgregar(p.id, v)}
          aria-label={`Agregar ${p.nombre} (${variante.nombre}) a la lista`}
          className="absolute right-3 bottom-3 grid size-10 place-items-center rounded-full bg-[#FBF8F3] text-[#221C17] shadow-[0_6px_16px_-6px_rgba(0,0,0,0.35)] transition hover:bg-[#2F4538] hover:text-[#F4EFE7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4538] sm:translate-y-2 sm:opacity-0 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
        >
          <IcMas />
        </button>
      </div>
      <div className="mt-3.5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] tracking-[0.14em] text-[#6E6258] uppercase">{p.tipo}</p>
          <h3 className={`${serif} mt-0.5 text-[22px] leading-tight sm:text-[25px]`}>
            <button
              type="button"
              onClick={() => onVer(p.id, v)}
              className="text-left hover:underline hover:decoration-1 hover:underline-offset-4 focus-visible:outline-none"
            >
              {p.nombre}
            </button>
          </h3>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <p className="text-[14px] text-[#3B322B] tabular-nums">{p.precio ? ars(p.precio) : "Consultar"}</p>
        <div className="flex gap-1.5" role="group" aria-label={`Terminaciones de ${p.nombre}`}>
          {p.variantes.map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setElegida(x.id)}
              aria-pressed={x.id === v}
              aria-label={x.nombre}
              title={x.nombre}
              className={`size-[18px] rounded-full border border-black/10 ring-offset-2 ring-offset-[#F4EFE7] transition focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#2F4538] ${x.id === v ? "ring-1 ring-[#221C17]" : ""}`}
              style={{ background: x.hex }}
            />
          ))}
        </div>
      </div>
    </article>
  );
}

export function Catalogo({
  filtros,
  setFiltros,
  onVer,
  onAgregar,
}: {
  filtros: Filtros;
  setFiltros: (f: Filtros | ((f: Filtros) => Filtros)) => void;
  onVer: (id: string, v: string) => void;
  onAgregar: (id: string, v: string) => void;
}) {
  const [panel, setPanel] = useState(false);
  const uid = useId();

  const resultados = useMemo(() => {
    const q = normalizar(filtros.q.trim());
    const r = PRODUCTOS.filter((p) => {
      if (filtros.ambiente && !p.ambientes.includes(filtros.ambiente)) return false;
      if (filtros.coleccion && p.coleccion !== filtros.coleccion) return false;
      if (filtros.materiales.length && !filtros.materiales.some((m) => p.materiales.includes(m))) return false;
      if (filtros.color && !p.variantes.some((v) => v.color === filtros.color)) return false;
      if (q) {
        const texto = normalizar([p.nombre, p.tipo, p.descripcion, ...p.variantes.map((v) => v.nombre)].join(" "));
        if (!q.split(/\s+/).every((t) => texto.includes(t))) return false;
      }
      return true;
    });
    if (filtros.orden === "precio-asc") r.sort((a, b) => (a.precio ?? 0) - (b.precio ?? 0));
    if (filtros.orden === "precio-desc") r.sort((a, b) => (b.precio ?? 0) - (a.precio ?? 0));
    return r;
  }, [filtros]);

  const activos =
    (filtros.ambiente ? 1 : 0) + filtros.materiales.length + (filtros.color ? 1 : 0) + (filtros.coleccion ? 1 : 0) + (filtros.q ? 1 : 0);

  const set = <K extends keyof Filtros>(k: K, v: Filtros[K]) => setFiltros((f) => ({ ...f, [k]: v }));

  const grupos = (
    <div className="flex flex-col gap-7">
      <fieldset>
        <legend className="text-[11px] font-semibold tracking-[0.16em] text-[#221C17] uppercase">Ambiente</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip activo={!filtros.ambiente} onClick={() => set("ambiente", null)}>
            Todos
          </Chip>
          {AMBIENTES.map((a) => (
            <Chip key={a.id} activo={filtros.ambiente === a.id} onClick={() => set("ambiente", filtros.ambiente === a.id ? null : a.id)}>
              {a.nombre}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-[11px] font-semibold tracking-[0.16em] text-[#221C17] uppercase">Material</legend>
        <div className="mt-3 flex flex-col gap-2">
          {MATERIALES.map((m) => {
            const on = filtros.materiales.includes(m.id);
            return (
              <label key={m.id} className="flex cursor-pointer items-center gap-3 text-[14px] text-[#3B322B]">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => set("materiales", on ? filtros.materiales.filter((x) => x !== m.id) : [...filtros.materiales, m.id])}
                  className="peer sr-only"
                />
                <span
                  className="grid size-[18px] place-items-center rounded-[5px] border border-[#BFB3A1] bg-[#FBF8F3] transition peer-checked:border-[#2F4538] peer-checked:bg-[#2F4538] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#2F4538]"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 12 12"
                    className={`size-3 text-white ${on ? "opacity-100" : "opacity-0"}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M2.5 6.2l2.3 2.3L9.5 3.5" />
                  </svg>
                </span>
                {m.nombre}
                <span className="ml-auto text-[12px] text-[#9A8E82] tabular-nums">
                  {PRODUCTOS.filter((p) => p.materiales.includes(m.id)).length}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-[11px] font-semibold tracking-[0.16em] text-[#221C17] uppercase">
          Color{" "}
          {filtros.color ? (
            <span className="font-normal tracking-normal text-[#6E6258] normal-case">
              — {COLORES.find((c) => c.id === filtros.color)?.nombre}
            </span>
          ) : null}
        </legend>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {COLORES.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={filtros.color === c.id}
              aria-label={c.nombre}
              title={c.nombre}
              onClick={() => set("color", filtros.color === c.id ? null : c.id)}
              className={`size-8 rounded-full border border-black/10 ring-offset-2 ring-offset-[#F4EFE7] transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2F4538] ${
                filtros.color === c.id ? "ring-[1.5px] ring-[#221C17]" : ""
              }`}
              style={{ background: c.hex }}
            />
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-[11px] font-semibold tracking-[0.16em] text-[#221C17] uppercase">Colección</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {COLECCIONES.map((c) => (
            <Chip key={c.id} activo={filtros.coleccion === c.id} onClick={() => set("coleccion", filtros.coleccion === c.id ? null : c.id)}>
              {c.nombre}
            </Chip>
          ))}
        </div>
      </fieldset>
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-12">
      <aside className="hidden lg:block" aria-label="Filtros">
        <div className="sticky top-24">{grupos}</div>
      </aside>

      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Buscar en el catálogo</span>
            <IcBuscar className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-[#6E6258]" />
            <input
              type="search"
              value={filtros.q}
              onChange={(e) => set("q", e.target.value)}
              placeholder="Buscá sofá, roble, lámpara…"
              className="h-12 w-full rounded-full border border-[#D3C8B8] bg-[#FBF8F3] pr-4 pl-11 text-[15px] placeholder:text-[#9A8E82] focus:border-[#2F4538] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4538]/25"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPanel((x) => !x)}
              aria-expanded={panel}
              aria-controls={`${uid}-filtros`}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-[#D3C8B8] px-5 text-[14px] font-medium focus-visible:outline-2 focus-visible:outline-[#2F4538] lg:hidden"
            >
              <IcFiltros /> Filtros{" "}
              {activos ? (
                <span className="grid size-5 place-items-center rounded-full bg-[#2F4538] text-[11px] text-white">{activos}</span>
              ) : null}
            </button>
            <label className="relative flex-1 sm:flex-none">
              <span className="sr-only">Ordenar</span>
              <select
                value={filtros.orden}
                onChange={(e) => set("orden", e.target.value as Filtros["orden"])}
                className="h-12 w-full appearance-none rounded-full border border-[#D3C8B8] bg-[#FBF8F3] pr-10 pl-5 text-[14px] focus:border-[#2F4538] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4538]/25"
              >
                <option value="destacados">Destacados</option>
                <option value="precio-asc">Menor precio</option>
                <option value="precio-desc">Mayor precio</option>
              </select>
              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M7 10l5 5 5-5" />
              </svg>
            </label>
          </div>
        </div>

        <div id={`${uid}-filtros`} hidden={!panel} className="mt-4 rounded-2xl border border-[#DCD2C3] bg-[#FBF8F3] p-5 lg:hidden">
          {grupos}
          <button
            type="button"
            onClick={() => setPanel(false)}
            className="mt-6 h-11 w-full rounded-full bg-[#221C17] text-[14px] font-semibold text-[#F4EFE7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4538]"
          >
            Ver {resultados.length} {resultados.length === 1 ? "pieza" : "piezas"}
          </button>
        </div>

        <div className="mt-5 flex min-h-8 flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[#6E6258]">
          <p aria-live="polite">
            {resultados.length} {resultados.length === 1 ? "pieza" : "piezas"}
            {filtros.coleccion ? ` de la colección ${COLECCIONES.find((c) => c.id === filtros.coleccion)?.nombre}` : ""}
          </p>
          {activos ? (
            <button
              type="button"
              onClick={() => setFiltros({ ...FILTROS_VACIOS, orden: filtros.orden })}
              className="font-semibold text-[#2F4538] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#2F4538]"
            >
              Limpiar filtros
            </button>
          ) : null}
        </div>

        {resultados.length ? (
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12">
            {resultados.map((p) => (
              <li key={p.id}>
                <Tarjeta key={`${p.id}-${filtros.color ?? ""}`} p={p} colorFiltro={filtros.color} onVer={onVer} onAgregar={onAgregar} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-[#CFC4B3] px-6 py-16 text-center">
            <p className={`${serif} text-[30px]`}>No encontramos piezas así.</p>
            <p className="mt-2 text-[14px] text-[#6E6258]">Probá con otra palabra o sacá algún filtro. También hacemos piezas a medida.</p>
            <button
              type="button"
              onClick={() => setFiltros(FILTROS_VACIOS)}
              className="mt-5 h-11 rounded-full bg-[#221C17] px-6 text-[14px] font-semibold text-[#F4EFE7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4538]"
            >
              Ver todo el catálogo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
