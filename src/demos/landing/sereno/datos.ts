// Contenido ficticio de la demo "Sereno" (Alma Clara, centro de estética y bienestar).

export const IMG = "/demos/landing/sereno";

export type CategoriaId = "facial" | "corporal" | "relax" | "manos";

export const categorias: { id: CategoriaId; nombre: string; imagen: string; alt: string }[] = [
  {
    id: "facial",
    nombre: "Facial",
    imagen: `${IMG}/producto-facial.webp`,
    alt: "Frasco gotero de sérum verde salvia junto a dos hojas, sobre fondo verde claro",
  },
  {
    id: "corporal",
    nombre: "Corporal",
    imagen: `${IMG}/producto-corporal.webp`,
    alt: "Piedras de masaje apiladas con una rama de eucalipto lila, sobre fondo lavanda",
  },
  {
    id: "relax",
    nombre: "Relax",
    imagen: `${IMG}/producto-relax.webp`,
    alt: "Toalla enrollada y una vela lila encendida, sobre fondo arena",
  },
  {
    id: "manos",
    nombre: "Manos y pies",
    imagen: `${IMG}/producto-manos.webp`,
    alt: "Esmalte lila y crema de manos blanca con una hoja, sobre fondo gris azulado",
  },
];

export const categoriaPorId = Object.fromEntries(categorias.map((c) => [c.id, c])) as Record<
  CategoriaId,
  (typeof categorias)[number]
>;

export type Tratamiento = {
  id: string;
  nombre: string;
  categoria: CategoriaId;
  minutos: number;
  precio: number;
  descripcion: string;
  etiqueta?: string;
};

export const tratamientos: Tratamiento[] = [
  {
    id: "limpieza-profunda",
    nombre: "Limpieza facial profunda",
    categoria: "facial",
    minutos: 60,
    precio: 38000,
    descripcion: "Higiene, extracción suave, alta frecuencia y mascarilla según tu tipo de piel.",
    etiqueta: "La más pedida",
  },
  {
    id: "hidratacion-hialuronico",
    nombre: "Hidratación con ácido hialurónico",
    categoria: "facial",
    minutos: 50,
    precio: 42000,
    descripcion: "Devuelve elasticidad y luminosidad a pieles secas o apagadas. Sin agujas.",
  },
  {
    id: "peeling-enzimatico",
    nombre: "Peeling enzimático suave",
    categoria: "facial",
    minutos: 40,
    precio: 35000,
    descripcion: "Renueva la superficie y empareja el tono. Apto para pieles sensibles.",
  },
  {
    id: "dermaplaning",
    nombre: "Dermaplaning y mascarilla calmante",
    categoria: "facial",
    minutos: 45,
    precio: 36000,
    descripcion: "Exfoliación mecánica que deja la piel lisa y lista para absorber activos.",
  },
  {
    id: "drenaje-linfatico",
    nombre: "Drenaje linfático manual",
    categoria: "corporal",
    minutos: 60,
    precio: 34000,
    descripcion: "Técnica suave que reduce la retención de líquidos y alivia piernas cansadas.",
  },
  {
    id: "ultracavitacion",
    nombre: "Modelado corporal con ultracavitación",
    categoria: "corporal",
    minutos: 50,
    precio: 39000,
    descripcion: "Protocolo por zonas, combinado con drenaje. Evaluación previa incluida.",
  },
  {
    id: "exfoliacion-sales",
    nombre: "Exfoliación corporal con sales",
    categoria: "corporal",
    minutos: 45,
    precio: 30000,
    descripcion: "Sales finas y aceites vegetales para una piel suave de pies a cabeza.",
  },
  {
    id: "masaje-descontracturante",
    nombre: "Masaje descontracturante",
    categoria: "relax",
    minutos: 60,
    precio: 32000,
    descripcion: "Espalda, cuello y hombros. Presión firme, a tu medida.",
  },
  {
    id: "piedras-calientes",
    nombre: "Masaje con piedras calientes",
    categoria: "relax",
    minutos: 80,
    precio: 45000,
    descripcion: "Calor profundo y maniobras lentas para soltar tensiones acumuladas.",
  },
  {
    id: "ritual-alma-clara",
    nombre: "Ritual Alma Clara",
    categoria: "relax",
    minutos: 120,
    precio: 68000,
    descripcion: "Limpieza facial, masaje de cuerpo completo y té de hierbas. Dos horas para vos.",
    etiqueta: "Para regalar",
  },
  {
    id: "manicura-spa",
    nombre: "Manicura spa",
    categoria: "manos",
    minutos: 45,
    precio: 18000,
    descripcion: "Limado, cutículas, exfoliación, masaje y esmaltado semipermanente.",
  },
  {
    id: "pedicura-spa",
    nombre: "Pedicura spa",
    categoria: "manos",
    minutos: 60,
    precio: 24000,
    descripcion: "Baño de pies, exfoliación, hidratación profunda y esmaltado.",
  },
];

