export type TrabajoCategoria = "cliente" | "academico";

export type TrabajoMedia = {
  /** Captura desktop (16:10). Ruta dentro de /public. */
  desktop: string;
  /** Captura mobile (9:19,5 aprox). Ruta dentro de /public. */
  mobile: string;
  /** Video corto opcional (mp4, sin audio). Si existe, reemplaza la captura en la tarjeta. */
  video?: string;
  /** true mientras las imágenes sean placeholders generados. */
  placeholder: boolean;
};

export type Trabajo = {
  slug: string;
  /** Número de carpeta en el home ("TRABAJO 01"). */
  numero: string;
  /** Color de la pestaña de carpeta. */
  color: "celeste" | "ink" | "mostaza" | "menta" | "rosa";
  /** Etiqueta sobre la captura. */
  badge: string;
  categoria: TrabajoCategoria;
  nombre: string;
  /** Una línea de qué es (encabezado del caso). */
  queEs: string;
  tipo: string;
  anio?: number;
  rol?: string;
  /** Descripción genérica del cliente. */
  cliente: string;
  url?: string;
  repo?: string;
  /** Línea del problema que resolvió (tarjeta del home). */
  lineaHome: string;
  tags: string[];
  problema: string;
  solucion: string[];
  porDentro: string[];
  stack: string[];
  media: TrabajoMedia;
  cta: { titulo: string; mensajeWa: string };
};

