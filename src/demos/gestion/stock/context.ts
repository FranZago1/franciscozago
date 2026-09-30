"use client";

import { createContext, useContext } from "react";
import type { Producto, StockState, TipoMov } from "./data";

export type Vista = "resumen" | "productos" | "movimientos" | "alertas" | "escaner";

export type ProductoInput = Omit<Producto, "id">;

export type StockCtx = {
  state: StockState;
  now: number;
  vista: Vista;
  setVista: (v: Vista) => void;
  producto: (id: string) => Producto | undefined;
  abrirAjuste: (id: string, tipo?: TipoMov) => void;
  abrirAlta: (ean?: string) => void;
  /** Aplica un movimiento. Devuelve un error si no se puede. */
  mover: (id: string, tipo: TipoMov, cantidad: number, nota?: string, opts?: { silencioso?: boolean }) => string | null;
  crearProducto: (p: ProductoInput) => void;
  confirmarPedido: (proveedor: string, items: { productoId: string; cantidad: number }[]) => number;
  recibirPedido: (id: string) => void;
};

export const Ctx = createContext<StockCtx | null>(null);

export function useStock() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStock fuera del provider");
  return c;
}