export const tratamientoPorId = Object.fromEntries(tratamientos.map((t) => [t.id, t])) as Record<string, Tratamiento>;

export const duraciones = [
  { id: "todas", nombre: "Cualquier duración", test: () => true },
  { id: "corta", nombre: "Hasta 45 min", test: (m: number) => m <= 45 },
  { id: "media", nombre: "46 a 75 min", test: (m: number) => m > 45 && m <= 75 },
  { id: "larga", nombre: "Más de 75 min", test: (m: number) => m > 75 },
] as const;
export type DuracionId = (typeof duraciones)[number]["id"];

export const casos = [
  {
    id: 1,
    titulo: "Rojeces y poros",
    tratamiento: "Limpieza facial profunda",
    sesiones: "4 sesiones, cada 15 días",
    texto: "Piel mixta con rojeces por sensibilidad. Combinamos limpieza suave, alta frecuencia y activos calmantes.",
  },
  {
    id: 2,
    titulo: "Manchas solares",
    tratamiento: "Peeling enzimático suave",
    sesiones: "6 sesiones, una por semana",
    texto: "Manchas de sol en pómulos. Peeling progresivo y protector solar diario como parte del tratamiento en casa.",
  },
  {
    id: 3,
    titulo: "Textura y deshidratación",
    tratamiento: "Hidratación con ácido hialurónico",
    sesiones: "3 sesiones, cada 21 días",
    texto: "Piel opaca, con líneas finas por deshidratación. Hidratación profunda y rutina simple de mantenimiento.",
  },
] as const;

export const equipo = [
  {
    nombre: "Valentina Roldán",
    rol: "Cosmiatra · Directora",
    matricula: "M.P. 1842",
    bio: "Fundó Alma Clara en 2014. Especialista en pieles sensibles y protocolos faciales a medida.",
    imagen: `${IMG}/equipo-valentina.webp`,
    alt: "Retrato ilustrado de Valentina, de pelo largo castaño y remera clara, dentro de un arco verde salvia",
  },
  {
    nombre: "Camila Ferreyra",
    rol: "Masoterapeuta",
    matricula: "M.P. 2207",
    bio: "Diez años de experiencia en masajes terapéuticos, drenaje linfático y piedras calientes.",
    imagen: `${IMG}/equipo-camila.webp`,
    alt: "Retrato ilustrado de Camila, con rodete y remera verde oscuro, dentro de un arco lila",
  },
  {
    nombre: "Julieta Ahumada",
    rol: "Médica dermatóloga",
    matricula: "M.P. 30.415",
    bio: "Hace las evaluaciones iniciales y acompaña los tratamientos que necesitan mirada médica.",
    imagen: `${IMG}/equipo-julieta.webp`,
    alt: "Retrato ilustrado de Julieta, de pelo corto cobrizo y remera lila, dentro de un arco verde claro",
  },
] as const;

export const pasos = [
  {
    titulo: "Consulta sin cargo",
    texto: "Charlamos 15 minutos sobre lo que te preocupa, tus hábitos y lo que esperás. Sin presiones.",
  },
  {
    titulo: "Diagnóstico de tu piel",
    texto: "Analizamos tipo de piel, sensibilidad e hidratación para armar un plan realista.",
  },
  {
    titulo: "Tratamiento en cabina",
    texto: "Cabinas privadas, luz cálida y música suave. Te explicamos cada paso mientras lo hacemos.",
  },
  {
    titulo: "Seguimiento en casa",
    texto: "Te llevás una rutina simple y te escribimos a los días para ver cómo respondió tu piel.",
  },
] as const;

export const testimonios = [
  {
    texto:
      "Llegué con la piel muy reactiva y miedo de que me la irritaran más. Valentina fue súper cuidadosa y a las tres sesiones ya no tenía rojeces. Ahora voy una vez por mes, como un mimo.",
    nombre: "Mariana L.",
    tratamiento: "Limpieza facial profunda",
  },
  {
    texto:
      "El ritual de dos horas fue el mejor regalo que me hicieron. Salí flotando. Todo impecable, desde el té de la recepción hasta la toalla calentita.",
    nombre: "Carolina P.",
    tratamiento: "Ritual Alma Clara",
  },
  {
    texto:
      "Tengo contracturas por trabajar sentado todo el día. Camila encuentra el nudo exacto. Es el único lugar donde de verdad me relajo.",
    nombre: "Esteban R.",
    tratamiento: "Masaje descontracturante",
  },
  {
    texto:
      "Me explicaron todo con paciencia y no me quisieron vender nada que no necesitara. Eso para mí vale más que cualquier promo.",
    nombre: "Lucía M.",
    tratamiento: "Peeling enzimático suave",
  },
] as const;
