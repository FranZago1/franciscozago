"use client";

import { useRef, useState } from "react";
import { miles } from "../shared/formato";
import { Icono, type NombreIcono } from "../shared/Icono";

const mono = "[font-family:var(--font-cc-mono)]";

const tabs: { id: string; nombre: string; icono: NombreIcono; titulo: string; texto: string; puntos: string[] }[] = [
  {
    id: "facturacion",
    nombre: "Facturación",
    icono: "factura",
    titulo: "Facturas en 20 segundos, sin entrar a la web de ARCA.",
    texto: "Elegís el cliente, escribís el concepto y listo. El tipo de comprobante, el punto de venta y el IVA se completan solos.",
    puntos: ["Facturas A, B, C y E", "CAE al instante", "Conceptos y clientes guardados"],
  },
  {
    id: "cobros",
    nombre: "Cobros",
    icono: "link",
    titulo: "Cada factura viaja con su link de pago.",
    texto: "Tu cliente paga con transferencia, tarjeta o QR. Si se olvida, le mandamos un recordatorio amable por vos.",
    puntos: ["Links de pago y QR", "Recordatorios automáticos", "Conciliación al cobrar"],
  },
  {
    id: "reportes",
    nombre: "Reportes",
    icono: "grafico",
    titulo: "Sabé cuánto facturás, cobrás y te deben.",
    texto: "Reportes claros por mes, cliente y concepto. Exportás a Excel para tu contador con un click.",
    puntos: ["Tablero en tiempo real", "Ranking de clientes", "Exportación a Excel y PDF"],
  },
  {
    id: "monotributo",
    nombre: "Monotributo",
    icono: "medidor",
    titulo: "Nunca más te pasás de categoría sin darte cuenta.",
    texto: "Seguimos tu facturación de los últimos 12 meses contra el tope de tu categoría y te avisamos con tiempo.",
    puntos: ["Alertas al 80 % y 95 %", "Proyección de recategorización", "Vencimientos del mes"],
  },
];

function MockFacturacion() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">Nueva factura</p>
        <span className={`${mono} rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-600`}>Factura C · PV 0003</span>
      </div>
      <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200/70">
        <p className="text-[11px] text-slate-500">Cliente</p>
        <p className="mt-0.5 flex items-center justify-between text-sm text-slate-900">
          Estudio Nube Alta SRL
          <span className={`${mono} text-[11px] text-slate-400`}>30-71234567-4</span>
        </p>
      </div>
      <div className="rounded-xl ring-1 ring-slate-200/70">
        {[
          ["Diseño de identidad visual", 1, 145000],
          ["Adaptaciones para redes", 4, 10000],
        ].map(([c, q, p]) => (
          <div key={c as string} className="flex items-center justify-between gap-3 border-b border-slate-100 px-3 py-2.5 text-[13px] last:border-0">
            <span className="min-w-0 truncate text-slate-800">{c}</span>
            <span className={`${mono} shrink-0 text-slate-500`}>
              {q} × ${miles(p as number)}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-white">
        <span className="text-[13px] text-white/70">Total</span>
        <span className="text-lg font-semibold tabular-nums">$185.000</span>
      </div>
      <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-[12.5px] text-emerald-800 ring-1 ring-emerald-600/15">
        <Icono nombre="check" grosor={2.4} className="size-4 text-emerald-600" />
        Autorizada · CAE <span className={mono}>76384920113542</span>
      </div>
    </div>
  );
}

function MockCobros() {
  // QR decorativo determinista
  const celdas = Array.from({ length: 121 }, (_, i) => ((i * 37 + (i % 7) * 13) % 5 < 2 ? 1 : 0));
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-900">Link de pago</p>
        <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200/70">
          <p className="text-[11px] text-slate-500">Ferro Diseño te debe</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">$96.400</p>
          <p className="mt-1 text-[12px] text-slate-500">Factura C 0003-00000140 · vence el 7 oct</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["Transferencia", "Tarjeta", "QR"].map((m) => (
            <span key={m} className="rounded-full bg-white px-2.5 py-1 text-[11.5px] text-slate-700 ring-1 ring-slate-200">
              {m}
            </span>
          ))}
        </div>
        <div className="rounded-xl p-3 ring-1 ring-slate-200/70">
          <p className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">Recordatorios</p>
          <ol className="mt-2 space-y-2 text-[12.5px]">
            <li className="flex items-center gap-2 text-slate-800">
              <span className="size-2 rounded-full bg-emerald-500" /> Enviada · 27 sep
            </li>
            <li className="flex items-center gap-2 text-slate-800">
              <span className="size-2 rounded-full bg-emerald-500" /> Recordatorio amable · 4 oct
            </li>
            <li className="flex items-center gap-2 text-slate-500">
              <span className="size-2 rounded-full bg-slate-300" /> Aviso de vencimiento · 7 oct
            </li>
          </ol>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center rounded-xl bg-indigo-50/70 p-4 ring-1 ring-indigo-100">
        <div className="grid grid-cols-[repeat(11,1fr)] gap-[2px] rounded-lg bg-white p-2.5">
          {celdas.map((c, i) => {
            const esquina = [0, 1, 2, 11, 13, 22, 23, 24, 8, 9, 10, 19, 21, 30, 31, 32, 88, 89, 90, 99, 101, 110, 111, 112].includes(i);
            return <span key={i} className={`size-2.5 rounded-[2px] ${esquina || c ? "bg-slate-900" : "bg-transparent"}`} />;
          })}
        </div>
        <p className="mt-3 text-[11.5px] text-indigo-900/70">Escaneá para pagar</p>
      </div>
    </div>
  );
}

