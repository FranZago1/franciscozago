"use client";

import { useCallback, useMemo, useState } from "react";
import { Cajon } from "../shared/Cajon";
import { PERIODOS, type Periodo } from "../shared/datos";
import { delta, fechaConDia, fechaCorta, pesos, pesosCompacto, porcentaje } from "../shared/formato";
import { useNumeroAnimado } from "../shared/hooks";
import { LineChart } from "../shared/LineChart";
import { SelectorPeriodo } from "../shared/SelectorPeriodo";
import { Sparkline } from "../shared/Sparkline";
import { finanzas, POR_COBRAR, POR_PAGAR, SALDO_HOY, type CategoriaId } from "./datos";
import { Cuentas, DonaGastos, EGRESOS, FlujoCaja, INGRESOS } from "./Graficos";
import { Movimientos } from "./Movimientos";

const tema = {
  "--dv-surface": "#12151a",
  "--dv-ink": "#eceef2",
  "--dv-ink2": "#a9afba",
  "--dv-muted": "#7c838f",
  "--dv-grid": "#1d2128",
  "--dv-axis": "#363d48",
  "--dv-cross": "#5a616d",
  "--dv-tip-bg": "#1b1f26",
  "--dv-tip-ink": "#ffffff",
  "--dv-tip-ink2": "#a9afba",
  "--dv-tip-border": "#2c323c",
  "--dv-focus": "#7fb2ff",
  "--dv-neto": "#e9e4d8",
  "--dv-acento": "#f0876e",
  "--dv-umbral": "#f0876e",
} as React.CSSProperties;

const mono = "font-[family-name:var(--font-tc-mono)]";

type Ico = (p: { className?: string }) => React.ReactElement;
const trazo = {
  width: 20,
  height: 20,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};
const IcoResumen: Ico = ({ className }) => (
  <svg {...trazo} className={className}>
    <path d="M3 16.5h14M5.5 13.5V9M10 13.5V5M14.5 13.5v-6" />
  </svg>
);
const IcoFlujo: Ico = ({ className }) => (
  <svg {...trazo} className={className}>
    <path d="M4 7h10l-3-3M16 13H6l3 3" />
  </svg>
);
const IcoProyeccion: Ico = ({ className }) => (
  <svg {...trazo} className={className}>
    <path d="M3 14c2.5 0 3.5-5 6-5s3 3 5 3 2-4 3-5" />
    <path d="M3 17h14" strokeOpacity=".5" />
  </svg>
);
const IcoCuentas: Ico = ({ className }) => (
  <svg {...trazo} className={className}>
    <rect x="3" y="4.5" width="14" height="11" rx="2" />
    <path d="M3 8.5h14M6.5 12h3" />
  </svg>
);
const IcoMovs: Ico = ({ className }) => (
  <svg {...trazo} className={className}>
    <path d="M6 5h11M6 10h11M6 15h11M3 5h.01M3 10h.01M3 15h.01" />
  </svg>
);
const IcoAlerta: Ico = ({ className }) => (
  <svg {...trazo} className={className}>
    <path d="M5 8.5a5 5 0 0 1 10 0c0 4 1.5 5.5 1.5 5.5h-13S5 12.5 5 8.5ZM8.3 16.5a1.8 1.8 0 0 0 3.4 0" />
  </svg>
);

/** Flor de ceibo estilizada. */
function Marca({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
      <rect width="36" height="36" rx="10" fill="#1d1414" />
      <path d="M18 27c-1.2-5 .2-9.5 3-13" stroke="#6f9a6a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M21 14c-3.8-1.5-6.8-4.8-6.3-8.2 3.6.3 7.2 3.5 6.3 8.2Z" fill="#f0876e" />
      <path d="M21 14c1.6-3.6 4.8-5.6 7.6-4.6-.6 3.4-4 5.6-7.6 4.6Z" fill="#d9553c" />
      <path d="M21 14c-3.6 1.4-7 .6-8.6-1.8 2.6-2 6.4-1.4 8.6 1.8Z" fill="#c2402b" />
    </svg>
  );
}

