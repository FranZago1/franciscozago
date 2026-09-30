// Genera las ilustraciones (WebP) de las demos de web apps.
// Uso: node scripts/demos/web-apps.mjs
// Usa `sharp`, que ya viene con Next.js. Las ilustraciones son SVG propios exportados a WebP.
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(import.meta.dirname, "..", "..", "public", "demos", "web-apps");

async function write(rel, svg, width) {
  const out = join(root, rel);
  mkdirSync(dirname(out), { recursive: true });
  await sharp(Buffer.from(svg), { density: 144 }).resize({ width }).webp({ quality: 88, alphaQuality: 90 }).toFile(out);
  console.log("✓", rel);
}

/* ---------- Cotizador: ambiente isométrico en obra ---------- */

const S = 22; // tamaño de la unidad isométrica
const CX = 360;
const CY = 250;
const C30 = Math.cos(Math.PI / 6);
const iso = (x, y, z = 0) => [CX + (x - y) * C30 * S, CY + (x + y) * 0.5 * S - z * S];
const pts = (...p) => p.map((q) => iso(...q).map((n) => n.toFixed(1)).join(",")).join(" ");
const poly = (fill, stroke, ...p) => `<polygon points="${pts(...p)}" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/>`;

function caja(x, y, z, w, d, h, top, left, right, stroke = "#1A1A18") {
  return [
    poly(left, stroke, [x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]),
    poly(right, stroke, [x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]),
    poly(top, stroke, [x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]),
  ].join("");
}

