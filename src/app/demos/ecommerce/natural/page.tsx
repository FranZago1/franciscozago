import Image from "next/image";
import { DemoBar } from "@/components/demos/DemoBar";
import { pesos } from "@/demos/ecommerce/shared/formato";
import { Estrellas, IconoDevolucion, IconoGota, IconoHoja, IconoCorazon } from "@/demos/ecommerce/shared/Iconos";
import { Cabecera, Logo } from "@/demos/ecommerce/natural/Cabecera";
import { BotonFicha, BotonProducto, BotonRutina, Capas, Resenas } from "@/demos/ecommerce/natural/Capas";
import { Catalogo } from "@/demos/ecommerce/natural/Catalogo";
import { config, distribucion, ingredientes, porId, resenas, rutinas } from "@/demos/ecommerce/natural/datos";
import { Ilustracion } from "@/demos/ecommerce/natural/Ilustracion";
import { Newsletter } from "@/demos/ecommerce/natural/Newsletter";
import { BotonQuiz } from "@/demos/ecommerce/natural/Quiz";

const serif = "[font-family:var(--font-hb-serif)]";
const foco = "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4A5634]";
const botonPrimario = `inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#4A5634] px-7 font-semibold text-[#F6F5EF] transition-all hover:bg-[#3A452A] hover:shadow-[0_10px_24px_-10px_rgba(58,69,42,0.7)] active:scale-[0.98] ${foco}`;

const valores = [
  [IconoHoja, "98 % de origen natural", "Sin siliconas, parabenos ni fragancias sintéticas."],
  [IconoCorazon, "Veganos y cruelty free", "Nada se prueba en animales, nunca."],
  [IconoDevolucion, "Vidrio retornable", "Devolvé 5 envases y te regalamos un jabón."],
  [IconoGota, "Tandas chicas", "Hacemos poco y seguido: todo llega fresco."],
] as const;

