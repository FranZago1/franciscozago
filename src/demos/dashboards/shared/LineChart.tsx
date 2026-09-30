"use client";

import { useId, useMemo } from "react";
import { ticksLindos } from "./datos";
import { useAncho, useRecorrido, useTransicion } from "./hooks";
import { TipFila, TipTitulo, Tooltip } from "./Tooltip";

export type SerieLinea = {
  id: string;
  nombre: string;
  /** `null` = sin dato en ese punto (la línea se corta). */
  valores: (number | null)[];
  color: string;
  /** Lavado de área debajo de la línea (~10 % de opacidad). */
  area?: boolean;
  /** Serie de contexto (ej. período anterior): más fina y detrás. */
  secundaria?: boolean;
};

export type BandaLinea = {
  nombre: string;
  inferior: number[];
  superior: number[];
  color: string;
};

type Props = {
  titulo: string;
  series: SerieLinea[];
  /** Texto completo de cada punto (título del tooltip). */
  etiquetas: string[];
  /** Texto corto del eje X para cada punto. */
  ejeX: string[];
  alto?: number;
  formatoY: (v: number) => string;
  formatoValor: (v: number) => string;
  banda?: BandaLinea;
  /** Línea vertical de referencia (ej. "Hoy"). */
  marcaX?: { indice: number; texto: string };
  /** Línea horizontal de referencia (ej. colchón mínimo). */
  umbral?: { valor: number; texto: string };
  /** El eje Y arranca en 0 (por defecto sí). */
  desdeCero?: boolean;
  /** Fila extra al pie del tooltip (ej. variación). */
  extraTip?: (i: number) => React.ReactNode;
  /** Etiqueta directa con el último valor de la serie principal. */
  etiquetaFinal?: boolean;
};

const M = { top: 14, right: 14, bottom: 28 };

