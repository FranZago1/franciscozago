// Genera las ilustraciones de producto (WebP) de las demos de e-commerce.
// Uso: node scripts/demos/ecommerce.mjs [urbano|natural|tech-store]
// Todo es SVG propio rasterizado con `sharp` (ya viene con Next.js): no hay fotos de terceros.
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const root = join(import.meta.dirname, "..", "..", "public", "demos", "ecommerce");
const solo = process.argv[2];

let contador = 0;
const uid = (p = "g") => `${p}${++contador}`;

// ---------- Color ----------
function hexRgb(hex) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
function rgbHex([r, g, b]) {
  return "#" + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
}
/** Mezcla un color con otro (t = 0 → a, t = 1 → b). */
function mix(a, b, t) {
  const A = hexRgb(a);
  const B = hexRgb(b);
  return rgbHex(A.map((v, i) => v + ((B[i] ?? 0) - v) * t));
}
const claro = (c, t) => mix(c, "#ffffff", t);
const oscuro = (c, t) => mix(c, "#000000", t);

// ---------- Primitivas ----------
function svg(w, h, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
}

/** Fondo de estudio: degradé radial suave + viñeta leve. */
function estudio(w, h, color, { luz = 0.14, vineta = 0.1, cx = 0.5, cy = 0.38 } = {}) {
  const g = uid("bg");
  const v = uid("vi");
  return `<defs>
    <radialGradient id="${g}" cx="${cx}" cy="${cy}" r="0.85">
      <stop offset="0" stop-color="${claro(color, luz)}"/>
      <stop offset="1" stop-color="${color}"/>
    </radialGradient>
    <radialGradient id="${v}" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.6" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="${vineta}"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#${g})"/>
  <rect width="${w}" height="${h}" fill="url(#${v})"/>`;
}

/** Sombra difusa (elipse desenfocada). */
function sombra(cx, cy, rx, ry, op = 0.25, blur = 18, color = "#000") {
  const f = uid("sf");
  return `<defs><filter id="${f}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${blur}"/></filter></defs>
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}" opacity="${op}" filter="url(#${f})"/>`;
}

/** Sombra proyectada de una forma (la misma forma, desplazada y desenfocada). */
function sombraForma(d, { dx = 10, dy = 18, blur = 16, op = 0.22 } = {}) {
  const f = uid("sd");
  return `<defs><filter id="${f}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${blur}"/></filter></defs>
  <path d="${d}" transform="translate(${dx} ${dy})" fill="#000" opacity="${op}" filter="url(#${f})"/>`;
}

/** Relleno con volumen: color base + degradé lateral + brillo central. */
function volumen(d, color, { lado = 0.18, brillo = 0.12, vertical = 0.1, x1 = 0, x2 = 1 } = {}) {
  const gl = uid("vl");
  const gv = uid("vv");
  const clip = uid("vc");
  return `<defs>
    <linearGradient id="${gl}" x1="${x1}" x2="${x2}" y1="0" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity="${lado}"/>
      <stop offset="0.3" stop-color="#fff" stop-opacity="${brillo * 0.6}"/>
      <stop offset="0.5" stop-color="#fff" stop-opacity="${brillo}"/>
      <stop offset="0.75" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="${lado}"/>
    </linearGradient>
    <linearGradient id="${gv}" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="${vertical * 0.6}"/>
      <stop offset="1" stop-color="#000" stop-opacity="${vertical}"/>
    </linearGradient>
    <clipPath id="${clip}"><path d="${d}"/></clipPath>
  </defs>
  <path d="${d}" fill="${color}"/>
  <g clip-path="url(#${clip})"><rect x="-2000" y="-2000" width="6000" height="6000" fill="url(#${gv})"/></g>
  <path d="${d}" fill="url(#${gl})"/>`;
}

/** Pliegues de tela: trazos suaves desenfocados. */
function pliegues(paths, { op = 0.12, ancho = 10, blur = 5, color = "#000", clip } = {}) {
  const f = uid("pl");
  const c = clip ? uid("pc") : null;
  return `<defs><filter id="${f}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${blur}"/></filter>
  ${c ? `<clipPath id="${c}"><path d="${clip}"/></clipPath>` : ""}</defs>
  <g ${c ? `clip-path="url(#${c})"` : ""}><g filter="url(#${f})" fill="none" stroke="${color}" stroke-opacity="${op}" stroke-width="${ancho}" stroke-linecap="round">
  ${paths.map((p) => `<path d="${p}"/>`).join("")}</g></g>`;
}

/** Costura punteada. */
function costura(d, color, op = 0.35, w = 2.5) {
  return `<path d="${d}" fill="none" stroke="${color}" stroke-opacity="${op}" stroke-width="${w}" stroke-dasharray="7 6" stroke-linecap="round"/>`;
}

/** Textura de ruido muy leve para que las superficies no se vean planas. */
function grano(w, h, op = 0.06, seed = 3) {
  const f = uid("gr");
  return `<defs><filter id="${f}"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${seed}"/><feColorMatrix type="saturate" values="0"/></filter></defs>
  <rect width="${w}" height="${h}" filter="url(#${f})" opacity="${op}"/>`;
}

async function guardar(slug, nombre, svgText, calidad = 82) {
  const dir = join(root, slug);
  mkdirSync(dir, { recursive: true });
  await sharp(Buffer.from(svgText)).webp({ quality: calidad, effort: 5 }).toFile(join(dir, `${nombre}.webp`));
  console.log("✓", `${slug}/${nombre}.webp`);
}

// =====================================================================
// URBANO — Pampa Club
// =====================================================================

const U = { negro: "#0E0E0E", hueso: "#EDEBE6", acido: "#D4FF2E", gris: "#8E8E8A", arena: "#C9B79A" };

/** Remera oversize, vista frontal plana. `estampa` es SVG extra dentro del torso. */
function remera(color, estampa = "") {
  const d =
    "M410,250 C445,294 555,294 590,250 L700,268 C770,300 830,380 876,462 L798,548 C772,522 748,500 718,482 L716,968 C600,986 400,986 284,968 L282,482 C252,500 228,522 202,548 L124,462 C170,380 230,300 300,268 Z";
  const cuello = "M410,250 C445,294 555,294 590,250";
  const interior = "M414,252 C450,236 550,236 586,252 C552,288 448,288 414,252 Z";
  return `${sombraForma(d, { dx: 8, dy: 22, blur: 22, op: 0.28 })}
  ${volumen(d, color, { lado: 0.2, brillo: 0.1 })}
  <path d="${interior}" fill="${oscuro(color, 0.45)}"/>
  <path d="${cuello}" fill="none" stroke="${oscuro(color, 0.12)}" stroke-width="24" stroke-linecap="round"/>
  <path d="M418,262 C450,298 550,298 582,262" fill="none" stroke="${claro(color, 0.12)}" stroke-width="2" opacity="0.6"/>
  ${estampa}
  ${pliegues(
    [
      "M300,560 C320,700 310,820 330,940",
      "M690,540 C670,690 690,820 670,940",
      "M430,330 C470,420 520,430 560,330",
      "M220,470 C250,470 270,480 282,500",
      "M780,470 C750,470 730,480 718,500",
      "M360,900 C420,880 470,930 540,905",
    ],
    { op: 0.16, ancho: 14, blur: 9, clip: d },
  )}
  ${pliegues(["M520,560 C540,700 520,800 545,930", "M380,380 C400,520 380,640 405,760"], { op: 0.18, ancho: 8, blur: 7, color: "#fff", clip: d })}
  ${costura("M206,540 L128,456", oscuro(color, 0.4), 0.4)}
  ${costura("M794,540 L872,456", oscuro(color, 0.4), 0.4)}
  ${costura("M288,952 C400,968 600,968 712,952", oscuro(color, 0.4), 0.45)}`;
}

/** Buzo con capucha (hoodie), vista frontal plana. */
function hoodie(color, estampa = "") {
  const cuerpo =
    "M392,282 L300,300 C250,318 222,360 210,420 L150,930 C148,955 160,968 180,968 L236,968 C255,968 266,955 268,935 L292,560 L296,952 C400,966 600,966 704,952 L708,560 L732,935 C734,955 745,968 764,968 L820,968 C840,968 852,955 850,930 L790,420 C778,360 750,318 700,300 L608,282 Z";
  const capucha =
    "M372,300 C350,220 400,150 500,146 C600,150 650,220 628,300 C600,340 400,340 372,300 Z";
  const capInt = "M410,296 C398,236 440,196 500,194 C560,196 602,236 590,296 C560,318 440,318 410,296 Z";
  const bolsillo = "M372,700 L628,700 L668,870 L332,870 Z";
  const puno = (x) => `M${x},930 L${x + 90},930 L${x + 88},968 L${x + 2},968 Z`;
  return `${sombraForma(cuerpo, { dx: 10, dy: 24, blur: 24, op: 0.28 })}
  ${volumen(cuerpo, color, { lado: 0.22, brillo: 0.1 })}
  <path d="${puno(152)}" fill="${oscuro(color, 0.14)}"/><path d="${puno(758)}" fill="${oscuro(color, 0.14)}"/>
  <path d="M296,912 L704,912 L704,952 C600,966 400,966 296,952 Z" fill="${oscuro(color, 0.12)}"/>
  ${Array.from({ length: 40 }, (_, i) => `<line x1="${300 + i * 10.2}" y1="916" x2="${300 + i * 10.2}" y2="954" stroke="${oscuro(color, 0.25)}" stroke-width="1.5" opacity="0.5"/>`).join("")}
  ${sombraForma(capucha, { dx: 0, dy: 10, blur: 10, op: 0.3 })}
  ${volumen(capucha, oscuro(color, 0.04), { lado: 0.25, brillo: 0.14 })}
  <path d="${capInt}" fill="${oscuro(color, 0.4)}"/>
  <path d="M410,296 C440,312 560,312 590,296" fill="none" stroke="${oscuro(color, 0.2)}" stroke-width="10"/>
  <path d="M462,312 C458,420 452,480 448,520" fill="none" stroke="${claro(color, 0.6)}" stroke-width="7" stroke-linecap="round"/>
  <path d="M538,312 C542,420 548,470 552,510" fill="none" stroke="${claro(color, 0.6)}" stroke-width="7" stroke-linecap="round"/>
  <rect x="442" y="516" width="12" height="30" rx="4" fill="${U.gris}"/><rect x="546" y="506" width="12" height="30" rx="4" fill="${U.gris}"/>
  ${sombraForma(bolsillo, { dx: 0, dy: 6, blur: 6, op: 0.2 })}
  <path d="${bolsillo}" fill="${oscuro(color, 0.04)}"/>
  ${costura("M380,712 L620,712 L656,860 L344,860 Z", oscuro(color, 0.45), 0.5)}
  <path d="M372,700 L332,870" stroke="${oscuro(color, 0.25)}" stroke-width="4"/><path d="M628,700 L668,870" stroke="${oscuro(color, 0.25)}" stroke-width="4"/>
  ${estampa}
  ${pliegues(
    [
      "M250,460 C240,620 230,760 215,900",
      "M750,460 C760,620 770,760 785,900",
      "M320,420 C330,560 320,640 330,700",
      "M680,420 C670,560 680,640 670,700",
      "M292,560 C300,520 305,480 300,430",
      "M708,560 C700,520 695,480 700,430",
    ],
    { op: 0.2, ancho: 14, blur: 9, clip: cuerpo },
  )}
  ${pliegues(["M560,380 C575,500 560,600 575,690", "M200,560 C195,700 190,800 185,900"], { op: 0.14, ancho: 8, blur: 7, color: "#fff", clip: cuerpo })}
  ${mangas(color)}`;
}

