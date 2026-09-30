// Ilustraciones de las demos de landing pages (impacto, sereno y tech).
// Uso: node scripts/demos/landing.mjs
// Todo se dibuja en SVG y se exporta a WebP con `sharp` (viene con Next.js, no se agrega al proyecto).
// Los nombres de archivo son estables: los componentes los referencian directamente.
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(import.meta.dirname, "..", "..", "public", "demos", "landing");

async function write(relPath, svg, quality = 82) {
  const out = join(root, relPath);
  mkdirSync(dirname(out), { recursive: true });
  await sharp(Buffer.from(svg)).webp({ quality, effort: 5 }).toFile(out);
  console.log("✓", `demos/landing/${relPath}`);
}

const svg = (w, h, body, defs = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>${body}</svg>`;

// Grano fotográfico sutil (ruido fractal) para que las ilustraciones no se vean planas.
const grano = (id, opacity = 0.18, freq = 0.9) => `
  <filter id="${id}" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" stitchTiles="stitch" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${opacity} 0"/>
  </filter>`;

// Trama de medios tonos (puntos).
const halftone = (id, color, size = 14, r = 2.6) => `
  <pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="${color}"/>
  </pattern>`;

/* =====================================================================================
 * IMPACTO — Fuerza Norte. Pictogramas atléticos (estilo señalética deportiva) en negro,
 * hueso y naranja eléctrico, con trama de medios tonos y grano.
 * ===================================================================================== */
const N = { negro: "#0A0A0A", carbon: "#161616", hueso: "#F2EEE6", naranja: "#FF4D00", naranjaOsc: "#C23A00", gris: "#2A2A2A" };

/** Dibuja una figura tipo pictograma a partir de sus articulaciones. */
function pictograma(p, { color, limb = 34, torso = 58, head = 32 }) {
  const L = (a, b, w = limb) =>
    `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
  return [
    L(p.hombro, p.cadera, torso),
    L(p.cadera, p.rodillaA),
    L(p.rodillaA, p.pieA),
    L(p.cadera, p.rodillaB),
    L(p.rodillaB, p.pieB),
    L(p.hombro, p.codoA, limb * 0.9),
    L(p.codoA, p.manoA, limb * 0.85),
    L(p.hombro, p.codoB, limb * 0.9),
    L(p.codoB, p.manoB, limb * 0.85),
    `<circle cx="${p.cabeza[0]}" cy="${p.cabeza[1]}" r="${head}" fill="${color}"/>`,
  ].join("");
}

const POSES = {
  // Envión: brazos arriba con la barra, piernas en tijera.
  envion: {
    cabeza: [200, 120], hombro: [200, 178], cadera: [200, 300],
    codoA: [158, 112], manoA: [128, 52], codoB: [242, 112], manoB: [272, 52],
    rodillaA: [270, 368], pieA: [300, 462], rodillaB: [150, 398], pieB: [70, 450],
  },
  // Swing con pesa rusa.
  swing: {
    cabeza: [292, 176], hombro: [252, 214], cadera: [168, 296],
    codoA: [300, 250], manoA: [348, 262], codoB: [296, 258], manoB: [344, 270],
    rodillaA: [214, 380], pieA: [196, 462], rodillaB: [236, 378], pieB: [226, 462],
  },
  // Sprint.
  sprint: {
    cabeza: [262, 112], hombro: [240, 166], cadera: [196, 288],
    codoA: [296, 212], manoA: [318, 158], codoB: [186, 222], manoB: [150, 270],
    rodillaA: [292, 316], pieA: [268, 410], rodillaB: [160, 370], pieB: [88, 408],
  },
  // Estocada con estiramiento (movilidad).
  estocada: {
    cabeza: [206, 150], hombro: [200, 206], cadera: [188, 340],
    codoA: [246, 150], manoA: [288, 96], codoB: [156, 150], manoB: [112, 96],
    rodillaA: [282, 372], pieA: [292, 462], rodillaB: [124, 440], pieB: [48, 452],
  },
  // Salto en estrella (en el aire, brazos y piernas abiertos).
  salto: {
    cabeza: [200, 92], hombro: [200, 150], cadera: [200, 268],
    codoA: [142, 106], manoA: [92, 50], codoB: [258, 106], manoB: [308, 50],
    rodillaA: [150, 340], pieA: [112, 410], rodillaB: [250, 340], pieB: [288, 410],
  },
};

function barra(color, plato) {
  return `<line x1="40" y1="52" x2="360" y2="52" stroke="${color}" stroke-width="12" stroke-linecap="round"/>
    <rect x="44" y="-6" width="30" height="116" rx="8" fill="${plato}"/><rect x="326" y="-6" width="30" height="116" rx="8" fill="${plato}"/>
    <rect x="78" y="10" width="16" height="84" rx="6" fill="${plato}"/><rect x="306" y="10" width="16" height="84" rx="6" fill="${plato}"/>`;
}

