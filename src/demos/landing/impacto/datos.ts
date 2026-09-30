// Contenido ficticio de la demo "Impacto" (Fuerza Norte, box de entrenamiento en Córdoba).

export type DisciplinaId = "funcional" | "halterofilia" | "hiit" | "movilidad";
export type CoachId = "martina" | "joaquin" | "lucia" | "ramiro";

export const IMG = "/demos/landing/impacto";

export const disciplinas: {
  id: DisciplinaId;
  nombre: string;
  bajada: string;
  intensidad: 1 | 2 | 3 | 4 | 5;
  imagen: string;
  alt: string;
  color: string;
  /** Color del número sobre la ilustración. */
  tinta: string;
}[] = [
  {
    id: "funcional",
    nombre: "Funcional",
    bajada: "Fuerza, potencia y resistencia en circuitos que cambian todos los días. La base de todo.",
    intensidad: 4,
    imagen: `${IMG}/disciplina-funcional.webp`,
    alt: "Ilustración de una persona haciendo swing con pesa rusa sobre fondo naranja",
    color: "#FF4D00",
    tinta: "#0A0A0A",
  },
  {
    id: "halterofilia",
    nombre: "Halterofilia",
    bajada: "Arranque y envión con técnica de verdad. Grupos chicos y corrección en cada repetición.",
    intensidad: 3,
    imagen: `${IMG}/disciplina-halterofilia.webp`,
    alt: "Ilustración de una persona levantando una barra olímpica por encima de la cabeza",
    color: "#F2EEE6",
    tinta: "#0A0A0A",
  },
  {
    id: "hiit",
    nombre: "HIIT",
    bajada: "Intervalos cortos, pulsaciones arriba y 40 minutos que se pasan volando. Salís nuevo.",
    intensidad: 5,
    imagen: `${IMG}/disciplina-hiit.webp`,
    alt: "Ilustración naranja de una persona saltando con brazos y piernas abiertos sobre fondo negro",
    color: "#D7FF3A",
    tinta: "#F2EEE6",
  },
  {
    id: "movilidad",
    nombre: "Movilidad",
    bajada: "Rango de movimiento, respiración y control. El complemento que tus rodillas te agradecen.",
    intensidad: 2,
    imagen: `${IMG}/disciplina-movilidad.webp`,
    alt: "Ilustración de una persona en estocada con los brazos abiertos sobre fondo verde lima",
    color: "#7DD3FC",
    tinta: "#0A0A0A",
  },
];

export const disciplinaPorId = Object.fromEntries(disciplinas.map((d) => [d.id, d])) as Record<
  DisciplinaId,
  (typeof disciplinas)[number]
>;

export const coaches: {
  id: CoachId;
  nombre: string;
  rol: string;
  certificaciones: string[];
  frase: string;
  imagen: string;
  alt: string;
}[] = [
  {
    id: "martina",
    nombre: "Martina Sosa",
    rol: "Head coach · Funcional",
    certificaciones: ["Lic. en Educación Física", "Nivel 2 en entrenamiento funcional"],
    frase: "Si hoy te cuesta, es porque la semana que viene te va a salir.",
    imagen: `${IMG}/coach-martina.webp`,
    alt: "Retrato ilustrado de Martina, coach con cola de caballo y buzo negro, sobre fondo naranja",
  },
  {
    id: "joaquin",
    nombre: "Joaquín Ledesma",
    rol: "Coach · Halterofilia",
    certificaciones: ["Ex atleta de levantamiento", "Juez nacional"],
    frase: "La técnica primero. El peso llega solo.",
    imagen: `${IMG}/coach-joaquin.webp`,
    alt: "Retrato ilustrado de Joaquín, coach con barba y buzo negro, sobre fondo claro",
  },
  {
    id: "lucia",
    nombre: "Lucía Benítez",
    rol: "Coach · HIIT y movilidad",
    certificaciones: ["Kinesióloga", "Especialista en movilidad articular"],
    frase: "Moverte bien es lo que te deja entrenar muchos años.",
    imagen: `${IMG}/coach-lucia.webp`,
    alt: "Retrato ilustrado de Lucía, coach con rodete y buzo naranja, sobre fondo oscuro",
  },
  {
    id: "ramiro",
    nombre: "Ramiro Quiroga",
    rol: "Coach · Funcional y HIIT",
    certificaciones: ["Prof. de Educación Física", "Preparador físico de rugby"],
    frase: "Nadie entrena solo acá. Ni el que llega último.",
    imagen: `${IMG}/coach-ramiro.webp`,
    alt: "Retrato ilustrado de Ramiro, coach de pelo corto y buzo negro, sobre fondo verde lima",
  },
];

