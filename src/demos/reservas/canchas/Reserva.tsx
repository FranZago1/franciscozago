"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { z } from "zod";
import { codigoReserva } from "../shared/azar";
import { Dialogo } from "../shared/Dialogo";
import { fechaCorta, fechaLarga, hhmm, nombreDiaCorto, partes, pesos, sumarDias, type Ahora, type DiaISO } from "../shared/fechas";
import { emitirDemo, useAhora, useReservasGuardadas } from "../shared/hooks";
import { descargarIcs } from "../shared/ics";
import {
  IconoAlerta,
  IconoCheck,
  IconoChevronDer,
  IconoChevronIzq,
  IconoDescarga,
  IconoLuz,
  IconoMas,
  IconoMenos,
  IconoPaleta,
  IconoPelota,
  IconoPersonas,
  IconoSol,
  IconoTarjeta,
  IconoBanco,
  IconoTecho,
} from "../shared/Iconos";
import {
  BLOQUE,
  BLOQUES,
  DIAS_VISIBLES,
  DURACIONES,
  PRECIO_PALETA,
  PRECIO_PELOTAS,
  SENA,
  bloquePasado,
  canchas,
  club,
  cotizar,
  entra,
  inicioBloque,
  jugadoresDisponibles,
  ocupacionCompleta,
  type Cancha,
  type Duracion,
  type Ocupado,
  type ReservaCancha,
} from "./datos";

const display = "[font-family:var(--font-pc-display)]";

const esquema = z.object({
  nombre: z.string().trim().min(2, "Escribí tu nombre."),
  telefono: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{7,17}$/, "Escribí un celular válido (ej. 351 555 1234)."),
});

type Filtro = "todas" | "techadas" | "descubiertas";
type Sel = { cancha: string; b: number };

