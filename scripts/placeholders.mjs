// Genera imágenes placeholder (WebP) para trabajos y demos mientras no estén las reales.
// Uso: node scripts/placeholders.mjs [--force]
// Usa `sharp`, que ya viene instalado como dependencia de Next.js (no se agrega al proyecto).
// Sin --force no pisa archivos existentes, así que no borra capturas o fotos reales.
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const force = process.argv.includes("--force");
const root = join(import.meta.dirname, "..", "public");

async function write(relPath, svg) {
  const out = join(root, relPath);
  if (existsSync(out) && !force) return;
  mkdirSync(dirname(out), { recursive: true });
  await sharp(Buffer.from(svg)).webp({ quality: 72 }).toFile(out);
  console.log("✓", relPath);
}

// Pseudo-aleatorio determinista para que las imágenes no cambien entre corridas.
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

// ---------- Trabajos: wireframe neutro de un sitio ----------
function wireframe(w, h, mobile, seed) {
  const r = rng(seed);
  const pad = mobile ? 40 : 72;
  const bar = mobile ? 56 : 64;
  const blocks = [];
  let y = bar + pad;
  const heroH = mobile ? h * 0.32 : h * 0.42;
  blocks.push(`<rect x="${pad}" y="${y}" width="${w - pad * 2}" height="${heroH}" rx="14" fill="#E6E6E4"/>`);
  y += heroH + pad * 0.7;
  const cols = mobile ? 1 : 3;
  const gap = mobile ? 24 : 32;
  const cw = (w - pad * 2 - gap * (cols - 1)) / cols;
  while (y < h - pad) {
    for (let c = 0; c < cols; c++) {
      const ch = (mobile ? 220 : 260) * (0.8 + r() * 0.4);
      blocks.push(`<rect x="${pad + c * (cw + gap)}" y="${y}" width="${cw}" height="${ch}" rx="12" fill="#ECECEA"/>`);
      blocks.push(`<rect x="${pad + c * (cw + gap)}" y="${y + ch + 16}" width="${cw * (0.5 + r() * 0.4)}" height="14" rx="7" fill="#DEDEDC"/>`);
    }
    y += (mobile ? 300 : 340);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="#F5F5F4"/>
  <rect width="100%" height="${bar}" fill="#EDEDEB"/>
  <rect x="${pad}" y="${bar / 2 - 8}" width="${mobile ? 120 : 160}" height="16" rx="8" fill="#D6D6D4"/>
  ${blocks.join("\n")}
</svg>`;
}

// ---------- Demos: composiciones abstractas con "luz" según el estilo ----------
const PALETAS = {
  editorial: { bg: ["#DCD6CE", "#CFC8BE", "#E4DFD8", "#C4BCB1"], blobs: ["#A89E91", "#F4F1EC", "#8E857A", "#D8D0C5"] },
  cinematico: { bg: ["#0B0B0B", "#141414", "#1C1917", "#0E1216"], blobs: ["#8A8A8A", "#3D3D3D", "#B8B0A6", "#5A1E1E"] },
  documental: { bg: ["#F9D9B8", "#F6C8A8", "#FBE3C4", "#F4D08A"], blobs: ["#F2B233", "#FFF4E0", "#E88A6A", "#C98FA6"] },
};

function foto(w, h, estilo, seed) {
  const r = rng(seed);
  const p = PALETAS[estilo];
  const pick = (a) => a[Math.floor(r() * a.length)];
  const blobs = Array.from({ length: 5 }, () => {
    const cx = r() * w;
    const cy = r() * h;
    const rad = Math.max(w, h) * (0.15 + r() * 0.35);
    return `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${pick(p.blobs)}" opacity="${0.35 + r() * 0.5}"/>`;
  });
  // Una "figura" vertical sugerida, para que se lea como foto y no como fondo.
  const fx = w * (0.3 + r() * 0.4);
  const fw = w * (0.12 + r() * 0.1);
  const fig = `<ellipse cx="${fx}" cy="${h * 0.62}" rx="${fw}" ry="${h * 0.34}" fill="${estilo === "cinematico" ? "#000" : pick(p.blobs)}" opacity="0.55"/>`;
  const blur = Math.round(Math.max(w, h) * 0.06);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs><filter id="b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${blur}"/></filter>
  <linearGradient id="g" x1="0" y1="0" x2="${r().toFixed(2)}" y2="1"><stop offset="0" stop-color="${pick(p.bg)}"/><stop offset="1" stop-color="${pick(p.bg)}"/></linearGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <g filter="url(#b)">${blobs.join("")}${fig}</g>
</svg>`;
}

const { verticales, DIMENSIONES } = await import("../src/content/demos.ts").catch(() => ({}));

async function main() {
  for (const [i, slug] of ["trendahaus", "benicioshop", "unichat"].entries()) {
    await write(`trabajos/${slug}/desktop.webp`, wireframe(1600, 1000, false, 11 + i));
    await write(`trabajos/${slug}/mobile.webp`, wireframe(780, 1688, true, 21 + i));
  }
  if (!verticales) {
    console.error("No pude importar src/content/demos.ts (usá Node >= 22.6 con --experimental-strip-types).");
    process.exit(1);
  }
  let seed = 100;
  for (const v of verticales) {
    for (const d of v.demos) {
      for (const f of d.fotos) {
        const { width, height } = DIMENSIONES[f.orientacion];
        // Se generan a la mitad de tamaño: son placeholders, no hace falta más peso.
        await write(`demos/${v.slug}/${d.slug}/${f.archivo}`, foto(width / 2, height / 2, d.slug, seed++));
      }
    }
  }
}

await main();
