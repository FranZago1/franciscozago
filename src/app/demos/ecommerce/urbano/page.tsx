import Image from "next/image";
import { DemoBar } from "@/components/demos/DemoBar";
import { pesos } from "@/demos/ecommerce/shared/formato";
import { IconoDevolucion, IconoRayo, IconoRegla } from "@/demos/ecommerce/shared/Iconos";
import { Cabecera } from "@/demos/ecommerce/urbano/Cabecera";
import { BotonProducto, Capas } from "@/demos/ecommerce/urbano/Capas";
import { Catalogo } from "@/demos/ecommerce/urbano/Catalogo";
import { Countdown } from "@/demos/ecommerce/urbano/Countdown";
import { config, looks, porId } from "@/demos/ecommerce/urbano/datos";
import { AvisoDrop, Newsletter } from "@/demos/ecommerce/urbano/Formularios";

const display = "[font-family:var(--font-pc-display)]";
const sans = "[font-family:var(--font-pc-sans)]";
const foco = "focus-visible:outline-2 focus-visible:outline-offset-2";

const ticker = [
  `Envío gratis desde ${pesos(config.envioGratisDesde)}`,
  `${config.cuotasSinInteres} cuotas sin interés`,
  "Drop 07: Asfalto",
  "Primer cambio gratis",
  "Hecho en Córdoba",
];

function Estrella({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`size-3 shrink-0 ${className}`} aria-hidden="true">
      <path d="M10 0l2.2 7.8L20 10l-7.8 2.2L10 20l-2.2-7.8L0 10l7.8-2.2Z" fill="currentColor" />
    </svg>
  );
}

