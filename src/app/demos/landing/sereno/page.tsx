import Image from "next/image";
import { DemoBar } from "@/components/demos/DemoBar";
import { Icono } from "@/demos/landing/shared/Icono";
import { AntesDespues } from "@/demos/landing/sereno/AntesDespues";
import { Carrusel } from "@/demos/landing/sereno/Carrusel";
import { equipo, IMG, pasos } from "@/demos/landing/sereno/datos";
import { Encabezado, Logo } from "@/demos/landing/sereno/Encabezado";
import { FormularioTurno } from "@/demos/landing/sereno/FormularioTurno";
import { Mapa } from "@/demos/landing/sereno/Mapa";
import { Tratamientos } from "@/demos/landing/sereno/Tratamientos";
import { TurnoProvider } from "@/demos/landing/sereno/Turno";

const serif = "[font-family:var(--font-ac-serif)]";
const sans = "[font-family:var(--font-ac-sans)]";
const wrap = "mx-auto w-full max-w-[1240px] px-5 sm:px-8";

const estilos = `
@keyframes ac-aparecer { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
@keyframes ac-flotar { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
.ac-aparecer { animation: ac-aparecer .6s cubic-bezier(.2,.7,.2,1) both }
.ac-entrada { animation: ac-aparecer 1.1s cubic-bezier(.2,.7,.2,1) both }
.ac-flotar { animation: ac-flotar 7s ease-in-out infinite }
@media (prefers-reduced-motion: reduce) { .ac-aparecer, .ac-entrada, .ac-flotar { animation: none } }`;

function Rotulo({ n, children, claro = false }: { n: string; children: React.ReactNode; claro?: boolean }) {
  return (
    <p className={`flex items-center gap-3 text-sm ${claro ? "text-[#F6F4EE]/70" : "text-[#3E4C43]/80"}`}>
      <span className={`${serif} italic ${claro ? "text-[#C3B6CF]" : "text-[#6E5D84]"}`}>{n}</span>
      <span aria-hidden="true" className={`h-px w-8 ${claro ? "bg-[#F6F4EE]/30" : "bg-[#3E4C43]/25"}`} />
      {children}
    </p>
  );
}

