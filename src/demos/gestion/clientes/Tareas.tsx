"use client";

import { useMemo, useState } from "react";
import { Icon } from "../shared/Icon";
import { diaDiff, diaRelativo, hora } from "../shared/util";
import { USUARIO, type Tarea } from "./data";
import { useCrm } from "./context";
import { Avatar, btn, EtapaBadge, ICONO_TAREA, Vacio } from "./ui";

export function Tareas() {
  const { state, now, abrirNuevaTarea, cliente } = useCrm();
  const [soloMias, setSoloMias] = useState(false);

  const grupos = useMemo(() => {
    const visibles = state.tareas.filter((t) => {
      const c = cliente(t.clienteId);
      return c && (!soloMias || c.asesor === USUARIO);
    });
    const porFecha = (a: Tarea, b: Tarea) => a.fecha.localeCompare(b.fecha);
    const atrasadas = visibles.filter((t) => !t.hecha && diaDiff(t.fecha, now) < 0).sort(porFecha);
    const hoy = visibles.filter((t) => diaDiff(t.fecha, now) === 0).sort((a, b) => Number(a.hecha) - Number(b.hecha) || porFecha(a, b));
    const proximas = visibles.filter((t) => !t.hecha && diaDiff(t.fecha, now) > 0 && diaDiff(t.fecha, now) <= 7).sort(porFecha);
    return { atrasadas, hoy, proximas };
  }, [state.tareas, now, soloMias, cliente]);

  const hechasHoy = grupos.hoy.filter((t) => t.hecha).length;
  const totalHoy = grupos.hoy.length;
  const pct = totalHoy ? hechasHoy / totalHoy : 1;
  const fechaLarga = new Date(now).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#0F4C5C] first-letter:uppercase">{fechaLarga}</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0C3440] sm:text-[28px]">Tareas de hoy</h1>
        </div>
        <button type="button" className={btn.primario} onClick={() => abrirNuevaTarea()}>
          <Icon name="plus" className="size-4" strokeWidth={2.4} /> Nueva tarea
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,.04)] sm:flex-row sm:items-center sm:p-5">
        <div className="flex items-center gap-4">
          <Anillo pct={pct} />
          <div>
            <p className="text-lg font-extrabold text-[#0F172A]">
              {hechasHoy} de {totalHoy} hechas
            </p>
            <p className="text-sm text-[#64748B]">
              {grupos.atrasadas.length ? `${grupos.atrasadas.length} atrasada${grupos.atrasadas.length > 1 ? "s" : ""} de días anteriores` : "Nada atrasado. Bien ahí."}
            </p>
          </div>
        </div>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-[#334155] sm:ml-auto">
          <span className="relative inline-flex">
            <input type="checkbox" className="peer sr-only" checked={soloMias} onChange={(e) => setSoloMias(e.target.checked)} />
            <span className="h-6 w-10 rounded-full bg-[#CBD5E1] transition peer-checked:bg-[#0F4C5C] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#0F4C5C]" />
            <span className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
          </span>
          Solo mis clientes
        </label>
      </div>

      {grupos.atrasadas.length ? <Grupo titulo="Atrasadas" tono="rojo" tareas={grupos.atrasadas} /> : null}
      <Grupo titulo="Hoy" tareas={grupos.hoy} vacio />
      {grupos.proximas.length ? <Grupo titulo="Próximos 7 días" tareas={grupos.proximas} /> : null}
    </div>
  );
}

function Grupo({ titulo, tareas, tono, vacio }: { titulo: string; tareas: Tarea[]; tono?: "rojo"; vacio?: boolean }) {
  const { abrirNuevaTarea } = useCrm();
  return (
    <section className="mt-7" aria-labelledby={`g-${titulo}`}>
      <h2 id={`g-${titulo}`} className={`mb-3 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.08em] ${tono === "rojo" ? "text-[#B42318]" : "text-[#64748B]"}`}>
        {titulo}
        <span className={`rounded-full px-1.5 py-0.5 text-[11px] ${tono === "rojo" ? "bg-[#FEF1F0]" : "bg-[#E8EDF2]"}`}>{tareas.length}</span>
      </h2>
      {tareas.length ? (
        <ul className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,.04)]">
          {tareas.map((t) => (
            <FilaTarea key={t.id} t={t} />
          ))}
        </ul>
      ) : vacio ? (
        <Vacio icono="check" titulo="No hay tareas para hoy" texto="Agendá llamadas, visitas o envíos para no perder a ningún cliente.">
          <button type="button" className={btn.secundario} onClick={() => abrirNuevaTarea()}>
            <Icon name="plus" className="size-4" /> Nueva tarea
          </button>
        </Vacio>
      ) : null}
    </section>
  );
}

