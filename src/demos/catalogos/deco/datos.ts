import hotspotsGen from "./hotspots.gen.json";

/* Catálogo ficticio de Nido, muebles y objetos. Precios, medidas y textos inventados. */

export type Ambiente = "living" | "comedor" | "dormitorio" | "objetos";
export type Material = "madera" | "tela" | "metal" | "ceramica" | "fibras";
export type Coleccion = "tierra" | "bosque" | "lino";
export type ColorFiltro = "crudo" | "terracota" | "oliva" | "bosque" | "roble" | "nogal" | "negro" | "laton";

export type Variante = { id: string; nombre: string; hex: string; color: ColorFiltro };

export type Producto = {
  id: string;
  nombre: string;
  tipo: string;
  ambientes: Ambiente[];
  materiales: Material[];
  coleccion: Coleccion;
  precio: number | null;
  variantes: Variante[];
  medidas: { ancho: number; prof: number; alto: number; nota?: string };
  descripcion: string;
  detalles: string[];
  plazo: string;
  nuevo?: boolean;
};

export const AMBIENTES: { id: Ambiente; nombre: string }[] = [
  { id: "living", nombre: "Living" },
  { id: "comedor", nombre: "Comedor" },
  { id: "dormitorio", nombre: "Dormitorio" },
  { id: "objetos", nombre: "Objetos" },
];

export const MATERIALES: { id: Material; nombre: string }[] = [
  { id: "madera", nombre: "Madera maciza" },
  { id: "tela", nombre: "Tapizados" },
  { id: "fibras", nombre: "Fibras naturales" },
  { id: "metal", nombre: "Metal" },
  { id: "ceramica", nombre: "Cerámica" },
];

export const COLORES: { id: ColorFiltro; nombre: string; hex: string }[] = [
  { id: "crudo", nombre: "Crudo", hex: "#E3D9C8" },
  { id: "terracota", nombre: "Terracota", hex: "#B25F3C" },
  { id: "oliva", nombre: "Oliva", hex: "#6F7451" },
  { id: "bosque", nombre: "Verde bosque", hex: "#2F4538" },
  { id: "roble", nombre: "Roble", hex: "#C39462" },
  { id: "nogal", nombre: "Nogal", hex: "#6E4A30" },
  { id: "negro", nombre: "Negro", hex: "#2E2A27" },
  { id: "laton", nombre: "Latón", hex: "#B38B45" },
];

export const COLECCIONES: { id: Coleccion; nombre: string; bajada: string; portada: [string, string] }[] = [
  {
    id: "tierra",
    nombre: "Tierra",
    bajada: "Terracota, roble y barro cocido. Piezas cálidas que arman el living de todos los días.",
    portada: ["sofa-tala", "terracota"],
  },
  {
    id: "bosque",
    nombre: "Bosque",
    bajada: "Verdes profundos y nogal para comedores de sobremesa larga.",
    portada: ["butaca-ceibo", "bosque"],
  },
  {
    id: "lino",
    nombre: "Lino",
    bajada: "Crudos, latón y luz suave. Dormitorios que se sienten como un domingo.",
    portada: ["cama-sauce", "lino-crudo"],
  },
];

const V = {
  linoCrudo: { id: "lino-crudo", nombre: "Lino crudo", hex: "#D6CAB3", color: "crudo" },
  boucle: { id: "boucle", nombre: "Bouclé natural", hex: "#E7DECF", color: "crudo" },
  crudo: { id: "crudo", nombre: "Crudo", hex: "#E3D8C6", color: "crudo" },
  terracota: { id: "terracota", nombre: "Terracota", hex: "#B25F3C", color: "terracota" },
  oliva: { id: "oliva", nombre: "Oliva", hex: "#6F7451", color: "oliva" },
  bosque: { id: "bosque", nombre: "Verde bosque", hex: "#2F4538", color: "bosque" },
  verde: { id: "verde", nombre: "Verde salvia", hex: "#5F6D57", color: "oliva" },
  roble: { id: "roble", nombre: "Roble natural", hex: "#C39462", color: "roble" },
  nogal: { id: "nogal", nombre: "Nogal", hex: "#6E4A30", color: "nogal" },
  negro: { id: "negro", nombre: "Negro carbón", hex: "#2E2A27", color: "negro" },
  laton: { id: "laton", nombre: "Latón cepillado", hex: "#B38B45", color: "laton" },
  negroMate: { id: "negro", nombre: "Negro mate", hex: "#2A2826", color: "negro" },
} satisfies Record<string, Variante>;

