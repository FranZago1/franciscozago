"use client";

import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { ahoraEnCordoba, type Ahora } from "./fechas";

// ---------------------------------------------------------------------------
// Hora de Córdoba. En el servidor (y durante la hidratación) vale null, así el HTML
// del servidor y el primer render del navegador son idénticos. Recién después del
// montaje aparece la fecha real y se calcula la disponibilidad.
// ---------------------------------------------------------------------------

function leerAhora(): string {
  const a = ahoraEnCordoba();
  return `${a.dia}|${a.minutos}`;
}

function suscribirReloj(aviso: () => void): () => void {
  const id = window.setInterval(aviso, 30_000);
  return () => window.clearInterval(id);
}

export function useAhora(): Ahora | null {
  const clave = useSyncExternalStore(suscribirReloj, leerAhora, () => "");
  return useMemo(() => {
    if (!clave) return null;
    const [dia, min] = clave.split("|");
    return { dia: dia ?? "", minutos: Number(min) };
  }, [clave]);
}

// ---------------------------------------------------------------------------
// Reservas guardadas en localStorage (con try/catch y respaldo en memoria si el
// navegador lo bloquea). Varias partes de la página se enteran de los cambios.
// ---------------------------------------------------------------------------

const memoria = new Map<string, string>();
const oyentes = new Set<() => void>();

function leerCrudo(clave: string): string {
  try {
    return window.localStorage.getItem(clave) ?? memoria.get(clave) ?? "[]";
  } catch {
    return memoria.get(clave) ?? "[]";
  }
}

function escribirCrudo(clave: string, valor: string): void {
  memoria.set(clave, valor);
  try {
    window.localStorage.setItem(clave, valor);
  } catch {
    /* modo privado o almacenamiento lleno: queda en memoria */
  }
  oyentes.forEach((o) => o());
}

function leerLista<T>(clave: string): T[] {
  try {
    const v: unknown = JSON.parse(leerCrudo(clave));
    return Array.isArray(v) ? (v as T[]) : [];
  } catch {
    return [];
  }
}

function suscribirAlmacen(aviso: () => void): () => void {
  oyentes.add(aviso);
  const alCambiar = (e: StorageEvent) => {
    if (e.key === null || e.key.startsWith("demo-reservas:")) aviso();
  };
  window.addEventListener("storage", alCambiar);
  return () => {
    oyentes.delete(aviso);
    window.removeEventListener("storage", alCambiar);
  };
}

export type ConId = { id: string; estado: "confirmada" | "cancelada"; creada: string };

export function useReservasGuardadas<T extends ConId>(demo: string) {
  const clave = `demo-reservas:${demo}`;
  const crudo = useSyncExternalStore(
    suscribirAlmacen,
    () => leerCrudo(clave),
    () => "[]",
  );
  const lista = useMemo<T[]>(() => {
    try {
      const v: unknown = JSON.parse(crudo);
      return Array.isArray(v) ? (v as T[]) : [];
    } catch {
      return [];
    }
  }, [crudo]);

  const guardar = useCallback(
    (r: T) => {
      const actual = leerLista<T>(clave);
      escribirCrudo(clave, JSON.stringify([r, ...actual.filter((x) => x.id !== r.id)]));
    },
    [clave],
  );

  const cancelar = useCallback(
    (id: string) => {
      const actual = leerLista<T>(clave);
      escribirCrudo(clave, JSON.stringify(actual.map((x) => (x.id === id ? { ...x, estado: "cancelada" } : x))));
    },
    [clave],
  );

  const borrar = useCallback(
    (id: string) => {
      const actual = leerLista<T>(clave);
      escribirCrudo(clave, JSON.stringify(actual.filter((x) => x.id !== id)));
    },
    [clave],
  );

  return { lista, guardar, cancelar, borrar };
}

/** Avisos entre partes de la página (ej. "Reservar con Tano" desde la sección del equipo). */
export function emitirDemo<T>(nombre: string, detalle: T): void {
  window.dispatchEvent(new CustomEvent(nombre, { detail: detalle }));
}

export function useEscucharDemo<T>(nombre: string, fn: (detalle: T) => void): void {
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  });
  useEffect(() => {
    const oyente = (e: Event) => ref.current((e as CustomEvent<T>).detail);
    window.addEventListener(nombre, oyente);
    return () => window.removeEventListener(nombre, oyente);
  }, [nombre]);
}

/** true cuando el usuario pidió menos movimiento. */
export function prefiereMenosMovimiento(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/** Desplaza suave hasta un elemento y le pasa el foco (para anunciar el cambio de paso). */
export function irA(el: HTMLElement | null, { foco = true }: { foco?: boolean } = {}): void {
  if (!el) return;
  el.scrollIntoView({ behavior: prefiereMenosMovimiento() ? "auto" : "smooth", block: "start" });
  if (foco) el.focus({ preventScroll: true });
}