function kettlebell(x, y, color) {
  return `<g transform="translate(${x} ${y})"><path d="M-18 -30 a18 18 0 0 1 36 0" fill="none" stroke="${color}" stroke-width="10"/>
    <circle cx="0" cy="6" r="34" fill="${color}"/></g>`;
}

function impactoHero() {
  const w = 1200, h = 1500;
  const defs = grano("g", 0.22) + halftone("ht", "#FF4D00", 18, 3.2) + halftone("ht2", "#F2EEE6", 16, 1.6) +
    `<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${N.negro}" stop-opacity="0"/><stop offset="1" stop-color="${N.negro}"/></linearGradient>
     <clipPath id="c"><rect width="${w}" height="${h}"/></clipPath>`;
  const body = `
  <rect width="${w}" height="${h}" fill="${N.negro}"/>
  <g clip-path="url(#c)">
    <circle cx="640" cy="640" r="470" fill="${N.naranja}"/>
    <circle cx="640" cy="640" r="470" fill="url(#ht)" opacity="0"/>
    <path d="M-40 1180 L1240 520 L1240 700 L-40 1360Z" fill="url(#ht)" opacity="0.8"/>
    <rect x="0" y="0" width="${w}" height="${h}" fill="url(#ht2)" opacity="0.12"/>
    <g transform="translate(220 150) scale(1.9)">
      <g transform="translate(14 16)" opacity="0.9">${barra(N.naranjaOsc, N.naranjaOsc)}${pictograma(POSES.envion, { color: N.naranjaOsc })}</g>
      ${barra(N.hueso, N.negro)}
      ${pictograma(POSES.envion, { color: N.negro })}
    </g>
    <rect x="0" y="${h - 420}" width="${w}" height="420" fill="url(#fade)"/>
    <g fill="none" stroke="${N.hueso}" stroke-width="3" opacity="0.5">
      <path d="M90 170 h120 M90 190 h80"/><path d="M1010 1060 h110 M1040 1080 h80"/>
    </g>
  </g>
  <rect width="${w}" height="${h}" filter="url(#g)"/>`;
  return svg(w, h, body, defs);
}

function impactoDisciplina(pose, fondo, figura, extra = "") {
  const w = 900, h = 1100;
  const defs = grano("g", 0.2) + halftone("ht", figura === N.negro ? "#0A0A0A" : "#FF4D00", 16, 2.6);
  const body = `
  <rect width="${w}" height="${h}" fill="${fondo}"/>
  <rect x="0" y="${h * 0.62}" width="${w}" height="${h * 0.38}" fill="url(#ht)" opacity="0.28"/>
  <line x1="60" y1="${h - 170}" x2="${w - 60}" y2="${h - 170}" stroke="${figura}" stroke-width="10" stroke-linecap="round" opacity="0.9"/>
  <g transform="translate(90 ${h - 170 - 470 * 1.55}) scale(1.55)">
    ${extra}
    ${pictograma(POSES[pose], { color: figura })}
  </g>
  <rect width="${w}" height="${h}" filter="url(#g)"/>`;
  return svg(w, h, body, defs);
}

/** Retrato estilizado (busto sin rasgos) para coaches. */
function busto({ fondo, piel, pelo, remera, acento, estilo, trama }) {
  const w = 800, h = 1000;
  const defs = grano("g", 0.2) + halftone("ht", trama, 18, 3);
  let peloSvg = "";
  if (estilo === "corto")
    peloSvg = `<path d="M312 360 C300 250 360 200 410 200 C470 200 505 250 492 350 C470 300 420 290 360 300 C340 305 322 330 312 360Z" fill="${pelo}"/>`;
  if (estilo === "rodete")
    peloSvg = `<circle cx="402" cy="192" r="58" fill="${pelo}"/><path d="M306 380 C290 250 350 222 402 222 C462 222 516 262 498 380 C488 318 450 280 402 282 C352 284 316 320 306 380Z" fill="${pelo}"/>`;
  if (estilo === "cola")
    peloSvg = `<path d="M488 300 C560 330 580 430 548 540 C540 470 520 420 480 380Z" fill="${pelo}"/><path d="M306 370 C296 262 350 218 404 218 C466 218 512 262 498 372 C484 316 444 288 400 290 C354 292 318 318 306 370Z" fill="${pelo}"/>`;
  if (estilo === "barba")
    peloSvg = `<path d="M318 330 C318 250 370 214 404 214 C446 214 492 250 488 330 C470 290 440 272 404 272 C366 272 334 292 318 330Z" fill="${pelo}"/><path d="M322 420 C330 500 370 530 402 530 C436 530 474 500 482 420 C470 470 440 486 402 486 C362 486 334 470 322 420Z" fill="${pelo}"/>`;
  const body = `
  <rect width="${w}" height="${h}" fill="${fondo}"/>
  <circle cx="400" cy="470" r="330" fill="url(#ht)" opacity="0.35"/>
  <path d="M120 1000 C130 760 240 660 400 660 C560 660 670 760 680 1000Z" fill="${remera}"/>
  <path d="M250 1000 L270 760" stroke="${acento}" stroke-width="18"/>
  <path d="M550 1000 L530 760" stroke="${acento}" stroke-width="18"/>
  <rect x="352" y="540" width="96" height="150" rx="40" fill="${piel}"/>
  <path d="M352 640 C380 680 420 680 448 640 L448 700 C420 720 380 720 352 700Z" fill="#000" opacity="0.15"/>
  <ellipse cx="402" cy="400" rx="98" ry="126" fill="${piel}"/>
  <path d="M470 330 C500 390 498 460 460 510 C490 460 492 390 470 330Z" fill="#000" opacity="0.12"/>
  ${peloSvg}
  <rect width="${w}" height="${h}" filter="url(#g)"/>`;
  return svg(w, h, body, defs);
}

