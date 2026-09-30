"use client";

import { useState } from "react";
import { ticksLindos } from "../shared/datos";
import { decimal, numero, porcentaje } from "../shared/formato";
import { useAncho, useRecorrido, useTransicion } from "../shared/hooks";
import { TipFila, TipTitulo, Tooltip } from "../shared/Tooltip";
import { FILAS_DIA, HORAS, nombreCelda, type Celda } from "./datos";
import { DIAS } from "../shared/formato";

/** Rampa secuencial de un solo tono (verde), de claro a oscuro. 5 tramos de 20 %. */
export const RAMPA = ["#dcebc7", "#a6d073", "#5fa343", "#2a7336", "#0e3b27"];
export const tramo = (v: number) => Math.min(4, Math.floor(v * 5));
/** Polos del gráfico divergente (validados en modo claro): altas azul noche, bajas naranja. */
export const ALTAS = "#2566a8";
export const BAJAS = "#e0662f";

// ---------------------------------------------------------------- Mapa de calor

export function MapaCalor({ celdas, capacidad }: { celdas: Celda[]; capacidad: number }) {
  const { ref, ancho, medido } = useAncho<HTMLDivElement>(720);
  const cols = HORAS.length;
  const filas = FILAS_DIA.length;
  const { valores } = useTransicion(celdas.map((c) => c.valor ?? 0));
  const [activo, setActivo] = useState<number | null>(null);

  const izq = 38;
  const gap = 2;
  const cw = (ancho - izq) / cols;
  const ch = Math.max(26, Math.min(40, cw * 0.78));
  const alto = filas * ch + 24;
  const pasoHora = cw < 26 ? 3 : cw < 40 ? 2 : 1;

  const pico = celdas.reduce((best, c, i) => ((c.valor ?? -1) > (celdas[best]!.valor ?? -1) ? i : best), 0);

  const mover = (e: React.KeyboardEvent) => {
    const i = activo ?? pico;
    let f = Math.floor(i / cols);
    let c = i % cols;
    if (e.key === "ArrowRight") c = Math.min(cols - 1, c + 1);
    else if (e.key === "ArrowLeft") c = Math.max(0, c - 1);
    else if (e.key === "ArrowDown") f = Math.min(filas - 1, f + 1);
    else if (e.key === "ArrowUp") f = Math.max(0, f - 1);
    else if (e.key === "Home") c = 0;
    else if (e.key === "End") c = cols - 1;
    else if (e.key === "Escape") {
      setActivo(null);
      return;
    } else return;
    e.preventDefault();
    setActivo(f * cols + c);
  };

  const act = activo !== null ? celdas[activo] : null;
  const ax = activo !== null ? izq + (activo % cols) * cw + cw / 2 : 0;
  const ay = activo !== null ? Math.floor(activo / cols) * ch : 0;

  return (
    <div ref={ref} className="relative">
      <div
        tabIndex={0}
        role="group"
        aria-label="Mapa de calor de ocupación por día y hora. Usá las flechas para recorrer las celdas."
        onKeyDown={mover}
        onFocus={() => setActivo((a) => a ?? pico)}
        onBlur={() => setActivo(null)}
        className="dv-chart dv-medir"
        style={{ opacity: medido ? 1 : 0 }}
      >
        <svg width="100%" height={alto} viewBox={`0 0 ${ancho} ${alto}`} aria-hidden="true" className="block">
          <defs>
            <pattern id="pa-cerrado" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="6" height="6" fill="#f3f4f1" />
              <line x1="0" y1="0" x2="0" y2="6" stroke="#dfe2da" strokeWidth="2" />
            </pattern>
          </defs>
          {FILAS_DIA.map((d, f) => (
            <text key={d} x={0} y={f * ch + ch / 2} dy="0.34em" fontSize={12} fill="var(--dv-ink2)" fontWeight={500}>
              {DIAS[d]}
            </text>
          ))}
          {HORAS.map((h, c) =>
            c % pasoHora === 0 ? (
              <text
                key={h}
                x={izq + c * cw + cw / 2}
                y={filas * ch + 16}
                textAnchor="middle"
                fontSize={11}
                fill="var(--dv-muted)"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {h}
              </text>
            ) : null,
          )}
          <g onPointerLeave={() => setActivo(null)}>
            {celdas.map((c, i) => {
              const f = Math.floor(i / cols);
              const col = i % cols;
              const v = valores[i] ?? 0;
              return (
                <rect
                  key={`${c.dia}-${c.hora}`}
                  x={izq + col * cw + gap / 2}
                  y={f * ch + gap / 2}
                  width={Math.max(1, cw - gap)}
                  height={ch - gap}
                  rx={3}
                  fill={c.valor === null ? "url(#pa-cerrado)" : RAMPA[tramo(v)]}
                  stroke={activo === i ? "var(--dv-ink)" : "none"}
                  strokeWidth={2}
                  onPointerEnter={() => setActivo(i)}
                  onPointerDown={() => setActivo(i)}
                  style={{ transition: "fill 240ms" }}
                />
              );
            })}
          </g>
          {/* Marca del pico */}
          {activo === null ? (
            <circle
              cx={izq + (pico % cols) * cw + cw / 2}
              cy={Math.floor(pico / cols) * ch + ch / 2}
              r={3.5}
              fill="#c8f169"
              stroke="#0e3b27"
              strokeWidth={1.5}
            />
          ) : null}
        </svg>
      </div>
      {act ? (
        <Tooltip x={ax} y={ay} ancho={ancho} visible debajo={ay < 60}>
          <TipTitulo>{nombreCelda(act)}</TipTitulo>
          {act.valor === null ? (
            <TipFila valor="Cerrado" nombre="fuera de horario" />
          ) : (
            <>
              <TipFila color={RAMPA[tramo(act.valor)]} forma="cuadro" valor={porcentaje(act.valor, 0)} nombre="de ocupación" />
              <TipFila valor={`≈ ${numero(act.valor * capacidad)} de ${numero(capacidad)}`} nombre="lugares" />
            </>
          )}
        </Tooltip>
      ) : null}
      <p className="sr-only" aria-live="polite">
        {act ? `${nombreCelda(act)}: ${act.valor === null ? "cerrado" : porcentaje(act.valor, 0)}` : ""}
      </p>
      <div className="sr-only">
        <table>
          <caption>Ocupación promedio por día y hora</caption>
          <thead>
            <tr>
              <th scope="col">Día</th>
              {HORAS.map((h) => (
                <th key={h} scope="col">
                  {h} h
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FILAS_DIA.map((d, f) => (
              <tr key={d}>
                <th scope="row">{DIAS[d]}</th>
                {HORAS.map((h, c) => {
                  const v = celdas[f * cols + c]!.valor;
                  return <td key={h}>{v === null ? "cerrado" : porcentaje(v, 0)}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function LeyendaCalor() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-[#5b6660]">
      <div className="flex items-center gap-2">
        <span>Menos</span>
        <span className="flex gap-[2px]" aria-hidden="true">
          {RAMPA.map((c) => (
            <span key={c} className="h-3 w-6 rounded-[2px]" style={{ background: c }} />
          ))}
        </span>
        <span>Más</span>
        <span className="sr-only">Escala de ocupación en tramos de 20 %: de 0 a 100 %</span>
      </div>
      <span className="hidden text-[#707873] sm:inline" aria-hidden="true">
        0 · 20 · 40 · 60 · 80 · 100 %
      </span>
      <span className="flex items-center gap-1.5">
        <span
          aria-hidden="true"
          className="h-3 w-5 rounded-[2px] border border-[#dfe2da]"
          style={{ background: "repeating-linear-gradient(45deg,#f3f4f1 0 3px,#dfe2da 3px 5px)" }}
        />
        Cerrado
      </span>
      <span className="flex items-center gap-1.5">
        <span aria-hidden="true" className="size-2.5 rounded-full border-[1.5px] border-[#0e3b27] bg-[#c8f169]" />
        Pico
      </span>
    </div>
  );
}

// ---------------------------------------------------------------- Medidor en vivo

export function nivel(p: number) {
  if (p >= 0.85) return { texto: "Casi lleno", color: "#d03b3b", pista: "#f7dede", tinta: "#a32626" };
  if (p >= 0.6) return { texto: "Movido", color: "#e6a100", pista: "#fbeecd", tinta: "#8a5a00" };
  return { texto: "Tranquilo", color: "#2a7336", pista: "#dcebc7", tinta: "#23612d" };
}

function IcoNivel({ p }: { p: number }) {
  const props = {
    width: 14,
    height: 14,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    "aria-hidden": true,
  };
  if (p >= 0.85)
    return (
      <svg {...props}>
        <path d="M8 2.5 14 13H2Z" strokeLinejoin="round" />
        <path d="M8 6.5v3M8 11.3v.1" />
      </svg>
    );
  if (p >= 0.6)
    return (
      <svg {...props}>
        <circle cx="8" cy="8" r="5.8" />
        <path d="M8 4.8V8l2.2 1.4" />
      </svg>
    );
  return (
    <svg {...props}>
      <circle cx="8" cy="8" r="5.8" />
      <path d="m5.4 8.2 1.8 1.8 3.4-3.6" />
    </svg>
  );
}

export function Medidor({ nombre, sede, ocupados, capacidad }: { nombre: string; sede: string; ocupados: number; capacidad: number }) {
  const p = capacidad ? ocupados / capacidad : 0;
  const n = nivel(p);
  // Arco de 240°.
  const R = 40;
  const cx = 50;
  const cy = 50;
  const a0 = (150 * Math.PI) / 180;
  const a1 = (390 * Math.PI) / 180;
  const pt = (a: number) => `${(cx + R * Math.cos(a)).toFixed(2)},${(cy + R * Math.sin(a)).toFixed(2)}`;
  const arco = `M${pt(a0)} A${R},${R} 0 1 1 ${pt(a1)}`;
  return (
    <li
      tabIndex={0}
      aria-label={`${nombre}, ${sede}: ${ocupados} de ${capacidad} lugares ocupados, ${porcentaje(p, 0)}. ${n.texto}.`}
      className="dv-chart group flex items-center gap-3 rounded-[6px] border border-[#e3e7df] bg-white px-3 py-2.5 transition-colors hover:border-[#c9d3c1] sm:flex-col sm:gap-0 sm:px-3 sm:pt-3 sm:pb-3.5 sm:text-center"
    >
      <div className="relative w-[74px] shrink-0 sm:w-full sm:max-w-[132px]">
        <svg viewBox="0 0 100 86" className="block w-full" aria-hidden="true">
          <path d={arco} fill="none" stroke={n.pista} strokeWidth={9} strokeLinecap="round" style={{ transition: "stroke 300ms" }} />
          <path
            d={arco}
            fill="none"
            stroke={n.color}
            strokeWidth={9}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${Math.max(0.5, p * 100)} 100`}
            className="dv-arco"
          />
        </svg>
        <div className="absolute inset-x-0 top-[36%] flex flex-col items-center leading-none sm:top-[34%]">
          <span className="font-[family-name:var(--font-pa-cond)] text-[19px] font-semibold text-[#0f1f18] sm:text-[28px]">
            {Math.round(p * 100)}
            <span className="text-[12px] sm:text-[16px]">%</span>
          </span>
          <span className="mt-1 hidden text-[11.5px] text-[#5b6660] tabular-nums sm:block">
            {ocupados}/{capacidad}
          </span>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start sm:items-center">
        <p className="mt-0.5 text-[13px] leading-tight font-semibold text-[#0f1f18]">{nombre}</p>
        <p className="text-[11.5px] text-[#6b756f]">
          {sede}
          <span className="tabular-nums sm:hidden">
            {" "}
            · {ocupados}/{capacidad}
          </span>
        </p>
        <span
          className="mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-semibold"
          style={{ background: n.pista, color: n.tinta }}
        >
          <IcoNivel p={p} />
          {n.texto}
        </span>
      </div>
    </li>
  );
}

// ---------------------------------------------------------------- Asistencia por clase

export function Asistencia({
  datos,
  sesionesTexto,
}: {
  datos: {
    id: string;
    nombre: string;
    horario: string;
    cupo: number;
    promedio: number;
    ratio: number;
    total: number;
  }[];
  sesionesTexto: string;
}) {
  const { ref, ancho } = useAncho<HTMLDivElement>(560);
  const { activo, marcar, contenedor } = useRecorrido(datos.length);
  const FILA = 56;
  if (!datos.length)
    return <p className="py-10 text-center text-[14px] text-[#5b6660]">No hay clases grupales para este filtro.</p>;
  const d = activo !== null ? datos[activo] : null;
  return (
    <div ref={ref} className="relative">
      <div
        {...contenedor}
        role="group"
        aria-label="Asistencia promedio por clase. Usá las flechas para recorrer las clases."
        className="dv-chart"
      >
        <ul onPointerLeave={() => marcar(null)}>
          {datos.map((c, i) => {
            const lleno = c.ratio >= 0.9;
            return (
              <li
                key={c.id}
                style={{ height: FILA }}
                onPointerEnter={() => marcar(i)}
                className="flex flex-col justify-center"
              >
                <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[13px]">
                  <span className="min-w-0 truncate">
                    <span className="font-semibold text-[#0f1f18]">{c.nombre}</span>
                    <span className="ml-2 text-[12px] text-[#6b756f]">{c.horario}</span>
                  </span>
                  <span className="shrink-0 tabular-nums">
                    <span className="font-semibold text-[#0f1f18]">{porcentaje(c.ratio, 0)}</span>
                    <span className="ml-1.5 hidden text-[12px] text-[#6b756f] sm:inline">
                      {decimal(c.promedio)} de {c.cupo}
                    </span>
                  </span>
                </div>
                <div className="relative h-3 rounded-[3px] bg-[#edf1e8]">
                  <div
                    className="dv-barra absolute inset-y-0 left-0 rounded-r-[4px] rounded-l-[2px]"
                    style={{
                      width: `${c.ratio * 100}%`,
                      background: activo === null || activo === i ? (lleno ? "#0e3b27" : "#2a7336") : "#a6d073",
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      {d && activo !== null ? (
        <Tooltip x={Math.max(80, d.ratio * ancho)} y={activo * FILA + 22} ancho={ancho} visible>
          <TipTitulo>
            {d.nombre} · {d.horario}
          </TipTitulo>
          <TipFila color="#2a7336" forma="cuadro" valor={`${decimal(d.promedio)} de ${d.cupo}`} nombre="por clase" />
          <TipFila valor={numero(d.total)} nombre={`asistencias ${sesionesTexto}`} />
          {d.ratio >= 0.9 ? <TipFila valor="Lista de espera" nombre="sugerida" /> : null}
        </Tooltip>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------- Altas y bajas (divergente)

function columna(x: number, yBase: number, yFin: number, w: number, r: number) {
  const arriba = yFin < yBase;
  const h = Math.abs(yFin - yBase);
  const rr = Math.min(r, h, w / 2);
  if (h < 0.5) return "";
  if (arriba)
    return `M${x},${yBase}V${yFin + rr}Q${x},${yFin} ${x + rr},${yFin}H${x + w - rr}Q${x + w},${yFin} ${x + w},${yFin + rr}V${yBase}Z`;
  return `M${x},${yBase}V${yFin - rr}Q${x},${yFin} ${x + rr},${yFin}H${x + w - rr}Q${x + w},${yFin} ${x + w},${yFin - rr}V${yBase}Z`;
}

export function AltasBajas({ puntos }: { puntos: { etiqueta: string; eje: string; altas: number; bajas: number }[] }) {
  const { ref, ancho, medido } = useAncho<HTMLDivElement>(560);
  const n = puntos.length;
  const { activo, marcar, contenedor } = useRecorrido(n);
  const plano = puntos.flatMap((p) => [p.altas, p.bajas]);
  const { valores, version } = useTransicion(plano);

  const maxAbs = Math.max(1, ...plano);
  const ticks = ticksLindos(0, maxAbs, 2);
  const tope = ticks[ticks.length - 1]!;
  const alto = 220;
  const M = { top: 10, bottom: 26, left: 34, right: 6 };
  const ph = alto - M.top - M.bottom;
  const pw = ancho - M.left - M.right;
  const y0 = M.top + ph / 2;
  const esc = (v: number) => (v / tope) * (ph / 2);
  const banda = pw / n;
  const bw = Math.min(24, Math.max(3, banda - 2));
  const pasoEje = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(pw / 58))));

  const act = activo !== null ? puntos[activo] : null;
  return (
    <div ref={ref} className="relative">
      <div
        {...contenedor}
        role="group"
        aria-label="Altas y bajas de socios. Usá las flechas para recorrer los valores."
        className="dv-chart dv-medir"
        style={{ opacity: medido ? 1 : 0 }}
      >
        <svg width="100%" height={alto} viewBox={`0 0 ${ancho} ${alto}`} aria-hidden="true" className="block">
          {[...ticks.slice(1).map((t) => -t), ...ticks].map((t) => (
            <g key={t}>
              <line
                x1={M.left}
                x2={M.left + pw}
                y1={y0 - esc(t)}
                y2={y0 - esc(t)}
                stroke={t === 0 ? "var(--dv-axis)" : "var(--dv-grid)"}
                shapeRendering="crispEdges"
              />
              <text
                x={M.left - 6}
                y={y0 - esc(t)}
                dy="0.32em"
                textAnchor="end"
                fontSize={11}
                fill="var(--dv-muted)"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {t === 0 ? "0" : t > 0 ? `+${numero(t)}` : `−${numero(-t)}`}
              </text>
            </g>
          ))}
          <g key={version} className="dv-fade">
            {puntos.map((p, i) => {
              const x = M.left + i * banda + (banda - bw) / 2;
              const va = valores[i * 2] ?? 0;
              const vb = valores[i * 2 + 1] ?? 0;
              const tenue = activo !== null && activo !== i;
              return (
                <g key={i} opacity={tenue ? 0.4 : 1} style={{ transition: "opacity 150ms" }}>
                  <path d={columna(x, y0 - 1, y0 - 1 - esc(va), bw, 4)} fill={ALTAS} />
                  <path d={columna(x, y0 + 1, y0 + 1 + esc(vb), bw, 4)} fill={BAJAS} />
                </g>
              );
            })}
          </g>
          {puntos.map((p, i) =>
            (n - 1 - i) % pasoEje === 0 ? (
              <text
                key={i}
                x={M.left + i * banda + banda / 2}
                y={alto - 7}
                textAnchor={i === n - 1 && n > 12 ? "end" : "middle"}
                fontSize={11}
                fill="var(--dv-muted)"
              >
                {p.eje}
              </text>
            ) : null,
          )}
          {/* Zonas de hover: toda la banda de cada columna */}
          {puntos.map((p, i) => (
            <rect
              key={`h${i}`}
              x={M.left + i * banda}
              y={M.top}
              width={banda}
              height={ph}
              fill="transparent"
              onPointerEnter={() => marcar(i)}
              onPointerDown={() => marcar(i)}
              onPointerLeave={() => marcar(null)}
            />
          ))}
        </svg>
      </div>
      {act && activo !== null ? (
        <Tooltip x={M.left + activo * banda + banda / 2} y={y0 - esc(act.altas) - 4} ancho={ancho} visible>
          <TipTitulo>{act.etiqueta}</TipTitulo>
          <TipFila color={ALTAS} forma="cuadro" valor={`+${numero(act.altas)}`} nombre="altas" />
          <TipFila color={BAJAS} forma="cuadro" valor={`−${numero(act.bajas)}`} nombre="bajas" />
          <div className="mt-1 border-t border-[#edf0ea] pt-1">
            <TipFila
              valor={`${act.altas - act.bajas >= 0 ? "+" : "−"}${numero(Math.abs(act.altas - act.bajas))}`}
              nombre="saldo neto"
            />
          </div>
        </Tooltip>
      ) : null}
      <p className="sr-only" aria-live="polite">
        {act ? `${act.etiqueta}: ${act.altas} altas, ${act.bajas} bajas` : ""}
      </p>
      <div className="sr-only">
        <table>
          <caption>Altas y bajas de socios</caption>
          <thead>
            <tr>
              <th scope="col">Fecha</th>
              <th scope="col">Altas</th>
              <th scope="col">Bajas</th>
            </tr>
          </thead>
          <tbody>
            {puntos.map((p) => (
              <tr key={p.etiqueta}>
                <th scope="row">{p.etiqueta}</th>
                <td>{p.altas}</td>
                <td>{p.bajas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
