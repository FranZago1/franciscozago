import { generador } from "../shared/azar";
import { diaSemana, type Ahora, type DiaISO } from "../shared/fechas";
import type { ConId } from "../shared/hooks";

// Todo es ficticio: la barbería, las personas, los precios y las reseñas.

export const negocio = {
  nombre: "Barbería Don Filo",
  direccion: "Pasaje Los Plátanos 245, Nueva Córdoba",
  ciudad: "Córdoba",
  desde: 1987,
};

export type GrupoServicio = "corte" | "barba" | "extra";

export type Servicio = {
  id: string;
  nombre: string;
  detalle: string;
  minutos: number;
  precio: number;
  grupo: GrupoServicio;
};

export const servicios: Servicio[] = [
  { id: "corte", nombre: "Corte clásico", detalle: "Tijera y máquina, lavado y peinado con pomada.", minutos: 40, precio: 14000, grupo: "corte" },
  { id: "fade", nombre: "Corte fade", detalle: "Degradado a navaja o máquina, terminación prolija.", minutos: 45, precio: 16000, grupo: "corte" },
  { id: "infantil", nombre: "Corte infantil", detalle: "Hasta 12 años. Con paciencia y sin apuro.", minutos: 30, precio: 10000, grupo: "corte" },
  { id: "barba", nombre: "Perfilado de barba", detalle: "Diseño, rebaje y toalla caliente.", minutos: 30, precio: 9000, grupo: "barba" },
  { id: "navaja", nombre: "Afeitado a navaja", detalle: "El ritual completo: vapor, espuma, navaja y bálsamo.", minutos: 40, precio: 12000, grupo: "barba" },
  { id: "canas", nombre: "Camuflaje de canas", detalle: "Tono natural, se va perdiendo de a poco.", minutos: 30, precio: 11000, grupo: "extra" },
  { id: "cejas", nombre: "Perfilado de cejas", detalle: "Con navaja o hilo, rápido y sutil.", minutos: 15, precio: 4500, grupo: "extra" },
];

export const grupos: { id: GrupoServicio; titulo: string; nota: string }[] = [
  { id: "corte", titulo: "Cortes", nota: "Elegí uno" },
  { id: "barba", titulo: "Barba", nota: "Elegí uno" },
  { id: "extra", titulo: "Extras", nota: "Sumalos si querés" },
];

/** Corte + barba o navaja en el mismo turno: 10 % de descuento. */
export const DESCUENTO_COMBO = 0.1;

export type Barbero = {
  id: string;
  nombre: string;
  rol: string;
  bio: string;
  img: string;
  alt: string;
  /** Días que trabaja (0 = domingo). */
  dias: number[];
  desde: number;
  hasta: number;
  /** Pausa del mediodía. */
  pausa: [number, number];
  servicios: string[];
};

export const barberos: Barbero[] = [
  {
    id: "filo",
    nombre: "Filo",
    rol: "Fundador · navaja y clásicos",
    bio: "Abrió la barbería en el 87 y sigue afeitando como le enseñó su viejo.",
    img: "/demos/reservas/barberia/barbero-filo.webp",
    alt: "Ilustración de Filo: pelo y barba canosos, anteojos y delantal de cuero",
    dias: [2, 3, 4, 5, 6],
    desde: 10 * 60,
    hasta: 17 * 60,
    pausa: [13 * 60, 14 * 60],
    servicios: ["corte", "infantil", "barba", "navaja", "canas", "cejas"],
  },
  {
    id: "tano",
    nombre: "Tano",
    rol: "Fades y pompadour",
    bio: "Degradados impecables y peinados con volumen. Pulso de cirujano.",
    img: "/demos/reservas/barberia/barbero-tano.webp",
    alt: "Ilustración de Tano: jopo peinado hacia atrás y bigote",
    dias: [2, 3, 4, 5, 6],
    desde: 12 * 60,
    hasta: 20 * 60,
    pausa: [16 * 60, 16 * 60 + 30],
    servicios: ["corte", "fade", "infantil", "barba", "navaja", "cejas"],
  },
  {
    id: "rulo",
    nombre: "Rulo",
    rol: "Texturas y rulos",
    bio: "Especialista en pelo con rulos y cortes texturizados. Nada de planchar.",
    img: "/demos/reservas/barberia/barbero-rulo.webp",
    alt: "Ilustración de Rulo: pelo con rulos y barba candado",
    dias: [3, 4, 5, 6],
    desde: 10 * 60,
    hasta: 20 * 60,
    pausa: [14 * 60, 15 * 60],
    servicios: ["corte", "fade", "infantil", "barba", "canas", "cejas"],
  },
  {
    id: "mica",
    nombre: "Mica",
    rol: "Color y diseño de barba",
    bio: "Camuflaje de canas que no se nota y barbas con líneas perfectas.",
    img: "/demos/reservas/barberia/barbera-mica.webp",
    alt: "Ilustración de Mica: pelo colorado recogido y delantal bordó",
    dias: [2, 3, 4, 5],
    desde: 10 * 60,
    hasta: 19 * 60,
    pausa: [13 * 60 + 30, 14 * 60 + 15],
    servicios: ["corte", "fade", "barba", "canas", "cejas"],
  },
];

