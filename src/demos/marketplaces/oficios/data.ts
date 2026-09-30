// ManoAmiga — contenido 100 % ficticio: profesionales, matrículas, reseñas y precios.

export type OficioId = "plomeria" | "electricidad" | "gas" | "pintura" | "carpinteria" | "aire";
export type Disponibilidad = "hoy" | "manana" | "semana" | "proxima";
export type Franja = "manana" | "tarde" | "noche";

export type Oficio = { id: OficioId; nombre: string; persona: string; icono: "drop" | "bolt" | "flame" | "roller" | "saw" | "snow"; color: string };

export type Resena = { autor: string; barrio: string; texto: string; rating: number; hace: string; trabajo: string };

export type Profesional = {
  id: string;
  nombre: string;
  oficio: OficioId;
  imagen: string;
  rating: number;
  resenas: number;
  trabajos: number;
  anios: number;
  matricula: string;
  respuestaMin: number;
  disp: Disponibilidad;
  urgencias: boolean;
  barrios: string[];
  visita: number;
  bio: string;
  servicios: { nombre: string; desde: number }[];
  /** Disponibilidad de los próximos 7 días: [mañana, tarde, noche]. */
  agenda: [boolean, boolean, boolean][];
  resenasLista: Resena[];
  fotos: string[];
};

const img = (n: string) => `/demos/marketplaces/oficios/${n}.webp`;

export const oficios: Oficio[] = [
  { id: "plomeria", nombre: "Plomería", persona: "Plomero/a", icono: "drop", color: "#2156A8" },
  { id: "electricidad", nombre: "Electricidad", persona: "Electricista", icono: "bolt", color: "#E0A100" },
  { id: "gas", nombre: "Gas", persona: "Gasista", icono: "flame", color: "#D8412F" },
  { id: "pintura", nombre: "Pintura", persona: "Pintor/a", icono: "roller", color: "#6B4FD8" },
  { id: "carpinteria", nombre: "Carpintería", persona: "Carpintero/a", icono: "saw", color: "#A0612E" },
  { id: "aire", nombre: "Aire acondicionado", persona: "Técnico/a de aire", icono: "snow", color: "#0E8C96" },
];

export const oficioPorId = Object.fromEntries(oficios.map((o) => [o.id, o])) as Record<OficioId, Oficio>;

export const barrios = [
  "Nueva Córdoba",
  "Güemes",
  "General Paz",
  "Alta Córdoba",
  "Cerro de las Rosas",
  "Villa Belgrano",
  "Alberdi",
  "Argüello",
  "Jardín",
  "San Vicente",
];

export const fotosTrabajo: Record<OficioId, { src: string; alt: string }> = {
  plomeria: { src: img("trabajo-canilla"), alt: "Ilustración de una bacha con la canilla goteando y una llave de caño al lado" },
  electricidad: { src: img("trabajo-tablero"), alt: "Ilustración de un tablero eléctrico abierto con térmicas y cables de colores" },
  gas: { src: img("trabajo-calefon"), alt: "Ilustración de un calefón blanco con la llama encendida y caños de gas amarillos" },
  pintura: { src: img("trabajo-humedad"), alt: "Ilustración de una pared con mancha de humedad junto a un rodillo y una bandeja de pintura" },
  carpinteria: { src: img("trabajo-placard"), alt: "Ilustración de un placard de madera con una puerta descolgada y un taladro" },
  aire: { src: img("trabajo-split"), alt: "Ilustración de un aire acondicionado split tirando aire frío y su control remoto" },
};

const A = (m: boolean, t: boolean, n: boolean): [boolean, boolean, boolean] => [m, t, n];