export function LineChart({
  titulo,
  series,
  etiquetas,
  ejeX,
  alto = 260,
  formatoY,
  formatoValor,
  banda,
  marcaX,
  umbral,
  desdeCero = true,
  extraTip,
  etiquetaFinal = false,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const { ref, ancho, medido } = useAncho<HTMLDivElement>(640);
  const n = etiquetas.length;
  const { activo, marcar, contenedor } = useRecorrido(n);

  // Dominio Y objetivo (con los valores finales, no los animados).
  const dominio = useMemo(() => {
    const todos: number[] = [];
    for (const s of series) for (const v of s.valores) if (v !== null) todos.push(v);
    if (banda) todos.push(...banda.inferior, ...banda.superior);
    if (umbral) todos.push(umbral.valor);
    let min = Math.min(...todos);
    let max = Math.max(...todos);
    if (desdeCero) min = Math.min(0, min);
    const pad = (max - min) * 0.06;
    if (!desdeCero) min -= pad;
    max += pad;
    const ticks = ticksLindos(min, max, alto < 200 ? 3 : 4);
    return { ticks, min: ticks[0]!, max: ticks[ticks.length - 1]! };
  }, [series, banda, umbral, desdeCero, alto]);

  // Todo lo que se dibuja pasa por la transición (valores + dominio).
  const plano = useMemo(() => {
    const out: number[] = [dominio.min, dominio.max];
    for (const s of series) for (const v of s.valores) out.push(v ?? 0);
    if (banda) out.push(...banda.inferior, ...banda.superior);
    return out;
  }, [series, banda, dominio]);
  const { valores: anim, version } = useTransicion(plano);

  let k = 2;
  const yMin = anim[0]!;
  const yMax = anim[1]!;
  const seriesA = series.map((s) => ({
    ...s,
    anim: s.valores.map((v) => {
      const a = anim[k++] ?? 0;
      return v === null ? null : a;
    }),
  }));
  const bandaA = banda
    ? {
        inf: banda.inferior.map(() => anim[k++] ?? 0),
        sup: banda.superior.map(() => anim[k++] ?? 0),
      }
    : null;

  const anchoTick = Math.max(...dominio.ticks.map((t) => formatoY(t).length)) * 6.4 + 10;
  const left = Math.round(anchoTick);
  const right = M.right + (etiquetaFinal ? 8 : 0);
  const w = ancho;
  const pw = Math.max(40, w - left - right);
  const ph = alto - M.top - M.bottom;
  const paso = n > 1 ? pw / (n - 1) : 0;
  const x = (i: number) => left + i * paso;
  const y = (v: number) => M.top + ph - ((v - yMin) / (yMax - yMin || 1)) * ph;

  const camino = (vals: (number | null)[]) => {
    let d = "";
    let abierto = false;
    vals.forEach((v, i) => {
      if (v === null) {
        abierto = false;
        return;
      }
      d += `${abierto ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
      abierto = true;
    });
    return d;
  };
  const area = (vals: (number | null)[]) => {
    const pts = vals.map((v, i) => (v === null ? null : ([x(i), y(v)] as const))).filter(Boolean) as [number, number][];
    if (pts.length < 2) return "";
    const base = y(Math.max(yMin, 0));
    return `M${pts[0]![0]},${base}` + pts.map(([a, b]) => `L${a.toFixed(1)},${b.toFixed(1)}`).join("") + `L${pts[pts.length - 1]![0]},${base}Z`;
  };

  // Ticks del eje X: tantos como entren, anclados al último punto.
  const maxTicks = Math.max(2, Math.floor(pw / 62));
  const pasoTick = Math.max(1, Math.ceil(n / maxTicks));
  const ticksX = Array.from({ length: n }, (_, i) => i).filter((i) => (n - 1 - i) % pasoTick === 0);

  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const r = e.currentTarget.ownerSVGElement!.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * w;
    marcar(Math.max(0, Math.min(n - 1, Math.round((px - left) / (paso || 1)))));
  };

  const principal = seriesA.find((s) => !s.secundaria) ?? seriesA[0];
  const ultimo = principal ? principal.anim.reduce<number>((acc, v, i) => (v !== null ? i : acc), -1) : -1;

  const tipY =
    activo !== null
      ? Math.min(...seriesA.map((s) => (s.anim[activo] != null ? y(s.anim[activo]!) : M.top + ph)))
      : 0;

  const lectura =
    activo !== null
      ? `${etiquetas[activo]}: ` +
        series
          .filter((s) => s.valores[activo] !== null)
          .map((s) => `${s.nombre} ${formatoValor(s.valores[activo]!)}`)
          .join(", ")
      : "";

  return (
    <div ref={ref} className="relative w-full">
      <div
        {...contenedor}
        role="group"
        aria-label={`${titulo}. Usá las flechas para recorrer los valores.`}
        className="dv-chart dv-medir"
        style={{ opacity: medido ? 1 : 0 }}
      >
        <svg width="100%" height={alto} viewBox={`0 0 ${w} ${alto}`} className="block overflow-visible" aria-hidden="true">
          <defs>
            {seriesA
              .filter((s) => s.area)
              .map((s) => (
                <linearGradient key={s.id} id={`${uid}-g-${s.id}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.16} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
                </linearGradient>
              ))}
          </defs>

          {/* Grilla y eje Y */}
          {dominio.ticks.map((t) => (
            <g key={t}>
              <line
                x1={left}
                x2={left + pw}
                y1={y(t)}
                y2={y(t)}
                stroke={t === 0 ? "var(--dv-axis)" : "var(--dv-grid)"}
                strokeWidth={1}
                shapeRendering="crispEdges"
              />
              <text
                x={left - 8}
                y={y(t)}
                dy="0.32em"
                textAnchor="end"
                fontSize={11}
                fill="var(--dv-muted)"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {formatoY(t)}
              </text>
            </g>
          ))}

          {/* Eje X */}
          {ticksX.map((i) => (
            <text
              key={i}
              x={x(i)}
              y={alto - 8}
              textAnchor={i === 0 && n > 1 ? "start" : i === n - 1 && n > 1 ? "end" : "middle"}
              fontSize={11}
              fill="var(--dv-muted)"
            >
              {ejeX[i]}
            </text>
          ))}

          {umbral ? (
            <g>
              <line
                x1={left}
                x2={left + pw}
                y1={y(umbral.valor)}
                y2={y(umbral.valor)}
                stroke="var(--dv-umbral, var(--dv-muted))"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <text x={left + pw - 2} y={y(umbral.valor) - 6} textAnchor="end" fontSize={11} fill="var(--dv-ink2)">
                {umbral.texto}
              </text>
            </g>
          ) : null}

          <g key={version} className="dv-fade">
            {bandaA && banda ? (
              <path
                d={
                  `M${x(0)},${y(bandaA.sup[0]!)}` +
                  bandaA.sup.map((v, i) => `L${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("") +
                  bandaA.inf
                    .map((_, i, arr) => {
                      const j = arr.length - 1 - i;
                      return `L${x(j).toFixed(1)},${y(arr[j]!).toFixed(1)}`;
                    })
                    .join("") +
                  "Z"
                }
                fill={banda.color}
                fillOpacity={0.14}
              />
            ) : null}

            {seriesA
              .filter((s) => s.area)
              .map((s) => (
                <path key={`a-${s.id}`} d={area(s.anim)} fill={`url(#${uid}-g-${s.id})`} />
              ))}

            {seriesA.map((s) => (
              <path
                key={s.id}
                d={camino(s.anim)}
                fill="none"
                stroke={s.color}
                strokeWidth={s.secundaria ? 1.5 : 2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}

            {marcaX ? (
              <g>
                <line
                  x1={x(marcaX.indice)}
                  x2={x(marcaX.indice)}
                  y1={M.top}
                  y2={M.top + ph}
                  stroke="var(--dv-axis)"
                  strokeWidth={1}
                />
                <text
                  x={x(marcaX.indice) + 6}
                  y={M.top + 10}
                  fontSize={11}
                  fontWeight={600}
                  fill="var(--dv-ink2)"
                >
                  {marcaX.texto}
                </text>
              </g>
            ) : null}

            {/* Punto final de la serie principal */}
            {principal && ultimo >= 0 && activo === null ? (
              <g>
                <circle
                  cx={x(ultimo)}
                  cy={y(principal.anim[ultimo]!)}
                  r={4.5}
                  fill={principal.color}
                  stroke="var(--dv-surface)"
                  strokeWidth={2}
                />
                {etiquetaFinal ? (
                  <text
                    x={x(ultimo) - 8}
                    y={y(principal.anim[ultimo]!) - 12}
                    textAnchor="end"
                    fontSize={11.5}
                    fontWeight={600}
                    fill="var(--dv-ink)"
                  >
                    {formatoValor(principal.valores[ultimo]!)}
                  </text>
                ) : null}
              </g>
            ) : null}
          </g>

          {/* Capa de hover: cruz + puntos */}
          {activo !== null ? (
            <g>
              <line
                x1={x(activo)}
                x2={x(activo)}
                y1={M.top}
                y2={M.top + ph}
                stroke="var(--dv-cross, var(--dv-axis))"
                strokeWidth={1}
              />
              {seriesA.map((s) =>
                s.anim[activo] != null ? (
                  <circle
                    key={s.id}
                    cx={x(activo)}
                    cy={y(s.anim[activo]!)}
                    r={4.5}
                    fill={s.color}
                    stroke="var(--dv-surface)"
                    strokeWidth={2}
                  />
                ) : null,
              )}
            </g>
          ) : null}

          <rect
            x={left - paso / 2}
            y={0}
            width={pw + paso}
            height={alto}
            fill="transparent"
            onPointerMove={onMove}
            onPointerDown={onMove}
            onPointerLeave={() => marcar(null)}
            style={{ touchAction: "pan-y" }}
          />
        </svg>
      </div>

      {activo !== null ? (
        <Tooltip x={x(activo)} y={tipY} ancho={w} visible>
          <TipTitulo>{etiquetas[activo]}</TipTitulo>
          {[...series.filter((s) => !s.secundaria), ...series.filter((s) => s.secundaria)].map((s) =>
            s.valores[activo] !== null ? (
              <TipFila key={s.id} color={s.color} valor={formatoValor(s.valores[activo]!)} nombre={s.nombre} />
            ) : null,
          )}
          {banda && banda.inferior[activo] !== undefined && banda.superior[activo]! - banda.inferior[activo]! > 1 ? (
            <TipFila
              color={banda.color}
              forma="cuadro"
              valor={`${formatoY(banda.inferior[activo]!)} a ${formatoY(banda.superior[activo]!)}`}
              nombre={banda.nombre}
            />
          ) : null}
          {extraTip?.(activo)}
        </Tooltip>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {lectura}
      </p>
      <div className="sr-only">
      <table>
        <caption>{titulo}</caption>
        <thead>
          <tr>
            <th scope="col">Fecha</th>
            {series.map((s) => (
              <th key={s.id} scope="col">
                {s.nombre}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {etiquetas.map((et, i) => (
            <tr key={i}>
              <th scope="row">{et}</th>
              {series.map((s) => (
                <td key={s.id}>{s.valores[i] !== null ? formatoValor(s.valores[i]!) : "—"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
