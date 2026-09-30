"use client";

import { createContext, useContext } from "react";
import type { Cliente, CrmState, Etapa, Tarea, TipoInteraccion, TipoTarea } from "./data";

export type Vista = "embudo" | "clientes" | "tareas";

export type ClienteInput = Omit<Cliente, "id" | "creado" | "ultimoContacto" | "interacciones" | "propiedades">;

export type CrmCtx = {
  state: CrmState;
  now: number;
  vista: Vista;
  setVista: (v: Vista) => void;
  busqueda: string;
  setBusqueda: (q: string) => void;
  abrirFicha: (id: string) => void;
  abrirForm: (id?: string) => void;
  abrirNuevaTarea: (clienteId?: string) => void;
  moverEtapa: (id: string, etapa: Etapa) => void;
  guardarCliente: (data: ClienteInput, id?: string) => string;
  eliminarCliente: (id: string) => void;
  registrar: (id: string, tipo: TipoInteraccion, texto: string) => void;
  guardarNotas: (id: string, notas: string) => void;
  togglePropiedad: (id: string, propiedadId: string) => void;
  crearTarea: (t: { clienteId: string; tipo: TipoTarea; texto: string; fecha: string }) => void;
  completarTarea: (id: string) => void;
  reabrirTarea: (id: string) => void;
  posponerTarea: (id: string) => void;
  proximaTarea: (clienteId: string) => Tarea | undefined;
  cliente: (id: string) => Cliente | undefined;
};

export const Ctx = createContext<CrmCtx | null>(null);

export function useCrm() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCrm fuera del provider");
  return c;
}