export const PRODUCTOS: Producto[] = [
  {
    id: "sofa-tala",
    nombre: "Sofá Tala",
    tipo: "Sofá de 3 cuerpos",
    ambientes: ["living"],
    materiales: ["tela", "madera"],
    coleccion: "tierra",
    precio: 1890000,
    variantes: [V.linoCrudo, V.terracota, V.oliva],
    medidas: { ancho: 228, prof: 94, alto: 86, nota: "Altura de asiento 44 cm" },
    descripcion:
      "Brazos redondeados, almohadones de pluma y espuma, y una base baja que apoya sobre patas de nogal. Es el sofá que armamos más veces y el que más nos piden a medida.",
    detalles: ["Estructura de eucalipto seco en horno", "Fundas removibles y lavables", "Se puede pedir en 2 o 4 cuerpos"],
    plazo: "Fabricación: 35 a 45 días",
  },
  {
    id: "butaca-ceibo",
    nombre: "Butaca Ceibo",
    tipo: "Butaca con brazos de madera",
    ambientes: ["living", "dormitorio"],
    materiales: ["tela", "madera"],
    coleccion: "bosque",
    precio: 640000,
    variantes: [V.boucle, V.terracota, V.bosque],
    medidas: { ancho: 84, prof: 80, alto: 92, nota: "Altura de asiento 42 cm" },
    descripcion:
      "Una butaca liviana, de líneas bajas, con brazos de roble macizo torneados a mano. Entra en rincones chicos y se lleva bien con cualquier sofá.",
    detalles: ["Roble macizo con aceite natural", "Respaldo levemente reclinado", "Tapizado fijo"],
    plazo: "Fabricación: 30 a 40 días",
    nuevo: true,
  },
  {
    id: "mesa-lapacho",
    nombre: "Mesa ratona Lapacho",
    tipo: "Mesa baja redonda",
    ambientes: ["living"],
    materiales: ["madera"],
    coleccion: "tierra",
    precio: 420000,
    variantes: [V.roble, V.nogal, V.negro],
    medidas: { ancho: 92, prof: 92, alto: 43 },
    descripcion:
      "Tapa redonda sobre un tambor macizo. Pesada, estable y con la veta a la vista: una mesa para apoyar libros, tazas y pies.",
    detalles: ["Tapa de 4 cm de espesor", "Terminación en aceite o laca mate", "Base con regatones de fieltro"],
    plazo: "Fabricación: 25 a 30 días",
  },
  {
    id: "lampara-brisa",
    nombre: "Lámpara Brisa",
    tipo: "Lámpara de pie",
    ambientes: ["living", "dormitorio"],
    materiales: ["metal", "tela"],
    coleccion: "lino",
    precio: 310000,
    variantes: [V.laton, V.negroMate],
    medidas: { ancho: 48, prof: 48, alto: 168 },
    descripcion:
      "Pantalla de lino sobre un vástago fino de metal. Da una luz cálida y difusa, ideal al lado del sofá o en un rincón de lectura.",
    detalles: ["Pantalla de lino natural", "Interruptor de pie", "Lámpara E27 (no incluida)"],
    plazo: "Entrega inmediata",
  },
  {
    id: "biblioteca-quebracho",
    nombre: "Biblioteca Quebracho",
    tipo: "Estantería abierta",
    ambientes: ["living"],
    materiales: ["madera"],
    coleccion: "tierra",
    precio: 980000,
    variantes: [V.roble, V.nogal],
    medidas: { ancho: 124, prof: 36, alto: 182, nota: "5 estantes regulables" },
    descripcion:
      "Estructura abierta, liviana a la vista y firme en serio: cada estante soporta 30 kg. Se ancla a la pared con herrajes ocultos.",
    detalles: ["Estantes regulables cada 4 cm", "Anclaje oculto incluido", "Módulos combinables"],
    plazo: "Fabricación: 30 a 40 días",
  },
  {
    id: "alfombra-pampa",
    nombre: "Alfombra Pampa",
    tipo: "Alfombra tejida a mano",
    ambientes: ["living", "dormitorio"],
    materiales: ["fibras"],
    coleccion: "tierra",
    precio: 560000,
    variantes: [V.crudo, V.terracota],
    medidas: { ancho: 300, prof: 200, alto: 1, nota: "También en 160 × 230 cm" },
    descripcion:
      "Lana de oveja hilada y tejida en telar por artesanas del norte. Rombos simples, flecos cortos y colores que no se van con los años.",
    detalles: ["100 % lana natural", "Tejido en telar criollo", "Cada pieza es levemente distinta"],
    plazo: "Fabricación: 45 a 60 días",
  },
  {
    id: "mesa-algarrobo",
    nombre: "Mesa Algarrobo",
    tipo: "Mesa de comedor",
    ambientes: ["comedor"],
    materiales: ["madera"],
    coleccion: "bosque",
    precio: 1450000,
    variantes: [V.roble, V.nogal],
    medidas: { ancho: 204, prof: 96, alto: 78, nota: "Para 8 personas" },
    descripcion: "Tapa de listones enteros y patas cónicas. Una mesa pensada para durar varias generaciones de cumpleaños.",
    detalles: ["Madera maciza estacionada", "Largo a medida de 160 a 260 cm", "Terminación resistente al agua"],
    plazo: "Fabricación: 40 a 50 días",
  },
  {
    id: "silla-junco",
    nombre: "Silla Junco",
    tipo: "Silla con asiento de esterilla",
    ambientes: ["comedor"],
    materiales: ["madera", "fibras"],
    coleccion: "bosque",
    precio: 185000,
    variantes: [V.roble, V.negro],
    medidas: { ancho: 50, prof: 52, alto: 84, nota: "Altura de asiento 46 cm" },
    descripcion: "Asiento y respaldo de esterilla tejida sobre un bastidor de madera maciza. Liviana, cómoda y apilable de a dos.",
    detalles: ["Esterilla de ratán natural", "Apilable de a dos", "Se vende por unidad"],
    plazo: "Entrega inmediata",
  },
  {
    id: "colgante-luna",
    nombre: "Colgante Luna",
    tipo: "Lámpara colgante",
    ambientes: ["comedor"],
    materiales: ["metal"],
    coleccion: "bosque",
    precio: 230000,
    variantes: [V.terracota, V.bosque, V.crudo],
    medidas: { ancho: 56, prof: 56, alto: 24, nota: "Cable textil de 150 cm" },
    descripcion: "Pantalla de chapa esmaltada con interior blanco que rebota la luz sobre la mesa. Queda linda sola o de a dos.",
    detalles: ["Chapa esmaltada al horno", "Cable textil regulable", "Florón al tono"],
    plazo: "Entrega inmediata",
    nuevo: true,
  },
  {
    id: "aparador-tipa",
    nombre: "Aparador Tipa",
    tipo: "Aparador con puertas de esterilla",
    ambientes: ["comedor", "living"],
    materiales: ["madera", "fibras"],
    coleccion: "bosque",
    precio: 1120000,
    variantes: [V.roble, V.nogal],
    medidas: { ancho: 186, prof: 45, alto: 86 },
    descripcion:
      "Dos puertas de esterilla, dos cajones centrales y tiradores de latón. Guarda la vajilla de las fiestas y la de todos los días.",
    detalles: ["Cajones con guías de cierre suave", "Estantes interiores regulables", "Tiradores de latón macizo"],
    plazo: "Fabricación: 35 a 45 días",
  },
  {
    id: "jarron-barro",
    nombre: "Jarrón Barro",
    tipo: "Jarrón de cerámica",
    ambientes: ["objetos", "living", "comedor"],
    materiales: ["ceramica"],
    coleccion: "tierra",
    precio: 68000,
    variantes: [V.terracota, V.crudo, V.verde],
    medidas: { ancho: 28, prof: 28, alto: 40 },
    descripcion:
      "Torneado y esmaltado a mano en un taller de Villa Allende. Sirve para flores secas o frescas: el interior es impermeable.",
    detalles: ["Cerámica de alta temperatura", "Interior esmaltado", "Flores secas no incluidas"],
    plazo: "Entrega inmediata",
  },
  {
    id: "cama-sauce",
    nombre: "Cama Sauce",
    tipo: "Cama tapizada de 2 plazas",
    ambientes: ["dormitorio"],
    materiales: ["tela", "madera"],
    coleccion: "lino",
    precio: 1340000,
    variantes: [V.linoCrudo, V.oliva, V.terracota],
    medidas: { ancho: 178, prof: 212, alto: 116, nota: "Para colchón de 160 × 200 cm" },
    descripcion: "Respaldo alto con costuras verticales y una base envolvente. Suave al apoyarse para leer, firme para durar.",
    detalles: ["Somier de listones incluido", "Tapizado removible", "También en queen y king"],
    plazo: "Fabricación: 35 a 45 días",
  },
  {
    id: "mesa-luz-pino",
    nombre: "Mesa de luz Pino",
    tipo: "Mesa de luz con cajón",
    ambientes: ["dormitorio"],
    materiales: ["madera"],
    coleccion: "lino",
    precio: 210000,
    variantes: [V.roble, V.negro],
    medidas: { ancho: 54, prof: 38, alto: 60 },
    descripcion: "Un cajón para lo que no se ve y un estante abierto para el libro de turno. Patas cónicas y tirador de latón.",
    detalles: ["Cajón con guías metálicas", "Estante abierto", "Se vende por unidad"],
    plazo: "Fabricación: 20 a 30 días",
  },
  {
    id: "espejo-arco",
    nombre: "Espejo Arco",
    tipo: "Espejo de pie",
    ambientes: ["dormitorio", "objetos"],
    materiales: ["metal", "madera"],
    coleccion: "lino",
    precio: 290000,
    variantes: [V.laton, V.roble],
    medidas: { ancho: 76, prof: 3, alto: 174 },
    descripcion: "Espejo de cuerpo entero con remate en arco. Se apoya contra la pared o se cuelga, y agranda cualquier ambiente.",
    detalles: ["Cristal de 4 mm con respaldo de seguridad", "Colgable o de apoyo", "Marco de latón o roble"],
    plazo: "Entrega inmediata",
  },
  {
    id: "almohadon-trama",
    nombre: "Almohadones Trama",
    tipo: "Set de 2 almohadones",
    ambientes: ["objetos", "living", "dormitorio"],
    materiales: ["tela"],
    coleccion: "tierra",
    precio: 54000,
    variantes: [V.terracota, V.oliva, V.bosque],
    medidas: { ancho: 50, prof: 15, alto: 50, nota: "Uno liso de 50 cm y uno rayado de 40 cm" },
    descripcion:
      "Un liso y uno rayado, en lino lavado con relleno de fibra siliconada. La forma más rápida de cambiarle la cara a un sillón.",
    detalles: ["Lino lavado a la piedra", "Cierre invisible", "Relleno incluido"],
    plazo: "Entrega inmediata",
  },
];

