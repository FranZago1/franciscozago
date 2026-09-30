import type { IconName } from "@/components/canvas/Icons";
import type { StickerColor } from "@/components/canvas/Sticker";

/**
 * Textos del home. Los datos de trabajos, servicios, demos y stack viven en sus propios archivos.
 */

/** Segmento de titular: texto o ícono en línea (cuadradito de color). */
export type Segmento = string | { icono: IconName; bg: StickerColor };

export const hero = {
  saludo: "Hola, me llamo",
  disponible: "Disponible para proyectos",
  /** Titular principal. Los objetos son íconos en línea. */
  titular: [
    "Diseño y desarrollo",
    { icono: "pluma", bg: "menta" },
    "sitios y sistemas web",
    { icono: "chispa", bg: "rosa" },
    "para negocios que quieren vender más.",
  ] as Segmento[],
  bajada:
    "Desarrollador full-stack en Córdoba. Landing pages, tiendas online, sistemas de reservas y más, desde la idea hasta el sitio publicado.",
  ctaPrimario: {
    label: "Escribime por WhatsApp",
    mensajeWa: "Hola Fran, vi tu portfolio y quiero consultarte por un proyecto.",
  },
  ctaSecundario: { label: "Ver trabajos", href: "#trabajos" },
};

/** Stickers arrastrables del hero. Todo lo que dicen también está en el texto de la página. */
export const heroStickers = {
  rol: { texto: "Desarrollador full-stack", color: "menta" as StickerColor },
  lugar: { texto: "Córdoba, Argentina", color: "celeste" as StickerColor },
  cursorIzq: { texto: "E-commerce", color: "mostaza" as StickerColor },
  cursorDer: { texto: "Reservas", color: "rosa" as StickerColor },
  dato: { texto: "2 sitios en producción", color: "choco" as StickerColor },
};

export const serviciosCopy = {
  titulo: "Qué puedo construirte",
  cierre: "Cada proyecto se presupuesta a medida. Contame qué necesitás y te respondo con una propuesta.",
  mensajeWa: "Hola Fran, quiero pedirte una propuesta para un proyecto.",
};

export const contactoCopy = {
  titulo: "Hablemos",
  // TODO: confirmar que se puede cumplir "te respondo en el día"; si no, cambiar esta línea.
  linea: "Contame tu idea y te respondo en el día.",
  mensajeWa: "Hola Fran, vi tu portfolio y quiero consultarte por un proyecto.",
  asuntoEmail: "Consulta desde tu portfolio",
};
