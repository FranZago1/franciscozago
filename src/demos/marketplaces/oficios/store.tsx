"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { profesionales, type OficioId, type Profesional } from "./data";

export type Filtros = {
  oficio: OficioId | null;
  barrio: string;
  disp: "cualquiera" | "hoy" | "semana";
  urgencias: boolean;
  ratingMin: number;
  orden: "recomendados" | "rating" | "resenas" | "respuesta";
};

export const filtrosIniciales: Filtros = {
  oficio: null,
  barrio: "",
  disp: "cualquiera",
  urgencias: false,
  ratingMin: 0,
  orden: "recomendados",
};

export function filtrar(f: Filtros): Profesional[] {
  const r = profesionales.filter((p) => {
    if (f.oficio && p.oficio !== f.oficio) return false;
    if (f.barrio && !p.barrios.includes(f.barrio)) return false;
    if (f.disp === "hoy" && p.disp !== "hoy") return false;
    if (f.disp === "semana" && p.disp === "proxima") return false;
    if (f.urgencias && !p.urgencias) return false;
    if (p.rating < f.ratingMin) return false;
    return true;
  });
  const puntaje = (p: Profesional) => p.rating * 20 + Math.min(p.resenas, 300) / 15 - p.respuestaMin / 10 + (p.disp === "hoy" ? 4 : 0);
  const orden: Record<Filtros["orden"], (a: Profesional, b: Profesional) => number> = {
    recomendados: (a, b) => puntaje(b) - puntaje(a),
    rating: (a, b) => b.rating - a.rating || b.resenas - a.resenas,
    resenas: (a, b) => b.resenas - a.resenas,
    respuesta: (a, b) => a.respuestaMin - b.respuestaMin,
  };
  return r.sort(orden[f.orden]);
}

type Pedido = { proId: string; problema: string };

type Ctx = {
  filtros: Filtros;
  setFiltro: <K extends keyof Filtros>(k: K, v: Filtros[K]) => void;
  limpiar: () => void;
  resultados: Profesional[];
  problema: string;
  setProblema: (t: string) => void;
  perfil: string | null;
  setPerfil: (id: string | null) => void;
  pedido: Pedido | null;
  pedir: (proId: string) => void;
  cerrarPedido: () => void;
  irA: (id: string) => void;
};

const OficiosCtx = createContext<Ctx | null>(null);

export function useOficios() {
  const c = useContext(OficiosCtx);
  if (!c) throw new Error("useOficios fuera de OficiosProvider");
  return c;
}

export function OficiosProvider({ children }: { children: ReactNode }) {
  const [filtros, setFiltros] = useState<Filtros>(filtrosIniciales);
  const [problema, setProblema] = useState("");
  const [perfil, setPerfil] = useState<string | null>(null);
  const [pedido, setPedido] = useState<Pedido | null>(null);

  const setFiltro = useCallback(<K extends keyof Filtros>(k: K, v: Filtros[K]) => setFiltros((f) => ({ ...f, [k]: v })), []);
  const limpiar = useCallback(() => setFiltros(filtrosIniciales), []);
  const resultados = useMemo(() => filtrar(filtros), [filtros]);

  const irA = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reducir ? "auto" : "smooth", block: "start" });
  }, []);

  const value: Ctx = {
    filtros,
    setFiltro,
    limpiar,
    resultados,
    problema,
    setProblema,
    perfil,
    setPerfil,
    pedido,
    pedir: (proId) => setPedido({ proId, problema }),
    cerrarPedido: () => setPedido(null),
    irA,
  };

  return <OficiosCtx.Provider value={value}>{children}</OficiosCtx.Provider>;
}
