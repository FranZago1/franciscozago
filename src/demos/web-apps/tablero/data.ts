export type ColumnaId = "ideas" | "curso" | "revision" | "listo";
export type Prioridad = "alta" | "media" | "baja";

export type Persona = { id: string; nombre: string; rol: string; iniciales: string; color: string };
export type Etiqueta = { id: string; nombre: string; fondo: string; texto: string; punto: string };
export type ItemChecklist = { id: string; texto: string; hecho: boolean };

export type Tarea = {
  id: string;
  titulo: string;
  descripcion: string;
  etiquetas: string[];
  responsable: string | null;
  /** Fecha límite en formato AAAA-MM-DD, o vacío. */
  fecha: string;
  prioridad: Prioridad;
  checklist: ItemChecklist[];
};

export type Tablero = {
  version: 1;
  tareas: Record<string, Tarea>;
  columnas: Record<ColumnaId, string[]>;
};

export const COLUMNAS: { id: ColumnaId; nombre: string; color: string; descripcion: string }[] = [
  { id: "ideas", nombre: "Ideas", color: "#A1A1AA", descripcion: "Todavía sin arrancar" },
  { id: "curso", nombre: "En curso", color: "#5B5BF7", descripcion: "Alguien la está haciendo" },
  { id: "revision", nombre: "Revisión", color: "#F59E0B", descripcion: "Esperando feedback" },
  { id: "listo", nombre: "Listo", color: "#10B981", descripcion: "Aprobada y entregada" },
];

export const PERSONAS: Persona[] = [
  { id: "lf", nombre: "Lucía Ferreyra", rol: "Dirección de arte", iniciales: "LF", color: "#5B5BF7" },
  { id: "ta", nombre: "Tomás Aguirre", rol: "Desarrollo web", iniciales: "TA", color: "#0EA5A4" },
  { id: "co", nombre: "Camila Ortiz", rol: "Redes y contenido", iniciales: "CO", color: "#E0457B" },
  { id: "mr", nombre: "Martín Rivas", rol: "Diseño gráfico", iniciales: "MR", color: "#EA7A1A" },
  { id: "vs", nombre: "Valentina Sosa", rol: "Cuentas", iniciales: "VS", color: "#7C3AED" },
];

export const ETIQUETAS: Etiqueta[] = [
  { id: "branding", nombre: "Branding", fondo: "#EEEDFE", texto: "#4338CA", punto: "#5B5BF7" },
  { id: "web", nombre: "Web", fondo: "#E0F5F4", texto: "#0F766E", punto: "#14B8A6" },
  { id: "redes", nombre: "Redes", fondo: "#FDE8F0", texto: "#BE185D", punto: "#EC4899" },
  { id: "video", nombre: "Video", fondo: "#FEF1E2", texto: "#B45309", punto: "#F59E0B" },
  { id: "cliente", nombre: "Con cliente", fondo: "#E8F1FD", texto: "#1D4ED8", punto: "#3B82F6" },
  { id: "interno", nombre: "Interno", fondo: "#F1F1F3", texto: "#52525B", punto: "#A1A1AA" },
];

export const PRIORIDADES: { id: Prioridad; nombre: string; color: string }[] = [
  { id: "alta", nombre: "Alta", color: "#E5484D" },
  { id: "media", nombre: "Media", color: "#F59E0B" },
  { id: "baja", nombre: "Baja", color: "#A1A1AA" },
];

export function fechaISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function enDias(n: number) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return fechaISO(d);
}

let contador = 0;
const cl = (texto: string, hecho = false): ItemChecklist => ({ id: `c${++contador}`, texto, hecho });

type Semilla = Omit<Tarea, "fecha"> & { dias: number | null; col: ColumnaId };

