import Image from "next/image";
import { DemoBar } from "@/components/demos/DemoBar";
import { DemoContacto } from "@/components/demos/DemoContacto";
import { LightboxRoot, LightboxTrigger, type LightboxTema } from "@/components/demos/Lightbox";
import { getDemo } from "@/content/demos";
import { demoOrThrow, fotosDeDemo } from "@/lib/demos";

const demo = demoOrThrow(getDemo("fotografia", "documental"));
const fotos = fotosDeDemo("fotografia", demo);

// Paleta: durazno claro + ciruela + girasol (ver docs/tokens.md).
const font = "[font-family:var(--font-do)]";

const tema: LightboxTema = {
  overlay: `bg-[#2B1B2E]/95 text-[#FCEBDD] ${font}`,
  boton:
    "rounded-full bg-[#FCEBDD] px-4 py-2 text-sm font-bold text-[#2B1B2E] hover:bg-[#F2B233] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B233]",
  contador: "text-[#FCEBDD]/80",
};

export default function DocumentalDemo() {
  const collage = [fotos[2]!, fotos[0]!, fotos[1]!];
  return (
    <div className={`min-h-dvh bg-[#FCEBDD] pb-32 text-[#2B1B2E] ${font}`}>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <span className="text-lg font-extrabold">{demo.fotografo.nombre}</span>
        <a
          href="#contacto"
          className="rounded-full bg-[#2B1B2E] px-4 py-2 text-sm font-bold text-[#FCEBDD] hover:bg-[#4A3350]"
        >
          Reservá tu sesión
        </a>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pt-10 sm:px-8 md:grid-cols-2 md:pt-16">
          <div>
            <h1 className="text-[clamp(2.5rem,7vw,4.75rem)] leading-[1.02] font-black">
              Fotos de familia, tal como son.
            </h1>
            <p className="mt-5 max-w-md text-lg text-[#6B5A6E]">
              Soy {demo.fotografo.nombre.split(" ")[0]} y fotografío familias, newborns y festejos en{" "}
              {demo.fotografo.ciudad} y alrededores. Sin poses, con mucha paciencia.
            </p>
          </div>
          <div className="grid grid-cols-5 grid-rows-6 gap-3 [height:clamp(20rem,55vw,32rem)]">
            {collage.map((f, i) => (
              <div
                key={f.src}
                className={`relative overflow-hidden rounded-[22px] ${
                  ["col-span-3 row-span-6", "col-span-2 row-span-3", "col-span-2 row-span-3"][i]
                }`}
              >
                <Image src={f.src} alt={f.alt} fill priority={i === 0} sizes="(min-width: 768px) 30vw, 60vw" className="object-cover" />
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="galeria-titulo" className="mx-auto mt-24 max-w-6xl px-5 sm:px-8 md:mt-32">
          <h2 id="galeria-titulo" className="text-4xl font-black md:text-5xl">
            Momentos
          </h2>
          <LightboxRoot fotos={fotos} tema={tema}>
            <ul className="mt-10 columns-2 gap-3 md:columns-3 md:gap-4">
              {fotos.map((f, i) => (
                <li key={f.src} className="mb-3 break-inside-avoid md:mb-4">
                  <LightboxTrigger index={i} label={`Ampliar: ${f.alt}`} className="group overflow-hidden rounded-[18px]">
                    <Image
                      src={f.src}
                      alt={f.alt}
                      width={f.width}
                      height={f.height}
                      sizes="(min-width: 768px) 33vw, 50vw"
                      className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </LightboxTrigger>
                </li>
              ))}
            </ul>
          </LightboxRoot>
        </section>

        <section
          aria-labelledby="sobre-titulo"
          className="mx-auto mt-24 grid max-w-6xl gap-8 px-5 sm:px-8 md:mt-32 md:grid-cols-[1fr_1.3fr] md:items-center"
        >
          <div className="relative aspect-square overflow-hidden rounded-full bg-[#F2B233]">
            <Image src={fotos[7]!.src} alt={fotos[7]!.alt} fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover" />
          </div>
          <div>
            <h2 id="sobre-titulo" className="text-4xl font-black md:text-5xl">
              Hola, soy {demo.fotografo.nombre.split(" ")[0]}
            </h2>
            {demo.fotografo.bio.map((p) => (
              <p key={p} className="mt-4 text-lg text-[#6B5A6E]">
                {p}
              </p>
            ))}
          </div>
        </section>

        <section aria-labelledby="servicios-titulo" className="mx-auto mt-24 max-w-6xl px-5 sm:px-8 md:mt-32">
          <h2 id="servicios-titulo" className="text-4xl font-black md:text-5xl">
            Sesiones
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {demo.servicios.map((s, i) => (
              <li
                key={s.nombre}
                className={`rounded-[28px] p-7 ${i % 3 === 0 ? "bg-[#F2B233]" : i % 3 === 1 ? "bg-white/70" : "bg-[#F6C8A8]"}`}
              >
                <h3 className="text-2xl font-extrabold">{s.nombre}</h3>
                <p className="mt-2 text-[#2B1B2E]/80">{s.linea}</p>
                <p className="mt-5 inline-block rounded-full bg-[#2B1B2E] px-3 py-1 text-sm font-bold text-[#FCEBDD]">
                  Consultar
                </p>
              </li>
            ))}
          </ul>
          {demo.testimonio ? (
            <figure className="mt-10 rounded-[28px] bg-[#2B1B2E] p-8 text-[#FCEBDD] md:p-12">
              <blockquote className="text-2xl leading-snug font-bold md:text-3xl">“{demo.testimonio.texto}”</blockquote>
              <figcaption className="mt-5 text-[#FCEBDD]/80">{demo.testimonio.autor}</figcaption>
            </figure>
          ) : null}
        </section>

        <section id="contacto" aria-labelledby="contacto-titulo" className="mx-auto mt-24 max-w-3xl px-5 sm:px-8 md:mt-32">
          <h2 id="contacto-titulo" className="text-4xl font-black md:text-5xl">
            ¿Charlamos?
          </h2>
          <p className="mt-4 text-lg text-[#6B5A6E]">Contame quiénes son y qué les gustaría recordar.</p>
          <DemoContacto
            fotografo={demo.fotografo.nombre}
            clases={{
              form: "mt-8 grid gap-5 rounded-[28px] bg-white/70 p-6 sm:p-8",
              label: "grid gap-2 font-bold",
              input:
                "rounded-2xl border-2 border-[#2B1B2E]/15 bg-white px-4 py-3 font-normal outline-none focus:border-[#2B1B2E]",
              boton:
                "justify-self-start rounded-full bg-[#2B1B2E] px-6 py-3 font-bold text-[#FCEBDD] hover:bg-[#4A3350] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B1B2E]",
              aviso: "min-h-6 text-[#6B5A6E]",
            }}
          />
        </section>
      </main>

      <footer className="mx-auto mt-24 max-w-6xl px-5 text-sm text-[#6B5A6E] sm:px-8">
        {demo.fotografo.nombre}, fotografía documental. Contenido ficticio.
      </footer>
      <DemoBar estilo={demo.nombre} />
    </div>
  );
}