export const coachPorId = Object.fromEntries(coaches.map((c) => [c.id, c])) as Record<CoachId, (typeof coaches)[number]>;

export const dias = [
  { id: "lun", corto: "Lun", largo: "Lunes" },
  { id: "mar", corto: "Mar", largo: "Martes" },
  { id: "mie", corto: "Mié", largo: "Miércoles" },
  { id: "jue", corto: "Jue", largo: "Jueves" },
  { id: "vie", corto: "Vie", largo: "Viernes" },
  { id: "sab", corto: "Sáb", largo: "Sábado" },
] as const;
export type DiaId = (typeof dias)[number]["id"];
export const diaPorId = Object.fromEntries(dias.map((d) => [d.id, d])) as Record<DiaId, (typeof dias)[number]>;

export const horas = ["07:00", "08:30", "12:30", "18:00", "19:00", "20:00", "21:00"] as const;
export type Hora = (typeof horas)[number];

export type Clase = {
  id: string;
  dia: DiaId;
  hora: Hora;
  disciplina: DisciplinaId;
  coach: CoachId;
  /** Lugares libres de 12. 0 = completa. */
  libres: number;
};

// Grilla semanal: [hora, disciplina, coach, lugares libres]
const grilla: Record<DiaId, [Hora, DisciplinaId, CoachId, number][]> = {
  lun: [
    ["07:00", "funcional", "ramiro", 4],
    ["08:30", "movilidad", "lucia", 7],
    ["12:30", "hiit", "martina", 2],
    ["18:00", "funcional", "martina", 0],
    ["19:00", "halterofilia", "joaquin", 3],
    ["20:00", "funcional", "ramiro", 5],
    ["21:00", "hiit", "ramiro", 8],
  ],
  mar: [
    ["07:00", "hiit", "lucia", 6],
    ["08:30", "funcional", "martina", 3],
    ["12:30", "funcional", "ramiro", 5],
    ["18:00", "halterofilia", "joaquin", 1],
    ["19:00", "funcional", "martina", 0],
    ["20:00", "movilidad", "lucia", 9],
    ["21:00", "funcional", "ramiro", 6],
  ],
  mie: [
    ["07:00", "funcional", "ramiro", 5],
    ["08:30", "halterofilia", "joaquin", 6],
    ["12:30", "hiit", "martina", 4],
    ["18:00", "funcional", "martina", 2],
    ["19:00", "hiit", "lucia", 0],
    ["20:00", "halterofilia", "joaquin", 4],
    ["21:00", "movilidad", "lucia", 10],
  ],
  jue: [
    ["07:00", "hiit", "lucia", 7],
    ["08:30", "funcional", "martina", 2],
    ["12:30", "movilidad", "lucia", 8],
    ["18:00", "funcional", "ramiro", 3],
    ["19:00", "halterofilia", "joaquin", 2],
    ["20:00", "funcional", "martina", 0],
    ["21:00", "hiit", "ramiro", 6],
  ],
  vie: [
    ["07:00", "funcional", "ramiro", 6],
    ["08:30", "movilidad", "lucia", 9],
    ["12:30", "funcional", "martina", 5],
    ["18:00", "hiit", "martina", 1],
    ["19:00", "funcional", "ramiro", 4],
    ["20:00", "halterofilia", "joaquin", 7],
  ],
  sab: [
    ["08:30", "funcional", "martina", 3],
    ["12:30", "halterofilia", "joaquin", 8],
  ],
};

