"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { z } from "zod";
import { codigoReserva } from "../shared/azar";
import { Calendario } from "../shared/Calendario";
import { diferenciaDias, fechaCorta, fechaLarga, pesos, sumarDias, type DiaISO } from "../shared/fechas";
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
  IconoHoja,
  IconoInfo,
  IconoMas,
  IconoMenos,
  IconoPersonas,
} from "../shared/Iconos";
import {
  DIAS_ANTICIPACION,
  MAX_MENORES,
  cabanas,
  complejo,
  cotizar,
  entranHuespedes,
  libreEntre,
  minNoches,
  nocheOcupada,
  tarifaNoche,
  temporadaAlta,
  type Cabana,
  type ReservaCabana,
} from "./datos";

const serif = "[font-family:var(--font-am-serif)]";

export const EVENTO_CABANA = "cabanas:elegir";
const MAX_NOCHES = 21;

type Paso = 1 | 2 | 3;

const esquema = z.object({
  nombre: z.string().trim().min(2, "Escribí tu nombre y apellido."),
  email: z.email("Escribí un email válido para mandarte la confirmación."),
  telefono: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{7,17}$/, "Escribí un celular válido (ej. 351 555 1234)."),
  politica: z.literal(true, { error: "Tenés que aceptar la política de cancelación." }),
});

type Form = { nombre: string; email: string; telefono: string; llegada: string; mensaje: string; politica: boolean };

const btn =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#2f4a3a] px-6 py-3.5 font-semibold text-[#f7f2e8] transition hover:bg-[#243a2d] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#2f4a3a]/30 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#b5653a]";
const btnSec =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#2a2620]/20 px-5 py-3.5 font-semibold transition hover:border-[#2a2620]/60 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#b5653a]";