export default function UrbanoDemo() {
  return (
    <div id="top" className={`min-h-dvh overflow-x-clip bg-[#F3F2EE] text-[#0B0B0B] ${sans}`}>
      <style>{`
        @keyframes pc-ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes pc-giro { to { transform: rotate(360deg) } }
        .pc-ticker { animation: pc-ticker 38s linear infinite }
        .pc-giro { animation: pc-giro 18s linear infinite }
        @media (prefers-reduced-motion: reduce) { .pc-ticker, .pc-giro { animation: none } }
      `}</style>

      <div className="overflow-hidden bg-[#D4FF2E] py-2 text-[11px] font-black tracking-[0.2em] text-[#0B0B0B] uppercase">
        <p className="sr-only">{ticker.join(". ")}.</p>
        <div className="pc-ticker flex w-max" aria-hidden="true">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {[...ticker, ...ticker].map((t, i) => (
                <span key={i} className="flex items-center gap-6 pr-6">
                  {t}
                  <Estrella />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Cabecera />

      <main>
        {/* DROP */}
        <section id="drop" aria-labelledby="drop-titulo" className="relative scroll-mt-16 overflow-hidden bg-[#0B0B0B] text-[#F3F2EE]">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "56px 56px" }}
            aria-hidden="true"
          />
          <div className="relative mx-auto grid max-w-[1440px] gap-10 px-4 pt-10 pb-14 sm:px-8 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-20">
            <div className="flex flex-col">
              <p className="inline-flex w-fit items-center gap-2 border border-[#D4FF2E]/40 px-3 py-1.5 text-[11px] font-bold tracking-[0.2em] text-[#D4FF2E] uppercase">
                <span className="size-2 animate-pulse rounded-full bg-[#D4FF2E] motion-reduce:animate-none" aria-hidden="true" />
                Próximo lanzamiento
              </p>
              <h1 id="drop-titulo" className={`${display} mt-6 text-[clamp(5.2rem,21vw,11.5rem)] leading-[0.82] tracking-[-0.01em] uppercase`}>
                <span className="sr-only">Pampa Club: </span>
                Drop 07
                <span className="block text-transparent [-webkit-text-stroke:2px_#D4FF2E] sm:[-webkit-text-stroke:3px_#D4FF2E]">Asfalto</span>
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
                Nueve piezas en tiradas de 150 unidades. Negro, gris asfalto y un solo verde. Cuando se agotan, no vuelven.
              </p>
              <div className="mt-8">
                <Countdown />
              </div>
              <div className="mt-8 max-w-md">
                <AvisoDrop />
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-square overflow-hidden bg-[#D4FF2E] lg:aspect-auto lg:h-full lg:min-h-[560px]">
                <Image src="/demos/ecommerce/urbano/drop-hero.webp" alt="Hoodie negro del drop Asfalto con estampa verde ácido, sobre fondo verde ácido" fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
                <div className="absolute bottom-0 left-0 bg-[#0B0B0B] px-4 py-3 text-[11px] font-bold tracking-[0.18em] text-white uppercase">Hoodie Asfalto · preview</div>
              </div>
              <svg viewBox="0 0 200 200" className="pc-giro absolute -top-6 -right-2 size-28 text-[#0B0B0B] sm:-top-8 sm:-right-6 sm:size-36" aria-hidden="true">
                <circle cx="100" cy="100" r="96" fill="#F3F2EE" />
                <defs>
                  <path id="pc-circulo" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
                </defs>
                <text fontSize="19" fontWeight="800" letterSpacing="5" fill="currentColor">
                  <textPath href="#pc-circulo">DROP 07 · ASFALTO · 150 U · </textPath>
                </text>
                <text x="100" y="116" textAnchor="middle" fontSize="44" className={display} fill="currentColor">
                  07
                </text>
              </svg>
            </div>
          </div>
          <ul className="relative mx-auto grid max-w-[1440px] grid-cols-3 border-t border-white/10 px-4 text-[10px] font-bold tracking-[0.16em] text-white/60 uppercase sm:px-8 sm:text-xs">
            {[
              ["09", "piezas"],
              ["150", "unidades por modelo"],
              ["24 h", "despacho"],
            ].map(([n, t]) => (
              <li key={t} className="border-r border-white/10 py-5 pr-3 last:border-r-0 [&:not(:first-child)]:pl-3 sm:[&:not(:first-child)]:pl-6">
                <span className={`${display} block text-3xl tracking-normal text-white sm:text-4xl`}>{n}</span>
                {t}
              </li>
            ))}
          </ul>
        </section>

        {/* TIENDA */}
        <section id="tienda" aria-labelledby="tienda-titulo" className="mx-auto max-w-[1440px] scroll-mt-16 px-4 pt-16 pb-20 sm:px-8 md:pt-24">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 id="tienda-titulo" className={`${display} text-[clamp(3.8rem,13vw,8rem)] leading-[0.85] uppercase`}>
              La tienda
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-[#0B0B0B]/65 md:pb-3 md:text-right">
              Temporada invierno 26. Algodón pesado, calces amplios y colores que no piden permiso. Todo hecho en Córdoba.
            </p>
          </div>
          <div className="mt-8">
            <Catalogo />
          </div>
        </section>

        {/* LOOKBOOK */}
        <section id="lookbook" aria-labelledby="lookbook-titulo" className="scroll-mt-16 bg-[#0B0B0B] py-16 text-[#F3F2EE] md:py-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
            <div className="flex items-end justify-between gap-6">
              <h2 id="lookbook-titulo" className={`${display} text-[clamp(3.8rem,13vw,8rem)] leading-[0.85] uppercase`}>
                Lookbook
              </h2>
              <p className="hidden text-xs font-bold tracking-[0.2em] text-white/50 uppercase sm:block">Inv 26 · 3 looks</p>
            </div>
            <p className="mt-4 max-w-md text-white/65">Armados por el equipo, fotografiados en el taller. Tocá cada prenda para ver talles y precio.</p>
          </div>
          <ul className="mx-auto mt-10 flex max-w-[1440px] snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:thin] sm:px-8 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
            {looks.map((l) => (
              <li key={l.id} className="w-[82%] shrink-0 snap-start md:w-auto">
                <figure>
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image src={l.imagen} alt={l.alt} fill sizes="(min-width: 768px) 33vw, 82vw" className="object-cover" />
                    <span className={`${display} absolute right-0 bottom-0 bg-[#0B0B0B] px-3 pt-2 pb-1 text-5xl leading-none text-[#D4FF2E]`} aria-hidden="true">
                      {l.id}
                    </span>
                  </div>
                  <figcaption className="mt-4">
                    <p className={`${display} text-3xl uppercase`}>
                      Look {l.id} <span className="text-[#D4FF2E]">/ {l.titulo}</span>
                    </p>
                    <ul className="mt-3 divide-y divide-white/10 border-y border-white/10">
                      {l.piezas.map((id) => {
                        const p = porId[id];
                        if (!p) return null;
                        return (
                          <li key={id}>
                            <BotonProducto id={id} className={`group flex w-full items-center justify-between gap-3 py-3 text-left text-sm transition-colors hover:text-[#D4FF2E] ${foco} focus-visible:outline-[#D4FF2E]`}>
                              <span>
                                {p.nombre}
                                {p.agotado ? <span className="ml-2 text-[10px] font-bold tracking-[0.16em] text-white/45 uppercase">Agotado</span> : null}
                              </span>
                              <span className="flex items-center gap-3 tabular-nums text-white/70 group-hover:text-[#D4FF2E]">
                                {pesos(p.precio)}
                                <span aria-hidden="true">→</span>
                              </span>
                            </BotonProducto>
                          </li>
                        );
                      })}
                    </ul>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>

        {/* CLUB */}
        <section id="club" aria-labelledby="club-titulo" className="mx-auto max-w-[1440px] scroll-mt-16 px-4 py-20 sm:px-8 md:py-28">
          <p className="text-xs font-bold tracking-[0.2em] text-[#0B0B0B]/55 uppercase">El club</p>
          <h2 id="club-titulo" className={`${display} mt-4 max-w-5xl text-[clamp(2.6rem,7.5vw,6.2rem)] leading-[1] uppercase`}>
            Somos un club de barrio que{" "}
            <span className="bg-[linear-gradient(to_bottom,transparent_14%,#D4FF2E_14%,#D4FF2E_90%,transparent_90%)] px-2 [box-decoration-break:clone]">hace ropa</span> para la calle.
          </h2>
          <ul className="mt-14 grid gap-px border-2 border-[#0B0B0B] bg-[#0B0B0B] md:grid-cols-3">
            {[
              [IconoRayo, "Tiradas cortas", "Cada modelo sale en 150 unidades. Si te gustó, no lo pienses tanto."],
              [IconoRegla, "Calce probado", "Probamos cada molde en diez cuerpos distintos antes de cortarlo."],
              [IconoDevolucion, "Cambios sin vueltas", "El primer cambio es gratis, en el showroom o por correo, dentro de 30 días."],
            ].map(([Icono, t, d]) => {
              const I = Icono as typeof IconoRayo;
              return (
                <li key={t as string} className="bg-[#F3F2EE] p-6 sm:p-8">
                  <I className="size-8" trazo={2} />
                  <h3 className={`${display} mt-6 text-3xl uppercase`}>{t as string}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#0B0B0B]/70">{d as string}</p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* NEWSLETTER */}
        <section aria-labelledby="news-titulo" className="bg-[#D4FF2E]">
          <div className="mx-auto grid max-w-[1440px] items-end gap-8 px-4 py-14 sm:px-8 md:grid-cols-2 md:py-20">
            <div>
              <h2 id="news-titulo" className={`${display} text-[clamp(3.2rem,10vw,6.5rem)] leading-[0.85] uppercase`}>
                Sumate al club
              </h2>
              <p className="mt-4 max-w-md font-medium">10 % off en tu primera compra y acceso 24 horas antes a cada drop. Un mail por mes, no más.</p>
            </div>
            <Newsletter />
          </div>
        </section>
      </main>

      <footer className="bg-[#0B0B0B] pb-28 text-[#F3F2EE]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-10 px-4 pt-14 pb-10 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <p className={`${display} text-5xl uppercase`}>
              Pampa<span className="text-[#D4FF2E]">/</span>Club
            </p>
            <p className="mt-3 max-w-xs text-sm text-white/60">Ropa urbana hecha en Córdoba, Argentina, desde 2019.</p>
          </div>
          {[
            ["Ayuda", ["Envíos y plazos", "Cambios y devoluciones", "Guía de talles", "Preguntas frecuentes"]],
            ["Showroom", ["Barrio Güemes, Córdoba", "Lunes a sábado, 11 a 20 h", "Con turno los domingos"]],
            ["Seguinos", ["Instagram @pampaclub.demo", "TikTok @pampaclub.demo", "Newsletter del club"]],
          ].map(([t, items]) => (
            <div key={t as string}>
              <p className="text-[11px] font-bold tracking-[0.2em] text-[#D4FF2E] uppercase">{t as string}</p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                {(items as string[]).map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 border-t border-white/10 px-4 py-6 text-xs text-white/50 sm:flex-row sm:justify-between sm:px-8">
          <p>Demo con contenido ficticio. Pampa Club no existe: productos, precios y datos son inventados.</p>
          <p>Pagos simulados · Sitio de ejemplo</p>
        </div>
      </footer>

      <Capas />
      <DemoBar
        estilo="Urbano"
        mensaje="Hola Fran, vi la demo Urbano y quiero algo así para mi negocio."
        otrosHref="/demos/ecommerce"
        pregunta="¿Querés uno así?"
      />
    </div>
  );
}
