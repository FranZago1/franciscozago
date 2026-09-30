/* Cava Aldea: carta de vinos ficticia. Bodegas, etiquetas, notas y precios inventados. */

export type Tipo = "tinto" | "blanco" | "rosado" | "espumante";
export type Region = "calchaqui" | "famatina" | "tulum" | "lujan" | "uco" | "patagonia";
export type Maridaje = "carnes" | "pastas" | "quesos" | "pescados" | "aves" | "picadas" | "postres" | "especiada";

/** Perfil de 0 a 5 para el gráfico de radar. */
export type Perfil = { cuerpo: number; taninos: number; acidez: number; fruta: number; madera: number; dulzor: number };

export type Vino = {
  id: string;
  nombre: string;
  bodega: string;
  cepa: string;
  /** Cepa para filtrar (agrupa variantes como "Malbec de altura"). */
  cepaFiltro: string;
  tipo: Tipo;
  region: Region;
  anio: string;
  precio: number | null;
  maridajes: Maridaje[];
  perfil: Perfil;
  notas: { vista: string; nariz: string; boca: string };
  crianza: string;
  alcohol: string;
  servicio: string;
  capsula: string;
  destacado?: string;
};

/** x/y: posición en el mapa estilizado (viewBox 0 0 340 366, ver Mapa.tsx). */
export const REGIONES: { id: Region; nombre: string; provincia: string; altura: string; x: number; y: number }[] = [
  { id: "calchaqui", nombre: "Valles Calchaquíes", provincia: "Salta", altura: "1.700 a 3.000 m", x: 119, y: 86 },
  { id: "famatina", nombre: "Valle de Famatina", provincia: "La Rioja", altura: "900 a 1.400 m", x: 93, y: 136 },
  { id: "tulum", nombre: "Valle de Tulum", provincia: "San Juan", altura: "600 a 1.400 m", x: 76, y: 178 },
  { id: "lujan", nombre: "Luján de Cuyo", provincia: "Mendoza", altura: "900 a 1.100 m", x: 73, y: 204 },
  { id: "uco", nombre: "Valle de Uco", provincia: "Mendoza", altura: "1.000 a 1.600 m", x: 59, y: 226 },
  { id: "patagonia", nombre: "Patagonia", provincia: "Neuquén y Río Negro", altura: "250 a 400 m", x: 83, y: 305 },
];

export const MARIDAJES: { id: Maridaje; nombre: string }[] = [
  { id: "carnes", nombre: "Carnes rojas" },
  { id: "pastas", nombre: "Pastas" },
  { id: "quesos", nombre: "Quesos" },
  { id: "picadas", nombre: "Picadas" },
  { id: "aves", nombre: "Aves" },
  { id: "pescados", nombre: "Pescados" },
  { id: "especiada", nombre: "Cocina especiada" },
  { id: "postres", nombre: "Postres" },
];

export const TIPOS: { id: Tipo; nombre: string }[] = [
  { id: "tinto", nombre: "Tintos" },
  { id: "blanco", nombre: "Blancos" },
  { id: "rosado", nombre: "Rosados" },
  { id: "espumante", nombre: "Espumantes" },
];

export const EJES: { k: keyof Perfil; nombre: string }[] = [
  { k: "cuerpo", nombre: "Cuerpo" },
  { k: "taninos", nombre: "Taninos" },
  { k: "acidez", nombre: "Acidez" },
  { k: "fruta", nombre: "Fruta" },
  { k: "madera", nombre: "Madera" },
  { k: "dulzor", nombre: "Dulzor" },
];

