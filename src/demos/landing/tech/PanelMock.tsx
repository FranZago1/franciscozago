"use client";

import { useEffect, useRef, useState } from "react";
import { miles } from "../shared/formato";
import { Icono, type NombreIcono } from "../shared/Icono";
import { barrasMeses, facturasIniciales, facturasNuevas, type Estado, type Factura } from "./datos";

const mono = "[font-family:var(--font-cc-mono)]";

export const estiloEstado: Record<Estado, { texto: string; clase: string }> = {
  pagada: { texto: "Pagada", clase: "bg-emerald-50 text-emerald-700 ring-emerald-600/15" },
  pendiente: { texto: "Pendiente", clase: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  vencida: { texto: "Vencida", clase: "bg-rose-50 text-rose-700 ring-rose-600/15" },
};

/** Número que se anima hacia su nuevo valor. */
function useTween(valor: number, ms = 900) {
  const [v, setV] = useState(valor);
  const desde = useRef(valor);
  useEffect(() => {
    const inicio = performance.now();
    const origen = desde.current;
    let raf = 0;
    const paso = (t: number) => {
      const k = Math.min(1, (t - inicio) / ms);
      const e = 1 - Math.pow(1 - k, 3);
      const actual = origen + (valor - origen) * e;
      setV(actual);
      desde.current = actual;
      if (k < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [valor, ms]);
  return v;
}

const nav: [NombreIcono, string][] = [
  ["grafico", "Panel"],
  ["factura", "Facturas"],
  ["grupo", "Clientes"],
  ["link", "Cobros"],
  ["medidor", "Monotributo"],
];

export function PanelMock() {
  const [facturas, setFacturas] = useState<(Factura & { nueva?: boolean })[]>(facturasIniciales);
  const [facturado, setFacturado] = useState(2845300);
  const [cobrado, setCobrado] = useState(2120000);
  const [aviso, setAviso] = useState<string | null>(null);
  const raiz = useRef<HTMLDivElement>(null);
  const siguiente = useRef(0);
  const numero = useRef(142);
  const actuales = useRef(facturas);
  useEffect(() => {
    actuales.current = facturas;
  }, [facturas]);
  const kFacturado = useTween(facturado);
  const kCobrado = useTween(cobrado);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting), { threshold: 0.2 });
    if (raiz.current) io.observe(raiz.current);
    const timers: number[] = [];

    const tick = () => {
      if (!visible || document.hidden) return;
      const base = facturasNuevas[siguiente.current % facturasNuevas.length]!;
      siguiente.current++;
      const n = numero.current++;
      const nueva = { ...base, id: `n${n}`, numero: `C 0003-${String(n).padStart(8, "0")}`, nueva: true };
      setFacturas((prev) => [nueva, ...prev.map((f) => ({ ...f, nueva: false }))].slice(0, 5));
      setFacturado((v) => v + base.monto);
      setAviso(`Factura ${nueva.numero} emitida · CAE otorgado`);
      // Un rato después, alguna pendiente se cobra.
      timers.push(
        window.setTimeout(() => {
          const prev = actuales.current;
          const i = prev.findIndex((f, idx) => idx > 0 && f.estado === "pendiente");
          if (i < 0) return;
          const f = prev[i]!;
          setFacturas(prev.map((x, idx) => (idx === i ? { ...x, estado: "pagada" as const } : x)));
          setCobrado((v) => v + f.monto);
          setAviso(`${f.cliente} te pagó $${miles(f.monto)}`);
        }, 2600),
      );
    };
    const id = window.setInterval(tick, 5200);
    return () => {
      io.disconnect();
      window.clearInterval(id);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    if (!aviso) return;
    const t = window.setTimeout(() => setAviso(null), 2400);
    return () => window.clearTimeout(t);
  }, [aviso]);

  const max = Math.max(...barrasMeses.map((b) => b.valor));
  const usado = 62;

  return (
    <div ref={raiz} className="relative" aria-hidden="true">
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_50px_100px_-40px_rgba(30,27,75,0.35),0_0_0_1px_rgba(15,23,42,0.06)]">
        {/* barra de ventana */}
        <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-slate-300" />
            <span className="size-2.5 rounded-full bg-slate-300" />
            <span className="size-2.5 rounded-full bg-slate-300" />
          </span>
          <span className={`${mono} mx-auto flex items-center gap-1.5 rounded-md bg-white px-3 py-1 text-[11px] text-slate-500 ring-1 ring-slate-200`}>
            <Icono nombre="candado" grosor={2} className="size-3" />
            app.cuentaclara.ar/panel
          </span>
          <span className="w-10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
          {/* sidebar */}
          <div className="hidden border-r border-slate-100 bg-slate-50/50 p-4 md:flex md:flex-col">
            <div className="flex items-center gap-2 px-2 pb-5">
              <span className="flex size-6 items-center justify-center rounded-md bg-[#4F46E5] text-white">
                <Icono nombre="check" grosor={3} className="size-3.5" />
              </span>
              <span className="text-sm font-semibold tracking-tight text-slate-900">Cuentaclara</span>
            </div>
            <ul className="space-y-0.5 text-[13px]">
              {nav.map(([ic, t], i) => (
                <li key={t} className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 ${i === 0 ? "bg-white font-medium text-slate-900 shadow-sm ring-1 ring-slate-200/70" : "text-slate-500"}`}>
                  <Icono nombre={ic} grosor={1.8} className={`size-4 ${i === 0 ? "text-[#4F46E5]" : ""}`} />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex items-center gap-2.5 rounded-xl bg-white p-2.5 ring-1 ring-slate-200/70">
              <span className="flex size-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">SP</span>
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-[12px] font-medium text-slate-900">Sofía Paz</span>
                <span className="block truncate text-[11px] text-slate-500">Monotributo · Cat. D</span>
              </span>
            </div>
          </div>

          {/* contenido */}
          <div className="min-w-0 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] text-slate-500 sm:text-xs">Septiembre 2026</p>
                <p className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">Hola, Sofía</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#4F46E5] px-3 py-2 text-[12px] font-medium text-white shadow-sm shadow-indigo-600/30">
                <Icono nombre="mas" grosor={2.4} className="size-3.5" />
                Nueva factura
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
              <div className="rounded-xl p-3 ring-1 ring-slate-200/80 sm:p-4">
                <p className="text-[11px] text-slate-500">Facturado</p>
                <p className="mt-1 text-[15px] font-semibold tracking-tight text-slate-900 tabular-nums sm:text-lg">${miles(kFacturado)}</p>
                <p className="mt-1 text-[11px] font-medium text-emerald-600">+18 % vs. agosto</p>
              </div>
              <div className="rounded-xl p-3 ring-1 ring-slate-200/80 sm:p-4">
                <p className="text-[11px] text-slate-500">Cobrado</p>
                <p className="mt-1 text-[15px] font-semibold tracking-tight text-slate-900 tabular-nums sm:text-lg">${miles(kCobrado)}</p>
                <p className="mt-1 text-[11px] text-slate-500">{Math.round((kCobrado / kFacturado) * 100)} % del total</p>
              </div>
              <div className="hidden rounded-xl p-3 ring-1 ring-slate-200/80 sm:p-4 lg:block">
                <p className="text-[11px] text-slate-500">Por cobrar</p>
                <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900 tabular-nums">${miles(kFacturado - kCobrado)}</p>
                <p className="mt-1 text-[11px] font-medium text-amber-600">{facturas.filter((f) => f.estado !== "pagada").length} facturas abiertas</p>
              </div>
              <div className="hidden rounded-xl bg-indigo-50/60 p-3 ring-1 ring-indigo-100 sm:p-4 lg:block">
                <p className="text-[11px] text-indigo-900/70">Tope categoría D</p>
                <p className="mt-1 text-lg font-semibold tracking-tight text-indigo-950 tabular-nums">{usado} %</p>
                <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-indigo-100">
                  <span className="block h-full rounded-full bg-[#4F46E5]" style={{ width: `${usado}%` }} />
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1.45fr_1fr]">
              <div className="rounded-xl ring-1 ring-slate-200/80">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <p className="text-[13px] font-medium text-slate-900">Últimas facturas</p>
                  <p className="text-[11px] text-[#4F46E5]">Ver todas</p>
                </div>
                <ul className="divide-y divide-slate-100">
                  {facturas.map((f) => {
                    const e = estiloEstado[f.estado];
                    return (
                      <li
                        key={f.id}
                        className={`grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-2.5 text-[12px] transition-colors duration-1000 sm:grid-cols-[1.1fr_1fr_auto_auto] ${
                          f.nueva ? "cc-fila-nueva bg-indigo-50/70" : "bg-white"
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-slate-900">{f.cliente}</span>
                          <span className={`${mono} block text-[10.5px] text-slate-400 sm:hidden`}>{f.numero}</span>
                        </span>
                        <span className={`${mono} hidden truncate text-[11px] text-slate-500 sm:block`}>{f.numero}</span>
                        <span className="text-right font-medium text-slate-900 tabular-nums">${miles(f.monto)}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-medium ring-1 ring-inset ${e.clase}`}>{e.texto}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="hidden rounded-xl p-4 ring-1 ring-slate-200/80 lg:block">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-slate-900">Facturación mensual</p>
                  <p className={`${mono} text-[11px] text-slate-400`}>millones $</p>
                </div>
                <div className="mt-4 flex h-40 items-end gap-2.5">
                  {barrasMeses.map((b, i) => (
                    <div key={b.mes} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                      <span className={`${mono} text-[10px] text-slate-500`}>{b.valor.toFixed(1).replace(".", ",")}</span>
                      <span
                        className={`cc-barra w-full rounded-md ${i === barrasMeses.length - 1 ? "bg-[#4F46E5]" : "bg-indigo-100"}`}
                        style={{ height: `${(b.valor / max) * 78}%`, animationDelay: `${0.3 + i * 0.08}s` }}
                      />
                      <span className="text-[10.5px] text-slate-500">{b.mes}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* aviso flotante */}
      <div
        className={`pointer-events-none absolute right-3 bottom-3 flex max-w-[calc(100%-1.5rem)] items-center gap-2.5 rounded-xl bg-slate-900 px-3.5 py-2.5 text-[12px] text-white shadow-xl transition-[opacity,transform] duration-500 sm:right-6 sm:bottom-6 ${
          aviso ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500">
          <Icono nombre="check" grosor={3} className="size-3" />
        </span>
        <span className="truncate">{aviso ?? " "}</span>
      </div>
    </div>
  );
}
