"use client";

import { useEffect, useState } from "react";
import { Icon, type IconName } from "../shared/Icon";
import { hora } from "../shared/util";
import { etiquetaOrigen, type EstadoCocina, type Pedido } from "./data";
import { useBrasa } from "./context";
import { AMARILLO_MIN, cond, cronometro, minutos, nivelDemora, ROJO_MIN } from "./ui";

const COLUMNAS: { id: EstadoCocina; nombre: string; accion?: string; icono: IconName }[] = [
  { id: "nuevo", nombre: "Nuevo", accion: "Empezar", icono: "inbox" },
  { id: "preparacion", nombre: "En preparación", accion: "Listo", icono: "flame" },
  { id: "listo", nombre: "Listo", accion: "Entregar", icono: "check" },
  { id: "entregado", nombre: "Entregado", icono: "send" },
];

export function Cocina() {
  const { state, now } = useBrasa();
  const [pantalla, setPantalla] = useState(false);
  const [filtro, setFiltro] = useState<"todos" | "salon" | "delivery">("todos");

  useEffect(() => {
    if (!pantalla) return;
    const f = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPantalla(false);
    };
    document.addEventListener("keydown", f);
    const o = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", f);
      document.body.style.overflow = o;
    };
  }, [pantalla]);

  const visibles = state.pedidos.filter((p) =>
    filtro === "todos" ? true : filtro === "salon" ? p.origen.tipo === "mesa" : p.origen.tipo !== "mesa",
  );
  const activos = state.pedidos.filter((p) => p.estado === "nuevo" || p.estado === "preparacion");
  const demorados = activos.filter((p) => nivelDemora(now - Date.parse(p.creado)) === "rojo").length;
  const entregadosHoy = state.pedidos.filter((p) => p.estado === "entregado" && p.entregado && p.listo);
  const promedio = entregadosHoy.length
    ? Math.round(entregadosHoy.reduce((a, p) => a + (Date.parse(p.listo!) - Date.parse(p.creado)), 0) / entregadosHoy.length / 60000)
    : 0;

  const contenido = (
    <div className={pantalla ? "flex h-full flex-col" : ""}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <p className="text-sm font-semibold text-white/50">Pantalla de cocina (KDS)</p>
          <h1 className={`${cond} text-4xl font-bold uppercase leading-none tracking-wide text-white`}>Cocina</h1>
        </div>
        <div className={`${cond} flex items-center gap-4 text-lg font-semibold uppercase tracking-wide`}>
          <span className="text-white/70"><span className="text-3xl text-white">{activos.length}</span> en marcha</span>
          <span className={demorados ? "text-[#FF6A4D]" : "text-white/70"}><span className="text-3xl">{demorados}</span> demorados</span>
          <span className="hidden text-white/70 sm:inline"><span className="text-3xl text-white">{promedio}′</span> promedio</span>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div role="group" aria-label="Filtrar comandas" className="flex flex-1 rounded-xl bg-white/[.06] p-1 sm:flex-none">
            {([["todos", "Todo"], ["salon", "Salón"], ["delivery", "Delivery y llevar"]] as const).map(([k, t]) => (
              <button key={k} type="button" aria-pressed={filtro === k} onClick={() => setFiltro(k)} className={`flex-1 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-bold transition ${filtro === k ? "bg-[#FFF7EC] text-[#0E0C0B]" : "text-white/70 hover:text-white"}`}>
                {t}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPantalla((v) => !v)}
            aria-pressed={pantalla}
            className="grid size-10 place-items-center rounded-xl bg-white/[.06] text-white/80 transition hover:bg-white/15 hover:text-white"
            aria-label={pantalla ? "Salir de pantalla completa" : "Pantalla completa"}
            title={pantalla ? "Salir (Esc)" : "Pantalla completa"}
          >
            <Icon name={pantalla ? "minimize" : "maximize"} />
          </button>
        </div>
      </div>

      <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/50">
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#4ADE80]" />Menos de {AMARILLO_MIN} min</span>
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#FACC15]" />{AMARILLO_MIN}–{ROJO_MIN} min</span>
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#FF4D2E]" />Más de {ROJO_MIN} min</span>
        <span>Tocá un ítem para tacharlo cuando sale.</span>
      </p>

      <nav aria-label="Ir a columna" className="mt-3 grid grid-cols-4 gap-1.5 lg:hidden">
        {COLUMNAS.map((col) => (
          <button
            key={col.id}
            type="button"
            onClick={() => document.getElementById(`kds-col-${col.id}`)?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" })}
            className="rounded-xl bg-white/[.06] px-1 py-1.5 text-center text-white/80 active:bg-white/15"
          >
            <span className={`${cond} block text-2xl font-bold leading-none text-white`}>{visibles.filter((p) => p.estado === col.id).length}</span>
            <span className="block truncate text-[11px] font-semibold">{col.id === "preparacion" ? "Preparación" : col.nombre}</span>
          </button>
        ))}
      </nav>

      <div className={`-mx-3 mt-4 sm:-mx-5 lg:mx-0 ${pantalla ? "min-h-0 flex-1" : ""}`}>
        <div className={`flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-3 sm:px-5 lg:grid lg:snap-none lg:grid-cols-4 lg:overflow-visible lg:px-0 ${pantalla ? "h-full" : ""}`}>
          {COLUMNAS.map((col) => {
            let pedidos = visibles.filter((p) => p.estado === col.id);
            pedidos =
              col.id === "entregado"
                ? pedidos.sort((a, b) => (b.entregado ?? "").localeCompare(a.entregado ?? "")).slice(0, 6)
                : pedidos.sort((a, b) => a.creado.localeCompare(b.creado));
            return (
              <section key={col.id} id={`kds-col-${col.id}`} aria-labelledby={`kds-${col.id}`} className={`flex w-[86vw] max-w-[360px] shrink-0 scroll-ml-3 snap-start flex-col rounded-2xl bg-[#171412] p-2.5 ring-1 ring-white/[.06] sm:w-[340px] lg:w-auto lg:max-w-none ${pantalla ? "min-h-0 overflow-y-auto" : ""}`}>
                <header className="flex items-center gap-2 px-1.5 pb-2.5 pt-1">
                  <Icon name={col.icono} className="size-5 text-white/60" />
                  <h2 id={`kds-${col.id}`} className={`${cond} text-xl font-bold uppercase tracking-wide text-white`}>{col.nombre}</h2>
                  <span className={`${cond} ml-auto grid min-w-8 place-items-center rounded-lg bg-white/10 px-2 text-xl font-bold text-white`}>
                    {visibles.filter((p) => p.estado === col.id).length}
                  </span>
                </header>
                <ul className="flex flex-1 flex-col gap-2.5">
                  {pedidos.map((p) => (
                    <Comanda key={p.id} p={p} accion={col.accion} />
                  ))}
                  {pedidos.length === 0 ? (
                    <li className="grid flex-1 place-items-center rounded-xl border-2 border-dashed border-white/10 py-10 text-center text-sm font-semibold text-white/35">
                      Sin comandas
                    </li>
                  ) : null}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (pantalla) {
    return (
      <div className="fixed inset-0 z-[45] overflow-hidden bg-[#0E0C0B] p-3 pb-28 sm:p-5 sm:pb-28" role="region" aria-label="Cocina en pantalla completa">
        {contenido}
      </div>
    );
  }
  return contenido;
}

function Comanda({ p, accion }: { p: Pedido; accion?: string }) {
  const { state, now, avanzar, retroceder, toggleLinea } = useBrasa();
  const ms = now - Date.parse(p.creado);
  const nivel = p.estado === "entregado" || p.estado === "listo" ? "fin" : nivelDemora(ms);
  const color = {
    ok: { barra: "bg-[#4ADE80]", texto: "text-[#4ADE80]", borde: "ring-white/10" },
    amarillo: { barra: "bg-[#FACC15]", texto: "text-[#FACC15]", borde: "ring-[#FACC15]/60" },
    rojo: { barra: "bg-[#FF4D2E]", texto: "text-[#FF6A4D]", borde: "ring-[#FF4D2E] ring-2" },
    fin: { barra: "bg-white/25", texto: "text-white/70", borde: "ring-white/10" },
  }[nivel];
  const origen = etiquetaOrigen(p, state.mesas);
  const icono: IconName = p.origen.tipo === "mesa" ? "table" : p.origen.tipo === "delivery" ? "bike" : "bag";
  const hechos = p.lineas.filter((l) => l.hecho).length;
  const listoMs = p.listo ? Date.parse(p.listo) - Date.parse(p.creado) : null;
  const accionTxt = accion === "Entregar" && p.origen.tipo === "delivery" ? "Despachar" : accion === "Entregar" && p.origen.tipo === "llevar" ? "Retirado" : accion;

  return (
    <li className={`overflow-hidden rounded-xl bg-[#221D1A] ring-1 ${color.borde} ${p.estado === "entregado" ? "opacity-60" : ""}`}>
      <div className={`h-1.5 ${color.barra}`} aria-hidden="true" />
      <div className="p-3">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <p className={`${cond} text-[34px] font-bold leading-none text-white`}>#{p.numero}</p>
            <p className="mt-1 flex items-center gap-1.5 truncate text-[15px] font-bold text-[#F0B24A]">
              <Icon name={icono} className="size-4 shrink-0" />
              {origen}
            </p>
          </div>
          <div className="text-right">
            {p.estado === "entregado" ? (
              <p className="text-sm font-semibold text-white/60">{p.origen.tipo === "mesa" ? "Servido" : "Salió"} {hora(p.entregado!)}</p>
            ) : (
              <p className={`${cond} text-[34px] font-bold leading-none tabular-nums ${color.texto}`} aria-label={`Hace ${minutos(ms)} minutos`}>
                {p.estado === "listo" && listoMs !== null ? cronometro(listoMs) : cronometro(ms)}
              </p>
            )}
            <p className="mt-1 text-xs font-semibold text-white/45">
              {p.estado === "listo" ? "tardó" : `entró ${hora(p.creado)}`}
            </p>
          </div>
        </div>

        {p.nota && p.estado !== "entregado" ? (
          <p className="mt-2.5 flex items-start gap-1.5 rounded-lg bg-[#FACC15] px-2.5 py-1.5 text-sm font-bold uppercase leading-snug text-[#1A1400]">
            <Icon name="alert" className="mt-0.5 size-4 shrink-0" strokeWidth={2.4} />
            {p.nota}
          </p>
        ) : null}

        {p.estado === "entregado" ? (
          <p className="mt-2 truncate text-sm text-white/50">{p.lineas.map((l) => `${l.cant}× ${l.nombre}`).join(" · ")}</p>
        ) : (
        <ul className="mt-2.5 divide-y divide-white/[.07]">
          {p.lineas.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                disabled={p.estado === "entregado"}
                onClick={() => toggleLinea(p.id, l.id)}
                aria-pressed={l.hecho}
                className={`flex w-full items-start gap-2.5 py-2 text-left transition ${l.hecho ? "opacity-45" : ""}`}
              >
                <span className={`${cond} w-9 shrink-0 text-2xl font-bold leading-7 text-white`}>{l.cant}×</span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-lg font-bold leading-7 text-white ${l.hecho ? "line-through decoration-2" : ""}`}>{l.nombre}</span>
                  {l.mods.length ? <span className="block text-[15px] font-semibold leading-snug text-[#FDBA74]">{l.mods.join(" · ")}</span> : null}
                  {l.nota ? <span className="mt-0.5 inline-block rounded bg-[#FACC15]/15 px-1.5 text-sm font-bold uppercase text-[#FACC15]">{l.nota}</span> : null}
                </span>
                {l.hecho ? <Icon name="check" className="mt-1 size-5 shrink-0 text-[#4ADE80]" strokeWidth={2.6} /> : null}
              </button>
            </li>
          ))}
        </ul>
        )}

        {accionTxt ? (
          <div className="mt-2 flex gap-2">
            {p.estado !== "nuevo" ? (
              <button type="button" onClick={() => retroceder(p.id)} className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/[.06] text-white/70 hover:bg-white/15 hover:text-white" aria-label={`Volver #${p.numero} a la columna anterior`}>
                <Icon name="undo" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => avanzar(p.id)}
              className={`${cond} flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-xl font-bold uppercase tracking-wide transition active:translate-y-px ${p.estado === "nuevo" ? "bg-[#FFF7EC] text-[#0E0C0B] hover:bg-white" : p.estado === "preparacion" ? "bg-[#4ADE80] text-[#052E12] hover:bg-[#6EE79A]" : "bg-[#D2460F] text-white hover:bg-[#EA580C]"}`}
            >
              {accionTxt}
              {p.estado === "preparacion" && hechos > 0 ? <span className="text-base opacity-70">({hechos}/{p.lineas.length})</span> : null}
              <Icon name="arrow-right" className="size-5" strokeWidth={2.4} />
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => retroceder(p.id)} className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-white/50 hover:text-white">
            <Icon name="undo" className="size-4" /> Volver a Listo
          </button>
        )}
      </div>
    </li>
  );
}
