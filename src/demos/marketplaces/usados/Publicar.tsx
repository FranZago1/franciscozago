"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useId, useRef, useState, type FormEvent } from "react";
import { Icon } from "../shared/Icon";
import { esperar, pesos } from "../shared/utils";
import { barrios, categoriaPorId, categorias, estados, rangos, rollo, type Aviso, type CategoriaId, type Estado } from "./data";
import { useUsados } from "./store";
import { EstadoTag, boton, caja, display, foco } from "./ui";

type Borrador = {
  fotos: string[];
  titulo: string;
  categoria: CategoriaId | "";
  estado: Estado;
  descripcion: string;
  barrio: string;
  precio: string;
  ofertas: boolean;
};

const vacio: Borrador = { fotos: [], titulo: "", categoria: "", estado: "muy-bueno", descripcion: "", barrio: "", precio: "", ofertas: true };
const pasos = ["Fotos", "Datos", "Precio"];

type Errores = Partial<Record<"fotos" | "titulo" | "categoria" | "barrio" | "precio", string>>;

function Vista({ b }: { b: Borrador }) {
  const portada = rollo.find((r) => r.id === b.fotos[0]);
  const cat = b.categoria ? categoriaPorId[b.categoria] : undefined;
  return (
    <article className={`overflow-hidden rounded-3xl ${caja} bg-white`} aria-label="Vista previa del aviso">
      <div className="relative aspect-square border-b-[2.5px] border-(--sv-negro) bg-(--sv-fondo)">
        {portada ? (
          <Image src={portada.src} alt={portada.alt} fill sizes="320px" className="object-cover" />
        ) : (
          <div className="absolute inset-4 grid place-items-center rounded-2xl border-[2.5px] border-dashed border-(--sv-negro)/40 text-center text-sm font-bold text-(--sv-gris)">
            <span>
              <Icon name="image" size={34} stroke={2} className="mx-auto" />
              <span className="mt-2 block">Tu foto de portada</span>
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1">
          <EstadoTag estado={b.estado} chico />
          <span className="rounded-full border-2 border-(--sv-negro) bg-(--sv-amarillo) px-2 py-0.5 text-[0.7rem] font-extrabold">Tu aviso</span>
        </div>
        {b.fotos.length > 1 && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full border-2 border-(--sv-negro) bg-white px-2 py-0.5 text-xs font-extrabold">
            <Icon name="camera" size={13} stroke={2.4} />
            {b.fotos.length}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className={`${display} text-[1.7rem] font-extrabold tracking-[-0.02em]`}>{Number(b.precio) ? pesos(Number(b.precio)) : "$ —"}</p>
        <p className={`mt-1 line-clamp-2 min-h-[2.6em] font-semibold leading-snug ${b.titulo ? "" : "text-(--sv-gris)/85"}`}>{b.titulo || "El título de tu aviso"}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.8rem] font-semibold text-(--sv-gris)">
          {cat && (
            <span className="rounded-full border-2 border-(--sv-negro) px-2 py-0.5 text-(--sv-negro)" style={{ background: cat.color }}>
              {cat.nombre}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Icon name="pin" size={14} stroke={2.2} />
            {b.barrio || "Tu barrio"}
          </span>
          {b.ofertas && Number(b.precio) > 0 && <span className="text-(--sv-violeta)">· Acepta ofertas</span>}
        </div>
      </div>
    </article>
  );
}

export function Publicar() {
  const { publicar, setDetalle, irA } = useUsados();
  const id = useId();
  const reducir = useReducedMotion();
  const [b, setB] = useState<Borrador>(vacio);
  const [paso, setPaso] = useState(0);
  const [errores, setErrores] = useState<Errores>({});
  const [estado, setEstado] = useState<"form" | "enviando" | "listo">("form");
  const [publicadoId, setPublicadoId] = useState<string | null>(null);
  const tarjeta = useRef<HTMLDivElement>(null);

  const set = <K extends keyof Borrador>(k: K, v: Borrador[K]) => {
    setB((x) => ({ ...x, [k]: v }));
    if (errores[k as keyof Errores]) setErrores((e) => ({ ...e, [k]: undefined }));
  };

  function toggleFoto(fid: string) {
    set("fotos", b.fotos.includes(fid) ? b.fotos.filter((x) => x !== fid) : b.fotos.length >= 4 ? b.fotos : [...b.fotos, fid]);
  }

  function validar(): Errores {
    const e: Errores = {};
    if (paso === 0 && b.fotos.length === 0) e.fotos = "Elegí al menos una foto: los avisos con foto se venden seis veces más.";
    if (paso === 1) {
      if (b.titulo.trim().length < 8) e.titulo = "Escribí un título de al menos 8 caracteres (ej.: “Bici playera rodado 26”).";
      if (!b.categoria) e.categoria = "Elegí una categoría.";
      if (!b.barrio) e.barrio = "Elegí dónde se retira.";
    }
    if (paso === 2) {
      const n = Number(b.precio);
      if (!n || n < 1000) e.precio = "Poné un precio de al menos $ 1.000.";
    }
    return e;
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e = validar();
    setErrores(e);
    if (Object.keys(e).length) {
      window.setTimeout(() => document.getElementById(`${id}-${Object.keys(e)[0]}`)?.focus(), 0);
      return;
    }
    if (paso < 2) {
      setPaso(paso + 1);
      tarjeta.current?.scrollIntoView({ block: "nearest", behavior: reducir ? "auto" : "smooth" });
      return;
    }
    setEstado("enviando");
    await esperar(1400);
    const nuevo: Aviso = {
      id: `mio-${Date.now()}`,
      titulo: b.titulo.trim(),
      categoria: b.categoria as CategoriaId,
      precio: Number(b.precio),
      estado: b.estado,
      barrio: b.barrio,
      minutos: 0,
      imagenes: b.fotos.map((f) => rollo.find((r) => r.id === f)!).map((r) => ({ src: r.src, alt: r.alt })),
      descripcion: b.descripcion.trim() || "Sin descripción por ahora.",
      detalles: [
        ["Estado", estados.find((x) => x.id === b.estado)!.nombre],
        ["Retiro", b.barrio],
        ["Ofertas", b.ofertas ? "Acepta ofertas" : "Precio fijo"],
      ],
      vendedor: { nombre: "Vos", color: "#FFE14D", rating: 5, ventas: 0, desde: 2026, responde: "en minutos" },
      aceptaOfertas: b.ofertas,
      propio: true,
    };
    publicar(nuevo);
    setPublicadoId(nuevo.id);
    setEstado("listo");
  }

  const input = (k: keyof Errores) =>
    `mt-1.5 w-full rounded-xl border-[2.5px] bg-(--sv-fondo) px-3.5 py-3 text-[0.95rem] font-medium outline-none transition focus:shadow-[3px_3px_0_#7B5CFF] ${errores[k] ? "border-[#E0245E]" : "border-(--sv-negro)"}`;
  const err = (k: keyof Errores) =>
    errores[k] ? (
      <p id={`${id}-${k}-err`} className="mt-1.5 text-sm font-semibold text-[#C2185B]">
        {errores[k]}
      </p>
    ) : null;
  const rango = b.categoria ? rangos[b.categoria] : null;
  const precioN = Number(b.precio);
  const posicion = rango && precioN ? Math.max(0, Math.min(100, ((precioN - rango[0]) / (rango[1] - rango[0])) * 100)) : null;

  return (
    <section id="publicar" aria-labelledby="publicar-titulo" className="scroll-mt-16 border-y-[2.5px] border-(--sv-negro) bg-(--sv-violeta)">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-2xl text-white">
          <p className="inline-block rotate-[-2deg] rounded-full border-[2.5px] border-(--sv-negro) bg-(--sv-verde) px-3 py-1 text-sm font-extrabold text-(--sv-negro)">Gratis y en 3 pasos</p>
          <h2 id="publicar-titulo" className={`${display} mt-4 text-5xl font-extrabold leading-[0.92] tracking-[-0.04em] sm:text-7xl`}>
            Publicá tu aviso.
          </h2>
          <p className="mt-4 text-lg font-medium text-white/95">Mirá cómo va quedando a medida que lo completás. Sin comisión, sin letra chica.</p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.45fr_1fr] lg:items-start">
          <div ref={tarjeta} className={`scroll-mt-24 rounded-[1.75rem] ${caja} bg-white p-5 shadow-[6px_6px_0_#141414] sm:p-7`}>
            {estado === "listo" ? (
              <div className="py-6 text-center" aria-live="polite">
                <motion.span
                  initial={reducir ? false : { scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="mx-auto grid size-20 place-items-center rounded-full border-[3px] border-(--sv-negro) bg-(--sv-verde) shadow-[4px_4px_0_#141414]"
                >
                  <Icon name="check" size={38} stroke={3} />
                </motion.span>
                <p className={`${display} mt-5 text-4xl font-extrabold tracking-[-0.03em]`}>¡Tu aviso ya está publicado!</p>
                <p className="mx-auto mt-2 max-w-sm font-medium text-(--sv-gris)">
                  Lo agregamos arriba de todo en el listado y queda guardado en este navegador. Es una demo: nadie más lo ve.
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      irA("avisos");
                      if (publicadoId) window.setTimeout(() => setDetalle(publicadoId), 450);
                    }}
                    className={`${boton} bg-(--sv-violeta) px-5 py-3 text-white`}
                  >
                    Ver mi aviso
                    <Icon name="arrowRight" size={18} stroke={2.6} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setB(vacio);
                      setPaso(0);
                      setEstado("form");
                    }}
                    className={`${boton} bg-white px-5 py-3`}
                  >
                    Publicar otro
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <ol className="flex items-center gap-2" aria-label="Pasos para publicar">
                  {pasos.map((t, i) => (
                    <li key={t} className="flex flex-1 items-center gap-2" aria-current={i === paso ? "step" : undefined}>
                      <span
                        className={`${display} grid size-9 shrink-0 place-items-center rounded-full border-[2.5px] border-(--sv-negro) text-base font-extrabold transition ${
                          i < paso ? "bg-(--sv-verde)" : i === paso ? "bg-(--sv-amarillo) shadow-[2px_2px_0_#141414]" : "bg-white text-(--sv-gris)"
                        }`}
                      >
                        {i < paso ? <Icon name="check" size={16} stroke={3} /> : i + 1}
                      </span>
                      <span className={`text-sm font-extrabold ${i === paso ? "" : "text-(--sv-gris)"}`}>{t}</span>
                      {i < 2 && <span className={`h-[2.5px] flex-1 rounded ${i < paso ? "bg-(--sv-negro)" : "bg-(--sv-negro)/15"}`} aria-hidden="true" />}
                    </li>
                  ))}
                </ol>

                <div className="mt-7 min-h-[22rem]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={paso}
                      initial={reducir ? { opacity: 0 } : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reducir ? { opacity: 0 } : { opacity: 0, y: -12 }}
                      transition={{ duration: 0.18 }}
                    >
                      {paso === 0 && (
                        <fieldset aria-describedby={`${id}-fotos-ayuda${errores.fotos ? ` ${id}-fotos-err` : ""}`}>
                          <legend className={`${display} text-2xl font-extrabold tracking-[-0.02em]`}>Elegí las fotos</legend>
                          <p id={`${id}-fotos-ayuda`} className="mt-1 text-sm font-medium text-(--sv-gris)">
                            Simulamos el rollo de tu celular: tocá hasta 4. La primera que elijas es la portada.
                          </p>
                          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {rollo.map((r, k) => {
                              const orden = b.fotos.indexOf(r.id);
                              const on = orden >= 0;
                              return (
                                <button
                                  key={r.id}
                                  id={k === 0 ? `${id}-fotos` : undefined}
                                  type="button"
                                  aria-pressed={on}
                                  aria-label={`${r.alt}${on ? `, seleccionada ${orden === 0 ? "como portada" : `como foto ${orden + 1}`}` : ""}`}
                                  onClick={() => toggleFoto(r.id)}
                                  className={`relative aspect-square overflow-hidden rounded-2xl border-[2.5px] border-(--sv-negro) transition ${foco} ${
                                    on ? "shadow-[4px_4px_0_#141414] -translate-y-0.5" : "opacity-80 hover:opacity-100"
                                  }`}
                                >
                                  <Image src={r.src} alt="" fill sizes="(min-width: 640px) 160px, 45vw" className="object-cover" />
                                  <span
                                    className={`${display} absolute right-2 top-2 grid size-8 place-items-center rounded-full border-[2.5px] border-(--sv-negro) text-sm font-extrabold ${on ? "bg-(--sv-amarillo)" : "bg-white/85"}`}
                                  >
                                    {on ? orden + 1 : <Icon name="plus" size={15} stroke={3} />}
                                  </span>
                                  {orden === 0 && (
                                    <span className="absolute inset-x-2 bottom-2 rounded-full border-2 border-(--sv-negro) bg-(--sv-negro) py-0.5 text-center text-[0.7rem] font-extrabold uppercase tracking-wide text-white">
                                      Portada
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                          {err("fotos")}
                          <ul className="mt-6 grid gap-2 rounded-2xl border-[2.5px] border-dashed border-(--sv-negro)/30 p-4 text-sm font-semibold sm:grid-cols-3">
                            {[
                              ["sparkle", "Luz natural, cerca de una ventana"],
                              ["image", "Fondo liso para que resalte"],
                              ["search", "Mostrá los detalles y el uso"],
                            ].map(([ic, t]) => (
                              <li key={t} className="flex items-start gap-2">
                                <Icon name={ic as "image"} size={17} stroke={2.4} className="mt-0.5 shrink-0 text-(--sv-violeta)" />
                                {t}
                              </li>
                            ))}
                          </ul>
                        </fieldset>
                      )}

                      {paso === 1 && (
                        <div className="space-y-5">
                          <p className={`${display} text-2xl font-extrabold tracking-[-0.02em]`}>Contanos qué vendés</p>
                          <div>
                            <div className="flex items-baseline justify-between">
                              <label htmlFor={`${id}-titulo`} className="text-sm font-extrabold">
                                Título
                              </label>
                              <span className="text-xs font-bold tabular-nums text-(--sv-gris)">{b.titulo.length}/60</span>
                            </div>
                            <input
                              id={`${id}-titulo`}
                              value={b.titulo}
                              onChange={(e) => set("titulo", e.target.value.slice(0, 60))}
                              placeholder="Ej.: Patineta de madera con ruedas nuevas"
                              aria-invalid={!!errores.titulo}
                              aria-describedby={errores.titulo ? `${id}-titulo-err` : undefined}
                              className={input("titulo")}
                            />
                            {err("titulo")}
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label htmlFor={`${id}-categoria`} className="text-sm font-extrabold">
                                Categoría
                              </label>
                              <select
                                id={`${id}-categoria`}
                                value={b.categoria}
                                onChange={(e) => set("categoria", e.target.value as CategoriaId)}
                                aria-invalid={!!errores.categoria}
                                aria-describedby={errores.categoria ? `${id}-categoria-err` : undefined}
                                className={`${input("categoria")} ${foco}`}
                              >
                                <option value="">Elegí una</option>
                                {categorias.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.nombre}
                                  </option>
                                ))}
                              </select>
                              {err("categoria")}
                            </div>
                            <div>
                              <label htmlFor={`${id}-barrio`} className="text-sm font-extrabold">
                                Barrio de retiro
                              </label>
                              <select
                                id={`${id}-barrio`}
                                value={b.barrio}
                                onChange={(e) => set("barrio", e.target.value)}
                                aria-invalid={!!errores.barrio}
                                aria-describedby={errores.barrio ? `${id}-barrio-err` : undefined}
                                className={`${input("barrio")} ${foco}`}
                              >
                                <option value="">Elegí uno</option>
                                {barrios.map((x) => (
                                  <option key={x}>{x}</option>
                                ))}
                              </select>
                              {err("barrio")}
                            </div>
                          </div>
                          <fieldset>
                            <legend className="text-sm font-extrabold">Estado</legend>
                            <div className="mt-2 grid grid-cols-3 gap-2">
                              {estados.map((e) => (
                                <label
                                  key={e.id}
                                  className={`cursor-pointer rounded-xl border-[2.5px] border-(--sv-negro) px-2 py-2.5 text-center text-sm font-extrabold transition has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--sv-violeta) ${
                                    b.estado === e.id ? "shadow-[3px_3px_0_#141414]" : "bg-white hover:bg-(--sv-fondo)"
                                  }`}
                                  style={b.estado === e.id ? { background: e.color } : undefined}
                                >
                                  <input type="radio" name={`${id}-estado`} checked={b.estado === e.id} onChange={() => set("estado", e.id)} className="sr-only" />
                                  {e.nombre}
                                </label>
                              ))}
                            </div>
                          </fieldset>
                          <div>
                            <label htmlFor={`${id}-desc`} className="text-sm font-extrabold">
                              Descripción <span className="font-medium text-(--sv-gris)">(opcional)</span>
                            </label>
                            <textarea
                              id={`${id}-desc`}
                              rows={3}
                              value={b.descripcion}
                              onChange={(e) => set("descripcion", e.target.value.slice(0, 400))}
                              placeholder="Medidas, cuánto uso tiene, si tiene algún detalle…"
                              className={`${input("titulo").replace("border-[#E0245E]", "border-(--sv-negro)")} resize-none`}
                            />
                          </div>
                        </div>
                      )}

                      {paso === 2 && (
                        <div className="space-y-6">
                          <p className={`${display} text-2xl font-extrabold tracking-[-0.02em]`}>Ponele precio</p>
                          <div>
                            <label htmlFor={`${id}-precio`} className="text-sm font-extrabold">
                              Precio
                            </label>
                            <div className={`mt-1.5 flex items-center rounded-xl border-[2.5px] bg-(--sv-fondo) px-3.5 focus-within:shadow-[3px_3px_0_#7B5CFF] ${errores.precio ? "border-[#E0245E]" : "border-(--sv-negro)"}`}>
                              <span className={`${display} text-3xl font-extrabold`}>$</span>
                              <input
                                id={`${id}-precio`}
                                inputMode="numeric"
                                value={b.precio ? Number(b.precio).toLocaleString("es-AR") : ""}
                                onChange={(e) => set("precio", e.target.value.replace(/\D/g, "").slice(0, 9))}
                                placeholder="0"
                                aria-invalid={!!errores.precio}
                                aria-describedby={`${id}-precio-ayuda${errores.precio ? ` ${id}-precio-err` : ""}`}
                                className={`${display} min-w-0 flex-1 bg-transparent px-2 py-2.5 text-3xl font-extrabold outline-none placeholder:text-(--sv-negro)/25`}
                              />
                            </div>
                            {err("precio")}
                          </div>
                          {rango && (
                            <div id={`${id}-precio-ayuda`} className="rounded-2xl border-[2.5px] border-(--sv-negro) bg-(--sv-fondo) p-4">
                              <p className="flex items-center gap-2 text-sm font-extrabold">
                                <Icon name="sparkle" size={17} stroke={2.4} className="text-(--sv-violeta)" />
                                Avisos parecidos en {categoriaPorId[b.categoria as CategoriaId].nombre.toLowerCase()} se venden entre {pesos(rango[0])} y {pesos(rango[1])}.
                              </p>
                              <div className="relative mt-4 h-3 rounded-full border-2 border-(--sv-negro) bg-[linear-gradient(90deg,#3DDC97,#FFE14D,#FF8A3D)]" aria-hidden="true">
                                {posicion !== null && (
                                  <span className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] border-(--sv-negro) bg-white shadow-[2px_2px_0_#141414] transition-[left]" style={{ left: `${posicion}%` }} />
                                )}
                              </div>
                              <div className="mt-1.5 flex justify-between text-xs font-bold text-(--sv-gris)">
                                <span>Se vende rápido</span>
                                <span>Precio alto</span>
                              </div>
                            </div>
                          )}
                          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border-[2.5px] border-(--sv-negro) bg-white px-4 py-3 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-(--sv-violeta)">
                            <span>
                              <span className="block font-extrabold">Acepto ofertas</span>
                              <span className="block text-sm font-medium text-(--sv-gris)">Los compradores te pueden proponer otro precio.</span>
                            </span>
                            <input type="checkbox" checked={b.ofertas} onChange={(e) => set("ofertas", e.target.checked)} className="peer sr-only" />
                            <span className="relative h-8 w-14 shrink-0 rounded-full border-[2.5px] border-(--sv-negro) bg-(--sv-fondo) transition peer-checked:bg-(--sv-verde) after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:border-2 after:border-(--sv-negro) after:bg-white after:transition peer-checked:after:translate-x-6" />
                          </label>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-7 flex gap-3 border-t-2 border-dashed border-(--sv-negro)/20 pt-5">
                  {paso > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setErrores({});
                        setPaso(paso - 1);
                      }}
                      disabled={estado === "enviando"}
                      className={`${boton} bg-white px-5 py-3`}
                    >
                      <Icon name="arrowLeft" size={17} stroke={2.6} />
                      Atrás
                    </button>
                  )}
                  <button type="submit" disabled={estado === "enviando"} className={`${boton} flex-1 bg-(--sv-negro) px-5 py-3 text-white disabled:opacity-80`}>
                    {estado === "enviando" ? (
                      <>
                        <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                        Publicando…
                      </>
                    ) : paso < 2 ? (
                      <>
                        Siguiente: {pasos[paso + 1]}
                        <Icon name="arrowRight" size={17} stroke={2.6} />
                      </>
                    ) : (
                      <>
                        <Icon name="sparkle" size={17} stroke={2.4} />
                        Publicar aviso
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="lg:sticky lg:top-24">
            <p className={`${display} mb-3 flex items-center gap-2 text-lg font-extrabold text-white`}>
              <span className="size-2.5 animate-pulse rounded-full bg-(--sv-verde) motion-reduce:animate-none" />
              Vista previa en vivo
            </p>
            <div className="mx-auto max-w-sm lg:mx-0">
              <Vista b={b} />
            </div>
            <p className="mt-4 max-w-sm text-sm font-medium text-white/95">Así lo van a ver los compradores en el listado.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
