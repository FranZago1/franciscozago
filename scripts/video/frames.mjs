// Saca un cuadro por beat (o los tiempos pasados) para revisar la composición antes del render.
import { createRequire } from "node:module"; import { execSync } from "node:child_process"; import { join } from "node:path";
const g = execSync("npm root -g").toString().trim();
const { chromium } = createRequire(join(g, "/"))(join(g, "playwright"));
const out = process.argv[2]; const tiempos = process.argv[3] ? process.argv[3].split(",").map(Number) : [...Array(28)].map((_, i) => i * 0.5 + 0.35);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 1440 } });
const errs = []; p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
await p.goto("file://" + join(import.meta.dirname, "motion.html")); await p.waitForFunction(() => window.READY);
for (const t of tiempos) { await p.evaluate((t) => window.seek(t), t); await p.screenshot({ path: `${out}/f-${t.toFixed(2)}.png` }); }
console.log(errs); await b.close();
