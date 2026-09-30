import { partes, type DiaISO } from "./fechas";

/**
 * Archivo .ics (iCalendar) armado en el navegador, sin servidor.
 * Los horarios de Córdoba se pasan a UTC sumando 3 horas (Argentina no usa horario de verano).
 */

export type EventoIcs = {
  uid: string;
  titulo: string;
  descripcion: string;
  lugar: string;
} & (
  | { tipo: "horario"; dia: DiaISO; inicio: number; fin: number }
  | { tipo: "dias"; desde: DiaISO; hasta: DiaISO }
);

const OFFSET_CORDOBA_MIN = 180;

function escapar(texto: string): string {
  return texto.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function utc(dia: DiaISO, minutos: number): string {
  const p = partes(dia);
  const d = new Date(Date.UTC(p.y, p.m - 1, p.d, 0, minutos + OFFSET_CORDOBA_MIN));
  const dos = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}${dos(d.getUTCMonth() + 1)}${dos(d.getUTCDate())}T${dos(d.getUTCHours())}${dos(d.getUTCMinutes())}00Z`;
}

function soloFecha(dia: DiaISO): string {
  return dia.replace(/-/g, "");
}

/** Corta líneas largas a 75 octetos aproximados, como pide el estándar. */
function plegar(linea: string): string {
  const partesLinea: string[] = [];
  let resto = linea;
  while (resto.length > 72) {
    partesLinea.push(resto.slice(0, 72));
    resto = ` ${resto.slice(72)}`;
  }
  partesLinea.push(resto);
  return partesLinea.join("\r\n");
}

export function crearIcs(ev: EventoIcs): string {
  const ahora = new Date();
  const stamp = ahora.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const cuando =
    ev.tipo === "horario"
      ? [`DTSTART:${utc(ev.dia, ev.inicio)}`, `DTEND:${utc(ev.dia, ev.fin)}`]
      : [`DTSTART;VALUE=DATE:${soloFecha(ev.desde)}`, `DTEND;VALUE=DATE:${soloFecha(ev.hasta)}`];
  const lineas = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Demo Francisco Zago//Reservas//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${ev.uid}@demo-reservas`,
    `DTSTAMP:${stamp}`,
    ...cuando,
    `SUMMARY:${escapar(ev.titulo)}`,
    `DESCRIPTION:${escapar(ev.descripcion)}`,
    `LOCATION:${escapar(ev.lugar)}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapar(ev.titulo)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lineas.map(plegar).join("\r\n");
}

/** Descarga el .ics generado. */
export function descargarIcs(ev: EventoIcs, nombreArchivo: string): void {
  const blob = new Blob([crearIcs(ev)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreArchivo.endsWith(".ics") ? nombreArchivo : `${nombreArchivo}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

