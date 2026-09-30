// Ilustraciones de las demos de reservas (barbería, canchas y cabañas).
// Uso: node scripts/demos/reservas.mjs [solo=barberia|canchas|cabanas]
// Todo se dibuja en SVG y se exporta a WebP con `sharp` (viene con Next.js, no se agrega al proyecto).
// Los dibujos usan un generador pseudoaleatorio con semilla fija: cada corrida produce las mismas imágenes.
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(import.meta.dirname, "..", "..", "public", "demos", "reservas");
const solo = process.argv.slice(2).find((a) => !a.startsWith("-"));

async function write(slug, name, w, h, body, { quality = 80 } = {}) {
  const out = join(root, slug, `${name}.webp`);
  mkdirSync(dirname(out), { recursive: true });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
  await sharp(Buffer.from(svg)).webp({ quality, effort: 5 }).toFile(out);
  console.log("✓", `${slug}/${name}.webp`);
}

// ---------- utilidades ----------
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = (n) => Math.round(n * 10) / 10;
const pts = (arr) => arr.map(([x, y]) => `${f(x)},${f(y)}`).join(" ");
const poly = (arr, attrs) => `<polygon points="${pts(arr)}" ${attrs}/>`;

/** Grano sutil encima de todo para que no se vea "vector plano". */
function grano(id, opacidad = 0.08, freq = 0.9) {
  return {
    defs: `<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="7" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 ${opacidad * 4} 0"/><feComposite operator="in" in2="SourceGraphic"/></filter>`,
    capa: (w, h) => `<rect width="${w}" height="${h}" fill="#fff" filter="url(#${id})" style="mix-blend-mode:overlay"/>`,
  };
}

/** Viñeta radial oscura en los bordes. */
function vineta(id, w, h, opacidad = 0.45, color = "#000") {
  return {
    defs: `<radialGradient id="${id}" cx="50%" cy="48%" r="75%"><stop offset="55%" stop-color="${color}" stop-opacity="0"/><stop offset="100%" stop-color="${color}" stop-opacity="${opacidad}"/></radialGradient>`,
    capa: `<rect width="${w}" height="${h}" fill="url(#${id})"/>`,
  };
}

/** Cresta de montaña por desplazamiento de punto medio. Devuelve un path cerrado hacia abajo. */
function cresta(w, h, y0, y1, amp, seed, { iter = 7, bajo = h, x0 = 0, x1 = w } = {}) {
  const r = rng(seed);
  let p = [
    [x0, y0],
    [x1, y1],
  ];
  let a = amp;
  for (let i = 0; i < iter; i++) {
    const n = [];
    for (let j = 0; j < p.length - 1; j++) {
      const [ax, ay] = p[j];
      const [bx, by] = p[j + 1];
      n.push([ax, ay], [(ax + bx) / 2, (ay + by) / 2 + (r() - 0.5) * a]);
    }
    n.push(p[p.length - 1]);
    p = n;
    a *= 0.55;
  }
  return `M${x0},${bajo} L${p.map(([x, y]) => `${f(x)},${f(y)}`).join(" L")} L${x1},${bajo} Z`;
}

/** Cresta con cumbres suaves definidas: lista de [x, y] como controles, suavizada con curvas. */
function lomas(w, bajo, puntos) {
  let d = `M0,${bajo} L${puntos[0][0]},${puntos[0][1]}`;
  for (let i = 0; i < puntos.length - 1; i++) {
    const [ax, ay] = puntos[i];
    const [bx, by] = puntos[i + 1];
    const mx = (ax + bx) / 2;
    d += ` C${f(mx)},${f(ay)} ${f(mx)},${f(by)} ${f(bx)},${f(by)}`;
  }
  return `${d} L${w},${bajo} Z`;
}

function pino(x, y, s, color, sombra) {
  // Pino estilizado: tres capas triangulares con borde suave.
  const capas = [];
  for (let i = 0; i < 4; i++) {
    const ty = y - s * (0.35 + i * 0.28);
    const ancho = s * (0.42 - i * 0.08);
    capas.push(
      `<path d="M${f(x)},${f(ty - s * 0.42)} L${f(x + ancho)},${f(ty + s * 0.05)} Q${f(x)},${f(ty - s * 0.03)} ${f(x - ancho)},${f(ty + s * 0.05)} Z" fill="${color}"/>`,
      sombra
        ? `<path d="M${f(x)},${f(ty - s * 0.42)} L${f(x + ancho)},${f(ty + s * 0.05)} Q${f(x + ancho * 0.4)},${f(ty)} ${f(x)},${f(ty - s * 0.02)} Z" fill="${sombra}"/>`
        : "",
    );
  }
  return `<rect x="${f(x - s * 0.03)}" y="${f(y - s * 0.3)}" width="${f(s * 0.06)}" height="${f(s * 0.32)}" fill="#3b2a1e"/>${capas.join("")}`;
}

function arbolCopa(x, y, s, color, luz, seed) {
  // Árbol nativo (molle/algarrobo): tronco torcido y copa de nubes.
  const r = rng(seed);
  const tronco = `<path d="M${f(x - s * 0.04)},${f(y)} C${f(x - s * 0.02)},${f(y - s * 0.3)} ${f(x + s * 0.08)},${f(y - s * 0.4)} ${f(x + s * 0.02)},${f(y - s * 0.62)} L${f(x + s * 0.06)},${f(y - s * 0.6)} C${f(x + s * 0.12)},${f(y - s * 0.4)} ${f(x + s * 0.05)},${f(y - s * 0.25)} ${f(x + s * 0.05)},${f(y)} Z" fill="#4a3526"/>`;
  const blobs = [];
  const n = 7;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const cx = x + Math.cos(a) * s * 0.28 * (0.7 + r() * 0.5);
    const cy = y - s * 0.72 + Math.sin(a) * s * 0.14 * (0.7 + r() * 0.5);
    blobs.push(`<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(s * (0.2 + r() * 0.08))}" ry="${f(s * (0.13 + r() * 0.05))}" fill="${color}"/>`);
  }
  blobs.push(`<ellipse cx="${f(x)}" cy="${f(y - s * 0.74)}" rx="${f(s * 0.34)}" ry="${f(s * 0.17)}" fill="${color}"/>`);
  const luces = luz
    ? `<ellipse cx="${f(x - s * 0.1)}" cy="${f(y - s * 0.82)}" rx="${f(s * 0.2)}" ry="${f(s * 0.08)}" fill="${luz}"/>`
    : "";
  return tronco + blobs.join("") + luces;
}

// =====================================================================
// BARBERÍA DON FILO
// =====================================================================
const B = {
  negro: "#141210",
  negro2: "#1d1a17",
  crema: "#efe6d6",
  crema2: "#e2d6c1",
  bordo: "#7a1e2c",
  bordo2: "#5c1520",
  oro: "#c29b5a",
  oro2: "#8f6d38",
  verde: "#1f3a2e",
  madera: "#5a3b27",
  cromo: "#cfd2d4",
};

