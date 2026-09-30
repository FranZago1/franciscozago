import Image from "next/image";
import { DemoBar } from "@/components/demos/DemoBar";
import { MisReservas } from "@/demos/reservas/canchas/Cliente";
import { club, resenas, tarifas } from "@/demos/reservas/canchas/datos";
import { Reserva } from "@/demos/reservas/canchas/Reserva";
import { pesos } from "@/demos/reservas/shared/fechas";
import {
  IconoAuto,
  IconoCafe,
  IconoDucha,
  IconoEstrella,
  IconoFlecha,
  IconoLuz,
  IconoPaleta,
  IconoReloj,
  IconoTecho,
  IconoUbicacion,
  IconoWifi,
} from "@/demos/reservas/shared/Iconos";

const display = "[font-family:var(--font-pc-display)]";
const sans = "[font-family:var(--font-pc-sans)]";

function Logo() {
  return (
    <a href="#inicio" className="flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1553d6]">
      <svg viewBox="0 0 40 40" width="38" height="38" aria-hidden="true">
        <rect width="40" height="40" rx="11" fill="#1553d6" />
        <circle cx="20" cy="20" r="11" fill="#d8f03c" />
        <path d="M11 14c4 2 6 4 6 6s-2 4-6 6M29 14c-4 2-6 4-6 6s2 4 6 6" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
      <span className={`${display} text-xl leading-[0.9] font-extrabold text-[#0a1b3d] uppercase italic`}>
        Pádel Club
        <span className="block text-[#1553d6]">Sierras</span>
      </span>
      <span className="sr-only">, inicio</span>
    </a>
  );
}

const canchasInfo = [
  {
    img: "/demos/reservas/canchas/cancha-panoramica.webp",
    alt: "Ilustración de la cancha central panorámica de noche, con vidrio en los cuatro lados",
    titulo: "Central panorámica",
    texto: "Vidrio en los cuatro lados y gradas para 60 personas. La de los torneos.",
    tags: ["Techada", "Panorámica", "LED"],
  },
  {
    img: "/demos/reservas/canchas/cancha-techada.webp",
    alt: "Ilustración de dos canchas techadas bajo un galpón con estructura de arcos",
    titulo: "Techadas 2 y 3",
    texto: "Se juega igual con lluvia, viento o 40 grados. Césped sintético nuevo.",
    tags: ["Techada", "Climatizada"],
  },
  {
    img: "/demos/reservas/canchas/cancha-descubierta.webp",
    alt: "Ilustración de canchas descubiertas de día con las sierras de fondo",
    titulo: "Descubiertas 4 y 5",
    texto: "Al aire libre con vista a las sierras. Las más buscadas en otoño y primavera.",
    tags: ["Al aire libre", "Luz desde las 19"],
  },
];

