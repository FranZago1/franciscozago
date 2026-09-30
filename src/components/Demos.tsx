import Image from "next/image";
import Link from "next/link";
import { fotoSrc, verticales } from "@/content/demos";
import { Section } from "./Section";
import { Tag } from "./Tag";

export function Demos() {
  return (
    <div id="demos">
      {verticales.map((v) => (
        <Section key={v.slug} id={`demos-${v.slug}`} title={v.titulo} intro={v.bajada}>
          <ul className="grid gap-4">
            {v.demos.map((d) => {
              const href = `/demos/${v.slug}/${d.slug}`;
              return (
                <li key={d.slug}>
                  <article className="group relative grid grid-cols-[7.5rem_1fr] gap-4 rounded-card border border-line p-3 transition-colors hover:border-ink sm:grid-cols-[12rem_1fr] sm:gap-6">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[10px] bg-surface">
                      <Image
                        src={d.captura ?? fotoSrc(v.slug, d.slug, d.fotos[0]!)}
                        alt={`Vista previa de la demo ${d.nombre}`}
                        fill
                        sizes="(min-width: 640px) 192px, 120px"
                        className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="flex flex-col py-1 pr-1">
                      <div>
                        <Tag>Demo con contenido ficticio</Tag>
                      </div>
                      <h3 className="mt-3 text-xl font-semibold tracking-tight">{d.nombre}</h3>
                      <p className="text-sm text-muted">Para {d.para.toLowerCase()}</p>
                      <p className="mt-2 hidden sm:block">{d.linea}</p>
                      <Link href={href} className="link mt-auto pt-3 font-medium after:absolute after:inset-0">
                        Ver demo<span className="sr-only"> {d.nombre}</span>
                      </Link>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </Section>
      ))}
    </div>
  );
}