function FilaTarea({ t }: { t: Tarea }) {
  const { now, cliente, abrirFicha, completarTarea, reabrirTarea, posponerTarea } = useCrm();
  const c = cliente(t.clienteId);
  if (!c) return null;
  const d = diaDiff(t.fecha, now);
  const pasada = !t.hecha && (d < 0 || (d === 0 && Date.parse(t.fecha) < now));

  return (
    <li className={`flex items-start gap-3 border-b border-[#EEF2F6] px-3.5 py-3.5 last:border-0 sm:items-center sm:gap-4 sm:px-5 ${t.hecha ? "bg-[#FAFBFC]" : ""}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={t.hecha}
        aria-label={`${t.hecha ? "Marcar como pendiente" : "Marcar como hecha"}: ${t.texto}`}
        onClick={() => (t.hecha ? reabrirTarea(t.id) : completarTarea(t.id))}
        className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border-2 transition sm:mt-0 ${t.hecha ? "border-[#0F4C5C] bg-[#0F4C5C] text-white" : "border-[#B8C4D0] bg-white text-transparent hover:border-[#0F4C5C] hover:text-[#0F4C5C]/40"}`}
      >
        <Icon name="check" className="size-4" strokeWidth={3} />
      </button>
      <div className={`w-14 shrink-0 text-sm max-sm:hidden font-bold tabular-nums ${t.hecha ? "text-[#94A3B8]" : pasada ? "text-[#B42318]" : "text-[#0F172A]"}`}>
        {d === 0 ? hora(t.fecha) : <span className="text-xs leading-tight">{diaRelativo(t.fecha, now)}<br />{hora(t.fecha)}</span>}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`flex items-start gap-2 text-sm font-semibold ${t.hecha ? "text-[#94A3B8] line-through" : "text-[#0F172A]"}`}>
          <Icon name={ICONO_TAREA[t.tipo]} className="mt-0.5 size-4 shrink-0 text-[#64748B]" />
          {t.texto}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className={`text-xs font-bold tabular-nums sm:hidden ${t.hecha ? "text-[#94A3B8]" : pasada ? "text-[#B42318]" : "text-[#0F172A]"}`}>
            {d === 0 ? hora(t.fecha) : `${diaRelativo(t.fecha, now)} ${hora(t.fecha)}`}
          </span>
          <button type="button" onClick={() => abrirFicha(c.id)} className="inline-flex items-center gap-1.5 rounded-full py-0.5 pl-0.5 pr-2 text-xs font-bold text-[#0F4C5C] ring-1 ring-[#DCE5EA] hover:bg-[#E7F0F2]">
            <Avatar nombre={c.nombre} size="sm" />
            {c.nombre}
          </button>
          <span className="hidden sm:inline"><EtapaBadge etapa={c.etapa} /></span>
        </div>
      </div>
      {!t.hecha ? (
        <button type="button" onClick={() => posponerTarea(t.id)} className={`${btn.fantasma} shrink-0 text-xs`} aria-label={`Posponer para mañana: ${t.texto}`}>
          <Icon name="clock" className="size-4" />
          <span className="hidden sm:inline">Mañana</span>
        </button>
      ) : (
        <span className="shrink-0 text-xs font-semibold text-[#0F766E]">Hecha {t.hechaEn ? hora(t.hechaEn) : ""}</span>
      )}
    </li>
  );
}

function Anillo({ pct }: { pct: number }) {
  const r = 22;
  const l = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 56 56" className="size-14 -rotate-90" aria-hidden="true">
      <circle cx="28" cy="28" r={r} fill="none" stroke="#E8EDF2" strokeWidth="6" />
      <circle cx="28" cy="28" r={r} fill="none" stroke="#0F4C5C" strokeWidth="6" strokeLinecap="round" strokeDasharray={l} strokeDashoffset={l * (1 - pct)} className="transition-[stroke-dashoffset] duration-500" />
    </svg>
  );
}