export const clases: Clase[] = dias.flatMap(({ id: dia }) =>
  grilla[dia].map(([hora, disciplina, coach, libres]) => ({
    id: `${dia}-${hora.replace(":", "")}`,
    dia,
    hora,
    disciplina,
    coach,
    libres,
  })),
);

export const clasePorId = Object.fromEntries(clases.map((c) => [c.id, c])) as Record<string, Clase>;

export const planes = [
  {
    nombre: "Arranque",
    frecuencia: "2 veces por semana",
    precio: 32000,
    destacado: false,
    incluye: ["Cualquier disciplina", "Evaluación física inicial", "App con tus marcas", "Reserva desde 48 h antes"],
  },
  {
    nombre: "Constante",
    frecuencia: "3 veces por semana",
    precio: 41000,
    destacado: true,
    incluye: [
      "Todo lo de Arranque",
      "Plan de progresión por ciclo",
      "Reevaluación cada 8 semanas",
      "1 invitado gratis por mes",
    ],
  },
  {
    nombre: "Sin techo",
    frecuencia: "Pase libre",
    precio: 52000,
    destacado: false,
    incluye: ["Clases ilimitadas", "Open box de lunes a sábado", "Seguimiento nutricional básico", "Remera de Fuerza Norte"],
  },
] as const;

export const testimonios = [
  {
    texto:
      "Llegué sin poder hacer una dominada y con miedo a lastimarme. A los cinco meses hice la primera, con todo el box gritando. No cambio esto por nada.",
    nombre: "Florencia R.",
    dato: "Socia desde 2023",
    marca: "1ª dominada",
  },
  {
    texto:
      "Probé mil gimnasios y en todos abandonaba en marzo. Acá el grupo te espera, el coach sabe tu nombre y si faltás te escriben. Bajé 9 kilos.",
    nombre: "Diego M.",
    dato: "Socio desde 2024",
    marca: "−9 kg",
  },
  {
    texto: "Tengo 52 años y levanto más que a los 30. Joaquín me enseñó a mover la barra sin romperme la espalda.",
    nombre: "Silvia G.",
    dato: "Halterofilia, 3x semana",
    marca: "60 kg de envión",
  },
] as const;

export const faqs = [
  {
    p: "Nunca entrené, ¿puedo arrancar igual?",
    r: "Sí, la mayoría de nuestros socios empezó de cero. Cada ejercicio tiene una versión adaptada y el coach ajusta cargas y repeticiones para vos. En la clase de prueba hacemos una evaluación corta para saber desde dónde partís.",
  },
  {
    p: "¿Qué tengo que llevar a la clase de prueba?",
    r: "Ropa cómoda, zapatillas con suela plana, una toalla chica y una botella de agua. Si tenés, traé el apto físico; si no, podés completarlo dentro del primer mes.",
  },
  {
    p: "¿Cuántas personas hay por clase?",
    r: "Máximo 12 por turno, con un coach siempre presente. En halterofilia el cupo baja a 8 para poder corregir la técnica de cada uno.",
  },
  {
    p: "¿Puedo cambiar de horario si no llego?",
    r: "Sí. Reservás y cancelás desde la app hasta 2 horas antes. Si cancelás a tiempo, la clase no se descuenta.",
  },
  {
    p: "¿Hay matrícula o permanencia mínima?",
    r: "No cobramos matrícula y no hay permanencia: pagás mes a mes. Si pagás tres meses juntos, tenés un 10 % de descuento.",
  },
] as const;

export { precioARS } from "../shared/formato";
