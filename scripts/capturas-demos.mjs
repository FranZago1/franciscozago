// Captura la primera pantalla de cada demo para usarla en las tarjetas de /demos/<vertical>.
// Uso: con el sitio corriendo (npm run build && npm start), `node scripts/capturas-demos.mjs [baseUrl] [filtro]`.
// Recorre src/app/demos/<vertical>/<demo>/page.tsx. `filtro` opcional: solo verticales o demos que lo contengan.
// Requiere Playwright instalado de forma global (no es dependencia del proyecto).
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const root = join(import.meta.dirname, "..");
const globalRoot = execSync("npm root -g").toString().trim();
const { chromium } = createRequire(join(globalRoot, "/"))(join(globalRoot, "playwright"));
const base = process.argv[2] ?? "http://localhost:3000";
const filtro = process.argv[3] ?? "";

const appDemos = join(root, "src", "app", "demos");
const rutas = [];
for (const vertical of readdirSync(appDemos)) {
  const dirV = join(appDemos, vertical);
  if (!statSync(dirV).isDirectory()) continue;
  for (const demo of readdirSync(dirV)) {
    if (existsSync(join(dirV, demo, "page.tsx"))) rutas.push([vertical, demo]);
  }
}

const browser = await chromium.launch({ args: ["--no-proxy-server"] });
const page = await browser.newPage({ viewport: { width: 800, height: 1000 }, deviceScaleFactor: 1 });
// Estados guardados que la captura necesita: saltear el modal de edad de la vinoteca.
await page.addInitScript(() => {
  try {
    localStorage.setItem("cava-aldea-mayor-18", "si");
  } catch {}
});
for (const [vertical, demo] of rutas) {
  if (filtro && !`${vertical}/${demo}`.includes(filtro)) continue;
  await page.goto(`${base}/demos/${vertical}/${demo}`, { waitUntil: "load" });
  // La captura muestra la demo sin la barra de aviso.
  await page.addStyleTag({ content: '[aria-label="Aviso de demo"]{display:none!important}' });
  await page.waitForTimeout(1500);
  const png = await page.screenshot();
  const dir = join(root, "public", "demos", vertical, demo);
  mkdirSync(dir, { recursive: true });
  const out = join(dir, "captura.webp");
  await sharp(png).resize({ width: 640 }).webp({ quality: 78 }).toFile(out);
  console.log("✓", `${vertical}/${demo}`);
}
await browser.close();
