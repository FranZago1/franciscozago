// Del Valle Mercado — contenido 100 % ficticio (productores, personas, precios y reseñas).

export type CategoriaId = "quesos" | "miel" | "verduras" | "dulces" | "panificados" | "vinos";
export type ZonaId = "norte" | "sierras-chicas" | "capital" | "punilla" | "traslasierra" | "paravachasca" | "calamuchita";

export type Categoria = { id: CategoriaId; nombre: string; bajada: string };

export type Zona = {
  id: ZonaId;
  nombre: string;
  localidades: string;
  /** Polígono del mapa ilustrado (viewBox 600×560). */
  puntos: string;
  etiqueta: [number, number];
  color: string;
  proximamente?: boolean;
};

export type Productor = {
  id: string;
  nombre: string;
  persona: string;
  lugar: string;
  zona: ZonaId;
  categoria: CategoriaId;
  especialidad: string;
  historia: [string, string];
  cita: string;
  desde: number;
  envio: number;
  envioGratisDesde: number;
  entregaEn: ZonaId[];
  dias: string;
  rating: number;
  resenas: number;
  sellos: string[];
  imagen: string;
  alt: string;
  /** Posición del pin en el mapa. */
  pin: [number, number];
};

export type Producto = {
  id: string;
  nombre: string;
  productorId: string;
  categoria: CategoriaId;
  precio: number;
  unidad: string;
  descripcion: string;
  etiquetas: string[];
  imagen: string;
  alt: string;
  destacado?: boolean;
  ultimas?: boolean;
};

const img = (n: string) => `/demos/marketplaces/productores/${n}.webp`;

export const categorias: Categoria[] = [
  { id: "quesos", nombre: "Quesos", bajada: "De cabra y de vaca, estacionados en cava" },
  { id: "miel", nombre: "Miel", bajada: "De monte, cremosa y en panal" },
  { id: "verduras", nombre: "Verduras", bajada: "Agroecológicas y de estación" },
  { id: "dulces", nombre: "Dulces", bajada: "Mermeladas y dulces de olla" },
  { id: "panificados", nombre: "Panificados", bajada: "Masa madre y horno de barro" },
  { id: "vinos", nombre: "Vinos y picada", bajada: "De la Colonia, con salame casero" },
];

export const zonas: Zona[] = [
  {
    id: "norte",
    nombre: "Norte",
    localidades: "Colonia Caroya y Jesús María",
    puntos: "300,40 470,40 560,90 575,170 470,175 390,160 330,150 290,100",
    etiqueta: [440, 108],
    color: "#E9C46A",
  },
  {
    id: "sierras-chicas",
    nombre: "Sierras Chicas",
    localidades: "Unquillo, Río Ceballos y Mendiolaza",
    puntos: "290,100 330,150 390,160 380,250 360,320 300,330 280,240 270,160",
    etiqueta: [330, 238],
    color: "#A7C686",
  },
  {
    id: "capital",
    nombre: "Córdoba Capital",
    localidades: "Todos los barrios",
    puntos: "390,160 470,175 575,170 580,260 560,330 460,330 360,320 380,250",
    etiqueta: [478, 252],
    color: "#F2B48C",
  },
  {
    id: "punilla",
    nombre: "Punilla",
    localidades: "Tanti, Cosquín y Villa Carlos Paz",
    puntos: "150,110 290,100 270,160 280,240 300,330 200,340 170,250 160,180",
    etiqueta: [222, 176],
    color: "#8FB98B",
  },
  {
    id: "traslasierra",
    nombre: "Traslasierra",
    localidades: "Mina Clavero y Nono",
    puntos: "40,150 150,110 160,180 170,250 200,340 170,430 60,450 30,300",
    etiqueta: [104, 300],
    color: "#D9D2BF",
    proximamente: true,
  },
  {
    id: "paravachasca",
    nombre: "Paravachasca",
    localidades: "Alta Gracia y Anisacate",
    puntos: "300,330 360,320 460,330 560,330 520,420 440,440 340,420",
    etiqueta: [440, 378],
    color: "#C9DB9A",
  },
  {
    id: "calamuchita",
    nombre: "Calamuchita",
    localidades: "Villa General Belgrano y Santa Rosa",
    puntos: "200,340 300,330 340,420 440,440 460,500 330,530 170,520 170,430",
    etiqueta: [292, 462],
    color: "#E7A98E",
  },
];