export default function CanchasDemo() {
  return (
    <div className={`${sans} min-h-dvh overflow-x-clip bg-white pb-28 text-[#0a1b3d] antialiased`}>
      <header className="sticky top-0 z-40 border-b border-[#0a1b3d]/8 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Logo />
          <nav aria-label="Secciones" className="hidden md:block">
            <ul className="flex gap-7 text-sm font-semibold text-[#0a1b3d]/70">
              {[
                ["#reservar", "Reservar"],
                ["#canchas", "Canchas"],
                ["#tarifas", "Tarifas"],
                ["#club", "El club"],
              ].map(([h, t]) => (
                <li key={h}>
                  <a href={h} className="transition hover:text-[#1553d6] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1553d6]">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <MisReservas />
        </div>
      </header>

      <main id="inicio">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(ellipse_at_top_right,#e3ecff,transparent_60%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pt-10 pb-16 sm:px-6 md:pt-16 lg:grid-cols-[1fr_1.15fr] lg:pb-24">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-[#0a1b3d] px-3 py-1.5 text-xs font-bold tracking-wide text-white uppercase">
                <span className="size-2 rounded-full bg-[#d8f03c]" aria-hidden="true" /> Abierto de 8 a 24 · todos los días
              </p>
              <h1 className={`${display} mt-6 text-[clamp(4rem,13vw,8.5rem)] leading-[0.82] font-extrabold uppercase italic`}>
                Jugá
                <span className="block text-[#1553d6]">hoy.</span>
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-[#0a1b3d]/70">
                Cinco canchas en las sierras, tres techadas. Mirá qué está libre, elegí la hora y reservá con seña en 30 segundos.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#reservar"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1553d6] px-6 py-4 font-bold text-white shadow-[0_12px_28px_-10px_rgba(21,83,214,0.8)] transition hover:bg-[#0f47bd] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#d8f03c]"
                >
                  Ver horarios libres <IconoFlecha width={18} height={18} grosor={2.2} />
                </a>
                <a
                  href="#tarifas"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#f4f7fc] px-6 py-4 font-bold ring-1 ring-[#0a1b3d]/10 transition hover:ring-[#1553d6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1553d6]"
                >
                  Tarifas
                </a>
              </div>
              <ul className="mt-10 grid max-w-md grid-cols-3 gap-3">
                {[
                  ["5", "canchas"],
                  ["3", "techadas"],
                  ["4,8", "en reseñas"],
                ].map(([n, t]) => (
                  <li key={t} className="rounded-2xl bg-[#f4f7fc] p-3">
                    <span className={`${display} block text-4xl leading-none font-extrabold text-[#1553d6] italic`}>{n}</span>
                    <span className="text-sm font-semibold text-[#0a1b3d]/65">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="relative aspect-[3/2] overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-40px_rgba(10,27,61,0.6)]">
                <Image
                  src="/demos/reservas/canchas/hero-cancha.webp"
                  alt="Ilustración de tres canchas de pádel de noche, con luces encendidas y las sierras al atardecer"
                  fill
                  priority
                  sizes="(min-width: 1280px) 660px, (min-width: 1024px) 52vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-xl ring-1 ring-[#0a1b3d]/8 sm:left-8">
                <span className="grid size-11 place-items-center rounded-xl bg-[#d8f03c]">
                  <IconoReloj width={22} height={22} grosor={2} />
                </span>
                <span className="text-sm leading-tight">
                  <span className="block font-bold">Turnos de 60, 90 o 120</span>
                  <span className="text-[#0a1b3d]/60">Seña del 30 % online</span>
                </span>
              </div>
              <div className="absolute -top-4 right-4 hidden rotate-3 rounded-2xl bg-[#0a1b3d] px-4 py-3 text-white shadow-xl sm:block">
                <span className={`${display} text-2xl font-extrabold uppercase italic`}>Torneo sábados</span>
              </div>
            </div>
          </div>
        </section>

        <Reserva />

        {/* CANCHAS */}
        <section id="canchas" aria-labelledby="canchas-titulo" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 md:py-28">
          <h2 id="canchas-titulo" className={`${display} text-5xl leading-[0.9] font-extrabold uppercase italic md:text-7xl`}>
            Nuestras <span className="text-[#1553d6]">canchas</span>
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {canchasInfo.map((c) => (
              <li key={c.titulo} className="group overflow-hidden rounded-3xl bg-[#f4f7fc] ring-1 ring-[#0a1b3d]/6">
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image src={c.img} alt={c.alt} fill sizes="(min-width: 768px) 400px, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.04] motion-reduce:transition-none" />
                </div>
                <div className="p-6">
                  <h3 className={`${display} text-3xl font-extrabold uppercase italic`}>{c.titulo}</h3>
                  <p className="mt-2 text-[#0a1b3d]/70">{c.texto}</p>
                  <p className="mt-4 flex flex-wrap gap-1.5">
                    {c.tags.map((t) => (
                      <span key={t} className="rounded-full bg-white px-2.5 py-1 text-xs font-bold ring-1 ring-[#0a1b3d]/10">
                        {t}
                      </span>
                    ))}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* TARIFAS */}
        <section id="tarifas" aria-labelledby="tarifas-titulo" className="scroll-mt-20 bg-[#1553d6] text-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:py-24 lg:grid-cols-[1fr_1.3fr] lg:items-center">
            <div>
              <h2 id="tarifas-titulo" className={`${display} text-5xl leading-[0.9] font-extrabold uppercase italic md:text-7xl`}>
                Tarifas <span className="text-[#d8f03c]">claras</span>
              </h2>
              <p className="mt-5 max-w-md text-white/80">
                Precio por hora de cancha, no por jugador. Hora pico: de lunes a viernes desde las 18 y fines de semana desde las 10.
              </p>
              <div className="relative mt-8 aspect-[4/3] max-w-sm overflow-hidden rounded-3xl bg-white">
                <Image src="/demos/reservas/canchas/paletas.webp" alt="Ilustración de dos paletas de pádel cruzadas y pelotas" fill sizes="384px" className="object-cover" />
              </div>
            </div>
            <div className="overflow-x-auto rounded-3xl bg-white text-[#0a1b3d]">
              <table className="w-full min-w-[30rem] text-left">
                <caption className="sr-only">Precio por hora según tipo de cancha y horario</caption>
                <thead>
                  <tr className="text-xs tracking-wider text-[#0a1b3d]/55 uppercase">
                    <th scope="col" className="p-5 font-bold">
                      Cancha
                    </th>
                    <th scope="col" className="p-5 font-bold">
                      Valle
                    </th>
                    <th scope="col" className="p-5 font-bold">
                      Pico
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tarifas.map((t) => (
                    <tr key={t.tipo} className="border-t border-[#0a1b3d]/8">
                      <th scope="row" className="p-5">
                        <span className="block font-bold">{t.tipo}</span>
                        <span className="text-sm font-normal text-[#0a1b3d]/60">{t.nota}</span>
                      </th>
                      <td className={`${display} p-5 text-3xl font-bold tabular-nums`}>{pesos(t.valle)}</td>
                      <td className={`${display} p-5 text-3xl font-bold text-[#1553d6] tabular-nums`}>{pesos(t.pico)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="flex flex-wrap gap-x-5 gap-y-2 border-t border-[#0a1b3d]/8 bg-[#f4f7fc] p-5 text-sm">
                <span className="flex items-center gap-1.5">
                  <IconoPaleta width={16} height={16} /> Paletas {pesos(3000)}
                </span>
                <span className="flex items-center gap-1.5">
                  <IconoLuz width={16} height={16} /> Luz descubiertas {pesos(3000)}/h
                </span>
                <span className="flex items-center gap-1.5">
                  <IconoTecho width={16} height={16} /> Techadas con luz incluida
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* EL CLUB */}
        <section id="club" aria-labelledby="club-titulo" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 md:py-28">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[3/2] overflow-hidden rounded-3xl">
              <Image src="/demos/reservas/canchas/club-bar.webp" alt="Ilustración del bar del club con mesas bajo un toldo azul y blanco y las sierras de fondo" fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
            </div>
            <div>
              <h2 id="club-titulo" className={`${display} text-5xl leading-[0.9] font-extrabold uppercase italic md:text-7xl`}>
                El tercer tiempo <span className="text-[#2e9e5b]">también cuenta</span>
              </h2>
              <ul className="mt-8 grid grid-cols-2 gap-3">
                {[
                  [IconoCafe, "Bar y terraza", "Licuados, cerveza y picadas"],
                  [IconoDucha, "Vestuarios", "Duchas con agua caliente"],
                  [IconoAuto, "Estacionamiento", "Gratis y con seguridad"],
                  [IconoWifi, "Wifi", "En todo el club"],
                ].map(([Ic, t, d]) => {
                  const Icono = Ic as typeof IconoCafe;
                  return (
                    <li key={t as string} className="rounded-2xl bg-[#f4f7fc] p-4">
                      <Icono width={22} height={22} className="text-[#1553d6]" />
                      <p className="mt-3 font-bold">{t as string}</p>
                      <p className="text-sm text-[#0a1b3d]/60">{d as string}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <ul className="mt-16 grid gap-4 md:grid-cols-3">
            {resenas.map((r) => (
              <li key={r.nombre}>
                <figure className="h-full rounded-3xl border-2 border-[#0a1b3d]/6 p-6">
                  <span className="flex text-[#f5b301]" role="img" aria-label="5 de 5 estrellas">
                    {Array.from({ length: 5 }, (_, i) => (
                      <IconoEstrella key={i} width={16} height={16} />
                    ))}
                  </span>
                  <blockquote className="mt-3 text-lg leading-snug font-medium">“{r.texto}”</blockquote>
                  <figcaption className="mt-4 text-sm font-bold text-[#0a1b3d]/60">{r.nombre}</figcaption>
                </figure>
              </li>
            ))}
          </ul>

          <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-3xl bg-[#0a1b3d] p-8 text-white md:flex-row md:items-center md:p-10">
            <p className="flex items-start gap-3">
              <IconoUbicacion width={26} height={26} className="mt-1 shrink-0 text-[#d8f03c]" />
              <span>
                <span className={`${display} block text-3xl font-extrabold uppercase italic`}>{club.direccion}</span>
                <span className="text-white/70">A 15 minutos del centro. Todos los días de 8 a 24.</span>
              </span>
            </p>
            <a
              href="#reservar"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#d8f03c] px-6 py-4 font-bold text-[#0a1b3d] transition hover:bg-[#e4f75f] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Reservar cancha <IconoFlecha width={18} height={18} grosor={2.2} />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#0a1b3d]/8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-[#0a1b3d]/60 sm:px-6">
          <Logo />
          <p>Demo con contenido ficticio. Club, jugadores, precios y reseñas inventados.</p>
        </div>
      </footer>

      <DemoBar
        estilo="Canchas"
        mensaje="Hola Fran, vi la demo Canchas y quiero algo así para mi negocio."
        otrosHref="/demos/reservas"
        pregunta="¿Querés uno así?"
      />
    </div>
  );
}
