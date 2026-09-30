"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { z } from "zod";
import { codigoReserva } from "../shared/azar";
import { Calendario, type InfoDia } from "../shared/Calendario";
import { diaSemana, duracionTexto, fechaLarga, hhmm, pesos, sumarDias, type DiaISO } from "../shared/fechas";
import { emitirDemo, irA, useAhora, useEscucharDemo, useReservasGuardadas } from "../shared/hooks";
import { descargarIcs } from "../shared/ics";
import {
  IconoAlerta,
  IconoCalendario,
  IconoCheck,
  IconoChevronDer,
  IconoChevronIzq,
  IconoDescarga,
  IconoFlecha,
  IconoFlechaIzq,
  IconoReloj,
  IconoTijera,
} from "../shared/Iconos";
import {
  DIAS_ANTICIPACION,
  barberoPorId,
  barberos,
  diasTexto,
  disponibilidadDia,
  grupos,
  horarioLocal,
  negocio,
  puedeHacer,
  servicioPorId,
  servicios,
  totales,
  type ReservaBarberia,
} from "./datos";

const serif = "[font-family:var(--font-df-serif)]";

type Paso = 1 | 2 | 3 | 4;

const PASOS: { n: Paso; titulo: string }[] = [
  { n: 1, titulo: "Servicios" },
  { n: 2, titulo: "Barbero" },
  { n: 3, titulo: "Día y hora" },
  { n: 4, titulo: "Tus datos" },
];

const esquema = z.object({
  nombre: z.string().trim().min(2, "Escribí tu nombre (mínimo 2 letras)."),
  telefono: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{7,17}$/, "Escribí un celular válido, con característica (ej. 351 555 1234)."),
  email: z.union([z.literal(""), z.email("Ese email no parece válido.")]),
  nota: z.string().max(200, "Máximo 200 caracteres."),
});

type Form = { nombre: string; telefono: string; email: string; nota: string; recordatorio: boolean };

export const EVENTO_SERVICIO = "barberia:servicio";
export const EVENTO_BARBERO = "barberia:barbero";

const boton =
  "inline-flex items-center justify-center gap-2 rounded-[3px] bg-[#7a1e2c] px-5 py-3 text-sm font-semibold tracking-wide text-[#f6efe3] uppercase transition hover:bg-[#8e2536] active:translate-y-px disabled:cursor-not-allowed disabled:bg-[#7a1e2c]/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a1e2c]";
const botonSec =
  "inline-flex items-center justify-center gap-2 rounded-[3px] border border-[#1b1714]/25 px-4 py-3 text-sm font-medium tracking-wide text-[#1b1714] uppercase transition hover:border-[#1b1714] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a1e2c]";

