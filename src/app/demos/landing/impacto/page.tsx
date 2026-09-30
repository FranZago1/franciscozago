import Image from "next/image";
import { DemoBar } from "@/components/demos/DemoBar";
import { Icono } from "@/demos/landing/shared/Icono";
import { coaches, disciplinas, faqs, IMG, planes, precioARS, testimonios } from "@/demos/landing/impacto/datos";
import { Encabezado, Logo } from "@/demos/landing/impacto/Encabezado";
import { FormularioPrueba } from "@/demos/landing/impacto/FormularioPrueba";
import { Horarios } from "@/demos/landing/impacto/Horarios";
import { ReservaProvider, VerHorarios } from "@/demos/landing/impacto/Reserva";

const display = "[font-family:var(--font-fn-display)]";
const sans = "[font-family:var(--font-fn-sans)]";
const wrap = "mx-auto w-full max-w-[1320px] px-4 sm:px-8";

const animaciones = `
@keyframes fn-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
@keyframes fn-subir { from { opacity: 0; transform: translateY(28px) } to { opacity: 1; transform: none } }
@keyframes fn-tachar { from { transform: scaleX(0) rotate(-4deg) } to { transform: scaleX(1) rotate(-4deg) } }
.fn-marquee { animation: fn-marquee 32s linear infinite }
.fn-linea { animation: fn-subir .8s cubic-bezier(.2,.7,.2,1) both }
.fn-tachado { transform-origin: left center; transform: rotate(-4deg); animation: fn-tachar .6s .9s cubic-bezier(.7,0,.2,1) both }
@media (prefers-reduced-motion: reduce) {
  .fn-marquee, .fn-linea, .fn-tachado { animation: none }
}`;

