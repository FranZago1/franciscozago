import { site } from "@/content/site";

/** Link de WhatsApp con mensaje precargado. Único lugar donde se arma el wa.me. */
export function waLink(mensaje: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}
