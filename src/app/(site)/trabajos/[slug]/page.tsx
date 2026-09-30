import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { DevTodo } from "@/components/DevTodo";
import { Tag } from "@/components/Tag";
import { TrabajoMedia } from "@/components/TrabajoMedia";
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

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-semibold tracking-tight">{titulo}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default async function CasoPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const t = getTrabajo(slug);
  if (!t) notFound();

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
    <article className="col pt-16 md:pt-24">
      {/* 1. Nombre + qué es */}
      <header>
        {t.categoria === "academico" ? (
          <div className="mb-4">
            <Tag>Proyecto universitario</Tag>
          </div>
        ) : null}
        <h1 className="text-[2.25rem] font-semibold leading-tight tracking-tight md:text-5xl">{t.nombre}</h1>
        <p className="mt-3 text-lg text-muted">{t.queEs}</p>
      </header>

      <div className="mt-10">
        <TrabajoMedia trabajo={t} sizes="(min-width: 760px) 680px, 100vw" priority />
      </div>

      {/* 2. Ficha */}
      <dl className="mt-10 grid gap-3 border-t border-line pt-6">
        {ficha.map((f) => (
          <div key={f.label} className="grid gap-0.5 sm:grid-cols-[7rem_1fr] sm:gap-6">
            <dt className="text-sm text-muted">{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>

      {/* 3. Problema */}
      <Bloque titulo="El problema">
        <p>{t.problema}</p>
      </Bloque>

      {/* 4. Solución */}
      <Bloque titulo="La solución">
        <ul className="grid list-disc gap-2 pl-5 marker:text-muted">
          {t.solucion.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </Bloque>

      {/* 5. Por dentro */}
      <Bloque titulo="Por dentro">
        <ul className="grid list-disc gap-2 pl-5 text-muted marker:text-line">
          {t.porDentro.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </Bloque>

      {/* 6. Capturas */}
      <Bloque titulo="Capturas">
        <div className="grid grid-cols-[1fr_auto] items-end gap-4">
          <div className="relative aspect-[16/10] overflow-hidden rounded-media bg-surface ring-1 ring-line ring-inset">
            <Image
              src={t.media.desktop}
              alt={t.media.placeholder ? `Espacio para la captura desktop de ${t.nombre}` : `${t.nombre} en desktop`}
              fill
              sizes="(min-width: 760px) 520px, 70vw"
              className="object-cover"
            />
            {t.media.placeholder ? <DevTodo>captura desktop</DevTodo> : null}
          </div>
          <div className="relative aspect-[390/844] w-[6.5rem] overflow-hidden rounded-media bg-surface ring-1 ring-line ring-inset sm:w-36">
            <Image
              src={t.media.mobile}
              alt={t.media.placeholder ? `Espacio para la captura mobile de ${t.nombre}` : `${t.nombre} en el celular`}
              fill
              sizes="144px"
              className="object-cover object-top"
            />
          </div>
        </div>
      </Bloque>

      {/* 7. CTA */}
      <section className="mt-20 rounded-card bg-surface p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">{t.cta.titulo}</h2>
        <p className="mt-2 text-muted">Contame qué necesitás y te respondo con una propuesta.</p>
        <div className="mt-6">
          <Button href={waLink(t.cta.mensajeWa)} external>
            Escribime por WhatsApp
          </Button>
        </div>
      </section>
    </article>
  );
}
