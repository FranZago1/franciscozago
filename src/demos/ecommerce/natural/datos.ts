import type { ConfigTienda, ProductoCarrito } from "../shared/tipos";

export type Categoria = "Rostro" | "Cuerpo" | "Labios" | "Cabello";
export type IngredienteId = "arcilla" | "calendula" | "rosa-mosqueta" | "aloe" | "avena" | "centella";

export type ProductoNatural = ProductoCarrito & {
  categoria: Categoria;
  tamano: string;
  bajada: string;
  rating: number;
  resenas: number;
  paraQue: string;
  uso: string;
  ingredientes: IngredienteId[];
  sello?: string;
};

const img = (n: string) => `/demos/ecommerce/natural/${n}.webp`;

export const productos: ProductoNatural[] = [
  {
    id: "limpiador",
    nombre: "Gel Limpiador Suave",
    precio: 16900,
    imagen: img("limpiador-suave"),
    alt: "Pomo de gel limpiador blanco con tapa verde oliva sobre un pedestal",
    detalle: "150 ml",
    tamano: "150 ml",
    categoria: "Rostro",
    bajada: "Limpia sin tirantez, con avena y aloe.",
    rating: 4.7,
    resenas: 256,
    paraQue: "Quita maquillaje, protector y el día entero sin arrastrar la barrera de la piel. Espuma apenas, no deja sensación de jabón.",
    uso: "Mañana y noche: masajeá una avellana de producto sobre la piel húmeda durante 30 segundos y enjuagá con agua tibia.",
    ingredientes: ["avena", "aloe"],
  },
  {
    id: "tonico",
    nombre: "Tónico de Rosas",
    precio: 17500,
    imagen: img("tonico-rosas"),
    alt: "Frasco rosado de tónico en spray con etiqueta crema",
    detalle: "120 ml",
    tamano: "120 ml",
    categoria: "Rostro",
    bajada: "Agua de rosas destilada que equilibra y refresca.",
    rating: 4.8,
    resenas: 129,
    paraQue: "Devuelve el equilibrio después de la limpieza y prepara la piel para absorber mejor el sérum.",
    uso: "Rociá a 20 cm del rostro con los ojos cerrados y dejá que se absorba solo, o aplicalo con un algodón.",
    ingredientes: ["rosa-mosqueta", "aloe"],
  },
  {
    id: "serum-calma",
    nombre: "Sérum Calma",
    precio: 24500,
    imagen: img("serum-calma"),
    alt: "Frasco gotero de vidrio verde oliva con etiqueta que dice Calma",
    detalle: "30 ml",
    tamano: "30 ml",
    categoria: "Rostro",
    bajada: "Centella y niacinamida para pieles que se irritan.",
    rating: 4.8,
    resenas: 212,
    paraQue: "Baja las rojeces y la sensación de ardor, y fortalece la piel sensible para que reaccione menos.",
    uso: "Tres a cuatro gotas sobre la piel limpia, mañana y noche. Seguí con tu crema.",
    ingredientes: ["centella", "calendula"],
    sello: "Más vendido",
  },
  {
    id: "serum-luz",
    nombre: "Sérum Luz",
    precio: 26900,
    imagen: img("serum-luz"),
    alt: "Frasco gotero de vidrio rosa arcilla con etiqueta que dice Luz",
    detalle: "30 ml",
    tamano: "30 ml",
    categoria: "Rostro",
    bajada: "Vitamina C estable y rosa mosqueta para dar luz.",
    rating: 4.7,
    resenas: 164,
    paraQue: "Empareja el tono, suaviza manchas de sol y le devuelve luminosidad a la piel apagada.",
    uso: "De noche, tres gotas sobre la piel limpia. De día, siempre con protector solar.",
    ingredientes: ["rosa-mosqueta", "calendula"],
  },
  {
    id: "crema-liviana",
    nombre: "Gel Crema Liviana",
    precio: 25900,
    imagen: img("crema-liviana"),
    alt: "Pote de gel crema con tapa verde salvia",
    detalle: "50 ml",
    tamano: "50 ml",
    categoria: "Rostro",
    bajada: "Hidratación en gel que no brilla.",
    rating: 4.6,
    resenas: 98,
    paraQue: "Hidrata sin sumar grasitud. Ideal para piel mixta o para los meses de calor.",
    uso: "Una capa fina sobre rostro y cuello después del sérum, mañana y noche.",
    ingredientes: ["aloe", "centella"],
  },
  {
    id: "crema-nutritiva",
    nombre: "Crema Nutritiva",
    precio: 28900,
    imagen: img("crema-nutritiva"),
    alt: "Pote de crema blanco con tapa de madera y etiqueta que dice Nutritiva",
    detalle: "50 ml",
    tamano: "50 ml",
    categoria: "Rostro",
    bajada: "Manteca de karité y avena para piel seca.",
    rating: 4.9,
    resenas: 301,
    paraQue: "Repara la piel seca o tirante y la deja suave todo el día, incluso en invierno.",
    uso: "Calentá una pequeña cantidad entre los dedos y presioná sobre el rostro, sin frotar.",
    ingredientes: ["avena", "calendula"],
    sello: "Favorita",
  },
  {
    id: "mascarilla",
    nombre: "Máscara Arcilla Rosa",
    precio: 19900,
    imagen: img("mascarilla-arcilla"),
    alt: "Pote abierto con máscara de arcilla rosa",
    detalle: "80 g",
    tamano: "80 g",
    categoria: "Rostro",
    bajada: "Purifica sin resecar, una o dos veces por semana.",
    rating: 4.8,
    resenas: 143,
    paraQue: "Absorbe el exceso de sebo, afina la textura de los poros y deja la piel suave.",
    uso: "Aplicá una capa fina, dejala 10 minutos (sin que se seque del todo) y retirá con agua tibia.",
    ingredientes: ["arcilla", "aloe"],
  },
  {
    id: "protector",
    nombre: "Protector Solar FPS 50",
    precio: 23900,
    imagen: img("protector-solar"),
    alt: "Pomo de protector solar rosado con tapa arcilla",
    detalle: "90 ml",
    tamano: "90 ml",
    categoria: "Rostro",
    bajada: "Filtros minerales, sin rastro blanco.",
    rating: 4.5,
    resenas: 187,
    paraQue: "Protege de los rayos UVA y UVB con filtros minerales. Textura fluida que no deja la cara blanca.",
    uso: "Último paso de la mañana. Dos dedos de producto para rostro y cuello; renová cada 2 horas al sol.",
    ingredientes: ["aloe", "calendula"],
  },
  {
    id: "aceite",
    nombre: "Aceite Corporal Almendras",
    precio: 21900,
    imagen: img("aceite-corporal"),
    alt: "Frasco con dosificador de aceite corporal dorado",
    detalle: "100 ml",
    tamano: "100 ml",
    categoria: "Cuerpo",
    bajada: "Almendras y caléndula, para después de la ducha.",
    rating: 4.9,
    resenas: 88,
    paraQue: "Nutre la piel del cuerpo y se absorbe rápido. Aroma suave a almendras.",
    uso: "Sobre la piel todavía húmeda, después de la ducha. Masajeá hasta que se absorba.",
    ingredientes: ["calendula", "rosa-mosqueta"],
  },
  {
    id: "jabon-arcilla",
    nombre: "Jabón de Arcilla Rosa",
    precio: 8900,
    imagen: img("jabon-arcilla"),
    alt: "Jabón en barra rosado con el sello Arcilla sobre un plato de cerámica",
    detalle: "110 g",
    tamano: "110 g",
    categoria: "Cuerpo",
    bajada: "Saponificado en frío, con arcilla rosa.",
    rating: 4.7,
    resenas: 412,
    paraQue: "Limpia con suavidad y deja la piel del cuerpo lisa. Dura el doble si lo dejás secar entre usos.",
    uso: "Hacé espuma entre las manos o con una esponja vegetal. Guardalo en jabonera con drenaje.",
    ingredientes: ["arcilla"],
  },
  {
    id: "jabon-avena",
    nombre: "Jabón de Avena y Miel",
    precio: 8900,
    imagen: img("jabon-avena"),
    alt: "Jabón en barra color avena con el sello Avena sobre un plato",
    detalle: "110 g",
    tamano: "110 g",
    categoria: "Cuerpo",
    bajada: "El más suave: para piel seca y sensible.",
    rating: 4.8,
    resenas: 377,
    paraQue: "Calma la picazón de la piel seca y es apto para toda la familia.",
    uso: "Usalo en la ducha sobre la piel húmeda y enjuagá bien.",
    ingredientes: ["avena"],
  },
  {
    id: "balsamo",
    nombre: "Bálsamo Labial Caléndula",
    precio: 6900,
    imagen: img("balsamo-labial"),
    alt: "Lata de bálsamo labial verde oliva",
    detalle: "15 g",
    tamano: "15 g",
    categoria: "Labios",
    bajada: "Cera de abejas local y caléndula.",
    rating: 4.9,
    resenas: 520,
    paraQue: "Repara labios partidos y los protege del frío y el viento.",
    uso: "Aplicalo las veces que quieras. De noche, una capa generosa.",
    ingredientes: ["calendula"],
    sello: "Top reseñas",
  },
  {
    id: "champu",
    nombre: "Champú Sólido Ortiga",
    precio: 12900,
    imagen: img("champu-solido"),
    alt: "Pastilla redonda de champú sólido verde con una hoja en relieve",
    detalle: "75 g",
    tamano: "75 g",
    categoria: "Cabello",
    bajada: "Rinde como dos botellas de champú. Cero plástico.",
    rating: 4.6,
    resenas: 209,
    paraQue: "Limpia el cuero cabelludo sin apelmazar. Para cabello normal a graso.",
    uso: "Frotalo sobre el cabello mojado, masajeá la espuma y enjuagá. Dejalo secar al aire.",
    ingredientes: ["aloe", "avena"],
  },
];

