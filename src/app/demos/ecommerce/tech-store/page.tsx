import Image from "next/image";
import { DemoBar } from "@/components/demos/DemoBar";
import { cuota, pesos } from "@/demos/ecommerce/shared/formato";
import { IconoCamion, IconoDevolucion, IconoEscudo, IconoRayo, IconoTarjeta } from "@/demos/ecommerce/shared/Iconos";
import { BotonDetalle } from "@/demos/ecommerce/tech-store/BotonDetalle";
import { Cabecera, Logo } from "@/demos/ecommerce/tech-store/Cabecera";
import { Capas } from "@/demos/ecommerce/tech-store/Capas";
import { Catalogo } from "@/demos/ecommerce/tech-store/Catalogo";
import { config, porId, productos } from "@/demos/ecommerce/tech-store/datos";

const mono = "[font-family:var(--font-vt-mono)]";
const foco = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F5BFF]";

const badges = [
  [IconoCamion, "Envío gratis", `En compras desde ${pesos(config.envioGratisDesde)}`],
  [IconoRayo, "Llega mañana", "En Córdoba Capital y CABA"],
  [IconoEscudo, "Garantía oficial", "12 meses en todos los productos"],
  [IconoDevolucion, "30 días de devolución", "Sin preguntas, con la caja"],
] as const;

const faqs = [
  ["¿Cómo funcionan las cuotas sin interés?", "Elegís 3, 6 o 12 cuotas al pagar con Mercado Pago. El precio es el mismo que en un pago: no hay recargo. (En esta demo el pago es simulado.)"],
  ["¿Cuándo me llega?", "Los productos con el badge «Llega mañana» salen el mismo día si comprás antes de las 15 h. El resto, en 2 a 5 días hábiles según tu código postal."],
  ["¿Qué cubre la garantía?", "Fallas de fábrica durante 12 meses (24 en algunas notebooks). Lo gestionamos nosotros: no tenés que hablar con la marca."],
  ["¿Hacen factura A?", "Sí. En el checkout real podés cargar el CUIT de tu empresa y te llega la factura por mail."],
];

