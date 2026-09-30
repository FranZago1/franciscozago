"use client";

import { createContext, useContext, useMemo, useState } from "react";

/** Tratamiento elegido desde el listado: precarga el formulario de turno. */
type Turno = { servicio: string; setServicio: (id: string) => void };

const Ctx = createContext<Turno | null>(null);

export function TurnoProvider({ children }: { children: React.ReactNode }) {
  const [servicio, setServicio] = useState("");
  const value = useMemo(() => ({ servicio, setServicio }), [servicio]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTurno() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTurno fuera de TurnoProvider");
  return v;
}
