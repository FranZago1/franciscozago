import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/Button";
import { Eyebrow } from "@/components/canvas/Eyebrow";
import { SelectionFrame } from "@/components/canvas/SelectionFrame";
import { sobreMi } from "@/content/home";
import { waLink } from "@/lib/wa";

export const metadata: Metadata = {
  title: "Sobre mí",
  description: sobreMi.intro,
  alternates: { canonical: "/sobre-mi" },
};

// Leve giro y desplazamiento de cada foto en desktop, para que parezcan apoyadas sobre el lienzo.
const disposicion = ["md:-rotate-2", "md:rotate-[1.5deg] md:mt-16", "md:rotate-1 md:-mt-6", "md:-rotate-[1.5deg] md:mt-10"];

export default function SobreMiPage() {
  const [primera, ...resto] = sobreMi.fotos;
  return (
    <article className="wrap pt-12 md:pt-16">
      <Eyebrow n="00" className="mb-4">
        {sobreMi.titulo}
      </Eyebrow>

      <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
        <div>
          <h1 className="max-w-[20ch] text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.04] font-medium tracking-[-0.035em] text-balance">
            {sobreMi.intro}
          </h1>
          <div className="mt-10 grid max-w-[36rem] gap-5 text-lg text-muted">
            <p>{sobreMi.proceso}</p>
            <p>{sobreMi.personal}</p>
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href={waLink("Hola Fran, vi tu portfolio y quiero consultarte por un proyecto.")} external icono="chat" iconoBg="var(--color-menta)">
              Escribime por WhatsApp
            </Button>
            <Button href="/#servicios" variant="secondary">
              Ver demos
            </Button>
          </div>
        </div>

        {primera ? (
          <SelectionFrame tono="ink" padding="p-0" nombre="viajes.jpg" className="self-start md:mt-4">
            <Foto foto={primera} prioridad sizes="(min-width: 768px) 560px, 100vw" />
          </SelectionFrame>
        ) : null}
      </div>

      <section aria-label="Fotos de viajes" className="mt-20 md:mt-28">
        <p className="label-mono mb-8 text-[13px] text-muted">Algunos lugares que conocí</p>
        <ul className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {resto.map((f, i) => (
            <li key={f.src} className={`transition-transform duration-300 hover:rotate-0 ${disposicion[i + 1] ?? ""}`}>
              <div className="bg-white p-2 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.28),0_0_0_1px_rgb(0_0_0/0.06)]">
                <Foto foto={f} sizes="(min-width: 768px) 380px, (min-width: 640px) 50vw, 100vw" />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

function Foto({
  foto,
  sizes,
  prioridad = false,
}: {
  foto: (typeof sobreMi.fotos)[number];
  sizes: string;
  prioridad?: boolean;
}) {
  return (
    <figure>
      <Image
        src={foto.src}
        alt={`Foto de viaje en ${foto.lugar}`}
        width={foto.w}
        height={foto.h}
        sizes={sizes}
        priority={prioridad}
        className="block h-auto w-full"
      />
      <figcaption className="label-mono flex items-center gap-1.5 px-1 py-2.5 text-[11px] text-muted">
        <span aria-hidden className="size-1.5 rounded-full bg-accent" />
        {foto.lugar}
      </figcaption>
    </figure>
  );
}
