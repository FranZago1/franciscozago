export type StackFila = { categoria: string; items: string[] };

/**
 * Tecnologías e integraciones (desplegable "Para los técnicos", antes de Contacto).
 * Incluye lo usado en los trabajos, en este portfolio y en sus demos.
 */
export const stack: StackFila[] = [
  { categoria: "Lenguajes", items: ["TypeScript", "JavaScript", "Go", "SQL", "Python", "HTML y CSS"] },
  {
    categoria: "Frontend",
    items: ["React", "Next.js", "React Native", "Tailwind CSS", "Motion (Framer Motion)", "GSAP"],
  },
  {
    categoria: "Backend",
    items: ["Node.js", "NestJS", "Go (Gin)", "APIs REST", "Server-Sent Events", "RabbitMQ", "Cron jobs"],
  },
  {
    categoria: "Bases de datos",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Redis (Upstash / Vercel KV)", "Prisma", "Apache Solr"],
  },
  {
    categoria: "Integraciones",
    items: [
      "MercadoPago (pagos y webhooks)",
      "WhatsApp (mensajes prearmados)",
      "Resend (emails)",
      "Vercel Blob",
      "MinIO S3",
      "OpenAI y Ollama (Llama 3)",
    ],
  },
  { categoria: "Seguridad", items: ["JWT", "RBAC", "Validación con Zod", "Rate limiting", "Headers de seguridad"] },
  { categoria: "IA", items: ["RAG", "Embeddings", "Búsqueda semántica", "Streaming de respuestas"] },
  {
    categoria: "Infra y herramientas",
    items: ["Vercel", "Docker", "Linux", "Git y GitHub", "Playwright", "Lighthouse", "sharp", "ffmpeg"],
  },
];

export const proceso = [
  { titulo: "Charlamos", linea: "Por WhatsApp o llamada, me contás qué necesitás." },
  { titulo: "Propuesta", linea: "Te paso alcance, plazos y presupuesto." },
  { titulo: "Diseño y desarrollo", linea: "Vas viendo avances y dando feedback." },
  { titulo: "Publicación", linea: "Lo dejamos online y te explico cómo usarlo." },
];
