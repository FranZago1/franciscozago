"use client";

import { useCallback, useMemo, useState } from "react";
import { Cajon } from "../shared/Cajon";
import { PERIODOS, type Periodo } from "../shared/datos";
import { delta, deltaPp, numero, pesos, pesosCompacto, porcentaje } from "../shared/formato";
import { LineChart } from "../shared/LineChart";
import { SelectorPeriodo } from "../shared/SelectorPeriodo";
import { resumen } from "./datos";
import { Canales, Categorias, Embudo, PedidosRecientes, TopProductos } from "./Graficos";
import {
  IcoAjustes,
  IcoBuscar,
  IcoCampana,
  IcoCanales,
  IcoCerrar,
  IcoClientes,
  IcoDescargar,
  IcoEmbudo,
  IcoMenu,
  IcoPedidos,
  IcoProductos,
  IcoResumen,
  IcoVentas,
  Marca,
} from "./Iconos";
import { Kpi } from "./Kpi";

const tema = {
  "--dv-surface": "#ffffff",
  "--dv-ink": "#101828",
  "--dv-ink2": "#475467",
  "--dv-muted": "#79808b",
  "--dv-grid": "#eef0f3",
  "--dv-axis": "#d0d5dd",
  "--dv-cross": "#98a2b3",
  "--dv-tip-bg": "#ffffff",
  "--dv-tip-ink": "#101828",
  "--dv-tip-ink2": "#667085",
  "--dv-tip-border": "#e4e7ec",
  "--dv-focus": "#2a78d6",
} as React.CSSProperties;

const NAV = [
  { href: "#resumen", texto: "Resumen", icono: IcoResumen },
  { href: "#ventas", texto: "Ventas", icono: IcoVentas },
  { href: "#canales", texto: "Canales", icono: IcoCanales },
  { href: "#embudo", texto: "Conversión", icono: IcoEmbudo },
  { href: "#productos", texto: "Productos", icono: IcoProductos },
  { href: "#pedidos", texto: "Pedidos", icono: IcoPedidos },
];

function Navegacion({ activo, onIr }: { activo: string; onIr: (h: string) => void }) {
  return (
    <nav aria-label="Secciones del tablero" className="flex flex-col gap-0.5">
      {NAV.map(({ href, texto, icono: Ico }) => {
        const on = activo === href;
        return (
          <a
            key={href}
            href={href}
            onClick={() => onIr(href)}
            aria-current={on ? "true" : undefined}
            className={`flex items-center gap-3 rounded-[10px] px-3 py-2 text-[14px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2a78d6] ${
              on ? "bg-[#eef4fc] text-[#1c4f94]" : "text-[#475467] hover:bg-[#f4f5f7] hover:text-[#101828]"
            }`}
          >
            <Ico className="size-[18px] shrink-0" />
            {texto}
          </a>
        );
      })}
      <div className="my-3 h-px bg-[#eceef1]" />
      <span className="flex cursor-not-allowed items-center gap-3 rounded-[10px] px-3 py-2 text-[14px] font-medium text-[#6F7683]">
        <IcoClientes className="size-[18px]" /> Clientes
        <span className="ml-auto rounded-full bg-[#f2f4f7] px-1.5 py-0.5 text-[10.5px] text-[#667085]">Pronto</span>
      </span>
      <span className="flex cursor-not-allowed items-center gap-3 rounded-[10px] px-3 py-2 text-[14px] font-medium text-[#6F7683]">
        <IcoAjustes className="size-[18px]" /> Ajustes
      </span>
    </nav>
  );
}

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
      className={`min-w-0 scroll-mt-20 rounded-2xl border border-[#e8eaee] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-5 ${className}`}
    >
      <header className="mb-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <h2 id={id ? `${id}-t` : undefined} className="text-[15px] font-semibold text-[#101828]">
            {titulo}
          </h2>
          {bajada ? <p className="mt-0.5 text-[12.5px] text-[#667085]">{bajada}</p> : null}
        </div>
        {accion}
      </header>
      {children}
    </section>
  );
}

