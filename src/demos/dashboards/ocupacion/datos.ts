import { hash, rng, suma, variacion, type Periodo } from "../shared/datos";
import { DIAS, HOY, MESES, MESES_LARGO, DIAS_LARGO, partes, sumarDias } from "../shared/formato";

/** Datos ficticios de "Complejo Punto Alto". Todo determinista. */

export type SedeId = "todas" | "centro" | "cerro";
export type ActividadId = "todas" | "musculacion" | "funcional" | "natacion" | "padel" | "futbol";

export const SEDES: { id: SedeId; nombre: string }[] = [
  { id: "todas", nombre: "Todas las sedes" },
  { id: "centro", nombre: "Sede Centro" },
  { id: "cerro", nombre: "Sede Cerro" },
];

export const ACTIVIDADES: { id: ActividadId; nombre: string }[] = [
  { id: "todas", nombre: "Todas" },
  { id: "musculacion", nombre: "Musculación" },
  { id: "funcional", nombre: "Funcional" },
  { id: "natacion", nombre: "Natación" },
  { id: "padel", nombre: "Pádel" },
  { id: "futbol", nombre: "Fútbol 5" },
];

export type Espacio = {
  id: string;
  nombre: string;
  sede: Exclude<SedeId, "todas">;
  act: Exclude<ActividadId, "todas">;
  capacidad: number;
  ahora: number;
};

export const ESPACIOS: Espacio[] = [
  { id: "c-musc", nombre: "Sala de musculación", sede: "centro", act: "musculacion", capacidad: 60, ahora: 51 },
  { id: "c-func", nombre: "Salón funcional", sede: "centro", act: "funcional", capacidad: 24, ahora: 22 },
  { id: "c-pile", nombre: "Pileta semiolímpica", sede: "centro", act: "natacion", capacidad: 32, ahora: 14 },
  { id: "c-pad1", nombre: "Cancha de pádel 1", sede: "centro", act: "padel", capacidad: 4, ahora: 4 },
  { id: "c-pad2", nombre: "Cancha de pádel 2", sede: "centro", act: "padel", capacidad: 4, ahora: 2 },
  { id: "k-musc", nombre: "Sala de musculación", sede: "cerro", act: "musculacion", capacidad: 45, ahora: 29 },
  { id: "k-ciclo", nombre: "Sala de ciclo indoor", sede: "cerro", act: "funcional", capacidad: 22, ahora: 9 },
  { id: "k-f5a", nombre: "Cancha de fútbol 5 A", sede: "cerro", act: "futbol", capacidad: 10, ahora: 10 },
  { id: "k-f5b", nombre: "Cancha de fútbol 5 B", sede: "cerro", act: "futbol", capacidad: 10, ahora: 0 },
  { id: "k-pad3", nombre: "Cancha de pádel 3", sede: "cerro", act: "padel", capacidad: 4, ahora: 4 },
];

export function filtrarEspacios(sede: SedeId, act: ActividadId) {
  return ESPACIOS.filter((e) => (sede === "todas" || e.sede === sede) && (act === "todas" || e.act === act));
}

// ---------------------------------------------------------------- Mapa de calor

export const HORAS = Array.from({ length: 17 }, (_, i) => 7 + i); // 7 a 23 h
/** Filas en orden lunes → domingo (índice de getUTCDay: 1..6, 0). */
export const FILAS_DIA = [1, 2, 3, 4, 5, 6, 0];

/** Horario del complejo: lun a vie 7–23, sáb 8–20, dom 9–14. */
export function abierto(dia: number, hora: number) {
  if (dia === 0) return hora >= 9 && hora < 14;
  if (dia === 6) return hora >= 8 && hora < 20;
  return hora >= 7 && hora < 23;
}

const campana = (h: number, centro: number, ancho: number) => Math.exp(-((h - centro) ** 2) / (2 * ancho * ancho));

/** Perfil típico (0..1) de cada actividad por día y hora. */
function perfil(act: Exclude<ActividadId, "todas">, dia: number, hora: number): number {
  const finde = dia === 0 || dia === 6;
  const h = hora + 0.5;
  switch (act) {
    case "musculacion":
      return finde
        ? 0.2 + 0.55 * campana(h, 11, 2)
        : 0.16 + 0.5 * campana(h, 8.5, 1.3) + 0.78 * campana(h, 19.3, 1.9) + 0.25 * campana(h, 13, 1.2);
    case "funcional":
      return finde
        ? 0.1 + 0.62 * campana(h, 10.5, 1.4)
        : 0.08 + 0.72 * campana(h, 7.6, 0.9) + 0.9 * campana(h, 19, 1.3);
    case "natacion":
      return finde
        ? 0.15 + 0.6 * campana(h, 11.5, 1.6)
        : 0.12 + 0.55 * campana(h, 9.5, 1.5) + 0.62 * campana(h, 18.5, 1.6);
    case "padel":
      return finde
        ? 0.3 + 0.62 * campana(h, 11, 2.4)
        : 0.12 + 0.3 * campana(h, 13, 1) + 0.86 * campana(h, 20.2, 1.8);
    case "futbol":
      return finde ? 0.22 + 0.55 * campana(h, 12, 2) : 0.05 + 0.96 * campana(h, 21.3, 1.5) + 0.15 * campana(h, 13, 1);
  }
}