function impactoTextura() {
  const w = 1600, h = 900;
  const defs = grano("g", 0.35, 0.7) + halftone("ht", N.naranja, 22, 4);
  const lineas = Array.from({ length: 14 }, (_, i) => `<path d="M${-200 + i * 140} ${h} L${400 + i * 140} 0" stroke="#303030" stroke-width="3"/>`).join("");
  const body = `<rect width="${w}" height="${h}" fill="${N.carbon}"/>${lineas}
    <path d="M0 ${h} L${w} ${h * 0.25} L${w} ${h}Z" fill="url(#ht)" opacity="0.55"/>
    <rect width="${w}" height="${h}" filter="url(#g)"/>`;
  return svg(w, h, body, defs);
}

/* =====================================================================================
 * SERENO — Alma Clara. Formas orgánicas, arcos y botánica. Salvia, marfil y lila apagado.
 * ===================================================================================== */
const S = {
  marfil: "#F6F4EE", niebla: "#E5E9E1", salvia: "#A3B09C", salviaMed: "#7F8F7A", salviaOsc: "#3E4C43",
  lila: "#C3B6CF", lilaOsc: "#8F7FA3", piel: "#E8CDB8", pielSombra: "#D6B49C", arena: "#EDE3D6", tinta: "#26302A",
};

const hoja = (x, y, rot, len, color, op = 1) =>
  `<g transform="translate(${x} ${y}) rotate(${rot})" opacity="${op}"><path d="M0 0 C${len * 0.3} ${-len * 0.22} ${len * 0.75} ${-len * 0.2} ${len} 0 C${len * 0.72} ${len * 0.2} ${len * 0.3} ${len * 0.22} 0 0Z" fill="${color}"/><path d="M0 0 L${len * 0.92} 0" stroke="${S.marfil}" stroke-opacity="0.35" stroke-width="2"/></g>`;

function rama(x, y, rot, escala, color) {
  const hojas = [];
  for (let i = 0; i < 7; i++) {
    const t = i * 46;
    hojas.push(hoja(t, 0, -38 - i * 2, 62 - i * 3, color, 0.95));
    hojas.push(hoja(t + 20, 0, 38 + i * 2, 58 - i * 3, color, 0.85));
  }
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${escala})"><path d="M-10 0 L340 0" stroke="${color}" stroke-width="4" stroke-linecap="round"/>${hojas.join("")}</g>`;
}

// Eucalipto: hojas redondas.
function eucalipto(x, y, rot, escala, color) {
  const discos = [];
  for (let i = 0; i < 6; i++) {
    const t = i * 52;
    discos.push(`<ellipse cx="${t + 8}" cy="${i % 2 ? 28 : -28}" rx="30" ry="24" fill="${color}" opacity="${0.75 + (i % 3) * 0.08}"/>`);
  }
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${escala})"><path d="M-20 0 C80 -10 200 10 320 0" stroke="${color}" stroke-width="4" fill="none"/>${discos.join("")}</g>`;
}

