import { DIMENSIONES, fotoAlt, fotoSrc, type Demo } from "@/content/demos";
import type { LightboxFoto } from "@/components/demos/Lightbox";

export function fotosDeDemo(vertical: string, demo: Demo): LightboxFoto[] {
  return demo.fotos.map((f) => ({
    src: fotoSrc(vertical, demo.slug, f),
    alt: fotoAlt(demo, f),
    ...DIMENSIONES[f.orientacion],
  }));
}

export function demoOrThrow(demo: Demo | undefined): Demo {
  if (!demo) throw new Error("Demo no encontrada en src/content/demos.ts");
  return demo;
}
