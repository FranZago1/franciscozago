import Image from "next/image";
import { DemoBar } from "@/components/demos/DemoBar";
import { DemoContacto } from "@/components/demos/DemoContacto";
import { LightboxRoot, LightboxTrigger, type LightboxTema } from "@/components/demos/Lightbox";
import { getDemo } from "@/content/demos";
import { demoOrThrow, fotosDeDemo } from "@/lib/demos";

const demo = demoOrThrow(getDemo("fotografia", "cinematico"));
const fotos = fotosDeDemo("fotografia", demo);

const display = "[font-family:var(--font-ci-display)] uppercase";
const sans = "[font-family:var(--font-ci-sans)]";

const tema: LightboxTema = {
  overlay: `bg-black text-white ${sans}`,
  boton:
    "px-3 py-2 text-xs uppercase tracking-[0.2em] text-white/80 hover:text-white focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white",
  contador: "text-white/60",
};

export default function CinematicoDemo() {
  const hero = fotos[0]!;
  // La primera foto es el hero; la galería sigue con el resto, a sangre.
  const galeria = fotos.slice(1);
  return (
    <div className={`min-h-dvh bg-black pb-28 text-white ${sans}`}>
      <section aria-labelledby="hero-titulo" className="relative h-[100svh] min-h-[32rem] w-full overflow-hidden">
        <Image src={hero.src} alt={hero.alt} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" aria-hidden />
        <header className="absolute inset-x-0 top-0 flex justify-between p-5 text-xs uppercase tracking-[0.25em] text-white/80 sm:p-8">
          <span>{demo.fotografo.ciudad}</span>
          <a href="#contacto" className="hover:text-white">
            Contacto
          </a>
        </header>
        <div className="absolute inset-x-0 bottom-0 p-5 pb-28 sm:p-8 sm:pb-28">
          <h1 id="hero-titulo" className={`${display} text-[clamp(4rem,19vw,17rem)] leading-[0.82]`}>
            {demo.fotografo.nombre}
          </h1>
          <p className="mt-4 text-xs uppercase tracking-[0.25em] text-white/70">{demo.para}</p>
        </div>
      </section>

      <section aria-label="Galería">
        <LightboxRoot fotos={fotos} tema={tema}>
          <ul>
            {galeria.map((f, i) => (
              <li key={f.src}>
                <LightboxTrigger index={i + 1} label={`Ampliar: ${f.alt}`} className="group">
                  <div
                    className={`relative w-full overflow-hidden ${
                      f.width > f.height ? "aspect-[3/2] md:aspect-auto md:h-[100svh]" : "h-[100svh]"
                    }`}
                  >
                    <Image
                      src={f.src}
                      alt={f.alt}
                      fill
                      sizes="100vw"
                      className="object-cover transition-[filter] duration-500 group-hover:brightness-110"
                    />
                  </div>
                </LightboxTrigger>
              </li>
            ))}
          </ul>
        </LightboxRoot>
      </section>

      <section aria-labelledby="sobre-titulo" className="grid gap-10 px-5 py-32 sm:px-8 md:grid-cols-2 md:py-48">
        <h2 id="sobre-titulo" className={`${display} text-6xl leading-none md:text-8xl`}>
          Sobre mí
        </h2>
        <div className="max-w-md self-end text-white/75">
          {demo.fotografo.bio.map((p) => (
            <p key={p} className="mt-3 first:mt-0">
              {p}
            </p>
          ))}
        </div>
      </section>

      <section aria-labelledby="servicios-titulo" className="border-t border-white/15 px-5 py-24 sm:px-8">
        <h2 id="servicios-titulo" className={`${display} text-6xl leading-none md:text-8xl`}>
          Servicios
        </h2>
        <ul className="mt-12">
          {demo.servicios.map((s) => (
            <li
              key={s.nombre}
              className="grid gap-2 border-b border-white/15 py-6 md:grid-cols-[1fr_1fr_auto] md:items-baseline md:gap-8"
            >
              <h3 className={`${display} text-3xl md:text-5xl`}>{s.nombre}</h3>
              <p className="text-white/70">{s.linea}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Consultar</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="contacto" aria-labelledby="contacto-titulo" className="grid gap-12 px-5 py-24 sm:px-8 md:grid-cols-2">
        <h2 id="contacto-titulo" className={`${display} text-[clamp(4rem,14vw,11rem)] leading-[0.85]`}>
          Hablemos
        </h2>
        <DemoContacto
          fotografo={demo.fotografo.nombre}
          clases={{
            form: "grid gap-5 self-end",
            label: "grid gap-2 text-xs uppercase tracking-[0.2em] text-white/60",
            input:
              "border border-white/25 bg-transparent px-3 py-3 text-base normal-case tracking-normal text-white outline-none focus:border-white",
            boton:
              "justify-self-start bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:bg-white/85 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white",
            aviso: "min-h-6 text-sm text-white/70",
          }}
        />
      </section>

      <footer className="px-5 pt-8 text-xs uppercase tracking-[0.2em] text-white/50 sm:px-8">
        {demo.fotografo.nombre}. Contenido ficticio.
      </footer>
      <DemoBar estilo={demo.nombre} />
    </div>
  );
}
