import { generador } from "../shared/azar";
import { diaSemana, diferenciaDias, partes, sumarDias, type DiaISO } from "../shared/fechas";
import type { ConId } from "../shared/hooks";

// Todo es ficticio: el complejo, las personas, los precios y las reseñas.

export const complejo = {
  nombre: "Cabañas Arroyo Manso",
  direccion: "Camino al Arroyo s/n, Valle de Calamuchita",
  checkIn: "14:00",
  checkOut: "10:00",
};

export type Cabana = {
  id: string;
  nombre: string;
  bajada: string;
  capacidad: number;
  maxAdultos: number;
  dormitorios: number;
  tarifa: number;
  img: string;
  alt: string;
  destacados: string[];
};

export const cabanas: Cabana[] = [
  {
    id: "algarrobo",
    nombre: "El Algarrobo",
    bajada: "Refugio de troncos para dos, con hidromasaje y el arroyo a veinte pasos.",
    capacidad: 2,
    maxAdultos: 2,
    dormitorios: 1,
    tarifa: 78000,
    img: "/demos/reservas/cabanas/cabana-algarrobo.webp",
    alt: "Cabaña El Algarrobo: cabaña de troncos con chimenea de piedra, en un claro entre pinos altos",
    destacados: ["Hidromasaje", "Hogar a leña", "Ideal parejas"],
  },
  {
    id: "molles",
    nombre: "Los Molles",
    bajada: "Clásica de piedra y madera, con parrilla propia y vista a las lomas.",
    capacidad: 4,
    maxAdultos: 4,
    dormitorios: 2,
    tarifa: 98000,
    img: "/demos/reservas/cabanas/cabana-molles.webp",
    alt: "Cabaña Los Molles al anochecer: madera, techo a dos aguas, chimenea de piedra y ventanas encendidas",
    destacados: ["2 dormitorios", "Parrilla", "Hogar a leña"],
  },
  {
    id: "tala",
    nombre: "La Tala",
    bajada: "Galería con parrilla y patio cerrado: la elegida de las familias con mascota.",
    capacidad: 5,
    maxAdultos: 4,
    dormitorios: 2,
    tarifa: 112000,
    img: "/demos/reservas/cabanas/cabana-tala.webp",
    alt: "Cabaña La Tala: cabaña de madera con galería y muelle sobre el agua, al pie de un cerro con bosque",
    destacados: ["Acepta mascotas", "Galería", "Patio cerrado"],
  },
  {
    id: "mirador",
    nombre: "El Mirador",
    bajada: "La más alta del complejo: ventanal corrido, deck y los mejores atardeceres.",
    capacidad: 6,
    maxAdultos: 6,
    dormitorios: 3,
    tarifa: 145000,
    img: "/demos/reservas/cabanas/cabana-mirador.webp",
    alt: "Cabaña El Mirador al anochecer: techo plano, ventanales iluminados y deck frente al jardín, bajo un árbol grande",
    destacados: ["3 dormitorios", "Deck con vista", "Jacuzzi exterior"],
  },
];

export const LIMPIEZA = 25000;
export const SENA = 0.3;
export const DIAS_ANTICIPACION = 365;
export const MAX_MENORES = 4;

export function temporadaAlta(d: DiaISO): boolean {
  const p = partes(d);
  return (p.m === 12 && p.d >= 15) || p.m === 1 || p.m === 2;
}

export function minNoches(checkIn: DiaISO): number {
  return temporadaAlta(checkIn) ? 3 : 2;
}

/** Tarifa de una noche: fines de semana +15 %, temporada alta +25 %. */
export function tarifaNoche(c: Cabana, noche: DiaISO): number {
  const dow = diaSemana(noche);
  const finde = dow === 5 || dow === 6;
  const factor = (temporadaAlta(noche) ? 1.25 : 1) * (finde ? 1.15 : 1);
  return Math.round((c.tarifa * factor) / 100) * 100;
}

export function cotizar(c: Cabana, desde: DiaISO, hasta: DiaISO) {
  const noches = diferenciaDias(desde, hasta);
  const detalle = new Map<number, number>();
  let alojamiento = 0;
  for (let i = 0; i < noches; i++) {
    const t = tarifaNoche(c, sumarDias(desde, i));
    alojamiento += t;
    detalle.set(t, (detalle.get(t) ?? 0) + 1);
  }
  const total = alojamiento + LIMPIEZA;
  return {
    noches,
    alojamiento,
    detalle: [...detalle.entries()].sort((a, b) => a[0] - b[0]),
    limpieza: LIMPIEZA,
    total,
    sena: Math.round((total * SENA) / 100) * 100,
  };
}

// ---------------- Ocupación determinista ----------------

const cache = new Map<string, Set<DiaISO>>();