function serenoHero() {
  const w = 1200, h = 1500;
  const defs = grano("g", 0.12) +
    `<linearGradient id="arco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9D1C3"/><stop offset="1" stop-color="${S.salvia}"/></linearGradient>
     <radialGradient id="sol" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#E4DAEC"/><stop offset="1" stop-color="${S.lila}"/></radialGradient>
     <linearGradient id="piel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EFD8C6"/><stop offset="1" stop-color="${S.pielSombra}"/></linearGradient>
     <clipPath id="arcoClip"><path d="M150 1500 L150 600 A450 450 0 0 1 1050 600 L1050 1500Z"/></clipPath>`;
  const body = `
  <rect width="${w}" height="${h}" fill="${S.niebla}"/>
  <path d="M150 1500 L150 600 A450 450 0 0 1 1050 600 L1050 1500Z" fill="url(#arco)"/>
  <g clip-path="url(#arcoClip)">
    <circle cx="820" cy="430" r="190" fill="url(#sol)" opacity="0.9"/>
    ${eucalipto(120, 980, -32, 1.6, S.salviaMed)}
    ${rama(1080, 820, 200, 1.3, "#6E806C")}
    <!-- cabello atrás -->
    <path d="M430 560 C380 700 380 900 420 1060 L780 1060 C820 900 820 700 770 560 C730 460 470 460 430 560Z" fill="${S.salviaOsc}"/>
    <!-- hombros y torso -->
    <path d="M250 1500 C260 1230 390 1130 600 1130 C810 1130 940 1230 950 1500Z" fill="${S.marfil}"/>
    <path d="M430 1500 C470 1360 540 1300 600 1300 C660 1300 730 1360 770 1500Z" fill="#E9E4DA"/>
    <!-- cuello -->
    <path d="M540 960 L540 1150 C560 1190 640 1190 660 1150 L660 960Z" fill="url(#piel)"/>
    <path d="M540 1060 C570 1110 630 1110 660 1060 L660 1110 C630 1150 570 1150 540 1110Z" fill="#B99680" opacity="0.35"/>
    <!-- cara -->
    <ellipse cx="600" cy="800" rx="150" ry="190" fill="url(#piel)"/>
    <!-- ojos cerrados, serenos -->
    <path d="M530 800 q26 18 52 0" stroke="#7A5E4E" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M618 800 q26 18 52 0" stroke="#7A5E4E" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M600 830 q-8 36 6 44" stroke="#C39F87" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M572 912 q28 16 56 0" stroke="#B87F72" stroke-width="7" fill="none" stroke-linecap="round"/>
    <ellipse cx="530" cy="870" rx="30" ry="16" fill="#E3A99A" opacity="0.35"/>
    <ellipse cx="672" cy="870" rx="30" ry="16" fill="#E3A99A" opacity="0.35"/>
    <!-- cabello adelante, con raya al medio -->
    <path d="M450 780 C440 640 520 590 600 590 C680 590 760 640 750 780 C730 700 680 650 606 648 C640 690 560 700 520 690 C488 700 460 730 450 780Z" fill="${S.salviaOsc}"/>
    <path d="M458 740 C430 820 440 920 470 990 C452 900 452 820 470 760Z" fill="${S.salviaOsc}"/>
    <path d="M742 740 C770 820 760 920 730 990 C748 900 748 820 730 760Z" fill="${S.salviaOsc}"/>
    ${eucalipto(760, 1200, -70, 1.2, "#8E9E88")}
  </g>
  <path d="M150 1500 L150 600 A450 450 0 0 1 1050 600 L1050 1500" fill="none" stroke="${S.salviaOsc}" stroke-opacity="0.25" stroke-width="3"/>
  <circle cx="1060" cy="260" r="46" fill="none" stroke="${S.lilaOsc}" stroke-width="3" opacity="0.6"/>
  <circle cx="160" cy="420" r="10" fill="${S.lilaOsc}" opacity="0.6"/>
  <rect width="${w}" height="${h}" filter="url(#g)"/>`;
  return svg(w, h, body, defs);
}

