"use client";

import { useState } from "react";
import { ticksLindos } from "../shared/datos";
import { pesos, pesosCompacto, porcentaje } from "../shared/formato";
import { useAncho, useRecorrido, useTransicion } from "../shared/hooks";
import { TipFila, TipTitulo, Tooltip } from "../shared/Tooltip";
import type { Balde, CategoriaId, Cuenta } from "./datos";
import { antiguedad } from "./datos";

/** Polos del flujo (par divergente validado en oscuro): ingresos azul, egresos rojo. */
export const INGRESOS = "#3987e5";
export const EGRESOS = "#e66767";
/** Categóricos en orden fijo (modo oscuro, validados sobre #12151a). "Otros" va en gris neutro. */
export const COLOR_GASTO: Record<string, string> = {
  materiales: "#3987e5",
  sueldos: "#d95926",
  alquiler: "#199e70",
  impuestos: "#c98500",
  fletes: "#d55181",
  otros: "#5d6470",
};
/** Antigüedad de saldos: neutro para "al día", ámbar cada vez más intenso según el atraso. */
export const COLOR_TRAMO = ["#3d4b5c", "#8a6420", "#c98a1c", "#f2c14e"];

// ---------------------------------------------------------------- Flujo de caja (barras divergentes)

function columna(x: number, yBase: number, yFin: number, w: number, r: number) {
  const h = Math.abs(yFin - yBase);
  if (h < 0.5) return "";
  const rr = Math.min(r, h, w / 2);
  const s = yFin < yBase ? 1 : -1;
  return `M${x},${yBase}V${yFin + s * rr}Q${x},${yFin} ${x + rr},${yFin}H${x + w - rr}Q${x + w},${yFin} ${x + w},${yFin + s * rr}V${yBase}Z`;
}

