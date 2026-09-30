/**
 * Demos agrupadas por vertical. Para sumar una vertical nueva (ej. catálogos o landings)
 * alcanza con agregar un objeto a `verticales`; la sección del home se arma sola.
 *
 * Todo el contenido de las demos es FICTICIO (fotógrafos, testimonios, textos).
 */

export type Orientacion = "vertical" | "horizontal" | "cuadrada";

export type FotoDemo = {
  /** Nombre de archivo dentro de /public/demos/<vertical>/<estilo>/ */
  archivo: string;
  /** Qué muestra (o qué debería mostrar) la foto. Se usa como alt y como búsqueda sugerida. */
  tema: string;
  orientacion: Orientacion;
};

export type Demo = {
  slug: string;
  nombre: string;
  para: string;
  linea: string;
  fotografo: { nombre: string; ciudad: string; bio: string[] };
  servicios: { nombre: string; linea: string }[];
  testimonio?: { texto: string; autor: string };
  fotos: FotoDemo[];
  /** Captura de la demo para la tarjeta del home (ruta en /public). Si falta, se usa la primera foto. */
  captura?: string;
  /** true mientras las fotos sean placeholders generados (sin acceso a Unsplash). */
  placeholder: boolean;
};

export type Vertical = {
  slug: string;
  titulo: string;
  bajada: string;
  demos: Demo[];
};

export const DIMENSIONES: Record<Orientacion, { width: number; height: number }> = {
  vertical: { width: 1600, height: 2000 },
  horizontal: { width: 2000, height: 1333 },
  cuadrada: { width: 1600, height: 1600 },
};

const fotos = (lista: [string, Orientacion][]): FotoDemo[] =>
  lista.map(([tema, orientacion], i) => ({
    archivo: `foto-${String(i + 1).padStart(2, "0")}.webp`,
    tema,
    orientacion,
  }));

const editorial: Demo = {
  slug: "editorial",
  captura: "/demos/fotografia/editorial/captura.webp",
  nombre: "Editorial",
  para: "Retrato y bodas",
  linea: "Blanco, mucho aire y fotos en una grilla asimétrica. Elegante y calmo.",
  fotografo: {
    nombre: "Inés Valdeolmo",
    ciudad: "Córdoba",
    bio: [
      "Fotografío personas en los días que después quieren recordar: bodas chicas, retratos, aniversarios.",
      "Trabajo con luz natural y con tiempo. Prefiero pocas fotos bien pensadas a cientos de tomas iguales.",
    ],
  },
  servicios: [
    { nombre: "Bodas", linea: "Cobertura de ceremonia y celebración, con entrega en galería privada." },
    { nombre: "Retratos", linea: "Sesiones individuales o en pareja, en estudio o en exteriores." },
    { nombre: "Preboda", linea: "Una sesión tranquila antes del gran día, para conocernos." },
  ],
  testimonio: {
    texto: "Nos olvidamos de que había una cámara. Las fotos parecen escenas de una película tranquila.",
    autor: "Clara y Matías (testimonio ficticio)",
  },
  fotos: fotos([
    ["novios abrazados en la playa, con el velo largo al viento", "vertical"],
    ["novios abrazados junto a un lago en otoño", "horizontal"],
    ["manos de los novios con anillos sobre el ramo", "cuadrada"],
    ["retrato de mujer con polera celeste frente a una persiana", "vertical"],
    ["retrato de hombre sonriendo sobre fondo gris", "vertical"],
    ["pasillo de ceremonia al aire libre con arreglos de flores", "horizontal"],
    ["novia con el ramo a contraluz", "horizontal"],
    ["novios soltando globos blancos frente a los invitados", "cuadrada"],
    ["retrato de mujer riendo con suéter rojo", "vertical"],
    ["mesa de banquete con flores y copas", "horizontal"],
    ["retrato de mujer pelirroja junto a un lago", "horizontal"],
    ["anillos de oro sobre tela", "cuadrada"],
    ["dos sillas decoradas con flores sobre el pasto", "horizontal"],
    ["retrato de hombre sonriendo con remera blanca", "vertical"],
    ["beso de los novios mientras los invitados tiran pétalos", "vertical"],
  ]),
  placeholder: false,
};

