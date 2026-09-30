"use client";

import { useCallback, useEffect, useState } from "react";

/** Un renglón de la lista de consulta. `key` combina producto + variante para no duplicar. */
export type ItemLista = {
  key: string;
  id: string;
  variante?: string;
  cantidad: number;
  nota?: string;
  /** Datos extra (por ejemplo, las 6 botellas de una caja armada). */
  contenido?: string[];
};

function esItem(x: unknown): x is ItemLista {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.key === "string" && typeof o.id === "string" && typeof o.cantidad === "number" && o.cantidad > 0;
}

function leer(clave: string): ItemLista[] {
  try {
    const raw = window.localStorage.getItem(clave);
    if (!raw) return [];
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data.filter(esItem) : [];
  } catch {
    return [];
  }
}

export const claveItem = (id: string, variante?: string) => `${id}::${variante ?? ""}`;

/**
 * Lista de consulta persistida en localStorage (envuelto en try/catch: en modo privado
 * o con almacenamiento bloqueado la lista funciona igual, solo que no se recuerda).
 */
export function useLista(clave: string, { max = 999 }: { max?: number } = {}) {
  const [items, setItems] = useState<ItemLista[]>([]);
  const [lista, setLista] = useState(false);

  useEffect(() => {
    setItems(leer(clave));
    setLista(true);
  }, [clave]);

  useEffect(() => {
    if (!lista) return;
    try {
      window.localStorage.setItem(clave, JSON.stringify(items));
    } catch {
      // sin almacenamiento: la lista vive solo en esta pestaña
    }
  }, [clave, items, lista]);

  const agregar = useCallback(
    (item: Omit<ItemLista, "key"> & { key?: string }) => {
      const key = item.key ?? claveItem(item.id, item.variante);
      setItems((prev) => {
        const existente = prev.find((i) => i.key === key);
        if (existente) {
          return prev.map((i) =>
            i.key === key ? { ...i, cantidad: Math.min(max, i.cantidad + item.cantidad), nota: item.nota?.trim() ? item.nota : i.nota } : i,
          );
        }
        return [...prev, { ...item, key, cantidad: Math.min(max, item.cantidad) }];
      });
    },
    [max],
  );

  /** Fija la cantidad exacta. Con 0 o menos, lo quita. */
  const fijarCantidad = useCallback(
    (key: string, cantidad: number, base?: Omit<ItemLista, "key" | "cantidad">) => {
      setItems((prev) => {
        const n = Math.max(0, Math.min(max, Math.round(cantidad)));
        const existe = prev.some((i) => i.key === key);
        if (n === 0) return prev.filter((i) => i.key !== key);
        if (!existe) return base ? [...prev, { ...base, key, cantidad: n }] : prev;
        return prev.map((i) => (i.key === key ? { ...i, cantidad: n } : i));
      });
    },
    [max],
  );

  const fijarNota = useCallback((key: string, nota: string) => {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, nota } : i)));
  }, []);

  const cambiarVariante = useCallback(
    (key: string, variante: string) => {
      setItems((prev) => {
        const item = prev.find((i) => i.key === key);
        if (!item) return prev;
        const nueva = claveItem(item.id, variante);
        const choca = prev.find((i) => i.key === nueva);
        if (choca) {
          return prev
            .filter((i) => i.key !== key)
            .map((i) => (i.key === nueva ? { ...i, cantidad: Math.min(max, i.cantidad + item.cantidad) } : i));
        }
        return prev.map((i) => (i.key === key ? { ...i, key: nueva, variante } : i));
      });
    },
    [max],
  );

  const quitar = useCallback((key: string) => setItems((prev) => prev.filter((i) => i.key !== key)), []);
  const vaciar = useCallback(() => setItems([]), []);

  const unidades = items.reduce((s, i) => s + i.cantidad, 0);

  return { items, lista, unidades, agregar, fijarCantidad, fijarNota, cambiarVariante, quitar, vaciar };
}

export type Lista = ReturnType<typeof useLista>;