export const PRODUCTO_POR_ID = new Map(PRODUCTOS.map((p) => [p.id, p]));

export function imagenProducto(id: string, variante: string) {
  return `/demos/catalogos/deco/producto-${id}-${variante}.webp`;
}

export type Hotspot = { id: string; v: string; x: number; y: number };

export const ESCENAS: { id: Exclude<Ambiente, "objetos">; nombre: string; alt: string; hotspots: Hotspot[] }[] = [
  {
    id: "living",
    nombre: "Living",
    alt: "Ilustración de un living con sofá crudo, butaca, mesa ratona redonda, lámpara de pie, biblioteca y alfombra con rombos.",
    hotspots: hotspotsGen.living,
  },
  {
    id: "comedor",
    nombre: "Comedor",
    alt: "Ilustración de un comedor con mesa de madera, sillas de esterilla, dos lámparas colgantes y un aparador sobre una pared verde.",
    hotspots: hotspotsGen.comedor,
  },
  {
    id: "dormitorio",
    nombre: "Dormitorio",
    alt: "Ilustración de un dormitorio con cama tapizada, mesas de luz, espejo en arco, lámpara de pie y alfombra terracota.",
    hotspots: hotspotsGen.dormitorio,
  },
];

export const NEGOCIO = {
  nombre: "Nido",
  bajada: "muebles y objetos",
  showroom: "Showroom en Barrio Güemes, Córdoba",
  horario: "Martes a sábados de 10 a 19 h",
};
