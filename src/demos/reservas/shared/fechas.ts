/**
 * Fechas "de calendario" como strings ISO (AAAA-MM-DD), sin horas ni zonas de por medio.
 * La hora de referencia es la de Córdoba (America/Argentina/Cordoba, UTC−3 todo el año).
 * Toda la aritmética se hace en UTC para no depender de la zona del navegador.
 */

export type DiaISO = string;

export const ZONA = "America/Argentina/Cordoba";

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"] as const;
const DIAS_CORTOS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"] as const;
const MESES = [
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
] as const;

export type Ahora = { dia: DiaISO; minutos: number };

/** Día y minuto actuales en Córdoba. Solo en el cliente (depende del reloj). */
let formato: Intl.DateTimeFormat | null = null;

export function ahoraEnCordoba(fecha = new Date()): Ahora {
  formato ??= new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const partes = formato.formatToParts(fecha);
  const v = (t: string) => partes.find((p) => p.type === t)?.value ?? "00";
  return { dia: `${v("year")}-${v("month")}-${v("day")}`, minutos: Number(v("hour")) * 60 + Number(v("minute")) };
}

export function partes(d: DiaISO): { y: number; m: number; d: number } {
  const [y, m, dd] = d.split("-").map(Number);
  return { y: y ?? 1970, m: m ?? 1, d: dd ?? 1 };
}

function aUTC(d: DiaISO): number {
  const p = partes(d);
  return Date.UTC(p.y, p.m - 1, p.d);
}

function deUTC(ms: number): DiaISO {
  const x = new Date(ms);
  return `${x.getUTCFullYear()}-${String(x.getUTCMonth() + 1).padStart(2, "0")}-${String(x.getUTCDate()).padStart(2, "0")}`;
}

export function crearDia(y: number, m: number, d: number): DiaISO {
  return deUTC(Date.UTC(y, m - 1, d));
}

export function sumarDias(d: DiaISO, n: number): DiaISO {
  return deUTC(aUTC(d) + n * 86_400_000);
}

export function diferenciaDias(desde: DiaISO, hasta: DiaISO): number {
  return Math.round((aUTC(hasta) - aUTC(desde)) / 86_400_000);
}

/** 0 = domingo … 6 = sábado */
export function diaSemana(d: DiaISO): number {
  return new Date(aUTC(d)).getUTCDay();
}

export function nombreDia(d: DiaISO): string {
  return DIAS[diaSemana(d)] ?? "";
}

export function nombreDiaCorto(d: DiaISO): string {
  return DIAS_CORTOS[diaSemana(d)] ?? "";
}

export function nombreMes(m: number): string {
  return MESES[m - 1] ?? "";
}

/** "miércoles 30 de septiembre" */
export function fechaLarga(d: DiaISO): string {
  const p = partes(d);
  return `${nombreDia(d)} ${p.d} de ${nombreMes(p.m)}`;
}

/** "mié 30 sep" */
export function fechaCorta(d: DiaISO): string {
  const p = partes(d);
  return `${nombreDiaCorto(d)} ${p.d} ${nombreMes(p.m).slice(0, 3)}`;
}

export function mesDe(d: DiaISO): { y: number; m: number } {
  const p = partes(d);
  return { y: p.y, m: p.m };
}

export function sumarMeses(mes: { y: number; m: number }, n: number): { y: number; m: number } {
  const total = mes.y * 12 + (mes.m - 1) + n;
  return { y: Math.floor(total / 12), m: (total % 12) + 1 };
}

export function compararMes(a: { y: number; m: number }, b: { y: number; m: number }): number {
  return a.y * 12 + a.m - (b.y * 12 + b.m);
}

/** Semanas del mes (lunes a domingo). Los huecos fuera del mes son null. */
export function semanasDelMes(y: number, m: number): (DiaISO | null)[][] {
  const primero = crearDia(y, m, 1);
  const offset = (diaSemana(primero) + 6) % 7; // lunes = 0
  const diasEnMes = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const celdas: (DiaISO | null)[] = Array.from({ length: offset }, () => null);
  for (let i = 1; i <= diasEnMes; i++) celdas.push(crearDia(y, m, i));
  while (celdas.length % 7) celdas.push(null);
  const semanas: (DiaISO | null)[][] = [];
  for (let i = 0; i < celdas.length; i += 7) semanas.push(celdas.slice(i, i + 7));
  return semanas;
}

/** 570 → "09:30" */
export function hhmm(minutos: number): string {
  const h = Math.floor(minutos / 60) % 24;
  const m = minutos % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** "1 h 30 min", "45 min" */
export function duracionTexto(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/** 14000 → "$14.000" (armado a mano para que servidor y navegador den lo mismo). */
export function pesos(n: number): string {
  const s = String(Math.abs(Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${n < 0 ? "−" : ""}$${s}`;
}
