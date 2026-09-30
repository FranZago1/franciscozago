// Segunda Vuelta — contenido 100 % ficticio: avisos, vendedores, precios y conversaciones.

export type CategoriaId = "bicis" | "muebles" | "electronica" | "ropa" | "instrumentos";
export type Estado = "como-nuevo" | "muy-bueno" | "con-detalles";

export type Vendedor = { nombre: string; color: string; rating: number; ventas: number; desde: number; responde: string };

export type Aviso = {
  id: string;
  titulo: string;
  categoria: CategoriaId;
  precio: number;
  estado: Estado;
  barrio: string;
  /** Minutos desde que se publicó (para ordenar y mostrar "hace…"). */
  minutos: number;
  imagenes: { src: string; alt: string }[];
  descripcion: string;
  detalles: [string, string][];
  vendedor: Vendedor;
  aceptaOfertas: boolean;
  propio?: boolean;
};

export const categorias: { id: CategoriaId; nombre: string; color: string; texto: string }[] = [
  { id: "bicis", nombre: "Bicis", color: "#3DDC97", texto: "Urbanas, playeras y de montaña" },
  { id: "muebles", nombre: "Muebles", color: "#FF8A3D", texto: "Sillas, sillones y deco" },
  { id: "electronica", nombre: "Electrónica", color: "#4CC9F0", texto: "Audio, fotos y gadgets" },
  { id: "ropa", nombre: "Ropa", color: "#FF7AB6", texto: "Camperas, zapatillas y más" },
  { id: "instrumentos", nombre: "Instrumentos", color: "#FFE14D", texto: "Guitarras, teclados y batería" },
];

export const estados: { id: Estado; nombre: string; color: string }[] = [
  { id: "como-nuevo", nombre: "Como nuevo", color: "#3DDC97" },
  { id: "muy-bueno", nombre: "Muy bueno", color: "#4CC9F0" },
  { id: "con-detalles", nombre: "Con detalles", color: "#FFB067" },
];

export const barrios = ["Nueva Córdoba", "Güemes", "General Paz", "Alta Córdoba", "Cerro de las Rosas", "Alberdi", "San Vicente", "Jardín"];

const v = (nombre: string, color: string, rating: number, ventas: number, desde: number, responde: string): Vendedor => ({ nombre, color, rating, ventas, desde, responde });

const vendedores = {
  juli: v("Juli Paz", "#7B5CFF", 4.9, 34, 2021, "en minutos"),
  nico: v("Nico Ferrero", "#FF5CA8", 4.7, 12, 2023, "en 1 hora"),
  caro: v("Caro Suárez", "#FF8A3D", 5, 58, 2020, "en minutos"),
  tomi: v("Tomi Ledesma", "#3DDC97", 4.6, 7, 2024, "en el día"),
  meli: v("Meli Arias", "#4CC9F0", 4.8, 21, 2022, "en 1 hora"),
  fede: v("Fede Rojas", "#FFE14D", 4.9, 40, 2019, "en minutos"),
};

const img = (slug: string, alt: string) =>
  [1, 2, 3].map((i) => ({
    src: `/demos/marketplaces/usados/aviso-${slug}-${i}.webp`,
    alt: i === 1 ? alt : i === 2 ? `Detalle: ${alt.charAt(0).toLowerCase()}${alt.slice(1)}` : `${alt}, en un ambiente`,
  }));

