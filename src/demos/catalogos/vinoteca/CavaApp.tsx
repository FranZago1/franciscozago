"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { Dialogo } from "../shared/Dialogo";
import { ars, normalizar } from "../shared/formato";
import { ModalConsulta, type TemaConsulta } from "../shared/ModalConsulta";
import { useAviso } from "../shared/useAviso";
import { useLista, type ItemLista } from "../shared/useLista";
import {
  CEPAS,
  DESCUENTO_CAJA,
  MARIDAJES,
  PRECIO_MAX,
  PRECIO_MIN,
  TIPOS,
  VINOS,
  VINO_POR_ID,
  imagenVino,
  regionNombre,
  type Maridaje,
  type Region,
  type Tipo,
  type Vino,
} from "./datos";
import { EdadGate } from "./EdadGate";
import { FichaVino } from "./FichaVino";
import { IconoMaridaje, Mapa } from "./graficos";
import { Cantidad, IcBuscar, IcCaja, IcChat, IcChispa, IcCopa, IcFiltro, IcFlecha, IcMas, IcX } from "./ui";

const serif = "[font-family:var(--font-cava-serif)]";
const TAM_CAJA = 6;
const CLAVE_CAJA = "cava-aldea-caja-v1";

type Filtros = { q: string; tipos: Tipo[]; cepas: string[]; regiones: Region[]; maridajes: Maridaje[]; min: number; max: number };
const VACIOS: Filtros = { q: "", tipos: [], cepas: [], regiones: [], maridajes: [], min: PRECIO_MIN, max: PRECIO_MAX };

const temaConsulta: TemaConsulta = {
  dialogo:
    "m-auto max-h-[calc(100dvh-16px)] w-[min(980px,calc(100%-16px))] max-w-none overflow-y-auto overscroll-contain border border-[#3A2C2C] bg-[#120C0D] text-[#EFE6D6] shadow-2xl backdrop:bg-black/75 [font-family:var(--font-cava-sans)]",
  panel: "p-5 sm:p-9",
  titulo: `${serif} text-[32px] leading-none sm:text-[42px]`,
  bajada: "mt-2 max-w-md text-[14px] text-[#A8998A]",
  label: "text-[10.5px] tracking-[0.28em] text-[#C9A55A] uppercase",
  input:
    "h-11 border border-[#3A2C2C] bg-[#0E0B0B] px-4 py-2.5 text-[15px] text-[#EFE6D6] placeholder:text-[#7E7064] focus:border-[#C9A55A] focus:outline-none",
  primario:
    "inline-flex h-12 items-center justify-center gap-2 bg-[#C9A55A] px-6 text-[13px] font-medium tracking-[0.14em] text-[#130D0E] uppercase transition hover:bg-[#E3C88A] focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#C9A55A]",
  secundario:
    "inline-flex h-12 items-center justify-center border border-[#4A3A36] px-6 text-[13px] tracking-[0.14em] uppercase transition hover:border-[#C9A55A] focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#C9A55A]",
  aviso: "text-[13px] leading-relaxed text-[#A8998A]",
  cerrar:
    "grid size-10 shrink-0 place-items-center text-[#A8998A] hover:text-[#E3C88A] focus-visible:outline-1 focus-visible:outline-[#C9A55A]",
  separador: "border-[#3A2C2C]",
};

function totalCaja(ids: string[]) {
  let bruto = 0;
  let consultar = 0;
  for (const id of ids) {
    const p = VINO_POR_ID.get(id)?.precio;
    if (p) bruto += p;
    else consultar++;
  }
  const descuento = ids.length === TAM_CAJA ? Math.round(bruto * DESCUENTO_CAJA) : 0;
  return { bruto, descuento, total: bruto - descuento, consultar };
}

function resumenCaja(ids: string[]) {
  const c = new Map<string, number>();
  for (const id of ids) c.set(id, (c.get(id) ?? 0) + 1);
  return [...c.entries()];
}

function nombreCompleto(v: Vino) {
  return `${v.nombre} ${v.cepa} ${v.anio}`;
}

function mensajeCava(items: ItemLista[], d: Record<string, string>) {
  const lineas: string[] = [];
  let total = 0;
  let consultar = false;
  for (const it of items) {
    if (it.id === "caja" && it.contenido) {
      const t = totalCaja(it.contenido);
      total += t.total * it.cantidad;
      if (t.consultar) consultar = true;
      lineas.push(`• *Caja de 6 armada*${it.cantidad > 1 ? ` × ${it.cantidad}` : ""} — ${ars(t.total * it.cantidad)} (10 % off)`);
      for (const [id, n] of resumenCaja(it.contenido)) {
        const v = VINO_POR_ID.get(id);
        if (v) lineas.push(`   ${n} × ${nombreCompleto(v)}`);
      }
    } else {
      const v = VINO_POR_ID.get(it.id);
      if (!v) continue;
      if (v.precio) total += v.precio * it.cantidad;
      else consultar = true;
      lineas.push(
        `• *${v.nombre}* — ${v.cepa} ${v.anio} (${v.bodega}) — ${it.cantidad} ${it.cantidad === 1 ? "botella" : "botellas"} — ${v.precio ? ars(v.precio * it.cantidad) : "a consultar"}`,
      );
    }
    if (it.nota?.trim()) lineas.push(`   Nota: ${it.nota.trim()}`);
  }
  return [
    "¡Hola, Cava Aldea! Quiero consultar por esta selección:",
    "",
    ...lineas,
    "",
    `Total estimado: ${ars(total)}${consultar ? " + vinos a consultar" : ""}`,
    `Nombre: ${d.nombre?.trim() || "[tu nombre]"}`,
    `Entrega: ${d.entrega?.trim() || "[retiro en la cava o dirección de envío]"}`,
    ...(d.comentario?.trim() ? [`Comentario: ${d.comentario.trim()}`] : []),
    "Confirmo que soy mayor de 18 años.",
    "",
    "¿Me confirman stock y forma de pago? ¡Gracias!",
  ]
    .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
    .join("\n");
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`inline-flex items-center gap-2 border px-3 py-1.5 text-[13px] transition-colors focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#C9A55A] ${
        on
          ? "border-[#C9A55A] bg-[#C9A55A] text-[#130D0E]"
          : "border-[#3A2C2C] text-[#CFC3B3] hover:border-[#C9A55A]/70 hover:text-[#EFE6D6]"
      }`}
    >
      {children}
    </button>
  );
}

