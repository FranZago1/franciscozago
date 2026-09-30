"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { DiaId, DisciplinaId } from "./datos";
import { clasePorId } from "./datos";

/**
 * Estado compartido entre la grilla de horarios y el formulario de clase de prueba:
 * elegir una clase en la grilla precarga disciplina, día y horario en el formulario.
 */
type Reserva = {
  filtro: DisciplinaId | "todas";
  setFiltro: (f: DisciplinaId | "todas") => void;
  disciplina: DisciplinaId | "";
  dia: DiaId | "";
  claseId: string;
  setDisciplina: (d: DisciplinaId | "") => void;
  setDia: (d: DiaId | "") => void;
  setClaseId: (id: string) => void;
  /** Elige una clase de la grilla y sincroniza todo. */
  elegirClase: (id: string) => void;
};

const Ctx = createContext<Reserva | null>(null);

export function ReservaProvider({ children }: { children: React.ReactNode }) {
  const [filtro, setFiltro] = useState<DisciplinaId | "todas">("todas");
  const [disciplina, setDisciplinaState] = useState<DisciplinaId | "">("");
  const [dia, setDiaState] = useState<DiaId | "">("");
  const [claseId, setClaseId] = useState("");

  const elegirClase = useCallback((id: string) => {
    const c = clasePorId[id];
    if (!c) return;
    setClaseId(id);
    setDisciplinaState(c.disciplina);
    setDiaState(c.dia);
  }, []);

  // Cambiar disciplina o día invalida el horario elegido si ya no coincide.
  const setDisciplina = useCallback((d: DisciplinaId | "") => {
    setDisciplinaState(d);
    setClaseId((id) => (id && clasePorId[id]?.disciplina === d ? id : ""));
  }, []);
  const setDia = useCallback((d: DiaId | "") => {
    setDiaState(d);
    setClaseId((id) => (id && clasePorId[id]?.dia === d ? id : ""));
  }, []);

  const value = useMemo(
    () => ({ filtro, setFiltro, disciplina, dia, claseId, setDisciplina, setDia, setClaseId, elegirClase }),
    [filtro, disciplina, dia, claseId, setDisciplina, setDia, elegirClase],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useReserva() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useReserva fuera de ReservaProvider");
  return v;
}

/** Botón de tarjeta de disciplina: filtra la grilla y lleva a los horarios. */
export function VerHorarios({ disciplina, nombre }: { disciplina: DisciplinaId; nombre: string }) {
  const { setFiltro } = useReserva();
  return (
    <a
      href="#horarios"
      onClick={() => setFiltro(disciplina)}
      className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-[#F2EEE6] underline-offset-4 after:absolute after:inset-0 after:z-10 after:content-[''] hover:underline focus-visible:outline-offset-4"
      aria-label={`Ver horarios de ${nombre}`}
    >
      Ver horarios
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </a>
  );
}
