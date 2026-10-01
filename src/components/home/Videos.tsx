import { Button } from "@/components/Button";
import { Eyebrow } from "@/components/canvas/Eyebrow";
import { videosCopy } from "@/content/home";
import { waLink } from "@/lib/wa";
import { VideoLoop } from "./VideoLoop";

export function Videos() {
  return (
    <section
      id="videos"
      aria-labelledby="videos-titulo"
      className="wrap mt-32 md:mt-44"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <Eyebrow n="04" className="mb-4">
            Videos
          </Eyebrow>
          <h2
            id="videos-titulo"
            className="max-w-[14ch] text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.02] font-medium tracking-[-0.035em]"
          >
            {videosCopy.titulo}
          </h2>
          <p className="mt-6 max-w-[34rem] text-lg text-muted">
            {videosCopy.bajada}
          </p>
          <ul className="mt-8 grid max-w-[34rem] gap-3 text-lg max-md:hidden">
            {videosCopy.puntos.map((p) => (
              <li key={p} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-2.5 size-2 shrink-0 bg-accent"
                />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-9">
            <Button
              href={waLink(videosCopy.mensajeWa)}
              external
              icono="chat"
              iconoBg="var(--color-menta)"
            >
              Quiero un video así
            </Button>
          </div>
        </div>

        {/* El primer video (motion-*) sigue en public/videos y scripts/video/motion.html. */}
        <VideoLoop
          src="/videos/flujo-1080"
          srcMobile="/videos/flujo-720"
          poster="/videos/flujo-poster.webp"
          medida="1:1 · 22 s · 60 fps"
          nota={videosCopy.nota}
          label="Video de ejemplo: el dueño de una barbería necesita una web, entra a franciscozago.dev, charlamos por WhatsApp, diseño y desarrollo su sitio con reservas, se publica y le llega la primera reserva. Cierra con Francisco Zago: diseño y desarrollo a medida lo que necesites para tu negocio."
        />
      </div>
    </section>
  );
}
