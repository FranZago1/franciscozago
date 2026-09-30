// Fotos reales (Unsplash) para Del Valle Mercado (marketplaces/productores), Cava Aldea (catalogos/vinoteca)
// y Nido (catalogos/deco): reemplazan algunas ilustraciones de `marketplaces.mjs` / `catalogos.mjs` y suman fotos nuevas.
// Uso: node scripts/demos/fotos-productores-catalogos.mjs [solo=productores|vinoteca|deco]
// Correr DESPUÉS de `marketplaces.mjs` y `catalogos.mjs` (que regeneran las ilustraciones y pisarían estas fotos).
// Quedan ilustrados a propósito: retratos de productores, botellas con etiqueta, ambientes con hotspots y
// productos con variantes de terminación. Licencia Unsplash: uso libre, sin atribución obligatoria.
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(import.meta.dirname, "..", "..", "public", "demos");
const solo = process.argv.slice(2).find((a) => !a.startsWith("-"));

/**
 * ruta (relativa a public/demos) → foto.
 * `w`/`h`: tamaño final (el del archivo original, o el definido para las imágenes nuevas).
 * `extract`: recorte previo en fracciones de la foto { left, top, width, height } para encuadrar a mano.
 */
const fotos = [
  // Del Valle Mercado
  { ruta: "marketplaces/productores/hero-puesto.webp", id: "1488459716781-31db52582fe9", w: 1600, h: 1100 },
  { ruta: "marketplaces/productores/producto-queso-semiduro.webp", id: "1486297678162-eb2a19b0a32d", w: 800, h: 800 },
  { ruta: "marketplaces/productores/producto-pan-masa-madre.webp", id: "1509440159596-0249088772ff", w: 800, h: 800 },


  // Cava Aldea (nuevas: fondo del hero y banner de degustaciones)
  { ruta: "catalogos/vinoteca/hero-copa.webp", id: "1474722883778-792e7990302f", w: 1800, h: 1100 },
  { ruta: "catalogos/vinoteca/degustacion.webp", id: "1510812431401-41d2bd2722f3", w: 1600, h: 800 },

  // Nido (nueva: foto de la sección "Del taller a tu casa")
  { ruta: "catalogos/deco/casa-living.webp", id: "1600210492486-724fe5c67fb0", w: 1600, h: 800 },
];

// Se baja con curl (respeta el proxy/CA del entorno, a diferencia de fetch de Node).
function descargar(id) {
  const url = `https://images.unsplash.com/photo-${id}?w=2000&q=80&fm=jpg`;
  return execFileSync("curl", ["-sSfL", url], { maxBuffer: 64 * 1024 * 1024 });
}

for (const foto of fotos) {
  if (solo && !foto.ruta.includes(`/${solo}/`)) continue;
  const out = join(root, foto.ruta);
  mkdirSync(dirname(out), { recursive: true });
  const buf = descargar(foto.id);
  let img = sharp(buf).rotate();
  if (foto.extract) {
    const { width, height } = await sharp(buf).metadata();
    const e = foto.extract;
    img = sharp(
      await img
        .extract({
          left: Math.round(e.left * width),
          top: Math.round(e.top * height),
          width: Math.round(e.width * width),
          height: Math.round(e.height * height),
        })
        .toBuffer(),
    );
  }
  const escala = Math.min(1, 2000 / Math.max(foto.w, foto.h));
  await img
    .resize(Math.round(foto.w * escala), Math.round(foto.h * escala), { fit: "cover", position: "attention" })
    .webp({ quality: 78, effort: 5 })
    .toFile(out);
  console.log("✓", foto.ruta, "←", foto.id);
}