export function Reserva() {
  const ahora = useAhora();
  const { lista: propias, guardar } = useReservasGuardadas<ReservaBarberia>("barberia");
  const [paso, setPaso] = useState<Paso>(1);
  const [ids, setIds] = useState<string[]>([]);
  const [barbero, setBarbero] = useState("cualquiera");
  const [dia, setDia] = useState<DiaISO | null>(null);
  const [hora, setHora] = useState<number | null>(null);
  const [form, setForm] = useState<Form>({ nombre: "", telefono: "", email: "", nota: "", recordatorio: true });
  const [errores, setErrores] = useState<Partial<Record<keyof Form, string>>>({});
  const [envio, setEnvio] = useState<"listo" | "enviando" | "error">("listo");
  const [confirmada, setConfirmada] = useState<ReservaBarberia | null>(null);
  const [aviso, setAviso] = useState("");
  const [resumenAbierto, setResumenAbierto] = useState(false);
  const tituloPaso = useRef<HTMLHeadingElement>(null);
  const seccion = useRef<HTMLElement>(null);
  const moverFoco = useRef(false);

  const tot = useMemo(() => totales(ids), [ids]);
  const hoy = ahora?.dia ?? null;
  const maxDia = hoy ? sumarDias(hoy, DIAS_ANTICIPACION) : null;

  // Disponibilidad de todos los días del período (se recalcula al cambiar servicio, barbero o reservas propias).
  const agenda = useMemo(() => {
    const mapa = new Map<DiaISO, Map<number, string[]>>();
    if (!ahora || !hoy || !tot.minutos) return mapa;
    for (let i = 0; i <= DIAS_ANTICIPACION; i++) {
      const d = sumarDias(hoy, i);
      mapa.set(d, disponibilidadDia(d, ids, barbero, ahora, propias));
    }
    return mapa;
  }, [ahora, hoy, ids, barbero, propias, tot.minutos]);

  const libresDia = dia ? agenda.get(dia) : undefined;
  const horaValida = hora !== null && Boolean(libresDia?.has(hora));
  const asignado = horaValida && hora !== null ? libresDia?.get(hora)?.[0] : undefined;

  useEffect(() => {
    if (!moverFoco.current) return;
    moverFoco.current = false;
    irA(tituloPaso.current);
  }, [paso, confirmada]);

  function ir(p: Paso) {
    moverFoco.current = true;
    setPaso(p);
    setResumenAbierto(false);
  }

  function alternarServicio(id: string) {
    const s = servicioPorId(id);
    if (!s) return;
    setIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      // Cortes y barba: uno por grupo. Extras: se suman.
      const sinGrupo = s.grupo === "extra" ? prev : prev.filter((x) => servicioPorId(x)?.grupo !== s.grupo);
      return [...sinGrupo, id];
    });
    setHora(null);
  }

  function elegirBarbero(id: string) {
    setBarbero(id);
    setHora(null);
    const b = barberoPorId(id);
    setAviso(b ? `Elegiste a ${b.nombre}.` : "Te asignamos el primer barbero libre.");
  }

  // "Reservar este servicio" o "Reservar con Tano" desde otras secciones de la página.
  useEscucharDemo<string>(EVENTO_SERVICIO, (id) => {
    if (confirmada) nuevaReserva();
    if (!ids.includes(id)) alternarServicio(id);
    ir(1);
    setAviso(`Agregaste ${servicioPorId(id)?.nombre ?? "el servicio"}.`);
  });
  useEscucharDemo<string>(EVENTO_BARBERO, (id) => {
    if (confirmada) nuevaReserva();
    elegirBarbero(id);
    ir(ids.length ? 2 : 1);
  });

  function elegirDia(d: DiaISO) {
    setDia(d);
    setHora(null);
    const n = agenda.get(d)?.size ?? 0;
    setAviso(`${fechaLarga(d)}: ${n} horarios libres.`);
  }

  function nuevaReserva() {
    setConfirmada(null);
    setIds([]);
    setDia(null);
    setHora(null);
    setBarbero("cualquiera");
    setEnvio("listo");
    setForm((f) => ({ ...f, nota: "" }));
    moverFoco.current = true;
    setPaso(1);
  }

  function confirmar(e: React.FormEvent) {
    e.preventDefault();
    const r = esquema.safeParse(form);
    if (!r.success) {
      const errs: Partial<Record<keyof Form, string>> = {};
      for (const issue of r.error.issues) {
        const k = issue.path[0] as keyof Form;
        errs[k] ??= issue.message;
      }
      setErrores(errs);
      setAviso("Revisá los datos marcados.");
      const primero = Object.keys(errs)[0];
      if (primero) document.getElementById(`df-${primero}`)?.focus();
      return;
    }
    setErrores({});
    if (!dia || hora === null || !ahora) return;
    setEnvio("enviando");
    setAviso("Confirmando tu turno…");
    window.setTimeout(() => {
      // Se vuelve a chequear: el horario pudo ocuparse mientras completabas (ej. en otra pestaña).
      const libres = disponibilidadDia(dia, ids, barbero, ahora, propias);
      const quien = libres.get(hora)?.[0];
      if (!quien) {
        setEnvio("error");
        setAviso("Ese horario se acaba de ocupar. Elegí otro.");
        return;
      }
      const reserva: ReservaBarberia = {
        id: crypto.randomUUID(),
        codigo: codigoReserva("DF"),
        estado: "confirmada",
        creada: new Date().toISOString(),
        dia,
        inicio: hora,
        fin: hora + tot.minutos,
        servicios: ids,
        barbero: quien,
        asignado: barbero === "cualquiera",
        total: tot.total,
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim(),
      };
      guardar(reserva);
      setEnvio("listo");
      setConfirmada(reserva);
      moverFoco.current = true;
      setAviso(`Turno confirmado. Código ${reserva.codigo}.`);
    }, 1100);
  }

  const puedePaso = (p: Paso) =>
    p === 1 || (p === 2 && ids.length > 0) || (p === 3 && ids.length > 0) || (p === 4 && ids.length > 0 && horaValida);

  const resumen = (
    <Resumen
      ids={ids}
      barbero={barbero}
      asignado={asignado}
      dia={dia}
      hora={horaValida ? hora : null}
      total={tot.total}
      bruto={tot.bruto}
      descuento={tot.descuento}
      minutos={tot.minutos}
    />
  );

  return (
    <section
      ref={seccion}
      id="reservar"
      aria-labelledby="reservar-titulo"
      className="scroll-mt-4 bg-[#efe6d6] text-[#1b1714]"
    >
      <p className="sr-only" aria-live="polite" role="status">
        {aviso}
      </p>
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-[#7a1e2c] uppercase">Turnos online</p>
            <h2 id="reservar-titulo" className={`${serif} mt-3 text-5xl leading-none md:text-7xl`}>
              Reservá tu turno
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-[#5c5247]">
            Elegí qué te hacés, con quién y cuándo. Te confirmamos al instante y te llega un recordatorio.
          </p>
        </div>

        {confirmada ? (
          <Confirmacion reserva={confirmada} tituloRef={tituloPaso} onOtra={nuevaReserva} />
        ) : (
          <>
            <nav aria-label="Pasos de la reserva" className="mt-12">
              <ol className="grid grid-cols-4 gap-1.5 sm:gap-3">
                {PASOS.map(({ n, titulo }) => {
                  const activo = paso === n;
                  const hecho = paso > n;
                  return (
                    <li key={n}>
                      <button
                        type="button"
                        onClick={() => ir(n)}
                        disabled={!puedePaso(n)}
                        aria-current={activo ? "step" : undefined}
                        className={`group flex w-full flex-col items-start gap-2 border-t-2 pt-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7a1e2c] disabled:cursor-not-allowed ${
                          activo ? "border-[#7a1e2c]" : hecho ? "border-[#1b1714]" : "border-[#1b1714]/15"
                        }`}
                      >
                        <span
                          className={`grid size-6 place-items-center rounded-full text-[11px] font-bold ${
                            activo ? "bg-[#7a1e2c] text-[#f6efe3]" : hecho ? "bg-[#1b1714] text-[#efe6d6]" : "bg-[#1b1714]/10 text-[#1b1714]/50"
                          }`}
                        >
                          {hecho ? <IconoCheck width={13} height={13} grosor={3} /> : n}
                        </span>
                        <span
                          className={`text-[11px] font-semibold tracking-wide [word-spacing:0.18em] uppercase sm:text-xs ${
                            activo ? "text-[#1b1714]" : "text-[#1b1714]/55 group-enabled:group-hover:text-[#1b1714]"
                          }`}
                        >
                          {titulo}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>

            {/* Resumen compacto pegajoso en mobile */}
            <div className="sticky top-0 z-30 -mx-4 mt-6 border-y border-[#1b1714]/10 bg-[#efe6d6]/95 px-4 py-3 backdrop-blur lg:hidden">
              <button
                type="button"
                onClick={() => setResumenAbierto((v) => !v)}
                aria-expanded={resumenAbierto}
                aria-controls="df-resumen-mobile"
                className="flex w-full items-center justify-between gap-3 text-left text-sm focus-visible:outline-2 focus-visible:outline-[#7a1e2c]"
              >
                <span className="min-w-0 truncate">
                  <span className="font-semibold">Tu turno</span>
                  <span className="text-[#5c5247]">
                    {" · "}
                    {ids.length ? `${ids.length} ${ids.length === 1 ? "servicio" : "servicios"} · ${duracionTexto(tot.minutos)}` : "sin servicios"}
                    {dia && horaValida && hora !== null ? ` · ${fechaCortaTexto(dia)} ${hhmm(hora)}` : ""}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2 font-semibold">
                  {pesos(tot.total)}
                  <IconoChevronDer width={16} height={16} className={`transition ${resumenAbierto ? "rotate-90" : ""}`} />
                </span>
              </button>
              <div id="df-resumen-mobile" hidden={!resumenAbierto} className="pt-4">
                {resumen}
              </div>
            </div>

            <div className="mt-6 grid gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="min-w-0">
                <h3 ref={tituloPaso} tabIndex={-1} className={`${serif} scroll-mt-20 text-3xl outline-none md:text-4xl`}>
                  {paso === 1 && "¿Qué te hacés?"}
                  {paso === 2 && "¿Con quién?"}
                  {paso === 3 && "¿Cuándo venís?"}
                  {paso === 4 && "Último paso: tus datos"}
                </h3>

                {paso === 1 && (
                  <div className="mt-6 grid gap-10">
                    {grupos.map((g) => (
                      <fieldset key={g.id}>
                        <legend className="flex w-full items-baseline justify-between border-b border-[#1b1714]/15 pb-2">
                          <span className="text-xs font-bold tracking-[0.2em] uppercase">{g.titulo}</span>
                          <span className="text-xs text-[#5c5247]">{g.nota}</span>
                        </legend>
                        <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                          {servicios
                            .filter((s) => s.grupo === g.id)
                            .map((s) => {
                              const activo = ids.includes(s.id);
                              return (
                                <li key={s.id}>
                                  <label
                                    className={`relative flex h-full cursor-pointer gap-4 rounded-[3px] border bg-[#f6efe3] p-4 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#7a1e2c] ${
                                      activo ? "border-[#7a1e2c] shadow-[inset_0_0_0_1px_#7a1e2c]" : "border-[#1b1714]/12 hover:border-[#1b1714]/40"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      className="sr-only"
                                      checked={activo}
                                      onChange={() => alternarServicio(s.id)}
                                    />
                                    <span
                                      aria-hidden="true"
                                      className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-[2px] border transition ${
                                        activo ? "border-[#7a1e2c] bg-[#7a1e2c] text-[#f6efe3]" : "border-[#1b1714]/35"
                                      }`}
                                    >
                                      {activo ? <IconoCheck width={13} height={13} grosor={3} /> : null}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                      <span className="flex items-baseline gap-2">
                                        <span className="font-semibold">{s.nombre}</span>
                                        <span aria-hidden="true" className="mb-1 flex-1 border-b border-dotted border-[#1b1714]/30" />
                                        <span className="font-semibold tabular-nums">{pesos(s.precio)}</span>
                                      </span>
                                      <span className="mt-1 block text-sm leading-snug text-[#5c5247]">{s.detalle}</span>
                                      <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#5c5247]">
                                        <IconoReloj width={14} height={14} /> {duracionTexto(s.minutos)}
                                      </span>
                                    </span>
                                  </label>
                                </li>
                              );
                            })}
                        </ul>
                      </fieldset>
                    ))}
                    <p className="flex items-start gap-2.5 rounded-[3px] border border-dashed border-[#c29b5a] bg-[#c29b5a]/10 p-4 text-sm">
                      <IconoTijera width={18} height={18} className="mt-0.5 shrink-0 text-[#8f6d38]" />
                      <span>
                        <strong>Corte + barba en el mismo turno: 10 % off.</strong>{" "}
                        <span className="text-[#5c5247]">Se aplica solo en el total.</span>
                      </span>
                    </p>
                    <Acciones>
                      <span />
                      <button type="button" className={boton} disabled={!ids.length} onClick={() => ir(2)}>
                        Elegir barbero <IconoFlecha width={16} height={16} />
                      </button>
                    </Acciones>
                  </div>
                )}

                {paso === 2 && (
                  <div className="mt-6">
                    <fieldset>
                      <legend className="sr-only">Elegí barbero</legend>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <TarjetaBarbero
                          id="cualquiera"
                          activo={barbero === "cualquiera"}
                          onElegir={elegirBarbero}
                          titulo="El primero libre"
                          bajada="Te mostramos todos los horarios y asignamos al barbero con menos espera."
                          dias="Mar a Sáb"
                          visual={
                            <span className="grid size-full place-items-center bg-[#141210] text-[#c29b5a]">
                              <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="17" cy="18" r="6" />
                                <circle cx="31" cy="18" r="6" />
                                <path d="M6 38c1.5-7 6-10 11-10s9.5 3 11 10M20 38c1.5-7 6-10 11-10s9.5 3 11 10" />
                              </svg>
                            </span>
                          }
                        />
                        {barberos.map((b) => {
                          const puede = puedeHacer(b, ids);
                          const faltan = ids.filter((id) => !b.servicios.includes(id)).map((id) => servicioPorId(id)?.nombre.toLowerCase());
                          return (
                            <TarjetaBarbero
                              key={b.id}
                              id={b.id}
                              activo={barbero === b.id}
                              deshabilitado={!puede}
                              onElegir={elegirBarbero}
                              titulo={b.nombre}
                              bajada={puede ? b.rol : `No hace ${faltan.join(" ni ")}`}
                              dias={`${diasTexto(b.dias)} · ${hhmm(b.desde)} a ${hhmm(b.hasta)}`}
                              visual={<Image src={b.img} alt="" fill sizes="80px" className="object-cover object-top" />}
                            />
                          );
                        })}
                      </div>
                    </fieldset>
                    <Acciones>
                      <button type="button" className={botonSec} onClick={() => ir(1)}>
                        <IconoFlechaIzq width={16} height={16} /> Servicios
                      </button>
                      <button type="button" className={boton} onClick={() => ir(3)}>
                        Elegir día y hora <IconoFlecha width={16} height={16} />
                      </button>
                    </Acciones>
                  </div>
                )}

                {paso === 3 && (
                  <div className="mt-6">
                    {!ahora || !hoy || !maxDia ? (
                      <div className="grid h-80 place-items-center rounded-[3px] border border-[#1b1714]/10 bg-[#f6efe3] text-sm text-[#5c5247]">
                        Cargando agenda…
                      </div>
                    ) : (
                      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                        <div className="rounded-[3px] border border-[#1b1714]/12 bg-[#f6efe3] p-4 sm:p-5">
                          <Calendario
                            etiqueta="Elegí el día del turno"
                            hoy={hoy}
                            minDia={hoy}
                            maxDia={maxDia}
                            desde={dia}
                            onElegir={elegirDia}
                            estado={(d) => {
                              if (!horarioLocal[diaSemana(d)]) return { deshabilitado: true, nota: "cerrado" };
                              const n = agenda.get(d)?.size ?? 0;
                              return n ? { deshabilitado: false, nota: `${n} horarios libres` } : { deshabilitado: true, nota: "completo" };
                            }}
                            iconoAnterior={<IconoChevronIzq width={18} height={18} />}
                            iconoSiguiente={<IconoChevronDer width={18} height={18} />}
                            contenidoDia={(info) => <DiaBarberia info={info} libres={agenda.get(info.dia)?.size ?? 0} />}
                            tema={{
                              cabecera: "flex items-center justify-between",
                              botonNav:
                                "grid size-9 place-items-center rounded-full border border-[#1b1714]/15 transition hover:border-[#1b1714] disabled:opacity-25 disabled:hover:border-[#1b1714]/15 focus-visible:outline-2 focus-visible:outline-[#7a1e2c]",
                              meses: "-mt-9",
                              titulo: `${serif} pointer-events-none text-center text-2xl capitalize leading-9`,
                              tabla: "mt-3 w-full table-fixed border-separate border-spacing-y-1",
                              diaSemana: "pb-2 text-[11px] font-semibold tracking-wider text-[#5c5247] uppercase",
                              celda: "p-0 text-center",
                              dia: (i) =>
                                `relative mx-auto grid h-11 w-full max-w-11 place-items-center rounded-[3px] text-sm tabular-nums transition focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#7a1e2c] ${
                                  i.seleccionado
                                    ? "bg-[#7a1e2c] font-semibold text-[#f6efe3]"
                                    : i.deshabilitado
                                      ? "cursor-not-allowed text-[#1b1714]/28"
                                      : "font-medium hover:bg-[#1b1714]/8"
                                } ${i.hoy && !i.seleccionado ? "ring-1 ring-[#1b1714]/40 ring-inset" : ""}`,
                            }}
                          />
                          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-[#1b1714]/10 pt-3 text-xs text-[#5c5247]">
                            <li className="flex items-center gap-1.5">
                              <span className="size-1.5 rounded-full bg-[#2f6b45]" aria-hidden="true" /> Muchos horarios
                            </li>
                            <li className="flex items-center gap-1.5">
                              <span className="size-1.5 rounded-full bg-[#c29b5a]" aria-hidden="true" /> Quedan pocos
                            </li>
                            <li className="flex items-center gap-1.5">
                              <span className="h-px w-3 bg-[#1b1714]/40" aria-hidden="true" /> Cerrado o completo
                            </li>
                          </ul>
                        </div>
                        <Horarios
                          dia={dia}
                          libres={libresDia}
                          hora={horaValida ? hora : null}
                          onHora={(h) => {
                            setHora(h);
                            const quien = libresDia?.get(h)?.[0];
                            setAviso(`Horario ${hhmm(h)}${quien ? ` con ${barberoPorId(quien)?.nombre}` : ""}.`);
                          }}
                          asignado={barbero === "cualquiera" ? asignado : undefined}
                          minutos={tot.minutos}
                        />
                      </div>
                    )}
                    <Acciones>
                      <button type="button" className={botonSec} onClick={() => ir(2)}>
                        <IconoFlechaIzq width={16} height={16} /> Barbero
                      </button>
                      <button type="button" className={boton} disabled={!horaValida} onClick={() => ir(4)}>
                        Completar datos <IconoFlecha width={16} height={16} />
                      </button>
                    </Acciones>
                  </div>
                )}

                {paso === 4 && (
                  <form className="mt-6 grid gap-5" onSubmit={confirmar} noValidate>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Campo id="df-nombre" etiqueta="Nombre y apellido" error={errores.nombre}>
                        <input
                          id="df-nombre"
                          autoComplete="name"
                          value={form.nombre}
                          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                          aria-invalid={Boolean(errores.nombre)}
                          aria-describedby={errores.nombre ? "df-nombre-error" : undefined}
                          className={campo}
                        />
                      </Campo>
                      <Campo id="df-telefono" etiqueta="Celular" ayuda="Para avisarte si hay un cambio." error={errores.telefono}>
                        <input
                          id="df-telefono"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="351 555 1234"
                          value={form.telefono}
                          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                          aria-invalid={Boolean(errores.telefono)}
                          aria-describedby={errores.telefono ? "df-telefono-error" : "df-telefono-ayuda"}
                          className={campo}
                        />
                      </Campo>
                    </div>
                    <Campo id="df-email" etiqueta="Email (opcional)" error={errores.email}>
                      <input
                        id="df-email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        aria-invalid={Boolean(errores.email)}
                        aria-describedby={errores.email ? "df-email-error" : undefined}
                        className={campo}
                      />
                    </Campo>
                    <Campo id="df-nota" etiqueta="¿Algo que tengamos que saber? (opcional)" error={errores.nota}>
                      <textarea
                        id="df-nota"
                        rows={3}
                        value={form.nota}
                        onChange={(e) => setForm({ ...form, nota: e.target.value })}
                        placeholder="Ej: traigo foto de referencia, es para mi hijo de 8 años…"
                        aria-invalid={Boolean(errores.nota)}
                        className={`${campo} resize-none`}
                      />
                    </Campo>
                    <label className="flex cursor-pointer items-start gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={form.recordatorio}
                        onChange={(e) => setForm({ ...form, recordatorio: e.target.checked })}
                        className="mt-0.5 size-4 accent-[#7a1e2c]"
                      />
                      <span>
                        Quiero un recordatorio por WhatsApp 2 horas antes.{" "}
                        <span className="text-[#5c5247]">(En la demo no se envía nada.)</span>
                      </span>
                    </label>
                    {envio === "error" ? (
                      <div role="alert" className="flex items-start gap-3 rounded-[3px] border border-[#7a1e2c]/40 bg-[#7a1e2c]/8 p-4 text-sm">
                        <IconoAlerta width={18} height={18} className="mt-0.5 shrink-0 text-[#7a1e2c]" />
                        <div>
                          <p className="font-semibold">Ese horario se acaba de ocupar.</p>
                          <p className="text-[#5c5247]">Alguien lo reservó mientras completabas. Elegí otro, tus datos quedan guardados.</p>
                          <button type="button" className="mt-2 font-semibold text-[#7a1e2c] underline underline-offset-4" onClick={() => { setEnvio("listo"); setHora(null); ir(3); }}>
                            Elegir otro horario
                          </button>
                        </div>
                      </div>
                    ) : null}
                    <Acciones>
                      <button type="button" className={botonSec} onClick={() => ir(3)}>
                        <IconoFlechaIzq width={16} height={16} /> Día y hora
                      </button>
                      <button type="submit" className={boton} disabled={envio === "enviando"} aria-busy={envio === "enviando"}>
                        {envio === "enviando" ? (
                          <>
                            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none" aria-hidden="true" />
                            Confirmando…
                          </>
                        ) : (
                          <>
                            Confirmar turno <IconoCheck width={16} height={16} grosor={2.4} />
                          </>
                        )}
                      </button>
                    </Acciones>
                    <p className="text-xs text-[#5c5247]">
                      Es una demo: no se reserva un turno real ni se envían tus datos a ningún lado. Todo queda en tu navegador.
                    </p>
                  </form>
                )}
              </div>

              <aside aria-label="Resumen del turno" className="hidden lg:block">
                <div className="sticky top-6 rounded-[3px] bg-[#141210] p-6 text-[#efe6d6] shadow-[0_18px_40px_-20px_rgba(20,18,16,0.6)]">
                  <p className="text-[11px] font-semibold tracking-[0.25em] text-[#c29b5a] uppercase">Tu turno</p>
                  <div className="mt-4">{resumen}</div>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function fechaCortaTexto(d: DiaISO) {
  const f = fechaLarga(d).split(" ");
  return `${f[0]?.slice(0, 3)} ${f[1]}`;
}

const campo =
  "w-full rounded-[3px] border border-[#1b1714]/20 bg-[#f6efe3] px-3.5 py-3 text-base text-[#1b1714] placeholder:text-[#1b1714]/35 transition outline-none focus:border-[#7a1e2c] focus:ring-2 focus:ring-[#7a1e2c]/25 aria-[invalid=true]:border-[#b3261e]";

function Campo({ id, etiqueta, ayuda, error, children }: { id: string; etiqueta: string; ayuda?: string; error?: string; children: ReactNode }) {
  return (
    <div className="grid content-start gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {etiqueta}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-sm text-[#b3261e]">
          <IconoAlerta width={14} height={14} /> {error}
        </p>
      ) : ayuda ? (
        <p id={`${id}-ayuda`} className="text-xs text-[#5c5247]">
          {ayuda}
        </p>
      ) : null}
    </div>
  );
}

function Acciones({ children }: { children: ReactNode }) {
  return <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#1b1714]/12 pt-6">{children}</div>;
}

function TarjetaBarbero({
  id,
  activo,
  deshabilitado,
  onElegir,
  titulo,
  bajada,
  dias,
  visual,
}: {
  id: string;
  activo: boolean;
  deshabilitado?: boolean;
  onElegir: (id: string) => void;
  titulo: string;
  bajada: string;
  dias: string;
  visual: ReactNode;
}) {
  return (
    <label
      className={`relative flex items-center gap-4 rounded-[3px] border bg-[#f6efe3] p-3 pr-4 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#7a1e2c] ${
        deshabilitado
          ? "cursor-not-allowed opacity-50"
          : activo
            ? "cursor-pointer border-[#7a1e2c] shadow-[inset_0_0_0_1px_#7a1e2c]"
            : "cursor-pointer border-[#1b1714]/12 hover:border-[#1b1714]/40"
      }`}
    >
      <input
        type="radio"
        name="df-barbero"
        value={id}
        className="sr-only"
        checked={activo}
        disabled={deshabilitado}
        onChange={() => onElegir(id)}
      />
      <span className="relative size-20 shrink-0 overflow-hidden rounded-[2px] bg-[#141210]">{visual}</span>
      <span className="min-w-0 flex-1">
        <span className={`${serif} block text-2xl leading-none`}>{titulo}</span>
        <span className="mt-1.5 block text-sm leading-snug text-[#5c5247]">{bajada}</span>
        <span className="mt-1.5 block text-xs font-medium text-[#1b1714]/70">{dias}</span>
      </span>
      <span
        aria-hidden="true"
        className={`grid size-5 shrink-0 place-items-center rounded-full border transition ${
          activo ? "border-[#7a1e2c] bg-[#7a1e2c] text-[#f6efe3]" : "border-[#1b1714]/35"
        }`}
      >
        {activo ? <span className="size-2 rounded-full bg-[#f6efe3]" /> : null}
      </span>
    </label>
  );
}

function DiaBarberia({ info, libres }: { info: InfoDia; libres: number }) {
  return (
    <>
      <span className={info.deshabilitado && !info.seleccionado ? "line-through decoration-1" : ""}>{Number(info.dia.slice(8))}</span>
      {!info.deshabilitado ? (
        <span
          aria-hidden="true"
          className={`absolute bottom-1 size-1 rounded-full ${info.seleccionado ? "bg-[#f6efe3]" : libres <= 8 ? "bg-[#c29b5a]" : "bg-[#2f6b45]"}`}
        />
      ) : null}
    </>
  );
}

function Horarios({
  dia,
  libres,
  hora,
  onHora,
  asignado,
  minutos,
}: {
  dia: DiaISO | null;
  libres: Map<number, string[]> | undefined;
  hora: number | null;
  onHora: (h: number) => void;
  asignado?: string;
  minutos: number;
}) {
  const idGrupo = useId();
  if (!dia || !libres) {
    return (
      <div className="grid min-h-60 place-items-center rounded-[3px] border border-dashed border-[#1b1714]/20 p-8 text-center text-sm text-[#5c5247]">
        <div>
          <IconoCalendario width={28} height={28} className="mx-auto text-[#1b1714]/40" />
          <p className="mt-3">Elegí un día en el calendario para ver los horarios libres.</p>
        </div>
      </div>
    );
  }
  const franjas = [
    { titulo: "Mañana", desde: 0, hasta: 13 * 60 },
    { titulo: "Tarde", desde: 13 * 60, hasta: 18 * 60 },
    { titulo: "Noche", desde: 18 * 60, hasta: 24 * 60 },
  ];
  const horas = [...libres.keys()];
  return (
    <div className="min-w-0">
      <p className="text-sm">
        <span className="font-semibold first-letter:uppercase inline-block">{fechaLarga(dia)}</span>
        <span className="text-[#5c5247]"> · turnos de {duracionTexto(minutos)}</span>
      </p>
      <div role="radiogroup" aria-label={`Horarios libres del ${fechaLarga(dia)}`} className="mt-4 grid gap-5">
        {franjas.map((fr) => {
          const hs = horas.filter((h) => h >= fr.desde && h < fr.hasta);
          if (!hs.length) return null;
          return (
            <div key={fr.titulo}>
              <p className="text-[11px] font-bold tracking-[0.2em] text-[#5c5247] uppercase">
                {fr.titulo} <span className="font-medium tracking-normal normal-case">· {hs.length} libres</span>
              </p>
              <div className="mt-2 grid grid-cols-4 gap-1.5 sm:grid-cols-5 md:grid-cols-4 xl:grid-cols-5">
                {hs.map((h) => {
                  const activo = hora === h;
                  return (
                    <label
                      key={h}
                      className={`grid cursor-pointer place-items-center rounded-[3px] border py-2.5 text-sm font-semibold tabular-nums transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-[#7a1e2c] ${
                        activo ? "border-[#7a1e2c] bg-[#7a1e2c] text-[#f6efe3]" : "border-[#1b1714]/15 bg-[#f6efe3] hover:border-[#1b1714]/60"
                      }`}
                    >
                      <input type="radio" name={idGrupo} className="sr-only" checked={activo} onChange={() => onHora(h)} aria-label={`${hhmm(h)} a ${hhmm(h + minutos)}`} />
                      {hhmm(h)}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {hora !== null ? (
        <p className="mt-5 flex items-center gap-2 rounded-[3px] bg-[#1b1714] px-4 py-3 text-sm text-[#efe6d6]">
          <IconoReloj width={16} height={16} className="text-[#c29b5a]" />
          De {hhmm(hora)} a {hhmm(hora + minutos)}
          {asignado ? ` · te atiende ${barberoPorId(asignado)?.nombre}` : ""}
        </p>
      ) : null}
    </div>
  );
}

function Resumen({
  ids,
  barbero,
  asignado,
  dia,
  hora,
  total,
  bruto,
  descuento,
  minutos,
}: {
  ids: string[];
  barbero: string;
  asignado?: string;
  dia: DiaISO | null;
  hora: number | null;
  total: number;
  bruto: number;
  descuento: number;
  minutos: number;
}) {
  const b = barberoPorId(barbero);
  const nombreBarbero = b ? b.nombre : asignado ? `${barberoPorId(asignado)?.nombre} (el primero libre)` : "El primero libre";
  return (
    <div className="text-sm">
      {ids.length ? (
        <ul className="grid gap-2">
          {ids.map((id) => {
            const s = servicioPorId(id);
            if (!s) return null;
            return (
              <li key={id} className="flex items-baseline justify-between gap-3">
                <span>{s.nombre}</span>
                <span className="tabular-nums opacity-80">{pesos(s.precio)}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="opacity-60">Todavía no elegiste servicios.</p>
      )}
      <dl className="mt-5 grid gap-3 border-t border-current/15 pt-4">
        <div className="flex justify-between gap-3">
          <dt className="opacity-60">Duración</dt>
          <dd>{minutos ? duracionTexto(minutos) : "—"}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="opacity-60">Barbero</dt>
          <dd className="text-right">{nombreBarbero}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="opacity-60">Día</dt>
          <dd className="text-right first-letter:uppercase">{dia ? fechaLarga(dia) : "—"}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="opacity-60">Hora</dt>
          <dd>{hora !== null ? `${hhmm(hora)} a ${hhmm(hora + minutos)}` : "—"}</dd>
        </div>
      </dl>
      <div className="mt-5 border-t border-current/15 pt-4">
        {descuento ? (
          <p className="flex justify-between text-[#c29b5a]">
            <span>Combo corte + barba</span>
            <span className="tabular-nums">−{pesos(descuento).slice(1)}</span>
          </p>
        ) : null}
        <p className="mt-1 flex items-baseline justify-between">
          <span className="opacity-60">Total{descuento ? ` (antes ${pesos(bruto)})` : ""}</span>
          <span className={`${serif} text-4xl tabular-nums`}>{pesos(total)}</span>
        </p>
        <p className="mt-2 text-xs opacity-60">Pagás en el local: efectivo, débito o transferencia.</p>
      </div>
    </div>
  );
}

function Confirmacion({
  reserva,
  tituloRef,
  onOtra,
}: {
  reserva: ReservaBarberia;
  tituloRef: React.RefObject<HTMLHeadingElement | null>;
  onOtra: () => void;
}) {
  const b = barberoPorId(reserva.barbero);
  return (
    <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-start">
      <div>
        <p className="inline-flex items-center gap-2 rounded-full bg-[#2f6b45] px-3 py-1 text-xs font-semibold tracking-wide text-[#efe6d6] uppercase">
          <IconoCheck width={14} height={14} grosor={3} /> Turno confirmado
        </p>
        <h3 ref={tituloRef} tabIndex={-1} className={`${serif} mt-5 text-4xl leading-tight outline-none md:text-5xl`}>
          Listo, {reserva.nombre.split(" ")[0]}. Te esperamos.
        </h3>
        <p className="mt-4 max-w-md leading-relaxed text-[#5c5247]">
          Guardamos tu turno en <strong className="text-[#1b1714]">Mis turnos</strong> (arriba a la derecha). Si no podés venir,
          cancelalo desde ahí así se lo damos a otro.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            className={boton}
            onClick={() =>
              descargarIcs(
                {
                  tipo: "horario",
                  uid: reserva.id,
                  titulo: `${reserva.servicios.map((id) => servicioPorId(id)?.nombre).join(" + ")} · ${negocio.nombre}`,
                  descripcion: `Código ${reserva.codigo}. Te atiende ${b?.nombre}. Demo con contenido ficticio.`,
                  lugar: negocio.direccion,
                  dia: reserva.dia,
                  inicio: reserva.inicio,
                  fin: reserva.fin,
                },
                `turno-don-filo-${reserva.codigo}`,
              )
            }
          >
            <IconoDescarga width={16} height={16} /> Agregar al calendario
          </button>
          <button type="button" className={botonSec} onClick={() => emitirDemo("barberia:mis-turnos", null)}>
            Ver mis turnos
          </button>
          <button type="button" className={botonSec} onClick={onOtra}>
            Reservar otro
          </button>
        </div>
        <p className="mt-8 flex max-w-md items-start gap-2.5 rounded-[3px] border border-dashed border-[#1b1714]/25 p-4 text-sm text-[#5c5247]">
          <IconoAlerta width={16} height={16} className="mt-0.5 shrink-0" />
          Esto es una demo: no se reservó ningún turno real ni se envió ningún mensaje. La reserva queda solo en este navegador.
        </p>
      </div>

      {/* Ticket */}
      <div className="relative rounded-[4px] bg-[#141210] text-[#efe6d6] shadow-[0_30px_60px_-30px_rgba(20,18,16,0.7)]">
        <div className="p-7">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold tracking-[0.25em] text-[#c29b5a] uppercase">{negocio.nombre}</p>
            <IconoTijera width={20} height={20} className="text-[#c29b5a]" />
          </div>
          <p className={`${serif} mt-6 text-4xl first-letter:uppercase`}>{fechaLarga(reserva.dia)}</p>
          <p className="mt-1 text-lg">
            {hhmm(reserva.inicio)} a {hhmm(reserva.fin)} hs
          </p>
          <dl className="mt-6 grid gap-2.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="opacity-60">Servicios</dt>
              <dd className="text-right">{reserva.servicios.map((id) => servicioPorId(id)?.nombre).join(" + ")}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="opacity-60">Barbero</dt>
              <dd>{b?.nombre}{reserva.asignado ? " (asignado)" : ""}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="opacity-60">Total</dt>
              <dd className="tabular-nums">{pesos(reserva.total)}</dd>
            </div>
          </dl>
        </div>
        <div className="relative flex items-center" aria-hidden="true">
          <span className="absolute -left-3 size-6 rounded-full bg-[#efe6d6]" />
          <span className="mx-5 flex-1 border-t-2 border-dashed border-[#efe6d6]/20" />
          <span className="absolute -right-3 size-6 rounded-full bg-[#efe6d6]" />
        </div>
        <div className="flex items-end justify-between gap-4 p-7">
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase opacity-60">Código</p>
            <p className="mt-1 font-mono text-2xl tracking-widest text-[#c29b5a]">{reserva.codigo}</p>
          </div>
          <svg viewBox="0 0 80 32" width="96" height="38" aria-hidden="true" className="opacity-70">
            {Array.from({ length: 26 }, (_, i) => (
              <rect key={i} x={i * 3} y="0" width={(reserva.codigo.charCodeAt(i % reserva.codigo.length) % 3) + 0.6} height="32" fill="currentColor" />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