const SEMILLA: Semilla[] = [
  {
    id: "t1",
    col: "ideas",
    titulo: "Campaña de primavera para Heladería Polar",
    descripcion: "Tres conceptos para vía pública y redes. Tono fresco, nada de clichés de flores.",
    etiquetas: ["branding", "redes"],
    responsable: "lf",
    dias: 12,
    prioridad: "media",
    checklist: [cl("Brief con Valentina"), cl("Tres rutas creativas"), cl("Moodboard por ruta")],
  },
  {
    id: "t2",
    col: "ideas",
    titulo: "Serie de reels detrás de escena del estudio",
    descripcion: "Contenido propio para Instagram: procesos, bocetos y el café de las 10.",
    etiquetas: ["video", "interno"],
    responsable: "co",
    dias: 20,
    prioridad: "baja",
    checklist: [],
  },
  {
    id: "t3",
    col: "ideas",
    titulo: "Propuesta de rebranding para Ferretería Del Cerro",
    descripcion: "Primer acercamiento: auditoría de marca y benchmark de 5 competidores.",
    etiquetas: ["branding", "cliente"],
    responsable: "vs",
    dias: 7,
    prioridad: "media",
    checklist: [cl("Relevar piezas actuales"), cl("Benchmark")],
  },
  {
    id: "t4",
    col: "curso",
    titulo: "Web de Bodega Cerro Azul: maquetado de home",
    descripcion: "Pasar el diseño aprobado a código. Ojo con el video de fondo en mobile.",
    etiquetas: ["web", "cliente"],
    responsable: "ta",
    dias: 2,
    prioridad: "alta",
    checklist: [cl("Header y navegación", true), cl("Hero con video", true), cl("Sección de vinos"), cl("Formulario de visitas"), cl("Pruebas en mobile")],
  },
  {
    id: "t5",
    col: "curso",
    titulo: "Manual de marca de Café Nómade",
    descripcion: "Versión final del manual: logo, paleta, tipografías, usos incorrectos y papelería.",
    etiquetas: ["branding"],
    responsable: "mr",
    dias: 5,
    prioridad: "media",
    checklist: [cl("Logo y variantes", true), cl("Paleta y tipografías", true), cl("Papelería"), cl("Exportar PDF")],
  },
  {
    id: "t6",
    col: "curso",
    titulo: "Grilla de octubre para Almacén de Barrio",
    descripcion: "12 posteos y 8 historias. Incluir la promo del aniversario.",
    etiquetas: ["redes", "cliente"],
    responsable: "co",
    dias: -1,
    prioridad: "alta",
    checklist: [cl("Calendario", true), cl("Textos", true), cl("Diseños"), cl("Aprobación")],
  },
  {
    id: "t7",
    col: "revision",
    titulo: "Packaging de la línea orgánica de Granja Los Aromos",
    descripcion: "Tres cajas y una etiqueta. Esperando comentarios del cliente sobre el verde.",
    etiquetas: ["branding", "cliente"],
    responsable: "lf",
    dias: 0,
    prioridad: "alta",
    checklist: [cl("Caja chica", true), cl("Caja mediana", true), cl("Caja grande", true), cl("Etiqueta frasco")],
  },
  {
    id: "t8",
    col: "revision",
    titulo: "Video institucional de 60 segundos",
    descripcion: "Primer corte listo. Falta la música con licencia y los subtítulos.",
    etiquetas: ["video"],
    responsable: "mr",
    dias: 4,
    prioridad: "media",
    checklist: [cl("Primer corte", true), cl("Música"), cl("Subtítulos")],
  },
  {
    id: "t9",
    col: "listo",
    titulo: "Landing de preventa para Estudio Pilates Norte",
    descripcion: "Publicada. Conectada al formulario y al píxel de campañas.",
    etiquetas: ["web", "cliente"],
    responsable: "ta",
    dias: -3,
    prioridad: "media",
    checklist: [cl("Diseño", true), cl("Desarrollo", true), cl("Publicación", true)],
  },
  {
    id: "t10",
    col: "listo",
    titulo: "Presentación de cierre de trimestre",
    descripcion: "Resultados de Q3 para el equipo. Ya se presentó el lunes.",
    etiquetas: ["interno"],
    responsable: "vs",
    dias: -6,
    prioridad: "baja",
    checklist: [cl("Números", true), cl("Slides", true)],
  },
];

export function crearTablero(): Tablero {
  const tareas: Record<string, Tarea> = {};
  const columnas: Record<ColumnaId, string[]> = { ideas: [], curso: [], revision: [], listo: [] };
  for (const s of SEMILLA) {
    const { dias, col, ...resto } = s;
    tareas[s.id] = { ...resto, checklist: resto.checklist.map((c) => ({ ...c })), fecha: dias === null ? "" : enDias(dias) };
    columnas[col].push(s.id);
  }
  return { version: 1, tareas, columnas };
}

export function esTablero(v: unknown): v is Tablero {
  if (!v || typeof v !== "object") return false;
  const t = v as Partial<Tablero>;
  if (t.version !== 1 || !t.tareas || !t.columnas) return false;
  return COLUMNAS.every((c) => Array.isArray(t.columnas?.[c.id]) && t.columnas[c.id].every((id) => typeof id === "string" && !!t.tareas?.[id]));
}

export function nuevaTareaVacia(): Tarea {
  return {
    id: `t${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    titulo: "",
    descripcion: "",
    etiquetas: [],
    responsable: null,
    fecha: "",
    prioridad: "media",
    checklist: [],
  };
}

export const persona = (id: string | null) => PERSONAS.find((p) => p.id === id) ?? null;
export const etiqueta = (id: string) => ETIQUETAS.find((e) => e.id === id);

/** Diferencia en días entre la fecha límite y hoy (negativo = vencida). */
export function diasHasta(fecha: string): number | null {
  if (!fecha) return null;
  const [y, m, d] = fecha.split("-").map(Number);
  if (!y || !m || !d) return null;
  const objetivo = new Date(y, m - 1, d, 12);
  const hoy = new Date();
  hoy.setHours(12, 0, 0, 0);
  return Math.round((objetivo.getTime() - hoy.getTime()) / 86_400_000);
}

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export function fechaCorta(fecha: string) {
  const [, m, d] = fecha.split("-").map(Number);
  if (!m || !d) return "";
  return `${d} ${MESES[m - 1]}`;
}