/** Noches ocupadas de una cabaña en la semana que empieza el lunes dado. */
function nochesSemana(c: Cabana, lunes: DiaISO): Set<DiaISO> {
  const clave = `${c.id}|${lunes}`;
  const hit = cache.get(clave);
  if (hit) return hit;
  const r = generador(`arroyo-manso|${clave}`);
  const alta = temporadaAlta(lunes);
  const set = new Set<DiaISO>();
  // Escapada de fin de semana: entra jueves o viernes, 2 o 3 noches.
  if (r() < (alta ? 0.85 : 0.5)) {
    const entrada = r() < 0.3 ? 3 : 4;
    const noches = r() < 0.5 ? 2 : 3;
    for (let i = 0; i < noches && entrada + i <= 6; i++) set.add(sumarDias(lunes, entrada + i));
  }
  // Estadía entre semana: lunes o martes, hasta el miércoles.
  if (r() < (alta ? 0.7 : 0.3)) {
    const entrada = r() < 0.6 ? 0 : 1;
    const noches = entrada === 0 && r() < 0.5 ? 3 : 2;
    for (let i = 0; i < noches; i++) set.add(sumarDias(lunes, entrada + i));
  }
  cache.set(clave, set);
  return set;
}

export type ReservaCabana = ConId & {
  codigo: string;
  cabana: string;
  desde: DiaISO;
  hasta: DiaISO;
  adultos: number;
  menores: number;
  total: number;
  sena: number;
  nombre: string;
  email: string;
  llegada: string;
};

export function nocheOcupada(c: Cabana, noche: DiaISO, propias: ReservaCabana[]): boolean {
  const lunes = sumarDias(noche, -((diaSemana(noche) + 6) % 7));
  if (nochesSemana(c, lunes).has(noche)) return true;
  return propias.some((r) => r.estado === "confirmada" && r.cabana === c.id && noche >= r.desde && noche < r.hasta);
}

export function libreEntre(c: Cabana, desde: DiaISO, hasta: DiaISO, propias: ReservaCabana[]): boolean {
  for (let d = desde; d < hasta; d = sumarDias(d, 1)) if (nocheOcupada(c, d, propias)) return false;
  return true;
}

export function entranHuespedes(c: Cabana, adultos: number, menores: number): boolean {
  return adultos <= c.maxAdultos && adultos + menores <= c.capacidad;
}

export const comodidades = [
  { t: "Desayuno serrano", d: "Pan casero, dulces de la zona y café de verdad, en tu cabaña." },
  { t: "Pileta con vista", d: "Climatizada de octubre a abril, rodeada de pinos." },
  { t: "Fogón comunitario", d: "Todas las noches de viernes y sábado, con guitarra si se arma." },
  { t: "Wifi y señal", d: "Para trabajar si hace falta. Para desconectar, el arroyo." },
  { t: "Estacionamiento", d: "Techado, al lado de cada cabaña." },
  { t: "Mascotas", d: "Bienvenidas en La Tala, con patio cerrado." },
];

export const actividades = [
  { img: "/demos/reservas/cabanas/actividad-cerro.webp", t: "Subida al Cerro de la Cruz", d: "Trekking de 2 horas con vista a todo el valle.", dist: "4 km", alt: "Ilustración de un cerro con un sendero serpenteante y una cruz en la cumbre" },
  { img: "/demos/reservas/cabanas/actividad-rio.webp", t: "Balneario La Olla", d: "Pozones de agua cristalina y playa de arena.", dist: "2 km", alt: "Ilustración de un río de montaña con piedras y una sombrilla en la orilla" },
  { img: "/demos/reservas/cabanas/actividad-pueblo.webp", t: "Capilla y feria del pueblo", d: "Artesanos, dulces caseros y la capilla de 1840.", dist: "6 km", alt: "Ilustración de una capilla blanca con campanario entre algarrobos" },
  { img: "/demos/reservas/cabanas/actividad-estrellas.webp", t: "Noche de estrellas", d: "Sin luces de ciudad: la Vía Láctea se ve a simple vista.", dist: "Acá mismo", alt: "Ilustración del cielo nocturno con la Vía Láctea sobre las sierras" },
];

export const resenas = [
  { nombre: "Laura y Pablo", origen: "Rosario", texto: "Nos quedamos en El Algarrobo por nuestro aniversario. El ruido del arroyo de noche no tiene precio.", cabana: "El Algarrobo" },
  { nombre: "Familia Ortiz", origen: "Buenos Aires", texto: "Los chicos no salieron de la pileta y el perro fue feliz en el patio de La Tala. Volvemos seguro.", cabana: "La Tala" },
  { nombre: "Grupo de amigas", origen: "Córdoba", texto: "El atardecer desde el deck de El Mirador vale el viaje. Y el desayuno serrano, ni hablar.", cabana: "El Mirador" },
];

export const galeria = [
  { img: "/demos/reservas/cabanas/interior-living.webp", alt: "Living luminoso con sillón gris, silla de madera, biblioteca, plantas colgantes y ventana", t: "Living" },
  { img: "/demos/reservas/cabanas/galeria-arroyo.webp", alt: "Ilustración del arroyo entre piedras y árboles nativos", t: "El arroyo" },
  { img: "/demos/reservas/cabanas/interior-dormitorio.webp", alt: "Ilustración de un dormitorio con respaldo de madera, acolchado verde y ventana al monte", t: "Dormitorios" },
  { img: "/demos/reservas/cabanas/galeria-pileta.webp", alt: "Ilustración de la pileta rodeada de pinos con una reposera y sombrilla", t: "Pileta" },
  { img: "/demos/reservas/cabanas/galeria-fogon.webp", alt: "Ilustración del fogón encendido bajo un cielo estrellado", t: "Fogón" },
  { img: "/demos/reservas/cabanas/galeria-amanecer.webp", alt: "Ilustración de un amanecer con niebla entre las sierras", t: "Amanecer" },
];
