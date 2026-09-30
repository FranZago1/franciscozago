// Genera imágenes demo del front de UniChat (recreación de la interfaz, no capturas reales).
// Uso: node scripts/unichat-capturas.mjs  (requiere Playwright instalado de forma global)
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { join } from "node:path";
import sharp from "sharp";

const globalRoot = execSync("npm root -g").toString().trim();
const { chromium } = createRequire(join(globalRoot, "/"))(join(globalRoot, "playwright"));
const out = join(import.meta.dirname, "..", "public", "trabajos", "unichat");

const materias = [
  ["Sistemas Operativos", "#7C9CFF", 12, true],
  ["Base de Datos II", "#4FD1A5", 8],
  ["Análisis Matemático II", "#F2B705", 15],
  ["Redes de Computadoras", "#FF7A90", 6],
  ["Ingeniería de Software", "#B794F6", 9],
];

const html = (mobile) => `<!doctype html><html lang="es"><head><meta charset="utf-8">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Inter,"Segoe UI",system-ui,sans-serif;background:#0f1115;color:#e7e9ee;width:100vw;height:100vh;display:flex;overflow:hidden;font-size:14px}
aside{width:280px;background:#15181e;border-right:1px solid #232730;padding:18px 14px;display:${mobile ? "none" : "flex"};flex-direction:column;gap:18px}
.logo{display:flex;align-items:center;gap:10px;font-weight:700;font-size:17px}
.logo i{width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#7C9CFF,#4FD1A5);display:block}
.nuevo{border:1px solid #2c313c;border-radius:10px;padding:10px 12px;color:#cfd3dc;display:flex;justify-content:space-between}
h6{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#7d8494;font-weight:600;margin-bottom:8px}
.mat{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;color:#c4c8d2}
.mat.on{background:#222733;color:#fff}
.mat b{width:10px;height:10px;border-radius:3px;display:block}
.mat span{margin-left:auto;font-size:12px;color:#7d8494}
.chats div{padding:7px 10px;color:#9aa0ad;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.user{margin-top:auto;display:flex;gap:10px;align-items:center;color:#c4c8d2}
.user i{width:30px;height:30px;border-radius:50%;background:#2c313c;display:grid;place-items:center;font-style:normal;font-size:12px}
main{flex:1;display:flex;flex-direction:column;min-width:0}
header{height:58px;border-bottom:1px solid #232730;display:flex;align-items:center;justify-content:space-between;padding:0 ${mobile ? 16 : 28}px}
.crumb{display:flex;gap:8px;align-items:center;color:#9aa0ad}.crumb b{color:#fff;font-weight:600}
.modelo{display:flex;gap:4px;background:#1a1d24;border:1px solid #2c313c;border-radius:10px;padding:3px}
.modelo span{padding:6px 10px;border-radius:7px;color:#9aa0ad;font-size:12.5px}.modelo span.on{background:#2a3040;color:#fff}
.chat{flex:1;overflow:hidden;padding:${mobile ? "22px 16px" : "30px 0"};display:flex;flex-direction:column;gap:22px;align-items:center}
.row{width:100%;max-width:760px;display:flex;gap:14px}
.row.me{justify-content:flex-end}
.me p{background:#242a36;border-radius:16px 16px 4px 16px;padding:12px 16px;max-width:80%;line-height:1.5}
.av{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,#7C9CFF,#4FD1A5);flex:none}
.ai{line-height:1.65;color:#dfe2e8}.ai p+p,.ai ul{margin-top:10px}.ai ul{padding-left:18px}
sup{display:inline-grid;place-items:center;min-width:17px;height:17px;border-radius:5px;background:#2a3350;color:#9fb3ff;font-size:10.5px;margin-left:2px;padding:0 4px}
code{background:#1d2129;border:1px solid #2c313c;border-radius:5px;padding:1px 5px;font-size:12.5px}
.fuentes{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
.fuentes div{border:1px solid #2c313c;background:#171a21;border-radius:10px;padding:8px 10px;font-size:12px;color:#aab0bd;display:flex;gap:8px;align-items:center}
.fuentes div b{color:#9fb3ff;font-weight:600}
.cursor{display:inline-block;width:8px;height:16px;background:#9fb3ff;vertical-align:-3px;border-radius:2px;margin-left:3px}
.input{width:100%;max-width:760px;margin:0 auto ${mobile ? 16 : 26}px;padding:0 ${mobile ? 16 : 0}px}
.box{border:1px solid #2c313c;background:#171a21;border-radius:16px;padding:14px 16px;display:flex;align-items:center;gap:12px;color:#7d8494}
.box .clip{width:30px;height:30px;border-radius:8px;border:1px solid #2c313c;display:grid;place-items:center}
.box .send{margin-left:auto;width:34px;height:34px;border-radius:10px;background:#7C9CFF;display:grid;place-items:center;color:#0f1115;font-weight:700}
.docs{font-size:12px;color:#7d8494;margin-top:8px;text-align:center}
</style></head><body>
<aside>
  <div class="logo"><i></i>UniChat</div>
  <div class="nuevo">Nuevo chat <span>+</span></div>
  <div><h6>Materias</h6>${materias.map(([n, c, k, on]) => `<div class="mat${on ? " on" : ""}"><b style="background:${c}"></b>${n}<span>${k}</span></div>`).join("")}</div>
  <div class="chats"><h6>Recientes</h6><div>Planificación de procesos: Round Robin</div><div>Diferencia entre paginación y segmentación</div><div>Normalización hasta 3FN</div><div>Ejercicio de integrales dobles</div></div>
  <div class="user"><i>FZ</i>Francisco<span style="margin-left:auto;color:#7d8494">···</span></div>
</aside>
<main>
  <header>
    <div class="crumb">${mobile ? "<b>≡</b>" : ""}<span>Materias</span><span>/</span><b>Sistemas Operativos</b></div>
    <div class="modelo"><span class="on">Local · Llama 3</span><span>Nube</span></div>
  </header>
  <div class="chat">
    <div class="row me"><p>¿Qué diferencia hay entre paginación y segmentación? Explicalo con el apunte de la unidad 4.</p></div>
    <div class="row"><div class="av"></div><div class="ai">
      <p>Según el apunte de la <b>Unidad 4</b>, las dos técnicas dividen la memoria de un proceso, pero con criterios distintos:</p>
      <ul><li><b>Paginación:</b> divide la memoria en bloques de <b>tamaño fijo</b> (páginas y marcos). Evita la fragmentación externa, pero puede generar fragmentación interna<sup>1</sup>.</li>
      <li><b>Segmentación:</b> usa bloques de <b>tamaño variable</b> que siguen la estructura lógica del programa (código, pila, datos)<sup>2</sup>.</li></ul>
      <p>En la práctica se combinan: la <code>segmentación paginada</code> segmenta y después pagina cada segmento<sup>3</sup>.<span class="cursor"></span></p>
      <div class="fuentes"><div><b>1</b> apunte-unidad-4.pdf · p. 12</div><div><b>2</b> apunte-unidad-4.pdf · p. 15</div>${mobile ? "" : "<div><b>3</b> resumen-parcial.docx · p. 3</div>"}</div>
    </div></div>
  </div>
  <div class="input"><div class="box"><div class="clip">⌘</div>Preguntá sobre tus apuntes de Sistemas Operativos…<div class="send">↑</div></div>
  <div class="docs">12 documentos indexados · Las respuestas citan tus fuentes</div></div>
</main></body></html>`;

const browser = await chromium.launch();
for (const [nombre, w, h, mobile] of [
  ["desktop", 1600, 1000, false],
  ["mobile", 390, 844, true],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: mobile ? 2 : 1 });
  await page.setContent(html(mobile));
  const png = await page.screenshot();
  await sharp(png).webp({ quality: 82 }).toFile(join(out, `${nombre}.webp`));
  console.log("✓", nombre);
}
await browser.close();
