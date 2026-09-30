import Link from "next/link";
import { serviciosCopy } from "@/content/home";
import { servicios } from "@/content/servicios";
import { waLink } from "@/lib/wa";
import { Button } from "./Button";
import { Section } from "./Section";

export function Servicios() {
  return (
    <Section id="servicios" title={serviciosCopy.titulo}>
      <ul className="border-t border-line">
        {servicios.map((s) => (
          <li key={s.nombre} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
            <h3 className="font-semibold">{s.nombre}</h3>
            <p className="text-muted">
              {s.linea}
              {s.evidencia ? (
                <>
                  {" "}
                  <Link href={s.evidencia.href} className="link whitespace-nowrap text-ink">
                    {s.evidencia.label}
                  </Link>
                </>
              ) : null}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-8">{serviciosCopy.cierre}</p>
      <div className="mt-5">
        <Button href={waLink(serviciosCopy.mensajeWa)} external>
          Escribime por WhatsApp
        </Button>
      </div>
    </Section>
  );
}
