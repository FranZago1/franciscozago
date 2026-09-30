"use client";

import { useMemo, useState, type DragEvent } from "react";
import { Icon, type IconName } from "../shared/Icon";
import { diaDiff, diaRelativo, hora, normalizar, pesosCorto, usd, usdCorto } from "../shared/util";
import { ASESORES, ETAPAS, USUARIO, type Cliente, type Etapa } from "./data";
import { useCrm } from "./context";
import { Avatar, btn, ICONO_TAREA, PrioridadFlag } from "./ui";

const PRIO_ORDEN = { alta: 0, media: 1, baja: 2 } as const;

export function Embudo() {
  const { state, now, moverEtapa } = useCrm();
  const [asesor, setAsesor] = useState<string>("todos");
  const [operacion, setOperacion] = useState<"todas" | "Compra" | "Alquiler">("todas");
  const [q, setQ] = useState("");
  const [arrastrando, setArrastrando] = useState<string | null>(null);
  const [sobre, setSobre] = useState<Etapa | null>(null);

  const filtrados = useMemo(() => {
    const n = normalizar(q.trim());
    return state.clientes.filter(
      (c) =>
        (asesor === "todos" || c.asesor === asesor) &&
        (operacion === "todas" || c.operacion === operacion) &&
        (!n || normalizar(`${c.nombre} ${c.zona}`).includes(n)),
    );
  }, [state.clientes, asesor, operacion, q]);

  const kpis = useMemo(() => {
    const activos = state.clientes.filter((c) => c.etapa !== "cerrado");
    const negociacion = state.clientes.filter((c) => c.etapa === "negociacion" && c.operacion === "Compra");
    const cerrados = state.clientes.filter((c) => c.etapa === "cerrado");
    const tasa = Math.round((cerrados.length / Math.max(1, state.clientes.length)) * 100);
    const hoy = state.tareas.filter((t) => diaDiff(t.fecha, now) === 0);
    const hechasHoy = hoy.filter((t) => t.hecha).length;
    return {
      activos: activos.length,
      nuevosSemana: state.clientes.filter((c) => diaDiff(c.creado, now) >= -7).length,
      potencial: negociacion.reduce((a, c) => a + c.presupuesto, 0),
      nNeg: state.clientes.filter((c) => c.etapa === "negociacion").length,
      cerrados: cerrados.length,
      tasa,
      hoy: hoy.length,
      hechasHoy,
    };
  }, [state, now]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0C3440] sm:text-[28px]">Embudo de ventas</h1>
          <p className="mt-1 text-sm text-[#64748B]">Arrastrá las tarjetas entre etapas o usá las flechas de cada una.</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi icon="users" label="Clientes activos" valor={String(kpis.activos)} extra={`+${kpis.nuevosSemana} esta semana`} tono="up" />
        <Kpi icon="dollar" label="En negociación" valor={usdCorto(kpis.potencial)} extra={`${kpis.nNeg} operaciones abiertas`} />
        <Kpi icon="check" label="Cerrados" valor={String(kpis.cerrados)} extra={`${kpis.tasa}% de conversión`} tono="up" />
        <Kpi
          icon="calendar"
          label="Tareas de hoy"
          valor={`${kpis.hechasHoy}/${kpis.hoy}`}
          extra={kpis.hoy - kpis.hechasHoy > 0 ? `${kpis.hoy - kpis.hechasHoy} pendientes` : "Todo al día"}
          progreso={kpis.hoy ? kpis.hechasHoy / kpis.hoy : 1}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3">
        <div className="relative w-full sm:w-60">
          <label htmlFor="emb-q" className="sr-only">
            Filtrar tarjetas
          </label>
          <Icon name="filter" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            id="emb-q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filtrar por nombre o zona"
            className="h-9 w-full rounded-lg border border-[#D5DDE5] bg-white pl-9 pr-3 text-sm placeholder:text-[#94A3B8] focus:border-[#0F4C5C] focus:outline-none focus:ring-3 focus:ring-[#0F4C5C]/15"
          />
        </div>
        <div role="group" aria-label="Operación" className="inline-flex rounded-lg border border-[#D5DDE5] bg-white p-0.5">
          {(["todas", "Compra", "Alquiler"] as const).map((o) => (
            <button
              key={o}
              type="button"
              aria-pressed={operacion === o}
              onClick={() => setOperacion(o)}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${operacion === o ? "bg-[#0F4C5C] text-white" : "text-[#475569] hover:bg-[#F1F5F8]"}`}
            >
              {o === "todas" ? "Todas" : o}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="emb-asesor" className="text-xs font-semibold text-[#64748B] max-sm:sr-only">
            Asesor
          </label>
          <select
            id="emb-asesor"
            value={asesor}
            onChange={(e) => setAsesor(e.target.value)}
            className="h-9 rounded-lg border border-[#D5DDE5] bg-white px-2.5 text-sm font-semibold focus:border-[#0F4C5C] focus:outline-none focus:ring-3 focus:ring-[#0F4C5C]/15"
          >
            <option value="todos">Todos los asesores</option>
            {ASESORES.map((a) => (
              <option key={a} value={a}>
                {a === USUARIO ? `${a} (vos)` : a}
              </option>
            ))}
          </select>
        </div>
        {(asesor !== "todos" || operacion !== "todas" || q) && (
          <button type="button" className={btn.fantasma} onClick={() => { setAsesor("todos"); setOperacion("todas"); setQ(""); }}>
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="-mx-4 mt-4 sm:-mx-6 lg:mx-0">
        <div
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sm:px-6 lg:grid lg:snap-none lg:grid-cols-5 lg:overflow-visible lg:px-0"
          aria-label="Etapas del embudo"
          role="list"
        >
          {ETAPAS.map((etapa, idx) => {
            const cards = filtrados
              .filter((c) => c.etapa === etapa.id)
              .sort((a, b) => PRIO_ORDEN[a.prioridad] - PRIO_ORDEN[b.prioridad] || b.ultimoContacto.localeCompare(a.ultimoContacto));
            const compras = cards.filter((c) => c.operacion === "Compra").reduce((a, c) => a + c.presupuesto, 0);
            const alquileres = cards.filter((c) => c.operacion === "Alquiler");
            const activo = sobre === etapa.id && arrastrando !== null;
            return (
              <section
                role="listitem"
                key={etapa.id}
                aria-labelledby={`col-${etapa.id}`}
                onDragOver={(e: DragEvent) => {
                  if (!arrastrando) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (sobre !== etapa.id) setSobre(etapa.id);
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setSobre(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData("text/plain") || arrastrando;
                  if (id) moverEtapa(id, etapa.id);
                  setSobre(null);
                  setArrastrando(null);
                }}
                className={`flex w-[82vw] max-w-[320px] shrink-0 snap-start flex-col rounded-2xl border p-2.5 transition-colors sm:w-[300px] lg:w-auto lg:max-w-none ${activo ? "border-[#0F4C5C] bg-[#E7F0F2]" : "border-[#E2E8F0] bg-[#EBEFF3]/70"}`}
              >
                <header className="px-1.5 pb-3 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full" style={{ background: etapa.color }} aria-hidden="true" />
                    <h2 id={`col-${etapa.id}`} className="text-sm font-extrabold text-[#0F172A]">
                      {etapa.nombre}
                    </h2>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold tabular-nums text-[#475569] shadow-[0_1px_2px_rgba(15,23,42,.06)]">
                      {cards.length}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[13px] font-bold tabular-nums text-[#334155]">
                    {usdCorto(compras)}
                    {alquileres.length ? (
                      <span className="font-medium text-[#64748B]">
                        {" "}
                        · {alquileres.length} alquiler{alquileres.length > 1 ? "es" : ""}
                      </span>
                    ) : null}
                  </p>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.min(100, (cards.length / Math.max(1, filtrados.length)) * 100 * 2.2)}%`, background: etapa.color }}
                    />
                  </div>
                </header>
                <ul className="flex min-h-24 flex-1 flex-col gap-2">
                  {cards.map((c) => (
                    <Tarjeta
                      key={c.id}
                      c={c}
                      idx={idx}
                      arrastrando={arrastrando === c.id}
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", c.id);
                        e.dataTransfer.effectAllowed = "move";
                        setArrastrando(c.id);
                      }}
                      onDragEnd={() => {
                        setArrastrando(null);
                        setSobre(null);
                      }}
                    />
                  ))}
                  {cards.length === 0 ? (
                    <li className="grid flex-1 place-items-center rounded-xl border border-dashed border-[#CBD5E1] px-3 py-6 text-center text-xs font-medium text-[#94A3B8]">
                      {arrastrando ? "Soltá acá" : "Sin clientes en esta etapa"}
                    </li>
                  ) : null}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Tarjeta({
  c,
  idx,
  arrastrando,
  onDragStart,
  onDragEnd,
}: {
  c: Cliente;
  idx: number;
  arrastrando: boolean;
  onDragStart: (e: DragEvent) => void;
  onDragEnd: () => void;
}) {
  const { abrirFicha, moverEtapa, proximaTarea, now } = useCrm();
  const t = proximaTarea(c.id);
  const prev = ETAPAS[idx - 1];
  const next = ETAPAS[idx + 1];
  const atrasada = t ? diaDiff(t.fecha, now) < 0 : false;
  const esHoy = t ? diaDiff(t.fecha, now) === 0 : false;

  return (
    <li
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`group relative rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,.05)] transition hover:border-[#C9D4DE] hover:shadow-[0_6px_16px_-6px_rgba(15,23,42,.18)] ${arrastrando ? "rotate-1 opacity-50" : ""} cursor-grab active:cursor-grabbing`}
    >
      <button
        type="button"
        onClick={() => abrirFicha(c.id)}
        className="block w-full rounded-xl p-3 pb-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4C5C]"
        aria-label={`${c.nombre}, ${c.operacion} en ${c.zona}. Abrir ficha`}
      >
        <div className="flex items-start gap-2">
          <p className="min-w-0 flex-1 truncate text-sm font-bold text-[#0F172A]">{c.nombre}</p>
          <PrioridadFlag p={c.prioridad} />
        </div>
        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-[#64748B]">
          <Icon name="pin" className="size-3.5 shrink-0" />
          {c.zona}
        </p>
        <div className="mt-2.5 flex items-center gap-2">
          <span
            className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold ${c.operacion === "Compra" ? "bg-[#E7F0F2] text-[#0F4C5C]" : "bg-[#F1ECFA] text-[#6B4FA8]"}`}
          >
            {c.operacion}
          </span>
          <span className="text-sm font-extrabold tabular-nums text-[#0F172A]">
            {c.operacion === "Compra" ? usd(c.presupuesto) : `${pesosCorto(c.presupuesto)}/mes`}
          </span>
        </div>
        {t ? (
          <p
            className={`mt-2.5 flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold ${atrasada ? "bg-[#FEF1F0] text-[#B42318]" : esHoy ? "bg-[#FFF6E5] text-[#9A5B0B]" : "bg-[#F4F6F9] text-[#475569]"}`}
          >
            <Icon name={ICONO_TAREA[t.tipo]} className="size-3.5 shrink-0" />
            <span className="truncate">
              {atrasada ? "Atrasada · " : ""}
              {diaRelativo(t.fecha, now)} {hora(t.fecha)}
            </span>
          </p>
        ) : (
          <p className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-[#F4F6F9] px-2 py-1.5 text-xs font-semibold text-[#94A3B8]">
            <Icon name="calendar" className="size-3.5" /> Sin próxima acción
          </p>
        )}
      </button>
      <div className="flex items-center justify-between border-t border-[#EEF2F6] px-2 py-1.5">
        <span className="flex items-center gap-1.5 pl-1 text-[11px] font-semibold text-[#64748B]">
          <Avatar nombre={c.asesor} size="sm" />
          {c.asesor.split(" ")[0]}
        </span>
        <span className="flex items-center gap-0.5">
          <button
            type="button"
            disabled={!prev}
            onClick={() => prev && moverEtapa(c.id, prev.id)}
            aria-label={prev ? `Mover a ${prev.nombre}` : "Primera etapa"}
            title={prev ? `Mover a ${prev.nombre}` : undefined}
            className="grid size-7 place-items-center rounded-md text-[#64748B] transition hover:bg-[#EEF2F6] hover:text-[#0F4C5C] disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Icon name="chevron-left" className="size-4" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            disabled={!next}
            onClick={() => next && moverEtapa(c.id, next.id)}
            aria-label={next ? `Mover a ${next.nombre}` : "Última etapa"}
            title={next ? `Mover a ${next.nombre}` : undefined}
            className="grid size-7 place-items-center rounded-md text-[#64748B] transition hover:bg-[#EEF2F6] hover:text-[#0F4C5C] disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Icon name="chevron-right" className="size-4" strokeWidth={2.2} />
          </button>
        </span>
      </div>
    </li>
  );
}

function Kpi({
  icon,
  label,
  valor,
  extra,
  tono,
  progreso,
}: {
  icon: IconName;
  label: string;
  valor: string;
  extra: string;
  tono?: "up";
  progreso?: number;
}) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,.04)] sm:p-4">
      <div className="flex items-center gap-2 text-[#64748B]">
        <span className="grid size-7 place-items-center rounded-lg bg-[#E7F0F2] text-[#0F4C5C]">
          <Icon name={icon} className="size-4" strokeWidth={2} />
        </span>
        <p className="text-xs font-semibold sm:text-[13px]">{label}</p>
      </div>
      <p className="mt-2.5 text-xl font-extrabold tabular-nums tracking-tight text-[#0F172A] sm:text-2xl">{valor}</p>
      {progreso !== undefined ? (
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#EEF2F6]">
            <div className="h-full rounded-full bg-[#0F4C5C] transition-[width] duration-500" style={{ width: `${Math.round(progreso * 100)}%` }} />
          </div>
          <span className="text-[11px] font-semibold text-[#64748B]">{extra}</span>
        </div>
      ) : (
        <p className={`mt-1 flex items-center gap-1 text-xs font-semibold ${tono === "up" ? "text-[#0F766E]" : "text-[#64748B]"}`}>
          {tono === "up" ? <Icon name="trend-up" className="size-3.5" strokeWidth={2.2} /> : null}
          {extra}
        </p>
      )}
    </div>
  );
}