function plano() {
  const L = 10;
  const H = 7;
  let s = "";
  // Sombra suave
  s += `<ellipse cx="${CX}" cy="${CY + L * S * 0.55}" rx="${L * S * 0.9}" ry="${L * S * 0.24}" fill="#1A1A18" opacity=".08"/>`;
  // Paredes (fondo izquierdo y fondo derecho)
  s += poly("#CFCCC4", "#1A1A18", [0, 0, 0], [0, L, 0], [0, L, H], [0, 0, H]);
  s += poly("#E4E2DC", "#1A1A18", [0, 0, 0], [L, 0, 0], [L, 0, H], [0, 0, H]);
  // Pared derecha pintada a medias en amarillo
  s += poly("#FFC700", "none", [0, 0, 0], [5.2, 0, 0], [5.2, 0, H], [0, 0, H]);
  s += `<polyline points="${pts([5.2, 0, 0], [5.2, 0, H])}" fill="none" stroke="#1A1A18" stroke-width="2" stroke-dasharray="6 5"/>`;
  s += poly("none", "#1A1A18", [0, 0, 0], [L, 0, 0], [L, 0, H], [0, 0, H]);
  // Ventana en la pared izquierda
  s += poly("#9FB4B8", "#1A1A18", [0, 3, 2.6], [0, 6.4, 2.6], [0, 6.4, 5.6], [0, 3, 5.6]);
  s += `<polyline points="${pts([0, 4.7, 2.6], [0, 4.7, 5.6])}" stroke="#1A1A18" stroke-width="2"/>`;
  s += poly("#B9CBCE", "none", [0, 3.2, 4.4], [0, 4.1, 5.4], [0, 4.4, 5.4], [0, 3.5, 4.4]);
  // Piso: hormigón y porcelanato colocado a medias
  s += poly("#B9B6AE", "#1A1A18", [0, 0, 0], [L, 0, 0], [L, L, 0], [0, L, 0]);
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (i + j > 5) continue;
      const tono = (i + j) % 2 ? "#F2F0EB" : "#E6E3DC";
      s += poly(tono, "#1A1A18", [i * 2, j * 2, 0], [i * 2 + 2, j * 2, 0], [i * 2 + 2, j * 2 + 2, 0], [i * 2, j * 2 + 2, 0]);
    }
  }
  // Cota de medida sobre el borde del piso
  const [ax, ay] = iso(L + 0.8, 0, 0);
  const [bx, by] = iso(L + 0.8, L, 0);
  s += `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="#1A1A18" stroke-width="1.6"/>`;
  s += `<line x1="${ax - 6}" y1="${ay - 4}" x2="${ax + 6}" y2="${ay + 4}" stroke="#1A1A18" stroke-width="1.6"/>`;
  s += `<line x1="${bx - 6}" y1="${by - 4}" x2="${bx + 6}" y2="${by + 4}" stroke="#1A1A18" stroke-width="1.6"/>`;
  const [mx, my] = iso(L + 1.9, L / 2, 0);
  s += `<text x="${mx}" y="${my}" font-family="monospace" font-size="17" font-weight="700" fill="#1A1A18" transform="rotate(30 ${mx} ${my})">4,20 m</text>`;
  // Pila de cerámicos
  s += caja(6.6, 1.2, 0, 2.2, 2.2, 0.35, "#F2F0EB", "#D7D4CC", "#C7C3BA");
  s += caja(6.6, 1.2, 0.35, 2.2, 2.2, 0.35, "#E6E3DC", "#D7D4CC", "#C7C3BA");
  s += caja(6.6, 1.2, 0.7, 2.2, 2.2, 0.35, "#F2F0EB", "#D7D4CC", "#C7C3BA");
  // Balde de pintura
  const [bcx, bcy] = iso(7.6, 6.2, 0);
  s += `<path d="M${bcx - 26} ${bcy - 44} L${bcx - 22} ${bcy} A22 9 0 0 0 ${bcx + 22} ${bcy} L${bcx + 26} ${bcy - 44} Z" fill="#1A1A18"/>`;
  s += `<ellipse cx="${bcx}" cy="${bcy - 44}" rx="26" ry="10" fill="#FFC700" stroke="#1A1A18" stroke-width="2"/>`;
  s += `<rect x="${bcx - 22}" y="${bcy - 30}" width="44" height="12" fill="#FFC700"/>`;
  s += `<path d="M${bcx - 26} ${bcy - 44} Q${bcx} ${bcy - 86} ${bcx + 26} ${bcy - 44}" fill="none" stroke="#1A1A18" stroke-width="2.4"/>`;
  // Escalera apoyada en la pared del fondo
  const e1 = iso(2.4, 0.3, 0);
  const e2 = iso(2.4, 0.3, 6.2);
  const e3 = iso(4.2, 0.3, 0);
  const e4 = iso(4.2, 0.3, 6.2);
  const b1 = iso(2.4, 2.4, 0);
  const b3 = iso(4.2, 2.4, 0);
  s += `<g stroke="#1A1A18" stroke-width="5" stroke-linecap="round">`;
  s += `<line x1="${b1[0]}" y1="${b1[1]}" x2="${e2[0]}" y2="${e2[1]}"/>`;
  s += `<line x1="${b3[0]}" y1="${b3[1]}" x2="${e4[0]}" y2="${e4[1]}"/>`;
  s += `</g>`;
  for (let k = 1; k <= 5; k++) {
    const t = k / 6;
    const p = [b1[0] + (e2[0] - b1[0]) * t, b1[1] + (e2[1] - b1[1]) * t];
    const q = [b3[0] + (e4[0] - b3[0]) * t, b3[1] + (e4[1] - b3[1]) * t];
    s += `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="#FFC700" stroke-width="4" stroke-linecap="round"/>`;
  }
  void e1;
  void e3;
  // Rodillo
  const [rx, ry] = iso(3.1, 5.8, 0);
  s += `<rect x="${rx - 30}" y="${ry - 12}" width="46" height="16" rx="8" fill="#FFC700" stroke="#1A1A18" stroke-width="2" transform="rotate(-18 ${rx} ${ry})"/>`;
  s += `<path d="M${rx + 14} ${ry - 6} l24 -6 l0 14" fill="none" stroke="#1A1A18" stroke-width="3" stroke-linecap="round"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="140 72 480 420" width="720" height="630">${s}</svg>`;
}

/* ---------- Asistente: Torre Alameda al atardecer ---------- */

