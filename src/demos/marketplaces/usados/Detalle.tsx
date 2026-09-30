"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Dialog } from "../shared/Dialog";
import { Icon } from "../shared/Icon";
import { esperar, pesos } from "../shared/utils";
import { categoriaPorId, haceTexto, type Aviso } from "./data";
import { Corazon } from "./Listado";
import { useUsados } from "./store";
import { Avatar, EstadoTag, boton, display, foco } from "./ui";

const cerrarBtn = `grid size-10 shrink-0 place-items-center rounded-full border-[2.5px] border-(--sv-negro) bg-white shadow-[2px_2px_0_#141414] transition hover:bg-(--sv-amarillo) ${foco}`;

export function Overlays() {
  return (
    <>
      <Detalle />
      <Oferta />
      <Chat />
      <Toast />
    </>
  );
}

function Galeria({ a }: { a: Aviso }) {
  const [i, setI] = useState(0);
  const reducir = useReducedMotion();
  const n = a.imagenes.length;
  const ir = (k: number) => setI((k + n) % n);
  function onKey(e: KeyboardEvent) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      ir(i + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      ir(i - 1);
    }
  }
  const actual = a.imagenes[i]!;
  return (
    <div role="group" aria-roledescription="galería" aria-label={`Fotos de ${a.titulo}`} onKeyDown={onKey}>
      <div className="relative aspect-square overflow-hidden rounded-2xl border-[2.5px] border-(--sv-negro) bg-white">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={actual.src}
            className="absolute inset-0"
            initial={reducir ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Image src={actual.src} alt={actual.alt} fill sizes="(min-width: 768px) 480px, 92vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>
        {n > 1 && (
          <>
            <button type="button" onClick={() => ir(i - 1)} className={`${cerrarBtn} absolute left-3 top-1/2 -translate-y-1/2`} aria-label="Foto anterior">
              <Icon name="chevronLeft" size={20} stroke={2.6} />
            </button>
            <button type="button" onClick={() => ir(i + 1)} className={`${cerrarBtn} absolute right-3 top-1/2 -translate-y-1/2`} aria-label="Foto siguiente">
              <Icon name="chevronRight" size={20} stroke={2.6} />
            </button>
          </>
        )}
        <span className="absolute bottom-3 right-3 rounded-full border-2 border-(--sv-negro) bg-white px-2.5 py-0.5 text-xs font-extrabold tabular-nums" aria-live="polite">
          {i + 1} / {n}
        </span>
      </div>
      {n > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
          {a.imagenes.map((im, k) => (
            <button
              key={im.src}
              type="button"
              onClick={() => setI(k)}
              aria-label={`Ver foto ${k + 1} de ${n}`}
              aria-current={k === i}
              className={`relative aspect-square overflow-hidden rounded-xl border-[2.5px] transition ${foco} ${k === i ? "border-(--sv-negro) shadow-[3px_3px_0_#141414]" : "border-(--sv-negro)/25 opacity-70 hover:opacity-100"}`}
            >
              <Image src={im.src} alt="" fill sizes="110px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Detalle() {
  const { detalle, setDetalle, avisos, setOfertaPara, setChatCon } = useUsados();
  const a = avisos.find((x) => x.id === detalle);
  const id = useId();
  return (
    <Dialog
      open={!!a}
      onClose={() => setDetalle(null)}
      labelledBy={id}
      variant="sheet"
      ancho="sm:max-w-5xl"
      panelClassName="overflow-hidden rounded-t-[1.75rem] sm:rounded-[1.75rem] border-[2.5px] border-(--sv-negro) bg-(--sv-fondo) text-(--sv-negro) [font-family:var(--font-sv-sans)] shadow-[8px_8px_0_#141414]"
      overlayClassName="bg-(--sv-violeta)/45 backdrop-blur-[2px]"
    >
      {a && (
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b-[2.5px] border-(--sv-negro) bg-(--sv-fondo) px-4 py-3 sm:px-6">
            <p className="flex items-center gap-2 text-sm font-bold">
              <span className="size-3 rounded-full border-2 border-(--sv-negro)" style={{ background: categoriaPorId[a.categoria].color }} />
              {categoriaPorId[a.categoria].nombre}
              <span className="text-(--sv-gris)">· {a.propio ? "recién publicado" : haceTexto(a.minutos)}</span>
            </p>
            <button type="button" onClick={() => setDetalle(null)} className={cerrarBtn} aria-label="Cerrar aviso">
              <Icon name="close" size={18} stroke={2.6} />
            </button>
          </div>
          <div className="grid gap-6 p-4 sm:p-6 md:grid-cols-[1.05fr_1fr] md:gap-8">
            <Galeria key={a.id} a={a} />
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-3">
                <EstadoTag estado={a.estado} />
                <Corazon id={a.id} titulo={a.titulo} grande />
              </div>
              <h2 id={id} className={`${display} mt-3 text-3xl font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-4xl`}>
                {a.titulo}
              </h2>
              <p className={`${display} mt-3 inline-block -rotate-1 rounded-xl border-[2.5px] border-(--sv-negro) bg-(--sv-amarillo) px-3 py-1 text-4xl font-extrabold tracking-[-0.03em] shadow-[3px_3px_0_#141414]`}>
                {pesos(a.precio)}
              </p>
              <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-(--sv-gris)">
                <Icon name="pin" size={16} stroke={2.2} />
                {a.barrio}, Córdoba
                {!a.aceptaOfertas && <span className="ml-2 rounded-full border-2 border-(--sv-negro) bg-white px-2 py-0.5 text-xs text-(--sv-negro)">Precio fijo</span>}
              </p>

              {a.propio ? (
                <p className="mt-5 rounded-2xl border-[2.5px] border-dashed border-(--sv-negro) bg-white p-4 text-sm font-semibold">
                  Este es tu aviso. Cuando alguien te escriba o te haga una oferta, te va a aparecer acá.
                </p>
              ) : (
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setOfertaPara(a.id)}
                    disabled={!a.aceptaOfertas}
                    className={`${boton} flex-1 bg-(--sv-violeta) px-5 py-3 text-white disabled:cursor-not-allowed disabled:bg-(--sv-gris)/40 disabled:text-(--sv-negro)/60 disabled:shadow-none disabled:hover:translate-y-0`}
                  >
                    <Icon name="tag" size={18} stroke={2.4} />
                    {a.aceptaOfertas ? "Hacer una oferta" : "No acepta ofertas"}
                  </button>
                  <button type="button" onClick={() => setChatCon(a.id)} className={`${boton} flex-1 bg-white px-5 py-3`}>
                    <Icon name="chat" size={18} stroke={2.4} />
                    Chatear con {a.vendedor.nombre.split(" ")[0]}
                  </button>
                </div>
              )}

              <p className="mt-6 leading-relaxed">{a.descripcion}</p>
              <dl className="mt-5 divide-y-2 divide-dashed divide-(--sv-negro)/15 rounded-2xl border-[2.5px] border-(--sv-negro) bg-white">
                {a.detalles.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
                    <dt className="font-semibold text-(--sv-gris)">{k}</dt>
                    <dd className="text-right font-bold">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 flex items-center gap-3 rounded-2xl border-[2.5px] border-(--sv-negro) bg-white p-4">
                <Avatar nombre={a.vendedor.nombre} color={a.vendedor.color} size={48} />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-extrabold">{a.vendedor.nombre}</p>
                  <p className="text-(--sv-gris)">
                    {a.propio ? "Publicaste hoy" : `${a.vendedor.ventas} ventas · desde ${a.vendedor.desde} · responde ${a.vendedor.responde}`}
                  </p>
                </div>
                {!a.propio && (
                  <span className="inline-flex items-center gap-1 rounded-full border-2 border-(--sv-negro) bg-(--sv-amarillo) px-2 py-0.5 text-sm font-extrabold">
                    <Icon name="star" size={14} filled stroke={1.6} />
                    {a.vendedor.rating.toFixed(1).replace(".", ",")}
                  </span>
                )}
              </div>
              <p className="mt-4 flex items-start gap-2 text-xs font-medium text-(--sv-gris)">
                <Icon name="shield" size={16} stroke={2.2} className="mt-px shrink-0" />
                Encontrate en un lugar público y revisá el producto antes de pagar. Nunca transfieras por adelantado.
              </p>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}

function Oferta() {
  const { ofertaPara, setOfertaPara, avisos, enviar, setChatCon } = useUsados();
  const a = avisos.find((x) => x.id === ofertaPara);
  const id = useId();
  const [monto, setMonto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [estado, setEstado] = useState<"form" | "enviando" | "listo">("form");
  const [para, setPara] = useState<string | null>(null);

  if (ofertaPara && ofertaPara !== para) {
    setPara(ofertaPara);
    setMonto("");
    setMensaje("");
    setError("");
    setEstado("form");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!a) return;
    const n = Number(monto);
    if (!n) return setError("Escribí cuánto querés ofrecer.");
    if (n >= a.precio) return setError(`Tu oferta tiene que ser menor que ${pesos(a.precio)}. Si te sirve el precio, escribile por chat para reservarlo.`);
    if (n < a.precio * 0.5) return setError(`Es muy baja: por debajo de ${pesos(Math.round(a.precio * 0.5))} los vendedores casi nunca responden.`);
    setError("");
    setEstado("enviando");
    await esperar(1100);
    enviar(a.id, `Te ofrezco ${pesos(n)}${mensaje.trim() ? `. ${mensaje.trim()}` : ""}`, n);
    setEstado("listo");
  }

  return (
    <Dialog
      open={!!a}
      onClose={() => estado !== "enviando" && setOfertaPara(null)}
      labelledBy={id}
      ancho="max-w-md"
      panelClassName="overflow-hidden rounded-[1.5rem] border-[2.5px] border-(--sv-negro) bg-white text-(--sv-negro) [font-family:var(--font-sv-sans)] shadow-[8px_8px_0_#141414]"
      overlayClassName="bg-(--sv-negro)/40"
    >
      {a && (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between gap-3 border-b-[2.5px] border-(--sv-negro) bg-(--sv-violeta) px-5 py-4 text-white">
            <h2 id={id} className={`${display} text-2xl font-extrabold tracking-[-0.02em]`}>
              {estado === "listo" ? "¡Oferta enviada!" : "Hacé una oferta"}
            </h2>
            <button type="button" onClick={() => setOfertaPara(null)} disabled={estado === "enviando"} className={`${cerrarBtn} text-(--sv-negro)`} aria-label="Cerrar oferta">
              <Icon name="close" size={18} stroke={2.6} />
            </button>
          </div>
          <div className="flex items-center gap-3 border-b-2 border-dashed border-(--sv-negro)/20 px-5 py-4">
            <Image src={a.imagenes[0]!.src} alt="" width={64} height={64} sizes="64px" className="size-16 rounded-xl border-2 border-(--sv-negro)" />
            <div className="min-w-0 text-sm">
              <p className="line-clamp-1 font-bold">{a.titulo}</p>
              <p className="text-(--sv-gris)">
                Precio publicado <strong className="text-(--sv-negro)">{pesos(a.precio)}</strong>
              </p>
            </div>
          </div>

          {estado === "listo" ? (
            <div className="px-5 py-7 text-center" aria-live="polite">
              <span className="mx-auto grid size-16 place-items-center rounded-full border-[2.5px] border-(--sv-negro) bg-(--sv-verde) shadow-[3px_3px_0_#141414]">
                <Icon name="send" size={28} stroke={2.4} />
              </span>
              <p className="mt-4 font-semibold">
                Le mandamos tu oferta de <strong>{pesos(Number(monto))}</strong> a {a.vendedor.nombre.split(" ")[0]}. La respuesta te llega al chat.
              </p>
              <p className="mt-2 text-sm text-(--sv-gris)">Es una demo: la respuesta es simulada.</p>
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => setOfertaPara(null)} className={`${boton} flex-1 bg-white px-4 py-3`}>
                  Listo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOfertaPara(null);
                    setChatCon(a.id);
                  }}
                  className={`${boton} flex-1 bg-(--sv-violeta) px-4 py-3 text-white`}
                >
                  Ir al chat
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="px-5 py-5">
              <p className="text-sm font-bold">Ofertas rápidas</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[5, 10, 15].map((p) => {
                  const v = Math.round((a.precio * (1 - p / 100)) / 500) * 500;
                  const on = Number(monto) === v;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setMonto(String(v));
                        setError("");
                      }}
                      aria-pressed={on}
                      className={`rounded-xl border-[2.5px] border-(--sv-negro) px-2 py-2 text-center transition ${foco} ${on ? "bg-(--sv-amarillo) shadow-[2px_2px_0_#141414]" : "bg-white hover:bg-(--sv-fondo)"}`}
                    >
                      <span className="block text-xs font-bold text-(--sv-gris)">−{p} %</span>
                      <span className="block text-sm font-extrabold tabular-nums">{pesos(v)}</span>
                    </button>
                  );
                })}
              </div>
              <label htmlFor={`${id}-monto`} className="mt-5 block text-sm font-bold">
                Tu oferta
              </label>
              <div className={`mt-1.5 flex items-center rounded-xl border-[2.5px] bg-(--sv-fondo) px-3 focus-within:shadow-[3px_3px_0_#7B5CFF] ${error ? "border-[#E0245E]" : "border-(--sv-negro)"}`}>
                <span className={`${display} text-2xl font-extrabold`}>$</span>
                <input
                  id={`${id}-monto`}
                  data-autofocus
                  inputMode="numeric"
                  value={monto ? Number(monto).toLocaleString("es-AR") : ""}
                  onChange={(e) => {
                    setMonto(e.target.value.replace(/\D/g, "").slice(0, 9));
                    setError("");
                  }}
                  aria-invalid={!!error}
                  aria-describedby={error ? `${id}-err` : undefined}
                  placeholder={Math.round(a.precio * 0.9).toLocaleString("es-AR")}
                  className={`${display} min-w-0 flex-1 bg-transparent px-2 py-2.5 text-2xl font-extrabold outline-none placeholder:text-(--sv-negro)/25`}
                />
              </div>
              {error && (
                <p id={`${id}-err`} role="alert" className="mt-2 text-sm font-semibold text-[#C2185B]">
                  {error}
                </p>
              )}
              <label htmlFor={`${id}-msg`} className="mt-5 block text-sm font-bold">
                Mensaje <span className="font-medium text-(--sv-gris)">(opcional)</span>
              </label>
              <textarea
                id={`${id}-msg`}
                rows={2}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value.slice(0, 200))}
                placeholder="Ej.: lo paso a buscar hoy mismo"
                className="mt-1.5 w-full resize-none rounded-xl border-[2.5px] border-(--sv-negro) bg-(--sv-fondo) px-3 py-2.5 text-sm outline-none focus:shadow-[3px_3px_0_#7B5CFF]"
              />
              <button type="submit" disabled={estado === "enviando"} className={`${boton} mt-5 w-full bg-(--sv-violeta) px-5 py-3.5 text-white disabled:opacity-80`}>
                {estado === "enviando" ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                    Enviando oferta…
                  </>
                ) : (
                  "Enviar oferta"
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </Dialog>
  );
}

const rapidas = ["¿Sigue disponible?", "¿Dónde lo puedo ver?", "¿Hacés envíos?", "¿Es tu último precio?"];

function Chat() {
  const { chatCon, setChatCon, avisos, chats, escribiendo, enviar } = useUsados();
  const a = avisos.find((x) => x.id === chatCon);
  const id = useId();
  const [texto, setTexto] = useState("");
  const lista = useRef<HTMLDivElement>(null);
  const mensajes = a ? (chats[a.id] ?? []) : [];
  const tipeando = !!a && escribiendo === a.id;

  useEffect(() => {
    const el = lista.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [mensajes.length, tipeando]);

  function mandar(t: string) {
    if (!a || !t.trim()) return;
    enviar(a.id, t.trim());
    setTexto("");
  }

  return (
    <Dialog
      open={!!a}
      onClose={() => setChatCon(null)}
      labelledBy={id}
      variant="right"
      ancho="max-w-md"
      panelClassName="border-l-[2.5px] border-(--sv-negro) bg-(--sv-fondo) text-(--sv-negro) [font-family:var(--font-sv-sans)]"
      overlayClassName="bg-(--sv-negro)/40"
    >
      {a && (
        <>
          <div className="flex items-center gap-3 border-b-[2.5px] border-(--sv-negro) bg-white px-4 py-3">
            <Avatar nombre={a.vendedor.nombre} color={a.vendedor.color} size={42} />
            <div className="min-w-0 flex-1">
              <h2 id={id} className="font-extrabold">
                Chat con {a.vendedor.nombre}
              </h2>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-(--sv-gris)">
                <span className="size-2 rounded-full bg-(--sv-verde) ring-2 ring-(--sv-negro)/20" />
                Responde {a.vendedor.responde}
              </p>
            </div>
            <button type="button" onClick={() => setChatCon(null)} className={cerrarBtn} aria-label="Cerrar chat">
              <Icon name="close" size={18} stroke={2.6} />
            </button>
          </div>
          <div className="flex items-center gap-3 border-b-2 border-dashed border-(--sv-negro)/20 bg-white/60 px-4 py-2.5">
            <Image src={a.imagenes[0]!.src} alt="" width={44} height={44} sizes="44px" className="size-11 rounded-lg border-2 border-(--sv-negro)" />
            <p className="min-w-0 flex-1 truncate text-sm font-bold">{a.titulo}</p>
            <p className={`${display} shrink-0 text-lg font-extrabold`}>{pesos(a.precio)}</p>
          </div>

          <div ref={lista} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4" role="log" aria-live="polite" aria-label="Mensajes">
            <p className="mx-auto max-w-xs rounded-xl border-2 border-(--sv-negro) bg-(--sv-amarillo) px-3 py-2 text-center text-xs font-semibold">
              Consejo: coordiná en un lugar público y no pagues nada por adelantado.
            </p>
            {mensajes.length === 0 && (
              <p className="py-6 text-center text-sm font-medium text-(--sv-gris)">Arrancá la charla con una pregunta rápida o escribí la tuya.</p>
            )}
            {mensajes.map((m) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.de === "yo" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[82%] rounded-2xl border-2 border-(--sv-negro) px-3.5 py-2 text-[0.95rem] ${
                    m.de === "yo" ? "rounded-br-md bg-(--sv-violeta) text-white" : "rounded-bl-md bg-white"
                  }`}
                >
                  {m.oferta !== undefined && (
                    <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-(--sv-amarillo) px-2 py-0.5 text-xs font-extrabold text-(--sv-negro)">
                      <Icon name="tag" size={12} stroke={2.6} />
                      Oferta
                    </span>
                  )}
                  <p>{m.texto}</p>
                  <p className={`mt-0.5 text-right text-[0.68rem] font-semibold ${m.de === "yo" ? "text-white/70" : "text-(--sv-gris)"}`}>
                    <span className="sr-only">{m.de === "yo" ? "Vos" : a.vendedor.nombre}, </span>
                    {m.hora}
                  </p>
                </div>
              </motion.div>
            ))}
            {tipeando && (
              <div className="flex justify-start" aria-label={`${a.vendedor.nombre} está escribiendo`}>
                <div className="flex gap-1 rounded-2xl rounded-bl-md border-2 border-(--sv-negro) bg-white px-4 py-3">
                  {[0, 1, 2].map((k) => (
                    <span key={k} className="size-2 animate-bounce rounded-full bg-(--sv-negro)/60 motion-reduce:animate-none" style={{ animationDelay: `${k * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t-[2.5px] border-(--sv-negro) bg-white px-3 pb-4 pt-3">
            <div className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-3">
              {rapidas.map((r) => (
                <button key={r} type="button" onClick={() => mandar(r)} className={`shrink-0 rounded-full border-2 border-(--sv-negro) bg-(--sv-fondo) px-3 py-1 text-sm font-bold transition hover:bg-(--sv-amarillo) ${foco}`}>
                  {r}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                mandar(texto);
              }}
              className="flex items-center gap-2"
            >
              <label htmlFor={`${id}-texto`} className="sr-only">
                Escribí un mensaje
              </label>
              <input
                id={`${id}-texto`}
                data-autofocus
                value={texto}
                onChange={(e) => setTexto(e.target.value.slice(0, 300))}
                placeholder="Escribí un mensaje…"
                autoComplete="off"
                className="min-w-0 flex-1 rounded-full border-[2.5px] border-(--sv-negro) bg-(--sv-fondo) px-4 py-2.5 text-[0.95rem] outline-none focus:shadow-[3px_3px_0_#7B5CFF]"
              />
              <button type="submit" disabled={!texto.trim()} className={`${boton} size-12 shrink-0 bg-(--sv-violeta) p-0 text-white disabled:opacity-50`} aria-label="Enviar mensaje">
                <Icon name="send" size={20} stroke={2.4} />
              </button>
            </form>
          </div>
        </>
      )}
    </Dialog>
  );
}

function Toast() {
  const { aviso } = useUsados();
  return (
    <div data-fuera-de-dialogo className="pointer-events-none fixed inset-x-0 top-20 z-[70] flex justify-center px-4 sm:top-24" role="status" aria-live="polite">
      <AnimatePresence>
        {aviso && (
          <motion.p
            key={aviso.id}
            initial={{ opacity: 0, y: -14, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: -14 }}
            className="flex max-w-md items-center gap-2 rounded-full border-[2.5px] border-(--sv-negro) bg-(--sv-amarillo) px-4 py-2 text-sm font-bold shadow-[3px_3px_0_#141414]"
          >
            <Icon name="heart" size={17} stroke={2.4} filled className="shrink-0 text-(--sv-rosa)" />
            {aviso.texto}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
