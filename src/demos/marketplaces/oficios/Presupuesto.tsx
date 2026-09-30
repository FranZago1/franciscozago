"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Dialog } from "../shared/Dialog";
import { Icon } from "../shared/Icon";
import { esperar } from "../shared/utils";
import { barrios, fotosTrabajo, franjas, oficios, profesionalPorId, type Franja, type OficioId } from "./data";
import { proximosDias } from "./Perfil";
import { useOficios } from "./store";
import { Estrellas, Verificado, ancho, foco, mono } from "./ui";

const pasos = ["El problema", "Día y horario", "Tus datos"];

type Datos = {
  descripcion: string;
  urgente: boolean;
  fotos: OficioId[];
  dia: number | null;
  franja: Franja | null;
  barrio: string;
  nombre: string;
  telefono: string;
  acepta: boolean;
};

type Errores = Partial<Record<"descripcion" | "dia" | "franja" | "barrio" | "nombre" | "telefono" | "acepta", string>>;

export function Presupuesto() {
  const { pedido, cerrarPedido } = useOficios();
  const p = pedido ? profesionalPorId[pedido.proId] : undefined;
  const id = useId();
  const reducir = useReducedMotion();
  const [paso, setPaso] = useState(0);
  const [estado, setEstado] = useState<"form" | "enviando" | "listo">("form");
  const [errores, setErrores] = useState<Errores>({});
  const [datos, setDatos] = useState<Datos>({ descripcion: "", urgente: false, fotos: [], dia: null, franja: null, barrio: "", nombre: "", telefono: "", acepta: false });
  const [codigo, setCodigo] = useState("");
  const cuerpo = useRef<HTMLDivElement>(null);
  const dias = proximosDias();

  // Cada vez que se abre para un profesional, arranca de cero con el problema que escribió en el buscador.
  const [abiertoPara, setAbiertoPara] = useState<string | null>(null);
  if (pedido && pedido.proId !== abiertoPara) {
    setAbiertoPara(pedido.proId);
    setPaso(0);
    setEstado("form");
    setErrores({});
    setDatos((d) => ({ ...d, descripcion: pedido.problema, urgente: false, fotos: [], dia: null, franja: null }));
  }
  if (!pedido && abiertoPara) setAbiertoPara(null);

  useEffect(() => {
    cuerpo.current?.scrollTo({ top: 0 });
    const t = window.setTimeout(() => cuerpo.current?.querySelector<HTMLElement>("[data-paso-foco]")?.focus(), 60);
    return () => window.clearTimeout(t);
  }, [paso, estado]);

  if (!p) return <Dialog open={false} onClose={cerrarPedido} labelledBy={id}>{null}</Dialog>;

  const set = <K extends keyof Datos>(k: K, v: Datos[K]) => {
    setDatos((d) => ({ ...d, [k]: v }));
    if (errores[k as keyof Errores]) setErrores((e) => ({ ...e, [k]: undefined }));
  };

  function validar(n: number): Errores {
    const e: Errores = {};
    if (n === 0 && datos.descripcion.trim().length < 15) e.descripcion = "Contanos un poco más (al menos 15 caracteres) para que te pasen un presupuesto real.";
    if (n === 1) {
      if (datos.dia === null) e.dia = "Elegí un día.";
      if (!datos.franja) e.franja = "Elegí una franja horaria.";
      if (!datos.barrio) e.barrio = "Elegí tu barrio.";
    }
    if (n === 2) {
      if (datos.nombre.trim().length < 2) e.nombre = "Escribí tu nombre.";
      if (datos.telefono.replace(/\D/g, "").length < 8) e.telefono = "Ingresá un teléfono válido, con código de área.";
      if (!datos.acepta) e.acepta = "Necesitamos tu permiso para compartir tus datos con el profesional.";
    }
    return e;
  }

  async function avanzar(ev: FormEvent) {
    ev.preventDefault();
    const e = validar(paso);
    setErrores(e);
    if (Object.keys(e).length) {
      const primero = Object.keys(e)[0];
      window.setTimeout(() => document.getElementById(`${id}-${primero}`)?.focus(), 0);
      return;
    }
    if (paso < 2) return setPaso(paso + 1);
    setEstado("enviando");
    await esperar(1400);
    setCodigo(`MA-${2800 + Math.floor(Math.random() * 700)}`);
    setEstado("listo");
  }

  const disponibles = datos.dia !== null ? p.agenda[datos.dia] ?? [false, false, false] : [true, true, true];
  const pool: OficioId[] = [p.oficio, ...oficios.map((o) => o.id).filter((x) => x !== p.oficio)];
  const campo = "mt-1.5 w-full rounded-lg border-2 bg-white px-3.5 py-3 text-[0.95rem] outline-none transition focus:border-(--ma-azul3) focus:ring-4 focus:ring-(--ma-azul3)/15";
  const borde = (k: keyof Errores) => (errores[k] ? "border-(--ma-rojo)" : "border-(--ma-linea)");
  const err = (k: keyof Errores) =>
    errores[k] ? (
      <p id={`${id}-${k}-err`} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-(--ma-rojo)">
        <Icon name="info" size={15} stroke={2.2} className="mt-0.5 shrink-0" />
        {errores[k]}
      </p>
    ) : null;
  const nombreCorto = p.nombre.split(" ")[0];
  const diaElegido = datos.dia !== null ? dias[datos.dia] : undefined;
  const franjaElegida = franjas.find((f) => f.id === datos.franja);

  return (
    <Dialog
      open={!!pedido}
      onClose={() => estado !== "enviando" && cerrarPedido()}
      labelledBy={id}
      variant="sheet"
      ancho="sm:max-w-xl"
      panelClassName="overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white text-(--ma-tinta) [font-family:var(--font-ma-sans)] shadow-2xl"
      overlayClassName="bg-(--ma-azul)/65"
    >
      <div className="border-b border-(--ma-linea) px-5 pb-4 pt-5 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Image src={p.imagen} alt="" width={48} height={48} sizes="48px" className="size-12 rounded-lg" />
            <div>
              <h2 id={id} className={`${ancho} text-lg font-extrabold leading-tight text-(--ma-azul)`}>
                {estado === "listo" ? "Pedido enviado" : `Pedir presupuesto a ${nombreCorto}`}
              </h2>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-(--ma-gris)">
                <Estrellas valor={p.rating} size={12} />
                <span>{p.rating.toFixed(1).replace(".", ",")} · responde en ~{p.respuestaMin} min</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={cerrarPedido}
            disabled={estado === "enviando"}
            className={`grid size-10 shrink-0 place-items-center rounded-lg border-2 border-(--ma-linea) hover:bg-(--ma-fondo) disabled:opacity-50 ${foco}`}
            aria-label="Cerrar"
          >
            <Icon name="close" size={18} stroke={2.2} />
          </button>
        </div>
        {estado !== "listo" && (
          <ol className="mt-5 grid grid-cols-3 gap-2" aria-label="Pasos">
            {pasos.map((t, i) => (
              <li key={t} aria-current={i === paso ? "step" : undefined}>
                <span className={`block h-1.5 rounded-full transition-colors ${i <= paso ? "bg-(--ma-amarillo2)" : "bg-(--ma-linea)"}`} />
                <span className={`mt-1.5 block text-xs font-bold ${i === paso ? "text-(--ma-azul)" : "text-(--ma-gris)"}`}>
                  <span className={mono}>{i + 1}.</span> {t}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>

      {estado === "listo" ? (
        <div ref={cuerpo} className="min-h-0 flex-1 overflow-y-auto px-5 py-7 sm:px-6" aria-live="polite">
          <motion.div
            initial={reducir ? false : { scale: 0.5, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            className="mx-auto grid size-16 place-items-center rounded-2xl bg-(--ma-verde) text-white"
          >
            <Icon name="check" size={34} stroke={3} />
          </motion.div>
          <p tabIndex={-1} data-paso-foco className={`${ancho} mt-4 text-center text-2xl font-extrabold text-(--ma-azul) outline-none`}>
            ¡Listo, {datos.nombre.split(" ")[0]}!
          </p>
          <p className="mt-1 text-center text-(--ma-gris)">
            Le enviamos tu pedido a {nombreCorto}. Código <span className={`${mono} font-semibold text-(--ma-tinta)`}>{codigo}</span>
          </p>
          <ol className="relative mt-7 space-y-5 pl-9 before:absolute before:bottom-2 before:left-[0.9rem] before:top-2 before:w-0.5 before:bg-(--ma-linea)">
            {[
              ["Pedido enviado", `Con tu descripción${datos.fotos.length ? ` y ${datos.fotos.length} ${datos.fotos.length === 1 ? "foto" : "fotos"}` : ""}.`, true],
              [`${nombreCorto} lo revisa`, `Suele responder en unos ${p.respuestaMin} minutos.`, false],
              ["Te llega el presupuesto", "Lo ves acá y por mensaje. Sin compromiso.", false],
              ["Coordinan la visita", `${diaElegido?.corto ?? ""} ${diaElegido?.numero ?? ""}, ${franjaElegida?.nombre.toLowerCase() ?? ""} (${franjaElegida?.horario ?? ""}), en ${datos.barrio}.`, false],
            ].map(([t, d, hecho], i) => (
              <li key={String(t)} className="relative">
                <span
                  className={`absolute -left-9 top-0 grid size-7 place-items-center rounded-full border-2 text-xs font-bold ${
                    hecho ? "border-(--ma-verde) bg-(--ma-verde) text-white" : "border-(--ma-linea) bg-white text-(--ma-gris)"
                  }`}
                >
                  {hecho ? <Icon name="check" size={14} stroke={3} /> : i + 1}
                </span>
                <p className="font-bold">{t}</p>
                <p className="text-sm text-(--ma-gris)">{d}</p>
              </li>
            ))}
          </ol>
          <p className="mt-7 rounded-lg bg-(--ma-fondo) p-3 text-center text-sm text-(--ma-gris)">
            Es una demo: el pedido no se envió a nadie y tus datos no salieron de este navegador.
          </p>
          <button type="button" onClick={cerrarPedido} className={`mt-4 w-full rounded-lg bg-(--ma-azul) px-5 py-3.5 font-bold text-white ${foco}`}>
            Volver a los profesionales
          </button>
        </div>
      ) : (
        <form onSubmit={avanzar} noValidate className="flex min-h-0 flex-1 flex-col">
          <div ref={cuerpo} className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={paso}
                initial={reducir ? { opacity: 0 } : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reducir ? { opacity: 0 } : { opacity: 0, x: -24 }}
                transition={{ duration: 0.2 }}
              >
                {paso === 0 && (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor={`${id}-descripcion`} className="font-bold">
                        Describí el problema
                      </label>
                      <p className="text-sm text-(--ma-gris)">Qué pasa, desde cuándo y dónde. Cuanto más claro, más preciso el presupuesto.</p>
                      <textarea
                        id={`${id}-descripcion`}
                        data-paso-foco
                        data-autofocus
                        rows={4}
                        value={datos.descripcion}
                        onChange={(e) => set("descripcion", e.target.value.slice(0, 400))}
                        placeholder="Ej.: La canilla de la cocina gotea desde hace una semana, incluso cerrada."
                        aria-invalid={!!errores.descripcion}
                        aria-describedby={`${id}-desc-cuenta${errores.descripcion ? ` ${id}-descripcion-err` : ""}`}
                        className={`${campo} ${borde("descripcion")} resize-none`}
                      />
                      <div className="flex justify-between gap-3">
                        <div>{err("descripcion")}</div>
                        <p id={`${id}-desc-cuenta`} className={`${mono} mt-1.5 shrink-0 text-xs text-(--ma-gris)`}>
                          {datos.descripcion.length}/400
                        </p>
                      </div>
                    </div>

                    {p.urgencias && (
                      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border-2 border-(--ma-linea) px-4 py-3 has-[:checked]:border-(--ma-rojo) has-[:checked]:bg-(--ma-rojo)/5 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-(--ma-amarillo2)">
                        <span>
                          <span className="flex items-center gap-2 font-bold">
                            <Icon name="bolt" size={17} stroke={2.2} className="text-(--ma-rojo)" />
                            Es una urgencia
                          </span>
                          <span className="block text-sm text-(--ma-gris)">{nombreCorto} atiende urgencias en el día (puede tener recargo).</span>
                        </span>
                        <input type="checkbox" checked={datos.urgente} onChange={(e) => set("urgente", e.target.checked)} className="size-5 shrink-0 accent-(--ma-rojo)" />
                      </label>
                    )}

                    <div>
                      <p className="font-bold">
                        Fotos <span className="font-normal text-(--ma-gris)">(opcional, hasta 3)</span>
                      </p>
                      <p className="text-sm text-(--ma-gris)">En esta demo las fotos son simuladas: tocá “Agregar foto” y sumamos una de ejemplo.</p>
                      <ul className="mt-3 grid grid-cols-3 gap-2.5">
                        {datos.fotos.map((f, i) => (
                          <li key={`${f}-${i}`} className="relative aspect-[4/3] overflow-hidden rounded-lg border-2 border-(--ma-linea)">
                            <Image src={fotosTrabajo[f].src} alt={`Foto ${i + 1} del problema (simulada)`} fill sizes="160px" className="object-cover" />
                            <button
                              type="button"
                              onClick={() => set("fotos", datos.fotos.filter((_, k) => k !== i))}
                              className={`absolute right-1 top-1 grid size-7 place-items-center rounded-full bg-(--ma-tinta)/80 text-white hover:bg-(--ma-tinta) ${foco}`}
                              aria-label={`Quitar foto ${i + 1}`}
                            >
                              <Icon name="close" size={14} stroke={2.6} />
                            </button>
                          </li>
                        ))}
                        {datos.fotos.length < 3 && (
                          <li>
                            <button
                              type="button"
                              onClick={() => set("fotos", [...datos.fotos, pool[datos.fotos.length % pool.length]!])}
                              className={`flex aspect-[4/3] w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-(--ma-azul3)/40 bg-(--ma-fondo) text-sm font-bold text-(--ma-azul3) transition hover:border-(--ma-azul3) ${foco}`}
                            >
                              <Icon name="camera" size={22} stroke={2} />
                              Agregar foto
                            </button>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {paso === 1 && (
                  <div className="space-y-6">
                    <fieldset>
                      <legend className="font-bold">¿Qué día te viene bien?</legend>
                      <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1" role="radiogroup" aria-describedby={errores.dia ? `${id}-dia-err` : undefined}>
                        {dias.map((d, i) => {
                          const libre = p.agenda[i]?.some(Boolean);
                          const sel = datos.dia === i;
                          return (
                            <label
                              key={d.numero}
                              className={`flex w-16 shrink-0 cursor-pointer flex-col items-center rounded-lg border-2 py-2.5 transition has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-(--ma-amarillo2) ${
                                sel ? "border-(--ma-azul) bg-(--ma-azul) text-white" : libre ? "border-(--ma-linea) hover:border-(--ma-azul)/50" : "cursor-not-allowed border-(--ma-linea) bg-(--ma-fondo) text-(--ma-gris)/60"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`${id}-dia`}
                                id={i === 0 ? `${id}-dia` : undefined}
                                data-paso-foco={i === 0 ? true : undefined}
                                checked={sel}
                                disabled={!libre}
                                onChange={() => {
                                  set("dia", i);
                                  if (datos.franja && !p.agenda[i]?.[franjas.findIndex((f) => f.id === datos.franja)]) set("franja", null);
                                }}
                                className="sr-only"
                              />
                              <span className="text-xs font-semibold">{d.corto}</span>
                              <span className={`${mono} text-lg font-semibold`}>{d.numero}</span>
                              <span className={`mt-0.5 size-1.5 rounded-full ${libre ? (sel ? "bg-(--ma-amarillo)" : "bg-(--ma-verde)") : "bg-transparent"}`} />
                            </label>
                          );
                        })}
                      </div>
                      {err("dia")}
                    </fieldset>

                    <fieldset>
                      <legend className="font-bold">Franja horaria</legend>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {franjas.map((f, fi) => {
                          const ok = disponibles[fi];
                          return (
                            <label
                              key={f.id}
                              className={`cursor-pointer rounded-lg border-2 px-2 py-3 text-center transition has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-(--ma-amarillo2) ${
                                datos.franja === f.id ? "border-(--ma-azul) bg-(--ma-azul) text-white" : ok ? "border-(--ma-linea) hover:border-(--ma-azul)/50" : "cursor-not-allowed border-(--ma-linea) bg-(--ma-fondo) text-(--ma-gris)/60"
                              }`}
                            >
                              <input
                                type="radio"
                                id={fi === 0 ? `${id}-franja` : undefined}
                                name={`${id}-franja`}
                                checked={datos.franja === f.id}
                                disabled={!ok}
                                onChange={() => set("franja", f.id)}
                                className="sr-only"
                              />
                              <span className="block text-sm font-bold">{f.nombre}</span>
                              <span className={`${mono} block text-xs opacity-75`}>{ok ? f.horario : "Ocupado"}</span>
                            </label>
                          );
                        })}
                      </div>
                      {err("franja")}
                    </fieldset>

                    <div>
                      <label htmlFor={`${id}-barrio`} className="font-bold">
                        Barrio
                      </label>
                      <select
                        id={`${id}-barrio`}
                        value={datos.barrio}
                        onChange={(e) => set("barrio", e.target.value)}
                        aria-invalid={!!errores.barrio}
                        aria-describedby={errores.barrio ? `${id}-barrio-err` : undefined}
                        className={`${campo} ${borde("barrio")}`}
                      >
                        <option value="">Elegí tu barrio</option>
                        {barrios.map((b) => (
                          <option key={b}>{b}</option>
                        ))}
                      </select>
                      {err("barrio")}
                      {datos.barrio && !p.barrios.includes(datos.barrio) && (
                        <p className="mt-2 flex items-start gap-1.5 text-sm text-(--ma-azul3)">
                          <Icon name="info" size={15} className="mt-0.5 shrink-0" />
                          {nombreCorto} no suele trabajar en {datos.barrio}, pero le llega igual y te confirma si puede ir.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {paso === 2 && (
                  <div className="space-y-5">
                    <div className="rounded-lg bg-(--ma-fondo) p-4 text-sm">
                      <p className="font-bold text-(--ma-azul)">Resumen del pedido</p>
                      <p className="mt-1 line-clamp-2 text-(--ma-tinta)/85">“{datos.descripcion}”</p>
                      <p className="mt-2 text-(--ma-gris)">
                        {diaElegido?.corto} {diaElegido?.numero} · {franjaElegida?.nombre} ({franjaElegida?.horario}) · {datos.barrio}
                        {datos.urgente && " · Urgente"}
                        {datos.fotos.length > 0 && ` · ${datos.fotos.length} ${datos.fotos.length === 1 ? "foto" : "fotos"}`}
                      </p>
                    </div>
                    <div>
                      <label htmlFor={`${id}-nombre`} className="font-bold">
                        Nombre
                      </label>
                      <input
                        id={`${id}-nombre`}
                        data-paso-foco
                        value={datos.nombre}
                        onChange={(e) => set("nombre", e.target.value)}
                        autoComplete="name"
                        aria-invalid={!!errores.nombre}
                        aria-describedby={errores.nombre ? `${id}-nombre-err` : undefined}
                        className={`${campo} ${borde("nombre")}`}
                      />
                      {err("nombre")}
                    </div>
                    <div>
                      <label htmlFor={`${id}-telefono`} className="font-bold">
                        Teléfono
                      </label>
                      <input
                        id={`${id}-telefono`}
                        value={datos.telefono}
                        onChange={(e) => set("telefono", e.target.value)}
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="351 555 0123"
                        aria-invalid={!!errores.telefono}
                        aria-describedby={errores.telefono ? `${id}-telefono-err` : undefined}
                        className={`${campo} ${borde("telefono")}`}
                      />
                      {err("telefono")}
                    </div>
                    <div>
                      <label className="flex cursor-pointer items-start gap-3 text-sm">
                        <input
                          id={`${id}-acepta`}
                          type="checkbox"
                          checked={datos.acepta}
                          onChange={(e) => set("acepta", e.target.checked)}
                          aria-describedby={errores.acepta ? `${id}-acepta-err` : undefined}
                          className="mt-0.5 size-5 shrink-0 accent-(--ma-azul)"
                        />
                        <span>Acepto que ManoAmiga comparta mi nombre y teléfono con {nombreCorto} para coordinar el trabajo.</span>
                      </label>
                      {err("acepta")}
                    </div>
                    <Verificado matricula={p.matricula} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-3 border-t border-(--ma-linea) bg-white px-5 py-4 sm:px-6">
            {paso > 0 && (
              <button
                type="button"
                onClick={() => {
                  setErrores({});
                  setPaso(paso - 1);
                }}
                disabled={estado === "enviando"}
                className={`inline-flex items-center gap-1.5 rounded-lg border-2 border-(--ma-linea) px-4 py-3 text-sm font-bold ${foco}`}
              >
                <Icon name="arrowLeft" size={17} stroke={2.2} />
                Atrás
              </button>
            )}
            <button
              type="submit"
              disabled={estado === "enviando"}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-(--ma-amarillo) px-5 py-3 text-sm font-extrabold text-(--ma-azul) shadow-[0_3px_0_#C99400] transition hover:bg-(--ma-amarillo2) disabled:opacity-80 ${foco}`}
            >
              {estado === "enviando" ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-(--ma-azul)/30 border-t-(--ma-azul)" aria-hidden="true" />
                  Enviando a {nombreCorto}…
                </>
              ) : paso < 2 ? (
                <>
                  Continuar
                  <Icon name="arrowRight" size={17} stroke={2.4} />
                </>
              ) : (
                <>
                  <Icon name="send" size={17} stroke={2.2} />
                  Enviar pedido
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
