import { Resend } from "resend";
import { contactSchema, erroresPorCampo, type ContactResponse } from "@/lib/contact-schema";

// Rate limit básico en memoria por IP: 5 envíos cada 10 minutos.
// Ojo: en serverless (Vercel) cada instancia tiene su propia memoria, así que el límite
// no es global. Alcanza para frenar abusos simples en v1; para algo robusto, usar Redis/KV.
const VENTANA_MS = 10 * 60 * 1000;
const MAX_ENVIOS = 5;
const envios = new Map<string, number[]>();

function limitado(ip: string): boolean {
  const ahora = Date.now();
  const recientes = (envios.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  if (recientes.length >= MAX_ENVIOS) {
    envios.set(ip, recientes);
    return true;
  }
  recientes.push(ahora);
  envios.set(ip, recientes);
  return false;
}

function json(body: ContactResponse, status = 200) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "No pude leer el formulario. Probá de nuevo." }, 400);
  }

  // Honeypot: si viene lleno es un bot. Respondemos 200 sin enviar nada.
  if (typeof body === "object" && body !== null && "empresa" in body && String(body.empresa).trim() !== "") {
    return json({ ok: true });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "desconocida";
  if (limitado(ip)) {
    return json(
      { ok: false, error: "Recibí varios mensajes seguidos desde tu conexión. Esperá unos minutos o escribime por WhatsApp." },
      429,
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const campos = erroresPorCampo(parsed.error);
    return json({ ok: false, error: Object.values(campos)[0] ?? "Revisá los datos del formulario.", campos }, 400);
  }
  const d = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("[contact] Faltan RESEND_API_KEY o CONTACT_TO_EMAIL");
    return json({ ok: false, error: "El formulario no está disponible en este momento." }, 503);
  }

  const texto = [
    `Nombre: ${d.nombre}`,
    `Email: ${d.email || "(no dejó)"}`,
    `WhatsApp: ${d.whatsapp || "(no dejó)"}`,
    `Tipo de proyecto: ${d.tipo}`,
    "",
    d.mensaje,
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      // Sin dominio verificado, Resend solo envía desde onboarding@resend.dev
      // y únicamente al email de la cuenta de Resend.
      from: "Portfolio <onboarding@resend.dev>",
      to,
      replyTo: d.email || undefined,
      subject: `Nuevo contacto: ${d.tipo} — ${d.nombre}`,
      text: texto,
    });
    if (error) {
      console.error("[contact] Resend respondió con error", error);
      return json({ ok: false, error: "No se pudo enviar el mensaje." }, 502);
    }
  } catch (e) {
    console.error("[contact] Error enviando con Resend", e);
    return json({ ok: false, error: "No se pudo enviar el mensaje." }, 502);
  }

  return json({ ok: true });
}
