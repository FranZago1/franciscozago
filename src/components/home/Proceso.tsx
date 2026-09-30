import { Eyebrow } from "@/components/canvas/Eyebrow";
import { stickerBg, type StickerColor } from "@/components/canvas/Sticker";
import { proceso } from "@/content/stack";

const notas: { color: StickerColor; giro: string }[] = [
  { color: "mostaza", giro: "-rotate-2" },
  { color: "menta", giro: "rotate-1" },
  { color: "celeste", giro: "-rotate-1" },
  { color: "rosa", giro: "rotate-2" },
];

export function Proceso() {
  return (
    <section id="proceso" aria-labelledby="proceso-titulo" className="wrap mt-32 md:mt-44">
      <Eyebrow n="03" className="mb-4">Proceso</Eyebrow>
      <h2 id="proceso-titulo" className="text-[clamp(2.2rem,5vw,3.6rem)] leading-none font-medium tracking-[-0.035em]">
        Cómo trabajo
      </h2>
      <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {proceso.map((p, i) => {
          const n = notas[i % notas.length]!;
          return (
            <li
              key={p.titulo}
              className={`flex min-h-64 flex-col p-6 transition-transform duration-200 hover:-translate-y-1 ${stickerBg[n.color]}`}
            >
              <span className="label-mono text-sm">Paso {String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-auto text-3xl font-medium tracking-tight">{p.titulo}</h3>
              <p className="mt-2 text-lg leading-snug">{p.linea}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
