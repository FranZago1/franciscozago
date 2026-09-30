// Fotos reales (Unsplash) para las demos de reservas: reemplazan algunas ilustraciones de `reservas.mjs`.
// Uso: node scripts/demos/fotos-reservas.mjs [solo=barberia|canchas|cabanas]
// Correr DESPUÉS de `reservas.mjs` (que regenera las ilustraciones y pisaría estas fotos).
// Cada foto se descarga, se recorta al mismo tamaño que el archivo que reemplaza y se guarda como WebP.
// Licencia Unsplash: uso libre, sin atribución obligatoria. Las personas (barberos) siguen ilustradas a propósito.
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(import.meta.dirname, "..", "..", "public", "demos", "reservas");
const solo = process.argv.slice(2).find((a) => !a.startsWith("-"));

/**
 * ruta (relativa a public/demos/reservas) → foto.
 * `w`/`h`: tamaño final (el mismo del archivo original).
 * `extract`: recorte previo en fracciones de la foto { left, top, width, height } para encuadrar a mano.
 * `flop`: espejar horizontalmente (para que el sujeto quede del lado libre de texto).
 */
const fotos = [
  // Barbería Don Filo
  { ruta: "barberia/hero-sillon.webp", id: "1585747860715-2ba37e788b70", w: 1600, h: 1200 },
  { ruta: "barberia/herramientas.webp", id: "1503951914875-452162b0f3f1", w: 1400, h: 900 },

  // Cabañas Arroyo Manso
  { ruta: "cabanas/hero-sierras.webp", id: "1542718610-a1d656d1884c", w: 1800, h: 1100, flop: true },
  { ruta: "cabanas/cabana-algarrobo.webp", id: "1449158743715-0a90ebb6d2d8", w: 1200, h: 900 },
  { ruta: "cabanas/cabana-molles.webp", id: "1568605114967-8130f3a36994", w: 1200, h: 900 },
  {
    ruta: "cabanas/cabana-tala.webp",
    id: "1470770841072-f978cf4d019e",
    w: 1200,
    h: 900,
    extract: { left: 0.4, top: 0.325, width: 0.6, height: 0.675 },
  },
  { ruta: "cabanas/cabana-mirador.webp", id: "1600585154340-be6161a56a0c", w: 1200, h: 900 },
  { ruta: "cabanas/interior-living.webp", id: "1502672260266-1c1ef2d93688", w: 1200, h: 900 },

  // Pádel Club Sierras
  { ruta: "canchas/hero-cancha.webp", id: "1658491830143-72808ca237e3", w: 1800, h: 1200 },
];

// Se baja con curl (respeta el proxy/CA del entorno, a diferencia de fetch de Node).
function descargar(id) {
  const url = `https://images.unsplash.com/photo-${id}?w=2000&q=80&fm=jpg`;
  return execFileSync("curl", ["-sSfL", url], { maxBuffer: 64 * 1024 * 1024 });
}

for (const foto of fotos) {
  if (solo && !foto.ruta.startsWith(`${solo}/`)) continue;
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
  if (foto.flop) img = img.flop();
  const escala = Math.min(1, 2000 / Math.max(foto.w, foto.h));
  await img
    .resize(Math.round(foto.w * escala), Math.round(foto.h * escala), { fit: "cover", position: "attention" })
    .webp({ quality: 78, effort: 5 })
    .toFile(out);
  console.log("✓", foto.ruta, "←", foto.id);
}