/** Horario del local por día de la semana (0 = domingo). */
export const horarioLocal: Record<number, [number, number] | null> = {
  0: null,
  1: null,
  2: [10 * 60, 20 * 60],
  3: [10 * 60, 20 * 60],
  4: [10 * 60, 20 * 60],
  5: [10 * 60, 20 * 60],
  6: [9 * 60, 18 * 60],
};

export const DIAS_ANTICIPACION = 21;
export const PASO = 15;
/** Margen mínimo para reservar un turno de hoy. */
export const MARGEN_HOY = 30;

export type Tramo = [number, number];

export type ReservaBarberia = ConId & {
  codigo: string;
  dia: DiaISO;
  inicio: number;
  fin: number;
  servicios: string[];
  barbero: string;
  asignado: boolean;
  total: number;
  nombre: string;
  telefono: string;
};

export function servicioPorId(id: string): Servicio | undefined {
  return servicios.find((s) => s.id === id);
}

export function barberoPorId(id: string): Barbero | undefined {
  return barberos.find((b) => b.id === id);
}

export function totales(ids: string[]) {
  const lista = ids.map(servicioPorId).filter((s): s is Servicio => Boolean(s));
  const minutos = lista.reduce((a, s) => a + s.minutos, 0);
  const bruto = lista.reduce((a, s) => a + s.precio, 0);
  const combo = lista.some((s) => s.grupo === "corte") && lista.some((s) => s.grupo === "barba");
  const descuento = combo ? Math.round((bruto * DESCUENTO_COMBO) / 100) * 100 : 0;
  return { lista, minutos, bruto, descuento, total: bruto - descuento, combo };
}

/** Jornada efectiva de un barbero en un día (o null si no trabaja). */
export function jornada(b: Barbero, dia: DiaISO): Tramo | null {
  const dow = diaSemana(dia);
  const local = horarioLocal[dow];
  if (!local || !b.dias.includes(dow)) return null;
  const desde = Math.max(local[0], b.desde);
  const hasta = Math.min(local[1], b.hasta);
  return hasta > desde ? [desde, hasta] : null;
}

/** Turnos ya tomados por otros clientes: deterministas para cada barbero y fecha. */
export function turnosTomados(b: Barbero, dia: DiaISO): Tramo[] {
  const j = jornada(b, dia);
  if (!j) return [];
  const r = generador(`don-filo|${b.id}|${dia}`);
  const dow = diaSemana(dia);
  const base = dow === 6 ? 0.5 : dow === 5 ? 0.4 : dow === 4 ? 0.32 : 0.26;
  const tomados: Tramo[] = [b.pausa];
  let t = j[0];
  while (t < j[1]) {
    if (t >= b.pausa[0] && t < b.pausa[1]) {
      t = b.pausa[1];
      continue;
    }
    // Las tardes se llenan más que las mañanas.
    const p = base + (t >= 17 * 60 ? 0.1 : 0);
    if (r() < p) {
      const dur = [30, 40, 45, 45, 60][Math.floor(r() * 5)] ?? 45;
      tomados.push([t, t + dur]);
      t += dur;
    } else {
      t += PASO * (1 + Math.floor(r() * 3));
    }
  }
  return tomados;
}

function seSuperpone(a: Tramo, lista: Tramo[]) {
  return lista.some(([i, f]) => a[0] < f && i < a[1]);
}

