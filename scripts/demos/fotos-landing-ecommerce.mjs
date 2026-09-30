// Fotos reales (Unsplash) para algunas imágenes de las demos landing/impacto, landing/sereno,
// ecommerce/urbano y ecommerce/natural. Reemplaza escenas, ambientes y personas; los productos
// recortados, íconos, mapas y el comparador antes/después siguen siendo ilustraciones.
//
// Uso: node scripts/demos/fotos-landing-ecommerce.mjs
// Correrlo DESPUÉS de landing.mjs y ecommerce.mjs (esos scripts regeneran las ilustraciones con
// los mismos nombres de archivo y pisarían estas fotos).
//
// Cada entrada descarga la foto, la recorta con sharp al tamaño exacto del archivo que reemplaza
// (`fit: "cover"`) y la exporta a WebP con el mismo nombre. Las descargas se cachean en el
// directorio temporal del sistema para que re-ejecutar sea rápido.
// Licencia Unsplash: uso libre, sin atribución obligatoria.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(import.meta.dirname, "..", "..", "public", "demos");
const cache = join(tmpdir(), "fz-unsplash-cache");

/**
 * archivo: ruta dentro de public/demos · id: foto de Unsplash · w/h: tamaño final (el mismo del
 * archivo que se pisa) · recorte (opcional): región previa en fracciones de la foto original, para
 * encuadrar a mano cuando "attention" no alcanza (p. ej. dejar afuera un logo).
 */
const fotos = [
  // landing/impacto: box de entrenamiento (oscuro). Los coaches tienen nombre y quedan ilustrados.
  {
    archivo: "landing/impacto/hero-atleta-envion.webp",
    id: "1581009146145-b5ef050c2e1e",
    w: 1200,
    h: 1500,
    recorte: { left: 0.33, top: 0, width: 0.54, height: 1 }, // deja afuera el logo del disco
  },
  { archivo: "landing/impacto/disciplina-funcional.webp", id: "1583454110551-21f2fa2afe61", w: 900, h: 1100 },
  {
    archivo: "landing/impacto/disciplina-halterofilia.webp",
    id: "1517836357463-d25dfeac3438",
    w: 900,
    h: 1100,
    recorte: { left: 0, top: 0.2, width: 0.43, height: 0.79 }, // disco y agarre, sin zapatillas ni short con marca
  },
  {
    archivo: "landing/impacto/disciplina-hiit.webp",
    id: "1571019613454-1cb2f99b2d8b",
    w: 900,
    h: 1100,
    recorte: { left: 0.5, top: 0, width: 0.5, height: 0.92 }, // torso y cara, sin las zapatillas
  },
  { archivo: "landing/impacto/disciplina-movilidad.webp", id: "1506126613408-eca07ce68773", w: 900, h: 1100 },

  // landing/sereno: centro de estética. El equipo y el antes/después quedan ilustrados.
  { archivo: "landing/sereno/hero-retrato-calma.webp", id: "1570172619644-dfd03ed5d881", w: 1200, h: 1500 },
  { archivo: "landing/sereno/producto-facial.webp", id: "1515377905703-c4788e51af15", w: 800, h: 800 },
  { archivo: "landing/sereno/producto-corporal.webp", id: "1544161515-4ab6ce6db874", w: 800, h: 800 },
  { archivo: "landing/sereno/producto-relax.webp", id: "1600334129128-685c5582fd35", w: 800, h: 800 },
  { archivo: "landing/sereno/producto-manos.webp", id: "1540555700478-4be289fbecef", w: 800, h: 800 },
  { archivo: "landing/sereno/espacio-cabina.webp", id: "1521590832167-7bcbfaa6381f", w: 1400, h: 1000 },

  // ecommerce/urbano: hero y lookbook. Los productos individuales quedan ilustrados.
  { archivo: "ecommerce/urbano/drop-hero.webp", id: "1512436991641-6745cdb1723f", w: 1400, h: 1400 },
  { archivo: "ecommerce/urbano/lookbook-01.webp", id: "1515886657613-9f3515b0c78f", w: 1200, h: 1500 },
  { archivo: "ecommerce/urbano/lookbook-02.webp", id: "1521572163474-6864f9cf17ab", w: 1200, h: 1500 },
  { archivo: "ecommerce/urbano/lookbook-03.webp", id: "1552374196-1ab2a1c593e8", w: 1200, h: 1500 },

  // ecommerce/natural: solo el hero. Productos y rutinas (composiciones de esos productos) quedan ilustrados.
  { archivo: "ecommerce/natural/hero-coleccion.webp", id: "1540555700478-4be289fbecef", w: 1400, h: 1100 },
];

function descargar(id) {
  mkdirSync(cache, { recursive: true });
  const ruta = join(cache, `${id}.jpg`);
  if (existsSync(ruta) && statSync(ruta).size > 0) return ruta;
  // curl (y no fetch) para respetar HTTPS_PROXY y los certificados del sistema.
  execFileSync("curl", ["-sfL", "-o", ruta, `https://images.unsplash.com/photo-${id}?w=2000&q=80&fm=jpg`]);
  return ruta;
}

for (const f of fotos) {
  const origen = descargar(f.id);
  let img = sharp(origen).rotate();
  if (f.recorte) {
    const { width, height } = await sharp(origen).rotate().metadata();
    img = img.extract({
      left: Math.round(f.recorte.left * width),
      top: Math.round(f.recorte.top * height),
      width: Math.round(f.recorte.width * width),
      height: Math.round(f.recorte.height * height),
    });
  }
  const escala = Math.min(1, 2000 / Math.max(f.w, f.h));
  const w = Math.round(f.w * escala);
  const h = Math.round(f.h * escala);
  const out = join(root, f.archivo);
  mkdirSync(dirname(out), { recursive: true });
  await img
    .resize(w, h, { fit: "cover", position: f.recorte ? "centre" : "attention" })
    .webp({ quality: 78, effort: 5 })
    .toFile(out);
  console.log("✓", `demos/${f.archivo}`, `${w}x${h}`, `← ${f.id}`);
}
