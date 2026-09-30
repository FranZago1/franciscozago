"use client";

import { useMemo, useState } from "react";
import {
  clases,
  clasePorId,
  coachPorId,
  diaPorId,
  dias,
  disciplinaPorId,
  disciplinas,
  horas,
  type Clase,
  type DiaId,
  type DisciplinaId,
} from "./datos";
import { useReserva } from "./Reserva";

const display = "[font-family:var(--font-fn-display)]";

function etiquetaLugares(c: Clase) {
  if (c.libres === 0) return "Completa";
  if (c.libres <= 2) return c.libres === 1 ? "Último lugar" : `Últimos ${c.libres}`;
  return `${c.libres} lugares`;
}

function ariaClase(c: Clase) {
  const d = disciplinaPorId[c.disciplina];
  const coach = coachPorId[c.coach].nombre.split(" ")[0];
  const lugares = c.libres === 0 ? "clase completa" : c.libres === 1 ? "queda 1 lugar" : `quedan ${c.libres} lugares`;
  return `${diaPorId[c.dia].largo} ${c.hora}, ${d.nombre} con ${coach}, ${lugares}`;
}

function Barra({ libres }: { libres: number }) {
  const ocupados = 12 - libres;
  return (
    <span aria-hidden="true" className="mt-2 flex gap-[2px]">
      {Array.from({ length: 12 }, (_, i) => (
        <span key={i} className={`h-1 flex-1 ${i < ocupados ? "bg-current opacity-80" : "bg-current opacity-20"}`} />
      ))}
    </span>
  );
}