/** Separación visible entre mangas y torso (sombra + costura). */
function mangas(color) {
  return `${pliegues(["M294,470 L270,930", "M706,470 L730,930"], { op: 0.32, ancho: 10, blur: 5 })}
  <path d="M292,520 L268,932 M708,520 L732,932" stroke="${oscuro(color, 0.35)}" stroke-width="3" fill="none"/>
  ${pliegues(["M300,300 C280,340 272,380 270,420", "M700,300 C720,340 728,380 730,420"], { op: 0.25, ancho: 8, blur: 4 })}`;
}

/** Buzo cuello redondo (crewneck). */
function crew(color, estampa = "") {
  const cuerpo =
    "M410,262 C445,302 555,302 590,262 L700,282 C752,300 778,346 790,420 L850,930 C852,955 840,968 820,968 L764,968 C745,968 734,955 732,935 L708,560 L704,952 C600,966 400,966 296,952 L292,560 L268,935 C266,955 255,968 236,968 L180,968 C160,968 148,955 150,930 L210,420 C222,346 248,300 300,282 Z";
  return `${sombraForma(cuerpo, { dx: 10, dy: 24, blur: 24, op: 0.26 })}
  ${volumen(cuerpo, color, { lado: 0.2, brillo: 0.1 })}
  <path d="M414,264 C450,248 550,248 586,264 C552,296 448,296 414,264 Z" fill="${oscuro(color, 0.4)}"/>
  <path d="M410,262 C445,302 555,302 590,262" fill="none" stroke="${oscuro(color, 0.1)}" stroke-width="30" stroke-linecap="round"/>
  <path d="M296,912 L704,912 L704,952 C600,966 400,966 296,952 Z" fill="${oscuro(color, 0.1)}"/>
  <path d="M152,926 L240,926 L238,968 L154,968 Z" fill="${oscuro(color, 0.12)}"/><path d="M760,926 L848,926 L846,968 L762,968 Z" fill="${oscuro(color, 0.12)}"/>
  ${estampa}
  ${pliegues(
    ["M250,460 C240,620 230,760 215,900", "M750,460 C760,620 770,760 785,900", "M330,600 C340,720 330,820 340,900", "M660,600 C650,720 670,820 660,900"],
    { op: 0.18, ancho: 14, blur: 9, clip: cuerpo },
  )}
  ${pliegues(["M540,380 C560,520 540,660 560,860"], { op: 0.14, ancho: 10, blur: 8, color: "#fff", clip: cuerpo })}
  ${mangas(color)}`;
}

/** Gorra de visera curva, vista 3/4 (visera hacia la izquierda). */
function gorra(color, visera, parche = "") {
  const copa = "M320,650 C300,470 400,352 560,346 C712,344 810,450 804,620 C806,660 780,686 700,694 C560,706 420,700 320,650 Z";
  const vis =
    "M332,630 C420,690 560,704 690,690 C640,748 520,790 380,800 C250,808 150,780 138,736 C130,700 170,668 250,650 C280,644 306,638 332,630 Z";
  const bajoVis = "M690,690 C640,748 520,790 380,800 C250,808 150,780 138,736 C150,790 260,824 390,818 C540,808 650,760 690,690 Z";
  return `${sombra(470, 830, 330, 40, 0.34, 22)}
  ${sombraForma(copa, { dx: 6, dy: 12, blur: 14, op: 0.2 })}
  ${volumen(copa, color, { lado: 0.28, brillo: 0.18, vertical: 0.22, x1: 0.1, x2: 0.9 })}
  <path d="M560,348 C500,420 470,520 468,690" fill="none" stroke="${oscuro(color, 0.32)}" stroke-width="3"/>
  <path d="M560,348 C640,410 690,500 700,690" fill="none" stroke="${oscuro(color, 0.3)}" stroke-width="3"/>
  <path d="M560,348 C450,380 370,450 330,560" fill="none" stroke="${oscuro(color, 0.22)}" stroke-width="3"/>
  <path d="M560,348 C700,380 780,460 800,560" fill="none" stroke="${oscuro(color, 0.22)}" stroke-width="3"/>
  ${costura("M548,356 C492,430 466,530 462,684", oscuro(color, 0.55), 0.35, 2)}
  ${costura("M574,354 C650,420 694,510 706,684", oscuro(color, 0.55), 0.35, 2)}
  <circle cx="420" cy="462" r="7" fill="${oscuro(color, 0.5)}"/><circle cx="676" cy="446" r="7" fill="${oscuro(color, 0.5)}"/>
  <ellipse cx="560" cy="350" rx="26" ry="12" fill="${oscuro(color, 0.1)}"/><ellipse cx="560" cy="346" rx="23" ry="9" fill="${claro(color, 0.1)}"/>
  <g transform="rotate(-4 575 560)">${parche}</g>
  ${sombraForma(vis, { dx: -6, dy: 18, blur: 16, op: 0.32 })}
  <path d="${bajoVis}" fill="${oscuro(visera, 0.35)}"/>
  ${volumen(vis, visera, { lado: 0.22, brillo: 0.2, vertical: 0.24, x1: 0, x2: 1 })}
  ${costura("M332,646 C420,700 560,712 668,700", oscuro(visera, 0.55), 0.5, 2.5)}
  ${costura("M170,736 C240,770 380,776 520,750", oscuro(visera, 0.55), 0.4, 2.5)}
  ${costura("M156,752 C240,792 400,796 560,764", oscuro(visera, 0.55), 0.35, 2.5)}`;
}

/** Zapatilla urbana de caña baja, perfil lateral (punta a la derecha). */
function zapatilla({ capellada, detalle, suela, cordon }) {
  const upper =
    "M146,724 C134,660 132,600 150,556 C160,536 178,530 196,538 C236,556 272,572 306,566 C336,560 356,540 372,512 L396,470 C404,454 424,448 440,456 L468,470 L640,592 C720,616 812,638 852,680 C868,696 868,718 856,726 Z";
  const talon = "M146,724 C134,660 132,600 150,556 C160,536 178,530 196,538 C214,546 230,554 246,560 C230,620 230,680 244,726 Z";
  const puntera = "M690,612 C760,628 822,648 852,680 C868,696 868,718 856,726 L690,728 C676,690 676,646 690,612 Z";
  const lengua = "M372,512 L392,430 C398,408 420,400 438,410 L472,432 C482,440 484,452 478,466 L456,500 Z";
  const franja1 = "M330,700 L560,560 L600,586 L380,720 Z";
  const franja2 = "M420,716 L610,600 L644,622 L468,724 Z";
  const suelaD = "M128,736 C126,716 136,706 156,706 L846,700 C888,700 910,720 908,746 C906,778 884,796 846,798 L170,806 C140,806 128,790 128,770 Z";
  const cl = uid("zc");
  return `${sombra(520, 812, 400, 26, 0.38, 16)}
  <defs><clipPath id="${cl}"><path d="${upper}"/></clipPath></defs>
  ${volumen(lengua, oscuro(capellada, 0.06), { lado: 0.2, brillo: 0.12, vertical: 0.2 })}
  <path d="M400,436 C410,424 428,422 444,432" fill="none" stroke="${detalle}" stroke-width="10" stroke-linecap="round"/>
  ${volumen(upper, capellada, { lado: 0.14, brillo: 0.16, vertical: 0.24 })}
  <g clip-path="url(#${cl})">
    ${volumen(talon, detalle, { lado: 0.1, brillo: 0.14, vertical: 0.2 })}
    ${volumen(puntera, detalle, { lado: 0.1, brillo: 0.14, vertical: 0.2 })}
    <path d="${franja1}" fill="${detalle}"/><path d="${franja2}" fill="${detalle}"/>
    ${costura("M338,694 L556,562 M428,708 L606,600", claro(detalle, 0.5), 0.5, 2)}
    <path d="M150,556 C160,536 178,530 196,538 C236,556 272,572 306,566 C336,560 356,540 372,512" fill="none" stroke="${oscuro(capellada, 0.3)}" stroke-width="14"/>
  </g>
  ${costura("M236,566 C224,620 224,680 236,720", oscuro(capellada, 0.4), 0.45, 2)}
  ${costura("M700,622 C690,660 690,700 698,724", oscuro(capellada, 0.4), 0.45, 2)}
  <path d="M420,470 L636,596" stroke="${oscuro(capellada, 0.18)}" stroke-width="26" stroke-linecap="round"/>
  ${[0, 1, 2, 3, 4, 5]
    .map((i) => {
      const x = 436 + i * 38;
      const y = 478 + i * 22.4;
      return `<circle cx="${x - 6}" cy="${y + 10}" r="5.5" fill="${oscuro(capellada, 0.45)}"/><path d="M${x - 8},${y + 12} C${x + 6},${y - 12} ${x + 22},${y - 14} ${x + 30},${y - 4}" fill="none" stroke="${cordon}" stroke-width="9" stroke-linecap="round"/>`;
    })
    .join("")}
  <path d="M430,462 C420,420 400,400 370,396" fill="none" stroke="${cordon}" stroke-width="8" stroke-linecap="round"/>
  <path d="M152,600 C144,580 146,560 156,548 L176,556 C168,570 166,586 170,604 Z" fill="${oscuro(detalle, 0.2)}"/>
  <rect x="176" y="588" width="46" height="18" rx="4" fill="${U.acido}" transform="rotate(8 199 597)"/>
  ${volumen(suelaD, suela, { lado: 0.05, brillo: 0.22, vertical: 0.34 })}
  <path d="M130,772 C132,796 146,806 170,806 L846,798 C884,796 906,778 908,752 C900,774 880,784 846,786 L170,792 C150,792 136,786 130,772 Z" fill="${oscuro(suela, 0.45)}"/>
  <path d="M140,722 L896,716" stroke="${oscuro(suela, 0.14)}" stroke-width="3"/>
  ${Array.from({ length: 22 }, (_, i) => `<line x1="${180 + i * 31}" y1="748" x2="${192 + i * 31}" y2="748" stroke="${oscuro(suela, 0.18)}" stroke-width="3" stroke-linecap="round"/>`).join("")}`;
}

/** Pantalón cargo, vista frontal. */
function cargo(color) {
  const d =
    "M330,210 L670,210 L676,280 C700,560 720,820 742,1100 L562,1112 L512,470 C508,452 492,452 488,470 L438,1112 L258,1100 C280,820 300,560 324,280 Z";
  return `${sombraForma(d, { dx: 10, dy: 22, blur: 22, op: 0.28 })}
  ${volumen(d, color, { lado: 0.18, brillo: 0.08 })}
  <path d="M330,210 L670,210 L672,252 L328,252 Z" fill="${oscuro(color, 0.12)}"/>
  ${[360, 440, 560, 640].map((x) => `<rect x="${x - 6}" y="206" width="12" height="54" rx="3" fill="${oscuro(color, 0.2)}"/>`).join("")}
  <path d="M500,252 L500,420" stroke="${oscuro(color, 0.3)}" stroke-width="3"/>
  ${costura("M516,256 C520,330 516,390 500,430", oscuro(color, 0.5), 0.5)}
  <path d="M334,262 C380,300 400,330 408,360" fill="none" stroke="${oscuro(color, 0.3)}" stroke-width="3"/>
  <path d="M666,262 C620,300 600,330 592,360" fill="none" stroke="${oscuro(color, 0.3)}" stroke-width="3"/>
  ${[
    [276, 600],
    [590, 600],
  ]
    .map(
      ([x, y]) => `${sombraForma(`M${x},${y} L${x + 134},${y} L${x + 140},${y + 190} L${x + 6},${y + 190} Z`, { dx: 0, dy: 6, blur: 5, op: 0.22 })}
      <path d="M${x},${y} L${x + 134},${y} L${x + 140},${y + 190} L${x + 6},${y + 190} Z" fill="${claro(color, 0.03)}"/>
      <path d="M${x - 2},${y - 4} L${x + 136},${y - 4} L${x + 138},${y + 44} L${x},${y + 44} Z" fill="${oscuro(color, 0.06)}"/>
      ${costura(`M${x + 8},${y + 52} L${x + 128},${y + 52}`, oscuro(color, 0.5), 0.45)}
      <rect x="${x + 58}" y="${y + 16}" width="22" height="14" rx="4" fill="${oscuro(color, 0.3)}"/>`,
    )
    .join("")}
  ${pliegues(
    ["M300,900 C340,920 380,900 420,930", "M580,900 C620,930 660,910 720,930", "M320,420 C360,520 350,560 380,640", "M680,420 C640,520 650,560 620,640", "M460,1000 C470,1040 460,1080 470,1100"],
    { op: 0.2, ancho: 12, blur: 8, clip: d },
  )}
  ${costura("M264,1086 L434,1096 M566,1096 L736,1086", oscuro(color, 0.5), 0.45)}`;
}