function descargarCsv(periodo: Periodo) {
  const r = resumen(periodo);
  const filas = [
    ["Período", "Ventas ($)", "Pedidos", "Visitas", "Ventas período anterior ($)"],
    ...r.puntos.map((p, i) => [
      p.etiqueta,
      Math.round(p.ventas),
      p.pedidos,
      p.visitas,
      Math.round(r.anterior[i]?.ventas ?? 0),
    ]),
  ];
  const csv = filas.map((f) => f.join(";")).join("\n");
  const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `almacen-norte-ventas-${periodo}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function VentasDashboard() {
  const [periodo, setPeriodo] = useState<Periodo>("30d");
  const [menu, setMenu] = useState(false);
  const [seccion, setSeccion] = useState("#resumen");
  const r = useMemo(() => resumen(periodo), [periodo]);
  const info = PERIODOS.find((p) => p.id === periodo)!;
  const cerrar = useCallback(() => setMenu(false), []);

  const serieActual = r.puntos.map((p) => p.ventas);
  const serieAnterior = r.anterior.map((p) => p.ventas);

  return (
    <div style={tema} className="min-h-dvh bg-[#f5f6f8] font-[family-name:var(--font-an)] text-[#101828] antialiased">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:shadow"
      >
        Saltar al contenido
      </a>

      {/* Sidebar escritorio */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-[#e8eaee] bg-white px-4 py-5 lg:flex">
        <div className="mb-7 flex items-center gap-2.5 px-2">
          <Marca className="size-9" />
          <div className="leading-tight">
            <p className="text-[14.5px] font-bold tracking-[-0.01em]">Almacén Norte</p>
            <p className="text-[12px] text-[#667085]">Tienda online</p>
          </div>
        </div>
        <Navegacion activo={seccion} onIr={setSeccion} />
        <div className="mt-auto rounded-xl border border-[#e8eaee] bg-[#fafbfc] p-3.5">
          <p className="text-[12.5px] font-semibold">Meta de septiembre</p>
          <p className="mt-0.5 text-[12px] text-[#667085]">$ 78 M en ventas</p>
          <div className="mt-2.5 h-1.5 rounded-full bg-[#dbe7f8]">
            <div className="h-full w-[86%] rounded-full bg-[#2a78d6]" />
          </div>
          <p className="mt-1.5 text-[11.5px] text-[#667085]">86 % cumplido · faltan 2 días</p>
        </div>
        <div className="mt-4 flex items-center gap-2.5 px-2">
          <span className="grid size-8 place-items-center rounded-full bg-[#ffe9dc] text-[12px] font-semibold text-[#9a3a12]">LF</span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[13px] font-medium">Lucía Ferreyra</p>
            <p className="truncate text-[11.5px] text-[#667085]">Dueña</p>
          </div>
        </div>
      </aside>

      <Cajon
        abierto={menu}
        onCerrar={cerrar}
        etiqueta="Menú"
        className="absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col bg-white px-4 py-5 shadow-xl"
      >
        <div className="mb-6 flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <Marca className="size-8" />
            <p className="text-[14.5px] font-bold">Almacén Norte</p>
          </div>
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar menú"
            className="grid size-9 place-items-center rounded-lg text-[#475467] hover:bg-[#f4f5f7]"
          >
            <IcoCerrar className="size-5" />
          </button>
        </div>
        <Navegacion
          activo={seccion}
          onIr={(h) => {
            setSeccion(h);
            setMenu(false);
          }}
        />
      </Cajon>

      <div className="lg:pl-[248px]">
        {/* Barra superior */}
        <header className="sticky top-0 z-20 border-b border-[#e8eaee] bg-white/85 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-[1320px] items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setMenu(true)}
              aria-label="Abrir menú"
              aria-expanded={menu}
              className="-ml-1.5 grid size-9 place-items-center rounded-lg text-[#344054] hover:bg-[#f4f5f7] lg:hidden"
            >
              <IcoMenu className="size-5" />
            </button>
            <div className="flex items-center gap-2 lg:hidden">
              <Marca className="size-7" />
              <span className="text-[14px] font-bold">Almacén Norte</span>
            </div>
            <label className="relative ml-auto hidden w-full max-w-[320px] md:block lg:ml-0">
              <span className="sr-only">Buscar pedidos o productos</span>
              <IcoBuscar className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#98a2b3]" />
              <input
                type="search"
                placeholder="Buscar pedidos, productos…"
                className="h-9 w-full rounded-[10px] border border-[#e4e7ec] bg-[#f9fafb] pr-3 pl-9 text-[13px] placeholder:text-[#98a2b3] focus:border-[#2a78d6] focus:bg-white focus:outline-none"
              />
            </label>
            <div className="ml-auto flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Notificaciones (3 nuevas)"
                className="relative grid size-9 place-items-center rounded-lg text-[#475467] hover:bg-[#f4f5f7]"
              >
                <IcoCampana className="size-5" />
                <span className="absolute top-2 right-2 size-2 rounded-full bg-[#eb6834] ring-2 ring-white" />
              </button>
              <span className="grid size-8 place-items-center rounded-full bg-[#ffe9dc] text-[12px] font-semibold text-[#9a3a12] lg:hidden">
                LF
              </span>
            </div>
          </div>
        </header>

        <main id="contenido" className="mx-auto max-w-[1320px] px-4 pt-6 pb-28 sm:px-6 lg:px-8 lg:pt-8">
          {/* Encabezado + filtros (una fila, arriba de todo lo que afectan) */}
          <div id="resumen" className="mb-6 flex scroll-mt-20 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[12.5px] font-medium text-[#667085]">Hola, Lucía</p>
              <h1 className="mt-1 text-[24px] font-bold tracking-[-0.02em] sm:text-[28px]">Resumen de ventas</h1>
              <p className="mt-1 text-[13px] text-[#667085]">
                {info.largo} · actualizado hoy, 9:40 h
              </p>
            </div>
            <div className="flex items-center gap-2">
              <SelectorPeriodo
                valor={periodo}
                onCambio={setPeriodo}
                clases={{
                  grupo: "inline-flex rounded-[11px] border border-[#e4e7ec] bg-white p-1 shadow-[0_1px_2px_rgba(16,24,40,0.04)]",
                  opcion:
                    "rounded-[8px] px-3 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2a78d6]",
                  activa: "bg-[#14213d] text-white",
                  inactiva: "text-[#475467] hover:bg-[#f4f5f7] hover:text-[#101828]",
                }}
              />
              <button
                type="button"
                onClick={() => descargarCsv(periodo)}
                className="inline-flex h-[38px] items-center gap-1.5 rounded-[11px] border border-[#e4e7ec] bg-white px-3 text-[13px] font-medium text-[#344054] shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:bg-[#f9fafb] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2a78d6]"
              >
                <IcoDescargar className="size-4" />
                <span className="hidden sm:inline">Exportar</span>
                <span className="sr-only sm:hidden">Exportar CSV</span>
              </button>
            </div>
          </div>

          <p className="sr-only" aria-live="polite">
            Mostrando {info.largo.toLowerCase()}.
          </p>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <Kpi
              etiqueta="Ventas"
              valor={r.kpis.ventas.valor}
              formato={pesosCompacto}
              variacion={r.kpis.ventas.var}
              textoVariacion={delta(r.kpis.ventas.var)}
              comparacion={info.anterior}
              serie={r.kpis.ventas.serie}
              icono={<IcoVentas className="size-4" />}
            />
            <Kpi
              etiqueta="Pedidos"
              valor={r.kpis.pedidos.valor}
              formato={numero}
              variacion={r.kpis.pedidos.var}
              textoVariacion={delta(r.kpis.pedidos.var)}
              comparacion={info.anterior}
              serie={r.kpis.pedidos.serie}
              icono={<IcoPedidos className="size-4" />}
            />
            <Kpi
              etiqueta="Ticket promedio"
              valor={r.kpis.ticket.valor}
              formato={pesos}
              variacion={r.kpis.ticket.var}
              textoVariacion={delta(r.kpis.ticket.var)}
              comparacion={info.anterior}
              serie={r.kpis.ticket.serie}
              icono={<IcoProductos className="size-4" />}
            />
            <Kpi
              etiqueta="Conversión"
              valor={r.kpis.conversion.valor}
              formato={(v) => porcentaje(v, 2)}
              variacion={r.kpis.conversion.var}
              textoVariacion={deltaPp(r.kpis.conversion.var)}
              comparacion={info.anterior}
              serie={r.kpis.conversion.serie}
              icono={<IcoEmbudo className="size-4" />}
            />
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-3">
            <Tarjeta
              id="ventas"
              titulo="Ventas en el tiempo"
              bajada={`${pesos(r.kpis.ventas.valor)} en total · ${delta(r.kpis.ventas.var)} ${info.anterior}`}
              className="xl:col-span-2"
              accion={
                <ul className="flex items-center gap-4 text-[12px] text-[#475467]" aria-label="Referencias">
                  <li className="flex items-center gap-1.5">
                    <span aria-hidden="true" className="h-[3px] w-4 rounded-full bg-[#2a78d6]" />
                    Este período
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span aria-hidden="true" className="h-[2px] w-4 rounded-full bg-[#a9b0bc]" />
                    Período anterior
                  </li>
                </ul>
              }
            >
              <LineChart
                titulo="Ventas por día comparadas con el período anterior"
                alto={330}
                etiquetas={r.puntos.map((p) => p.etiqueta)}
                ejeX={r.puntos.map((p) => p.eje)}
                formatoY={pesosCompacto}
                formatoValor={pesos}
                series={[
                  { id: "ant", nombre: "Período anterior", valores: serieAnterior, color: "#a9b0bc", secundaria: true },
                  { id: "act", nombre: "Este período", valores: serieActual, color: "#2a78d6", area: true },
                ]}
                extraTip={(i) => {
                  const a = serieActual[i];
                  const b = serieAnterior[i];
                  if (a === undefined || !b) return null;
                  const v = a / b - 1;
                  return (
                    <div className="mt-1.5 border-t border-[#f0f2f5] pt-1.5 text-[12px]">
                      <span className={v >= 0 ? "font-semibold text-[#067647]" : "font-semibold text-[#b42318]"}>{delta(v)}</span>
                      <span className="text-[#667085]"> vs. {r.anterior[i]?.etiqueta}</span>
                    </div>
                  );
                }}
              />
            </Tarjeta>

            <Tarjeta id="canales" titulo="Canales de venta" bajada="Participación en ventas y cambio en puntos porcentuales">
              <Canales datos={r.canales} />
            </Tarjeta>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Tarjeta titulo="Ventas por categoría" bajada="Monto vendido y peso sobre el total">
              <Categorias datos={r.categorias} />
            </Tarjeta>
            <Tarjeta
              id="embudo"
              titulo="Embudo de conversión"
              bajada={`De ${numero(r.embudo[0]!.valor)} visitas a ${numero(r.embudo[4]!.valor)} compras`}
            >
              <Embudo datos={r.embudo} />
            </Tarjeta>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-5">
            <Tarjeta id="productos" titulo="Productos más vendidos" bajada="Top 6 por ingresos del período" className="xl:col-span-3">
              <TopProductos datos={r.productos} />
            </Tarjeta>
            <Tarjeta
              id="pedidos"
              titulo="Pedidos recientes"
              bajada="Últimas 4 horas"
              className="xl:col-span-2"
              accion={
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf3] px-2 py-0.5 text-[11.5px] font-medium text-[#067647]">
                  <span className="size-1.5 rounded-full bg-[#0ca30c]" aria-hidden="true" />
                  En vivo
                </span>
              }
            >
              <PedidosRecientes />
            </Tarjeta>
          </div>

          <footer className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-[#e8eaee] pt-6 text-[12px] text-[#667085] sm:flex-row">
            <p>Tienda Almacén Norte · Panel de ventas</p>
            <p>Demo con contenido ficticio</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
