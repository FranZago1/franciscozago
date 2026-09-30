import Link from "next/link";
import type { Trabajo } from "@/content/trabajos";
import { Tag } from "./Tag";
import { TrabajoMedia } from "./TrabajoMedia";

export function TrabajoCard({ trabajo }: { trabajo: Trabajo }) {
  return (
    <article className="group">
      <Link href={`/trabajos/${trabajo.slug}`} tabIndex={-1} aria-hidden className="block">
        <TrabajoMedia trabajo={trabajo} sizes="(min-width: 760px) 680px, 100vw" />
      </Link>
      <div className="mt-5">
        <h3 className="text-xl font-semibold tracking-tight">{trabajo.nombre}</h3>
        <p className="mt-1 text-sm text-muted">
          {trabajo.tipo}
          {trabajo.anio ? `, ${trabajo.anio}` : null}
        </p>
        <p className="mt-3">{trabajo.lineaHome}</p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Qué incluye">
          {trabajo.tags.map((t) => (
            <li key={t}>
              <Tag>{t}</Tag>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex gap-5 text-base font-medium">
          {trabajo.url ? (
            <a href={trabajo.url} target="_blank" rel="noopener noreferrer" className="link">
              Ver sitio<span className="sr-only"> de {trabajo.nombre} (se abre en otra pestaña)</span>
            </a>
          ) : null}
          <Link href={`/trabajos/${trabajo.slug}`} className="link">
            Ver caso<span className="sr-only"> {trabajo.nombre}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