const NAV: { href: string; texto: string; icono: Ico }[] = [
  { href: "#resumen", texto: "Resumen", icono: IcoResumen },
  { href: "#flujo", texto: "Flujo de caja", icono: IcoFlujo },
  { href: "#proyeccion", texto: "Proyección", icono: IcoProyeccion },
  { href: "#cuentas", texto: "Cobrar y pagar", icono: IcoCuentas },
  { href: "#movimientos", texto: "Movimientos", icono: IcoMovs },
  { href: "#alertas", texto: "Alertas", icono: IcoAlerta },
];

function Tarjeta({
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
      className={`min-w-0 scroll-mt-20 rounded-[14px] border border-white/[0.07] bg-[#12151a] p-4 sm:p-5 ${className}`}
    >
      <header className="mb-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <h2 id={id ? `${id}-t` : undefined} className="text-[14.5px] font-medium text-[#eceef2]">
            {titulo}
          </h2>
          {bajada ? <p className="mt-0.5 text-[12.5px] text-[#8b919c]">{bajada}</p> : null}
        </div>
        {accion}
      </header>
      {children}
    </section>
  );
}

function Variacion({ v, subirEsBueno = true }: { v: number; subirEsBueno?: boolean }) {
  const bueno = subirEsBueno ? v >= 0 : v <= 0;
  return (
    <span className={`inline-flex items-center gap-1 text-[12px] font-medium tabular-nums ${bueno ? "text-[#5fd08a]" : "text-[#ff8a8a]"}`}>
      <span aria-hidden="true">{v >= 0 ? "↑" : "↓"}</span>
      {delta(v)}
    </span>
  );
}

type Nivel = "critico" | "aviso" | "info" | "ok";
type Alerta = { id: string; nivel: Nivel; titulo: string; detalle: string };

const ESTILO_ALERTA: Record<Nivel, { etiqueta: string; color: string; fondo: string }> = {
  critico: { etiqueta: "Urgente", color: "#ff8a8a", fondo: "rgba(208,59,59,0.14)" },
  aviso: { etiqueta: "Atención", color: "#fab219", fondo: "rgba(250,178,25,0.12)" },
  info: { etiqueta: "Para revisar", color: "#8cbcf5", fondo: "rgba(57,135,229,0.14)" },
  ok: { etiqueta: "En orden", color: "#5fd08a", fondo: "rgba(12,163,12,0.14)" },
};

function IconoAlerta({ nivel }: { nivel: Nivel }) {
  const p = { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, "aria-hidden": true };
  if (nivel === "critico" || nivel === "aviso")
    return (
      <svg {...p}>
        <path d="M8 2.5 14 13H2Z" strokeLinejoin="round" />
        <path d="M8 6.5v3M8 11.3v.1" />
      </svg>
    );
  if (nivel === "ok")
    return (
      <svg {...p}>
        <circle cx="8" cy="8" r="5.8" />
        <path d="m5.4 8.2 1.8 1.8 3.4-3.6" />
      </svg>
    );
  return (
    <svg {...p}>
      <circle cx="8" cy="8" r="5.8" />
      <path d="M8 7.5v3.5M8 5v.1" />
    </svg>
  );
}

function Alertas({ alertas }: { alertas: Alerta[] }) {
  const [ocultas, setOcultas] = useState<string[]>([]);
  const [aviso, setAviso] = useState("");
  const visibles = alertas.filter((a) => !ocultas.includes(a.id));
  return (
    <div>
      <ul className="flex flex-col gap-2">
        {visibles.map((a) => {
          const e = ESTILO_ALERTA[a.nivel];
          return (
            <li key={a.id} className="flex gap-3 rounded-[10px] p-3" style={{ background: e.fondo }}>
              <span className="mt-0.5 shrink-0" style={{ color: e.color }}>
                <IconoAlerta nivel={a.nivel} />
              </span>
              <div className="min-w-0 flex-1">
                <p className={`${mono} text-[10.5px] tracking-[0.08em] uppercase`} style={{ color: e.color }}>
                  {e.etiqueta}
                </p>
                <p className="mt-0.5 text-[13.5px] font-medium text-[#eceef2]">{a.titulo}</p>
                <p className="mt-0.5 text-[12.5px] leading-snug text-[#a9afba]">{a.detalle}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOcultas((o) => [...o, a.id]);
                  setAviso(`Alerta "${a.titulo}" archivada.`);
                }}
                aria-label={`Archivar alerta: ${a.titulo}`}
                className="-mt-1 -mr-1 grid size-7 shrink-0 place-items-center rounded-md text-[#7c838f] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-[var(--dv-focus)]"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="m4 4 8 8M12 4l-8 8" />
                </svg>
              </button>
            </li>
          );
        })}
      </ul>
      {!visibles.length ? <p className="py-6 text-center text-[13px] text-[#a9afba]">No hay alertas pendientes.</p> : null}
      {ocultas.length ? (
        <button
          type="button"
          onClick={() => {
            setOcultas([]);
            setAviso("Alertas restauradas.");
          }}
          className="mt-3 text-[12.5px] text-[#a9afba] underline underline-offset-4 hover:text-white"
        >
          Restaurar {ocultas.length === 1 ? "1 alerta archivada" : `${ocultas.length} alertas archivadas`}
        </button>
      ) : null}
      <p className="sr-only" aria-live="polite">
        {aviso}
      </p>
    </div>
  );
}

