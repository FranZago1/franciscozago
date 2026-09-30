import { Eyebrow } from "@/components/canvas/Eyebrow";
import { Draggable } from "@/components/canvas/Draggable";
import { Icon } from "@/components/canvas/Icons";
import { SelectionFrame } from "@/components/canvas/SelectionFrame";
import { stickerBg, stickerFill } from "@/components/canvas/Sticker";
import { Titular } from "@/components/canvas/Titular";
import { sobreMi } from "@/content/home";

// Paleta real del sitio: se muestra como "tarjeta de estilos" arrastrable.
const paleta = [
  { nombre: "Tinta", hex: "#111111" },
  { nombre: "Petróleo", hex: "#0E6A70" },
  { nombre: "Mostaza", hex: "#F2B705" },
  { nombre: "Menta", hex: "#8FD6B4" },
  { nombre: "Rosa", hex: "#D6284B" },
  { nombre: "Celeste", hex: "#7CC8F0" },
];

export function SobreMi() {
  return (
    <section id="sobre-mi" aria-labelledby="sobre-mi-titulo" className="wrap relative mt-32 md:mt-44">
      <div className="relative flex flex-col items-center text-center">
        <Eyebrow n="01" className="mb-6">
          Sobre mí
        </Eyebrow>
        <SelectionFrame tono="ink" padding="px-3 py-1">
          <h2 id="sobre-mi-titulo" className="text-3xl font-medium tracking-tight md:text-4xl">
            {sobreMi.marco}
          </h2>
        </SelectionFrame>

        <p className="mt-10 max-w-[20ch] text-display font-medium tracking-[-0.035em] text-balance md:max-w-[22ch]">
          <Titular segmentos={sobreMi.frase} />
        </p>

        <ul className="mt-12 flex max-w-4xl flex-wrap justify-center gap-2.5 md:gap-3">
          {sobreMi.bloques.map((b) => (
            <li key={b.texto} className="flex">
              <span className={`px-4 py-2.5 text-xl font-medium tracking-tight md:px-5 md:py-3 md:text-3xl ${stickerBg[b.color]}`}>
                {b.texto}
              </span>
              <span className={`ml-1.5 flex aspect-square items-center justify-center md:ml-2 ${stickerBg[b.color]}`}>
                <Icon name={b.icono} className="size-6 md:size-8" secondary={stickerFill[b.color]} />
              </span>
            </li>
          ))}
        </ul>

        {/* Tarjetas arrastrables: la paleta y un fragmento de código reales de este sitio */}
        <Draggable rotate={-3} className="absolute top-10 -left-2 hidden xl:block">
          <div className="w-56 rounded-[10px] border border-line bg-white p-3 text-left shadow-[0_10px_30px_-10px_rgb(0_0_0/0.25)]">
            <p className="label-mono text-[11px] text-muted">Estilos de color</p>
            <ul className="mt-2 grid gap-1.5">
              {paleta.map((c) => (
                <li key={c.hex} className="flex items-center gap-2 text-sm">
                  <span className="size-5 rounded-[4px] ring-1 ring-black/10" style={{ background: c.hex }} />
                  <span className="flex-1">{c.nombre}</span>
                  <span className="label-mono text-[11px] text-muted">{c.hex}</span>
                </li>
              ))}
            </ul>
          </div>
        </Draggable>
        <Draggable rotate={3} className="absolute top-16 -right-2 hidden xl:block">
          <pre className="w-64 overflow-hidden rounded-[10px] bg-ink p-4 text-left font-mono text-[11.5px] leading-relaxed text-white/90 shadow-[0_10px_30px_-10px_rgb(0_0_0/0.35)]">
            <span className="text-white/45">{"// src/lib/wa.ts\n"}</span>
            <span className="text-celeste">export function</span> <span className="text-mostaza">waLink</span>
            {"(msg) {\n  return `wa.me/…?text=${\n    encodeURIComponent(msg)\n  }`;\n}"}
          </pre>
        </Draggable>
      </div>
    </section>
  );
}
