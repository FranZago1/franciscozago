"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

/** Corre todas las fechas ISO de un objeto (recursivo) `delta` milisegundos. */
export function shiftDates<T>(value: T, delta: number): T {
  if (delta === 0) return value;
  if (typeof value === "string") {
    return (ISO.test(value) ? new Date(Date.parse(value) + delta).toISOString() : value) as T;
  }
  if (Array.isArray(value)) return value.map((v) => shiftDates(v, delta)) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = shiftDates(v, delta);
    return out as T;
  }
  return value;
}

function startOfDay(ms: number) {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

type Envelope<T> = { v: number; savedAt: number; data: T };

/**
 * Estado del demo guardado en localStorage.
 * - Arranca en `null` y se carga recién después del montaje (sin hydration mismatch).
 * - Las fechas guardadas se "corren" para que la demo siga viva otro día:
 *   `rebase: "day"` corre por días completos; `"elapsed"` por el tiempo exacto que pasó.
 */
export function usePersistentState<T>(
  key: string,
  version: number,
  seed: (now: number) => T,
  rebase: "day" | "elapsed" = "day",
) {
  const [state, setState] = useState<T | null>(null);
  const seedRef = useRef(seed);

  useEffect(() => {
    const now = Date.now();
    let data: T | null = null;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const env = JSON.parse(raw) as Envelope<T>;
        if (env && env.v === version && env.data) {
          const delta = rebase === "day" ? startOfDay(now) - startOfDay(env.savedAt) : now - env.savedAt;
          data = shiftDates(env.data, delta);
        }
      }
    } catch {
      data = null;
    }
    setState(data ?? seedRef.current(now));
  }, [key, version, rebase]);

  useEffect(() => {
    if (state === null) return;
    try {
      const env: Envelope<T> = { v: version, savedAt: Date.now(), data: state };
      window.localStorage.setItem(key, JSON.stringify(env));
    } catch {
      /* almacenamiento no disponible: la demo sigue en memoria */
    }
  }, [key, version, state]);

  const update = useCallback((fn: (prev: T) => T) => {
    setState((prev) => (prev === null ? prev : fn(prev)));
  }, []);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* nada */
    }
    setState(seedRef.current(Date.now()));
  }, [key]);

  return { state, update, reset };
}

/** Hora actual que se actualiza cada `ms`. Es `null` hasta el montaje. */
export function useNow(ms = 1000) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), ms);
    return () => window.clearInterval(id);
  }, [ms]);
  return now;
}

let seq = 0;
/** Id corto y único (solo se usa en el cliente, después del montaje). */
export function uid(prefix = "id") {
  seq += 1;
  return `${prefix}-${Date.now().toString(36)}${seq.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