/** Producto sobre fondo de color, con sombra suave. */
function serenoProducto(tipo) {
  const w = 800, h = 800;
  const fondos = { facial: "#DCE2D6", corporal: "#E4DDE9", relax: "#EDE5DA", manos: "#D9E0E3" };
  const defs = grano("g", 0.1) +
    `<radialGradient id="sombra" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#3E4C43" stop-opacity="0.28"/><stop offset="1" stop-color="#3E4C43" stop-opacity="0"/></radialGradient>
     <linearGradient id="vidrio" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9FAF98"/><stop offset="0.35" stop-color="#C4CFBE"/><stop offset="1" stop-color="#7F8F7A"/></linearGradient>
     <linearGradient id="lila" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A897B8"/><stop offset="0.4" stop-color="#D2C7DC"/><stop offset="1" stop-color="#8F7FA3"/></linearGradient>
     <linearGradient id="piedra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6D7A6E"/><stop offset="1" stop-color="#3E4C43"/></linearGradient>`;
  let obj = "";
  if (tipo === "facial")
    obj = `<ellipse cx="400" cy="650" rx="190" ry="26" fill="url(#sombra)"/>
      <rect x="310" y="330" width="180" height="320" rx="40" fill="url(#vidrio)"/>
      <rect x="330" y="420" width="140" height="130" rx="8" fill="${S.marfil}" opacity="0.9"/>
      <rect x="352" y="450" width="96" height="8" rx="4" fill="${S.salviaOsc}" opacity="0.6"/><rect x="368" y="470" width="64" height="6" rx="3" fill="${S.salviaOsc}" opacity="0.35"/>
      <rect x="360" y="270" width="80" height="70" rx="10" fill="${S.salviaOsc}"/>
      <path d="M372 270 L372 170 C372 130 428 130 428 170 L428 270Z" fill="#E7E1D6"/>
      <rect x="336" y="345" width="16" height="280" rx="8" fill="#fff" opacity="0.35"/>
      ${hoja(520, 640, -60, 150, "#8E9E88")}${hoja(540, 650, -20, 120, "#6E806C")}`;
  if (tipo === "corporal")
    obj = `<ellipse cx="400" cy="660" rx="230" ry="28" fill="url(#sombra)"/>
      <ellipse cx="400" cy="610" rx="190" ry="60" fill="url(#piedra)"/>
      <ellipse cx="400" cy="520" rx="150" ry="50" fill="#5C6B5F"/>
      <ellipse cx="400" cy="440" rx="110" ry="40" fill="#7B887C"/>
      <ellipse cx="400" cy="372" rx="72" ry="30" fill="#96A293"/>
      <ellipse cx="380" cy="360" rx="30" ry="8" fill="#fff" opacity="0.25"/>
      ${eucalipto(470, 330, -30, 0.8, "#A897B8")}`;
  if (tipo === "relax")
    obj = `<ellipse cx="400" cy="660" rx="240" ry="28" fill="url(#sombra)"/>
      <rect x="170" y="520" width="300" height="130" rx="65" fill="#F6F4EE"/>
      <circle cx="235" cy="585" r="65" fill="#E9E4DA"/><circle cx="235" cy="585" r="42" fill="none" stroke="#DCD5C8" stroke-width="6"/><circle cx="235" cy="585" r="20" fill="none" stroke="#DCD5C8" stroke-width="6"/>
      <rect x="500" y="470" width="130" height="180" rx="18" fill="url(#lila)"/>
      <rect x="500" y="470" width="130" height="30" rx="12" fill="#F6F4EE" opacity="0.5"/>
      <path d="M565 470 L565 440" stroke="#3E4C43" stroke-width="5"/>
      <path d="M565 438 C548 410 556 380 565 364 C576 384 584 410 565 438Z" fill="#F2C38B"/>
      <path d="M565 432 C558 418 561 404 565 396 C570 406 572 420 565 432Z" fill="#FBE7C6"/>`;
  if (tipo === "manos")
    obj = `<ellipse cx="400" cy="660" rx="220" ry="26" fill="url(#sombra)"/>
      <rect x="250" y="440" width="120" height="210" rx="30" fill="url(#lila)"/>
      <rect x="276" y="360" width="68" height="90" rx="12" fill="${S.salviaOsc}"/>
      <rect x="264" y="460" width="14" height="170" rx="7" fill="#fff" opacity="0.35"/>
      <path d="M430 650 L430 470 C430 420 560 420 560 470 L560 650Z" fill="#F6F4EE"/>
      <path d="M470 430 L470 380 L520 380 L520 430Z" fill="#E1D8CB"/>
      <rect x="450" y="520" width="90" height="60" rx="6" fill="${S.salvia}" opacity="0.6"/>
      ${hoja(560, 640, -120, 110, "#8E9E88", 0.9)}`;
  const body = `<rect width="${w}" height="${h}" fill="${fondos[tipo]}"/>
    <circle cx="400" cy="440" r="250" fill="#fff" opacity="0.28"/>${obj}
    <rect width="${w}" height="${h}" filter="url(#g)"/>`;
  return svg(w, h, body, defs);
}

/**
 * Primer plano estilizado de mejilla, para el comparador antes/después.
 * `despues` = piel pareja y luminosa; `antes` = tono apagado con manchas, poros y rojeces.
 */