export default function TechStoreDemo() {
  const ofertas = productos.filter((p) => p.precioAnterior);
  const heroProd = porId["book-14"]!;
  return (
    <div id="top" className="min-h-dvh overflow-x-clip bg-white text-[#16181D]">
      <p className={`${mono} bg-[#16181D] px-4 py-2 text-center text-xs text-white/80`}>
        <span className="text-[#8FA8FF]">{config.cuotasSinInteres} cuotas sin interés</span> · Envío gratis desde {pesos(config.envioGratisDesde)}
        <span className="hidden sm:inline"> · Retiro en sucursal en 2 h</span>
      </p>
      <Cabecera />

      <main>
        {/* HERO */}
        <section className="mx-auto max-w-[1320px] px-4 pt-6 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-[#0C0E13] text-white">
            <div className="grid items-center lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative z-10 p-6 pt-9 sm:p-10 lg:p-14">
                <p className={`${mono} inline-flex items-center gap-2 rounded-md border border-white/15 px-2.5 py-1 text-xs text-white/70`}>
                  <span className="size-1.5 rounded-full bg-[#4ADE80]" aria-hidden="true" /> Semana de notebooks · hasta 14 % off
                </p>
                <h1 className="mt-5 text-[clamp(2.3rem,5.4vw,4.2rem)] leading-[1.02] font-extrabold tracking-[-0.045em]">
                  Tecnología que rinde. <span className="text-[#7E9BFF]">En {config.cuotasSinInteres} cuotas sin interés.</span>
                </h1>
                <p className="mt-5 max-w-md text-lg text-white/65">Notebooks, celulares y audio de marcas con garantía oficial. Compará specs lado a lado antes de decidir.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="#catalogo" className={`inline-flex h-12 items-center rounded-xl bg-[#2F5BFF] px-6 font-semibold shadow-[0_10px_30px_-10px_rgba(47,91,255,0.9)] transition-colors hover:bg-[#2249E0] ${foco}`}>
                    Ver catálogo
                  </a>
                  <BotonDetalle id={heroProd.id} className={`inline-flex h-12 items-center rounded-xl border border-white/20 px-6 font-semibold transition-colors hover:bg-white/10 ${foco}`}>
                    {heroProd.nombre} · {pesos(heroProd.precio)}
                  </BotonDetalle>
                </div>
                <dl className={`${mono} mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6 text-xs text-white/55`}>
                  {[
                    ["14 h", "de batería"],
                    ["1,3 kg", "de peso"],
                    ["2.2K", "de pantalla"],
                  ].map(([a, b]) => (
                    <div key={b}>
                      <dt className="sr-only">{b}</dt>
                      <dd>
                        <span className="block text-2xl font-semibold text-white">{a}</span>
                        {b}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[520px]">
                <Image src="/demos/ecommerce/tech-store/hero-setup.webp" alt="Notebook plateada, celular azul y auriculares grafito sobre fondo oscuro con luz azul" fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0C0E13] via-transparent to-transparent max-lg:bg-gradient-to-t" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        {/* BADGES */}
        <section aria-label="Beneficios" className="mx-auto max-w-[1320px] px-4 pt-6 sm:px-6">
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {badges.map(([Icono, t, d]) => (
              <li key={t} className="flex flex-col items-start gap-2.5 rounded-2xl bg-[#F3F5F8] p-4 sm:flex-row sm:gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-[#2F5BFF] shadow-sm">
                  <Icono className="size-5" trazo={1.8} />
                </span>
                <div>
                  <p className="text-sm font-bold">{t}</p>
                  <p className="text-xs text-[#16181D]/60">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* OFERTAS */}
        <section id="ofertas" aria-labelledby="ofertas-titulo" className="mx-auto max-w-[1320px] scroll-mt-24 px-4 pt-16 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className={`${mono} text-xs tracking-[0.12em] text-[#2F5BFF] uppercase`}>Ofertas de la semana</p>
              <h2 id="ofertas-titulo" className="mt-1 text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">
                Precios que bajaron
              </h2>
            </div>
          </div>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {ofertas.map((p) => {
              const off = Math.round((1 - p.precio / (p.precioAnterior ?? p.precio)) * 100);
              return (
                <li key={p.id}>
                  <BotonDetalle id={p.id} label={`${p.nombre}, ${off} % off, ${pesos(p.precio)}. Ver detalle`} className={`group flex w-full items-center gap-4 rounded-2xl border border-[#16181D]/8 p-3 text-left transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(22,24,29,0.35)] ${foco}`}>
                    <span className="relative size-28 shrink-0 overflow-hidden rounded-xl bg-[#EEF1F5] sm:size-32">
                      <Image src={p.imagen} alt="" fill sizes="128px" className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none" />
                    </span>
                    <span className="min-w-0">
                      <span className={`${mono} inline-block rounded-md bg-[#2F5BFF] px-1.5 py-0.5 text-xs font-semibold text-white`}>-{off}%</span>
                      <span className="mt-2 block font-semibold">{p.nombre}</span>
                      <span className="block text-xs text-[#16181D]/45 line-through tabular-nums">{pesos(p.precioAnterior ?? 0)}</span>
                      <span className="block text-xl font-bold tracking-[-0.02em] tabular-nums">{pesos(p.precio)}</span>
                      <span className="block text-xs text-[#0F8A5F]">
                        12 × {pesos(cuota(p.precio, 12))} sin interés
                      </span>
                    </span>
                  </BotonDetalle>
                </li>
              );
            })}
          </ul>
        </section>

        {/* CATÁLOGO */}
        <section id="catalogo" aria-labelledby="catalogo-titulo" className="mx-auto max-w-[1320px] scroll-mt-24 px-4 pt-16 pb-20 sm:px-6">
          <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <h2 id="catalogo-titulo" className="text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">
              Catálogo
            </h2>
            <p className="text-sm text-[#16181D]/60">Combiná filtros y tildá «Comparar» en hasta 3 productos.</p>
          </div>
          <Catalogo />
        </section>

        {/* AYUDA */}
        <section id="ayuda" aria-labelledby="ayuda-titulo" className="scroll-mt-24 border-t border-[#16181D]/8 bg-[#F3F5F8]">
          <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 id="ayuda-titulo" className="text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">
                Envíos, cuotas y garantía
              </h2>
              <p className="mt-3 max-w-sm text-[#16181D]/60">Lo que más nos preguntan antes de comprar. Si te queda una duda, escribinos y te responde una persona.</p>
              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white p-4">
                <span className="grid size-11 place-items-center rounded-xl bg-[#EEF2FF] text-[#2F5BFF]">
                  <IconoTarjeta className="size-5" />
                </span>
                <p className="text-sm">
                  <strong className="block">Pagás con Mercado Pago</strong>
                  <span className="text-[#16181D]/60">Tarjetas de crédito, débito o dinero en cuenta.</span>
                </p>
              </div>
            </div>
            <div className="divide-y divide-[#16181D]/10 rounded-2xl bg-white px-5">
              {faqs.map(([q, a]) => (
                <details key={q} className="group py-1">
                  <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg py-4 font-semibold [&::-webkit-details-marker]:hidden ${foco}`}>
                    {q}
                    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#F3F5F8] text-lg leading-none transition-transform group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="pb-4 text-[#16181D]/70">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0C0E13] text-white">
        <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-10 px-4 pt-14 pb-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-white/55">Tecnología con garantía oficial, envíos a todo el país y atención de personas.</p>
          </div>
          {[
            ["Categorías", ["Notebooks", "Celulares", "Audio", "Relojes"]],
            ["Ayuda", ["Envíos", "Garantía", "Devoluciones", "Factura A"]],
            ["Sucursal", ["Nueva Córdoba, Córdoba", "Lun a sáb, 10 a 20 h", "@voltio.demo"]],
          ].map(([t, items]) => (
            <div key={t as string}>
              <p className={`${mono} text-xs tracking-[0.12em] text-white/45 uppercase`}>{t as string}</p>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                {(items as string[]).map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mx-auto max-w-[1320px] border-t border-white/10 px-4 pt-6 pb-32 text-xs text-white/45 sm:px-6">
          Demo con contenido ficticio. Voltio y las marcas Nodo, Kairo, Sónica y Vektra no existen: productos, precios y cuotas son inventados.
        </p>
      </footer>

      <Capas />
      <DemoBar estilo="Tech store" mensaje="Hola Fran, vi la demo Tech store y quiero algo así para mi negocio." otrosHref="/demos/ecommerce" pregunta="¿Querés uno así?" />
    </div>
  );
}