export function Reserva() {
  const ahora = useAhora();
  const { lista: propias, guardar } = useReservasGuardadas<ReservaCabana>("cabanas");
  const [paso, setPaso] = useState<Paso>(1);
  const [desde, setDesde] = useState<DiaISO | null>(null);
  const [hasta, setHasta] = useState<DiaISO | null>(null);
  const [previa, setPrevia] = useState<DiaISO | null>(null);
  const [adultos, setAdultos] = useState(2);
  const [menores, setMenores] = useState(0);
  const [filtro, setFiltro] = useState<string>("todas");
  const [elegida, setElegida] = useState<string | null>(null);
  const [form, setForm] = useState<Form>({ nombre: "", email: "", telefono: "", llegada: "15-17", mensaje: "", politica: false });
  const [errores, setErrores] = useState<Partial<Record<keyof Form, string>>>({});
  const [envio, setEnvio] = useState<"listo" | "enviando" | "error">("listo");
  const [confirmada, setConfirmada] = useState<ReservaCabana | null>(null);
  const [aviso, setAviso] = useState("");
  const titulo = useRef<HTMLHeadingElement>(null);
  const moverFoco = useRef(false);

  const hoy = ahora?.dia ?? null;
  // Desde mañana: el check-in del mismo día se coordina por teléfono.
  const minDia = hoy ? sumarDias(hoy, 1) : null;
  const maxDia = hoy ? sumarDias(hoy, DIAS_ANTICIPACION) : null;

  const candidatas = useMemo(
    () => cabanas.filter((c) => (filtro === "todas" || c.id === filtro) && entranHuespedes(c, adultos, menores)),
    [filtro, adultos, menores],
  );
  const capacidadMax = filtro === "todas" ? 6 : (cabanas.find((c) => c.id === filtro)?.capacidad ?? 6);
  const adultosMax = filtro === "todas" ? 6 : (cabanas.find((c) => c.id === filtro)?.maxAdultos ?? 6);

  const checkInValido = (d: DiaISO) => candidatas.some((c) => libreEntre(c, d, sumarDias(d, minNoches(d)), propias));
  const checkOutValido = (entrada: DiaISO, d: DiaISO) => {
    const n = diferenciaDias(entrada, d);
    return n >= minNoches(entrada) && n <= MAX_NOCHES && candidatas.some((c) => libreEntre(c, entrada, d, propias));
  };

  const disponibles = useMemo(() => {
    if (!desde || !hasta) return [];
    return cabanas.map((c) => ({
      c,
      entra: entranHuespedes(c, adultos, menores),
      libre: libreEntre(c, desde, hasta, propias),
      cot: cotizar(c, desde, hasta),
    }));
  }, [desde, hasta, adultos, menores, propias]);

  const cabanaSel = cabanas.find((c) => c.id === elegida);
  const selValida = Boolean(cabanaSel && desde && hasta && entranHuespedes(cabanaSel, adultos, menores) && libreEntre(cabanaSel, desde, hasta, propias));
  const cot = cabanaSel && desde && hasta ? cotizar(cabanaSel, desde, hasta) : null;

  useEffect(() => {
    if (!moverFoco.current) return;
    moverFoco.current = false;
    irA(titulo.current);
  }, [paso, confirmada]);

  function ir(p: Paso) {
    moverFoco.current = true;
    setPaso(p);
  }

  useEscucharDemo<string>(EVENTO_CABANA, (id) => {
    const c = cabanas.find((x) => x.id === id);
    if (!c) return;
    setConfirmada(null);
    setFiltro(id);
    setElegida(id);
    setAdultos((a) => Math.min(a, c.maxAdultos));
    setMenores((m) => Math.max(0, Math.min(m, c.capacidad - Math.min(adultos, c.maxAdultos))));
    setDesde(null);
    setHasta(null);
    ir(1);
    setAviso(`Mostrando la disponibilidad de ${c.nombre}.`);
  });

  function elegirDia(d: DiaISO) {
    if (!desde || hasta || d <= desde) {
      setDesde(d);
      setHasta(null);
      setAviso(`Entrada el ${fechaLarga(d)}. Ahora elegí la salida (mínimo ${minNoches(d)} noches).`);
      return;
    }
    setHasta(d);
    const n = diferenciaDias(desde, d);
    setAviso(`Salida el ${fechaLarga(d)}. ${n} noches.`);
    // Si la cabaña elegida ya no está libre, se limpia.
    if (elegida && !libreEntre(cabanas.find((c) => c.id === elegida)!, desde, d, propias)) setElegida(null);
  }

  function cambiarFiltro(v: string) {
    setFiltro(v);
    setDesde(null);
    setHasta(null);
    if (v !== "todas") {
      const c = cabanas.find((x) => x.id === v);
      if (c) {
        setElegida(v);
        const a = Math.min(adultos, c.maxAdultos);
        setAdultos(a);
        setMenores(Math.min(menores, c.capacidad - a));
      }
    }
  }

  function cambiarHuespedes(a: number, m: number) {
    setAdultos(a);
    setMenores(m);
    // Si las fechas ya no sirven para ninguna cabaña con esa cantidad de gente, se limpian.
    if (desde && hasta) {
      const ok = cabanas.some((c) => (filtro === "todas" || c.id === filtro) && entranHuespedes(c, a, m) && libreEntre(c, desde, hasta, propias));
      if (!ok) {
        setHasta(null);
        setAviso("Con esa cantidad de huéspedes no hay cabañas libres en esas fechas. Elegí fechas nuevas.");
      }
    }
  }

  function nueva() {
    setConfirmada(null);
    setDesde(null);
    setHasta(null);
    setElegida(null);
    setFiltro("todas");
    setForm((f) => ({ ...f, mensaje: "", politica: false }));
    setEnvio("listo");
    ir(1);
  }

  function confirmar(e: React.FormEvent) {
    e.preventDefault();
    const r = esquema.safeParse(form);
    if (!r.success) {
      const errs: Partial<Record<keyof Form, string>> = {};
      for (const i of r.error.issues) {
        const k = i.path[0] as keyof Form;
        errs[k] ??= i.message;
      }
      setErrores(errs);
      setAviso("Revisá los datos marcados.");
      document.getElementById(`am-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setErrores({});
    if (!cabanaSel || !desde || !hasta || !cot) return;
    setEnvio("enviando");
    setAviso("Confirmando tu estadía…");
    window.setTimeout(() => {
      if (!libreEntre(cabanaSel, desde, hasta, propias)) {
        setEnvio("error");
        return;
      }
      const reserva: ReservaCabana = {
        id: crypto.randomUUID(),
        codigo: codigoReserva("AM"),
        estado: "confirmada",
        creada: new Date().toISOString(),
        cabana: cabanaSel.id,
        desde,
        hasta,
        adultos,
        menores,
        total: cot.total,
        sena: cot.sena,
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        llegada: form.llegada,
      };
      guardar(reserva);
      setEnvio("listo");
      moverFoco.current = true;
      setConfirmada(reserva);
      setAviso(`Estadía confirmada. Código ${reserva.codigo}.`);
    }, 1300);
  }

  const noches = desde && hasta ? diferenciaDias(desde, hasta) : 0;
  const previaValida = desde && !hasta && previa && previa > desde && checkOutValido(desde, previa) ? previa : null;
  const hayRango = Boolean(hasta || previaValida);
  const puede2 = Boolean(desde && hasta);
  const puede3 = puede2 && selValida;

  return (
    <section id="reservar" aria-labelledby="reservar-titulo" className="scroll-mt-4 bg-[#efe6d4]">
      <p className="sr-only" role="status" aria-live="polite">
        {aviso}
      </p>
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="text-center">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#9a5631]">
            <IconoHoja width={16} height={16} /> Reservá directo, sin comisiones
          </p>
          <h2 id="reservar-titulo" className={`${serif} mt-3 text-5xl leading-tight font-medium md:text-6xl`}>
            ¿Cuándo venís?
          </h2>
        </div>

        {confirmada ? (
          <Confirmacion r={confirmada} tituloRef={titulo} onNueva={nueva} />
        ) : (
          <>
            <nav aria-label="Pasos de la reserva" className="mx-auto mt-10 max-w-xl">
              <ol className="flex items-center justify-between gap-2">
                {(
                  [
                    [1, "Fechas", true],
                    [2, "Cabaña", puede2],
                    [3, "Tus datos", puede3],
                  ] as const
                ).map(([n, t, ok], i) => (
                  <li key={n} className="flex flex-1 items-center gap-2 last:flex-none">
                    <button
                      type="button"
                      disabled={!ok}
                      onClick={() => ir(n)}
                      aria-current={paso === n ? "step" : undefined}
                      className="flex items-center gap-2 rounded-full py-1 pr-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b5653a] disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      <span
                        className={`grid size-8 place-items-center rounded-full text-sm ${
                          paso === n ? "bg-[#2f4a3a] text-[#f7f2e8]" : paso > n ? "bg-[#b5653a] text-white" : "bg-white text-[#2a2620] ring-1 ring-[#2a2620]/15"
                        }`}
                      >
                        {paso > n ? <IconoCheck width={15} height={15} grosor={2.6} /> : n}
                      </span>
                      <span className={paso === n ? "" : "hidden sm:inline"}>{t}</span>
                    </button>
                    {i < 2 ? <span aria-hidden="true" className="h-px flex-1 bg-[#2a2620]/15" /> : null}
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="min-w-0 rounded-[1.75rem] bg-[#fbf8f2] p-5 shadow-[0_24px_60px_-40px_rgba(47,74,58,0.6)] ring-1 ring-[#2a2620]/6 sm:p-8">
                <h3 ref={titulo} tabIndex={-1} className={`${serif} scroll-mt-6 text-3xl font-medium outline-none`}>
                  {paso === 1 ? "Fechas y huéspedes" : paso === 2 ? "Elegí tu cabaña" : "Tus datos"}
                </h3>

                {paso === 1 && (
                  <div className="mt-6">
                    <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                      <label className="grid gap-1.5 text-sm font-semibold">
                        Cabaña
                        <select
                          value={filtro}
                          onChange={(e) => cambiarFiltro(e.target.value)}
                          className="rounded-xl border border-[#2a2620]/15 bg-white px-3.5 py-3 text-base font-normal focus:border-[#2f4a3a] focus:ring-2 focus:ring-[#2f4a3a]/20 focus:outline-none"
                        >
                          <option value="todas">Cualquiera que esté libre</option>
                          {cabanas.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nombre} · hasta {c.capacidad} personas
                            </option>
                          ))}
                        </select>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <Contador
                          etiqueta="Adultos"
                          valor={adultos}
                          min={1}
                          max={Math.min(adultosMax, capacidadMax - menores)}
                          onCambio={(v) => cambiarHuespedes(v, menores)}
                        />
                        <Contador
                          etiqueta="Menores"
                          ayuda="3 a 12 años"
                          valor={menores}
                          min={0}
                          max={Math.min(MAX_MENORES, capacidadMax - adultos)}
                          onCambio={(v) => cambiarHuespedes(adultos, v)}
                        />
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-[#6b6356]">Los bebés de hasta 2 años no ocupan plaza. Máximo 6 personas por cabaña.</p>

                    <div className="mt-6 border-t border-[#2a2620]/10 pt-6">
                      {!hoy || !minDia || !maxDia ? (
                        <div className="grid h-80 place-items-center text-sm text-[#6b6356]">Cargando disponibilidad…</div>
                      ) : candidatas.length === 0 ? (
                        <p className="rounded-xl bg-[#b5653a]/10 p-4 text-sm">Ninguna cabaña entra con esa cantidad de huéspedes. Probá con menos personas.</p>
                      ) : (
                        <>
                          <p className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
                            <span className="font-semibold">
                              {!desde ? "Elegí el día de llegada" : !hasta ? `Llegada ${fechaCorta(desde)} · elegí la salida` : `${fechaCorta(desde)} → ${fechaCorta(hasta)} · ${noches} noches`}
                            </span>
                            {desde ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setDesde(null);
                                  setHasta(null);
                                  setAviso("Fechas borradas.");
                                }}
                                className="font-semibold text-[#9a5631] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[#b5653a]"
                              >
                                Borrar fechas
                              </button>
                            ) : null}
                          </p>
                          <Calendario
                            etiqueta="Fechas de la estadía"
                            hoy={hoy}
                            minDia={minDia}
                            maxDia={maxDia}
                            desde={desde}
                            hasta={hasta}
                            vistaPrevia={previaValida}
                            onEnfocar={setPrevia}
                            onElegir={elegirDia}
                            mesesDesktop={2}
                            estado={(d) => {
                              if (desde && !hasta && d > desde) {
                                if (checkOutValido(desde, d)) return { deshabilitado: false, nota: `salida, ${diferenciaDias(desde, d)} noches` };
                                const n = diferenciaDias(desde, d);
                                if (n < minNoches(desde)) return { deshabilitado: true, nota: `mínimo ${minNoches(desde)} noches` };
                                return { deshabilitado: true, nota: "no disponible" };
                              }
                              if (checkInValido(d)) return { deshabilitado: false, nota: temporadaAlta(d) ? "disponible, temporada alta" : "disponible" };
                              const todas = candidatas.every((c) => nocheOcupada(c, d, propias));
                              return { deshabilitado: true, nota: todas ? "ocupado" : `sin lugar para ${minNoches(d)} noches` };
                            }}
                            iconoAnterior={<IconoChevronIzq width={18} height={18} />}
                            iconoSiguiente={<IconoChevronDer width={18} height={18} />}
                            contenidoDia={(i) => {
                              const precio =
                                !i.deshabilitado && !(desde && !hasta && i.dia > desde)
                                  ? Math.min(...candidatas.map((c) => tarifaNoche(c, i.dia)))
                                  : null;
                              return (
                                <span className="flex flex-col items-center leading-none">
                                  <span className={i.deshabilitado && !i.seleccionado ? "line-through decoration-[#2a2620]/30" : ""}>{Number(i.dia.slice(8))}</span>
                                  {precio && !i.seleccionado && !i.enRango ? (
                                    <span className="mt-1 hidden text-[9px] font-medium text-[#6b6356] sm:block">{Math.round(precio / 1000)}k</span>
                                  ) : null}
                                </span>
                              );
                            }}
                            tema={{
                              cabecera: "flex items-center justify-between",
                              botonNav:
                                "grid size-10 place-items-center rounded-full bg-white ring-1 ring-[#2a2620]/12 transition hover:ring-[#2f4a3a] disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-[#b5653a]",
                              meses: "-mt-10 grid gap-8 md:grid-cols-2",
                              titulo: `${serif} pointer-events-none text-center text-xl font-medium capitalize leading-10`,
                              tabla: "mt-4 w-full table-fixed border-separate border-spacing-y-1",
                              diaSemana: "pb-1 text-xs font-semibold text-[#6b6356]",
                              celda: "p-0 text-center",
                              dia: (i) =>
                                `relative mx-auto grid h-12 w-full place-items-center text-sm tabular-nums transition focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#b5653a] ${
                                  i.seleccionado
                                    ? `bg-[#2f4a3a] font-semibold text-[#f7f2e8] ${i.inicio && hayRango ? "rounded-l-full" : i.fin ? "rounded-r-full" : "rounded-full"}`
                                    : i.dia === previaValida
                                      ? "rounded-r-full bg-[#2f4a3a]/30 font-semibold"
                                      : i.enRango
                                      ? "bg-[#2f4a3a]/12 font-medium"
                                      : i.deshabilitado
                                        ? "cursor-not-allowed rounded-full text-[#2a2620]/35"
                                        : "rounded-full font-medium hover:bg-[#2f4a3a]/10"
                                } ${i.hoy && !i.seleccionado ? "underline decoration-2 underline-offset-4" : ""}`,
                            }}
                          />
                          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#2a2620]/10 pt-4 text-xs text-[#6b6356]">
                            <span className="flex items-center gap-1.5">
                              <IconoInfo width={14} height={14} /> Mínimo 2 noches (3 en temporada alta, del 15/12 a fin de febrero)
                            </span>
                            <span className="hidden sm:inline">Debajo de cada día: precio por noche, desde</span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="mt-8 flex justify-end">
                      <button type="button" className={btn} disabled={!puede2} onClick={() => ir(2)}>
                        Ver cabañas libres <IconoFlecha width={18} height={18} />
                      </button>
                    </div>
                  </div>
                )}

                {paso === 2 && (
                  <div className="mt-6">
                    <fieldset>
                      <legend className="text-sm text-[#6b6356]">
                        {desde && hasta ? `${fechaCorta(desde)} → ${fechaCorta(hasta)} · ${noches} noches · ${adultos + menores} huéspedes` : ""}
                      </legend>
                      <ul className="mt-4 grid gap-3">
                        {disponibles.map(({ c, entra, libre, cot: cc }) => {
                          const ok = entra && libre;
                          const activo = elegida === c.id;
                          return (
                            <li key={c.id}>
                              <label
                                className={`flex gap-4 rounded-2xl border-2 bg-white p-3 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#b5653a] sm:p-4 ${
                                  !ok ? "cursor-not-allowed border-transparent opacity-55 ring-1 ring-[#2a2620]/10" : activo ? "cursor-pointer border-[#2f4a3a]" : "cursor-pointer border-transparent ring-1 ring-[#2a2620]/10 hover:ring-[#2f4a3a]/40"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="am-cabana"
                                  className="sr-only"
                                  checked={activo}
                                  disabled={!ok}
                                  onChange={() => {
                                    setElegida(c.id);
                                    setAviso(`${c.nombre}: ${pesos(cc.total)} por ${cc.noches} noches.`);
                                  }}
                                />
                                <span className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-xl sm:w-40">
                                  <Image src={c.img} alt="" fill sizes="160px" className="object-cover" />
                                </span>
                                <span className="flex min-w-0 flex-1 flex-col">
                                  <span className="flex items-start justify-between gap-2">
                                    <span className={`${serif} text-2xl leading-tight font-medium`}>{c.nombre}</span>
                                    <span
                                      aria-hidden="true"
                                      className={`mt-1 grid size-5 shrink-0 place-items-center rounded-full border-2 ${activo ? "border-[#2f4a3a] bg-[#2f4a3a]" : "border-[#2a2620]/25"}`}
                                    >
                                      {activo ? <span className="size-1.5 rounded-full bg-white" /> : null}
                                    </span>
                                  </span>
                                  <span className="mt-1 flex items-center gap-1.5 text-sm text-[#6b6356]">
                                    <IconoPersonas width={15} height={15} /> Hasta {c.capacidad} · {c.dormitorios} {c.dormitorios === 1 ? "dormitorio" : "dormitorios"}
                                  </span>
                                  <span className="mt-auto flex flex-wrap items-end justify-between gap-x-3 pt-2">
                                    {ok ? (
                                      <>
                                        <span className="text-sm text-[#6b6356]">{cc.noches} noches + limpieza</span>
                                        <span className="text-lg font-semibold tabular-nums">{pesos(cc.total)}</span>
                                      </>
                                    ) : (
                                      <span className="text-sm font-semibold text-[#9a5631]">{!entra ? `No entran ${adultos + menores} huéspedes` : "Ocupada en esas fechas"}</span>
                                    )}
                                  </span>
                                </span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    </fieldset>
                    <div className="mt-8 flex flex-wrap justify-between gap-3">
                      <button type="button" className={btnSec} onClick={() => ir(1)}>
                        <IconoFlechaIzq width={18} height={18} /> Fechas
                      </button>
                      <button type="button" className={btn} disabled={!selValida} onClick={() => ir(3)}>
                        Continuar <IconoFlecha width={18} height={18} />
                      </button>
                    </div>
                  </div>
                )}

                {paso === 3 && (
                  <form className="mt-6 grid gap-5" onSubmit={confirmar} noValidate>
                    <Campo id="am-nombre" etiqueta="Nombre y apellido" error={errores.nombre}>
                      <input id="am-nombre" autoComplete="name" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} aria-invalid={Boolean(errores.nombre)} aria-describedby={errores.nombre ? "am-nombre-error" : undefined} className={campo} />
                    </Campo>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Campo id="am-email" etiqueta="Email" error={errores.email}>
                        <input id="am-email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={Boolean(errores.email)} aria-describedby={errores.email ? "am-email-error" : undefined} className={campo} />
                      </Campo>
                      <Campo id="am-telefono" etiqueta="Celular" error={errores.telefono}>
                        <input id="am-telefono" type="tel" inputMode="tel" autoComplete="tel" placeholder="351 555 1234" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} aria-invalid={Boolean(errores.telefono)} aria-describedby={errores.telefono ? "am-telefono-error" : undefined} className={campo} />
                      </Campo>
                    </div>
                    <Campo id="am-llegada" etiqueta="¿A qué hora llegás, más o menos?">
                      <select id="am-llegada" value={form.llegada} onChange={(e) => setForm({ ...form, llegada: e.target.value })} className={campo}>
                        <option value="14-15">Entre las 14 y las 15</option>
                        <option value="15-17">Entre las 15 y las 17</option>
                        <option value="17-19">Entre las 17 y las 19</option>
                        <option value="19-21">Después de las 19 (te esperamos con luz)</option>
                      </select>
                    </Campo>
                    <Campo id="am-mensaje" etiqueta="Mensaje para nosotros (opcional)">
                      <textarea id="am-mensaje" rows={3} value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} placeholder="Aniversario, cuna para el bebé, llegamos con mascota…" className={`${campo} resize-none`} />
                    </Campo>
                    <div className="rounded-2xl bg-[#efe6d4] p-4 text-sm">
                      <p className="font-semibold">Política de cancelación</p>
                      <ul className="mt-2 grid gap-1 text-[#4f483e]">
                        <li>· Cancelás sin cargo hasta 7 días antes de la llegada: te devolvemos la seña completa.</li>
                        <li>· Con menos de 7 días, la seña queda como crédito para otra fecha dentro del año.</li>
                        <li>· Si no te presentás, se pierde la seña.</li>
                      </ul>
                      <label className="mt-3 flex cursor-pointer items-start gap-3">
                        <input
                          id="am-politica"
                          type="checkbox"
                          checked={form.politica}
                          onChange={(e) => setForm({ ...form, politica: e.target.checked })}
                          aria-invalid={Boolean(errores.politica)}
                          aria-describedby={errores.politica ? "am-politica-error" : undefined}
                          className="mt-0.5 size-4 accent-[#2f4a3a]"
                        />
                        <span className="font-medium">Leí y acepto la política de cancelación.</span>
                      </label>
                      {errores.politica ? (
                        <p id="am-politica-error" className="mt-2 text-sm font-medium text-[#a8321e]">
                          {errores.politica}
                        </p>
                      ) : null}
                    </div>
                    {envio === "error" ? (
                      <p role="alert" className="flex items-start gap-2 rounded-xl bg-[#a8321e]/10 p-3 text-sm text-[#a8321e]">
                        <IconoAlerta width={16} height={16} className="mt-0.5 shrink-0" /> Esa cabaña se reservó recién para esas fechas. Volvé a elegir.
                      </p>
                    ) : null}
                    <div className="flex flex-wrap justify-between gap-3">
                      <button type="button" className={btnSec} onClick={() => ir(2)}>
                        <IconoFlechaIzq width={18} height={18} /> Cabaña
                      </button>
                      <button type="submit" className={btn} disabled={envio === "enviando"} aria-busy={envio === "enviando"}>
                        {envio === "enviando" ? (
                          <>
                            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none" aria-hidden="true" /> Confirmando…
                          </>
                        ) : (
                          <>Confirmar y señar {cot ? pesos(cot.sena) : ""}</>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-[#6b6356]">Demo: no se cobra ninguna seña ni se reserva una cabaña real. Tus datos no salen de este navegador.</p>
                  </form>
                )}
              </div>

              <aside aria-label="Resumen de la estadía" className="lg:sticky lg:top-6 lg:self-start">
                <Resumen cabana={cabanaSel} desde={desde} hasta={hasta} adultos={adultos} menores={menores} />
              </aside>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function Resumen({ cabana, desde, hasta, adultos, menores }: { cabana?: Cabana; desde: DiaISO | null; hasta: DiaISO | null; adultos: number; menores: number }) {
  const cot = cabana && desde && hasta ? cotizar(cabana, desde, hasta) : null;
  return (
    <div className="overflow-hidden rounded-[1.75rem] bg-[#2f4a3a] text-[#f7f2e8]">
      {cabana ? (
        <div className="relative aspect-[16/9]">
          <Image src={cabana.img} alt="" fill sizes="340px" className="object-cover" />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2f4a3a] to-transparent p-4 pt-10">
            <span className={`${serif} text-2xl font-medium`}>{cabana.nombre}</span>
          </span>
        </div>
      ) : (
        <div className="grid aspect-[3/1] place-items-center bg-[#243a2d] text-center lg:aspect-[16/9]">
          <span className="px-6 text-sm text-[#f7f2e8]/70">
            <IconoCalendario width={26} height={26} className="mx-auto mb-2 text-[#e8c79a]" />
            Elegí fechas y cabaña para ver el total
          </span>
        </div>
      )}
      <div className="p-5">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-white/8 p-3">
            <dt className="text-xs text-[#f7f2e8]/75">Llegada</dt>
            <dd className="mt-0.5 font-semibold">{desde ? fechaCorta(desde) : "—"}</dd>
            <dd className="text-xs text-[#f7f2e8]/75">desde las {complejo.checkIn}</dd>
          </div>
          <div className="rounded-xl bg-white/8 p-3">
            <dt className="text-xs text-[#f7f2e8]/75">Salida</dt>
            <dd className="mt-0.5 font-semibold">{hasta ? fechaCorta(hasta) : "—"}</dd>
            <dd className="text-xs text-[#f7f2e8]/75">hasta las {complejo.checkOut}</dd>
          </div>
          <div className="col-span-2 flex justify-between rounded-xl bg-white/8 p-3">
            <dt className="text-[#f7f2e8]/75">Huéspedes</dt>
            <dd className="font-semibold">
              {adultos} {adultos === 1 ? "adulto" : "adultos"}
              {menores ? ` + ${menores} ${menores === 1 ? "menor" : "menores"}` : ""}
            </dd>
          </div>
        </dl>
        {cot ? (
          <div className="mt-5 grid gap-1.5 text-sm">
            {cot.detalle.map(([tarifa, n]) => (
              <p key={tarifa} className="flex justify-between gap-3">
                <span className="text-[#f7f2e8]/75">
                  {n} {n === 1 ? "noche" : "noches"} × {pesos(tarifa)}
                </span>
                <span className="tabular-nums">{pesos(tarifa * n)}</span>
              </p>
            ))}
            <p className="flex justify-between gap-3">
              <span className="text-[#f7f2e8]/75">Limpieza final</span>
              <span className="tabular-nums">{pesos(cot.limpieza)}</span>
            </p>
            <p className="mt-2 flex items-baseline justify-between border-t border-white/15 pt-3">
              <span>Total</span>
              <span className={`${serif} text-3xl font-medium tabular-nums`}>{pesos(cot.total)}</span>
            </p>
            <p className="flex justify-between rounded-lg bg-[#e8c79a] px-3 py-2 font-semibold text-[#2a2620]">
              <span>Seña (30 %)</span>
              <span className="tabular-nums">{pesos(cot.sena)}</span>
            </p>
            <p className="mt-1 text-xs text-[#f7f2e8]/65">El resto lo abonás al llegar. Desayuno serrano incluido.</p>
          </div>
        ) : (
          <p className="mt-5 text-sm text-[#f7f2e8]/65">Fines de semana +15 %. Temporada alta +25 %. Desayuno incluido.</p>
        )}
      </div>
    </div>
  );
}

