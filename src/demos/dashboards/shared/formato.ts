/**
 * Formatos en es-AR. Los separadores salen de Intl; los sufijos ("M", "mil") y el signo "$" se
 * arman a mano para que el texto sea idéntico en Node y en el navegador (evita diferencias de ICU
 * y de espacios duros que rompen la hidratación).
 */

const nf0 = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("es-AR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const nf1opt = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 });
const nf2 = new Intl.NumberFormat("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** 12.345 */
export const numero = (v: number) => nf0.format(Math.round(v));

/** 12,3 */
export const decimal = (v: number) => nf1.format(v);

/** $ 12.345 (o −$ 12.345) */
export const pesos = (v: number) => `${v < 0 ? "−" : ""}$ ${nf0.format(Math.round(Math.abs(v)))}`;

/** Número compacto: 1,2 M · 845 mil · 950 */
export function compacto(v: number): string {
  const a = Math.abs(v);
  const s = v < 0 ? "−" : "";
  if (a >= 1e9) return `${s}${nf1opt.format(a / 1e9)} mil M`;
  if (a >= 1e6) return `${s}${nf1opt.format(a / 1e6)} M`;
  if (a >= 1e4) return `${s}${nf0.format(a / 1e3)} mil`;
  if (a >= 1e3) return `${s}${nf1opt.format(a / 1e3)} mil`;
  return `${s}${nf0.format(a)}`;
}

/** $ 1,2 M */
export const pesosCompacto = (v: number) => `${v < 0 ? "−" : ""}$ ${compacto(Math.abs(v))}`;

/** 0,0234 → 2,34 % */
export const porcentaje = (v: number, dec = 1) => `${(dec === 2 ? nf2 : dec === 0 ? nf0 : nf1).format(v * 100)} %`;

/** Variación con signo: +12,4 % / −3,1 % */
export function delta(v: number): string {
  const txt = nf1.format(Math.abs(v * 100));
  if (Math.abs(v) < 0.0005) return `0,0 %`;
  return `${v > 0 ? "+" : "−"}${txt} %`;
}

/** Puntos porcentuales: +0,3 pp */
export function deltaPp(v: number): string {
  const a = Math.abs(v * 100);
  const txt = (a < 0.1 ? nf2 : nf1).format(a);
  if (a < 0.005) return "0,00 pp";
  return `${v >= 0 ? "+" : "−"}${txt} pp`;
}

// ---------- Fechas (todas en UTC, con nombres propios para no depender de ICU) ----------

export const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
export const MESES_LARGO = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];
export const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
export const DIAS_LARGO = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

const DIA_MS = 86_400_000;

/** "Hoy" fijo de las demos: martes 29 de septiembre de 2026. */
export const HOY = Date.UTC(2026, 8, 29);

export const sumarDias = (t: number, n: number) => t + n * DIA_MS;

export function partes(t: number) {
  const d = new Date(t);
  return { dia: d.getUTCDate(), mes: d.getUTCMonth(), anio: d.getUTCFullYear(), semana: d.getUTCDay() };
}

/** "29 sep" */
export function fechaCorta(t: number) {
  const p = partes(t);
  return `${p.dia} ${MESES[p.mes]}`;
}

/** "mar 29 sep" */
export function fechaConDia(t: number) {
  const p = partes(t);
  return `${DIAS[p.semana]} ${p.dia} ${MESES[p.mes]}`;
}

/** "sep 2026" */
export function mesAnio(t: number) {
  const p = partes(t);
  return `${MESES[p.mes]} ${p.anio}`;
}
