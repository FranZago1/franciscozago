export type Servicio = {
  nombre: string;
  linea: string;
  evidencia?: { label: string; href: string };
};

export const servicios: Servicio[] = [
  { nombre: "Landing pages", linea: "Una página pensada para que te contacten o te compren." },
  {
    nombre: "E-commerce",
    linea: "Tu tienda propia, con pagos por MercadoPago y stock controlado.",
    evidencia: { label: "Mirá el caso BenicioShop", href: "/trabajos/benicioshop" },
  },
  { nombre: "Marketplaces", linea: "Una plataforma donde muchos vendedores publican y venden." },
  {
    nombre: "Portfolios",
    linea: "Tu trabajo presentado como se merece.",
    evidencia: { label: "Mirá las demos", href: "/#demos" },
  },
  {
    nombre: "Web apps",
    linea: "Herramientas a medida que se usan desde el navegador.",
    evidencia: { label: "Mirá el caso UniChat", href: "/trabajos/unichat" },
  },
  { nombre: "Dashboards", linea: "Tus números en un solo lugar, siempre actualizados." },
  { nombre: "Sistemas de gestión", linea: "Clientes, stock, pedidos o turnos, todo ordenado." },
  {
    nombre: "Reservas",
    linea: "Turnos online con disponibilidad en tiempo real.",
    evidencia: { label: "Mirá el caso TrendaHaus", href: "/trabajos/trendahaus" },
  },
  { nombre: "Catálogos", linea: "Tus productos online, con consulta directa por WhatsApp." },
];

/** Opciones del select "Tipo de proyecto" del formulario. */
export const tiposDeProyecto = [...servicios.map((s) => s.nombre), "Otro"] as const;
