"use client";

import Image from "next/image";
import { useCallback, useId, useState } from "react";
import { Dialogo, IconoCerrar } from "../shared/Dialogo";
import { ars } from "../shared/formato";
import { ModalConsulta, type TemaConsulta } from "../shared/ModalConsulta";
import { useAviso } from "../shared/useAviso";
import { useLista, type ItemLista } from "../shared/useLista";
import { Catalogo, FILTROS_VACIOS, type Filtros } from "./Catalogo";
import { COLECCIONES, NEGOCIO, PRODUCTO_POR_ID, imagenProducto, type Coleccion, type Producto } from "./datos";
import { Escenas } from "./Escenas";
import { Ficha } from "./Ficha";
import { Cantidad, IcBasura, IcChat, IcFlecha, IcLista } from "./ui";

const serif = "[font-family:var(--font-nido-serif)]";

const temaConsulta: TemaConsulta = {
  dialogo:
    "m-auto max-h-[calc(100dvh-16px)] w-[min(980px,calc(100%-16px))] max-w-none overflow-y-auto overscroll-contain rounded-[20px] bg-[#F4EFE7] text-[#221C17] shadow-2xl backdrop:bg-[#221C17]/55 backdrop:backdrop-blur-[2px] [font-family:var(--font-nido-sans)]",
  panel: "p-5 sm:p-9",
  titulo: `${serif} text-[34px] leading-none sm:text-[44px]`,
  bajada: "mt-2 max-w-md text-[14px] text-[#6E6258]",
  label: "text-[12px] font-semibold tracking-[0.12em] uppercase",
  input:
    "h-11 rounded-xl border border-[#CFC4B3] bg-[#FBF8F3] px-4 py-2.5 text-[15px] placeholder:text-[#9A8E82] focus:border-[#2F4538] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4538]/25",
  primario:
    "inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#2F4538] px-6 text-[15px] font-semibold text-[#F4EFE7] transition hover:bg-[#243629] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4538]",
  secundario:
    "inline-flex h-12 items-center justify-center rounded-full border border-[#CFC4B3] px-6 text-[15px] font-medium transition hover:border-[#221C17] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4538]",
  aviso: "text-[13px] leading-relaxed text-[#6E6258]",
  cerrar:
    "grid size-10 shrink-0 place-items-center rounded-full transition hover:bg-[#EDE6DA] focus-visible:outline-2 focus-visible:outline-[#2F4538]",
  separador: "border-[#DCD2C3]",
};

function mensajeNido(items: ItemLista[], datos: Record<string, string>) {
  const lineas: string[] = [];
  let total = 0;
  let consultar = false;
  for (const it of items) {
    const p = PRODUCTO_POR_ID.get(it.id);
    if (!p) continue;
    const v = p.variantes.find((x) => x.id === it.variante);
    lineas.push(`• *${p.nombre}* — ${v?.nombre ?? "a definir"} — ${it.cantidad} u.`);
    if (it.nota?.trim()) lineas.push(`   Nota: ${it.nota.trim()}`);
    if (p.precio) total += p.precio * it.cantidad;
    else consultar = true;
  }
  const nombre = datos.nombre?.trim();
  const zona = datos.zona?.trim();
  return [
    `¡Hola, ${NEGOCIO.nombre}! Les escribo desde el catálogo web. Quiero consultar por estas piezas:`,
    "",
    ...lineas,
    "",
    `Total de referencia: ${ars(total)}${consultar ? " + piezas a consultar" : ""}`,
    `Nombre: ${nombre || "[tu nombre]"}`,
    `Zona de entrega: ${zona || "[tu barrio o ciudad]"}`,
    ...(datos.comentario?.trim() ? [`Comentario: ${datos.comentario.trim()}`] : []),
    "",
    "¿Me confirman disponibilidad, plazos y costo de envío? ¡Gracias!",
  ]
    .filter((l, i, arr) => !(l === "" && arr[i - 1] === ""))
    .join("\n");
}

