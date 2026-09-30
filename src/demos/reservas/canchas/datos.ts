import { generador } from "../shared/azar";
import { diaSemana, pesos, type Ahora, type DiaISO } from "../shared/fechas";
import type { ConId } from "../shared/hooks";

// Todo es ficticio: el club, las personas, los precios y las reseñas.

export const club = {
  nombre: "Pádel Club Sierras",
  direccion: "Camino a los Nogales km 3, Villa Allende",
};

export type Cancha = {
  id: string;
  nombre: string;
  apodo?: string;
  techada: boolean;
  panoramica: boolean;
};

export const canchas: Cancha[] = [
  { id: "c1", nombre: "Cancha 1", apodo: "Central", techada: true, panoramica: true },
  { id: "c2", nombre: "Cancha 2", techada: true, panoramica: false },
  { id: "c3", nombre: "Cancha 3", techada: true, panoramica: false },
  { id: "c4", nombre: "Cancha 4", techada: false, panoramica: false },
  { id: "c5", nombre: "Cancha 5", techada: false, panoramica: false },
];

export const APERTURA = 8 * 60;
export const CIERRE = 24 * 60;
export const BLOQUE = 30;
export const BLOQUES = (CIERRE - APERTURA) / BLOQUE;
export const DIAS_VISIBLES = 14;
export const DURACIONES = [60, 90, 120] as const;
export type Duracion = (typeof DURACIONES)[number];

/** Desde esta hora las descubiertas cobran luz. */
export const HORA_LUZ = 19 * 60;
export const PRECIO_LUZ_HORA = 3000;
export const PRECIO_PALETA = 3000;
export const PRECIO_PELOTAS = 9000;
export const SENA = 0.3;

export function inicioBloque(b: number): number {
  return APERTURA + b * BLOQUE;
}

export function esHoraPico(dia: DiaISO, minutos: number): boolean {
  const dow = diaSemana(dia);
  if (dow === 0 || dow === 6) return minutos >= 10 * 60;
  return minutos >= 18 * 60;
}

/** Precio de la hora de cancha según tipo, horario y día. */
export function precioHora(c: Cancha, dia: DiaISO, minutos: number): number {
  const base = c.techada ? 24000 : 18000;
  const pico = esHoraPico(dia, minutos) ? (c.techada ? 6000 : 4000) : 0;
  return base + pico + (c.panoramica ? 4000 : 0);
}

export function cotizar(c: Cancha, dia: DiaISO, inicio: number, duracion: number) {
  let cancha = 0;
  let luz = 0;
  for (let t = inicio; t < inicio + duracion; t += BLOQUE) {
    cancha += precioHora(c, dia, t) / 2;
    if (!c.techada && t >= HORA_LUZ) luz += PRECIO_LUZ_HORA / 2;
  }
  return { cancha, luz };
}

export type TipoOcupado = "reserva" | "clase" | "torneo" | "tuya";
export type Ocupado = { tipo: TipoOcupado; desde: number; largo: number };

/** Ocupación determinista de una cancha para una fecha: bloque → turno que lo ocupa. */
export function ocupacion(c: Cancha, dia: DiaISO): Map<number, Ocupado> {
  const r = generador(`sierras|${c.id}|${dia}`);
  const dow = diaSemana(dia);
  const finde = dow === 0 || dow === 6;
  const mapa = new Map<number, Ocupado>();
  const marcar = (desde: number, largo: number, tipo: TipoOcupado) => {
    for (let i = 0; i < largo; i++) mapa.set(desde + i, { tipo, desde, largo });
  };
  // Clases de la mañana en las techadas, días de semana.
  if (!finde && (c.id === "c2" || c.id === "c3") && r() < 0.7) marcar(2 + Math.floor(r() * 2), 3, "clase");
  // Torneo de los sábados en la central.
  if (dow === 6 && c.id === "c1") marcar(14, 8, "torneo");
  let b = 0;
  while (b < BLOQUES) {
    if (mapa.has(b)) {
      b++;
      continue;
    }
    const t = inicioBloque(b);
    const p = finde ? 0.34 : t >= 18 * 60 ? 0.34 : t >= 12 * 60 ? 0.2 : 0.13;
    if (r() < p) {
      const largo = [2, 3, 3, 3, 4][Math.floor(r() * 5)] ?? 3;
      let libre = true;
      for (let i = 0; i < largo; i++) if (b + i >= BLOQUES || mapa.has(b + i)) libre = false;
      if (libre) {
        marcar(b, largo, "reserva");
        b += largo;
        continue;
      }
    }
    b++;
  }
  return mapa;
}

