"use client";

import { createContext, useContext } from "react";
import type { BrasaState, EstadoMesa, LineaPedido, Mesa, Origen, Pago, Pedido } from "./data";

export type Vista = "salon" | "cocina" | "nuevo" | "delivery";

export type BrasaCtx = {
  state: BrasaState;
  now: number;
  vista: Vista;
  setVista: (v: Vista) => void;
  mesaSel: string | null;
  setMesaSel: (id: string | null) => void;
  /** Preselección para "Nuevo pedido". */
  preOrigen: { tipo: "mesa"; mesaId: string } | { tipo: "delivery" } | null;
  tomarPedido: (o: BrasaCtx["preOrigen"]) => void;
  mesa: (id: string) => Mesa | undefined;
  pedidosMesa: (mesaId: string) => Pedido[];
  crearPedido: (o: Origen, lineas: Omit<LineaPedido, "id" | "hecho">[], nota: string) => number;
  avanzar: (id: string) => void;
  retroceder: (id: string) => void;
  toggleLinea: (pedidoId: string, lineaId: string) => void;
  setEstadoMesa: (id: string, estado: EstadoMesa, comensales?: number) => void;
  cobrarMesa: (id: string, pago: Pago) => void;
  despachar: (id: string, repartidor: string) => void;
  entregarDelivery: (id: string) => void;
};

export const Ctx = createContext<BrasaCtx | null>(null);

export function useBrasa() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useBrasa fuera del provider");
  return c;
}
