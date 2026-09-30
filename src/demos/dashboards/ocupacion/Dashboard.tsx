"use client";

import { useEffect, useMemo, useState } from "react";
import { PERIODOS, rng, suma, type Periodo } from "../shared/datos";
import { delta, deltaPp, numero, porcentaje } from "../shared/formato";
import { useNumeroAnimado } from "../shared/hooks";
import { SelectorPeriodo } from "../shared/SelectorPeriodo";
import {
  ACTIVIDADES,
  asistencia,
  ESPACIOS,
  filtrarEspacios,
  mapaDeCalor,
  nombreCeldaCorto,
  SEDES,
  socios,
  type ActividadId,
  type SedeId,
} from "./datos";
import { ALTAS, AltasBajas, Asistencia, BAJAS, LeyendaCalor, MapaCalor, Medidor, nivel } from "./Graficos";

const tema = {
  "--dv-surface": "#ffffff",
  "--dv-ink": "#0f1f18",
  "--dv-ink2": "#3d4a43",
  "--dv-muted": "#707b74",
  "--dv-grid": "#edf0ea",
  "--dv-axis": "#c9d1c4",
  "--dv-tip-bg": "#0f2a1f",
  "--dv-tip-ink": "#ffffff",
  "--dv-tip-ink2": "#b9c9bf",
  "--dv-tip-border": "#1f4a37",
  "--dv-focus": "#2a7336",
} as React.CSSProperties;

const cond = "font-[family-name:var(--font-pa-cond)]";

const NAV = [
  ["#ahora", "En vivo"],
  ["#ocupacion", "Ocupación"],
  ["#clases", "Clases"],
  ["#socios", "Socios"],
] as const;

function Marca({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
      <rect width="36" height="36" rx="8" fill="#c8f169" />
      <path d="M6 26 14.5 12l5 8 3-4.5L30 26Z" fill="#0e3b27" />
      <circle cx="25.5" cy="10.5" r="2.6" fill="#0e3b27" />
    </svg>
  );
}