export const productores: Productor[] = [
  {
    id: "cabras-del-cerro",
    nombre: "Cabras del Cerro",
    persona: "Mirta y Julián Ferreyra",
    lugar: "Tanti, Punilla",
    zona: "punilla",
    categoria: "quesos",
    especialidad: "Quesos de cabra de pastura natural",
    historia: [
      "Empezamos con doce cabras criollas y una olla prestada. Hoy ordeñamos sesenta, que pastan sueltas en las laderas de Tanti, y cuajamos la leche el mismo día.",
      "Todo es a mano: moldeamos, salamos y dejamos estacionar en una cava de piedra que levantamos nosotros. Si un queso no está listo, no sale.",
    ],
    cita: "El queso se hace despacio o no se hace.",
    desde: 2009,
    envio: 2800,
    envioGratisDesde: 30000,
    entregaEn: ["punilla", "capital", "sierras-chicas"],
    dias: "Martes y viernes",
    rating: 4.9,
    resenas: 128,
    sellos: ["Tambo propio", "Leche cruda pasteurizada en finca"],
    imagen: img("productor-cabras-del-cerro"),
    alt: "Ilustración de Mirta y Julián en el campo, con dos cabras pastando detrás",
    pin: [205, 150],
  },
  {
    id: "apiario-la-quebrada",
    nombre: "Apiario La Quebrada",
    persona: "Tomás Aguirre",
    lugar: "Río Ceballos, Sierras Chicas",
    zona: "sierras-chicas",
    categoria: "miel",
    especialidad: "Miel de monte nativo",
    historia: [
      "Mis colmenas están en la quebrada, rodeadas de piquillín, chañar y espinillo. Por eso la miel cambia de color con cada floración: nunca hay dos cosechas iguales.",
      "Extraemos en frío y envasamos en frascos de vidrio retornables. Si me devolvés el frasco, te lo descuento en el próximo pedido.",
    ],
    cita: "Las abejas deciden el sabor; yo solo lo cuido.",
    desde: 2014,
    envio: 2200,
    envioGratisDesde: 25000,
    entregaEn: ["sierras-chicas", "capital", "norte"],
    dias: "Miércoles y sábados",
    rating: 5,
    resenas: 96,
    sellos: ["Extracción en frío", "Frasco retornable"],
    imagen: img("productor-apiario-la-quebrada"),
    alt: "Ilustración de Tomás con sombrero de ala ancha junto a sus colmenas y flores",
    pin: [322, 190],
  },
  {
    id: "huerta-los-molles",
    nombre: "Huerta Los Molles",
    persona: "Paula Sosa y la cooperativa",
    lugar: "Alta Gracia, Paravachasca",
    zona: "paravachasca",
    categoria: "verduras",
    especialidad: "Verduras agroecológicas de estación",
    historia: [
      "Somos siete familias que trabajamos cuatro hectáreas sin agroquímicos. Rotamos cultivos, hacemos nuestro compost y guardamos semillas de tomates que ya no se consiguen.",
      "Cosechamos el día anterior a la entrega. Lo que ves en la tienda es lo que hay en la tierra esta semana.",
    ],
    cita: "Si no es de estación, no está en el bolsón.",
    desde: 2016,
    envio: 1900,
    envioGratisDesde: 20000,
    entregaEn: ["paravachasca", "capital", "calamuchita"],
    dias: "Martes y viernes",
    rating: 4.8,
    resenas: 211,
    sellos: ["Agroecológico", "Semillas propias"],
    imagen: img("productor-huerta-los-molles"),
    alt: "Ilustración de Paula con delantal verde, con un invernadero y canteros detrás",
    pin: [402, 360],
  },
  {
    id: "dulces-dona-emma",
    nombre: "Dulces Doña Emma",
    persona: "Emma Bustos",
    lugar: "Villa General Belgrano, Calamuchita",
    zona: "calamuchita",
    categoria: "dulces",
    especialidad: "Dulces de olla con fruta del valle",
    historia: [
      "Cocino en la misma olla de cobre que usaba mi abuela. La fruta la compro a vecinos del valle y la cocino apenas llega, con poca azúcar y mucho tiempo.",
      "Cada frasco lleva a mano la fecha de elaboración. Los higos en almíbar salen solo en otoño: cuando se terminan, hay que esperar al año que viene.",
    ],
    cita: "La paciencia es el ingrediente que no se ve.",
    desde: 1998,
    envio: 3200,
    envioGratisDesde: 28000,
    entregaEn: ["calamuchita", "paravachasca", "capital"],
    dias: "Jueves",
    rating: 4.9,
    resenas: 174,
    sellos: ["Sin conservantes", "Fruta del valle"],
    imagen: img("productor-dulces-dona-emma"),
    alt: "Ilustración de Emma con anteojos y delantal, con frascos de dulce en la ventana",
    pin: [258, 432],
  },
  {
    id: "horno-de-barro",
    nombre: "Horno de Barro",
    persona: "Lucas y Vero Paredes",
    lugar: "Unquillo, Sierras Chicas",
    zona: "sierras-chicas",
    categoria: "panificados",
    especialidad: "Masa madre y horneado a leña",
    historia: [
      "Nuestra masa madre tiene once años y un nombre: Rulo. Fermentamos cada hogaza durante veinte horas y la cocinamos en un horno de barro que calentamos con leña de poda.",
      "Horneamos los días de entrega, de madrugada. Por eso el pan te llega con la corteza todavía crocante.",
    ],
    cita: "El apuro se nota en la miga.",
    desde: 2013,
    envio: 1800,
    envioGratisDesde: 18000,
    entregaEn: ["sierras-chicas", "capital"],
    dias: "Miércoles y viernes",
    rating: 4.8,
    resenas: 152,
    sellos: ["Fermentación larga", "Harinas agroecológicas"],
    imagen: img("productor-horno-de-barro"),
    alt: "Ilustración de Lucas y Vero con delantales frente a su horno de barro encendido",
    pin: [300, 132],
  },
  {
    id: "finca-los-algarrobos",
    nombre: "Finca Los Algarrobos",
    persona: "Esteban Zanier",
    lugar: "Colonia Caroya, Norte",
    zona: "norte",
    categoria: "vinos",
    especialidad: "Vinos de la Colonia y salame casero",
    historia: [
      "Mi bisabuelo llegó del Friuli con dos estacas de vid en la valija. Seguimos elaborando en el mismo galpón de ladrillo, en tandas chicas y con la uva de nuestras cuatro hileras de frambua.",
      "El salame lo hacemos en invierno, como manda la tradición de la Colonia, y lo estacionamos en el sótano de la casa.",
    ],
    cita: "El vino de la Colonia se toma entre amigos.",
    desde: 1952,
    envio: 3500,
    envioGratisDesde: 40000,
    entregaEn: ["norte", "capital", "sierras-chicas", "punilla"],
    dias: "Viernes",
    rating: 4.7,
    resenas: 88,
    sellos: ["Elaboración familiar", "Tandas chicas"],
    imagen: img("productor-finca-los-algarrobos"),
    alt: "Ilustración de Esteban con camisa a cuadros, con hileras de vid en la finca",
    pin: [430, 80],
  },
];