export function FlujoCaja({ baldes }: { baldes: Balde[] }) {
  const { ref, ancho, medido } = useAncho<HTMLDivElement>(720);
  const n = baldes.length;
  const { activo, marcar, contenedor } = useRecorrido(n);
  const plano = baldes.flatMap((b) => [b.ingresos, b.egresos]);
  const { valores, version } = useTransicion(plano);

  const maxAbs = Math.max(1, ...plano);
  const ticks = ticksLindos(0, maxAbs, 2);
  const tope = ticks[ticks.length - 1]!;
  const alto = 300;
  const etiquetaMax = Math.max(...ticks.map((t) => pesosCompacto(t).length + 1));
  const M = { top: 12, bottom: 28, left: Math.round(etiquetaMax * 6.6 + 8), right: 8 };
  const ph = alto - M.top - M.bottom;
  const pw = ancho - M.left - M.right;
  const y0 = M.top + ph / 2;
  const esc = (v: number) => (v / tope) * (ph / 2);
  const banda = pw / n;
  const bw = Math.min(24, Math.max(3, banda * 0.62));
  const pasoEje = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(pw / 60))));
  const cx = (i: number) => M.left + i * banda + banda / 2;

  // Línea de saldo neto de cada balde (misma escala, mismo eje).
  const netos = baldes.map((_, i) => (valores[i * 2] ?? 0) - (valores[i * 2 + 1] ?? 0));
  const lineaNeto = netos.map((v, i) => `${i ? "L" : "M"}${cx(i).toFixed(1)},${(y0 - esc(v)).toFixed(1)}`).join("");

  const act = activo !== null ? baldes[activo] : null;
  return (
    <div ref={ref} className="relative">
      <div
        {...contenedor}
        role="group"
        aria-label="Flujo de caja: ingresos hacia arriba, egresos hacia abajo. Usá las flechas para recorrer."
        className="dv-chart dv-medir"
        style={{ opacity: medido ? 1 : 0 }}
      >
        <svg width="100%" height={alto} viewBox={`0 0 ${ancho} ${alto}`} aria-hidden="true" className="block">
          {[...ticks.slice(1).map((t) => -t).reverse(), ...ticks].map((t) => (
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
                x={M.left - 8}
                y={y0 - esc(t)}
                dy="0.32em"
                textAnchor="end"
                fontSize={11}
                fill="var(--dv-muted)"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {t === 0 ? "$ 0" : t > 0 ? pesosCompacto(t) : `−${pesosCompacto(-t)}`}
              </text>
            </g>
          ))}
          <g key={version} className="dv-fade">
            {baldes.map((b, i) => {
              const x = cx(i) - bw / 2;
              const tenue = activo !== null && activo !== i;
              return (
                <g key={i} opacity={tenue ? 0.35 : 1} style={{ transition: "opacity 150ms" }}>
                  <path d={columna(x, y0 - 1, y0 - 1 - esc(valores[i * 2] ?? 0), bw, 4)} fill={INGRESOS} />
                  <path d={columna(x, y0 + 1, y0 + 1 + esc(valores[i * 2 + 1] ?? 0), bw, 4)} fill={EGRESOS} />
                </g>
              );
            })}
            <path d={lineaNeto} fill="none" stroke="var(--dv-neto)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {netos.map((v, i) =>
              activo === i || (activo === null && i === n - 1) ? (
                <circle key={i} cx={cx(i)} cy={y0 - esc(v)} r={4.5} fill="var(--dv-neto)" stroke="var(--dv-surface)" strokeWidth={2} />
              ) : null,
            )}
          </g>
          {baldes.map((b, i) =>
            (n - 1 - i) % pasoEje === 0 ? (
              <text
                key={i}
                x={cx(i)}
                y={alto - 8}
                textAnchor={i === n - 1 && n > 12 ? "end" : "middle"}
                fontSize={11}
                fill="var(--dv-muted)"
              >
                {b.eje}
              </text>
            ) : null,
          )}
          {baldes.map((_, i) => (
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
        <Tooltip x={cx(activo)} y={y0 - esc(act.ingresos)} ancho={ancho} visible>
          <TipTitulo>{act.etiqueta}</TipTitulo>
          <TipFila color={INGRESOS} forma="cuadro" valor={pesos(act.ingresos)} nombre="ingresos" />
          <TipFila color={EGRESOS} forma="cuadro" valor={pesos(act.egresos)} nombre="egresos" />
          <div className="mt-1 border-t border-white/10 pt-1">
            <TipFila color="var(--dv-neto)" valor={pesos(act.ingresos - act.egresos)} nombre="neto" />
          </div>
        </Tooltip>
      ) : null}
      <p className="sr-only" aria-live="polite">
        {act ? `${act.etiqueta}: ingresos ${pesos(act.ingresos)}, egresos ${pesos(act.egresos)}` : ""}
      </p>
      <div className="sr-only">
        <table>
          <caption>Flujo de caja</caption>
          <thead>
            <tr>
              <th scope="col">Fecha</th>
              <th scope="col">Ingresos</th>
              <th scope="col">Egresos</th>
              <th scope="col">Neto</th>
            </tr>
          </thead>
          <tbody>
            {baldes.map((b) => (
              <tr key={b.etiqueta}>
                <th scope="row">{b.etiqueta}</th>
                <td>{pesos(b.ingresos)}</td>
                <td>{pesos(b.egresos)}</td>
                <td>{pesos(b.ingresos - b.egresos)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Dona de gastos

export function DonaGastos({
  gastos,
  aislada,
  onAislar,
  onVerMovimientos,
}: {
  gastos: { id: CategoriaId; nombre: string; valor: number }[];
  aislada: CategoriaId | null;
  onAislar: (id: CategoriaId | null) => void;
  onVerMovimientos: (id: CategoriaId) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const { valores } = useTransicion(gastos.map((g) => g.valor));
  const total = valores.reduce((a, b) => a + b, 0) || 1;
  const totalReal = gastos.reduce((a, g) => a + g.valor, 0);

  const R = 90;
  const r = 64;
  const C = 100;
  const gapAng = 0.025;
  let ang = -Math.PI / 2;
  const arcos = valores.map((v, i) => {
    const a0 = ang;
    const a1 = ang + (v / total) * Math.PI * 2;
    ang = a1;
    const s = a0 + gapAng / 2;
    const e = Math.max(s + 0.001, a1 - gapAng / 2);
    const large = e - s > Math.PI ? 1 : 0;
    const p = (rad: number, a: number) => `${(C + rad * Math.cos(a)).toFixed(2)},${(C + rad * Math.sin(a)).toFixed(2)}`;
    return { i, d: `M${p(R, s)}A${R},${R} 0 ${large} 1 ${p(R, e)}L${p(r, e)}A${r},${r} 0 ${large} 0 ${p(r, s)}Z`, medio: (a0 + a1) / 2 };
  });

  const idxAislada = aislada ? gastos.findIndex((g) => g.id === aislada) : -1;
  const foco = hover ?? (idxAislada >= 0 ? idxAislada : null);
  const g = foco !== null ? gastos[foco] : null;

  return (
    <div className="grid items-center gap-6 sm:grid-cols-[200px_1fr] xl:grid-cols-1 2xl:grid-cols-[200px_1fr]">
      <div className="relative mx-auto w-full max-w-[220px]">
        <svg viewBox="0 0 200 200" className="block w-full" role="img" aria-label={`Gastos por categoría: ${gastos.map((x) => `${x.nombre} ${porcentaje(x.valor / (totalReal || 1), 0)}`).join(", ")}`}>
          {arcos.map((a) => {
            const on = idxAislada < 0 || idxAislada === a.i;
            const gg = gastos[a.i]!;
            return (
              <path
                key={gg.id}
                d={a.d}
                fill={COLOR_GASTO[gg.id]}
                opacity={on ? (hover === null || hover === a.i ? 1 : 0.55) : 0.14}
                style={{
                  transition: "opacity 200ms, transform 200ms",
                  transformOrigin: "100px 100px",
                  transform: hover === a.i || idxAislada === a.i ? "scale(1.03)" : "none",
                  cursor: "pointer",
                }}
                onPointerEnter={() => setHover(a.i)}
                onPointerLeave={() => setHover(null)}
                onClick={() => onAislar(aislada === gg.id ? null : gg.id)}
              />
            );
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="max-w-[110px] truncate text-[11.5px] text-[var(--dv-ink2)]">{g ? g.nombre : "Total gastos"}</span>
          <span className="mt-0.5 text-[20px] font-semibold tracking-[-0.01em] text-[var(--dv-ink)]">
            {pesosCompacto(g ? g.valor : totalReal)}
          </span>
          <span className="mt-0.5 font-[family-name:var(--font-tc-mono)] text-[11px] text-[var(--dv-muted)]">
            {g ? `${porcentaje(g.valor / (totalReal || 1))} del total` : "100 %"}
          </span>
        </div>
      </div>
      <div>
        <p className="mb-2 text-[12px] text-[var(--dv-muted)]" id="dona-ayuda">
          Tocá una categoría para aislarla.
        </p>
        <ul className="flex flex-col gap-1" aria-describedby="dona-ayuda">
          {gastos.map((x, i) => {
            const on = aislada === x.id;
            const apagada = aislada !== null && !on;
            return (
              <li key={x.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => onAislar(on ? null : x.id)}
                  onPointerEnter={() => setHover(i)}
                  onPointerLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  className={`grid w-full grid-cols-[auto_1fr_auto_auto] items-center gap-2.5 rounded-[8px] px-2 py-1.5 text-left text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--dv-focus)] ${
                    on ? "bg-white/[0.07] ring-1 ring-white/15" : "hover:bg-white/[0.04]"
                  } ${apagada ? "opacity-45" : ""}`}
                >
                  <span aria-hidden="true" className="size-2.5 rounded-[3px]" style={{ background: COLOR_GASTO[x.id] }} />
                  <span className="truncate text-[var(--dv-ink)]">{x.nombre}</span>
                  <span className="font-[family-name:var(--font-tc-mono)] text-[12px] text-[var(--dv-ink2)] tabular-nums">
                    {porcentaje(x.valor / (totalReal || 1), 0)}
                  </span>
                  <span className="w-[64px] text-right font-medium text-[var(--dv-ink)] tabular-nums">{pesosCompacto(x.valor)}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 flex min-h-[32px] flex-wrap items-center gap-2">
          {aislada ? (
            <>
              <button
                type="button"
                onClick={() => onVerMovimientos(aislada)}
                className="rounded-[8px] bg-[var(--dv-acento)] px-3 py-1.5 text-[12.5px] font-semibold text-[#1a0d0a] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dv-focus)]"
              >
                Ver sus movimientos
              </button>
              <button
                type="button"
                onClick={() => onAislar(null)}
                className="rounded-[8px] px-3 py-1.5 text-[12.5px] font-medium text-[var(--dv-ink2)] ring-1 ring-white/15 hover:text-[var(--dv-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dv-focus)]"
              >
                Ver todas
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Cuentas por cobrar / pagar

function textoDias(d: number) {
  if (d === 0) return "vence hoy";
  if (d > 0) return d === 1 ? "vence mañana" : `vence en ${d} días`;
  return `vencida hace ${-d} días`;
}

export function Cuentas({ titulo, cuentas, tipo }: { titulo: string; cuentas: Cuenta[]; tipo: "cobrar" | "pagar" }) {
  const tramos = antiguedad(cuentas);
  const total = tramos.reduce((a, t) => a + t.valor, 0);
  const vencido = total - tramos[0]!.valor;
  const proximas = [...cuentas].sort((a, b) => a.dias - b.dias).slice(0, 4);
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[13px] font-medium text-[var(--dv-ink2)]">{titulo}</h3>
        <span className="font-[family-name:var(--font-tc-mono)] text-[11.5px] text-[var(--dv-muted)]">{cuentas.length} comprobantes</span>
      </div>
      <p className="mt-1 text-[26px] font-semibold tracking-[-0.02em] text-[var(--dv-ink)]">{pesosCompacto(total)}</p>
      <p className="text-[12.5px] text-[var(--dv-ink2)]">
        {vencido > 0 ? (
          <>
            <span className="font-semibold text-[#f2c14e]">{pesosCompacto(vencido)}</span> {tipo === "cobrar" ? "vencido sin cobrar" : "vencido sin pagar"}
          </>
        ) : (
          "Todo al día"
        )}
      </p>
      <div
        className="mt-3 flex h-2.5 gap-[2px] overflow-hidden rounded-[4px]"
        role="img"
        aria-label={`Antigüedad: ${tramos.map((t) => `${t.nombre} ${pesos(t.valor)}`).join(", ")}`}
        onPointerLeave={() => setHover(null)}
      >
        {tramos.map((t, i) =>
          t.valor > 0 ? (
            <div
              key={t.id}
              onPointerEnter={() => setHover(i)}
              style={{ width: `${(t.valor / total) * 100}%`, background: COLOR_TRAMO[i], opacity: hover === null || hover === i ? 1 : 0.4 }}
              className="h-full transition-opacity"
            />
          ) : null,
        )}
      </div>
      <ul className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] text-[var(--dv-ink2)]">
        {tramos.map((t, i) => (
          <li key={t.id} className={`flex items-center gap-1.5 transition-opacity ${hover !== null && hover !== i ? "opacity-50" : ""}`}>
            <span aria-hidden="true" className="size-2 rounded-[2px]" style={{ background: COLOR_TRAMO[i] }} />
            {t.nombre} <span className="text-[var(--dv-ink)] tabular-nums">{pesosCompacto(t.valor)}</span>
          </li>
        ))}
      </ul>
      <ul className="mt-4 divide-y divide-white/[0.06] border-t border-white/[0.06]">
        {proximas.map((c) => {
          const vencida = c.dias < 0;
          const urgente = !vencida && c.dias <= 5;
          return (
            <li key={c.id} className="flex items-center gap-3 py-2.5">
              <span
                aria-hidden="true"
                className={`grid size-7 shrink-0 place-items-center rounded-full ${
                  vencida ? "bg-[#d03b3b]/15 text-[#ff8a8a]" : urgente ? "bg-[#fab219]/15 text-[#fab219]" : "bg-white/[0.06] text-[var(--dv-ink2)]"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  {vencida ? (
                    <>
                      <path d="M8 2.5 14 13H2Z" strokeLinejoin="round" />
                      <path d="M8 6.5v3M8 11.3v.1" />
                    </>
                  ) : (
                    <>
                      <circle cx="8" cy="8" r="5.8" />
                      <path d="M8 4.8V8l2.2 1.4" />
                    </>
                  )}
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] text-[var(--dv-ink)]">{c.quien}</p>
                <p className="truncate font-[family-name:var(--font-tc-mono)] text-[11px] text-[var(--dv-muted)]">{c.comprobante}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[13px] font-medium text-[var(--dv-ink)] tabular-nums">{pesos(c.monto)}</p>
                <p className={`text-[11.5px] ${vencida ? "text-[#ff8a8a]" : urgente ? "text-[#fab219]" : "text-[var(--dv-muted)]"}`}>
                  {textoDias(c.dias)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