function barberiaHero() {
  const w = 1600;
  const h = 1200;
  const g = grano("g", 0.1);
  const v = vineta("v", w, h, 0.6);
  // Piso damero en perspectiva
  const piso = [];
  const hor = 860;
  const vx = 800;
  for (let i = 0; i < 12; i++) {
    for (let j = -14; j < 14; j++) {
      const z0 = 1 + i * 0.55;
      const z1 = 1 + (i + 1) * 0.55;
      const y0 = hor + 340 / z0;
      const y1 = hor + 340 / z1;
      const xa0 = vx + (j * 220) / z0;
      const xb0 = vx + ((j + 1) * 220) / z0;
      const xa1 = vx + (j * 220) / z1;
      const xb1 = vx + ((j + 1) * 220) / z1;
      const c = (i + j) % 2 === 0 ? "#e9dfcc" : "#191613";
      piso.push(poly([[xa0, y0], [xb0, y0], [xb1, y1], [xa1, y1]], `fill="${c}"`));
    }
  }
  // Azulejos (subway) en la pared inferior
  const azulejos = [];
  for (let y = 560; y < 870; y += 34) {
    const off = ((y - 560) / 34) % 2 === 0 ? 0 : 40;
    for (let x = -80 + off; x < w; x += 80) {
      azulejos.push(`<rect x="${x + 2}" y="${y + 2}" width="76" height="30" rx="3" fill="#2a4a3b"/>`);
      azulejos.push(`<rect x="${x + 6}" y="${y + 5}" width="40" height="5" rx="2" fill="#fff" opacity=".07"/>`);
    }
  }
  // Frascos en el estante
  const r = rng(11);
  const frascos = [];
  let fx = 1110;
  const colores = [B.oro, "#6d8a6a", B.bordo, "#d9c8a4", "#3d5a73", B.oro2, "#a3462f"];
  while (fx < 1470) {
    const fw = 26 + r() * 22;
    const fh = 50 + r() * 60;
    const c = colores[Math.floor(r() * colores.length)];
    frascos.push(
      `<rect x="${f(fx)}" y="${f(452 - fh)}" width="${f(fw)}" height="${f(fh)}" rx="6" fill="${c}"/>`,
      `<rect x="${f(fx + fw * 0.25)}" y="${f(452 - fh - 14)}" width="${f(fw * 0.5)}" height="16" rx="3" fill="#1b1714"/>`,
      `<rect x="${f(fx + 4)}" y="${f(452 - fh * 0.6)}" width="${f(fw - 8)}" height="${f(fh * 0.28)}" rx="2" fill="${B.crema}" opacity=".85"/>`,
      `<rect x="${f(fx + 3)}" y="${f(452 - fh + 6)}" width="4" height="${f(fh - 14)}" rx="2" fill="#fff" opacity=".25"/>`,
    );
    fx += fw + 8 + r() * 10;
  }
  // Sillón de barbero (vista lateral 3/4)
  const cx = 720;
  const sillon = `
  <g>
    <ellipse cx="${cx}" cy="1010" rx="260" ry="34" fill="#000" opacity=".45"/>
    <ellipse cx="${cx}" cy="990" rx="170" ry="30" fill="url(#cromo)"/>
    <ellipse cx="${cx}" cy="982" rx="170" ry="28" fill="#dfe3e6"/>
    <ellipse cx="${cx}" cy="978" rx="150" ry="22" fill="url(#cromo)"/>
    <rect x="${cx - 30}" y="800" width="60" height="180" fill="url(#cromoV)"/>
    <rect x="${cx - 48}" y="790" width="96" height="26" rx="8" fill="url(#cromoV)"/>
    <!-- apoyapies -->
    <path d="M${cx - 175},800 L${cx - 236},890" stroke="url(#cromoV)" stroke-width="14" stroke-linecap="round"/>
    <path d="M${cx - 290},884 L${cx - 190},884 L${cx - 196},902 L${cx - 296},902 Z" fill="url(#cromoV)"/>
    ${[0, 1, 2, 3].map((i) => `<rect x="${cx - 285 + i * 24}" y="888" width="14" height="4" rx="2" fill="#6f7477"/>`).join("")}
    <!-- asiento -->
    <path d="M${cx - 230},770 C${cx - 230},720 ${cx - 200},700 ${cx - 150},700 L${cx + 130},700 C${cx + 175},700 ${cx + 190},730 ${cx + 190},770 L${cx + 190},790 C${cx + 190},805 ${cx + 180},812 ${cx + 165},812 L${cx - 205},812 C${cx - 222},812 ${cx - 230},800 ${cx - 230},785 Z" fill="${B.bordo}"/>
    <path d="M${cx - 215},735 C${cx - 200},712 ${cx - 170},708 ${cx - 140},708 L${cx + 120},708 C${cx + 150},708 ${cx + 165},716 ${cx + 175},732" stroke="#b44a57" stroke-width="6" fill="none" opacity=".6" stroke-linecap="round"/>
    <!-- respaldo -->
    <path d="M${cx + 90},720 L${cx + 170},360 C${cx + 178},322 ${cx + 210},305 ${cx + 250},312 L${cx + 290},320 C${cx + 330},330 ${cx + 345},360 ${cx + 337},398 L${cx + 262},735 C${cx + 255},760 ${cx + 230},775 ${cx + 205},770 L${cx + 125},760 C${cx + 100},756 ${cx + 85},742 ${cx + 90},720 Z" fill="${B.bordo2}"/>
    <path d="M${cx + 120},700 L${cx + 195},380 C${cx + 200},355 ${cx + 220},345 ${cx + 245},350 L${cx + 280},357 C${cx + 305},362 ${cx + 313},382 ${cx + 308},405 L${cx + 238},712 C${cx + 232},732 ${cx + 216},740 ${cx + 196},737 L${cx + 145},730 C${cx + 125},727 ${cx + 115},716 ${cx + 120},700 Z" fill="${B.bordo}"/>
    ${[0, 1, 2, 3, 4]
      .map((i) => {
        const t = 0.12 + i * 0.18;
        const x1 = cx + 125 + (195 - 125) * (1 - t) + 0;
        const y1 = 700 - (700 - 380) * t;
        return `<path d="M${f(x1 + 8)},${f(y1)} L${f(x1 + 100)},${f(y1 + 18)}" stroke="${B.bordo2}" stroke-width="4" stroke-linecap="round" opacity=".7"/>`;
      })
      .join("")}
    <!-- apoyacabeza -->
    <rect x="${cx + 205}" y="230" width="120" height="70" rx="30" fill="${B.bordo}" transform="rotate(12 ${cx + 265} 265)"/>
    <rect x="${cx + 250}" y="290" width="16" height="40" fill="url(#cromoV)" transform="rotate(12 ${cx + 258} 310)"/>
    <!-- apoyabrazos -->
    <path d="M${cx - 170},690 L${cx + 120},640 C${cx + 150},636 ${cx + 170},650 ${cx + 168},675 L${cx + 165},690 L${cx - 175},735 Z" fill="${B.madera}"/>
    <path d="M${cx - 170},690 L${cx + 120},640 C${cx + 140},637 ${cx + 155},643 ${cx + 162},655 L${cx - 168},705 Z" fill="#7a5337"/>
    <path d="M${cx - 150},720 L${cx - 150},770" stroke="url(#cromoV)" stroke-width="16"/>
    <path d="M${cx + 110},680 L${cx + 105},720" stroke="url(#cromoV)" stroke-width="14"/>
    <!-- botones capitoné -->
    ${[
      [cx + 225, 480],
      [cx + 260, 490],
      [cx + 208, 560],
      [cx + 243, 570],
      [cx + 192, 640],
      [cx + 228, 650],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${B.bordo2}"/><circle cx="${x - 1}" cy="${y - 1}" r="2" fill="#c0606c" opacity=".7"/>`)
      .join("")}
  </g>`;
  // Poste de barbero
  const poste = `
  <g transform="translate(250 250)">
    <rect x="-8" y="-40" width="16" height="30" fill="${B.oro2}"/>
    <ellipse cx="0" cy="-10" rx="46" ry="16" fill="${B.oro}"/>
    <rect x="-36" y="0" width="72" height="300" rx="36" fill="${B.crema}"/>
    <clipPath id="posteClip"><rect x="-36" y="0" width="72" height="300" rx="36"/></clipPath>
    <g clip-path="url(#posteClip)">
      ${Array.from({ length: 9 }, (_, i) => `<path d="M-60,${i * 60 - 60} L80,${i * 60 - 140} L80,${i * 60 - 110} L-60,${i * 60 - 30} Z" fill="${i % 2 ? B.bordo : "#23324a"}"/>`).join("")}
      <rect x="-36" y="0" width="22" height="300" fill="#fff" opacity=".22"/>
      <rect x="14" y="0" width="22" height="300" fill="#000" opacity=".2"/>
    </g>
    <ellipse cx="0" cy="310" rx="46" ry="16" fill="${B.oro}"/>
    <rect x="-8" y="318" width="16" height="30" fill="${B.oro2}"/>
  </g>`;
  // Espejo con marco dorado
  const espejo = `
  <g>
    <path d="M430,560 L430,230 C430,140 520,90 610,90 C700,90 790,140 790,230 L790,560 Z" fill="${B.oro2}"/>
    <path d="M446,548 L446,234 C446,158 526,108 610,108 C694,108 774,158 774,234 L774,548 Z" fill="${B.oro}"/>
    <path d="M466,532 L466,240 C466,172 536,128 610,128 C684,128 754,172 754,240 L754,532 Z" fill="url(#espejo)"/>
    <path d="M500,500 L620,160 L660,160 L540,500 Z" fill="#fff" opacity=".06"/>
    <path d="M560,510 L680,170 L700,170 L580,510 Z" fill="#fff" opacity=".05"/>
  </g>`;
  // Lámpara colgante
  const lampara = `
  <g>
    <line x1="1180" y1="0" x2="1180" y2="150" stroke="#0c0b0a" stroke-width="4"/>
    <path d="M1110,210 C1110,170 1140,148 1180,148 C1220,148 1250,170 1250,210 Z" fill="${B.verde}"/>
    <ellipse cx="1180" cy="210" rx="70" ry="10" fill="${B.oro}"/>
    <ellipse cx="1180" cy="214" rx="26" ry="8" fill="#fff4d6"/>
  </g>`;
  const body = `
  <defs>
    ${g.defs}${v.defs}
    <linearGradient id="pared" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1917"/><stop offset="1" stop-color="#26221e"/></linearGradient>
    <linearGradient id="espejo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4c5a5a"/><stop offset=".6" stop-color="#2b3434"/><stop offset="1" stop-color="#1c2222"/></linearGradient>
    <linearGradient id="cromo" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8e9396"/><stop offset=".35" stop-color="#f2f4f5"/><stop offset=".6" stop-color="#aeb3b6"/><stop offset="1" stop-color="#6f7477"/></linearGradient>
    <linearGradient id="cromoV" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6f7477"/><stop offset=".4" stop-color="#eef0f1"/><stop offset="1" stop-color="#7c8184"/></linearGradient>
    <radialGradient id="luz" cx="1180" cy="230" r="760" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffd99a" stop-opacity=".42"/><stop offset=".5" stop-color="#ffb35c" stop-opacity=".1"/><stop offset="1" stop-color="#ffb35c" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#pared)"/>
  ${Array.from({ length: 22 }, (_, i) => `<rect x="${i * 76}" y="0" width="2" height="560" fill="#000" opacity=".25"/>`).join("")}
  <rect x="0" y="540" width="${w}" height="20" fill="${B.madera}"/>
  <rect x="0" y="540" width="${w}" height="5" fill="#8a5f40"/>
  <rect x="0" y="560" width="${w}" height="310" fill="#20392e"/>
  ${azulejos.join("")}
  ${piso.join("")}
  <rect x="0" y="860" width="${w}" height="12" fill="#0e0d0c"/>
  ${espejo}
  ${poste}
  <rect x="1090" y="452" width="400" height="16" fill="${B.madera}"/>
  <rect x="1090" y="452" width="400" height="4" fill="#8a5f40"/>
  ${frascos.join("")}
  ${lampara}
  ${sillon}
  <rect width="${w}" height="${h}" fill="url(#luz)"/>
  ${v.capa}
  ${g.capa(w, h)}`;
  return write("barberia", "hero-sillon", w, h, body);
}

/** Retrato estilizado de busto. */
function retrato({ piel, sombraPiel, pelo, peinado, barba, bg, bg2, camisa, delantal, anteojos, seed, zoom = 1 }) {
  const w = 800;
  const h = 1000;
  const cx = 400;
  const g = grano("gr", 0.09);
  const r = rng(seed);
  const cabello = {
    pompadour: `<path d="M258,330 C240,210 300,120 410,118 C520,112 580,180 560,300 C545,250 520,230 480,226 C430,222 360,240 300,262 C282,272 268,296 258,330 Z" fill="${pelo}"/><path d="M300,250 C350,170 450,150 530,190" stroke="#fff" stroke-opacity=".14" stroke-width="10" fill="none" stroke-linecap="round"/>`,
    fade: `<path d="M268,340 C258,240 310,178 400,176 C490,174 545,236 534,340 C520,300 505,280 490,272 C440,250 360,252 310,274 C292,286 278,310 268,340 Z" fill="${pelo}"/><path d="M268,340 L262,395 L276,400 Z M534,340 L540,395 L526,400 Z" fill="${pelo}" opacity=".45"/>`,
    rulos: Array.from({ length: 26 }, (_, i) => {
      const a = Math.PI + (i / 25) * Math.PI;
      const rr = 150 + r() * 16;
      return `<circle cx="${f(cx + Math.cos(a) * rr * 0.95)}" cy="${f(300 + Math.sin(a) * rr * 0.8)}" r="${f(44 + r() * 14)}" fill="${pelo}"/>`;
    }).join("") + `<ellipse cx="${cx}" cy="250" rx="140" ry="80" fill="${pelo}"/>`,
    rapado: `<path d="M272,330 C268,240 320,190 400,188 C480,186 532,240 528,330 C500,280 460,262 400,262 C340,262 300,280 272,330 Z" fill="${pelo}" opacity=".55"/>`,
    texturizado: `<path d="M262,330 C250,230 310,160 400,158 C495,156 552,222 540,330 C530,295 510,270 480,262 L470,238 L440,258 L420,232 L395,258 L370,236 L350,262 L322,244 L310,272 C290,282 272,300 262,330 Z" fill="${pelo}"/>`,
    raya: `<path d="M262,340 C248,230 310,160 405,160 C500,160 552,226 538,340 C530,300 520,270 505,258 C460,236 420,232 370,228 L352,236 C320,244 290,266 262,340 Z" fill="${pelo}"/><path d="M352,236 C340,206 350,180 372,166" stroke="${sombraPiel}" stroke-width="4" fill="none" opacity=".6"/>`,
    moño: `<path d="M262,330 C252,236 312,170 400,168 C490,166 548,232 538,330 C520,280 480,256 400,254 C320,256 280,280 262,330 Z" fill="${pelo}"/><circle cx="${cx}" cy="150" r="46" fill="${pelo}"/><path d="M372,190 C380,176 420,176 428,190" stroke="#000" stroke-opacity=".2" stroke-width="6" fill="none"/>`,
  }[peinado];
  const barbas = {
    completa: `<path d="M272,420 C272,520 320,610 400,626 C480,610 528,520 528,420 C510,470 490,500 470,512 C440,528 360,528 330,512 C310,500 290,470 272,420 Z" fill="${pelo}"/><path d="M350,500 C370,488 430,488 450,500 C440,512 360,512 350,500 Z" fill="${pelo}"/>`,
    candado: `<path d="M352,498 C372,484 428,484 448,498 C440,506 432,508 420,506 L420,512 C420,560 380,560 380,512 L380,506 C368,508 360,506 352,498 Z" fill="${pelo}"/>`,
    bigote: `<path d="M340,494 C360,478 440,478 460,494 C470,506 480,500 486,490 C480,516 452,512 430,504 C412,500 388,500 370,504 C348,512 320,516 314,490 C320,500 330,506 340,494 Z" fill="${pelo}"/>`,
    larga: `<path d="M268,410 C262,560 330,700 400,712 C470,700 538,560 532,410 C515,470 490,500 470,510 C440,526 360,526 330,510 C310,500 285,470 268,410 Z" fill="${pelo}"/><path d="M345,498 C368,482 432,482 455,498 C442,510 358,510 345,498 Z" fill="${pelo}"/><path d="M360,580 C380,640 420,640 440,580" stroke="#fff" stroke-opacity=".1" stroke-width="6" fill="none"/>`,
    ninguna: "",
  }[barba];
  const lentes = anteojos
    ? `<g fill="none" stroke="#161310" stroke-width="7"><rect x="318" y="382" width="66" height="50" rx="14"/><rect x="416" y="382" width="66" height="50" rx="14"/><path d="M384,398 C392,390 408,390 416,398"/><path d="M318,396 L276,388 M482,396 L524,388"/></g><rect x="326" y="388" width="18" height="6" rx="3" fill="#fff" opacity=".3"/>`
    : "";
  const tijeraBolsillo = `<g transform="translate(530 810) rotate(-20)"><rect x="-4" y="-50" width="8" height="60" rx="3" fill="${B.cromo}"/><rect x="4" y="-46" width="7" height="56" rx="3" fill="#9aa0a3"/><circle cx="-6" cy="22" r="12" fill="none" stroke="${B.cromo}" stroke-width="6"/><circle cx="16" cy="24" r="12" fill="none" stroke="#9aa0a3" stroke-width="6"/></g>`;
  const body = `
  <defs>${g.defs}<clipPath id="c"><rect width="${w}" height="${h}"/></clipPath></defs>
  <g clip-path="url(#c)"><g transform="translate(${cx} 470) scale(${zoom}) translate(${-cx} -470)">
  <rect x="-400" y="-400" width="${w + 800}" height="${h + 800}" fill="${bg}"/>
  <circle cx="${cx}" cy="420" r="300" fill="${bg2}"/>
  <!-- torso -->
  <path d="M100,1000 C110,820 180,720 300,700 L500,700 C620,720 690,820 700,1000 Z" fill="${camisa}"/>
  <path d="M300,700 L400,800 L500,700 Z" fill="${sombraPiel}"/>
  <path d="M225,1000 L245,770 C300,800 350,815 400,816 C450,815 500,800 555,770 L575,1000 Z" fill="${delantal}"/>
  <path d="M245,770 L300,708 M555,770 L500,708" stroke="${delantal}" stroke-width="16" stroke-linecap="round"/>
  <rect x="300" y="860" width="200" height="8" rx="4" fill="#000" opacity=".2"/>
  ${tijeraBolsillo}
  <!-- cuello -->
  <path d="M348,560 L348,680 C370,715 430,715 452,680 L452,560 Z" fill="${sombraPiel}"/>
  <!-- orejas -->
  <ellipse cx="268" cy="420" rx="26" ry="42" fill="${piel}"/><ellipse cx="532" cy="420" rx="26" ry="42" fill="${piel}"/>
  <ellipse cx="270" cy="420" rx="12" ry="24" fill="${sombraPiel}"/><ellipse cx="530" cy="420" rx="12" ry="24" fill="${sombraPiel}"/>
  <!-- cabeza -->
  <path d="M270,360 C270,250 330,200 400,200 C470,200 530,250 530,360 L530,440 C530,540 470,610 400,612 C330,610 270,540 270,440 Z" fill="${piel}"/>
  <path d="M470,220 C520,260 532,330 530,440 C528,520 490,590 430,608 C480,560 500,480 496,400 C494,320 490,260 470,220 Z" fill="${sombraPiel}" opacity=".55"/>
  ${cabello}
  <!-- rasgos -->
  <path d="M320,372 C338,360 368,358 386,366" stroke="${pelo}" stroke-width="12" stroke-linecap="round" fill="none"/>
  <path d="M414,366 C432,358 462,360 480,372" stroke="${pelo}" stroke-width="12" stroke-linecap="round" fill="none"/>
  <ellipse cx="352" cy="408" rx="10" ry="8" fill="#1b1411"/><ellipse cx="448" cy="408" rx="10" ry="8" fill="#1b1411"/>
  <path d="M402,410 C404,440 408,456 418,466 C408,472 396,472 388,468" stroke="${sombraPiel}" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M372,520 C390,530 410,530 428,520" stroke="#6b2c24" stroke-width="7" fill="none" stroke-linecap="round"/>
  ${barbas}
  ${lentes}
  </g></g>
  ${g.capa(w, h)}`;
  return body;
}

function barberos() {
  const lista = [
    ["barbero-filo", { piel: "#d9a47c", sombraPiel: "#b9845f", pelo: "#d8d2c8", peinado: "raya", barba: "completa", bg: B.bordo, bg2: "#8a2837", camisa: "#e9e1d2", delantal: "#2a211b", anteojos: true, seed: 1 }],
    ["barbero-tano", { piel: "#c98f63", sombraPiel: "#a8704a", pelo: "#1b1512", peinado: "pompadour", barba: "bigote", bg: B.verde, bg2: "#28493a", camisa: "#f1ece2", delantal: "#5a3b27", anteojos: false, seed: 2 }],
    ["barbero-rulo", { piel: "#8a5a3c", sombraPiel: "#6c432b", pelo: "#15110f", peinado: "rulos", barba: "candado", bg: "#2a2622", bg2: "#3a342e", camisa: "#1e2a3b", delantal: "#2a211b", anteojos: false, seed: 3 }],
    ["barbera-mica", { piel: "#e8bf9c", sombraPiel: "#cc9b77", pelo: "#6b2f1e", peinado: "moño", barba: "ninguna", bg: B.oro2, bg2: "#a4814a", camisa: "#141210", delantal: "#7a1e2c", anteojos: false, seed: 4 }],
  ];
  return Promise.all(lista.map(([n, o]) => write("barberia", n, 800, 1000, retrato(o))));
}

function cortes() {
  const lista = [
    ["corte-clasico", { piel: "#d9a47c", sombraPiel: "#b9845f", pelo: "#2a1d15", peinado: "raya", barba: "ninguna", bg: "#e2d6c1", bg2: "#d4c5aa", camisa: "#1d1a17", delantal: "#1d1a17", seed: 5 }],
    ["corte-fade", { piel: "#b57a52", sombraPiel: "#94603c", pelo: "#15110f", peinado: "fade", barba: "candado", bg: B.bordo, bg2: "#8a2837", camisa: "#efe6d6", delantal: "#efe6d6", seed: 6 }],
    ["corte-pompadour", { piel: "#e6b893", sombraPiel: "#c7966f", pelo: "#3a2418", peinado: "pompadour", barba: "ninguna", bg: B.verde, bg2: "#28493a", camisa: "#141210", delantal: "#141210", seed: 7 }],
    ["corte-texturizado", { piel: "#d2976d", sombraPiel: "#b0764e", pelo: "#5a3a22", peinado: "texturizado", barba: "bigote", bg: "#2a2622", bg2: "#3a342e", camisa: "#7a1e2c", delantal: "#7a1e2c", seed: 8 }],
    ["barba-larga", { piel: "#e0ae88", sombraPiel: "#c08b66", pelo: "#6b3a1f", peinado: "rapado", barba: "larga", bg: B.oro2, bg2: "#a4814a", camisa: "#1f3a2e", delantal: "#1f3a2e", seed: 9 }],
    ["corte-rapado", { piel: "#7c5034", sombraPiel: "#603a23", pelo: "#15110f", peinado: "rapado", barba: "completa", bg: "#d9c8a4", bg2: "#cbb78e", camisa: "#141210", delantal: "#141210", seed: 10 }],
  ];
  return Promise.all(lista.map(([n, o]) => write("barberia", n, 800, 1000, retrato({ ...o, zoom: 1.45 }))));
}

function herramientas() {
  const w = 1400;
  const h = 900;
  const g = grano("g", 0.12);
  const v = vineta("v", w, h, 0.55);
  const sombra = (d) => `<g filter="url(#sh)">${d}</g>`;
  const body = `
  <defs>${g.defs}${v.defs}
    <filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="10" dy="16" stdDeviation="12" flood-color="#000" flood-opacity=".55"/></filter>
    <linearGradient id="acero" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f6f7"/><stop offset=".5" stop-color="#b8bec2"/><stop offset="1" stop-color="#7d8388"/></linearGradient>
    <linearGradient id="cuero" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a2419"/><stop offset="1" stop-color="#1e130e"/></linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#cuero)"/>
  <rect x="60" y="60" width="${w - 120}" height="${h - 120}" rx="18" fill="none" stroke="${B.oro}" stroke-opacity=".35" stroke-width="3" stroke-dasharray="14 10"/>
  <!-- navaja -->
  ${sombra(`<g transform="translate(250 250) rotate(-28)">
    <rect x="0" y="-22" width="360" height="44" rx="20" fill="#2a1f19"/>
    <rect x="10" y="-16" width="340" height="10" rx="5" fill="#fff" opacity=".08"/>
    <circle cx="30" cy="0" r="7" fill="${B.oro}"/><circle cx="330" cy="0" r="7" fill="${B.oro}"/>
    <path d="M20,-10 L-260,-40 C-290,-40 -300,-10 -290,10 L-240,24 L20,10 Z" fill="url(#acero)"/>
    <path d="M-240,24 L20,10 L20,4 L-250,14 Z" fill="#fff" opacity=".6"/>
  </g>`)}
  <!-- tijera -->
  ${sombra(`<g transform="translate(900 300) rotate(35)">
    <path d="M0,0 L-20,-300 C-18,-310 -8,-312 -4,-300 L14,-6 Z" fill="url(#acero)"/>
    <path d="M6,0 L40,-296 C42,-306 52,-304 52,-294 L20,6 Z" fill="#aab0b4"/>
    <circle cx="8" cy="-4" r="9" fill="${B.oro}"/>
    <path d="M0,0 C-20,40 -60,60 -80,90" stroke="url(#acero)" stroke-width="16" fill="none" stroke-linecap="round"/>
    <path d="M16,0 C40,40 70,60 90,90" stroke="#aab0b4" stroke-width="16" fill="none" stroke-linecap="round"/>
    <circle cx="-95" cy="120" r="38" fill="none" stroke="url(#acero)" stroke-width="15"/>
    <circle cx="105" cy="120" r="38" fill="none" stroke="#aab0b4" stroke-width="15"/>
  </g>`)}
  <!-- peine -->
  ${sombra(`<g transform="translate(280 610) rotate(-6)">
    <rect x="0" y="0" width="460" height="46" rx="10" fill="${B.oro}"/>
    <rect x="6" y="6" width="448" height="8" rx="4" fill="#fff" opacity=".25"/>
    ${Array.from({ length: 44 }, (_, i) => `<rect x="${10 + i * 10}" y="44" width="5" height="${i < 22 ? 70 : 52}" rx="2" fill="${B.oro}"/>`).join("")}
  </g>`)}
  <!-- brocha -->
  ${sombra(`<g transform="translate(1100 560) rotate(-12)">
    <path d="M-60,-40 C-80,-170 -20,-240 0,-250 C20,-240 80,-170 60,-40 Z" fill="#d9c8a4"/>
    <path d="M-40,-60 C-50,-160 -10,-220 0,-232 C-4,-200 -20,-140 -10,-60 Z" fill="#fff" opacity=".3"/>
    <path d="M-60,-40 L60,-40 L50,0 L-50,0 Z" fill="#f2ede2" opacity=".5"/>
    <rect x="-62" y="-44" width="124" height="22" rx="6" fill="${B.cromo}"/>
    <path d="M-52,-22 L52,-22 L46,120 C46,140 -46,140 -46,120 Z" fill="${B.bordo}"/>
    <rect x="-40" y="-10" width="14" height="130" rx="7" fill="#fff" opacity=".18"/>
  </g>`)}
  <!-- pomada -->
  ${sombra(`<g transform="translate(700 700)">
    <ellipse cx="0" cy="40" rx="110" ry="34" fill="#1a1a1a"/>
    <rect x="-110" y="0" width="220" height="40" fill="#1a1a1a"/>
    <ellipse cx="0" cy="0" rx="110" ry="34" fill="${B.verde}"/>
    <ellipse cx="0" cy="0" rx="80" ry="24" fill="none" stroke="${B.oro}" stroke-width="3"/>
    <ellipse cx="0" cy="0" rx="12" ry="4" fill="${B.oro}"/>
  </g>`)}
  ${v.capa}
  ${g.capa(w, h)}`;
  return write("barberia", "herramientas", w, h, body);
}

// =====================================================================
// PÁDEL CLUB SIERRAS
// =====================================================================
const P = {
  azul: "#1553d6",
  azul2: "#0f3fa8",
  navy: "#0a1b3d",
  verde: "#2e9e5b",
  verde2: "#237a46",
  lima: "#d8f03c",
  blanco: "#ffffff",
};

/** Cámara simple: proyecta puntos 3D (X derecha, Y arriba, Z adelante) a la pantalla. */
function camara({ w, h, pos, yaw = 0, pitch = 0, focal }) {
  const [cx, cy, cz] = pos;
  const cyw = Math.cos(yaw);
  const syw = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  return ([x, y, z]) => {
    let dx = x - cx;
    const dy = y - cy;
    let dz = z - cz;
    // yaw (alrededor de Y)
    const rx = dx * cyw - dz * syw;
    const rz = dx * syw + dz * cyw;
    dx = rx;
    dz = rz;
    // pitch (alrededor de X), positivo mira hacia abajo
    const ry = dy * cp + dz * sp;
    const rz2 = -dy * sp + dz * cp;
    return [w / 2 + (focal * dx) / rz2, h / 2 - (focal * ry) / rz2];
  };
}

function cancha({ w, h, cam, tipo, cielo, entorno, seed, offsets = [0] }) {
  const base = camara({ w, h, ...cam });
  let ox = 0;
  const pr = ([x, y, z]) => base([x + ox, y, z]);
  const P3 = (arr) => arr.map(pr);
  const q = (arr, attrs) => poly(P3(arr), attrs);
  const L = (a, b, attrs) => {
    const [x1, y1] = pr(a);
    const [x2, y2] = pr(b);
    return `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" ${attrs}/>`;
  };
  const out = [];
  const hy = h / 2 - cam.focal * Math.tan(cam.pitch ?? 0);
  // Piso alrededor: desde el horizonte hacia abajo
  out.push(`<rect x="0" y="${f(hy)}" width="${w}" height="${f(h - hy)}" fill="${entorno.piso}"/>`);
  if (entorno.pisoLejos) out.push(`<rect x="0" y="${f(hy)}" width="${w}" height="${f((h - hy) * 0.35)}" fill="url(#pisoLejos)"/>`);
  const unaCancha = () => {
    const out = [];
    // Solado de cemento alrededor de la cancha
    out.push(q([[-6.2, 0, -1.4], [6.2, 0, -1.4], [6.2, 0, 21.4], [-6.2, 0, 21.4]], `fill="${entorno.solado ?? "#c9d3df"}"`));
  // Superficie de la cancha con franjas
    for (let i = 0; i < 10; i++) {
      out.push(q([[-5, 0, i * 2], [5, 0, i * 2], [5, 0, i * 2 + 2], [-5, 0, i * 2 + 2]], `fill="${i % 2 ? P.azul : "#1a5ce6"}"`));
    }
    // Líneas
    const lw = 'stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".95"';
    out.push(L([-5, 0, 3.05], [5, 0, 3.05], lw), L([-5, 0, 16.95], [5, 0, 16.95], lw), L([0, 0, 3.05], [0, 0, 16.95], lw));
    out.push(L([-5, 0, 0], [5, 0, 0], lw), L([-5, 0, 20], [5, 0, 20], lw), L([-5, 0, 0], [-5, 0, 20], lw), L([5, 0, 0], [5, 0, 20], lw));
    // Paredes: vidrio y malla. Se dibujan de atrás hacia adelante.
    const vidrio = `fill="#dff3ff" fill-opacity="${tipo === "panoramica" ? 0.22 : 0.16}" stroke="#ffffff" stroke-opacity=".75" stroke-width="2"`;
    const poste = (x, z, alto) => L([x, 0, z], [x, alto, z], `stroke="${P.navy}" stroke-width="5"`);
    const malla = (x0, z0, x1, z1, y0, y1) => {
      const partes = [q([[x0, y0, z0], [x1, y0, z1], [x1, y1, z1], [x0, y1, z0]], `fill="#cfe0ff" fill-opacity=".07" stroke="${P.navy}" stroke-width="3"`)];
      for (let t = 0; t <= 1.0001; t += 0.1) {
        const xm = x0 + (x1 - x0) * t;
        const zm = z0 + (z1 - z0) * t;
        partes.push(L([xm, y0, zm], [xm, y1, zm], `stroke="#e8f0ff" stroke-opacity=".28" stroke-width="1"`));
      }
      for (let y = y0; y <= y1; y += 0.5) partes.push(L([x0, y, z0], [x1, y, z1], `stroke="#e8f0ff" stroke-opacity=".22" stroke-width="1"`));
      return partes.join("");
    };
    // Fondo lejano (Z=20)
      const fondo = [];
    fondo.push(q([[-5, 0, 20], [5, 0, 20], [5, 3, 20], [-5, 3, 20]], vidrio));
    for (let x = -5; x <= 5; x += 2) fondo.push(poste(x, 20, 4));
    fondo.push(malla(-5, 20, 5, 20, 3, 4));
    // Laterales
    const lateral = (x) => {
      const p = [];
      p.push(q([[x, 0, 20], [x, 0, 18], [x, 3, 18], [x, 3, 20]], vidrio));
      p.push(q([[x, 0, 18], [x, 0, 16], [x, 2, 16], [x, 2, 18]], vidrio));
      p.push(q([[x, 0, 0], [x, 0, 2], [x, 3, 2], [x, 3, 0]], vidrio));
      p.push(q([[x, 0, 2], [x, 0, 4], [x, 2, 4], [x, 2, 2]], vidrio));
      if (tipo === "panoramica") {
        p.push(q([[x, 0, 4], [x, 0, 16], [x, 3, 16], [x, 3, 4]], vidrio));
        for (let z = 4; z <= 16; z += 2) p.push(poste(x, z, 3));
      } else {
        p.push(malla(x, 4, x, 16, 0, 3));
        for (let z = 4; z <= 16; z += 3) p.push(poste(x, z, 3));
      }
      p.push(poste(x, 0, 4), poste(x, 2, 3), poste(x, 18, 3), poste(x, 20, 4));
      return p.join("");
    };
    // Red
    const red = [];
    red.push(q([[-5, 0, 10], [5, 0, 10], [5, 0.92, 10], [0, 0.88, 10], [-5, 0.92, 10]], `fill="#0a1b3d" fill-opacity=".35"`));
    for (let x = -5; x <= 5; x += 0.25) red.push(L([x, 0, 10], [x, 0.9, 10], `stroke="#0a1b3d" stroke-opacity=".5" stroke-width="1"`));
    red.push(L([-5, 0.92, 10], [0, 0.88, 10], `stroke="#fff" stroke-width="4"`), L([0, 0.88, 10], [5, 0.92, 10], `stroke="#fff" stroke-width="4"`));
    red.push(L([-5.1, 0, 10], [-5.1, 1, 10], `stroke="${P.navy}" stroke-width="6"`), L([5.1, 0, 10], [5.1, 1, 10], `stroke="${P.navy}" stroke-width="6"`));
    // Frente (Z=0)
    const frente = [];
    frente.push(q([[-5, 0, 0], [5, 0, 0], [5, 3, 0], [-5, 3, 0]], vidrio));
    frente.push(malla(-5, 0, 5, 0, 3, 4));
    for (let x = -5; x <= 5; x += 2) frente.push(poste(x, 0, 4));
    return [out.join(""), fondo.join(""), lateral(-5), lateral(5), red.join(""), frente.join("")].join("");
  };
  // Techo para cancha techada
  const techo = [];
  if (tipo === "techada") {
    for (let z = -2; z <= 22; z += 4) {
      const arco = [];
      for (let t = 0; t <= 1.0001; t += 0.05) {
        const x = -9 + 18 * t;
        const y = 8 + Math.sin(t * Math.PI) * 3;
        arco.push(pr([x, y, z]));
      }
      techo.push(`<polyline points="${pts(arco)}" fill="none" stroke="#c9d4e6" stroke-width="6"/>`);
      techo.push(L([-9, 0, z], [-9, 8, z], `stroke="#c9d4e6" stroke-width="7"`), L([9, 0, z], [9, 8, z], `stroke="#c9d4e6" stroke-width="7"`));
      const [lx, ly] = pr([0, 10.6, z + 2]);
      techo.push(`<rect x="${f(lx - 26)}" y="${f(ly - 4)}" width="52" height="8" rx="3" fill="#fffbe6"/>`);
    }
  }
  // Torres de luz para descubiertas
  const torresDe = () => {
  const torres = [];
  if (tipo !== "techada") {
    for (const [x, z] of [[-7, 3], [7, 3], [-7, 17], [7, 17]]) {
      torres.push(L([x, 0, z], [x, 8, z], `stroke="${P.navy}" stroke-width="5"`));
      const [lx, ly] = pr([x, 8, z]);
      torres.push(`<rect x="${f(lx - 18)}" y="${f(ly - 10)}" width="36" height="14" rx="3" fill="${P.navy}"/><rect x="${f(lx - 15)}" y="${f(ly - 4)}" width="30" height="7" rx="2" fill="#fffbe6"/>`);
      if (entorno.noche) torres.push(`<circle cx="${f(lx)}" cy="${f(ly)}" r="120" fill="url(#halo)"/>`);
    }
  }
  return torres.join("");
  };
  const r = rng(seed);
  const estrellas = entorno.noche
    ? Array.from({ length: 60 }, () => `<circle cx="${f(r() * w)}" cy="${f(r() * h * 0.35)}" r="${f(0.6 + r() * 1.4)}" fill="#fff" opacity="${f(0.3 + r() * 0.6)}"/>`).join("")
    : "";
  return `
  <defs>
    <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">${cielo.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>
    <radialGradient id="halo"><stop offset="0" stop-color="#fff6c8" stop-opacity=".55"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></radialGradient>
    <linearGradient id="pisoLejos" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${entorno.pisoLejos ?? "#000"}" stop-opacity=".9"/><stop offset="1" stop-color="${entorno.pisoLejos ?? "#000"}" stop-opacity="0"/></linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#cielo)"/>
  ${estrellas}
  ${typeof entorno.fondo === "function" ? entorno.fondo(hy) : (entorno.fondo ?? "")}
  ${out.join("")}
  ${[...offsets]
    .sort((a2, b2) => Math.abs(b2 - cam.pos[0]) - Math.abs(a2 - cam.pos[0]))
    .map((o) => {
      ox = o;
      return unaCancha() + torresDe();
    })
    .join("")}
  ${techo.join("")}`;
}

