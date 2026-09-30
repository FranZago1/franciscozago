import { contactoCopy } from "@/content/home";
import { instagramUrl, site } from "@/content/site";
import { waLink } from "@/lib/wa";
import { Button } from "./Button";

export function Contacto({ form }: { form?: React.ReactNode }) {
  const ig = instagramUrl();
  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="col mt-28 md:mt-40">
      <h2 id="contacto-titulo" className="font-display text-display font-normal tracking-[-0.01em]">
        {contactoCopy.titulo}
      </h2>
      <p className="mt-4 text-lg text-muted">{contactoCopy.linea}</p>
      <ul className="mt-8 flex flex-wrap gap-3">
        <li>
          <Button href={waLink(contactoCopy.mensajeWa)} external>
            WhatsApp
          </Button>
        </li>
        {ig ? (
          <li>
            <Button href={ig} external variant="secondary">
              Instagram
            </Button>
          </li>
        ) : null}
        <li>
          <Button
            href={`mailto:${site.email}?subject=${encodeURIComponent(contactoCopy.asuntoEmail)}`}
            variant="secondary"
          >
            Email
          </Button>
        </li>
      </ul>
      {form ? <div className="mt-14">{form}</div> : null}
    </section>
  );
}
