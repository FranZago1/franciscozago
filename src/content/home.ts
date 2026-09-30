/**
 * Textos del home. Los datos de trabajos, servicios, demos y stack viven en sus propios archivos.
 */

export type HeroChip = { src: string; alt: string };
export type HeroSegmento = string | { chip: HeroChip };

/**
 * Titular del hero. Los strings son texto; los objetos son chips de imagen inline.
 * TODO: cuando estén las capturas reales, usar una de TrendaHaus o BenicioShop en un chip.
 * Alternativas propuestas (ver docs/tokens.md):
 *  A) "Construyo [chip] sitios, tiendas y sistemas [chip] que hacen crecer tu negocio."
 *  B) "Tu negocio, [chip] online y vendiendo, [chip] con un sitio hecho a medida."
 */
export const heroTitular: HeroSegmento[] = [
  "Diseño y desarrollo",
  {
    chip: {
      src: "/demos/fotografia/documental/foto-01.webp",
      alt: "Miniatura de la demo de portfolio de fotografía estilo documental",
    },
  },
  "sitios y sistemas web",
  {
    chip: {
      src: "/demos/fotografia/cinematico/foto-02.webp",
      alt: "Miniatura de la demo de portfolio de fotografía estilo cinemático",
    },
  },
  "para negocios que quieren vender más.",
];

export const hero = {
  saludo: "Hola, soy Fran.",
  bajada:
    "Desarrollador full-stack en Córdoba. Landing pages, tiendas online, sistemas de reservas y más, desde la idea hasta el sitio publicado.",
  ctaPrimario: {
    label: "Escribime por WhatsApp",
    mensajeWa: "Hola Fran, vi tu portfolio y quiero consultarte por un proyecto.",
  },
  ctaSecundario: { label: "Ver demos", href: "#demos" },
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
