import { z } from "zod";
import { tiposDeProyecto } from "@/content/servicios";

const opcional = (max: number) => z.string().trim().max(max, "Es demasiado largo").optional().default("");

/** Esquema compartido por el formulario (cliente) y el Route Handler (servidor). */
export const contactSchema = z
  .object({
    nombre: z.string({ error: "Falta tu nombre" }).trim().min(1, "Falta tu nombre").max(100, "El nombre es demasiado largo"),
    email: opcional(200).refine((v) => v === "" || z.email().safeParse(v).success, "Ese email no parece válido"),
    whatsapp: opcional(40).refine((v) => {
      if (v === "") return true;
      const digitos = v.replace(/\D/g, "");
      return /^[\d\s()+-]+$/.test(v) && digitos.length >= 8 && digitos.length <= 15;
    }, "Ese número de WhatsApp no parece válido"),
    tipo: z
      .string()
      .optional()
      .default("")
      .refine((v) => (tiposDeProyecto as readonly string[]).includes(v), "Elegí un tipo de proyecto"),
    mensaje: z
      .string({ error: "Contame un poco más sobre el proyecto (mínimo 10 caracteres)" })
      .trim()
      .min(10, "Contame un poco más sobre el proyecto (mínimo 10 caracteres)")
      .max(3000, "El mensaje es demasiado largo (máximo 3000 caracteres)"),
    // Honeypot: los humanos no lo ven ni lo completan.
    empresa: z.string().optional().default(""),
  })
  .refine((d) => d.email !== "" || d.whatsapp !== "", {
    message: "Falta tu email o tu WhatsApp",
    path: ["email"],
  });

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
export type ContactField = "nombre" | "email" | "whatsapp" | "tipo" | "mensaje";

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: string; campos?: Partial<Record<ContactField, string>> };

/** Primer mensaje de error por campo, para mostrar debajo de cada input. */
export function erroresPorCampo(error: z.ZodError): Partial<Record<ContactField, string>> {
  const out: Partial<Record<ContactField, string>> = {};
  for (const issue of error.issues) {
    const campo = issue.path[0] as ContactField | undefined;
    if (campo && !out[campo]) out[campo] = issue.message;
  }
  return out;
}