function Contador({ etiqueta, ayuda, valor, min, max, onCambio }: { etiqueta: string; ayuda?: string; valor: number; min: number; max: number; onCambio: (v: number) => void }) {
  return (
    <div className="grid gap-1.5">
      <span id={`am-cnt-${etiqueta}`} className="text-sm font-semibold">
        {etiqueta} {ayuda ? <span className="font-normal text-[#6b6356]">({ayuda})</span> : null}
      </span>
      <div role="group" aria-labelledby={`am-cnt-${etiqueta}`} className="flex items-center justify-between gap-2 rounded-xl border border-[#2a2620]/15 bg-white p-1.5">
        <button
          type="button"
          onClick={() => onCambio(valor - 1)}
          disabled={valor <= min}
          aria-label={`Restar ${etiqueta.toLowerCase()}`}
          className="grid size-9 place-items-center rounded-lg bg-[#efe6d4] transition hover:bg-[#e4d8c0] disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-[#b5653a]"
        >
          <IconoMenos width={15} height={15} grosor={2.4} />
        </button>
        <output aria-live="polite" className="w-6 text-center text-lg font-semibold tabular-nums">
          {valor}
        </output>
        <button
          type="button"
          onClick={() => onCambio(valor + 1)}
          disabled={valor >= max}
          aria-label={`Sumar ${etiqueta.toLowerCase()}`}
          className="grid size-9 place-items-center rounded-lg bg-[#efe6d4] transition hover:bg-[#e4d8c0] disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-[#b5653a]"
        >
          <IconoMas width={15} height={15} grosor={2.4} />
        </button>
      </div>
    </div>
  );
}