function serenoPiel(caso, despues) {
  const w = 1200, h = 900;
  const r = mulberry(caso * 97 + 11);
  const tonos = {
    1: { base: "#E6C3AA", sombra: "#C99D82", luz: "#F6E0CF" },
    2: { base: "#D9AE8F", sombra: "#B98567", luz: "#EFD2BC" },
    3: { base: "#EFD2C0", sombra: "#D2A993", luz: "#FBEAE0" },
  }[caso];
  const defs = `
    <radialGradient id="mej" cx="0.42" cy="0.44" r="0.7"><stop offset="0" stop-color="${despues ? tonos.luz : tonos.base}"/><stop offset="0.55" stop-color="${tonos.base}"/><stop offset="1" stop-color="${tonos.sombra}"/></radialGradient>
    <radialGradient id="brillo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff" stop-opacity="${despues ? 0.55 : 0.12}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <radialGradient id="rojo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#D0645A" stop-opacity="0.5"/><stop offset="1" stop-color="#D0645A" stop-opacity="0"/></radialGradient>
    <filter id="suave"><feGaussianBlur stdDeviation="${despues ? 1.2 : 0.4}"/></filter>
    ${grano("g", despues ? 0.08 : 0.2, despues ? 0.9 : 1.4)}`;
  const marcas = [];
  if (!despues) {
    const manchas = caso === 2 ? 26 : 14;
    for (let i = 0; i < manchas; i++)
      marcas.push(`<ellipse cx="${260 + r() * 700}" cy="${220 + r() * 480}" rx="${6 + r() * (caso === 2 ? 20 : 12)}" ry="${5 + r() * 10}" fill="#8A5A42" opacity="${0.18 + r() * 0.22}"/>`);
    for (let i = 0; i < 180; i++)
      marcas.push(`<circle cx="${220 + r() * 780}" cy="${180 + r() * 560}" r="${1.2 + r() * 2.2}" fill="#7A4E3A" opacity="${0.18 + r() * 0.25}"/>`);
    const rojeces = caso === 1 ? 5 : caso === 3 ? 7 : 2;
    for (let i = 0; i < rojeces; i++)
      marcas.push(`<ellipse cx="${300 + r() * 560}" cy="${300 + r() * 360}" rx="${60 + r() * 70}" ry="${40 + r() * 50}" fill="url(#rojo)"/>`);
    if (caso === 3)
      for (let i = 0; i < 5; i++) {
        const y = 300 + i * 70;
        marcas.push(`<path d="M${820 + r() * 40} ${y} q40 ${-10 + r() * 20} 90 ${-6 + r() * 12}" stroke="${tonos.sombra}" stroke-width="3" fill="none" opacity="0.7"/>`);
      }
  }
  const body = `
  <rect width="${w}" height="${h}" fill="${tonos.sombra}"/>
  <path d="M0 0 H${w} V${h} H0Z" fill="url(#mej)"/>
  <path d="M-40 780 C200 640 520 700 760 900 L-40 900Z" fill="${tonos.sombra}" opacity="0.5"/>
  <path d="M900 -20 C1040 120 1120 300 1240 360 L1240 -20Z" fill="#3E4C43" opacity="0.9"/>
  <path d="M960 -20 C1060 110 1140 240 1240 280" stroke="#56645A" stroke-width="10" fill="none" opacity="0.8"/>
  <g filter="url(#suave)">${marcas.join("")}</g>
  <ellipse cx="480" cy="360" rx="260" ry="170" fill="url(#brillo)"/>
  ${despues ? `<ellipse cx="560" cy="300" rx="90" ry="40" fill="#fff" opacity="0.18"/>` : ""}
  <rect width="${w}" height="${h}" filter="url(#g)"/>`;
  return svg(w, h, body, defs);
}

function serenoRetrato({ fondo, arco, pelo, piel, ropa, estilo }) {
  const w = 800, h = 1000;
  const defs = grano("g", 0.1) +
    `<clipPath id="a"><path d="M80 1000 L80 400 A320 320 0 0 1 720 400 L720 1000Z"/></clipPath>`;
  const cabello = {
    largo: `<path d="M270 400 C240 520 250 700 280 800 L520 800 C550 700 560 520 530 400 C500 300 300 300 270 400Z" fill="${pelo}"/>`,
    recogido: `<circle cx="400" cy="250" r="70" fill="${pelo}"/>`,
    corto: `<path d="M290 470 C280 560 300 620 320 650 L480 650 C500 620 520 560 510 470Z" fill="${pelo}"/>`,
  }[estilo];
  const flequillo = {
    largo: `<path d="M296 450 C290 350 350 314 400 314 C460 314 512 350 504 450 C480 390 440 364 400 366 C356 368 316 394 296 450Z" fill="${pelo}"/>`,
    recogido: `<path d="M300 440 C296 350 350 310 400 310 C458 310 506 350 500 440 C476 380 440 360 400 360 C360 360 322 380 300 440Z" fill="${pelo}"/>`,
    corto: `<path d="M292 470 C280 350 350 306 404 306 C470 306 520 360 508 470 C492 400 450 372 404 374 C356 376 312 404 292 470Z" fill="${pelo}"/>`,
  }[estilo];
  const body = `
  <rect width="${w}" height="${h}" fill="${S.marfil}"/>
  <path d="M80 1000 L80 400 A320 320 0 0 1 720 400 L720 1000Z" fill="${fondo}"/>
  <g clip-path="url(#a)">
    <circle cx="590" cy="300" r="120" fill="${arco}" opacity="0.7"/>
    ${cabello}
    <path d="M150 1000 C160 800 270 720 400 720 C530 720 640 800 650 1000Z" fill="${ropa}"/>
    <path d="M340 720 C360 790 440 790 460 720" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="6"/>
    <rect x="354" y="560" width="92" height="170" rx="40" fill="${piel}"/>
    <path d="M354 650 C380 690 420 690 446 650 L446 700 C420 720 380 720 354 700Z" fill="#000" opacity="0.1"/>
    <ellipse cx="400" cy="460" rx="104" ry="130" fill="${piel}"/>
    <path d="M350 470 q18 12 36 0 M414 470 q18 12 36 0" stroke="#6E5446" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M382 540 q18 10 36 0" stroke="#A8705F" stroke-width="5" fill="none" stroke-linecap="round"/>
    ${flequillo}
  </g>
  <rect width="${w}" height="${h}" filter="url(#g)"/>`;
  return svg(w, h, body, defs);
}

