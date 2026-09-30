"use client";

import { useSyncExternalStore } from "react";

/** Valor compartido mínimo entre islas cliente (ej. qué modal está abierto). */
export function crearValor<T>(inicial: T) {
  let valor = inicial;
  const subs = new Set<() => void>();
  const subscribe = (f: () => void) => {
    subs.add(f);
    return () => {
      subs.delete(f);
    };
  };
  return {
    set(v: T) {
      valor = v;
      subs.forEach((f) => f());
    },
    get: () => valor,
    use(): T {
      return useSyncExternalStore(
        subscribe,
        () => valor,
        () => inicial,
      );
    },
  };
}