function sierrasFondo(w, y, colores, seed) {
  return colores
    .map((c, i) => `<path d="${cresta(w, 2000, y - 60 + i * 40, y - 20 + i * 30, 160 - i * 30, seed + i)}" fill="${c}"/>`)
    .join("");
}

function canchasImgs() {
  const tareas = [];
  // Hero: atardecer, cancha descubierta con luces encendidas
  {
    const w = 1800;
    const h = 1200;
    const g = grano("g", 0.07);
    const body = cancha({
      w,
      h,
      tipo: "descubierta",
      seed: 3,
      offsets: [0, 12, 24],
      cam: { pos: [-7.5, 7, -6], yaw: 0.46, pitch: 0.36, focal: 1250 },
      cielo: [[0, "#0d2a6b"], [0.35, "#3b5fb8"], [0.55, "#e08a6a"], [0.7, "#f6c177"]],
      entorno: {
        piso: "#1f6b3f",
        pisoLejos: "#2b3d5c",
        noche: true,
        fondo: (hy) => `<circle cx="1450" cy="${f(hy - 150)}" r="70" fill="#ffe3a8" opacity=".9"/>${sierrasFondo(w, hy + 10, ["#6c5a8e", "#4c4474", "#2f3159"], 20)}`,
      },
    });
    tareas.push(write("canchas", "hero-cancha", w, h, `<defs>${g.defs}</defs>${body}${g.capa(w, h)}`));
  }
  const variantes = [
    ["cancha-techada", "techada", [[0, "#f1f5fb"], [1, "#d5deec"]], { piso: "#b9c6da", pisoLejos: "#e3e9f3", fondo: (hy) => `<rect x="0" y="${f(hy - 160)}" width="1200" height="160" fill="#dfe6f1"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${i * 100 + 20}" y="${f(hy - 140)}" width="60" height="90" rx="4" fill="#fff" opacity=".7"/>`).join("")}` }, { pos: [7, 6, -4.5], yaw: -0.4, pitch: 0.33, focal: 820 }, [0, -12]],
    ["cancha-descubierta", "descubierta", [[0, "#6fb7f2"], [0.6, "#bfe2fb"], [1, "#e8f6ff"]], { piso: P.verde, pisoLejos: "#5b8a6f", fondo: (hy) => sierrasFondo(1200, hy + 10, ["#8fb4c9", "#6f97ad", "#5b8a6f"], 5) }, { pos: [-7, 6, -4.5], yaw: 0.4, pitch: 0.33, focal: 820 }, [0, 12]],
    ["cancha-panoramica", "panoramica", [[0, "#12306e"], [0.5, "#3163c4"], [1, "#9cc4ff"]], { piso: "#1d5b39", pisoLejos: "#26406b", noche: true, fondo: (hy) => sierrasFondo(1200, hy + 10, ["#35507f", "#26406b"], 9) }, { pos: [0, 7, -5], yaw: 0, pitch: 0.4, focal: 700 }, [0]],
  ];
  for (const [name, tipo, cielo, entorno, cam, offsets] of variantes) {
    const w = 1200;
    const h = 800;
    const g = grano("g", 0.07);
    const body = cancha({ w, h, tipo, cielo, entorno, cam, offsets, seed: name.length });
    tareas.push(write("canchas", name, w, h, `<defs>${g.defs}</defs>${body}${g.capa(w, h)}`));
  }
  // Paletas + pelota
  {
    const w = 1200;
    const h = 900;
    const g = grano("g", 0.06);
    const paleta = (x, y, rot, c1, c2) => {
      const agujeros = [];
      for (let j = 0; j < 7; j++)
        for (let i = 0; i < 6; i++) {
          const ax = -75 + i * 30 + (j % 2 ? 15 : 0);
          const ay = -200 + j * 30;
          if ((ax / 120) ** 2 + ((ay + 110) / 150) ** 2 < 0.62) agujeros.push(`<circle cx="${ax}" cy="${ay}" r="7" fill="#0b1633" opacity=".85"/>`);
        }
      return `<g transform="translate(${x} ${y}) rotate(${rot})" filter="url(#sh)">
        <path d="M0,-280 C95,-280 140,-210 140,-120 C140,-40 90,20 40,60 L22,120 L-22,120 L-40,60 C-90,20 -140,-40 -140,-120 C-140,-210 -95,-280 0,-280 Z" fill="${c1}"/>
        <path d="M0,-266 C85,-266 126,-204 126,-120 C126,-46 80,8 34,46 L0,40 L-34,46 C-80,8 -126,-46 -126,-120 C-126,-204 -85,-266 0,-266 Z" fill="${c2}"/>
        <path d="M-126,-120 C-126,-204 -85,-266 0,-266 C-60,-240 -100,-190 -104,-120 Z" fill="#fff" opacity=".18"/>
        ${agujeros.join("")}
        <path d="M-40,60 L0,0 L40,60" fill="none" stroke="${c1}" stroke-width="10"/>
        <rect x="-22" y="118" width="44" height="170" rx="12" fill="#101828"/>
        ${Array.from({ length: 9 }, (_, i) => `<path d="M-22,${130 + i * 18} L22,${140 + i * 18}" stroke="#2b3550" stroke-width="5"/>`).join("")}
        <rect x="-26" y="284" width="52" height="16" rx="6" fill="${c1}"/>
        <path d="M-10,300 C-10,330 10,330 10,300" fill="none" stroke="#101828" stroke-width="4"/>
      </g>`;
    };
    const pelota = (x, y, rr) => `<g filter="url(#sh)"><circle cx="${x}" cy="${y}" r="${rr}" fill="url(#bola)"/><path d="M${x - rr * 0.85},${y - rr * 0.5} C${x - rr * 0.2},${y - rr * 0.1} ${x - rr * 0.2},${y + rr * 0.6} ${x - rr * 0.5},${y + rr * 0.86}" stroke="#fff" stroke-width="${rr * 0.09}" fill="none" stroke-linecap="round"/><path d="M${x + rr * 0.5},${y - rr * 0.86} C${x + rr * 0.2},${y - rr * 0.5} ${x + rr * 0.3},${y + rr * 0.2} ${x + rr * 0.86},${y + rr * 0.5}" stroke="#fff" stroke-width="${rr * 0.09}" fill="none" stroke-linecap="round"/></g>`;
    const body = `<defs>${g.defs}
      <filter id="sh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="26" stdDeviation="22" flood-color="#0a1b3d" flood-opacity=".35"/></filter>
      <radialGradient id="bola" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#f4ff9c"/><stop offset=".6" stop-color="${P.lima}"/><stop offset="1" stop-color="#9fb81c"/></radialGradient>
      <linearGradient id="bgp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9f1ff"/><stop offset="1" stop-color="#cfe0fb"/></linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bgp)"/>
    <circle cx="600" cy="450" r="330" fill="#fff" opacity=".6"/>
    <path d="M0,700 C300,640 900,760 1200,680 L1200,900 L0,900 Z" fill="${P.azul}" opacity=".1"/>
    ${paleta(500, 470, -18, P.navy, P.azul)}
    ${paleta(720, 470, 20, P.verde2, P.verde)}
    ${pelota(930, 700, 52)}
    ${pelota(860, 210, 38)}
    ${g.capa(w, h)}`;
    tareas.push(write("canchas", "paletas", w, h, body));
  }
  // Bar del club
  {
    const w = 1200;
    const h = 800;
    const g = grano("g", 0.06);
    const r = rng(77);
    const mesas = [180, 520, 860]
      .map(
        (x) => `<g><ellipse cx="${x + 80}" cy="680" rx="120" ry="16" fill="#0a1b3d" opacity=".18"/><rect x="${x}" y="560" width="160" height="14" rx="6" fill="#e9d9bd"/><rect x="${x + 74}" y="574" width="12" height="100" fill="${P.navy}"/>
        <rect x="${x - 50}" y="600" width="50" height="10" rx="4" fill="${P.azul}"/><rect x="${x - 36}" y="610" width="8" height="66" fill="${P.navy}"/>
        <rect x="${x + 160}" y="600" width="50" height="10" rx="4" fill="${P.azul}"/><rect x="${x + 188}" y="610" width="8" height="66" fill="${P.navy}"/>
        <rect x="${x + 30}" y="528" width="18" height="32" rx="4" fill="${P.lima}"/><rect x="${x + 100}" y="534" width="22" height="26" rx="4" fill="#fff" opacity=".9"/></g>`,
      )
      .join("");
    const plantas = Array.from({ length: 5 }, (_, i) => arbolCopa(80 + i * 270 + r() * 40, 470, 170, "#2e9e5b", "#58c07f", 100 + i)).join("");
    const body = `<defs>${g.defs}<linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fc9ff"/><stop offset="1" stop-color="#e7f4ff"/></linearGradient></defs>
      <rect width="${w}" height="${h}" fill="url(#c)"/>
      ${sierrasFondo(w, 330, ["#a5c7e0", "#88b3cf"], 31)}
      ${plantas}
      <rect x="0" y="470" width="${w}" height="330" fill="#f3efe6"/>
      ${Array.from({ length: 13 }, (_, i) => `<rect x="${i * 100}" y="470" width="2" height="330" fill="#d8d0c0"/>`).join("")}
      <path d="M0,120 L1200,120 L1200,150 L0,150 Z" fill="${P.navy}"/>
      ${Array.from({ length: 12 }, (_, i) => `<path d="M${i * 100},150 L${i * 100 + 100},150 L${i * 100 + 90},210 L${i * 100 + 10},210 Z" fill="${i % 2 ? P.azul : "#fff"}"/>`).join("")}
      <rect x="40" y="150" width="14" height="330" fill="${P.navy}"/><rect x="1146" y="150" width="14" height="330" fill="${P.navy}"/>
      ${mesas}
      ${g.capa(w, h)}`;
    tareas.push(write("canchas", "club-bar", w, h, body));
  }
  return Promise.all(tareas);
}

// =====================================================================
// CABAÑAS ARROYO MANSO
// =====================================================================
const C = {
  bosque: "#2f4a3a",
  bosque2: "#243a2d",
  musgo: "#6b7f4e",
  piedra: "#a79e8c",
  madera: "#d9b98c",
  madera2: "#b98f5e",
  crema: "#f4eee2",
  terracota: "#b5653a",
};

/** Cabaña en elevación frontal con leve profundidad. */
function cabana(x, y, s, { tipo = "gable", techo = "#4a3a30", pared = C.madera, piedra = true, luz = false, chimenea = true, humo = false, deck = false }) {
  const W = 260 * s;
  const H = 150 * s;
  const lado = 70 * s;
  const ventanaCol = luz ? "url(#ventanaLuz)" : "#6f8a96";
  const tablas = [];
  for (let i = 1; i < 13; i++) tablas.push(`<line x1="${f(x + (W / 13) * i)}" y1="${f(y - H)}" x2="${f(x + (W / 13) * i)}" y2="${f(y)}" stroke="#000" stroke-opacity=".12" stroke-width="${f(2 * s)}"/>`);
  const piedras = [];
  if (piedra) {
    const r = rng(Math.round(x + y));
    for (let row = 0; row < 3; row++)
      for (let px = 0; px < W; ) {
        const pw = (22 + r() * 22) * s;
        piedras.push(`<rect x="${f(x + px)}" y="${f(y - 40 * s + row * 13 * s)}" width="${f(Math.min(pw, W - px) - 2 * s)}" height="${f(11 * s)}" rx="${f(5 * s)}" fill="${["#9d9483", "#b3aa98", "#8c8474", "#a79e8c"][Math.floor(r() * 4)]}"/>`);
        px += pw;
      }
  }
  let techoD = "";
  let fachadaExtra = "";
  if (tipo === "gable") {
    techoD = `<path d="M${f(x - 24 * s)},${f(y - H)} L${f(x + W / 2)},${f(y - H - 110 * s)} L${f(x + W + 24 * s)},${f(y - H)} Z" fill="${techo}"/><path d="M${f(x + W + 24 * s)},${f(y - H)} L${f(x + W / 2)},${f(y - H - 110 * s)} L${f(x + W / 2 + lado)},${f(y - H - 128 * s)} L${f(x + W + 24 * s + lado)},${f(y - H - 18 * s)} Z" fill="${techo}"/><path d="M${f(x + W + 24 * s)},${f(y - H)} L${f(x + W / 2)},${f(y - H - 110 * s)} L${f(x + W / 2 + lado)},${f(y - H - 128 * s)} L${f(x + W + 24 * s + lado)},${f(y - H - 18 * s)} Z" fill="#000" opacity=".28"/><path d="M${f(x + W / 2 - 20 * s)},${f(y - H - 40 * s)} L${f(x + W / 2 + 20 * s)},${f(y - H - 40 * s)} L${f(x + W / 2 + 20 * s)},${f(y - H - 10 * s)} L${f(x + W / 2 - 20 * s)},${f(y - H - 10 * s)} Z" fill="${ventanaCol}"/>`;
    fachadaExtra = `<path d="M${f(x)},${f(y - H)} L${f(x + W / 2)},${f(y - H - 96 * s)} L${f(x + W)},${f(y - H)} Z" fill="${pared}"/>`;
  } else if (tipo === "aframe") {
    techoD = `<path d="M${f(x - 30 * s)},${f(y)} L${f(x + W / 2)},${f(y - H - 170 * s)} L${f(x + W + 30 * s)},${f(y)} L${f(x + W - 10 * s)},${f(y)} L${f(x + W / 2)},${f(y - H - 130 * s)} L${f(x + 10 * s)},${f(y)} Z" fill="${techo}"/><path d="M${f(x + W + 30 * s)},${f(y)} L${f(x + W / 2)},${f(y - H - 170 * s)} L${f(x + W / 2 + lado)},${f(y - H - 186 * s)} L${f(x + W + 30 * s + lado)},${f(y - 16 * s)} Z" fill="${techo}"/><path d="M${f(x + W + 30 * s)},${f(y)} L${f(x + W / 2)},${f(y - H - 170 * s)} L${f(x + W / 2 + lado)},${f(y - H - 186 * s)} L${f(x + W + 30 * s + lado)},${f(y - 16 * s)} Z" fill="#000" opacity=".25"/>`;
    fachadaExtra = `<path d="M${f(x + 10 * s)},${f(y)} L${f(x + W / 2)},${f(y - H - 130 * s)} L${f(x + W - 10 * s)},${f(y)} Z" fill="${pared}"/><path d="M${f(x + W / 2 - 60 * s)},${f(y - 20 * s)} L${f(x + W / 2)},${f(y - H - 60 * s)} L${f(x + W / 2 + 60 * s)},${f(y - 20 * s)} Z" fill="${ventanaCol}"/><line x1="${f(x + W / 2)}" y1="${f(y - H - 60 * s)}" x2="${f(x + W / 2)}" y2="${f(y - 20 * s)}" stroke="${techo}" stroke-width="${f(5 * s)}"/><line x1="${f(x + W / 2 - 40 * s)}" y1="${f(y - 80 * s)}" x2="${f(x + W / 2 + 40 * s)}" y2="${f(y - 80 * s)}" stroke="${techo}" stroke-width="${f(5 * s)}"/>`;
  } else if (tipo === "plano") {
    techoD = `<path d="M${f(x - 30 * s)},${f(y - H - 70 * s)} L${f(x + W + 40 * s)},${f(y - H - 100 * s)} L${f(x + W + 40 * s)},${f(y - H - 82 * s)} L${f(x - 30 * s)},${f(y - H - 52 * s)} Z" fill="${techo}"/>`;
    fachadaExtra = `<path d="M${f(x)},${f(y - H - 60 * s)} L${f(x + W)},${f(y - H - 88 * s)} L${f(x + W)},${f(y - H)} L${f(x)},${f(y - H)} Z" fill="${pared}"/><rect x="${f(x + 20 * s)}" y="${f(y - H - 50 * s)}" width="${f(W - 40 * s)}" height="${f(40 * s)}" fill="${ventanaCol}"/>${[1, 2, 3, 4].map((i) => `<line x1="${f(x + 20 * s + ((W - 40 * s) / 5) * i)}" y1="${f(y - H - 50 * s)}" x2="${f(x + 20 * s + ((W - 40 * s) / 5) * i)}" y2="${f(y - H - 10 * s)}" stroke="${techo}" stroke-width="${f(4 * s)}"/>`).join("")}`;
  }
  const ventana = (vx, vy, vw, vh) => `<rect x="${f(vx)}" y="${f(vy)}" width="${f(vw)}" height="${f(vh)}" fill="${ventanaCol}" stroke="${C.bosque2}" stroke-width="${f(5 * s)}"/><line x1="${f(vx + vw / 2)}" y1="${f(vy)}" x2="${f(vx + vw / 2)}" y2="${f(vy + vh)}" stroke="${C.bosque2}" stroke-width="${f(4 * s)}"/><rect x="${f(vx - 6 * s)}" y="${f(vy + vh)}" width="${f(vw + 12 * s)}" height="${f(6 * s)}" fill="${C.bosque2}"/>`;
  const puerta = `<rect x="${f(x + W / 2 - 24 * s)}" y="${f(y - 96 * s)}" width="${f(48 * s)}" height="${f(96 * s)}" rx="${f(4 * s)}" fill="#5a3b27"/><circle cx="${f(x + W / 2 + 14 * s)}" cy="${f(y - 48 * s)}" r="${f(3 * s)}" fill="#e3c27e"/>`;
  const chim = chimenea
    ? `<rect x="${f(x + W * 0.72)}" y="${f(y - H - 110 * s)}" width="${f(28 * s)}" height="${f(80 * s)}" fill="#8c8474"/><rect x="${f(x + W * 0.72 - 4 * s)}" y="${f(y - H - 116 * s)}" width="${f(36 * s)}" height="${f(10 * s)}" fill="#6f6859"/>${humo ? `<path d="M${f(x + W * 0.72 + 14 * s)},${f(y - H - 120 * s)} C${f(x + W * 0.72 - 20 * s)},${f(y - H - 170 * s)} ${f(x + W * 0.72 + 50 * s)},${f(y - H - 210 * s)} ${f(x + W * 0.72 + 10 * s)},${f(y - H - 270 * s)}" stroke="#fff" stroke-opacity=".35" stroke-width="${f(16 * s)}" fill="none" stroke-linecap="round"/>` : ""}`
    : "";
  const lateral = tipo === "aframe" ? "" : `<path d="M${f(x + W)},${f(y)} L${f(x + W + lado)},${f(y - 18 * s)} L${f(x + W + lado)},${f(y - H - 18 * s)} L${f(x + W)},${f(y - H)} Z" fill="${pared}"/><path d="M${f(x + W)},${f(y)} L${f(x + W + lado)},${f(y - 18 * s)} L${f(x + W + lado)},${f(y - H - 18 * s)} L${f(x + W)},${f(y - H)} Z" fill="#000" opacity=".22"/>`;
  const galeria = deck
    ? `<rect x="${f(x - 40 * s)}" y="${f(y - 6 * s)}" width="${f(W + 80 * s)}" height="${f(14 * s)}" fill="${C.madera2}"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="${f(x - 36 * s + ((W + 64 * s) / 4) * i)}" y="${f(y - 36 * s)}" width="${f(6 * s)}" height="${f(32 * s)}" fill="${C.madera2}"/>`).join("")}<rect x="${f(x - 40 * s)}" y="${f(y - 40 * s)}" width="${f(W + 80 * s)}" height="${f(6 * s)}" fill="${C.madera2}"/>`
    : "";
  const cuerpo = tipo === "aframe" ? "" : `<rect x="${f(x)}" y="${f(y - H)}" width="${f(W)}" height="${f(H)}" fill="${pared}"/>${tablas.join("")}${piedras.join("")}${ventana(x + 30 * s, y - H + 30 * s, 60 * s, 60 * s)}${ventana(x + W - 90 * s, y - H + 30 * s, 60 * s, 60 * s)}${puerta}`;
  return `<g>
    <ellipse cx="${f(x + W / 2 + lado / 2)}" cy="${f(y + 6 * s)}" rx="${f(W * 0.7)}" ry="${f(14 * s)}" fill="#000" opacity=".18"/>
    ${lateral}${cuerpo}${fachadaExtra}${techoD}${chim}${tipo === "aframe" ? puerta : ""}${galeria}
  </g>`;
}

function paisaje({ w, h, cielo, sol, capas, suelo, seed, estrellas = false, niebla = false }) {
  const r = rng(seed);
  const est = estrellas
    ? Array.from({ length: 140 }, () => `<circle cx="${f(r() * w)}" cy="${f(r() * h * 0.55)}" r="${f(0.5 + r() * 1.6)}" fill="#fff" opacity="${f(0.25 + r() * 0.7)}"/>`).join("")
    : "";
  const solD = sol ? `<circle cx="${sol.x}" cy="${sol.y}" r="${sol.r * 3}" fill="url(#halo)"/><circle cx="${sol.x}" cy="${sol.y}" r="${sol.r}" fill="${sol.c}"/>` : "";
  const cs = capas.map((c, i) => `<path d="${cresta(w, h, c.y0, c.y1, c.amp, seed + i * 13, { iter: 8 })}" fill="${c.c}"/>${niebla && i < capas.length - 1 ? `<rect x="0" y="${Math.min(c.y0, c.y1) + 40}" width="${w}" height="${h}" fill="url(#niebla)" opacity=".5"/>` : ""}`).join("");
  return {
    defs: `<linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">${cielo.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>
      <radialGradient id="halo"><stop offset="0" stop-color="${sol?.c ?? "#fff"}" stop-opacity=".55"/><stop offset="1" stop-color="${sol?.c ?? "#fff"}" stop-opacity="0"/></radialGradient>
      <linearGradient id="niebla" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset=".15" stop-color="#fff" stop-opacity=".35"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="ventanaLuz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe29a"/><stop offset="1" stop-color="#f3a64f"/></linearGradient>`,
    fondo: `<rect width="${w}" height="${h}" fill="url(#cielo)"/>${est}${solD}${cs}${suelo ?? ""}`,
  };
}

function cabanasImgs() {
  const tareas = [];
  // HERO: atardecer serrano
  {
    const w = 1800;
    const h = 1100;
    const g = grano("g", 0.08);
    const p = paisaje({
      w,
      h,
      seed: 4,
      cielo: [[0, "#3d4e7a"], [0.35, "#9a6f8e"], [0.6, "#e7976a"], [0.78, "#f6c98a"]],
      sol: { x: 1240, y: 560, r: 64, c: "#ffe2a8" },
      capas: [
        { y0: 520, y1: 470, amp: 200, c: "#9b7a92" },
        { y0: 600, y1: 560, amp: 180, c: "#7a5f7e" },
        { y0: 680, y1: 720, amp: 150, c: "#4f4a63" },
        { y0: 780, y1: 760, amp: 110, c: "#33403f" },
      ],
    });
    const r = rng(9);
    const arboles = [];
    for (let i = 0; i < 30; i++) {
      const x = r() * w;
      const y = 870 + r() * 60;
      arboles.push(r() > 0.4 ? arbolCopa(x, y, 110 + r() * 60, "#25332b", "#34473b", i) : pino(x, y, 150 + r() * 70, "#1f2d25", "#2a3b31"));
    }
    const body = `<defs>${g.defs}${p.defs}</defs>${p.fondo}
      <path d="${lomas(w, h, [[0, 880], [400, 830], [900, 860], [1400, 820], [1800, 850]])}" fill="#2b3a31"/>
      ${arboles.slice(0, 14).join("")}
      ${cabana(1420, 880, 0.75, { tipo: "gable", techo: "#3a2c24", pared: "#9c7a57", luz: true })}
      ${cabana(300, 920, 1.05, { tipo: "gable", techo: "#3a2c24", pared: "#9c7a57", luz: true, humo: true, deck: true })}
      ${cabana(900, 960, 1.3, { tipo: "aframe", techo: "#33261f", pared: "#a8835c", luz: true, chimenea: false })}
      <path d="${lomas(w, h, [[0, 980], [500, 950], [1000, 990], [1500, 960], [1800, 985]])}" fill="#1f2a23"/>
      <path d="M0,1040 C300,1000 600,1070 900,1030 C1200,995 1500,1060 1800,1020 L1800,1100 L0,1100 Z" fill="#e7976a" opacity=".35"/>
      ${arboles.slice(14).join("")}
      <path d="M0,1060 C400,1030 800,1090 1200,1050 C1500,1025 1700,1060 1800,1050 L1800,1100 L0,1100 Z" fill="#141c17"/>
      ${g.capa(w, h)}`;
    tareas.push(write("cabanas", "hero-sierras", w, h, body));
  }
  // Cabañas individuales
  const fichas = [
    ["cabana-algarrobo", { tipo: "aframe", techo: "#3b2d25", pared: "#c9a579", chimenea: false }, [[0, "#f3d3a4"], [0.6, "#f6e6c9"], [1, "#fbf3e5"]], { x: 900, y: 250, r: 60, c: "#fff1c9" }, ["#c9b8a4", "#a99a86", "#7f8a6a"], false, 3],
    ["cabana-molles", { tipo: "gable", techo: "#44342a", pared: "#d0ae82", humo: true }, [[0, "#8fbfd8"], [0.7, "#d7ebf2"], [1, "#eef6f5"]], null, ["#a7bcc6", "#8aa3a6", "#6b8a67"], true, 5],
    ["cabana-tala", { tipo: "gable", techo: "#3f5a44", pared: "#a9825a", deck: true, humo: true }, [[0, "#a6c7e3"], [1, "#eaf2f4"]], { x: 250, y: 190, r: 50, c: "#fffbe8" }, ["#b5c3c8", "#97aaa5", "#5f7d56"], false, 8],
    ["cabana-mirador", { tipo: "plano", techo: "#2f2a26", pared: "#c7a37a", luz: true, deck: true }, [[0, "#394a78"], [0.5, "#b0708a"], [1, "#f0a978"]], { x: 950, y: 520, r: 70, c: "#ffd49a" }, ["#7d6a8a", "#5a506e", "#3c4a43"], false, 12],
  ];
  for (const [name, op, cielo, sol, cols, niebla, seed] of fichas) {
    const w = 1200;
    const h = 900;
    const g = grano("g", 0.08);
    const p = paisaje({
      w,
      h,
      seed,
      cielo,
      sol,
      niebla,
      capas: [
        { y0: 430, y1: 380, amp: 180, c: cols[0] },
        { y0: 520, y1: 500, amp: 140, c: cols[1] },
      ],
    });
    const r = rng(seed * 7);
    const pasto = cols[2];
    const oscuro = op.luz ? "#2a3730" : C.bosque;
    const arboles = [];
    for (let i = 0; i < 7; i++) {
      const x = i < 4 ? 40 + r() * 280 : 880 + r() * 300;
      arboles.push(r() > 0.5 ? pino(x, 700 + r() * 30, 220 + r() * 80, oscuro, "#3e5a47") : arbolCopa(x, 710 + r() * 20, 180 + r() * 60, oscuro, op.luz ? "#3a4a40" : C.musgo, i + seed));
    }
    const body = `<defs>${g.defs}${p.defs}</defs>${p.fondo}
      <path d="${lomas(w, h, [[0, 650], [300, 610], [700, 640], [1200, 600]])}" fill="${pasto}"/>
      ${arboles.join("")}
      ${cabana(op.tipo === "aframe" ? 390 : 330, 800, op.tipo === "aframe" ? 1.6 : 1.5, op)}
      <path d="M0,820 C300,796 900,836 1200,806 L1200,900 L0,900 Z" fill="${op.luz ? "#3c4a3a" : "#7d8f58"}"/>
      <path d="M560,900 C600,860 620,830 630,800" stroke="${op.luz ? "#6d6453" : "#d8c9a6"}" stroke-width="40" fill="none" stroke-linecap="round" opacity=".7"/>
      ${Array.from({ length: 40 }, () => {
        const x = r() * w;
        const y = 830 + r() * 65;
        return `<path d="M${f(x)},${f(y)} l-6,-22 M${f(x)},${f(y)} l4,-26 M${f(x)},${f(y)} l12,-18" stroke="${op.luz ? "#2b3a2f" : "#5e7342"}" stroke-width="3" stroke-linecap="round"/>`;
      }).join("")}
      ${g.capa(w, h)}`;
    tareas.push(write("cabanas", name, w, h, body));
  }
  // Interior: living con hogar
  {
    const w = 1200;
    const h = 900;
    const g = grano("g", 0.08);
    const vv = vineta("v", w, h, 0.35, "#2a1a10");
    const body = `<defs>${g.defs}${vv.defs}
      <linearGradient id="ven" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9a36e"/><stop offset=".6" stop-color="#f6d3a0"/><stop offset="1" stop-color="#f7e3c1"/></linearGradient>
      <radialGradient id="fuego" cx="50%" cy="80%" r="60%"><stop offset="0" stop-color="#fff2b0"/><stop offset=".4" stop-color="#f7a13b"/><stop offset="1" stop-color="#b8431f" stop-opacity="0"/></radialGradient>
      <radialGradient id="calor" cx="300" cy="620" r="500" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffb35c" stop-opacity=".35"/><stop offset="1" stop-color="#ffb35c" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#caa57a"/>
    ${Array.from({ length: 24 }, (_, i) => `<rect x="${i * 50}" y="0" width="2" height="700" fill="#8a6440" opacity=".35"/>`).join("")}
    <!-- vigas -->
    ${[40, 120].map((y) => `<rect x="0" y="${y}" width="${w}" height="34" fill="#6d4a2f"/><rect x="0" y="${y + 28}" width="${w}" height="6" fill="#000" opacity=".2"/>`).join("")}
    <!-- ventanal -->
    <rect x="620" y="210" width="480" height="380" fill="url(#ven)"/>
    <path d="${cresta(480, 380, 250, 220, 90, 41, { x0: 0, x1: 480, bajo: 380 })}" fill="#a57e8c" transform="translate(620 210)"/>
    <path d="${cresta(480, 380, 300, 290, 70, 42, { x0: 0, x1: 480, bajo: 380 })}" fill="#6f6a6e" transform="translate(620 210)"/>
    <path d="${cresta(480, 380, 350, 330, 40, 43, { x0: 0, x1: 480, bajo: 380 })}" fill="#3e4a3f" transform="translate(620 210)"/>
    <circle cx="960" cy="330" r="30" fill="#fff0c8"/>
    <rect x="610" y="200" width="500" height="400" fill="none" stroke="#5a3b27" stroke-width="18"/>
    <line x1="860" y1="200" x2="860" y2="600" stroke="#5a3b27" stroke-width="12"/>
    <rect x="600" y="596" width="520" height="16" fill="#5a3b27"/>
    <!-- hogar de piedra -->
    <path d="M140,700 L140,250 L460,250 L460,700 Z" fill="#a39a88"/>
    ${(() => {
      const r = rng(5);
      const s = [];
      for (let y = 250; y < 700; y += 30)
        for (let x = 140; x < 460; ) {
          const pw = 40 + r() * 50;
          s.push(`<rect x="${f(x + 2)}" y="${y + 2}" width="${f(Math.min(pw, 460 - x) - 4)}" height="26" rx="10" fill="${["#b3aa98", "#958c7b", "#a79e8c", "#8a8272"][Math.floor(r() * 4)]}"/>`);
          x += pw;
        }
      return s.join("");
    })()}
    <rect x="120" y="470" width="360" height="26" fill="#5a3b27"/>
    <path d="M200,700 L200,580 C200,540 230,520 300,520 C370,520 400,540 400,580 L400,700 Z" fill="#231914"/>
    <ellipse cx="300" cy="660" rx="90" ry="70" fill="url(#fuego)"/>
    <path d="M270,690 C250,650 280,620 290,590 C300,620 330,640 318,690 Z" fill="#ffd36b"/>
    <rect x="240" y="684" width="120" height="16" rx="8" fill="#4a2e1f" transform="rotate(-6 300 692)"/>
    <!-- piso y alfombra -->
    <rect x="0" y="700" width="${w}" height="200" fill="#8a5f3c"/>
    ${Array.from({ length: 8 }, (_, i) => `<rect x="0" y="${700 + i * 26}" width="${w}" height="2" fill="#000" opacity=".15"/>`).join("")}
    <ellipse cx="640" cy="800" rx="380" ry="70" fill="${C.terracota}"/>
    <ellipse cx="640" cy="800" rx="330" ry="56" fill="none" stroke="#e8c79a" stroke-width="6" stroke-dasharray="20 14"/>
    <!-- sillón -->
    <rect x="560" y="600" width="420" height="140" rx="30" fill="${C.bosque}"/>
    <rect x="580" y="560" width="380" height="90" rx="26" fill="#3b5a47"/>
    <rect x="540" y="620" width="60" height="120" rx="24" fill="#3b5a47"/><rect x="940" y="620" width="60" height="120" rx="24" fill="#3b5a47"/>
    <rect x="620" y="580" width="110" height="80" rx="20" fill="#e8d7b6"/><rect x="820" y="590" width="100" height="70" rx="20" fill="${C.terracota}"/>
    <rect x="600" y="740" width="14" height="24" fill="#3a2a1f"/><rect x="930" y="740" width="14" height="24" fill="#3a2a1f"/>
    <!-- leña -->
    ${[0, 1, 2].map((i) => `<ellipse cx="${500 + i * 26}" cy="${690 - (i === 1 ? 20 : 0)}" rx="14" ry="12" fill="#6d4a2f"/><ellipse cx="${500 + i * 26}" cy="${690 - (i === 1 ? 20 : 0)}" rx="7" ry="6" fill="#c9a57a"/>`).join("")}
    <rect width="${w}" height="${h}" fill="url(#calor)"/>
    ${vv.capa}
    ${g.capa(w, h)}`;
    tareas.push(write("cabanas", "interior-living", w, h, body));
  }
  // Interior: dormitorio
  {
    const w = 1200;
    const h = 900;
    const g = grano("g", 0.08);
    const body = `<defs>${g.defs}
      <linearGradient id="ven" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9d6e6"/><stop offset="1" stop-color="#eef3ea"/></linearGradient>
      <radialGradient id="lamp" cx="1010" cy="430" r="260" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffe0a0" stop-opacity=".5"/><stop offset="1" stop-color="#ffe0a0" stop-opacity="0"/></radialGradient></defs>
    <rect width="${w}" height="${h}" fill="#efe4d0"/>
    <path d="M0,0 L600,0 L0,260 Z" fill="#d9b98c"/><path d="M1200,0 L600,0 L1200,260 Z" fill="#d9b98c"/>
    ${Array.from({ length: 12 }, (_, i) => `<line x1="${600 - i * 50}" y1="0" x2="${600 - i * 50 - 10}" y2="${Math.max(0, 260 - i * 22)}" stroke="#b98f5e" stroke-width="2" opacity=".0"/>`).join("")}
    <rect x="0" y="0" width="${w}" height="16" fill="#8a6440"/>
    <!-- ventana -->
    <rect x="130" y="210" width="260" height="300" fill="url(#ven)"/>
    <path d="${cresta(260, 300, 200, 170, 70, 61, { x0: 0, x1: 260, bajo: 300 })}" fill="#8ca3a6" transform="translate(130 210)"/>
    <path d="${cresta(260, 300, 250, 240, 40, 62, { x0: 0, x1: 260, bajo: 300 })}" fill="#5f7d56" transform="translate(130 210)"/>
    <rect x="120" y="200" width="280" height="320" fill="none" stroke="#6d4a2f" stroke-width="16"/>
    <line x1="260" y1="200" x2="260" y2="520" stroke="#6d4a2f" stroke-width="10"/>
    <path d="M110,190 C150,300 150,420 120,560 L90,560 L90,190 Z" fill="#e9dcc4"/><path d="M410,190 C370,300 370,420 400,560 L430,560 L430,190 Z" fill="#e9dcc4"/>
    <!-- cama -->
    <rect x="500" y="300" width="560" height="260" rx="20" fill="#8a5f3c"/>
    ${Array.from({ length: 9 }, (_, i) => `<rect x="${520 + i * 60}" y="320" width="40" height="220" rx="8" fill="#9d6f48"/>`).join("")}
    <rect x="470" y="540" width="620" height="200" rx="26" fill="#fffaf0"/>
    <rect x="540" y="480" width="200" height="100" rx="30" fill="#fff"/><rect x="820" y="480" width="200" height="100" rx="30" fill="#fff"/>
    <rect x="470" y="600" width="620" height="170" rx="20" fill="${C.bosque}"/>
    ${Array.from({ length: 6 }, (_, i) => `<rect x="${470 + i * 104}" y="600" width="52" height="170" fill="#3b5a47"/>`).join("")}
    <rect x="470" y="600" width="620" height="22" fill="${C.terracota}"/>
    <!-- mesa de luz y lámpara -->
    <rect x="1100" y="560" width="100" height="160" fill="#9d6f48"/>
    <rect x="1000" y="560" width="80" height="140" fill="#9d6f48"/>
    <path d="M985,440 L1095,440 L1070,380 L1010,380 Z" fill="#e8d7b6"/><rect x="1034" y="440" width="12" height="120" fill="#3a2a1f"/>
    <rect width="${w}" height="${h}" fill="url(#lamp)"/>
    <rect x="0" y="770" width="${w}" height="130" fill="#b98f5e"/>
    ${Array.from({ length: 5 }, (_, i) => `<rect x="0" y="${770 + i * 26}" width="${w}" height="2" fill="#000" opacity=".12"/>`).join("")}
    ${g.capa(w, h)}`;
    tareas.push(write("cabanas", "interior-dormitorio", w, h, body));
  }
  // Galería: arroyo
  {
    const w = 1200;
    const h = 900;
    const g = grano("g", 0.08);
    const p = paisaje({ w, h, seed: 21, cielo: [[0, "#a9d0e8"], [1, "#eef6ee"]], sol: { x: 980, y: 160, r: 44, c: "#fffbe0" }, capas: [{ y0: 360, y1: 330, amp: 150, c: "#a8bcb9" }, { y0: 440, y1: 420, amp: 100, c: "#7f9a7a" }] });
    const r = rng(33);
    const rocas = Array.from({ length: 16 }, (_, i) => {
      const t = i / 15;
      const side = i % 2 ? 1 : -1;
      const x = 600 + side * (60 + t * 380) + (r() - 0.5) * 60;
      const y = 520 + t * 360;
      const s = 20 + t * 70;
      return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(s * 1.3)}" ry="${f(s * 0.7)}" fill="${["#9d9483", "#b3aa98", "#877f70"][i % 3]}"/><ellipse cx="${f(x - s * 0.3)}" cy="${f(y - s * 0.3)}" rx="${f(s * 0.6)}" ry="${f(s * 0.25)}" fill="#fff" opacity=".25"/>`;
    });
    const body = `<defs>${g.defs}${p.defs}<linearGradient id="agua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe0ea"/><stop offset="1" stop-color="#5f9fb0"/></linearGradient></defs>${p.fondo}
      <path d="${lomas(w, h, [[0, 500], [400, 470], [800, 500], [1200, 480]])}" fill="#6b8a58"/>
      ${Array.from({ length: 10 }, (_, i) => arbolCopa(i < 5 ? 40 + i * 90 : 780 + (i - 5) * 90, 520, 180 + (i % 3) * 30, "#3e5a3f", "#5f7d4e", i + 50)).join("")}
      <path d="M560,500 C540,600 380,700 240,900 L960,900 C820,700 660,600 640,500 Z" fill="url(#agua)"/>
      ${Array.from({ length: 14 }, (_, i) => `<path d="M${540 + (r() - 0.5) * 200 + i * 2},${540 + i * 26} q30,-6 60,0" stroke="#fff" stroke-opacity=".6" stroke-width="3" fill="none" stroke-linecap="round"/>`).join("")}
      <path d="M0,560 C200,560 380,620 420,900 L0,900 Z" fill="#8a9a64"/><path d="M1200,560 C1000,560 820,620 780,900 L1200,900 Z" fill="#7d8f58"/>
      ${rocas.join("")}
      ${g.capa(w, h)}`;
    tareas.push(write("cabanas", "galeria-arroyo", w, h, body));
  }
  // Galería: fogón de noche
  {
    const w = 1200;
    const h = 900;
    const g = grano("g", 0.1);
    const p = paisaje({ w, h, seed: 71, estrellas: true, cielo: [[0, "#0d1426"], [0.7, "#1c2a44"], [1, "#2a3a4f"]], capas: [{ y0: 470, y1: 430, amp: 150, c: "#1a2233" }, { y0: 560, y1: 540, amp: 90, c: "#121a24" }] });
    const body = `<defs>${g.defs}${p.defs}
      <radialGradient id="fogon" cx="600" cy="700" r="420" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffb35c" stop-opacity=".7"/><stop offset=".5" stop-color="#d9642c" stop-opacity=".18"/><stop offset="1" stop-color="#d9642c" stop-opacity="0"/></radialGradient>
      <linearGradient id="llama" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff2b0"/><stop offset=".5" stop-color="#f7a13b"/><stop offset="1" stop-color="#d9442c"/></linearGradient></defs>${p.fondo}
      <rect x="0" y="600" width="${w}" height="300" fill="#1a1712"/>
      <rect width="${w}" height="${h}" fill="url(#fogon)"/>
      <ellipse cx="600" cy="740" rx="170" ry="42" fill="#3a3129"/>
      ${Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return `<ellipse cx="${f(600 + Math.cos(a) * 170)}" cy="${f(740 + Math.sin(a) * 42)}" rx="30" ry="16" fill="${i % 2 ? "#6f6859" : "#8c8474"}"/>`;
      }).join("")}
      <path d="M520,730 L680,700" stroke="#4a2e1f" stroke-width="22" stroke-linecap="round"/><path d="M530,700 L670,735" stroke="#5a3b27" stroke-width="22" stroke-linecap="round"/>
      <path d="M540,720 C520,640 570,600 560,520 C600,560 620,600 610,640 C640,600 640,560 650,520 C690,590 690,660 660,720 Z" fill="url(#llama)"/>
      <path d="M575,720 C565,670 590,640 590,600 C615,630 630,670 620,720 Z" fill="#fff2b0" opacity=".9"/>
      ${Array.from({ length: 16 }, (_, i) => `<circle cx="${560 + ((i * 37) % 100)}" cy="${500 - i * 18}" r="${2 + (i % 3)}" fill="#ffc46b" opacity="${f(0.9 - i * 0.05)}"/>`).join("")}
      <path d="M300,760 L420,700 L430,720 L310,780 Z" fill="#3b2a1f"/><path d="M780,700 L900,760 L890,780 L770,720 Z" fill="#3b2a1f"/>
      ${g.capa(w, h)}`;
    tareas.push(write("cabanas", "galeria-fogon", w, h, body));
  }
  // Galería: pileta
  {
    const w = 1200;
    const h = 900;
    const g = grano("g", 0.07);
    const p = paisaje({ w, h, seed: 91, cielo: [[0, "#7fb6e0"], [1, "#e6f2f6"]], sol: { x: 200, y: 150, r: 50, c: "#fffbe0" }, capas: [{ y0: 360, y1: 330, amp: 160, c: "#a9b9c4" }, { y0: 430, y1: 420, amp: 110, c: "#7f977e" }] });
    const body = `<defs>${g.defs}${p.defs}<linearGradient id="agua" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7fd3e0"/><stop offset="1" stop-color="#2f8fb0"/></linearGradient></defs>${p.fondo}
      ${Array.from({ length: 8 }, (_, i) => pino(60 + i * 150, 520, 200 + (i % 3) * 40, "#35533f", "#4a6b53")).join("")}
      <rect x="0" y="500" width="${w}" height="400" fill="#e9dcc4"/>
      ${Array.from({ length: 16 }, (_, i) => `<rect x="${i * 80}" y="500" width="2" height="400" fill="#c8b28e" opacity=".6"/>`).join("")}
      <path d="M170,580 L1030,580 L1110,860 L90,860 Z" fill="#d9c8a6"/>
      <path d="M200,600 L1000,600 L1070,840 L130,840 Z" fill="url(#agua)"/>
      ${Array.from({ length: 10 }, (_, i) => `<path d="M${260 + i * 70},${640 + (i % 4) * 44} q26,-10 52,0 q26,10 52,0" stroke="#fff" stroke-opacity=".55" stroke-width="4" fill="none" stroke-linecap="round"/>`).join("")}
      <g><rect x="840" y="520" width="180" height="20" rx="6" fill="#fff"/><path d="M850,540 L870,580 M1010,540 L990,580" stroke="#8a8a8a" stroke-width="6"/><path d="M820,540 L840,470 L870,470 L860,520" fill="#fff" stroke="#e0e0e0" stroke-width="2"/></g>
      <g><path d="M200,470 L200,560" stroke="#6d4a2f" stroke-width="8"/><path d="M110,480 C150,420 250,420 290,480 Z" fill="${C.terracota}"/></g>
      ${g.capa(w, h)}`;
    tareas.push(write("cabanas", "galeria-pileta", w, h, body));
  }
  // Galería: amanecer con niebla
  {
    const w = 1200;
    const h = 900;
    const g = grano("g", 0.07);
    const p = paisaje({
      w,
      h,
      seed: 111,
      niebla: true,
      cielo: [[0, "#f6d7c4"], [0.6, "#fbe9d8"], [1, "#fdf4ea"]],
      sol: { x: 600, y: 420, r: 56, c: "#fff0d8" },
      capas: [
        { y0: 420, y1: 400, amp: 140, c: "#cdb6b8" },
        { y0: 500, y1: 480, amp: 120, c: "#ab98a6" },
        { y0: 590, y1: 600, amp: 110, c: "#83788f" },
        { y0: 700, y1: 690, amp: 90, c: "#5a5a6e" },
      ],
    });
    const body = `<defs>${g.defs}${p.defs}</defs>${p.fondo}
      <path d="${lomas(w, h, [[0, 800], [300, 760], [700, 810], [1200, 770]])}" fill="#3c3f4a"/>
      ${pino(120, 820, 260, "#2e3139")}${pino(200, 830, 200, "#2e3139")}${pino(1080, 810, 280, "#2e3139")}
      ${g.capa(w, h)}`;
    tareas.push(write("cabanas", "galeria-amanecer", w, h, body));
  }
  // Actividades
  {
    const w = 900;
    const h = 700;
    const g = grano("g", 0.07);
    // Cerro con sendero y cruz
    const p = paisaje({ w, h, seed: 131, cielo: [[0, "#9fcbe8"], [1, "#eaf4f2"]], sol: { x: 740, y: 120, r: 36, c: "#fffbe0" }, capas: [{ y0: 360, y1: 340, amp: 80, c: "#b7c2c0" }] });
    const cerro = `<path d="M-20,700 C100,560 250,300 450,180 C600,280 760,520 920,700 Z" fill="#8a8d63"/><path d="M450,180 C600,280 760,520 920,700 L700,700 C600,520 520,320 450,180 Z" fill="#6f7650"/>
      <path d="M420,700 C520,640 380,590 470,540 C560,490 400,450 480,400 C540,360 440,300 460,230" stroke="#e7d7b2" stroke-width="10" fill="none" stroke-dasharray="1 0" stroke-linecap="round"/>
      <path d="M450,180 L450,120 M430,140 L470,140" stroke="#f4eee2" stroke-width="7" stroke-linecap="round"/>
      ${Array.from({ length: 10 }, (_, i) => arbolCopa(40 + i * 90, 690, 110, "#4d5e3a", "#6b7f4e", i + 200)).join("")}`;
    tareas.push(write("cabanas", "actividad-cerro", w, h, `<defs>${g.defs}${p.defs}</defs>${p.fondo}${cerro}${g.capa(w, h)}`));
    // Río / balneario
    const p2 = paisaje({ w, h, seed: 141, cielo: [[0, "#8cc4e8"], [1, "#e8f4f4"]], capas: [{ y0: 300, y1: 280, amp: 90, c: "#a7bcb2" }, { y0: 360, y1: 350, amp: 60, c: "#6f8e6a" }] });
    const r = rng(5);
    const rio = `<rect x="0" y="400" width="${w}" height="300" fill="#6aa7b8"/>
      ${Array.from({ length: 18 }, () => `<path d="M${f(r() * w)},${f(420 + r() * 260)} q24,-6 48,0" stroke="#fff" stroke-opacity=".6" stroke-width="3" fill="none" stroke-linecap="round"/>`).join("")}
      <path d="M0,560 C200,520 360,600 420,700 L0,700 Z" fill="#d8c9a6"/>
      ${Array.from({ length: 7 }, (_, i) => `<ellipse cx="${520 + i * 60}" cy="${560 + (i % 3) * 40}" rx="${40 + (i % 2) * 20}" ry="${22}" fill="${["#9d9483", "#b3aa98", "#877f70"][i % 3]}"/>`).join("")}
      <path d="M120,560 L120,500" stroke="#6d4a2f" stroke-width="6"/><path d="M60,510 C90,470 150,470 180,510 Z" fill="${C.terracota}"/>
      <rect x="90" y="600" width="90" height="40" rx="6" fill="#f4eee2" transform="rotate(-8 135 620)"/>`;
    tareas.push(write("cabanas", "actividad-rio", w, h, `<defs>${g.defs}${p2.defs}</defs>${p2.fondo}${rio}${g.capa(w, h)}`));
    // Pueblo: capilla
    const p3 = paisaje({ w, h, seed: 151, cielo: [[0, "#f0c79a"], [1, "#f8e8d2"]], sol: { x: 180, y: 200, r: 40, c: "#fff3d6" }, capas: [{ y0: 380, y1: 360, amp: 100, c: "#c9a99a" }] });
    const capilla = `<path d="${lomas(w, h, [[0, 520], [450, 500], [900, 520]])}" fill="#b49a6a"/>
      <rect x="330" y="330" width="240" height="240" fill="#f7f1e6"/>
      <path d="M310,340 L450,250 L590,340 Z" fill="${C.terracota}"/>
      <rect x="410" y="170" width="80" height="170" fill="#f7f1e6"/><path d="M400,180 L450,120 L500,180 Z" fill="${C.terracota}"/>
      <path d="M450,120 L450,80 M436,94 L464,94" stroke="#3b2a1f" stroke-width="5"/>
      <path d="M430,230 C430,210 470,210 470,230 L470,260 L430,260 Z" fill="#3b2a1f"/>
      <path d="M420,570 L420,470 C420,440 480,440 480,470 L480,570 Z" fill="#6d4a2f"/>
      <rect x="350" y="400" width="36" height="60" rx="18" fill="#6f8a96"/><rect x="514" y="400" width="36" height="60" rx="18" fill="#6f8a96"/>
      ${arbolCopa(150, 600, 260, "#5a6b3c", "#7d8f58", 300)}${arbolCopa(760, 610, 220, "#5a6b3c", "#7d8f58", 301)}
      <rect x="0" y="590" width="${w}" height="110" fill="#c9b58a"/>`;
    tareas.push(write("cabanas", "actividad-pueblo", w, h, `<defs>${g.defs}${p3.defs}</defs>${p3.fondo}${capilla}${g.capa(w, h)}`));
    // Estrellas
    const p4 = paisaje({ w, h, seed: 161, estrellas: true, cielo: [[0, "#070b1a"], [0.7, "#172245"], [1, "#2c3a62"]], capas: [{ y0: 520, y1: 480, amp: 120, c: "#0e1426" }] });
    const via = `<path d="M-50,520 C200,300 500,200 950,40" stroke="#b9c6ff" stroke-opacity=".12" stroke-width="140" fill="none" filter="url(#blur)"/>
      <path d="M-50,520 C200,300 500,200 950,40" stroke="#fff" stroke-opacity=".1" stroke-width="50" fill="none" filter="url(#blur)"/>
      ${pino(700, 700, 240, "#05080f")}${pino(780, 700, 180, "#05080f")}
      <path d="M0,640 C300,600 600,660 900,630 L900,700 L0,700 Z" fill="#05080f"/>`;
    tareas.push(write("cabanas", "actividad-estrellas", w, h, `<defs>${g.defs}${p4.defs}<filter id="blur"><feGaussianBlur stdDeviation="30"/></filter></defs>${p4.fondo}${via}${g.capa(w, h)}`));
  }
  return Promise.all(tareas);
}

const trabajos = {
  barberia: () => Promise.all([barberiaHero(), barberos(), cortes(), herramientas()]),
  canchas: canchasImgs,
  cabanas: cabanasImgs,
};

for (const [slug, fn] of Object.entries(trabajos)) {
  if (solo && solo !== slug) continue;
  await fn();
}