export function Horarios() {
  const { filtro, setFiltro, claseId, elegirClase } = useReserva();
  const [diaMovil, setDiaMovil] = useState<DiaId>("lun");

  const visibles = useMemo(() => clases.filter((c) => filtro === "todas" || c.disciplina === filtro), [filtro]);
  const porCelda = useMemo(() => new Map(clases.map((c) => [`${c.dia}-${c.hora}`, c])), []);
  const elegida = claseId ? clasePorId[claseId] : undefined;

  const resumenFiltro =
    filtro === "todas"
      ? `Mostrando las ${visibles.length} clases de la semana`
      : `Mostrando ${visibles.length} clases de ${disciplinaPorId[filtro].nombre}`;

  const opciones: { id: DisciplinaId | "todas"; nombre: string; color?: string }[] = [
    { id: "todas", nombre: "Todas" },
    ...disciplinas.map((d) => ({ id: d.id, nombre: d.nombre, color: d.color })),
  ];

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div
          role="group"
          aria-label="Filtrar horarios por disciplina"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
        >
          {opciones.map((o) => {
            const activo = filtro === o.id;
            return (
              <button
                key={o.id}
                type="button"
                aria-pressed={activo}
                onClick={() => setFiltro(o.id)}
                className={`inline-flex shrink-0 items-center gap-2 border px-4 py-2.5 text-sm font-semibold tracking-wide uppercase transition-colors duration-200 ${
                  activo
                    ? "border-[#FF4D00] bg-[#FF4D00] text-black"
                    : "border-white/15 bg-white/[0.03] text-[#F2EEE6] hover:border-white/40 hover:bg-white/[0.07]"
                }`}
              >
                {o.color && (
                  <span
                    aria-hidden="true"
                    className={`size-2.5 ${activo ? "bg-black" : ""}`}
                    style={activo ? undefined : { backgroundColor: o.color }}
                  />
                )}
                {o.nombre}
              </button>
            );
          })}
        </div>
        <p className="text-sm text-white/55" aria-live="polite">
          {resumenFiltro}
        </p>
      </div>

      {/* Escritorio: grilla semanal completa */}
      <div className="mt-8 hidden md:block">
        <table className="w-full table-fixed border-collapse text-left">
          <caption className="sr-only">Horarios semanales de clases. Elegí una para precargar tu reserva.</caption>
          <thead>
            <tr>
              <th scope="col" className="w-20 pb-3 text-xs font-medium tracking-[0.2em] text-white/60 uppercase">
                Hora
              </th>
              {dias.map((d) => (
                <th key={d.id} scope="col" className={`${display} pb-3 text-2xl tracking-wide text-[#F2EEE6] uppercase`}>
                  <abbr title={d.largo} className="no-underline">
                    {d.corto}
                  </abbr>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horas.map((h) => (
              <tr key={h} className="border-t border-white/10">
                <th scope="row" className="py-2 pr-3 align-top text-sm font-semibold tabular-nums text-white/60">
                  <span className="mt-3 block">{h}</span>
                </th>
                {dias.map((d) => {
                  const c = porCelda.get(`${d.id}-${h}`);
                  if (!c) {
                    return (
                      <td key={d.id} className="p-1 align-top">
                        <div className="flex h-[92px] items-center justify-center border border-dashed border-white/[0.07] text-white/15" aria-hidden="true">
                          —
                        </div>
                      </td>
                    );
                  }
                  const oculto = filtro !== "todas" && c.disciplina !== filtro;
                  const disc = disciplinaPorId[c.disciplina];
                  const activa = c.id === claseId;
                  const completa = c.libres === 0;
                  return (
                    <td key={d.id} className="p-1 align-top">
                      {oculto ? (
                        <div className="h-[92px] border border-white/[0.05] bg-white/[0.015] p-3 opacity-40" aria-hidden="true">
                          <span className="text-xs font-semibold tracking-wide text-white/30 uppercase">{disc.nombre}</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={completa}
                          aria-pressed={activa}
                          aria-label={completa ? ariaClase(c) : `${ariaClase(c)}. Elegir esta clase`}
                          onClick={() => elegirClase(c.id)}
                          className={`group relative flex h-[92px] w-full flex-col justify-between overflow-hidden border p-3 text-left transition-[transform,background-color,border-color] duration-200 ${
                            activa
                              ? "border-[#FF4D00] bg-[#FF4D00] text-black"
                              : completa
                                ? "cursor-not-allowed border-white/10 bg-[repeating-linear-gradient(135deg,transparent_0_8px,rgba(255,255,255,0.04)_8px_16px)] text-white/35"
                                : "border-white/12 bg-[#141414] text-[#F2EEE6] hover:-translate-y-0.5 hover:border-[#FF4D00]/70 hover:bg-[#1b1b1b]"
                          }`}
                        >
                          <span className="flex items-start justify-between gap-2">
                            <span className={`${display} text-lg leading-none tracking-wide uppercase ${completa ? "line-through decoration-2" : ""}`}>
                              {disc.nombre}
                            </span>
                            {!activa && !completa && (
                              <span aria-hidden="true" className="mt-1 size-2 shrink-0" style={{ backgroundColor: disc.color }} />
                            )}
                          </span>
                          <span>
                            <span className="flex items-center justify-between text-xs">
                              <span className={activa ? "text-black/75" : "text-white/55"}>{coachPorId[c.coach].nombre.split(" ")[0]}</span>
                              <span
                                className={`font-semibold ${
                                  activa ? "text-black" : completa ? "" : c.libres <= 2 ? "text-[#FF6A2B]" : "text-white/80"
                                }`}
                              >
                                {etiquetaLugares(c)}
                              </span>
                            </span>
                            {!completa && <Barra libres={c.libres} />}
                          </span>
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: un día a la vez */}
      <div className="mt-6 md:hidden">
        <div role="group" aria-label="Elegir día" className="grid grid-cols-6 border border-white/15">
          {dias.map((d) => {
            const activo = d.id === diaMovil;
            const cantidad = visibles.filter((c) => c.dia === d.id).length;
            return (
              <button
                key={d.id}
                type="button"
                aria-pressed={activo}
                onClick={() => setDiaMovil(d.id)}
                className={`flex flex-col items-center py-2.5 transition-colors ${
                  activo ? "bg-[#F2EEE6] text-black" : "text-[#F2EEE6] hover:bg-white/5"
                } border-l border-white/15 first:border-l-0`}
              >
                <span className={`${display} text-xl uppercase`}>
                  {d.corto}
                  <span className="sr-only"> ({d.largo})</span>
                </span>
                <span className={`text-[11px] tabular-nums ${activo ? "text-black/60" : "text-white/60"}`}>{cantidad} cl.</span>
              </button>
            );
          })}
        </div>
        <ul className="mt-4 space-y-2">
          {visibles
            .filter((c) => c.dia === diaMovil)
            .map((c) => {
              const disc = disciplinaPorId[c.disciplina];
              const activa = c.id === claseId;
              const completa = c.libres === 0;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    disabled={completa}
                    aria-pressed={activa}
                    aria-label={completa ? ariaClase(c) : `${ariaClase(c)}. Elegir esta clase`}
                    onClick={() => elegirClase(c.id)}
                    className={`flex w-full items-center gap-4 border p-4 text-left transition-colors ${
                      activa
                        ? "border-[#FF4D00] bg-[#FF4D00] text-black"
                        : completa
                          ? "border-white/10 text-white/35"
                          : "border-white/12 bg-[#141414] text-[#F2EEE6] active:bg-[#1f1f1f]"
                    }`}
                  >
                    <span className={`${display} w-16 text-2xl tabular-nums`}>{c.hora}</span>
                    <span className="min-w-0 flex-1">
                      <span className={`${display} flex items-center gap-2 text-lg tracking-wide uppercase ${completa ? "line-through" : ""}`}>
                        {!activa && <span aria-hidden="true" className="size-2" style={{ backgroundColor: disc.color }} />}
                        {disc.nombre}
                      </span>
                      <span className={`block text-xs ${activa ? "text-black/70" : "text-white/55"}`}>
                        con {coachPorId[c.coach].nombre.split(" ")[0]}
                      </span>
                    </span>
                    <span className={`text-xs font-semibold ${activa ? "" : !completa && c.libres <= 2 ? "text-[#FF6A2B]" : ""}`}>
                      {etiquetaLugares(c)}
                    </span>
                  </button>
                </li>
              );
            })}
          {visibles.filter((c) => c.dia === diaMovil).length === 0 && (
            <li className="border border-dashed border-white/15 p-6 text-center text-sm text-white/55">
              No hay clases de {filtro !== "todas" ? disciplinaPorId[filtro].nombre : ""} este día. Probá con otro.
            </li>
          )}
        </ul>
      </div>

      <div
        aria-live="polite"
        className="mt-6 flex flex-col gap-4 border-l-4 border-[#FF4D00] bg-[#141414] p-5 sm:flex-row sm:items-center sm:justify-between"
      >
        {elegida ? (
          <>
            <p className="text-[#F2EEE6]">
              <span className="block text-xs font-semibold tracking-[0.2em] text-[#FF6A2B] uppercase">Elegiste</span>
              <span className={`${display} text-2xl uppercase`}>
                {diaPorId[elegida.dia].largo} {elegida.hora} · {disciplinaPorId[elegida.disciplina].nombre}
              </span>
              <span className="block text-sm text-white/60">
                Con {coachPorId[elegida.coach].nombre}. Ya lo cargamos en el formulario.
              </span>
            </p>
            <a
              href="#reserva"
              className="inline-flex shrink-0 items-center justify-center gap-2 bg-[#FF4D00] px-5 py-3 text-sm font-bold tracking-wide text-black uppercase transition-colors hover:bg-[#FF6A2B]"
            >
              Completar reserva
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </a>
          </>
        ) : (
          <p className="text-sm text-white/60">
            <span className="font-semibold text-[#F2EEE6]">Tocá una clase</span> para reservarla como clase de prueba. Las
            rayadas ya están completas.
          </p>
        )}
      </div>
    </div>
  );
}
