import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = site.titulo;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const dir = join(process.cwd(), "src/assets/fonts");
  const [serif, sans] = await Promise.all([
    readFile(join(dir, "Newsreader-Display.ttf")),
    readFile(join(dir, "HankenGrotesk-Medium.ttf")),
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
          background: "#FFFFFF",
          color: "#111111",
          padding: "72px 80px",
          fontFamily: "Hanken",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 30 }}>
          <span>{site.nombre}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 14, color: "#5B5B5B" }}>
            <span style={{ width: 14, height: 14, borderRadius: 999, background: "#0E6A70" }} />
            Disponible para proyectos
          </span>
        </div>
        <div style={{ fontFamily: "Newsreader", fontSize: 78, lineHeight: 1.06, letterSpacing: -1 }}>
          Diseño y desarrollo sitios y sistemas web para negocios que quieren vender más.
        </div>
        <div style={{ fontSize: 30, color: "#5B5B5B" }}>Desarrollo web en Córdoba, Argentina</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Newsreader", data: serif, weight: 400, style: "normal" },
        { name: "Hanken", data: sans, weight: 500, style: "normal" },
      ],
    },
  );
}