export function FinanzasDashboard() {
  const [periodo, setPeriodo] = useState<Periodo>("30d");
  const [aislada, setAislada] = useState<CategoriaId | null>(null);
  const [catTabla, setCatTabla] = useState<CategoriaId | "todas">("todas");
  const [menu, setMenu] = useState(false);
  const f = useMemo(() => finanzas(periodo), [periodo]);
  const info = PERIODOS.find((p) => p.id === periodo)!;
  const cerrar = useCallback(() => setMenu(false), []);

  const ingresosA = useNumeroAnimado(f.ingresos);
  const egresosA = useNumeroAnimado(f.egresos);
  const netoA = useNumeroAnimado(f.neto);

  const { historia, proy, colchon, cruce } = f.proyeccion;
  const nH = historia.length;
  const etiquetas = [...historia.map((h) => fechaConDia(h.t)), ...proy.map((p) => fechaConDia(p.t))];
  const ejeX = [...historia.map((h) => fechaCorta(h.t)), ...proy.map((p) => fechaCorta(p.t))];
  const real = [...historia.map((h) => h.saldo), ...proy.map(() => null)];
  const proyectada = [...historia.map((_, i) => (i === nH - 1 ? SALDO_HOY : null)), ...proy.map((p) => p.medio)];
  const bandaInf = [...historia.map((h) => h.saldo), ...proy.map((p) => p.inf)];
  const bandaSup = [...historia.map((h) => h.saldo), ...proy.map((p) => p.sup)];
  const fin = proy[proy.length - 1]!;
  const minimo = proy.reduce((a, p) => (p.medio < a.medio ? p : a), proy[0]!);

  const alertas: Alerta[] = [
    {
      id: "iva",
      nivel: "critico",
      titulo: "Vence el IVA en 5 días",
      detalle: `IVA de septiembre por ${pesos(3_940_000)}. Hay saldo para cubrirlo: conviene pagarlo antes de los sueldos.`,
    },
    cruce
      ? {
          id: "colchon",
          nivel: "aviso",
          titulo: `La caja baja del colchón el ${fechaConDia(cruce.t)}`,
          detalle: `Con los pagos agendados, la caja proyectada llega a ${pesosCompacto(minimo.medio)} (mínimo sugerido: ${pesosCompacto(colchon)}). Adelantá cobros o mové un pago.`,
        }
      : {
          id: "colchon",
          nivel: "ok",
          titulo: "La caja proyectada se mantiene sobre el colchón",
          detalle: `El punto más bajo de los próximos 90 días es ${pesosCompacto(minimo.medio)}, el ${fechaConDia(minimo.t)}.`,
        },
    {
      id: "robles",
      nivel: "aviso",
      titulo: "Mueblería Los Robles debe 2 facturas",
      detalle: `${pesos(1_810_000)} vencidos hace 24 y 38 días. Mandale un recordatorio.`,
    },
    {
      id: "tableros",
      nivel: "info",
      titulo: "Factura de Tableros del Centro vencida",
      detalle: `${pesos(1_240_000)}, vencida hace 6 días. Revisá si ya se pagó por otro medio.`,
    },
  ];

  const irAMovimientos = (id: CategoriaId) => {
    setCatTabla(id);
    document.getElementById("movimientos")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  };

  const navegacion = (conTexto: boolean) => (
    <nav aria-label="Secciones" className="flex flex-col gap-1">
      {NAV.map(({ href, texto, icono: I }, i) => (
        <a
          key={href}
          href={href}
          onClick={() => setMenu(false)}
          title={conTexto ? undefined : texto}
          aria-label={conTexto ? undefined : texto}
          className={`group relative flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[14px] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--dv-focus)] ${
            i === 0 ? "bg-white/[0.08] text-white" : "text-[#8b919c] hover:bg-white/[0.05] hover:text-white"
          } ${conTexto ? "" : "justify-center px-0"}`}
        >
          <I className="size-5 shrink-0" />
          {conTexto ? texto : null}
          {!conTexto ? (
            <span className="pointer-events-none absolute left-[calc(100%+10px)] z-40 rounded-md bg-[#1b1f26] px-2 py-1 text-[12px] whitespace-nowrap text-white opacity-0 ring-1 ring-white/10 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              {texto}
            </span>
          ) : null}
        </a>
      ))}
    </nav>
  );

  return (
    <div
      style={tema}
      data-demo="finanzas"
      className="min-h-dvh bg-[#0b0d10] font-[family-name:var(--font-tc)] text-[#eceef2] antialiased [color-scheme:dark]"
    >
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-lg focus:bg-[#1b1f26] focus:px-3 focus:py-2"
      >
        Saltar al contenido
      </a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[76px] flex-col items-center border-r border-white/[0.06] bg-[#0d0f13] py-5 lg:flex">
        <Marca className="mb-8 size-10" />
        <div className="w-full px-3">{navegacion(false)}</div>
        <span className="mt-auto grid size-9 place-items-center rounded-full bg-[#2a1d1a] text-[12px] font-semibold text-[#f0876e]" title="Mariana Ceballos">
          MC
        </span>
      </aside>

      <Cajon abierto={menu} onCerrar={cerrar} etiqueta="Menú" className="absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col bg-[#101318] p-4 text-white shadow-2xl ring-1 ring-white/10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Marca className="size-8" />
            <span className="font-medium">Taller Ceibo</span>
          </div>
          <button type="button" onClick={cerrar} aria-label="Cerrar menú" className="grid size-9 place-items-center rounded-lg hover:bg-white/10">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="m5 5 10 10M15 5 5 15" />
            </svg>
          </button>
        </div>
        {navegacion(true)}
      </Cajon>

      <div className="lg:pl-[76px]">
        <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#0b0d10]/85 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-[1360px] items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setMenu(true)}
              aria-label="Abrir menú"
              aria-expanded={menu}
              className="-ml-1.5 grid size-9 place-items-center rounded-lg text-[#c9cdd4] hover:bg-white/10 lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M3 5.5h14M3 10h14M3 14.5h14" />
              </svg>
            </button>
            <Marca className="size-7 lg:hidden" />
            <p className="text-[14px] font-medium">
              Taller Ceibo <span className="text-[#6c727d]">/</span> <span className="text-[#a9afba]">Finanzas</span>
            </p>
            <p className={`${mono} ml-auto hidden text-[12px] text-[#7c838f] sm:block`}>mar 29 sep 2026 · ARS</p>
          </div>
        </header>

        <main id="contenido" className="mx-auto max-w-[1360px] px-4 pt-6 pb-28 sm:px-6 lg:px-8 lg:pt-8">
          <div id="resumen" className="mb-6 flex scroll-mt-20 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={`${mono} text-[11.5px] tracking-[0.12em] text-[#f0876e] uppercase`}>Tablero financiero</p>
              <h1 className="mt-1.5 text-[26px] font-semibold tracking-[-0.02em] sm:text-[30px]">Cómo está la plata del taller</h1>
              <p className="mt-1 text-[13px] text-[#8b919c]">{info.largo} · movimientos conciliados hasta hoy</p>
            </div>
            <SelectorPeriodo
              valor={periodo}
              onCambio={setPeriodo}
              clases={{
                grupo: "inline-flex self-start rounded-[10px] border border-white/10 bg-[#12151a] p-1 sm:self-auto",
                opcion:
                  "rounded-[7px] px-3 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--dv-focus)]",
                activa: "bg-[#eceef2] text-[#0b0d10]",
                inactiva: "text-[#a9afba] hover:text-white",
              }}
            />
          </div>
          <p className="sr-only" aria-live="polite">
            Mostrando {info.largo.toLowerCase()}.
          </p>

          {/* KPIs: un número protagonista (saldo) y tres de apoyo */}
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.35fr_1fr_1fr_1fr]">
            <div className="relative overflow-hidden rounded-[14px] border border-[#f0876e]/25 bg-[linear-gradient(135deg,#1c1413_0%,#12151a_60%)] p-5 md:col-span-2 xl:col-span-1">
              <p className="text-[13px] text-[#c9b8b3]">Saldo en caja y bancos</p>
              <p className="mt-2 text-[40px] leading-none font-semibold tracking-[-0.03em] sm:text-[48px]">{pesosCompacto(SALDO_HOY)}</p>
              <p className="mt-2 text-[12.5px] text-[#a9afba]">
                {pesos(SALDO_HOY)} al cierre de hoy · <span className={mono}>3 cuentas</span>
              </p>
              <Sparkline valores={f.saldoSerie} color="#f0876e" alto={40} className="mt-4 w-full" />
              <p className={`${mono} mt-1 flex justify-between text-[10.5px] text-[#6c727d]`}>
                <span>hace 30 días</span>
                <span>hoy</span>
              </p>
            </div>
            {[
              { t: "Ingresos", v: ingresosA, var: f.varIngresos, bueno: true, color: INGRESOS, serie: f.baldes.map((b) => b.ingresos) },
              { t: "Egresos", v: egresosA, var: f.varEgresos, bueno: false, color: EGRESOS, serie: f.baldes.map((b) => b.egresos) },
            ].map((k) => (
              <div key={k.t} className="flex flex-col rounded-[14px] border border-white/[0.07] bg-[#12151a] p-5">
                <p className="flex items-center gap-2 text-[13px] text-[#a9afba]">
                  <span aria-hidden="true" className="size-2 rounded-[2px]" style={{ background: k.color }} />
                  {k.t}
                </p>
                <p className="mt-2 text-[28px] leading-none font-semibold tracking-[-0.02em]">{pesosCompacto(k.v)}</p>
                <p className="mt-3 flex flex-wrap items-center gap-x-2 text-[12px] text-[#7c838f]">
                  <Variacion v={k.var} subirEsBueno={k.bueno} />
                  {info.anterior}
                </p>
                <div className="mt-auto pt-4">
                  <Sparkline valores={k.serie} color={k.color} alto={32} className="w-full" />
                </div>
              </div>
            ))}
            <div className="flex flex-col rounded-[14px] border border-white/[0.07] bg-[#12151a] p-5">
              <p className="text-[13px] text-[#a9afba]">Resultado del período</p>
              <p className={`mt-2 text-[28px] leading-none font-semibold tracking-[-0.02em] ${netoA < 0 ? "text-[#ff8a8a]" : ""}`}>{pesosCompacto(netoA)}</p>
              <p className="mt-3 text-[12px] text-[#7c838f]">
                Margen de caja <span className="font-medium text-[#eceef2]">{porcentaje(f.margen)}</span>
              </p>
              <div className="mt-auto pt-4">
                <Sparkline valores={f.baldes.map((b) => b.ingresos - b.egresos)} color="#e9e4d8" alto={32} className="w-full" />
              </div>
            </div>
          </div>

          <div className="mt-3 grid gap-3 xl:grid-cols-3">
            <Tarjeta
              id="flujo"
              titulo="Flujo de caja"
              bajada={periodo === "12m" ? "Ingresos y egresos por mes" : periodo === "30d" ? "Ingresos y egresos cada 3 días" : "Ingresos y egresos por día"}
              className="xl:col-span-2"
              accion={
                <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#a9afba]" aria-label="Referencias">
                  <li className="flex items-center gap-1.5">
                    <span aria-hidden="true" className="size-2.5 rounded-[3px]" style={{ background: INGRESOS }} /> Ingresos
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span aria-hidden="true" className="size-2.5 rounded-[3px]" style={{ background: EGRESOS }} /> Egresos
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span aria-hidden="true" className="h-[2px] w-3.5 rounded-full bg-[#e9e4d8]" /> Neto
                  </li>
                </ul>
              }
            >
              <FlujoCaja baldes={f.baldes} />
            </Tarjeta>
            <Tarjeta id="alertas" titulo="Alertas" bajada="Lo que conviene mirar esta semana">
              <Alertas alertas={alertas} />
            </Tarjeta>
          </div>

          <div className="mt-3 grid gap-3 xl:grid-cols-3">
            <Tarjeta
              id="proyeccion"
              titulo="Caja proyectada a 90 días"
              bajada={`Según el ritmo de ${info.largo.toLowerCase()} y los pagos agendados`}
              className="xl:col-span-2"
              accion={
                <div className="text-right">
                  <p className="text-[12px] text-[#7c838f]">Al {fechaCorta(fin.t)}</p>
                  <p className="text-[18px] font-semibold tabular-nums">{pesosCompacto(fin.medio)}</p>
                </div>
              }
            >
              <ul className="-mt-1 mb-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#a9afba]" aria-label="Referencias">
                <li className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="h-[2px] w-3.5 rounded-full bg-[#e9e4d8]" /> Saldo real
                </li>
                <li className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="h-[2px] w-3.5 rounded-full bg-[#3987e5]" /> Proyección
                </li>
                <li className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="h-2.5 w-3.5 rounded-[3px] bg-[#3987e5]/30" /> Rango probable
                </li>
                <li className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="w-3.5 border-t border-dashed border-[#f0876e]" /> Colchón mínimo
                </li>
              </ul>
              <LineChart
                titulo="Saldo de caja: últimos 30 días y proyección a 90 días"
                alto={320}
                etiquetas={etiquetas}
                ejeX={ejeX}
                formatoY={pesosCompacto}
                formatoValor={pesos}
                desdeCero={false}
                series={[
                  { id: "real", nombre: "Saldo real", valores: real, color: "#e9e4d8", area: true },
                  { id: "proy", nombre: "Proyección", valores: proyectada, color: "#3987e5" },
                ]}
                banda={{ nombre: "rango probable", inferior: bandaInf, superior: bandaSup, color: "#3987e5" }}
                marcaX={{ indice: nH - 1, texto: "Hoy" }}
                umbral={{ valor: colchon, texto: `Colchón ${pesosCompacto(colchon)}` }}
              />
            </Tarjeta>
            <Tarjeta titulo="Gastos por categoría" bajada={info.largo}>
              <DonaGastos gastos={f.gastos} aislada={aislada} onAislar={setAislada} onVerMovimientos={irAMovimientos} />
            </Tarjeta>
          </div>

          <Tarjeta id="cuentas" titulo="Cuentas por cobrar y por pagar" bajada="Saldos abiertos al día de hoy y próximos vencimientos" className="mt-3">
            <div className="grid gap-8 md:grid-cols-2">
              <Cuentas titulo="Por cobrar" cuentas={POR_COBRAR} tipo="cobrar" />
              <Cuentas titulo="Por pagar" cuentas={POR_PAGAR} tipo="pagar" />
            </div>
          </Tarjeta>

          <Tarjeta id="movimientos" titulo="Movimientos" bajada={info.largo} className="mt-3">
            <Movimientos movs={f.movs} categoria={catTabla} onCategoria={setCatTabla} />
          </Tarjeta>

          <footer className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-white/[0.06] pt-6 text-[12px] text-[#7c838f] sm:flex-row">
            <p>Taller Ceibo · Muebles a medida</p>
            <p>Demo con contenido ficticio</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
