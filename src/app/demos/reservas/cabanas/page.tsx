import Image from "next/image";
import { DemoBar } from "@/components/demos/DemoBar";
import { MisReservas, VerDisponibilidad } from "@/demos/reservas/cabanas/Cliente";
import { actividades, cabanas, comodidades, complejo, galeria, resenas } from "@/demos/reservas/cabanas/datos";
import { Reserva } from "@/demos/reservas/cabanas/Reserva";
import { pesos } from "@/demos/reservas/shared/fechas";
import {
  IconoAuto,
  IconoCafe,
  IconoCama,
  IconoEstrella,
  IconoFlecha,
  IconoFuego,
  IconoMascota,
  IconoPersonas,
  IconoPileta,
  IconoUbicacion,
  IconoWifi,
} from "@/demos/reservas/shared/Iconos";

const serif = "[font-family:var(--font-am-serif)] [font-variation-settings:'SOFT'_100]";
const sans = "[font-family:var(--font-am-sans)]";
const iconosComodidades = [IconoCafe, IconoPileta, IconoFuego, IconoWifi, IconoAuto, IconoMascota];

function Logo({ claro = false }: { claro?: boolean }) {
  return (
    <a href="#inicio" className="flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8c79a]">
      <svg viewBox="0 0 40 40" width="38" height="38" aria-hidden="true">
        <circle cx="20" cy="20" r="19" fill={claro ? "#f7f2e8" : "#2f4a3a"} />
        <path d="M7 27l8-10 5 6 4-4 9 8z" fill={claro ? "#2f4a3a" : "#e8c79a"} />
        <path d="M9 30c4-2 8 1 11-1s7-2 11 0" stroke={claro ? "#b5653a" : "#f7f2e8"} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="27" cy="13" r="3" fill="#b5653a" />
      </svg>
      <span className={`${serif} text-lg leading-none font-medium ${claro ? "text-[#f7f2e8]" : "text-[#2a2620]"}`}>
        Arroyo Manso
        <span className={`${sans} mt-1 block text-[9px] font-semibold tracking-[0.16em] whitespace-nowrap uppercase sm:text-[10px] sm:tracking-[0.25em] ${claro ? "text-[#e8c79a]" : "text-[#a45b34]"}`}>Cabañas · Calamuchita</span>
      </span>
      <span className="sr-only">, inicio</span>
    </a>
  );
}

