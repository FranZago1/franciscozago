import Image from "next/image";
import { DemoBar } from "@/components/demos/DemoBar";
import { DemoContacto } from "@/components/demos/DemoContacto";
import { LightboxRoot, LightboxTrigger, type LightboxTema } from "@/components/demos/Lightbox";
import { getDemo } from "@/content/demos";
import { demoOrThrow, fotosDeDemo } from "@/lib/demos";

const demo = demoOrThrow(getDemo("fotografia", "editorial"));
const fotos = fotosDeDemo("fotografia", demo);

const serif = "[font-family:var(--font-ed-serif)]";
const sans = "[font-family:var(--font-ed-sans)]";

const tema: LightboxTema = {
  overlay: `bg-white/97 text-[#1A1A1A] ${sans}`,
  boton:
    "px-3 py-2 text-sm tracking-wide text-[#1A1A1A] underline-offset-4 hover:underline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#1A1A1A]",
  contador: "text-[#6B6B6B]",
};

// Grilla asimétrica: el patrón se repite cada 5 fotos, con desfasajes intencionales.
const patron = [
  "col-span-6 md:col-span-7",
  "col-span-4 col-start-3 mt-8 md:col-span-4 md:col-start-9 md:mt-40",
  "col-span-3 mt-4 md:col-span-3 md:col-start-2 md:-mt-6",
  "col-span-3 mt-20 md:col-span-5 md:col-start-6 md:mt-24",
  "col-span-5 col-start-2 mt-8 md:col-span-6 md:col-start-4 md:mt-16",
];

const nav = [
  ["#galeria", "Galería"],
  ["#sobre-mi", "Sobre mí"],
  ["#servicios", "Servicios"],
  ["#contacto", "Contacto"],
] as const;

export default function EditorialDemo() {
  const hero = fotos[1]!;
  const retrato = fotos[0]!;
  return (
    <div className={`min-h-dvh bg-white pb-32 text-[#1A1A1A] ${sans} font-light`}>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 text-sm sm:px-8">
        <span className="tracking-wide">{demo.fotografo.nombre}</span>
        <nav aria-label="Secciones">
          <ul className="hidden gap-8 sm:flex">
            {nav.map(([href, label]) => (
              <li key={href}>
                <a href={href} className="hover:underline hover:underline-offset-4">
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#contacto" className="sm:hidden">
            Contacto
          </a>
        </nav>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-5 pt-16 sm:px-8 md:pt-28">
          <h1 className={`${serif} text-[clamp(3.25rem,11vw,8.5rem)] leading-[0.95] font-light`}>
            {demo.fotografo.nombre}
          </h1>
          <p className="mt-6 max-w-sm text-[#6B6B6B]">
            Fotografía de retrato y bodas en {demo.fotografo.ciudad}. Imágenes calmas, con luz natural y tiempo.
          </p>
          <div className="relative mt-14 aspect-[3/2] w-full md:mt-20 md:w-[82%] md:ml-auto">
            <Image src={hero.src} alt={hero.alt} fill priority sizes="(min-width: 1152px) 940px, 100vw" className="object-cover" />
          </div>
        </section>

        <section id="galeria" aria-labelledby="galeria-titulo" className="mx-auto mt-32 max-w-6xl px-5 sm:px-8 md:mt-48">
          <h2 id="galeria-titulo" className={`${serif} text-5xl font-light md:text-6xl`}>
            Galería
          </h2>
          <LightboxRoot fotos={fotos} tema={tema}>
            <ul className="mt-12 grid grid-cols-6 items-start gap-x-4 md:grid-cols-12 md:gap-x-8">
              {fotos.map((f, i) => (
                <li key={f.src} className={patron[i % patron.length]}>
                  <LightboxTrigger index={i} label={`Ampliar: ${f.alt}`} className="group overflow-hidden">
                    <Image
                      src={f.src}
                      alt={f.alt}
                      width={f.width}
                      height={f.height}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="h-auto w-full transition-opacity duration-300 group-hover:opacity-90"
                    />
                  </LightboxTrigger>
                </li>
              ))}
            </ul>
          </LightboxRoot>
        </section>

        <section
          id="sobre-mi"
          aria-labelledby="sobre-titulo"
          className="mx-auto mt-40 grid max-w-6xl gap-10 px-5 sm:px-8 md:mt-56 md:grid-cols-12"
        >
          <div className="relative aspect-[4/5] md:col-span-4 md:col-start-2">
            <Image src={retrato.src} alt={retrato.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
          </div>
          <div className="md:col-span-5 md:col-start-7 md:self-end">
            <h2 id="sobre-titulo" className={`${serif} text-5xl font-light md:text-6xl`}>
              Sobre mí
            </h2>
            {demo.fotografo.bio.map((p) => (
              <p key={p} className="mt-6 leading-relaxed text-[#444]">
                {p}
              </p>
            ))}
          </div>
        </section>

        <section id="servicios" aria-labelledby="servicios-titulo" className="mx-auto mt-40 max-w-6xl px-5 sm:px-8 md:mt-56">
          <h2 id="servicios-titulo" className={`${serif} text-5xl font-light md:text-6xl`}>
            Servicios
          </h2>
          <ul className="mt-12 grid gap-12 md:grid-cols-3 md:gap-10">
            {demo.servicios.map((s) => (
              <li key={s.nombre} className="border-t border-[#1A1A1A] pt-5">
                <h3 className={`${serif} text-3xl`}>{s.nombre}</h3>
                <p className="mt-3 text-[#6B6B6B]">{s.linea}</p>
                <p className="mt-5 text-sm tracking-wide">Consultar</p>
              </li>
            ))}
          </ul>
          {demo.testimonio ? (
            <figure className="mt-28 max-w-3xl md:ml-[16.6%]">
              <blockquote className={`${serif} text-3xl leading-snug font-light italic md:text-4xl`}>
                “{demo.testimonio.texto}”
              </blockquote>
              <figcaption className="mt-5 text-sm text-[#6B6B6B]">{demo.testimonio.autor}</figcaption>
            </figure>
          ) : null}
        </section>

        <section
          id="contacto"
          aria-labelledby="contacto-titulo"
          className="mx-auto mt-40 grid max-w-6xl gap-12 px-5 sm:px-8 md:mt-56 md:grid-cols-12"
        >
          <div className="md:col-span-5">
            <h2 id="contacto-titulo" className={`${serif} text-5xl font-light md:text-6xl`}>
              Escribime
            </h2>
            <p className="mt-6 text-[#6B6B6B]">
              Contame la fecha, el lugar y qué te imaginás. Respondo cada consulta personalmente.
            </p>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <DemoContacto
              fotografo={demo.fotografo.nombre}
              clases={{
                form: "grid gap-6",
                label: "grid gap-2 text-sm tracking-wide",
                input:
                  "border-0 border-b border-[#1A1A1A]/30 bg-transparent px-0 py-2 text-base font-light outline-none focus:border-[#1A1A1A]",
                boton:
                  "justify-self-start border border-[#1A1A1A] px-6 py-3 text-sm tracking-wide transition-colors hover:bg-[#1A1A1A] hover:text-white focus-visible:outline-1 focus-visible:outline-offset-2",
                aviso: "min-h-6 text-sm text-[#6B6B6B]",
              }}
            />
          </div>
        </section>
      </main>

      <footer className="mx-auto mt-32 max-w-6xl px-5 text-sm text-[#6B6B6B] sm:px-8">
        {demo.fotografo.nombre}, fotografía. Contenido ficticio.
      </footer>
      <DemoBar estilo={demo.nombre} />
    </div>
  );
}