const campo =
  "w-full rounded-xl border border-[#2a2620]/15 bg-white px-3.5 py-3 text-base text-[#2a2620] outline-none transition placeholder:text-[#2a2620]/35 focus:border-[#2f4a3a] focus:ring-2 focus:ring-[#2f4a3a]/20 aria-[invalid=true]:border-[#a8321e]";

function Campo({ id, etiqueta, error, children }: { id: string; etiqueta: string; error?: string; children: ReactNode }) {
  return (
    <div className="grid content-start gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {etiqueta}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm font-medium text-[#a8321e]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Confirmacion({ r, tituloRef, onNueva }: { r: ReservaCabana; tituloRef: React.RefObject<HTMLHeadingElement | null>; onNueva: () => void }) {
  const c = cabanas.find((x) => x.id === r.cabana);
  const noches = diferenciaDias(r.desde, r.hasta);
  const limite = sumarDias(r.desde, -7);
  return (
    <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-[2rem] bg-[#fbf8f2] shadow-[0_30px_70px_-40px_rgba(47,74,58,0.7)] ring-1 ring-[#2a2620]/6">
      <div className="relative aspect-[21/9]">
        {c ? <Image src={c.img} alt={c.alt} fill sizes="768px" className="object-cover" /> : null}
        <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-[#fbf8f2] px-3 py-1.5 text-sm font-semibold text-[#2f4a3a]">
          <IconoCheck width={15} height={15} grosor={2.6} /> Estadía confirmada
        </span>
      </div>
      <div className="p-6 sm:p-10">
        <h3 ref={tituloRef} tabIndex={-1} className={`${serif} text-4xl leading-tight font-medium outline-none md:text-5xl`}>
          ¡Te esperamos, {r.nombre.split(" ")[0]}!
        </h3>
        <p className="mt-3 text-[#4f483e]">
          Te mandaríamos la confirmación a <strong>{r.email}</strong> con cómo llegar y la clave del portón.
        </p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-[#efe6d4] p-4">
            <dt className="text-xs font-semibold text-[#6b6356] uppercase">Cabaña</dt>
            <dd className={`${serif} mt-1 text-xl font-medium`}>{c?.nombre}</dd>
          </div>
          <div className="rounded-2xl bg-[#efe6d4] p-4">
            <dt className="text-xs font-semibold text-[#6b6356] uppercase">Fechas</dt>
            <dd className="mt-1 font-semibold">
              {fechaCorta(r.desde)} → {fechaCorta(r.hasta)}
            </dd>
            <dd className="text-sm text-[#6b6356]">{noches} noches</dd>
          </div>
          <div className="rounded-2xl bg-[#2f4a3a] p-4 text-[#f7f2e8]">
            <dt className="text-xs font-semibold text-[#f7f2e8]/65 uppercase">Código</dt>
            <dd className="mt-1 font-mono text-xl font-semibold tracking-widest">{r.codigo}</dd>
          </div>
        </dl>
        <p className="mt-5 text-sm text-[#4f483e]">
          Seña: <strong>{pesos(r.sena)}</strong> · Resto al llegar: <strong>{pesos(r.total - r.sena)}</strong>. Cancelás sin cargo hasta el{" "}
          <strong>{fechaLarga(limite)}</strong>.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            className={btn}
            onClick={() =>
              descargarIcs(
                {
                  tipo: "dias",
                  uid: r.id,
                  titulo: `Estadía en ${c?.nombre} · ${complejo.nombre}`,
                  descripcion: `Código ${r.codigo}. Check-in desde las ${complejo.checkIn}, check-out hasta las ${complejo.checkOut}. Demo con contenido ficticio.`,
                  lugar: complejo.direccion,
                  desde: r.desde,
                  hasta: r.hasta,
                },
                `arroyo-manso-${r.codigo}`,
              )
            }
          >
            <IconoDescarga width={18} height={18} /> Agregar al calendario
          </button>
          <button type="button" className={btnSec} onClick={() => emitirDemo("cabanas:mis-reservas", null)}>
            Mis reservas
          </button>
          <button type="button" className={btnSec} onClick={onNueva}>
            Hacer otra reserva
          </button>
        </div>
        <p className="mt-8 flex items-start gap-2 rounded-2xl border border-dashed border-[#2a2620]/25 p-4 text-sm text-[#6b6356]">
          <IconoAlerta width={16} height={16} className="mt-0.5 shrink-0" /> Esto es una demo: no se cobró ninguna seña, no se reservó una cabaña real y no se envió ningún email. La reserva queda solo en este navegador.
        </p>
      </div>
    </div>
  );
}