function Eyebrow({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-xs font-bold tracking-[0.28em] text-[#FF6A2B] uppercase">
      <span className="bg-[#FF4D00] px-1.5 py-0.5 text-black">{n}</span>
      {children}
    </p>
  );
}

function Marquesina() {
  const items = ["Funcional", "Halterofilia", "HIIT", "Movilidad", "Open box", "Clase de prueba gratis"];
  const fila = (oculta: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={oculta || undefined}>
      {items.map((t) => (
        <li key={t} className={`${display} flex items-center gap-8 pr-8 text-3xl text-black uppercase md:text-5xl`}>
          {t}
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 md:size-7">
            <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="currentColor" />
          </svg>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="relative -rotate-[1.5deg] overflow-hidden border-y-2 border-black bg-[#FF4D00] py-4 md:py-5">
      <div className="fn-marquee flex w-max">
        {fila(false)}
        {fila(true)}
      </div>
    </div>
  );
}

function Intensidad({ valor }: { valor: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-bold tracking-[0.2em] text-white/60 uppercase">Intensidad</span>
      <span className="flex gap-1" role="img" aria-label={`Intensidad ${valor} de 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`h-3 w-2 -skew-x-12 ${i <= valor ? "bg-[#FF4D00]" : "bg-white/15"}`} />
        ))}
      </span>
    </div>
  );
}

export default function ImpactoDemo() {
  return (
    <div
      className={`min-h-dvh overflow-x-clip bg-[#0A0A0A] pb-28 text-[#F2EEE6] antialiased ${sans} selection:bg-[#FF4D00] selection:text-black`}
      style={{ "--color-accent": "#FF4D00" } as React.CSSProperties}
    >
      <style>{animaciones}</style>
      <ReservaProvider>
        <Encabezado />

        <main>
          {/* HERO */}
          <section id="inicio" aria-labelledby="hero-titulo" className="relative -mt-16 overflow-hidden pt-16 md:-mt-20 md:pt-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:calc(100%/6)_100%]"
            />
            <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-[-20%] size-[46rem] rounded-full bg-[#FF4D00]/20 blur-[120px]" />
            <div className={`${wrap} relative grid grid-cols-1 gap-10 pt-10 pb-14 md:pt-16 lg:grid-cols-12 lg:gap-8 lg:pt-20 lg:pb-20`}>
              <div className="lg:col-span-7">
                <p className="fn-linea flex items-center gap-3 text-xs font-bold tracking-[0.28em] text-white/70 uppercase">
                  <span className="size-2 bg-[#FF4D00]" aria-hidden="true" />
                  Box de entrenamiento · Barrio Norte, Córdoba
                </p>
                <h1
                  id="hero-titulo"
                  className={`${display} mt-8 text-[clamp(5rem,21.5vw,10.5rem)] leading-[0.86] tracking-[-0.01em] uppercase md:mt-10`}
                >
                  <span className="fn-linea block" style={{ animationDelay: "0.05s" }}>
                    Más fuerte
                  </span>
                  <span className="fn-linea block" style={{ animationDelay: "0.15s" }}>
                    que tus
                  </span>
                  <span className="fn-linea relative inline-block text-[#FF4D00]" style={{ animationDelay: "0.25s" }}>
                    excusas.
                    <span aria-hidden="true" className="fn-tachado absolute top-[46%] left-[-3%] h-[0.11em] w-[106%] bg-[#F2EEE6]" />
                  </span>
                </h1>
                <p className="fn-linea mt-8 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl" style={{ animationDelay: "0.4s" }}>
                  Clases de 50 minutos, grupos de hasta 12 personas y coaches que te corrigen cada repetición. Vení una vez: el
                  resto lo decidís vos.
                </p>
                <div className="fn-linea mt-9 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ animationDelay: "0.5s" }}>
                  <a
                    href="#reserva"
                    className="group inline-flex items-center justify-center gap-3 bg-[#FF4D00] px-6 py-5 text-[15px] font-bold tracking-wide whitespace-nowrap text-black uppercase shadow-[6px_6px_0_#F2EEE6] transition-[transform,box-shadow,background-color] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#FF6A2B] hover:shadow-[9px_9px_0_#F2EEE6] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_#F2EEE6] sm:px-7 sm:text-base"
                  >
                    Reservá tu clase de prueba
                    <Icono nombre="flecha" grosor={2.6} cuadrado className="size-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </a>
                  <a
                    href="#horarios"
                    className="inline-flex items-center justify-center gap-2 border border-white/25 px-7 py-5 text-[15px] font-bold sm:text-base tracking-wide uppercase transition-colors hover:border-white hover:bg-white hover:text-black"
                  >
                    Ver horarios
                  </a>
                </div>
              </div>

              <div className="relative lg:col-span-5">
                <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] lg:mt-4">
                  <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 border-2 border-[#FF4D00]" />
                  <div className="relative h-full overflow-hidden border-2 border-[#F2EEE6]/90">
                    <Image
                      src={`${IMG}/hero-atleta-envion.webp`}
                      alt="Ilustración de una atleta haciendo un envión con barra olímpica sobre un gran círculo naranja"
                      fill
                      priority
                      sizes="(min-width: 1024px) 520px, (min-width: 640px) 520px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  {/* Sello giratorio */}
                  <div className="absolute -bottom-10 left-3 size-28 sm:-left-10 sm:size-36">
                    <svg viewBox="0 0 200 200" className="size-full motion-safe:animate-[spin_22s_linear_infinite]" aria-hidden="true">
                      <circle cx="100" cy="100" r="98" fill="#F2EEE6" />
                      <defs>
                        <path id="fn-circulo" d="M100 100 m-72 0 a72 72 0 1 1 144 0 a72 72 0 1 1 -144 0" />
                      </defs>
                      <text className="fill-black text-[21px] font-bold tracking-[0.2em] uppercase">
                        <textPath href="#fn-circulo">Primera clase gratis · Primera clase gratis ·</textPath>
                      </text>
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                      <span className="flex size-12 items-center justify-center bg-[#FF4D00] text-black">
                        <Icono nombre="rayo" relleno grosor={0} className="size-6" />
                      </span>
                    </span>
                    <span className="sr-only">Primera clase gratis</span>
                  </div>
                  <div className="absolute top-5 -right-2 bg-[#0A0A0A] px-4 py-3 ring-1 ring-white/20 sm:-right-6">
                    <p className={`${display} text-3xl leading-none text-[#FF4D00]`}>06:59</p>
                    <p className="mt-1 text-[11px] font-bold tracking-[0.2em] text-white/60 uppercase">Abre el box</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${wrap} relative pb-14 md:pb-20`}>
              <dl className="grid grid-cols-2 border-t border-white/15 md:grid-cols-4">
                {[
                  ["+1.200", "socios entrenando"],
                  ["12", "personas máx. por clase"],
                  ["50'", "de clase, sin relleno"],
                  ["4,9", "de 5 en 380 reseñas"],
                ].map(([n, t], i) => (
                  <div
                    key={t}
                    className={`pt-6 pb-2 ${i % 2 === 1 ? "pl-5 md:pl-8" : "pr-5 md:pr-8"} ${i > 0 ? "md:border-l md:border-white/15 md:pl-8" : ""} ${
                      i % 2 === 1 ? "border-l border-white/15" : ""
                    } ${i >= 2 ? "mt-4 md:mt-0" : ""}`}
                  >
                    <dt className="sr-only">{t}</dt>
                    <dd className={`${display} text-5xl leading-none md:text-6xl`}>{n}</dd>
                    <dd className="mt-2 text-sm text-white/55">{t}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <Marquesina />

          {/* DISCIPLINAS */}
          <section id="disciplinas" aria-labelledby="disc-titulo" className="scroll-mt-16 py-24 md:py-32">
            <div className={wrap}>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-7">
                  <Eyebrow n="01">Disciplinas</Eyebrow>
                  <h2 id="disc-titulo" className={`${display} mt-5 text-[clamp(3rem,9vw,6.5rem)] leading-[0.9] uppercase`}>
                    Cuatro formas de <span className="text-[#FF4D00]">salir transpirado.</span>
                  </h2>
                </div>
                <p className="max-w-md text-lg leading-relaxed text-white/65 lg:col-span-5 lg:justify-self-end">
                  Todas se adaptan a tu nivel. Combinalas como quieras con cualquier plan: la mayoría de nuestros socios hace
                  funcional y suma una de movilidad.
                </p>
              </div>
              <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {disciplinas.map((d, i) => (
                  <li key={d.id}>
                    <article className="group relative grid h-full grid-cols-[40%_1fr] overflow-hidden border border-white/10 bg-[#111] transition-[transform,border-color] duration-300 focus-within:border-[#FF4D00] hover:-translate-y-1.5 hover:border-[#FF4D00] sm:flex sm:flex-col">
                      <div className="relative min-h-full overflow-hidden sm:aspect-[4/5] sm:min-h-0">
                        <Image
                          src={d.imagen}
                          alt={d.alt}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] motion-reduce:transition-none"
                        />
                        <span className={`${display} absolute top-2 left-3 text-4xl sm:top-3 sm:left-4 sm:text-6xl`} style={{ color: d.tinta }}>
                          0{i + 1}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-5 sm:p-6">
                        <h3 className={`${display} text-3xl uppercase sm:text-4xl`}>{d.nombre}</h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-white/65 sm:mt-3 sm:text-[15px]">{d.bajada}</p>
                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4 sm:mt-6 sm:pt-5">
                          <Intensidad valor={d.intensidad} />
                        </div>
                        <div className="mt-4 sm:mt-5">
                          <VerHorarios disciplina={d.id} nombre={d.nombre} />
                        </div>
                      </div>
                      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#FF4D00] transition-transform duration-500 group-hover:scale-x-100" />
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* HORARIOS */}
          <section id="horarios" aria-labelledby="hor-titulo" className="scroll-mt-16 border-y border-white/10 bg-[#0F0F0F] py-24 md:py-32">
            <div className={wrap}>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-8">
                  <Eyebrow n="02">Horarios</Eyebrow>
                  <h2 id="hor-titulo" className={`${display} mt-5 text-[clamp(3rem,9vw,6.5rem)] leading-[0.9] uppercase`}>
                    Vos elegís la hora. <span className="text-[#FF4D00]">Nosotros la barra.</span>
                  </h2>
                </div>
                <p className="max-w-sm text-lg leading-relaxed text-white/65 lg:col-span-4 lg:justify-self-end">
                  De lunes a sábado, desde las 7. Filtrá por disciplina y tocá una clase para reservarla.
                </p>
              </div>
              <div className="mt-12">
                <Horarios />
              </div>
            </div>
          </section>

          {/* COACHES */}
          <section id="coaches" aria-labelledby="coach-titulo" className="scroll-mt-16 py-24 md:py-32">
            <div className={wrap}>
              <Eyebrow n="03">Coaches</Eyebrow>
              <h2 id="coach-titulo" className={`${display} mt-5 max-w-4xl text-[clamp(3rem,9vw,6.5rem)] leading-[0.9] uppercase`}>
                Te conocen por tu nombre. <span className="text-[#FF4D00]">Y por tus marcas.</span>
              </h2>
              <ul className="mt-14 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-4 sm:gap-y-12 lg:grid-cols-4">
                {coaches.map((c) => (
                  <li key={c.id} className="group">
                    <div className="relative aspect-[4/5] overflow-hidden border border-white/10">
                      <Image
                        src={c.imagen}
                        alt={c.alt}
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
                      />
                    </div>
                    <h3 className={`${display} mt-4 text-2xl leading-none uppercase sm:mt-5 sm:text-3xl`}>{c.nombre}</h3>
                    <p className="mt-2 text-xs font-bold tracking-[0.14em] text-[#FF6A2B] uppercase sm:text-sm">{c.rol}</p>
                    <ul className="mt-4 space-y-1.5 text-[13px] text-white/60 sm:text-sm">
                      {c.certificaciones.map((cert) => (
                        <li key={cert} className="flex items-start gap-2">
                          <Icono nombre="check" grosor={2.6} cuadrado className="mt-0.5 size-4 shrink-0 text-[#FF4D00]" />
                          {cert}
                        </li>
                      ))}
                    </ul>
                    <blockquote className="mt-5 hidden border-l-2 border-white/20 pl-4 text-[15px] text-white/80 italic sm:block">“{c.frase}”</blockquote>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* PLANES */}
          <section id="planes" aria-labelledby="planes-titulo" className="relative scroll-mt-16 overflow-hidden bg-[#F2EEE6] py-24 text-[#0A0A0A] md:py-32">
            <div className={wrap}>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-7">
                  <p className="flex items-center gap-3 text-xs font-bold tracking-[0.28em] text-[#C23A00] uppercase">
                    <span className="bg-[#0A0A0A] px-1.5 py-0.5 text-[#F2EEE6]">04</span>
                    Planes
                  </p>
                  <h2 id="planes-titulo" className={`${display} mt-5 text-[clamp(3rem,9vw,6.5rem)] leading-[0.9] uppercase`}>
                    Sin matrícula. <br className="hidden sm:block" />
                    Sin letra chica.
                  </h2>
                </div>
                <p className="max-w-sm text-lg leading-relaxed text-black/65 lg:col-span-5 lg:justify-self-end">
                  Pagás mes a mes y cambiás de plan cuando quieras. Pagando tres meses juntos, 10 % de descuento.
                </p>
              </div>
              <ul className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
                {planes.map((p) => (
                  <li
                    key={p.nombre}
                    className={`relative flex flex-col p-8 md:p-10 ${
                      p.destacado ? "bg-[#0A0A0A] text-[#F2EEE6] lg:-my-4 lg:py-14" : "border-2 border-[#0A0A0A] bg-transparent"
                    }`}
                  >
                    {p.destacado && (
                      <span className="absolute -top-3.5 left-8 bg-[#FF4D00] px-3 py-1.5 text-xs font-bold tracking-[0.2em] text-black uppercase md:left-10 lg:top-0">
                        El más elegido
                      </span>
                    )}
                    <h3 className={`${display} text-4xl uppercase`}>{p.nombre}</h3>
                    <p className={`mt-1 text-sm font-semibold ${p.destacado ? "text-white/60" : "text-black/60"}`}>{p.frecuencia}</p>
                    <p className="mt-8 flex items-baseline gap-2">
                      <span className={`${display} text-6xl leading-none tabular-nums md:text-7xl`}>{precioARS(p.precio)}</span>
                      <span className={`text-sm font-semibold ${p.destacado ? "text-white/60" : "text-black/60"}`}>/mes</span>
                    </p>
                    <ul className={`mt-8 flex-1 space-y-3 border-t pt-8 ${p.destacado ? "border-white/15" : "border-black/15"}`}>
                      {p.incluye.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-[15px]">
                          <span
                            className={`mt-0.5 flex size-5 shrink-0 items-center justify-center ${
                              p.destacado ? "bg-[#FF4D00] text-black" : "bg-[#0A0A0A] text-[#F2EEE6]"
                            }`}
                          >
                            <Icono nombre="check" grosor={3.2} cuadrado className="size-3.5" />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#reserva"
                      className={`mt-10 inline-flex items-center justify-between gap-3 px-6 py-4 text-sm font-bold tracking-wide uppercase transition-colors ${
                        p.destacado
                          ? "bg-[#FF4D00] text-black hover:bg-[#FF6A2B]"
                          : "bg-[#0A0A0A] text-[#F2EEE6] hover:bg-[#FF4D00] hover:text-black"
                      }`}
                    >
                      Probar gratis
                      <Icono nombre="flecha" grosor={2.6} cuadrado className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-10 text-sm text-black/55">Precios de ejemplo en pesos argentinos. Contenido ficticio.</p>
            </div>
          </section>

          {/* TESTIMONIOS */}
          <section aria-labelledby="test-titulo" className="py-24 md:py-32">
            <div className={wrap}>
              <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <Eyebrow n="05">Socios</Eyebrow>
                  <h2 id="test-titulo" className={`${display} mt-5 text-[clamp(3rem,9vw,6.5rem)] leading-[0.9] uppercase`}>
                    Lo dicen ellos.
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`${display} text-7xl leading-none text-[#FF4D00]`}>4,9</span>
                  <span>
                    <span className="flex gap-0.5 text-[#FF4D00]" role="img" aria-label="5 estrellas">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Icono key={i} nombre="estrella" relleno grosor={0} className="size-5" />
                      ))}
                    </span>
                    <span className="mt-1 block text-sm text-white/55">Promedio de 380 reseñas</span>
                  </span>
                </div>
              </div>
              <ul className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-3">
                {testimonios.map((t) => (
                  <li key={t.nombre} className="flex flex-col border-t-4 border-[#FF4D00] bg-[#131313] p-8">
                    <p className={`${display} text-5xl leading-none text-[#FF4D00] uppercase`}>{t.marca}</p>
                    <blockquote className="mt-6 flex-1 text-lg leading-relaxed text-white/85">“{t.texto}”</blockquote>
                    <p className="mt-8 flex items-center gap-3 border-t border-white/10 pt-5">
                      <span className={`${display} flex size-11 items-center justify-center bg-[#F2EEE6] text-xl text-black`} aria-hidden="true">
                        {t.nombre[0]}
                      </span>
                      <span>
                        <span className="block font-semibold">{t.nombre}</span>
                        <span className="block text-sm text-white/50">{t.dato}</span>
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* RESERVA */}
          <section id="reserva" aria-labelledby="reserva-titulo" className="scroll-mt-16 border-t border-white/10 bg-[#0F0F0F] py-24 md:py-32">
            <div className={`${wrap} grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10`}>
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-28">
                  <Eyebrow n="06">Clase de prueba</Eyebrow>
                  <h2 id="reserva-titulo" className={`${display} mt-5 text-[clamp(3rem,9vw,6.5rem)] leading-[0.9] uppercase`}>
                    La primera <span className="text-[#FF4D00]">va por la casa.</span>
                  </h2>
                  <p className="mt-6 max-w-md text-lg leading-relaxed text-white/65">
                    Elegí día y horario, y te confirmamos por WhatsApp. Si no te convence, no pasa nada: no te pedimos tarjeta.
                  </p>
                  <ul className="mt-10 space-y-5">
                    {[
                      ["reloj", "Llegá 10 minutos antes", "Te mostramos el box y hacemos una evaluación corta."],
                      ["usuario", "Ropa cómoda y zapatillas planas", "Toalla y botella de agua. El resto lo ponemos nosotros."],
                      ["escudo", "A tu ritmo, sin exigencias", "El coach adapta cada ejercicio a tu nivel."],
                    ].map(([icono, t, d]) => (
                      <li key={t} className="flex gap-4">
                        <span className="flex size-11 shrink-0 items-center justify-center border border-white/20 text-[#FF4D00]">
                          <Icono nombre={icono as "reloj"} grosor={2.2} cuadrado className="size-5" />
                        </span>
                        <span>
                          <span className="block font-semibold">{t}</span>
                          <span className="block text-sm text-white/55">{d}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="lg:col-span-7">
                <div className="border border-white/10 bg-[#0A0A0A] p-6 sm:p-10">
                  <FormularioPrueba />
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="preguntas" aria-labelledby="faq-titulo" className="scroll-mt-16 py-24 md:py-32">
            <div className={`${wrap} grid grid-cols-1 gap-10 lg:grid-cols-12`}>
              <div className="lg:col-span-4">
                <Eyebrow n="07">Preguntas</Eyebrow>
                <h2 id="faq-titulo" className={`${display} mt-5 text-[clamp(3rem,9vw,5.5rem)] leading-[0.9] uppercase`}>
                  Antes de venir.
                </h2>
                <p className="mt-6 text-white/60">¿Te quedó otra duda? Escribinos desde el formulario y te respondemos en el día.</p>
              </div>
              <div className="border-t border-white/15 lg:col-span-8">
                {faqs.map((f) => (
                  <details key={f.p} className="group border-b border-white/15 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-semibold transition-colors hover:text-[#FF6A2B] md:text-xl">
                      {f.p}
                      <span className="flex size-9 shrink-0 items-center justify-center border border-white/20 transition-[transform,background-color,color] duration-300 group-open:rotate-45 group-open:border-[#FF4D00] group-open:bg-[#FF4D00] group-open:text-black">
                        <Icono nombre="mas" grosor={2.6} cuadrado className="size-4" />
                      </span>
                    </summary>
                    <p className="max-w-2xl pb-7 leading-relaxed text-white/65">{f.r}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* CTA FINAL */}
          <section aria-labelledby="cta-titulo" className="relative overflow-hidden border-y-2 border-[#FF4D00]">
            <Image src={`${IMG}/textura-diagonal.webp`} alt="" fill sizes="100vw" className="object-cover" />
            <div className={`${wrap} relative flex flex-col items-start gap-10 py-24 md:py-32 lg:flex-row lg:items-end lg:justify-between`}>
              <h2 id="cta-titulo" className={`${display} text-[clamp(3.6rem,13vw,10rem)] leading-[0.84] uppercase`}>
                Nos vemos
                <br />
                <span className="text-[#FF4D00]">en el box.</span>
              </h2>
              <a
                href="#reserva"
                className="group inline-flex shrink-0 items-center gap-3 bg-[#FF4D00] px-7 py-5 text-base font-bold tracking-wide text-black uppercase shadow-[6px_6px_0_#F2EEE6] transition-[transform,box-shadow,background-color] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#FF6A2B] hover:shadow-[9px_9px_0_#F2EEE6]"
              >
                Reservá tu clase de prueba
                <Icono nombre="flecha" grosor={2.6} cuadrado className="size-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </section>
        </main>

        <footer className="pt-20">
          <div className={`${wrap} grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12`}>
            <div className="lg:col-span-4">
              <Logo />
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
                Box de entrenamiento funcional, halterofilia, HIIT y movilidad. Barrio Norte, Córdoba.
              </p>
            </div>
            <div className="lg:col-span-3">
              <h3 className="text-xs font-bold tracking-[0.25em] text-white/60 uppercase">Dónde</h3>
              <p className="mt-4 flex gap-3 text-sm text-white/75">
                <Icono nombre="pin" grosor={2} className="size-5 shrink-0 text-[#FF4D00]" />
                Pasaje Los Algarrobos 1180
                <br />
                Barrio Norte, Córdoba
              </p>
            </div>
            <div className="lg:col-span-3">
              <h3 className="text-xs font-bold tracking-[0.25em] text-white/60 uppercase">Box abierto</h3>
              <dl className="mt-4 space-y-1.5 text-sm text-white/75">
                <div className="flex justify-between gap-6">
                  <dt>Lunes a viernes</dt>
                  <dd className="tabular-nums">7 a 22 h</dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt>Sábados</dt>
                  <dd className="tabular-nums">8 a 14 h</dd>
                </div>
                <div className="flex justify-between gap-6 text-white/60">
                  <dt>Domingos</dt>
                  <dd>Descanso</dd>
                </div>
              </dl>
            </div>
            <div className="lg:col-span-2">
              <h3 className="text-xs font-bold tracking-[0.25em] text-white/60 uppercase">Seguinos</h3>
              <p className="mt-4 flex items-center gap-2 text-sm text-white/75">
                <Icono nombre="camara" grosor={2} className="size-5 text-[#FF4D00]" />
                @fuerzanorte.box
              </p>
            </div>
          </div>
          <div className={`${wrap} mt-16`}>
            {/* Marca de agua decorativa: el texto va en un pseudo-elemento para que no cuente como contenido. */}
            <p
              aria-hidden="true"
              data-marca="Fuerza Norte"
              className={`${display} text-center text-[15.5vw] leading-[0.8] whitespace-nowrap text-white/[0.06] uppercase select-none before:content-[attr(data-marca)] xl:text-[13.2rem]`}
            />
          </div>
          <div className="border-t border-white/10">
            <div className={`${wrap} flex flex-col gap-2 py-6 text-xs text-white/60 sm:flex-row sm:justify-between`}>
              <p>© 2026 Fuerza Norte. Demo con contenido ficticio.</p>
              <p>Diseño y desarrollo: Francisco Zago</p>
            </div>
          </div>
        </footer>
      </ReservaProvider>

      <DemoBar
        estilo="Impacto"
        mensaje="Hola Fran, vi la demo Impacto y quiero algo así para mi negocio."
        otrosHref="/demos/landing"
        pregunta="¿Querés uno así?"
      />
    </div>
  );
}
