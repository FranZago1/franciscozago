"use client";

import { useSyncExternalStore } from "react";

/** Reloj compartido: un solo intervalo por página, snapshot en segundos (primitivo, estable). */
const subs = new Set<() => void>();
let intervalo: number | undefined;
function subscribe(f: () => void) {
  subs.add(f);
  if (intervalo === undefined) intervalo = window.setInterval(() => subs.forEach((s) => s()), 1000);
  return () => {
    subs.delete(f);
    if (subs.size === 0) {
      window.clearInterval(intervalo);
      intervalo = undefined;
    }
  };
}
const ahora = () => Math.floor(Date.now() / 1000);
const enServidor = () => null;

/** El drop sale dentro de 2 días a las 20 h (fecha relativa: la demo nunca queda "vencida"). */
function objetivo(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  d.setHours(20, 0, 0, 0);
  return d;
}

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

export function useDrop() {
  const seg = useSyncExternalStore(subscribe, ahora, enServidor);
  if (seg === null) return null;
  const meta = objetivo();
  const resta = Math.max(0, Math.floor(meta.getTime() / 1000) - seg);
  return {
    dias: Math.floor(resta / 86400),
    horas: Math.floor((resta % 86400) / 3600),
    minutos: Math.floor((resta % 3600) / 60),
    segundos: resta % 60,
    fecha: `${DIAS[meta.getDay()]} ${meta.getDate()}/${meta.getMonth() + 1}, 20 h`,
  };
}

const dos = (n: number) => String(n).padStart(2, "0");

export function Countdown() {
  const t = useDrop();
  const bloques: [string, string][] = t
    ? [
        [dos(t.dias), "Días"],
        [dos(t.horas), "Horas"],
        [dos(t.minutos), "Min"],
        [dos(t.segundos), "Seg"],
      ]
    : [
        ["--", "Días"],
        ["--", "Horas"],
        ["--", "Min"],
        ["--", "Seg"],
      ];
  return (
    <div>
      <p className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase">
        Sale el <span className="text-[#D4FF2E]">{t ? t.fecha : "—"}</span>
      </p>
      <div className="mt-3 grid max-w-md grid-cols-4 gap-1.5 sm:gap-2" role="timer" aria-live="off" aria-label={t ? `Faltan ${t.dias} días, ${t.horas} horas y ${t.minutos} minutos para el drop` : "Cuenta regresiva del drop"}>
        {bloques.map(([n, l], i) => (
          <div key={l} className="relative border border-white/15 bg-white/[0.04] px-2 pt-3 pb-2 text-center">
            <span className="block [font-family:var(--font-pc-display)] text-[clamp(2.4rem,9vw,3.6rem)] leading-none text-[#D4FF2E] tabular-nums" aria-hidden="true">
              {n}
            </span>
            <span className="mt-1.5 block text-[10px] font-bold tracking-[0.2em] text-white/55 uppercase" aria-hidden="true">
              {l}
            </span>
            {i < 3 ? <span className="absolute top-1/2 -right-[5px] hidden h-1 w-1 bg-white/40 sm:block" aria-hidden="true" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
