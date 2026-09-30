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
    ["retrato de mujer con luz de ventana", "vertical"],
    ["novios caminando en un campo al atardecer", "horizontal"],
    ["detalle de manos con anillos", "cuadrada"],
    ["ramo de flores blancas sobre una mesa", "vertical"],
    ["retrato de hombre en blanco y negro", "vertical"],
    ["ceremonia al aire libre bajo árboles", "horizontal"],
    ["vestido de novia colgado junto a una ventana", "vertical"],
    ["pareja riendo abrazada", "cuadrada"],
    ["retrato de perfil con fondo neutro", "vertical"],
    ["mesa de banquete con velas", "horizontal"],
    ["novia mirando por la ventana", "vertical"],
    ["zapatos y detalles de la boda", "cuadrada"],
    ["pareja bailando de noche", "horizontal"],
    ["retrato de mujer mayor sonriendo", "vertical"],
    ["salida de la ceremonia con pétalos", "horizontal"],
  ]),
  placeholder: true,
};

const cinematico: Demo = {
  slug: "cinematico",
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
    ["modelo con luz dura y sombras marcadas", "horizontal"],
    ["retrato en clave baja con fondo negro", "vertical"],
    ["moda urbana de noche con luces de neón", "horizontal"],
    ["silueta a contraluz", "horizontal"],
    ["detalle de tela en movimiento", "vertical"],
    ["modelo en escalera de hormigón", "horizontal"],
    ["retrato con humo y luz lateral", "vertical"],
    ["editorial de moda en blanco y negro", "horizontal"],
    ["figura caminando en un pasillo oscuro", "horizontal"],
    ["rostro parcialmente iluminado", "vertical"],
    ["moda en paisaje desértico", "horizontal"],
    ["manos con joyas sobre fondo negro", "cuadrada"],
    ["modelo reflejado en un vidrio", "horizontal"],
    ["retrato con luz roja", "vertical"],
  ]),
  placeholder: true,
};

const documental: Demo = {
  slug: "documental",
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
    ["familia jugando en el pasto", "horizontal"],
    ["bebé recién nacido durmiendo", "cuadrada"],
    ["niña riendo con el pelo al viento", "vertical"],
    ["padre levantando a su hijo en brazos", "vertical"],
    ["cumpleaños infantil con torta y velas", "horizontal"],
    ["manos de bebé sobre la mano de la madre", "cuadrada"],
    ["hermanos saltando en la cama", "horizontal"],
    ["abuela y nieta cocinando", "vertical"],
    ["familia caminando en la playa", "horizontal"],
    ["niño con globo en una plaza", "vertical"],
    ["madre amamantando con luz de ventana", "vertical"],
    ["perro y niños en el jardín", "horizontal"],
    ["pies de bebé con mantita tejida", "cuadrada"],
    ["festejo familiar alrededor de una mesa", "horizontal"],
    ["niña soplando un diente de león", "vertical"],
    ["familia abrazada al atardecer", "horizontal"],
  ]),
  placeholder: true,
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
