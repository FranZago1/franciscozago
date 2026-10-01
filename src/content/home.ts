import type { IconName } from "@/components/canvas/Icons";
import type { StickerColor } from "@/components/canvas/Sticker";

/**
 * Textos del home. Los datos de trabajos, servicios, demos y stack viven en sus propios archivos.
 */

/** Segmento de titular: texto o ícono en línea (cuadradito de color). */
export type Segmento = string | { icono: IconName; bg: StickerColor };

export const hero = {
  saludo: "Hola, soy",
  disponible: "Disponible para proyectos",
  /** Titular principal. Los objetos son íconos en línea. */
  titular: ["Desarrollo sitios y sistemas web para negocios que quieren vender más."] as Segmento[],
  bajada: "Soluciones a medida, desde la idea hasta el producto publicado.",
  ctaPrimario: {
    label: "Escribime por WhatsApp",
    mensajeWa: "Hola Fran, vi tu portfolio y quiero consultarte por un proyecto.",
  },
  ctaSecundario: { label: "Ver demos", href: "#servicios" },
};

/** Stickers arrastrables del hero (flotan y rotan suave). Todo lo que dicen también está en la página. */
export const heroStickers = {
  rol: { texto: "Desarrollador full-stack", color: "menta" as StickerColor },
  estudiante: { texto: "Estudiante de Ingeniería", color: "ink" as StickerColor },
  disenio: { texto: "Diseño UI/UX", color: "rosa" as StickerColor },
  cursorIzq: { texto: "E-commerce", color: "mostaza" as StickerColor },
  cursorDer: { texto: "Reservas", color: "rosa" as StickerColor },
  portfolios: { texto: "Portfolios", color: "celeste" as StickerColor },
  dashboards: { texto: "Dashboards", color: "menta" as StickerColor },
  landing: { texto: "Landing pages", color: "mostaza" as StickerColor },
  webApps: { texto: "Web apps", color: "choco" as StickerColor },
};

/** Página "Sobre mí" (/sobre-mi). */
export const sobreMi = {
  titulo: "Sobre mí",
  intro:
    "Estudio Ingeniería en Sistemas y desarrollo sitios y aplicaciones web. Me gusta transformar ideas en productos digitales simples, funcionales y bien diseñados.",
  proceso:
    "Te acompaño durante todo el proceso: desde el diseño y desarrollo hasta tener tu producto publicado y funcionando con tu dominio personalizado.",
  personal:
    "Fuera del mundo de la tecnología, soy un apasionado de los deportes, disfruto pasar tiempo con amigos y siempre estoy buscando una oportunidad para viajar y conocer nuevos lugares.",
  fotos: [
    { src: "/sobre-mi/takayamajapon.webp", lugar: "Takayama, Japón", w: 1600, h: 1200 },
    { src: "/sobre-mi/edimburgoescocia.webp", lugar: "Edimburgo, Escocia", w: 900, h: 1200 },
    { src: "/sobre-mi/pointloboscalifornia.webp", lugar: "Point Lobos, California", w: 1600, h: 1061 },
    { src: "/sobre-mi/mauihawai.webp", lugar: "Maui, Hawái", w: 900, h: 1200 },
  ],
};

export const serviciosCopy = {
  titulo: "Qué puedo construirte",
  cierre: "Cada proyecto se presupuesta a medida. Contame qué necesitás y te respondo con una propuesta.",
  mensajeWa: "Hola Fran, quiero pedirte una propuesta para un proyecto.",
};

export const videosCopy = {
  titulo: "También hago videos de tu web",
  bajada:
    "Videos cortos con la interfaz de tu sitio o tu sistema en movimiento, para mostrarlo en redes, en tu web o en una presentación.",
  puntos: [
    "Con el diseño real de tu web, no con una plantilla.",
    "Música y sonidos sincronizados con cada movimiento.",
    "En formato cuadrado, vertical u horizontal.",
  ],
  mensajeWa: "Hola Fran, vi el video de tu portfolio y quiero uno para mi web.",
  nota: "Ejemplo hecho para este portfolio.",
};

export const contactoCopy = {
  titulo: "Hablemos",
  linea: "Contame tu idea y te respondo en el día.",
  mensajeWa: "Hola Fran, vi tu portfolio y quiero consultarte por un proyecto.",
  asuntoEmail: "Consulta desde tu portfolio",
};
