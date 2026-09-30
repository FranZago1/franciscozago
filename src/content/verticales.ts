import { verticales as verticalesFoto } from "./demos";

/**
 * Registro de todas las demos, agrupadas por vertical (una por servicio).
 * Cada demo vive en /demos/<vertical>/<slug> y su captura en /public/demos/<vertical>/<slug>/captura.webp
 * (se genera con `node scripts/capturas-demos.mjs`).
 *
 * Todo el contenido de las demos es FICTICIO: negocios, personas, productos, precios y reseñas.
 */

export type DemoCard = {
  slug: string;
  /** Nombre del estilo (ej. "Impacto"). */
  nombre: string;
  /** Negocio ficticio que protagoniza la demo. */
  negocio: string;
  /** Para qué tipo de cliente sirve. */
  para: string;
  /** Una línea que describe el estilo y lo que muestra. */
  linea: string;
};

export type VerticalInfo = {
  slug: string;
  /** Nombre del servicio en src/content/servicios.ts */
  servicio: string;
  titulo: string;
  bajada: string;
  /** Mensaje precargado del botón de WhatsApp de la pantalla de demos. */
  mensajeWa: string;
  /** Texto del botón de WhatsApp de la pantalla de demos. */
  cta: string;
  demos: DemoCard[];
};

const foto = verticalesFoto[0]!;