export const profesionales: Profesional[] = [
  {
    id: "martin-oviedo",
    nombre: "Martín Oviedo",
    oficio: "plomeria",
    imagen: img("pro-martin-oviedo"),
    rating: 4.9,
    resenas: 212,
    trabajos: 480,
    anios: 14,
    matricula: "MP 4471",
    respuestaMin: 12,
    disp: "hoy",
    urgencias: true,
    barrios: ["Nueva Córdoba", "Güemes", "Alberdi", "Jardín"],
    visita: 8000,
    bio: "Plomero de tercera generación. Trabajo con cámara de inspección para encontrar pérdidas sin romper de más, y te dejo todo limpio. Si es una urgencia, voy en el día.",
    servicios: [
      { nombre: "Reparación de pérdidas", desde: 18000 },
      { nombre: "Destapación de cañerías", desde: 22000 },
      { nombre: "Cambio de grifería", desde: 15000 },
      { nombre: "Instalación de termotanque", desde: 45000 },
    ],
    agenda: [A(false, true, true), A(true, true, false), A(true, false, false), A(true, true, true), A(false, true, false), A(true, false, false), A(false, false, false)],
    resenasLista: [
      { autor: "Florencia R.", barrio: "Güemes", texto: "Vino a la hora que dijo, encontró la pérdida en diez minutos y me explicó todo. Cobró lo que presupuestó.", rating: 5, hace: "hace 3 días", trabajo: "Pérdida en el baño" },
      { autor: "Andrés P.", barrio: "Nueva Córdoba", texto: "Se me inundó la cocina un domingo y Martín respondió enseguida. Un genio.", rating: 5, hace: "hace 2 semanas", trabajo: "Urgencia" },
      { autor: "Mariana L.", barrio: "Jardín", texto: "Muy prolijo. Tardó un poco más de lo previsto pero avisó con tiempo.", rating: 4, hace: "hace 1 mes", trabajo: "Cambio de grifería" },
    ],
    fotos: [img("trabajo-canilla")],
  },
  {
    id: "carla-benitez",
    nombre: "Carla Benítez",
    oficio: "plomeria",
    imagen: img("pro-carla-benitez"),
    rating: 4.8,
    resenas: 136,
    trabajos: 290,
    anios: 9,
    matricula: "MP 5093",
    respuestaMin: 25,
    disp: "manana",
    urgencias: false,
    barrios: ["Cerro de las Rosas", "Villa Belgrano", "Argüello"],
    visita: 7500,
    bio: "Me especializo en baños y cocinas: desde cambiar un flexible hasta rehacer toda la instalación. Presupuesto detallado por escrito antes de empezar.",
    servicios: [
      { nombre: "Instalación de baño completo", desde: 180000 },
      { nombre: "Cambio de flexibles y llaves", desde: 12000 },
      { nombre: "Colocación de mochila o depósito", desde: 25000 },
    ],
    agenda: [A(false, false, false), A(true, true, false), A(true, true, false), A(false, true, false), A(true, false, false), A(true, true, false), A(false, false, false)],
    resenasLista: [
      { autor: "Sergio M.", barrio: "Villa Belgrano", texto: "Nos rehízo el baño entero. Súper ordenada y cumplió con los tiempos.", rating: 5, hace: "hace 1 semana", trabajo: "Baño completo" },
      { autor: "Laura G.", barrio: "Argüello", texto: "Excelente atención y muy clara con el presupuesto.", rating: 5, hace: "hace 3 semanas", trabajo: "Cambio de llaves" },
    ],
    fotos: [img("trabajo-canilla")],
  },
  {
    id: "diego-ferreyra",
    nombre: "Diego Ferreyra",
    oficio: "electricidad",
    imagen: img("pro-diego-ferreyra"),
    rating: 4.9,
    resenas: 301,
    trabajos: 720,
    anios: 18,
    matricula: "ME 2210",
    respuestaMin: 8,
    disp: "hoy",
    urgencias: true,
    barrios: ["General Paz", "Alta Córdoba", "San Vicente", "Nueva Córdoba"],
    visita: 9000,
    bio: "Electricista matriculado. Tableros, disyuntores, puesta a tierra y cableado nuevo. Te entrego el certificado de la instalación cuando corresponde.",
    servicios: [
      { nombre: "Cambio de tablero y térmicas", desde: 55000 },
      { nombre: "Colocación de disyuntor", desde: 38000 },
      { nombre: "Agregar tomas o bocas de luz", desde: 14000 },
      { nombre: "Puesta a tierra", desde: 60000 },
    ],
    agenda: [A(true, true, false), A(true, true, true), A(false, true, false), A(true, true, false), A(true, false, false), A(true, false, false), A(false, false, false)],
    resenasLista: [
      { autor: "Julieta S.", barrio: "General Paz", texto: "Me saltaba la térmica todo el tiempo. Diego encontró el problema y me cambió el tablero en una mañana.", rating: 5, hace: "hace 5 días", trabajo: "Tablero" },
      { autor: "Pablo C.", barrio: "Alta Córdoba", texto: "Rápido, puntual y con precio justo.", rating: 5, hace: "hace 1 mes", trabajo: "Tomas nuevas" },
    ],
    fotos: [img("trabajo-tablero")],
  },
  {
    id: "lucia-rinaldi",
    nombre: "Lucía Rinaldi",
    oficio: "electricidad",
    imagen: img("pro-lucia-rinaldi"),
    rating: 5,
    resenas: 88,
    trabajos: 160,
    anios: 7,
    matricula: "ME 3187",
    respuestaMin: 20,
    disp: "semana",
    urgencias: false,
    barrios: ["Jardín", "Nueva Córdoba", "Güemes"],
    visita: 8500,
    bio: "Técnica electricista. Hago instalaciones nuevas, iluminación LED y domótica simple (luces y persianas desde el celular).",
    servicios: [
      { nombre: "Iluminación LED", desde: 20000 },
      { nombre: "Instalación en obra nueva", desde: 250000 },
      { nombre: "Domótica básica", desde: 70000 },
    ],
    agenda: [A(false, false, false), A(false, false, false), A(true, true, false), A(true, false, false), A(true, true, false), A(false, true, false), A(false, false, false)],
    resenasLista: [
      { autor: "Martina D.", barrio: "Nueva Córdoba", texto: "Nos iluminó todo el departamento con LED y quedó hermoso. Muy detallista.", rating: 5, hace: "hace 2 semanas", trabajo: "Iluminación" },
      { autor: "Ramiro T.", barrio: "Jardín", texto: "Impecable. La recomiendo.", rating: 5, hace: "hace 2 meses", trabajo: "Instalación nueva" },
    ],
    fotos: [img("trabajo-tablero")],
  },
  {
    id: "raul-quinteros",
    nombre: "Raúl Quinteros",
    oficio: "gas",
    imagen: img("pro-raul-quinteros"),
    rating: 4.8,
    resenas: 174,
    trabajos: 610,
    anios: 22,
    matricula: "MG 3920",
    respuestaMin: 30,
    disp: "manana",
    urgencias: true,
    barrios: ["General Paz", "Alta Córdoba", "Jardín", "San Vicente"],
    visita: 11000,
    bio: "Gasista matriculado de primera categoría. Pruebas de hermeticidad, conexiones de artefactos y planos para habilitación.",
    servicios: [
      { nombre: "Revisión y prueba de hermeticidad", desde: 35000 },
      { nombre: "Conexión de cocina o calefón", desde: 28000 },
      { nombre: "Service de calefón", desde: 22000 },
    ],
    agenda: [A(false, false, false), A(true, true, false), A(true, false, false), A(true, true, false), A(false, true, false), A(true, false, false), A(false, false, false)],
    resenasLista: [
      { autor: "Silvia B.", barrio: "San Vicente", texto: "El calefón no encendía y Raúl lo dejó andando en el día. Explica todo con paciencia.", rating: 5, hace: "hace 1 semana", trabajo: "Service de calefón" },
      { autor: "Hernán F.", barrio: "Jardín", texto: "Muy profesional con la prueba de hermeticidad.", rating: 4, hace: "hace 1 mes", trabajo: "Hermeticidad" },
    ],
    fotos: [img("trabajo-calefon")],
  },
  {
    id: "sofia-carranza",
    nombre: "Sofía Carranza",
    oficio: "pintura",
    imagen: img("pro-sofia-carranza"),
    rating: 4.9,
    resenas: 97,
    trabajos: 210,
    anios: 10,
    matricula: "Registro 1188",
    respuestaMin: 40,
    disp: "semana",
    urgencias: false,
    barrios: ["Cerro de las Rosas", "Villa Belgrano", "Argüello", "Nueva Córdoba"],
    visita: 0,
    bio: "Pintura de interiores y exteriores, tratamiento de humedad y revestimientos. Trabajo con equipo propio y cubro todo antes de empezar.",
    servicios: [
      { nombre: "Pintura de ambiente (hasta 15 m²)", desde: 65000 },
      { nombre: "Tratamiento de humedad", desde: 40000 },
      { nombre: "Frentes y rejas", desde: 90000 },
    ],
    agenda: [A(false, false, false), A(false, false, false), A(true, true, false), A(true, true, false), A(true, true, false), A(true, false, false), A(false, false, false)],
    resenasLista: [
      { autor: "Valeria Q.", barrio: "Cerro de las Rosas", texto: "Pintó toda la casa en cuatro días y no quedó ni una gota fuera de lugar.", rating: 5, hace: "hace 4 días", trabajo: "Casa completa" },
      { autor: "Diego H.", barrio: "Argüello", texto: "Resolvió una humedad que nadie había podido sacar.", rating: 5, hace: "hace 1 mes", trabajo: "Humedad" },
    ],
    fotos: [img("trabajo-humedad")],
  },
  {
    id: "nahuel-pereyra",
    nombre: "Nahuel Pereyra",
    oficio: "pintura",
    imagen: img("pro-nahuel-pereyra"),
    rating: 4.6,
    resenas: 58,
    trabajos: 120,
    anios: 5,
    matricula: "Registro 2045",
    respuestaMin: 35,
    disp: "proxima",
    urgencias: false,
    barrios: ["Alberdi", "Güemes", "Jardín"],
    visita: 0,
    bio: "Pintor y durlockero. Hago arreglos chicos, cielorrasos y pintura de departamentos para entregar.",
    servicios: [
      { nombre: "Pintura de departamento para entregar", desde: 150000 },
      { nombre: "Arreglos de durlock", desde: 25000 },
    ],
    agenda: [A(false, false, false), A(false, false, false), A(false, false, false), A(false, false, false), A(false, false, false), A(true, true, false), A(false, false, false)],
    resenasLista: [
      { autor: "Camila E.", barrio: "Alberdi", texto: "Buen trabajo y buen precio. Tardó en arrancar porque tenía la agenda llena.", rating: 4, hace: "hace 2 semanas", trabajo: "Departamento" },
    ],
    fotos: [img("trabajo-humedad")],
  },
  {
    id: "gustavo-ledesma",
    nombre: "Gustavo Ledesma",
    oficio: "carpinteria",
    imagen: img("pro-gustavo-ledesma"),
    rating: 4.9,
    resenas: 143,
    trabajos: 390,
    anios: 25,
    matricula: "Registro 0932",
    respuestaMin: 60,
    disp: "semana",
    urgencias: false,
    barrios: ["General Paz", "Alta Córdoba", "Cerro de las Rosas"],
    visita: 7000,
    bio: "Carpintero de banco. Arreglo puertas, placares y muebles, y hago muebles a medida con madera maciza o melamina.",
    servicios: [
      { nombre: "Ajuste de puertas y placares", desde: 16000 },
      { nombre: "Mueble de cocina a medida", desde: 320000 },
      { nombre: "Restauración de muebles", desde: 45000 },
    ],
    agenda: [A(false, false, false), A(false, true, false), A(true, true, false), A(false, false, false), A(true, true, false), A(true, false, false), A(false, false, false)],
    resenasLista: [
      { autor: "Beatriz N.", barrio: "Alta Córdoba", texto: "Restauró la cómoda de mi abuela. Quedó como nueva y respetó el estilo original.", rating: 5, hace: "hace 3 semanas", trabajo: "Restauración" },
      { autor: "Tomás V.", barrio: "General Paz", texto: "Me hizo el bajo mesada a medida. Muy buena terminación.", rating: 5, hace: "hace 2 meses", trabajo: "Cocina" },
    ],
    fotos: [img("trabajo-placard")],
  },
  {
    id: "paula-gimenez",
    nombre: "Paula Giménez",
    oficio: "aire",
    imagen: img("pro-paula-gimenez"),
    rating: 4.8,
    resenas: 205,
    trabajos: 530,
    anios: 12,
    matricula: "MR 1576",
    respuestaMin: 15,
    disp: "hoy",
    urgencias: true,
    barrios: ["Nueva Córdoba", "Güemes", "Jardín", "Alberdi"],
    visita: 9500,
    bio: "Técnica en refrigeración. Instalo, hago service y cargo gas a equipos split de todas las marcas. Garantía escrita de seis meses.",
    servicios: [
      { nombre: "Instalación de split (hasta 3.000 fg)", desde: 95000 },
      { nombre: "Service y limpieza", desde: 30000 },
      { nombre: "Carga de gas", desde: 45000 },
    ],
    agenda: [A(true, true, false), A(true, true, false), A(false, true, false), A(true, true, false), A(true, true, false), A(true, false, false), A(false, false, false)],
    resenasLista: [
      { autor: "Nicolás A.", barrio: "Güemes", texto: "El aire no enfriaba nada. Paula vino en el día, le hizo service y cargó gas. Ahora parece nuevo.", rating: 5, hace: "hace 2 días", trabajo: "Service" },
      { autor: "Agustina K.", barrio: "Nueva Córdoba", texto: "Instalación prolija, sin dejar caños a la vista.", rating: 5, hace: "hace 3 semanas", trabajo: "Instalación" },
    ],
    fotos: [img("trabajo-split")],
  },
  {
    id: "ezequiel-moyano",
    nombre: "Ezequiel Moyano",
    oficio: "aire",
    imagen: img("pro-ezequiel-moyano"),
    rating: 4.7,
    resenas: 76,
    trabajos: 180,
    anios: 6,
    matricula: "MR 2034",
    respuestaMin: 45,
    disp: "proxima",
    urgencias: false,
    barrios: ["Argüello", "Villa Belgrano", "Cerro de las Rosas"],
    visita: 8000,
    bio: "Instalación y mantenimiento de aires y heladeras comerciales. Atiendo casas y locales de la zona norte.",
    servicios: [
      { nombre: "Instalación de split", desde: 90000 },
      { nombre: "Mantenimiento preventivo", desde: 28000 },
    ],
    agenda: [A(false, false, false), A(false, false, false), A(false, false, false), A(false, false, false), A(false, false, false), A(false, false, false), A(true, true, false)],
    resenasLista: [
      { autor: "Rocío P.", barrio: "Argüello", texto: "Muy responsable, aunque hubo que esperar unos días para el turno.", rating: 4, hace: "hace 1 mes", trabajo: "Instalación" },
    ],
    fotos: [img("trabajo-split")],
  },
];