function torre() {
  let s = "";
  s += `<defs>
    <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1B2A2C"/>
      <stop offset="1" stop-color="#2E4540"/>
    </linearGradient>
    <linearGradient id="fachada" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#CFD8D2"/>
      <stop offset="1" stop-color="#A9B8B1"/>
    </linearGradient>
    <linearGradient id="lateral" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#7F918A"/>
      <stop offset="1" stop-color="#6A7C76"/>
    </linearGradient>
    <clipPath id="circulo"><circle cx="300" cy="300" r="290"/></clipPath>
  </defs>`;
  s += `<g clip-path="url(#circulo)">`;
  s += `<rect width="600" height="600" fill="url(#cielo)"/>`;
  s += `<circle cx="430" cy="170" r="54" fill="#E8C98A" opacity=".9"/>`;
  s += `<circle cx="430" cy="170" r="90" fill="#E8C98A" opacity=".08"/>`;
  // Edificios de fondo
  s += `<rect x="40" y="330" width="90" height="300" fill="#23363A"/>`;
  s += `<rect x="455" y="300" width="110" height="330" fill="#23363A"/>`;
  s += `<rect x="120" y="380" width="70" height="250" fill="#2A3F42"/>`;
  // Torre principal
  s += `<polygon points="222,110 378,110 378,560 222,560" fill="url(#fachada)"/>`;
  s += `<polygon points="378,110 418,132 418,560 378,560" fill="url(#lateral)"/>`;
  s += `<rect x="214" y="96" width="172" height="16" fill="#E6ECE8"/>`;
  s += `<polygon points="386,96 424,118 424,134 386,112" fill="#8FA19A"/>`;
  // Ventanas
  const luces = new Set(["2-1", "4-3", "5-0", "7-2", "8-1", "10-3", "11-0", "12-2", "3-2", "9-0"]);
  for (let f = 0; f < 14; f++) {
    for (let c = 0; c < 4; c++) {
      const x = 236 + c * 36;
      const y = 128 + f * 30;
      const on = luces.has(`${f}-${c}`);
      s += `<rect x="${x}" y="${y}" width="26" height="19" rx="1.5" fill="${on ? "#F2C57C" : "#3E5550"}" opacity="${on ? 1 : 0.85}"/>`;
    }
    const y = 128 + f * 30 + 2;
    const y1 = y + (384 - 378) * 0.55;
    const y2 = y + (410 - 378) * 0.55;
    s += `<polygon points="384,${y1} 410,${y2} 410,${y2 + 15} 384,${y1 + 15}" fill="#4B605A" opacity=".75"/>`;
  }
  // Balcones
  for (let f = 1; f < 14; f += 3) s += `<rect x="222" y="${146 + f * 30}" width="156" height="3" fill="#EEF2EF" opacity=".8"/>`;
  // Hall de entrada
  s += `<rect x="270" y="520" width="60" height="40" fill="#F2C57C"/>`;
  s += `<rect x="298" y="520" width="4" height="40" fill="#C9A060"/>`;
  s += `<rect x="258" y="512" width="84" height="8" fill="#EEF2EF"/>`;
  // Álamos (la alameda)
  const alamo = (x, h, tono) =>
    `<rect x="${x - 3}" y="${560 - 30}" width="6" height="30" fill="#2B2B25"/><ellipse cx="${x}" cy="${560 - 30 - h / 2}" rx="${h * 0.18}" ry="${h / 2}" fill="${tono}"/>`;
  s += alamo(170, 170, "#5E8C6A");
  s += alamo(205, 130, "#6E9D78");
  s += alamo(440, 180, "#5E8C6A");
  s += alamo(478, 140, "#6E9D78");
  s += alamo(120, 120, "#4F7A5C");
  s += alamo(520, 110, "#4F7A5C");
  // Suelo
  s += `<rect x="0" y="558" width="600" height="60" fill="#1A2628"/>`;
  s += `<rect x="0" y="556" width="600" height="4" fill="#9FD4B8" opacity=".35"/>`;
  s += `</g>`;
  s += `<circle cx="300" cy="300" r="290" fill="none" stroke="#9FD4B8" stroke-opacity=".35" stroke-width="3"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">${s}</svg>`;
}

await write("cotizador/plano-isometrico.webp", plano(), 720);
await write("asistente/torre-alameda.webp", torre(), 480);
