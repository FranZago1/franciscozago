// Captura la primera pantalla de cada demo para usarla en las tarjetas del home.
// Uso: con el sitio corriendo (npm run build && npm start), `node scripts/capturas-demos.mjs [baseUrl]`.
// Requiere Playwright instalado de forma global (no es dependencia del proyecto).
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { join } from "node:path";
import sharp from "sharp";

const globalRoot = execSync("npm root -g").toString().trim();
const { chromium } = createRequire(join(globalRoot, "/"))(join(globalRoot, "playwright"));
const base = process.argv[2] ?? "http://localhost:3000";
const estilos = ["editorial", "cinematico", "documental"];

const browser = await chromium.launch({ args: ["--no-proxy-server"] });
const page = await browser.newPage({ viewport: { width: 800, height: 1000 }, deviceScaleFactor: 1 });
for (const estilo of estilos) {
  await page.goto(`${base}/demos/fotografia/${estilo}`, { waitUntil: "load" });
  // La captura muestra la demo sin la barra de aviso.
  await page.addStyleTag({ content: '[aria-label="Aviso de demo"]{display:none!important}' });
  await page.waitForTimeout(1200);
  const png = await page.screenshot();
  const out = join(import.meta.dirname, "..", "public", "demos", "fotografia", estilo, "captura.webp");
  await sharp(png).resize({ width: 640 }).webp({ quality: 78 }).toFile(out);
  console.log("✓", out);
}
await browser.close();