export const verticalesInfo: VerticalInfo[] = [
  {
    slug: "landing",
    servicio: "Landing pages",
    titulo: "Landing pages. Elegí un estilo.",
    bajada:
      "Tres páginas de ejemplo para negocios distintos, cada una pensada para que te escriban o te compren. Navegalas como si fueras un cliente.",
    mensajeWa: "Hola Fran, vi las demos de landing pages y quiero una para mi negocio.",
    cta: "Quiero una landing así",
    demos: [
      {
        slug: "impacto",
        nombre: "Impacto",
        negocio: "Fuerza Norte, box de entrenamiento",
        para: "Gimnasios, deportes y marcas con energía",
        linea: "Oscura, tipografía gigante y un llamado a la acción imposible de ignorar.",
      },
      {
        slug: "sereno",
        nombre: "Sereno",
        negocio: "Alma Clara, centro de estética",
        para: "Salud, bienestar y servicios profesionales",
        linea: "Serif elegante, tonos suaves y mucho aire. Transmite confianza y calma.",
      },
      {
        slug: "tech",
        nombre: "Tech",
        negocio: "Cuentaclara, app de facturación",
        para: "Apps, software y productos digitales",
        linea: "Producto al frente, beneficios claros y una prueba gratis a un click.",
      },
    ],
  },
  {
    slug: "ecommerce",
    servicio: "E-commerce",
    titulo: "Tiendas online. Elegí un estilo.",
    bajada:
      "Tres tiendas de ejemplo con carrito que funciona: agregá productos, cambiá talles y llegá hasta el checkout.",
    mensajeWa: "Hola Fran, vi las demos de tiendas online y quiero una para mi marca.",
    cta: "Quiero una tienda así",
    demos: [
      {
        slug: "urbano",
        nombre: "Urbano",
        negocio: "Pampa Club, ropa urbana",
        para: "Marcas de ropa, zapatillas y drops",
        linea: "Grilla bold, drop con cuenta regresiva y talles al instante.",
      },
      {
        slug: "natural",
        nombre: "Natural",
        negocio: "Hoja & Barro, cosmética natural",
        para: "Cosmética, bienestar y productos artesanales",
        linea: "Suave y cálida, con rutinas armadas e ingredientes a la vista.",
      },
      {
        slug: "tech-store",
        nombre: "Tech store",
        negocio: "Voltio, electrónica",
        para: "Tecnología, electro y productos con especificaciones",
        linea: "Filtros, comparador lado a lado y fichas técnicas claras.",
      },
    ],
  },
  {
    slug: "marketplaces",
    servicio: "Marketplaces",
    titulo: "Marketplaces. Elegí un estilo.",
    bajada:
      "Tres plataformas de ejemplo donde muchos vendedores o profesionales publican y los clientes comparan, eligen y contactan.",
    mensajeWa: "Hola Fran, vi las demos de marketplaces y tengo una idea para armar uno.",
    cta: "Quiero un marketplace así",
    demos: [
      {
        slug: "productores",
        nombre: "Productores",
        negocio: "Del Valle Mercado, productores locales",
        para: "Alimentos, productores y comercio de cercanía",
        linea: "Cada productor con su tienda y un carrito que junta pedidos de varios.",
      },
      {
        slug: "oficios",
        nombre: "Oficios",
        negocio: "ManoAmiga, profesionales de oficios",
        para: "Servicios, profesionales y turnos a domicilio",
        linea: "Perfiles con reseñas, filtros por zona y pedido de presupuesto.",
      },
      {
        slug: "usados",
        nombre: "Usados",
        negocio: "Segunda Vuelta, compra y venta de usados",
        para: "Clasificados, usados y comunidades",
        linea: "Avisos con filtros, favoritos y publicación en tres pasos.",
      },
    ],
  },
  {
    slug: "fotografia",
    servicio: "Portfolios",
    titulo: foto.titulo,
    bajada: foto.bajada,
    mensajeWa: "Hola Fran, vi las demos de portfolio de fotografía y quiero uno para mí.",
    cta: "Quiero un portfolio así",
    demos: foto.demos.map((d) => ({
      slug: d.slug,
      nombre: d.nombre,
      negocio: `${d.fotografo.nombre}, fotografía`,
      para: d.para,
      linea: d.linea,
    })),
  },
  {
    slug: "web-apps",
    servicio: "Web apps",
    titulo: "Web apps. Probalas.",
    bajada:
      "Tres herramientas de ejemplo que funcionan en el navegador. No son capturas: podés usarlas de verdad.",
    mensajeWa: "Hola Fran, vi las demos de web apps y necesito una herramienta a medida.",
    cta: "Quiero una herramienta así",
    demos: [
      {
        slug: "tablero",
        nombre: "Tablero",
        negocio: "Estudio Brújula, agencia creativa",
        para: "Equipos que organizan tareas y proyectos",
        linea: "Kanban con arrastrar y soltar, etiquetas y filtros. Se guarda solo.",
      },
      {
        slug: "cotizador",
        nombre: "Cotizador",
        negocio: "Obra Fina, reformas y construcción",
        para: "Negocios que presupuestan a medida",
        linea: "Presupuesto paso a paso con cálculo en vivo y resumen listo para enviar.",
      },
      {
        slug: "asistente",
        nombre: "Asistente",
        negocio: "Consorcio Torre Alameda",
        para: "Consultas sobre tus propios documentos",
        linea: "Chat con IA que responde con tus reglamentos y cita las fuentes.",
      },
    ],
  },
  {
    slug: "dashboards",
    servicio: "Dashboards",
    titulo: "Dashboards. Tus números, claros.",
    bajada:
      "Tres tableros de ejemplo con datos ficticios. Cambiá el período, pasá el mouse por los gráficos y filtrá.",
    mensajeWa: "Hola Fran, vi las demos de dashboards y quiero ver mis números así.",
    cta: "Quiero un dashboard así",
    demos: [
      {
        slug: "ventas",
        nombre: "Ventas",
        negocio: "Tienda Almacén Norte",
        para: "Tiendas online y comercios",
        linea: "Ventas, ticket promedio y productos estrella de un vistazo.",
      },
      {
        slug: "ocupacion",
        nombre: "Ocupación",
        negocio: "Complejo Punto Alto",
        para: "Gimnasios, clubes y espacios con horarios",
        linea: "Mapa de calor por día y hora para saber cuándo se llena.",
      },
      {
        slug: "finanzas",
        nombre: "Finanzas",
        negocio: "Taller Ceibo",
        para: "Pymes que quieren ordenar su plata",
        linea: "Ingresos, gastos y caja proyectada en modo oscuro.",
      },
    ],
  },
  {
    slug: "gestion",
    servicio: "Sistemas de gestión",
    titulo: "Sistemas de gestión. Todo ordenado.",
    bajada:
      "Tres sistemas de ejemplo para el día a día: clientes, stock y pedidos. Agregá, editá y mové cosas: todo funciona.",
    mensajeWa: "Hola Fran, vi las demos de sistemas de gestión y quiero ordenar mi negocio.",
    cta: "Quiero un sistema así",
    demos: [
      {
        slug: "clientes",
        nombre: "Clientes",
        negocio: "Inmobiliaria Portal Sur",
        para: "Ventas, seguimiento y atención de clientes",
        linea: "Embudo de ventas, ficha de cada cliente y próximas acciones.",
      },
      {
        slug: "stock",
        nombre: "Stock",
        negocio: "Ferretería El Tornillo",
        para: "Comercios con inventario",
        linea: "Alertas de stock bajo, ajustes rápidos e historial de movimientos.",
      },
      {
        slug: "pedidos",
        nombre: "Pedidos",
        negocio: "Parrilla La Brasa",
        para: "Restaurantes, cafés y deliveries",
        linea: "Comandas por estado, tiempos en vivo y pantalla para la cocina.",
      },
    ],
  },
  {
    slug: "reservas",
    servicio: "Reservas",
    titulo: "Reservas online. Elegí un estilo.",
    bajada:
      "Tres sistemas de turnos de ejemplo. Elegí un servicio, un día y un horario, y llegá hasta la confirmación.",
    mensajeWa: "Hola Fran, vi las demos de reservas y quiero turnos online para mi negocio.",
    cta: "Quiero reservas así",
    demos: [
      {
        slug: "barberia",
        nombre: "Barbería",
        negocio: "Barbería Don Filo",
        para: "Peluquerías, estética y consultorios",
        linea: "Servicio, profesional, día y hora en un flujo corto y claro.",
      },
      {
        slug: "canchas",
        nombre: "Canchas",
        negocio: "Pádel Club Sierras",
        para: "Canchas, salas y espacios por hora",
        linea: "Grilla de canchas y horarios con disponibilidad a la vista.",
      },
      {
        slug: "cabanas",
        nombre: "Cabañas",
        negocio: "Cabañas Arroyo Manso",
        para: "Alojamientos, cabañas y alquileres temporarios",
        linea: "Calendario de fechas, huéspedes y total calculado al instante.",
      },
    ],
  },
  {
    slug: "catalogos",
    servicio: "Catálogos",
    titulo: "Catálogos online. Elegí un estilo.",
    bajada:
      "Tres catálogos de ejemplo con consulta directa por WhatsApp: armá tu lista y mirá cómo le llega el pedido al negocio.",
    mensajeWa: "Hola Fran, vi las demos de catálogos y quiero uno para mis productos.",
    cta: "Quiero un catálogo así",
    demos: [
      {
        slug: "deco",
        nombre: "Deco",
        negocio: "Nido, muebles y objetos",
        para: "Muebles, decoración y diseño",
        linea: "Editorial, con ambientes y fichas de producto que invitan a consultar.",
      },
      {
        slug: "mayorista",
        nombre: "Mayorista",
        negocio: "Distribuidora Ruta 9",
        para: "Distribuidoras y ventas por cantidad",
        linea: "Lista densa, búsqueda rápida y pedido armado por WhatsApp.",
      },
      {
        slug: "vinoteca",
        nombre: "Vinoteca",
        negocio: "Cava Aldea, vinoteca",
        para: "Vinos, gourmet y productos premium",
        linea: "Oscura y elegante, con filtros por cepa, región y maridaje.",
      },
    ],
  },
];

export function getVertical(slug: string): VerticalInfo | undefined {
  return verticalesInfo.find((v) => v.slug === slug);
}

export function getVerticalPorServicio(servicio: string): VerticalInfo | undefined {
  return verticalesInfo.find((v) => v.servicio === servicio);
}

export function capturaDemo(vertical: string, slug: string): string {
  return `/demos/${vertical}/${slug}/captura.webp`;
}
