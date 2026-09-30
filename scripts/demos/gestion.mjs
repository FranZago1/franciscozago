// Genera las ilustraciones de las demos de sistemas de gestión.
// Uso: node scripts/demos/gestion.mjs
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const W = 640;
const H = 440;

const cielo = (a, b) => `
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#cfe6ee"/><stop offset=".55" stop-color="#9cc3d1"/><stop offset="1" stop-color="#7aa9bb"/>
    </linearGradient>
    <linearGradient id="glassWarm" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffe9b8"/><stop offset="1" stop-color="#f3c979"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>`;

const sol = (x, y, r = 34, c = "#fff4d6") => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity=".9"/>`;
const nube = (x, y, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity=".75"><ellipse cx="0" cy="0" rx="34" ry="12"/><ellipse cx="22" cy="-8" rx="22" ry="14"/><ellipse cx="-18" cy="-4" rx="18" ry="10"/></g>`;
const cerros = (c1, c2) =>
  `<path d="M0 300 C 90 250 150 262 230 284 C 320 240 420 236 520 272 C 580 258 620 262 640 268 V 360 H 0 Z" fill="${c1}"/>
   <path d="M0 322 C 120 296 240 312 360 300 C 470 290 560 304 640 296 V 360 H 0 Z" fill="${c2}"/>`;
const suelo = (c = "#8fb58a", vereda = "#d9d4cb") =>
  `<rect y="352" width="${W}" height="${H - 352}" fill="${c}"/><rect y="384" width="${W}" height="18" fill="${vereda}"/><rect y="402" width="${W}" height="${H - 402}" fill="#5f6770"/><g fill="#e8e2d4" opacity=".7">${Array.from({ length: 9 }, (_, i) => `<rect x="${i * 76 + 10}" y="419" width="38" height="4" rx="2"/>`).join("")}</g>`;
const arbol = (x, y, s = 1, c = "#4f8a5b", c2 = "#3d7049") =>
  `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-4" y="-6" width="8" height="40" rx="3" fill="#6b4f3a"/><circle cx="0" cy="-30" r="30" fill="${c}"/><circle cx="-16" cy="-16" r="20" fill="${c2}"/><circle cx="16" cy="-20" r="20" fill="${c}"/></g>`;
const ciprés = (x, y, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-3" y="-4" width="6" height="14" fill="#5b4332"/><path d="M0 -84 C 16 -50 16 -20 0 0 C -16 -20 -16 -50 0 -84Z" fill="#2f6b4a"/></g>`;
const sombra = (x, w) => `<ellipse cx="${x + w / 2}" cy="356" rx="${w / 2 + 16}" ry="7" fill="#000" opacity=".12"/>`;

function ventanas(x0, y0, cols, rows, w, h, gx, gy, fill = "url(#glass)", marco = "#fff") {
  let s = "";
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const x = x0 + c * (w + gx);
      const y = y0 + r * (h + gy);
      s += `<rect x="${x - 2}" y="${y - 2}" width="${w + 4}" height="${h + 4}" rx="2" fill="${marco}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1" fill="${fill}"/>`;
    }
  return s;
}

