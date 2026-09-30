import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { Draggable } from "@/components/canvas/Draggable";
import { Eyebrow } from "@/components/canvas/Eyebrow";
import { Icon } from "@/components/canvas/Icons";
import { Polaroid } from "@/components/canvas/Sticker";
import { capturaDemo, getVertical } from "@/content/verticales";
import { waLink } from "@/lib/wa";

const giros = [-2, 1.5, -1];

/** Pantalla con las demos de una vertical (un servicio). */
export function DemosVertical({ vertical }: { vertical: string }) {
  const v = getVertical(vertical);
  if (!v) notFound();

  return (
    <section aria-labelledby="demos-titulo" className="wrap pt-12 md:pt-16">
      <Link href="/#servicios" className="label-mono inline-flex items-center gap-1 text-[13px] text-muted hover:text-ink">
        <Icon name="flecha" className="size-3.5 -scale-x-100" />
        Volver a servicios
      </Link>

      <Eyebrow n="02" className="mt-10 mb-4">
        Servicios / {v.servicio}
      </Eyebrow>
      <h1 id="demos-titulo" className="max-w-[20ch] text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.98] font-medium tracking-[-0.04em]">
        {v.titulo}
      </h1>
      <p className="mt-5 max-w-[38rem] text-lg text-muted">{v.bajada}</p>

      <ul className="relative mt-14 grid gap-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        {v.demos.map((d, i) => {
          const href = `/demos/${v.slug}/${d.slug}`;
          return (
            <li key={d.slug} className="flex justify-center">
              <Draggable rotate={giros[i % giros.length]} decorativo={false} className="w-full max-w-[340px]">
                <Link href={href} className="group block" aria-label={`Ver demo ${d.nombre}`}>
                  <Polaroid
                    src={capturaDemo(v.slug, d.slug)}
                    alt=""
                    epigrafe={`${d.slug}.tsx`}
                    className="w-full transition-transform duration-200 group-hover:-translate-y-1"
                    aspect="aspect-[4/5]"
                    sizes="340px"
                  />
                </Link>
                <div className="mt-4 text-left">
                  <p className="label-mono inline-block bg-ink px-2 py-1 text-[11px] text-white">Demo con contenido ficticio</p>
                  <h2 className="mt-3 text-2xl font-medium tracking-tight">{d.nombre}</h2>
                  <p className="text-sm text-muted">{d.negocio}</p>
                  <p className="mt-2">{d.linea}</p>
                  <p className="mt-1 text-sm text-muted">Ideal para: {d.para.toLowerCase()}</p>
                  <Link
                    href={href}
                    className="label-mono mt-3 inline-flex items-center gap-1 border-b-[1.5px] border-ink pb-0.5 text-sm font-medium hover:border-accent hover:text-accent"
                  >
                    Ver demo<span className="sr-only"> {d.nombre}</span>
                    <Icon name="flecha" className="size-4" />
                  </Link>
                </div>
              </Draggable>
            </li>
          );
        })}
      </ul>

      <div className="mt-20 flex flex-col items-start gap-5 border-t-[1.5px] border-ink pt-8 md:flex-row md:items-center md:justify-between">
        <p className="max-w-[34rem] text-lg">¿Te gustó uno? Lo adaptamos a tu marca, tus textos y tus productos.</p>
        <Button href={waLink(v.mensajeWa)} external icono="chat" iconoBg="var(--color-menta)">
          {v.cta}
        </Button>
      </div>
    </section>
  );
}