export default function NaturalDemo() {
  const totalResenas = 2140;
  return (
    <div id="top" className="min-h-dvh overflow-x-clip bg-[#F6F5EF] text-[#2D3524] selection:bg-[#E3B9AC]">
      <p className="bg-[#4A5634] px-4 py-2 text-center text-[13px] text-[#F6F5EF]">
        Envío gratis desde {pesos(config.envioGratisDesde)} <span className="mx-2 opacity-50">·</span>
        <span className="hidden sm:inline">
          {config.cuotasSinInteres} cuotas sin interés <span className="mx-2 opacity-50">·</span>
        </span>
        Fórmulas veganas
      </p>
      <Cabecera />

      <main>
        {/* HERO */}
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pt-10 pb-16 sm:px-8 md:grid-cols-[1.05fr_1fr] md:gap-12 md:pt-16 lg:pb-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[#E6EADB] px-3.5 py-1.5 text-sm text-[#4A5634]">
              <IconoHoja className="size-4" /> Cosmética natural hecha en Mendoza
            </p>
            <h1 className={`${serif} mt-6 text-[clamp(2.9rem,7.4vw,5.6rem)] leading-[1.02] font-light tracking-[-0.02em]`}>
              Cuidado simple, <em className="font-normal text-[#8E4F43]">de la tierra</em> a tu piel.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#2D3524]/75">
              Fórmulas cortas, con ingredientes que podés pronunciar. Elegí una rutina armada o hacé el test y te decimos por dónde empezar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <BotonQuiz className={botonPrimario}>Hacé el test de piel · 1 min</BotonQuiz>
              <a href="#rutinas" className={`inline-flex min-h-13 items-center justify-center rounded-full border border-[#2D3524]/25 px-7 font-semibold transition-colors hover:border-[#2D3524] hover:bg-white ${foco}`}>
                Ver rutinas
              </a>
            </div>
            <div className="mt-9 flex items-center gap-4">
              <div className="flex -space-x-2" aria-hidden="true">
                {["#E3B9AC", "#B8C4A6", "#DAD6CA", "#C9A24E"].map((c, i) => (
                  <span key={c} className="grid size-9 place-items-center rounded-full border-2 border-[#F6F5EF] text-xs font-semibold text-[#2D3524]" style={{ background: c }}>
                    {"LCMS"[i]}
                  </span>
                ))}
              </div>
              <div className="text-sm">
                <Estrellas valor={4.8} colorLleno="#B8743F" colorVacio="#2D3524" />
                <p className="mt-0.5 text-[#2D3524]/72">
                  <strong className="text-[#2D3524]">4,8</strong> en {totalResenas.toLocaleString("es-AR")} reseñas verificadas
                </p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative mx-auto aspect-[4/5] max-w-[520px] overflow-hidden rounded-t-[999px] rounded-b-[2.5rem] bg-[#B8C4A6]">
              <Image src="/demos/ecommerce/natural/hero-coleccion.webp" alt="Frasco dosificador blanco junto a una toalla enrollada, una vela y un ramo de tulipanes rosas" fill priority sizes="(min-width: 768px) 520px, 100vw" className="object-cover" />
            </div>
            <div className="absolute bottom-6 -left-1 rounded-3xl bg-[#F6F5EF] p-4 shadow-[0_20px_40px_-20px_rgba(45,53,36,0.45)] sm:left-0 md:-left-6">
              <p className={`${serif} text-3xl`}>98 %</p>
              <p className="text-sm text-[#2D3524]/72">de origen natural</p>
            </div>
            <div className="absolute top-10 right-0 hidden items-center gap-2 rounded-full bg-[#F6F5EF] py-2 pr-4 pl-2 text-sm shadow-[0_16px_30px_-18px_rgba(45,53,36,0.5)] sm:flex md:-right-4">
              <span className="grid size-8 place-items-center rounded-full bg-[#ECEEE3]">
                <Ilustracion id="calendula" className="size-7" />
              </span>
              Caléndula de huerta propia
            </div>
          </div>
        </section>

        {/* VALORES */}
        <section aria-label="Por qué Hoja & Barro" className="border-y border-[#2D3524]/10 bg-[#ECEEE3]/60">
          <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-8 px-4 py-10 sm:px-8 lg:grid-cols-4">
            {valores.map(([Icono, t, d]) => (
              <li key={t} className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#F6F5EF] text-[#6F7A4E]">
                  <Icono className="size-5" />
                </span>
                <div>
                  <p className="font-semibold">{t}</p>
                  <p className="mt-0.5 text-sm leading-snug text-[#2D3524]/72">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* RUTINAS */}
        <section id="rutinas" aria-labelledby="rutinas-titulo" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-8 md:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#8E4F43]">Armadas por nuestra cosmetóloga</p>
            <h2 id="rutinas-titulo" className={`${serif} mt-2 text-[clamp(2.4rem,5vw,3.8rem)] leading-[1.05] font-light`}>
              Rutinas armadas, <em>sin pensar de más</em>
            </h2>
            <p className="mt-4 text-lg text-[#2D3524]/72">Tres pasos que funcionan juntos. Las agregás al carrito de una vez y después ajustás lo que quieras.</p>
          </div>
          <ul className="mt-12 grid gap-6 lg:grid-cols-3">
            {rutinas.map((r) => {
              const total = r.pasos.reduce((s, p) => s + (porId[p.id]?.precio ?? 0), 0);
              return (
                <li key={r.id} className="flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_1px_0_rgba(45,53,36,0.05)]">
                  <div className="relative aspect-[4/3]" style={{ background: r.color }}>
                    <Image src={r.imagen} alt={r.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-sm text-[#2D3524]/72">{r.para}</p>
                    <h3 className={`${serif} mt-1 text-3xl`}>{r.nombre}</h3>
                    <ol className="mt-5 space-y-1">
                      {r.pasos.map((x, i) => {
                        const p = porId[x.id];
                        if (!p) return null;
                        return (
                          <li key={x.id}>
                            <BotonProducto id={x.id} className={`flex w-full items-center gap-3 rounded-2xl p-1.5 text-left transition-colors hover:bg-[#F1F2EA] ${foco}`}>
                              <span className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-[#E3E6D8]">
                                <Image src={p.imagen} alt="" fill sizes="48px" className="object-cover" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-xs text-[#2D3524]/72">
                                  Paso {i + 1} · {x.momento}
                                </span>
                                <span className="block truncate font-medium">{p.nombre}</span>
                              </span>
                              <span className="text-sm text-[#2D3524]/72 tabular-nums">{pesos(p.precio)}</span>
                            </BotonProducto>
                          </li>
                        );
                      })}
                    </ol>
                    <div className="mt-auto pt-6">
                      <p className="mb-3 flex items-baseline justify-between border-t border-[#2D3524]/10 pt-4">
                        <span className="text-sm text-[#2D3524]/72">Total de la rutina</span>
                        <span className="text-xl font-semibold tabular-nums">{pesos(total)}</span>
                      </p>
                      <BotonRutina id={r.id} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="relative mt-16 overflow-hidden rounded-[2.5rem] bg-[#B8C4A6] px-6 py-10 sm:px-12 md:py-14">
            <div className="pointer-events-none absolute -right-8 -bottom-3 opacity-80 sm:right-10" aria-hidden="true">
              <Ilustracion id="aloe" className="size-56 sm:size-64" />
            </div>
            <div className="relative max-w-xl">
              <h2 className={`${serif} text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.08] font-light`}>¿No sabés por dónde empezar?</h2>
              <p className="mt-3 text-lg text-[#2D3524]/85">Respondé 3 preguntas cortas y te recomendamos la rutina que va con tu piel. La podés sumar al carrito en un toque.</p>
              <BotonQuiz className={`${botonPrimario} mt-7`}>Empezar el test</BotonQuiz>
            </div>
          </div>
        </section>

        {/* TIENDA */}
        <section id="tienda" aria-labelledby="tienda-titulo" className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-20 sm:px-8 md:pb-28">
          <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <h2 id="tienda-titulo" className={`${serif} text-[clamp(2.4rem,5vw,3.8rem)] leading-[1.05] font-light`}>
              La tienda
            </h2>
            <p className="max-w-sm text-[#2D3524]/72">Todo se hace en tandas chicas en nuestro taller. Si algo se agota, vuelve en dos semanas.</p>
          </div>
          <Catalogo />
        </section>

        {/* INGREDIENTES */}
        <section id="ingredientes" aria-labelledby="ing-titulo" className="scroll-mt-20 bg-[#EFE3DC]">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-8 md:py-28">
            <div className="grid gap-6 md:grid-cols-2 md:items-end">
              <h2 id="ing-titulo" className={`${serif} text-[clamp(2.4rem,5vw,3.8rem)] leading-[1.05] font-light`}>
                Ingredientes <em>a la vista</em>
              </h2>
              <p className="text-lg text-[#2D3524]/72 md:justify-self-end md:text-right">Sabemos de dónde viene cada uno. Tocá una ficha para ver origen, qué hace y en qué productos está.</p>
            </div>
            <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {ingredientes.map((i) => (
                <li key={i.id}>
                  <BotonFicha
                    id={i.id}
                    className={`group flex h-full w-full flex-col items-start rounded-[2rem] bg-[#F6F5EF] p-5 text-left transition-all hover:-translate-y-1 hover:shadow-[0_24px_40px_-24px_rgba(45,53,36,0.45)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7 ${foco}`}
                  >
                    <span className="grid size-20 place-items-center rounded-full bg-[#ECEEE3] transition-transform duration-500 group-hover:rotate-6 motion-reduce:transition-none sm:size-24">
                      <Ilustracion id={i.id} className="size-16 sm:size-20" />
                    </span>
                    <span className={`${serif} mt-5 block text-2xl leading-tight sm:text-3xl`}>{i.nombre}</span>
                    <span className="mt-1 block text-sm text-[#2D3524]/72 italic">{i.cientifico}</span>
                    <span className="mt-3 hidden text-[#2D3524]/75 sm:block">{i.resumen}</span>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-[#8E4F43]">
                      Ver ficha <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                    </span>
                  </BotonFicha>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* RESEÑAS */}
        <section id="resenas" aria-labelledby="res-titulo" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-8 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[320px_1fr]">
            <div>
              <h2 id="res-titulo" className={`${serif} text-[clamp(2.4rem,5vw,3.8rem)] leading-[1.05] font-light`}>
                Reseñas
              </h2>
              <div className="mt-6 flex items-end gap-4">
                <p className={`${serif} text-7xl leading-none`}>4,8</p>
                <div className="pb-1">
                  <Estrellas valor={4.8} className="size-5" colorLleno="#B8743F" colorVacio="#2D3524" />
                  <p className="mt-1 text-sm text-[#2D3524]/72">{totalResenas.toLocaleString("es-AR")} reseñas</p>
                </div>
              </div>
              <dl className="mt-6 space-y-2">
                {distribucion.map(([e, pct]) => (
                  <div key={e} className="grid grid-cols-[3.2rem_1fr_2.5rem] items-center gap-3 text-sm">
                    <dt>{e} estr.</dt>
                    <dd className="h-2 overflow-hidden rounded-full bg-[#2D3524]/10">
                      <span className="block h-full rounded-full bg-[#B8743F]" style={{ width: `${pct}%` }} />
                    </dd>
                    <dd className="text-right text-[#2D3524]/72 tabular-nums">{pct} %</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-sm text-[#2D3524]/72">Solo publicamos reseñas de compras verificadas. No borramos las malas.</p>
            </div>
            <div className="min-w-0">
              <Resenas lista={resenas} />
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section aria-labelledby="news-titulo" className="px-3 sm:px-6">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#3F4A2C] px-6 py-14 text-[#F6F5EF] sm:px-12 md:py-20">
            <div className="pointer-events-none absolute -top-10 -right-10 opacity-20" aria-hidden="true">
              <Ilustracion id="rosa-mosqueta" className="size-72" />
            </div>
            <div className="relative grid gap-8 md:grid-cols-2 md:items-end">
              <div>
                <h2 id="news-titulo" className={`${serif} text-[clamp(2.2rem,4.6vw,3.4rem)] leading-[1.05] font-light`}>
                  Una carta por mes, <em>con rutinas de estación</em>
                </h2>
                <p className="mt-3 text-[#F6F5EF]/75">Y 10 % off en tu primera compra. Te podés dar de baja cuando quieras.</p>
              </div>
              <Newsletter />
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-7xl px-4 pt-16 pb-32 sm:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <Logo className="text-3xl" />
            <p className="mt-3 max-w-xs text-sm text-[#2D3524]/72">Cosmética natural hecha a mano en Chacras de Coria, Mendoza.</p>
          </div>
          {[
            ["Tienda", ["Rostro", "Cuerpo", "Labios", "Cabello"]],
            ["Ayuda", ["Envíos", "Cambios", "Envases retornables"]],
            ["Taller", ["Chacras de Coria, Mendoza", "Lunes a viernes, 10 a 18 h", "@hojaybarro.demo"]],
          ].map(([t, items]) => (
            <div key={t as string}>
              <p className="text-sm font-semibold">{t as string}</p>
              <ul className="mt-3 space-y-2 text-sm text-[#2D3524]/72">
                {(items as string[]).map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-12 border-t border-[#2D3524]/10 pt-6 text-sm text-[#2D3524]/72">
          Demo con contenido ficticio. Hoja &amp; Barro no existe: productos, reseñas y precios son inventados.
        </p>
      </footer>

      <Capas />
      <DemoBar estilo="Natural" mensaje="Hola Fran, vi la demo Natural y quiero algo así para mi negocio." otrosHref="/demos/ecommerce" pregunta="¿Querés uno así?" />
    </div>
  );
}