const alternar = <T,>(arr: T[], x: T) => (arr.includes(x) ? arr.filter((y) => y !== x) : [...arr, x]);

function PanelFiltros({ f, set }: { f: Filtros; set: (fn: (f: Filtros) => Filtros) => void }) {
  const leg = "text-[10.5px] tracking-[0.3em] text-[#C9A55A] uppercase";
  const paso = 1000;
  return (
    <div className="space-y-8">
      <fieldset>
        <legend className={leg}>Tipo</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {TIPOS.map((t) => (
            <Chip key={t.id} on={f.tipos.includes(t.id)} onClick={() => set((x) => ({ ...x, tipos: alternar(x.tipos, t.id) }))}>
              {t.nombre}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className={leg}>Cepa</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {CEPAS.map((c) => (
            <Chip key={c} on={f.cepas.includes(c)} onClick={() => set((x) => ({ ...x, cepas: alternar(x.cepas, c) }))}>
              {c}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className={leg}>Región</legend>
        <div className="mt-2 -mx-2">
          <Mapa activas={f.regiones} onToggle={(r) => set((x) => ({ ...x, regiones: alternar(x.regiones, r) }))} />
        </div>
        {f.regiones.length ? (
          <p className="mt-1 text-[12.5px] text-[#A8998A]">
            {f.regiones.map((r) => regionNombre(r)).join(" · ")}{" "}
            <button
              type="button"
              onClick={() => set((x) => ({ ...x, regiones: [] }))}
              className="ml-1 text-[#E3C88A] underline underline-offset-4"
            >
              quitar
            </button>
          </p>
        ) : (
          <p className="mt-1 text-[12.5px] text-[#7E7064]">Tocá un punto del mapa para filtrar por región.</p>
        )}
      </fieldset>
      <fieldset>
        <legend className={leg}>Precio por botella</legend>
        <div className="mt-4 flex justify-between text-[13px] text-[#E6DCCC] tabular-nums">
          <span>{ars(f.min)}</span>
          <span>{f.max >= PRECIO_MAX ? `${ars(PRECIO_MAX)} o más` : ars(f.max)}</span>
        </div>
        <div className="cava-rango relative mt-2 h-6">
          <div className="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-[#3A2C2C]" />
          <div
            className="absolute top-1/2 h-[2px] -translate-y-1/2 bg-[#C9A55A]"
            style={{
              left: `${((f.min - PRECIO_MIN) / (PRECIO_MAX - PRECIO_MIN)) * 100}%`,
              right: `${100 - ((f.max - PRECIO_MIN) / (PRECIO_MAX - PRECIO_MIN)) * 100}%`,
            }}
          />
          <input
            type="range"
            min={PRECIO_MIN}
            max={PRECIO_MAX}
            step={paso}
            value={f.min}
            aria-label="Precio mínimo"
            aria-valuetext={ars(f.min)}
            onChange={(e) => set((x) => ({ ...x, min: Math.min(Number(e.target.value), x.max - paso) }))}
          />
          <input
            type="range"
            min={PRECIO_MIN}
            max={PRECIO_MAX}
            step={paso}
            value={f.max}
            aria-label="Precio máximo"
            aria-valuetext={ars(f.max)}
            onChange={(e) => set((x) => ({ ...x, max: Math.max(Number(e.target.value), x.min + paso) }))}
          />
        </div>
      </fieldset>
      <fieldset>
        <legend className={leg}>Maridaje</legend>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {MARIDAJES.map((m) => {
            const on = f.maridajes.includes(m.id);
            return (
              <button
                key={m.id}
                type="button"
                aria-pressed={on}
                onClick={() => set((x) => ({ ...x, maridajes: alternar(x.maridajes, m.id) }))}
                className={`flex items-center gap-2.5 border px-3 py-2.5 text-left text-[13px] transition-colors focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#C9A55A] ${
                  on ? "border-[#C9A55A] bg-[#C9A55A]/12 text-[#E3C88A]" : "border-[#3A2C2C] text-[#CFC3B3] hover:border-[#C9A55A]/60"
                }`}
              >
                <IconoMaridaje id={m.id} className={`size-5 shrink-0 ${on ? "text-[#E3C88A]" : "text-[#A8998A]"}`} />
                {m.nombre}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}

function Tarjeta({
  v,
  onVer,
  onAgregar,
  onCaja,
  cajaLlena,
}: {
  v: Vino;
  onVer: () => void;
  onAgregar: () => void;
  onCaja: () => void;
  cajaLlena: boolean;
}) {
  return (
    <article className="group relative flex h-full flex-col border border-[#2A1F20] bg-[#140E0F] transition-colors duration-300 hover:border-[#C9A55A]/45">
      <button
        type="button"
        onClick={onVer}
        aria-label={`Ver ficha de ${v.nombre} ${v.cepa} ${v.anio}`}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-[radial-gradient(ellipse_at_50%_100%,#3A0F1A_0%,#1A1011_52%,#140E0F_100%)] focus-visible:outline-1 focus-visible:-outline-offset-4 focus-visible:outline-[#C9A55A]"
      >
        <div className="absolute inset-x-[16%] top-[6%] bottom-[4%] transition-transform duration-500 ease-out group-hover:-translate-y-2 motion-reduce:transition-none">
          <Image
            src={imagenVino(v.id)}
            alt={`Botella de ${v.nombre}, ${v.cepa}`}
            fill
            sizes="(min-width: 1280px) 150px, (min-width: 640px) 22vw, 45vw"
            className="object-contain object-bottom"
          />
        </div>
        {v.destacado ? (
          <span className="absolute top-3 left-3 border border-[#C9A55A]/50 bg-[#0E0B0B]/60 px-2 py-0.5 text-[9.5px] tracking-[0.22em] text-[#E3C88A] uppercase backdrop-blur">
            {v.destacado}
          </span>
        ) : null}
        <span className={`absolute top-3 right-3 text-[11px] tracking-[0.2em] text-[#A8998A] ${v.destacado ? "hidden xl:block" : ""}`}>
          {v.anio}
        </span>
      </button>
      <div className="flex flex-1 flex-col px-4 pt-4 pb-4">
        <p className="text-[9.5px] tracking-[0.3em] text-[#C9A55A] uppercase">{v.bodega}</p>
        <h3 className={`${serif} mt-1.5 text-[23px] leading-[1.05] sm:text-[26px]`}>
          <button type="button" onClick={onVer} className="text-left hover:text-[#E3C88A] focus-visible:outline-none">
            {v.nombre}
          </button>
        </h3>
        <p className="mt-1 text-[13px] text-[#A8998A]">
          {v.cepa} · {regionNombre(v.region)}
        </p>
        <div
          className="mt-3 flex items-center gap-1.5 text-[#A8998A]"
          aria-label={`Marida con ${v.maridajes.map((m) => MARIDAJES.find((x) => x.id === m)?.nombre).join(", ")}`}
        >
          {v.maridajes.map((m) => (
            <IconoMaridaje key={m} id={m} className="size-4" />
          ))}
        </div>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-4">
          <p className={`${serif} text-[18px] whitespace-nowrap text-[#E3C88A] tabular-nums sm:text-[21px]`}>
            {v.precio ? ars(v.precio) : "Consultar"}
          </p>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={onCaja}
              disabled={cajaLlena}
              aria-label={`Sumar ${v.nombre} a la caja de 6`}
              title="Sumar a la caja de 6"
              className="grid size-8 sm:size-9 place-items-center border border-[#3A2C2C] text-[#CFC3B3] transition hover:border-[#C9A55A] hover:text-[#E3C88A] disabled:opacity-30 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#C9A55A]"
            >
              <IcCaja className="size-4.5" />
            </button>
            <button
              type="button"
              onClick={onAgregar}
              aria-label={`Agregar ${v.nombre} a mi selección`}
              title="Agregar a mi selección"
              className="grid size-8 sm:size-9 place-items-center bg-[#C9A55A] text-[#130D0E] transition hover:bg-[#E3C88A] focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#C9A55A]"
            >
              <IcMas />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/** Vista cenital de una caja de madera con 6 lugares: cada botella se ve por su cápsula. */
function CajaSvg({ ids, onQuitar }: { ids: string[]; onQuitar: (i: number) => void }) {
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <svg viewBox="0 0 520 360" className="h-auto w-full" aria-hidden="true">
        <defs>
          <linearGradient id="cava-madera" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8A5A34" />
            <stop offset="1" stopColor="#5E3A20" />
          </linearGradient>
          <pattern id="cava-veta" width="120" height="14" patternUnits="userSpaceOnUse">
            <path d="M0 7 C30 3 60 11 120 6" stroke="#4A2C16" strokeOpacity="0.35" fill="none" />
          </pattern>
          <radialGradient id="cava-hueco" cx="0.5" cy="0.4" r="0.7">
            <stop offset="0" stopColor="#2A1A10" />
            <stop offset="1" stopColor="#150C07" />
          </radialGradient>
        </defs>
        <rect x="6" y="14" width="508" height="340" rx="6" fill="#000" opacity="0.5" />
        <rect x="0" y="0" width="508" height="340" rx="6" fill="url(#cava-madera)" />
        <rect x="0" y="0" width="508" height="340" rx="6" fill="url(#cava-veta)" />
        <rect x="18" y="18" width="472" height="304" rx="3" fill="#3B2412" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const cx = 98 + (i % 3) * 156;
          const cy = 98 + Math.floor(i / 3) * 144;
          const v = ids[i] ? VINO_POR_ID.get(ids[i]!) : null;
          return (
            <g key={i}>
              <rect x={cx - 70} y={cy - 64} width="140" height="128" fill="url(#cava-hueco)" />
              {v ? (
                <g className="motion-safe:animate-[cava-caer_0.35s_ease-out]" style={{ transformOrigin: `${cx}px ${cy}px` }}>
                  <circle cx={cx} cy={cy} r="46" fill="#000" opacity="0.45" />
                  <circle cx={cx} cy={cy} r="42" fill="#0F140F" />
                  <circle cx={cx} cy={cy} r="42" fill="none" stroke="#fff" strokeOpacity="0.08" strokeWidth="6" />
                  <circle cx={cx} cy={cy} r="20" fill={v.capsula} />
                  <circle cx={cx} cy={cy} r="20" fill="none" stroke="#E3C88A" strokeOpacity="0.55" strokeWidth="1.2" />
                  <circle cx={cx - 6} cy={cy - 6} r="6" fill="#fff" opacity="0.18" />
                  <text
                    x={cx}
                    y={cy + 4}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#EFE6D6"
                    opacity="0.85"
                    className="[font-family:var(--font-cava-serif)]"
                  >
                    {v.nombre.charAt(0)}
                  </text>
                </g>
              ) : (
                <circle cx={cx} cy={cy} r="42" fill="none" stroke="#C9A55A" strokeOpacity="0.28" strokeDasharray="4 5" />
              )}
            </g>
          );
        })}
        <rect x="18" y="160" width="472" height="12" fill="url(#cava-madera)" />
        <rect x="171" y="18" width="12" height="304" fill="url(#cava-madera)" />
        <rect x="327" y="18" width="12" height="304" fill="url(#cava-madera)" />
      </svg>
      <ol className="absolute inset-0 grid grid-cols-3 grid-rows-2 p-[3.5%]">
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const v = ids[i] ? VINO_POR_ID.get(ids[i]!) : null;
          return (
            <li key={i} className="relative flex items-end justify-center">
              {v ? (
                <button
                  type="button"
                  onClick={() => onQuitar(i)}
                  aria-label={`Quitar ${v.nombre} de la caja`}
                  className="group/lugar absolute inset-2 flex items-end justify-center focus-visible:outline-1 focus-visible:outline-[#C9A55A]"
                >
                  <span className="mb-[6%] max-w-full truncate bg-[#0E0B0B]/80 px-1.5 py-0.5 text-[10px] tracking-[0.06em] text-[#EFE6D6] sm:text-[11px]">
                    {v.nombre}
                  </span>
                  <span className="absolute top-1 right-1 grid size-5 place-items-center rounded-full bg-[#0E0B0B]/80 text-[#EFE6D6] opacity-70 transition group-hover/lugar:opacity-100">
                    <IcX className="size-3" />
                  </span>
                </button>
              ) : (
                <span className="sr-only">Lugar {i + 1} vacío</span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function CavaApp() {
  const lista = useLista("cava-aldea-seleccion-v1", { max: 48 });
  const [aviso, avisar] = useAviso();
  const [f, setF] = useState<Filtros>(VACIOS);
  const [orden, setOrden] = useState<"sugeridos" | "precio-asc" | "precio-desc" | "anio">("sugeridos");
  const [ficha, setFicha] = useState<Vino | null>(null);
  const [panelFiltros, setPanelFiltros] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [consulta, setConsulta] = useState(false);
  const [caja, setCaja] = useState<string[]>([]);
  const [cajaLista, setCajaLista] = useState(false);
  const uid = useId();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CLAVE_CAJA);
      const data: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(data)) setCaja(data.filter((x): x is string => typeof x === "string" && VINO_POR_ID.has(x)).slice(0, TAM_CAJA));
    } catch {
      /* sin almacenamiento */
    }
    setCajaLista(true);
  }, []);
  useEffect(() => {
    if (!cajaLista) return;
    try {
      window.localStorage.setItem(CLAVE_CAJA, JSON.stringify(caja));
    } catch {
      /* sin almacenamiento */
    }
  }, [caja, cajaLista]);

  const set = useCallback((fn: (f: Filtros) => Filtros) => setF(fn), []);

  const resultados = useMemo(() => {
    const q = normalizar(f.q.trim());
    const r = VINOS.filter((v) => {
      if (f.tipos.length && !f.tipos.includes(v.tipo)) return false;
      if (f.cepas.length && !f.cepas.includes(v.cepaFiltro)) return false;
      if (f.regiones.length && !f.regiones.includes(v.region)) return false;
      if (f.maridajes.length && !f.maridajes.some((m) => v.maridajes.includes(m))) return false;
      const p = v.precio ?? PRECIO_MAX;
      if (p < f.min || (f.max < PRECIO_MAX && p > f.max)) return false;
      if (q && !normalizar(`${v.nombre} ${v.bodega} ${v.cepa} ${regionNombre(v.region)}`).includes(q)) return false;
      return true;
    });
    if (orden === "precio-asc") r.sort((a, b) => (a.precio ?? 1e9) - (b.precio ?? 1e9));
    if (orden === "precio-desc") r.sort((a, b) => (b.precio ?? 1e9) - (a.precio ?? 1e9));
    if (orden === "anio") r.sort((a, b) => a.anio.localeCompare(b.anio));
    return r;
  }, [f, orden]);

  const activos =
    f.tipos.length +
    f.cepas.length +
    f.regiones.length +
    f.maridajes.length +
    (f.min > PRECIO_MIN || f.max < PRECIO_MAX ? 1 : 0) +
    (f.q ? 1 : 0);
  const cajaLlena = caja.length >= TAM_CAJA;

  const agregar = (v: Vino, cantidad = 1, nota = "") => {
    lista.agregar({ id: v.id, cantidad, nota: nota.trim() || undefined });
    avisar(`${v.nombre} ${v.cepa} se sumó a tu selección`);
  };
  const aCaja = (v: Vino) => {
    if (caja.length >= TAM_CAJA) return;
    setCaja((c) => [...c, v.id]);
    avisar(
      caja.length + 1 === TAM_CAJA
        ? "¡Caja completa! Ya podés sumarla a tu selección"
        : `${v.nombre} va a la caja (${caja.length + 1} de 6)`,
    );
  };
  const completarCaja = () => {
    const sugeridos = [
      "arce-malbec",
      "paso-nubes-torrontes",
      "cerro-callado-cabernet-franc",
      "olmedo-rosado",
      "aljibe-pinot-noir",
      "brisa-nueva-extra-brut",
      "tierra-quieta-bonarda",
      "tres-soles-sauvignon",
    ];
    setCaja((c) => {
      const out = [...c];
      for (const id of sugeridos) {
        if (out.length >= TAM_CAJA) break;
        if (!out.includes(id)) out.push(id);
      }
      return out;
    });
    avisar("Completamos la caja con una selección variada");
  };
  const cajaASeleccion = () => {
    lista.agregar({ key: `caja::${Date.now()}`, id: "caja", cantidad: 1, contenido: caja });
    setCaja([]);
    avisar("La caja de 6 se sumó a tu selección");
  };

  const tc = totalCaja(caja);
  const totalLista = lista.items.reduce((s, it) => {
    if (it.id === "caja" && it.contenido) return s + totalCaja(it.contenido).total * it.cantidad;
    return s + (VINO_POR_ID.get(it.id)?.precio ?? 0) * it.cantidad;
  }, 0);
  const botellas = lista.items.reduce((s, it) => s + (it.id === "caja" ? TAM_CAJA : 1) * it.cantidad, 0);
  const construir = useCallback((d: Record<string, string>) => mensajeCava(lista.items, d), [lista.items]);

  return (
    <>
      <style>{`
        @keyframes cava-subir { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: none } }
        @keyframes cava-radar { from { transform: scale(0.2); opacity: 0 } to { transform: none; opacity: 1 } }
        @keyframes cava-caer { from { transform: scale(1.25); opacity: 0 } to { transform: none; opacity: 1 } }
        @keyframes cava-entrar { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
        .cava-rango input[type=range] { position: absolute; inset: 0; width: 100%; appearance: none; -webkit-appearance: none; background: transparent; pointer-events: none; margin: 0; }
        .cava-rango input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; pointer-events: auto; width: 18px; height: 18px; border-radius: 999px; background: #120C0D; border: 2px solid #C9A55A; cursor: grab; }
        .cava-rango input[type=range]::-moz-range-thumb { pointer-events: auto; width: 14px; height: 14px; border-radius: 999px; background: #120C0D; border: 2px solid #C9A55A; cursor: grab; }
        .cava-rango input[type=range]:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 4px rgba(201,165,90,.35); }
        .cava-rango input[type=range]:focus-visible { outline: none; }
      `}</style>
      <EdadGate />

      <header className="sticky top-0 z-30 border-b border-[#2A1F20] bg-[#0E0B0B]/88 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-6 px-4 sm:h-[76px] sm:px-8">
          <a
            href="#inicio"
            className="flex items-center gap-3 focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#C9A55A]"
          >
            <span className="grid size-9 place-items-center rounded-full border border-[#C9A55A]/60 text-[#C9A55A]">
              <IcCopa className="size-4.5" />
            </span>
            <span className="leading-none">
              <span className={`${serif} block text-[22px] tracking-[0.02em]`}>Cava Aldea</span>
              <span className="mt-1 block text-[9px] tracking-[0.42em] whitespace-nowrap text-[#A8998A] uppercase">Vinoteca · Córdoba</span>
            </span>
          </a>
          <nav aria-label="Secciones" className="ml-auto hidden md:block">
            <ul className="flex gap-8 text-[12px] tracking-[0.2em] text-[#CFC3B3] uppercase">
              {[
                ["#cava", "La cava"],
                ["#caja", "Caja de 6"],
                ["#visita", "Visitanos"],
              ].map(([h, l]) => (
                <li key={h}>
                  <a
                    href={h}
                    className="transition hover:text-[#E3C88A] focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#C9A55A]"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="ml-auto inline-flex h-10 shrink-0 items-center gap-1.5 border border-[#C9A55A]/60 px-3 whitespace-nowrap sm:gap-2.5 sm:px-3.5 text-[12px] tracking-[0.16em] text-[#E3C88A] uppercase transition hover:bg-[#C9A55A] hover:text-[#130D0E] focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#C9A55A] md:ml-0"
          >
            <span className="hidden sm:inline">Mi selección</span>
            <span className="sm:hidden">Selección</span> <span className="tabular-nums">({botellas})</span>
          </button>
        </div>
      </header>

      <main id="inicio">
        <section className="relative overflow-hidden" aria-labelledby={`${uid}-hero`}>
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_75%_80%,#4A1220_0%,transparent_70%)]"
            aria-hidden="true"
          />
          <svg
            className="pointer-events-none absolute -top-10 right-[-10%] h-[520px] w-[520px] text-[#C9A55A] opacity-[0.18] sm:right-[4%]"
            viewBox="0 0 200 200"
            aria-hidden="true"
          >
            <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="0.4" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.3" />
            <path
              d="M40 150 C70 110 90 80 150 40 M95 90 c-10 -20 -30 -22 -40 -10 c14 4 26 8 40 10z M120 70 c4 -22 22 -32 36 -24 c-12 8 -22 16 -36 24z M70 125 c-18 -6 -30 4 -30 16 c12 -4 20 -8 30 -16z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
            />
          </svg>
          <div className="relative mx-auto grid max-w-[1320px] items-end gap-10 px-4 pt-14 pb-16 sm:px-8 md:grid-cols-[1.1fr_1fr] md:pt-24 md:pb-24">
            <div>
              <p className="text-[11px] tracking-[0.42em] text-[#C9A55A] uppercase">Vinos de autor · Selección 2026</p>
              <h1 id={`${uid}-hero`} className={`${serif} mt-6 text-[clamp(3rem,8vw,6.6rem)] leading-[0.95] tracking-[-0.01em]`}>
                Cada botella, <em className="text-[#E3C88A]">elegida</em> a mano.
              </h1>
              <p className="mt-7 max-w-md text-[16px] leading-relaxed text-[#CFC3B3]">
                Pequeñas bodegas de Salta a la Patagonia. Filtrá por cepa, región o comida, armá tu caja de seis y consultanos por WhatsApp.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="#cava"
                  className="inline-flex h-12 items-center gap-2 bg-[#C9A55A] px-6 text-[12.5px] font-medium tracking-[0.16em] text-[#130D0E] uppercase transition hover:bg-[#E3C88A] focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#C9A55A]"
                >
                  Explorar la cava <IcFlecha />
                </a>
                <a
                  href="#caja"
                  className="inline-flex h-12 items-center gap-2 border border-[#4A3A36] px-6 text-[12.5px] tracking-[0.16em] uppercase transition hover:border-[#C9A55A] focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#C9A55A]"
                >
                  <IcCaja className="size-4.5" /> Armá tu caja de 6
                </a>
              </div>
            </div>
            <div className="relative mx-auto flex h-[360px] w-full max-w-[460px] items-end justify-center sm:h-[460px]">
              <div
                className="absolute bottom-[4%] left-1/2 h-8 w-[80%] -translate-x-1/2 rounded-[50%] bg-black/60 blur-xl"
                aria-hidden="true"
              />
              {(
                [
                  ["paso-nubes-torrontes", "h-[80%] -mr-8 sm:-mr-10", ""],
                  ["arce-gran-reserva", "z-10 h-[100%]", ""],
                  ["brisa-nueva-extra-brut", "h-[84%] -ml-8 sm:-ml-10", ""],
                ] as const
              ).map(([id, cls], i) => {
                const v = VINO_POR_ID.get(id)!;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFicha(v)}
                    aria-label={`Ver ficha de ${v.nombre}`}
                    className={`relative aspect-[2/5] ${cls} transition-transform duration-500 hover:-translate-y-2 focus-visible:outline-1 focus-visible:outline-[#C9A55A] motion-safe:animate-[cava-subir_0.9s_cubic-bezier(.2,.8,.2,1)_both]`}
                    style={{ animationDelay: `${i * 120}ms` }}
                  >
                    <Image src={imagenVino(id)} alt="" fill priority sizes="200px" className="object-contain object-bottom" />
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section id="cava" className="mx-auto max-w-[1320px] scroll-mt-24 px-4 sm:px-8" aria-labelledby={`${uid}-cava`}>
          <div className="flex flex-wrap items-end justify-between gap-5 border-t border-[#2A1F20] pt-12">
            <div>
              <p className="text-[11px] tracking-[0.42em] text-[#C9A55A] uppercase">La cava</p>
              <h2 id={`${uid}-cava`} className={`${serif} mt-3 text-[44px] leading-none sm:text-[60px]`}>
                {resultados.length} {resultados.length === 1 ? "vino" : "vinos"} <span className="text-[#A8998A] italic">para vos</span>
              </h2>
            </div>
            <div className="flex w-full flex-wrap gap-2 sm:w-auto">
              <label className="relative min-w-0 basis-full sm:w-64 sm:flex-none sm:basis-auto">
                <span className="sr-only">Buscar vino, bodega o cepa</span>
                <IcBuscar className="pointer-events-none absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-[#A8998A]" />
                <input
                  type="search"
                  value={f.q}
                  onChange={(e) => setF((x) => ({ ...x, q: e.target.value }))}
                  placeholder="Buscar vino o bodega"
                  className="h-11 w-full border border-[#3A2C2C] bg-[#140E0F] pr-3 pl-10 text-[14px] placeholder:text-[#7E7064] focus:border-[#C9A55A] focus:outline-none"
                />
              </label>
              <label className="flex-1 sm:flex-none">
                <span className="sr-only">Ordenar</span>
                <select
                  value={orden}
                  onChange={(e) => setOrden(e.target.value as typeof orden)}
                  className="h-11 w-full border border-[#3A2C2C] bg-[#140E0F] px-3 text-[14px] text-[#EFE6D6] focus:border-[#C9A55A] focus:outline-none"
                >
                  <option value="sugeridos">Sugeridos</option>
                  <option value="precio-asc">Menor precio</option>
                  <option value="precio-desc">Mayor precio</option>
                  <option value="anio">Más añejos</option>
                </select>
              </label>
              <button
                type="button"
                onClick={() => setPanelFiltros(true)}
                className="inline-flex h-11 items-center gap-2 border border-[#3A2C2C] px-4 text-[13px] tracking-[0.1em] uppercase focus-visible:outline-1 focus-visible:outline-[#C9A55A] lg:hidden"
              >
                <IcFiltro /> Filtros {activos ? <span className="text-[#E3C88A]">({activos})</span> : null}
              </button>
            </div>
          </div>

          <div className="mt-10 lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12">
            <aside className="hidden lg:block" aria-label="Filtros">
              <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-2 pb-8 [scrollbar-color:#3A2C2C_transparent] [scrollbar-width:thin]">
                <PanelFiltros f={f} set={set} />
                {activos ? (
                  <button
                    type="button"
                    onClick={() => setF(VACIOS)}
                    className="mt-8 text-[13px] text-[#E3C88A] underline underline-offset-4"
                  >
                    Limpiar todos los filtros
                  </button>
                ) : null}
              </div>
            </aside>
            <div>
              <p className="sr-only" aria-live="polite">
                {resultados.length} vinos encontrados
              </p>
              {resultados.length ? (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4">
                  {resultados.map((v, i) => (
                    <li
                      key={v.id}
                      className="motion-safe:animate-[cava-entrar_0.4s_ease-out_both]"
                      style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                    >
                      <Tarjeta v={v} onVer={() => setFicha(v)} onAgregar={() => agregar(v)} onCaja={() => aCaja(v)} cajaLlena={cajaLlena} />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="border border-dashed border-[#3A2C2C] px-6 py-20 text-center">
                  <p className={`${serif} text-[32px]`}>Ningún vino con esa combinación.</p>
                  <p className="mt-2 text-[14px] text-[#A8998A]">Probá ampliar el rango de precio o sacar alguna región.</p>
                  <button
                    type="button"
                    onClick={() => setF(VACIOS)}
                    className="mt-6 h-11 bg-[#C9A55A] px-6 text-[12.5px] tracking-[0.14em] text-[#130D0E] uppercase"
                  >
                    Ver toda la cava
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="caja" className="mx-auto mt-24 max-w-[1320px] scroll-mt-24 px-4 sm:mt-32 sm:px-8" aria-labelledby={`${uid}-caja`}>
          <div className="grid gap-10 border border-[#2A1F20] bg-[linear-gradient(135deg,#170F10,#120C0D)] p-5 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-14">
            <div>
              <p className="text-[11px] tracking-[0.42em] text-[#C9A55A] uppercase">Caja de 6</p>
              <h2 id={`${uid}-caja`} className={`${serif} mt-3 text-[40px] leading-[1] sm:text-[54px]`}>
                Armala a tu gusto, <em className="whitespace-nowrap text-[#E3C88A]">10 % off.</em>
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#CFC3B3]">
                Sumá botellas con el ícono de caja en cada vino. Podés repetir, mezclar tintos y blancos, o dejar que la completemos
                nosotros.
              </p>
              <div className="mt-6" aria-live="polite">
                <p className="text-[13px] tracking-[0.2em] text-[#A8998A] uppercase">
                  {caja.length} de {TAM_CAJA} botellas
                </p>
                <div className="mt-2 flex gap-1.5" aria-hidden="true">
                  {Array.from({ length: TAM_CAJA }, (_, i) => (
                    <span
                      key={i}
                      className={`h-1 flex-1 transition-colors duration-300 ${i < caja.length ? "bg-[#C9A55A]" : "bg-[#3A2C2C]"}`}
                    />
                  ))}
                </div>
              </div>
              <dl className="mt-6 space-y-1.5 text-[14px]">
                <div className="flex justify-between text-[#CFC3B3]">
                  <dt>Subtotal</dt>
                  <dd className="tabular-nums">{ars(tc.bruto)}</dd>
                </div>
                <div className="flex justify-between text-[#CFC3B3]">
                  <dt>Descuento por caja completa</dt>
                  <dd className="tabular-nums">{tc.descuento ? `− ${ars(tc.descuento)}` : "—"}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-[#3A2C2C] pt-2">
                  <dt className="text-[#EFE6D6]">Total de la caja</dt>
                  <dd className={`${serif} text-[28px] text-[#E3C88A] tabular-nums`}>{ars(tc.total)}</dd>
                </div>
                {tc.consultar ? <p className="text-[12.5px] text-[#A8998A]">Incluye {tc.consultar} vino con precio a consultar.</p> : null}
              </dl>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={cajaASeleccion}
                  disabled={!cajaLlena}
                  className="h-12 flex-1 bg-[#C9A55A] px-6 text-[12.5px] font-medium tracking-[0.14em] text-[#130D0E] uppercase transition hover:bg-[#E3C88A] disabled:cursor-not-allowed disabled:bg-[#3A2C2C] disabled:text-[#7E7064] focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#C9A55A] sm:flex-none"
                >
                  {cajaLlena ? "Sumar caja a mi selección" : `Faltan ${TAM_CAJA - caja.length} botellas`}
                </button>
                {!cajaLlena ? (
                  <button
                    type="button"
                    onClick={completarCaja}
                    className="inline-flex h-12 items-center gap-2 border border-[#4A3A36] px-5 text-[12.5px] tracking-[0.14em] uppercase transition hover:border-[#C9A55A] focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#C9A55A]"
                  >
                    <IcChispa /> Completar por mí
                  </button>
                ) : null}
                {caja.length ? (
                  <button
                    type="button"
                    onClick={() => setCaja([])}
                    className="h-12 px-2 text-[13px] text-[#A8998A] underline underline-offset-4 hover:text-[#EFE6D6]"
                  >
                    Vaciar caja
                  </button>
                ) : null}
              </div>
            </div>
            <CajaSvg ids={caja} onQuitar={(i) => setCaja((c) => c.filter((_, j) => j !== i))} />
          </div>
        </section>
      </main>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-36 z-40 flex justify-center px-4 sm:bottom-32">
        {aviso ? (
          <p className="pointer-events-auto flex items-center gap-4 border border-[#C9A55A]/50 bg-[#120C0D] py-2.5 pr-2.5 pl-5 text-[13px] text-[#EFE6D6] shadow-2xl motion-safe:animate-[cava-entrar_0.25s_ease-out]">
            {aviso}
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className="bg-[#C9A55A] px-3 py-1.5 text-[11px] tracking-[0.14em] text-[#130D0E] uppercase"
            >
              Ver
            </button>
          </p>
        ) : null}
      </div>

      <FichaVino
        vino={ficha}
        onCerrar={() => setFicha(null)}
        onAgregar={(v, n, nota) => agregar(v, n, nota)}
        onCaja={aCaja}
        cajaLlena={cajaLlena}
      />

      <Dialogo
        abierto={panelFiltros}
        onCerrar={() => setPanelFiltros(false)}
        labelledBy={`${uid}-filtros`}
        className="mx-0 mt-auto mb-0 max-h-[88dvh] w-full max-w-none overflow-y-auto border-t border-[#3A2C2C] bg-[#120C0D] text-[#EFE6D6] backdrop:bg-black/70 [font-family:var(--font-cava-sans)]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#2A1F20] bg-[#120C0D] px-5 py-4">
          <h2 id={`${uid}-filtros`} className={`${serif} text-[28px]`}>
            Filtros
          </h2>
          <button
            type="button"
            onClick={() => setPanelFiltros(false)}
            aria-label="Cerrar filtros"
            className="grid size-10 place-items-center text-[#A8998A]"
          >
            <IcX className="size-5" />
          </button>
        </div>
        <div className="px-5 py-6">
          <PanelFiltros f={f} set={set} />
        </div>
        <div className="sticky bottom-0 flex gap-3 border-t border-[#2A1F20] bg-[#120C0D] px-5 py-4">
          <button
            type="button"
            onClick={() => setF(VACIOS)}
            className="h-12 border border-[#4A3A36] px-5 text-[12.5px] tracking-[0.12em] uppercase"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={() => setPanelFiltros(false)}
            className="h-12 flex-1 bg-[#C9A55A] text-[12.5px] font-medium tracking-[0.14em] text-[#130D0E] uppercase"
          >
            Ver {resultados.length} {resultados.length === 1 ? "vino" : "vinos"}
          </button>
        </div>
      </Dialogo>

      <Dialogo
        abierto={drawer}
        onCerrar={() => setDrawer(false)}
        labelledBy={`${uid}-sel`}
        className="mt-0 mr-0 mb-0 ml-auto h-dvh max-h-dvh w-full max-w-[460px] border-l border-[#3A2C2C] bg-[#120C0D] text-[#EFE6D6] backdrop:bg-black/70 [font-family:var(--font-cava-sans)]"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-[#2A1F20] px-5 py-5 sm:px-7">
            <div>
              <h2 id={`${uid}-sel`} className={`${serif} text-[32px] leading-none`}>
                Tu selección
              </h2>
              <p className="mt-1.5 text-[12px] tracking-[0.2em] text-[#A8998A] uppercase">
                {botellas} {botellas === 1 ? "botella" : "botellas"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDrawer(false)}
              aria-label="Cerrar selección"
              className="grid size-10 place-items-center text-[#A8998A] hover:text-[#E3C88A] focus-visible:outline-1 focus-visible:outline-[#C9A55A]"
            >
              <IcX className="size-5" />
            </button>
          </div>
          {lista.items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
              <IcCopa className="size-10 text-[#4A3A36]" />
              <p className={`${serif} mt-5 text-[28px]`}>Todavía no elegiste vinos.</p>
              <p className="mt-2 text-[14px] text-[#A8998A]">Sumalos desde la cava o armá una caja de seis.</p>
              <button
                type="button"
                onClick={() => {
                  setDrawer(false);
                  document.getElementById("cava")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="mt-6 h-11 bg-[#C9A55A] px-6 text-[12.5px] tracking-[0.14em] text-[#130D0E] uppercase"
              >
                Ir a la cava
              </button>
            </div>
          ) : (
            <>
              <ul className="flex-1 divide-y divide-[#2A1F20] overflow-y-auto px-5 sm:px-7">
                {lista.items.map((it) => {
                  const esCaja = it.id === "caja" && it.contenido;
                  const v = VINO_POR_ID.get(it.id);
                  if (!esCaja && !v) return null;
                  const precio = esCaja ? totalCaja(it.contenido!).total : (v!.precio ?? 0);
                  return (
                    <li key={it.key} className="flex gap-4 py-5">
                      <div className="relative grid h-24 w-16 shrink-0 place-items-center bg-[radial-gradient(ellipse_at_50%_100%,#3A0F1A,#140E0F_70%)]">
                        {esCaja ? (
                          <IcCaja className="size-8 text-[#C9A55A]" />
                        ) : (
                          <Image src={imagenVino(v!.id)} alt="" fill sizes="64px" className="object-contain py-1" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`${serif} text-[22px] leading-tight`}>{esCaja ? "Caja de 6 armada" : v!.nombre}</p>
                            <p className="mt-0.5 text-[12.5px] text-[#A8998A]">
                              {esCaja ? "10 % off aplicado" : `${v!.cepa} · ${v!.anio}`}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => lista.quitar(it.key)}
                            aria-label={`Quitar ${esCaja ? "la caja" : v!.nombre} de la selección`}
                            className="grid size-8 shrink-0 place-items-center text-[#7E7064] hover:text-[#E3C88A] focus-visible:outline-1 focus-visible:outline-[#C9A55A]"
                          >
                            <IcX />
                          </button>
                        </div>
                        {esCaja ? (
                          <ul className="mt-2 space-y-0.5 text-[12.5px] text-[#CFC3B3]">
                            {resumenCaja(it.contenido!).map(([id, n]) => (
                              <li key={id}>
                                {n} × {VINO_POR_ID.get(id)?.nombre} <span className="text-[#7E7064]">{VINO_POR_ID.get(id)?.cepa}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <Cantidad
                            valor={it.cantidad}
                            onChange={(n) => lista.fijarCantidad(it.key, n)}
                            etiqueta={`Cantidad de ${esCaja ? "cajas" : v!.nombre}`}
                          />
                          <p className="text-[14px] text-[#E3C88A] tabular-nums">{precio ? ars(precio * it.cantidad) : "Consultar"}</p>
                        </div>
                        <label className="mt-3 block">
                          <span className="sr-only">Nota</span>
                          <input
                            type="text"
                            value={it.nota ?? ""}
                            onChange={(e) => lista.fijarNota(it.key, e.target.value)}
                            placeholder="Nota (regalo, añada, etc.)"
                            className="h-9 w-full border border-[#2A1F20] bg-[#0E0B0B] px-3 text-[13px] placeholder:text-[#7E7064] focus:border-[#C9A55A] focus:outline-none"
                          />
                        </label>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-[#2A1F20] bg-[#0E0B0B] px-5 py-6 sm:px-7">
                <div className="flex items-baseline justify-between">
                  <p className="text-[12px] tracking-[0.2em] text-[#A8998A] uppercase">Total estimado</p>
                  <p className={`${serif} text-[32px] text-[#E3C88A] tabular-nums`}>{ars(totalLista)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setConsulta(true)}
                  className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 bg-[#C9A55A] text-[12.5px] font-medium tracking-[0.14em] text-[#130D0E] uppercase transition hover:bg-[#E3C88A] focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#C9A55A]"
                >
                  <IcChat className="size-4.5" /> Consultar por WhatsApp
                </button>
                <button
                  type="button"
                  onClick={lista.vaciar}
                  className="mt-3 w-full text-[13px] text-[#A8998A] underline underline-offset-4 hover:text-[#EFE6D6]"
                >
                  Vaciar selección
                </button>
              </div>
            </>
          )}
        </div>
      </Dialogo>

      <ModalConsulta
        abierto={consulta}
        onCerrar={() => setConsulta(false)}
        titulo="Así llega tu consulta"
        bajada="Te respondemos con stock, envío y forma de pago. Mirá el mensaje antes de mandarlo."
        negocio="Cava Aldea · Vinoteca"
        iniciales="CA"
        campos={[
          { id: "nombre", label: "Tu nombre", placeholder: "Ej.: Tomás Ferreyra", autoComplete: "name" },
          { id: "entrega", label: "Entrega", placeholder: "Ej.: retiro en la cava / envío a Cerro de las Rosas" },
          { id: "comentario", label: "Comentario (opcional)", placeholder: "Ej.: es para un regalo de cumpleaños", multilinea: true },
        ]}
        construir={construir}
        tema={temaConsulta}
      />
    </>
  );
}