export const porId: Record<string, ProductoNatural> = Object.fromEntries(productos.map((p) => [p.id, p]));
export const categorias: Categoria[] = ["Rostro", "Cuerpo", "Labios", "Cabello"];

export type Rutina = {
  id: "calma" | "equilibrio" | "nutricion";
  nombre: string;
  para: string;
  imagen: string;
  alt: string;
  pasos: { id: string; momento: string }[];
  color: string;
};

export const rutinas: Rutina[] = [
  {
    id: "calma",
    nombre: "Rutina Calma",
    para: "Piel sensible o que se enrojece",
    imagen: img("rutina-calma"),
    alt: "Gel limpiador, sérum Calma y gel crema liviana sobre un pedestal, fondo salvia",
    pasos: [
      { id: "limpiador", momento: "Limpiá" },
      { id: "serum-calma", momento: "Calmá" },
      { id: "crema-liviana", momento: "Hidratá" },
    ],
    color: "#B8C4A6",
  },
  {
    id: "equilibrio",
    nombre: "Rutina Equilibrio",
    para: "Piel mixta, brillo en la zona T",
    imagen: img("rutina-equilibrio"),
    alt: "Tónico de rosas, máscara de arcilla rosa y protector solar sobre un pedestal, fondo rosado",
    pasos: [
      { id: "tonico", momento: "Equilibrá" },
      { id: "mascarilla", momento: "Purificá (2 × semana)" },
      { id: "protector", momento: "Protegé" },
    ],
    color: "#E3B9AC",
  },
  {
    id: "nutricion",
    nombre: "Rutina Nutrición",
    para: "Piel seca, tirante o apagada",
    imagen: img("rutina-nutricion"),
    alt: "Sérum Luz, crema nutritiva y aceite corporal sobre un pedestal, fondo piedra",
    pasos: [
      { id: "serum-luz", momento: "Iluminá" },
      { id: "crema-nutritiva", momento: "Nutrí" },
      { id: "aceite", momento: "Sellá (cuerpo)" },
    ],
    color: "#DAD6CA",
  },
];