/** Campera rompevientos con bloques de color. */
function campera(c1, c2) {
  const cuerpo =
    "M404,238 L300,272 C250,290 222,336 210,410 L150,930 C148,955 160,968 180,968 L236,968 C255,968 266,955 268,935 L292,560 L296,952 C400,966 600,966 704,952 L708,560 L732,935 C734,955 745,968 764,968 L820,968 C840,968 852,955 850,930 L790,410 C778,336 750,290 700,272 L596,238 Z";
  const bloque = "M150,520 L850,520 L850,680 L150,680 Z";
  const cl = uid("cc");
  return `${sombraForma(cuerpo, { dx: 10, dy: 24, blur: 24, op: 0.28 })}
  ${volumen(cuerpo, c1, { lado: 0.22, brillo: 0.16 })}
  <defs><clipPath id="${cl}"><path d="${cuerpo}"/></clipPath></defs>
  <g clip-path="url(#${cl})"><path d="${bloque}" fill="${c2}"/><path d="${bloque}" fill="url(#none)"/>
  <rect x="150" y="520" width="700" height="160" fill="#000" opacity="0.06"/></g>
  <path d="M404,238 C420,200 580,200 596,238 L596,300 C560,316 440,316 404,300 Z" fill="${oscuro(c1, 0.1)}"/>
  <path d="M404,238 C420,214 580,214 596,238" fill="none" stroke="${oscuro(c1, 0.3)}" stroke-width="3"/>
  <path d="M500,212 L500,958" stroke="${oscuro(c1, 0.55)}" stroke-width="10"/>
  <path d="M500,212 L500,958" stroke="${claro(c1, 0.3)}" stroke-width="2" stroke-dasharray="3 5"/>
  <rect x="490" y="300" width="20" height="44" rx="5" fill="#bdbdbd"/><rect x="496" y="340" width="8" height="30" rx="3" fill="#9a9a9a"/>
  <path d="M296,912 L704,912 L704,952 C600,966 400,966 296,952 Z" fill="${oscuro(c1, 0.14)}"/>
  ${pliegues(
    ["M250,440 C240,620 230,760 215,900", "M750,440 C760,620 770,760 785,900", "M340,700 C350,780 330,850 350,900", "M660,700 C650,780 670,850 650,900", "M360,380 C400,420 420,460 430,500"],
    { op: 0.22, ancho: 12, blur: 8, clip: cuerpo },
  )}
  ${pliegues(["M580,340 C600,440 590,520 600,600", "M210,700 C200,780 195,840 190,900", "M790,700 C800,780 805,840 810,900"], { op: 0.22, ancho: 8, blur: 6, color: "#fff", clip: cuerpo })}
  ${mangas(c1)}`;
}

/** Riñonera. */
function rinonera(color, acento) {
  const d = "M250,560 C250,500 300,470 380,466 L620,466 C700,470 750,500 750,560 L750,700 C750,760 700,790 620,792 L380,792 C300,790 250,760 250,700 Z";
  const correa = "M90,588 L910,588 L910,636 L90,636 Z";
  return `${sombraForma(correa, { dx: 4, dy: 12, blur: 10, op: 0.25 })}
  ${volumen(correa, oscuro(color, 0.15), { lado: 0.1, brillo: 0.08, vertical: 0.3 })}
  ${costura("M92,596 L908,596 M92,628 L908,628", claro(color, 0.4), 0.35, 2)}
  <rect x="800" y="578" width="74" height="68" rx="10" fill="#2a2a2a"/><rect x="812" y="592" width="50" height="40" rx="6" fill="#3a3a3a"/>
  ${sombra(500, 820, 280, 30, 0.3, 18)}
  ${volumen(d, color, { lado: 0.26, brillo: 0.18, vertical: 0.3 })}
  <path d="M270,540 C320,520 680,520 730,540" fill="none" stroke="${oscuro(color, 0.5)}" stroke-width="8"/>
  <path d="M270,540 C320,520 680,520 730,540" fill="none" stroke="${claro(color, 0.3)}" stroke-width="2" stroke-dasharray="3 4"/>
  <path d="M640,528 L676,528 L676,590" fill="none" stroke="${acento}" stroke-width="8" stroke-linecap="round"/>
  <rect x="660" y="586" width="32" height="40" rx="8" fill="${acento}"/>
  <rect x="380" y="620" width="240" height="70" rx="12" fill="${acento}"/>
  <text x="500" y="668" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="34" letter-spacing="4" fill="${U.negro}">PAMPA</text>
  ${costura("M268,700 C290,760 340,772 400,774 L600,774 C660,772 710,760 732,700", oscuro(color, 0.5), 0.5)}
  <rect x="440" y="720" width="120" height="14" rx="7" fill="${oscuro(color, 0.3)}"/>`;
}

/** Par de medias. */
function medias(c1, c2) {
  const media = (dx, c, rot) => {
    const d = "M380,200 L520,200 L524,640 C526,700 560,730 620,760 C680,790 700,860 650,900 C600,940 520,920 440,860 C390,820 380,760 380,700 Z";
    return `<g transform="translate(${dx} 0) rotate(${rot} 450 560)">
    ${sombraForma(d, { dx: 8, dy: 16, blur: 16, op: 0.25 })}
    ${volumen(d, c, { lado: 0.16, brillo: 0.12 })}
    <path d="M380,200 L520,200 L520,300 L380,300 Z" fill="${oscuro(c, 0.06)}"/>
    ${Array.from({ length: 14 }, (_, i) => `<line x1="${388 + i * 9.5}" y1="204" x2="${388 + i * 9.5}" y2="296" stroke="${oscuro(c, 0.2)}" stroke-width="2"/>`).join("")}
    <rect x="380" y="330" width="140" height="22" fill="${c2}"/><rect x="380" y="368" width="140" height="22" fill="${c2}"/>
    <path d="M560,736 C640,760 700,840 660,890 C640,915 600,925 560,910 C600,860 600,790 560,736 Z" fill="${c2}" opacity="0.95"/>
    </g>`;
  };
  return `<g transform="translate(40 60)">${media(110, oscuro(c1, 0.05), 0)}</g>` + media(-150, c1, 0);
}

/** Estampas. */
const estampaLogoPecho = (color) =>
  `<g transform="translate(600 380)"><circle r="30" fill="none" stroke="${color}" stroke-width="7"/><path d="M-14,12 L0,-16 L14,12" fill="none" stroke="${color}" stroke-width="7" stroke-linejoin="round"/></g>`;
const estampaGrande = (color, fondo) => `<g transform="translate(500 590)">
  <circle r="150" fill="${color}"/>
  ${Array.from({ length: 16 }, (_, i) => `<rect x="-6" y="-196" width="12" height="34" rx="3" fill="${color}" transform="rotate(${i * 22.5})"/>`).join("")}
  <text x="0" y="22" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="76" letter-spacing="2" fill="${fondo}" transform="scale(0.82 1)">PAMPA</text>
  <text x="0" y="78" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="28" letter-spacing="14" fill="${fondo}">CLUB</text>
  </g>`;
const estampaTexto = (color, texto = "ASFALTO", sub = "DROP 07 — CBA") => `<g transform="translate(500 470)">
  <text x="0" y="0" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="96" fill="${color}" transform="scale(0.72 1)" letter-spacing="-2">${texto}</text>
  <text x="0" y="46" text-anchor="middle" font-family="DejaVu Sans Mono" font-size="22" letter-spacing="8" fill="${color}" opacity="0.85">${sub}</text>
  </g>`;