const btnPrimario =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[#1553d6] px-5 py-3.5 font-bold text-white shadow-[0_8px_20px_-8px_rgba(21,83,214,0.7)] transition hover:bg-[#0f47bd] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#1553d6]/35 disabled:shadow-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#d8f03c]";

export function Reserva() {
  const ahora = useAhora();
  const { lista: propias, guardar } = useReservasGuardadas<ReservaCancha>("canchas");
  const [dia, setDia] = useState<DiaISO | null>(null);
  const [duracion, setDuracion] = useState<Duracion>(90);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [sel, setSel] = useState<Sel | null>(null);
  const [hover, setHover] = useState<Sel | null>(null);
  const [paletas, setPaletas] = useState(0);
  const [pelotas, setPelotas] = useState(false);
  const [buscar, setBuscar] = useState(false);
  const [faltan, setFaltan] = useState(1);
  const [nivel, setNivel] = useState("Todos");
  const [invitados, setInvitados] = useState<string[]>([]);
  const [form, setForm] = useState({ nombre: "", telefono: "" });
  const [pago, setPago] = useState<"tarjeta" | "transferencia">("tarjeta");
  const [errores, setErrores] = useState<Partial<Record<"nombre" | "telefono", string>>>({});
  const [envio, setEnvio] = useState<"listo" | "enviando" | "error">("listo");
  const [confirmada, setConfirmada] = useState<ReservaCancha | null>(null);
  const [aviso, setAviso] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const [panelVisible, setPanelVisible] = useState(false);

  // La barra flotante de mobile se esconde cuando el panel de la reserva ya está en pantalla.
  useEffect(() => {
    const el = panel.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setPanelVisible(Boolean(e?.isIntersecting)), { rootMargin: "0px 0px -35% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hoy = ahora?.dia ?? null;
  const diaActivo = dia ?? hoy;
  const visibles = canchas.filter((c) => filtro === "todas" || (filtro === "techadas" ? c.techada : !c.techada));

  const mapas = useMemo(() => {
    const m = new Map<string, Map<number, Ocupado>>();
    if (!diaActivo) return m;
    for (const c of canchas) m.set(c.id, ocupacionCompleta(c, diaActivo, propias));
    return m;
  }, [diaActivo, propias]);

  const canchaSel = sel ? canchas.find((c) => c.id === sel.cancha) : undefined;
  const selValida = Boolean(ahora && diaActivo && sel && canchaSel && entra(mapas.get(sel.cancha) ?? new Map(), diaActivo, sel.b, duracion, ahora));
  const inicio = sel ? inicioBloque(sel.b) : 0;
  const cot = selValida && canchaSel && diaActivo ? cotizar(canchaSel, diaActivo, inicio, duracion) : { cancha: 0, luz: 0 };
  const extras = paletas * PRECIO_PALETA + (pelotas ? PRECIO_PELOTAS : 0);
  const total = cot.cancha + cot.luz + extras;
  const sena = Math.round((total * SENA) / 100) * 100;

  function elegirCelda(c: Cancha, b: number) {
    if (!ahora || !diaActivo) return;
    const mapa = mapas.get(c.id);
    if (!mapa) return;
    if (mapa.has(b) || bloquePasado(diaActivo, b, ahora)) return;
    if (!entra(mapa, diaActivo, b, duracion, ahora)) {
      setAviso(`No entran ${duracion} minutos seguidos desde las ${hhmm(inicioBloque(b))} en ${c.nombre}. Probá otro horario o una duración más corta.`);
      return;
    }
    setSel({ cancha: c.id, b });
    setAviso(`${c.nombre}, de ${hhmm(inicioBloque(b))} a ${hhmm(inicioBloque(b) + duracion)}. Total ${pesos(cotizar(c, diaActivo, inicioBloque(b), duracion).cancha)} de cancha.`);
  }

  function elegirDia(d: DiaISO) {
    setDia(d);
    setSel(null);
    setInvitados([]);
    setAviso(`${fechaLarga(d)}.`);
  }

  function confirmar(e: React.FormEvent) {
    e.preventDefault();
    if (!selValida || !sel || !diaActivo || !ahora || !canchaSel) {
      setAviso("Primero elegí un horario libre en la grilla.");
      return;
    }
    const r = esquema.safeParse(form);
    if (!r.success) {
      const errs: typeof errores = {};
      for (const i of r.error.issues) {
        const k = i.path[0] as "nombre" | "telefono";
        errs[k] ??= i.message;
      }
      setErrores(errs);
      setAviso("Revisá los datos marcados.");
      document.getElementById(`pc-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setErrores({});
    setEnvio("enviando");
    setAviso("Procesando la seña…");
    window.setTimeout(() => {
      const mapa = ocupacionCompleta(canchaSel, diaActivo, propias);
      if (!entra(mapa, diaActivo, sel.b, duracion, ahora)) {
        setEnvio("error");
        return;
      }
      const reserva: ReservaCancha = {
        id: crypto.randomUUID(),
        codigo: codigoReserva("PCS"),
        estado: "confirmada",
        creada: new Date().toISOString(),
        dia: diaActivo,
        cancha: canchaSel.id,
        inicio,
        duracion,
        paletas,
        pelotas,
        invitados: jugadoresDisponibles(diaActivo, inicio)
          .filter((j) => invitados.includes(j.id))
          .map((j) => j.nombre),
        total,
        sena,
        nombre: form.nombre.trim(),
        pago,
      };
      guardar(reserva);
      setEnvio("listo");
      setConfirmada(reserva);
      setSel(null);
      setPaletas(0);
      setPelotas(false);
      setInvitados([]);
      setBuscar(false);
      setAviso(`Cancha reservada. Código ${reserva.codigo}.`);
    }, 1200);
  }

  return (
    <section id="reservar" aria-labelledby="reservar-titulo" className="scroll-mt-20 bg-[#f4f7fc]">
      <p className="sr-only" role="status" aria-live="polite">
        {aviso}
      </p>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[#d8f03c] px-3 py-1 text-xs font-bold tracking-wide text-[#0a1b3d] uppercase">
              <span className="size-1.5 animate-pulse rounded-full bg-[#2e9e5b] motion-reduce:animate-none" aria-hidden="true" /> Disponibilidad en vivo
            </p>
            <h2 id="reservar-titulo" className={`${display} mt-3 text-5xl leading-[0.9] font-extrabold text-[#0a1b3d] uppercase italic md:text-7xl`}>
              Reservá tu cancha
            </h2>
          </div>
          <p className="max-w-sm text-[#0a1b3d]/70">Elegí el día, la duración y tocá un horario libre. Se marcan solos los bloques que ocupás.</p>
        </div>

        {/* Selector de día */}
        <SelectorDia hoy={hoy} dia={diaActivo} onElegir={elegirDia} propias={propias} />

        {/* Controles */}
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Segmentado
            etiqueta="Duración"
            opciones={DURACIONES.map((d) => ({ valor: String(d), texto: `${d} min` }))}
            valor={String(duracion)}
            onCambio={(v) => {
              setDuracion(Number(v) as Duracion);
              setAviso(`Duración ${v} minutos.`);
            }}
          />
          <Segmentado
            etiqueta="Canchas"
            opciones={[
              { valor: "todas", texto: "Todas" },
              { valor: "techadas", texto: "Techadas" },
              { valor: "descubiertas", texto: "Descubiertas" },
            ]}
            valor={filtro}
            onCambio={(v) => setFiltro(v as Filtro)}
          />
        </div>

        {sel && !selValida && ahora ? (
          <p role="alert" className="mt-4 flex items-center gap-2 rounded-xl bg-[#fff4e5] px-4 py-3 text-sm text-[#8a4b00]">
            <IconoAlerta width={16} height={16} /> Con {duracion} minutos ese horario ya no entra. Elegí otro en la grilla.
          </p>
        ) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div className="min-w-0">
            {ahora && diaActivo ? (
              <Planilla
                key={`${diaActivo}-${filtro}`}
                dia={diaActivo}
                ahora={ahora}
                canchas={visibles}
                mapas={mapas}
                duracion={duracion}
                sel={selValida ? sel : null}
                hover={hover}
                onHover={setHover}
                onElegir={elegirCelda}
              />
            ) : (
              <div className="grid h-[560px] place-items-center rounded-2xl bg-white text-sm text-[#0a1b3d]/60 ring-1 ring-[#0a1b3d]/8">Cargando grilla…</div>
            )}
            <Leyenda />
          </div>

          {/* Panel de la reserva */}
          <div ref={panel} id="pc-panel" className="scroll-mt-4 lg:sticky lg:top-4">
            <form onSubmit={confirmar} noValidate className="overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_-30px_rgba(10,27,61,0.45)] ring-1 ring-[#0a1b3d]/8">
              <div className="bg-[#0a1b3d] p-5 text-white">
                <p className="text-xs font-bold tracking-[0.2em] text-[#d8f03c] uppercase">Tu reserva</p>
                {selValida && canchaSel && diaActivo ? (
                  <>
                    <p className={`${display} mt-2 text-3xl leading-none font-bold uppercase italic`}>
                      {canchaSel.nombre}
                      {canchaSel.apodo ? ` · ${canchaSel.apodo}` : ""}
                    </p>
                    <p className="mt-2 text-sm text-white/80">
                      <span className="first-letter:uppercase inline-block">{fechaLarga(diaActivo)}</span> · {hhmm(inicio)} a {hhmm(inicio + duracion)}
                    </p>
                    <p className="mt-3 flex flex-wrap gap-1.5 text-xs">
                      <Chip>{canchaSel.techada ? <IconoTecho width={13} height={13} /> : <IconoSol width={13} height={13} />}{canchaSel.techada ? "Techada" : "Descubierta"}</Chip>
                      {canchaSel.panoramica ? <Chip>Panorámica</Chip> : null}
                      <Chip>{duracion} min</Chip>
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-white/75">Tocá un horario libre en la grilla para empezar.</p>
                )}
              </div>

              <fieldset disabled={!selValida} className="grid gap-5 p-5 disabled:opacity-50">
                <legend className="sr-only">Extras y datos</legend>
                {/* Extras */}
                <div>
                  <p className="text-xs font-bold tracking-[0.15em] text-[#0a1b3d]/60 uppercase">Extras</p>
                  <div className="mt-3 grid gap-2">
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f4f7fc] p-3">
                      <span className="flex items-center gap-3">
                        <span className="grid size-9 place-items-center rounded-lg bg-white text-[#1553d6] ring-1 ring-[#0a1b3d]/8">
                          <IconoPaleta width={18} height={18} />
                        </span>
                        <span className="text-sm leading-tight">
                          <span id="pc-paletas-label" className="block font-semibold">Alquiler de paletas</span>
                          <span className="text-[#0a1b3d]/60">{pesos(PRECIO_PALETA)} c/u</span>
                        </span>
                      </span>
                      <span className="flex items-center gap-1" role="group" aria-labelledby="pc-paletas-label">
                        <BotonCantidad etiqueta="Una paleta menos" onClick={() => setPaletas((n) => Math.max(0, n - 1))} deshabilitado={paletas === 0}>
                          <IconoMenos width={14} height={14} grosor={2.5} />
                        </BotonCantidad>
                        <output aria-live="polite" className="w-7 text-center font-bold tabular-nums">
                          {paletas}
                        </output>
                        <BotonCantidad etiqueta="Una paleta más" onClick={() => setPaletas((n) => Math.min(4, n + 1))} deshabilitado={paletas === 4}>
                          <IconoMas width={14} height={14} grosor={2.5} />
                        </BotonCantidad>
                      </span>
                    </div>
                    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-[#f4f7fc] p-3 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#1553d6]">
                      <span className="flex items-center gap-3">
                        <span className="grid size-9 place-items-center rounded-lg bg-white text-[#2e9e5b] ring-1 ring-[#0a1b3d]/8">
                          <IconoPelota width={18} height={18} />
                        </span>
                        <span className="text-sm leading-tight">
                          <span className="block font-semibold">Tubo de pelotas nuevo</span>
                          <span className="text-[#0a1b3d]/60">{pesos(PRECIO_PELOTAS)} · 3 pelotas</span>
                        </span>
                      </span>
                      <input type="checkbox" checked={pelotas} onChange={(e) => setPelotas(e.target.checked)} className="size-5 accent-[#1553d6]" />
                    </label>
                    {selValida && canchaSel && !canchaSel.techada ? (
                      <p className="flex items-center gap-3 rounded-xl border border-dashed border-[#0a1b3d]/15 p-3 text-sm">
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#fffbe0] text-[#a88a00]">
                          <IconoLuz width={18} height={18} />
                        </span>
                        {cot.luz ? `Iluminación: ${pesos(cot.luz)} (se prende a las 19 hs)` : "Sin cargo de luz: termina antes de las 19 hs."}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Buscar compañeros */}
                <div className="rounded-xl ring-1 ring-[#0a1b3d]/10">
                  <div className="flex items-center justify-between gap-3 p-3">
                    <span className="flex items-center gap-3 text-sm">
                      <span className="grid size-9 place-items-center rounded-lg bg-[#1553d6] text-white">
                        <IconoPersonas width={18} height={18} />
                      </span>
                      <span className="leading-tight">
                        <span id="pc-buscar-label" className="block font-semibold">Me faltan jugadores</span>
                        <span className="text-[#0a1b3d]/60">Invitá gente que busca partido</span>
                      </span>
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={buscar}
                      aria-labelledby="pc-buscar-label"
                      onClick={() => setBuscar((v) => !v)}
                      className={`relative h-7 w-12 shrink-0 rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1553d6] ${buscar ? "bg-[#2e9e5b]" : "bg-[#0a1b3d]/20"}`}
                    >
                      <span className={`absolute top-1 left-1 size-5 rounded-full bg-white shadow transition ${buscar ? "translate-x-5" : ""}`} />
                    </button>
                  </div>
                  {buscar && selValida && diaActivo ? (
                    <Companeros
                      dia={diaActivo}
                      inicio={inicio}
                      faltan={faltan}
                      setFaltan={(n) => {
                        setFaltan(n);
                        setInvitados((l) => l.slice(0, n));
                      }}
                      nivel={nivel}
                      setNivel={setNivel}
                      invitados={invitados}
                      alternar={(id, nombre) => {
                        setInvitados((l) => (l.includes(id) ? l.filter((x) => x !== id) : l.length < faltan ? [...l, id] : l));
                        setAviso(invitados.includes(id) ? `Quitaste a ${nombre}.` : `Invitaste a ${nombre}.`);
                      }}
                    />
                  ) : null}
                </div>

                {/* Totales */}
                <dl className="grid gap-1.5 text-sm">
                  <Linea t={`Cancha (${duracion} min)`} v={cot.cancha} />
                  {cot.luz ? <Linea t="Iluminación" v={cot.luz} /> : null}
                  {paletas ? <Linea t={`Paletas × ${paletas}`} v={paletas * PRECIO_PALETA} /> : null}
                  {pelotas ? <Linea t="Tubo de pelotas" v={PRECIO_PELOTAS} /> : null}
                  <div className="mt-2 flex items-baseline justify-between border-t border-[#0a1b3d]/10 pt-3">
                    <dt className="font-semibold">Total</dt>
                    <dd className={`${display} text-4xl font-extrabold text-[#0a1b3d] tabular-nums`}>{pesos(total)}</dd>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-[#d8f03c]/50 px-3 py-2">
                    <dt className="font-semibold">Seña para confirmar (30 %)</dt>
                    <dd className="font-bold tabular-nums">{pesos(sena)}</dd>
                  </div>
                  <p className="text-xs text-[#0a1b3d]/55">El resto ({pesos(total - sena)}) lo pagás en el club. Por jugador: {pesos(total / 4)}.</p>
                </dl>

                {/* Datos */}
                <div className="grid gap-3">
                  <Campo id="pc-nombre" etiqueta="Nombre" error={errores.nombre}>
                    <input
                      id="pc-nombre"
                      autoComplete="name"
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      aria-invalid={Boolean(errores.nombre)}
                      aria-describedby={errores.nombre ? "pc-nombre-error" : undefined}
                      className={campo}
                    />
                  </Campo>
                  <Campo id="pc-telefono" etiqueta="Celular" error={errores.telefono}>
                    <input
                      id="pc-telefono"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="351 555 1234"
                      value={form.telefono}
                      onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                      aria-invalid={Boolean(errores.telefono)}
                      aria-describedby={errores.telefono ? "pc-telefono-error" : undefined}
                      className={campo}
                    />
                  </Campo>
                  <fieldset>
                    <legend className="text-sm font-semibold">Pagá la seña con</legend>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {(
                        [
                          ["tarjeta", "Tarjeta", <IconoTarjeta key="t" width={18} height={18} />],
                          ["transferencia", "Transferencia", <IconoBanco key="b" width={18} height={18} />],
                        ] as const
                      ).map(([v, t, ic]) => (
                        <label
                          key={v}
                          className={`flex cursor-pointer items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#1553d6] ${
                            pago === v ? "border-[#1553d6] bg-[#1553d6]/6 text-[#1553d6]" : "border-[#0a1b3d]/10"
                          }`}
                        >
                          <input type="radio" name="pc-pago" value={v} checked={pago === v} onChange={() => setPago(v)} className="sr-only" />
                          {ic} {t}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>

                {envio === "error" ? (
                  <p role="alert" className="flex items-start gap-2 rounded-xl bg-[#fdecec] p-3 text-sm text-[#9b1c1c]">
                    <IconoAlerta width={16} height={16} className="mt-0.5 shrink-0" /> Alguien reservó ese horario recién. Elegí otro en la grilla.
                  </p>
                ) : null}

                <button type="submit" className={btnPrimario} disabled={!selValida || envio === "enviando"} aria-busy={envio === "enviando"}>
                  {envio === "enviando" ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent motion-reduce:animate-none" aria-hidden="true" /> Procesando seña…
                    </>
                  ) : (
                    <>Pagar seña y reservar {selValida ? pesos(sena) : ""}</>
                  )}
                </button>
                <p className="text-center text-xs text-[#0a1b3d]/55">Demo: no se cobra nada ni se reserva una cancha real.</p>
              </fieldset>
            </form>
          </div>
        </div>
      </div>

      {/* Barra pegajosa en mobile con la selección */}
      {selValida && canchaSel && !panelVisible ? (
        <div className="pointer-events-none sticky bottom-28 z-30 px-4 lg:hidden">
          <a
            href="#pc-panel"
            className="pointer-events-auto mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl bg-[#1553d6] px-4 py-3 text-white shadow-[0_12px_30px_-10px_rgba(10,27,61,0.6)] focus-visible:outline-3 focus-visible:outline-[#d8f03c]"
          >
            <span className="min-w-0 text-sm leading-tight">
              <span className="block truncate font-bold">
                {canchaSel.nombre} · {hhmm(inicio)} a {hhmm(inicio + duracion)}
              </span>
              <span className="text-white/80">
                Total {pesos(total)} · seña {pesos(sena)}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-1 rounded-lg bg-[#d8f03c] px-3 py-2 text-sm font-bold text-[#0a1b3d]">
              Seguir <IconoChevronDer width={14} height={14} grosor={2.5} />
            </span>
          </a>
        </div>
      ) : null}

      <Dialogo
        abierto={Boolean(confirmada)}
        onCerrar={() => setConfirmada(null)}
        titulo="¡Cancha reservada!"
        className="m-auto w-[min(30rem,calc(100vw-2rem))] max-h-[88dvh] rounded-3xl bg-white p-0 text-[#0a1b3d] shadow-2xl backdrop:bg-[#0a1b3d]/70 backdrop:backdrop-blur-sm"
        claseCuerpo="p-6 sm:p-7 [font-family:var(--font-pc-sans)]"
        claseTitulo={`${display} text-4xl font-extrabold uppercase italic leading-none`}
        claseCerrar="grid size-9 place-items-center rounded-full bg-[#f4f7fc] hover:bg-[#e6ecf7] focus-visible:outline-2 focus-visible:outline-[#1553d6]"
      >
        {confirmada ? <Confirmacion r={confirmada} /> : null}
      </Dialogo>
    </section>
  );
}

function Confirmacion({ r }: { r: ReservaCancha }) {
  const c = canchas.find((x) => x.id === r.cancha);
  return (
    <div>
      <p className="mt-2 text-sm text-[#0a1b3d]/70">Te guardamos la reserva en “Mis reservas”. Mostrá el código en recepción.</p>
      <div className="mt-5 overflow-hidden rounded-2xl bg-[#1553d6] text-white">
        <div className="relative p-5">
          <svg viewBox="0 0 100 60" className="absolute top-0 right-0 h-full opacity-20" aria-hidden="true">
            <rect x="10" y="5" width="85" height="50" fill="none" stroke="#fff" strokeWidth="1.5" />
            <path d="M52.5 5v50M10 30h85M26 17v26M79 17v26M26 17h53M26 43h53" stroke="#fff" strokeWidth="1" fill="none" />
          </svg>
          <p className="text-xs font-bold tracking-[0.2em] text-[#d8f03c] uppercase">Código</p>
          <p className="mt-1 font-mono text-3xl font-bold tracking-widest">{r.codigo}</p>
          <p className="mt-4 text-lg font-bold">
            {c?.nombre}
            {c?.apodo ? ` · ${c.apodo}` : ""}
          </p>
          <p className="text-white/85">
            <span className="inline-block first-letter:uppercase">{fechaLarga(r.dia)}</span> · {hhmm(r.inicio)} a {hhmm(r.inicio + r.duracion)}
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-px bg-white/15 text-sm">
          <div className="bg-[#0f47bd] p-4">
            <dt className="text-white/70">Seña pagada</dt>
            <dd className="text-lg font-bold">{pesos(r.sena)}</dd>
          </div>
          <div className="bg-[#0f47bd] p-4">
            <dt className="text-white/70">Resta en el club</dt>
            <dd className="text-lg font-bold">{pesos(r.total - r.sena)}</dd>
          </div>
        </dl>
      </div>
      {r.paletas || r.pelotas ? (
        <p className="mt-4 text-sm">
          Extras: {[r.paletas ? `${r.paletas} paleta${r.paletas > 1 ? "s" : ""}` : "", r.pelotas ? "tubo de pelotas" : ""].filter(Boolean).join(" y ")}.
        </p>
      ) : null}
      {r.invitados.length ? (
        <p className="mt-2 text-sm">
          Invitaciones enviadas (simuladas) a <strong>{r.invitados.join(", ")}</strong>. Te avisamos cuando acepten.
        </p>
      ) : null}
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          className={btnPrimario}
          onClick={() =>
            descargarIcs(
              {
                tipo: "horario",
                uid: r.id,
                titulo: `Pádel · ${c?.nombre} · ${club.nombre}`,
                descripcion: `Código ${r.codigo}. Seña ${pesos(r.sena)}, resta ${pesos(r.total - r.sena)}. Demo con contenido ficticio.`,
                lugar: club.direccion,
                dia: r.dia,
                inicio: r.inicio,
                fin: r.inicio + r.duracion,
              },
              `padel-${r.codigo}`,
            )
          }
        >
          <IconoDescarga width={18} height={18} /> Agregar al calendario
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f4f7fc] px-5 py-3.5 font-bold transition hover:bg-[#e6ecf7] focus-visible:outline-2 focus-visible:outline-[#1553d6]"
          onClick={(e) => {
            e.currentTarget.closest("dialog")?.close();
            window.setTimeout(() => emitirDemo("canchas:mis-reservas", null), 50);
          }}
        >
          Ver mis reservas
        </button>
      </div>
      <p className="mt-5 flex items-start gap-2 rounded-xl bg-[#fff4e5] p-3 text-xs text-[#8a4b00]">
        <IconoAlerta width={14} height={14} className="mt-0.5 shrink-0" /> Esto es una demo: no se cobró la seña ni se reservó una cancha real. Queda guardado solo en este navegador.
      </p>
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 font-semibold">{children}</span>;
}

function Linea({ t, v }: { t: string; v: number }) {
  return (
    <div className="flex justify-between">
      <dt className="text-[#0a1b3d]/70">{t}</dt>
      <dd className="font-semibold tabular-nums">{pesos(v)}</dd>
    </div>
  );
}

const campo =
  "w-full rounded-xl border-2 border-[#0a1b3d]/10 bg-[#f4f7fc] px-3.5 py-2.5 text-base text-[#0a1b3d] outline-none transition placeholder:text-[#0a1b3d]/35 focus:border-[#1553d6] focus:bg-white aria-[invalid=true]:border-[#d64545]";

function Campo({ id, etiqueta, error, children }: { id: string; etiqueta: string; error?: string; children: ReactNode }) {
  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="text-sm font-semibold">
        {etiqueta}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm font-medium text-[#d64545]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function BotonCantidad({ etiqueta, onClick, deshabilitado, children }: { etiqueta: string; onClick: () => void; deshabilitado: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={etiqueta}
      onClick={onClick}
      disabled={deshabilitado}
      className="grid size-8 place-items-center rounded-lg bg-white ring-1 ring-[#0a1b3d]/12 transition hover:ring-[#1553d6] disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-[#1553d6]"
    >
      {children}
    </button>
  );
}

function Segmentado({
  etiqueta,
  opciones,
  valor,
  onCambio,
}: {
  etiqueta: string;
  opciones: { valor: string; texto: string }[];
  valor: string;
  onCambio: (v: string) => void;
}) {
  return (
    <fieldset className="flex flex-wrap items-center gap-2.5">
      <legend className="float-left mr-1 text-xs font-bold tracking-[0.15em] text-[#0a1b3d]/60 uppercase">{etiqueta}</legend>
      <div className="flex rounded-xl bg-white p-1 ring-1 ring-[#0a1b3d]/10">
        {opciones.map((o) => (
          <label
            key={o.valor}
            className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm font-bold transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#1553d6] ${
              valor === o.valor ? "bg-[#0a1b3d] text-white" : "text-[#0a1b3d]/70 hover:text-[#0a1b3d]"
            }`}
          >
            <input type="radio" name={`pc-${etiqueta}`} value={o.valor} checked={valor === o.valor} onChange={() => onCambio(o.valor)} className="sr-only" />
            {o.texto}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function SelectorDia({ hoy, dia, onElegir, propias }: { hoy: DiaISO | null; dia: DiaISO | null; onElegir: (d: DiaISO) => void; propias: ReservaCancha[] }) {
  const cont = useRef<HTMLDivElement>(null);
  const dias = useMemo(() => (hoy ? Array.from({ length: DIAS_VISIBLES }, (_, i) => sumarDias(hoy, i)) : []), [hoy]);
  // Ocupación de cada día (para la barrita de disponibilidad).
  const libres = useMemo(
    () =>
      dias.map((d) => {
        let ocupados = 0;
        for (const c of canchas) ocupados += ocupacionCompleta(c, d, propias).size;
        return 1 - ocupados / (canchas.length * BLOQUES);
      }),
    [dias, propias],
  );

  function teclas(e: KeyboardEvent<HTMLDivElement>) {
    if (!dia) return;
    const i = dias.indexOf(dia);
    const destino = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? dias.length - 1 : -2;
    if (destino === -2) return;
    e.preventDefault();
    const d = dias[Math.max(0, Math.min(dias.length - 1, destino))];
    if (!d) return;
    onElegir(d);
    window.requestAnimationFrame(() => cont.current?.querySelector<HTMLButtonElement>(`[data-dia="${d}"]`)?.focus());
  }

  function desplazar(dir: number) {
    cont.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }

  return (
    <div className="relative mt-8 flex items-center gap-2">
      <button
        type="button"
        onClick={() => desplazar(-1)}
        aria-label="Ver días anteriores"
        className="hidden size-10 shrink-0 place-items-center rounded-full bg-white ring-1 ring-[#0a1b3d]/10 hover:ring-[#1553d6] focus-visible:outline-2 focus-visible:outline-[#1553d6] md:grid"
      >
        <IconoChevronIzq width={18} height={18} />
      </button>
      <div
        ref={cont}
        role="radiogroup"
        aria-label="Día de la reserva"
        onKeyDown={teclas}
        className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:px-0"
      >
        {hoy
          ? dias.map((d, i) => {
              const activo = d === dia;
              const p = partes(d);
              const libre = libres[i] ?? 0;
              return (
                <button
                  key={d}
                  type="button"
                  role="radio"
                  aria-checked={activo}
                  tabIndex={activo ? 0 : -1}
                  data-dia={d}
                  onClick={() => onElegir(d)}
                  aria-label={`${fechaLarga(d)}${i === 0 ? ", hoy" : ""}, ${Math.round(libre * 100)} % libre`}
                  className={`flex w-[4.4rem] shrink-0 snap-start flex-col items-center rounded-2xl px-2 pt-2.5 pb-2 transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#1553d6] ${
                    activo ? "bg-[#1553d6] text-white shadow-[0_10px_24px_-10px_rgba(21,83,214,0.8)]" : "bg-white text-[#0a1b3d] ring-1 ring-[#0a1b3d]/8 hover:ring-[#1553d6]/50"
                  }`}
                >
                  <span className={`text-[11px] font-bold tracking-wider uppercase ${activo ? "text-[#d8f03c]" : "text-[#0a1b3d]/55"}`}>
                    {i === 0 ? "Hoy" : i === 1 ? "Mañ" : nombreDiaCorto(d)}
                  </span>
                  <span className={`${display} text-3xl leading-none font-extrabold`}>{p.d}</span>
                  <span className={`text-[10px] font-semibold uppercase ${activo ? "text-white/75" : "text-[#0a1b3d]/45"}`}>{fechaCorta(d).split(" ")[2]}</span>
                  <span className={`mt-1.5 h-1 w-9 overflow-hidden rounded-full ${activo ? "bg-white/25" : "bg-[#0a1b3d]/10"}`} aria-hidden="true">
                    <span className={`block h-full rounded-full ${libre < 0.3 ? "bg-[#e0703a]" : activo ? "bg-[#d8f03c]" : "bg-[#2e9e5b]"}`} style={{ width: `${Math.round(libre * 100)}%` }} />
                  </span>
                </button>
              );
            })
          : Array.from({ length: 7 }, (_, i) => <span key={i} className="h-[5.6rem] w-[4.4rem] shrink-0 animate-pulse rounded-2xl bg-white motion-reduce:animate-none" />)}
      </div>
      <button
        type="button"
        onClick={() => desplazar(1)}
        aria-label="Ver días siguientes"
        className="hidden size-10 shrink-0 place-items-center rounded-full bg-white ring-1 ring-[#0a1b3d]/10 hover:ring-[#1553d6] focus-visible:outline-2 focus-visible:outline-[#1553d6] md:grid"
      >
        <IconoChevronDer width={18} height={18} />
      </button>
    </div>
  );
}

const ETIQUETAS: Record<Ocupado["tipo"], string> = { reserva: "Reservada", clase: "Clase", torneo: "Torneo", tuya: "Tu reserva" };

function Planilla({
  dia,
  ahora,
  canchas: cols,
  mapas,
  duracion,
  sel,
  hover,
  onHover,
  onElegir,
}: {
  dia: DiaISO;
  ahora: Ahora;
  canchas: Cancha[];
  mapas: Map<string, Map<number, Ocupado>>;
  duracion: number;
  sel: Sel | null;
  hover: Sel | null;
  onHover: (s: Sel | null) => void;
  onElegir: (c: Cancha, b: number) => void;
}) {
  const scroll = useRef<HTMLDivElement>(null);
  const n = duracion / BLOQUE;
  const primeraLibre = useMemo(() => {
    for (let b = 0; b < BLOQUES; b++) if (!bloquePasado(dia, b, ahora)) return b;
    return BLOQUES - 1;
  }, [dia, ahora]);
  const [foco, setFoco] = useState<{ c: number; b: number }>(() => ({ c: 0, b: sel?.b ?? Math.max(primeraLibre, 20) }));

  // Arranca mostrando la franja más pedida (desde las 18) o la hora actual si es más tarde.
  useEffect(() => {
    const el = scroll.current;
    if (!el) return;
    const b = Math.max(primeraLibre, dia === ahora.dia ? primeraLibre : 16);
    el.scrollTop = Math.max(0, b * 44 - 8);
    // Solo al montar (la grilla se vuelve a montar al cambiar de día o filtro).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function teclas(e: KeyboardEvent<HTMLTableElement>) {
    const mov: Record<string, [number, number]> = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      PageUp: [0, -6],
      PageDown: [0, 6],
    };
    let destino: { c: number; b: number } | null = null;
    if (mov[e.key]) {
      const [dc, db] = mov[e.key]!;
      destino = { c: Math.max(0, Math.min(cols.length - 1, foco.c + dc)), b: Math.max(0, Math.min(BLOQUES - 1, foco.b + db)) };
    } else if (e.key === "Home") destino = { c: 0, b: foco.b };
    else if (e.key === "End") destino = { c: cols.length - 1, b: foco.b };
    if (!destino) return;
    e.preventDefault();
    setFoco(destino);
    const c = cols[destino.c];
    if (c) onHover({ cancha: c.id, b: destino.b });
    const d = destino;
    window.requestAnimationFrame(() => scroll.current?.querySelector<HTMLButtonElement>(`[data-celda="${d.c}-${d.b}"]`)?.focus());
  }

  const enPrevia = (cId: string, b: number) => Boolean(hover && hover.cancha === cId && b >= hover.b && b < hover.b + n);
  const hoverMapa = hover ? mapas.get(hover.cancha) : undefined;
  const hoverValido = Boolean(hover && hoverMapa && entra(hoverMapa, dia, hover.b, duracion, ahora));

  return (
    <div ref={scroll} className="relative max-h-[min(34rem,70vh)] overflow-auto lg:max-h-[47rem] overscroll-contain rounded-2xl bg-white ring-1 ring-[#0a1b3d]/8" onMouseLeave={() => onHover(null)}>
      <table role="grid" aria-label={`Canchas y horarios del ${fechaLarga(dia)}`} aria-describedby="pc-ayuda-grilla" className="w-full min-w-[34rem] table-fixed border-separate border-spacing-0" onKeyDown={teclas}>
        <thead>
          <tr>
            <th scope="col" className="sticky top-0 left-0 z-30 w-16 bg-white px-2 py-3 text-left text-[11px] font-bold tracking-wider text-[#0a1b3d]/50 uppercase shadow-[0_1px_0_#e3e8f2]">
              Hora
            </th>
            {cols.map((c) => (
              <th key={c.id} scope="col" className="sticky top-0 z-20 bg-white px-1.5 py-2.5 text-left shadow-[0_1px_0_#e3e8f2]">
                <span className={`${display} block text-lg leading-none font-bold text-[#0a1b3d] uppercase italic`}>{c.nombre}</span>
                <span className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[#0a1b3d]/55">
                  {c.techada ? <IconoTecho width={12} height={12} /> : <IconoSol width={12} height={12} />}
                  {c.apodo ?? (c.techada ? "Techada" : "Descubierta")}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: BLOQUES }, (_, b) => {
            const t = inicioBloque(b);
            const enPunto = t % 60 === 0;
            return (
              <tr key={b}>
                <th
                  scope="row"
                  className={`sticky left-0 z-10 h-11 bg-white px-2 text-left align-top text-xs tabular-nums ${enPunto ? "pt-1 font-bold text-[#0a1b3d]" : "pt-1 text-[#0a1b3d]/40"}`}
                >
                  {hhmm(t)}
                </th>
                {cols.map((c, ci) => {
                  const mapa = mapas.get(c.id);
                  const oc = mapa?.get(b);
                  const pasado = bloquePasado(dia, b, ahora);
                  const seleccionado = Boolean(sel && sel.cancha === c.id && b >= sel.b && b < sel.b + n);
                  const primeroSel = seleccionado && sel?.b === b;
                  const previa = !oc && !pasado && !seleccionado && enPrevia(c.id, b);
                  const puede = Boolean(mapa && !oc && entra(mapa, dia, b, duracion, ahora));
                  const enfocada = foco.c === ci && foco.b === b;
                  let clase = "bg-white rounded-md ring-1 ring-inset ring-[#e6ebf4] hover:bg-[#1553d6]/8 hover:ring-[#1553d6]/40";
                  if (pasado) clase = "bg-[#f3f5f9] rounded-md cursor-not-allowed";
                  else if (oc)
                    clase =
                      oc.tipo === "tuya"
                        ? "bg-[#2e9e5b] text-white cursor-not-allowed"
                        : oc.tipo === "clase"
                          ? "bg-[#fff6d6] text-[#7a5b00] cursor-not-allowed"
                          : oc.tipo === "torneo"
                            ? "bg-[#0a1b3d] text-white cursor-not-allowed"
                            : "bg-[repeating-linear-gradient(135deg,#e9eef7_0_6px,#f3f6fb_6px_12px)] text-[#0a1b3d]/60 cursor-not-allowed";
                  else if (seleccionado) clase = "bg-[#1553d6] text-white";
                  else if (previa) clase = hoverValido ? "bg-[#1553d6]/18" : "bg-[#e0703a]/15 rounded-md";
                  else if (!puede) clase = "bg-[radial-gradient(#dfe5ef_1px,transparent_1px)] bg-[length:6px_6px] rounded-md ring-1 ring-inset ring-[#eef1f6]";
                  const esInicioOc = oc && oc.desde === b;
                  const esFinOc = oc && oc.desde + oc.largo - 1 === b;
                  const esFinSel = seleccionado && sel && sel.b + n - 1 === b;
                  const estadoTexto = pasado
                    ? "ya pasó"
                    : oc
                      ? ETIQUETAS[oc.tipo].toLowerCase()
                      : seleccionado
                        ? "elegida"
                        : puede
                          ? `libre, ${pesos(cotizar(c, dia, t, duracion).cancha)} por ${duracion} minutos`
                          : `libre, pero no entran ${duracion} minutos seguidos`;
                  return (
                    <td
                      key={c.id}
                      role="gridcell"
                      aria-selected={seleccionado}
                      className={`h-11 px-[3px] py-0 ${enPunto ? "shadow-[inset_0_1px_0_#eef1f6]" : ""}`}
                    >
                      <button
                        type="button"
                        data-celda={`${ci}-${b}`}
                        tabIndex={enfocada ? 0 : -1}
                        aria-disabled={!puede || undefined}
                        aria-label={`${c.nombre}, ${hhmm(t)}, ${estadoTexto}`}
                        onClick={() => {
                          setFoco({ c: ci, b });
                          onElegir(c, b);
                        }}
                        onMouseEnter={() => onHover({ cancha: c.id, b })}
                        onFocus={() => setFoco({ c: ci, b })}
                        className={`group relative flex h-full w-full scroll-mt-14 scroll-ml-16 items-center px-2 text-left text-xs font-semibold transition-colors focus-visible:z-10 focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-[#d8f03c] ${clase} ${
                          (oc && esInicioOc) || primeroSel ? "rounded-t-lg" : ""
                        } ${(oc && esFinOc) || esFinSel ? "rounded-b-lg" : ""}`}
                      >
                        {oc && esInicioOc ? (
                          <span className="truncate">{ETIQUETAS[oc.tipo]}</span>
                        ) : primeroSel ? (
                          <span className="flex items-center gap-1 truncate">
                            <IconoCheck width={13} height={13} grosor={3} /> {hhmm(t)}–{hhmm(t + duracion)}
                          </span>
                        ) : !oc && !pasado && !seleccionado && puede ? (
                          <span className="mx-auto hidden text-[#1553d6] group-hover:block" aria-hidden="true">
                            <IconoMas width={14} height={14} grosor={2.5} />
                          </span>
                        ) : null}
                      </button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Leyenda() {
  const items: [string, string][] = [
    ["bg-white ring-1 ring-[#0a1b3d]/15", "Libre"],
    ["bg-[#1553d6]", "Tu selección"],
    ["bg-[repeating-linear-gradient(135deg,#dfe6f2_0_3px,#f3f6fb_3px_6px)] ring-1 ring-[#0a1b3d]/10", "Reservada"],
    ["bg-[#fff6d6] ring-1 ring-[#e8d8a0]", "Clase"],
    ["bg-[#0a1b3d]", "Torneo"],
    ["bg-[#2e9e5b]", "Tus reservas"],
  ];
  return (
    <div className="mt-3">
      <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#0a1b3d]/70">
        {items.map(([c, t]) => (
          <li key={t} className="flex items-center gap-1.5">
            <span className={`size-3 rounded ${c}`} aria-hidden="true" /> {t}
          </li>
        ))}
      </ul>
      <p id="pc-ayuda-grilla" className="mt-2 text-xs text-[#0a1b3d]/50">
        Con teclado: flechas para moverte por la grilla y Enter para elegir el horario de inicio.
      </p>
    </div>
  );
}

function Companeros({
  dia,
  inicio,
  faltan,
  setFaltan,
  nivel,
  setNivel,
  invitados,
  alternar,
}: {
  dia: DiaISO;
  inicio: number;
  faltan: number;
  setFaltan: (n: number) => void;
  nivel: string;
  setNivel: (n: string) => void;
  invitados: string[];
  alternar: (id: string, nombre: string) => void;
}) {
  const todos = jugadoresDisponibles(dia, inicio);
  const lista = todos.filter((j) => nivel === "Todos" || j.categoria === nivel);
  return (
    <div className="border-t border-[#0a1b3d]/8 p-3">
      <div className="grid grid-cols-2 gap-2">
        <label className="grid gap-1 text-xs font-semibold">
          Me faltan
          <select value={faltan} onChange={(e) => setFaltan(Number(e.target.value))} className="rounded-lg border-2 border-[#0a1b3d]/10 bg-[#f4f7fc] px-2 py-2 text-sm focus:border-[#1553d6] focus:outline-none">
            <option value={1}>1 jugador</option>
            <option value={2}>2 jugadores</option>
            <option value={3}>3 jugadores</option>
          </select>
        </label>
        <label className="grid gap-1 text-xs font-semibold">
          Categoría
          <select value={nivel} onChange={(e) => setNivel(e.target.value)} className="rounded-lg border-2 border-[#0a1b3d]/10 bg-[#f4f7fc] px-2 py-2 text-sm focus:border-[#1553d6] focus:outline-none">
            {["Todos", "4ta", "5ta", "6ta", "7ma", "Principiante"].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="mt-3 text-xs text-[#0a1b3d]/60">
        {lista.length} {lista.length === 1 ? "jugador busca" : "jugadores buscan"} partido a esa hora · invitados {invitados.length}/{faltan}
      </p>
      <ul className="mt-2 grid max-h-56 gap-1.5 overflow-auto pr-1">
        {lista.length === 0 ? <li className="rounded-lg bg-[#f4f7fc] p-3 text-sm">No hay nadie de esa categoría ahora. Probá con “Todos”.</li> : null}
        {lista.map((j) => {
          const inv = invitados.includes(j.id);
          const lleno = !inv && invitados.length >= faltan;
          return (
            <li key={j.id} className="flex items-center gap-3 rounded-lg bg-[#f4f7fc] p-2">
              <span className="grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white" style={{ background: j.color }} aria-hidden="true">
                {j.nombre.slice(0, 2).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1 text-sm leading-tight">
                <span className="block font-semibold">{j.nombre}</span>
                <span className="text-xs text-[#0a1b3d]/60">
                  {j.categoria} · {j.lado} · {j.partidos} partidos
                </span>
              </span>
              <button
                type="button"
                aria-pressed={inv}
                disabled={lleno}
                onClick={() => alternar(j.id, j.nombre)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-[#1553d6] ${
                  inv ? "bg-[#2e9e5b] text-white" : "bg-white text-[#1553d6] ring-1 ring-[#1553d6]/30 hover:ring-[#1553d6]"
                }`}
              >
                {inv ? "Invitado" : "Invitar"}
                <span className="sr-only"> a {j.nombre}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
