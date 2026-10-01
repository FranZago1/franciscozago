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

      {/* Mobile: lista desplegable compacta (uno abierto a la vez). */}
      <ul className="mt-8 border-t-[1.5px] border-ink md:hidden">
        {servicios.map((s) => (
          <li key={s.nombre} className="border-b-[1.5px] border-ink">
            <details name="servicio" className="group/acc">
              <summary className="flex cursor-pointer list-none items-center gap-3.5 py-3.5 [&::-webkit-details-marker]:hidden">
                <span className={`flex size-9 shrink-0 items-center justify-center ${stickerBg[s.color]}`}>
                  <Icon name={s.icono} className="size-5" secondary={stickerFill[s.color]} />
                </span>
                <span className="text-xl font-medium tracking-tight">{s.nombre}</span>
                <span aria-hidden className="relative ml-auto grid size-8 shrink-0 place-items-center">
                  <span className="absolute h-[1.5px] w-3.5 bg-current" />
                  <span className="absolute h-3.5 w-[1.5px] bg-current transition-transform duration-300 group-open/acc:rotate-90 group-open/acc:opacity-0" />
                </span>
              </summary>
              <div className="pb-5 pl-[3.125rem]">
                <p className="text-muted">{s.linea}</p>
                {s.demos || s.evidencia ? (
                  <div className="mt-3.5 flex flex-wrap gap-x-5 gap-y-2">
                    {s.demos ? (
                      <Link
                        href={`/demos/${s.demos}`}
                        className="label-mono inline-flex items-center gap-1 border-b-[1.5px] border-ink pb-0.5 text-[13px] font-medium"
                      >
                        Ver demos<span className="sr-only"> de {s.nombre}</span>
                        <Icon name="flecha" className="size-3.5" />
                      </Link>
                    ) : null}
                    {s.evidencia ? (
                      <Link
                        href={s.evidencia.href}
                        className="label-mono inline-flex items-center gap-1 border-b-[1.5px] border-line pb-0.5 text-[13px] font-medium text-muted"
                      >
                        {s.evidencia.label}
                        <Icon name="flecha" className="size-3.5" />
                      </Link>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </details>
          </li>
        ))}
      </ul>

      <ul className="mt-10 grid border-t-[1.5px] border-l-[1.5px] border-ink max-md:hidden sm:grid-cols-2 lg:grid-cols-3">
        {servicios.map((s) => (
          <li key={s.nombre} className="group relative border-r-[1.5px] border-b-[1.5px] border-ink bg-white p-5 transition-colors duration-200 hover:bg-ink hover:text-white md:p-6">
            <span className={`flex size-11 items-center justify-center transition-transform duration-200 group-hover:-rotate-6 ${stickerBg[s.color]}`}>
              <Icon name={s.icono} className="size-6" secondary={stickerFill[s.color]} />
            </span>
            <h3 className="mt-5 text-2xl font-medium tracking-tight">{s.nombre}</h3>
            <p className="mt-1.5 text-muted transition-colors duration-200 group-hover:text-white/70">{s.linea}</p>
            {s.demos || s.evidencia ? (
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {s.demos ? (
                  <Link
                    href={`/demos/${s.demos}`}
                    className="label-mono inline-flex items-center gap-1 border-b-[1.5px] border-ink pb-0.5 text-[13px] font-medium group-hover:border-white hover:!border-mostaza hover:!text-mostaza"
                  >
                    Ver demos<span className="sr-only"> de {s.nombre}</span>
                    <Icon name="flecha" className="size-3.5" />
                  </Link>
                ) : null}
                {s.evidencia ? (
                  <Link
                    href={s.evidencia.href}
                    className="label-mono inline-flex items-center gap-1 border-b-[1.5px] border-line pb-0.5 text-[13px] font-medium text-muted group-hover:border-white/40 group-hover:text-white/70 hover:!border-mostaza hover:!text-mostaza"
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