async function urbano() {
  const W = 1000;
  const H = 1250;
  const fondo = (c, extra = "") => estudio(W, H, c, { luz: 0.12, vineta: 0.12 }) + extra;
  const centrar = (s, sc = 1, dy = 0) => `<g transform="translate(${500 - 500 * sc} ${625 - 600 * sc + dy}) scale(${sc})">${s}</g>`;
  const items = [
    ["remera-pampa-negra", fondo("#E4E2DC") + centrar(remera(U.negro, estampaTexto(U.acido, "PAMPA", "CLUB DE BARRIO")), 0.94, 20)],
    ["remera-sol-hueso", fondo("#CFCDC6") + centrar(remera("#F3F1EA", estampaGrande(U.negro, "#F3F1EA")), 0.94, 20)],
    ["remera-basica-acida", fondo("#1A1A1A", "") + centrar(remera(U.acido, estampaLogoPecho(U.negro)), 0.94, 20)],
    ["hoodie-acido", fondo("#E4E2DC") + centrar(hoodie(U.acido, estampaLogoPecho(U.negro)), 0.95, 30)],
    ["hoodie-negro", fondo("#D5D3CC") + centrar(hoodie("#161616", `<g transform="translate(0 40)">${estampaTexto("#EDEBE6", "NOCHE", "PAMPA CLUB — CBA")}</g>`), 0.95, 30)],
    ["crew-gris", fondo("#1C1C1C") + centrar(crew("#9C9C98", estampaTexto(U.negro, "CLUB", "EST. 2019 — CBA")), 0.95, 30)],
    ["cargo-arena", fondo("#E4E2DC") + centrar(cargo(U.arena), 0.9, -20)],
    ["cargo-negro", fondo("#D2FF3A") + centrar(cargo("#1B1B1B"), 0.9, -20)],
    ["campera-rompevientos", fondo("#E4E2DC") + centrar(campera("#151515", U.acido), 0.95, 30)],
    ["gorra-negra", fondo("#D2FF3A") + centrar(gorra("#141414", "#141414", `<g transform="translate(560 560) skewY(-6)"><rect x="-70" y="-40" width="140" height="70" rx="6" fill="${U.acido}"/><text x="0" y="12" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="34" fill="#141414" transform="scale(0.85 1)">PAMPA</text></g>`), 1, 30)],
    ["gorra-hueso", fondo("#1A1A1A") + centrar(gorra("#EFECE4", U.negro, `<g transform="translate(560 560) skewY(-6)">${estampaLogoPecho(U.negro).replace("translate(600 380)", "translate(0 0)")}</g>`), 1, 30)],
    ["zapatilla-pista", fondo("#E4E2DC") + centrar(zapatilla({ capellada: "#F4F2EC", detalle: U.negro, suela: "#F7F6F2", cordon: "#EDEBE6" }), 1, 10)],
    ["zapatilla-acida", fondo("#1A1A1A") + centrar(zapatilla({ capellada: "#222222", detalle: U.acido, suela: "#EDEBE6", cordon: "#2c2c2c" }), 1, 10)],
    ["rinonera-negra", fondo("#E4E2DC") + centrar(rinonera("#1A1A1A", U.acido), 1, -20)],
    ["medias-pack", fondo("#D2FF3A") + centrar(medias("#F2F0EA", U.negro), 0.92, 10)],
  ];
  for (const [nombre, cuerpo] of items) await guardar("urbano", nombre, svg(W, H, cuerpo + grano(W, H, 0.05)));

  // Lookbook: outfits armados en flat lay, con tipografía grande.
  const g = (s, x, y, sc, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc}) translate(-500 -600)">${s}</g>`;
  const LW = 1200;
  const LH = 1500;
  const look = (bg, tipo, color, piezas) =>
    svg(
      LW,
      LH,
      estudio(LW, LH, bg, { luz: 0.1, vineta: 0.16 }) +
        piezas +
        `<text x="64" y="104" font-family="DejaVu Sans Mono" font-size="30" letter-spacing="6" fill="${color}" opacity="0.7">${tipo}</text>` +
        grano(LW, LH, 0.05),
    );
  const zapBlanca = zapatilla({ capellada: "#F4F2EC", detalle: U.negro, suela: "#F7F6F2", cordon: "#EDEBE6" });
  const zapNegra = zapatilla({ capellada: "#222222", detalle: U.acido, suela: "#EDEBE6", cordon: "#2c2c2c" });
  await guardar(
    "urbano",
    "lookbook-01",
    look("#E0DED7", "LOOK 01 / CALLE", U.negro, g(cargo("#1B1B1B"), 820, 900, 0.66, 4) + g(hoodie(U.acido, estampaLogoPecho(U.negro)), 440, 560, 0.7, -5) + g(gorra("#141414", "#141414"), 930, 330, 0.44, 8) + g(zapBlanca, 360, 1200, 0.56, -6)),
  );
  await guardar(
    "urbano",
    "lookbook-02",
    look("#D2FF3A", "LOOK 02 / VERANO", U.negro, g(cargo(U.arena), 830, 900, 0.66, -3) + g(remera(U.negro, estampaTexto(U.acido, "PAMPA", "CLUB DE BARRIO")), 420, 560, 0.72, 5) + g(rinonera("#1A1A1A", U.acido), 880, 330, 0.42, -8) + g(zapNegra, 360, 1210, 0.56, 5)),
  );
  await guardar(
    "urbano",
    "lookbook-03",
    look("#161616", "LOOK 03 / NOCHE", "#ffffff", g(cargo("#8E8E8A"), 830, 900, 0.66, 3) + g(campera("#151515", U.acido), 430, 560, 0.72, -4) + g(gorra("#EFECE4", U.negro), 920, 330, 0.44, -8) + g(medias("#F2F0EA", U.negro), 330, 1190, 0.4, 10)),
  );
  // Hero del drop: hoodie grande sobre ácido.
  const HW = 1400;
  const HH = 1400;
  await guardar(
    "urbano",
    "drop-hero",
    svg(
      HW,
      HH,
      estudio(HW, HH, U.acido, { luz: 0.18, vineta: 0.16 }) +
        `<text x="${HW / 2}" y="${HH / 2 + 120}" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="420" fill="${U.negro}" opacity="0.08" transform="scale(1 1)" letter-spacing="-10">07</text>` +
        g(hoodie("#161616", `<g transform="translate(0 40)">${estampaTexto(U.acido)}</g>`), 700, 700, 1.02, -4) +
        grano(HW, HH, 0.05),
    ),
  );
}

// =====================================================================
// NATURAL — Hoja & Barro
// =====================================================================

const N = {
  salvia: "#B8C4A6",
  oliva: "#6F7A4E",
  olivaOsc: "#3F4A2C",
  rosa: "#E3B9AC",
  rosaOsc: "#B9796C",
  piedra: "#DAD6CA",
  musgo: "#8C9870",
  papel: "#F4F1E9",
};

/** Etiqueta con marca y nombre (texto centrado). */
function etiqueta(cx, cy, w, h, { fondo = N.papel, tinta = N.olivaOsc, nombre = "", sub = "", radio = 6, marca = true } = {}) {
  return `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${radio}" fill="${fondo}"/>
  <rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${radio}" fill="url(#none)" stroke="${oscuro(fondo, 0.08)}" stroke-width="1.5"/>
  ${marca ? `<text x="${cx}" y="${cy - h / 2 + 34}" text-anchor="middle" font-family="DejaVu Sans" font-size="15" letter-spacing="5" fill="${tinta}" opacity="0.8">HOJA &amp; BARRO</text>` : ""}
  <path d="M${cx - 16},${cy - h / 2 + 50} L${cx + 16},${cy - h / 2 + 50}" stroke="${tinta}" stroke-width="1.5" opacity="0.5"/>
  ${nombre ? `<text x="${cx}" y="${cy + 8}" text-anchor="middle" font-family="DejaVu Serif" font-style="italic" font-size="34" fill="${tinta}">${nombre}</text>` : ""}
  ${sub ? `<text x="${cx}" y="${cy + 44}" text-anchor="middle" font-family="DejaVu Sans" font-size="14" letter-spacing="3" fill="${tinta}" opacity="0.7">${sub}</text>` : ""}`;
}

/** Sombreado cilíndrico sobre una forma (brillo a la izquierda, sombra a la derecha). */
function cilindrico(d, color, { brillo = 0.35, sombraLado = 0.3 } = {}) {
  const gl = uid("cy");
  return `<defs><linearGradient id="${gl}" x1="0" x2="1" y1="0" y2="0">
    <stop offset="0" stop-color="#000" stop-opacity="${sombraLado * 0.6}"/>
    <stop offset="0.18" stop-color="#fff" stop-opacity="${brillo * 0.5}"/>
    <stop offset="0.28" stop-color="#fff" stop-opacity="${brillo}"/>
    <stop offset="0.42" stop-color="#fff" stop-opacity="0"/>
    <stop offset="0.8" stop-color="#000" stop-opacity="${sombraLado * 0.5}"/>
    <stop offset="1" stop-color="#000" stop-opacity="${sombraLado}"/>
  </linearGradient></defs>
  <path d="${d}" fill="${color}"/><path d="${d}" fill="url(#${gl})"/>`;
}

