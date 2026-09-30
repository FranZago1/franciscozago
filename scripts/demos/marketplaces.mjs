// Ilustraciones de las demos de marketplaces (productores, oficios y usados).
// Todo se dibuja en SVG acá mismo y se exporta a WebP con sharp.
// Uso: node scripts/demos/marketplaces.mjs [productores|oficios|usados]
// Los nombres de archivo son estables: las páginas los referencian directo.
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const root = join(import.meta.dirname, "..", "..", "public", "demos", "marketplaces");
const solo = process.argv[2];

async function write(slug, name, svg, quality = 84) {
  const dir = join(root, slug);
  mkdirSync(dir, { recursive: true });
  await sharp(Buffer.from(svg)).webp({ quality, effort: 5 }).toFile(join(dir, `${name}.webp`));
  console.log("✓", `${slug}/${name}.webp`);
}

// ---------- utilidades ----------
let n = 0;
const uid = (p = "i") => `${p}${++n}`;

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

const svgOpen = (w, h, vb = `0 0 ${w} ${h}`) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${vb}">`;

/** Textura de papel: ruido fino encima de todo. */
function grain(w, h, op = 0.09, freq = 0.9, seed = 4) {
  const id = uid("g");
  return `<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="${seed}" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.12  0 0 0 0 0.09  0 0 0 0 0.05  0 0 0 ${op} 0"/></filter><rect width="${w}" height="${h}" filter="url(#${id})"/>`;
}

function blurShadow(cx, cy, rx, ry, op = 0.28, sd = 16, color = "#3A2A12") {
  const id = uid("b");
  return `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${sd}"/></filter><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}" opacity="${op}" filter="url(#${id})"/>`;
}

function lin(stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) {
  const id = uid("l");
  const s = stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("");
  return { id, def: `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${s}</linearGradient>`, url: `url(#${id})` };
}

function rad(stops, cx = 0.35, cy = 0.3, r = 0.8) {
  const id = uid("r");
  const s = stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("");
  return { id, def: `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${s}</radialGradient>`, url: `url(#${id})` };
}

// =====================================================================
// PRODUCTORES — Del Valle Mercado: ilustración cálida, con grano de papel
// =====================================================================

function sprig(x, y, rot = 0, color = "#4E7A3A", len = 150) {
  const leaves = [];
  for (let i = 0; i < 7; i++) {
    const t = 18 + i * (len - 30) / 7;
    leaves.push(`<ellipse cx="${t}" cy="-9" rx="16" ry="5.5" fill="${color}" transform="rotate(-28 ${t} -9)"/>`);
    leaves.push(`<ellipse cx="${t + 8}" cy="9" rx="16" ry="5.5" fill="${color}" opacity="0.88" transform="rotate(28 ${t + 8} 9)"/>`);
  }
  return `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0 0 L${len} 0" stroke="#6B5A34" stroke-width="3.5" stroke-linecap="round"/>${leaves.join("")}</g>`;
}

function gingham(color) {
  const id = uid("p");
  return {
    url: `url(#${id})`,
    def: `<pattern id="${id}" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="#FFF8EC"/><rect width="14" height="28" fill="${color}" opacity="0.45"/><rect width="28" height="14" fill="${color}" opacity="0.45"/></pattern>`,
  };
}

/** Frasco de vidrio con etiqueta. deco: función que dibuja el ícono de la etiqueta en (400, 470). */
function jar({ c1, c2, lid = "#B8863B", cloth, label = "#FFF6E3", deco = "", w = 270, h = 320, x = 400 }) {
  const g = lin([[0, c1], [1, c2]], 0, 0, 1, 1);
  const x0 = x - w / 2;
  const y1 = 640;
  const y0 = y1 - h;
  const parts = [g.def];
  parts.push(`<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="44" fill="${g.url}"/>`);
  // brillo del vidrio
  parts.push(`<rect x="${x0 + 22}" y="${y0 + 36}" width="22" height="${h - 90}" rx="11" fill="#fff" opacity="0.32"/>`);
  parts.push(`<rect x="${x0 + w - 40}" y="${y0 + 60}" width="10" height="${h - 150}" rx="5" fill="#fff" opacity="0.18"/>`);
  // cuello y tapa
  parts.push(`<rect x="${x0 + 26}" y="${y0 - 26}" width="${w - 52}" height="40" rx="10" fill="${c2}" opacity="0.9"/>`);
  if (cloth) {
    const p = gingham(cloth);
    parts.push(p.def);
    const l = x0 + 4;
    const r = x0 + w - 4;
    parts.push(
      `<path d="M${l - 18} ${y0 + 10} C ${l} ${y0 - 70}, ${r} ${y0 - 70}, ${r + 18} ${y0 + 10} L ${r + 6} ${y0 + 44} Q ${r - 30} ${y0 + 30} ${x + 40} ${y0 + 48} Q ${x} ${y0 + 34} ${x - 40} ${y0 + 50} Q ${l + 30} ${y0 + 30} ${l - 6} ${y0 + 46} Z" fill="${p.url}"/>`,
    );
    parts.push(`<path d="M${l + 10} ${y0 + 4} Q ${x} ${y0 + 18} ${r - 10} ${y0 + 4}" stroke="#A0703A" stroke-width="5" fill="none"/>`);
    parts.push(`<path d="M${x + 60} ${y0 + 10} q 20 22 6 46 M${x + 60} ${y0 + 10} q 30 10 34 38" stroke="#A0703A" stroke-width="4" fill="none" stroke-linecap="round"/>`);
  } else {
    const lg = lin([[0, lid], [1, "#6E4B1E"]], 0, 0, 0, 1);
    parts.push(lg.def);
    parts.push(`<rect x="${x0 + 14}" y="${y0 - 74}" width="${w - 28}" height="58" rx="12" fill="${lg.url}"/>`);
    for (let i = 0; i < 14; i++) {
      const lx = x0 + 30 + i * ((w - 60) / 13);
      parts.push(`<line x1="${lx}" y1="${y0 - 66}" x2="${lx}" y2="${y0 - 24}" stroke="#000" stroke-opacity="0.12" stroke-width="3"/>`);
    }
    parts.push(`<rect x="${x0 + 14}" y="${y0 - 74}" width="${w - 28}" height="10" rx="5" fill="#fff" opacity="0.25"/>`);
  }
  // etiqueta
  const ly = y0 + h * 0.34;
  parts.push(`<rect x="${x0 + 30}" y="${ly}" width="${w - 60}" height="${h * 0.44}" rx="12" fill="${label}"/>`);
  parts.push(`<rect x="${x0 + 42}" y="${ly + 12}" width="${w - 84}" height="${h * 0.44 - 24}" rx="8" fill="none" stroke="#2B3A22" stroke-opacity="0.35" stroke-width="2.5"/>`);
  parts.push(`<g transform="translate(${x} ${ly + h * 0.17})">${deco}</g>`);
  parts.push(`<rect x="${x - 58}" y="${ly + h * 0.31}" width="116" height="9" rx="4.5" fill="#2B3A22" opacity="0.7"/>`);
  parts.push(`<rect x="${x - 38}" y="${ly + h * 0.31 + 17}" width="76" height="6" rx="3" fill="#2B3A22" opacity="0.35"/>`);
  return parts.join("");
}

const decoAbeja = `<ellipse cx="0" cy="0" rx="24" ry="17" fill="#E3A21A"/><path d="M-8 -16 v32 M6 -16 v32" stroke="#2B2112" stroke-width="7"/><ellipse cx="-6" cy="-24" rx="14" ry="10" fill="#fff" stroke="#2B2112" stroke-width="2" opacity="0.9"/><ellipse cx="10" cy="-24" rx="14" ry="10" fill="#fff" stroke="#2B2112" stroke-width="2" opacity="0.9"/><circle cx="24" cy="-2" r="7" fill="#2B2112"/>`;
const decoFrutos = `<circle cx="-14" cy="6" r="15" fill="#B3243B"/><circle cx="12" cy="8" r="14" fill="#7A1F4B"/><circle cx="0" cy="-12" r="13" fill="#D2394E"/><path d="M0 -24 q 10 -14 22 -12 q -8 10 -22 12" fill="#4E7A3A"/>`;
const decoHigo = `<path d="M0 -26 C 22 -12, 26 16, 0 24 C -26 16, -22 -12, 0 -26 Z" fill="#6B3257"/><path d="M0 -26 v-8" stroke="#4E7A3A" stroke-width="5" stroke-linecap="round"/><path d="M-8 6 q 8 6 16 0" stroke="#E8A0B8" stroke-width="3" fill="none"/>`;
const decoCabra = `<path d="M-22 10 q 0 -26 22 -26 q 22 0 22 26 q -22 12 -44 0Z" fill="#8A6A45"/><path d="M-12 -14 q -12 -18 -4 -26 M12 -14 q 12 -18 4 -26" stroke="#5B4430" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="-8" cy="-2" r="3" fill="#2B2112"/><circle cx="8" cy="-2" r="3" fill="#2B2112"/><path d="M-4 16 q 4 10 8 0" fill="#5B4430"/>`;

function dipper(x, y) {
  return `<g transform="translate(${x} ${y}) rotate(-38)"><rect x="-8" y="-230" width="16" height="200" rx="8" fill="#B07A3E"/><rect x="-8" y="-230" width="6" height="200" rx="3" fill="#fff" opacity="0.2"/>${[0, 1, 2, 3, 4]
    .map((i) => `<ellipse cx="0" cy="${-20 + i * 18}" rx="${34 - Math.abs(i - 2) * 4}" ry="10" fill="#C98E48"/><ellipse cx="0" cy="${-24 + i * 18}" rx="${30 - Math.abs(i - 2) * 4}" ry="5" fill="#E4B26B"/>`)
    .join("")}<path d="M-18 70 q 2 40 8 60 q 4 10 8 0 q 4 -30 2 -60Z" fill="#E09A1A" opacity="0.92"/></g>`;
}

function cheeseWheel() {
  const top = lin([[0, "#F2C75A"], [1, "#DDA43A"]], 0, 0, 1, 1);
  const side = lin([[0, "#C98A2B"], [1, "#9E6A1F"]], 0, 0, 1, 0);
  const paste = lin([[0, "#FBE7A4"], [1, "#F0CE72"]], 0, 0, 1, 1);
  const holes = [
    [520, 610, 12, 8],
    [575, 628, 9, 6],
    [620, 612, 14, 9],
    [548, 590, 7, 5],
    [660, 640, 8, 6],
  ]
    .map(([cx, cy, rx, ry]) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#D9AE52"/>`)
    .join("");
  return `${top.def}${side.def}${paste.def}
  <path d="M130 430 L130 540 A200 64 0 0 0 530 540 L530 430 Z" fill="${side.url}"/>
  <ellipse cx="330" cy="430" rx="200" ry="64" fill="${top.url}"/>
  <ellipse cx="330" cy="430" rx="170" ry="50" fill="none" stroke="#fff" stroke-opacity="0.18" stroke-width="4"/>
  <path d="M150 470 q 180 50 360 0" stroke="#7E5316" stroke-opacity="0.25" stroke-width="4" fill="none"/>
  <path d="M460 560 L700 596 L700 676 L460 640 Z" fill="${paste.url}"/>
  <path d="M700 596 L640 520 L640 600 L700 676 Z" fill="#C98A2B"/>
  <path d="M460 560 L640 520 L700 596 Z" fill="#FFF0BF"/>
  <path d="M460 560 L640 520" stroke="#D9A441" stroke-width="7" stroke-linecap="round"/>
  ${holes}
  ${sprig(170, 640, -8, "#5B8A3E", 170)}`;
}

function goatLog() {
  const r = rng(11);
  const specks = [];
  for (let i = 0; i < 120; i++) {
    const x = 210 + r() * 350;
    const y = 450 + r() * 140;
    specks.push(`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(3 + r() * 5).toFixed(1)}" ry="${(1.5 + r() * 2).toFixed(1)}" fill="${r() > 0.35 ? "#4F7B3A" : "#8A6B3A"}" transform="rotate(${Math.round(r() * 180)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`);
  }
  const body = lin([[0, "#FFFDF5"], [1, "#EFE7D2"]], 0, 0, 0, 1);
  return `${body.def}
  <rect x="180" y="430" width="420" height="180" rx="90" fill="${body.url}"/>
  <clipPath id="logc"><rect x="180" y="430" width="420" height="180" rx="90"/></clipPath>
  <g clip-path="url(#logc)">${specks.join("")}</g>
  <ellipse cx="596" cy="520" rx="62" ry="90" fill="#FFFEF8" stroke="#E6DCC3" stroke-width="5"/>
  <ellipse cx="596" cy="520" rx="46" ry="72" fill="none" stroke="#F1EAD7" stroke-width="3"/>
  <g transform="translate(680 612) rotate(-12)"><ellipse cx="0" cy="0" rx="58" ry="22" fill="#F4ECD8"/><ellipse cx="0" cy="-8" rx="58" ry="22" fill="#FFFDF6" stroke="#E6DCC3" stroke-width="4"/></g>
  <rect x="220" y="455" width="300" height="20" rx="10" fill="#fff" opacity="0.4"/>
  ${sprig(120, 660, -18, "#46703A", 190)}`;
}

function honeycomb() {
  const hexes = [];
  const r = rng(5);
  const R = 30;
  const w = Math.sqrt(3) * R;
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      const cx = 215 + col * w + (row % 2 ? w / 2 : 0);
      const cy = 410 + row * R * 1.5;
      const pts = [];
      for (let k = 0; k < 6; k++) {
        const a = Math.PI / 6 + (k * Math.PI) / 3;
        pts.push(`${(cx + (R - 3) * Math.cos(a)).toFixed(1)},${(cy + (R - 3) * Math.sin(a)).toFixed(1)}`);
      }
      const capped = r() > 0.72;
      hexes.push(`<polygon points="${pts.join(" ")}" fill="${capped ? "#F4D58A" : r() > 0.5 ? "#E39A14" : "#D9860E"}" stroke="#B8740F" stroke-width="3"/>`);
      if (!capped) hexes.push(`<ellipse cx="${(cx - 7).toFixed(1)}" cy="${(cy - 8).toFixed(1)}" rx="7" ry="4" fill="#fff" opacity="0.45"/>`);
    }
  }
  return `<rect x="140" y="560" width="520" height="70" rx="20" fill="#9A6B3C"/><rect x="140" y="560" width="520" height="16" rx="8" fill="#B98552"/>
  <rect x="640" y="578" width="100" height="34" rx="17" fill="#9A6B3C"/>
  <clipPath id="comb"><path d="M200 390 Q 400 360 610 392 Q 640 470 612 570 Q 400 590 196 572 Q 176 480 200 390Z"/></clipPath>
  <path d="M200 390 Q 400 360 610 392 Q 640 470 612 570 Q 400 590 196 572 Q 176 480 200 390Z" fill="#C57A0C"/>
  <g clip-path="url(#comb)">${hexes.join("")}</g>
  <path d="M600 560 q 10 30 4 56 q -6 10 -10 0 q -4 -26 6 -56" fill="#E39A14"/>`;
}

