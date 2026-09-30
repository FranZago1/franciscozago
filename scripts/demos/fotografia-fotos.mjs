/**
 * Descarga las fotos reales (Unsplash) de las demos de fotografía, las recorta al tamaño
 * de su orientación y las guarda como WebP en public/demos/fotografia/<estilo>/foto-NN.webp.
 *
 *   node scripts/demos/fotografia-fotos.mjs              # las tres demos
 *   node scripts/demos/fotografia-fotos.mjs documental   # solo una
 *
 * Las orientaciones deben coincidir con las de src/content/demos.ts.
 * Las descargas se cachean en el directorio temporal del sistema. No toca captura.webp.
 * Licencia Unsplash: uso libre, sin atribución obligatoria.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const RAIZ = process.cwd();
const OUT = path.join(RAIZ, "public/demos/fotografia");
const CACHE = path.join(os.tmpdir(), "fotografia-unsplash");

const DIMENSIONES = {
  vertical: { width: 1600, height: 2000 },
  horizontal: { width: 2000, height: 1333 },
  cuadrada: { width: 1600, height: 1600 },
};

/** Por demo, en orden: [ID de Unsplash, orientación]. El índice define foto-NN.webp. */
const DEMOS = {
  editorial: [
    ["1537633552985-df8429e8048b", "vertical"], // novios con velo largo en la playa
    ["1591604466107-ec97de577aff", "horizontal"], // novios abrazados junto a un lago en otoño
    ["1465495976277-4387d4b0b4c6", "cuadrada"], // manos de novios con anillos y ramo
    ["1504703395950-b89145a5425b", "vertical"], // mujer con polera celeste frente a persiana
    ["1500648767791-00dcc994a43e", "vertical"], // hombre sonriendo, fondo gris
    ["1469371670807-013ccf25f16a", "horizontal"], // pasillo de ceremonia con flores
    ["1519741497674-611481863552", "horizontal"], // novia con ramo a contraluz
    ["1511285560929-80b456fea0bc", "cuadrada"], // novios con globos blancos
    ["1494790108377-be9c29b29330", "vertical"], // mujer sonriendo con suéter rojo
    ["1519225421980-715cb0215aed", "horizontal"], // mesa de banquete con flores y copas
    ["1438761681033-6461ffad8d80", "horizontal"], // mujer pelirroja junto a un lago
    ["1606800052052-a08af7148866", "cuadrada"], // anillos de oro sobre tela
    ["1522673607200-164d1b6ce486", "horizontal"], // sillas decoradas con flores
    ["1507003211169-0a1dd7228f2d", "vertical"], // hombre sonriendo, remera blanca
    ["1583939003579-730e3918a45a", "vertical"], // beso de novios con pétalos
  ],
  cinematico: [
    ["1534308143481-c55f00be8bd7", "horizontal"], // hombre de saco al atardecer
    ["1506794778202-cad84cf45f1d", "vertical"], // hombre con barba, fondo negro
    ["1534528741775-53994a69daeb", "vertical"], // mujer con luz azul
    ["1487412947147-5cebf100ffc2", "horizontal"], // maquillaje de ojos y labios
    ["1485968579580-b6d095142e6e", "vertical"], // saco escocés en la calle
    ["1502716119720-b23a93e5fe1b", "horizontal"], // vestido rojo a lunares en un campo
    ["1524504388940-b1c1722653e1", "vertical"], // mujer rubia sobre fondo oscuro
    ["1469334031218-e382a71b716b", "horizontal"], // anteojos de sol sobre pared amarilla
    ["1515886657613-9f3515b0c78f", "vertical"], // conjunto amarillo deportivo en cancha de básquet
    ["1496747611176-843222e1e57c", "horizontal"], // vestido floreado en la playa
    ["1539109136881-3be0616acf4b", "vertical"], // tapado celeste frente a una catedral
    ["1521572163474-6864f9cf17ab", "cuadrada"], // remera blanca lisa
    ["1509631179647-0177331693ae", "vertical"], // pantalón a rayas, fondo turquesa
    ["1552374196-1ab2a1c593e8", "vertical"], // saco camel y pantalón claro
  ],
  documental: [
    ["1475503572774-15a45e5d60b9", "horizontal"], // familia caminando en la playa
    ["1555252333-9f8e92e65df9", "cuadrada"], // piecitos de bebé
    ["1503454537195-1dcabb73ffb9", "vertical"], // nena con la cara pintada
    ["1484665754804-74b091211472", "horizontal"], // mamá levantando a su hija
    ["1511795409834-ef04bbd61622", "horizontal"], // mesa larga de fiesta
    ["1543342384-1f1350e27861", "vertical"], // padres con recién nacido
    ["1502086223501-7ea6ecd79368", "horizontal"], // chicos saltando en el bosque
    ["1516627145497-ae6968895b74", "cuadrada"], // nena con cámara de juguete
    ["1536640712-4d4c36ff0e4e", "vertical"], // nene corriendo en un puente
    ["1491013516836-7db643ee125a", "cuadrada"], // bebé de ojos celestes
    ["1502781252888-9143ba7f074e", "horizontal"], // cuatro chicos riendo en el pasto
    ["1476703993599-0035a21b17a9", "horizontal"], // mamá con dos chicos en el sillón
    ["1519689680058-324335c77eba", "horizontal"], // bebé en flotador con anteojos
    ["1583939003579-730e3918a45a", "vertical"], // beso de novios con pétalos
    ["1511895426328-dc8714191300", "horizontal"], // familia grande al atardecer
  ],
};

function descargar(id) {
  mkdirSync(CACHE, { recursive: true });
  const destino = path.join(CACHE, `${id}.jpg`);
  if (!existsSync(destino) || statSync(destino).size === 0) {
    execFileSync("curl", [
      "-sSfL",
      "-o",
      destino,
      `https://images.unsplash.com/photo-${id}?w=2400&q=85&fm=jpg`,
    ]);
  }
  return destino;
}

async function procesar(estilo) {
  const lista = DEMOS[estilo];
  const dir = path.join(OUT, estilo);
  mkdirSync(dir, { recursive: true });
  for (const [i, [id, orientacion]] of lista.entries()) {
    const archivo = `foto-${String(i + 1).padStart(2, "0")}.webp`;
    const { width, height } = DIMENSIONES[orientacion];
    await sharp(descargar(id))
      .resize(width, height, { fit: "cover", position: "attention" })
      .webp({ quality: 78 })
      .toFile(path.join(dir, archivo));
    console.log(`${estilo}/${archivo} ← ${id} (${orientacion})`);
  }
  // Borra fotos sobrantes de listas anteriores más largas (nunca captura.webp).
  for (const f of readdirSync(dir)) {
    const m = /^foto-(\d+)\.webp$/.exec(f);
    if (m && Number(m[1]) > lista.length) {
      unlinkSync(path.join(dir, f));
      console.log(`${estilo}/${f} borrada (sobrante)`);
    }
  }
}

const pedidos = process.argv.slice(2);
const estilos = pedidos.length ? pedidos : Object.keys(DEMOS);
for (const e of estilos) {
  if (!DEMOS[e]) throw new Error(`Demo desconocida: ${e}`);
  await procesar(e);
}
