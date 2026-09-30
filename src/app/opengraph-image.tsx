import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = site.titulo;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const handle = (pos: React.CSSProperties) => (
  <div style={{ position: "absolute", width: 14, height: 14, background: "#fff", border: "2px solid #0E6A70", ...pos }} />
);

export default async function OgImage() {
  const dir = join(process.cwd(), "src/assets/fonts");
  const [sans, semi, mono] = await Promise.all([
    readFile(join(dir, "HankenGrotesk-Medium.ttf")),
    readFile(join(dir, "HankenGrotesk-SemiBold.ttf")),
    readFile(join(dir, "JetBrainsMono-Medium.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          color: "#111111",
          fontFamily: "Hanken",
          backgroundColor: "#ffffff",
          backgroundImage:
            "linear-gradient(to right, #efefef 1px, transparent 1px), linear-gradient(to bottom, #efefef 1px, transparent 1px)",
          backgroundSize: "132px 132px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Mono", fontSize: 24, textTransform: "uppercase" }}>
          <span>Desarrollador full-stack</span>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 14, height: 14, borderRadius: 999, background: "#0E6A70" }} />
            Disponible para proyectos
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{ display: "flex", fontFamily: "Mono", fontSize: 20, color: "#0E6A70", marginBottom: 10 }}>FRANCISCO-ZAGO</div>
          <div style={{ display: "flex", position: "relative", border: "2px solid #0E6A70", padding: "0 28px 18px" }}>
            {handle({ left: -8, top: -8 })}
            {handle({ right: -8, top: -8 })}
            {handle({ left: -8, bottom: -8 })}
            {handle({ right: -8, bottom: -8 })}
            <span style={{ fontFamily: "Semi", fontSize: 138, letterSpacing: -7, lineHeight: 1 }}>Francisco Zago</span>
            <span style={{ width: 22, height: 22, background: "#F2B705", marginLeft: 6, alignSelf: "flex-end", marginBottom: 10 }} />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 32 }}>
          <span>Sitios, tiendas y sistemas web para negocios.</span>
          <div style={{ display: "flex", gap: 10 }}>
            {["#F2B705", "#8FD6B4", "#D6284B", "#7CC8F0"].map((c) => (
              <span key={c} style={{ width: 36, height: 36, background: c }} />
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Hanken", data: sans, weight: 500, style: "normal" },
        { name: "Semi", data: semi, weight: 600, style: "normal" },
        { name: "Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