export type ReservaCancha = ConId & {
  codigo: string;
  dia: DiaISO;
  cancha: string;
  inicio: number;
  duracion: number;
  paletas: number;
  pelotas: boolean;
  invitados: string[];
  total: number;
  sena: number;
  nombre: string;
  pago: "tarjeta" | "transferencia";
};

/** Ocupación final: la del club más las reservas propias guardadas en el navegador. */
export function ocupacionCompleta(c: Cancha, dia: DiaISO, propias: ReservaCancha[]): Map<number, Ocupado> {
  const mapa = ocupacion(c, dia);
  for (const r of propias) {
    if (r.estado !== "confirmada" || r.dia !== dia || r.cancha !== c.id) continue;
    const desde = (r.inicio - APERTURA) / BLOQUE;
    const largo = r.duracion / BLOQUE;
    for (let i = 0; i < largo; i++) mapa.set(desde + i, { tipo: "tuya", desde, largo });
  }
  return mapa;
}

export function bloquePasado(dia: DiaISO, b: number, ahora: Ahora): boolean {
  return dia < ahora.dia || (dia === ahora.dia && inicioBloque(b) < ahora.minutos + 15);
}

/** ¿Se puede empezar en el bloque b con esta duración? */
export function entra(mapa: Map<number, Ocupado>, dia: DiaISO, b: number, duracion: number, ahora: Ahora): boolean {
  const n = duracion / BLOQUE;
  if (b + n > BLOQUES) return false;
  if (bloquePasado(dia, b, ahora)) return false;
  for (let i = 0; i < n; i++) if (mapa.has(b + i)) return false;
  return true;
}

export type Jugador = {
  id: string;
  nombre: string;
  categoria: string;
  lado: "drive" | "revés" | "indistinto";
  partidos: number;
  color: string;
};

const NOMBRES = ["Sofi M.", "Nico A.", "Caro L.", "Fede R.", "Juli P.", "Mati G.", "Lu B.", "Santi V.", "Agus T.", "Vale D.", "Tomi C.", "Flor Q."];
const CATEGORIAS = ["4ta", "5ta", "6ta", "7ma", "Principiante"];
const COLORES = ["#1553d6", "#2e9e5b", "#0a1b3d", "#e0703a", "#7b4fd6", "#0f8a8a"];

/** Jugadores "buscando partido" para un día y una franja: lista simulada y estable. */
export function jugadoresDisponibles(dia: DiaISO, inicio: number): Jugador[] {
  const r = generador(`companeros|${dia}|${Math.floor(inicio / 120)}`);
  return NOMBRES.filter(() => r() < 0.55).map((nombre, i) => ({
    id: `${dia}-${i}-${nombre}`,
    nombre,
    categoria: CATEGORIAS[Math.floor(r() * CATEGORIAS.length)] ?? "6ta",
    lado: (["drive", "revés", "indistinto"] as const)[Math.floor(r() * 3)] ?? "indistinto",
    partidos: 5 + Math.floor(r() * 120),
    color: COLORES[Math.floor(r() * COLORES.length)] ?? "#1553d6",
  }));
}

export const tarifas = [
  { tipo: "Techada", valle: 24000, pico: 30000, nota: "Incluye iluminación" },
  { tipo: "Central panorámica", valle: 28000, pico: 34000, nota: "Vidrio en los cuatro lados" },
  { tipo: "Descubierta", valle: 18000, pico: 22000, nota: `Luz desde las 19 hs: +${pesos(PRECIO_LUZ_HORA)} por hora` },
];

export const resenas = [
  { nombre: "Pili R.", texto: "Reservo desde el celu en el colectivo. La grilla es clarísima: ves qué cancha está libre y listo." },
  { nombre: "Gonza T.", texto: "Las techadas son un lujo cuando llueve o hace frío. Y la central panorámica, otro nivel." },
  { nombre: "Maru S.", texto: "Me faltaba uno para el partido y lo encontré con lo de buscar compañeros. Ya jugamos todos los jueves." },
];