export default function CabanasDemo() {
  return (
    <div className={`${sans} min-h-dvh overflow-x-clip bg-[#f7f2e8] pb-28 text-[#2a2620] antialiased`}>
      <main id="inicio">
        {/* HERO */}
        <section className="relative isolate min-h-[88svh] overflow-hidden">
          <Image
            src="/demos/reservas/cabanas/hero-sierras.webp"
            alt="Ilustración de cabañas con ventanas encendidas entre pinos y algarrobos, con las sierras de Córdoba al atardecer"
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover object-[60%_center]"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-[#1f2a23]/55 via-[#1f2a23]/10 to-[#1f2a23]/70" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1f2a23]/65 via-[#1f2a23]/20 to-transparent" />
          <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
            <Logo claro />
            <nav aria-label="Secciones" className="hidden md:block">
              <ul className="flex gap-7 text-sm font-medium text-[#f7f2e8]/85">
                {[
                  ["#cabanas", "Cabañas"],
                  ["#comodidades", "Comodidades"],
                  ["#galeria", "Galería"],
                  ["#alrededores", "Alrededores"],
                ].map(([h, t]) => (
                  <li key={h}>
                    <a href={h} className="transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8c79a]">
                      {t}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <MisReservas />
          </header>
          <div className="mx-auto flex max-w-6xl flex-col px-4 pt-[12svh] pb-20 text-[#f7f2e8] sm:px-6">
            <p className="text-sm font-semibold tracking-[0.2em] text-[#e8c79a] uppercase">Valle de Calamuchita · Córdoba</p>
            <h1 className={`${serif} mt-5 max-w-3xl text-[clamp(3rem,8.5vw,6.5rem)] leading-[0.95] font-medium`}>
              Donde el arroyo <em className="text-[#e8c79a]">baja manso.</em>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#f7f2e8]/85">
              Cuatro cabañas de piedra y madera entre pinos y molles, a veinte pasos del agua. Desayuno serrano, fogón y cielo lleno de estrellas.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#reservar"
                className="inline-flex items-center gap-2 rounded-full bg-[#f7f2e8] px-7 py-4 font-semibold text-[#2f4a3a] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#e8c79a]"
              >
                Ver disponibilidad <IconoFlecha width={18} height={18} />
              </a>
              <a
                href="#cabanas"
                className="inline-flex items-center gap-2 rounded-full px-7 py-4 font-semibold text-[#f7f2e8] ring-1 ring-[#f7f2e8]/50 transition hover:bg-[#f7f2e8]/10 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#e8c79a]"
              >
                Conocer las cabañas
              </a>
            </div>
            <p className="mt-10 flex items-center gap-2 text-sm text-[#f7f2e8]/85">
              <span className="flex text-[#e8c79a]" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <IconoEstrella key={i} width={15} height={15} />
                ))}
              </span>
              4,9 de 5 en 380 estadías
            </p>
          </div>
        </section>

        {/* INTRO */}
        <section aria-labelledby="intro-titulo" className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-[1.1fr_1fr] md:py-28">
          <h2 id="intro-titulo" className={`${serif} text-4xl leading-tight font-medium md:text-5xl`}>
            Un lugar chico, atendido por sus dueños, para bajar un cambio de verdad.
          </h2>
          <div className="grid gap-5 text-lg leading-relaxed text-[#4f483e]">
            <p>Somos Marta y Julián. Hace quince años levantamos la primera cabaña con piedra del mismo arroyo. Hoy son cuatro, y seguimos recibiendo a cada huésped en persona.</p>
            <p>
              Check-in desde las {complejo.checkIn} y check-out hasta las {complejo.checkOut}. Si llegás tarde, te dejamos la luz del camino encendida.
            </p>
          </div>
        </section>

        {/* CABAÑAS */}
        <section id="cabanas" aria-labelledby="cabanas-titulo" className="scroll-mt-4 bg-[#2f4a3a] text-[#f7f2e8]">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <h2 id="cabanas-titulo" className={`${serif} text-5xl font-medium md:text-6xl`}>
                Las cabañas
              </h2>
              <p className="max-w-sm text-[#f7f2e8]/75">Todas con hogar a leña, cocina equipada, ropa blanca y vista al monte.</p>
            </div>
            <ul className="mt-12 grid gap-6 md:grid-cols-2">
              {cabanas.map((c) => (
                <li key={c.id} className="group flex flex-col overflow-hidden rounded-[1.75rem] bg-[#f7f2e8] text-[#2a2620]">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={c.img} alt={c.alt} fill sizes="(min-width: 768px) 560px, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.03] motion-reduce:transition-none" />
                    <span className="absolute top-4 right-4 rounded-full bg-[#f7f2e8]/95 px-3 py-1.5 text-sm font-semibold">
                      desde {pesos(c.tarifa)} <span className="font-normal text-[#6b6356]">/ noche</span>
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <h3 className={`${serif} text-3xl font-medium`}>{c.nombre}</h3>
                    <p className="mt-2 text-[#4f483e]">{c.bajada}</p>
                    <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#6b6356]">
                      <span className="flex items-center gap-1.5">
                        <IconoPersonas width={16} height={16} /> Hasta {c.capacidad} personas
                      </span>
                      <span className="flex items-center gap-1.5">
                        <IconoCama width={16} height={16} /> {c.dormitorios} {c.dormitorios === 1 ? "dormitorio" : "dormitorios"}
                      </span>
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {c.destacados.map((d) => (
                        <li key={d} className="rounded-full bg-[#efe6d4] px-3 py-1 text-xs font-semibold">
                          {d}
                        </li>
                      ))}
                    </ul>
                    <VerDisponibilidad
                      cabana={c.id}
                      className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-[#2f4a3a] px-5 py-3 text-sm font-semibold text-[#f7f2e8] transition hover:bg-[#243a2d] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#b5653a]"
                    >
                      Ver disponibilidad <span className="sr-only">de {c.nombre}</span> <IconoFlecha width={16} height={16} />
                    </VerDisponibilidad>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* COMODIDADES */}
        <section id="comodidades" aria-labelledby="comodidades-titulo" className="mx-auto max-w-6xl scroll-mt-4 px-4 py-20 sm:px-6 md:py-28">
          <h2 id="comodidades-titulo" className={`${serif} text-center text-5xl font-medium md:text-6xl`}>
            Todo lo que necesitás, <em className="text-[#b5653a]">nada de más</em>
          </h2>
          <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {comodidades.map((c, i) => {
              const Icono = iconosComodidades[i] ?? IconoCafe;
              return (
                <li key={c.t} className="flex gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#efe6d4] text-[#2f4a3a]">
                    <Icono width={22} height={22} />
                  </span>
                  <span>
                    <span className="block text-lg font-semibold">{c.t}</span>
                    <span className="mt-1 block text-[#6b6356]">{c.d}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* GALERÍA */}
        <section id="galeria" aria-labelledby="galeria-titulo" className="mx-auto max-w-6xl scroll-mt-4 px-4 pb-20 sm:px-6 md:pb-28">
          <h2 id="galeria-titulo" className="sr-only">
            Galería
          </h2>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {galeria.map((g, i) => (
              <li key={g.img} className={i === 0 ? "col-span-2 md:row-span-2" : i === 5 ? "col-span-2 md:col-span-1" : ""}>
                <figure className="group relative h-full overflow-hidden rounded-3xl">
                  <div className={`relative w-full ${i === 0 ? "aspect-[4/3] md:aspect-auto md:h-full" : i === 5 ? "aspect-[2/1] md:aspect-[4/3]" : "aspect-[4/3]"}`}>
                    <Image src={g.img} alt={g.alt} fill sizes={i === 0 ? "(min-width: 768px) 740px, 100vw" : "(min-width: 768px) 370px, 50vw"} className="object-cover transition duration-700 group-hover:scale-[1.04] motion-reduce:transition-none" />
                  </div>
                  <figcaption className="absolute bottom-3 left-3 rounded-full bg-[#f7f2e8]/95 px-3 py-1 text-xs font-semibold">{g.t}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>

        <Reserva />

        {/* ALREDEDORES */}
        <section id="alrededores" aria-labelledby="alrededores-titulo" className="mx-auto max-w-6xl scroll-mt-4 px-4 py-20 sm:px-6 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <h2 id="alrededores-titulo" className={`${serif} text-5xl font-medium md:text-6xl`}>
              Qué hacer cerca
            </h2>
            <p className="max-w-sm text-[#6b6356]">Te armamos el mapa con los secretos que no salen en las guías.</p>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {actividades.map((a) => (
              <li key={a.t} className="overflow-hidden rounded-3xl bg-white ring-1 ring-[#2a2620]/6">
                <div className="relative aspect-[9/7]">
                  <Image src={a.img} alt={a.alt} fill sizes="(min-width: 1024px) 270px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                  <span className="absolute top-3 left-3 rounded-full bg-[#2f4a3a] px-2.5 py-1 text-xs font-semibold text-[#f7f2e8]">{a.dist}</span>
                </div>
                <div className="p-5">
                  <h3 className={`${serif} text-xl leading-snug font-medium`}>{a.t}</h3>
                  <p className="mt-1.5 text-sm text-[#6b6356]">{a.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* RESEÑAS */}
        <section aria-labelledby="resenas-titulo" className="bg-[#efe6d4]">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-24">
            <h2 id="resenas-titulo" className={`${serif} text-center text-5xl font-medium md:text-6xl`}>
              Dicen los que vinieron
            </h2>
            <ul className="mt-12 grid gap-5 md:grid-cols-3">
              {resenas.map((r) => (
                <li key={r.nombre}>
                  <figure className="flex h-full flex-col rounded-3xl bg-[#fbf8f2] p-7">
                    <span className="flex text-[#b5653a]" role="img" aria-label="5 de 5 estrellas">
                      {Array.from({ length: 5 }, (_, i) => (
                        <IconoEstrella key={i} width={15} height={15} />
                      ))}
                    </span>
                    <blockquote className={`${serif} mt-4 flex-1 text-xl leading-relaxed`}>“{r.texto}”</blockquote>
                    <figcaption className="mt-5 text-sm">
                      <span className="font-semibold">{r.nombre}</span>
                      <span className="text-[#6b6356]">
                        {" "}
                        · {r.origen} · {r.cabana}
                      </span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* UBICACIÓN */}
        <section aria-labelledby="ubicacion-titulo" className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28">
          <div>
            <h2 id="ubicacion-titulo" className={`${serif} text-5xl font-medium md:text-6xl`}>
              Cómo llegar
            </h2>
            <p className="mt-6 flex items-start gap-3 text-lg">
              <IconoUbicacion width={22} height={22} className="mt-1 shrink-0 text-[#b5653a]" />
              <span>
                {complejo.direccion}
                <span className="block text-base text-[#6b6356]">A 90 minutos de Córdoba capital. Los últimos 3 km son de ripio firme, se hacen con cualquier auto.</span>
              </span>
            </p>
          </div>
          <figure className="overflow-hidden rounded-3xl bg-[#e4dcc8]">
            <svg viewBox="0 0 560 360" className="h-auto w-full" role="img" aria-label="Mapa ilustrado: ruta desde Córdoba capital por el valle hasta las cabañas junto al arroyo">
              <rect width="560" height="360" fill="#e4dcc8" />
              <path d="M0 250 C80 200 140 230 210 190 S340 120 420 150 560 110 560 110 V360 H0Z" fill="#cfc4a8" />
              <path d="M0 300 C120 260 200 300 300 260 S460 230 560 250 V360 H0Z" fill="#b8b08f" />
              <path d="M40 60 C140 90 180 170 260 200 S420 260 470 300" stroke="#fff" strokeWidth="9" fill="none" strokeLinecap="round" />
              <path d="M40 60 C140 90 180 170 260 200 S420 260 470 300" stroke="#b5653a" strokeWidth="3" fill="none" strokeDasharray="10 8" strokeLinecap="round" />
              <path d="M300 20 C320 100 380 160 400 230 S450 330 500 360" stroke="#7fb3c4" strokeWidth="6" fill="none" />
              <circle cx="40" cy="60" r="9" fill="#2f4a3a" />
              <text x="58" y="56" fontSize="14" fill="#2a2620" fontWeight="600">
                Córdoba capital
              </text>
              <g transform="translate(470 300)">
                <circle r="22" fill="#b5653a" fillOpacity=".25" />
                <circle r="12" fill="#b5653a" />
              </g>
              <text x="448" y="300" textAnchor="end" fontSize="15" fill="#2a2620" fontWeight="700">
                Arroyo Manso
              </text>
              <text x="350" y="100" fontSize="12" fill="#4f6f7c" fontStyle="italic">
                arroyo
              </text>
            </svg>
            <figcaption className="sr-only">Mapa ilustrativo, no es un mapa real.</figcaption>
          </figure>
        </section>
      </main>

      <footer className="border-t border-[#2a2620]/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-[#6b6356] sm:px-6">
          <Logo />
          <p>Demo con contenido ficticio. Complejo, personas, precios y reseñas inventados.</p>
        </div>
      </footer>

      <DemoBar
        estilo="Cabañas"
        mensaje="Hola Fran, vi la demo Cabañas y quiero algo así para mi negocio."
        otrosHref="/demos/reservas"
        pregunta="¿Querés uno así?"
      />
    </div>
  );
}
