"use client";

import { useId, useState } from "react";
import { miles } from "../shared/formato";

const mono = "[font-family:var(--font-cc-mono)]";

/** Minutos que lleva una factura con Cuentaclara (estimación de la demo). */
const MIN_CON_APP = 0.5;

function Rango({
  label,
  valor,
  min,
  max,
  paso,
  onChange,
  formato,
}: {
  label: string;
  valor: number;
  min: number;
  max: number;
  paso: number;
  onChange: (n: number) => void;
  formato: (n: number) => string;
}) {
  const id = useId();
  const pct = ((valor - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[15px] text-slate-700">
          {label}
        </label>
        <output htmlFor={id} className="text-lg font-semibold text-slate-900 tabular-nums">
          {formato(valor)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={paso}
        value={valor}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={formato(valor)}
        className="cc-rango mt-3 w-full"
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
      />
      <div className={`${mono} mt-1.5 flex justify-between text-[11px] text-slate-400`}>
        <span>{formato(min)}</span>
        <span>{formato(max)}</span>
      </div>
    </div>
  );
}

export function Calculadora() {
  const [facturas, setFacturas] = useState(40);
  const [minutos, setMinutos] = useState(8);
  const [hora, setHora] = useState(15000);

  const hoyH = (facturas * minutos) / 60;
  const conH = (facturas * MIN_CON_APP) / 60;
  const ahorroH = Math.max(0, hoyH - conH);
  const ahorroPesos = ahorroH * hora;
  const anual = ahorroPesos * 12;
  const fmtH = (h: number) => (h < 10 ? h.toFixed(1).replace(".", ",") : Math.round(h).toString());

  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-40px_rgba(30,27,75,0.3)] ring-1 ring-slate-200/80 lg:grid-cols-[1.1fr_1fr]">
      <div className="space-y-9 p-6 sm:p-10">
        <Rango label="Facturas que hacés por mes" valor={facturas} min={5} max={300} paso={5} onChange={setFacturas} formato={(n) => `${n}`} />
        <Rango label="Minutos que te lleva cada una hoy" valor={minutos} min={2} max={20} paso={1} onChange={setMinutos} formato={(n) => `${n} min`} />
        <Rango label="Lo que vale tu hora de trabajo" valor={hora} min={5000} max={60000} paso={1000} onChange={setHora} formato={(n) => `$${miles(n)}`} />
      </div>

      <div className="relative flex flex-col justify-between gap-10 overflow-hidden bg-[#1E1B4B] p-6 text-white sm:p-10">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-[#4F46E5]/50 blur-3xl" />
        <div className="relative" aria-live="polite">
          <p className="text-sm text-indigo-200">Con Cuentaclara recuperás</p>
          <p className="mt-2 text-[clamp(3rem,7vw,4.5rem)] leading-none font-semibold tracking-[-0.04em] tabular-nums">
            {fmtH(ahorroH)}
            <span className="ml-2 text-2xl text-indigo-200">h/mes</span>
          </p>
          <p className="mt-4 text-indigo-100">
            Eso equivale a <strong className="font-semibold text-white tabular-nums">${miles(ahorroPesos)}</strong> por mes y{" "}
            <strong className="font-semibold text-emerald-300 tabular-nums">${miles(anual)}</strong> por año.
          </p>
        </div>
        <div className="relative space-y-3" aria-hidden="true">
          {[
            ["Hoy", hoyH, "bg-white/25"],
            ["Con Cuentaclara", conH, "bg-emerald-400"],
          ].map(([t, h, c]) => (
            <div key={t as string}>
              <div className="flex justify-between text-[13px] text-indigo-100">
                <span>{t}</span>
                <span className="tabular-nums">{fmtH(h as number)} h</span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full ${c} transition-[width] duration-500 ease-out motion-reduce:transition-none`}
                  style={{ width: `${Math.max(2, ((h as number) / Math.max(hoyH, 0.01)) * 100)}%` }}
                />
              </div>
            </div>
          ))}
          <p className="pt-2 text-[12px] text-indigo-200/80">Estimación con {MIN_CON_APP * 60} segundos por factura en Cuentaclara.</p>
        </div>
      </div>
    </div>
  );
}
