import Image from "next/image";
import { DemoBar } from "@/components/demos/DemoBar";
import { MisTurnos, ReservarCon } from "@/demos/reservas/barberia/Cliente";
import { barberos, diasTexto, grupos, negocio, resenas, servicios, trabajos } from "@/demos/reservas/barberia/datos";
import { Reserva } from "@/demos/reservas/barberia/Reserva";
import { duracionTexto, hhmm, pesos } from "@/demos/reservas/shared/fechas";
import { IconoEstrella, IconoFlecha, IconoNavaja, IconoReloj, IconoTijera, IconoUbicacion } from "@/demos/reservas/shared/Iconos";

const serif = "[font-family:var(--font-df-serif)]";
const sans = "[font-family:var(--font-df-sans)]";
const kicker = "text-[11px] font-semibold tracking-[0.3em] uppercase";

const nav = [
  ["#servicios", "Servicios"],
  ["#equipo", "Equipo"],
  ["#trabajos", "Trabajos"],
  ["#ubicacion", "Ubicación"],
] as const;

function Logo() {
  return (
    <a href="#inicio" className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c29b5a]" aria-label={`${negocio.nombre}, inicio`}>
      <svg viewBox="0 0 48 48" width="42" height="42" aria-hidden="true">
        <circle cx="24" cy="24" r="22.5" fill="none" stroke="#c29b5a" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="18.5" fill="none" stroke="#c29b5a" strokeWidth=".75" strokeDasharray="1.5 2.2" />
        <text x="24" y="30" textAnchor="middle" fontSize="17" fill="#efe6d6" style={{ fontFamily: "var(--font-df-serif)" }}>
          DF
        </text>
      </svg>
      <span className="leading-none">
        <span className={`${serif} block text-2xl text-[#efe6d6]`}>Don Filo</span>
        <span className="mt-1 block text-[9px] font-semibold tracking-[0.35em] text-[#c29b5a] uppercase">Barbería · {negocio.desde}</span>
      </span>
    </a>
  );
}

function Ornamento({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 12" width="120" height="12" aria-hidden="true" className={className}>
      <path d="M0 6h48M72 6h48" stroke="currentColor" strokeWidth="1" />
      <path d="M60 1l5 5-5 5-5-5z" fill="currentColor" />
      <circle cx="51" cy="6" r="1.4" fill="currentColor" />
      <circle cx="69" cy="6" r="1.4" fill="currentColor" />
    </svg>
  );
}

