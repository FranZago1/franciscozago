"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { esperar, precioARS } from "../shared/formato";
import { Icono } from "../shared/Icono";
import { categorias, tratamientoPorId, tratamientos } from "./datos";
import { useTurno } from "./Turno";

const serif = "[font-family:var(--font-ac-serif)]";

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const DIAS_CORTOS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

type Fecha = { iso: string; dia: number; num: number; mes: number };

/** Próximos 12 días hábiles (lunes a sábado), empezando mañana. */
function proximosDias(): Fecha[] {
  const out: Fecha[] = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  while (out.length < 12) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) continue;
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    out.push({ iso, dia: d.getDay(), num: d.getDate(), mes: d.getMonth() });
  }
  return out;
}

/** Horarios del día. La disponibilidad es pseudoaleatoria pero estable para cada fecha. */
function horariosDe(f: Fecha) {
  const horas = f.dia === 6 ? ["09:00", "10:30", "12:00", "13:30"] : ["09:00", "10:30", "12:00", "14:30", "16:00", "17:30", "19:00"];
  let h = [...f.iso].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);
  return horas.map((hora) => {
    h = (h * 1103515245 + 12345) >>> 0;
    return { hora, libre: h % 10 > 2 };
  });
}

const fechaLarga = (f: Fecha) => `${DIAS[f.dia]} ${f.num} de ${MESES[f.mes]}`;

type Campo = "servicio" | "fecha" | "hora" | "nombre" | "telefono";

const input =
  "mt-2 block w-full rounded-2xl border bg-white/70 px-4 py-3.5 text-[#26302A] placeholder:text-[#3E4C43]/40 transition-colors focus:bg-white focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6E5D84]";

