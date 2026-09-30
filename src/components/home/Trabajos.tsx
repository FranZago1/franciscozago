import { Eyebrow } from "@/components/canvas/Eyebrow";
import Image from "next/image";
import Link from "next/link";
import { DevTodo } from "@/components/DevTodo";
import { Icon } from "@/components/canvas/Icons";
import { SelectionFrame } from "@/components/canvas/SelectionFrame";
import { trabajos, type Trabajo } from "@/content/trabajos";

export const colorTrabajo: Record<Trabajo["color"], { tab: string; borde: string }> = {
  celeste: { tab: "bg-celeste text-ink", borde: "border-celeste" },
  ink: { tab: "bg-ink text-white", borde: "border-ink" },
  mostaza: { tab: "bg-mostaza text-ink", borde: "border-mostaza" },
  menta: { tab: "bg-menta text-ink", borde: "border-menta" },
  rosa: { tab: "bg-rosa text-white", borde: "border-rosa" },
};

/** Pestaña de carpeta ("TRABAJO 01"). */
export function FolderTab({ trabajo, className = "" }: { trabajo: Trabajo; className?: string }) {
  return (
    <span
      className={`folder-tab label-mono inline-flex h-11 items-center gap-2.5 pr-14 pl-5 text-sm font-medium md:h-12 md:pl-7 md:text-base ${colorTrabajo[trabajo.color].tab} ${className}`}
    >
      <Icon name="grafico" className="size-4" />
      Trabajo {trabajo.numero}
    </span>
  );
}

/** Etiqueta negra con forma de solapa de carpeta. */
export function FolderChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="folder-chip label-mono inline-block bg-ink px-3 pt-3.5 pb-1.5 text-[12px] text-white md:text-[13px]">
      {children}
    </span>
  );
}

function Carpeta({ t, i }: { t: Trabajo; i: number }) {
  const c = colorTrabajo[t.color];
  return (
    <article
      aria-labelledby={`trabajo-${t.slug}`}
      className="md:sticky md:top-3"
      style={{ zIndex: i + 1, "--offset": `${i * 200}px` } as React.CSSProperties}
    >
      <div className="flex">
        <FolderTab trabajo={t} className="md:ml-[var(--offset)]" />
      </div>
      <div
        className={`group grid gap-8 border-[1.5px] bg-white p-5 md:h-[min(640px,calc(100svh-5.5rem))] md:grid-cols-[1fr_1.15fr] md:p-7 ${c.borde}`}
      >
        <div className="flex flex-col">
          <p className="label-mono flex items-center gap-2.5 text-sm">
            <span aria-hidden className="size-2.5 rounded-full bg-ink" />
            {t.anio ?? "Proyecto universitario"}
          </p>
          <h3 id={`trabajo-${t.slug}`} className="mt-4 text-[clamp(2.3rem,5vw,4.4rem)] leading-[0.98] font-medium tracking-[-0.04em]">
            {t.nombre}
            <span className="block text-muted">{t.tipo}</span>
          </h3>
          <p className="mt-5 max-w-[32rem] text-lg">{t.lineaHome}</p>
          <div className="label-mono mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
            <Link href={`/trabajos/${t.slug}`} className="inline-flex items-center gap-1 border-b-[1.5px] border-ink pb-0.5 hover:border-accent hover:text-accent">
              Ver caso<span className="sr-only"> {t.nombre}</span>
              <Icon name="flecha" className="size-4" />
            </Link>
            {t.url ? (
              <a
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 border-b-[1.5px] border-ink pb-0.5 hover:border-accent hover:text-accent"
              >
                Ver sitio<span className="sr-only"> de {t.nombre} (se abre en otra pestaña)</span>
                <Icon name="flecha" className="size-4" />
              </a>
            ) : null}
          </div>
          <ul className="mt-8 flex flex-wrap gap-2 md:mt-auto" aria-label="Qué incluye">
            {t.tags.map((tag) => (
              <li key={tag}>
                <FolderChip>{tag}</FolderChip>
              </li>
            ))}
          </ul>
        </div>

        <SelectionFrame tono="ink" padding="p-0" className="min-h-[240px] md:min-h-0">
          <div className="relative size-full min-h-[240px] overflow-hidden bg-surface md:min-h-0">
            <Image
              src={t.media.desktop}
              alt={t.media.placeholder ? `Espacio para la captura del sitio de ${t.nombre}` : `Captura del sitio de ${t.nombre}`}
              fill
              sizes="(min-width: 768px) 640px, 100vw"
              className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            />
            <span className="label-mono absolute top-3 right-3 bg-ink px-3 py-1.5 text-[12px] text-white md:text-[13px]">
              {t.badge}
            </span>
            {t.media.placeholder ? <DevTodo>captura real de {t.nombre}</DevTodo> : null}
          </div>
        </SelectionFrame>
      </div>
    </article>
  );
}

export function Trabajos() {
  return (
    <section id="trabajos" aria-labelledby="trabajos-titulo" className="wrap mt-32 md:mt-44">
      <Eyebrow n="02" className="mb-4">
        Trabajos
      </Eyebrow>
      <div className="mb-10 flex items-end justify-between gap-6">
        <h2 id="trabajos-titulo" className="text-[clamp(2.2rem,5vw,3.6rem)] leading-none font-medium tracking-[-0.035em]">
          Lo que construí
        </h2>
        <p className="label-mono hidden text-[13px] text-muted md:block">{trabajos.length} proyectos</p>
      </div>
      <div className="grid gap-14 md:gap-28">
        {trabajos.map((t, i) => (
          <Carpeta key={t.slug} t={t} i={i} />
        ))}
      </div>
    </section>
  );
}
