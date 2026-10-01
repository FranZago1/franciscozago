// Render del video: 60 fps, 4 subcuadros por cuadro mezclados con tmix (motion blur).
// Uso: node render.mjs <salida.mp4>   (necesita ffmpeg: pip install imageio-ffmpeg)
import { createRequire } from "node:module"; import { execSync, spawn } from "node:child_process"; import { join } from "node:path";
const g = execSync("npm root -g").toString().trim();
const { chromium } = createRequire(join(g, "/"))(join(g, "playwright"));
const FF = execSync(`python3 -c "import imageio_ffmpeg as f;print(f.get_ffmpeg_exe())"`).toString().trim();
const out = process.argv[2]; const FPS = 60, SUB = 4;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 1440 } });
await p.goto("file://" + join(import.meta.dirname, "motion.html")); await p.waitForFunction(() => window.READY);
const T = await p.evaluate(() => window.DURATION);
const ff = spawn(FF, ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS * SUB), "-i", "-",
  "-vf", `tmix=frames=${SUB}:weights='1 1 1 1',select='eq(mod(n\\,${SUB})\\,${SUB - 1})',setpts=N/${FPS}/TB`,
  "-r", String(FPS), "-c:v", "libx264", "-preset", "slow", "-crf", "12", "-pix_fmt", "yuv420p", out], { stdio: ["pipe", "inherit", "inherit"] });
const frames = Math.round(T * FPS);
for (let f = 0; f < frames; f++) {
  for (let k = 0; k < SUB; k++) {
    const t = f / FPS + (k - (SUB - 1) / 2) / (FPS * SUB); // subcuadros centrados en el cuadro
    await p.evaluate((t) => window.seek(t), t);
    const png = await p.screenshot({ type: "png" });
    if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once("drain", r));
  }
  if (f % 60 === 0) console.log(`${f}/${frames}`);
}
ff.stdin.end(); await new Promise((r) => ff.on("close", r)); await b.close(); console.log("listo", out);
