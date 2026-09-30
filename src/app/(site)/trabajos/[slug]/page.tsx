import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { DevTodo } from "@/components/DevTodo";
import { Icon } from "@/components/canvas/Icons";
import { SelectionFrame } from "@/components/canvas/SelectionFrame";
import { colorTrabajo, FolderChip, FolderTab } from "@/components/home/Trabajos";
import { getTrabajo, trabajos } from "@/content/trabajos";
import { waLink } from "@/lib/wa";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return trabajos.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const t = getTrabajo(slug);
  if (!t) return {};
  return {
    title: `Caso ${t.nombre}`,
    description: t.queEs,
    alternates: { canonical: `/trabajos/${t.slug}` },
  };
}

function Bloque({ titulo, nota, children }: { titulo: string; nota: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t-[1.5px] border-ink pt-6 md:grid-cols-[14rem_1fr] md:gap-10">
      <div>
        <h2 className="text-2xl font-medium tracking-tight md:text-3xl">{titulo}</h2>
        <p className="label-mono mt-1.5 hidden text-[12px] text-muted md:block">{nota}</p>
      </div>
      <div className="max-w-[42rem] text-lg">{children}</div>
    </section>
  );
}

export default async function CasoPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const t = getTrabajo(slug);
  if (!t) notFound();
  const c = colorTrabajo[t.color];

  const ficha: { label: string; value: React.ReactNode }[] = [
    { label: "Cliente", value: t.cliente },
    { label: "Tipo", value: t.tipo },
    ...(t.anio ? [{ label: "Año", value: String(t.anio) }] : []),
    ...(t.rol ? [{ label: "Rol", value: t.rol }] : []),
    { label: "Stack", value: t.stack.join(", ") },
    ...(t.url
      ? [
          {
            label: "Sitio",
            value: (
              <a href={t.url} target="_blank" rel="noopener noreferrer" className="link">
                {t.url.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
            ),
          },
        ]
      : []),
    ...(t.repo
      ? [
          {
            label: "Código",
            value: (
              <a href={t.repo} target="_blank" rel="noopener noreferrer" className="link">
                GitHub
              </a>
            ),
          },
        ]
      : []),
  ];

  return (
    <article className="wrap pt-12 md:pt-16">
      <Link href="/#trabajos" className="label-mono inline-flex items-center gap-1 text-[13px] text-muted hover:text-ink">
        <Icon name="flecha" className="size-3.5 -scale-x-100" />
        Todos los trabajos
      </Link>

      {/* 1. Nombre + qué es */}
      <header className="mt-8">
        <FolderTab trabajo={t} />
        <div className={`grid gap-8 border-[1.5px] bg-white p-5 md:grid-cols-[1fr_1.15fr] md:p-8 ${c.borde}`}>
          <div className="flex flex-col">
            <p className="label-mono flex items-center gap-2.5 text-sm">
              <span aria-hidden className="size-2.5 rounded-full bg-ink" />
              {t.anio ?? "Proyecto universitario"}
            </p>
            <h1 className="mt-4 text-[clamp(2.6rem,6vw,5rem)] leading-[0.96] font-medium tracking-[-0.045em]">{t.nombre}</h1>
            <p className="mt-4 max-w-[32rem] text-xl text-muted">{t.queEs}</p>
            <ul className="mt-8 flex flex-wrap gap-2 md:mt-auto" aria-label="Qué incluye">
              {t.tags.map((tag) => (
                <li key={tag}>
                  <FolderChip>{tag}</FolderChip>
                </li>
              ))}
            </ul>
          </div>
          <SelectionFrame tono="ink" padding="p-0">
            <div className="relative aspect-[16/10] overflow-hidden bg-surface">
              <Image
                src={t.media.desktop}
                alt={t.media.placeholder ? `Espacio para la captura del sitio de ${t.nombre}` : `Captura del sitio de ${t.nombre}`}
                fill
                priority
                sizes="(min-width: 768px) 640px, 100vw"
                className="object-cover object-top"
              />
              <span className="label-mono absolute top-3 right-3 bg-ink px-3 py-1.5 text-[12px] text-white">{t.badge}</span>
              {t.media.placeholder ? <DevTodo>captura desktop</DevTodo> : null}
            </div>
          </SelectionFrame>
        </div>
      </header>

      {/* 2. Ficha */}
      <dl className="mt-14 grid border-t-[1.5px] border-ink md:grid-cols-2">
        {ficha.map((f) => (
          <div key={f.label} className="grid gap-1 border-b border-line py-3 sm:grid-cols-[7rem_1fr] sm:gap-6 md:pr-8">
            <dt className="label-mono text-[13px] text-muted">{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-20 grid gap-16">
        {/* 3. Problema */}
        <Bloque titulo="El problema" nota="el punto de partida">
          <p>{t.problema}</p>
        </Bloque>

        {/* 4. Solución */}
        <Bloque titulo="La solución" nota="lo que ve el cliente">
          <ul className="grid gap-3">
            {t.solucion.map((s) => (
              <li key={s} className="flex gap-3">
                <span aria-hidden className="mt-2.5 size-2 shrink-0 bg-accent" />
                {s}
              </li>
            ))}
          </ul>
        </Bloque>

        {/* 5. Por dentro */}
        <Bloque titulo="Por dentro" nota="para los curiosos">
          <ul className="grid gap-2 rounded-[10px] bg-ink p-5 font-mono text-[14px] leading-relaxed text-white/85 md:p-6">
            {t.porDentro.map((s) => (
              <li key={s} className="flex gap-3">
                <span aria-hidden className="text-mostaza">
                  {">"}
                </span>
                {s}
              </li>
            ))}
          </ul>
        </Bloque>

        {/* 6. Capturas */}
        <Bloque titulo="Capturas" nota="desktop y celular">
          <div className="grid grid-cols-[1fr_auto] items-end gap-5">
            <SelectionFrame tono="ink" padding="p-0" nombre="desktop">
              <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                <Image
                  src={t.media.desktop}
                  alt={t.media.placeholder ? `Espacio para la captura desktop de ${t.nombre}` : `${t.nombre} en desktop`}
                  fill
                  sizes="(min-width: 768px) 520px, 70vw"
                  className="object-cover object-top"
                />
              </div>
            </SelectionFrame>
            <SelectionFrame tono="ink" padding="p-0" nombre="mobile" className="w-[6.5rem] sm:w-36">
              <div className="relative aspect-[390/844] overflow-hidden bg-surface">
                <Image
                  src={t.media.mobile}
                  alt={t.media.placeholder ? `Espacio para la captura mobile de ${t.nombre}` : `${t.nombre} en el celular`}
                  fill
                  sizes="144px"
                  className="object-cover object-top"
                />
              </div>
            </SelectionFrame>
          </div>
        </Bloque>
      </div>

      {/* 7. CTA */}
      <section className="mt-24 bg-ink p-7 text-white md:p-12">
        <h2 className="max-w-[18ch] text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.02] font-medium tracking-[-0.035em]">
          {t.cta.titulo}
        </h2>
        <p className="mt-3 text-lg text-white/70">Contame qué necesitás y te respondo con una propuesta.</p>
        <div className="mt-8">
          <Button
            href={waLink(t.cta.mensajeWa)}
            external
            icono="chat"
            iconoBg="var(--color-menta)"
            className="bg-white! text-ink! hover:shadow-[0_6px_0_0_var(--color-menta)]!"
          >
            Escribime por WhatsApp
          </Button>
        </div>
      </section>
    </article>
  );
}