function factorDia(dia: number) {
  // Lunes y martes a full; el viernes afloja.
  return [0.8, 1.06, 1.04, 1.0, 1.02, 0.86, 0.92][dia]!;
}

export type Celda = { dia: number; hora: number; valor: number | null };

export function mapaDeCalor(sede: SedeId, act: ActividadId, periodo: Periodo, semilla = "") {
  const espacios = filtrarEspacios(sede, act);
  const r = rng(hash(`calor-${sede}-${act}-${periodo}${semilla}`));
  const ruido = periodo === "7d" ? 0.09 : periodo === "30d" ? 0.05 : 0.025;
  const ajuste = periodo === "12m" ? 0.95 : periodo === "30d" ? 1.0 : 1.03;
  const celdas: Celda[] = [];
  const capTotal = suma(espacios.map((e) => e.capacidad)) || 1;
  for (const dia of FILAS_DIA) {
    for (const hora of HORAS) {
      if (!abierto(dia, hora)) {
        celdas.push({ dia, hora, valor: null });
        continue;
      }
      let ocupados = 0;
      for (const e of espacios) ocupados += e.capacidad * perfil(e.act, dia, hora);
      const v = (ocupados / capTotal) * factorDia(dia) * ajuste * (1 + ruido * r.normal());
      celdas.push({ dia, hora, valor: Math.max(0.02, Math.min(0.99, v)) });
    }
  }
  return celdas;
}

export const nombreCelda = (c: Celda) => `${DIAS_LARGO[c.dia]} de ${c.hora} a ${c.hora + 1} h`;
export const nombreCeldaCorto = (c: Celda) => `${DIAS[c.dia]} ${c.hora} h`;

// ---------------------------------------------------------------- Clases

const CLASES: {
  id: string;
  nombre: string;
  horario: string;
  sede: Exclude<SedeId, "todas">;
  act: Exclude<ActividadId, "todas">;
  cupo: number;
  base: number;
}[] = [
  { id: "func7", nombre: "Funcional intensivo", horario: "lun a vie 7 h", sede: "centro", act: "funcional", cupo: 20, base: 0.9 },
  { id: "func19", nombre: "Funcional", horario: "lun a vie 19 h", sede: "centro", act: "funcional", cupo: 24, base: 0.96 },
  { id: "ciclo", nombre: "Ciclo indoor", horario: "lun, mié y vie 18:30 h", sede: "cerro", act: "funcional", cupo: 22, base: 0.84 },
  { id: "estira", nombre: "Estiramiento y movilidad", horario: "mar y jue 8 h", sede: "cerro", act: "funcional", cupo: 20, base: 0.46 },
  { id: "aqua", nombre: "Aquagym", horario: "mar y jue 10 h", sede: "centro", act: "natacion", cupo: 18, base: 0.62 },
  { id: "nata", nombre: "Natación adultos", horario: "lun a vie 20 h", sede: "centro", act: "natacion", cupo: 16, base: 0.81 },
  { id: "padel", nombre: "Clínica de pádel", horario: "sáb 10 h", sede: "centro", act: "padel", cupo: 8, base: 0.92 },
  { id: "muscg", nombre: "Musculación guiada", horario: "lun a vie 9 h", sede: "cerro", act: "musculacion", cupo: 15, base: 0.55 },
  { id: "f5", nombre: "Liga de fútbol 5 mixto", horario: "mié 21 h", sede: "cerro", act: "futbol", cupo: 20, base: 0.98 },
];

export function asistencia(sede: SedeId, act: ActividadId, periodo: Periodo) {
  const r = rng(hash(`clases-${periodo}`));
  const sesiones = periodo === "7d" ? 1 : periodo === "30d" ? 4.3 : 52;
  return CLASES.map((c) => {
    const ratio = Math.min(1, Math.max(0.2, c.base + 0.06 * r.normal()));
    const promedio = c.cupo * ratio;
    return { ...c, promedio, ratio, total: Math.round(promedio * sesiones * (c.horario.includes("lun a vie") ? 5 : c.horario.includes(",") ? 3 : c.horario.includes(" y ") ? 2 : 1)) };
  })
    .filter((c) => (sede === "todas" || c.sede === sede) && (act === "todas" || c.act === act))
    .sort((a, b) => b.ratio - a.ratio);
}

