import type { IconName } from "@/components/canvas/Icons";
import type { StickerColor } from "@/components/canvas/Sticker";

export type Servicio = {
  nombre: string;
  icono: IconName;
  color: StickerColor;
  linea: string;
  /** Caso real relacionado. */
  evidencia?: { label: string; href: string };
  /** Slug de la vertical de demos (/demos/<slug>), ver src/content/verticales.ts. */
  demos?: string;
};

export const servicios: Servicio[] = [
  {
    nombre: "Landing pages",
    demos: "landing",
    icono: "cursor",
    color: "mostaza",
    linea: "Una página pensada para que te contacten o te compren.",
  },
  {
    nombre: "E-commerce",
    demos: "ecommerce",
    icono: "tienda",
    color: "rosa",
    linea: "Tu tienda propia, con pagos por MercadoPago y stock controlado.",
    evidencia: { label: "Caso BenicioShop", href: "/trabajos/benicioshop" },
  },
  {
    nombre: "Marketplaces",
    demos: "marketplaces",
    icono: "mercado",
    color: "celeste",
    linea: "Una plataforma donde muchos vendedores publican y venden.",
  },
  {
    nombre: "Portfolios",
    icono: "camara",
    color: "menta",
    linea: "Tu trabajo presentado como se merece.",
    demos: "fotografia",
  },
  {
    nombre: "Web apps",
    demos: "web-apps",
    icono: "app",
    color: "choco",
    linea: "Herramientas a medida que se usan desde el navegador.",
    evidencia: { label: "Caso UniChat", href: "/trabajos/unichat" },
  },
  {
    nombre: "Dashboards",
    demos: "dashboards",
    icono: "grafico",
    color: "mostaza",
    linea: "Tus números en un solo lugar, siempre actualizados.",
  },
  {
    nombre: "Sistemas de gestión",
    demos: "gestion",
    icono: "gestion",
    color: "menta",
    linea: "Clientes, stock, pedidos o turnos, todo ordenado.",
  },
  {
    nombre: "Reservas",
    demos: "reservas",
    icono: "calendario",
    color: "celeste",
    linea: "Turnos online con disponibilidad en tiempo real.",
    evidencia: { label: "Caso TrendaHaus", href: "/trabajos/trendahaus" },
  },
  {
    nombre: "Catálogos",
    demos: "catalogos",
    icono: "catalogo",
    color: "rosa",
    linea: "Tus productos online, con consulta directa por WhatsApp.",
  },
];

/** Opciones del select "Tipo de proyecto" del formulario. */
export const tiposDeProyecto = [...servicios.map((s) => s.nombre), "Otro"] as const;
