import Image from "next/image";
import { DemoBar } from "@/components/demos/DemoBar";
import { Icono, type NombreIcono } from "@/demos/landing/shared/Icono";
import { Calculadora } from "@/demos/landing/tech/Calculadora";
import { comparativa, pasos, planes, testimonios } from "@/demos/landing/tech/datos";
import { Encabezado, Logo } from "@/demos/landing/tech/Encabezado";
import { Faq } from "@/demos/landing/tech/Faq";
import { FormularioPrueba } from "@/demos/landing/tech/FormularioPrueba";
import { Funciones } from "@/demos/landing/tech/Funciones";
import { Logos } from "@/demos/landing/tech/Logos";
import { PanelMock } from "@/demos/landing/tech/PanelMock";
import { Precios } from "@/demos/landing/tech/Precios";

const sans = "[font-family:var(--font-cc-sans)]";
const mono = "[font-family:var(--font-cc-mono)]";
const wrap = "mx-auto w-full max-w-[1200px] px-5 sm:px-8";

const estilos = `
@keyframes cc-aparecer { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
@keyframes cc-crecer { from { transform: scaleY(0) } to { transform: scaleY(1) } }
@keyframes cc-fila { from { opacity: 0; transform: translateY(-10px) } to { opacity: 1; transform: none } }
@keyframes cc-subir { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: none } }
.cc-aparecer { animation: cc-aparecer .45s cubic-bezier(.2,.7,.2,1) both }
.cc-barra { transform-origin: bottom; animation: cc-crecer .9s cubic-bezier(.2,.7,.2,1) both }
.cc-fila-nueva { animation: cc-fila .5s cubic-bezier(.2,.7,.2,1) both }
.cc-subir { animation: cc-subir .9s cubic-bezier(.2,.7,.2,1) both }
.cc-rango { -webkit-appearance: none; appearance: none; height: 28px; background: transparent; cursor: pointer }
.cc-rango::-webkit-slider-runnable-track { height: 6px; border-radius: 999px; background: linear-gradient(to right, #4F46E5 var(--pct), #E2E8F0 var(--pct)) }
.cc-rango::-moz-range-track { height: 6px; border-radius: 999px; background: linear-gradient(to right, #4F46E5 var(--pct), #E2E8F0 var(--pct)) }
.cc-rango::-webkit-slider-thumb { -webkit-appearance: none; margin-top: -9px; width: 24px; height: 24px; border-radius: 999px; background: #fff; border: 2px solid #4F46E5; box-shadow: 0 4px 12px -2px rgba(79,70,229,.45); transition: transform .15s }
.cc-rango::-moz-range-thumb { width: 20px; height: 20px; border-radius: 999px; background: #fff; border: 2px solid #4F46E5; box-shadow: 0 4px 12px -2px rgba(79,70,229,.45) }
.cc-rango:active::-webkit-slider-thumb { transform: scale(1.12) }
.cc-rango:focus-visible { outline: none }
.cc-rango:focus-visible::-webkit-slider-thumb { outline: 3px solid #A5B4FC; outline-offset: 2px }
.cc-rango:focus-visible::-moz-range-thumb { outline: 3px solid #A5B4FC; outline-offset: 2px }
@media (prefers-reduced-motion: reduce) { .cc-aparecer, .cc-barra, .cc-fila-nueva, .cc-subir { animation: none } }`;

function Rotulo({ children, claro = false }: { children: React.ReactNode; claro?: boolean }) {
  return (
    <p className={`${mono} text-[12px] font-medium tracking-[0.14em] uppercase ${claro ? "text-indigo-300" : "text-[#4F46E5]"}`}>{children}</p>
  );
}

function Celda({ v }: { v: boolean | string }) {
  if (v === true)
    return (
      <span className="inline-flex size-6 items-center justify-center rounded-full bg-indigo-50 text-[#4F46E5]">
        <Icono nombre="check" grosor={2.4} className="size-3.5" />
        <span className="sr-only">Incluido</span>
      </span>
    );
  if (v === false)
    return (
      <span className="text-slate-300">
        <Icono nombre="menos" grosor={2} className="mx-auto size-4" />
        <span className="sr-only">No incluido</span>
      </span>
    );
  return <span className="text-slate-700">{v}</span>;
}