export default function SerenoDemo() {
  return (
    <div
      className={`min-h-dvh overflow-x-clip bg-[#F6F4EE] pb-28 text-[#26302A] ${sans} font-light antialiased selection:bg-[#C3B6CF] selection:text-[#26302A]`}
      style={{ "--color-accent": "#6E5D84" } as React.CSSProperties}
    >
      <style>{estilos}</style>
      <TurnoProvider>
        <Encabezado />

        <main>
          {/* HERO */}
          <section id="inicio" aria-labelledby="ac-hero" className="relative -mt-[72px] pt-[72px]">
            <div aria-hidden="true" className="pointer-events-none absolute -top-32 -left-40 size-[34rem] rounded-full bg-[#DCE2D6] blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute top-40 right-[-12rem] size-[30rem] rounded-full bg-[#E9E3EF] blur-3xl" />
            <div className={`${wrap} relative grid grid-cols-1 items-center gap-14 pt-10 pb-20 md:pt-16 lg:grid-cols-12 lg:gap-10 lg:pb-28`}>
              <div className="ac-entrada lg:col-span-6">
                <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm text-[#3E4C43] ring-1 ring-[#3E4C43]/10">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-[#8F7FA3]" />
                  Estética y bienestar · Nueva Córdoba
                </p>
                <h1 id="ac-hero" className={`${serif} mt-8 text-[clamp(3.3rem,9.5vw,6.6rem)] leading-[0.98] font-light tracking-[-0.025em] text-[#26302A]`}>
                  El tiempo,
                  <br />
                  <em className="font-light text-[#6E5D84]">de vuelta</em> para vos.
                </h1>
                <p className="mt-8 max-w-md text-lg leading-relaxed text-[#3E4C43]/85">
                  Tratamientos faciales y corporales pensados para tu piel, en un espacio donde nadie te apura. Profesionales
                  matriculadas y productos dermatológicos.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
                  <a
                    href="#turno"
                    className="group inline-flex items-center gap-3 rounded-full bg-[#3E4C43] py-2 pr-2 pl-7 text-[#F6F4EE] transition-colors duration-300 hover:bg-[#26302A]"
                  >
                    Pedí tu turno
                    <span className="flex size-10 items-center justify-center rounded-full bg-[#F6F4EE] text-[#3E4C43] transition-transform duration-500 group-hover:rotate-[-45deg]">
                      <Icono nombre="flecha" grosor={1.4} className="size-4" />
                    </span>
                  </a>
                  <a href="#tratamientos" className="text-[#3E4C43] underline decoration-[#3E4C43]/30 underline-offset-[6px] transition-colors hover:decoration-[#3E4C43]">
                    Ver tratamientos
                  </a>
                </div>
                <div className="mt-12 flex items-center gap-4">
                  <span className="flex -space-x-2" aria-hidden="true">
                    {[
                      ["M", "#DCE2D6"],
                      ["C", "#E9E3EF"],
                      ["E", "#EDE3D6"],
                    ].map(([l, bg]) => (
                      <span key={l} className={`${serif} flex size-10 items-center justify-center rounded-full text-[#3E4C43] italic ring-2 ring-[#F6F4EE]`} style={{ backgroundColor: bg }}>
                        {l}
                      </span>
                    ))}
                  </span>
                  <p className="text-sm leading-snug text-[#3E4C43]/80">
                    <span className="font-medium text-[#26302A]">4,9 de 5</span> en 210 opiniones
                    <br />
                    de clientas y clientes reales*
                  </p>
                </div>
              </div>

              <div className="relative lg:col-span-6">
                <div className="ac-entrada relative mx-auto aspect-[4/5] w-full max-w-[500px] overflow-hidden rounded-t-[999px] rounded-b-[36px] shadow-[0_40px_80px_-50px_rgba(38,48,42,0.55)]" style={{ animationDelay: "0.15s" }}>
                  <Image
                    src={`${IMG}/hero-retrato-calma.webp`}
                    alt="Mujer con los ojos cerrados y vincha blanca mientras le aplican una máscara facial con pincel"
                    fill
                    priority
                    sizes="(min-width: 1024px) 500px, 90vw"
                    className="object-cover"
                  />
                </div>
                <div className="ac-flotar absolute bottom-10 left-0 max-w-[15rem] rounded-3xl bg-[#F6F4EE]/90 p-4 shadow-[0_20px_50px_-24px_rgba(38,48,42,0.5)] ring-1 ring-[#3E4C43]/10 backdrop-blur-md sm:left-2 lg:-left-6">
                  <p className="flex items-center gap-2 text-xs tracking-[0.14em] text-[#3E4C43]/80 uppercase">
                    <span className="relative flex size-2">
                      <span className="absolute inset-0 rounded-full bg-[#7F8F7A] motion-safe:animate-ping" />
                      <span className="relative size-2 rounded-full bg-[#7F8F7A]" />
                    </span>
                    Próximo turno libre
                  </p>
                  <p className={`${serif} mt-1.5 text-xl text-[#26302A]`}>Jueves, 10:30</p>
                  <p className="text-sm text-[#3E4C43]/80">Limpieza facial profunda</p>
                </div>
                <div aria-hidden="true" className={`${serif} absolute top-6 right-2 flex size-24 flex-col items-center justify-center rounded-full bg-[#C3B6CF] text-center text-[#26302A] sm:right-6 lg:-right-2`}>
                  <span className="text-xs tracking-[0.2em] uppercase [font-family:var(--font-ac-sans)]">desde</span>
                  <span className="text-2xl italic">2014</span>
                </div>
              </div>
            </div>
          </section>

          {/* VALORES */}
          <section aria-label="Por qué elegirnos" className={`${wrap}`}>
            <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-[28px] bg-[#3E4C43]/10 sm:grid-cols-3">
              {[
                ["hoja", "Productos dermatológicos", "Activos testeados, fragancias suaves y fórmulas para piel sensible."],
                ["escudo", "Profesionales matriculadas", "Cosmiatras, masoterapeutas y una dermatóloga que supervisa."],
                ["gota", "Protocolos a tu medida", "Nada de paquetes cerrados: ajustamos cada sesión a tu piel."],
              ].map(([icono, t, d]) => (
                <li key={t} className="flex gap-4 bg-[#F6F4EE] p-6 sm:flex-col sm:p-8">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#E5E9E1] text-[#3E4C43]">
                    <Icono nombre={icono as "hoja"} grosor={1.25} className="size-6" />
                  </span>
                  <span>
                    <span className={`${serif} block text-xl text-[#26302A]`}>{t}</span>
                    <span className="mt-1.5 block text-[15px] leading-relaxed text-[#3E4C43]/80">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* TRATAMIENTOS */}
          <section id="tratamientos" aria-labelledby="ac-trat" className="scroll-mt-20 py-24 md:py-32">
            <div className={wrap}>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-7">
                  <Rotulo n="01">Tratamientos</Rotulo>
                  <h2 id="ac-trat" className={`${serif} mt-6 text-[clamp(2.5rem,6vw,4.4rem)] leading-[1.02] font-light tracking-[-0.02em]`}>
                    Elegí lo que tu piel <em className="text-[#6E5D84]">necesita hoy.</em>
                  </h2>
                </div>
                <p className="max-w-sm text-[17px] leading-relaxed text-[#3E4C43]/80 lg:col-span-5 lg:justify-self-end">
                  Filtrá por tipo y por el tiempo que tenés. Si no sabés por dónde empezar, la primera consulta es sin cargo.
                </p>
              </div>
              <div className="mt-12">
                <Tratamientos />
              </div>
            </div>
          </section>

          {/* RESULTADOS */}
          <section id="resultados" aria-labelledby="ac-res" className="scroll-mt-20 px-3 sm:px-5">
            <div className="relative overflow-hidden rounded-[40px] bg-[#3E4C43] py-20 text-[#F6F4EE] md:py-28">
              <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full border border-[#F6F4EE]/10" />
              <div aria-hidden="true" className="pointer-events-none absolute -top-10 -right-10 size-52 rounded-full border border-[#F6F4EE]/10" />
              <div className={wrap}>
                <Rotulo n="02" claro>
                  Resultados
                </Rotulo>
                <h2 id="ac-res" className={`${serif} mt-6 max-w-3xl text-[clamp(2.5rem,6vw,4.4rem)] leading-[1.02] font-light tracking-[-0.02em]`}>
                  Cambios que se notan, <em className="text-[#C3B6CF]">sin exagerar.</em>
                </h2>
                <div className="mt-14">
                  <AntesDespues />
                </div>
              </div>
            </div>
          </section>

          {/* EQUIPO */}
          <section id="equipo" aria-labelledby="ac-eq" className="scroll-mt-20 py-24 md:py-32">
            <div className={wrap}>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-7">
                  <Rotulo n="03">El equipo</Rotulo>
                  <h2 id="ac-eq" className={`${serif} mt-6 text-[clamp(2.5rem,6vw,4.4rem)] leading-[1.02] font-light tracking-[-0.02em]`}>
                    Manos expertas, <em className="text-[#6E5D84]">trato cercano.</em>
                  </h2>
                </div>
                <p className="max-w-sm text-[17px] leading-relaxed text-[#3E4C43]/80 lg:col-span-5 lg:justify-self-end">
                  Somos tres, y nos gusta que sea así: te atiende siempre la misma persona y conoce tu historia.
                </p>
              </div>
              <ul className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {equipo.map((p, n) => (
                  <li key={p.nombre} className={`group ${n === 1 ? "lg:mt-16" : ""}`}>
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[28px]">
                      <Image
                        src={p.imagen}
                        alt={p.alt}
                        fill
                        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                      />
                    </div>
                    <div className="mt-6 flex items-baseline justify-between gap-4">
                      <h3 className={`${serif} text-2xl text-[#26302A]`}>{p.nombre}</h3>
                      <span className="shrink-0 text-xs tracking-wide text-[#3E4C43]/80">{p.matricula}</span>
                    </div>
                    <p className="mt-1 text-sm tracking-[0.12em] text-[#6E5D84] uppercase">{p.rol}</p>
                    <p className="mt-3 text-[15px] leading-relaxed text-[#3E4C43]/80">{p.bio}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* EXPERIENCIA */}
          <section id="experiencia" aria-labelledby="ac-exp" className="scroll-mt-20 bg-[#E5E9E1]/60 py-24 md:py-32">
            <div className={`${wrap} grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-center lg:gap-16`}>
              <div className="lg:col-span-6">
                <div className="relative aspect-[7/5] overflow-hidden rounded-[32px]">
                  <Image
                    src={`${IMG}/espacio-cabina.webp`}
                    alt="Salón luminoso con sillones rosa viejo frente a un espejo largo y cuadros en la pared"
                    fill
                    sizes="(min-width: 1024px) 600px, 100vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-4 text-sm text-[#3E4C43]/80">Cabinas privadas con luz natural, calefacción y ducha.</p>
              </div>
              <div className="lg:col-span-6">
                <Rotulo n="04">La experiencia</Rotulo>
                <h2 id="ac-exp" className={`${serif} mt-6 text-[clamp(2.5rem,6vw,4.4rem)] leading-[1.02] font-light tracking-[-0.02em]`}>
                  Cómo es <em className="text-[#6E5D84]">venir a vernos.</em>
                </h2>
                <ol className="mt-10">
                  {pasos.map((p, n) => (
                    <li key={p.titulo} className="relative grid grid-cols-[3.25rem_1fr] gap-4 pb-8 last:pb-0">
                      {n < pasos.length - 1 && <span aria-hidden="true" className="absolute top-12 bottom-1 left-[1.6rem] w-px bg-[#3E4C43]/15" />}
                      <span className={`${serif} flex size-[3.25rem] items-center justify-center rounded-full bg-[#F6F4EE] text-lg text-[#6E5D84] italic ring-1 ring-[#3E4C43]/10`}>
                        {["i", "ii", "iii", "iv"][n]}
                      </span>
                      <div className="pt-2.5">
                        <h3 className={`${serif} text-xl text-[#26302A]`}>{p.titulo}</h3>
                        <p className="mt-1.5 text-[15px] leading-relaxed text-[#3E4C43]/80">{p.texto}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* TESTIMONIOS */}
          <section aria-labelledby="ac-test" className="py-24 md:py-32">
            <div className={`${wrap} grid grid-cols-1 gap-12 lg:grid-cols-12`}>
              <div className="lg:col-span-4">
                <Rotulo n="05">Opiniones</Rotulo>
                <h2 id="ac-test" className={`${serif} mt-6 text-[clamp(2.5rem,5vw,3.6rem)] leading-[1.05] font-light tracking-[-0.02em]`}>
                  Lo que dicen <em className="text-[#6E5D84]">quienes vienen.</em>
                </h2>
                <p className="mt-6 flex items-center gap-2 text-[#3E4C43]">
                  <span className="flex text-[#8F7FA3]" role="img" aria-label="5 de 5 estrellas">
                    {[0, 1, 2, 3, 4].map((k) => (
                      <Icono key={k} nombre="estrella" relleno grosor={0} className="size-4" />
                    ))}
                  </span>
                  4,9 · 210 opiniones
                </p>
              </div>
              <div className="lg:col-span-8">
                <Carrusel />
              </div>
            </div>
          </section>

          {/* TURNO */}
          <section id="turno" aria-labelledby="ac-turno" className="scroll-mt-20 px-3 sm:px-5">
            <div className="rounded-[40px] bg-[#E9E3EF]/70 py-20 md:py-28">
              <div className={`${wrap} grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14`}>
                <div className="lg:col-span-5">
                  <Rotulo n="06">Turnos online</Rotulo>
                  <h2 id="ac-turno" className={`${serif} mt-6 text-[clamp(2.5rem,6vw,4.4rem)] leading-[1.02] font-light tracking-[-0.02em]`}>
                    Reservá tu <em className="text-[#6E5D84]">momento.</em>
                  </h2>
                  <p className="mt-6 max-w-sm text-[17px] leading-relaxed text-[#3E4C43]/85">
                    Elegí tratamiento, día y horario. Te confirmamos por mensaje y te recordamos el turno el día anterior.
                  </p>
                  <ul className="mt-10 space-y-4 text-[15px] text-[#3E4C43]">
                    {[
                      ["reloj", "Llegá 10 minutos antes para relajarte con un té."],
                      ["calendario", "Podés reprogramar sin costo hasta 24 h antes."],
                      ["chispa", "La primera visita incluye consulta sin cargo."],
                    ].map(([i, t]) => (
                      <li key={t} className="flex items-start gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F6F4EE] text-[#6E5D84]">
                          <Icono nombre={i as "reloj"} grosor={1.3} className="size-[18px]" />
                        </span>
                        <span className="pt-1.5">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:col-span-7">
                  <div className="rounded-[32px] bg-[#F6F4EE] p-6 shadow-[0_30px_80px_-50px_rgba(62,76,67,0.6)] sm:p-10">
                    <FormularioTurno />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* UBICACIÓN */}
          <section id="ubicacion" aria-labelledby="ac-ubi" className="scroll-mt-20 py-24 md:py-32">
            <div className={`${wrap} grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center`}>
              <div className="lg:col-span-7">
                <Mapa />
              </div>
              <div className="lg:col-span-5 lg:pl-6">
                <Rotulo n="07">Ubicación</Rotulo>
                <h2 id="ac-ubi" className={`${serif} mt-6 text-[clamp(2.5rem,5vw,3.6rem)] leading-[1.05] font-light tracking-[-0.02em]`}>
                  Frente a la plaza, <em className="text-[#6E5D84]">lejos del ruido.</em>
                </h2>
                <dl className="mt-10 space-y-6 text-[15px]">
                  <div className="flex gap-4">
                    <dt className="w-24 shrink-0 text-[#3E4C43]/80">Dirección</dt>
                    <dd className="text-[#26302A]">
                      Calle de los Tilos 245
                      <br />
                      Nueva Córdoba, Córdoba
                    </dd>
                  </div>
                  <div className="flex gap-4">
                    <dt className="w-24 shrink-0 text-[#3E4C43]/80">Horarios</dt>
                    <dd className="text-[#26302A]">
                      Lunes a viernes, 9 a 20 h
                      <br />
                      Sábados, 9 a 14 h
                    </dd>
                  </div>
                  <div className="flex gap-4">
                    <dt className="w-24 shrink-0 text-[#3E4C43]/80">Cómo llegar</dt>
                    <dd className="text-[#26302A]">
                      Parada de colectivo sobre Av. Las Acacias. Estacionamiento a media cuadra.
                    </dd>
                  </div>
                  <div className="flex gap-4">
                    <dt className="w-24 shrink-0 text-[#3E4C43]/80">Accesible</dt>
                    <dd className="text-[#26302A]">Planta baja, sin escalones y con baño adaptado.</dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-[#3E4C43]/10 pt-20">
          <div className={`${wrap} grid grid-cols-1 gap-12 md:grid-cols-12`}>
            <div className="md:col-span-5">
              <Logo />
              <p className={`${serif} mt-6 max-w-sm text-2xl leading-snug font-light text-[#3E4C43]`}>
                Un lugar para <em className="text-[#6E5D84]">bajar un cambio</em> y cuidarte sin culpa.
              </p>
            </div>
            <nav aria-label="Pie de página" className="md:col-span-3">
              <h3 className="text-xs tracking-[0.18em] text-[#3E4C43]/80 uppercase">Explorá</h3>
              <ul className="mt-4 space-y-2 text-[15px]">
                {[
                  ["#tratamientos", "Tratamientos"],
                  ["#resultados", "Resultados"],
                  ["#equipo", "Equipo"],
                  ["#turno", "Pedí tu turno"],
                ].map(([h, l]) => (
                  <li key={h}>
                    <a href={h} className="text-[#26302A] underline-offset-4 hover:underline">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="md:col-span-4">
              <h3 className="text-xs tracking-[0.18em] text-[#3E4C43]/80 uppercase">Seguinos</h3>
              <p className="mt-4 flex items-center gap-2 text-[15px] text-[#26302A]">
                <Icono nombre="camara" grosor={1.3} className="size-5 text-[#6E5D84]" />
                @almaclara.estetica
              </p>
              <p className="mt-6 text-sm leading-relaxed text-[#3E4C43]/80">
                *Opiniones, profesionales, precios y matrículas son ficticios.
              </p>
            </div>
          </div>
          <div className={`${wrap} mt-16 flex flex-col gap-2 border-t border-[#3E4C43]/10 py-6 text-sm text-[#3E4C43]/80 sm:flex-row sm:justify-between`}>
            <p>© 2026 Alma Clara. Demo con contenido ficticio.</p>
            <p>Diseño y desarrollo: Francisco Zago</p>
          </div>
        </footer>
      </TurnoProvider>

      <DemoBar
        estilo="Sereno"
        mensaje="Hola Fran, vi la demo Sereno y quiero algo así para mi negocio."
        otrosHref="/demos/landing"
        pregunta="¿Querés uno así?"
      />
    </div>
  );
}