function MockReportes() {
  const puntos = [18, 26, 22, 34, 31, 42, 48, 45, 57, 62, 70, 78];
  const w = 320;
  const h = 120;
  const path = puntos.map((p, i) => `${i === 0 ? "M" : "L"}${(i / (puntos.length - 1)) * w} ${h - (p / 80) * h}`).join(" ");
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">Facturación de los últimos 12 meses</p>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">+64 %</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h + 6}`} className="h-36 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cc-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4F46E5" stopOpacity="0.25" />
            <stop offset="1" stopColor="#4F46E5" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((k) => (
          <line key={k} x1="0" x2={w} y1={h * k} y2={h * k} stroke="#E2E8F0" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
        ))}
        <path d={`${path} L${w} ${h} L0 ${h}Z`} fill="url(#cc-area)" />
        <path d={path} fill="none" stroke="#4F46E5" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
      <div className="grid grid-cols-3 gap-2">
        {[
          ["Mejor cliente", "Vértice Obras"],
          ["Ticket promedio", "$142.300"],
          ["Días de cobro", "9,4"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl p-3 ring-1 ring-slate-200/70">
            <p className="text-[10.5px] text-slate-500">{k}</p>
            <p className="mt-1 truncate text-[13px] font-semibold text-slate-900 tabular-nums">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockMonotributo() {
  const cats = [
    ["C", 100],
    ["D", 62],
    ["E", 0],
  ] as const;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">Tu categoría</p>
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700">Categoría D</span>
      </div>
      <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200/70">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] text-slate-500">Facturado en 12 meses</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">$21.480.000</p>
          </div>
          <p className={`${mono} text-[12px] text-slate-500`}>tope $34.600.000</p>
        </div>
        <div className="mt-4 flex gap-1">
          {cats.map(([c, v]) => (
            <div key={c} className="flex-1">
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div className={`h-full rounded-full ${c === "D" ? "bg-[#4F46E5]" : "bg-indigo-300"}`} style={{ width: `${v}%` }} />
              </div>
              <p className={`${mono} mt-1.5 text-center text-[11px] ${c === "D" ? "font-medium text-indigo-700" : "text-slate-400"}`}>{c}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-3 rounded-xl bg-amber-50 p-3.5 text-[12.5px] text-amber-900 ring-1 ring-amber-600/15">
        <Icono nombre="info" grosor={2} className="mt-0.5 size-4 shrink-0 text-amber-600" />
        <p>
          Al ritmo actual, llegás al tope en <strong className="font-semibold">marzo</strong>. Te conviene revisarlo con tu contador en la próxima
          recategorización.
        </p>
      </div>
    </div>
  );
}

const mocks: Record<string, () => React.JSX.Element> = {
  facturacion: MockFacturacion,
  cobros: MockCobros,
  reportes: MockReportes,
  monotributo: MockMonotributo,
};

export function Funciones() {
  const [activa, setActiva] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const t = tabs[activa]!;
  const Mock = mocks[t.id]!;

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const mapa: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
    if (!(e.key in mapa)) return;
    e.preventDefault();
    const n = (mapa[e.key]! + tabs.length) % tabs.length;
    setActiva(n);
    refs.current[n]?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="Funciones de Cuentaclara" className="-mx-5 flex gap-1 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:inline-flex sm:rounded-2xl sm:bg-slate-100 sm:p-1.5 sm:px-1.5">
        {tabs.map((tab, i) => {
          const sel = i === activa;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={`cc-tab-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={sel}
              aria-controls={`cc-panel-${tab.id}`}
              tabIndex={sel ? 0 : -1}
              onClick={() => setActiva(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-[background-color,color,box-shadow] duration-200 ${
                sel ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icono nombre={tab.icono} grosor={1.8} className={`size-4 ${sel ? "text-[#4F46E5]" : ""}`} />
              {tab.nombre}
            </button>
          );
        })}
      </div>

      <div
        id={`cc-panel-${t.id}`}
        role="tabpanel"
        aria-labelledby={`cc-tab-${t.id}`}
        tabIndex={0}
        className="mt-8 grid grid-cols-1 items-center gap-10 rounded-3xl lg:grid-cols-2 lg:gap-16"
      >
        <div key={`txt-${t.id}`} className="cc-aparecer">
          <h3 className="text-[clamp(1.6rem,3vw,2.2rem)] leading-tight font-semibold tracking-[-0.025em] text-slate-900">{t.titulo}</h3>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-slate-600">{t.texto}</p>
          <ul className="mt-8 space-y-3">
            {t.puntos.map((p) => (
              <li key={p} className="flex items-center gap-3 text-slate-800">
                <span className="flex size-6 items-center justify-center rounded-full bg-indigo-50 text-[#4F46E5]">
                  <Icono nombre="check" grosor={2.4} className="size-3.5" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div aria-hidden="true" className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-indigo-100 via-violet-50 to-emerald-50 sm:-inset-6" />
          <div key={`mock-${t.id}`} className="cc-aparecer relative rounded-2xl bg-white p-5 shadow-[0_30px_60px_-30px_rgba(30,27,75,0.3),0_0_0_1px_rgba(15,23,42,0.06)] sm:p-6" aria-hidden="true">
            <Mock />
          </div>
        </div>
      </div>
    </div>
  );
}