export const trabajos: Trabajo[] = [
  {
    slug: "trendahaus",
    numero: "01",
    color: "celeste",
    badge: "En producción",
    categoria: "cliente",
    nombre: "TrendaHaus",
    queEs: "Plataforma de reservas para un multiespacio creativo y estudio fotográfico en Córdoba.",
    tipo: "Plataforma de reservas",
    anio: 2025,
    rol: "Desarrollador full-stack (freelance)",
    cliente:
      "Multiespacio creativo y estudio fotográfico en Córdoba: estudio con ciclorama, sala creativa, salón de eventos y membresías.",
    url: "https://www.trendahaus.com",
    lineaHome:
      "Sus clientes reservan el estudio, la sala o el salón online, con turnos en tiempo real y un panel para administrarlo todo.",
    tags: ["Reservas online", "Turnos en tiempo real", "Panel de administración", "Landing animada"],
    problema:
      "Un espacio con varios servicios (estudio con ciclorama, sala creativa, salón de eventos y membresías) necesitaba que sus clientes pudieran ver disponibilidad y reservar online, y tener un lugar para administrar turnos y precios.",
    solucion: [
      "Una landing animada que presenta cada espacio.",
      "Reserva de turnos online con disponibilidad en tiempo real.",
      "Un panel de administración completo para gestionar turnos, precios y notas.",
    ],
    porDentro: [
      "API REST propia para turnos, precios dinámicos y notas por fecha y por servicio.",
      "Autenticación por middleware: Basic Auth más token de administrador.",
      "Persistencia serverless con Vercel KV (Redis vía Upstash).",
      "Animaciones con GSAP y Framer Motion.",
    ],
    stack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Framer Motion",
      "GSAP",
      "Vercel KV",
      "Vercel",
    ],
    // TODO: reemplazar por capturas reales en /public/trabajos/trendahaus/ (desktop.webp, mobile.webp, opcional video.mp4)
    media: {
      desktop: "/trabajos/trendahaus/desktop.webp",
      mobile: "/trabajos/trendahaus/mobile.webp",
      placeholder: true,
    },
    cta: {
      titulo: "¿Querés algo así para tu negocio?",
      mensajeWa: "Hola Fran, vi el caso TrendaHaus y quiero algo parecido.",
    },
  },
  {
    slug: "benicioshop",
    numero: "02",
    color: "ink",
    badge: "En producción",
    categoria: "cliente",
    nombre: "BenicioShop",
    queEs: "Tienda online para una marca de ropa vintage, con lanzamientos por drops.",
    tipo: "E-commerce",
    anio: 2025,
    rol: "Desarrollador full-stack (freelance)",
    cliente: "Marca de ropa vintage.",
    url: "https://www.benicioshop.com",
    lineaHome:
      "Su tienda propia con drops exclusivos, cuenta regresiva y stock controlado para no vender de más.",
    tags: ["Tienda online", "Drops con countdown", "MercadoPago", "Panel con métricas"],
    problema:
      "Una marca de ropa vintage que vende por lanzamientos (drops) necesitaba su propia tienda: mostrar el próximo drop, abrirlo a todos a la vez, cobrar online y no vender prendas que ya no hay.",
    solucion: [
      "Tienda completa con drops exclusivos y cuenta regresiva.",
      "Acceso bloqueado antes del lanzamiento.",
      "Pagos con MercadoPago.",
      "Gestión de stock y un panel de administración con métricas y pedidos.",
      "Emails automáticos de confirmación.",
    ],
    porDentro: [
      "Reserva de stock con vencimiento automático a los 2 minutos para evitar sobreventa.",
      "Cron jobs en Vercel para la limpieza de reservas vencidas.",
      "Pagos con MercadoPago vía webhooks asincrónicos.",
      "Panel con KPIs y gestión de pedidos, protegido con JWT.",
      "Emails transaccionales con Resend.",
    ],
    stack: [
      "Next.js 14",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Tailwind CSS",
      "MercadoPago",
      "Resend",
      "Vercel Blob",
      "JWT",
      "Vercel",
    ],
    // TODO: reemplazar por capturas reales en /public/trabajos/benicioshop/ (desktop.webp, mobile.webp, opcional video.mp4)
    media: {
      desktop: "/trabajos/benicioshop/desktop.webp",
      mobile: "/trabajos/benicioshop/mobile.webp",
      placeholder: true,
    },
    cta: {
      titulo: "¿Querés algo así para tu negocio?",
      mensajeWa: "Hola Fran, vi el caso BenicioShop y quiero algo parecido.",
    },
  },
  {
    slug: "unichat",
    numero: "03",
    color: "mostaza",
    badge: "Proyecto universitario",
    categoria: "academico",
    nombre: "UniChat",
    queEs: "Un chat con IA que responde usando tus propios documentos.",
    tipo: "Web app con IA",
    // TODO: año del proyecto
    // TODO: rol en el proyecto (¿individual o en equipo?)
    cliente: "Proyecto universitario.",
    // TODO: repo si es público (ej. "https://github.com/FranZago1/unichat")
    lineaHome: "Un chat con IA que responde usando tus propios documentos.",
    tags: ["Microservicios en Go", "RAG", "RabbitMQ", "Apache Solr", "Streaming"],
    problema:
      "Buscar una respuesta dentro de muchos documentos lleva tiempo. La idea: poder preguntar en lenguaje natural y que la respuesta salga de esos documentos, no de internet.",
    solucion: [
      "Un chat donde preguntás y la IA responde en base a tus documentos.",
      "Las respuestas aparecen a medida que se generan, sin esperar a que terminen.",
      "Puede funcionar con un modelo de IA local o en la nube.",
    ],
    porDentro: [
      "Arquitectura de microservicios en Go.",
      "Pipeline RAG: los documentos se indexan y los fragmentos relevantes se pasan como contexto al modelo.",
      "Mensajería asincrónica entre servicios con RabbitMQ.",
      "Búsqueda vectorial con Apache Solr.",
      "Respuestas en streaming con Server-Sent Events (SSE).",
      "Proveedor de IA intercambiable entre local y nube.",
    ],
    stack: ["Go", "RabbitMQ", "Apache Solr", "RAG", "Embeddings", "SSE", "LLMs"],
    // TODO: capturas reales en /public/trabajos/unichat/
    media: {
      desktop: "/trabajos/unichat/desktop.webp",
      mobile: "/trabajos/unichat/mobile.webp",
      placeholder: true,
    },
    cta: {
      titulo: "¿Te interesa un asistente con IA sobre tus documentos?",
      mensajeWa: "Hola Fran, vi el caso UniChat y me interesa un asistente con IA sobre mis documentos.",
    },
  },
];

export const trabajosCliente = trabajos.filter((t) => t.categoria === "cliente");
export const trabajosAcademicos = trabajos.filter((t) => t.categoria === "academico");

export function getTrabajo(slug: string): Trabajo | undefined {
  return trabajos.find((t) => t.slug === slug);
}