export const profesionalPorId = Object.fromEntries(profesionales.map((p) => [p.id, p])) as Record<string, Profesional>;

export const sugerencias: { texto: string; oficio: OficioId; urgente?: boolean }[] = [
  { texto: "Pierde agua la canilla", oficio: "plomeria" },
  { texto: "Se tapó la cañería de la cocina", oficio: "plomeria" },
  { texto: "Salta la térmica", oficio: "electricidad", urgente: true },
  { texto: "Quiero agregar enchufes", oficio: "electricidad" },
  { texto: "El calefón no enciende", oficio: "gas" },
  { texto: "Siento olor a gas", oficio: "gas", urgente: true },
  { texto: "Tengo humedad en la pared", oficio: "pintura" },
  { texto: "Pintar un departamento", oficio: "pintura" },
  { texto: "Se descolgó la puerta del placard", oficio: "carpinteria" },
  { texto: "Arreglar un mueble de madera", oficio: "carpinteria" },
  { texto: "El aire no enfría", oficio: "aire" },
  { texto: "Instalar un aire split", oficio: "aire" },
];

export const dispTexto: Record<Disponibilidad, string> = {
  hoy: "Disponible hoy",
  manana: "Disponible mañana",
  semana: "Turnos esta semana",
  proxima: "Turnos la semana que viene",
};

export const franjas: { id: Franja; nombre: string; horario: string }[] = [
  { id: "manana", nombre: "Mañana", horario: "8 a 12 h" },
  { id: "tarde", nombre: "Tarde", horario: "13 a 17 h" },
  { id: "noche", nombre: "Noche", horario: "18 a 21 h" },
];