export const avisos: Aviso[] = [
  {
    id: "sillon-pana",
    titulo: "Sillón individual de pana mostaza",
    categoria: "muebles",
    precio: 210000,
    estado: "como-nuevo",
    barrio: "Nueva Córdoba",
    minutos: 30,
    imagenes: img("sillon-pana", "Ilustración de un sillón individual de pana color mostaza con un almohadón violeta"),
    descripcion: "Lo compré hace un año y casi no se usó: me mudo a un monoambiente y no entra. Pana gruesa, estructura de madera y patas de paraíso.",
    detalles: [
      ["Medidas", "80 × 75 × 90 cm"],
      ["Material", "Pana y madera maciza"],
      ["Retiro", "Nueva Córdoba, 3er piso con ascensor"],
    ],
    vendedor: vendedores.caro,
    aceptaOfertas: true,
  },
  {
    id: "campera-de-jean",
    titulo: "Campera de jean oversize talle M",
    categoria: "ropa",
    precio: 38000,
    estado: "muy-bueno",
    barrio: "Nueva Córdoba",
    minutos: 65,
    imagenes: img("campera-de-jean", "Ilustración de una campera de jean azul con bolsillos y costuras amarillas"),
    descripcion: "Jean rígido, calce amplio. Tiene un parche rosa cosido a mano. Se usó una temporada.",
    detalles: [
      ["Talle", "M (calce oversize)"],
      ["Largo", "68 cm"],
      ["Envío", "Por moto a cargo del comprador"],
    ],
    vendedor: vendedores.juli,
    aceptaOfertas: true,
  },
  {
    id: "bici-urbana",
    titulo: "Bici urbana rodado 28 con canasto",
    categoria: "bicis",
    precio: 185000,
    estado: "muy-bueno",
    barrio: "Güemes",
    minutos: 120,
    imagenes: img("bici-urbana", "Ilustración de una bicicleta urbana verde con canasto de mimbre y guardabarros"),
    descripcion: "Cuadro de acero, cambios internos de 3 velocidades y canasto de mimbre. Cubiertas nuevas hace dos meses. Ideal para moverse por el centro.",
    detalles: [
      ["Rodado", "28"],
      ["Cuadro", "Talle M (1,60 a 1,80 m)"],
      ["Incluye", "Canasto, luces y candado"],
    ],
    vendedor: vendedores.juli,
    aceptaOfertas: true,
  },
  {
    id: "guitarra-criolla",
    titulo: "Guitarra criolla de estudio con funda",
    categoria: "instrumentos",
    precio: 120000,
    estado: "muy-bueno",
    barrio: "Cerro de las Rosas",
    minutos: 180,
    imagenes: img("guitarra-criolla", "Ilustración de una guitarra criolla de madera clara con boca violeta"),
    descripcion: "Guitarra de estudio con tapa de pino. Suena muy bien, tiene cuerdas nuevas. La vendo porque me pasé a la eléctrica.",
    detalles: [
      ["Tapa", "Pino macizo"],
      ["Incluye", "Funda acolchada y afinador"],
      ["Detalle", "Un raspón chico en el costado"],
    ],
    vendedor: vendedores.fede,
    aceptaOfertas: false,
  },
  {
    id: "tocadiscos",
    titulo: "Tocadiscos con parlantes incorporados",
    categoria: "electronica",
    precio: 150000,
    estado: "muy-bueno",
    barrio: "Alberdi",
    minutos: 240,
    imagenes: img("tocadiscos", "Ilustración de un tocadiscos de madera con un vinilo negro y etiqueta roja"),
    descripcion: "Valija de madera con tapa acrílica, 33 y 45 rpm, salida auxiliar. Púa cambiada. Te lo pruebo con un disco cuando lo venís a ver.",
    detalles: [
      ["Velocidades", "33 y 45 rpm"],
      ["Conexiones", "Salida auxiliar y RCA"],
      ["Funcionamiento", "Perfecto"],
    ],
    vendedor: vendedores.meli,
    aceptaOfertas: true,
  },
  {
    id: "silla-curvada",
    titulo: "Silla de madera curvada estilo Thonet",
    categoria: "muebles",
    precio: 45000,
    estado: "muy-bueno",
    barrio: "Cerro de las Rosas",
    minutos: 300,
    imagenes: img("silla-curvada", "Ilustración de una silla de madera curvada con asiento de esterilla"),
    descripcion: "Silla antigua restaurada, asiento de esterilla nuevo. Tengo dos iguales: si te llevás las dos te hago precio.",
    detalles: [
      ["Material", "Madera curvada y esterilla"],
      ["Cantidad", "2 disponibles"],
      ["Estado", "Restaurada en 2024"],
    ],
    vendedor: vendedores.caro,
    aceptaOfertas: true,
  },
  {
    id: "camara-analogica",
    titulo: "Cámara analógica 35 mm con lente 50 mm",
    categoria: "electronica",
    precio: 175000,
    estado: "muy-bueno",
    barrio: "Güemes",
    minutos: 360,
    imagenes: img("camara-analogica", "Ilustración de una cámara analógica plateada y negra con lente y correa rosa"),
    descripcion: "Cámara réflex manual, fotómetro funcionando. Lente 50 mm f/1.8 sin hongos. Te paso un rollo de regalo.",
    detalles: [
      ["Formato", "35 mm"],
      ["Lente", "50 mm f/1.8"],
      ["Incluye", "Correa, tapa y un rollo"],
    ],
    vendedor: vendedores.fede,
    aceptaOfertas: true,
  },
  {
    id: "zapatillas",
    titulo: "Zapatillas urbanas talle 40 (dos pares)",
    categoria: "ropa",
    precio: 60000,
    estado: "con-detalles",
    barrio: "General Paz",
    minutos: 480,
    imagenes: img("zapatillas", "Ilustración de dos pares de zapatillas urbanas, una violeta y otra rosa"),
    descripcion: "Dos pares talle 40, uno violeta y uno rosa. Tienen uso en la suela pero están limpias. Se venden juntas.",
    detalles: [
      ["Talle", "40 (25,5 cm)"],
      ["Cantidad", "2 pares"],
      ["Detalle", "Suela gastada en el talón"],
    ],
    vendedor: vendedores.nico,
    aceptaOfertas: true,
  },
  {
    id: "teclado-sinte",
    titulo: "Teclado sintetizador 37 teclas",
    categoria: "instrumentos",
    precio: 260000,
    estado: "como-nuevo",
    barrio: "Güemes",
    minutos: 720,
    imagenes: img("teclado-sinte", "Ilustración de un teclado sintetizador rosa con perillas amarillas y pantalla"),
    descripcion: "Sintetizador analógico con secuenciador. Lo usé en casa, nunca salió a tocar. Con fuente y caja original.",
    detalles: [
      ["Teclas", "37, sensibles a la velocidad"],
      ["Conexiones", "MIDI, USB y salida de línea"],
      ["Incluye", "Fuente y caja original"],
    ],
    vendedor: vendedores.meli,
    aceptaOfertas: false,
  },
  {
    id: "radio-vintage",
    titulo: "Radio vintage AM/FM con bluetooth",
    categoria: "electronica",
    precio: 52000,
    estado: "como-nuevo",
    barrio: "Jardín",
    minutos: 1440,
    imagenes: img("radio-vintage", "Ilustración de una radio vintage turquesa con parlante y perillas"),
    descripcion: "Estética retro pero con bluetooth y batería recargable. Fue un regalo repetido, se usó dos veces.",
    detalles: [
      ["Batería", "8 horas"],
      ["Conexiones", "Bluetooth y auxiliar"],
      ["Garantía", "Tiene la factura"],
    ],
    vendedor: vendedores.tomi,
    aceptaOfertas: true,
  },
  {
    id: "bici-mtb",
    titulo: "Mountain bike rodado 29, 21 cambios",
    categoria: "bicis",
    precio: 320000,
    estado: "con-detalles",
    barrio: "Alta Córdoba",
    minutos: 1500,
    imagenes: img("bici-mtb", "Ilustración de una mountain bike naranja con horquilla amarilla y cubiertas de taco"),
    descripcion: "Cuadro de aluminio, frenos a disco mecánicos y horquilla con suspensión. Tiene marcas de uso en el cuadro pero anda perfecta.",
    detalles: [
      ["Rodado", "29"],
      ["Cambios", "21 velocidades"],
      ["Frenos", "A disco mecánicos"],
    ],
    vendedor: vendedores.tomi,
    aceptaOfertas: true,
  },
  {
    id: "mesa-ratona",
    titulo: "Mesa ratona de madera, años 60",
    categoria: "muebles",
    precio: 95000,
    estado: "con-detalles",
    barrio: "San Vicente",
    minutos: 2880,
    imagenes: img("mesa-ratona", "Ilustración de una mesa ratona de madera con patas inclinadas, libros y una planta"),
    descripcion: "Mesa de los años 60 con patas cónicas. Tiene algunas marcas de vasos en la tapa; se puede lijar y quedaría impecable.",
    detalles: [
      ["Medidas", "110 × 50 × 42 cm"],
      ["Material", "Madera de guatambú"],
      ["Detalle", "Marcas en la tapa"],
    ],
    vendedor: vendedores.nico,
    aceptaOfertas: true,
  },
  {
    id: "mochila-lona",
    titulo: "Mochila de lona 25 L",
    categoria: "ropa",
    precio: 29000,
    estado: "como-nuevo",
    barrio: "Alta Córdoba",
    minutos: 2900,
    imagenes: img("mochila-lona", "Ilustración de una mochila de lona naranja con hebillas y bolsillo frontal"),
    descripcion: "Mochila de lona encerada con compartimento para notebook de 14 pulgadas. Sin uso, todavía tiene la etiqueta.",
    detalles: [
      ["Capacidad", "25 litros"],
      ["Notebook", "Hasta 14 pulgadas"],
      ["Estado", "Con etiqueta"],
    ],
    vendedor: vendedores.juli,
    aceptaOfertas: false,
  },
  {
    id: "lampara-de-pie",
    titulo: "Lámpara de pie trípode, pantalla coral",
    categoria: "muebles",
    precio: 68000,
    estado: "como-nuevo",
    barrio: "General Paz",
    minutos: 4320,
    imagenes: img("lampara-de-pie", "Ilustración de una lámpara de pie de tres patas de madera con pantalla coral"),
    descripcion: "Patas de madera y pantalla de tela coral. Usa lámpara E27 (te la dejo con una LED cálida).",
    detalles: [
      ["Altura", "1,55 m"],
      ["Lámpara", "E27, incluida"],
      ["Retiro", "General Paz, planta baja"],
    ],
    vendedor: vendedores.caro,
    aceptaOfertas: true,
  },
  {
    id: "redoblante",
    titulo: "Redoblante 14” con palillos",
    categoria: "instrumentos",
    precio: 88000,
    estado: "con-detalles",
    barrio: "San Vicente",
    minutos: 5760,
    imagenes: img("redoblante", "Ilustración de un redoblante rojo con parche blanco y dos palillos cruzados"),
    descripcion: "Redoblante de 14 × 5,5 con soporte y palillos. El parche de arriba necesita cambio, el resto está bien.",
    detalles: [
      ["Medida", "14 × 5,5 pulgadas"],
      ["Incluye", "Soporte y palillos"],
      ["Detalle", "Cambiar parche superior"],
    ],
    vendedor: vendedores.fede,
    aceptaOfertas: true,
  },
];