// ---------------------------------------------------------------- Socios

const PESO_SEDE: Record<SedeId, number> = { todas: 1, centro: 0.58, cerro: 0.42 };
const PESO_ACT: Record<ActividadId, number> = {
  todas: 1,
  musculacion: 0.52,
  funcional: 0.31,
  natacion: 0.17,
  padel: 0.14,
  futbol: 0.12,
};

type DiaSocios = { t: number; altas: number; bajas: number };
const TOTAL_DIAS = 800;
const ESTACION_ALTAS = [1.25, 1.45, 1.6, 1.15, 0.9, 0.75, 0.7, 0.95, 1.05, 1.1, 1.0, 0.7];
const ESTACION_BAJAS = [1.2, 0.8, 0.85, 0.95, 1.05, 1.15, 1.25, 0.95, 0.9, 0.9, 1.0, 1.45];

const HISTORIA: DiaSocios[] = (() => {
  const r = rng(771);
  const out: DiaSocios[] = [];
  for (let d = 0; d < TOTAL_DIAS; d++) {
    const t = sumarDias(HOY, d - (TOTAL_DIAS - 1));
    const p = partes(t);
    const finde = p.semana === 0 || p.semana === 6 ? 0.45 : 1.12;
    const altas = Math.max(0, Math.round(3.4 * ESTACION_ALTAS[p.mes]! * finde + 1.4 * r.normal()));
    const bajas = Math.max(0, Math.round(2.0 * ESTACION_BAJAS[p.mes]! * finde + 1.2 * r.normal()));
    out.push({ t, altas, bajas });
  }
  return out;
})();

const ACTIVOS_HOY = 1_284;

export function socios(sede: SedeId, act: ActividadId, periodo: Periodo) {
  const escala = PESO_SEDE[sede] * PESO_ACT[act];
  const n = HISTORIA.length;
  let puntos: { etiqueta: string; eje: string; altas: number; bajas: number }[];
  let prev: DiaSocios[];

  if (periodo === "12m") {
    const inicio = HISTORIA.findIndex((d) => {
      const p = partes(d.t);
      return p.anio === 2025 && p.mes === 9 && p.dia === 1;
    });
    const mapa = new Map<string, { etiqueta: string; eje: string; altas: number; bajas: number }>();
    for (const d of HISTORIA.slice(inicio)) {
      const p = partes(d.t);
      const k = `${p.anio}-${p.mes}`;
      const m = mapa.get(k) ?? {
        etiqueta: `${MESES_LARGO[p.mes]} ${p.anio}`,
        eje: p.mes === 0 ? `${MESES[p.mes]} ${String(p.anio).slice(2)}` : MESES[p.mes]!,
        altas: 0,
        bajas: 0,
      };
      m.altas += d.altas;
      m.bajas += d.bajas;
      mapa.set(k, m);
    }
    puntos = [...mapa.values()];
    prev = HISTORIA.slice(inicio - 365, inicio);
  } else {
    const k = periodo === "7d" ? 7 : 30;
    puntos = HISTORIA.slice(n - k).map((d) => {
      const p = partes(d.t);
      return {
        etiqueta: `${DIAS_LARGO[p.semana]} ${p.dia} de ${MESES_LARGO[p.mes]}`,
        eje: k === 7 ? `${DIAS[p.semana]} ${p.dia}` : `${p.dia} ${MESES[p.mes]}`,
        altas: d.altas,
        bajas: d.bajas,
      };
    });
    prev = HISTORIA.slice(n - 2 * k, n - k);
  }
  puntos = puntos.map((p) => ({ ...p, altas: Math.round(p.altas * escala), bajas: Math.round(p.bajas * escala) }));
  const altas = suma(puntos.map((p) => p.altas));
  const bajas = suma(puntos.map((p) => p.bajas));
  const altasPrev = Math.round(suma(prev.map((d) => d.altas)) * escala);
  const bajasPrev = Math.round(suma(prev.map((d) => d.bajas)) * escala);
  const activos = Math.round(ACTIVOS_HOY * escala);
  return {
    puntos,
    altas,
    bajas,
    neto: altas - bajas,
    activos,
    varActivos: variacion(activos, activos - (altas - bajas)),
    varAltas: variacion(altas, altasPrev),
    varBajas: variacion(bajas, bajasPrev),
    /** Rotación mensual: bajas por mes sobre los socios activos promedio del período. */
    rotacion:
      bajas / (periodo === "12m" ? 12 : periodo === "30d" ? 1 : 7 / 30.4) / Math.max(1, activos - (altas - bajas) / 2),
  };
}
