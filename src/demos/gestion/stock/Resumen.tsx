"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon, type IconName } from "../shared/Icon";
import { diaDiff, hora, pesosCorto, startOfDay } from "../shared/util";
import { CATEGORIAS, estadoDe } from "./data";
import { useStock } from "./context";
import { BarraStock, CatIcono, mono, Panel, TipoBadge } from "./ui";

export function Resumen() {
  const { state, now, setVista, producto, abrirAjuste } = useStock();

  const d = useMemo(() => {
    const valorCosto = state.productos.reduce((a, p) => a + p.stock * p.costo, 0);
    const valorVenta = state.productos.reduce((a, p) => a + p.stock * p.venta, 0);
    const bajos = state.productos.filter((p) => estadoDe(p) !== "ok");
    const sin = bajos.filter((p) => p.stock <= 0).length;
    const hoy = state.movimientos.filter((m) => diaDiff(m.fecha, now) === 0);
    const entradas = hoy.filter((m) => m.cantidad > 0).reduce((a, m) => a + m.cantidad, 0);
    const salidas = hoy.filter((m) => m.cantidad < 0).reduce((a, m) => a - m.cantidad, 0);
    const ventasHoy = hoy
      .filter((m) => m.tipo === "venta")
      .reduce((a, m) => a - m.cantidad * (producto(m.productoId)?.venta ?? 0), 0);

    const dias = Array.from({ length: 7 }, (_, i) => {
      const inicio = startOfDay(now) - (6 - i) * 86_400_000;
      const movs = state.movimientos.filter((m) => startOfDay(Date.parse(m.fecha)) === inicio);
      return {
        inicio,
        entradas: movs.filter((m) => m.cantidad > 0).reduce((a, m) => a + m.cantidad, 0),
        salidas: movs.filter((m) => m.cantidad < 0).reduce((a, m) => a - m.cantidad, 0),
        n: movs.length,
      };
    });

    const porCat = CATEGORIAS.map((c) => ({
      c,
      valor: state.productos.filter((p) => p.categoria === c).reduce((a, p) => a + p.stock * p.costo, 0),
    })).sort((a, b) => b.valor - a.valor);

    return { valorCosto, valorVenta, bajos, sin, hoy, entradas, salidas, ventasHoy, dias, porCat };
  }, [state, now, producto]);

  const maxCat = Math.max(...d.porCat.map((x) => x.valor), 1);

  return (
    <div>
      <Titulo titulo="Resumen del depósito" sub={new Date(now).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })} />

      <div className="grid grid-cols-2 gap-px border border-[#1C1E22] bg-[#1C1E22] xl:grid-cols-4">
        <Kpi icon="box" label="Valor del stock (costo)" valor={pesosCorto(d.valorCosto)} sub={`${pesosCorto(d.valorVenta)} a precio de venta`} />
        <Kpi icon="alert" label="Bajo mínimo" valor={String(d.bajos.length)} sub={`${d.sin} sin stock`} alerta={d.bajos.length > 0} onClick={() => setVista("alertas")} />
        <Kpi icon="history" label="Movimientos hoy" valor={String(d.hoy.length)} sub={`+${d.entradas} entradas · −${d.salidas} salidas`} />
        <Kpi icon="cash" label="Vendido hoy" valor={pesosCorto(d.ventasHoy)} sub={`${d.hoy.filter((m) => m.tipo === "venta").length} ventas registradas`} />
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Panel titulo="Entradas y salidas · últimos 7 días" accion={<Leyenda />}>
          <Grafico dias={d.dias} now={now} />
        </Panel>
        <Panel titulo="Valor por categoría">
          <ul className="space-y-2.5">
            {d.porCat.map(({ c, valor }) => (
              <li key={c} className="grid grid-cols-[100px_minmax(0,1fr)_72px] items-center gap-2 text-sm">
                <span className="truncate font-semibold">{c}</span>
                <span className="h-3 bg-[#EEEDE9]">
                  <span className="block h-full bg-[#1C1E22]" style={{ width: `${(valor / maxCat) * 100}%` }} />
                </span>
                <span className={`${mono} text-right text-xs font-semibold`}>{pesosCorto(valor)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 xl:grid-cols-2">
        <Panel
          titulo={<span className="flex items-center gap-2"><span className="size-2 bg-[#F26B1D]" aria-hidden="true" />Reponer ya</span>}
          accion={<button type="button" onClick={() => setVista("alertas")} className="text-xs font-bold uppercase tracking-[0.06em] text-[#B4400C] hover:underline">Generar pedidos →</button>}
          sinPadding
        >
          <ul className="divide-y divide-[#EEEDE9]">
            {d.bajos
              .sort((a, b) => a.stock / a.minimo - b.stock / b.minimo)
              .slice(0, 6)
              .map((p) => (
                <li key={p.id}>
                  <button type="button" onClick={() => abrirAjuste(p.id, "ingreso")} className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left hover:bg-[#FFF8F2]">
                    <CatIcono c={p.categoria} className="size-8" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{p.nombre}</span>
                      <span className={`${mono} text-[11px] text-[#6B6860]`}>{p.sku} · {p.proveedor}</span>
                    </span>
                    <span className="hidden sm:block"><BarraStock p={p} ancho="w-20" /></span>
                    <span className={`${mono} w-14 text-right text-sm font-bold ${p.stock <= 0 ? "text-[#C0262D]" : "text-[#8A5A00]"}`}>
                      {p.stock}<span className="font-normal text-[#6F6C66]">/{p.minimo}</span>
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        </Panel>
        <Panel titulo="Movimientos de hoy" accion={<button type="button" onClick={() => setVista("movimientos")} className="text-xs font-bold uppercase tracking-[0.06em] text-[#55524B] hover:underline">Ver historial →</button>} sinPadding>
          {d.hoy.length ? (
            <ul className="divide-y divide-[#EEEDE9]">
              {d.hoy.slice(0, 7).map((m) => {
                const p = producto(m.productoId);
                return (
                  <li key={m.id} className="flex items-center gap-3 px-3.5 py-2.5 text-sm">
                    <span className={`${mono} w-11 shrink-0 text-xs text-[#6B6860]`}>{hora(m.fecha)}</span>
                    <span className="w-[76px] shrink-0 sm:w-[86px]"><TipoBadge tipo={m.tipo} /></span>
                    <span className="min-w-0 flex-1 truncate font-semibold">{p?.nombre ?? "—"}</span>
                    <span className={`${mono} w-12 text-right font-bold ${m.cantidad > 0 ? "text-[#1F7A3E]" : "text-[#B4400C]"}`}>
                      {m.cantidad > 0 ? "+" : ""}{m.cantidad}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="p-4 text-sm text-[#6B6860]">Todavía no hubo movimientos hoy.</p>
          )}
        </Panel>
      </div>
    </div>
  );
}

export function Titulo({ titulo, sub, children }: { titulo: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        {sub ? <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#B4400C] first-letter:uppercase">{sub}</p> : null}
        <h1 className="text-[26px] font-bold uppercase leading-tight tracking-[0.01em] sm:text-3xl">{titulo}</h1>
      </div>
      {children}
    </div>
  );
}

function Kpi({ icon, label, valor, sub, alerta, onClick }: { icon: IconName; label: string; valor: string; sub: string; alerta?: boolean; onClick?: () => void }) {
  const inner = (
    <>
      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B6860]">
        <Icon name={icon} className={`size-3.5 ${alerta ? "text-[#F26B1D]" : ""}`} strokeWidth={2.2} />
        {label}
      </p>
      <p className={`${mono} mt-1.5 text-2xl font-semibold tracking-tight sm:text-[28px] ${alerta ? "text-[#B4400C]" : ""}`}>{valor}</p>
      <p className="mt-0.5 text-xs font-semibold text-[#6B6860]">{sub}</p>
    </>
  );
  const cls = `block bg-white p-3 text-left sm:p-4 ${alerta ? "bg-[repeating-linear-gradient(135deg,#fff_0_14px,#FFF6EE_14px_28px)]" : ""}`;
  return onClick ? (
    <button type="button" onClick={onClick} className={`${cls} transition hover:bg-[#FFF1E6]`}>
      {inner}
    </button>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

function Leyenda() {
  return (
    <span className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.06em] text-[#55524B]">
      <span className="flex items-center gap-1"><span className="size-2.5 bg-[#1C1E22]" aria-hidden="true" />Entradas</span>
      <span className="flex items-center gap-1"><span className="size-2.5 bg-[#F26B1D]" aria-hidden="true" />Salidas</span>
    </span>
  );
}

function Grafico({ dias, now }: { dias: { inicio: number; entradas: number; salidas: number; n: number }[]; now: number }) {
  const [sel, setSel] = useState<number | null>(null);
  const caja = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(640);
  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e!.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const max = Math.max(...dias.flatMap((x) => [x.entradas, x.salidas]), 10);
  const tope = Math.ceil(max / 10) * 10;
  const H = W < 500 ? 200 : 230;
  const pad = { l: 34, r: 8, t: 12, b: 28 };
  const cw = (W - pad.l - pad.r) / dias.length;
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / tope);
  const activo = sel !== null ? dias[sel] : null;

  return (
    <div ref={caja} className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Unidades que entraron y salieron por día, última semana">
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line x1={pad.l} x2={W - pad.r} y1={y(tope * f)} y2={y(tope * f)} stroke={f === 0 ? "#1C1E22" : "#E7E5E0"} strokeWidth={f === 0 ? 1.5 : 1} />
            <text x={pad.l - 6} y={y(tope * f) + 4} textAnchor="end" fontSize="11" fill="#6B6860" style={{ fontFamily: "var(--font-stk-mono)" }}>
              {Math.round(tope * f)}
            </text>
          </g>
        ))}
        {dias.map((x, i) => {
          const cx = pad.l + cw * i;
          const bw = Math.min(22, cw * 0.28);
          const esHoy = i === dias.length - 1;
          const etiqueta = esHoy ? "HOY" : new Date(x.inicio).toLocaleDateString("es-AR", { weekday: "short" }).replace(".", "").toUpperCase();
          return (
            <g
              key={x.inicio}
              tabIndex={0}
              role="button"
              aria-label={`${esHoy ? "Hoy" : new Date(x.inicio).toLocaleDateString("es-AR", { weekday: "long", day: "numeric" })}: ${x.entradas} entradas, ${x.salidas} salidas`}
              onMouseEnter={() => setSel(i)}
              onMouseLeave={() => setSel(null)}
              onFocus={() => setSel(i)}
              onBlur={() => setSel(null)}
              className="cursor-pointer outline-none"
            >
              <rect x={cx} y={pad.t} width={cw} height={H - pad.t - pad.b} fill={sel === i ? "#FFF1E6" : "transparent"} />
              <rect x={cx + cw / 2 - bw - 2} y={y(x.entradas)} width={bw} height={y(0) - y(x.entradas)} fill="#1C1E22" />
              <rect x={cx + cw / 2 + 2} y={y(x.salidas)} width={bw} height={y(0) - y(x.salidas)} fill="#F26B1D" />
              <text x={cx + cw / 2} y={H - 8} textAnchor="middle" fontSize="11" fontWeight={esHoy ? 700 : 500} fill={esHoy ? "#B4400C" : "#55524B"} style={{ fontFamily: "var(--font-stk-mono)" }}>
                {etiqueta}
              </text>
            </g>
          );
        })}
      </svg>
      {activo ? (
        <div
          className="pointer-events-none absolute top-1 border border-[#1C1E22] bg-white px-2.5 py-1.5 text-xs shadow-[3px_3px_0_#1C1E22]"
          style={{ left: `${Math.min(72, ((pad.l + cw * sel! + cw / 2) / W) * 100)}%`, transform: "translateX(-50%)" }}
        >
          <p className="font-bold uppercase">{diaDiff(new Date(activo.inicio).toISOString(), now) === 0 ? "Hoy" : new Date(activo.inicio).toLocaleDateString("es-AR", { weekday: "long", day: "numeric" })}</p>
          <p className={mono}>+{activo.entradas} entradas</p>
          <p className={mono}>−{activo.salidas} salidas</p>
          <p className="text-[#6B6860]">{activo.n} movimientos</p>
        </div>
      ) : null}
      <p className="sr-only">Pasá el mouse o navegá con Tab por las barras para ver el detalle de cada día.</p>
    </div>
  );
}