const escenas = {
  // Torre de departamentos con balcones
  "propiedad-depto-nueva-cordoba": () => `${cielo("#bfe0ea", "#eef6f3")}${sol(520, 80)}${nube(140, 90)}${nube(420, 60, 0.8)}
    <rect x="30" y="160" width="120" height="196" fill="#c9cfd6"/><g fill="#aeb8c2">${Array.from({ length: 6 }, (_, i) => `<rect x="44" y="${176 + i * 28}" width="92" height="12"/>`).join("")}</g>
    <rect x="480" y="190" width="130" height="166" fill="#d8cdbd"/><g fill="#c0b09a">${Array.from({ length: 5 }, (_, i) => `<rect x="494" y="${206 + i * 28}" width="102" height="12"/>`).join("")}</g>
    ${sombra(200, 240)}
    <rect x="200" y="52" width="240" height="304" fill="#eef0f1"/><rect x="200" y="52" width="240" height="12" fill="#d5dade"/>
    <rect x="410" y="64" width="30" height="292" fill="#dde1e4"/>
    ${Array.from({ length: 8 }, (_, i) => `<rect x="218" y="${80 + i * 34}" width="176" height="22" fill="url(#glass)"/><rect x="210" y="${100 + i * 34}" width="192" height="5" fill="#0f4c5c"/><g stroke="#0f4c5c" stroke-width="1.4">${Array.from({ length: 9 }, (_, k) => `<line x1="${214 + k * 23}" y1="${92 + i * 34}" x2="${214 + k * 23}" y2="${100 + i * 34}"/>`).join("")}</g>`).join("")}
    <rect x="290" y="316" width="60" height="40" fill="#0f4c5c"/><rect x="300" y="322" width="40" height="34" fill="url(#glass)"/>
    ${suelo("#93b48e")}${arbol(170, 350, 0.9)}${arbol(470, 352, 0.8)}`,

  // Casa con techo a dos aguas y jardín
  "propiedad-casa-cerro": () => `${cielo("#f6d7b8", "#fbeede")}${sol(120, 96, 40, "#fff1d1")}${nube(470, 80)}${cerros("#c9b79c", "#b6a283")}
    ${sombra(170, 300)}
    <rect x="180" y="210" width="280" height="146" fill="#f4ede2"/>
    <path d="M160 214 L320 120 L480 214 Z" fill="#a8513a"/><path d="M160 214 L320 120 L480 214 L470 222 L320 134 L170 222 Z" fill="#8b3f2c"/>
    <rect x="382" y="130" width="26" height="54" fill="#b8a48f"/>
    ${ventanas(206, 240, 2, 1, 50, 58, 22, 0, "url(#glassWarm)", "#6b4f3a")}
    ${ventanas(380, 240, 1, 1, 56, 58, 0, 0, "url(#glassWarm)", "#6b4f3a")}
    <rect x="300" y="262" width="46" height="94" fill="#6b4f3a"/><circle cx="336" cy="310" r="3" fill="#f3c979"/>
    <rect x="160" y="336" width="320" height="20" fill="#e3d9c9"/>
    ${suelo("#9fbf7f", "#e1d9c8")}
    <g fill="#6c9e5b">${Array.from({ length: 14 }, (_, i) => `<circle cx="${40 + i * 44}" cy="366" r="${9 + (i % 3) * 2}"/>`).join("")}</g>
    ${arbol(80, 350, 1.1)}${arbol(560, 350, 1.2, "#5e9a63", "#467a4e")}`,

  // PH de dos plantas con ladrillo
  "propiedad-ph-alberdi": () => `${cielo("#cfe3e8", "#f3f1ea")}${sol(540, 90, 30)}${nube(180, 70, 0.9)}
    ${sombra(150, 340)}
    <rect x="150" y="150" width="340" height="206" fill="#c56a4a"/>
    <g stroke="#a9563a" stroke-width="1.5">${Array.from({ length: 13 }, (_, i) => `<line x1="150" y1="${162 + i * 15}" x2="490" y2="${162 + i * 15}"/>`).join("")}</g>
    <rect x="140" y="140" width="360" height="16" fill="#e8e1d6"/><rect x="150" y="244" width="340" height="10" fill="#e8e1d6"/>
    ${ventanas(176, 172, 3, 1, 70, 56, 36, 0, "url(#glass)", "#e8e1d6")}
    <g stroke="#2f3a40" stroke-width="2">${Array.from({ length: 16 }, (_, i) => `<line x1="${170 + i * 20}" y1="228" x2="${170 + i * 20}" y2="244"/>`).join("")}<line x1="166" y1="228" x2="474" y2="228"/></g>
    <rect x="176" y="276" width="96" height="80" fill="#2f3a40"/><rect x="184" y="284" width="80" height="72" fill="url(#glass)"/>
    <rect x="386" y="272" width="64" height="84" fill="#3b2d24"/><circle cx="440" cy="316" r="3" fill="#f3c979"/>
    <rect x="296" y="286" width="60" height="50" fill="#e8e1d6"/><rect x="302" y="292" width="48" height="38" fill="url(#glassWarm)"/>
    ${suelo("#a5b98d")}${ciprés(110, 352)}${ciprés(530, 352, 1.1)}`,

  // Dúplex moderno en bloques
  "propiedad-duplex-villa-belgrano": () => `${cielo("#d6e7ef", "#f5f7f6")}${sol(110, 86)}${nube(500, 70)}${cerros("#b9c9b8", "#a4b8a2")}
    ${sombra(150, 350)}
    <rect x="150" y="226" width="350" height="130" fill="#f2f2ef"/>
    <rect x="250" y="130" width="230" height="100" fill="#3a4449"/>
    <rect x="266" y="146" width="198" height="68" fill="url(#glass)"/><g stroke="#3a4449" stroke-width="3"><line x1="332" y1="146" x2="332" y2="214"/><line x1="398" y1="146" x2="398" y2="214"/></g>
    <rect x="240" y="226" width="250" height="8" fill="#2c3438"/>
    <rect x="170" y="250" width="120" height="106" fill="url(#glass)"/><rect x="170" y="250" width="120" height="106" fill="none" stroke="#3a4449" stroke-width="4"/>
    <rect x="320" y="258" width="60" height="98" fill="#b88a5c"/><g stroke="#9e7449" stroke-width="2">${Array.from({ length: 6 }, (_, i) => `<line x1="${326 + i * 10}" y1="262" x2="${326 + i * 10}" y2="352"/>`).join("")}</g>
    <rect x="400" y="258" width="80" height="60" fill="url(#glass)"/><rect x="400" y="258" width="80" height="60" fill="none" stroke="#3a4449" stroke-width="4"/>
    ${suelo("#90b387")}${arbol(560, 352, 1)}${arbol(96, 350, 0.8, "#5e9a63", "#467a4e")}`,

  // Loft industrial
  "propiedad-loft-general-paz": () => `${cielo("#e6dccf", "#f6f1ea")}${sol(530, 88, 30, "#fff4e0")}${nube(120, 80)}
    <rect x="30" y="200" width="110" height="156" fill="#cbbfae"/><rect x="500" y="170" width="120" height="186" fill="#bdb3a5"/>
    ${sombra(150, 340)}
    <rect x="150" y="110" width="340" height="246" fill="#7a8288"/>
    <path d="M150 110 L210 80 L270 110 L330 80 L390 110 L450 80 L490 100 L490 110 Z" fill="#5d656a"/>
    ${Array.from({ length: 2 }, (_, r) => `<g>${Array.from({ length: 3 }, (_, c) => { const x = 172 + c * 106; const y = 132 + r * 102; return `<rect x="${x}" y="${y}" width="86" height="82" fill="#23292c"/>${[0, 1, 2].map((i) => [0, 1, 2].map((j) => `<rect x="${x + 4 + i * 27}" y="${y + 4 + j * 26}" width="24" height="23" fill="url(#glass)"/>`).join("")).join("")}`; }).join("")}</g>`).join("")}
    <rect x="150" y="336" width="340" height="20" fill="#5d656a"/>
    <rect x="296" y="300" width="48" height="56" fill="#23292c"/>
    ${suelo("#9aa98e")}${arbol(560, 352, 0.8)}`,

  // Casa con pileta
  "propiedad-casa-mendiolaza": () => `${cielo("#bfdff0", "#eef7f4")}${sol(530, 80, 38)}${nube(160, 70)}${cerros("#9fbf9a", "#86ab83")}
    ${sombra(90, 300)}
    <rect x="96" y="200" width="290" height="156" fill="#faf7f1"/>
    <rect x="86" y="188" width="310" height="16" fill="#4a5a60"/>
    ${ventanas(118, 228, 3, 1, 62, 78, 26, 0, "url(#glass)", "#4a5a60")}
    <rect x="96" y="336" width="290" height="20" fill="#e9e3d8"/>
    <rect x="386" y="326" width="200" height="30" rx="4" fill="#e9e3d8"/><rect x="398" y="330" width="176" height="22" rx="4" fill="#59b7cf"/><path d="M406 340 q12 -5 24 0 t24 0 t24 0 t24 0 t24 0 t24 0" stroke="#bfe9f3" stroke-width="2" fill="none"/>
    ${suelo("#8fbd7a", "#e1d9c8")}${arbol(40, 352, 1)}${arbol(610, 352, 1.1, "#5e9a63", "#467a4e")}${ciprés(430, 324, 0.7)}`,

  // Monoambiente en edificio de mediana altura
  "propiedad-monoambiente-centro": () => `${cielo("#d3e1ea", "#f1f3f4")}${sol(90, 90, 28)}${nube(460, 70, 0.9)}
    <rect x="20" y="130" width="140" height="226" fill="#b9c2c9"/><g fill="#9faab3">${Array.from({ length: 7 }, (_, i) => `<rect x="34" y="${146 + i * 28}" width="112" height="14"/>`).join("")}</g>
    <rect x="470" y="150" width="150" height="206" fill="#c7bfb3"/><g fill="#ada394">${Array.from({ length: 6 }, (_, i) => `<rect x="484" y="${166 + i * 30}" width="122" height="14"/>`).join("")}</g>
    ${sombra(180, 280)}
    <rect x="180" y="96" width="280" height="260" fill="#e7d9c3"/>
    ${ventanas(200, 116, 4, 5, 46, 34, 20, 18, "url(#glass)", "#fff")}
    <rect x="300" y="300" width="40" height="56" fill="#0f4c5c"/><rect x="180" y="286" width="280" height="8" fill="#cdb998"/>
    <rect x="252" y="130" width="48" height="36" fill="none" stroke="#f26b1d" stroke-width="0"/>
    ${suelo("#9ab38f")}${arbol(170, 352, 0.7)}`,

  // Lote con cartel
  "propiedad-lote-manantiales": () => `${cielo("#f3e1c4", "#faf3e6")}${sol(500, 100, 42, "#fff0cc")}${nube(150, 80, 1.1)}${cerros("#c3c49a", "#aeb184")}
    <rect y="300" width="${W}" height="60" fill="#b9c98f"/>
    <g stroke="#8a6b4c" stroke-width="3">${Array.from({ length: 12 }, (_, i) => `<line x1="${60 + i * 48}" y1="330" x2="${60 + i * 48}" y2="354"/>`).join("")}<line x1="60" y1="336" x2="588" y2="336"/></g>
    <rect x="304" y="226" width="6" height="104" fill="#5b4332"/><rect x="376" y="226" width="6" height="104" fill="#5b4332"/>
    <rect x="286" y="190" width="114" height="66" rx="4" fill="#0f4c5c"/><rect x="296" y="204" width="70" height="8" rx="4" fill="#e8f1f2"/><rect x="296" y="220" width="94" height="6" rx="3" fill="#8fb6bd"/><rect x="296" y="232" width="52" height="6" rx="3" fill="#8fb6bd"/>
    ${suelo("#a8bf82", "#e1d9c8")}${arbol(120, 330, 0.9)}${arbol(540, 336, 1.1, "#5e9a63", "#467a4e")}${ciprés(200, 334, 0.8)}`,
};

async function main() {
  const out = join(root, "public", "demos", "gestion", "clientes");
  await mkdir(out, { recursive: true });
  for (const [nombre, fn] of Object.entries(escenas)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${fn()}</svg>`;
    await sharp(Buffer.from(svg)).webp({ quality: 84 }).toFile(join(out, `${nombre}.webp`));
    console.log("✓", nombre);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
