"use client";

import { useState } from "react";
import { miles } from "../shared/formato";
import { Icono } from "../shared/Icono";
import { planes } from "./datos";


export function Precios() {
  const [anual, setAnual] = useState(true);

  return (
    <div>
      <div className="flex justify-center">
        <div role="radiogroup" aria-label="Frecuencia de pago" className="relative inline-grid grid-cols-2 rounded-full bg-slate-100 p-1 ring-1 ring-slate-200/70">
          <span
            aria-hidden="true"
            className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-white shadow-sm ring-1 ring-slate-200 transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={{ transform: anual ? "translateX(100%)" : "translateX(0)" }}
          />
          {[
            [false, "Mensual"],
            [true, "Anual"],
          ].map(([v, t]) => {
            const sel = anual === v;
            return (
              <button
                key={t as string}
                type="button"
                role="radio"
                aria-checked={sel}
                onClick={() => setAnual(v as boolean)}
                onKeyDown={(e) => {
                  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
                    e.preventDefault();
                    setAnual((a) => !a);
                    (e.currentTarget.parentElement?.querySelector(`[aria-checked="false"]`) as HTMLElement | null)?.focus();
                  }
                }}
                tabIndex={sel ? 0 : -1}
                className={`relative z-10 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors sm:px-6 ${
                  sel ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {t}
                {v && <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700">−20 %</span>}
              </button>
            );
          })}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {anual ? "Mostrando precios con pago anual" : "Mostrando precios con pago mensual"}
      </p>

      <ul className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {planes.map((p) => {
          const precio = anual ? p.anual : p.mensual;
          return (
            <li
              key={p.id}
              className={`relative flex flex-col rounded-3xl p-7 sm:p-8 ${
                p.destacado
                  ? "bg-[#1E1B4B] text-white shadow-[0_40px_80px_-40px_rgba(79,70,229,0.7)]"
                  : "bg-white ring-1 ring-slate-200/80"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold tracking-tight">{p.nombre}</h3>
                {p.destacado && (
                  <span className="rounded-full bg-[#4F46E5] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white">Más elegido</span>
                )}
              </div>
              <p className={`mt-1 text-sm ${p.destacado ? "text-indigo-200" : "text-slate-500"}`}>{p.bajada}</p>
              <p className="mt-8 flex items-baseline gap-1.5">
                <span key={`${p.id}-${anual}`} className="cc-aparecer text-5xl font-semibold tracking-[-0.04em] tabular-nums">
                  {precio === 0 ? "$0" : `$${miles(precio)}`}
                </span>
                <span className={`text-sm ${p.destacado ? "text-indigo-200" : "text-slate-500"}`}>/mes</span>
              </p>
              <p className={`mt-2 h-5 text-[13px] ${p.destacado ? "text-indigo-200" : "text-slate-500"}`}>
                {precio === 0 ? "Gratis para siempre" : anual ? `$${miles(precio * 12)} al año · ahorrás $${miles((p.mensual - p.anual) * 12)}` : "Sin permanencia"}
              </p>
              <a
                href="#prueba"
                className={`mt-8 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors ${
                  p.destacado ? "bg-white text-slate-900 hover:bg-indigo-50" : "bg-slate-900 text-white hover:bg-slate-700"
                }`}
              >
                {p.cta}
              </a>
              <ul className={`mt-8 space-y-3 border-t pt-8 text-[15px] ${p.destacado ? "border-white/10" : "border-slate-100"}`}>
                {p.incluye.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Icono nombre="check" grosor={2.2} className={`mt-0.5 size-4 shrink-0 ${p.destacado ? "text-emerald-300" : "text-[#4F46E5]"}`} />
                    {f}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-center text-sm text-slate-500">Precios de ejemplo en pesos argentinos, IVA incluido. Contenido ficticio.</p>
    </div>
  );
}
