import { Eyebrow } from "@/components/canvas/Eyebrow";
import { Button } from "@/components/Button";
import { ContactForm } from "@/components/ContactForm";
import { SelectionFrame } from "@/components/canvas/SelectionFrame";
import { contactoCopy } from "@/content/home";
import { instagramUrl, site } from "@/content/site";
import { waLink } from "@/lib/wa";

export function Contacto() {
  const ig = instagramUrl();
  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="wrap mt-32 md:mt-48">
      <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <Eyebrow n="05" className="mb-5">
            Contacto
          </Eyebrow>
          <div className="relative inline-block">
            <h2
              id="contacto-titulo"
              className="text-[clamp(3.6rem,12vw,8.5rem)] leading-[0.9] font-medium tracking-[-0.05em]"
            >
              {contactoCopy.titulo}
              <span className="text-accent">.</span>
            </h2>
          </div>
          <p className="mt-6 text-xl">{contactoCopy.linea}</p>
          <ul className="mt-8 flex flex-wrap gap-3">
            <li>
              <Button href={waLink(contactoCopy.mensajeWa)} external icono="chat" iconoBg="var(--color-menta)">
                WhatsApp
              </Button>
            </li>
            {ig ? (
              <li>
                <Button href={ig} external icono="camara" iconoBg="var(--color-rosa)">
                  Instagram
                </Button>
              </li>
            ) : null}
            <li>
              <Button
                href={`mailto:${site.email}?subject=${encodeURIComponent(contactoCopy.asuntoEmail)}`}
                icono="rayo"
                iconoBg="var(--color-mostaza)"
              >
                Email
              </Button>
            </li>
          </ul>
        </div>
        <SelectionFrame nombre="formulario" padding="p-5 md:p-7" className="bg-white">
          <ContactForm />
        </SelectionFrame>
      </div>
    </section>
  );
}