/** Fotos de ejemplo para "publicar" (simulan el rollo de la cámara). */
export const rollo = [
  { id: "patineta", src: "/demos/marketplaces/usados/rollo-patineta.webp", alt: "Ilustración de una patineta verde con ruedas amarillas" },
  { id: "maceta-monstera", src: "/demos/marketplaces/usados/rollo-maceta-monstera.webp", alt: "Ilustración de una planta en maceta naranja" },
  { id: "cafetera", src: "/demos/marketplaces/usados/rollo-cafetera.webp", alt: "Ilustración de una cafetera italiana de aluminio" },
  { id: "velador", src: "/demos/marketplaces/usados/rollo-velador.webp", alt: "Ilustración de un velador con base violeta y pantalla rosa" },
];

export const rangos: Record<CategoriaId, [number, number]> = {
  bicis: [120000, 350000],
  muebles: [30000, 220000],
  electronica: [40000, 200000],
  ropa: [15000, 70000],
  instrumentos: [60000, 280000],
};

export function haceTexto(min: number): string {
  if (min < 1) return "recién";
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? "hace 1 día" : `hace ${d} días`;
}

export const estadoPorId = Object.fromEntries(estados.map((e) => [e.id, e])) as Record<Estado, (typeof estados)[number]>;
export const categoriaPorId = Object.fromEntries(categorias.map((c) => [c.id, c])) as Record<CategoriaId, (typeof categorias)[number]>;
