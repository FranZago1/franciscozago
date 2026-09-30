/**
 * Genera las ilustraciones de las demos de catálogos (deco, mayorista y vinoteca).
 * Todo se dibuja en SVG a mano y se exporta a WebP con sharp.
 *
 *   node scripts/demos/catalogos.mjs            # las tres demos
 *   node scripts/demos/catalogos.mjs deco       # solo una
 *
 * Deco además escribe las coordenadas de los hotspots de cada ambiente en
 * src/demos/catalogos/deco/hotspots.gen.json, para que coincidan con la ilustración.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const RAIZ = process.cwd();
const OUT = path.join(RAIZ, "public/demos/catalogos");

/* ------------------------------------------------------------------ utilidades */

let _uid = 0;
const uid = (p = "g") => `${p}${++_uid}`;

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
function rgbToHex([r, g, b]) {
  return `#${[r, g, b]
    .map((v) =>
      Math.max(0, Math.min(255, Math.round(v)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}
function mix(a, b, t) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex(A.map((v, i) => v + (B[i] - v) * t));
}
/** amt > 0 aclara, amt < 0 oscurece. */
const shade = (hex, amt) => (amt >= 0 ? mix(hex, "#ffffff", amt) : mix(hex, "#1a1410", -amt));

/** Colector de <defs> por documento. */
let DEFS = [];
function def(s) {
  DEFS.push(s);
}
function grad(stops, { x1 = 0, y1 = 0, x2 = 0, y2 = 1, units } = {}) {
  const id = uid("lg");
  const u = units ? ` gradientUnits="${units}"` : "";
  def(
    `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"${u}>${stops
      .map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`)
      .join("")}</linearGradient>`,
  );
  return `url(#${id})`;
}
function rgrad(stops, { cx = 0.5, cy = 0.5, r = 0.5, fx, fy } = {}) {
  const id = uid("rg");
  const f = fx !== undefined ? ` fx="${fx}" fy="${fy}"` : "";
  def(
    `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}"${f}>${stops
      .map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`)
      .join("")}</radialGradient>`,
  );
  return `url(#${id})`;
}
const vfill = (c, top = 0.08, bot = -0.08) =>
  grad([
    [0, shade(c, top)],
    [1, shade(c, bot)],
  ]);
/** Degradé horizontal de cilindro: bordes oscuros, brillo corrido a la izquierda. */
const cyl = (c, k = 1) =>
  grad(
    [
      [0, shade(c, -0.22 * k)],
      [0.3, shade(c, 0.1 * k)],
      [0.45, shade(c, 0.14 * k)],
      [1, shade(c, -0.26 * k)],
    ],
    { x2: 1, y2: 0 },
  );

const R = (x, y, w, h, r, fill, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;
const P = (d, fill, extra = "") => `<path d="${d}" fill="${fill}" ${extra}/>`;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

function blurFilter(id, sd) {
  def(`<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${sd}"/></filter>`);
  return `url(#${id})`;
}

function doc(w, h, body, bg = "") {
  const s = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${DEFS.join("")}</defs>${bg}${body}</svg>`;
  DEFS = [];
  return s;
}

async function guardar(slug, nombre, svg, { quality = 84, alpha = false } = {}) {
  const dir = path.join(OUT, slug);
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `${nombre}.webp`);
  await sharp(Buffer.from(svg))
    .webp({ quality, alphaQuality: alpha ? 90 : 100, effort: 5, smartSubsample: true })
    .toFile(file);
  return file;
}

/* ======================================================================= DECO */
/* Unidades de dibujo: centímetros. Origen (0,0) = centro del apoyo en el piso; y negativo hacia arriba. */

const MADERA = { roble: "#C39462", nogal: "#6E4A30", negro: "#2E2A27" };
const TELA = {
  "lino-crudo": "#D6CAB3",
  terracota: "#B25F3C",
  oliva: "#6F7451",
  bosque: "#2F4538",
  boucle: "#E7DECF",
};
const METAL = { laton: "#B38B45", negro: "#2A2826" };
const CERAMICA = { terracota: "#B7673F", crudo: "#E3D8C6", verde: "#5F6D57" };
const CANA = "#C9A56A";

function canaPattern(base = CANA) {
  const id = uid("cana");
  def(
    `<pattern id="${id}" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3" height="3" fill="${shade(base, -0.12)}"/><rect width="1.6" height="3" fill="${base}"/><rect width="3" height="1.2" fill="${shade(base, 0.12)}" opacity="0.8"/></pattern>`,
  );
  return `url(#${id})`;
}

function sombraPiso(w, op = 0.22) {
  const f = blurFilter(uid("bl"), Math.max(1.5, w * 0.03));
  return `<ellipse cx="0" cy="0" rx="${w * 0.52}" ry="${Math.max(2.5, w * 0.045)}" fill="#2a1d12" opacity="${op}" filter="${f}"/>`;
}

