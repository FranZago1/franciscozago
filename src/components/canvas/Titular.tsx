import type { Segmento } from "@/content/home";
import { IconTile } from "./Icons";
import { stickerFill as bgs } from "./Sticker";

const fgs: Partial<Record<keyof typeof bgs, string>> = { rosa: "#ffffff", choco: "#ffffff", ink: "#ffffff" };

/** Renderiza un titular con íconos en línea (cuadraditos de color). */
export function Titular({ segmentos }: { segmentos: Segmento[] }) {
  return segmentos.map((seg, i) =>
    typeof seg === "string" ? (
      <span key={i}>{seg} </span>
    ) : (
      <span key={i}>
        <IconTile name={seg.icono} bg={bgs[seg.bg]} fg={fgs[seg.bg] ?? "#111111"} />{" "}
      </span>
    ),
  );
}