const cinematico: Demo = {
  slug: "cinematico",
  captura: "/demos/fotografia/cinematico/captura.webp",
  nombre: "Cinemático",
  para: "Moda y trabajo conceptual",
  linea: "Fondo negro y fotos a sangre, una tras otra. Impacto y drama.",
  fotografo: {
    nombre: "Teo Varsky",
    ciudad: "Buenos Aires",
    bio: [
      "Moda, campañas y proyectos personales.",
      "Luz dura, sombras largas y poco texto.",
    ],
  },
  servicios: [
    { nombre: "Campañas", linea: "Producción completa para marcas de moda." },
    { nombre: "Editoriales", linea: "Series conceptuales para revistas y lookbooks." },
    { nombre: "Retrato artístico", linea: "Sesiones con dirección de arte." },
  ],
  fotos: fotos([
    ["hombre de saco y anteojos de perfil al atardecer", "horizontal"],
    ["retrato de hombre con barba sobre fondo negro", "vertical"],
    ["retrato de mujer iluminada con luz azul", "vertical"],
    ["maquillaje de ojos y labios en primer plano", "horizontal"],
    ["mujer con saco escocés en una calle", "vertical"],
    ["vestido rojo a lunares en movimiento en un campo", "horizontal"],
    ["retrato de mujer rubia en clave baja", "vertical"],
    ["mujer con anteojos de sol frente a una pared amarilla", "horizontal"],
    ["mujer con conjunto deportivo amarillo en una cancha de básquet", "vertical"],
    ["vestido floreado junto al mar", "horizontal"],
    ["mujer con tapado celeste frente a una catedral", "vertical"],
    ["modelo con remera blanca lisa", "cuadrada"],
    ["mujer con pantalón a rayas sobre fondo turquesa", "vertical"],
    ["hombre sentado con saco camel y pantalón claro", "vertical"],
  ]),
  placeholder: false,
};

const documental: Demo = {
  slug: "documental",
  captura: "/demos/fotografia/documental/captura.webp",
  nombre: "Documental cálido",
  para: "Familias, eventos y newborn",
  linea: "Colores cálidos y luminosos, galería tipo mosaico. Cercano y espontáneo.",
  fotografo: {
    nombre: "Julia Pampín",
    ciudad: "Villa Carlos Paz",
    bio: [
      "Fotografío familias tal como son: con desorden, abrazos y risas que no se pueden posar.",
      "Voy a tu casa, a la plaza o al cumple, y me quedo el tiempo que haga falta.",
    ],
  },
  servicios: [
    { nombre: "Familias", linea: "Una tarde con ustedes, en casa o al aire libre." },
    { nombre: "Newborn", linea: "Las primeras semanas del bebé, sin poses forzadas." },
    { nombre: "Cumpleaños y eventos", linea: "Cobertura documental de principio a fin." },
    { nombre: "Día en la vida", linea: "Un día completo de la familia, de la mañana a la noche." },
  ],
  testimonio: {
    texto: "Julia se hizo amiga de los chicos en cinco minutos. Las fotos son nuestra casa, tal cual.",
    autor: "Familia Ortega (testimonio ficticio)",
  },
  fotos: fotos([
    ["familia caminando de la mano en la orilla del mar", "horizontal"],
    ["piecitos de bebé asomando de una toalla blanca", "cuadrada"],
    ["nena riendo con la cara pintada de colores", "vertical"],
    ["mamá levantando a su hija en el parque", "horizontal"],
    ["mesa larga de festejo con flores y copas", "horizontal"],
    ["papá y mamá con su bebé recién nacido", "vertical"],
    ["chicos saltando en un bosque verde", "horizontal"],
    ["nena jugando con una cámara de juguete", "cuadrada"],
    ["nena corriendo sobre un puente", "vertical"],
    ["bebé de ojos celestes mordiendo un juguete", "cuadrada"],
    ["cuatro chicos riendo sentados en el pasto", "horizontal"],
    ["mamá con sus dos hijos en el sillón", "horizontal"],
    ["bebé en un flotador con anteojos de sol", "horizontal"],
    ["novios besándose entre pétalos y amigos", "vertical"],
    ["familia grande de espaldas mirando el atardecer en la playa", "horizontal"],
  ]),
  placeholder: false,
};

export const verticales: Vertical[] = [
  {
    slug: "fotografia",
    titulo: "¿Sos fotógrafo? Elegí un estilo.",
    bajada:
      "Tres portfolios de ejemplo, cada uno con otra personalidad. Mirá cuál se parece más a tu trabajo y lo armamos con tus fotos.",
    demos: [editorial, cinematico, documental],
  },
];

export function getDemo(vertical: string, slug: string): Demo | undefined {
  return verticales.find((v) => v.slug === vertical)?.demos.find((d) => d.slug === slug);
}

export function fotoSrc(vertical: string, demo: string, foto: FotoDemo): string {
  return `/demos/${vertical}/${demo}/${foto.archivo}`;
}

export function fotoAlt(demo: Demo, foto: FotoDemo): string {
  return demo.placeholder ? `Espacio para foto: ${foto.tema}` : foto.tema;
}