function serenoEspacio() {
  const w = 1400, h = 1000;
  const defs = grano("g", 0.1) +
    `<linearGradient id="luz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
     <linearGradient id="pared" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E7EBE3"/><stop offset="1" stop-color="#D8DED2"/></linearGradient>`;
  const body = `
  <rect width="${w}" height="${h}" fill="url(#pared)"/>
  <rect y="760" width="${w}" height="240" fill="#CFC6B8"/>
  <path d="M0 760 H${w}" stroke="#BDB3A4" stroke-width="4"/>
  <!-- ventana en arco -->
  <path d="M820 740 L820 300 A170 170 0 0 1 1160 300 L1160 740Z" fill="#C8D3E0"/>
  <path d="M820 740 L820 300 A170 170 0 0 1 1160 300 L1160 740Z" fill="none" stroke="#F6F4EE" stroke-width="18"/>
  <path d="M990 130 V740 M820 460 H1160" stroke="#F6F4EE" stroke-width="12"/>
  ${eucalipto(860, 690, -60, 1.1, "#7F8F7A")}
  <!-- haz de luz -->
  <path d="M820 300 L1160 300 L760 1000 L240 1000Z" fill="url(#luz)" opacity="0.6"/>
  <!-- camilla -->
  <rect x="180" y="600" width="560" height="70" rx="30" fill="#F6F4EE"/>
  <rect x="200" y="578" width="140" height="40" rx="20" fill="#E4DDE9"/>
  <path d="M230 670 L210 820 M690 670 L710 820" stroke="#8C7B68" stroke-width="16" stroke-linecap="round"/>
  <rect x="330" y="580" width="330" height="36" rx="16" fill="#C3B6CF"/>
  <!-- repisa con frascos -->
  <rect x="200" y="330" width="360" height="14" rx="7" fill="#B9A992"/>
  <rect x="230" y="250" width="44" height="80" rx="12" fill="#7F8F7A"/>
  <rect x="290" y="270" width="36" height="60" rx="10" fill="#C3B6CF"/>
  <circle cx="370" cy="306" r="24" fill="#E8CDB8"/>
  <rect x="420" y="230" width="30" height="100" rx="10" fill="#3E4C43"/>
  <path d="M480 330 C470 280 500 250 520 240 C530 270 520 310 510 330Z" fill="#8E9E88"/>
  <!-- planta -->
  <path d="M1250 760 L1230 640 H1330 L1310 760Z" fill="#B9A992"/>
  ${hoja(1280, 640, -100, 200, "#6E806C")}${hoja(1280, 640, -60, 180, "#8E9E88")}${hoja(1280, 640, -135, 170, "#7F8F7A")}${hoja(1280, 640, -30, 140, "#6E806C")}
  <!-- banqueta -->
  <ellipse cx="620" cy="830" rx="70" ry="18" fill="#B9A992"/>
  <path d="M580 830 L570 940 M660 830 L670 940" stroke="#8C7B68" stroke-width="10" stroke-linecap="round"/>
  <rect width="${w}" height="${h}" filter="url(#g)"/>`;
  return svg(w, h, body, defs);
}

/* =====================================================================================
 * TECH — Cuentaclara. Avatares planos para testimonios.
 * ===================================================================================== */
function techAvatar({ fondo, piel, pelo, ropa, estilo }) {
  const w = 240, h = 240;
  const pelos = {
    corto: `<path d="M78 104 C74 60 104 44 122 44 C146 44 168 60 162 104 C154 82 138 74 120 74 C100 74 84 84 78 104Z" fill="${pelo}"/>`,
    largo: `<path d="M74 110 C66 56 102 40 120 40 C144 40 176 56 166 110 L172 180 L68 180Z" fill="${pelo}"/>`,
    rulos: `<g fill="${pelo}"><circle cx="90" cy="76" r="22"/><circle cx="118" cy="60" r="24"/><circle cx="148" cy="74" r="22"/><circle cx="80" cy="100" r="16"/><circle cx="160" cy="100" r="16"/></g>`,
  }[estilo];
  const body = `<rect width="${w}" height="${h}" fill="${fondo}"/>
    <circle cx="190" cy="50" r="46" fill="#fff" opacity="0.18"/>
    ${estilo === "largo" ? pelos : ""}
    <path d="M40 240 C44 186 80 166 120 166 C160 166 196 186 200 240Z" fill="${ropa}"/>
    <rect x="104" y="130" width="32" height="48" rx="14" fill="${piel}"/>
    <ellipse cx="120" cy="104" rx="40" ry="48" fill="${piel}"/>
    <circle cx="105" cy="108" r="4" fill="#1A1A1A" opacity="0.8"/><circle cx="135" cy="108" r="4" fill="#1A1A1A" opacity="0.8"/>
    <path d="M108 128 q12 9 24 0" stroke="#1A1A1A" stroke-opacity="0.55" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    ${estilo === "largo" ? `<path d="M80 100 C78 64 102 54 120 54 C142 54 164 66 160 100 C150 80 136 74 120 76 C102 76 88 84 80 100Z" fill="${pelo}"/>` : pelos}`;
  return svg(w, h, body);
}