/** Rama con hojas (eucalipto/olivo) como decoración. */
function rama(x, y, s, rot, color, n = 7) {
  const hojas = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const px = t * 380;
    const py = -Math.sin(t * 2.4) * 60;
    const lado = i % 2 === 0 ? -1 : 1;
    const a = lado * (40 + t * 10) - 10;
    const tam = 1 - t * 0.45;
    return `<g transform="translate(${px} ${py}) rotate(${a}) scale(${tam})"><path d="M0,0 C18,-30 70,-40 110,-8 C70,20 20,20 0,0 Z" fill="${i % 3 === 0 ? oscuro(color, 0.1) : color}"/><path d="M4,-2 C40,-14 70,-14 104,-8" fill="none" stroke="${claro(color, 0.35)}" stroke-width="2" opacity="0.7"/></g>`;
  }).join("");
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <path d="M-20,10 C80,-20 200,-60 390,-40" fill="none" stroke="${oscuro(color, 0.25)}" stroke-width="6" stroke-linecap="round"/>
    ${hojas}</g>`;
}

/** Sombra de hojas proyectada sobre la escena. */
function sombraHojas(w, h, op = 0.1) {
  const f = uid("sh");
  const hojas = Array.from({ length: 9 }, (_, i) => {
    const x = 60 + (i % 3) * 120 + i * 16;
    const y = 40 + Math.floor(i / 3) * 110 + (i % 2) * 30;
    return `<path transform="translate(${x} ${y}) rotate(${30 + i * 17}) scale(1.4)" d="M0,0 C30,-50 110,-60 170,-10 C110,30 30,30 0,0 Z"/>`;
  }).join("");
  return `<defs><filter id="${f}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter></defs>
  <g filter="url(#${f})" fill="#1f2614" opacity="${op}">${hojas}<path d="M0,120 C200,160 360,300 520,520" stroke="#1f2614" stroke-width="10" fill="none"/></g>`;
}

/** Escena: fondo, arco y pedestal. Devuelve el SVG del fondo; el producto se apoya en y = 930. */
function escena(w, h, fondo, { arco = true, pedestal = N.piedra, hojas = true } = {}) {
  const ped = `M${w / 2 - 300},930 L${w / 2 - 300},${h + 20} L${w / 2 + 300},${h + 20} L${w / 2 + 300},930 Z`;
  return `${estudio(w, h, fondo, { luz: 0.16, vineta: 0.12, cy: 0.3 })}
  ${arco ? `<path d="M${w / 2 - 330},${h} L${w / 2 - 330},520 A330,330 0 0 1 ${w / 2 + 330},520 L${w / 2 + 330},${h} Z" fill="${claro(fondo, 0.18)}"/>` : ""}
  ${hojas ? sombraHojas(w, h, 0.09) : ""}
  ${cilindrico(ped, pedestal, { brillo: 0.25, sombraLado: 0.22 })}
  <ellipse cx="${w / 2}" cy="930" rx="300" ry="56" fill="${claro(pedestal, 0.22)}"/>
  <ellipse cx="${w / 2}" cy="930" rx="300" ry="56" fill="none" stroke="${oscuro(pedestal, 0.1)}" stroke-width="2"/>`;
}

/** Frasco gotero. */
function gotero(cx, base, { vidrio = "#6E7B4C", etiquetaColor = N.papel, nombre = "Sérum", sub = "30 ML", tapa = "#2B2B26" } = {}) {
  const r = 110;
  const cuerpo = `M${cx - r},${base - 20} L${cx - r},${base - 330} C${cx - r},${base - 380} ${cx - 50},${base - 400} ${cx - 42},${base - 430} L${cx + 42},${base - 430} C${cx + 50},${base - 400} ${cx + r},${base - 380} ${cx + r},${base - 330} L${cx + r},${base - 20} C${cx + r},${base - 6} ${cx + r - 14},${base} ${cx + r - 28},${base} L${cx - r + 28},${base} C${cx - r + 14},${base} ${cx - r},${base - 6} ${cx - r},${base - 20} Z`;
  const aro = `M${cx - 52},${base - 430} L${cx + 52},${base - 430} L${cx + 50},${base - 500} L${cx - 50},${base - 500} Z`;
  const pera = `M${cx - 34},${base - 500} L${cx - 34},${base - 590} C${cx - 34},${base - 640} ${cx + 34},${base - 640} ${cx + 34},${base - 590} L${cx + 34},${base - 500} Z`;
  return `${sombra(cx + 30, base + 4, r + 40, 18, 0.35, 12)}
  ${cilindrico(cuerpo, vidrio, { brillo: 0.4, sombraLado: 0.35 })}
  <path d="M${cx - r + 18},${base - 60} L${cx - r + 18},${base - 320}" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity="0.35"/>
  ${etiqueta(cx, base - 190, 176, 190, { fondo: etiquetaColor, nombre, sub })}
  ${cilindrico(aro, tapa, { brillo: 0.25, sombraLado: 0.4 })}
  ${Array.from({ length: 9 }, (_, i) => `<line x1="${cx - 44 + i * 11}" y1="${base - 496}" x2="${cx - 44 + i * 11}" y2="${base - 434}" stroke="#000" stroke-opacity="0.25" stroke-width="2"/>`).join("")}
  ${cilindrico(pera, oscuro(tapa, 0.1), { brillo: 0.3, sombraLado: 0.4 })}`;
}

/** Pote bajo con tapa. */
function pote(cx, base, { cuerpo = "#EDE9E0", tapa = "#A9825E", nombre = "Crema", sub = "50 ML", abierto = false, contenido = "#F3EEE4" } = {}) {
  const r = 170;
  const alto = 170;
  const body = `M${cx - r},${base - alto} L${cx - r},${base - 16} C${cx - r},${base + 10} ${cx + r},${base + 10} ${cx + r},${base - 16} L${cx + r},${base - alto} Z`;
  const tapaD = `M${cx - r - 6},${base - alto - 90} L${cx - r - 6},${base - alto - 4} C${cx - r - 6},${base - alto + 26} ${cx + r + 6},${base - alto + 26} ${cx + r + 6},${base - alto - 4} L${cx + r + 6},${base - alto - 90} Z`;
  const vetas = Array.from({ length: 8 }, (_, i) => `<path d="M${cx - r + i * 44},${base - alto - 86} C${cx - r + 20 + i * 44},${base - alto - 60} ${cx - r - 10 + i * 44},${base - alto - 30} ${cx - r + 14 + i * 44},${base - alto}" fill="none" stroke="${oscuro(tapa, 0.25)}" stroke-width="2" opacity="0.4"/>`).join("");
  const top = abierto
    ? `<ellipse cx="${cx}" cy="${base - alto}" rx="${r}" ry="40" fill="${oscuro(cuerpo, 0.08)}"/><ellipse cx="${cx}" cy="${base - alto + 6}" rx="${r - 14}" ry="32" fill="${contenido}"/>
       <path d="M${cx - 60},${base - alto + 4} C${cx - 20},${base - alto - 20} ${cx + 30},${base - alto + 20} ${cx + 70},${base - alto - 4}" fill="none" stroke="${claro(contenido, 0.3)}" stroke-width="8" stroke-linecap="round"/>`
    : `${cilindrico(tapaD, tapa, { brillo: 0.3, sombraLado: 0.35 })}${vetas}<ellipse cx="${cx}" cy="${base - alto - 90}" rx="${r + 6}" ry="40" fill="${claro(tapa, 0.12)}"/>
       <ellipse cx="${cx}" cy="${base - alto - 90}" rx="${r - 30}" ry="26" fill="none" stroke="${oscuro(tapa, 0.2)}" stroke-width="2" opacity="0.5"/>`;
  return `${sombra(cx + 30, base + 6, r + 50, 20, 0.35, 14)}
  ${cilindrico(body, cuerpo, { brillo: 0.35, sombraLado: 0.3 })}
  ${etiqueta(cx, base - alto / 2 + 4, 250, 120, { fondo: claro(cuerpo, 0.4), nombre, sub, marca: false })}
  <text x="${cx}" y="${base - alto / 2 - 30}" text-anchor="middle" font-family="DejaVu Sans" font-size="13" letter-spacing="5" fill="${N.olivaOsc}" opacity="0.8">HOJA &amp; BARRO</text>
  ${top}`;
}

/** Pomo (tubo) parado sobre la tapa. */
function pomo(cx, base, { color = "#E9E3D6", tapa = N.oliva, nombre = "Limpiador", sub = "150 ML", ancho = 200, alto = 560 } = {}) {
  const w = ancho / 2;
  const tapaD = `M${cx - 58},${base - 70} L${cx - 58},${base - 12} C${cx - 58},${base + 6} ${cx + 58},${base + 6} ${cx + 58},${base - 12} L${cx + 58},${base - 70} Z`;
  const tubo = `M${cx - w + 30},${base - 70} C${cx - w},${base - 120} ${cx - w},${base - 200} ${cx - w},${base - 260} L${cx - w - 16},${base - alto + 30} L${cx + w + 16},${base - alto + 30} L${cx + w},${base - 260} C${cx + w},${base - 200} ${cx + w},${base - 120} ${cx + w - 30},${base - 70} Z`;
  const pliegue = `M${cx - w - 20},${base - alto} L${cx + w + 20},${base - alto} L${cx + w + 16},${base - alto + 34} L${cx - w - 16},${base - alto + 34} Z`;
  return `${sombra(cx + 24, base + 4, 110, 16, 0.35, 12)}
  ${cilindrico(tubo, color, { brillo: 0.45, sombraLado: 0.28 })}
  ${cilindrico(pliegue, oscuro(color, 0.05), { brillo: 0.3, sombraLado: 0.3 })}
  ${Array.from({ length: 16 }, (_, i) => `<line x1="${cx - w - 10 + i * ((2 * w + 20) / 15)}" y1="${base - alto + 4}" x2="${cx - w - 10 + i * ((2 * w + 20) / 15)}" y2="${base - alto + 30}" stroke="#000" stroke-opacity="0.12" stroke-width="2"/>`).join("")}
  <text x="${cx}" y="${base - alto + 120}" text-anchor="middle" font-family="DejaVu Sans" font-size="14" letter-spacing="5" fill="${N.olivaOsc}" opacity="0.8">HOJA &amp; BARRO</text>
  <text x="${cx}" y="${base - 300}" text-anchor="middle" font-family="DejaVu Serif" font-style="italic" font-size="36" fill="${N.olivaOsc}">${nombre}</text>
  <path d="M${cx - 18},${base - 276} L${cx + 18},${base - 276}" stroke="${N.olivaOsc}" stroke-width="1.5" opacity="0.5"/>
  <text x="${cx}" y="${base - 244}" text-anchor="middle" font-family="DejaVu Sans" font-size="13" letter-spacing="3" fill="${N.olivaOsc}" opacity="0.7">${sub}</text>
  ${cilindrico(tapaD, tapa, { brillo: 0.3, sombraLado: 0.35 })}
  ${Array.from({ length: 10 }, (_, i) => `<line x1="${cx - 52 + i * 11.5}" y1="${base - 66}" x2="${cx - 52 + i * 11.5}" y2="${base - 8}" stroke="#000" stroke-opacity="0.15" stroke-width="2"/>`).join("")}`;
}

/** Frasco con bomba (aceite / sérum corporal). */
function bomba(cx, base, { vidrio = "#D9CFB8", nombre = "Aceite", sub = "100 ML", tapa = "#2E2E28", liquido = "#C9A55B", spray = false } = {}) {
  const r = 100;
  const cuerpo = `M${cx - r},${base - 20} L${cx - r},${base - 380} C${cx - r},${base - 420} ${cx - 60},${base - 430} ${cx - 44},${base - 440} L${cx + 44},${base - 440} C${cx + 60},${base - 430} ${cx + r},${base - 420} ${cx + r},${base - 380} L${cx + r},${base - 20} C${cx + r},${base - 4} ${cx + r - 16},${base} ${cx + r - 30},${base} L${cx - r + 30},${base} C${cx - r + 16},${base} ${cx - r},${base - 4} ${cx - r},${base - 20} Z`;
  const liq = `M${cx - r + 8},${base - 300} L${cx + r - 8},${base - 300} L${cx + r - 8},${base - 24} C${cx + r - 8},${base - 12} ${cx + r - 20},${base - 8} ${cx + r - 34},${base - 8} L${cx - r + 34},${base - 8} C${cx - r + 20},${base - 8} ${cx - r + 8},${base - 12} ${cx - r + 8},${base - 24} Z`;
  const aro = `M${cx - 50},${base - 440} L${cx + 50},${base - 440} L${cx + 50},${base - 490} L${cx - 50},${base - 490} Z`;
  const cabezal = spray
    ? `M${cx - 34},${base - 490} L${cx + 34},${base - 490} L${cx + 34},${base - 580} C${cx + 34},${base - 600} ${cx - 34},${base - 600} ${cx - 34},${base - 580} Z`
    : `M${cx - 18},${base - 490} L${cx + 18},${base - 490} L${cx + 18},${base - 560} L${cx + 90},${base - 560} L${cx + 96},${base - 590} L${cx - 30},${base - 590} L${cx - 30},${base - 560} L${cx - 18},${base - 560} Z`;
  return `${sombra(cx + 30, base + 4, r + 40, 18, 0.35, 12)}
  <path d="${cuerpo}" fill="${vidrio}" opacity="0.9"/>
  <path d="${liq}" fill="${liquido}" opacity="0.85"/>
  ${cilindrico(cuerpo, "transparent", { brillo: 0.45, sombraLado: 0.3 })}
  <path d="M${cx - r + 16},${base - 60} L${cx - r + 16},${base - 360}" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity="0.45"/>
  ${etiqueta(cx, base - 200, 160, 200, { nombre, sub })}
  ${cilindrico(aro, tapa, { brillo: 0.25, sombraLado: 0.4 })}
  ${cilindrico(cabezal, tapa, { brillo: 0.3, sombraLado: 0.4 })}
  ${spray ? `<rect x="${cx + 30}" y="${base - 562}" width="12" height="8" rx="2" fill="#111"/>` : ""}`;
}

/** Jabón en barra sobre plato de cerámica. */
function jabon(cx, base, { color = "#E6C9BE", sello = "HOJA", plato = "#EFEBE3" } = {}) {
  const platoD = `M${cx - 260},${base - 30} C${cx - 250},${base + 20} ${cx + 250},${base + 20} ${cx + 260},${base - 30} Z`;
  const barraTop = `M${cx - 190},${base - 150} C${cx - 190},${base - 180} ${cx - 170},${base - 196} ${cx - 130},${base - 200} L${cx + 130},${base - 200} C${cx + 170},${base - 196} ${cx + 190},${base - 180} ${cx + 190},${base - 150} C${cx + 190},${base - 120} ${cx + 170},${base - 104} ${cx + 130},${base - 100} L${cx - 130},${base - 100} C${cx - 170},${base - 104} ${cx - 190},${base - 120} ${cx - 190},${base - 150} Z`;
  const barraLado = `M${cx - 190},${base - 150} L${cx - 190},${base - 90} C${cx - 190},${base - 60} ${cx - 170},${base - 44} ${cx - 130},${base - 40} L${cx + 130},${base - 40} C${cx + 170},${base - 44} ${cx + 190},${base - 60} ${cx + 190},${base - 90} L${cx + 190},${base - 150} C${cx + 190},${base - 120} ${cx + 170},${base - 104} ${cx + 130},${base - 100} L${cx - 130},${base - 100} C${cx - 170},${base - 104} ${cx - 190},${base - 120} ${cx - 190},${base - 150} Z`;
  return `${sombra(cx + 20, base + 6, 280, 26, 0.3, 14)}
  <ellipse cx="${cx}" cy="${base - 30}" rx="262" ry="60" fill="${oscuro(plato, 0.08)}"/>
  ${cilindrico(platoD, plato, { brillo: 0.3, sombraLado: 0.2 })}
  <ellipse cx="${cx}" cy="${base - 34}" rx="256" ry="56" fill="${plato}"/>
  <ellipse cx="${cx}" cy="${base - 30}" rx="210" ry="40" fill="${oscuro(plato, 0.05)}"/>
  ${sombra(cx + 10, base - 36, 200, 20, 0.35, 8)}
  ${cilindrico(barraLado, oscuro(color, 0.08), { brillo: 0.25, sombraLado: 0.3 })}
  <path d="${barraTop}" fill="${claro(color, 0.08)}"/>
  <ellipse cx="${cx}" cy="${base - 150}" rx="120" ry="28" fill="none" stroke="${oscuro(color, 0.18)}" stroke-width="4"/>
  <text x="${cx}" y="${base - 142}" text-anchor="middle" font-family="DejaVu Serif" font-size="24" letter-spacing="6" fill="${oscuro(color, 0.22)}" transform="translate(0 ${-(base - 150) * 0.0}) ">${sello}</text>
  <path d="M${cx - 150},${base - 178} C${cx - 60},${base - 196} ${cx + 60},${base - 196} ${cx + 150},${base - 178}" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.35"/>`;
}

