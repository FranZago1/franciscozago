import { Eyebrow } from "@/components/canvas/Eyebrow";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Icon } from "@/components/canvas/Icons";
import { stickerBg, stickerFill } from "@/components/canvas/Sticker";
import { serviciosCopy } from "@/content/home";
import { servicios } from "@/content/servicios";
import { waLink } from "@/lib/wa";

export function Servicios() {
  return (
    <section id="servicios" aria-labelledby="servicios-titulo" className="wrap mt-32 md:mt-44">
      <Eyebrow n="01" className="mb-4">Servicios</Eyebrow>
      <h2 id="servicios-titulo" className="text-[clamp(2.2rem,5vw,3.6rem)] leading-none font-medium tracking-[-0.035em]">
        {serviciosCopy.titulo}
      </h2>

      <ul className="mt-10 grid border-t-[1.5px] border-l-[1.5px] border-ink sm:grid-cols-2 lg:grid-cols-3">
        {servicios.map((s) => (
          <li key={s.nombre} className="group relative border-r-[1.5px] border-b-[1.5px] border-ink bg-white p-5 transition-colors md:p-6">
            <span className={`flex size-11 items-center justify-center transition-transform duration-200 group-hover:-rotate-6 ${stickerBg[s.color]}`}>
              <Icon name={s.icono} className="size-6" secondary={stickerFill[s.color]} />
            </span>
            <h3 className="mt-5 text-2xl font-medium tracking-tight">{s.nombre}</h3>
            <p className="mt-1.5 text-muted">{s.linea}</p>
            {s.demos || s.evidencia ? (
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {s.demos ? (
                  <Link
                    href={`/demos/${s.demos}`}
                    className="label-mono inline-flex items-center gap-1 border-b-[1.5px] border-ink pb-0.5 text-[13px] font-medium hover:border-accent hover:text-accent"
                  >
                    Ver demos<span className="sr-only"> de {s.nombre}</span>
                    <Icon name="flecha" className="size-3.5" />
                  </Link>
                ) : null}
                {s.evidencia ? (
                  <Link
                    href={s.evidencia.href}
                    className="label-mono inline-flex items-center gap-1 border-b-[1.5px] border-line pb-0.5 text-[13px] font-medium text-muted hover:border-accent hover:text-accent"
                  >
                    {s.evidencia.label}
                    <Icon name="flecha" className="size-3.5" />
                  </Link>
                ) : null}
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
        <p className="max-w-[34rem] text-lg">{serviciosCopy.cierre}</p>
        <Button href={waLink(serviciosCopy.mensajeWa)} external icono="chat" iconoBg="var(--color-mostaza)">
          Pedime una propuesta
        </Button>
      </div>
    </section>
  );
}
