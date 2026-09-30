// Contenido ficticio de la demo "Tech" (Cuentaclara, app de facturación para monotributistas y pymes).

export const IMG = "/demos/landing/tech";

export type Estado = "pagada" | "pendiente" | "vencida";

export type Factura = { id: string; numero: string; cliente: string; fecha: string; monto: number; estado: Estado };

/** Facturas iniciales del mock del panel. */
export const facturasIniciales: Factura[] = [
  { id: "f141", numero: "C 0003-00000141", cliente: "Estudio Nube Alta", fecha: "29 sep", monto: 185000, estado: "pagada" },
  { id: "f140", numero: "C 0003-00000140", cliente: "Ferro Diseño", fecha: "27 sep", monto: 96400, estado: "pendiente" },
  { id: "f139", numero: "C 0003-00000139", cliente: "Cardumen Café", fecha: "24 sep", monto: 240000, estado: "pagada" },
  { id: "f138", numero: "C 0003-00000138", cliente: "Molle Textil", fecha: "18 sep", monto: 72500, estado: "vencida" },
];

/** Facturas que "se emiten" en vivo en el mock, en loop. */
export const facturasNuevas: Omit<Factura, "id" | "numero">[] = [
  { cliente: "Lumo Estudio", fecha: "Hoy", monto: 128000, estado: "pendiente" },
  { cliente: "Vértice Obras", fecha: "Hoy", monto: 315600, estado: "pendiente" },
  { cliente: "Tallerito Kids", fecha: "Hoy", monto: 54200, estado: "pendiente" },
  { cliente: "Brumasur Viajes", fecha: "Hoy", monto: 207900, estado: "pendiente" },
];

export const barrasMeses = [
  { mes: "Abr", valor: 1.42 },
  { mes: "May", valor: 1.68 },
  { mes: "Jun", valor: 1.55 },
  { mes: "Jul", valor: 2.02 },
  { mes: "Ago", valor: 2.41 },
  { mes: "Sep", valor: 2.85 },
];

export const pasos = [
  {
    titulo: "Conectá tu CUIT",
    texto: "Vinculás tu clave fiscal una sola vez y traemos tus puntos de venta y tu categoría. Tarda dos minutos.",
    detalle: "Conexión cifrada con ARCA",
  },
  {
    titulo: "Cargá tus clientes",
    texto: "Escribís el CUIT y completamos razón social y condición frente al IVA. O importás tu planilla entera.",
    detalle: "Importación desde Excel o CSV",
  },
  {
    titulo: "Facturá y cobrá",
    texto: "Emitís en segundos, mandás la factura con un link de pago y te avisamos cuando te pagan.",
    detalle: "Desde la compu o el celular",
  },
] as const;

export const planes = [
  {
    id: "inicial",
    nombre: "Inicial",
    bajada: "Para dar los primeros pasos.",
    mensual: 0,
    anual: 0,
    destacado: false,
    cta: "Crear cuenta gratis",
    incluye: ["Hasta 10 facturas por mes", "1 punto de venta", "Envío por email", "Soporte por chat"],
  },
  {
    id: "monotributo",
    nombre: "Monotributo",
    bajada: "Para el que factura todos los meses.",
    mensual: 7900,
    anual: 6300,
    destacado: true,
    cta: "Probar 14 días gratis",
    incluye: [
      "Facturas ilimitadas",
      "Links de pago y recordatorios",
      "Control de categoría y alertas",
      "Reportes mensuales y anuales",
    ],
  },
  {
    id: "pyme",
    nombre: "Pyme",
    bajada: "Para equipos y responsables inscriptos.",
    mensual: 18900,
    anual: 15100,
    destacado: false,
    cta: "Probar 14 días gratis",
    incluye: ["Todo lo de Monotributo", "Facturas A, B y E", "Hasta 5 usuarios con permisos", "Acceso para tu contador"],
  },
] as const;

/** Tabla comparativa: [función, inicial, monotributo, pyme]. true/false o texto. */
export const comparativa: [string, boolean | string, boolean | string, boolean | string][] = [
  ["Facturas por mes", "10", "Ilimitadas", "Ilimitadas"],
  ["Tipos de comprobante", "C", "C", "A, B, C y E"],
  ["Puntos de venta", "1", "3", "Ilimitados"],
  ["Links de pago", false, true, true],
  ["Recordatorios automáticos", false, true, true],
  ["Control de categoría del monotributo", true, true, true],
  ["Reportes y exportación a Excel", false, true, true],
  ["Usuarios", "1", "1", "Hasta 5"],
  ["Acceso para tu contador", false, false, true],
  ["Soporte", "Chat", "Chat y email", "Prioritario"],
];

export const testimonios = [
  {
    texto:
      "Antes facturaba los domingos a la noche, una por una, en la web de ARCA. Ahora lo hago desde el celular cuando termino cada trabajo. Recuperé mis domingos.",
    nombre: "Sofía Paz",
    rol: "Diseñadora freelance · Monotributo D",
    metrica: "6 h",
    metricaTexto: "menos por mes facturando",
    imagen: `${IMG}/avatar-sofia.webp`,
    alt: "Avatar ilustrado de Sofía, de pelo largo oscuro, sobre fondo lavanda",
  },
  {
    texto:
      "Los recordatorios automáticos me cambiaron la vida. Dejé de ser el pesado que persigue clientes: el sistema lo hace por mí y con buena onda.",
    nombre: "Matías Correa",
    rol: "Estudio de arquitectura · Pyme",
    metrica: "−38 %",
    metricaTexto: "de facturas vencidas",
    imagen: `${IMG}/avatar-matias.webp`,
    alt: "Avatar ilustrado de Matías, de pelo corto negro, sobre fondo verde agua",
  },
  {
    texto:
      "Me avisó que estaba por pasarme de categoría con dos meses de margen. Lo charlé con mi contadora a tiempo y no tuve sorpresas.",
    nombre: "Agustina Ríos",
    rol: "Pastelería artesanal · Monotributo C",
    metrica: "2 meses",
    metricaTexto: "de anticipación en alertas",
    imagen: `${IMG}/avatar-agustina.webp`,
    alt: "Avatar ilustrado de Agustina, de pelo con rulos, sobre fondo amarillo",
  },
] as const;

export const faqs = [
  {
    p: "¿Necesito saber de contabilidad para usar Cuentaclara?",
    r: "No. Si sabés qué vendiste y a quién, ya está. Cuentaclara elige el tipo de comprobante según tu condición y la de tu cliente, y te avisa si falta algún dato.",
  },
  {
    p: "¿Las facturas son válidas ante ARCA?",
    r: "Sí. Cada factura se autoriza en el momento y recibe su CAE, igual que si la hicieras desde la web oficial. Podés descargarla en PDF cuando quieras.",
  },
  {
    p: "¿Qué pasa cuando termina la prueba gratis?",
    r: "Nada automático: no te pedimos tarjeta para probar. Si no elegís un plan, tu cuenta pasa al plan Inicial y conservás todas tus facturas.",
  },
  {
    p: "¿Mi contador puede entrar?",
    r: "En el plan Pyme podés invitar a tu contador con un usuario propio, de solo lectura o con permisos para exportar.",
  },
  {
    p: "¿Puedo cancelar cuando quiera?",
    r: "Sí, desde la configuración de tu cuenta, en dos clicks. Si pagaste el plan anual, te devolvemos la parte proporcional.",
  },
] as const;