/** Horarios de inicio libres para un barbero, una fecha y una duración. */
export function horariosLibres(b: Barbero, dia: DiaISO, minutos: number, ahora: Ahora, propias: ReservaBarberia[]): number[] {
  const j = jornada(b, dia);
  if (!j || minutos <= 0) return [];
  const ocupados = [
    ...turnosTomados(b, dia),
    ...propias.filter((r) => r.estado === "confirmada" && r.dia === dia && r.barbero === b.id).map((r): Tramo => [r.inicio, r.fin]),
  ];
  const libres: number[] = [];
  const minimo = dia === ahora.dia ? ahora.minutos + MARGEN_HOY : -1;
  for (let t = j[0]; t + minutos <= j[1]; t += PASO) {
    if (t < minimo) continue;
    if (!seSuperpone([t, t + minutos], ocupados)) libres.push(t);
  }
  return libres;
}

export function puedeHacer(b: Barbero, ids: string[]): boolean {
  return ids.every((id) => b.servicios.includes(id));
}

/**
 * Disponibilidad de un día: para cada horario, qué barberos lo tienen libre.
 * Con "cualquiera", se asigna el que tenga menos turnos ese día.
 */
export function disponibilidadDia(
  dia: DiaISO,
  ids: string[],
  barberoId: string,
  ahora: Ahora,
  propias: ReservaBarberia[],
): Map<number, string[]> {
  const { minutos } = totales(ids);
  const candidatos = barberos.filter((b) => (barberoId === "cualquiera" || b.id === barberoId) && puedeHacer(b, ids));
  const carga = new Map(candidatos.map((b) => [b.id, turnosTomados(b, dia).length]));
  const mapa = new Map<number, string[]>();
  for (const b of candidatos) {
    for (const t of horariosLibres(b, dia, minutos, ahora, propias)) {
      mapa.set(t, [...(mapa.get(t) ?? []), b.id]);
    }
  }
  for (const [t, lista] of mapa) mapa.set(t, lista.sort((a, z) => (carga.get(a) ?? 0) - (carga.get(z) ?? 0)));
  return new Map([...mapa.entries()].sort((a, z) => a[0] - z[0]));
}

export const resenas = [
  {
    nombre: "Martín R.",
    texto: "Fui por un corte y salí con el mejor afeitado de mi vida. Filo es un artista con la navaja.",
    detalle: "Afeitado a navaja",
  },
  {
    nombre: "Joaquín P.",
    texto: "Reservé desde el celular en un minuto, llegué y me estaban esperando. Cero demora.",
    detalle: "Corte fade con Tano",
  },
  {
    nombre: "Lucas D.",
    texto: "Por fin alguien que entiende el pelo con rulos. Rulo no te lo plancha, te lo ordena.",
    detalle: "Corte texturizado",
  },
  {
    nombre: "Ezequiel M.",
    texto: "El camuflaje de canas quedó tan natural que nadie se dio cuenta. Mica sabe.",
    detalle: "Camuflaje de canas",
  },
];

export const trabajos = [
  { img: "/demos/reservas/barberia/corte-fade.webp", nombre: "Mid fade con candado", alt: "Ilustración de un corte mid fade con barba candado" },
  { img: "/demos/reservas/barberia/corte-pompadour.webp", nombre: "Pompadour clásico", alt: "Ilustración de un pompadour peinado hacia atrás" },
  { img: "/demos/reservas/barberia/barba-larga.webp", nombre: "Barba larga esculpida", alt: "Ilustración de una barba larga prolija con rapado al costado" },
  { img: "/demos/reservas/barberia/corte-texturizado.webp", nombre: "Texturizado con bigote", alt: "Ilustración de un corte texturizado con bigote" },
  { img: "/demos/reservas/barberia/corte-clasico.webp", nombre: "Clásico con raya", alt: "Ilustración de un corte clásico con raya al costado" },
  { img: "/demos/reservas/barberia/corte-rapado.webp", nombre: "Rapado y barba completa", alt: "Ilustración de un rapado con barba completa" },
];

export const DIAS_TEXTO = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function diasTexto(dias: number[]): string {
  const ordenados = [...dias].sort((a, z) => a - z);
  const primero = ordenados[0];
  const ultimo = ordenados[ordenados.length - 1];
  if (primero === undefined || ultimo === undefined) return "";
  const corrido = ordenados.every((d, i) => d === primero + i);
  return corrido ? `${DIAS_TEXTO[primero]} a ${DIAS_TEXTO[ultimo]}` : ordenados.map((d) => DIAS_TEXTO[d]).join(", ");
}