export default function TechDemo() {
  return (
    <div
      className={`min-h-dvh overflow-x-clip bg-[#FAFAFB] pb-28 text-slate-900 antialiased ${sans} selection:bg-indigo-100`}
      style={{ "--color-accent": "#4F46E5" } as React.CSSProperties}
    >
      <style>{estilos}</style>
      <Encabezado />

      <main>
        {/* HERO */}
        <section id="inicio" aria-labelledby="cc-hero" className="relative -mt-16 overflow-hidden pt-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
          />
          <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.22),transparent)]" />
          <div className={`${wrap} relative pt-14 text-center md:pt-24`}>
            <a
              href="#funciones"
              className="cc-subir inline-flex items-center gap-2 rounded-full bg-white py-1 pr-3 pl-1 text-[13px] text-slate-600 shadow-sm ring-1 ring-slate-200 transition-colors hover:ring-slate-300"
            >
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[12px] font-medium text-[#4F46E5]">Nuevo</span>
              Alertas de recategorización 2026
              <Icono nombre="flecha" grosor={1.8} className="size-3.5" />
            </a>
            <h1
              id="cc-hero"
              className="cc-subir mx-auto mt-7 max-w-4xl text-[clamp(2.6rem,7.2vw,5.2rem)] leading-[1.02] font-semibold tracking-[-0.045em] text-balance"
              style={{ animationDelay: "0.08s" }}
            >
              Facturá en segundos.{" "}
              <span className="bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#4F46E5] bg-clip-text text-transparent">Cobrá sin perseguir a nadie.</span>
            </h1>
            <p className="cc-subir mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl" style={{ animationDelay: "0.16s" }}>
              Cuentaclara es la app de facturación electrónica para monotributistas y pymes. Emitís, enviás y cobrás tus
              facturas desde un solo lugar, en la compu o en el celular.
            </p>
            <div className="cc-subir mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: "0.24s" }}>
              <a
                href="#prueba"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/25 transition-[background-color,transform] hover:bg-[#4338CA] active:scale-[0.98] sm:w-auto"
              >
                Probá gratis 14 días
                <Icono nombre="flecha" grosor={2} className="size-4" />
              </a>
              <a
                href="#como-funciona"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-800 ring-1 ring-slate-200 transition-colors hover:bg-slate-50 sm:w-auto"
              >
                <Icono nombre="play" relleno grosor={0} className="size-3.5 text-[#4F46E5]" />
                Ver cómo funciona
              </a>
            </div>
            <ul className="cc-subir mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-500" style={{ animationDelay: "0.3s" }}>
              {["Sin tarjeta", "Lista en 2 minutos", "Cancelás cuando quieras"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Icono nombre="check" grosor={2.2} className="size-4 text-emerald-500" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className={`${wrap} cc-subir relative mt-14 max-w-[1140px] md:mt-20`} style={{ animationDelay: "0.4s" }}>
            <div aria-hidden="true" className="absolute inset-x-10 -top-6 bottom-10 rounded-[40px] bg-gradient-to-b from-indigo-200/60 via-violet-100/40 to-transparent blur-2xl" />
            <div className="relative">
              <PanelMock />
            </div>
            <p className="sr-only">
              Vista previa del panel de Cuentaclara: facturado y cobrado del mes, últimas facturas con su estado y gráfico de facturación
              mensual.
            </p>
          </div>
        </section>

        {/* LOGOS */}
        <section aria-labelledby="cc-logos" className="py-20 md:py-24">
          <div className={wrap}>
            <h2 id="cc-logos" className="text-center text-[15px] text-slate-500">
              Más de <strong className="font-semibold text-slate-800">12.000 monotributistas y pymes</strong> facturan con Cuentaclara
            </h2>
            <div className="mt-10">
              <Logos />
            </div>
          </div>
        </section>

        {/* FUNCIONES */}
        <section id="funciones" aria-labelledby="cc-fun" className="scroll-mt-16 py-20 md:py-28">
          <div className={wrap}>
            <div className="max-w-2xl">
              <Rotulo>Funciones</Rotulo>
              <h2 id="cc-fun" className="mt-4 text-[clamp(2rem,4.6vw,3.3rem)] leading-[1.08] font-semibold tracking-[-0.035em]">
                Todo lo que hacés con tus facturas, en un solo lugar.
              </h2>
            </div>
            <div className="mt-12">
              <Funciones />
            </div>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section id="como-funciona" aria-labelledby="cc-como" className="scroll-mt-16 py-20 md:py-28">
          <div className={wrap}>
            <div className="mx-auto max-w-2xl text-center">
              <Rotulo>Cómo funciona</Rotulo>
              <h2 id="cc-como" className="mt-4 text-[clamp(2rem,4.6vw,3.3rem)] leading-[1.08] font-semibold tracking-[-0.035em]">
                De cero a tu primera factura en tres pasos.
              </h2>
            </div>
            <ol className="relative mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
              <span aria-hidden="true" className="absolute top-12 right-[16%] left-[16%] hidden border-t-2 border-dashed border-indigo-200 md:block" />
              {pasos.map((p, i) => {
                const icono: NombreIcono[] = ["candado", "grupo", "rayo"];
                return (
                  <li key={p.titulo} className="relative rounded-3xl bg-white p-7 ring-1 ring-slate-200/80 transition-shadow duration-300 hover:shadow-[0_24px_48px_-30px_rgba(30,27,75,0.35)]">
                    <div className="flex items-center justify-between">
                      <span className="flex size-12 items-center justify-center rounded-2xl bg-[#4F46E5] text-white shadow-lg shadow-indigo-600/25">
                        <Icono nombre={icono[i]!} grosor={1.8} className="size-5" />
                      </span>
                      <span className={`${mono} text-sm text-slate-400`}>0{i + 1}</span>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold tracking-tight">{p.titulo}</h3>
                    <p className="mt-2 leading-relaxed text-slate-600">{p.texto}</p>
                    <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[13px] text-slate-600 ring-1 ring-slate-200/70">
                      <Icono nombre="check" grosor={2.2} className="size-3.5 text-emerald-500" />
                      {p.detalle}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* CALCULADORA */}
        <section id="calculadora" aria-labelledby="cc-calc" className="scroll-mt-16 border-y border-slate-200/70 bg-gradient-to-b from-indigo-50/50 to-[#FAFAFB] py-20 md:py-28">
          <div className={wrap}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-end">
              <div>
                <Rotulo>Calculadora</Rotulo>
                <h2 id="cc-calc" className="mt-4 text-[clamp(2rem,4.6vw,3.3rem)] leading-[1.08] font-semibold tracking-[-0.035em]">
                  ¿Cuánto tiempo te devuelve Cuentaclara?
                </h2>
              </div>
              <p className="max-w-md text-lg leading-relaxed text-slate-600 lg:justify-self-end">
                Mové los controles con tus números reales. La cuenta se hace sola, como tus facturas.
              </p>
            </div>
            <div className="mt-12">
              <Calculadora />
            </div>
          </div>
        </section>

        {/* PRECIOS */}
        <section id="precios" aria-labelledby="cc-precios" className="scroll-mt-16 py-20 md:py-28">
          <div className={wrap}>
            <div className="mx-auto max-w-2xl text-center">
              <Rotulo>Precios</Rotulo>
              <h2 id="cc-precios" className="mt-4 text-[clamp(2rem,4.6vw,3.3rem)] leading-[1.08] font-semibold tracking-[-0.035em]">
                Un precio claro, como el nombre.
              </h2>
              <p className="mt-4 text-lg text-slate-600">Empezá gratis y pasate de plan cuando lo necesites.</p>
            </div>
            <div className="mt-10">
              <Precios />
            </div>

            <div className="mt-20">
              <h3 className="text-center text-2xl font-semibold tracking-tight">Compará los planes</h3>
              <div className="relative mt-8 overflow-x-auto rounded-2xl bg-white ring-1 ring-slate-200/80">
                <table className="w-full table-fixed text-left text-[13px] sm:min-w-[640px] sm:table-auto sm:text-[15px]">
                  <caption className="sr-only">Comparativa de funciones por plan</caption>
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th scope="col" className="w-[38%] bg-white px-3 py-4 text-xs font-medium text-slate-500 sm:sticky sm:left-0 sm:w-auto sm:px-5 sm:text-sm">
                        Función
                      </th>
                      {planes.map((p) => (
                        <th key={p.id} scope="col" className={`px-1.5 py-4 text-center font-semibold sm:px-5 ${p.destacado ? "text-[#4F46E5]" : ""}`}>
                          <span className="sm:hidden">{p.id === "monotributo" ? "Monotrib." : p.nombre}</span>
                          <span className="hidden sm:inline">{p.nombre}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparativa.map(([f, ...vals]) => (
                      <tr key={f} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                        <th scope="row" className="bg-white px-3 py-3 font-normal text-slate-700 sm:sticky sm:left-0 sm:px-5 sm:py-3.5">
                          {f}
                        </th>
                        {vals.map((v, i) => (
                          <td key={i} className={`px-1.5 py-3 text-center sm:px-5 sm:py-3.5 ${i === 1 ? "bg-indigo-50/40" : ""}`}>
                            <Celda v={v} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIOS */}
        <section id="clientes" aria-labelledby="cc-test" className="scroll-mt-16 bg-slate-950 py-20 text-white md:py-28">
          <div className={wrap}>
            <div className="max-w-2xl">
              <Rotulo claro>Clientes</Rotulo>
              <h2 id="cc-test" className="mt-4 text-[clamp(2rem,4.6vw,3.3rem)] leading-[1.08] font-semibold tracking-[-0.035em]">
                Menos planillas, más tiempo para lo tuyo.
              </h2>
            </div>
            <ul className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {testimonios.map((t) => (
                <li key={t.nombre} className="flex flex-col rounded-3xl bg-white/[0.04] p-7 ring-1 ring-white/10">
                  <p className="text-4xl font-semibold tracking-[-0.04em] text-white">{t.metrica}</p>
                  <p className="mt-1 text-sm text-indigo-300">{t.metricaTexto}</p>
                  <blockquote className="mt-6 flex-1 leading-relaxed text-slate-300">“{t.texto}”</blockquote>
                  <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
                    <Image src={t.imagen} alt={t.alt} width={44} height={44} sizes="44px" className="size-11 rounded-full" />
                    <div>
                      <p className="font-medium">{t.nombre}</p>
                      <p className="text-sm text-slate-400">{t.rol}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="cc-faq" className="scroll-mt-16 py-20 md:py-28">
          <div className={`${wrap} grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16`}>
            <div>
              <Rotulo>Preguntas frecuentes</Rotulo>
              <h2 id="cc-faq" className="mt-4 text-[clamp(2rem,4.6vw,3.3rem)] leading-[1.08] font-semibold tracking-[-0.035em]">
                Lo que siempre nos preguntan.
              </h2>
              <div className="mt-8 rounded-2xl bg-white p-5 ring-1 ring-slate-200/80">
                <p className="flex items-center gap-2 font-medium">
                  <span className="relative flex size-2.5">
                    <span className="absolute inset-0 rounded-full bg-emerald-400 motion-safe:animate-ping" />
                    <span className="relative size-2.5 rounded-full bg-emerald-500" />
                  </span>
                  Soporte en línea
                </p>
                <p className="mt-1.5 text-[15px] text-slate-600">Personas reales, de lunes a viernes de 9 a 18. Respondemos en menos de una hora.</p>
              </div>
            </div>
            <Faq />
          </div>
        </section>

        {/* CTA + FORMULARIO */}
        <section id="prueba" aria-labelledby="cc-prueba" className="scroll-mt-16 px-3 sm:px-5">
          <div className="relative mx-auto max-w-[1240px] overflow-hidden rounded-[32px] bg-[#1E1B4B] py-16 text-white md:py-24">
            <div aria-hidden="true" className="pointer-events-none absolute -top-32 -left-24 size-[28rem] rounded-full bg-[#4F46E5]/50 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -bottom-40 size-[26rem] rounded-full bg-emerald-400/20 blur-3xl" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]"
            />
            <div className={`${wrap} relative grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-16`}>
              <div>
                <Rotulo claro>Prueba gratis</Rotulo>
                <h2 id="cc-prueba" className="mt-4 text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.05] font-semibold tracking-[-0.04em]">
                  Tu próxima factura, en 20 segundos.
                </h2>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-indigo-100/80">
                  Creá tu cuenta y probá el plan Monotributo completo durante 14 días. Si no te convence, seguís gratis en el plan Inicial.
                </p>
                <ul className="mt-8 space-y-3 text-indigo-50">
                  {(
                    [
                      ["escudo", "Tus datos cifrados y en servidores en Argentina"],
                      ["reloj", "Configuración guiada en 2 minutos"],
                      ["grupo", "Soporte por chat desde el primer día"],
                    ] as const
                  ).map(([i, t]) => (
                    <li key={t} className="flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-indigo-200">
                        <Icono nombre={i} grosor={1.8} className="size-4" />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <FormularioPrueba />
            </div>
          </div>
        </section>
      </main>

      <footer className="pt-20">
        <div className={`${wrap} grid grid-cols-2 gap-10 md:grid-cols-6`}>
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-slate-600">
              Facturación electrónica simple para monotributistas y pymes de toda la Argentina.
            </p>
            <p className={`${mono} mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[12px] text-emerald-700 ring-1 ring-emerald-600/15`}>
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Todos los sistemas operativos
            </p>
          </div>
          {[
            ["Producto", [["#funciones", "Funciones"], ["#precios", "Precios"], ["#calculadora", "Calculadora"], ["#como-funciona", "Cómo funciona"]]],
            ["Recursos", [["#faq", "Preguntas frecuentes"], [null, "Guía del monotributo"], [null, "Centro de ayuda"], [null, "Novedades"]]],
            ["Empresa", [["#clientes", "Clientes"], [null, "Sobre nosotros"], [null, "Trabajá con nosotros"], [null, "Prensa"]]],
            ["Legal", [[null, "Términos"], [null, "Privacidad"], [null, "Seguridad"]]],
          ].map(([titulo, items]) => (
            <nav key={titulo as string} aria-label={titulo as string}>
              <h3 className="text-sm font-semibold text-slate-900">{titulo as string}</h3>
              <ul className="mt-4 space-y-2.5 text-[14.5px] text-slate-600">
                {(items as [string | null, string][]).map(([href, t]) => (
                  <li key={t}>
                    {href ? (
                      <a href={href} className="transition-colors hover:text-slate-900">
                        {t}
                      </a>
                    ) : (
                      <span>{t}</span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className={`${wrap} mt-16`}>
          <div className="flex flex-col gap-2 border-t border-slate-200 py-6 text-sm text-slate-500 sm:flex-row sm:justify-between">
            <p>© 2026 Cuentaclara. Demo con contenido ficticio: no es un producto real.</p>
            <p>Diseño y desarrollo: Francisco Zago</p>
          </div>
        </div>
      </footer>

      <DemoBar
        estilo="Tech"
        mensaje="Hola Fran, vi la demo Tech y quiero algo así para mi negocio."
        otrosHref="/demos/landing"
        pregunta="¿Querés uno así?"
      />
    </div>
  );
}