export type Ingrediente = {
  id: IngredienteId;
  nombre: string;
  cientifico: string;
  origen: string;
  resumen: string;
  beneficios: string[];
  apto: string;
};

export const ingredientes: Ingrediente[] = [
  {
    id: "arcilla",
    nombre: "Arcilla rosa",
    cientifico: "Caolín con óxidos de hierro",
    origen: "Yacimientos de San Juan",
    resumen: "La más suave de las arcillas: purifica sin sacar la humedad natural de la piel.",
    beneficios: ["Absorbe el exceso de sebo", "Afina la textura de los poros", "Aporta minerales"],
    apto: "Piel mixta, grasa y sensible",
  },
  {
    id: "calendula",
    nombre: "Caléndula",
    cientifico: "Calendula officinalis",
    origen: "Huerta propia en el Valle de Uco",
    resumen: "Flor que macera durante 40 días en aceite de girasol para concentrar sus activos.",
    beneficios: ["Calma irritaciones", "Ayuda a reparar", "Suaviza la piel seca"],
    apto: "Todo tipo de piel, incluso bebés",
  },
  {
    id: "rosa-mosqueta",
    nombre: "Rosa mosqueta",
    cientifico: "Rosa rubiginosa",
    origen: "Cosecha silvestre en la Patagonia",
    resumen: "Aceite prensado en frío, rico en omegas y vitamina A natural.",
    beneficios: ["Empareja el tono", "Suaviza marcas y manchas", "Nutre en profundidad"],
    apto: "Piel seca, madura o con manchas",
  },
  {
    id: "aloe",
    nombre: "Aloe vera",
    cientifico: "Aloe barbadensis",
    origen: "Cultivo orgánico en Catamarca",
    resumen: "Gel fresco estabilizado sin alcohol: hidrata al instante y refresca.",
    beneficios: ["Hidratación liviana", "Refresca y descongestiona", "Calma después del sol"],
    apto: "Todo tipo de piel",
  },
  {
    id: "avena",
    nombre: "Avena coloidal",
    cientifico: "Avena sativa",
    origen: "Molino cooperativo de Entre Ríos",
    resumen: "Avena molida finísima que forma una película protectora sobre la piel.",
    beneficios: ["Alivia la picazón", "Protege la barrera cutánea", "Limpia sin irritar"],
    apto: "Piel seca, sensible o atópica",
  },
  {
    id: "centella",
    nombre: "Centella asiática",
    cientifico: "Centella asiatica",
    origen: "Extracto certificado de comercio justo",
    resumen: "Planta clásica de la cosmética calmante, con activos que fortalecen la piel.",
    beneficios: ["Reduce rojeces", "Fortalece la barrera", "Acelera la recuperación"],
    apto: "Piel sensible y reactiva",
  },
];