function basket() {
  const weave = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 9; col++) {
      const x = 200 + col * 46 + (row % 2 ? 23 : 0) - row * 3;
      weave.push(`<rect x="${x}" y="${478 + row * 32}" width="40" height="26" rx="12" fill="${(row + col) % 2 ? "#C48A4A" : "#B37838"}"/>`);
    }
  }
  return `
  <path d="M230 470 C 230 250, 570 250, 570 470" stroke="#9C6630" stroke-width="18" fill="none"/>
  <path d="M230 470 C 230 250, 570 250, 570 470" stroke="#C48A4A" stroke-width="8" fill="none"/>
  <g>
    <circle cx="330" cy="420" r="80" fill="#5E9C3F"/><circle cx="300" cy="390" r="56" fill="#78B552"/><circle cx="360" cy="380" r="50" fill="#8CC766"/>
    <path d="M300 440 q 30 -60 60 -80 M340 450 q 10 -50 40 -70" stroke="#CFE8B5" stroke-width="5" fill="none"/>
    <g transform="translate(460 330) rotate(18)"><path d="M-14 0 L0 180 L14 0Z" fill="#E4782A"/><path d="M-14 0 L0 180 L14 0Z" fill="#fff" opacity="0.1"/><path d="M0 0 q -20 -60 -30 -90 M0 0 q 6 -60 0 -100 M0 0 q 22 -50 34 -80" stroke="#4E8A36" stroke-width="7" stroke-linecap="round" fill="none"/></g>
    <g transform="translate(510 350) rotate(30)"><path d="M-12 0 L0 150 L12 0Z" fill="#EF8A33"/><path d="M0 0 q -14 -50 -24 -80 M0 0 q 18 -46 26 -74" stroke="#4E8A36" stroke-width="6" stroke-linecap="round" fill="none"/></g>
    <circle cx="430" cy="450" r="50" fill="#7B1F48"/><circle cx="416" cy="436" r="14" fill="#fff" opacity="0.18"/><path d="M430 400 q -10 -50 -40 -70 M430 400 q 20 -40 50 -56" stroke="#6E9B3E" stroke-width="7" fill="none" stroke-linecap="round"/>
    <circle cx="520" cy="455" r="40" fill="#D8412F"/><circle cx="508" cy="442" r="11" fill="#fff" opacity="0.25"/><path d="M520 418 l -12 -8 l 12 2 l 4 -12 l 4 12 l 12 -2 l -12 8Z" fill="#4E7A3A"/>
  </g>
  <path d="M190 470 L610 470 L570 650 Q 400 668 230 650 Z" fill="#A86F33"/>
  <clipPath id="bask"><path d="M190 470 L610 470 L570 650 Q 400 668 230 650 Z"/></clipPath>
  <g clip-path="url(#bask)">${weave.join("")}</g>
  <rect x="178" y="458" width="444" height="30" rx="15" fill="#9C6630"/><rect x="178" y="458" width="444" height="10" rx="5" fill="#fff" opacity="0.18"/>`;
}

function tomato(cx, cy, r, color, seedRot = 0) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/><path d="M${cx - r * 0.7} ${cy} q ${r * 0.7} ${r * 0.5} ${r * 1.4} 0" stroke="#000" stroke-opacity="0.08" stroke-width="4" fill="none"/><ellipse cx="${cx - r * 0.35}" cy="${cy - r * 0.4}" rx="${r * 0.22}" ry="${r * 0.14}" fill="#fff" opacity="0.35" transform="rotate(-30 ${cx - r * 0.35} ${cy - r * 0.4})"/><g transform="translate(${cx} ${cy - r * 0.86}) rotate(${seedRot})"><path d="M0 0 l -16 -6 l 12 -2 l -2 -14 l 8 12 l 10 -10 l -4 14 l 14 4 l -16 2Z" fill="#3E6B2E"/><rect x="-2" y="-18" width="4" height="12" rx="2" fill="#3E6B2E"/></g>`;
}

function crate() {
  const t = [
    [250, 440, 58, "#D8412F"],
    [360, 430, 64, "#E7A22B"],
    [480, 438, 60, "#B7302A"],
    [580, 450, 50, "#5A2A3A"],
    [305, 385, 48, "#F0C33C"],
    [425, 380, 54, "#D8412F"],
    [535, 392, 46, "#E36A2C"],
  ];
  const plank = (y, h) => `<rect x="160" y="${y}" width="480" height="${h}" rx="6" fill="#C9955A"/><rect x="160" y="${y}" width="480" height="8" rx="4" fill="#fff" opacity="0.22"/><path d="M180 ${y + h / 2} h 440" stroke="#8C5E2E" stroke-opacity="0.25" stroke-width="3" stroke-dasharray="60 30"/>`;
  return `${t.map(([x, y, r, c], i) => tomato(x, y, r, c, i * 25)).join("")}
  <rect x="150" y="470" width="500" height="180" rx="10" fill="#A0703D"/>
  ${plank(480, 76)}${plank(566, 76)}
  <rect x="150" y="470" width="30" height="180" rx="6" fill="#8C5E2E"/><rect x="620" y="470" width="30" height="180" rx="6" fill="#8C5E2E"/>
  ${[500, 530, 590, 620].map((y) => `<circle cx="165" cy="${y}" r="4" fill="#5A3A1A"/><circle cx="635" cy="${y}" r="4" fill="#5A3A1A"/>`).join("")}
  ${sprig(560, 640, -150, "#4E7A3A", 110)}`;
}

function eggs() {
  const eggs = [];
  const cols = ["#E8C9A0", "#F6EAD6", "#D9A874", "#EFD9B8", "#C98E5A", "#F3E3CB"];
  for (let i = 0; i < 3; i++) {
    eggs.push(`<ellipse cx="${300 + i * 100}" cy="455" rx="42" ry="54" fill="${cols[i]}"/><ellipse cx="${288 + i * 100}" cy="436" rx="10" ry="16" fill="#fff" opacity="0.4"/>`);
  }
  for (let i = 0; i < 3; i++) {
    eggs.push(`<ellipse cx="${260 + i * 110}" cy="505" rx="46" ry="58" fill="${cols[i + 3]}"/><ellipse cx="${246 + i * 110}" cy="484" rx="11" ry="18" fill="#fff" opacity="0.4"/>`);
  }
  eggs.push(`<ellipse cx="590" cy="500" rx="46" ry="58" fill="#E3BE8E"/><ellipse cx="576" cy="480" rx="11" ry="18" fill="#fff" opacity="0.4"/>`);
  return `<path d="M170 300 L630 300 L610 470 L190 470Z" fill="#D7C4A5"/><path d="M190 320 L610 320" stroke="#BCA886" stroke-width="4"/>
  <path d="M170 300 L630 300 L610 470 L190 470Z" fill="#000" opacity="0.06"/>
  ${eggs.join("")}
  <path d="M150 520 L650 520 L620 650 L180 650Z" fill="#CDB896"/>
  ${[0, 1, 2, 3, 4].map((i) => `<path d="M${190 + i * 90} 530 q 45 40 90 0" stroke="#B5A07C" stroke-width="4" fill="none"/>`).join("")}
  <rect x="150" y="512" width="500" height="20" rx="8" fill="#DCC9A8"/>
  <rect x="340" y="570" width="120" height="44" rx="8" fill="#FFF6E3" opacity="0.9"/><rect x="356" y="584" width="88" height="7" rx="3.5" fill="#2B3A22" opacity="0.55"/><rect x="370" y="598" width="60" height="5" rx="2.5" fill="#2B3A22" opacity="0.3"/>`;
}

function membrillo() {
  return `<path d="M170 470 L520 470 L520 610 L170 610 Z" fill="#B8402A"/>
  <path d="M170 470 L260 410 L610 410 L520 470Z" fill="#D9614A"/>
  <path d="M520 470 L610 410 L610 550 L520 610Z" fill="#932F1F"/>
  <path d="M190 490 L500 490" stroke="#fff" stroke-opacity="0.18" stroke-width="8" stroke-linecap="round"/>
  <path d="M280 425 L590 425" stroke="#fff" stroke-opacity="0.2" stroke-width="5" stroke-linecap="round"/>
  <g transform="translate(560 560) rotate(-14)"><rect x="0" y="0" width="190" height="96" rx="6" fill="#C94A33"/><rect x="0" y="0" width="190" height="20" rx="6" fill="#E27558"/><rect x="12" y="30" width="80" height="10" rx="5" fill="#fff" opacity="0.18"/></g>
  <g transform="translate(400 350)"><path d="M0 60 C -60 60, -70 -10, -20 -30 C 0 -40, 20 -40, 40 -30 C 90 -10, 70 60, 0 60Z" fill="#E6B93A"/><path d="M-6 -34 q 4 -26 18 -34" stroke="#6B5A34" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M12 -60 q 40 -10 50 18 q -34 6 -50 -18" fill="#6E9B3E"/><ellipse cx="-22" cy="0" rx="12" ry="20" fill="#fff" opacity="0.25"/></g>`;
}

function loaf() {
  const g = rad([[0, "#E7B26A"], [0.6, "#C98840"], [1, "#9C5E24"]], 0.4, 0.3, 0.8);
  const r = rng(3);
  const flour = [];
  for (let i = 0; i < 60; i++) flour.push(`<circle cx="${(260 + r() * 280).toFixed(1)}" cy="${(390 + r() * 120).toFixed(1)}" r="${(1.5 + r() * 3).toFixed(1)}" fill="#fff" opacity="${(0.3 + r() * 0.4).toFixed(2)}"/>`);
  return `${g.def}
  <path d="M130 600 L670 600 L700 660 L100 660Z" fill="#E9DDC4"/><path d="M130 600 L670 600" stroke="#C94A3A" stroke-width="10"/><path d="M118 628 L682 628" stroke="#C94A3A" stroke-width="5" opacity="0.7"/>
  <path d="M170 600 C 150 380, 650 380, 630 600 Q 400 640 170 600Z" fill="${g.url}"/>
  <path d="M260 470 Q 400 390 540 470" stroke="#F6DDAE" stroke-width="16" fill="none" stroke-linecap="round"/>
  <path d="M300 520 Q 400 470 500 520" stroke="#F1D39A" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M250 470 Q 400 380 550 470" stroke="#8C4F1A" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.4"/>
  ${flour.join("")}`;
}

function alfajores() {
  const rx = 128;
  const ry = 30;
  const disc = (y0, t, top, side, a = rx, b = ry) =>
    `<rect x="${-a}" y="${y0}" width="${a * 2}" height="${t}" fill="${side}"/><ellipse cx="0" cy="${y0 + t}" rx="${a}" ry="${b}" fill="${side}"/><ellipse cx="0" cy="${y0}" rx="${a}" ry="${b}" fill="${top}"/>`;
  const one = (x, y, s = 1) => {
    const r = rng(Math.round(x + y));
    const coco = [];
    for (let i = 0; i < 34; i++) {
      const cx = -rx + 6 + r() * (rx * 2 - 12);
      const f = ry * Math.sqrt(Math.max(0, 1 - (cx / rx) ** 2));
      const cy = -12 + f + (r() - 0.5) * 16;
      coco.push(`<rect x="${cx.toFixed(1)}" y="${cy.toFixed(1)}" width="8" height="3" rx="1.5" fill="#FFFDF7" transform="rotate(${Math.round(r() * 180)} ${cx.toFixed(1)} ${cy.toFixed(1)})"/>`);
    }
    return `<g transform="translate(${x} ${y}) scale(${s})">${disc(0, 20, "#F4E0B0", "#E2C286")}${disc(-22, 22, "#8A4B1D", "#7A3F16")}${coco.join("")}${disc(-44, 22, "#F8E8C2", "#E2C286")}<ellipse cx="-40" cy="-52" rx="42" ry="7" fill="#fff" opacity="0.45"/></g>`;
  };
  return `${one(390, 600)}${one(400, 530)}${one(392, 460)}
  <g transform="translate(620 640) rotate(-6)">${disc(-14, 14, "#F4E0B0", "#E2C286", 84, 20)}</g>`;
}

