"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { Dialog } from "../shared/Dialog";
import { Icon } from "../shared/Icon";
import { esperar, lista, pesos } from "../shared/utils";
import { MapaSvg } from "./Mapa";
import { productorPorId, productos, puntoDeEncuentro, zonaPorId, zonas, type ZonaId } from "./data";
import { useMercado, type Grupo } from "./store";
import { Estrellas, Stepper, display, foco } from "./ui";

const btnCerrar = `grid size-10 place-items-center rounded-full border border-(--dv-linea) bg-(--dv-crema) text-(--dv-tinta) transition hover:bg-(--dv-papel2) ${foco}`;
const panel = "bg-(--dv-papel) text-(--dv-tinta) [font-family:var(--font-dv-sans)] shadow-[-20px_0_60px_-20px_rgba(0,0,0,0.35)]";

export function Overlays() {
  return (
    <>
      <Tiendita />
      <Carrito />
      <Checkout />
      <Toast />
    </>
  );
}

function Tiendita() {
  const { tiendita, setTiendita, carrito, agregar, cambiar, grupos, setCarritoAbierto } = useMercado();
  const p = tiendita ? productorPorId[tiendita] : undefined;
  const id = useId();
  const suyos = useMemo(() => productos.filter((x) => x.productorId === tiendita), [tiendita]);
  const grupo = grupos.find((g) => g.productor.id === tiendita);

  return (
    <Dialog open={!!p} onClose={() => setTiendita(null)} labelledBy={id} variant="right" ancho="max-w-[36rem]" panelClassName={panel} overlayClassName="bg-(--dv-tinta)/55">
      {p && (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="relative aspect-[16/10] w-full">
              <Image src={p.imagen} alt={p.alt} fill sizes="(min-width: 640px) 576px, 100vw" className="object-cover" />
              <div className="absolute inset-x-0 top-0 flex justify-between p-4">
                <span className="rounded-full bg-(--dv-crema)/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-(--dv-verde)">
                  Tiendita
                </span>
                <button type="button" onClick={() => setTiendita(null)} className={btnCerrar} aria-label="Cerrar tiendita">
                  <Icon name="close" size={18} />
                </button>
              </div>
            </div>
            <div className="px-5 pb-8 pt-6 sm:px-7">
              <p className="text-sm font-semibold text-(--dv-tomate)">
                Desde {p.desde} · {p.lugar}
              </p>
              <h2 id={id} className={`${display} mt-1 text-4xl font-medium leading-tight text-(--dv-verde)`}>
                {p.nombre}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-(--dv-gris)">
                <span>{p.persona}</span>
                <span aria-hidden="true">·</span>
                <Estrellas valor={p.rating} resenas={p.resenas} />
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {p.sellos.map((s) => (
                  <li key={s} className="inline-flex items-center gap-1.5 rounded-full bg-(--dv-brote)/30 px-3 py-1 text-xs font-semibold text-(--dv-verde)">
                    <Icon name="leaf" size={14} />
                    {s}
                  </li>
                ))}
              </ul>

              <section className="mt-7" aria-label="Historia">
                <p className={`${display} border-l-4 border-(--dv-mostaza) pl-4 text-xl italic leading-snug text-(--dv-tinta)`}>“{p.cita}”</p>
                {p.historia.map((h) => (
                  <p key={h} className="mt-4 leading-relaxed text-(--dv-tinta)/85">
                    {h}
                  </p>
                ))}
              </section>

              <section className="mt-9" aria-labelledby={`${id}-prod`}>
                <h3 id={`${id}-prod`} className={`${display} text-2xl font-medium text-(--dv-verde)`}>
                  Esta semana ofrece
                </h3>
                <ul className="mt-4 space-y-3">
                  {suyos.map((x) => {
                    const cant = carrito[x.id] ?? 0;
                    return (
                      <li key={x.id} className="flex items-center gap-3 rounded-2xl border border-(--dv-linea) bg-(--dv-crema) p-2.5 pr-3">
                        <Image src={x.imagen} alt={x.alt} width={80} height={80} sizes="80px" className="size-20 shrink-0 rounded-xl" />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold leading-snug">{x.nombre}</p>
                          <p className="text-[0.8rem] text-(--dv-gris)">{x.unidad}</p>
                          <p className="mt-1 font-bold text-(--dv-verde)">{pesos(x.precio)}</p>
                        </div>
                        {cant > 0 ? (
                          <Stepper cant={cant} chico nombre={x.nombre} onCambiar={(n) => cambiar(x.id, n)} />
                        ) : (
                          <button
                            type="button"
                            onClick={() => agregar(x.id)}
                            className={`grid size-10 shrink-0 place-items-center rounded-full bg-(--dv-verde) text-(--dv-papel) transition hover:bg-(--dv-verde2) active:scale-95 ${foco}`}
                            aria-label={`Agregar ${x.nombre}`}
                          >
                            <Icon name="plus" size={18} stroke={2.2} />
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section className="mt-9" aria-labelledby={`${id}-zona`}>
                <h3 id={`${id}-zona`} className={`${display} text-2xl font-medium text-(--dv-verde)`}>
                  Dónde entrega
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr] sm:items-center">
                  <div className="rounded-2xl border border-(--dv-linea) bg-(--dv-crema) p-2">
                    <MapaSvg
                      resaltadas={p.entregaEn}
                      seleccionada={p.zona}
                      pins={false}
                      titulo={`Mapa con las zonas donde entrega ${p.nombre}: ${p.entregaEn.map((z) => zonaPorId[z].nombre).join(", ")}`}
                    />
                  </div>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-(--dv-gris)">Zonas</dt>
                      <dd className="font-semibold">{p.entregaEn.map((z) => zonaPorId[z].nombre).join(", ")}</dd>
                    </div>
                    <div>
                      <dt className="text-(--dv-gris)">Días de entrega</dt>
                      <dd className="font-semibold">{p.dias}</dd>
                    </div>
                    <div>
                      <dt className="text-(--dv-gris)">Envío</dt>
                      <dd className="font-semibold">
                        {pesos(p.envio)} · gratis desde {pesos(p.envioGratisDesde)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </section>
            </div>
          </div>
          <div className="border-t border-(--dv-linea) bg-(--dv-crema) px-5 py-4 sm:px-7">
            {grupo ? (
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm">
                  <p className="font-semibold">
                    {grupo.items.reduce((a, b) => a + b.cant, 0)} de {p.nombre} · {pesos(grupo.subtotal)}
                  </p>
                  <p className="text-(--dv-gris)">
                    {grupo.faltaGratis > 0 ? `Te faltan ${pesos(grupo.faltaGratis)} para envío gratis` : "Tenés envío gratis con este productor"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTiendita(null);
                    setCarritoAbierto(true);
                  }}
                  className={`shrink-0 rounded-xl bg-(--dv-verde) px-4 py-3 text-sm font-semibold text-(--dv-papel) ${foco}`}
                >
                  Ver pedido
                </button>
              </div>
            ) : (
              <p className="text-sm text-(--dv-gris)">Sumá productos y armá tu pedido con varios productores a la vez.</p>
            )}
          </div>
        </>
      )}
    </Dialog>
  );
}

function BarraGratis({ g }: { g: Grupo }) {
  const pct = Math.min(100, Math.round((g.subtotal / g.productor.envioGratisDesde) * 100));
  return (
    <div className="mt-3">
      <div className="h-2 overflow-hidden rounded-full bg-(--dv-papel2)" aria-hidden="true">
        <div className="h-full rounded-full bg-(--dv-brote) transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1.5 text-[0.8rem] text-(--dv-gris)">
        {g.faltaGratis > 0 ? (
          <>
            Sumá <strong className="text-(--dv-tinta)">{pesos(g.faltaGratis)}</strong> más de {g.productor.nombre} y el envío es gratis.
          </>
        ) : (
          <strong className="text-(--dv-verde)">¡Envío gratis con este productor!</strong>
        )}
      </p>
    </div>
  );
}

function Carrito() {
  const { carritoAbierto, setCarritoAbierto, grupos, cantidad, cambiar, setTiendita, setCheckoutAbierto, irA } = useMercado();
  const id = useId();
  const subtotal = grupos.reduce((a, g) => a + g.subtotal, 0);
  const envios = grupos.reduce((a, g) => a + g.envio, 0);

  return (
    <Dialog open={carritoAbierto} onClose={() => setCarritoAbierto(false)} labelledBy={id} variant="right" ancho="max-w-[30rem]" panelClassName={panel} overlayClassName="bg-(--dv-tinta)/55">
      <div className="flex items-center justify-between border-b border-(--dv-linea) px-5 py-4">
        <div>
          <h2 id={id} className={`${display} text-2xl font-medium text-(--dv-verde)`}>
            Tu pedido
          </h2>
          <p className="text-sm text-(--dv-gris)">
            {cantidad === 0
              ? "Todavía no sumaste nada"
              : `${cantidad} ${cantidad === 1 ? "producto" : "productos"} de ${grupos.length} ${grupos.length === 1 ? "productor" : "productores"}`}
          </p>
        </div>
        <button type="button" onClick={() => setCarritoAbierto(false)} className={btnCerrar} aria-label="Cerrar pedido">
          <Icon name="close" size={18} />
        </button>
      </div>

      {grupos.length === 0 ? (
        <div className="grid flex-1 place-items-center px-8 text-center">
          <div>
            <div className="mx-auto grid size-24 place-items-center rounded-full bg-(--dv-papel2) text-(--dv-verde)">
              <Icon name="basket" size={44} stroke={1.5} />
            </div>
            <p className={`${display} mt-5 text-2xl text-(--dv-verde)`}>Tu canasta está vacía</p>
            <p className="mt-2 text-(--dv-gris)">Sumá productos de distintos productores: acá te los agrupamos para que veas el envío de cada uno.</p>
            <button
              type="button"
              onClick={() => {
                setCarritoAbierto(false);
                irA("productos");
              }}
              className={`mt-6 rounded-xl bg-(--dv-verde) px-5 py-3 text-sm font-semibold text-(--dv-papel) ${foco}`}
            >
              Ver productos de la semana
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">
            <p className="flex items-start gap-2 rounded-xl bg-(--dv-mostaza)/20 p-3 text-sm text-(--dv-tinta)">
              <Icon name="info" size={18} className="mt-0.5 shrink-0 text-(--dv-tomate)" />
              Pagás todo junto, pero cada productor prepara y entrega lo suyo. Por eso el envío va por separado.
            </p>
            {grupos.map((g) => (
              <section key={g.productor.id} aria-label={`Productos de ${g.productor.nombre}`} className="rounded-2xl border border-(--dv-linea) bg-(--dv-crema) p-4">
                <header className="flex items-center gap-3">
                  <span className="relative size-11 shrink-0 overflow-hidden rounded-full border border-(--dv-linea)">
                    <Image src={g.productor.imagen} alt="" fill sizes="44px" className="object-cover object-[25%_60%]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => {
                        setCarritoAbierto(false);
                        setTiendita(g.productor.id);
                      }}
                      className={`rounded text-left font-semibold text-(--dv-verde) hover:underline ${foco}`}
                    >
                      {g.productor.nombre}
                    </button>
                    <p className="flex items-center gap-1 text-[0.8rem] text-(--dv-gris)">
                      <Icon name="calendar" size={14} />
                      Entrega {g.productor.dias.toLowerCase()}
                    </p>
                  </div>
                </header>
                <ul className="mt-3 divide-y divide-(--dv-linea)">
                  {g.items.map(({ producto, cant, total }) => (
                    <li key={producto.id} className="flex items-center gap-3 py-3">
                      <Image src={producto.imagen} alt="" width={56} height={56} sizes="56px" className="size-14 shrink-0 rounded-lg" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-snug">{producto.nombre}</p>
                        <p className="text-[0.78rem] text-(--dv-gris)">
                          {producto.unidad} · {pesos(producto.precio)}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <Stepper cant={cant} chico nombre={producto.nombre} onCambiar={(n) => cambiar(producto.id, n)} />
                          <span className="font-semibold tabular-nums">{pesos(total)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <dl className="mt-1 space-y-1 border-t border-dashed border-(--dv-linea) pt-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-(--dv-gris)">Subtotal</dt>
                    <dd className="tabular-nums">{pesos(g.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-(--dv-gris)">Envío de {g.productor.nombre}</dt>
                    <dd className={`tabular-nums ${g.envio === 0 ? "font-semibold text-(--dv-verde)" : ""}`}>{g.envio === 0 ? "Gratis" : pesos(g.envio)}</dd>
                  </div>
                </dl>
                <BarraGratis g={g} />
              </section>
            ))}
          </div>
          <div className="border-t border-(--dv-linea) bg-(--dv-crema) px-5 py-4">
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-(--dv-gris)">Productos</dt>
                <dd className="tabular-nums">{pesos(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-(--dv-gris)">
                  Envíos ({grupos.length} {grupos.length === 1 ? "productor" : "productores"})
                </dt>
                <dd className="tabular-nums">{envios === 0 ? "Gratis" : pesos(envios)}</dd>
              </div>
              <div className="flex items-baseline justify-between pt-2">
                <dt className="font-semibold">Total</dt>
                <dd className={`${display} text-3xl font-semibold tabular-nums text-(--dv-verde)`}>{pesos(subtotal + envios)}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => setCheckoutAbierto(true)}
              className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-(--dv-verde) px-5 py-3.5 font-semibold text-(--dv-papel) shadow-[0_3px_0_#0F2E18] transition hover:bg-(--dv-verde2) active:translate-y-px ${foco}`}
            >
              Confirmar pedido
              <Icon name="arrowRight" size={18} />
            </button>
          </div>
        </>
      )}
    </Dialog>
  );
}

type Errores = Partial<Record<"nombre" | "telefono" | "direccion" | "zona", string>>;

function Checkout() {
  const { checkoutAbierto, setCheckoutAbierto, grupos, vaciar, setCarritoAbierto } = useMercado();
  const id = useId();
  const [modo, setModo] = useState<"envio" | "retiro">("envio");
  const [zona, setZona] = useState<ZonaId | "">("");
  const [datos, setDatos] = useState({ nombre: "", telefono: "", direccion: "" });
  const [pago, setPago] = useState<"transferencia" | "tarjeta" | "efectivo">("transferencia");
  const [errores, setErrores] = useState<Errores>({});
  const [estado, setEstado] = useState<"form" | "enviando" | "listo">("form");
  const [pedido, setPedido] = useState<{ codigo: string; grupos: Grupo[]; total: number; modo: "envio" | "retiro" } | null>(null);

  const subtotal = grupos.reduce((a, g) => a + g.subtotal, 0);
  const envios = modo === "retiro" ? 0 : grupos.reduce((a, g) => a + g.envio, 0);
  const noLlegan = modo === "envio" && zona ? grupos.filter((g) => !g.productor.entregaEn.includes(zona)) : [];
  const listoRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (estado === "listo") listoRef.current?.focus();
  }, [estado]);

  function cerrar() {
    if (estado === "enviando") return;
    setCheckoutAbierto(false);
    if (estado === "listo") {
      setEstado("form");
      setPedido(null);
      setCarritoAbierto(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const err: Errores = {};
    if (datos.nombre.trim().length < 2) err.nombre = "Contanos tu nombre.";
    if (datos.telefono.replace(/\D/g, "").length < 8) err.telefono = "Ingresá un teléfono con código de área (ej. 351 555 0123).";
    if (modo === "envio") {
      if (!zona) err.zona = "Elegí tu zona para calcular los envíos.";
      else if (noLlegan.length) err.zona = `${lista(noLlegan.map((g) => g.productor.nombre))} no ${noLlegan.length === 1 ? "entrega" : "entregan"} en ${zonaPorId[zona].nombre}. Elegí retiro en el Punto Del Valle o quitá esos productos.`;
      if (datos.direccion.trim().length < 5) err.direccion = "Escribí calle, número y barrio.";
    }
    setErrores(err);
    if (Object.keys(err).length) {
      const primero = Object.keys(err)[0];
      document.getElementById(`${id}-${primero}`)?.focus();
      return;
    }
    setEstado("enviando");
    await esperar(1300);
    setPedido({ codigo: `DV-${4800 + Math.floor(Math.random() * 900)}`, grupos, total: subtotal + envios, modo });
    setEstado("listo");
    vaciar();
  }

  const campo = "mt-1.5 w-full rounded-xl border bg-white/80 px-3.5 py-3 text-[0.95rem] outline-none transition focus:border-(--dv-verde) focus:ring-2 focus:ring-(--dv-verde)/20";
  const borde = (k: keyof Errores) => (errores[k] ? "border-(--dv-tomate)" : "border-(--dv-linea)");
  const err = (k: keyof Errores) =>
    errores[k] ? (
      <p id={`${id}-${k}-err`} className="mt-1.5 flex items-start gap-1.5 text-sm text-(--dv-tomate)">
        <Icon name="info" size={15} className="mt-0.5 shrink-0" />
        {errores[k]}
      </p>
    ) : null;

  return (
    <Dialog
      open={checkoutAbierto}
      onClose={cerrar}
      labelledBy={id}
      variant="sheet"
      ancho="sm:max-w-2xl"
      panelClassName="rounded-t-[1.75rem] sm:rounded-[1.75rem] bg-(--dv-papel) text-(--dv-tinta) [font-family:var(--font-dv-sans)] shadow-2xl overflow-hidden"
      overlayClassName="bg-(--dv-tinta)/60"
    >
      <div className="flex items-center justify-between border-b border-(--dv-linea) px-5 py-4 sm:px-7">
        <h2 id={id} className={`${display} text-2xl font-medium text-(--dv-verde)`}>
          {estado === "listo" ? "Pedido confirmado" : "Confirmá tu pedido"}
        </h2>
        <button type="button" onClick={cerrar} className={btnCerrar} aria-label="Cerrar" disabled={estado === "enviando"}>
          <Icon name="close" size={18} />
        </button>
      </div>

      {estado === "listo" && pedido ? (
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-8 sm:px-7" aria-live="polite">
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-auto grid size-20 place-items-center rounded-full bg-(--dv-brote) text-(--dv-verde)">
            <Icon name="check" size={40} stroke={2.4} />
          </motion.div>
          <p className={`${display} mt-5 text-center text-3xl font-medium text-(--dv-verde)`}>¡Gracias, {datos.nombre.split(" ")[0]}!</p>
          <p className="mt-2 text-center text-(--dv-gris)">
            Tu pedido <strong className="text-(--dv-tinta)">{pedido.codigo}</strong> quedó armado. Total {pesos(pedido.total)}.
          </p>
          <ol className="mt-7 space-y-3">
            {pedido.grupos.map((g) => (
              <li key={g.productor.id} className="flex items-center gap-3 rounded-2xl border border-(--dv-linea) bg-(--dv-crema) p-3">
                <span className="relative size-11 shrink-0 overflow-hidden rounded-full">
                  <Image src={g.productor.imagen} alt="" fill sizes="44px" className="object-cover object-[25%_60%]" />
                </span>
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-semibold">{g.productor.nombre}</p>
                  <p className="text-(--dv-gris)">
                    {pedido.modo === "retiro" ? "Lo deja en el Punto Del Valle" : "Te entrega"} el próximo {g.productor.dias.split(" ")[0]!.toLowerCase()} ·{" "}
                    {(() => {
                      const n = g.items.reduce((a, b) => a + b.cant, 0);
                      return `${n} ${n === 1 ? "producto" : "productos"}`;
                    })()}
                  </p>
                </div>
                <Icon name="truck" size={20} className="text-(--dv-verde)" />
              </li>
            ))}
          </ol>
          <p className="mt-6 rounded-xl bg-(--dv-papel2) p-3 text-center text-sm text-(--dv-tinta)">
            Esto es una demo: no se cobró nada y no se envió ningún dato.
          </p>
          <button ref={listoRef} type="button" onClick={cerrar} className={`mt-5 w-full rounded-xl bg-(--dv-verde) px-5 py-3.5 font-semibold text-(--dv-papel) ${foco}`}>
            Seguir recorriendo el mercado
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-7 overflow-y-auto px-5 py-6 sm:px-7">
            {Object.keys(errores).length > 0 && (
              <p role="alert" className="rounded-xl border border-(--dv-tomate)/40 bg-(--dv-tomate)/10 p-3 text-sm text-(--dv-tomate)">
                Revisá {Object.keys(errores).length === 1 ? "el campo marcado" : `los ${Object.keys(errores).length} campos marcados`} para confirmar.
              </p>
            )}
            <fieldset>
              <legend className={`${display} text-xl font-medium text-(--dv-verde)`}>1. ¿Cómo lo recibís?</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ["envio", "Envío a domicilio", "Cada productor cobra su envío", "truck"],
                    ["retiro", "Retiro sin costo", "Punto Del Valle, barrio Güemes", "pin"],
                  ] as const
                ).map(([v, t, d, ic]) => (
                  <label
                    key={v}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--dv-tomate) ${
                      modo === v ? "border-(--dv-verde) bg-(--dv-crema)" : "border-(--dv-linea) hover:border-(--dv-verde)/50"
                    }`}
                  >
                    <input type="radio" name="modo" value={v} checked={modo === v} onChange={() => setModo(v)} className="sr-only" />
                    <Icon name={ic} size={22} className="mt-0.5 shrink-0 text-(--dv-verde)" />
                    <span>
                      <span className="block font-semibold">{t}</span>
                      <span className="block text-sm text-(--dv-gris)">{d}</span>
                    </span>
                    <span className={`ml-auto grid size-5 shrink-0 place-items-center rounded-full border-2 ${modo === v ? "border-(--dv-verde)" : "border-(--dv-linea)"}`}>
                      {modo === v && <span className="size-2.5 rounded-full bg-(--dv-verde)" />}
                    </span>
                  </label>
                ))}
              </div>
              {modo === "envio" ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
                  <div>
                    <label htmlFor={`${id}-zona`} className="text-sm font-semibold">
                      Zona
                    </label>
                    <select
                      id={`${id}-zona`}
                      value={zona}
                      onChange={(e) => setZona(e.target.value as ZonaId)}
                      aria-invalid={!!errores.zona}
                      aria-describedby={errores.zona ? `${id}-zona-err` : undefined}
                      className={`${campo} ${borde("zona")}`}
                    >
                      <option value="">Elegí tu zona</option>
                      {zonas
                        .filter((z) => !z.proximamente)
                        .map((z) => (
                          <option key={z.id} value={z.id}>
                            {z.nombre}
                          </option>
                        ))}
                    </select>
                    {err("zona")}
                  </div>
                  <div>
                    <label htmlFor={`${id}-direccion`} className="text-sm font-semibold">
                      Dirección
                    </label>
                    <input
                      id={`${id}-direccion`}
                      value={datos.direccion}
                      onChange={(e) => setDatos({ ...datos, direccion: e.target.value })}
                      autoComplete="street-address"
                      placeholder="Calle, número y barrio"
                      aria-invalid={!!errores.direccion}
                      aria-describedby={errores.direccion ? `${id}-direccion-err` : undefined}
                      className={`${campo} ${borde("direccion")}`}
                    />
                    {err("direccion")}
                  </div>
                  {!errores.zona && noLlegan.length > 0 && (
                    <p className="flex items-start gap-2 rounded-xl bg-(--dv-mostaza)/20 p-3 text-sm sm:col-span-2">
                      <Icon name="info" size={17} className="mt-0.5 shrink-0 text-(--dv-tomate)" />
                      {lista(noLlegan.map((g) => g.productor.nombre))} no {noLlegan.length === 1 ? "llega" : "llegan"} a {zona && zonaPorId[zona].nombre}. Podés retirar todo en el Punto Del Valle.
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-4 rounded-xl bg-(--dv-crema) p-3 text-sm text-(--dv-tinta)">
                  <strong>{puntoDeEncuentro}</strong>. Cada productor deja su parte el día que entrega; te avisamos cuando esté todo.
                </p>
              )}
            </fieldset>

            <fieldset>
              <legend className={`${display} text-xl font-medium text-(--dv-verde)`}>2. Tus datos</legend>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${id}-nombre`} className="text-sm font-semibold">
                    Nombre y apellido
                  </label>
                  <input
                    id={`${id}-nombre`}
                    value={datos.nombre}
                    onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
                    autoComplete="name"
                    aria-invalid={!!errores.nombre}
                    aria-describedby={errores.nombre ? `${id}-nombre-err` : undefined}
                    className={`${campo} ${borde("nombre")}`}
                  />
                  {err("nombre")}
                </div>
                <div>
                  <label htmlFor={`${id}-telefono`} className="text-sm font-semibold">
                    Teléfono
                  </label>
                  <input
                    id={`${id}-telefono`}
                    value={datos.telefono}
                    onChange={(e) => setDatos({ ...datos, telefono: e.target.value })}
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="351 555 0123"
                    aria-invalid={!!errores.telefono}
                    aria-describedby={errores.telefono ? `${id}-telefono-err` : undefined}
                    className={`${campo} ${borde("telefono")}`}
                  />
                  {err("telefono")}
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend className={`${display} text-xl font-medium text-(--dv-verde)`}>3. ¿Cómo pagás?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {(
                  [
                    ["transferencia", "Transferencia"],
                    ["tarjeta", "Tarjeta"],
                    ["efectivo", "Efectivo al recibir"],
                  ] as const
                ).map(([v, t]) => (
                  <label
                    key={v}
                    className={`cursor-pointer rounded-full border-2 px-4 py-2 text-sm font-semibold transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--dv-tomate) ${
                      pago === v ? "border-(--dv-verde) bg-(--dv-verde) text-(--dv-papel)" : "border-(--dv-linea) hover:border-(--dv-verde)/50"
                    }`}
                  >
                    <input type="radio" name="pago" value={v} checked={pago === v} onChange={() => setPago(v)} className="sr-only" />
                    {t}
                  </label>
                ))}
              </div>
            </fieldset>

            <section aria-label="Resumen" className="rounded-2xl border border-(--dv-linea) bg-(--dv-crema) p-4 text-sm">
              <ul className="space-y-1.5">
                {grupos.map((g) => (
                  <li key={g.productor.id} className="flex justify-between gap-3">
                    <span className="text-(--dv-gris)">
                      {g.productor.nombre}
                      {modo === "envio" && <> · envío {g.envio === 0 ? "gratis" : pesos(g.envio)}</>}
                    </span>
                    <span className="tabular-nums">{pesos(g.subtotal + (modo === "envio" ? g.envio : 0))}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-baseline justify-between border-t border-dashed border-(--dv-linea) pt-3">
                <span className="font-semibold">Total a pagar</span>
                <span className={`${display} text-2xl font-semibold text-(--dv-verde)`}>{pesos(subtotal + envios)}</span>
              </div>
            </section>
          </div>
          <div className="border-t border-(--dv-linea) bg-(--dv-crema) px-5 py-4 sm:px-7">
            <button
              type="submit"
              disabled={estado === "enviando" || grupos.length === 0}
              className={`flex w-full items-center justify-center gap-2 rounded-xl bg-(--dv-verde) px-5 py-3.5 font-semibold text-(--dv-papel) transition hover:bg-(--dv-verde2) disabled:opacity-70 ${foco}`}
            >
              {estado === "enviando" ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-(--dv-papel)/40 border-t-(--dv-papel)" aria-hidden="true" />
                  Confirmando con los productores…
                </>
              ) : (
                <>Confirmar y pagar {pesos(subtotal + envios)}</>
              )}
            </button>
            <p className="mt-2 text-center text-xs text-(--dv-gris)">Demo: no se procesa ningún pago real.</p>
          </div>
        </form>
      )}
    </Dialog>
  );
}

function Toast() {
  const { aviso, cerrarAviso, setCarritoAbierto } = useMercado();
  return (
    <div data-fuera-de-dialogo className="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center px-4 sm:top-24" aria-live="polite" role="status">
      <AnimatePresence>
        {aviso && (
          <motion.div
            key={aviso.id}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl bg-(--dv-verde) py-2.5 pl-4 pr-2 text-sm text-(--dv-papel) shadow-[0_14px_30px_-10px_rgba(0,0,0,0.45)]"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-(--dv-brote) text-(--dv-verde)">
              <Icon name="check" size={16} stroke={2.6} />
            </span>
            <span className="min-w-0 flex-1">{aviso.texto}</span>
            <button
              type="button"
              onClick={() => {
                cerrarAviso();
                setCarritoAbierto(true);
              }}
              className={`shrink-0 rounded-xl bg-(--dv-papel) px-3 py-1.5 font-semibold text-(--dv-verde) ${foco}`}
            >
              Ver pedido
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
