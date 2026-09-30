import { responder } from "./motor";

export type Mensaje = {
  id: string;
  rol: "usuario" | "asistente";
  texto: string;
  hora: number;
  fuentes?: string[];
  relacionadas?: string[];
  feedback?: "bien" | "mal" | null;
  detenida?: boolean;
};

export type Conversacion = { id: string; titulo: string; mensajes: Mensaje[]; actualizada: number };
export type EstadoChat = { version: 1; conversaciones: Conversacion[]; activa: string };

export const nuevoId = (p: string) => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** Fecha fija dentro del día (hora y minutos) para que servidor y cliente coincidan. */
function haceDias(dias: number, h: number, m: number) {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  d.setHours(h, m, 0, 0);
  return d.getTime();
}

function charla(id: string, titulo: string, dias: number, h: number, preguntas: string[]): Conversacion {
  const mensajes: Mensaje[] = [];
  preguntas.forEach((q, i) => {
    const r = responder(q);
    const t = haceDias(dias, h, 10 + i * 3);
    mensajes.push({ id: `${id}-u${i}`, rol: "usuario", texto: q, hora: t });
    mensajes.push({ id: `${id}-a${i}`, rol: "asistente", texto: r.texto, hora: t + 20_000, fuentes: r.fuentes, relacionadas: r.relacionadas, feedback: null });
  });
  return { id, titulo, mensajes, actualizada: haceDias(dias, h, 10 + preguntas.length * 3) };
}

export function crearEstado(): EstadoChat {
  return {
    version: 1,
    activa: "c-nueva",
    conversaciones: [
      { id: "c-nueva", titulo: "Nueva conversación", mensajes: [], actualizada: haceDias(0, 9, 0) },
      charla("c-obras", "Obras y mudanza", 1, 18, ["¿Puedo hacer obras un sábado?", "¿Cómo organizo una mudanza?"]),
      charla("c-sum", "Cumpleaños en el SUM", 3, 11, ["¿Cómo reservo el SUM?"]),
      charla("c-exp", "Aumento de expensas", 6, 20, ["¿Por qué aumentaron las expensas?"]),
    ],
  };
}

export function esEstado(v: unknown): v is EstadoChat {
  if (!v || typeof v !== "object") return false;
  const e = v as Partial<EstadoChat>;
  return (
    e.version === 1 &&
    typeof e.activa === "string" &&
    Array.isArray(e.conversaciones) &&
    e.conversaciones.every((c) => c && typeof c.id === "string" && Array.isArray(c.mensajes))
  );
}

export function tituloDesde(texto: string) {
  const t = texto.replace(/\s+/g, " ").replace(/^¿/, "").replace(/\?$/, "").trim();
  const cap = t.charAt(0).toUpperCase() + t.slice(1);
  return cap.length > 42 ? `${cap.slice(0, 40).trimEnd()}…` : cap;
}

export function fechaRelativa(ms: number) {
  const d = new Date(ms);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const dia = new Date(d);
  dia.setHours(0, 0, 0, 0);
  const dif = Math.round((hoy.getTime() - dia.getTime()) / 86_400_000);
  if (dif <= 0) return "Hoy";
  if (dif === 1) return "Ayer";
  if (dif < 7) return `Hace ${dif} días`;
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

export function horaCorta(ms: number) {
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