/** Lata de bálsamo. */
function lata(cx, base, { color = N.oliva, nombre = "Bálsamo" } = {}) {
  const r = 150;
  const cuerpo = `M${cx - r},${base - 100} L${cx - r},${base - 14} C${cx - r},${base + 12} ${cx + r},${base + 12} ${cx + r},${base - 14} L${cx + r},${base - 100} Z`;
  return `${sombra(cx + 24, base + 6, r + 40, 18, 0.35, 12)}
  ${cilindrico(cuerpo, "#BFB9AE", { brillo: 0.55, sombraLado: 0.35 })}
  <path d="M${cx - r - 4},${base - 150} L${cx - r - 4},${base - 96} C${cx - r - 4},${base - 70} ${cx + r + 4},${base - 70} ${cx + r + 4},${base - 96} L${cx + r + 4},${base - 150} Z" fill="${oscuro(color, 0.08)}"/>
  ${cilindrico(`M${cx - r - 4},${base - 150} L${cx - r - 4},${base - 96} C${cx - r - 4},${base - 70} ${cx + r + 4},${base - 70} ${cx + r + 4},${base - 96} L${cx + r + 4},${base - 150} Z`, color, { brillo: 0.4, sombraLado: 0.35 })}
  <ellipse cx="${cx}" cy="${base - 150}" rx="${r + 4}" ry="48" fill="${claro(color, 0.1)}"/>
  <ellipse cx="${cx}" cy="${base - 150}" rx="${r - 24}" ry="36" fill="${claro(color, 0.18)}"/>
  <text x="${cx}" y="${base - 156}" text-anchor="middle" font-family="DejaVu Serif" font-style="italic" font-size="30" fill="${N.papel}" transform="scale(1 1)">${nombre}</text>
  <text x="${cx}" y="${base - 128}" text-anchor="middle" font-family="DejaVu Sans" font-size="11" letter-spacing="4" fill="${N.papel}" opacity="0.85">HOJA &amp; BARRO</text>`;
}

/** Champú sólido (pastilla redonda). */
function pastilla(cx, base, { color = "#C9D2B4" } = {}) {
  const r = 170;
  const lado = `M${cx - r},${base - 90} L${cx - r},${base - 30} C${cx - r},${base + 10} ${cx + r},${base + 10} ${cx + r},${base - 30} L${cx + r},${base - 90} Z`;
  return `${sombra(cx + 24, base + 6, r + 40, 18, 0.35, 12)}
  ${cilindrico(lado, oscuro(color, 0.1), { brillo: 0.25, sombraLado: 0.3 })}
  <ellipse cx="${cx}" cy="${base - 90}" rx="${r}" ry="56" fill="${color}"/>
  <ellipse cx="${cx}" cy="${base - 90}" rx="${r - 40}" ry="36" fill="none" stroke="${oscuro(color, 0.15)}" stroke-width="4"/>
  <g transform="translate(${cx} ${base - 92}) scale(1 0.34)"><path d="M-50,40 C-40,-40 40,-60 60,-50 C60,10 10,50 -50,40 Z" fill="${oscuro(color, 0.14)}"/><path d="M-50,40 C-10,0 20,-20 58,-48" stroke="${claro(color, 0.3)}" stroke-width="4" fill="none"/></g>
  ${Array.from({ length: 30 }, (_, i) => `<circle cx="${cx - 140 + ((i * 53) % 280)}" cy="${base - 100 + ((i * 29) % 30) - 10}" r="2" fill="${oscuro(color, 0.25)}" opacity="0.5"/>`).join("")}`;
}

async function natural() {
  const W = 1000;
  const H = 1250;
  const img = (fondo, producto, extra = "", ped, sc = 1.32) =>
    svg(
      W,
      H,
      escena(W, H, fondo, { pedestal: ped }) +
        `<g transform="translate(500 930) scale(${sc}) translate(-500 -930)">${extra}${producto}</g>` +
        grano(W, H, 0.04),
    );
  const items = [
    ["serum-calma", img(N.salvia, gotero(500, 930, { vidrio: "#5F6D43", nombre: "Calma", sub: "SÉRUM · 30 ML" }), rama(250, 860, 0.9, -20, N.oliva))],
    ["serum-luz", img(N.rosa, gotero(500, 930, { vidrio: "#A9665B", nombre: "Luz", sub: "SÉRUM · 30 ML", tapa: "#3A2E2A" }), rama(750, 880, 0.8, 200, N.musgo), "#EFE7DF")],
    ["crema-nutritiva", img(N.piedra, pote(500, 930, { cuerpo: "#EDE9E0", tapa: "#B08A62", nombre: "Nutritiva", sub: "CREMA · 50 ML" }), rama(250, 880, 0.85, -15, N.oliva), "#C9CDB8", 1.45)],
    ["crema-liviana", img(N.salvia, pote(500, 930, { cuerpo: "#F1E4DD", tapa: "#8C9870", nombre: "Liviana", sub: "GEL CREMA · 50 ML" }), "", "#E8E2D6", 1.45)],
    ["mascarilla-arcilla", img(N.rosa, pote(500, 930, { cuerpo: "#EDE7E0", nombre: "Arcilla rosa", sub: "MÁSCARA · 80 G", abierto: true, contenido: "#D79C8C" }), rama(750, 900, 0.8, 200, N.oliva), "#F1E9E2", 1.45)],
    ["limpiador-suave", img(N.musgo, pomo(500, 930, { color: "#EFEBE2", tapa: N.oliva, nombre: "Limpiador", sub: "GEL · 150 ML" }), rama(250, 860, 0.9, -25, "#5B6640"), "#DAD6CA")],
    ["protector-solar", img(N.piedra, pomo(500, 930, { color: "#F3E1D8", tapa: "#B9796C", nombre: "Protector", sub: "FPS 50 · 90 ML", ancho: 180, alto: 520 }), "", "#E9E4DA")],
    ["tonico-rosas", img(N.rosa, bomba(500, 930, { vidrio: "#F0DCD4", liquido: "#E6B3A6", nombre: "Tónico", sub: "ROSAS · 120 ML", spray: true, tapa: "#EDE7DE" }), rama(250, 880, 0.85, -20, N.oliva), "#F1E9E2")],
    ["aceite-corporal", img(N.salvia, bomba(500, 930, { vidrio: "#E9E2CC", liquido: "#C9A24E", nombre: "Aceite", sub: "CORPORAL · 100 ML" }), rama(750, 880, 0.85, 200, N.olivaOsc), "#E8E2D6")],
    ["jabon-arcilla", img(N.salvia, jabon(500, 930, { color: "#E2B4A5", sello: "ARCILLA" }), rama(750, 780, 0.7, 160, N.oliva), "#E8E2D6", 1.6)],
    ["jabon-avena", img(N.rosa, jabon(500, 930, { color: "#EADFCB", sello: "AVENA" }), "", "#F1E9E2", 1.6)],
    ["balsamo-labial", img(N.piedra, lata(500, 930, { color: N.oliva, nombre: "Bálsamo" }), rama(250, 880, 0.8, -20, N.musgo), "#C9CDB8", 1.6)],
    ["champu-solido", img(N.rosa, pastilla(500, 930, { color: "#CFD6BC" }), rama(750, 880, 0.8, 200, N.oliva), "#EFE7DF", 1.6)],
  ];
  for (const [nombre, s] of items) await guardar("natural", nombre, s);

  // Hero y rutinas: composiciones de varios productos.
  const grupo = (w, h, fondo, piezas, ped = "#E8E2D6") => {
    const ancho = w * 0.8;
    const pedD = `M${w / 2 - ancho / 2},${h * 0.76} L${w / 2 - ancho / 2},${h + 20} L${w / 2 + ancho / 2},${h + 20} L${w / 2 + ancho / 2},${h * 0.76} Z`;
    return svg(
      w,
      h,
      estudio(w, h, fondo, { luz: 0.16, vineta: 0.12, cy: 0.3 }) +
        `<path d="M${w / 2 - 420},${h} L${w / 2 - 420},${h * 0.5} A420,420 0 0 1 ${w / 2 + 420},${h * 0.5} L${w / 2 + 420},${h} Z" fill="${claro(fondo, 0.18)}"/>` +
        sombraHojas(w, h, 0.1) +
        cilindrico(pedD, ped, { brillo: 0.25, sombraLado: 0.22 }) +
        `<ellipse cx="${w / 2}" cy="${h * 0.76}" rx="${ancho / 2}" ry="${h * 0.05}" fill="${claro(ped, 0.2)}"/>` +
        piezas +
        grano(w, h, 0.04),
    );
  };
  const s = (x, y, sc, contenido) => `<g transform="translate(${x} ${y}) scale(${sc}) translate(-500 -930)">${contenido}</g>`;
  await guardar(
    "natural",
    "hero-coleccion",
    grupo(
      1400,
      1100,
      N.salvia,
      rama(120, 840, 1.4, -18, N.oliva) +
        s(400, 860, 1.0, gotero(500, 930, { vidrio: "#5F6D43", nombre: "Calma", sub: "SÉRUM · 30 ML" })) +
        s(1010, 855, 0.92, bomba(500, 930, { vidrio: "#F0DCD4", liquido: "#E6B3A6", nombre: "Tónico", sub: "ROSAS · 120 ML", spray: true, tapa: "#EDE7DE" })) +
        s(700, 900, 1.02, pote(500, 930, { cuerpo: "#F1E4DD", tapa: "#B08A62", nombre: "Nutritiva", sub: "CREMA · 50 ML" })) +
        s(1190, 930, 0.86, jabon(500, 930, { color: "#E2B4A5", sello: "ARCILLA" })),
      "#E8E2D6",
    ),
  );
  const rutina = (nombre, fondo, piezas) => guardar("natural", nombre, grupo(1200, 900, fondo, piezas));
  await rutina(
    "rutina-calma",
    N.salvia,
    s(330, 710, 0.86, pomo(500, 930, { color: "#EFEBE2", tapa: N.oliva, nombre: "Limpiador", sub: "GEL · 150 ML" })) +
      s(600, 700, 0.86, gotero(500, 930, { vidrio: "#5F6D43", nombre: "Calma", sub: "SÉRUM · 30 ML" })) +
      s(870, 730, 0.86, pote(500, 930, { cuerpo: "#F1E4DD", tapa: "#8C9870", nombre: "Liviana", sub: "GEL CREMA · 50 ML" })),
  );
  await rutina(
    "rutina-equilibrio",
    N.rosa,
    s(330, 710, 0.86, bomba(500, 930, { vidrio: "#F0DCD4", liquido: "#E6B3A6", nombre: "Tónico", sub: "ROSAS · 120 ML", spray: true, tapa: "#EDE7DE" })) +
      s(600, 730, 0.86, pote(500, 930, { cuerpo: "#EDE7E0", nombre: "Arcilla rosa", sub: "MÁSCARA · 80 G", abierto: true, contenido: "#D79C8C" })) +
      s(870, 710, 0.86, pomo(500, 930, { color: "#F3E1D8", tapa: "#B9796C", nombre: "Protector", sub: "FPS 50 · 90 ML", ancho: 180, alto: 520 })),
  );
  await rutina(
    "rutina-nutricion",
    N.piedra,
    s(330, 710, 0.86, gotero(500, 930, { vidrio: "#A9665B", nombre: "Luz", sub: "SÉRUM · 30 ML", tapa: "#3A2E2A" })) +
      s(600, 730, 0.86, pote(500, 930, { cuerpo: "#EDE9E0", tapa: "#B08A62", nombre: "Nutritiva", sub: "CREMA · 50 ML" })) +
      s(870, 710, 0.86, bomba(500, 930, { vidrio: "#E9E2CC", liquido: "#C9A24E", nombre: "Aceite", sub: "CORPORAL · 100 ML" })),
  );
}

// =====================================================================
// TECH STORE — Voltio
// =====================================================================

