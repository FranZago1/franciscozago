export type StackFila = { categoria: string; items: string[] };

/** Stack técnico. Hoy no se muestra en el home (se sacó la sección); queda como referencia. */
export const stack: StackFila[] = [
  { categoria: "Frontend", items: ["React", "Next.js", "React Native", "Tailwind CSS", "Framer Motion", "GSAP"] },
  { categoria: "Backend", items: ["Node.js", "NestJS", "Go (Gin)", "REST APIs", "JWT", "RBAC", "RabbitMQ"] },
  { categoria: "Datos", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Prisma", "Apache Solr"] },
  { categoria: "Infraestructura", items: ["Vercel", "Linux", "Docker", "MinIO S3", "cron jobs"] },
  {
    categoria: "IA",
    items: ["RAG", "embeddings", "integración de LLMs (OpenAI, Ollama/Llama 3)", "búsqueda semántica"],
  },
  { categoria: "Pagos", items: ["MercadoPago"] },
];

export const proceso = [
  { titulo: "Charlamos", linea: "Por WhatsApp o llamada, me contás qué necesitás." },
  { titulo: "Propuesta", linea: "Te paso alcance, plazos y presupuesto." },
  { titulo: "Diseño y desarrollo", linea: "Vas viendo avances y dando feedback." },
  { titulo: "Publicación", linea: "Lo dejamos online y te explico cómo usarlo." },
];
