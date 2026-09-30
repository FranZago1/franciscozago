import Link from "next/link";
import { trabajosAcademicos } from "@/content/trabajos";
import { Section } from "./Section";
import { Tag } from "./Tag";

export function OtrosProyectos() {
  return (
    <Section id="otros-proyectos" title="Otros proyectos">
      <ul className="grid gap-4">
        {trabajosAcademicos.map((t) => (
          <li key={t.slug}>
            <article className="rounded-card border border-line p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-semibold tracking-tight">{t.nombre}</h3>
                <Tag>Proyecto universitario</Tag>
              </div>
              <p className="mt-2">{t.lineaHome}</p>
              <p className="mt-3 text-sm text-muted">
                Microservicios en Go, RAG, mensajería asincrónica con RabbitMQ, búsqueda vectorial con Apache
                Solr y respuestas en streaming.
              </p>
              <div className="mt-4 flex gap-5 font-medium">
                <Link href={`/trabajos/${t.slug}`} className="link">
                  Ver caso<span className="sr-only"> {t.nombre}</span>
                </Link>
                {t.repo ? (
                  <a href={t.repo} target="_blank" rel="noopener noreferrer" className="link">
                    Código en GitHub
                  </a>
                ) : null}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}