const T = { azul: "#2F5BFF", grafito: "#23262D", plata: "#D9DCE1", blanco: "#F4F5F7", negro: "#121418" };

function fondoTech(w, h, color = "#EEF1F5") {
  const g = uid("tb");
  return `<defs><linearGradient id="${g}" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="${claro(color, 0.5)}"/><stop offset="0.72" stop-color="${color}"/><stop offset="1" stop-color="${oscuro(color, 0.04)}"/>
  </linearGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#${g})"/>
  <rect y="${h * 0.72}" width="${w}" height="2" fill="#fff" opacity="0.6"/>`;
}

/** Fondo de pantalla abstracto (ondas azules). */
function pantalla(x, y, w, h, r, { tono = T.azul, oscuroFondo = "#0B1330", reloj = false } = {}) {
  const clip = uid("pc");
  const g1 = uid("pg");
  return `<defs><clipPath id="${clip}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/></clipPath>
    <radialGradient id="${g1}" cx="0.3" cy="0.2" r="1"><stop offset="0" stop-color="${claro(tono, 0.35)}"/><stop offset="0.5" stop-color="${tono}"/><stop offset="1" stop-color="${oscuroFondo}"/></radialGradient></defs>
  <g clip-path="url(#${clip})">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${g1})"/>
    <path d="M${x - w * 0.2},${y + h * 0.75} C${x + w * 0.3},${y + h * 0.35} ${x + w * 0.6},${y + h * 1.0} ${x + w * 1.2},${y + h * 0.45} L${x + w * 1.2},${y + h * 1.2} L${x - w * 0.2},${y + h * 1.2} Z" fill="#fff" opacity="0.12"/>
    <path d="M${x - w * 0.2},${y + h * 0.9} C${x + w * 0.4},${y + h * 0.55} ${x + w * 0.7},${y + h * 1.1} ${x + w * 1.2},${y + h * 0.7} L${x + w * 1.2},${y + h * 1.2} L${x - w * 0.2},${y + h * 1.2} Z" fill="${oscuroFondo}" opacity="0.35"/>
    <path d="M${x},${y} L${x + w * 0.55},${y} L${x},${y + h * 0.6} Z" fill="#fff" opacity="0.06"/>
    ${reloj ? `<text x="${x + w / 2}" y="${y + h * 0.3}" text-anchor="middle" font-family="DejaVu Sans" font-size="${w * 0.2}" fill="#fff" opacity="0.95">10:09</text>` : ""}
  </g>`;
}

function auriculares(color, almohadilla, acento) {
  const vincha = "M250,560 C240,300 360,170 500,170 C640,170 760,300 750,560 L712,560 C716,330 620,214 500,214 C380,214 284,330 288,560 Z";
  const copa = (cx, flip) => {
    const d = `M${cx - 95},520 C${cx - 95},450 ${cx - 60},420 ${cx},420 C${cx + 60},420 ${cx + 95},450 ${cx + 95},520 L${cx + 95},700 C${cx + 95},770 ${cx + 60},800 ${cx},800 C${cx - 60},800 ${cx - 95},770 ${cx - 95},700 Z`;
    const cojin = `M${cx + flip * 60},440 C${cx + flip * 120},450 ${cx + flip * 130},500 ${cx + flip * 130},560 L${cx + flip * 130},670 C${cx + flip * 130},740 ${cx + flip * 110},780 ${cx + flip * 60},782 Z`;
    return `${volumen(cojin, almohadilla, { lado: 0.3, brillo: 0.08 })}
    ${volumen(d, color, { lado: 0.3, brillo: 0.22, vertical: 0.16 })}
    <path d="M${cx - 70},470 C${cx - 40},440 ${cx + 40},440 ${cx + 70},470" fill="none" stroke="#fff" stroke-width="4" opacity="0.35"/>
    <rect x="${cx - 7}" y="340" width="14" height="96" rx="7" fill="${T.plata}"/>
    <circle cx="${cx}" cy="610" r="40" fill="none" stroke="${oscuro(color, 0.3)}" stroke-width="3" opacity="0.5"/>`;
  };
  return `${sombra(500, 830, 330, 26, 0.3, 18)}
  ${volumen(vincha, color, { lado: 0.2, brillo: 0.3, vertical: 0.1 })}
  <path d="M300,500 C300,320 390,230 500,230 C610,230 700,320 700,500" fill="none" stroke="${almohadilla}" stroke-width="22" stroke-linecap="round" opacity="0.9"/>
  ${copa(292, 1)}${copa(708, -1)}
  <circle cx="770" cy="720" r="7" fill="${acento}"/>`;
}

function buds(color, acento) {
  const base = "M290,560 L710,560 L710,700 C710,780 640,820 560,820 L440,820 C360,820 290,780 290,700 Z";
  const bud = (cx, rot) => `<g transform="rotate(${rot} ${cx} 520)">
    <path d="M${cx - 34},560 L${cx - 30},420 C${cx - 30},400 ${cx + 30},400 ${cx + 30},420 L${cx + 34},560 Z" fill="${color}"/>
    ${volumen(`M${cx - 34},560 L${cx - 30},420 C${cx - 30},400 ${cx + 30},400 ${cx + 30},420 L${cx + 34},560 Z`, color, { lado: 0.28, brillo: 0.3 })}
    <ellipse cx="${cx}" cy="400" rx="56" ry="46" fill="${color}"/>
    ${volumen(`M${cx - 56},400 A56,46 0 1 1 ${cx + 56},400 A56,46 0 1 1 ${cx - 56},400 Z`, color, { lado: 0.3, brillo: 0.3 })}
    <ellipse cx="${cx + 18}" cy="380" rx="24" ry="20" fill="${oscuro(color, 0.5)}"/>
    <ellipse cx="${cx - 22}" cy="392" rx="10" ry="8" fill="${acento}" opacity="0.9"/></g>`;
  return `${sombra(500, 840, 260, 24, 0.3, 16)}
  <path d="M300,566 L300,360 C300,300 350,262 410,262 L590,262 C650,262 700,300 700,360 L700,566 Z" fill="${oscuro(color, 0.08)}"/>
  ${volumen("M300,566 L300,360 C300,300 350,262 410,262 L590,262 C650,262 700,300 700,360 L700,566 Z", color, { lado: 0.3, brillo: 0.2, vertical: 0.1 })}
  <path d="M322,560 L322,372 C322,322 362,290 414,290 L586,290 C638,290 678,322 678,372 L678,560 Z" fill="${oscuro(color, 0.22)}"/>
  <path d="M322,560 L322,372 C322,322 362,290 414,290 L586,290 C638,290 678,322 678,372 L678,560 Z" fill="none" stroke="${oscuro(color, 0.3)}" stroke-width="3"/>
  ${volumen(base, color, { lado: 0.25, brillo: 0.25, vertical: 0.2 })}
  <path d="M290,560 L710,560 L710,580 L290,580 Z" fill="${oscuro(color, 0.12)}"/>
  <ellipse cx="420" cy="580" rx="50" ry="16" fill="${oscuro(color, 0.35)}"/><ellipse cx="580" cy="580" rx="50" ry="16" fill="${oscuro(color, 0.35)}"/>
  ${bud(420, -8)}${bud(580, 8)}
  <circle cx="500" cy="720" r="6" fill="${acento}"/>`;
}

function parlanteTubo(color, acento) {
  const cuerpo = "M330,250 C330,220 670,220 670,250 L670,780 C670,830 330,830 330,780 Z";
  const puntos = [];
  for (let y = 300; y < 780; y += 22) for (let x = 350; x < 660; x += 22) puntos.push(`<circle cx="${x + ((y / 22) % 2) * 11}" cy="${y}" r="4.5"/>`);
  const clip = uid("tc");
  return `${sombra(500, 830, 220, 26, 0.32, 16)}
  <defs><clipPath id="${clip}"><path d="${cuerpo}"/></clipPath></defs>
  ${volumen(cuerpo, color, { lado: 0.36, brillo: 0.2, vertical: 0.12 })}
  <g clip-path="url(#${clip})" fill="${oscuro(color, 0.35)}" opacity="0.5">${puntos.join("")}</g>
  ${volumen(cuerpo, "transparent", { lado: 0.3, brillo: 0.18 })}
  <ellipse cx="500" cy="244" rx="170" ry="30" fill="${oscuro(color, 0.3)}"/>
  <ellipse cx="500" cy="240" rx="164" ry="26" fill="${oscuro(color, 0.15)}"/>
  <circle cx="440" cy="240" r="9" fill="${claro(color, 0.4)}"/><circle cx="500" cy="236" r="11" fill="${acento}"/><circle cx="560" cy="240" r="9" fill="${claro(color, 0.4)}"/>
  <rect x="470" y="690" width="60" height="18" rx="9" fill="${claro(color, 0.5)}" opacity="0.8"/>
`;
}

function parlanteHome(color, luz) {
  const cuerpo = "M270,420 C270,340 380,300 500,300 C620,300 730,340 730,420 L730,700 C730,790 620,820 500,820 C380,820 270,790 270,700 Z";
  const clip = uid("hc");
  const tela = Array.from({ length: 60 }, (_, i) => `<line x1="260" y1="${300 + i * 9}" x2="740" y2="${300 + i * 9}" stroke="#000" stroke-opacity="0.07" stroke-width="3"/>`).join("");
  return `${sombra(500, 830, 280, 26, 0.32, 18)}
  <defs><clipPath id="${clip}"><path d="${cuerpo}"/></clipPath></defs>
  ${volumen(cuerpo, color, { lado: 0.3, brillo: 0.18, vertical: 0.12 })}
  <g clip-path="url(#${clip})">${tela}</g>${grano(1000, 1000, 0.04, 9)}
  <ellipse cx="500" cy="340" rx="200" ry="40" fill="${oscuro(color, 0.5)}"/>
  <ellipse cx="500" cy="336" rx="186" ry="34" fill="${T.negro}"/>
  <ellipse cx="500" cy="336" rx="150" ry="24" fill="none" stroke="${luz}" stroke-width="7" opacity="0.95"/>
  <ellipse cx="500" cy="336" rx="150" ry="24" fill="none" stroke="${luz}" stroke-width="18" opacity="0.25"/>
  <circle cx="500" cy="336" r="6" fill="#fff" opacity="0.7"/>`;
}

function notebook(tapa, base, tono) {
  const marco = "M200,210 L800,210 C812,210 820,218 820,230 L820,600 L180,600 L180,230 C180,218 188,210 200,210 Z";
  const cuerpo = "M180,600 L820,600 L920,720 C924,730 918,740 906,740 L94,740 C82,740 76,730 80,720 Z";
  const teclas = [];
  for (let f = 0; f < 5; f++) {
    const y = 616 + f * 18;
    const k = (y - 600) / 140;
    const x0 = 230 - k * 90;
    const x1 = 770 + k * 90;
    const n = 14;
    const paso = (x1 - x0) / n;
    for (let i = 0; i < n; i++) teclas.push(`<rect x="${x0 + i * paso + 2}" y="${y}" width="${paso - 5}" height="13" rx="2" fill="${oscuro(base, 0.35)}"/>`);
  }
  return `${sombra(500, 760, 440, 22, 0.3, 16)}
  ${volumen(marco, T.negro, { lado: 0.1, brillo: 0.08 })}
  ${pantalla(200, 228, 600, 356, 6, { tono })}
  <circle cx="500" cy="219" r="3.5" fill="#333"/>
  ${volumen(cuerpo, base, { lado: 0.2, brillo: 0.3, vertical: 0.1 })}
  ${teclas.join("")}
  <path d="M430,712 L570,712 L576,730 L424,730 Z" fill="${oscuro(base, 0.1)}"/>
  <path d="M80,724 L920,724 L906,740 L94,740 Z" fill="${oscuro(base, 0.25)}"/>
  <rect x="440" y="740" width="120" height="6" rx="3" fill="${oscuro(base, 0.35)}"/>`;
}

