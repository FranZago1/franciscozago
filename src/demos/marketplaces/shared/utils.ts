"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Precio en pesos con separador de miles argentino, igual en servidor y cliente. */
export function pesos(n: number): string {
  const entero = Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `$ ${entero}`;
}

/**
 * Estado que se guarda en localStorage. Arranca con `inicial` (igual que el servidor, sin saltos de
 * hidratación) y después carga lo guardado. Si localStorage no está disponible, sigue funcionando en memoria.
 */
export function useStoredState<T>(clave: string, inicial: T, valida: (v: unknown) => v is T) {
  const [valor, setValor] = useState<T>(inicial);
  const [listo, setListo] = useState(false);
  const validaRef = useRef(valida);

  useEffect(() => {
    try {
      const crudo = window.localStorage.getItem(clave);
      if (crudo) {
        const dato: unknown = JSON.parse(crudo);
        if (validaRef.current(dato)) setValor(dato);
      }
    } catch {
      // sin acceso a localStorage: seguimos en memoria
    }
    setListo(true);
  }, [clave]);

  useEffect(() => {
    if (!listo) return;
    try {
      window.localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      // ignorado a propósito
    }
  }, [clave, valor, listo]);

  return [valor, setValor, listo] as const;
}

/** Mensaje efímero (toast) que también se anuncia a lectores de pantalla. */
export function useAviso(duracion = 3200) {
  const [aviso, setAviso] = useState<{ id: number; texto: string } | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const avisar = useCallback(
    (texto: string) => {
      window.clearTimeout(timer.current);
      setAviso({ id: Date.now(), texto });
      timer.current = window.setTimeout(() => setAviso(null), duracion);
    },
    [duracion],
  );
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return { aviso, avisar, cerrar: () => setAviso(null) };
}

/** "a", "a y b", "a, b y c". */
export function lista(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

export function esperar(ms: number) {
  return new Promise<void>((r) => window.setTimeout(r, ms));
}