export function NidoApp() {
  const lista = useLista("nido-lista-v1", { max: 20 });
  const [aviso, avisar] = useAviso();
  const [ficha, setFicha] = useState<{ p: Producto; v: string } | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [consulta, setConsulta] = useState(false);
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VACIOS);
  const uid = useId();

  const ver = useCallback((id: string, v: string) => {
    const p = PRODUCTO_POR_ID.get(id);
    if (p) setFicha({ p, v });
  }, []);

  const agregarRapido = useCallback(
    (id: string, v: string) => {
      const p = PRODUCTO_POR_ID.get(id);
      if (!p) return;
      lista.agregar({ id, variante: v, cantidad: 1 });
      avisar(`${p.nombre} (${p.variantes.find((x) => x.id === v)?.nombre}) se sumó a tu lista`);
    },
    [lista, avisar],
  );

  const irAColeccion = (c: Coleccion) => {
    setFiltros({ ...FILTROS_VACIOS, coleccion: c });
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const total = lista.items.reduce((s, i) => s + (PRODUCTO_POR_ID.get(i.id)?.precio ?? 0) * i.cantidad, 0);
  const construir = useCallback((d: Record<string, string>) => mensajeNido(lista.items, d), [lista.items]);

  return (
    <>
      <style>{`
        @keyframes nido-pulso { 0% { transform: scale(0.6); opacity: .9 } 80%,100% { transform: scale(1.5); opacity: 0 } }
        @keyframes nido-entrar { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }
      `}</style>

      <p className="bg-[#2F4538] px-4 py-2 text-center text-[12px] tracking-[0.04em] text-[#E9E1D2]">
        Fabricación propia en Córdoba · Envíos a todo el país · Consultas por WhatsApp de martes a sábados
      </p>

      <header className="sticky top-0 z-30 border-b border-[#DCD2C3]/80 bg-[#F4EFE7]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-6 px-4 sm:h-[72px] sm:px-8">
          <a
            href="#inicio"
            className="flex items-baseline gap-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2F4538]"
          >
            <span className={`${serif} text-[32px] leading-none tracking-[-0.01em]`}>Nido</span>
            <span className="hidden text-[11px] tracking-[0.2em] text-[#6E6258] uppercase sm:inline">muebles y objetos</span>
          </a>
          <nav aria-label="Secciones" className="ml-auto hidden md:block">
            <ul className="flex gap-7 text-[14px] text-[#3B322B]">
              {[
                ["#ambientes", "Ambientes"],
                ["#colecciones", "Colecciones"],
                ["#catalogo", "Catálogo"],
                ["#taller", "Taller"],
              ].map(([h, l]) => (
                <li key={h}>
                  <a
                    href={h}
                    className="underline-offset-[6px] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2F4538]"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="ml-auto inline-flex h-11 items-center gap-2.5 rounded-full border border-[#221C17] pr-2 pl-4 text-[14px] font-medium transition hover:bg-[#221C17] hover:text-[#F4EFE7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4538] md:ml-0"
          >
            <IcLista className="size-[18px]" />
            Mi lista
            <span className="grid h-7 min-w-7 place-items-center rounded-full bg-[#2F4538] px-2 text-[12px] text-[#F4EFE7] tabular-nums">
              {lista.unidades}
            </span>
          </button>
        </div>
      </header>

      <main id="inicio">
        <section className="mx-auto max-w-[1240px] px-4 pt-12 sm:px-8 sm:pt-20" aria-labelledby={`${uid}-hero`}>
          <div className="grid gap-6 md:grid-cols-[1.25fr_1fr] md:items-end md:gap-12">
            <h1 id={`${uid}-hero`} className={`${serif} text-[clamp(3rem,8.4vw,7.25rem)] leading-[0.92] tracking-[-0.02em]`}>
              Muebles hechos <em className="text-[#B25F3C]">para quedarse.</em>
            </h1>
            <div className="max-w-md md:pb-3">
              <p className="text-[16px] leading-relaxed text-[#4A4039]">
                Diseñamos y fabricamos en nuestro taller de Córdoba. Recorré los ambientes, armá tu lista con las terminaciones que te
                gusten y consultanos por WhatsApp: te respondemos con precio final y plazos.
              </p>
              <a
                href="#catalogo"
                className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-[#2F4538] px-6 text-[15px] font-semibold text-[#F4EFE7] transition hover:bg-[#243629] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4538]"
              >
                Ver el catálogo <IcFlecha />
              </a>
            </div>
          </div>
        </section>

        <section id="ambientes" className="mx-auto mt-12 max-w-[1240px] scroll-mt-24 px-4 sm:mt-16 sm:px-8" aria-label="Ambientes">
          <Escenas onVer={ver} onAgregar={agregarRapido} />
        </section>

        <section
          id="colecciones"
          className="mx-auto mt-24 max-w-[1240px] scroll-mt-24 px-4 sm:mt-36 sm:px-8"
          aria-labelledby={`${uid}-col`}
        >
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#DCD2C3] pb-6">
            <h2 id={`${uid}-col`} className={`${serif} text-[44px] leading-none sm:text-[64px]`}>
              Colecciones
            </h2>
            <p className="max-w-sm text-[14px] text-[#6E6258]">
              Tres paletas que conversan entre sí. Elegí una y el catálogo se ordena solo.
            </p>
          </div>
          <ul className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {COLECCIONES.map((c, n) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => irAColeccion(c.id)}
                  className="group block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2F4538]"
                >
                  <div
                    className={`relative overflow-hidden rounded-[14px] bg-[#EEE6DA] aspect-[4/3] sm:aspect-[4/5] ${n === 1 ? "sm:mt-10" : ""}`}
                  >
                    <Image
                      src={imagenProducto(c.portada[0], c.portada[1])}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="scale-[1.18] object-cover transition-transform duration-700 group-hover:scale-[1.24] motion-reduce:transition-none"
                    />
                    <span className="absolute top-4 left-4 text-[11px] tracking-[0.2em] text-[#4A4039] uppercase">0{n + 1}</span>
                  </div>
                  <p className={`${serif} mt-4 text-[32px] leading-none`}>{c.nombre}</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#6E6258]">{c.bajada}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2F4538]">
                    Ver colección <IcFlecha className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section id="catalogo" className="mx-auto mt-24 max-w-[1240px] scroll-mt-24 px-4 sm:mt-36 sm:px-8" aria-labelledby={`${uid}-cat`}>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#DCD2C3] pb-6">
            <h2 id={`${uid}-cat`} className={`${serif} text-[44px] leading-none sm:text-[64px]`}>
              Catálogo
            </h2>
            <p className="max-w-sm text-[14px] text-[#6E6258]">
              Precios de referencia con la terminación estándar. Todo se puede hacer a medida.
            </p>
          </div>
          <Catalogo filtros={filtros} setFiltros={setFiltros} onVer={ver} onAgregar={agregarRapido} />
        </section>
      </main>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-36 z-40 flex justify-center px-4 sm:bottom-32">
        {aviso ? (
          <p className="pointer-events-auto flex items-center gap-3 rounded-full bg-[#221C17] py-2 pr-2 pl-5 text-[13px] text-[#F4EFE7] shadow-xl motion-safe:animate-[nido-entrar_0.25s_ease-out]">
            {aviso}
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className="rounded-full bg-[#F4EFE7] px-3 py-1.5 text-[12px] font-semibold text-[#221C17]"
            >
              Ver lista
            </button>
          </p>
        ) : null}
      </div>

      <Ficha
        producto={ficha?.p ?? null}
        varianteInicial={ficha?.v ?? ""}
        onCerrar={() => setFicha(null)}
        onAgregar={(p, v, cantidad, nota) => {
          lista.agregar({ id: p.id, variante: v, cantidad, nota: nota.trim() || undefined });
        }}
        onVerLista={() => {
          setFicha(null);
          setDrawer(true);
        }}
      />

      <Dialogo
        abierto={drawer}
        onCerrar={() => setDrawer(false)}
        labelledBy={`${uid}-lista`}
        className="mt-0 mr-0 mb-0 ml-auto h-dvh max-h-dvh w-full max-w-[460px] bg-[#F4EFE7] text-[#221C17] shadow-2xl backdrop:bg-[#221C17]/45 [font-family:var(--font-nido-sans)] motion-safe:open:animate-[nido-drawer_0.3s_ease-out]"
      >
        <style>{`@keyframes nido-drawer { from { transform: translateX(40px); opacity: 0 } to { transform: none; opacity: 1 } }`}</style>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-[#DCD2C3] px-5 py-4 sm:px-7">
            <div>
              <h2 id={`${uid}-lista`} className={`${serif} text-[32px] leading-none`}>
                Tu lista
              </h2>
              <p className="mt-1 text-[13px] text-[#6E6258]">
                {lista.unidades} {lista.unidades === 1 ? "pieza" : "piezas"} para consultar
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDrawer(false)}
              aria-label="Cerrar lista"
              className="grid size-10 place-items-center rounded-full transition hover:bg-[#EDE6DA] focus-visible:outline-2 focus-visible:outline-[#2F4538]"
            >
              <IconoCerrar />
            </button>
          </div>

          {lista.items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
              <svg
                viewBox="0 0 120 80"
                className="w-40 text-[#CFC4B3]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                aria-hidden="true"
              >
                <path d="M14 62h92M24 62V40c0-6 4-10 10-10h52c6 0 10 4 10 10v22M30 44h60M20 62v6M100 62v6" />
                <path d="M34 30v-6c0-4 3-7 7-7h38c4 0 7 3 7 7v6" />
              </svg>
              <p className={`${serif} mt-5 text-[28px]`}>Todavía no sumaste piezas.</p>
              <p className="mt-2 text-[14px] text-[#6E6258]">Tocá el + en cualquier producto o en los puntos de los ambientes.</p>
              <button
                type="button"
                onClick={() => {
                  setDrawer(false);
                  document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="mt-6 h-11 rounded-full bg-[#221C17] px-6 text-[14px] font-semibold text-[#F4EFE7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4538]"
              >
                Explorar el catálogo
              </button>
            </div>
          ) : (
            <>
              <ul className="flex-1 divide-y divide-[#DCD2C3] overflow-y-auto px-5 sm:px-7">
                {lista.items.map((it) => {
                  const p = PRODUCTO_POR_ID.get(it.id);
                  if (!p) return null;
                  const v = p.variantes.find((x) => x.id === it.variante) ?? p.variantes[0]!;
                  return (
                    <li key={it.key} className="flex gap-4 py-5">
                      <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-[#EEE6DA]">
                        <Image
                          src={imagenProducto(p.id, v.id)}
                          alt={`${p.nombre} en ${v.nombre}`}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`${serif} text-[22px] leading-tight`}>{p.nombre}</p>
                          <button
                            type="button"
                            onClick={() => lista.quitar(it.key)}
                            aria-label={`Quitar ${p.nombre} de la lista`}
                            className="grid size-8 shrink-0 place-items-center rounded-full text-[#6E6258] transition hover:bg-[#EDE6DA] hover:text-[#221C17] focus-visible:outline-2 focus-visible:outline-[#2F4538]"
                          >
                            <IcBasura />
                          </button>
                        </div>
                        <label className="mt-1 flex items-center gap-2 text-[13px] text-[#6E6258]">
                          <span
                            className="size-3.5 shrink-0 rounded-full border border-black/10"
                            style={{ background: v.hex }}
                            aria-hidden="true"
                          />
                          <span className="sr-only">Terminación de {p.nombre}</span>
                          <select
                            value={v.id}
                            onChange={(e) => lista.cambiarVariante(it.key, e.target.value)}
                            className="-ml-1 rounded-md bg-transparent px-1 py-0.5 text-[13px] text-[#3B322B] hover:bg-[#EDE6DA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4538]/30"
                          >
                            {p.variantes.map((x) => (
                              <option key={x.id} value={x.id}>
                                {x.nombre}
                              </option>
                            ))}
                          </select>
                        </label>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <Cantidad
                            valor={it.cantidad}
                            onChange={(n) => lista.fijarCantidad(it.key, n)}
                            etiqueta={`Cantidad de ${p.nombre}`}
                          />
                          <p className="text-[14px] tabular-nums">{p.precio ? ars(p.precio * it.cantidad) : "Consultar"}</p>
                        </div>
                        <label className="mt-3 block">
                          <span className="sr-only">Nota para {p.nombre}</span>
                          <input
                            type="text"
                            value={it.nota ?? ""}
                            onChange={(e) => lista.fijarNota(it.key, e.target.value)}
                            placeholder="Agregá una nota (medida, tela, consulta)"
                            className="h-9 w-full rounded-lg border border-transparent bg-[#EDE6DA]/70 px-3 text-[13px] placeholder:text-[#9A8E82] focus:border-[#2F4538] focus:bg-[#FBF8F3] focus:outline-none"
                          />
                        </label>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-[#DCD2C3] bg-[#EFE8DD] px-5 py-5 sm:px-7 sm:py-7">
                <div className="flex items-baseline justify-between">
                  <p className="text-[13px] text-[#6E6258]">Total de referencia</p>
                  <p className={`${serif} text-[30px] tabular-nums`}>{ars(total)}</p>
                </div>
                <p className="mt-1 text-[12px] text-[#6E6258]">El precio final y el envío te los confirmamos por WhatsApp.</p>
                <button
                  type="button"
                  onClick={() => setConsulta(true)}
                  className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#2F4538] text-[15px] font-semibold text-[#F4EFE7] transition hover:bg-[#243629] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4538]"
                >
                  <IcChat /> Consultar por WhatsApp
                </button>
                <button
                  type="button"
                  onClick={lista.vaciar}
                  className="mt-3 w-full text-center text-[13px] text-[#6E6258] underline underline-offset-4 hover:text-[#221C17] focus-visible:outline-2 focus-visible:outline-[#2F4538]"
                >
                  Vaciar lista
                </button>
              </div>
            </>
          )}
        </div>
      </Dialogo>

      <ModalConsulta
        abierto={consulta}
        onCerrar={() => setConsulta(false)}
        titulo="Así le llega tu consulta"
        bajada="Completá tus datos y mirá el mensaje que recibiría Nido en su WhatsApp."
        negocio={`${NEGOCIO.nombre} · WhatsApp del showroom`}
        iniciales="Ni"
        campos={[
          { id: "nombre", label: "Tu nombre", placeholder: "Ej.: Laura Giménez", autoComplete: "name" },
          { id: "zona", label: "Zona de entrega", placeholder: "Ej.: Nueva Córdoba", autoComplete: "address-level2" },
          { id: "comentario", label: "Comentario (opcional)", placeholder: "Ej.: el living mide 4 × 5 m", multilinea: true },
        ]}
        construir={construir}
        tema={temaConsulta}
      />
    </>
  );
}