function budin() {
  const r = rng(8);
  const seeds = [];
  for (let i = 0; i < 40; i++) seeds.push(`<circle cx="${(220 + r() * 330).toFixed(1)}" cy="${(470 + r() * 120).toFixed(1)}" r="2.2" fill="#3A2A20" opacity="0.7"/>`);
  return `<path d="M200 460 L560 460 L540 630 L220 630Z" fill="#E4B464"/>
  <path d="M560 460 L640 420 L620 590 L540 630Z" fill="#C9914A"/>
  <path d="M200 460 C 230 380, 540 380, 560 460 L640 420 C 620 360, 320 340, 290 400Z" fill="#B87A36"/>
  <path d="M200 460 C 230 380, 540 380, 560 460 L640 420 C 620 350, 320 340, 290 400 Z" fill="#FFF9EC" opacity="0.92"/>
  <path d="M230 455 q 10 40 20 0 M300 452 q 8 60 18 0 M380 455 q 10 30 18 0 M470 455 q 10 50 20 0 M540 458 q 8 28 16 0 M580 440 q 10 40 18 -10" stroke="#FFF9EC" stroke-width="14" stroke-linecap="round" fill="none"/>
  ${seeds.join("")}
  <g transform="translate(650 600)"><circle r="62" fill="#F2C12E"/><circle r="52" fill="#FBE38A"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M0 0 L${(48 * Math.cos((i * Math.PI) / 4)).toFixed(1)} ${(48 * Math.sin((i * Math.PI) / 4)).toFixed(1)}" stroke="#F2C12E" stroke-width="4"/>`).join("")}<circle r="6" fill="#FFF6D0"/></g>`;
}

function bottle({ glass, glass2, label = "#F4EAD2", cap = "#6E1E2B", liquidTop, x = 400, deco = "" }) {
  const g = lin([[0, glass], [0.5, glass2], [1, glass]], 0, 0, 1, 0);
  return `${g.def}
  <path d="M${x - 80} 660 L${x - 80} 360 C ${x - 80} 290, ${x - 30} 280, ${x - 30} 220 L${x - 30} 140 L${x + 30} 140 L${x + 30} 220 C ${x + 30} 280, ${x + 80} 290, ${x + 80} 360 L${x + 80} 660 Q ${x} 672 ${x - 80} 660Z" fill="${g.url}"/>
  ${liquidTop ? `<path d="M${x - 78} ${liquidTop} L${x + 78} ${liquidTop}" stroke="#fff" stroke-opacity="0.3" stroke-width="3"/>` : ""}
  <rect x="${x - 62}" y="340" width="16" height="280" rx="8" fill="#fff" opacity="0.28"/>
  <rect x="${x - 34}" y="100" width="68" height="100" rx="8" fill="${cap}"/><rect x="${x - 34}" y="100" width="68" height="14" rx="6" fill="#fff" opacity="0.2"/>
  <rect x="${x - 80}" y="440" width="160" height="150" fill="${label}"/>
  <rect x="${x - 68}" y="452" width="136" height="126" fill="none" stroke="#2B2112" stroke-opacity="0.45" stroke-width="2"/>
  <g transform="translate(${x} 500)">${deco}</g>
  <rect x="${x - 44}" y="548" width="88" height="8" rx="4" fill="#2B2112" opacity="0.7"/><rect x="${x - 30}" y="562" width="60" height="5" rx="2.5" fill="#2B2112" opacity="0.35"/>`;
}

const decoUva = [0, 1, 2, 3, 4, 5]
  .map((i) => {
    const pos = [[-12, -18], [12, -18], [0, -2], [-22, -2], [22, -2], [-8, 14], [10, 14]][i];
    return `<circle cx="${pos[0]}" cy="${pos[1]}" r="11" fill="#5B1F35"/>`;
  })
  .join("") + `<path d="M0 -28 q 10 -16 26 -14" stroke="#4E7A3A" stroke-width="4" fill="none"/><circle cx="0" cy="26" r="9" fill="#5B1F35"/>`;
const decoFrambua = `<circle cx="-8" cy="-6" r="10" fill="#C2185B"/><circle cx="8" cy="-6" r="10" fill="#D63A74"/><circle cx="0" cy="8" r="10" fill="#C2185B"/><circle cx="-14" cy="10" r="8" fill="#D63A74"/><circle cx="14" cy="10" r="8" fill="#A0144B"/><path d="M0 -18 q -12 -14 -24 -10 M0 -18 q 12 -16 26 -10" stroke="#4E7A3A" stroke-width="5" fill="none" stroke-linecap="round"/>`;

function wineGlass(x, y, wine = "#6A0F24") {
  return `<g transform="translate(${x} ${y})"><path d="M-55 -250 Q -60 -150 0 -130 Q 60 -150 55 -250Z" fill="#fff" opacity="0.35" stroke="#fff" stroke-opacity="0.8" stroke-width="3"/><path d="M-52 -200 Q -50 -148 0 -134 Q 50 -148 52 -200Z" fill="${wine}"/><rect x="-4" y="-132" width="8" height="120" fill="#fff" opacity="0.6"/><ellipse cx="0" cy="-10" rx="46" ry="10" fill="#fff" opacity="0.55"/></g>`;
}

function salame() {
  const r = rng(21);
  const bloom = [];
  for (let i = 0; i < 40; i++) bloom.push(`<ellipse cx="${(170 + r() * 380).toFixed(1)}" cy="${(420 + r() * 120).toFixed(1)}" rx="${(8 + r() * 16).toFixed(1)}" ry="${(5 + r() * 8).toFixed(1)}" fill="#F3EDE3" opacity="${(0.25 + r() * 0.35).toFixed(2)}"/>`);
  const slice = (x, y) => {
    const rr = rng(x);
    const fat = [];
    for (let i = 0; i < 16; i++) fat.push(`<circle cx="${(-36 + rr() * 72).toFixed(1)}" cy="${(-24 + rr() * 48).toFixed(1)}" r="${(3 + rr() * 5).toFixed(1)}" fill="#F7D9D0"/>`);
    return `<g transform="translate(${x} ${y})"><ellipse rx="54" ry="40" fill="#E9E1D2"/><ellipse rx="48" ry="35" fill="#9E2A2E"/>${fat.join("")}</g>`;
  };
  return `<rect x="100" y="560" width="600" height="80" rx="24" fill="#A87444"/><rect x="100" y="560" width="600" height="16" rx="8" fill="#C79262"/>
  <g transform="rotate(-10 380 480)">
    <rect x="150" y="410" width="420" height="140" rx="70" fill="#7E2F22"/>
    <clipPath id="sal"><rect x="150" y="410" width="420" height="140" rx="70"/></clipPath>
    <g clip-path="url(#sal)">${bloom.join("")}${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${200 + i * 60} 400 q 20 80 0 160" stroke="#E8D9B8" stroke-width="3" fill="none" opacity="0.8"/>`).join("")}<path d="M150 480 h420" stroke="#E8D9B8" stroke-width="3" opacity="0.8"/></g>
    <ellipse cx="570" cy="480" rx="30" ry="68" fill="#9E2A2E"/>
    <path d="M150 480 q -40 -10 -50 -40" stroke="#D9C79E" stroke-width="5" fill="none" stroke-linecap="round"/>
  </g>
  ${slice(560, 590)}${slice(640, 570)}${slice(470, 600)}`;
}

function productoBg(color, tone, body, w = 800, h = 800) {
  return `${svgOpen(w, h)}<rect width="${w}" height="${h}" fill="${color}"/>
  <circle cx="${w * 0.5}" cy="${h * 0.47}" r="${w * 0.36}" fill="${tone}"/>
  <path d="M0 ${h * 0.82} Q ${w * 0.5} ${h * 0.79} ${w} ${h * 0.82} L${w} ${h} L0 ${h}Z" fill="#000" opacity="0.05"/>
  ${blurShadow(w * 0.5, h * 0.81, w * 0.3, h * 0.03)}
  ${body}
  ${grain(w, h)}</svg>`;
}

const productosProd = {
  "queso-cabra-hierbas": ["#E7E2C4", "#F3EFD8", goatLog()],
  "queso-semiduro": ["#F1DDA6", "#F7E8BF", cheeseWheel()],
  "dulce-de-leche-cabra": ["#E8D2B8", "#F3E4D1", jar({ c1: "#B56A2A", c2: "#7A3E12", cloth: "#2F6B3F", deco: decoCabra })],
  "miel-multifloral": ["#F2C66A", "#F7DB97", jar({ c1: "#F0A21E", c2: "#B8620A", lid: "#D9A441", deco: decoAbeja, x: 360 }) + dipper(600, 620)],
  "miel-cremosa": ["#F4DFA2", "#FAEDC6", jar({ c1: "#F6E2A6", c2: "#E3BC5F", lid: "#8A6B3A", deco: decoAbeja })],
  "panal-de-miel": ["#EFC56A", "#F6DC9B", honeycomb()],
  "bolson-de-estacion": ["#CFE0B0", "#E1ECC9", basket()],
  "tomates-reliquia": ["#EAD3B0", "#F3E3C9", crate()],
  "huevos-de-campo": ["#DCE5C5", "#EBF0DA", eggs()],
  "mermelada-frutos-rojos": ["#F0C6BC", "#F7DDD5", jar({ c1: "#B3243B", c2: "#6E1026", cloth: "#B3243B", deco: decoFrutos })],
  "dulce-de-membrillo": ["#F3D4A8", "#F8E5C8", membrillo()],
  "higos-en-almibar": ["#DCCBDD", "#EBDFEC", jar({ c1: "#8E4A6F", c2: "#4E1F3A", cloth: "#3D5A9E", deco: decoHigo })],
  "pan-masa-madre": ["#EAD6B3", "#F4E7CE", loaf()],
  "alfajores-maicena": ["#F2DCC0", "#F8EAD8", alfajores()],
  "budin-de-limon": ["#F4E6A6", "#F9F0C8", budin()],
  "malbec-de-altura": ["#D9C6CF", "#E9DCE2", bottle({ glass: "#2A1018", glass2: "#5A1E2E", cap: "#6E1E2B", deco: decoUva, x: 360 }) + wineGlass(560, 660)],
  "rosado-de-frambua": ["#F3CFD6", "#F9E3E7", bottle({ glass: "#E27A96", glass2: "#F4B3C3", cap: "#C2185B", label: "#FFF7EE", deco: decoFrambua, liquidTop: 250 })],
  "salame-de-la-colonia": ["#E6CDB5", "#F1E0CF", salame()],
};

// ----- Personas estilizadas (compartido entre productores y oficios) -----
function person({ skin = "#E2A77F", hair = "#3B2718", style = "short", shirt = "#3F6E4A", shirt2, apron, overalls, collar = true, glasses = false, beard = false, hat, cap, helmet, pencil = false, plaid, patch, stripe, earring = false, splatter = false }) {
  const shade = "#000";
  const p = [];
  // pelo largo por detrás
  if (style === "long") p.push(`<path d="M-74 -130 C -86 -40, -96 10, -70 60 L70 60 C 96 10, 86 -40, 74 -130 C 70 -200, -70 -200, -74 -130Z" fill="${hair}"/>`);
  if (style === "bun") p.push(`<circle cx="0" cy="-214" r="34" fill="${hair}"/>`);
  // torso
  const body = `M-170 150 C -170 60, -130 20, -60 4 L60 4 C 130 20, 170 60, 170 150Z`;
  p.push(`<path d="${body}" fill="${shirt}"/>`);
  if (plaid) {
    const id = uid("pl");
    p.push(`<pattern id="${id}" width="44" height="44" patternUnits="userSpaceOnUse"><rect width="44" height="44" fill="${shirt}"/><rect width="14" height="44" fill="${plaid}" opacity="0.55"/><rect width="44" height="14" fill="${plaid}" opacity="0.55"/><rect x="28" width="3" height="44" fill="#fff" opacity="0.25"/></pattern>`);
    p.push(`<path d="${body}" fill="url(#${id})"/>`);
  }
  if (shirt2) p.push(`<path d="M-60 4 L60 4 C 50 50, -50 50, -60 4Z" fill="${shirt2}"/>`);
  if (stripe) p.push(`<path d="M-166 110 L166 110 L168 126 L-168 126Z" fill="${stripe}"/><path d="M-166 110 L166 110" stroke="#fff" stroke-opacity="0.5" stroke-width="2"/>`);
  if (overalls) {
    p.push(`<path d="M-80 60 L80 60 L90 150 L-90 150Z" fill="${overalls}"/>`);
    p.push(`<path d="M-80 60 L-100 10 M80 60 L100 10" stroke="${overalls}" stroke-width="24" stroke-linecap="round"/>`);
    p.push(`<circle cx="-66" cy="72" r="7" fill="#E8C14A"/><circle cx="66" cy="72" r="7" fill="#E8C14A"/><rect x="-36" y="92" width="72" height="40" rx="6" fill="#000" opacity="0.12"/>`);
  }
  if (apron) {
    p.push(`<path d="M-72 40 L72 40 L92 150 L-92 150Z" fill="${apron}"/><path d="M-72 40 L-44 -2 M72 40 L44 -2" stroke="${apron}" stroke-width="10"/><rect x="-40" y="90" width="80" height="36" rx="6" fill="#000" opacity="0.08"/>`);
  }
  if (splatter) {
    const r = rng(9);
    for (let i = 0; i < 14; i++) p.push(`<circle cx="${(-140 + r() * 280).toFixed(1)}" cy="${(40 + r() * 100).toFixed(1)}" r="${(3 + r() * 8).toFixed(1)}" fill="${["#F2B705", "#3E7CB1", "#E0664F"][i % 3]}" opacity="0.85"/>`);
  }
  if (patch) p.push(`<circle cx="-92" cy="70" r="20" fill="${patch}"/><circle cx="-92" cy="70" r="12" fill="none" stroke="#fff" stroke-width="3"/>`);
  if (collar) p.push(`<path d="M-44 4 L0 58 L-18 8Z M44 4 L0 58 L18 8Z" fill="#fff" opacity="0.28"/>`);
  // cuello y cabeza
  p.push(`<path d="M-26 -60 L-26 10 Q 0 30 26 10 L26 -60Z" fill="${skin}"/><path d="M-26 -30 Q 0 -10 26 -30 L26 -50 L-26 -50Z" fill="${shade}" opacity="0.1"/>`);
  p.push(`<ellipse cx="-62" cy="-118" rx="11" ry="17" fill="${skin}"/><ellipse cx="62" cy="-118" rx="11" ry="17" fill="${skin}"/>`);
  if (earring) p.push(`<circle cx="-64" cy="-96" r="5" fill="#E8C14A"/>`);
  p.push(`<ellipse cx="0" cy="-124" rx="62" ry="74" fill="${skin}"/>`);
  if (pencil) p.push(`<g transform="translate(62 -150) rotate(-60)"><rect x="-6" y="-44" width="12" height="80" fill="#F2B705"/><path d="M-6 36 L0 52 L6 36Z" fill="#E8C9A0"/><rect x="-6" y="-44" width="12" height="10" fill="#E07A8A"/></g>`);
  // rasgos
  p.push(`<ellipse cx="-22" cy="-124" rx="5.5" ry="7" fill="#2A1E18"/><ellipse cx="22" cy="-124" rx="5.5" ry="7" fill="#2A1E18"/>`);
  p.push(`<path d="M-34 -142 q 12 -8 22 -2 M12 -144 q 12 -6 22 2" stroke="${hair}" stroke-width="5" stroke-linecap="round" fill="none"/>`);
  p.push(`<path d="M-2 -112 q 8 14 -4 20" stroke="${shade}" stroke-opacity="0.25" stroke-width="4" fill="none" stroke-linecap="round"/>`);
  p.push(`<circle cx="-36" cy="-98" r="11" fill="#E36A5A" opacity="0.28"/><circle cx="36" cy="-98" r="11" fill="#E36A5A" opacity="0.28"/>`);
  if (beard) p.push(`<path d="M-60 -118 C -62 -60, -30 -44, 0 -44 C 30 -44, 62 -60, 60 -118 C 52 -92, 32 -82, 0 -82 C -32 -82, -52 -92, -60 -118Z" fill="${hair}"/>`);
  p.push(`<path d="M-18 -86 q 18 14 36 0" stroke="${beard ? "#F3D9C8" : "#8A3A2A"}" stroke-width="5" fill="none" stroke-linecap="round"/>`);
  if (glasses) p.push(`<g fill="none" stroke="#2A1E18" stroke-width="4"><circle cx="-24" cy="-122" r="17"/><circle cx="24" cy="-122" r="17"/><path d="M-7 -124 q 7 -6 14 0 M-41 -124 L-60 -128 M41 -124 L60 -128"/></g>`);
  // pelo arriba
  if (style === "short" || style === "long" || style === "bun") {
    p.push(`<path d="M-66 -118 C -74 -196, 40 -222, 66 -150 C 68 -138, 66 -126, 64 -116 C 56 -150, 30 -168, -6 -170 C -30 -166, -50 -150, -60 -120 Z" fill="${hair}"/>`);
  }
  if (style === "curly") {
    const pts = [[-58, -140], [-50, -170], [-30, -190], [-4, -198], [22, -194], [44, -180], [58, -156], [62, -130], [-64, -116]];
    p.push(pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="26" fill="${hair}"/>`).join(""));
  }
  if (style === "buzz") p.push(`<path d="M-62 -130 C -60 -200, 60 -200, 62 -130 C 50 -168, -50 -168, -62 -130Z" fill="${hair}"/>`);
  if (hat) {
    p.push(`<ellipse cx="0" cy="-168" rx="118" ry="24" fill="${hat}"/><path d="M-62 -170 C -60 -240, 60 -240, 62 -170Z" fill="${hat}"/><path d="M-62 -178 C -20 -168, 20 -168, 62 -178 L62 -170 C 20 -160, -20 -160, -62 -170Z" fill="#8A3A2A"/><ellipse cx="0" cy="-168" rx="118" ry="24" fill="none" stroke="#000" stroke-opacity="0.1" stroke-width="3"/>`);
  }
  if (cap) p.push(`<path d="M-66 -150 C -64 -226, 64 -226, 66 -150Z" fill="${cap}"/><path d="M20 -156 Q 90 -164 120 -146 Q 80 -138 20 -146Z" fill="${cap}"/><path d="M20 -156 Q 90 -164 120 -146" stroke="#000" stroke-opacity="0.18" stroke-width="4" fill="none"/><circle cx="0" cy="-212" r="6" fill="#000" opacity="0.15"/>`);
  if (helmet) p.push(`<path d="M-76 -150 C -74 -236, 74 -236, 76 -150Z" fill="${helmet}"/><rect x="-86" y="-156" width="172" height="16" rx="8" fill="${helmet}"/><path d="M0 -226 L0 -156" stroke="#000" stroke-opacity="0.12" stroke-width="10"/><path d="M-50 -200 q 20 -20 40 -22" stroke="#fff" stroke-opacity="0.45" stroke-width="7" fill="none" stroke-linecap="round"/>`);
  return p.join("");
}

// ----- Escenas de productores (retrato con su lugar) -----
function hills(w, h, cols) {
  return `<path d="M0 ${h * 0.55} C ${w * 0.2} ${h * 0.4}, ${w * 0.35} ${h * 0.5}, ${w * 0.5} ${h * 0.44} C ${w * 0.7} ${h * 0.36}, ${w * 0.85} ${h * 0.48}, ${w} ${h * 0.42} L${w} ${h} L0 ${h}Z" fill="${cols[0]}"/>
  <path d="M0 ${h * 0.66} C ${w * 0.25} ${h * 0.58}, ${w * 0.5} ${h * 0.7}, ${w * 0.75} ${h * 0.6} C ${w * 0.85} ${h * 0.56}, ${w * 0.95} ${h * 0.6}, ${w} ${h * 0.58} L${w} ${h} L0 ${h}Z" fill="${cols[1]}"/>
  <path d="M0 ${h * 0.8} C ${w * 0.3} ${h * 0.74}, ${w * 0.6} ${h * 0.82}, ${w} ${h * 0.76} L${w} ${h} L0 ${h}Z" fill="${cols[2]}"/>`;
}

function goat(x, y, s = 1, col = "#F4EFE4") {
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-60" y="-10" width="12" height="60" rx="6" fill="#6B5A48"/><rect x="40" y="-10" width="12" height="60" rx="6" fill="#6B5A48"/><rect x="-40" y="-10" width="12" height="60" rx="6" fill="#8A7660"/><rect x="24" y="-10" width="12" height="60" rx="6" fill="#8A7660"/>
  <ellipse cx="0" cy="-20" rx="80" ry="44" fill="${col}"/><path d="M60 -40 L90 -90 L118 -80 L100 -30Z" fill="${col}"/><ellipse cx="112" cy="-78" rx="26" ry="18" fill="${col}"/>
  <path d="M100 -94 q -10 -30 -34 -40 M110 -96 q 0 -30 -18 -44" stroke="#8A7660" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M120 -62 q 2 22 -8 30" stroke="#B8AA95" stroke-width="8" stroke-linecap="round"/><circle cx="118" cy="-82" r="4" fill="#2A1E18"/><path d="M94 -80 l -26 10" stroke="${col}" stroke-width="12" stroke-linecap="round"/><path d="M-78 -30 q -20 -14 -14 -30" stroke="${col}" stroke-width="10" stroke-linecap="round" fill="none"/></g>`;
}

function beehive(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-70" y="-40" width="140" height="80" fill="#F2D27A"/><rect x="-70" y="-120" width="140" height="80" fill="#F7F1E1"/><rect x="-70" y="-120" width="140" height="80" fill="#000" opacity="0.04"/><rect x="-80" y="-140" width="160" height="24" rx="4" fill="#C9853A"/><rect x="-70" y="40" width="140" height="10" fill="#8A6B3A"/><rect x="-60" y="50" width="10" height="40" fill="#8A6B3A"/><rect x="50" y="50" width="10" height="40" fill="#8A6B3A"/><rect x="-30" y="30" width="60" height="6" rx="3" fill="#5A4020"/></g>`;
}

function bee(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="-4" cy="-10" rx="10" ry="7" fill="#fff" opacity="0.85"/><ellipse cx="6" cy="-10" rx="10" ry="7" fill="#fff" opacity="0.85"/><ellipse rx="14" ry="10" fill="#E3A21A"/><path d="M-4 -9 v18 M4 -9 v18" stroke="#2B2112" stroke-width="4"/></g>`;
}

function flower(x, y, c = "#F2B705", s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 v60" stroke="#4E7A3A" stroke-width="4"/>${[0, 1, 2, 3, 4, 5].map((i) => `<ellipse cx="0" cy="-12" rx="7" ry="13" fill="${c}" transform="rotate(${i * 60})"/>`).join("")}<circle r="7" fill="#7A4A1A"/></g>`;
}

function escenaProductor(w, h, sky, bg, persons) {
  const skyG = lin([[0, sky[0]], [1, sky[1]]]);
  return `${svgOpen(w, h)}${skyG.def}<rect width="${w}" height="${h}" fill="${skyG.url}"/>${bg}${persons}${grain(w, h, 0.1)}</svg>`;
}

const W = 960;
const H = 720;
const escenas = {
  "productor-cabras-del-cerro": escenaProductor(
    W,
    H,
    ["#F7E6C4", "#F2D3A2"],
    `<circle cx="760" cy="170" r="70" fill="#F7C873"/>${hills(W, H, ["#B9A88A", "#8FA36B", "#6F8A55"])}${goat(720, 560, 1.1)}${goat(860, 610, 0.8, "#D8C4A6")}`,
    `<g transform="translate(250 560) scale(1.18)">${person({ skin: "#D39B75", hair: "#8C8C8C", style: "long", shirt: "#3D6B8C", glasses: true, earring: true })}</g><g transform="translate(470 590) scale(1.1)">${person({ skin: "#C98B62", hair: "#3B2718", style: "buzz", shirt: "#8A4B2A", beard: true, hat: "#E6C27A" })}</g>`,
  ),
  "productor-apiario-la-quebrada": escenaProductor(
    W,
    H,
    ["#FBEBC0", "#F6D48A"],
    `${hills(W, H, ["#C8B36A", "#9DB068", "#7E9A52"])}${beehive(700, 520, 1.1)}${beehive(860, 560, 0.9)}${flower(600, 610, "#F2B705")}${flower(640, 640, "#E86A4A", 0.8)}${flower(900, 650, "#F7F1E1", 0.9)}${bee(620, 300)}${bee(760, 250, 0.8)}${bee(820, 340, 1.1)}${bee(540, 360, 0.7)}`,
    `<g transform="translate(330 580) scale(1.25)">${person({ skin: "#E2A77F", hair: "#6B3F1E", style: "short", shirt: "#F1E6CF", shirt2: "#E4D6B8", hat: "#EFE3C4", beard: true })}</g>`,
  ),
  "productor-huerta-los-molles": escenaProductor(
    W,
    H,
    ["#E9F0D6", "#D4E4B6"],
    `${hills(W, H, ["#A9C28A", "#8BAE63", "#6E9447"])}<g opacity="0.9"><path d="M560 560 C 560 330, 940 330, 940 560Z" fill="#fff" opacity="0.45"/><path d="M560 560 C 560 330, 940 330, 940 560" stroke="#fff" stroke-width="6" fill="none"/>${[620, 690, 750, 810, 880].map((x) => `<path d="M${x} 560 C ${x} 440, ${x} 400, ${x} 395" stroke="#fff" stroke-width="3" opacity="0.7"/>`).join("")}</g>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<circle cx="${560 + i * 60}" cy="${620 + (i % 2) * 10}" r="${22 + (i % 3) * 6}" fill="${i % 2 ? "#4E8A36" : "#6BA348"}"/>`).join("")}`,
    `<g transform="translate(300 580) scale(1.25)">${person({ skin: "#8D5A3B", hair: "#1E1510", style: "curly", shirt: "#E1703A", apron: "#2F5D3A", earring: true })}</g>`,
  ),
  "productor-dulces-dona-emma": escenaProductor(
    W,
    H,
    ["#F8E4D6", "#F3D0BC"],
    `<rect x="520" y="90" width="340" height="280" rx="12" fill="#CFE4EE"/><path d="M520 300 L620 200 L700 260 L780 180 L860 280 L860 370 L520 370Z" fill="#8FAE8B"/><path d="M690 90 v280 M520 230 h340" stroke="#F7F1E8" stroke-width="14"/><rect x="510" y="80" width="360" height="300" rx="14" fill="none" stroke="#F7F1E8" stroke-width="18"/>
    <rect x="0" y="470" width="${W}" height="24" fill="#B98552"/><rect x="0" y="494" width="${W}" height="${H - 494}" fill="#E8C9A8"/>
    <g transform="translate(470 252) scale(0.34)">${jar({ c1: "#B3243B", c2: "#6E1026", cloth: "#B3243B", deco: decoFrutos })}</g>
    <g transform="translate(580 252) scale(0.34)">${jar({ c1: "#B56A2A", c2: "#7A3E12", cloth: "#2F6B3F", deco: decoCabra })}</g>
    <g transform="translate(690 252) scale(0.34)">${jar({ c1: "#8E4A6F", c2: "#4E1F3A", cloth: "#3D5A9E", deco: decoHigo })}</g>`,
    `<g transform="translate(300 600) scale(1.25)">${person({ skin: "#E8B391", hair: "#E9E4DC", style: "bun", shirt: "#9C3D54", apron: "#F7F1E8", glasses: true })}</g>`,
  ),
  "productor-horno-de-barro": escenaProductor(
    W,
    H,
    ["#F4E2C8", "#EBC79B"],
    `${hills(W, H, ["#C7A77A", "#A99466", "#8C7A52"])}<g transform="translate(730 560)"><path d="M-190 40 C -190 -200, 190 -200, 190 40Z" fill="#B7704A"/><path d="M-190 40 C -190 -200, 190 -200, 190 40Z" fill="#000" opacity="0.06"/><path d="M-70 40 C -70 -60, 70 -60, 70 40Z" fill="#3A1E12"/><path d="M-50 40 C -50 -30, 50 -30, 50 40Z" fill="#F08A2E" opacity="0.85"/><path d="M-30 40 q 10 -40 30 -30 q 20 -30 30 30Z" fill="#F7C04A"/><rect x="-210" y="40" width="420" height="60" fill="#8C6A48"/><path d="M-120 -120 q 30 -40 80 -50" stroke="#D08A5C" stroke-width="8" fill="none" stroke-linecap="round"/></g><path d="M760 360 q -30 -60 10 -110 q 40 -50 0 -110" stroke="#fff" stroke-opacity="0.55" stroke-width="18" fill="none" stroke-linecap="round"/>`,
    `<g transform="translate(250 600) scale(1.12)">${person({ skin: "#E2A77F", hair: "#2A1A12", style: "short", shirt: "#556B7A", apron: "#EFE3C4", beard: true })}</g><g transform="translate(460 610) scale(1.08)">${person({ skin: "#EDC0A0", hair: "#B5652E", style: "long", shirt: "#E3A93A", apron: "#EFE3C4" })}</g>`,
  ),
  "productor-finca-los-algarrobos": escenaProductor(
    W,
    H,
    ["#F5DDC8", "#E9BFA2"],
    `${hills(W, H, ["#B89A8E", "#9A8E6A", "#7F8C55"])}${[0, 1, 2, 3, 4].map((i) => {
      const y = 430 + i * 60;
      return `<path d="M${480 - i * 30} ${y} L${W} ${y - 30 + i * 6}" stroke="#5E6E3A" stroke-width="${6 + i * 2}"/>${[0, 1, 2, 3, 4, 5].map((k) => `<circle cx="${520 + k * 80 - i * 20}" cy="${y - 4 - k * 4}" r="${10 + i * 2}" fill="#5B1F35"/><circle cx="${540 + k * 80 - i * 20}" cy="${y - 14 - k * 4}" r="${14 + i * 2}" fill="#6E9447"/>`).join("")}`;
    }).join("")}`,
    `<g transform="translate(300 600) scale(1.25)">${person({ skin: "#E6B08C", hair: "#5A3A22", style: "short", shirt: "#6B2437", plaid: "#2A0E18", glasses: false })}</g>`,
  ),
};

function heroMercado() {
  const w = 1600;
  const h = 1100;
  const stripes = [];
  for (let i = 0; i < 17; i++) {
    stripes.push(`<path d="M${i * 100} 0 L${i * 100 + 100} 0 L${i * 100 + 100} 150 Q ${i * 100 + 50} 200 ${i * 100} 150Z" fill="${i % 2 ? "#FFF6E3" : "#2F6B3F"}"/>`);
  }
  const place = (body, x, y, s) => `<g transform="translate(${x} ${y}) scale(${s}) translate(-400 -640)">${body}</g>`;
  const planks = [0, 1, 2, 3, 4]
    .map((i) => {
      const y0 = 700 + i * 58;
      const y1 = y0 + 58;
      const inset = (y) => 40 - ((y - 700) / 290) * 40;
      return `<path d="M${inset(y0)} ${y0} L${w - inset(y0)} ${y0} L${w - inset(y1)} ${y1} L${inset(y1)} ${y1}Z" fill="${i % 2 ? "#C48A4A" : "#BA8040"}"/>`;
    })
    .join("");
  return `${svgOpen(w, h)}<rect width="${w}" height="${h}" fill="#F3E7CF"/>
  <rect x="80" y="120" width="26" height="620" fill="#7A5230"/><rect x="${w - 106}" y="120" width="26" height="620" fill="#7A5230"/>
  ${stripes.join("")}<rect x="0" y="0" width="${w}" height="30" fill="#1F4D2B"/>
  <g transform="translate(640 230)"><path d="M0 0 L-60 60 M320 0 L380 60" stroke="#7A5230" stroke-width="5"/><rect x="-100" y="56" width="520" height="150" rx="18" fill="#1F4D2B"/><rect x="-86" y="70" width="492" height="122" rx="12" fill="none" stroke="#F2B705" stroke-width="3" stroke-dasharray="10 8"/>
  <g transform="translate(-30 131)"><path d="M0 22 C 0 -6, 14 -22, 34 -26 C 34 -4, 22 14, 0 22Z" fill="#8CC766"/><path d="M0 22 C -2 0, -14 -14, -30 -16 C -30 4, -18 18, 0 22Z" fill="#F2B705"/></g>
  <rect x="30" y="104" width="340" height="22" rx="11" fill="#FFF6E3"/><rect x="30" y="140" width="220" height="14" rx="7" fill="#F2B705"/></g>
  ${planks}
  <rect x="0" y="990" width="${w}" height="${h - 990}" fill="#8C5A28"/><rect x="0" y="990" width="${w}" height="12" fill="#fff" opacity="0.15"/>
  ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<rect x="${i * 200 + 96}" y="1010" width="8" height="90" fill="#000" opacity="0.08"/>`).join("")}
  ${place(crate(), 330, 780, 0.66)}${place(basket(), 760, 770, 0.62)}${place(loaf(), 1150, 790, 0.56)}
  ${place(jar({ c1: "#F0A21E", c2: "#B8620A", lid: "#D9A441", deco: decoAbeja }), 1340, 790, 0.4)}
  ${place(jar({ c1: "#B3243B", c2: "#6E1026", cloth: "#B3243B", deco: decoFrutos }), 1460, 796, 0.38)}
  ${place(eggs(), 230, 980, 0.46)}${place(cheeseWheel(), 560, 985, 0.5)}
  ${place(bottle({ glass: "#2A1018", glass2: "#5A1E2E", cap: "#6E1E2B", deco: decoUva }), 1000, 985, 0.52)}${place(bottle({ glass: "#E27A96", glass2: "#F4B3C3", cap: "#C2185B", label: "#FFF7EE", deco: decoFrambua }), 1100, 988, 0.5)}
  ${place(alfajores(), 1370, 985, 0.46)}
  ${grain(w, h, 0.1)}</svg>`;
}

async function productores() {
  for (const [name, [bg, tone, body]] of Object.entries(productosProd)) {
    await write("productores", `producto-${name}`, productoBg(bg, tone, body));
  }
  for (const [name, svg] of Object.entries(escenas)) await write("productores", name, svg);
  await write("productores", "hero-puesto", heroMercado(), 80);
}


// =====================================================================
// OFICIOS — ManoAmiga: vector limpio, azules y amarillo de seguridad
// =====================================================================

function retratoOficio(fondo, circulo, props) {
  const w = 600;
  return `${svgOpen(w, w)}<rect width="${w}" height="${w}" fill="${fondo}"/>
  <circle cx="300" cy="330" r="236" fill="${circulo}"/>
  <path d="M40 120 l 30 0 M55 105 l 0 30" stroke="#fff" stroke-opacity="0.6" stroke-width="6" stroke-linecap="round"/>
  <circle cx="530" cy="110" r="10" fill="none" stroke="#fff" stroke-opacity="0.6" stroke-width="5"/>
  <g transform="translate(300 386) scale(1.42)">${person(props)}</g></svg>`;
}

const profesionales = {
  "pro-martin-oviedo": ["#DCE6F4", "#B9CDEA", { skin: "#D9A07A", hair: "#2A1A12", style: "short", shirt: "#DCE8F5", overalls: "#1C3F7A", cap: "#1C3F7A", beard: true, collar: false }],
  "pro-carla-benitez": ["#FFF1C7", "#FFE08A", { skin: "#EDC0A0", hair: "#4A2A18", style: "bun", shirt: "#F4F4F4", overalls: "#2156A8", earring: true, collar: false }],
  "pro-diego-ferreyra": ["#DCE6F4", "#C2D3EC", { skin: "#C98B62", hair: "#1E1510", style: "short", shirt: "#56657A", helmet: "#FFC928", patch: "#FFC928" }],
  "pro-lucia-rinaldi": ["#E6EEF8", "#CBDAF0", { skin: "#F0C9A8", hair: "#8A4B2A", style: "long", shirt: "#2E5E9E", helmet: "#F4F6FA", patch: "#FFC928" }],
  "pro-raul-quinteros": ["#FFF1C7", "#FFDF7E", { skin: "#E2A77F", hair: "#9A9A9A", style: "buzz", shirt: "#173A6E", stripe: "#FFC928", glasses: true }],
  "pro-sofia-carranza": ["#E3ECF7", "#C6D6EE", { skin: "#E8B391", hair: "#5A3A22", style: "long", shirt: "#F4F1EA", overalls: "#EDE8DC", cap: "#F4F1EA", splatter: true, collar: false }],
  "pro-nahuel-pereyra": ["#FFF3CF", "#FFE39A", { skin: "#8D5A3B", hair: "#1E1510", style: "curly", shirt: "#F4F1EA", splatter: true }],
  "pro-gustavo-ledesma": ["#E3ECF7", "#C9D8EE", { skin: "#D8A27E", hair: "#6B4A2E", style: "short", shirt: "#9E2B25", plaid: "#3A1512", pencil: true, beard: true }],
  "pro-paula-gimenez": ["#DDF1F1", "#B8E2E2", { skin: "#C98B62", hair: "#2A1A12", style: "bun", shirt: "#0E7C86", patch: "#FFC928", collar: true }],
  "pro-ezequiel-moyano": ["#E3ECF7", "#C4D4EC", { skin: "#EDC0A0", hair: "#3B2718", style: "buzz", shirt: "#2B4C7E", patch: "#5FD3D9", glasses: true }],
};

function tiles(w, h, color = "#EEF3F9", line = "#D6E0EC", size = 80) {
  const out = [`<rect width="${w}" height="${h}" fill="${color}"/>`];
  for (let x = size; x < w; x += size) out.push(`<path d="M${x} 0 V${h}" stroke="${line}" stroke-width="4"/>`);
  for (let y = size; y < h; y += size) out.push(`<path d="M0 ${y} H${w}" stroke="${line}" stroke-width="4"/>`);
  return out.join("");
}

const escenaOficio = {
  "trabajo-canilla": `${tiles(800, 600)}<rect x="0" y="470" width="800" height="130" fill="#DDE5EF"/>
    <rect x="180" y="380" width="440" height="110" rx="20" fill="#FFFFFF"/><path d="M200 400 H600 Q 590 470 520 476 H280 Q 210 470 200 400Z" fill="#E7EEF6"/>
    <rect x="160" y="370" width="480" height="26" rx="13" fill="#F7FAFD" stroke="#C8D4E3" stroke-width="3"/>
    <rect x="370" y="250" width="60" height="120" rx="10" fill="#B8C4D2"/><path d="M370 270 H300 Q 270 270 270 300 V330" stroke="#B8C4D2" stroke-width="40" fill="none" stroke-linecap="round"/>
    <rect x="378" y="256" width="14" height="100" rx="7" fill="#fff" opacity="0.6"/>
    <rect x="340" y="226" width="120" height="30" rx="15" fill="#0F3D8A"/><circle cx="470" cy="241" r="18" fill="#0F3D8A"/>
    <path d="M270 352 q -12 20 0 30 q 12 -10 0 -30Z" fill="#5AA9E6"/><path d="M270 400 q -10 16 0 24 q 10 -8 0 -24Z" fill="#5AA9E6" opacity="0.7"/>
    <ellipse cx="300" cy="440" rx="50" ry="10" fill="#5AA9E6" opacity="0.45"/>
    <g transform="translate(600 520) rotate(-20)"><rect x="-120" y="-12" width="200" height="24" rx="12" fill="#FFC928"/><path d="M80 -34 a 36 36 0 1 1 0 68 l 0 -20 a 16 16 0 1 0 0 -28Z" fill="#8795A8"/></g>`,
  "trabajo-tablero": `${tiles(800, 600, "#F1F4F8", "#E0E6EE", 100)}
    <rect x="200" y="70" width="400" height="460" rx="18" fill="#D5DDE7"/><rect x="224" y="94" width="352" height="412" rx="10" fill="#1B2A44"/>
    ${[0, 1, 2].map((r) => `<rect x="244" y="${130 + r * 120}" width="312" height="80" rx="8" fill="#26375A"/>${[0, 1, 2, 3, 4, 5].map((c) => `<rect x="${256 + c * 50}" y="${140 + r * 120}" width="38" height="60" rx="6" fill="#F4F6FA"/><rect x="${266 + c * 50}" y="${152 + r * 120 + ((c + r) % 3 === 0 ? 24 : 0)}" width="18" height="16" rx="3" fill="${(c + r) % 4 === 0 ? "#FFC928" : "#0F3D8A"}"/>`).join("")}`).join("")}
    <path d="M300 506 C 300 560, 240 570, 180 600 M360 506 C 360 570, 380 580, 400 600 M430 506 C 440 560, 520 560, 560 600" stroke-width="12" fill="none" stroke-linecap="round" stroke="#D8412F"/><path d="M330 506 C 330 560, 300 580, 290 600" stroke="#1E8E5A" stroke-width="12" fill="none"/><path d="M470 506 C 480 560, 620 570, 660 600" stroke="#2156A8" stroke-width="12" fill="none"/>
    <g transform="translate(660 250) rotate(25)"><rect x="-16" y="-120" width="32" height="130" rx="14" fill="#FFC928"/><rect x="-6" y="10" width="12" height="90" fill="#8795A8"/><circle cx="0" cy="-80" r="8" fill="#D8412F"/></g>`,
  "trabajo-calefon": `${tiles(800, 600, "#F4F1EA", "#E4DFD4", 90)}
    <rect x="270" y="60" width="260" height="380" rx="24" fill="#FFFFFF" stroke="#D5DDE7" stroke-width="6"/>
    <rect x="310" y="110" width="180" height="16" rx="8" fill="#E3E9F1"/><rect x="345" y="260" width="110" height="80" rx="14" fill="#1B2A44"/>
    <path d="M400 330 q -30 -30 -6 -60 q 4 20 14 20 q 4 -16 -4 -30 q 34 20 26 52 q -6 18 -30 18Z" fill="#5AA9E6"/><path d="M400 330 q -14 -14 -2 -30 q 10 14 12 30Z" fill="#FFC928"/>
    <circle cx="350" cy="390" r="14" fill="#D5DDE7"/><circle cx="450" cy="390" r="14" fill="#D5DDE7"/>
    <path d="M340 440 V520 H200 M400 440 V600 M460 440 V520 H620" stroke="#FFC928" stroke-width="22" fill="none"/>
    <rect x="378" y="500" width="44" height="44" rx="8" fill="#0F3D8A"/><rect x="330" y="514" width="140" height="16" rx="8" fill="#D8412F"/>`,
  "trabajo-humedad": `<rect width="800" height="600" fill="#EDE8DD"/><rect y="520" width="800" height="80" fill="#C9B79A"/><rect y="506" width="800" height="18" fill="#FFFFFF"/>
    <path d="M60 510 C 40 420, 90 380, 70 300 C 60 240, 130 220, 150 280 C 170 330, 220 300, 240 360 C 260 420, 230 470, 260 510Z" fill="#B8A988" opacity="0.55"/>
    <path d="M90 510 C 80 450, 110 420, 100 360 C 110 320, 150 330, 160 380 C 175 420, 200 440, 200 510Z" fill="#9C8B68" opacity="0.5"/>
    <path d="M150 240 l 30 -20 l 10 34 l -24 12Z" fill="#fff" stroke="#C9B79A" stroke-width="3"/><path d="M230 330 l 40 -10 l -6 30 l -26 4Z" fill="#fff" stroke="#C9B79A" stroke-width="3"/>
    <rect x="360" y="0" width="440" height="506" fill="#DCE8F5"/><path d="M360 0 V506" stroke="#fff" stroke-width="6"/>
    <g transform="translate(560 380) rotate(-15)"><rect x="-110" y="-40" width="220" height="80" rx="40" fill="#2156A8"/><rect x="-110" y="-40" width="220" height="24" rx="12" fill="#fff" opacity="0.25"/><path d="M110 0 H150 V120 H10 V230" stroke="#8795A8" stroke-width="14" fill="none" stroke-linejoin="round"/><rect x="-4" y="220" width="28" height="120" rx="12" fill="#FFC928"/></g>
    <path d="M300 590 L340 520 L500 520 L470 590Z" fill="#8795A8"/><path d="M345 540 H480 L470 570 H335Z" fill="#2156A8"/>`,
  "trabajo-placard": `<rect width="800" height="600" fill="#F2EEE6"/><rect y="530" width="800" height="70" fill="#C49A6C"/>
    <rect x="160" y="60" width="480" height="470" rx="8" fill="#B8864E"/><rect x="176" y="76" width="220" height="440" rx="6" fill="#D6A56A"/>
    <g transform="rotate(8 404 76)"><rect x="404" y="76" width="220" height="440" rx="6" fill="#D6A56A"/><rect x="424" y="100" width="180" height="180" rx="6" fill="none" stroke="#B8864E" stroke-width="6"/><rect x="424" y="300" width="180" height="190" rx="6" fill="none" stroke="#B8864E" stroke-width="6"/><rect x="420" y="280" width="10" height="44" rx="5" fill="#1B2A44"/></g>
    <rect x="196" y="100" width="180" height="180" rx="6" fill="none" stroke="#B8864E" stroke-width="6"/><rect x="196" y="300" width="180" height="190" rx="6" fill="none" stroke="#B8864E" stroke-width="6"/><rect x="370" y="280" width="10" height="44" rx="5" fill="#1B2A44"/>
    <circle cx="640" cy="150" r="16" fill="none" stroke="#D8412F" stroke-width="5"/><circle cx="640" cy="150" r="30" fill="none" stroke="#D8412F" stroke-width="3" stroke-dasharray="8 8"/>
    <g transform="translate(120 470)"><rect x="-10" y="-40" width="120" height="70" rx="16" fill="#FFC928"/><rect x="100" y="-14" width="70" height="18" rx="4" fill="#8795A8"/><rect x="10" y="20" width="44" height="90" rx="12" fill="#1B2A44"/></g>`,
  "trabajo-split": `<rect width="800" height="600" fill="#EAF1F8"/><rect y="500" width="800" height="100" fill="#D4DEEA"/>
    <rect x="160" y="90" width="480" height="150" rx="30" fill="#FFFFFF" stroke="#D1DBE7" stroke-width="5"/><rect x="190" y="200" width="420" height="16" rx="8" fill="#DCE4EE"/><circle cx="580" cy="130" r="7" fill="#1E8E5A"/>
    <path d="M220 260 q 20 40 0 80 M300 260 q 20 40 0 80 M380 260 q 20 40 0 80 M460 260 q 20 40 0 80 M540 260 q 20 40 0 80" stroke="#5AA9E6" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.8"/>
    <g transform="translate(400 420)"><path d="M0 -40 V40 M-35 -20 L35 20 M-35 20 L35 -20" stroke="#5AA9E6" stroke-width="8" stroke-linecap="round"/></g>
    <g transform="translate(640 420) rotate(12)"><rect x="-34" y="-80" width="68" height="160" rx="18" fill="#1B2A44"/><rect x="-22" y="-62" width="44" height="30" rx="6" fill="#5FD3D9"/><circle cx="-12" cy="0" r="8" fill="#FFC928"/><circle cx="12" cy="0" r="8" fill="#F4F6FA"/><circle cx="0" cy="30" r="8" fill="#F4F6FA"/></g>`,
};

async function oficios() {
  for (const [name, [bg, circ, props]] of Object.entries(profesionales)) await write("oficios", name, retratoOficio(bg, circ, props), 86);
  for (const [name, body] of Object.entries(escenaOficio)) await write("oficios", name, `${svgOpen(800, 600)}${body}</svg>`, 84);
}

// =====================================================================
// USADOS — Segunda Vuelta: trazo negro grueso y colores saturados
// =====================================================================

const K = "#141414";
const ST = `stroke="${K}" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"`;
const tube = (d, color, w = 20) =>
  `<path d="${d}" stroke="${K}" stroke-width="${w + 12}" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="${d}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;

function wheel(cx, cy, r, knobby = false) {
  const spokes = [];
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8;
    spokes.push(`<path d="M${cx} ${cy} L${(cx + (r - 26) * Math.cos(a)).toFixed(1)} ${(cy + (r - 26) * Math.sin(a)).toFixed(1)}" stroke="#555" stroke-width="3"/>`);
  }
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${K}" stroke-width="${knobby ? 30 : 22}"/>${knobby ? `<circle cx="${cx}" cy="${cy}" r="${r + 14}" fill="none" stroke="${K}" stroke-width="8" stroke-dasharray="8 12"/>` : ""}<circle cx="${cx}" cy="${cy}" r="${r - 22}" fill="none" stroke="#BDBDBD" stroke-width="8"/>${spokes.join("")}<circle cx="${cx}" cy="${cy}" r="16" fill="${K}"/>`;
}

function bici(color, mtb = false) {
  const R = [250, 630];
  const F = [750, 630];
  const B = [470, 640];
  const S = mtb ? [440, 400] : [430, 360];
  const Ht = mtb ? [690, 380] : [690, 360];
  const Hb = mtb ? [712, 460] : [708, 440];
  const frame = mtb ? `M${R} L${B} L${S} L${R} M${S} L${Ht} M${B} L${Hb}` : `M${R} L${B} L${S} L${R} M${B} Q 560 480 ${Hb} M${S} L${Ht}`;
  const fender = (d) => `<path d="${d}" stroke="${K}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#E9E4D8" stroke-width="10" fill="none" stroke-linecap="round"/>`;
  return `${wheel(...R, 170, mtb)}${wheel(...F, 170, mtb)}
  ${!mtb ? fender(`M${R[0] - 175} ${R[1] + 10} A 188 188 0 0 1 ${R[0] + 120} ${R[1] - 150}`) + fender(`M${F[0] + 175} ${F[1] + 10} A 188 188 0 0 0 ${F[0] - 110} ${F[1] - 160}`) : ""}
  ${tube(frame, color, mtb ? 26 : 20)}
  ${tube(`M${Hb} L${F}`, mtb ? "#2B2B2B" : color, mtb ? 22 : 16)}
  ${mtb ? `<rect x="${Hb[0] - 4}" y="${Hb[1] + 20}" width="34" height="80" rx="10" fill="#FFE14D" ${ST} transform="rotate(-14 ${Hb[0]} ${Hb[1]})"/>` : ""}
  ${tube(`M${Ht} L${Ht[0] - 10} ${Ht[1] - 50} ${mtb ? `L${Ht[0] - 110} ${Ht[1] - 50}` : `Q ${Ht[0] - 60} ${Ht[1] - 90} ${Ht[0] - 120} ${Ht[1] - 60}`}`, "#3A3A3A", 12)}
  <rect x="${Ht[0] - 150}" y="${Ht[1] - (mtb ? 64 : 76)}" width="60" height="28" rx="14" fill="#8A5A35" ${ST}/>
  ${tube(`M${S} L${S[0] - 12} ${S[1] - 50}`, "#9A9A9A", 12)}
  <path d="M${S[0] - 90} ${S[1] - 66} Q ${S[0] - 20} ${S[1] - 90} ${S[0] + 50} ${S[1] - 70} Q ${S[0] + 30} ${S[1] - 40} ${S[0] - 20} ${S[1] - 46} Q ${S[0] - 70} ${S[1] - 44} ${S[0] - 90} ${S[1] - 66}Z" fill="${mtb ? "#2B2B2B" : "#8A5A35"}" ${ST}/>
  <circle cx="${B[0]}" cy="${B[1]}" r="44" fill="#D9D9D9" ${ST}/><circle cx="${B[0]}" cy="${B[1]}" r="14" fill="${K}"/>
  <path d="M${B[0]} ${B[1] - 44} L${R[0]} ${R[1] - 22} M${B[0]} ${B[1] + 44} L${R[0]} ${R[1] + 22}" stroke="${K}" stroke-width="5"/>
  <rect x="${B[0] + 30}" y="${B[1] + 50}" width="50" height="16" rx="6" fill="#3A3A3A" ${ST}/>
  ${!mtb ? `<g transform="translate(${F[0] - 20} ${Ht[1] - 20})"><path d="M0 0 H150 L135 110 H15Z" fill="#E0B36A" ${ST}/><path d="M8 36 H142 M12 72 H138 M50 0 L55 110 M100 0 L96 110" stroke="${K}" stroke-width="4" opacity="0.5"/><circle cx="50" cy="-16" r="26" fill="#FF7AB6" ${ST}/><path d="M80 -10 q 20 -40 50 -20" stroke="#3DDC97" stroke-width="14" fill="none" stroke-linecap="round"/></g>` : ""}`;
}

function silla() {
  const wood = "#A8612E";
  return `${tube("M430 560 L400 820 M570 560 L600 820", wood, 20)}
  <ellipse cx="500" cy="720" rx="95" ry="26" fill="none" stroke="${K}" stroke-width="22"/><ellipse cx="500" cy="720" rx="95" ry="26" fill="none" stroke="${wood}" stroke-width="10"/>
  ${tube("M390 560 L360 820 M610 560 L640 820", wood, 20)}
  ${tube("M380 560 C 330 330, 400 180, 500 180 C 600 180, 670 330, 620 560", wood, 22)}
  ${tube("M430 520 C 400 360, 440 250, 500 250 C 560 250, 600 360, 570 520", wood, 14)}
  <ellipse cx="500" cy="560" rx="160" ry="48" fill="#E7C27D" ${ST}/>
  <ellipse cx="500" cy="556" rx="120" ry="30" fill="none" stroke="${K}" stroke-width="3" stroke-dasharray="6 7" opacity="0.6"/>
  <path d="M340 566 Q 500 640 660 566" stroke="${K}" stroke-width="8" fill="none"/>`;
}

function sillon() {
  const c = "#F2B705";
  const lines = [0, 1, 2, 3, 4].map((i) => `<path d="M${360 + i * 70} 330 V 560" stroke="${K}" stroke-width="5" opacity="0.35"/>`).join("");
  return `${tube("M300 740 L280 820 M700 740 L720 820 M360 740 L360 800 M640 740 L640 800", "#8A5A35", 16)}
  <rect x="300" y="280" width="400" height="330" rx="70" fill="${c}" ${ST}/>${lines}
  <rect x="330" y="560" width="340" height="120" rx="30" fill="#FFCC33" ${ST}/>
  <rect x="220" y="470" width="120" height="240" rx="50" fill="${c}" ${ST}/><rect x="660" y="470" width="120" height="240" rx="50" fill="${c}" ${ST}/>
  <rect x="250" y="660" width="500" height="90" rx="30" fill="#E0A800" ${ST}/>
  <path d="M360 610 H640" stroke="${K}" stroke-width="5" opacity="0.3"/>
  <rect x="560" y="490" width="120" height="100" rx="24" fill="#7B5CFF" ${ST} transform="rotate(10 620 540)"/>`;
}

function lampara() {
  return `<path d="M500 560 L370 820 M500 560 L630 820 M500 560 L505 830" stroke="${K}" stroke-width="16" stroke-linecap="round"/>
  <path d="M500 560 L370 820 M500 560 L630 820" stroke="#C98A4B" stroke-width="8" stroke-linecap="round"/>
  ${tube("M500 560 L500 300", "#C98A4B", 10)}
  <path d="M505 830 C 560 850, 640 800, 740 830" stroke="${K}" stroke-width="6" fill="none"/><rect x="730" y="816" width="40" height="28" rx="6" fill="#fff" ${ST}/>
  <ellipse cx="500" cy="320" rx="80" ry="22" fill="#FFE98A" opacity="0.8"/>
  <path d="M360 310 L640 310 L580 130 L420 130Z" fill="#FF6B6B" ${ST}/>
  <path d="M384 250 L616 250" stroke="${K}" stroke-width="4" opacity="0.35"/><path d="M405 190 L595 190" stroke="${K}" stroke-width="4" opacity="0.35"/>
  <path d="M470 330 l -20 60 M530 330 l 20 60 M500 334 v 70" stroke="#FFD23F" stroke-width="8" stroke-linecap="round"/>`;
}

function mesaRatona() {
  return `${tube("M300 600 L250 820 M700 600 L750 820 M380 600 L400 780 M620 600 L600 780", "#9A5B2B", 18)}
  <rect x="200" y="560" width="600" height="56" rx="28" fill="#C77B3C" ${ST}/><path d="M240 575 H760" stroke="#fff" stroke-width="6" opacity="0.35" stroke-linecap="round"/>
  <rect x="275" y="530" width="180" height="30" rx="6" fill="#FF7AB6" ${ST}/><rect x="270" y="500" width="170" height="30" rx="6" fill="#3DDC97" ${ST}/><rect x="285" y="470" width="150" height="30" rx="6" fill="#7B5CFF" ${ST}/>
  <path d="M560 560 L575 460 H685 L700 560Z" fill="#FF8A3D" ${ST}/>
  <path d="M630 460 C 600 380, 540 360, 520 320 C 580 320, 630 370, 630 460 C 640 380, 690 330, 750 330 C 730 380, 670 400, 630 460Z" fill="#2FA86A" ${ST}/>`;
}

function tocadiscos() {
  const grooves = [0, 1, 2, 3, 4].map((i) => `<ellipse cx="450" cy="560" rx="${132 - i * 18}" ry="${40 - i * 5.5}" fill="none" stroke="#3A3A3A" stroke-width="3"/>`).join("");
  return `<path d="M260 520 L310 300 L700 300 L750 520Z" fill="#CFEFFF" opacity="0.55" ${ST}/>
  <path d="M220 640 L780 640 L740 500 L260 500Z" fill="#C77B3C" ${ST}/>
  <rect x="220" y="640" width="560" height="130" rx="10" fill="#8A4F22" ${ST}/>
  <ellipse cx="450" cy="566" rx="160" ry="50" fill="#9A9A9A" ${ST}/><ellipse cx="450" cy="560" rx="150" ry="46" fill="${K}"/>${grooves}
  <ellipse cx="450" cy="560" rx="40" ry="13" fill="#FF6B6B" stroke="${K}" stroke-width="4"/><circle cx="450" cy="560" r="4" fill="#fff"/>
  <circle cx="680" cy="530" r="22" fill="#D9D9D9" ${ST}/>${tube("M680 530 L640 610 L560 590", "#D9D9D9", 8)}<rect x="540" y="580" width="30" height="22" rx="4" fill="${K}"/>
  <circle cx="300" cy="705" r="20" fill="#FFE14D" ${ST}/><circle cx="370" cy="705" r="20" fill="#FFE14D" ${ST}/><rect x="560" y="690" width="160" height="30" rx="15" fill="#F4E9D6" ${ST}/>
  <rect x="250" y="770" width="50" height="40" rx="8" fill="${K}"/><rect x="700" y="770" width="50" height="40" rx="8" fill="${K}"/>`;
}

function camara() {
  const lens = rad([[0, "#9BE7FF"], [0.5, "#3A6FA8"], [1, "#0D1B33"]], 0.35, 0.3, 0.8);
  const r = rng(4);
  const tex = [];
  for (let i = 0; i < 90; i++) tex.push(`<circle cx="${(250 + r() * 500).toFixed(0)}" cy="${(500 + r() * 170).toFixed(0)}" r="3" fill="#2E2E2E"/>`);
  return `${lens.def}<rect x="410" y="290" width="180" height="120" rx="14" fill="#D9D9D9" ${ST}/><path d="M440 290 L470 250 H530 L560 290" fill="#D9D9D9" ${ST}/>
  <rect x="270" y="340" width="90" height="40" rx="10" fill="#BDBDBD" ${ST}/><rect x="640" y="330" width="80" height="50" rx="12" fill="#BDBDBD" ${ST}/>
  <rect x="220" y="380" width="560" height="320" rx="40" fill="#E6E6E6" ${ST}/>
  <rect x="226" y="480" width="548" height="200" fill="${K}"/>${tex.join("")}
  <path d="M220 480 H780" stroke="${K}" stroke-width="8"/>
  <circle cx="500" cy="560" r="150" fill="#BDBDBD" ${ST}/><circle cx="500" cy="560" r="118" fill="${K}"/><circle cx="500" cy="560" r="90" fill="${lens.url}" stroke="#555" stroke-width="6"/>
  <ellipse cx="465" cy="520" rx="28" ry="18" fill="#fff" opacity="0.7" transform="rotate(-30 465 520)"/><circle cx="535" cy="600" r="8" fill="#fff" opacity="0.5"/>
  <rect x="660" y="410" width="70" height="40" rx="8" fill="#9BE7FF" ${ST}/><circle cx="290" cy="430" r="18" fill="#FF6B6B" ${ST}/>
  <path d="M220 420 C 150 420, 130 560, 170 700" stroke="#FF7AB6" stroke-width="22" fill="none" stroke-linecap="round"/>`;
}

function radio() {
  const dots = [];
  for (let y = 0; y < 6; y++) for (let x = 0; x < 11; x++) dots.push(`<circle cx="${300 + x * 26}" cy="${480 + y * 26}" r="7" fill="${K}"/>`);
  return `${tube("M340 380 C 340 230, 660 230, 660 380", "#2B2B2B", 18)}
  <rect x="240" y="370" width="520" height="380" rx="60" fill="#2EC4B6" ${ST}/>
  <rect x="280" y="450" width="300" height="190" rx="24" fill="#F4E9D6" ${ST}/>${dots.join("")}
  <rect x="600" y="450" width="120" height="70" rx="12" fill="#FFE14D" ${ST}/><path d="M615 470 v14 M630 470 v24 M645 470 v14 M660 470 v24 M675 470 v14 M690 470 v24 M705 470 v14" stroke="${K}" stroke-width="3"/><path d="M650 460 v52" stroke="#FF3B30" stroke-width="5"/>
  <circle cx="630" cy="590" r="30" fill="#F4E9D6" ${ST}/><circle cx="700" cy="590" r="24" fill="#F4E9D6" ${ST}/><path d="M630 590 L644 572" stroke="${K}" stroke-width="6"/>
  <rect x="280" y="670" width="440" height="40" rx="12" fill="#1F9E93" ${ST}/>
  <rect x="280" y="750" width="60" height="50" rx="10" fill="${K}"/><rect x="660" y="750" width="60" height="50" rx="10" fill="${K}"/>`;
}

function campera() {
  const c = "#4A78D0";
  const stitch = `stroke="#FFD23F" stroke-width="4" stroke-dasharray="10 8" fill="none"`;
  return `<path d="M350 210 L270 240 L140 560 L120 790 L230 800 L270 560 L300 470 L300 800 L700 800 L700 470 L730 560 L770 800 L880 790 L860 560 L730 240 L650 210 Z" fill="${c}" ${ST}/>
  <path d="M300 470 L300 800 M700 470 L700 800" stroke="${K}" stroke-width="6"/>
  <path d="M500 250 V800" stroke="${K}" stroke-width="6"/>
  ${[0, 1, 2, 3, 4].map((i) => `<circle cx="530" cy="${330 + i * 100}" r="13" fill="#C9C9C9" ${ST}/>`).join("")}
  <path d="M350 210 L500 330 L650 210 L610 190 L500 270 L390 190Z" fill="#3A63B3" ${ST}/>
  <path d="M330 350 H460 V470 H330Z" fill="#5A8AE0" ${ST}/><path d="M540 350 H670 V470 H540Z" fill="#5A8AE0" ${ST}/>
  <path d="M330 350 L395 390 L460 350" fill="none" ${ST}/><path d="M540 350 L605 390 L670 350" fill="none" ${ST}/>
  <path d="M310 730 H690" ${stitch}/><path d="M165 560 L240 575" ${stitch}/><path d="M835 560 L760 575" ${stitch}/><path d="M318 480 V720 M682 480 V720" ${stitch}/>
  <path d="M120 790 L230 800 L234 760 L126 750Z" fill="#3A63B3" ${ST}/><path d="M880 790 L770 800 L766 760 L874 750Z" fill="#3A63B3" ${ST}/>
  <rect x="580" y="600" width="70" height="44" rx="6" fill="#FF7AB6" ${ST} transform="rotate(-8 615 622)"/>`;
}

function zapatillas() {
  const shoe = (x, y, s, up, mid) => `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0 0 C 0 -60, 30 -120, 90 -130 L180 -140 C 230 -100, 300 -80, 380 -70 C 440 -60, 470 -40, 470 0 Z" fill="${up}" ${ST}/>
    <path d="M-10 0 H480 Q 485 40 450 50 H10 Q -15 40 -10 0Z" fill="#fff" ${ST}/><path d="M-6 24 H478" stroke="${mid}" stroke-width="12"/>
    <path d="M300 -76 C 360 -66, 450 -50, 466 -10" stroke="${K}" stroke-width="6" fill="none" opacity="0.5"/>
    <path d="M120 -40 L200 -100 L260 -40 L320 -90" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    ${[0, 1, 2, 3].map((i) => `<path d="M${190 + i * 26} ${-130 + i * 10} l 34 18" stroke="#fff" stroke-width="8" stroke-linecap="round"/>`).join("")}
    <path d="M20 -40 C 10 -70, 30 -110, 70 -126" stroke="${K}" stroke-width="6" fill="none"/><rect x="10" y="-100" width="40" height="60" rx="10" fill="${mid}" ${ST}/></g>`;
  return `${shoe(300, 690, 1, "#7B5CFF", "#FFE14D")}${shoe(170, 800, 1.05, "#FF5CA8", "#3DDC97")}`;
}

function mochila() {
  return `${tube("M430 250 C 430 170, 570 170, 570 250", "#2B2B2B", 16)}
  <rect x="290" y="240" width="420" height="560" rx="90" fill="#FF8A3D" ${ST}/>
  <path d="M300 330 C 300 260, 700 260, 700 330 L700 480 Q 500 520 300 480Z" fill="#E86A1F" ${ST}/>
  <rect x="360" y="470" width="60" height="100" rx="12" fill="#2B2B2B" ${ST}/><rect x="580" y="470" width="60" height="100" rx="12" fill="#2B2B2B" ${ST}/>
  <rect x="372" y="540" width="36" height="30" rx="6" fill="#D9D9D9" ${ST}/><rect x="592" y="540" width="36" height="30" rx="6" fill="#D9D9D9" ${ST}/>
  <rect x="350" y="600" width="300" height="160" rx="40" fill="#FFB067" ${ST}/><path d="M380 640 H620" stroke="${K}" stroke-width="6"/>
  <circle cx="450" cy="700" r="26" fill="#3DDC97" ${ST}/><path d="M540 680 l 20 30 l 30 -40" stroke="${K}" stroke-width="8" fill="none"/>`;
}

function guitarra() {
  const strings = [0, 1, 2, 3, 4, 5].map((i) => `<path d="M${488 + i * 5} 120 V 700" stroke="#EDEDED" stroke-width="2.5"/>`).join("");
  return `<g transform="rotate(-28 500 520)">
  <rect x="470" y="120" width="60" height="420" fill="#6B3A1E" ${ST}/>${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<path d="M470 ${170 + i * 40} H530" stroke="#D9D9D9" stroke-width="4"/>`).join("")}
  <path d="M460 40 H540 L550 140 H450Z" fill="#3A2412" ${ST}/>${[0, 1, 2].map((i) => `<circle cx="440" cy="${70 + i * 26}" r="9" fill="#E0E0E0" ${ST}/><circle cx="560" cy="${70 + i * 26}" r="9" fill="#E0E0E0" ${ST}/>`).join("")}
  <path d="M500 380 C 390 380, 360 440, 380 500 C 395 540, 360 560, 330 600 C 280 670, 310 800, 500 810 C 690 800, 720 670, 670 600 C 640 560, 605 540, 620 500 C 640 440, 610 380, 500 380Z" fill="#E8A55B" ${ST}/>
  <circle cx="500" cy="540" r="56" fill="${K}"/><circle cx="500" cy="540" r="70" fill="none" stroke="#7B5CFF" stroke-width="10"/>
  <rect x="440" y="690" width="120" height="26" rx="6" fill="#3A2412" ${ST}/>
  ${strings}
  </g>`;
}

function teclado() {
  const keys = [];
  for (let i = 0; i < 22; i++) keys.push(`<rect x="${140 + i * 32}" y="540" width="32" height="130" rx="4" fill="#fff" stroke="${K}" stroke-width="4"/>`);
  const pattern = [1, 1, 0, 1, 1, 1, 0];
  for (let i = 0; i < 21; i++) if (pattern[i % 7]) keys.push(`<rect x="${162 + i * 32}" y="540" width="20" height="80" rx="3" fill="${K}"/>`);
  return `<rect x="110" y="430" width="780" height="270" rx="26" fill="#FF5CA8" ${ST}/>
  <rect x="140" y="456" width="200" height="60" rx="10" fill="#1E1E1E" ${ST}/><path d="M160 486 l 20 -14 l 20 22 l 20 -18 l 20 12 l 20 -6 l 20 14 l 20 -10 l 20 8" stroke="#3DDC97" stroke-width="5" fill="none"/>
  ${[0, 1, 2, 3, 4].map((i) => `<circle cx="${400 + i * 70}" cy="486" r="22" fill="#FFE14D" ${ST}/><path d="M${400 + i * 70} 486 l ${10 - i * 4} -14" stroke="${K}" stroke-width="5"/>`).join("")}
  <rect x="770" y="460" width="90" height="56" rx="10" fill="#7B5CFF" ${ST}/>
  ${keys.join("")}<rect x="136" y="536" width="712" height="138" rx="6" fill="none" stroke="${K}" stroke-width="8"/>
  ${tube("M220 700 L180 820 M780 700 L820 820", "#2B2B2B", 14)}`;
}

function redoblante() {
  const lugs = [0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${300 + i * 66}" y="560" width="16" height="90" rx="6" fill="#D9D9D9" stroke="${K}" stroke-width="5"/>`).join("");
  return `<path d="M270 500 V 700 A 230 70 0 0 0 730 700 V 500Z" fill="#E63946" ${ST}/>
  ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<circle cx="${310 + i * 55}" cy="${620 + (i % 2) * 30}" r="4" fill="#fff" opacity="0.6"/>`).join("")}
  ${lugs}
  <path d="M270 700 A 230 70 0 0 0 730 700" fill="none" stroke="#D9D9D9" stroke-width="18"/><path d="M270 700 A 230 70 0 0 0 730 700" fill="none" stroke="${K}" stroke-width="5"/>
  <ellipse cx="500" cy="500" rx="232" ry="72" fill="#F7F4EC" stroke="#D9D9D9" stroke-width="18"/><ellipse cx="500" cy="500" rx="240" ry="80" fill="none" stroke="${K}" stroke-width="6"/>
  <ellipse cx="500" cy="500" rx="60" ry="18" fill="#E9E3D4"/>
  ${tube("M300 360 L640 520", "#E7C27D", 14)}${tube("M700 350 L380 520", "#E7C27D", 14)}
  ${tube("M360 760 L320 830 M640 760 L680 830 M500 770 V 830", "#3A3A3A", 10)}`;
}

function patineta() {
  return `<g transform="rotate(-12 500 600)"><rect x="140" y="560" width="720" height="90" rx="45" fill="#3DDC97" ${ST}/><path d="M200 590 H800" stroke="${K}" stroke-width="5" opacity="0.4"/>
  <path d="M380 575 l 30 40 l 30 -40 l 30 40 l 30 -40 l 30 40 l 30 -40" stroke="#7B5CFF" stroke-width="12" fill="none"/>
  ${[260, 740].map((x) => `<rect x="${x - 40}" y="650" width="80" height="24" rx="8" fill="#BDBDBD" ${ST}/><circle cx="${x - 40}" cy="700" r="32" fill="#FFE14D" ${ST}/><circle cx="${x + 40}" cy="700" r="32" fill="#FFE14D" ${ST}/>`).join("")}</g>`;
}

function maceta() {
  return `<path d="M380 820 L350 600 H650 L620 820Z" fill="#FF8A3D" ${ST}/><rect x="330" y="570" width="340" height="60" rx="14" fill="#FF6B1A" ${ST}/>
  <path d="M500 570 C 480 460, 420 420, 330 400 C 360 470, 420 520, 500 570 C 510 440, 560 360, 640 330 C 640 420, 590 500, 500 570 C 470 420, 480 300, 520 230 C 560 320, 540 450, 500 570Z" fill="#2FA86A" ${ST}/>
  <path d="M500 570 C 480 420, 490 330, 520 250 M500 570 C 450 500, 400 450, 340 410 M500 570 C 540 480, 580 400, 630 345" stroke="${K}" stroke-width="5" fill="none" opacity="0.5"/>`;
}

function cafetera() {
  return `<path d="M360 820 L390 600 H610 L640 820Z" fill="#D9D9D9" ${ST}/><path d="M400 600 L380 520 H620 L600 600Z" fill="#BDBDBD" ${ST}/>
  <path d="M380 520 L410 330 H590 L620 520Z" fill="#E6E6E6" ${ST}/><path d="M590 330 L660 300 L640 360Z" fill="#E6E6E6" ${ST}/>
  <path d="M470 290 H530 V 330 H470Z" fill="${K}"/><path d="M620 380 C 720 380, 720 560, 620 560" stroke="${K}" stroke-width="28" fill="none"/>
  <path d="M430 700 L450 620 M500 700 V 620 M570 700 L550 620" stroke="${K}" stroke-width="5" opacity="0.4"/>
  <path d="M470 250 q -20 -40 0 -80 q 20 -40 0 -80 M530 250 q -20 -40 0 -80" stroke="${K}" stroke-width="7" fill="none" opacity="0.35" stroke-linecap="round"/>`;
}

function velador() {
  return `<rect x="360" y="760" width="280" height="60" rx="20" fill="#7B5CFF" ${ST}/>${tube("M500 760 V 480", "#FFE14D", 18)}
  <path d="M330 480 L670 480 L610 290 L390 290Z" fill="#FF7AB6" ${ST}/><path d="M360 420 H640" stroke="${K}" stroke-width="5" opacity="0.4"/>
  <circle cx="560" cy="650" r="14" fill="#fff" ${ST}/>`;
}

// [dibujo, color de fondo, recorte del detalle (x, y, lado)]
const avisos = {
  "bici-urbana": [() => bici("#3DDC97"), "#FFE14D", [560, 220, 460]],
  "bici-mtb": [() => bici("#FF8A3D", true), "#4CC9F0", [520, 300, 420]],
  "silla-curvada": [silla, "#FF7AB6", [300, 420, 400]],
  "sillon-pana": [sillon, "#7B5CFF", [260, 240, 420]],
  "lampara-de-pie": [lampara, "#3DDC97", [320, 80, 380]],
  "mesa-ratona": [mesaRatona, "#FFE14D", [230, 300, 420]],
  tocadiscos: [tocadiscos, "#FF8A3D", [300, 380, 420]],
  "camara-analogica": [camara, "#FFE14D", [320, 380, 360]],
  "radio-vintage": [radio, "#FF7AB6", [240, 360, 420]],
  "campera-de-jean": [campera, "#FFE14D", [250, 180, 420]],
  zapatillas: [zapatillas, "#4CC9F0", [100, 480, 440]],
  "mochila-lona": [mochila, "#7B5CFF", [300, 400, 400]],
  "guitarra-criolla": [guitarra, "#4CC9F0", [320, 300, 420]],
  "teclado-sinte": [teclado, "#3DDC97", [100, 380, 440]],
  redoblante: [redoblante, "#FFE14D", [260, 300, 440]],
};

const rollo = {
  patineta: [patineta, "#FF7AB6"],
  "maceta-monstera": [maceta, "#FFE14D"],
  cafetera: [cafetera, "#4CC9F0"],
  velador: [velador, "#3DDC97"],
};

function dotsBg(color, w = 1000) {
  const id = uid("d");
  return `<pattern id="${id}" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="3.2" fill="${K}" opacity="0.13"/></pattern><rect width="${w}" height="${w}" fill="${color}"/><rect width="${w}" height="${w}" fill="url(#${id})"/>`;
}

function vistaPrincipal(draw, bg) {
  return `${svgOpen(1000, 1000)}${dotsBg(bg)}<ellipse cx="510" cy="836" rx="360" ry="26" fill="${K}" opacity="0.18"/>${draw()}</svg>`;
}

function vistaDetalle(draw, bg, [x, y, s]) {
  return `${svgOpen(1000, 1000, `${x} ${y} ${s} ${s}`)}${dotsBg(bg)}<ellipse cx="510" cy="836" rx="360" ry="26" fill="${K}" opacity="0.18"/>${draw()}</svg>`;
}

const paredes = ["#FFF4E0", "#E9E3FF", "#E0F7EE", "#FFE8F2"];
function vistaAmbiente(draw, i) {
  const wall = paredes[i % paredes.length];
  const fx = i % 2 ? 90 : 700;
  return `${svgOpen(1000, 1000)}<rect width="1000" height="1000" fill="${wall}"/>
  <rect y="760" width="1000" height="240" fill="#D9A56B"/>${[0, 1, 2, 3, 4, 5].map((k) => `<path d="M0 ${790 + k * 40} H1000" stroke="#B9844C" stroke-width="3"/>`).join("")}
  <rect y="742" width="1000" height="22" fill="#fff" stroke="${K}" stroke-width="6"/>
  <rect x="${fx}" y="120" width="200" height="250" fill="#fff" ${ST}/><rect x="${fx + 24}" y="144" width="152" height="202" fill="${["#7B5CFF", "#FF7AB6", "#3DDC97", "#FF8A3D"][i % 4]}"/><circle cx="${fx + 100}" cy="230" r="44" fill="#FFE14D" ${ST}/>
  <ellipse cx="500" cy="905" rx="300" ry="22" fill="${K}" opacity="0.15"/>
  <g transform="translate(500 900) scale(0.78) translate(-500 -830)">${draw()}</g></svg>`;
}

async function usados() {
  let i = 0;
  for (const [name, [draw, bg, crop]] of Object.entries(avisos)) {
    await write("usados", `aviso-${name}-1`, vistaPrincipal(draw, bg), 84);
    await write("usados", `aviso-${name}-2`, vistaDetalle(draw, bg, crop), 84);
    await write("usados", `aviso-${name}-3`, vistaAmbiente(draw, i++), 82);
  }
  for (const [name, [draw, bg]] of Object.entries(rollo)) await write("usados", `rollo-${name}`, vistaPrincipal(draw, bg), 82);
}

const tareas = { productores, oficios, usados };
for (const [k, fn] of Object.entries(tareas)) {
  if (!solo || solo === k) await fn();
}
