/** Precio en pesos argentinos con separador de miles con punto: $ 45.900. Sin Intl para evitar diferencias SSR/cliente. */
export function pesos(n: number): string {
  const entero = Math.round(n);
  const signo = entero < 0 ? "-" : "";
  return `${signo}$ ${String(Math.abs(entero)).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

/** Valor de cada cuota sin interés. */
export const cuota = (total: number, cuotas: number) => Math.ceil(total / cuotas);

export const PROVINCIAS = [
  "Buenos Aires",
  "CABA",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
] as const;

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

/** "jueves 2 de octubre", salteando fines de semana, a `dias` hábiles de hoy. */
export function fechaHabil(dias: number, desde = new Date()): string {
  const d = new Date(desde);
  let n = 0;
  while (n < dias) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) n++;
  }
  return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
}