// PRNG determinista para que los archivos no cambien entre corridas.
function mulberry(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

async function main() {
  // Impacto
  await write("impacto/hero-atleta-envion.webp", impactoHero());
  await write("impacto/disciplina-funcional.webp", impactoDisciplina("swing", N.naranja, N.negro, kettlebell(348, 300, N.negro)));
  await write("impacto/disciplina-halterofilia.webp", impactoDisciplina("envion", N.hueso, N.negro, barra(N.negro, N.naranja)));
  await write("impacto/disciplina-hiit.webp", impactoDisciplina("salto", "#1C1C1C", N.naranja, `<ellipse cx="200" cy="468" rx="90" ry="10" fill="#FF4D00" opacity="0.35"/><path d="M60 180 h-40 M70 230 h-56 M340 180 h40 M330 230 h56" stroke="#FF4D00" stroke-width="10" stroke-linecap="round" opacity="0.6"/>`));
  await write("impacto/disciplina-movilidad.webp", impactoDisciplina("estocada", "#D7FF3A", N.negro));
  await write("impacto/textura-diagonal.webp", impactoTextura(), 70);
  const coaches = [
    ["coach-martina", { fondo: N.naranja, piel: "#C98E6A", pelo: "#1A1A1A", remera: N.negro, acento: N.hueso, estilo: "cola", trama: N.negro }],
    ["coach-joaquin", { fondo: N.hueso, piel: "#E0B08C", pelo: "#3A2A1E", remera: N.negro, acento: N.naranja, estilo: "barba", trama: N.naranja }],
    ["coach-lucia", { fondo: "#1F1F1F", piel: "#8D5A3E", pelo: "#0E0E0E", remera: N.naranja, acento: N.negro, estilo: "rodete", trama: N.naranja }],
    ["coach-ramiro", { fondo: "#D7FF3A", piel: "#EFC7A5", pelo: "#6B4A2E", remera: N.negro, acento: N.naranja, estilo: "corto", trama: N.negro }],
  ];
  for (const [nombre, o] of coaches) await write(`impacto/${nombre}.webp`, busto(o));

  // Sereno
  await write("sereno/hero-retrato-calma.webp", serenoHero());
  for (const t of ["facial", "corporal", "relax", "manos"]) await write(`sereno/producto-${t}.webp`, serenoProducto(t));
  for (const c of [1, 2, 3]) {
    await write(`sereno/piel-caso-${c}-antes.webp`, serenoPiel(c, false));
    await write(`sereno/piel-caso-${c}-despues.webp`, serenoPiel(c, true));
  }
  const equipo = [
    ["equipo-valentina", { fondo: S.salvia, arco: S.lila, pelo: "#3B2F2A", piel: "#E8CDB8", ropa: S.marfil, estilo: "largo" }],
    ["equipo-camila", { fondo: S.lila, arco: S.niebla, pelo: "#1F1A18", piel: "#B98463", ropa: S.salviaOsc, estilo: "recogido" }],
    ["equipo-julieta", { fondo: "#D6DDD0", arco: S.salvia, pelo: "#8A5A3B", piel: "#F0D6C4", ropa: "#8F7FA3", estilo: "corto" }],
  ];
  for (const [nombre, o] of equipo) await write(`sereno/${nombre}.webp`, serenoRetrato(o));
  await write("sereno/espacio-cabina.webp", serenoEspacio());

  // Tech
  const avatares = [
    ["avatar-sofia", { fondo: "#C7D2FE", piel: "#E9C2A6", pelo: "#2B1B14", ropa: "#4338CA", estilo: "largo" }],
    ["avatar-matias", { fondo: "#A7F3D0", piel: "#C58C68", pelo: "#1A1A1A", ropa: "#0F172A", estilo: "corto" }],
    ["avatar-agustina", { fondo: "#FDE68A", piel: "#8D5A3E", pelo: "#1B1210", ropa: "#059669", estilo: "rulos" }],
  ];
  for (const [nombre, o] of avatares) await write(`tech/${nombre}.webp`, techAvatar(o), 88);
}

await main();