export const productos: Producto[] = [
  {
    id: "queso-cabra-hierbas",
    nombre: "Queso de cabra con hierbas",
    productorId: "cabras-del-cerro",
    categoria: "quesos",
    precio: 7200,
    unidad: "Rollo de 250 g",
    descripcion: "Fresco y cremoso, con tomillo, romero y orégano de la sierra.",
    etiquetas: ["Fresco"],
    imagen: img("producto-queso-cabra-hierbas"),
    alt: "Rollo de queso de cabra blanco cubierto de hierbas, con una rodaja cortada y una ramita de romero",
    destacado: true,
  },
  {
    id: "queso-semiduro",
    nombre: "Queso semiduro estacionado",
    productorId: "cabras-del-cerro",
    categoria: "quesos",
    precio: 14800,
    unidad: "Horma de 800 g",
    descripcion: "Tres meses de cava. Sabor intenso, ideal para la picada.",
    etiquetas: ["3 meses de cava"],
    imagen: img("producto-queso-semiduro"),
    alt: "Horma de queso semiduro dorada con una cuña cortada adelante",
  },
  {
    id: "dulce-de-leche-cabra",
    nombre: "Dulce de leche de cabra",
    productorId: "cabras-del-cerro",
    categoria: "dulces",
    precio: 6400,
    unidad: "Frasco de 450 g",
    descripcion: "Oscuro, suave y menos dulce que el de vaca. Hecho en paila.",
    etiquetas: ["Sin TACC"],
    imagen: img("producto-dulce-de-leche-cabra"),
    alt: "Frasco de dulce de leche de cabra con tapa de tela a cuadros verde",
  },
  {
    id: "miel-multifloral",
    nombre: "Miel de monte multifloral",
    productorId: "apiario-la-quebrada",
    categoria: "miel",
    precio: 5900,
    unidad: "Frasco de 500 g",
    descripcion: "Líquida, ámbar y con notas de chañar. Cosecha de primavera.",
    etiquetas: ["Extracción en frío"],
    imagen: img("producto-miel-multifloral"),
    alt: "Frasco de miel ámbar con una cuchara de madera para miel apoyada al lado",
    destacado: true,
  },
  {
    id: "miel-cremosa",
    nombre: "Miel cremosa",
    productorId: "apiario-la-quebrada",
    categoria: "miel",
    precio: 6300,
    unidad: "Frasco de 500 g",
    descripcion: "Cristalizada naturalmente y batida a mano. Se unta como manteca.",
    etiquetas: ["Sin TACC"],
    imagen: img("producto-miel-cremosa"),
    alt: "Frasco de miel cremosa de color claro con tapa dorada",
  },
  {
    id: "panal-de-miel",
    nombre: "Panal de miel",
    productorId: "apiario-la-quebrada",
    categoria: "miel",
    precio: 9800,
    unidad: "Panal de 400 g",
    descripcion: "Tal como sale de la colmena. Para la tabla de quesos o comer con cuchara.",
    etiquetas: ["Edición limitada"],
    imagen: img("producto-panal-de-miel"),
    alt: "Trozo de panal con celdas de miel dorada sobre una tabla de madera",
    ultimas: true,
  },
  {
    id: "bolson-de-estacion",
    nombre: "Bolsón de verduras de estación",
    productorId: "huerta-los-molles",
    categoria: "verduras",
    precio: 11500,
    unidad: "Bolsón de 6 kg",
    descripcion: "Lechuga, acelga, zanahoria, remolacha, tomate y lo que dé la huerta esa semana.",
    etiquetas: ["Agroecológico"],
    imagen: img("producto-bolson-de-estacion"),
    alt: "Canasta de mimbre con lechuga, zanahorias, remolacha y tomate",
    destacado: true,
  },
  {
    id: "tomates-reliquia",
    nombre: "Tomates reliquia",
    productorId: "huerta-los-molles",
    categoria: "verduras",
    precio: 5400,
    unidad: "Cajón de 2 kg",
    descripcion: "Variedades antiguas: corazón de buey, negro de Crimea y amarillo perita.",
    etiquetas: ["Agroecológico", "Semillas propias"],
    imagen: img("producto-tomates-reliquia"),
    alt: "Cajón de madera con tomates rojos, amarillos, naranjas y morados",
  },
  {
    id: "huevos-de-campo",
    nombre: "Huevos de campo",
    productorId: "huerta-los-molles",
    categoria: "verduras",
    precio: 4200,
    unidad: "Maple de 12",
    descripcion: "De gallinas sueltas que comen restos de la huerta. Yema bien naranja.",
    etiquetas: ["Gallinas libres"],
    imagen: img("producto-huevos-de-campo"),
    alt: "Maple de cartón abierto con huevos de distintos tonos de marrón",
    ultimas: true,
  },
  {
    id: "mermelada-frutos-rojos",
    nombre: "Mermelada de frutos rojos",
    productorId: "dulces-dona-emma",
    categoria: "dulces",
    precio: 5200,
    unidad: "Frasco de 420 g",
    descripcion: "Frambuesa, frutilla y mora del valle. Con trozos de fruta.",
    etiquetas: ["Sin conservantes"],
    imagen: img("producto-mermelada-frutos-rojos"),
    alt: "Frasco de mermelada roja con tapa de tela a cuadros rojos",
    destacado: true,
  },
  {
    id: "dulce-de-membrillo",
    nombre: "Dulce de membrillo",
    productorId: "dulces-dona-emma",
    categoria: "dulces",
    precio: 4600,
    unidad: "Pan de 1 kg",
    descripcion: "De olla, firme y translúcido. El del queso y dulce de toda la vida.",
    etiquetas: ["Sin TACC"],
    imagen: img("producto-dulce-de-membrillo"),
    alt: "Pan de dulce de membrillo rojizo con una porción cortada y un membrillo encima",
  },
  {
    id: "higos-en-almibar",
    nombre: "Higos en almíbar",
    productorId: "dulces-dona-emma",
    categoria: "dulces",
    precio: 6900,
    unidad: "Frasco de 500 g",
    descripcion: "Higos enteros de otoño en almíbar liviano con un toque de canela.",
    etiquetas: ["De temporada"],
    imagen: img("producto-higos-en-almibar"),
    alt: "Frasco de higos en almíbar color violeta con tapa de tela a cuadros azules",
    ultimas: true,
  },
  {
    id: "pan-masa-madre",
    nombre: "Hogaza de masa madre",
    productorId: "horno-de-barro",
    categoria: "panificados",
    precio: 4800,
    unidad: "Hogaza de 900 g",
    descripcion: "Veinte horas de fermentación y horno a leña. Corteza crocante, miga húmeda.",
    etiquetas: ["Masa madre"],
    imagen: img("producto-pan-masa-madre"),
    alt: "Hogaza redonda de pan de masa madre con cortes y harina, sobre un repasador",
    destacado: true,
  },
  {
    id: "alfajores-maicena",
    nombre: "Alfajores de maicena",
    productorId: "horno-de-barro",
    categoria: "panificados",
    precio: 5600,
    unidad: "Caja de 6",
    descripcion: "Tapas que se deshacen, dulce de leche de campo y coco rallado.",
    etiquetas: ["Hechos a mano"],
    imagen: img("producto-alfajores-maicena"),
    alt: "Pila de tres alfajores de maicena con dulce de leche y coco en el borde",
  },
  {
    id: "budin-de-limon",
    nombre: "Budín de limón y amapola",
    productorId: "horno-de-barro",
    categoria: "panificados",
    precio: 6200,
    unidad: "Budín de 600 g",
    descripcion: "Con limones de la quinta y glaseado cítrico. Aguanta una semana (si sobra).",
    etiquetas: ["Harinas agroecológicas"],
    imagen: img("producto-budin-de-limon"),
    alt: "Budín con glaseado blanco y semillas de amapola, junto a una rodaja de limón",
  },
  {
    id: "malbec-de-altura",
    nombre: "Malbec de la Colonia 2023",
    productorId: "finca-los-algarrobos",
    categoria: "vinos",
    precio: 11900,
    unidad: "Botella de 750 ml",
    descripcion: "Frutado, con doce meses en roble usado. Tanda de 1.800 botellas.",
    etiquetas: ["Tanda chica"],
    imagen: img("producto-malbec-de-altura"),
    alt: "Botella de vino tinto con etiqueta de uvas y una copa servida al lado",
    destacado: true,
  },
  {
    id: "rosado-de-frambua",
    nombre: "Rosado de frambua 2024",
    productorId: "finca-los-algarrobos",
    categoria: "vinos",
    precio: 8900,
    unidad: "Botella de 750 ml",
    descripcion: "La uva típica de Caroya: liviano, perfumado y para tomar bien frío.",
    etiquetas: ["Típico de la Colonia"],
    imagen: img("producto-rosado-de-frambua"),
    alt: "Botella de vino rosado con cápsula fucsia y etiqueta clara",
  },
  {
    id: "salame-de-la-colonia",
    nombre: "Salame de la Colonia",
    productorId: "finca-los-algarrobos",
    categoria: "vinos",
    precio: 9600,
    unidad: "Pieza de 500 g aprox.",
    descripcion: "Receta friulana de la familia, estacionado cuarenta días en sótano.",
    etiquetas: ["Receta familiar"],
    imagen: img("producto-salame-de-la-colonia"),
    alt: "Salame atado con hilo sobre una tabla, con tres rodajas cortadas",
  },
];

export const productorPorId = Object.fromEntries(productores.map((p) => [p.id, p])) as Record<string, Productor>;
export const productoPorId = Object.fromEntries(productos.map((p) => [p.id, p])) as Record<string, Producto>;
export const zonaPorId = Object.fromEntries(zonas.map((z) => [z.id, z])) as Record<ZonaId, Zona>;

/** Punto de encuentro para retirar sin costo (ficticio). */
export const puntoDeEncuentro = "Punto Del Valle · Pasaje Las Moreras 214, barrio Güemes";