export default function BarberiaDemo() {
  return (
    <div className={`${sans} min-h-dvh overflow-x-clip bg-[#141210] pb-28 text-[#efe6d6] antialiased`}>
      <header className="relative z-40 border-b border-[#efe6d6]/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <Logo />
          <nav aria-label="Secciones" className="hidden lg:block">
            <ul className="flex gap-8 text-xs font-semibold tracking-[0.18em] uppercase">
              {nav.map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="text-[#efe6d6]/75 transition hover:text-[#c29b5a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c29b5a]">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <MisTurnos />
            <a
              href="#reservar"
              className="hidden rounded-[3px] bg-[#7a1e2c] px-4 py-2.5 text-xs font-semibold tracking-[0.12em] text-[#f6efe3] uppercase transition hover:bg-[#8e2536] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c29b5a] sm:inline-flex"
            >
              Reservá
            </a>
          </div>
        </div>
      </header>

      <main id="inicio">
        {/* HERO */}
        <section className="relative">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-12 pb-20 sm:px-8 md:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-28">
            <div>
              <p className={`${kicker} flex items-center gap-3 text-[#c29b5a]`}>
                <span className="h-px w-8 bg-[#c29b5a]" aria-hidden="true" /> Nueva Córdoba · desde {negocio.desde}
              </p>
              <h1 className={`${serif} mt-6 text-[clamp(3.4rem,10vw,7.2rem)] leading-[0.88] tracking-tight`}>
                Cortes con oficio.
                <span className="mt-2 block text-[#c29b5a] italic">Barbas con paciencia.</span>
              </h1>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-[#efe6d6]/75">
                Tijera, navaja y toalla caliente, como siempre. Lo nuevo es que ahora sacás turno en un minuto, con el barbero que
                quieras.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <a
                  href="#reservar"
                  className="inline-flex items-center gap-2 rounded-[3px] bg-[#7a1e2c] px-6 py-4 text-sm font-semibold tracking-[0.12em] text-[#f6efe3] uppercase transition hover:bg-[#8e2536] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c29b5a]"
                >
                  Reservá tu turno <IconoFlecha width={16} height={16} />
                </a>
                <a
                  href="#servicios"
                  className="inline-flex items-center gap-2 rounded-[3px] border border-[#efe6d6]/25 px-6 py-4 text-sm font-semibold tracking-[0.12em] uppercase transition hover:border-[#c29b5a] hover:text-[#c29b5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c29b5a]"
                >
                  Ver la carta
                </a>
              </div>
              <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-[#efe6d6]/12 pt-6">
                <div>
                  <dt className="text-xs text-[#efe6d6]/55">Reseñas</dt>
                  <dd className="mt-1 flex items-center gap-1.5 text-lg font-semibold">
                    4,9 <IconoEstrella width={15} height={15} className="text-[#c29b5a]" />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#efe6d6]/55">Abrimos</dt>
                  <dd className="mt-1 text-lg font-semibold">Mar a Sáb</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#efe6d6]/55">Reservar</dt>
                  <dd className="mt-1 text-lg font-semibold">1 minuto</dd>
                </div>
              </dl>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[3px] ring-1 ring-[#c29b5a]/30">
                <Image
                  src="/demos/reservas/barberia/hero-sillon.webp"
                  alt="Ilustración del salón: sillón de barbero bordó, espejo con marco dorado, poste de barbería y estante con productos"
                  fill
                  priority
                  sizes="(min-width: 1152px) 540px, (min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
              <span aria-hidden="true" className="absolute -top-3 -left-3 size-10 border-t border-l border-[#c29b5a]" />
              <span aria-hidden="true" className="absolute -right-3 -bottom-3 size-10 border-r border-b border-[#c29b5a]" />
              <div className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-[3px] bg-[#efe6d6] px-4 py-3 text-[#1b1714] shadow-xl sm:left-6">
                <span className="grid size-9 place-items-center rounded-full bg-[#7a1e2c] text-[#efe6d6]">
                  <IconoReloj width={18} height={18} />
                </span>
                <span className="text-sm leading-tight">
                  <span className="block font-semibold">Turnos de 30 a 90 min</span>
                  <span className="text-[#5c5247]">Llegás y te atendemos</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Banda */}
        <div className="border-y border-[#c29b5a]/25 bg-[#7a1e2c]" aria-hidden="true">
          <div className={`${serif} mx-auto flex max-w-6xl items-center justify-start gap-5 overflow-hidden sm:justify-center px-4 py-4 text-xl whitespace-nowrap text-[#efe6d6] italic sm:gap-8 sm:text-2xl`}>
            <span>Corte</span>
            <Ornamento className="w-6 shrink-0 text-[#c29b5a]" />
            <span>Barba</span>
            <Ornamento className="w-6 shrink-0 text-[#c29b5a]" />
            <span>Navaja</span>
            <Ornamento className="w-6 shrink-0 text-[#c29b5a]" />
            <span>Toalla caliente</span>
            <Ornamento className="hidden w-6 shrink-0 text-[#c29b5a] sm:block" />
            <span className="hidden sm:inline">Fade</span>
          </div>
        </div>

        {/* SERVICIOS */}
        <section id="servicios" aria-labelledby="servicios-titulo" className="mx-auto max-w-6xl scroll-mt-4 px-4 py-24 sm:px-8 md:py-32">
          <div className="text-center">
            <p className={`${kicker} text-[#c29b5a]`}>La carta</p>
            <h2 id="servicios-titulo" className={`${serif} mt-4 text-5xl md:text-7xl`}>
              Servicios y precios
            </h2>
            <Ornamento className="mx-auto mt-6 text-[#c29b5a]" />
          </div>
          <div className="mt-16 grid gap-14 md:grid-cols-2 md:gap-x-16">
            {grupos.map((g, gi) => (
              <div key={g.id} className={gi === 2 ? "md:col-span-2 md:mx-auto md:w-1/2" : ""}>
                <h3 className={`${kicker} flex items-center gap-3 text-[#efe6d6]/60`}>
                  {g.id === "barba" ? <IconoNavaja width={16} height={16} className="text-[#c29b5a]" /> : <IconoTijera width={16} height={16} className="text-[#c29b5a]" />}
                  {g.titulo}
                </h3>
                <ul className="mt-6 grid gap-7">
                  {servicios
                    .filter((s) => s.grupo === g.id)
                    .map((s) => (
                      <li key={s.id} className="group">
                        <div className="flex items-baseline gap-3">
                          <h4 className={`${serif} text-[1.7rem] leading-none`}>{s.nombre}</h4>
                          <span aria-hidden="true" className="mb-1.5 flex-1 border-b border-dotted border-[#efe6d6]/25" />
                          <span className="text-lg font-semibold tabular-nums text-[#c29b5a]">{pesos(s.precio)}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                          <p className="text-sm text-[#efe6d6]/60">
                            {s.detalle} <span className="text-[#efe6d6]/40">· {duracionTexto(s.minutos)}</span>
                          </p>
                          <ReservarCon
                            servicio={s.id}
                            className="text-xs font-semibold tracking-[0.15em] text-[#efe6d6]/70 uppercase underline-offset-4 transition hover:text-[#c29b5a] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c29b5a]"
                          >
                            Reservar<span className="sr-only"> {s.nombre}</span>
                          </ReservarCon>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <Reserva />

        {/* EQUIPO */}
        <section id="equipo" aria-labelledby="equipo-titulo" className="mx-auto max-w-6xl scroll-mt-4 px-4 py-24 sm:px-8 md:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className={`${kicker} text-[#c29b5a]`}>El equipo</p>
              <h2 id="equipo-titulo" className={`${serif} mt-4 text-5xl md:text-7xl`}>
                Cuatro pares de manos
              </h2>
            </div>
            <p className="max-w-sm text-[#efe6d6]/65">Cada uno con su especialidad. Elegí con quién o dejá que te toque el primero libre.</p>
          </div>
          <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">
            {barberos.map((b) => (
              <li key={b.id} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] ring-1 ring-[#efe6d6]/10">
                  <Image src={b.img} alt={b.alt} fill sizes="(min-width: 1024px) 260px, 50vw" className="object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none" />
                </div>
                <h3 className={`${serif} mt-4 text-3xl`}>{b.nombre}</h3>
                <p className="mt-1 text-sm font-medium text-[#c29b5a]">{b.rol}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#efe6d6]/60">{b.bio}</p>
                <p className="mt-3 text-xs text-[#efe6d6]/50">
                  {diasTexto(b.dias)} · {hhmm(b.desde)} a {hhmm(b.hasta)}
                </p>
                <ReservarCon
                  barbero={b.id}
                  className="mt-4 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase transition hover:text-[#c29b5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c29b5a]"
                >
                  Reservar con {b.nombre} <IconoFlecha width={14} height={14} />
                </ReservarCon>
              </li>
            ))}
          </ul>
        </section>

        {/* TRABAJOS */}
        <section id="trabajos" aria-labelledby="trabajos-titulo" className="scroll-mt-4 border-t border-[#efe6d6]/10 bg-[#1b1815]">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-8 md:py-32">
            <div className="text-center">
              <p className={`${kicker} text-[#c29b5a]`}>Trabajos</p>
              <h2 id="trabajos-titulo" className={`${serif} mt-4 text-5xl md:text-7xl`}>
                Salieron de acá
              </h2>
            </div>
            <ul className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
              {trabajos.map((t) => (
                <li key={t.img}>
                  <figure className="group relative h-full overflow-hidden rounded-[3px]">
                    <div className="relative aspect-[4/5] w-full">
                      <Image src={t.img} alt={t.alt} fill sizes="(min-width: 768px) 360px, 50vw" className="object-cover transition duration-500 group-hover:scale-[1.04] motion-reduce:transition-none" />
                    </div>
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#141210]/90 to-transparent p-4 pt-12">
                      <span className={`${serif} text-xl sm:text-2xl`}>{t.nombre}</span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* RITUAL */}
        <section aria-labelledby="ritual-titulo" className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 sm:px-8 md:py-32 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[14/9] overflow-hidden rounded-[3px]">
            <Image
              src="/demos/reservas/barberia/herramientas.webp"
              alt="Ilustración de herramientas sobre cuero: navaja, tijera, peine dorado, brocha y pomada"
              fill
              sizes="(min-width: 1024px) 540px, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className={`${kicker} text-[#c29b5a]`}>El ritual</p>
            <h2 id="ritual-titulo" className={`${serif} mt-4 text-5xl leading-none md:text-6xl`}>
              Afeitado a navaja, <span className="text-[#c29b5a] italic">sin apuro</span>
            </h2>
            <ol className="mt-10 grid gap-6">
              {[
                ["Vapor y toalla caliente", "Abre los poros y ablanda la barba. Dos minutos que cambian todo."],
                ["Espuma a brocha", "Jabón de afeitar batido en el momento, aplicado en círculos."],
                ["Navaja en dos pasadas", "A favor y a contrapelo, con la mano firme de quien lo hace hace décadas."],
                ["Bálsamo y toalla fría", "Cierra, calma y deja la piel lista. Salís nuevo."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-5">
                  <span className={`${serif} w-8 shrink-0 text-3xl leading-none text-[#c29b5a]`}>{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-semibold">{t}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-[#efe6d6]/60">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* RESEÑAS */}
        <section aria-labelledby="resenas-titulo" className="bg-[#7a1e2c]">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-8 md:py-28">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 id="resenas-titulo" className={`${serif} text-5xl md:text-6xl`}>
                Lo que dicen en el sillón
              </h2>
              <p className="flex items-center gap-2 text-sm">
                <span className="flex text-[#e5c68b]" aria-hidden="true">
                  {Array.from({ length: 5 }, (_, i) => (
                    <IconoEstrella key={i} width={16} height={16} />
                  ))}
                </span>
                4,9 de 5 · 812 reseñas
              </p>
            </div>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {resenas.map((r) => (
                <li key={r.nombre}>
                  <figure className="flex h-full flex-col rounded-[3px] bg-[#141210]/25 p-6 ring-1 ring-[#efe6d6]/12">
                    <span className="flex text-[#e5c68b]" role="img" aria-label="5 de 5 estrellas">
                      {Array.from({ length: 5 }, (_, i) => (
                        <IconoEstrella key={i} width={14} height={14} />
                      ))}
                    </span>
                    <blockquote className={`${serif} mt-4 flex-1 text-2xl leading-snug`}>“{r.texto}”</blockquote>
                    <figcaption className="mt-6 text-sm">
                      <span className="font-semibold">{r.nombre}</span>
                      <span className="block text-[#efe6d6]/60">{r.detalle}</span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* UBICACIÓN */}
        <section id="ubicacion" aria-labelledby="ubicacion-titulo" className="mx-auto grid max-w-6xl scroll-mt-4 gap-12 px-4 py-24 sm:px-8 md:py-32 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p className={`${kicker} text-[#c29b5a]`}>Dónde estamos</p>
            <h2 id="ubicacion-titulo" className={`${serif} mt-4 text-5xl md:text-6xl`}>
              Pasá cuando quieras. <span className="text-[#c29b5a] italic">Mejor con turno.</span>
            </h2>
            <p className="mt-8 flex items-start gap-3 text-lg">
              <IconoUbicacion width={22} height={22} className="mt-1 shrink-0 text-[#c29b5a]" />
              <span>
                {negocio.direccion}
                <span className="block text-sm text-[#efe6d6]/55">A media cuadra de la plaza, portón verde con el poste en la puerta.</span>
              </span>
            </p>
            <table className="mt-10 w-full max-w-sm text-sm">
              <caption className={`${kicker} mb-3 text-left text-[#efe6d6]/55`}>Horarios</caption>
              <tbody>
                {[
                  ["Martes a viernes", "10:00 a 20:00"],
                  ["Sábados", "09:00 a 18:00"],
                  ["Domingos y lunes", "Cerrado"],
                ].map(([d, h]) => (
                  <tr key={d} className="border-b border-[#efe6d6]/10">
                    <th scope="row" className="py-3 text-left font-medium">
                      {d}
                    </th>
                    <td className={`py-3 text-right tabular-nums ${h === "Cerrado" ? "text-[#efe6d6]/45" : ""}`}>{h}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <MapaBarrio />
        </section>
      </main>

      <footer className="border-t border-[#efe6d6]/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-10 text-sm text-[#efe6d6]/55 sm:px-8">
          <Logo />
          <p>Demo con contenido ficticio. Barbería, personas, precios y reseñas inventados.</p>
        </div>
      </footer>

      <DemoBar
        estilo="Barbería"
        mensaje="Hola Fran, vi la demo Barbería y quiero algo así para mi negocio."
        otrosHref="/demos/reservas"
        pregunta="¿Querés uno así?"
      />
    </div>
  );
}

function MapaBarrio() {
  return (
    <figure className="relative overflow-hidden rounded-[3px] bg-[#1d1a17] ring-1 ring-[#efe6d6]/10">
      <svg viewBox="0 0 560 420" className="h-auto w-full" role="img" aria-label="Mapa ilustrado del barrio con la ubicación de la barbería junto a la plaza">
        <rect width="560" height="420" fill="#1d1a17" />
        {/* manzanas */}
        {Array.from({ length: 5 }, (_, r) =>
          Array.from({ length: 6 }, (_, c) => (
            <rect key={`${r}-${c}`} x={c * 96 - 20} y={r * 96 - 30} width="80" height="80" rx="4" fill="#24201c" />
          )),
        )}
        {/* diagonal */}
        <path d="M-20 400 L580 60" stroke="#2c2722" strokeWidth="26" />
        <path d="M-20 400 L580 60" stroke="#c29b5a" strokeOpacity=".25" strokeWidth="1" strokeDasharray="6 6" />
        {/* plaza */}
        <rect x="268" y="162" width="80" height="80" rx="4" fill="#1f3a2e" />
        {Array.from({ length: 6 }, (_, i) => (
          <circle key={i} cx={282 + (i % 3) * 26} cy={180 + Math.floor(i / 3) * 42} r="9" fill="#2a4d3c" />
        ))}
        <text x="308" y="258" textAnchor="middle" fontSize="11" fill="#efe6d6" fillOpacity=".5" letterSpacing="2">
          PLAZA
        </text>
        {/* marcador */}
        <g transform="translate(220 150)">
          <circle r="34" fill="#7a1e2c" fillOpacity=".25" />
          <circle r="18" fill="#7a1e2c" />
          <path d="M-5 -6l10 12M5 -6l-10 12" stroke="#efe6d6" strokeWidth="2" strokeLinecap="round" />
        </g>
        <text x="220" y="206" textAnchor="middle" fontSize="14" fill="#efe6d6" style={{ fontFamily: "var(--font-df-serif)" }}>
          Don Filo
        </text>
        {/* norte */}
        <g transform="translate(520 380)" fill="#c29b5a">
          <path d="M0 -16l6 16-6-4-6 4z" />
          <text y="14" textAnchor="middle" fontSize="10">
            N
          </text>
        </g>
      </svg>
      <figcaption className="sr-only">Mapa ilustrativo, no es un mapa real.</figcaption>
    </figure>
  );
}
