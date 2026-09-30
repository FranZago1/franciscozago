/**
 * Utilidades de datos para las demos de dashboards.
 * Todo es determinista: misma semilla, mismos números en el servidor y en el navegador
 * (nada de Math.random ni de la fecha actual, así no se rompe la hidratación).
 */

/** Generador pseudoaleatorio con semilla (mulberry32). Devuelve números en [0, 1). */
export function rng(seed: number) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    /** Número entre min y max. */
    rango: (min: number, max: number) => min + (max - min) * next(),
    /** Entero entre min y max (inclusive). */
    entero: (min: number, max: number) => Math.floor(min + (max - min + 1) * next()),
    /** Ruido aproximadamente normal, media 0 y desvío 1. */
    normal: () => (next() + next() + next() + next() - 2) * 1.73,
    elegir: <T,>(xs: readonly T[]): T => xs[Math.floor(next() * xs.length)]!,
  };
}

/** Hash simple de texto a entero, para derivar semillas estables (ej. por sede o período). */
export function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export type Periodo = "7d" | "30d" | "12m";

export const PERIODOS: { id: Periodo; corto: string; largo: string; anterior: string }[] = [
  { id: "7d", corto: "7 días", largo: "Últimos 7 días", anterior: "vs. 7 días anteriores" },
  { id: "30d", corto: "30 días", largo: "Últimos 30 días", anterior: "vs. 30 días anteriores" },
  { id: "12m", corto: "12 meses", largo: "Últimos 12 meses", anterior: "vs. 12 meses anteriores" },
];

export const suma = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0);

/** Variación relativa (0,12 = +12 %). */
export const variacion = (actual: number, anterior: number) => (anterior === 0 ? 0 : actual / anterior - 1);

/** Paso "lindo" para ejes: 1, 2, 2,5 o 5 × 10^n. */
export function ticksLindos(min: number, max: number, cantidad = 4): number[] {
  if (max === min) max = min + 1;
  const crudo = (max - min) / cantidad;
  const pot = Math.pow(10, Math.floor(Math.log10(crudo)));
  const norm = crudo / pot;
  const paso = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * pot;
  const desde = Math.floor(min / paso) * paso;
  const hasta = Math.ceil(max / paso) * paso;
  const out: number[] = [];
  for (let v = desde; v <= hasta + paso / 2; v += paso) out.push(Math.round(v / paso) * paso);
  return out;
}