export const VINOS: Vino[] = [
  {
    id: "arce-malbec",
    nombre: "Arce",
    bodega: "Finca Lucía Arce",
    cepa: "Malbec",
    cepaFiltro: "Malbec",
    tipo: "tinto",
    region: "uco",
    anio: "2022",
    precio: 18500,
    maridajes: ["carnes", "pastas", "picadas"],
    perfil: { cuerpo: 3.5, taninos: 3, acidez: 3, fruta: 4.5, madera: 2, dulzor: 1 },
    notas: {
      vista: "Rojo violáceo, brillante y profundo.",
      nariz: "Ciruela, violetas y un toque de pimienta blanca.",
      boca: "Fresco y jugoso, taninos amables y final largo.",
    },
    crianza: "30 % en roble francés por 8 meses",
    alcohol: "13,8 %",
    servicio: "16 a 17 °C",
    capsula: "#6E1423",
    destacado: "El más elegido",
  },
  {
    id: "ventisca-reserva-malbec",
    nombre: "Ventisca Reserva",
    bodega: "Bodega Ventisca",
    cepa: "Malbec",
    cepaFiltro: "Malbec",
    tipo: "tinto",
    region: "lujan",
    anio: "2020",
    precio: 32000,
    maridajes: ["carnes", "quesos"],
    perfil: { cuerpo: 4.5, taninos: 4, acidez: 2.5, fruta: 4, madera: 4, dulzor: 1 },
    notas: {
      vista: "Rojo rubí intenso con reflejos negros.",
      nariz: "Frutos negros maduros, cacao y vainilla.",
      boca: "Amplio y sedoso, con taninos firmes y final especiado.",
    },
    crianza: "14 meses en roble francés de primer y segundo uso",
    alcohol: "14,5 %",
    servicio: "17 a 18 °C",
    capsula: "#151313",
  },
  {
    id: "cerro-callado-cabernet-franc",
    nombre: "Cerro Callado",
    bodega: "Cerro Callado",
    cepa: "Cabernet Franc",
    cepaFiltro: "Cabernet Franc",
    tipo: "tinto",
    region: "uco",
    anio: "2021",
    precio: 27800,
    maridajes: ["carnes", "aves", "especiada"],
    perfil: { cuerpo: 3.5, taninos: 3.5, acidez: 3.5, fruta: 3.5, madera: 2.5, dulzor: 0.5 },
    notas: {
      vista: "Rojo granate de capa media.",
      nariz: "Pimiento asado, frambuesa y hierbas de monte.",
      boca: "Tenso y vibrante, con taninos finos y final herbal.",
    },
    crianza: "12 meses en fudres de roble",
    alcohol: "13,9 %",
    servicio: "16 °C",
    capsula: "#1F2A44",
    destacado: "Nuevo en la cava",
  },
  {
    id: "tierra-quieta-bonarda",
    nombre: "Tierra Quieta",
    bodega: "Tierra Quieta",
    cepa: "Bonarda",
    cepaFiltro: "Bonarda",
    tipo: "tinto",
    region: "lujan",
    anio: "2023",
    precio: 12900,
    maridajes: ["pastas", "picadas"],
    perfil: { cuerpo: 2.5, taninos: 2, acidez: 3, fruta: 5, madera: 0.5, dulzor: 1 },
    notas: {
      vista: "Violeta profundo, casi negro en el centro.",
      nariz: "Cereza negra, higo y un recuerdo floral.",
      boca: "Liviano, frutado y muy fácil de tomar. Para el día a día.",
    },
    crianza: "Sin paso por madera",
    alcohol: "13,2 %",
    servicio: "14 a 15 °C",
    capsula: "#C0563A",
  },
  {
    id: "medano-syrah",
    nombre: "Médano",
    bodega: "Bodega Médano",
    cepa: "Syrah",
    cepaFiltro: "Syrah",
    tipo: "tinto",
    region: "tulum",
    anio: "2021",
    precio: 15400,
    maridajes: ["carnes", "especiada", "picadas"],
    perfil: { cuerpo: 4, taninos: 3.5, acidez: 2.5, fruta: 4, madera: 2.5, dulzor: 1 },
    notas: {
      vista: "Rojo púrpura, denso.",
      nariz: "Moras, aceitunas negras y pimienta negra recién molida.",
      boca: "Carnoso y especiado, con un final cálido.",
    },
    crianza: "10 meses en roble americano",
    alcohol: "14,2 %",
    servicio: "16 a 17 °C",
    capsula: "#2A1A14",
  },
  {
    id: "paso-nubes-torrontes",
    nombre: "Paso de las Nubes",
    bodega: "Paso de las Nubes",
    cepa: "Torrontés",
    cepaFiltro: "Torrontés",
    tipo: "blanco",
    region: "calchaqui",
    anio: "2024",
    precio: 13200,
    maridajes: ["pescados", "especiada", "quesos"],
    perfil: { cuerpo: 2, taninos: 0, acidez: 4, fruta: 4.5, madera: 0, dulzor: 1.5 },
    notas: {
      vista: "Amarillo pálido con reflejos verdosos.",
      nariz: "Jazmín, rosas blancas, durazno y cáscara de limón.",
      boca: "Seco, aromático y refrescante. Final floral.",
    },
    crianza: "En tanque de acero sobre sus lías",
    alcohol: "13 %",
    servicio: "8 a 10 °C",
    capsula: "#C9A55A",
  },
  {
    id: "altura-2300-malbec",
    nombre: "Altura 2300",
    bodega: "Paso de las Nubes",
    cepa: "Malbec de altura",
    cepaFiltro: "Malbec",
    tipo: "tinto",
    region: "calchaqui",
    anio: "2021",
    precio: 36500,
    maridajes: ["carnes", "quesos"],
    perfil: { cuerpo: 4.5, taninos: 4.5, acidez: 3.5, fruta: 4, madera: 3.5, dulzor: 0.5 },
    notas: {
      vista: "Rojo negro, de capa alta.",
      nariz: "Cassis, grafito, pimentón dulce y hierbas secas.",
      boca: "Concentrado y firme, con una acidez que lo estira. Para guardar.",
    },
    crianza: "16 meses en roble francés",
    alcohol: "14,8 %",
    servicio: "17 a 18 °C",
    capsula: "#6E1423",
  },
  {
    id: "aljibe-pinot-noir",
    nombre: "Aljibe",
    bodega: "Viñas del Aljibe",
    cepa: "Pinot Noir",
    cepaFiltro: "Pinot Noir",
    tipo: "tinto",
    region: "patagonia",
    anio: "2022",
    precio: 24600,
    maridajes: ["aves", "pescados", "quesos"],
    perfil: { cuerpo: 2.5, taninos: 2, acidez: 4, fruta: 4, madera: 2, dulzor: 0.5 },
    notas: {
      vista: "Rojo cereza traslúcido.",
      nariz: "Frutillas, cerezas ácidas y un fondo terroso.",
      boca: "Delicado, de acidez vivaz y taninos muy finos.",
    },
    crianza: "10 meses en barricas usadas",
    alcohol: "13,1 %",
    servicio: "14 °C",
    capsula: "#2E4237",
  },
  {
    id: "aljibe-chardonnay",
    nombre: "Aljibe",
    bodega: "Viñas del Aljibe",
    cepa: "Chardonnay",
    cepaFiltro: "Chardonnay",
    tipo: "blanco",
    region: "patagonia",
    anio: "2023",
    precio: 19900,
    maridajes: ["pescados", "aves", "pastas"],
    perfil: { cuerpo: 3, taninos: 0, acidez: 3.5, fruta: 3.5, madera: 2.5, dulzor: 1 },
    notas: {
      vista: "Dorado suave y luminoso.",
      nariz: "Manzana verde, pera, manteca y avellanas.",
      boca: "Untuoso pero fresco, con final mineral.",
    },
    crianza: "40 % fermentado en barrica",
    alcohol: "13,4 %",
    servicio: "10 a 12 °C",
    capsula: "#C9A55A",
  },
  {
    id: "tres-soles-sauvignon",
    nombre: "Tres Soles",
    bodega: "Tres Soles",
    cepa: "Sauvignon Blanc",
    cepaFiltro: "Sauvignon Blanc",
    tipo: "blanco",
    region: "uco",
    anio: "2024",
    precio: 14300,
    maridajes: ["pescados", "quesos", "picadas"],
    perfil: { cuerpo: 2, taninos: 0, acidez: 4.5, fruta: 4, madera: 0, dulzor: 0.5 },
    notas: {
      vista: "Amarillo verdoso, muy pálido.",
      nariz: "Pomelo, maracuyá y hoja de tomate.",
      boca: "Filoso, cítrico y salino. Ideal para el verano.",
    },
    crianza: "Sin paso por madera",
    alcohol: "12,8 %",
    servicio: "8 °C",
    capsula: "#8FA35A",
  },
  {
    id: "gran-ventisca-blend",
    nombre: "Gran Ventisca",
    bodega: "Bodega Ventisca",
    cepa: "Blend de tintas",
    cepaFiltro: "Blend",
    tipo: "tinto",
    region: "lujan",
    anio: "2019",
    precio: null,
    maridajes: ["carnes", "quesos"],
    perfil: { cuerpo: 5, taninos: 4.5, acidez: 3, fruta: 4, madera: 4.5, dulzor: 0.5 },
    notas: {
      vista: "Rojo profundo con borde teja.",
      nariz: "Frutos negros, tabaco, cuero y especias dulces.",
      boca: "Potente y complejo, con taninos pulidos por el tiempo.",
    },
    crianza: "20 meses en roble francés nuevo",
    alcohol: "14,9 %",
    servicio: "18 °C, decantar 1 hora",
    capsula: "#B8914A",
    destacado: "Edición limitada",
  },
  {
    id: "olmedo-cabernet",
    nombre: "Casa Olmedo",
    bodega: "Casa Olmedo",
    cepa: "Cabernet Sauvignon",
    cepaFiltro: "Cabernet Sauvignon",
    tipo: "tinto",
    region: "famatina",
    anio: "2021",
    precio: 16700,
    maridajes: ["carnes", "picadas"],
    perfil: { cuerpo: 4, taninos: 4, acidez: 3, fruta: 3.5, madera: 3, dulzor: 0.5 },
    notas: {
      vista: "Rojo rubí oscuro.",
      nariz: "Cassis, pimiento rojo y un toque mentolado.",
      boca: "Estructurado, de taninos marcados y final largo.",
    },
    crianza: "12 meses en roble",
    alcohol: "14 %",
    servicio: "17 °C",
    capsula: "#3A2A20",
  },
  {
    id: "olmedo-rosado",
    nombre: "Olmedo Rosé",
    bodega: "Casa Olmedo",
    cepa: "Rosado de Malbec",
    cepaFiltro: "Rosado",
    tipo: "rosado",
    region: "famatina",
    anio: "2024",
    precio: 11500,
    maridajes: ["pescados", "picadas", "especiada"],
    perfil: { cuerpo: 1.5, taninos: 0.5, acidez: 4, fruta: 4.5, madera: 0, dulzor: 1 },
    notas: {
      vista: "Rosa salmón pálido.",
      nariz: "Frutillas, pomelo rosado y pétalos.",
      boca: "Seco, fresco y muy tomable.",
    },
    crianza: "Sin paso por madera",
    alcohol: "12,5 %",
    servicio: "8 a 10 °C",
    capsula: "#E6C7C0",
  },
  {
    id: "brisa-nueva-extra-brut",
    nombre: "Brisa Nueva",
    bodega: "Bodega Ventisca",
    cepa: "Chardonnay · Pinot Noir",
    cepaFiltro: "Espumante",
    tipo: "espumante",
    region: "uco",
    anio: "NV",
    precio: 21400,
    maridajes: ["pescados", "quesos", "postres"],
    perfil: { cuerpo: 2, taninos: 0, acidez: 4.5, fruta: 3, madera: 1, dulzor: 1 },
    notas: {
      vista: "Amarillo pajizo con burbuja fina y persistente.",
      nariz: "Pan tostado, manzana verde y limón.",
      boca: "Cremoso, seco y largo. Para brindar o para toda la comida.",
    },
    crianza: "Método tradicional, 24 meses sobre lías",
    alcohol: "12,5 %",
    servicio: "6 a 8 °C",
    capsula: "#C9A55A",
  },
  {
    id: "medano-dulce-natural",
    nombre: "Médano Dulce",
    bodega: "Bodega Médano",
    cepa: "Torrontés tardío",
    cepaFiltro: "Torrontés",
    tipo: "blanco",
    region: "tulum",
    anio: "2023",
    precio: 12200,
    maridajes: ["postres", "quesos"],
    perfil: { cuerpo: 3, taninos: 0, acidez: 3, fruta: 4.5, madera: 0, dulzor: 4.5 },
    notas: {
      vista: "Dorado intenso.",
      nariz: "Damasco seco, miel y flores blancas.",
      boca: "Dulce y equilibrado, con una acidez que limpia el paladar.",
    },
    crianza: "Cosecha tardía, sin madera",
    alcohol: "11,5 %",
    servicio: "8 °C",
    capsula: "#6E1423",
  },
  {
    id: "arce-gran-reserva",
    nombre: "Arce Gran Reserva",
    bodega: "Finca Lucía Arce",
    cepa: "Malbec",
    cepaFiltro: "Malbec",
    tipo: "tinto",
    region: "uco",
    anio: "2018",
    precio: 64000,
    maridajes: ["carnes", "quesos"],
    perfil: { cuerpo: 5, taninos: 4, acidez: 3.5, fruta: 3.5, madera: 4, dulzor: 0.5 },
    notas: {
      vista: "Rojo negro con reflejos granate.",
      nariz: "Ciruelas secas, violetas, tabaco rubio y grafito.",
      boca: "Profundo, largo y armónico. Un vino para ocasiones.",
    },
    crianza: "18 meses en roble francés y 2 años en botella",
    alcohol: "14,6 %",
    servicio: "18 °C, decantar 1 hora",
    capsula: "#151313",
  },
];

export const VINO_POR_ID = new Map(VINOS.map((v) => [v.id, v]));
export const CEPAS = [...new Set(VINOS.map((v) => v.cepaFiltro))];
export const PRECIO_MIN = 10000;
export const PRECIO_MAX = 70000;
export const DESCUENTO_CAJA = 0.1;

export const imagenVino = (id: string) => `/demos/catalogos/vinoteca/vino-${id}.webp`;
export const regionNombre = (r: Region) => REGIONES.find((x) => x.id === r)!.nombre;