export const ingredientePorId = Object.fromEntries(ingredientes.map((i) => [i.id, i])) as Record<IngredienteId, Ingrediente>;

export type Resena = { autor: string; ciudad: string; producto: string; estrellas: number; titulo: string; texto: string; hace: string };

export const resenas: Resena[] = [
  { autor: "Lucía M.", ciudad: "Rosario", producto: "serum-calma", estrellas: 5, titulo: "Se me fueron las rojeces", texto: "Tengo rosácea leve y probé mil cosas. A las tres semanas se notaba la diferencia, y no arde nada al ponerlo.", hace: "hace 2 semanas" },
  { autor: "Carolina P.", ciudad: "Córdoba", producto: "crema-nutritiva", estrellas: 5, titulo: "La uso todo el invierno", texto: "Textura rica pero se absorbe bien. Mi piel seca por fin no tira a la tarde. El pote rinde un montón.", hace: "hace 1 mes" },
  { autor: "Martín G.", ciudad: "Mendoza", producto: "mascarilla", estrellas: 4, titulo: "Buena para la zona T", texto: "La uso dos veces por semana y los poros se ven más chicos. Le saco una estrella porque me gustaría un pote más grande.", hace: "hace 3 semanas" },
  { autor: "Sofía R.", ciudad: "CABA", producto: "balsamo", estrellas: 5, titulo: "El mejor bálsamo", texto: "Llevo tres latas. Lo uso de noche en capa gruesa y a la mañana tengo los labios nuevos.", hace: "hace 5 días" },
  { autor: "Valentina S.", ciudad: "La Plata", producto: "tonico", estrellas: 5, titulo: "Huele a rosas de verdad", texto: "Nada de perfume artificial. Lo tengo en la heladera y en verano es lo más.", hace: "hace 2 meses" },
  { autor: "Julián A.", ciudad: "Tucumán", producto: "champu", estrellas: 4, titulo: "Me costó acostumbrarme", texto: "Las primeras lavadas sentí el pelo raro, después se acomodó y ahora no vuelvo al champú de botella.", hace: "hace 1 mes" },
  { autor: "Paula F.", ciudad: "Neuquén", producto: "serum-luz", estrellas: 5, titulo: "Manchas más suaves", texto: "Tenía manchas del verano y se fueron aclarando. Siempre con protector, como dice la etiqueta.", hace: "hace 3 semanas" },
  { autor: "Ana L.", ciudad: "Salta", producto: "limpiador", estrellas: 5, titulo: "No reseca nada", texto: "Por fin un limpiador que no me deja la cara tirante. Saca bien el protector.", hace: "hace 1 semana" },
];

export const distribucion = [
  [5, 82],
  [4, 13],
  [3, 3],
  [2, 1],
  [1, 1],
] as const;

export const config: ConfigTienda = {
  nombre: "Hoja & Barro",
  envioGratisDesde: 45000,
  cuotasSinInteres: 3,
  prefijoPedido: "HB",
  local: "Taller Hoja & Barro, Chacras de Coria (Mendoza)",
  envios: [
    { id: "domicilio", nombre: "Envío a domicilio", detalle: "Llega el {fecha}, en caja compostable", dias: 3, precio: 5900, bonificable: true },
    { id: "sucursal", nombre: "Retiro en sucursal de correo", detalle: "Disponible desde el {fecha}", dias: 3, precio: 3900, bonificable: true },
    { id: "retiro", nombre: "Retiro en el taller", detalle: "Listo el {fecha}, de 10 a 18 h", dias: 1, precio: 0, retiro: true },
  ],
};