const DIBUJOS = {
  sofa({ tela }) {
    const mad = MADERA.nogal;
    const f = vfill(tela, 0.08, -0.06);
    const fl = vfill(shade(tela, 0.05), 0.1, -0.04);
    const fd = vfill(shade(tela, -0.1), 0.02, -0.1);
    const ao = grad([
      [0, "#000", 0],
      [1, "#000", 0.16],
    ]);
    return [
      sombraPiso(230),
      R(-104, -14, 5, 14, 1, mad),
      R(99, -14, 5, 14, 1, mad),
      R(-110, -42, 220, 30, 5, fd),
      R(-94, -88, 92, 42, 13, fl),
      R(2, -88, 92, 42, 13, fl),
      R(-94, -52, 188, 8, 0, ao),
      R(-94, -56, 92, 17, 7, f),
      R(2, -56, 92, 17, 7, f),
      `<path d="M-90,-41.5 H-6 M6,-41.5 H90" stroke="${shade(tela, -0.2)}" stroke-width="0.6" opacity="0.6"/>`,
      R(-116, -68, 26, 56, 11, f),
      R(90, -68, 26, 56, 11, f),
      R(-113, -66, 20, 5, 2.5, shade(tela, 0.14), 'opacity="0.55"'),
      R(93, -66, 20, 5, 2.5, shade(tela, 0.14), 'opacity="0.55"'),
    ].join("");
  },
  butaca({ tela }) {
    const mad = MADERA.roble;
    const f = vfill(tela, 0.1, -0.06);
    const fl = vfill(shade(tela, 0.04), 0.12, -0.06);
    const pierna = (s) => `<polygon points="${s * 36},-40 ${s * 30},-40 ${s * 31},0 ${s * 34},0" fill="${shade(mad, -0.08)}"/>`;
    return [
      sombraPiso(86),
      pierna(-1),
      pierna(1),
      R(-39, -44, 78, 6, 2, vfill(mad, 0.1, -0.1)),
      `<g transform="rotate(-4 0 -50)">${R(-30, -92, 60, 42, 15, fl)}</g>`,
      R(-34, -57, 68, 15, 7, f),
      R(-44, -64, 18, 5, 2.5, vfill(mad, 0.14, -0.06)),
      R(26, -64, 18, 5, 2.5, vfill(mad, 0.14, -0.06)),
      R(-39, -60, 4, 18, 1.5, shade(mad, -0.05)),
      R(35, -60, 4, 18, 1.5, shade(mad, -0.05)),
    ].join("");
  },
  "mesa-lapacho"({ madera }) {
    const vetas = [-18, -9, 4, 15]
      .map(
        (x) =>
          `<path d="M${x},-35 C${x + 2},-24 ${x - 2},-12 ${x + 1},-1" stroke="${shade(madera, -0.3)}" stroke-width="0.5" fill="none" opacity="0.35"/>`,
      )
      .join("");
    return [
      sombraPiso(96, 0.26),
      R(-26, -37, 52, 37, 3, cyl(madera)),
      vetas,
      R(-26, -37, 52, 3, 1, "#000", 'opacity="0.12"'),
      R(-46, -43, 92, 6, 2.5, vfill(madera, 0.12, -0.08)),
      R(-45, -43, 90, 1.2, 0.6, shade(madera, 0.25), 'opacity="0.8"'),
    ].join("");
  },
  "lampara-brisa"({ metal }) {
    const tela = "#EFE6D5";
    const halo = rgrad([
      [0, "#FFF3D6", 0.55],
      [1, "#FFF3D6", 0],
    ]);
    return [
      sombraPiso(40, 0.2),
      `<ellipse cx="0" cy="-118" rx="44" ry="40" fill="${halo}"/>`,
      R(-16, -3.5, 32, 3.5, 1.7, vfill(metal, 0.2, -0.15)),
      R(-1.1, -150, 2.2, 147, 1, cyl(metal)),
      `<polygon points="-24,-126 24,-126 17,-167 -17,-167" fill="${grad(
        [
          [0, shade(tela, -0.12)],
          [0.35, tela],
          [0.55, shade(tela, 0.1)],
          [1, shade(tela, -0.16)],
        ],
        { x2: 1, y2: 0 },
      )}"/>`,
      `<ellipse cx="0" cy="-126" rx="24" ry="2.2" fill="#FFF1CC"/>`,
      R(-17, -167.5, 34, 1.2, 0.5, shade(tela, -0.2)),
    ].join("");
  },
  biblioteca({ madera }) {
    const libros = (x0, y, cols) => {
      let x = x0;
      return cols
        .map(([w, h, c, tilt]) => {
          const r = tilt ? `transform="rotate(${tilt} ${x + w} ${y})"` : "";
          const s = R(x, y - h, w, h, 0.6, c, r) + R(x + 0.6, y - h + 3, w - 1.2, 1, 0.3, shade(c, 0.25), `opacity="0.7" ${r}`);
          x += w + 0.4;
          return s;
        })
        .join("");
    };
    const repisas = [-4, -48, -92, -136, -180]
      .map((y) => R(-60, y - 3.5, 120, 4, 0.8, vfill(madera, 0.14, -0.1)) + R(-56, y, 112, 5, 0, "#000", 'opacity="0.07"'))
      .join("");
    const jarron = (cx, y, c) =>
      P(
        `M${cx - 3},${y - 20} C${cx - 3},${y - 16} ${cx - 8},${y - 14} ${cx - 8},${y - 8} C${cx - 8},${y - 2} ${cx - 5},${y} ${cx},${y} C${cx + 5},${y} ${cx + 8},${y - 2} ${cx + 8},${y - 8} C${cx + 8},${y - 14} ${cx + 3},${y - 16} ${cx + 3},${y - 20} Z`,
        cyl(c, 0.8),
      );
    const bowl = (cx, y, c) => P(`M${cx - 12},${y - 7} Q${cx},${y + 3} ${cx + 12},${y - 7} Z`, cyl(c, 0.8));
    const hojas = [0, 1, 2, 3, 4, 5, 6]
      .map((i) => {
        const x = 26 + (i % 3) * 5 - i * 0.6;
        const y = -134 + i * 7;
        return `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="2.1" transform="rotate(${i % 2 ? 30 : -25} ${x} ${y})" fill="${i % 2 ? "#5B7552" : "#6F8A62"}"/>`;
      })
      .join("");
    return [
      sombraPiso(124, 0.18),
      R(-58, -180, 116, 176, 0, "#000", 'opacity="0.05"'),
      libros(-52, -7.5, [
        [4, 30, "#2F4538"],
        [5, 33, "#D6CAB3"],
        [3.5, 28, "#B25F3C"],
        [5, 31, "#3A3632"],
        [4, 27, "#C9A56A"],
      ]),
      R(-20, -25.5, 26, 18, 3, canaPattern()),
      libros(18, -7.5, [
        [4.5, 32, "#8A6A4F"],
        [4, 29, "#E9E1D2"],
        [5, 34, "#6F7451"],
        [3.5, 26, "#B25F3C", -12],
      ]),
      jarron(-40, -51.5, "#B7673F"),
      R(-18, -57.5, 30, 6, 0.8, "#2F4538") + R(-16, -63.5, 26, 6, 0.8, "#D6CAB3") + R(-19, -69.5, 32, 6, 0.8, "#B25F3C"),
      bowl(38, -51.5, "#E3D8C6"),
      libros(-52, -95.5, [
        [4, 30, "#E9E1D2"],
        [4.5, 34, "#2F4538"],
        [5, 31, "#C39462"],
        [3.5, 27, "#6E4A30"],
      ]),
      jarron(8, -95.5, "#5F6D57"),
      R(28, -103.5, 22, 8, 1, "#3A3632") + `<circle cx="39" cy="-111" r="3.5" fill="#C9A56A"/>`,
      R(-50, -165.5, 18, 26, 1, "#F3EDE3", `stroke="${shade(madera, -0.2)}" stroke-width="1.2"`),
      `<circle cx="-41" cy="-154" r="4" fill="#B25F3C" opacity="0.85"/>`,
      libros(-20, -139.5, [
        [4, 26, "#B25F3C"],
        [5, 30, "#D6CAB3"],
        [4, 28, "#3A3632"],
      ]),
      R(22, -147.5, 14, 8, 2, "#E3D8C6") + hojas,
      repisas,
      R(-62, -182, 5, 182, 1, vfill(madera, 0.1, -0.1)),
      R(57, -182, 5, 182, 1, vfill(madera, 0.1, -0.1)),
    ].join("");
  },
  alfombra({ base, acento }, { topW = 190, botW = 250, h = 58 } = {}) {
    const map = (u, v) => {
      const w = topW + (botW - topW) * v;
      return [-w / 2 + u * w, -h + v * h];
    };
    const poly = (pts) =>
      pts
        .map(([u, v]) =>
          map(u, v)
            .map((n) => n.toFixed(2))
            .join(","),
        )
        .join(" ");
    const out = [sombraPiso(botW * 0.9, 0.08).replace('cy="0"', `cy="${-h * 0.4}"`)];
    out.push(
      `<polygon points="${poly([
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ])}" fill="${vfill(base, -0.04, 0.04)}"/>`,
    );
    out.push(
      `<polygon points="${poly([
        [0.04, 0.12],
        [0.96, 0.12],
        [0.96, 0.88],
        [0.04, 0.88],
      ])}" fill="none" stroke="${acento}" stroke-width="1.6"/>`,
    );
    out.push(
      `<polygon points="${poly([
        [0.065, 0.2],
        [0.935, 0.2],
        [0.935, 0.8],
        [0.065, 0.8],
      ])}" fill="none" stroke="${acento}" stroke-width="0.6" opacity="0.7"/>`,
    );
    for (let i = 0; i < 7; i++) {
      const u = 0.2 + i * 0.1;
      out.push(
        `<polygon points="${poly([
          [u, 0.34],
          [u + 0.05, 0.5],
          [u, 0.66],
          [u - 0.05, 0.5],
        ])}" fill="${i % 2 ? acento : shade(acento, 0.35)}" opacity="${i % 2 ? 0.9 : 0.6}"/>`,
      );
    }
    for (let i = 0; i <= 60; i++) {
      const u = i / 60;
      const [x1, y1] = map(u, 0);
      const [x2, y2] = map(u, 1);
      out.push(`<line x1="${x1}" y1="${y1}" x2="${x1}" y2="${y1 - 2}" stroke="${shade(base, -0.1)}" stroke-width="0.5"/>`);
      out.push(`<line x1="${x2}" y1="${y2}" x2="${x2}" y2="${y2 + 3}" stroke="${shade(base, -0.1)}" stroke-width="0.6"/>`);
    }
    return out.join("");
  },
  "mesa-algarrobo"({ madera }) {
    const pata = (s) => `<polygon points="${s * 90},-70 ${s * 81},-70 ${s * 83},0 ${s * 88},0" fill="${vfill(madera, 0.02, -0.18)}"/>`;
    return [
      sombraPiso(206, 0.2),
      pata(-1),
      pata(1),
      R(-92, -71, 184, 7, 1, shade(madera, -0.14)),
      R(-101, -77, 202, 6.5, 2, vfill(madera, 0.14, -0.08)),
      R(-100, -77, 200, 1.1, 0.5, shade(madera, 0.26), 'opacity="0.8"'),
    ].join("");
  },
  "silla-junco"({ madera }) {
    const cana = canaPattern();
    return [
      sombraPiso(48, 0.2),
      R(-21, -84, 3.6, 84, 1.6, shade(madera, -0.1)),
      R(17.4, -84, 3.6, 84, 1.6, shade(madera, -0.1)),
      R(-19, -80, 38, 13, 2, cana),
      R(-19, -80, 38, 2, 1, madera),
      R(-19, -68.5, 38, 1.6, 0.8, madera),
      R(-23.5, -48, 47, 5.5, 2, cana),
      R(-23.5, -43.5, 47, 2.6, 1.2, vfill(madera, 0.1, -0.1)),
      R(-22.5, -43, 3.6, 43, 1.6, vfill(madera, 0.08, -0.04)),
      R(18.9, -43, 3.6, 43, 1.6, vfill(madera, 0.08, -0.04)),
      R(-20, -15, 40, 2, 1, shade(madera, -0.05)),
    ].join("");
  },
  "colgante-luna"({ color }, { cable = 120 } = {}) {
    const halo = rgrad([
      [0, "#FFF0CF", 0.6],
      [1, "#FFF0CF", 0],
    ]);
    return [
      `<ellipse cx="0" cy="14" rx="52" ry="30" fill="${halo}" opacity="0.7"/>`,
      `<line x1="0" y1="-24" x2="0" y2="${-cable}" stroke="#2a2622" stroke-width="0.7"/>`,
      R(-2.5, -27, 5, 4, 1, shade(color, -0.2)),
      P(
        "M-28,0 C-28,-15 -16,-24 0,-24 C16,-24 28,-15 28,0 Z",
        grad(
          [
            [0, shade(color, -0.2)],
            [0.35, shade(color, 0.14)],
            [1, shade(color, -0.3)],
          ],
          { x2: 1, y2: 0 },
        ),
      ),
      `<ellipse cx="0" cy="0" rx="28" ry="2.8" fill="#FFF3D8"/>`,
      `<ellipse cx="0" cy="0.4" rx="16" ry="1.6" fill="#FFFDF5"/>`,
    ].join("");
  },
  "aparador-tipa"({ madera }) {
    const cana = canaPattern();
    const pata = (s) => `<polygon points="${s * 82},-21 ${s * 76},-21 ${s * 77.5},0 ${s * 80.5},0" fill="${shade(madera, -0.12)}"/>`;
    const tirador = (x, y) =>
      `<circle cx="${x}" cy="${y}" r="1.7" fill="${METAL.laton}"/><circle cx="${x - 0.5}" cy="${y - 0.5}" r="0.6" fill="#F3E2B5"/>`;
    return [
      sombraPiso(186, 0.2),
      pata(-1),
      pata(1),
      R(-90, -82, 180, 62, 2.5, vfill(madera, 0.06, -0.1)),
      R(-86, -77, 52, 53, 1.5, cana, `stroke="${shade(madera, -0.18)}" stroke-width="1.2"`),
      R(34, -77, 52, 53, 1.5, cana, `stroke="${shade(madera, -0.18)}" stroke-width="1.2"`),
      R(-30, -77, 60, 25.5, 1.5, vfill(madera, 0.1, -0.04), `stroke="${shade(madera, -0.2)}" stroke-width="0.7"`),
      R(-30, -49.5, 60, 25.5, 1.5, vfill(madera, 0.1, -0.04), `stroke="${shade(madera, -0.2)}" stroke-width="0.7"`),
      tirador(0, -64),
      tirador(0, -37),
      tirador(-37, -50),
      tirador(37, -50),
      R(-92, -85, 184, 4, 1.5, vfill(madera, 0.2, 0)),
    ].join("");
  },
  "jarron-barro"({ ceramica }) {
    const tallo = (d) => `<path d="${d}" stroke="#A88E68" stroke-width="0.7" fill="none"/>`;
    const pluma = (x, y, rot, s = 1) => {
      const g = grad([
        [0, "#F4EBDB"],
        [1, "#D9C6A4"],
      ]);
      let lines = "";
      for (let i = 0; i < 9; i++) {
        const yy = -14 + i * 3.2;
        lines += `<path d="M0,${yy} q${i % 2 ? 4 : -4},-2 ${i % 2 ? 6 : -6},-5" stroke="#E9DCC4" stroke-width="0.6" fill="none" opacity="0.9"/>`;
      }
      return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><ellipse cx="0" cy="0" rx="4.6" ry="17" fill="${g}"/>${lines}</g>`;
    };
    return [
      sombraPiso(30, 0.25),
      tallo("M-2,-38 C-6,-70 -14,-92 -22,-108"),
      tallo("M0,-38 C1,-72 4,-100 5,-122"),
      tallo("M2,-38 C8,-66 16,-88 24,-100"),
      pluma(-24, -112, -22),
      pluma(5, -128, 2, 1.1),
      pluma(26, -104, 24, 0.95),
      P("M-6,-40 C-6,-34 -14,-30 -14,-18 C-14,-6 -9,0 0,0 C9,0 14,-6 14,-18 C14,-30 6,-34 6,-40 Z", cyl(ceramica)),
      `<ellipse cx="0" cy="-40" rx="6" ry="1.4" fill="${shade(ceramica, -0.35)}"/>`,
      `<path d="M-12,-20 C-11,-12 -8,-5 -4,-3" stroke="#fff" stroke-width="1" fill="none" opacity="0.25"/>`,
    ].join("");
  },
  "cama-sauce"({ tela }) {
    const mad = MADERA.nogal;
    const canales = [-60, -45, -30, -15, 0, 15, 30, 45, 60]
      .map(
        (x) => `<line x1="${x + 7.5}" y1="-106" x2="${x + 7.5}" y2="-40" stroke="${shade(tela, -0.28)}" stroke-width="0.7" opacity="0.4"/>`,
      )
      .slice(0, 8)
      .join("");
    const duvet = "#F2EDE4";
    return [
      sombraPiso(176, 0.2),
      R(-80, -9, 4, 9, 1, mad),
      R(76, -9, 4, 9, 1, mad),
      R(-86, -114, 172, 86, 22, vfill(shade(tela, 0.04), 0.1, -0.06)),
      canales,
      R(-83, -37, 166, 29, 4, vfill(shade(tela, -0.06), 0.02, -0.1)),
      R(-74, -73, 64, 22, 10, vfill("#F7F3EC", 0.1, -0.05)),
      R(10, -73, 64, 22, 10, vfill("#F7F3EC", 0.1, -0.05)),
      P("M-85,-56 Q0,-60 85,-56 L87,-28 Q0,-24 -87,-28 Z", vfill(duvet, 0.06, -0.08)),
      `<path d="M-60,-54 Q-58,-40 -62,-28 M30,-56 Q34,-44 28,-27" stroke="${shade(duvet, -0.12)}" stroke-width="0.8" fill="none"/>`,
      P("M-87,-46 Q0,-49 87,-46 L88,-34 Q0,-31 -88,-34 Z", "#9E5A3B", 'opacity="0.92"'),
      `<path d="M-87,-42 Q0,-45 87,-42" stroke="#D6CAB3" stroke-width="0.8" fill="none"/>`,
    ].join("");
  },
  "mesa-luz-pino"({ madera }) {
    const pata = (s) => `<polygon points="${s * 22},-17 ${s * 17.5},-17 ${s * 18.5},0 ${s * 21},0" fill="${shade(madera, -0.12)}"/>`;
    return [
      sombraPiso(52, 0.22),
      pata(-1),
      pata(1),
      R(-25, -58, 50, 42, 2.5, vfill(madera, 0.08, -0.1)),
      R(-22, -54, 44, 16, 1.2, vfill(madera, 0.12, -0.02), `stroke="${shade(madera, -0.2)}" stroke-width="0.6"`),
      `<circle cx="0" cy="-46" r="1.6" fill="${METAL.laton}"/>`,
      R(-22, -35, 44, 15, 1, shade(madera, -0.35)),
      R(-18, -26, 20, 6, 0.6, "#D6CAB3") + R(-16, -30, 16, 4, 0.6, "#2F4538"),
      R(-26, -60, 52, 3, 1.2, vfill(madera, 0.2, 0)),
    ].join("");
  },
  "espejo-arco"({ marco }) {
    const vidrio = grad(
      [
        [0, "#E7ECEA"],
        [0.5, "#C9D3D1"],
        [1, "#AEBBB8"],
      ],
      { x1: 0, y1: 0, x2: 1, y2: 1 },
    );
    const clip = uid("clip");
    def(`<clipPath id="${clip}"><path d="M-30,-4 L-30,-136 A30,30 0 0 1 30,-136 L30,-4 Z"/></clipPath>`);
    return [
      sombraPiso(74, 0.2),
      `<g transform="rotate(-2.5 0 0)">`,
      P("M-35,0 L-35,-136 A35,35 0 0 1 35,-136 L35,0 Z", vfill(marco, 0.12, -0.12)),
      P("M-30,-4 L-30,-136 A30,30 0 0 1 30,-136 L30,-4 Z", vidrio),
      `<g clip-path="url(#${clip})"><polygon points="-30,-60 -30,-90 40,-150 40,-120" fill="#fff" opacity="0.28"/><polygon points="-30,-40 -30,-48 40,-108 40,-100" fill="#fff" opacity="0.2"/></g>`,
      `</g>`,
    ].join("");
  },
  "almohadon-trama"({ tela }) {
    const cuad = (w, h) =>
      `M${-w / 2},${-h} Q0,${-h + 4} ${w / 2},${-h} Q${w / 2 - 4},${-h / 2} ${w / 2},0 Q0,-4 ${-w / 2},0 Q${-w / 2 + 4},${-h / 2} ${-w / 2},${-h} Z`;
    const clip = uid("clip");
    def(`<clipPath id="${clip}"><path d="${cuad(40, 40)}" transform="translate(12 0)"/></clipPath>`);
    let rayas = "";
    for (let i = 0; i < 9; i++) rayas += R(-12, -40 + i * 5, 50, 1.8, 0, tela);
    return [
      sombraPiso(66, 0.2),
      `<g transform="translate(-10 -2) rotate(-6)">${P(cuad(48, 48), vfill(tela, 0.1, -0.12))}<path d="M-18,-40 Q-4,-24 -16,-8" stroke="${shade(tela, -0.2)}" stroke-width="0.7" fill="none" opacity="0.6"/></g>`,
      `<g transform="rotate(4 12 -20)">`,
      P(cuad(40, 40), vfill("#EFE8DC", 0.08, -0.1), 'transform="translate(12 0)"'),
      `<g clip-path="url(#${clip})">${rayas}</g>`,
      P(
        cuad(40, 40),
        grad([
          [0, "#fff", 0.1],
          [1, "#000", 0.12],
        ]),
        'transform="translate(12 0)"',
      ),
      `</g>`,
    ].join("");
  },
};

/** Decoración de los ambientes (no son productos). */
function planta(escala = 1) {
  const hojas = [
    [-8, -150, -30, 1.1],
    [10, -168, 20, 1.2],
    [-18, -120, -55, 1],
    [16, -128, 48, 1.05],
    [0, -186, 4, 1],
    [-4, -100, -20, 0.9],
    [12, -98, 35, 0.9],
    [-14, -172, -20, 0.95],
  ];
  const hoja = (x, y, r, s, c) =>
    `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">${P("M0,0 C-13,-5 -15,-24 0,-32 C15,-24 13,-5 0,0 Z", c)}<path d="M0,-2 L0,-28" stroke="#3B5236" stroke-width="0.7" opacity="0.5"/></g>`;
  return `<g transform="scale(${escala})">${sombraPiso(40, 0.22)}
    <path d="M0,-40 C2,-90 -4,-130 0,-180" stroke="#5B4633" stroke-width="2" fill="none"/>
    <path d="M0,-110 C8,-120 12,-126 14,-128 M0,-140 C-8,-150 -12,-160 -12,-168" stroke="#5B4633" stroke-width="1.4" fill="none"/>
    ${hojas.map(([x, y, r, s], i) => hoja(x, y, r, s, i % 3 === 0 ? "#4F6B4A" : i % 3 === 1 ? "#62805A" : "#3F5A3C")).join("")}
    ${P("M-17,-42 L17,-42 L14,0 L-14,0 Z", cyl("#D9CFC0", 0.8))}
    ${R(-18, -44, 36, 4, 1, "#CFC3B1")}</g>`;
}

function cuadro(x, y, w, h, contenido, marco = "#2B2622") {
  return `<g transform="translate(${x} ${y})">
    ${R(4, 6, w, h, 0, "#000", `opacity="0.12" filter="${blurFilter(uid("bl"), 5)}"`)}
    ${R(0, 0, w, h, 0, marco)}${R(8, 8, w - 16, h - 16, 0, "#F6F1E8")}
    <g transform="translate(8 8)">${contenido(w - 16, h - 16)}</g></g>`;
}

function ventana(x, y, w, h, marco = "#F4EFE7") {
  const cielo = grad([
    [0, "#DCE6E4"],
    [1, "#F3EFE6"],
  ]);
  return `<g transform="translate(${x} ${y})">
    ${R(-10, -10, w + 20, h + 20, 2, shade(marco, -0.06))}
    ${R(0, 0, w, h, 0, cielo)}
    <path d="M0,${h * 0.72} C${w * 0.3},${h * 0.62} ${w * 0.6},${h * 0.7} ${w},${h * 0.6} L${w},${h} L0,${h} Z" fill="#B9C7B3" opacity="0.7"/>
    <path d="M0,${h * 0.8} C${w * 0.4},${h * 0.74} ${w * 0.7},${h * 0.82} ${w},${h * 0.76} L${w},${h} L0,${h} Z" fill="#9FB29A" opacity="0.7"/>
    ${R(w / 2 - 4, 0, 8, h, 0, marco)}${R(0, h * 0.45 - 4, w, 8, 0, marco)}
    ${R(-14, h + 4, w + 28, 10, 2, shade(marco, -0.1))}</g>`;
}

const DECO_PRODUCTOS = [
  {
    id: "sofa-tala",
    dib: "sofa",
    box: [232, 88],
    variantes: Object.fromEntries(["lino-crudo", "terracota", "oliva"].map((k) => [k, { tela: TELA[k] }])),
  },
  {
    id: "butaca-ceibo",
    dib: "butaca",
    box: [88, 94],
    variantes: { boucle: { tela: TELA.boucle }, terracota: { tela: TELA.terracota }, bosque: { tela: TELA.bosque } },
  },
  {
    id: "mesa-lapacho",
    dib: "mesa-lapacho",
    box: [92, 43],
    variantes: { roble: { madera: MADERA.roble }, nogal: { madera: MADERA.nogal }, negro: { madera: MADERA.negro } },
  },
  {
    id: "lampara-brisa",
    dib: "lampara-brisa",
    box: [60, 168],
    variantes: { laton: { metal: METAL.laton }, negro: { metal: METAL.negro } },
  },
  {
    id: "biblioteca-quebracho",
    dib: "biblioteca",
    box: [124, 182],
    variantes: { roble: { madera: MADERA.roble }, nogal: { madera: MADERA.nogal } },
  },
  {
    id: "alfombra-pampa",
    dib: "alfombra",
    box: [250, 62],
    variantes: { crudo: { base: "#E6DCCB", acento: "#9E5A3B" }, terracota: { base: "#B8704E", acento: "#EFE3CF" } },
  },
  {
    id: "mesa-algarrobo",
    dib: "mesa-algarrobo",
    box: [204, 78],
    variantes: { roble: { madera: MADERA.roble }, nogal: { madera: MADERA.nogal } },
  },
  { id: "silla-junco", dib: "silla-junco", box: [50, 84], variantes: { roble: { madera: MADERA.roble }, negro: { madera: MADERA.negro } } },
  {
    id: "colgante-luna",
    dib: "colgante-luna",
    box: [60, 60],
    colgante: true,
    variantes: { terracota: { color: "#B5653F" }, bosque: { color: "#2F4538" }, crudo: { color: "#E3D9C8" } },
  },
  {
    id: "aparador-tipa",
    dib: "aparador-tipa",
    box: [186, 86],
    variantes: { roble: { madera: MADERA.roble }, nogal: { madera: MADERA.nogal } },
  },
  {
    id: "jarron-barro",
    dib: "jarron-barro",
    box: [60, 140],
    variantes: { terracota: { ceramica: CERAMICA.terracota }, crudo: { ceramica: CERAMICA.crudo }, verde: { ceramica: CERAMICA.verde } },
  },
  {
    id: "cama-sauce",
    dib: "cama-sauce",
    box: [178, 116],
    variantes: { "lino-crudo": { tela: TELA["lino-crudo"] }, oliva: { tela: TELA.oliva }, terracota: { tela: TELA.terracota } },
  },
  {
    id: "mesa-luz-pino",
    dib: "mesa-luz-pino",
    box: [54, 60],
    variantes: { roble: { madera: MADERA.roble }, negro: { madera: MADERA.negro } },
  },
  { id: "espejo-arco", dib: "espejo-arco", box: [76, 174], variantes: { laton: { marco: METAL.laton }, roble: { marco: MADERA.roble } } },
  {
    id: "almohadon-trama",
    dib: "almohadon-trama",
    box: [70, 52],
    variantes: { terracota: { tela: TELA.terracota }, oliva: { tela: TELA.oliva }, bosque: { tela: TELA.bosque } },
  },
];

const FONDOS_DECO = ["#EEE6DA", "#E9E2D6", "#EFE8DE", "#E7DFD2"];

function productoDeco(p, varId, i) {
  const W = 1000;
  const H = 1000;
  const [bw, bh] = p.box;
  const s = Math.min(760 / bw, 580 / bh, 7.5);
  const baseY = p.colgante ? 520 : 760;
  const bg = FONDOS_DECO[i % FONDOS_DECO.length];
  const piso = grad([
    [0, shade(bg, -0.05)],
    [1, shade(bg, -0.02)],
  ]);
  const fondo = `${R(0, 0, W, H, 0, bg)}${P(`M0,700 C300,690 700,690 1000,700 L1000,1000 L0,1000 Z`, piso)}`;
  const dib = DIBUJOS[p.dib](p.variantes[varId], p.colgante ? { cable: 600 } : undefined);
  const g = `<g transform="translate(500 ${baseY}) scale(${s})">${dib}</g>`;
  return doc(W, H, g, fondo);
}

const escenas = {
  living: {
    pared: "#E8DDCD",
    piso: "#C8AE8C",
    deco: () =>
      ventana(110, 130, 300, 440) +
      `<polygon points="120,690 420,690 560,1000 0,1000" fill="#FFF8EA" opacity="0.18"/>` +
      cuadro(
        655,
        175,
        290,
        210,
        (w, h) =>
          `${R(0, 0, w, h, 0, "#EFE6D7")}<circle cx="${w * 0.62}" cy="${h * 0.42}" r="${h * 0.22}" fill="#B25F3C"/><path d="M0,${h * 0.78} C${w * 0.3},${h * 0.55} ${w * 0.55},${h * 0.62} ${w},${h * 0.5} L${w},${h} L0,${h} Z" fill="#2F4538"/><path d="M0,${h * 0.88} C${w * 0.4},${h * 0.76} ${w * 0.7},${h * 0.86} ${w},${h * 0.8} L${w},${h} L0,${h} Z" fill="#6F7451"/>`,
      ),
    items: [
      { p: "biblioteca-quebracho", x: 1335, y: 702, s: 2.3 },
      { deco: planta, x: 1540, y: 760, s: 2.4 },
      { p: "lampara-brisa", x: 1132, y: 742, s: 2.4 },
      { p: "alfombra-pampa", x: 800, y: 960, s: 3.2, opts: { topW: 230, botW: 300, h: 70 }, hx: 300, hy: 905 },
      { p: "sofa-tala", x: 800, y: 772, s: 2.5, hx: 150, hy: 690 },
      { p: "almohadon-trama", x: 645, y: 636, s: 2.2 },
      { p: "butaca-ceibo", x: 330, y: 820, s: 2.75 },
      { p: "mesa-lapacho", x: 815, y: 900, s: 2.9 },
      { p: "jarron-barro", x: 858, y: 776, s: 2.2 },
    ],
  },
  comedor: {
    pared: "#E6DBC8",
    piso: "#CDB597",
    deco: () =>
      R(0, 440, 1600, 250, 0, "#2F4538") +
      R(0, 436, 1600, 8, 0, "#24362B") +
      [60, 260, 460, 660, 860, 1060, 1260, 1460].map((x) => R(x, 470, 140, 190, 2, "none", 'stroke="#3A5345" stroke-width="3"')).join("") +
      cuadro(
        1060,
        160,
        200,
        250,
        (w, h) =>
          `${R(0, 0, w, h, 0, "#F1E9DC")}<path d="M${w * 0.2},${h} L${w * 0.2},${h * 0.45} A${w * 0.3},${w * 0.3} 0 0 1 ${w * 0.8},${h * 0.45} L${w * 0.8},${h} Z" fill="#C39462"/><circle cx="${w * 0.5}" cy="${h * 0.3}" r="${w * 0.12}" fill="#B25F3C"/>`,
      ) +
      `<polygon points="80,690 300,690 380,1000 0,1000" fill="#FFF8EA" opacity="0.12"/>`,
    items: [
      { p: "aparador-tipa", x: 1250, y: 700, s: 2.2 },
      { p: "jarron-barro", x: 1390, y: 513, s: 2.1, v: 1 },
      {
        deco: () =>
          R(-26, -10, 52, 10, 1, "#B25F3C") + R(-20, -18, 44, 8, 1, "#E9E1D2") + `<ellipse cx="0" cy="-20" rx="16" ry="3" fill="#3A3632"/>`,
        x: 1190,
        y: 513,
        s: 2.1,
      },
      { p: "silla-junco", x: 470, y: 772, s: 2.45 },
      { p: "silla-junco", x: 780, y: 772, s: 2.45, sinHotspot: true },
      { p: "colgante-luna", x: 500, y: 390, s: 2.5, opts: { cable: 200 } },
      { p: "colgante-luna", x: 760, y: 390, s: 2.5, opts: { cable: 200 }, sinHotspot: true },
      { p: "mesa-algarrobo", x: 625, y: 842, s: 2.65 },
      { p: "silla-junco", x: 300, y: 880, s: 2.9, sinHotspot: true },
      { p: "silla-junco", x: 950, y: 880, s: 2.9, sinHotspot: true },
      { deco: planta, x: 90, y: 800, s: 2.6 },
    ],
  },
  dormitorio: {
    pared: "#EADCCF",
    piso: "#CDB79D",
    deco: () =>
      cuadro(
        660,
        150,
        280,
        150,
        (w, h) =>
          `${R(0, 0, w, h, 0, "#F4EEE4")}<path d="M${w * 0.1},${h * 0.7} C${w * 0.3},${h * 0.2} ${w * 0.5},${h * 0.9} ${w * 0.7},${h * 0.35} S${w * 0.9},${h * 0.5} ${w * 0.92},${h * 0.3}" stroke="#2B2622" stroke-width="3" fill="none"/><circle cx="${w * 0.3}" cy="${h * 0.35}" r="${h * 0.12}" fill="#B25F3C" opacity="0.9"/>`,
      ) +
      `<g transform="translate(1110 646)"><rect x="-3" y="-60" width="6" height="60" fill="#B38B45"/><polygon points="-26,-60 26,-60 18,-96 -18,-96" fill="#EFE6D5"/><ellipse cx="0" cy="-60" rx="26" ry="3" fill="#FFF1CC"/><rect x="-14" y="-4" width="28" height="4" rx="2" fill="#B38B45"/></g>` +
      `<g transform="translate(500 646)"><rect x="-3" y="-60" width="6" height="60" fill="#B38B45"/><polygon points="-26,-60 26,-60 18,-96 -18,-96" fill="#EFE6D5"/><ellipse cx="0" cy="-60" rx="26" ry="3" fill="#FFF1CC"/><rect x="-14" y="-4" width="28" height="4" rx="2" fill="#B38B45"/></g>`,
    items: [
      { p: "alfombra-pampa", x: 805, y: 950, s: 3.1, v: 1, opts: { topW: 250, botW: 320, h: 70 }, sinHotspot: true },
      { p: "espejo-arco", x: 240, y: 790, s: 2.45 },
      { p: "mesa-luz-pino", x: 500, y: 790, s: 2.45 },
      { p: "mesa-luz-pino", x: 1110, y: 790, s: 2.45, sinHotspot: true },
      { p: "cama-sauce", x: 805, y: 800, s: 2.4 },
      { p: "almohadon-trama", x: 830, y: 672, s: 2.0 },
      { p: "lampara-brisa", x: 1320, y: 800, s: 2.45 },
      { deco: planta, x: 1500, y: 800, s: 2.5 },
    ],
  },
};

function escenaDeco(nombre) {
  const e = escenas[nombre];
  const W = 1600;
  const H = 1000;
  const piso = grad([
    [0, shade(e.piso, -0.08)],
    [1, shade(e.piso, 0.06)],
  ]);
  let fondo = R(0, 0, W, H, 0, vfill(e.pared, 0.04, -0.04)) + R(0, 690, W, 310, 0, piso);
  for (let i = -8; i <= 8; i++) {
    const xb = 800 + i * 150;
    fondo += `<line x1="${800 + i * 110}" y1="690" x2="${xb * 1 + i * 30}" y2="1000" stroke="${shade(e.piso, -0.14)}" stroke-width="1.5" opacity="0.45"/>`;
  }
  fondo += R(0, 684, W, 8, 0, shade(e.pared, -0.1));
  const vig = rgrad(
    [
      [0.55, "#000", 0],
      [1, "#1c140c", 0.22],
    ],
    { cx: 0.5, cy: 0.45, r: 0.75 },
  );
  const deco = e.deco();
  const hotspots = [];
  const cuerpos = e.items
    .map((it) => {
      if (it.deco) return `<g transform="translate(${it.x} ${it.y}) scale(${it.s})">${it.deco()}</g>`;
      const prod = DECO_PRODUCTOS.find((p) => p.id === it.p);
      const varIds = Object.keys(prod.variantes);
      const v = prod.variantes[varIds[it.v ?? 0]];
      const svg = DIBUJOS[prod.dib](v, it.opts);
      if (!it.sinHotspot) {
        const [, bh] = prod.box;
        const cy = prod.colgante ? it.y - 12 * it.s : prod.dib === "alfombra" ? it.y - 22 * it.s : it.y - bh * it.s * 0.5;
        const hx = it.x + (it.hx ?? 0);
        const hy = it.hy ?? cy;
        hotspots.push({ id: prod.id, v: varIds[it.v ?? 0], x: +((hx / W) * 100).toFixed(2), y: +((hy / H) * 100).toFixed(2) });
      }
      return `<g transform="translate(${it.x} ${it.y}) scale(${it.s})">${svg}</g>`;
    })
    .join("");
  const svg = doc(W, H, deco + cuerpos + R(0, 0, W, H, 0, vig), fondo);
  return { svg, hotspots };
}

async function deco() {
  let n = 0;
  for (const [i, p] of DECO_PRODUCTOS.entries()) {
    for (const varId of Object.keys(p.variantes)) {
      await guardar("deco", `producto-${p.id}-${varId}`, productoDeco(p, varId, i), { quality: 86 });
      n++;
    }
  }
  const hotspots = {};
  for (const nombre of Object.keys(escenas)) {
    const { svg, hotspots: h } = escenaDeco(nombre);
    hotspots[nombre] = h;
    await guardar("deco", `ambiente-${nombre}`, svg, { quality: 86 });
    n++;
  }
  const dest = path.join(RAIZ, "src/demos/catalogos/deco/hotspots.gen.json");
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, `${JSON.stringify(hotspots, null, 2)}\n`);
  console.log(`deco: ${n} imágenes`);
}

/* ================================================================== MAYORISTA */
/* Packaging inventado sobre fondo claro. Lienzo 480×480, base del producto en y=418. */

const SANS = "Liberation Sans, Arial, sans-serif";
const SERIF = "Liberation Serif, DejaVu Serif, serif";

/** Texto con opción de condensado (escala horizontal) y espaciado. */
function T(
  x,
  y,
  txt,
  { size = 20, weight = 700, fill = "#fff", anchor = "middle", family = SANS, cond = 1, ls = 0, italic = false, op = 1, max } = {},
) {
  if (max) {
    const k = family === SERIF ? (italic ? 0.47 : 0.52) : weight >= 600 ? 0.6 : 0.55;
    const ancho = String(txt).length * (size * k + ls);
    cond = Math.min(cond, max / ancho);
  }
  return `<g transform="translate(${x} ${y}) scale(${cond} 1)"><text x="0" y="0" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${ls}" opacity="${op}"${italic ? ' font-style="italic"' : ""}>${esc(txt)}</text></g>`;
}

/** Brillo lateral genérico para darle volumen a cualquier cuerpo. */
function volumen(clipD, { x0, x1 }) {
  const id = uid("vc");
  def(`<clipPath id="${id}"><path d="${clipD}"/></clipPath>`);
  const g = grad(
    [
      [0, "#000", 0.22],
      [0.12, "#000", 0.02],
      [0.22, "#fff", 0.28],
      [0.3, "#fff", 0.04],
      [0.78, "#000", 0.02],
      [1, "#000", 0.3],
    ],
    { x1: x0, x2: x1, y1: 0, y2: 0, units: "userSpaceOnUse" },
  );
  return `<g clip-path="url(#${id})"><rect x="${x0}" y="0" width="${x1 - x0}" height="480" fill="${g}"/></g>`;
}

function ilustracion(tipo, cx, cy, s = 1, c = "#fff") {
  const g = (body) => `<g transform="translate(${cx} ${cy}) scale(${s})">${body}</g>`;
  switch (tipo) {
    case "fideos":
      return g(
        [
          [-22, -8],
          [4, -14],
          [24, 4],
          [-8, 12],
          [14, 18],
          [-26, 16],
        ]
          .map(
            ([x, y], i) =>
              `<path d="M${x - 8},${y} q4,-8 8,0 t8,0 t8,0" stroke="#E7B85A" stroke-width="5" fill="none" stroke-linecap="round" transform="rotate(${i * 35} ${x} ${y})"/>`,
          )
          .join(""),
      );
    case "spaghetti":
      return g(
        [...Array(9)]
          .map(
            (_, i) =>
              `<line x1="${-34 + i * 2}" y1="${-18 + i * 4}" x2="${34 + i * 2}" y2="${-24 + i * 4}" stroke="#E4B456" stroke-width="2.4" stroke-linecap="round"/>`,
          )
          .join(""),
      );
    case "arroz":
      return g(
        [...Array(22)]
          .map(
            (_, i) =>
              `<ellipse cx="${((i * 37) % 70) - 35}" cy="${((i * 23) % 40) - 20}" rx="5" ry="2.2" fill="#FFFDF6" stroke="#BFAE86" stroke-width="0.6" transform="rotate(${(i * 47) % 180} ${((i * 37) % 70) - 35} ${((i * 23) % 40) - 20})"/>`,
          )
          .join(""),
      );
    case "hoja":
      return g(
        `<path d="M0,34 C-30,10 -24,-26 0,-40 C24,-26 30,10 0,34 Z" fill="${c}"/><path d="M0,30 L0,-34 M0,-10 L-12,-20 M0,4 L12,-8 M0,16 L-12,6" stroke="${shade(c, -0.35)}" stroke-width="2" fill="none"/>`,
      );
    case "trigo":
      return g(
        `<path d="M0,40 L0,-40" stroke="${c}" stroke-width="3"/>` +
          [...Array(5)]
            .map(
              (_, i) =>
                `<ellipse cx="-7" cy="${-30 + i * 13}" rx="5" ry="10" fill="${c}" transform="rotate(-30 -7 ${-30 + i * 13})"/><ellipse cx="7" cy="${-30 + i * 13}" rx="5" ry="10" fill="${c}" transform="rotate(30 7 ${-30 + i * 13})"/>`,
            )
            .join(""),
      );
    case "cubos":
      return g(
        `<g fill="${c}"><rect x="-30" y="-6" width="26" height="26" rx="3"/><rect x="2" y="-6" width="26" height="26" rx="3"/><rect x="-14" y="-34" width="26" height="26" rx="3"/></g><g fill="#000" opacity="0.08"><rect x="-30" y="12" width="26" height="8"/><rect x="2" y="12" width="26" height="8"/><rect x="-14" y="-16" width="26" height="8"/></g>`,
      );
    case "cafe":
      return g(
        [
          [-14, 0, -20],
          [14, -6, 25],
          [0, 16, 5],
        ]
          .map(
            ([x, y, r]) =>
              `<g transform="translate(${x} ${y}) rotate(${r})"><ellipse rx="12" ry="16" fill="#5A3621"/><path d="M0,-14 C-5,-4 5,4 0,14" stroke="#2E1A0F" stroke-width="2.5" fill="none"/></g>`,
          )
          .join(""),
      );
    case "tomate":
      return g(
        `<circle r="28" fill="#D8352A"/><circle cx="-9" cy="-9" r="8" fill="#fff" opacity="0.3"/><path d="M-12,-26 L0,-18 L12,-26 L6,-30 L0,-24 L-6,-30 Z" fill="#3E8E3A"/>`,
      );
    case "arvejas":
      return g(
        `<path d="M-40,8 C-20,-22 20,-22 40,8 C20,18 -20,18 -40,8 Z" fill="#5E9E3A"/>${[-24, -8, 8, 24].map((x) => `<circle cx="${x}" cy="2" r="7.5" fill="#8BC34A"/><circle cx="${x - 2.5}" cy="-0.5" r="2.4" fill="#fff" opacity="0.35"/>`).join("")}`,
      );
    case "galletita":
      return g(
        [
          [-18, 6],
          [16, -2],
          [0, -18],
        ]
          .map(
            ([x, y]) =>
              `<g transform="translate(${x} ${y})"><rect x="-18" y="-18" width="36" height="36" rx="5" fill="#E9C58A"/>${[-9, 0, 9].map((a) => [-9, 0, 9].map((b) => `<circle cx="${a}" cy="${b}" r="1.6" fill="#B98C4E"/>`).join("")).join("")}</g>`,
          )
          .join(""),
      );
    case "galletita-dulce":
      return g(
        [
          [-16, 4],
          [16, 4],
          [0, -16],
        ]
          .map(
            ([x, y]) =>
              `<g transform="translate(${x} ${y})"><circle r="17" fill="#E3B26A"/><circle r="12" fill="none" stroke="#C48A45" stroke-width="2" stroke-dasharray="3 3"/></g>`,
          )
          .join(""),
      );
    case "burbujas":
      return g(
        [
          [-18, 6, 12],
          [10, -10, 16],
          [18, 18, 8],
          [-4, -26, 7],
          [-26, -16, 5],
        ]
          .map(
            ([x, y, r]) =>
              `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="0.85"/><circle cx="${x - r / 3}" cy="${y - r / 3}" r="${r / 4}" fill="#fff"/>`,
          )
          .join(""),
      );
    case "gota":
      return g(
        `<path d="M0,-34 C14,-12 24,2 24,14 C24,28 13,36 0,36 C-13,36 -24,28 -24,14 C-24,2 -14,-12 0,-34 Z" fill="${c}"/><path d="M-12,12 C-12,22 -6,26 0,27" stroke="#fff" stroke-width="3" fill="none" opacity="0.6"/>`,
      );
    case "limon":
      return g(
        `<ellipse rx="26" ry="19" fill="#F4D23C"/><ellipse cx="26" cy="0" rx="5" ry="4" fill="#E5BF22"/><path d="M-10,-24 C0,-34 14,-32 18,-24 C8,-22 0,-20 -10,-24 Z" fill="#4E9A3C"/>`,
      );
    case "flor":
      return g(
        [0, 72, 144, 216, 288].map((r) => `<ellipse cx="0" cy="-14" rx="9" ry="15" fill="${c}" transform="rotate(${r})"/>`).join("") +
          `<circle r="8" fill="#F7D774"/>`,
      );
    case "nube":
      return g(`<path d="M-34,14 C-44,14 -44,-4 -32,-6 C-30,-22 -10,-26 -2,-14 C6,-28 30,-24 30,-6 C44,-6 44,14 32,14 Z" fill="${c}"/>`);
    case "montana":
      return g(
        `<path d="M-44,24 L-14,-20 L2,2 L18,-14 L44,24 Z" fill="${c}"/><path d="M-14,-20 L-6,-8 L-14,-4 L-20,-12 Z" fill="#fff"/><circle cx="24" cy="-24" r="8" fill="#F2C94C"/>`,
      );
    case "uva":
      return g(
        [
          [0, -18],
          [-10, -6],
          [10, -6],
          [-18, 6],
          [0, 6],
          [18, 6],
          [-10, 18],
          [10, 18],
          [0, 30],
        ]
          .map(
            ([x, y]) =>
              `<circle cx="${x}" cy="${y}" r="8" fill="${c}"/><circle cx="${x - 3}" cy="${y - 3}" r="2" fill="#fff" opacity="0.4"/>`,
          )
          .join("") + `<path d="M0,-26 L4,-38 M4,-34 C12,-40 20,-36 22,-30" stroke="#6B8E23" stroke-width="3" fill="none"/>`,
      );
    case "durazno":
      return g(
        `<circle r="26" fill="#F6A04D"/><path d="M0,-24 C-6,-6 -6,10 0,24" stroke="#E07B2E" stroke-width="3" fill="none"/><path d="M2,-24 C10,-40 26,-36 26,-30 C16,-26 8,-24 2,-24 Z" fill="#5C9A3A"/>`,
      );
    case "diente":
      return g(
        `<path d="M-18,-22 C-10,-28 -4,-22 0,-22 C4,-22 10,-28 18,-22 C26,-14 20,6 16,24 C14,30 8,30 6,22 C4,14 -4,14 -6,22 C-8,30 -14,30 -16,24 C-20,6 -26,-14 -18,-22 Z" fill="#fff"/>`,
      );
    case "leche":
      return g(`<path d="M-44,20 C-30,-6 -10,-10 0,-2 C10,-12 30,-6 44,20 Z" fill="#fff"/><circle cx="18" cy="-18" r="6" fill="#fff"/>`);
    default:
      return "";
  }
}

const PACK = {
  bolsa(p) {
    const d = "M158,118 Q150,262 158,404 L322,404 Q330,262 322,118 Z";
    const crimp = (y, h) => {
      let pts = "";
      for (let x = 156; x <= 324; x += 8) pts += `L${x},${y + h} L${x + 4},${y + h + 5} `;
      return `<path d="M156,${y} L324,${y} L324,${y + h} ${pts.replace(/^L/, "L")} L156,${y + h} Z" fill="${shade(p.c1, -0.12)}"/>`;
    };
    return [
      crimp(96, 22),
      P(d, p.c1),
      `<path d="M150,396 L330,396 L330,412 L150,412 Z" fill="${shade(p.c1, -0.12)}"/>`,
      R(170, 150, 140, 58, 10, p.c2),
      T(240, 188, p.marca, { max: 128, size: 26, cond: 0.78, fill: p.c3 ?? "#fff", family: p.serif ? SERIF : SANS, italic: p.serif }),
      T(240, 232, p.nombre, { max: 140, size: 19, cond: 0.8, fill: p.tinta ?? "#fff" }),
      p.ventana
        ? `${R(182, 250, 116, 92, 44, p.ventana === "arroz" ? "#D9CBA8" : "#F8F1E0")}${R(182, 250, 116, 92, 44, "none", `stroke="${shade(p.c1, -0.2)}" stroke-width="3"`)}${ilustracion(p.ventana, 240, 296, 1)}`
        : ilustracion(p.ilus, 240, 296, 1, p.c3),
      `<circle cx="296" cy="364" r="22" fill="${p.c2}" stroke="#fff" stroke-width="3"/>`,
      T(296, 370, p.peso, { size: 13, cond: 0.85, fill: "#fff" }),
      volumen(d, { x0: 150, x1: 330 }),
    ].join("");
  },
  paquete(p) {
    const frente = "M172,124 L300,124 L300,410 L172,410 Z";
    return [
      `<polygon points="172,124 300,124 290,92 182,92" fill="${shade(p.c1, 0.14)}"/>`,
      `<polygon points="182,92 290,92 286,84 186,84" fill="${shade(p.c1, -0.05)}"/>`,
      P(frente, vfill(p.c1, 0.04, -0.06)),
      `<polygon points="300,124 318,112 318,398 300,410" fill="${shade(p.c1, -0.25)}"/>`,
      `<polygon points="300,124 318,112 308,82 290,92" fill="${shade(p.c1, 0.02)}"/>`,
      R(172, 146, 128, 46, 0, p.c2),
      T(236, 177, p.marca, { max: 116, size: 24, cond: 0.74, fill: p.c3 ?? "#fff", family: p.serif ? SERIF : SANS, italic: p.serif }),
      `<circle cx="236" cy="268" r="46" fill="${p.circulo ?? "#fff"}" opacity="0.95"/>`,
      ilustracion(p.ilus, 236, 268, 0.9, p.c3 ?? p.c2),
      T(236, 346, p.nombre, { max: 118, size: 18, cond: 0.78, fill: p.tinta ?? "#fff" }),
      T(236, 380, p.peso, { size: 22, cond: 0.8, fill: p.tinta ?? "#fff" }),
      volumen(frente, { x0: 172, x1: 300 }),
    ].join("");
  },
  botella(p) {
    const { H = 300, W = 110, clara = false, liquido = "#333", tapa = "#C62828", etiqueta = "#C62828" } = p;
    const x0 = 240 - W / 2;
    const x1 = 240 + W / 2;
    const top = 418 - H;
    const cuello = top + H * 0.2;
    const d = `M${240 - 15},${top + 12} L${240 + 15},${top + 12} L${240 + 15},${top + 24} C${240 + 16},${cuello - 10} ${x1},${cuello} ${x1},${cuello + 40} L${x1},${top + H * 0.5} C${x1 - 6},${top + H * 0.55} ${x1 - 6},${top + H * 0.6} ${x1},${top + H * 0.65} L${x1},410 Q${x1},418 ${x1 - 10},418 L${x0 + 10},418 Q${x0},418 ${x0},410 L${x0},${top + H * 0.65} C${x0 + 6},${top + H * 0.6} ${x0 + 6},${top + H * 0.55} ${x0},${top + H * 0.5} L${x0},${cuello + 40} C${x0},${cuello} ${240 - 16},${cuello - 10} ${240 - 15},${top + 24} Z`;
    const cuerpo = clara
      ? `${P(d, liquido, 'opacity="0.55"')}${P(d, "none", `stroke="${shade(liquido, -0.2)}" stroke-width="1.5" opacity="0.5"`)}<rect x="${x0}" y="${top + H * 0.12}" width="${W}" height="3" fill="#fff" opacity="0.35"/>`
      : P(d, liquido);
    const ly = top + H * 0.5;
    const lh = H * 0.3;
    return [
      cuerpo,
      R(240 - 19, top - 6, 38, 22, 4, vfill(tapa, 0.15, -0.15)),
      [...Array(6)].map((_, i) => R(240 - 17 + i * 6.5, top - 4, 2, 18, 1, shade(tapa, -0.2), 'opacity="0.5"')).join(""),
      R(240 - 22, top + 14, 44, 5, 2, shade(tapa, -0.1)),
      R(x0 - 1, ly, W + 2, lh, 2, etiqueta),
      p.franja ? R(x0 - 1, ly + lh - 14, W + 2, 8, 0, p.franja) : "",
      T(240, ly + lh * 0.42, p.marca, {
        max: W - 12,
        size: Math.min(26, W * 0.24),
        cond: 0.76,
        fill: p.c3 ?? "#fff",
        family: p.serif ? SERIF : SANS,
        italic: p.serif,
      }),
      T(240, ly + lh * 0.72, p.nombre, { max: W - 14, size: Math.min(15, W * 0.14), cond: 0.8, fill: p.tinta ?? "#fff" }),
      p.ilus ? ilustracion(p.ilus, 240, top + H * 0.3, 0.55, p.c3 ?? "#fff") : "",
      volumen(d, { x0, x1 }),
    ].join("");
  },
  lata(p) {
    const { alta = false } = p;
    const w = alta ? 104 : 132;
    const h = alta ? 292 : 190;
    const x0 = 240 - w / 2;
    const top = 418 - h;
    const d = `M${x0},${top + 8} L${x0 + w},${top + 8} L${x0 + w},${418 - 6} Q${240},${424} ${x0},${418 - 6} Z`;
    return [
      P(d, p.c1),
      `<ellipse cx="240" cy="${top + 8}" rx="${w / 2}" ry="${w * 0.09}" fill="${grad([
        [0, "#F2F4F6"],
        [1, "#9EA7B0"],
      ])}"/>`,
      `<ellipse cx="240" cy="${top + 8}" rx="${w / 2 - 6}" ry="${w * 0.09 - 3}" fill="#C5CCD3"/>`,
      alta ? `<ellipse cx="${240 + 8}" cy="${top + 8}" rx="14" ry="5" fill="#AEB6BE" stroke="#8C959E" stroke-width="2"/>` : "",
      R(x0, top + 16, w, 10, 0, shade(p.c1, -0.18)),
      R(x0, 418 - 26, w, 10, 0, shade(p.c1, -0.18)),
      p.ilus
        ? `<circle cx="240" cy="${top + h * (alta ? 0.64 : 0.56)}" r="${alta ? 34 : 27}" fill="${p.circulo ?? "#fff"}"/>` +
          ilustracion(p.ilus, 240, top + h * (alta ? 0.64 : 0.56), alta ? 0.62 : 0.78, p.c3)
        : "",
      R(x0, top + h * 0.24, w, alta ? 64 : 44, 0, p.c2),
      T(240, top + h * 0.24 + (alta ? 42 : 31), p.marca, {
        max: w - 12,
        size: alta ? 30 : 27,
        cond: 0.72,
        fill: p.c3 ?? "#fff",
        family: p.serif ? SERIF : SANS,
        italic: p.serif,
      }),
      T(240, 418 - 34, p.nombre, { max: w - 14, size: alta ? 15 : 16, cond: 0.8, fill: p.tinta ?? "#fff" }),
      volumen(d, { x0, x1: x0 + w }),
    ].join("");
  },
  caja(p) {
    const { w = 150, h = 210, prof = 34 } = p;
    const x0 = 232 - w / 2;
    const top = 418 - h;
    const frente = `M${x0},${top} L${x0 + w},${top} L${x0 + w},418 L${x0},418 Z`;
    return [
      `<polygon points="${x0},${top} ${x0 + w},${top} ${x0 + w + prof * 0.6},${top - prof * 0.45} ${x0 + prof * 0.6},${top - prof * 0.45}" fill="${shade(p.c1, 0.16)}"/>`,
      `<polygon points="${x0 + w},${top} ${x0 + w + prof * 0.6},${top - prof * 0.45} ${x0 + w + prof * 0.6},${418 - prof * 0.45} ${x0 + w},418" fill="${shade(p.c1, -0.28)}"/>`,
      P(frente, vfill(p.c1, 0.06, -0.06)),
      R(x0, top + 14, w, Math.min(52, h * 0.26), 0, p.c2),
      T(x0 + w / 2, top + 14 + Math.min(52, h * 0.26) * 0.68, p.marca, {
        max: w - 16,
        size: Math.min(28, h * 0.14),
        cond: 0.74,
        fill: p.c3 ?? "#fff",
        family: p.serif ? SERIF : SANS,
        italic: p.serif,
      }),
      h < 100
        ? ""
        : p.circulo
          ? `<circle cx="${x0 + w / 2}" cy="${top + h * 0.6}" r="${Math.min(h * 0.22, 44)}" fill="${p.circulo}"/>`
          : "",
      h < 100 ? "" : ilustracion(p.ilus, x0 + w / 2, top + h * 0.6, Math.min(1, h / 190), p.c3 ?? "#fff"),
      T(x0 + w / 2, 418 - 14, p.nombre, { max: w - 16, size: Math.min(17, h * 0.1), cond: 0.8, fill: p.tinta ?? "#fff" }),
      R(x0, top, 5, h, 0, "#fff", 'opacity="0.18"'),
    ].join("");
  },
  rollo(p) {
    const rollo = (x) =>
      `${R(
        x,
        150,
        92,
        262,
        14,
        grad(
          [
            [0, "#E3E6EA"],
            [0.3, "#FFFFFF"],
            [1, "#D7DBE0"],
          ],
          { x2: 1, y2: 0 },
        ),
      )}<ellipse cx="${x + 46}" cy="152" rx="46" ry="11" fill="#F7F8FA"/><ellipse cx="${x + 46}" cy="152" rx="15" ry="4" fill="#C9B79C"/>`;
    return [
      rollo(146),
      rollo(242),
      R(140, 140, 200, 280, 20, "#fff", 'opacity="0.18" stroke="#fff" stroke-width="2"'),
      R(140, 250, 200, 90, 6, p.c1, 'opacity="0.96"'),
      T(240, 292, p.marca, { size: 36, cond: 0.74, fill: "#fff", family: SERIF, italic: true }),
      T(240, 322, p.nombre, { size: 16, cond: 0.8, fill: "#fff" }),
      ilustracion("nube", 300, 225, 0.6, p.c2),
    ].join("");
  },
  bidon(p) {
    const d = "M150,164 Q150,140 176,140 L256,140 L270,110 L318,110 Q334,110 334,130 L334,396 Q334,418 312,418 L172,418 Q150,418 150,396 Z";
    const agujero = "M282,126 L318,126 Q322,126 322,132 L322,174 L270,174 Z";
    return [
      P(d, p.c1),
      P(agujero, "#F4F6F9"),
      R(168, 124, 40, 22, 5, vfill(p.tapa ?? p.c2, 0.15, -0.15)),
      R(160, 222, 164, 150, 10, p.c2),
      T(242, 272, p.marca, { max: 148, size: 34, cond: 0.74, fill: p.c3 ?? "#fff", family: p.serif ? SERIF : SANS, italic: p.serif }),
      T(242, 300, p.nombre, { max: 148, size: 17, cond: 0.8, fill: p.tinta ?? "#fff" }),
      ilustracion(p.ilus, 242, 336, 0.6, p.c3 ?? "#fff"),
      `<circle cx="296" cy="392" r="18" fill="#fff"/>`,
      T(296, 397, p.peso, { size: 13, cond: 0.85, fill: p.c2 }),
      volumen(d, { x0: 150, x1: 334 }),
    ].join("");
  },
  doypack(p) {
    const d = "M168,118 L312,118 L316,396 Q240,428 164,396 Z";
    return [
      P(d, p.c1),
      R(166, 112, 148, 18, 3, shade(p.c1, -0.14)),
      R(270, 92, 26, 24, 4, vfill(p.c2, 0.15, -0.15)),
      R(266, 112, 34, 8, 2, shade(p.c2, -0.2)),
      `<circle cx="240" cy="254" r="58" fill="${p.circulo ?? "#fff"}" opacity="0.9"/>`,
      ilustracion(p.ilus, 240, 254, 1, p.c3 ?? p.c2),
      T(240, 180, p.marca, { max: 130, size: 32, cond: 0.74, fill: p.c3 ?? "#fff", family: p.serif ? SERIF : SANS, italic: p.serif }),
      T(240, 346, p.nombre, { max: 130, size: 17, cond: 0.8, fill: p.tinta ?? "#fff" }),
      T(240, 376, p.peso, { size: 16, cond: 0.8, fill: p.tinta ?? "#fff" }),
      volumen(d, { x0: 164, x1: 316 }),
    ].join("");
  },
  tetra(p) {
    const x0 = 178;
    const x1 = 290;
    return [
      `<polygon points="${x0},150 ${x1},150 ${x1 + 26},136 ${x0 + 26},136" fill="${shade(p.c1, 0.2)}"/>`,
      `<polygon points="${x0 + 4},136 ${x1 + 22},136 ${x1 + 14},108 ${x0 + 12},108" fill="${shade(p.c1, 0.08)}"/>`,
      R(x1 - 10, 112, 18, 12, 3, p.c2),
      `<polygon points="${x1},150 ${x1 + 26},136 ${x1 + 26},404 ${x1},418" fill="${shade(p.c1, -0.26)}"/>`,
      R(x0, 150, x1 - x0, 268, 0, vfill(p.c1, 0.05, -0.06)),
      R(x0, 170, x1 - x0, 50, 0, p.c2),
      T((x0 + x1) / 2, 204, p.marca, {
        max: 102,
        size: 25,
        cond: 0.72,
        fill: p.c3 ?? "#fff",
        family: p.serif ? SERIF : SANS,
        italic: p.serif,
      }),
      ilustracion(p.ilus, (x0 + x1) / 2, 292, 0.95, p.c3 ?? "#fff"),
      T((x0 + x1) / 2, 370, p.nombre, { max: 102, size: 16, cond: 0.78, fill: p.tinta ?? "#fff" }),
      T((x0 + x1) / 2, 398, p.peso, { size: 15, cond: 0.8, fill: p.tinta ?? "#fff" }),
      R(x0, 150, 5, 268, 0, "#fff", 'opacity="0.2"'),
    ].join("");
  },
  frasco(p) {
    const d = "M172,190 Q172,176 186,176 L294,176 Q308,176 308,190 L308,398 Q308,418 288,418 L192,418 Q172,418 172,398 Z";
    return [
      P(d, p.c1),
      R(166, 138, 148, 40, 8, vfill(p.c2, 0.18, -0.18)),
      [...Array(14)].map((_, i) => R(172 + i * 10, 142, 3, 32, 1.5, shade(p.c2, -0.2), 'opacity="0.4"')).join(""),
      R(172, 236, 136, 124, 6, p.etiqueta ?? "#FFF6E5"),
      T(240, 270, p.marca, { max: 124, size: 25, cond: 0.74, fill: p.c2, family: SERIF, italic: true }),
      ilustracion("leche", 240, 312, 0.7, "#fff"),
      `<path d="M198,300 Q240,280 282,300 L282,318 Q240,330 198,318 Z" fill="${p.c1}"/>`,
      T(240, 348, p.nombre, { max: 124, size: 15, cond: 0.8, fill: p.c2 }),
      volumen(d, { x0: 172, x1: 308 }),
    ].join("");
  },
};

/** Productos del mayorista con su packaging. Los ids coinciden con src/demos/catalogos/mayorista/datos.ts */
const MAYORISTA = [
  {
    id: "al-1001",
    t: "bolsa",
    marca: "Doña Clara",
    serif: true,
    nombre: "Tirabuzón",
    peso: "500 g",
    c1: "#1F4E9A",
    c2: "#E53935",
    ventana: "fideos",
  },
  {
    id: "al-1002",
    t: "bolsa",
    marca: "Doña Clara",
    serif: true,
    nombre: "Spaghetti",
    peso: "500 g",
    c1: "#1F4E9A",
    c2: "#F2B705",
    c3: "#1F2A44",
    ventana: "spaghetti",
  },
  {
    id: "al-1010",
    t: "bolsa",
    marca: "Campo Alto",
    nombre: "Arroz largo fino",
    peso: "1 kg",
    c1: "#F4F1E8",
    c2: "#2E7D32",
    tinta: "#2E7D32",
    ventana: "arroz",
  },
  {
    id: "al-1015",
    t: "paquete",
    marca: "Molino Serrano",
    nombre: "Harina 000",
    peso: "1 kg",
    c1: "#F7F4EC",
    c2: "#C62828",
    c3: "#fff",
    tinta: "#C62828",
    circulo: "#F2E4C6",
    ilus: "trigo",
  },
  {
    id: "al-1016",
    t: "paquete",
    marca: "Dulzura",
    serif: true,
    nombre: "Azúcar común",
    peso: "1 kg",
    c1: "#1565C0",
    c2: "#fff",
    c3: "#1565C0",
    circulo: "#E3F2FD",
    ilus: "cubos",
  },
  {
    id: "al-1020",
    t: "paquete",
    marca: "La Tranquera",
    serif: true,
    nombre: "Yerba con palo",
    peso: "1 kg",
    c1: "#2E6B30",
    c2: "#F2C230",
    c3: "#1E3D1F",
    circulo: "#F7E9A8",
    ilus: "hoja",
  },
  {
    id: "al-1021",
    t: "paquete",
    marca: "La Tranquera",
    serif: true,
    nombre: "Yerba suave",
    peso: "500 g",
    c1: "#8BB04C",
    c2: "#2E6B30",
    c3: "#fff",
    circulo: "#F4F7E6",
    ilus: "hoja",
  },
  {
    id: "al-1030",
    t: "botella",
    H: 318,
    W: 104,
    clara: true,
    liquido: "#E9B92F",
    tapa: "#2E7D32",
    etiqueta: "#2E7D32",
    marca: "Olivar del Sur",
    serif: true,
    nombre: "Girasol 1,5 L",
    franja: "#F2C230",
    ilus: "flor",
    c3: "#fff",
  },
  {
    id: "al-1040",
    t: "tetra",
    marca: "Huerta Fina",
    serif: true,
    nombre: "Puré de tomate",
    peso: "520 g",
    c1: "#C62828",
    c2: "#2E7D32",
    ilus: "tomate",
    c3: "#fff",
  },
  {
    id: "al-1041",
    t: "lata",
    marca: "Huerta Fina",
    serif: true,
    nombre: "Tomate perita",
    c1: "#D32F2F",
    c2: "#2E7D32",
    ilus: "tomate",
    c3: "#fff",
  },
  {
    id: "al-1042",
    t: "lata",
    marca: "Huerta Fina",
    serif: true,
    nombre: "Arvejas secas",
    c1: "#2E7D32",
    c2: "#F2C230",
    c3: "#1B4D1E",
    ilus: "arvejas",
  },
  {
    id: "al-1050",
    escala: 1.2,
    circulo: "#E3F2FD",
    t: "caja",
    w: 190,
    h: 150,
    prof: 40,
    marca: "Crocante",
    nombre: "Galletitas de agua",
    c1: "#1976D2",
    c2: "#fff",
    c3: "#1976D2",
    ilus: "galletita",
  },
  {
    id: "al-1051",
    escala: 1.2,
    circulo: "#FFF3E0",
    t: "caja",
    w: 170,
    h: 160,
    prof: 36,
    marca: "Crocante",
    nombre: "Dulces de vainilla",
    c1: "#F2A93B",
    c2: "#6D3B1E",
    c3: "#fff",
    tinta: "#6D3B1E",
    ilus: "galletita-dulce",
  },
  { id: "al-1060", t: "frasco", marca: "Pradera Mansa", nombre: "Dulce de leche 400 g", c1: "#9C5B2E", c2: "#1E4F8A" },
  {
    id: "al-1061",
    t: "doypack",
    marca: "Doña Clara",
    serif: true,
    nombre: "Mayonesa",
    peso: "475 g",
    c1: "#F7E7A1",
    c2: "#1F4E9A",
    c3: "#1F4E9A",
    tinta: "#1F4E9A",
    circulo: "#fff",
    ilus: "gota",
  },
  {
    id: "al-1070",
    t: "bolsa",
    marca: "Tostadero",
    serif: true,
    nombre: "Café molido",
    peso: "250 g",
    c1: "#2B1B12",
    c2: "#C8963E",
    c3: "#2B1B12",
    tinta: "#F3E3C3",
    ilus: "cafe",
  },
  {
    id: "al-1071",
    escala: 1.5,
    circulo: "#F4EBD0",
    t: "caja",
    w: 150,
    h: 120,
    prof: 60,
    marca: "Brote",
    serif: true,
    nombre: "Té x 25 saquitos",
    c1: "#2F6F4F",
    c2: "#E8D8A8",
    c3: "#2F6F4F",
    ilus: "hoja",
  },
  {
    id: "al-1080",
    t: "tetra",
    marca: "Pradera Mansa",
    nombre: "Leche entera",
    peso: "1 litro",
    c1: "#F4F7FB",
    c2: "#1E4F8A",
    c3: "#fff",
    tinta: "#1E4F8A",
    ilus: "montana",
  },
  {
    id: "be-2001",
    t: "botella",
    H: 350,
    W: 116,
    clara: false,
    liquido: "#2A140E",
    tapa: "#D32F2F",
    etiqueta: "#D32F2F",
    marca: "Burbuja",
    nombre: "Cola 2,25 L",
    franja: "#fff",
    c3: "#fff",
  },
  {
    id: "be-2002",
    t: "botella",
    H: 350,
    W: 116,
    clara: true,
    liquido: "#9CCC65",
    tapa: "#2E7D32",
    etiqueta: "#2E7D32",
    marca: "Burbuja",
    nombre: "Lima limón 2,25 L",
    franja: "#F2E14C",
    c3: "#fff",
  },
  {
    id: "be-2003",
    t: "botella",
    H: 318,
    W: 104,
    clara: true,
    liquido: "#F59E2B",
    tapa: "#EF6C00",
    etiqueta: "#EF6C00",
    marca: "Burbuja",
    nombre: "Naranja 1,5 L",
    franja: "#fff",
    c3: "#fff",
  },
  {
    id: "be-2010",
    t: "botella",
    H: 330,
    W: 108,
    clara: true,
    liquido: "#B3DDF2",
    tapa: "#1565C0",
    etiqueta: "#1565C0",
    marca: "Manantial",
    serif: true,
    nombre: "Sin gas 2 L",
    ilus: "montana",
    c3: "#fff",
  },
  {
    id: "be-2011",
    t: "botella",
    H: 318,
    W: 104,
    clara: true,
    liquido: "#B3DDF2",
    tapa: "#00897B",
    etiqueta: "#00897B",
    marca: "Manantial",
    serif: true,
    nombre: "Con gas 1,5 L",
    ilus: "burbujas",
    c3: "#fff",
  },
  {
    id: "be-2030",
    t: "lata",
    alta: true,
    marca: "Cumbre",
    nombre: "Rubia 473 ml",
    c1: "#F2B705",
    c2: "#1F2A44",
    c3: "#F2B705",
    tinta: "#1F2A44",
    ilus: "montana",
  },
  {
    id: "be-2031",
    t: "lata",
    alta: true,
    marca: "Cumbre",
    nombre: "Negra 473 ml",
    c1: "#2B1B12",
    c2: "#C8963E",
    c3: "#2B1B12",
    ilus: "montana",
  },
  {
    id: "be-2040",
    t: "tetra",
    marca: "Viña Brava",
    serif: true,
    nombre: "Vino tinto",
    peso: "1 litro",
    c1: "#5B1426",
    c2: "#E8D8A8",
    c3: "#5B1426",
    ilus: "uva",
  },
  {
    id: "be-2041",
    t: "tetra",
    marca: "Frutal",
    nombre: "Jugo de durazno",
    peso: "1 litro",
    c1: "#FFB74D",
    c2: "#E65100",
    c3: "#fff",
    tinta: "#8A3A00",
    ilus: "durazno",
  },
  {
    id: "li-3001",
    t: "botella",
    H: 280,
    W: 112,
    clara: false,
    liquido: "#F4F7FB",
    tapa: "#1565C0",
    etiqueta: "#1565C0",
    marca: "Brillo Sur",
    nombre: "Lavandina 1 L",
    franja: "#E53935",
    c3: "#fff",
  },
  {
    id: "li-3002",
    t: "bidon",
    marca: "Brillo Sur",
    nombre: "Lavandina",
    peso: "5 L",
    c1: "#F4F7FB",
    c2: "#1565C0",
    tapa: "#E53935",
    ilus: "gota",
  },
  {
    id: "li-3010",
    t: "botella",
    H: 300,
    W: 86,
    clara: true,
    liquido: "#C0DA3E",
    tapa: "#F2B705",
    etiqueta: "#F2B705",
    marca: "Brillo Sur",
    nombre: "Limón 750 ml",
    c3: "#1F4E9A",
    tinta: "#1F4E9A",
    ilus: "limon",
  },
  {
    id: "li-3020",
    t: "caja",
    w: 150,
    h: 230,
    prof: 50,
    marca: "Espuma Real",
    serif: true,
    nombre: "Polvo 800 g",
    c1: "#1E88E5",
    c2: "#fff",
    c3: "#1E88E5",
    ilus: "burbujas",
  },
  {
    id: "li-3021",
    t: "bidon",
    marca: "Espuma Real",
    serif: true,
    nombre: "Líquido ropa",
    peso: "3 L",
    c1: "#7E57C2",
    c2: "#fff",
    c3: "#5E35B1",
    tinta: "#5E35B1",
    tapa: "#5E35B1",
    ilus: "flor",
  },
  {
    id: "li-3030",
    t: "doypack",
    marca: "Nube",
    serif: true,
    nombre: "Suavizante",
    peso: "900 ml",
    c1: "#90CAF9",
    c2: "#EC407A",
    c3: "#fff",
    circulo: "#E3F2FD",
    ilus: "nube",
    tinta: "#1F3F73",
  },
  {
    id: "li-3040",
    t: "botella",
    H: 300,
    W: 104,
    clara: true,
    liquido: "#B39DDB",
    tapa: "#5E35B1",
    etiqueta: "#5E35B1",
    marca: "Aroma Hogar",
    serif: true,
    nombre: "Lavanda 900 ml",
    ilus: "flor",
    c3: "#fff",
  },
  { id: "pe-4001", t: "rollo", marca: "Pulcra", nombre: "Hoja simple · 4 u", c1: "#0277BD", c2: "#B3E5FC" },
  { id: "pe-4002", t: "rollo", marca: "Pulcra", nombre: "Rollo de cocina · 3 u", c1: "#2E7D32", c2: "#C8E6C9" },
  {
    id: "pe-4010",
    escala: 1.7,
    circulo: "#fff",
    t: "caja",
    w: 160,
    h: 90,
    prof: 40,
    marca: "Espuma Real",
    serif: true,
    nombre: "Jabón tocador 90 g",
    c1: "#F8BBD0",
    c2: "#AD1457",
    c3: "#fff",
    tinta: "#AD1457",
    ilus: "flor",
  },
  {
    id: "pe-4020",
    t: "botella",
    H: 270,
    W: 100,
    clara: false,
    liquido: "#00796B",
    tapa: "#6D4C41",
    etiqueta: "#FFF3E0",
    marca: "Raíz",
    serif: true,
    nombre: "Shampoo nutritivo",
    c3: "#6D4C41",
    tinta: "#6D4C41",
    franja: "#C8963E",
    ilus: "hoja",
  },
  {
    id: "pe-4030",
    escala: 1.55,
    circulo: "#0288D1",
    t: "caja",
    w: 220,
    h: 80,
    prof: 34,
    marca: "Menta Clara",
    nombre: "Crema dental 90 g",
    c1: "#E3F2FD",
    c2: "#0288D1",
    c3: "#fff",
    tinta: "#0288D1",
    ilus: "diente",
  },
  {
    id: "de-5001",
    t: "paquete",
    marca: "Pulcra",
    serif: true,
    nombre: "Servilletas x 100",
    peso: "33 × 33",
    c1: "#F4F7FB",
    c2: "#0277BD",
    c3: "#fff",
    tinta: "#0277BD",
    circulo: "#E1F5FE",
    ilus: "nube",
  },
  {
    id: "de-5010",
    escala: 1.12,
    circulo: "#F2B705",
    t: "caja",
    w: 170,
    h: 200,
    prof: 36,
    marca: "Fuerte",
    nombre: "Bolsas 50 × 70 x 10",
    c1: "#263238",
    c2: "#F2B705",
    c3: "#263238",
    ilus: "montana",
  },
];

function productoMayorista(p) {
  const bg =
    R(0, 0, 480, 480, 0, "#F3F5F8") +
    `<ellipse cx="240" cy="422" rx="120" ry="12" fill="#1c2530" opacity="0.18" filter="${blurFilter(uid("bl"), 7)}"/>`;
  const k = p.escala ?? 1;
  const cuerpo = k === 1 ? PACK[p.t](p) : `<g transform="translate(240 418) scale(${k}) translate(-240 -418)">${PACK[p.t](p)}</g>`;
  return doc(480, 480, cuerpo, bg);
}

async function mayorista() {
  for (const p of MAYORISTA) await guardar("mayorista", p.id, productoMayorista(p), { quality: 84 });
  console.log(`mayorista: ${MAYORISTA.length} imágenes`);
}

/* =================================================================== VINOTECA */
/* Botellas con etiquetas diseñadas, fondo transparente. Lienzo 400×1000. */

const FORMAS = {
  bordelesa: {
    x0: 125,
    x1: 275,
    top: 100,
    cap: 252,
    d: "M178,100 L222,100 L222,290 C222,330 275,345 275,400 L275,950 Q275,965 260,965 L140,965 Q125,965 125,950 L125,400 C125,345 178,330 178,290 Z",
  },
  borgona: {
    x0: 120,
    x1: 280,
    top: 100,
    cap: 238,
    d: "M180,100 L220,100 L220,250 C220,340 280,360 280,470 L280,950 Q280,965 265,965 L135,965 Q120,965 120,950 L120,470 C120,360 180,340 180,250 Z",
  },
  espumante: {
    x0: 115,
    x1: 285,
    top: 90,
    cap: 330,
    d: "M176,90 L224,90 L224,250 C226,340 285,370 285,480 L285,950 Q285,968 267,968 L133,968 Q115,968 115,950 L115,480 C115,370 174,340 176,250 Z",
  },
  alsaciana: {
    x0: 138,
    x1: 262,
    top: 60,
    cap: 250,
    d: "M182,60 L218,60 L218,300 C218,400 262,420 262,500 L262,955 Q262,968 250,968 L150,968 Q138,968 138,955 L138,500 C138,420 182,400 182,300 Z",
  },
};

const VIDRIO = { verde: "#1C2A1D", oscuro: "#101310", negro: "#0D0D0C", ambar: "#3A2412" };

const ETIQUETAS = {
  clasica(v, { lx, ly, lw, lh }) {
    const { fondo, tinta, acento } = v.pal;
    const cx = lx + lw / 2;
    const hy = ly + 70;
    let filas = "";
    for (let i = 0; i < 7; i++) {
      const y = hy + 52 + i * 6;
      filas += `<line x1="${lx + 16 + i * 3}" y1="${y}" x2="${lx + lw - 16 - i * 3}" y2="${y - 10}" stroke="${tinta}" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.8"/>`;
    }
    return [
      R(lx, ly, lw, lh, 2, fondo),
      R(lx + 6, ly + 6, lw - 12, lh - 12, 1, "none", `stroke="${tinta}" stroke-width="1.1"`),
      R(lx + 9.5, ly + 9.5, lw - 19, lh - 19, 1, "none", `stroke="${acento}" stroke-width="0.6"`),
      T(cx, ly + 34, v.bodega.toUpperCase(), { size: 9.5, weight: 400, family: SERIF, fill: tinta, ls: 2, max: lw - 40 }),
      `<path d="M${cx - 30},${ly + 44} H${cx - 6} M${cx + 6},${ly + 44} H${cx + 30}" stroke="${acento}" stroke-width="0.8"/><rect x="${cx - 3}" y="${ly + 41}" width="6" height="6" transform="rotate(45 ${cx} ${ly + 44})" fill="${acento}"/>`,
      `<circle cx="${cx + 22}" cy="${hy + 8}" r="11" fill="none" stroke="${tinta}" stroke-width="0.9"/>`,
      `<path d="M${lx + 14},${hy + 50} C${lx + 40},${hy + 18} ${cx},${hy + 24} ${cx + 8},${hy + 34} C${cx + 24},${hy + 16} ${lx + lw - 30},${hy + 20} ${lx + lw - 14},${hy + 40}" fill="none" stroke="${tinta}" stroke-width="1.1"/>`,
      filas,
      T(cx, ly + 176, v.nombre, { size: 25, weight: 400, family: SERIF, italic: true, fill: tinta, max: lw - 22 }),
      T(cx, ly + 200, v.cepa.toUpperCase(), { size: 10, weight: 700, family: SANS, fill: acento, ls: 2.4, max: lw - 24 }),
      T(cx, ly + 228, `${v.region} · Argentina`, { size: 8.5, weight: 400, family: SERIF, fill: tinta, italic: true, max: lw - 24 }),
      T(cx, ly + 258, v.anio, { size: 15, weight: 700, family: SERIF, fill: acento, ls: 1 }),
    ].join("");
  },
  minimal(v, { lx, ly, lw, lh }) {
    const { fondo, oro } = v.pal;
    const cx = lx + lw / 2;
    return [
      R(lx, ly, lw, lh, 1, fondo),
      R(lx + 8, ly + 8, lw - 16, lh - 16, 0, "none", `stroke="${oro}" stroke-width="0.8"`),
      T(cx, ly + 150, v.inicial, { size: 118, weight: 400, family: SERIF, fill: oro }),
      `<line x1="${cx - 22}" y1="${ly + 172}" x2="${cx + 22}" y2="${ly + 172}" stroke="${oro}" stroke-width="0.8"/>`,
      T(cx, ly + 196, v.nombre.toUpperCase(), { size: 11.5, weight: 400, family: SERIF, fill: oro, ls: 3, max: lw - 40 }),
      T(cx, ly + 216, v.cepa, { size: 12, weight: 400, family: SERIF, italic: true, fill: shade(oro, 0.45), max: lw - 26 }),
      T(cx, ly + 250, `${v.bodega} · ${v.anio}`, { size: 8.5, weight: 400, family: SANS, fill: oro, ls: 1.2, max: lw - 26 }),
    ].join("");
  },
  montana(v, { lx, ly, lw, lh }) {
    const { cielo, m1, m2, m3, sol } = v.pal;
    const cx = lx + lw / 2;
    const b = ly + 176;
    const clip = uid("clip");
    def(`<clipPath id="${clip}"><rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" rx="2"/></clipPath>`);
    return [
      `<g clip-path="url(#${clip})">`,
      R(lx, ly, lw, lh, 2, cielo),
      `<circle cx="${lx + lw * 0.68}" cy="${ly + 74}" r="19" fill="${sol}"/>`,
      `<polygon points="${lx},${b - 50} ${lx + lw * 0.3},${b - 96} ${lx + lw * 0.52},${b - 64} ${lx + lw * 0.78},${b - 104} ${lx + lw},${b - 60} ${lx + lw},${b} ${lx},${b}" fill="${m1}"/>`,
      `<polygon points="${lx + lw * 0.3},${b - 96} ${lx + lw * 0.36},${b - 84} ${lx + lw * 0.3},${b - 80} ${lx + lw * 0.25},${b - 86}" fill="#fff" opacity="0.85"/>`,
      `<polygon points="${lx + lw * 0.78},${b - 104} ${lx + lw * 0.85},${b - 90} ${lx + lw * 0.78},${b - 86} ${lx + lw * 0.72},${b - 94}" fill="#fff" opacity="0.85"/>`,
      `<polygon points="${lx},${b - 20} ${lx + lw * 0.22},${b - 52} ${lx + lw * 0.46},${b - 26} ${lx + lw * 0.7},${b - 58} ${lx + lw},${b - 18} ${lx + lw},${b} ${lx},${b}" fill="${m2}"/>`,
      R(lx, b - 4, lw, lh - 172, 0, m3),
      `</g>`,
      T(cx, ly + 26, v.bodega.toUpperCase(), { size: 8.5, weight: 700, family: SANS, fill: m3, ls: 2, max: lw - 22 }),
      T(cx, b + 38, v.nombre, { size: 22, weight: 400, family: SERIF, fill: cielo, max: lw - 20 }),
      T(cx, b + 60, v.cepa.toUpperCase(), { size: 9.5, weight: 700, family: SANS, fill: sol, ls: 2, max: lw - 20 }),
      T(cx, b + 88, `${v.region} · ${v.anio}`, { size: 9, weight: 400, family: SERIF, italic: true, fill: cielo, max: lw - 20 }),
    ].join("");
  },
  geometrica(v, { lx, ly, lw, lh }) {
    const { fondo, a, b: c2, texto } = v.pal;
    const clip = uid("clip");
    def(`<clipPath id="${clip}"><rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" rx="2"/></clipPath>`);
    return [
      `<g clip-path="url(#${clip})">`,
      R(lx, ly, lw, lh, 2, fondo),
      `<circle cx="${lx + lw * 0.36}" cy="${ly + 88}" r="52" fill="${a}"/>`,
      `<circle cx="${lx + lw * 0.72}" cy="${ly + 118}" r="40" fill="${c2}" opacity="0.92"/>`,
      `<polygon points="${lx - 10},${ly + 176} ${lx + lw + 10},${ly + 136} ${lx + lw + 10},${ly + 146} ${lx - 10},${ly + 186}" fill="${texto}"/>`,
      `</g>`,
      T(lx + 12, ly + 216, v.nombre, { size: 21, weight: 700, family: SANS, fill: texto, anchor: "start", cond: 0.82, max: lw - 24 }),
      T(lx + 12, ly + 236, v.cepa, { size: 11, weight: 400, family: SANS, fill: texto, anchor: "start", max: lw - 24 }),
      `<line x1="${lx + 12}" y1="${ly + 250}" x2="${lx + lw - 12}" y2="${ly + 250}" stroke="${texto}" stroke-width="0.6"/>`,
      T(lx + 12, ly + 266, v.bodega.toUpperCase(), {
        size: 7.5,
        weight: 700,
        family: SANS,
        fill: texto,
        anchor: "start",
        ls: 1.2,
        max: lw - 60,
      }),
      T(lx + lw - 12, ly + 266, v.anio, { size: 10, weight: 700, family: SANS, fill: texto, anchor: "end" }),
    ].join("");
  },
  tipografica(v, { lx, ly, lw, lh }) {
    const { fondo, tinta, acento } = v.pal;
    const palabra = v.grande ?? v.cepa;
    const tam = Math.min(46, (lh - 30) / (palabra.length * 0.5));
    return [
      R(lx, ly, lw, lh, 2, fondo),
      `<g transform="translate(${lx + 44} ${ly + lh - 16}) rotate(-90)"><text x="0" y="0" font-family="${SERIF}" font-size="${tam}" font-weight="700" fill="${tinta}">${esc(palabra)}</text></g>`,
      R(lx + 58, ly + 16, 12, 12, 0, acento),
      T(lx + 58, ly + 52, v.bodega, { size: 9, weight: 700, family: SANS, fill: tinta, anchor: "start", max: lw - 70, ls: 0.5 }),
      `<line x1="${lx + 58}" y1="${ly + 62}" x2="${lx + lw - 12}" y2="${ly + 62}" stroke="${tinta}" stroke-width="0.6"/>`,
      T(lx + 58, ly + 170, v.nombre, { size: 17, weight: 400, family: SERIF, italic: true, fill: tinta, anchor: "start", max: lw - 68 }),
      T(lx + 58, ly + 190, v.region, { size: 8.5, weight: 400, family: SANS, fill: tinta, anchor: "start", max: lw - 68 }),
      T(lx + 58, ly + lh - 20, v.anio, { size: 14, weight: 700, family: SANS, fill: acento, anchor: "start" }),
    ].join("");
  },
  espumante(v, { lx, ly, lw, lh }) {
    const { fondo, oro, tinta } = v.pal;
    const cx = lx + lw / 2;
    const d = `M${lx},${ly + 30} Q${cx},${ly - 14} ${lx + lw},${ly + 30} L${lx + lw},${ly + lh} L${lx},${ly + lh} Z`;
    return [
      P(d, fondo),
      R(
        lx,
        ly + 120,
        lw,
        26,
        0,
        grad(
          [
            [0, shade(oro, -0.2)],
            [0.5, shade(oro, 0.3)],
            [1, shade(oro, -0.2)],
          ],
          { x2: 1, y2: 0 },
        ),
      ),
      T(cx, ly + 138, "EXTRA BRUT", { size: 10.5, weight: 700, family: SANS, fill: tinta, ls: 3 }),
      T(cx, ly + 56, v.bodega.toUpperCase(), { size: 8.5, weight: 400, family: SERIF, fill: tinta, ls: 2, max: lw - 30 }),
      T(cx, ly + 98, v.nombre, { size: 26, weight: 400, family: SERIF, italic: true, fill: tinta, max: lw - 24 }),
      T(cx, ly + 180, "Método tradicional", { size: 10, weight: 400, family: SERIF, italic: true, fill: tinta, max: lw - 24 }),
      T(cx, ly + 200, v.region, { size: 8.5, weight: 400, family: SANS, fill: tinta, ls: 1, max: lw - 24 }),
      `<circle cx="${cx}" cy="${ly + 236}" r="14" fill="none" stroke="${oro}" stroke-width="1.2"/>`,
      T(cx, ly + 240, v.inicial ?? "B", { size: 13, weight: 400, family: SERIF, fill: oro }),
    ].join("");
  },
};

const VINOS = [
  {
    id: "arce-malbec",
    forma: "bordelesa",
    vidrio: "verde",
    capsula: "#6E1423",
    et: "clasica",
    bodega: "Finca Lucía Arce",
    nombre: "Arce",
    cepa: "Malbec",
    region: "Valle de Uco",
    anio: "2022",
    pal: { fondo: "#EFE6D2", tinta: "#2A1A14", acento: "#7A1F2B" },
  },
  {
    id: "ventisca-reserva-malbec",
    forma: "bordelesa",
    vidrio: "oscuro",
    capsula: "#151313",
    et: "minimal",
    inicial: "V",
    bodega: "Bodega Ventisca",
    nombre: "Ventisca Reserva",
    cepa: "Malbec",
    region: "Luján de Cuyo",
    anio: "2020",
    pal: { fondo: "#151313", oro: "#C9A55A" },
  },
  {
    id: "cerro-callado-cabernet-franc",
    forma: "bordelesa",
    vidrio: "verde",
    capsula: "#1F2A44",
    et: "montana",
    bodega: "Cerro Callado",
    nombre: "Cerro Callado",
    cepa: "Cabernet Franc",
    region: "Valle de Uco",
    anio: "2021",
    pal: { cielo: "#EDE3CD", m1: "#9AA7BA", m2: "#566A8E", m3: "#1F2A44", sol: "#C0563A" },
  },
  {
    id: "tierra-quieta-bonarda",
    forma: "bordelesa",
    vidrio: "verde",
    capsula: "#C0563A",
    et: "geometrica",
    bodega: "Tierra Quieta",
    nombre: "Tierra Quieta",
    cepa: "Bonarda",
    region: "Luján de Cuyo",
    anio: "2023",
    pal: { fondo: "#F3EEE6", a: "#C0563A", b: "#6E1423", texto: "#1A1414" },
  },
  {
    id: "medano-syrah",
    forma: "bordelesa",
    vidrio: "ambar",
    capsula: "#2A1A14",
    et: "tipografica",
    bodega: "Bodega Médano",
    nombre: "Médano",
    cepa: "Syrah",
    region: "Valle de Tulum",
    anio: "2021",
    pal: { fondo: "#C9A879", tinta: "#2A1A14", acento: "#6E1423" },
  },
  {
    id: "paso-nubes-torrontes",
    forma: "alsaciana",
    vidrio: "flint",
    vino: "#E6D27A",
    capsula: "#C9A55A",
    et: "montana",
    bodega: "Paso de las Nubes",
    nombre: "Paso de las Nubes",
    cepa: "Torrontés",
    region: "Cafayate",
    anio: "2024",
    pal: { cielo: "#E3ECEF", m1: "#B7C6CF", m2: "#7E95A3", m3: "#2F4858", sol: "#E7B84A" },
  },
  {
    id: "altura-2300-malbec",
    forma: "borgona",
    vidrio: "oscuro",
    capsula: "#6E1423",
    et: "minimal",
    inicial: "A",
    bodega: "Paso de las Nubes",
    nombre: "Altura 2300",
    cepa: "Malbec de altura",
    region: "Cafayate",
    anio: "2021",
    pal: { fondo: "#5E1220", oro: "#E3C88A" },
  },
  {
    id: "aljibe-pinot-noir",
    forma: "borgona",
    vidrio: "verde",
    capsula: "#2E4237",
    et: "clasica",
    bodega: "Viñas del Aljibe",
    nombre: "Aljibe",
    cepa: "Pinot Noir",
    region: "Patagonia",
    anio: "2022",
    pal: { fondo: "#E9E4D4", tinta: "#1E2A22", acento: "#2E4237" },
  },
  {
    id: "aljibe-chardonnay",
    forma: "borgona",
    vidrio: "flint",
    vino: "#E2C86A",
    capsula: "#C9A55A",
    et: "geometrica",
    bodega: "Viñas del Aljibe",
    nombre: "Aljibe",
    cepa: "Chardonnay",
    region: "Patagonia",
    anio: "2023",
    pal: { fondo: "#F6F2EA", a: "#E2B44A", b: "#2E4237", texto: "#1A1414" },
  },
  {
    id: "tres-soles-sauvignon",
    forma: "bordelesa",
    vidrio: "flint",
    vino: "#DCE0A0",
    capsula: "#8FA35A",
    et: "tipografica",
    grande: "Sauvignon",
    bodega: "Tres Soles",
    nombre: "Tres Soles",
    cepa: "Sauvignon Blanc",
    region: "Valle de Uco",
    anio: "2024",
    pal: { fondo: "#F4F1E8", tinta: "#243024", acento: "#8FA35A" },
  },
  {
    id: "gran-ventisca-blend",
    forma: "bordelesa",
    vidrio: "negro",
    capsula: "#B8914A",
    et: "minimal",
    inicial: "G",
    bodega: "Bodega Ventisca",
    nombre: "Gran Ventisca",
    cepa: "Blend de tintas",
    region: "Luján de Cuyo",
    anio: "2019",
    pal: { fondo: "#0E0D0C", oro: "#D4B06A" },
  },
  {
    id: "olmedo-cabernet",
    forma: "bordelesa",
    vidrio: "verde",
    capsula: "#3A2A20",
    et: "clasica",
    bodega: "Casa Olmedo",
    nombre: "Casa Olmedo",
    cepa: "Cabernet Sauvignon",
    region: "Famatina",
    anio: "2021",
    pal: { fondo: "#F1E8D6", tinta: "#3A2A20", acento: "#8A5A2B" },
  },
  {
    id: "olmedo-rosado",
    forma: "bordelesa",
    vidrio: "flint",
    vino: "#EBA3A0",
    capsula: "#E6C7C0",
    et: "geometrica",
    bodega: "Casa Olmedo",
    nombre: "Olmedo Rosé",
    cepa: "Rosado de Malbec",
    region: "Famatina",
    anio: "2024",
    pal: { fondo: "#FBF3EF", a: "#E27D7A", b: "#C9A55A", texto: "#3A1A1A" },
  },
  {
    id: "brisa-nueva-extra-brut",
    forma: "espumante",
    vidrio: "verde",
    capsula: "#C9A55A",
    et: "espumante",
    inicial: "B",
    bodega: "Bodega Ventisca",
    nombre: "Brisa Nueva",
    cepa: "Chardonnay · Pinot Noir",
    region: "Valle de Uco",
    anio: "NV",
    pal: { fondo: "#F2EBDD", oro: "#C9A55A", tinta: "#1E1A16" },
  },
  {
    id: "medano-dulce-natural",
    forma: "alsaciana",
    vidrio: "flint",
    vino: "#E5B75A",
    capsula: "#6E1423",
    et: "tipografica",
    grande: "Tardío",
    bodega: "Bodega Médano",
    nombre: "Médano Dulce",
    cepa: "Torrontés tardío",
    region: "Valle de Tulum",
    anio: "2023",
    pal: { fondo: "#EFE3C8", tinta: "#3A1A14", acento: "#C0563A" },
  },
  {
    id: "arce-gran-reserva",
    forma: "bordelesa",
    vidrio: "oscuro",
    capsula: "#151313",
    et: "clasica",
    bodega: "Finca Lucía Arce",
    nombre: "Arce Gran Reserva",
    cepa: "Malbec",
    region: "Valle de Uco",
    anio: "2018",
    pal: { fondo: "#1B1716", tinta: "#D9C28E", acento: "#C9A55A" },
  },
];

function botella(v) {
  const f = FORMAS[v.forma];
  const clip = uid("clip");
  def(`<clipPath id="${clip}"><path d="${f.d}"/></clipPath>`);
  const flint = v.vidrio === "flint";
  const cuerpo = flint
    ? `${P(f.d, "#EEF1EC", 'opacity="0.35"')}<g clip-path="url(#${clip})">${R(0, f.cap + 90, 400, 1000, 0, vfill(v.vino, 0.08, -0.12), 'opacity="0.92"')}${R(0, f.cap + 88, 400, 4, 0, shade(v.vino, 0.3), 'opacity="0.8"')}</g>`
    : P(f.d, VIDRIO[v.vidrio]);
  const brillo = grad(
    [
      [0, "#000", 0.55],
      [0.14, "#000", 0.05],
      [0.2, "#fff", flint ? 0.35 : 0.2],
      [0.26, "#fff", 0.02],
      [0.72, "#000", 0.0],
      [0.86, "#fff", flint ? 0.12 : 0.07],
      [0.9, "#000", 0.1],
      [1, "#000", 0.6],
    ],
    { x1: f.x0, x2: f.x1, y1: 0, y2: 0, units: "userSpaceOnUse" },
  );
  const lw = f.x1 - f.x0 - 16;
  const ly = v.forma === "alsaciana" ? 600 : v.forma === "espumante" ? 600 : 580;
  const lh = v.forma === "alsaciana" ? 280 : 290;
  const et = ETIQUETAS[v.et](v, { lx: f.x0 + 8, ly, lw, lh });
  const curva = grad(
    [
      [0, "#000", 0.28],
      [0.18, "#000", 0],
      [0.3, "#fff", 0.14],
      [0.4, "#fff", 0],
      [0.85, "#000", 0.05],
      [1, "#000", 0.35],
    ],
    { x2: 1, y2: 0 },
  );
  const cap = v.capsula;
  const capGrad = grad(
    [
      [0, shade(cap, -0.35)],
      [0.3, shade(cap, 0.25)],
      [0.45, shade(cap, 0.1)],
      [1, shade(cap, -0.45)],
    ],
    { x2: 1, y2: 0 },
  );
  let capsula;
  if (v.forma === "espumante") {
    capsula = `<g clip-path="url(#${clip})">${P(`M0,0 L400,0 L400,${f.cap} L260,${f.cap} L250,${f.cap + 14} L238,${f.cap - 2} L226,${f.cap + 16} L214,${f.cap} L200,${f.cap + 14} L188,${f.cap - 2} L176,${f.cap + 16} L164,${f.cap} L150,${f.cap + 12} L140,${f.cap} L0,${f.cap} Z`, capGrad)}${R(0, 250, 400, 10, 0, shade(cap, -0.3), 'opacity="0.6"')}</g>`;
  } else {
    capsula = `<g clip-path="url(#${clip})">${R(0, 0, 400, f.cap, 0, capGrad)}${R(0, f.cap - 8, 400, 2, 0, "#000", 'opacity="0.35"')}${R(0, f.top + 14, 400, 1.5, 0, "#fff", 'opacity="0.2"')}</g>`;
  }
  const sombra = `<ellipse cx="200" cy="968" rx="120" ry="14" fill="#000" opacity="0.55" filter="${blurFilter(uid("bl"), 8)}"/>`;
  return doc(
    400,
    1000,
    [
      sombra,
      cuerpo,
      capsula,
      `<g clip-path="url(#${clip})"><rect x="0" y="0" width="400" height="1000" fill="${brillo}"/></g>`,
      `<g>${et}${R(f.x0 + 8, ly, lw, lh, 0, curva)}</g>`,
      `<rect x="${f.x0 + 18}" y="${f.cap + 120}" width="6" height="${900 - f.cap - 160}" rx="3" fill="#fff" opacity="${flint ? 0.28 : 0.14}" filter="${blurFilter(uid("bl"), 2)}"/>`,
    ].join(""),
  );
}

async function vinoteca() {
  for (const v of VINOS) await guardar("vinoteca", `vino-${v.id}`, botella(v), { quality: 86, alpha: true });
  console.log(`vinoteca: ${VINOS.length} imágenes`);
}

/* ======================================================================= main */

const pedidos = process.argv.slice(2);
const todas = {
  deco,
  mayorista: typeof mayorista === "function" ? mayorista : null,
  vinoteca: typeof vinoteca === "function" ? vinoteca : null,
};
for (const [k, fn] of Object.entries(todas)) {
  if (!fn) continue;
  if (pedidos.length && !pedidos.includes(k)) continue;
  await fn();
}
