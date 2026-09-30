export const site = {
  nombre: "Francisco Zago",
  nombreCorto: "Fran",
  rol: "Desarrollador full-stack",
  ubicacion: "Córdoba, Argentina",
  zonaHoraria: "America/Argentina/Cordoba",
  email: "zagofran1@gmail.com",
  whatsapp: "5493516822148",
  github: "https://github.com/FranZago1",
  linkedin: "https://www.linkedin.com/in/francisco-zago-ab1829357",
  // Usuario de Instagram (sin @). Si es null, el botón de Instagram no se muestra.
  instagram: "fran.zago" as string | null,
  // TODO: dominio definitivo (ej. "https://franciscozago.com"). Si no hay, se usa la URL de Vercel.
  dominio: null as string | null,
  disponible: true,
  titulo: "Francisco Zago — Desarrollo web en Córdoba",
  descripcion:
    "Diseño y desarrollo sitios, tiendas online y sistemas web para negocios de Córdoba y Argentina. Escribime por WhatsApp y armamos tu proyecto.",
} as const;

/** URL base del sitio para metadata, sitemap y OG. */
export function siteUrl(): string {
  if (site.dominio) return site.dominio;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function instagramUrl(): string | null {
  return site.instagram ? `https://www.instagram.com/${site.instagram}` : null;
}