function celular(color, tono, { dorso = true } = {}) {
  const atras = `<g transform="rotate(-10 420 500)">
    ${sombra(430, 860, 140, 16, 0.25, 12)}
    <rect x="300" y="180" width="250" height="520" rx="42" fill="${color}"/>
    ${volumen("M342,180 L508,180 C531,180 550,199 550,222 L550,658 C550,681 531,700 508,700 L342,700 C319,700 300,681 300,658 L300,222 C300,199 319,180 342,180 Z", color, { lado: 0.25, brillo: 0.3, vertical: 0.1 })}
    <rect x="322" y="202" width="120" height="120" rx="30" fill="${oscuro(color, 0.12)}"/>
    <circle cx="358" cy="238" r="26" fill="#111"/><circle cx="358" cy="238" r="15" fill="#1d2433"/><circle cx="352" cy="232" r="5" fill="#6b7ba8"/>
    <circle cx="358" cy="292" r="22" fill="#111"/><circle cx="358" cy="292" r="12" fill="#1d2433"/>
    <circle cx="410" cy="238" r="9" fill="#e9e3c9"/>
    <text x="425" y="560" text-anchor="middle" font-family="DejaVu Sans" font-size="20" letter-spacing="6" fill="${oscuro(color, 0.25)}">VOLTIO</text></g>`;
  const frente = `<g transform="rotate(6 600 540)">
    ${sombra(640, 880, 150, 18, 0.3, 14)}
    <rect x="490" y="250" width="270" height="560" rx="46" fill="${oscuro(color, 0.2)}"/>
    <rect x="496" y="256" width="258" height="548" rx="42" fill="${T.negro}"/>
    ${pantalla(506, 266, 238, 528, 34, { tono })}
    <rect x="590" y="282" width="70" height="20" rx="10" fill="#000"/>
    <text x="625" y="380" text-anchor="middle" font-family="DejaVu Sans" font-size="54" fill="#fff" opacity="0.95">9:41</text>
    <text x="625" y="410" text-anchor="middle" font-family="DejaVu Sans" font-size="14" fill="#fff" opacity="0.7">martes 30</text>
    <path d="M510,300 L560,270 L520,420 Z" fill="#fff" opacity="0.05"/></g>`;
  return (dorso ? atras : "") + frente;
}

function reloj(caja, malla, tono) {
  const correaArr = "M410,180 L590,180 L580,360 L420,360 Z";
  const correaAb = "M420,640 L580,640 L590,840 L410,840 Z";
  return `${sombra(500, 860, 160, 16, 0.28, 14)}
  ${volumen(correaArr, malla, { lado: 0.3, brillo: 0.15, vertical: -0.1 })}
  ${volumen(correaAb, malla, { lado: 0.3, brillo: 0.15, vertical: 0.2 })}
  ${Array.from({ length: 5 }, (_, i) => `<circle cx="500" cy="${690 + i * 30}" r="6" fill="${oscuro(malla, 0.35)}"/>`).join("")}
  <rect x="370" y="330" width="260" height="340" rx="74" fill="${caja}"/>
  ${volumen("M444,330 L556,330 C597,330 630,363 630,404 L630,596 C630,637 597,670 556,670 L444,670 C403,670 370,637 370,596 L370,404 C370,363 403,330 444,330 Z", caja, { lado: 0.3, brillo: 0.3 })}
  <rect x="386" y="346" width="228" height="308" rx="60" fill="#05070c"/>
  <circle cx="500" cy="540" r="76" fill="none" stroke="#1d2433" stroke-width="12"/>
  <path d="M500,464 A76,76 0 1 1 430,570" fill="none" stroke="${tono}" stroke-width="12" stroke-linecap="round"/>
  <circle cx="500" cy="540" r="54" fill="none" stroke="#1d2433" stroke-width="10"/>
  <path d="M500,486 A54,54 0 0 1 548,566" fill="none" stroke="#7CF2C5" stroke-width="10" stroke-linecap="round"/>
  <text x="500" y="420" text-anchor="middle" font-family="DejaVu Sans" font-size="40" fill="#fff">10:09</text>
  <text x="500" y="552" text-anchor="middle" font-family="DejaVu Sans" font-size="26" font-weight="bold" fill="#fff">8.412</text>
  <text x="500" y="576" text-anchor="middle" font-family="DejaVu Sans" font-size="13" letter-spacing="2" fill="#9aa4b8">PASOS</text>
  <rect x="628" y="440" width="18" height="64" rx="8" fill="${oscuro(caja, 0.15)}"/>
  <path d="M400,360 L480,350 L420,470 Z" fill="#fff" opacity="0.06"/>`;
}

function tablet(color, tono) {
  return `${sombra(520, 860, 330, 22, 0.28, 16)}
  <g transform="rotate(-4 500 520)">
  <rect x="190" y="190" width="620" height="640" rx="44" fill="${color}"/>
  <rect x="202" y="202" width="596" height="616" rx="34" fill="${T.negro}"/>
  ${pantalla(222, 222, 556, 576, 18, { tono })}
  <text x="500" y="360" text-anchor="middle" font-family="DejaVu Sans" font-size="70" fill="#fff" opacity="0.95">9:41</text>
  <circle cx="500" cy="212" r="4" fill="#333"/>
  <path d="M222,222 L500,222 L222,560 Z" fill="#fff" opacity="0.05"/></g>
  <g transform="rotate(12 860 520)"><rect x="848" y="240" width="22" height="560" rx="11" fill="${T.blanco}"/>
  ${volumen("M848,251 C848,245 853,240 859,240 C865,240 870,245 870,251 L870,789 C870,795 865,800 859,800 C853,800 848,795 848,789 Z", T.blanco, { lado: 0.3, brillo: 0.3 })}
  <path d="M848,790 L859,830 L870,790 Z" fill="#cfd3da"/></g>`;
}

function teclado(color, teclasColor, acento) {
  const cuerpo = "M130,420 L870,420 C886,420 896,430 898,446 L920,700 C922,716 910,728 894,728 L106,728 C90,728 78,716 80,700 L102,446 C104,430 114,420 130,420 Z";
  const filas = 5;
  const teclas = [];
  for (let f = 0; f < filas; f++) {
    const y = 444 + f * 54;
    const k = f / (filas - 1);
    const x0 = 128 - k * 20;
    const x1 = 872 + k * 20;
    const n = 15;
    const paso = (x1 - x0) / n;
    for (let i = 0; i < n; i++) {
      if (f === 4 && i > 4 && i < 10) continue;
      const esp = f === 4 && i === 4;
      const ancho = esp ? paso * 6 - 8 : paso - 8;
      const c = (f === 0 && i === 0) || (f === 2 && i === 14) ? acento : teclasColor;
      teclas.push(`<rect x="${x0 + i * paso + 4}" y="${y}" width="${ancho}" height="46" rx="8" fill="${oscuro(c, 0.2)}"/><rect x="${x0 + i * paso + 8}" y="${y + 2}" width="${ancho - 8}" height="36" rx="6" fill="${c}"/>`);
    }
  }
  return `${sombra(500, 745, 420, 22, 0.3, 14)}
  ${volumen(cuerpo, color, { lado: 0.2, brillo: 0.2, vertical: 0.2 })}
  ${teclas.join("")}
  <path d="M86,712 L914,712 L894,728 L106,728 Z" fill="${oscuro(color, 0.25)}"/>`;
}

async function techStore() {
  const W = 1000;
  const H = 1000;
  const img = (contenido, fondo, sc = 1, dy = 0) =>
    svg(W, H, fondoTech(W, H, fondo) + `<g transform="translate(500 ${520 + dy}) scale(${sc}) translate(-500 -520)">${contenido}</g>` + grano(W, H, 0.025));
  const items = [
    ["auriculares-onda-grafito", img(auriculares(T.grafito, "#3a3e47", T.azul), "#ECEFF4", 1, 0)],
    ["auriculares-pulse-blanco", img(auriculares("#EEF0F3", "#D5D9E0", T.azul), "#E3E8F0", 1, 0)],
    ["buds-air-blanco", img(buds("#F2F3F6", T.azul), "#E6EAF1", 1.05, 60)],
    ["buds-mini-negro", img(buds("#24272E", "#7CF2C5"), "#ECEFF4", 1.05, 60)],
    ["parlante-tubo-azul", img(parlanteTubo(T.azul, "#fff"), "#E9EDF4", 1, 20)],
    ["parlante-home-gris", img(parlanteHome("#8E949E", "#6FA0FF"), "#EEF0F3", 1, 20)],
    ["notebook-book-14", img(notebook(T.plata, T.plata, T.azul), "#ECEFF4", 1.05, 20)],
    ["notebook-pro-16", img(notebook(T.grafito, "#3A3E47", "#7A4DFF"), "#E6EAF1", 1.08, 20)],
    ["celular-x5-azul", img(celular("#3B5BDB", "#4C7BFF"), "#E9EDF4", 1, 20)],
    ["celular-neo-grafito", img(celular("#2A2D34", "#12B886"), "#ECEFF4", 1, 20)],
    ["reloj-watch-s", img(reloj("#23262D", "#1A1C21", T.azul), "#E9EDF4", 1.05, 0)],
    ["reloj-fit-blanco", img(reloj("#D7DBE2", "#EEF0F3", "#FF6B3D"), "#ECEFF4", 1.05, 0)],
    ["tablet-tab-11", img(tablet("#C9CDD4", T.azul), "#E6EAF1", 0.95, 0)],
    ["teclado-key-tkl", img(teclado("#2A2D34", "#3A3E47", T.azul), "#ECEFF4", 1, -20)],
  ];
  for (const [nombre, s] of items) await guardar("tech-store", nombre, s);

  // Hero: notebook + celular + auriculares sobre fondo grafito.
  const HW = 1600;
  const HH = 1000;
  const g = uid("hg");
  await guardar(
    "tech-store",
    "hero-setup",
    svg(
      HW,
      HH,
      `<defs><radialGradient id="${g}" cx="0.62" cy="0.4" r="0.8"><stop offset="0" stop-color="#2B3550"/><stop offset="0.55" stop-color="#151922"/><stop offset="1" stop-color="#0C0E13"/></radialGradient></defs>
      <rect width="${HW}" height="${HH}" fill="url(#${g})"/>
      <g opacity="0.12" stroke="#6F8CFF" stroke-width="1">${Array.from({ length: 24 }, (_, i) => `<line x1="${i * 70}" y1="0" x2="${i * 70}" y2="${HH}"/>`).join("")}${Array.from({ length: 15 }, (_, i) => `<line x1="0" y1="${i * 70}" x2="${HW}" y2="${i * 70}"/>`).join("")}</g>
      ${sombra(1000, 520, 420, 260, 0.35, 90, T.azul)}
      <g transform="translate(470 130) scale(0.92)">${notebook(T.plata, T.plata, T.azul)}</g>
      <g transform="translate(1000 370) scale(0.6)">${celular("#3B5BDB", "#4C7BFF", { dorso: false })}</g>
      <g transform="translate(150 430) scale(0.55) rotate(-12 500 500)">${auriculares(T.grafito, "#3a3e47", T.azul)}</g>
      ${grano(HW, HH, 0.03)}`,
    ),
  );
}

// =====================================================================
const tareas = { urbano, natural, "tech-store": techStore };
for (const [slug, fn] of Object.entries(tareas)) {
  if (solo && solo !== slug) continue;
  await fn();
}
