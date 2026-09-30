import { Eyebrow } from "@/components/canvas/Eyebrow";
import Link from "next/link";
import { Draggable } from "@/components/canvas/Draggable";
import { Icon } from "@/components/canvas/Icons";
import { Polaroid } from "@/components/canvas/Sticker";
import { fotoSrc, verticales } from "@/content/demos";

const giros = [-2, 1.5, -1];

export function Demos() {
  return (
    <div id="demos">
      {verticales.map((v) => (
        <section key={v.slug} aria-labelledby={`demos-${v.slug}-titulo`} className="wrap mt-32 md:mt-44">
          <Eyebrow n="04" className="mb-4">
            Demos
          </Eyebrow>
          <h2
            id={`demos-${v.slug}-titulo`}
            className="text-[clamp(2.2rem,5vw,3.6rem)] leading-none font-medium tracking-[-0.035em]"
          >
            {v.titulo}
          </h2>
          <p className="mt-4 max-w-[36rem] text-lg text-muted">{v.bajada}</p>

          <ul className="relative mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {v.demos.map((d, i) => (
              <li key={d.slug} className="flex justify-center">
                <Draggable rotate={giros[i % giros.length]} decorativo={false} className="w-full max-w-[320px]">
                  <Polaroid
                    src={d.captura ?? fotoSrc(v.slug, d.slug, d.fotos[0]!)}
                    alt={`Vista previa de la demo ${d.nombre}`}
                    epigrafe={`${d.slug}.tsx`}
                    className="w-full"
                    aspect="aspect-[4/5]"
                    sizes="320px"
                  />
                  <div className="mt-4 text-left">
                    <p className="label-mono inline-block bg-ink px-2 py-1 text-[11px] text-white">Demo con contenido ficticio</p>
                    <p className="mt-2 text-sm text-muted">Para {d.para.toLowerCase()}</p>
                    <p className="mt-1">{d.linea}</p>
                    <Link
                      href={`/demos/${v.slug}/${d.slug}`}
                      className="label-mono mt-3 inline-flex items-center gap-1 border-b-[1.5px] border-ink pb-0.5 text-sm font-medium hover:border-accent hover:text-accent"
                    >
                      Ver demo<span className="sr-only"> {d.nombre}</span>
                      <Icon name="flecha" className="size-4" />
                    </Link>
                  </div>
                </Draggable>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