export function FormularioTurno() {
  const { servicio, setServicio } = useTurno();
  const [fechas, setFechas] = useState<Fecha[]>([]);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nota, setNota] = useState("");
  const [primera, setPrimera] = useState(true);
  const [errores, setErrores] = useState<Partial<Record<Campo, string>>>({});
  const [estado, setEstado] = useState<"idle" | "enviando" | "listo" | "error">("idle");
  const resumen = useRef<HTMLDivElement>(null);
  const exito = useRef<HTMLDivElement>(null);
  const uid = useId();
  const id = (c: string) => `${uid}-${c}`;

  // Las fechas dependen del día de hoy: se calculan en el cliente para no desincronizar el HTML del servidor.
  useEffect(() => setFechas(proximosDias()), []);

  const f = fechas.find((x) => x.iso === fecha);
  const horarios = useMemo(() => (f ? horariosDe(f) : []), [f]);
  const t = servicio ? tratamientoPorId[servicio] : undefined;

  const limpiar = (c: Campo) => errores[c] && setErrores((p) => ({ ...p, [c]: undefined }));

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const err: Partial<Record<Campo, string>> = {};
    if (!servicio) err.servicio = "Elegí un tratamiento.";
    if (!fecha) err.fecha = "Elegí un día.";
    if (!hora) err.hora = fecha ? "Elegí un horario." : "Primero elegí un día para ver los horarios.";
    if (nombre.trim().length < 3) err.nombre = "Contanos tu nombre.";
    const dig = telefono.replace(/\D/g, "");
    if (dig.length < 10 || dig.length > 13) err.telefono = "Dejanos un celular con característica (ej. 351 555 0199).";
    setErrores(err);
    if (Object.keys(err).length) {
      setEstado("error");
      requestAnimationFrame(() => resumen.current?.focus());
      return;
    }
    setEstado("enviando");
    await esperar(1400);
    setEstado("listo");
    requestAnimationFrame(() => exito.current?.focus());
  }

  function descargarIcs() {
    if (!f || !t) return;
    const [hh, mm] = hora.split(":").map(Number) as [number, number];
    const inicio = new Date(`${f.iso}T${hora}:00`);
    const fin = new Date(inicio.getTime() + t.minutos * 60000);
    const fmt = (d: Date) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}00`;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Alma Clara demo//ES",
      "BEGIN:VEVENT",
      `UID:${f.iso}-${hh}${mm}@almaclara.demo`,
      `DTSTART:${fmt(inicio)}`,
      `DTEND:${fmt(fin)}`,
      `SUMMARY:${t.nombre} · Alma Clara (demo)`,
      "LOCATION:Calle de los Tilos 245, Nueva Córdoba",
      "DESCRIPTION:Turno de demostración. Contenido ficticio.",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "turno-alma-clara.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (estado === "listo" && f && t) {
    return (
      <div ref={exito} tabIndex={-1} aria-live="polite" className="rounded-[32px] bg-[#3E4C43] p-8 text-[#F6F4EE] outline-none sm:p-12">
        <span className="flex size-14 items-center justify-center rounded-full bg-[#F6F4EE] text-[#3E4C43]">
          <Icono nombre="check" grosor={1.5} className="size-7" />
        </span>
        <h3 className={`${serif} mt-8 text-[clamp(2rem,4vw,2.9rem)] leading-tight font-light`}>
          Listo, {nombre.trim().split(" ")[0]}. <em className="text-[#C3B6CF]">Te esperamos.</em>
        </h3>
        <dl className="mt-8 grid grid-cols-1 gap-5 border-t border-[#F6F4EE]/15 pt-8 sm:grid-cols-3">
          <div>
            <dt className="text-xs tracking-[0.18em] text-[#F6F4EE]/55 uppercase">Tratamiento</dt>
            <dd className="mt-1">{t.nombre}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-[0.18em] text-[#F6F4EE]/55 uppercase">Cuándo</dt>
            <dd className="mt-1 first-letter:uppercase">
              {fechaLarga(f)}, {hora} h
            </dd>
          </div>
          <div>
            <dt className="text-xs tracking-[0.18em] text-[#F6F4EE]/55 uppercase">Dónde</dt>
            <dd className="mt-1">Calle de los Tilos 245</dd>
          </div>
        </dl>
        <div className="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={descargarIcs}
            className="inline-flex items-center gap-2 rounded-full bg-[#F6F4EE] px-5 py-3 text-sm text-[#26302A] transition-colors hover:bg-white"
          >
            <Icono nombre="calendario" grosor={1.4} className="size-4" />
            Agregar a mi calendario
          </button>
          <button
            type="button"
            onClick={() => {
              setEstado("idle");
              setHora("");
              setFecha("");
              setServicio("");
            }}
            className="rounded-full px-5 py-3 text-sm text-[#F6F4EE]/80 underline underline-offset-4 hover:text-[#F6F4EE]"
          >
            Pedir otro turno
          </button>
        </div>
        <p className="mt-8 rounded-2xl bg-[#F6F4EE]/[0.08] px-5 py-4 text-sm leading-relaxed text-[#F6F4EE]/75">
          <strong className="font-medium text-[#F6F4EE]">Esto es una demo.</strong> No se reservó ningún turno ni se envió
          información: así vería la confirmación una clienta en tu sitio.
        </p>
      </div>
    );
  }

  const listaErrores = Object.entries(errores).filter(([, v]) => v) as [Campo, string][];
  const borde = (c: Campo) => (errores[c] ? "border-[#B4534B]" : "border-[#3E4C43]/15 focus:border-[#3E4C43]/50");
  const enviando = estado === "enviando";

  return (
    <form onSubmit={enviar} noValidate className="space-y-8">
      {estado === "error" && listaErrores.length > 0 && (
        <div ref={resumen} tabIndex={-1} role="alert" className="rounded-2xl bg-[#F4E4E1] px-5 py-4 text-[#7A2E27] outline-none">
          <p className="font-medium">Revisá estos datos antes de confirmar:</p>
          <ul className="mt-2 list-inside list-disc text-sm">
            {listaErrores.map(([c, m]) => (
              <li key={c}>
                <a href={`#${c === "servicio" ? "ac-servicio" : id(c)}`} className="underline underline-offset-2">
                  {m}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label htmlFor="ac-servicio" className="text-sm text-[#3E4C43]">
          Tratamiento
        </label>
        <div className="relative">
          <select
            id="ac-servicio"
            value={servicio}
            onChange={(e) => {
              setServicio(e.target.value);
              limpiar("servicio");
            }}
            aria-invalid={!!errores.servicio}
            aria-describedby={errores.servicio ? id("servicio-err") : undefined}
            className={`${input} ${borde("servicio")} appearance-none pr-12`}
          >
            <option value="">Elegí un tratamiento</option>
            {categorias.map((c) => (
              <optgroup key={c.id} label={c.nombre}>
                {tratamientos
                  .filter((x) => x.categoria === c.id)
                  .map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.nombre} · {x.minutos} min
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="pointer-events-none absolute top-1/2 right-5 mt-1 size-4 -translate-y-1/2 text-[#3E4C43]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        {errores.servicio ? (
          <p id={id("servicio-err")} className="mt-2 text-sm text-[#9A3F37]">
            {errores.servicio}
          </p>
        ) : (
          t && (
            <p className="mt-2 text-sm text-[#3E4C43]/65">
              {t.minutos} minutos · {precioARS(t.precio)} · se abona en el centro
            </p>
          )
        )}
      </div>

      <fieldset id={id("fecha")} tabIndex={-1} className="min-w-0 outline-none">
        <legend className="text-sm text-[#3E4C43]">Día</legend>
        <div className="-mx-1 mt-3 flex snap-x gap-2 overflow-x-auto px-1 pb-2 [mask-image:linear-gradient(to_right,black_82%,transparent)] [scrollbar-width:thin]">
          {fechas.length === 0
            ? Array.from({ length: 7 }, (_, n) => <span key={n} className="h-[76px] w-16 shrink-0 animate-pulse rounded-2xl bg-[#3E4C43]/[0.06]" />)
            : fechas.map((x) => {
                const activo = fecha === x.iso;
                return (
                  <label
                    key={x.iso}
                    className={`relative flex w-16 shrink-0 cursor-pointer snap-start flex-col items-center rounded-2xl border py-2.5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#6E5D84] ${
                      activo
                        ? "border-[#3E4C43] bg-[#3E4C43] text-[#F6F4EE]"
                        : `${errores.fecha ? "border-[#B4534B]/60" : "border-[#3E4C43]/15"} bg-white/60 text-[#26302A] hover:border-[#3E4C43]/45`
                    }`}
                  >
                    <input
                      type="radio"
                      name="ac-fecha"
                      value={x.iso}
                      checked={activo}
                      onChange={() => {
                        setFecha(x.iso);
                        setHora("");
                        limpiar("fecha");
                      }}
                      aria-label={fechaLarga(x)}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <span className={`text-xs uppercase ${activo ? "text-[#F6F4EE]/70" : "text-[#3E4C43]/60"}`}>{DIAS_CORTOS[x.dia]}</span>
                    <span className={`${serif} text-2xl leading-tight`}>{x.num}</span>
                    <span className={`text-[11px] ${activo ? "text-[#F6F4EE]/70" : "text-[#3E4C43]/50"}`}>{MESES[x.mes]!.slice(0, 3)}</span>
                  </label>
                );
              })}
        </div>
        {errores.fecha && <p className="mt-1 text-sm text-[#9A3F37]">{errores.fecha}</p>}
      </fieldset>

      <fieldset id={id("hora")} tabIndex={-1} className="min-w-0 outline-none">
        <legend className="text-sm text-[#3E4C43]">Horario</legend>
        {f ? (
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {horarios.map((h) => {
              const activo = hora === h.hora;
              return (
                <label
                  key={h.hora}
                  className={`relative rounded-full border py-2.5 text-center text-sm tabular-nums transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#6E5D84] ${
                    !h.libre
                      ? "cursor-not-allowed border-transparent bg-[#3E4C43]/[0.04] text-[#3E4C43]/35 line-through"
                      : activo
                        ? "cursor-pointer border-[#8F7FA3] bg-[#E9E3EF] text-[#4A3D5C]"
                        : `cursor-pointer ${errores.hora ? "border-[#B4534B]/60" : "border-[#3E4C43]/15"} bg-white/60 text-[#26302A] hover:border-[#3E4C43]/45`
                  }`}
                >
                  <input
                    type="radio"
                    name="ac-hora"
                    value={h.hora}
                    checked={activo}
                    disabled={!h.libre}
                    onChange={() => {
                      setHora(h.hora);
                      limpiar("hora");
                    }}
                    aria-label={h.libre ? `${h.hora} h` : `${h.hora} h, ocupado`}
                    className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
                  />
                  {h.hora}
                </label>
              );
            })}
          </div>
        ) : (
          <p className="mt-3 rounded-2xl border border-dashed border-[#3E4C43]/20 px-4 py-3 text-sm text-[#3E4C43]/60">
            Elegí un día para ver los horarios libres.
          </p>
        )}
        {errores.hora && <p className="mt-2 text-sm text-[#9A3F37]">{errores.hora}</p>}
      </fieldset>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={id("nombre")} className="text-sm text-[#3E4C43]">
            Nombre
          </label>
          <input
            id={id("nombre")}
            autoComplete="name"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              limpiar("nombre");
            }}
            aria-invalid={!!errores.nombre}
            aria-describedby={errores.nombre ? id("nombre-err") : undefined}
            className={`${input} ${borde("nombre")}`}
            placeholder="Tu nombre"
          />
          {errores.nombre && (
            <p id={id("nombre-err")} className="mt-2 text-sm text-[#9A3F37]">
              {errores.nombre}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={id("telefono")} className="text-sm text-[#3E4C43]">
            Celular
          </label>
          <input
            id={id("telefono")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={telefono}
            onChange={(e) => {
              setTelefono(e.target.value);
              limpiar("telefono");
            }}
            aria-invalid={!!errores.telefono}
            aria-describedby={errores.telefono ? id("telefono-err") : undefined}
            className={`${input} ${borde("telefono")}`}
            placeholder="351 555 0199"
          />
          {errores.telefono && (
            <p id={id("telefono-err")} className="mt-2 text-sm text-[#9A3F37]">
              {errores.telefono}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor={id("nota")} className="text-sm text-[#3E4C43]">
          ¿Algo que debamos saber? <span className="text-[#3E4C43]/50">(opcional)</span>
        </label>
        <textarea
          id={id("nota")}
          rows={3}
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          className={`${input} border-[#3E4C43]/15 focus:border-[#3E4C43]/50 resize-none`}
          placeholder="Alergias, embarazo, medicación, preferencias…"
        />
      </div>

      <label className="flex cursor-pointer items-center gap-3 text-[15px] text-[#26302A]">
        <span className="relative inline-flex h-6 w-11 shrink-0">
          <input type="checkbox" checked={primera} onChange={(e) => setPrimera(e.target.checked)} className="peer absolute inset-0 cursor-pointer opacity-0" />
          <span className="absolute inset-0 rounded-full bg-[#3E4C43]/20 transition-colors peer-checked:bg-[#7F8F7A] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#6E5D84]" />
          <span className="absolute top-1 left-1 size-4 rounded-full bg-white shadow transition-transform duration-300 peer-checked:translate-x-5" />
        </span>
        Es mi primera visita (incluye consulta sin cargo)
      </label>

      <div className="flex flex-col gap-4 border-t border-[#3E4C43]/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#3E4C43]/60">Demo: no se envía nada, solo se simula la confirmación.</p>
        <button
          type="submit"
          disabled={enviando}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3E4C43] px-7 py-4 text-[#F6F4EE] transition-[background-color,transform] duration-300 hover:bg-[#26302A] active:scale-[0.98] disabled:cursor-wait disabled:opacity-80"
        >
          {enviando ? (
            <>
              <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-[#F6F4EE]/30 border-t-[#F6F4EE] motion-reduce:animate-none" />
              Confirmando…
            </>
          ) : (
            <>
              Confirmar turno
              <Icono nombre="flecha" grosor={1.4} className="size-4" />
            </>
          )}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {enviando ? "Confirmando tu turno…" : ""}
      </p>
    </form>
  );
}