function Seccion({
  id,
  titulo,
  bajada,
  accion,
  children,
  className = "",
}: {
  id?: string;
  titulo: string;
  bajada?: React.ReactNode;
  accion?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-t` : undefined}
      className={`min-w-0 scroll-mt-40 rounded-[8px] border border-[#e3e7df] bg-white p-4 sm:p-6 ${className}`}
    >
      <header className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <h2 id={id ? `${id}-t` : undefined} className={`${cond} text-[22px] leading-none font-semibold tracking-[0.01em] uppercase`}>
            {titulo}
          </h2>
          {bajada ? <p className="mt-1.5 text-[13px] text-[#5b6660]">{bajada}</p> : null}
        </div>
        {accion}
      </header>
      {children}
    </section>
  );
}

function Kpi({
  etiqueta,
  valor,
  detalle,
  acento = false,
}: {
  etiqueta: string;
  valor: React.ReactNode;
  detalle: React.ReactNode;
  acento?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[8px] border p-4 sm:p-5 ${
        acento ? "border-[#0e3b27] bg-[#0e3b27] text-white" : "border-[#e3e7df] bg-white"
      }`}
    >
      <p className={`text-[12px] font-semibold tracking-[0.08em] uppercase ${acento ? "text-[#c8f169]" : "text-[#5b6660]"}`}>{etiqueta}</p>
      <p className={`${cond} mt-2 text-[34px] leading-none font-semibold sm:text-[42px]`}>{valor}</p>
      <div className={`mt-2 text-[12.5px] ${acento ? "text-[#cfe0d4]" : "text-[#5b6660]"}`}>{detalle}</div>
    </div>
  );
}

function Cambio({ v, pp = false, invertido = false, oscuro = false }: { v: number; pp?: boolean; invertido?: boolean; oscuro?: boolean }) {
  const bueno = invertido ? v <= 0 : v >= 0;
  const color = oscuro ? (bueno ? "text-[#c8f169]" : "text-[#ffb59a]") : bueno ? "text-[#23612d]" : "text-[#b3261e]";
  return (
    <span className={`font-semibold tabular-nums ${color}`}>
      <span aria-hidden="true">{v >= 0 ? "▲" : "▼"}</span> {pp ? deltaPp(v) : delta(v)}
    </span>
  );
}

/** Ocupación en vivo: se actualiza sola cada pocos segundos (solo en el navegador). */
function EnVivo({ sede, act }: { sede: SedeId; act: ActividadId }) {
  const [ahora, setAhora] = useState<Record<string, number>>(() => Object.fromEntries(ESPACIOS.map((e) => [e.id, e.ahora])));
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    let tick = 0;
    const r = rng(4242);
    const id = window.setInterval(() => {
      setSegundos((s) => s + 1);
    }, 1000);
    const id2 = window.setInterval(() => {
      tick++;
      setAhora((prev) => {
        const next: Record<string, number> = {};
        for (const e of ESPACIOS) {
          const v = prev[e.id] ?? 0;
          const paso = Math.round(r.normal() * Math.max(1, e.capacidad * 0.05));
          next[e.id] = Math.max(0, Math.min(e.capacidad, v + paso + (tick % 5 === 0 ? 1 : 0)));
        }
        return next;
      });
      setSegundos(0);
    }, 5000);
    return () => {
      window.clearInterval(id);
      window.clearInterval(id2);
    };
  }, []);

  const lista = filtrarEspacios(sede, act);
  const ocupados = suma(lista.map((e) => ahora[e.id] ?? 0));
  const capacidad = suma(lista.map((e) => e.capacidad));
  const p = capacidad ? ocupados / capacidad : 0;
  const animado = useNumeroAnimado(ocupados);
  const n = nivel(p);

  return (
    <section id="ahora" aria-labelledby="ahora-t" className="scroll-mt-40 grid gap-3 lg:grid-cols-[300px_1fr]">
      <div className="relative flex flex-col overflow-hidden rounded-[8px] bg-[#0e3b27] p-5 text-white sm:p-6">
        <svg viewBox="0 0 300 200" className="pointer-events-none absolute -right-10 -bottom-10 w-[260px] opacity-[0.12]" aria-hidden="true">
          <path d="M0 200 110 40l60 90 36-50 94 120Z" fill="#c8f169" />
        </svg>
        <div className="flex items-center gap-2">
          <span className="dv-pulso size-2.5 rounded-full bg-[#c8f169]" aria-hidden="true" />
          <h2 id="ahora-t" className="text-[12px] font-semibold tracking-[0.1em] text-[#c8f169] uppercase">
            En vivo · ahora
          </h2>
        </div>
        <p className={`${cond} mt-4 text-[72px] leading-[0.85] font-semibold`}>{numero(animado)}</p>
        <p className="mt-2 text-[14px] text-[#cfe0d4]">
          personas entrenando de {numero(capacidad)} lugares
        </p>
        <div className="mt-5 h-2.5 rounded-full bg-white/12">
          <div className="dv-barra h-full rounded-full" style={{ width: `${p * 100}%`, background: "#c8f169" }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-[12.5px]">
          <span className="font-semibold">{porcentaje(p, 0)} ocupado</span>
          <span className="text-[#cfe0d4]">{n.texto}</span>
        </div>
        <dl className="mt-6 grid gap-2.5 border-t border-white/10 pt-4 text-[13px]">
          {(["centro", "cerro"] as const).map((sd) => {
            const es = lista.filter((e) => e.sede === sd);
            if (!es.length) return null;
            const o = suma(es.map((e) => ahora[e.id] ?? 0));
            const c = suma(es.map((e) => e.capacidad));
            return (
              <div key={sd} className="flex items-center gap-3">
                <dt className="w-[92px] shrink-0 text-[#cfe0d4]">{sd === "centro" ? "Sede Centro" : "Sede Cerro"}</dt>
                <dd className="h-1.5 flex-1 rounded-full bg-white/12">
                  <span className="dv-barra block h-full rounded-full bg-white/70" style={{ width: `${(o / c) * 100}%` }} />
                </dd>
                <dd className="w-[54px] text-right font-semibold tabular-nums">
                  {o}/{c}
                </dd>
              </div>
            );
          })}
          <div className="flex items-center gap-3">
            <dt className="w-[92px] shrink-0 text-[#cfe0d4]">Próximo pico</dt>
            <dd className="font-semibold">19 a 21 h · se esperan +20 %</dd>
          </div>
        </dl>
        <p className="mt-auto pt-6 text-[12px] text-[#9fb8a8]" aria-live="off">
          Martes 29 de septiembre · actualizado {segundos < 2 ? "recién" : `hace ${segundos} s`}
        </p>
      </div>
      <div className="rounded-[8px] border border-[#e3e7df] bg-[#fbfcf9] p-3 sm:p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
          <p className={`${cond} text-[18px] font-semibold uppercase`}>Salas y canchas</p>
          <ul className="flex flex-wrap gap-3 text-[11.5px] text-[#5b6660]" aria-label="Niveles">
            <li className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#2a7336]" aria-hidden="true" /> Tranquilo &lt; 60 %
            </li>
            <li className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#e6a100]" aria-hidden="true" /> Movido
            </li>
            <li className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#d03b3b]" aria-hidden="true" /> Casi lleno ≥ 85 %
            </li>
          </ul>
        </div>
        {lista.length ? (
          <ul className="grid gap-2 min-[520px]:grid-cols-2 sm:grid-cols-3 sm:gap-2.5 xl:grid-cols-5">
            {lista.map((e) => (
              <Medidor
                key={e.id}
                nombre={e.nombre}
                sede={e.sede === "centro" ? "Sede Centro" : "Sede Cerro"}
                ocupados={ahora[e.id] ?? 0}
                capacidad={e.capacidad}
              />
            ))}
          </ul>
        ) : (
          <p className="py-12 text-center text-[14px] text-[#5b6660]">
            Esta sede no tiene espacios para la actividad elegida.
          </p>
        )}
      </div>
    </section>
  );
}

export function OcupacionDashboard() {
  const [periodo, setPeriodo] = useState<Periodo>("30d");
  const [sede, setSede] = useState<SedeId>("todas");
  const [act, setAct] = useState<ActividadId>("todas");
  const info = PERIODOS.find((p) => p.id === periodo)!;

  const espacios = filtrarEspacios(sede, act);
  const capacidad = suma(espacios.map((e) => e.capacidad));
  const celdas = useMemo(() => mapaDeCalor(sede, act, periodo), [sede, act, periodo]);
  const celdasAnt = useMemo(() => mapaDeCalor(sede, act, periodo, "-ant"), [sede, act, periodo]);
  const clases = useMemo(() => asistencia(sede, act, periodo), [sede, act, periodo]);
  const soc = useMemo(() => socios(sede, act, periodo), [sede, act, periodo]);

  const abiertas = celdas.filter((c) => c.valor !== null);
  const promedio = abiertas.length ? suma(abiertas.map((c) => c.valor!)) / abiertas.length : 0;
  const abiertasAnt = celdasAnt.filter((c) => c.valor !== null);
  const promedioAnt = abiertasAnt.length ? (suma(abiertasAnt.map((c) => c.valor!)) / abiertasAnt.length) * 0.97 : 0;
  const pico = abiertas.reduce((a, c) => (c.valor! > (a?.valor ?? -1) ? c : a), abiertas[0]);
  const ratioClases = clases.length ? suma(clases.map((c) => c.promedio)) / suma(clases.map((c) => c.cupo)) : 0;
  const totalClases = suma(clases.map((c) => c.total));

  const promedioAnim = useNumeroAnimado(promedio);
  const activosAnim = useNumeroAnimado(soc.activos);
  const sesionesTexto = periodo === "7d" ? "en 7 días" : periodo === "30d" ? "en 30 días" : "en 12 meses";

  const hayEspacios = espacios.length > 0;

  return (
    <div style={tema} className="min-h-dvh bg-[#f2f4ef] font-[family-name:var(--font-pa)] text-[#0f1f18] antialiased">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded focus:bg-white focus:px-3 focus:py-2"
      >
        Saltar al contenido
      </a>

      {/* Banda superior verde */}
      <div className="bg-[#0e3b27] text-white">
        <header className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-x-8 gap-y-3 px-4 pt-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <Marca className="size-9" />
            <div className="leading-none">
              <p className={`${cond} text-[21px] font-bold tracking-[0.04em] uppercase`}>Punto Alto</p>
              <p className="mt-0.5 text-[11px] tracking-[0.12em] text-[#9fb8a8] uppercase">Complejo deportivo</p>
            </div>
          </div>
          <nav aria-label="Secciones" className="order-last -mx-4 w-[calc(100%+2rem)] overflow-x-auto px-4 sm:order-none sm:mx-0 sm:w-auto sm:px-0">
            <ul className="flex gap-1">
              {NAV.map(([href, texto], i) => (
                <li key={href}>
                  <a
                    href={href}
                    className={`block rounded-t-[6px] border-b-2 px-3 py-2.5 text-[13.5px] font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#c8f169] ${
                      i === 0 ? "border-[#c8f169] text-white" : "border-transparent text-[#b9c9bf] hover:text-white"
                    }`}
                  >
                    {texto}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-[12.5px] text-[#b9c9bf] md:inline">Mar 29 sep · 18:40 h</span>
            <span className="grid size-8 place-items-center rounded-full bg-[#c8f169] text-[12px] font-bold text-[#0e3b27]" aria-label="Gonzalo Ríos, encargado">
              GR
            </span>
          </div>
        </header>
        <div className="mx-auto max-w-[1320px] px-4 pt-7 pb-20 sm:px-6 lg:px-8 lg:pt-9">
          <p className="text-[12px] font-semibold tracking-[0.14em] text-[#c8f169] uppercase">Panel de ocupación</p>
          <h1 className={`${cond} mt-1.5 text-[38px] leading-[0.95] font-bold uppercase sm:text-[52px]`}>¿Cuándo se llena el complejo?</h1>
          <p className="mt-3 max-w-[560px] text-[14.5px] text-[#cfe0d4]">
            Mirá la ocupación por día y hora, cómo vienen las clases y cuántos socios entran y se van. Filtrá por sede o actividad.
          </p>
        </div>
      </div>

      <main id="contenido" className="mx-auto -mt-12 max-w-[1320px] px-4 pb-28 sm:px-6 lg:px-8">
        {/* Filtros: una sola fila arriba de todo lo que afectan */}
        <div className="relative z-20 -mx-4 mb-4 lg:sticky lg:top-0 px-4 pt-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div
            role="toolbar"
            aria-label="Filtros del tablero"
            className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-[8px] border border-[#e3e7df] bg-white/95 p-3 shadow-[0_6px_24px_-12px_rgba(14,59,39,0.35)] backdrop-blur sm:p-3.5"
          >
            <label className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.06em] text-[#5b6660] uppercase">
              Sede
              <select
                value={sede}
                onChange={(e) => setSede(e.target.value as SedeId)}
                className="h-9 rounded-[6px] border border-[#d5dccf] bg-white px-2.5 text-[13.5px] font-medium tracking-normal text-[#0f1f18] normal-case focus:border-[#2a7336] focus:outline-2 focus:outline-offset-1 focus:outline-[#2a7336]"
              >
                {SEDES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </label>
            <div className="order-last w-full min-w-0 lg:order-none lg:w-auto lg:flex-1">
              <div role="group" aria-label="Actividad" className="dv-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5">
                {ACTIVIDADES.map((a) => {
                  const on = a.id === act;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setAct(a.id)}
                      className={`h-9 shrink-0 rounded-full border px-3.5 text-[13px] font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2a7336] ${
                        on ? "border-[#0e3b27] bg-[#0e3b27] text-[#c8f169]" : "border-[#d5dccf] bg-white text-[#3d4a43] hover:border-[#9fb49a]"
                      }`}
                    >
                      {a.nombre}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="ml-auto">
              <SelectorPeriodo
                valor={periodo}
                onCambio={setPeriodo}
                clases={{
                  grupo: "inline-flex rounded-[6px] bg-[#edf1e8] p-1",
                  opcion:
                    "rounded-[4px] px-3 py-1.5 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2a7336]",
                  activa: "bg-[#0e3b27] text-[#c8f169] shadow-sm",
                  inactiva: "text-[#3d4a43] hover:bg-white",
                }}
              />
            </div>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {`${SEDES.find((s) => s.id === sede)!.nombre}, ${act === "todas" ? "todas las actividades" : ACTIVIDADES.find((a) => a.id === act)!.nombre}, ${info.largo.toLowerCase()}.`}
        </p>

        <EnVivo sede={sede} act={act} />

        {/* KPIs */}
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi
            etiqueta="Ocupación promedio"
            valor={hayEspacios ? porcentaje(promedioAnim, 0) : "—"}
            detalle={
              hayEspacios ? (
                <>
                  <Cambio v={promedio - promedioAnt} pp /> <span className="hidden sm:inline">{info.anterior}</span>
                </>
              ) : (
                "Sin espacios para este filtro"
              )
            }
          />
          <Kpi
            etiqueta="Hora pico"
            valor={pico ? nombreCeldaCorto(pico) : "—"}
            detalle={pico ? `${porcentaje(pico.valor!, 0)} de ocupación` : "—"}
          />
          <Kpi
            etiqueta="Clases"
            valor={clases.length ? porcentaje(ratioClases, 0) : "—"}
            detalle={clases.length ? `del cupo · ${numero(totalClases)} asistencias` : "Sin clases grupales"}
          />
          <Kpi
            acento
            etiqueta="Socios activos"
            valor={numero(activosAnim)}
            detalle={
              <>
                <span className="font-semibold text-[#c8f169]">
                  {soc.neto >= 0 ? "+" : "−"}
                  {numero(Math.abs(soc.neto))}
                </span>{" "}
                netos {sesionesTexto}
              </>
            }
          />
        </div>

        <Seccion
          id="ocupacion"
          titulo="Ocupación por día y hora"
          bajada={`Promedio de ${info.largo.toLowerCase()}. Pasá el mouse o usá las flechas para ver cada franja.`}
          className="mt-3"
          accion={<LeyendaCalor />}
        >
          {hayEspacios ? (
            <MapaCalor celdas={celdas} capacidad={capacidad} />
          ) : (
            <p className="py-12 text-center text-[14px] text-[#5b6660]">Esta sede no tiene espacios para la actividad elegida.</p>
          )}
          {pico ? (
            <p className="mt-4 rounded-[6px] bg-[#f3f7ec] px-3.5 py-2.5 text-[13px] text-[#2c3a32]">
              <strong className="font-semibold">Dato para la grilla:</strong> la franja más llena es {nombreCeldaCorto(pico)} (
              {porcentaje(pico.valor!, 0)}). Sumar un turno o una clase paralela en ese horario libera la sala.
            </p>
          ) : null}
        </Seccion>

        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <Seccion
            id="clases"
            titulo="Asistencia por clase"
            bajada="Promedio de personas por clase sobre el cupo"
          >
            <Asistencia datos={clases} sesionesTexto={sesionesTexto} />
          </Seccion>

          <Seccion
            id="socios"
            titulo="Altas y bajas de socios"
            bajada={periodo === "12m" ? "Por mes" : "Por día"}
            accion={
              <ul className="flex gap-4 text-[12px] text-[#3d4a43]" aria-label="Referencias">
                <li className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-[3px]" style={{ background: ALTAS }} aria-hidden="true" /> Altas
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-[3px]" style={{ background: BAJAS }} aria-hidden="true" /> Bajas
                </li>
              </ul>
            }
          >
            <dl className="mb-5 grid grid-cols-3 divide-x divide-[#edf0ea] rounded-[6px] border border-[#edf0ea]">
              <div className="p-3">
                <dt className="text-[11.5px] font-semibold tracking-[0.06em] text-[#5b6660] uppercase">Altas</dt>
                <dd className={`${cond} mt-1 text-[28px] leading-none font-semibold`}>{numero(soc.altas)}</dd>
                <dd className="mt-1 text-[12px]">
                  <Cambio v={soc.varAltas} />
                </dd>
              </div>
              <div className="p-3">
                <dt className="text-[11.5px] font-semibold tracking-[0.06em] text-[#5b6660] uppercase">Bajas</dt>
                <dd className={`${cond} mt-1 text-[28px] leading-none font-semibold`}>{numero(soc.bajas)}</dd>
                <dd className="mt-1 text-[12px]">
                  <Cambio v={soc.varBajas} invertido />
                </dd>
              </div>
              <div className="p-3">
                <dt className="text-[11.5px] font-semibold tracking-[0.06em] text-[#5b6660] uppercase">Rotación</dt>
                <dd className={`${cond} mt-1 text-[28px] leading-none font-semibold`}>{porcentaje(soc.rotacion)}</dd>
                <dd className="mt-1 text-[12px] text-[#5b6660]">mensual</dd>
              </div>
            </dl>
            <AltasBajas puntos={soc.puntos} />
          </Seccion>
        </div>

        <footer className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-[#dfe4da] pt-6 text-[12px] text-[#5b6660] sm:flex-row">
          <p>Complejo Punto Alto · Sede Centro y Sede Cerro</p>
          <p>Demo con contenido ficticio</p>
        </footer>
      </main>
    </div>
  );
}
