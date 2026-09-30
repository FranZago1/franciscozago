"use client";

import { useId, useRef, useState } from "react";
import { esperar } from "../shared/formato";
import { Icono } from "../shared/Icono";
import { clasePorId, clases, coachPorId, diaPorId, dias, disciplinaPorId, disciplinas, type DiaId, type DisciplinaId } from "./datos";
import { useReserva } from "./Reserva";

const display = "[font-family:var(--font-fn-display)]";

type Campo = "nombre" | "whatsapp" | "email" | "disciplina" | "dia" | "clase" | "nivel" | "acepto";
type Errores = Partial<Record<Campo, string>>;

const niveles = [
  { id: "cero", label: "Arranco de cero" },
  { id: "aveces", label: "Entreno a veces" },
  { id: "seguido", label: "Entreno seguido" },
] as const;

const inputBase =
  "mt-2 block w-full border-0 border-b-2 bg-transparent px-0 py-3 text-lg text-[#F2EEE6] placeholder:text-white/30 transition-colors focus:outline-none focus-visible:outline-none";

function Pildora({
  name,
  value,
  checked,
  disabled,
  onChange,
  children,
  invalid,
}: {
  name: string;
  value: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  children: React.ReactNode;
  invalid?: boolean;
}) {
  return (
    <label
      className={`relative inline-flex cursor-pointer items-center gap-2 border px-4 py-2.5 text-sm font-semibold tracking-wide uppercase transition-colors select-none has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#FF4D00] ${
        checked
          ? "border-[#FF4D00] bg-[#FF4D00] text-black"
          : disabled
            ? "cursor-not-allowed border-white/10 text-white/25 line-through"
            : `${invalid ? "border-[#FF6A2B]/60" : "border-white/20"} text-[#F2EEE6] hover:border-white/50`
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
      />
      {children}
    </label>
  );
}

export function FormularioPrueba() {
  const { disciplina, dia, claseId, setDisciplina, setDia, setClaseId } = useReserva();
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [nivel, setNivel] = useState("");
  const [acepto, setAcepto] = useState(false);
  const [errores, setErrores] = useState<Errores>({});
  const [estado, setEstado] = useState<"idle" | "enviando" | "listo" | "error">("idle");
  const resumenRef = useRef<HTMLDivElement>(null);
  const exitoRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const id = (c: string) => `${uid}-${c}`;

  const opcionesHorario = disciplina && dia ? clases.filter((c) => c.disciplina === disciplina && c.dia === dia) : [];

  function validar(): Errores {
    const e: Errores = {};
    if (nombre.trim().length < 3) e.nombre = "Escribí tu nombre y apellido.";
    const digitos = whatsapp.replace(/\D/g, "");
    if (!digitos) e.whatsapp = "Necesitamos un WhatsApp para confirmarte la clase.";
    else if (digitos.length < 10 || digitos.length > 13) e.whatsapp = "Revisá el número: con característica, sin 0 ni 15 (ej. 351 555 0142).";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = "Ese email no parece válido.";
    if (!disciplina) e.disciplina = "Elegí una disciplina.";
    if (!dia) e.dia = "Elegí un día.";
    if (!claseId) e.clase = disciplina && dia ? "Elegí un horario." : "Elegí disciplina y día para ver los horarios.";
    if (!nivel) e.nivel = "Contanos cómo venís entrenando.";
    if (!acepto) e.acepto = "Necesitamos tu OK para escribirte.";
    return e;
  }

  async function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validar();
    setErrores(e);
    if (Object.keys(e).length) {
      setEstado("error");
      requestAnimationFrame(() => resumenRef.current?.focus());
      return;
    }
    setEstado("enviando");
    await esperar(1300);
    setEstado("listo");
    requestAnimationFrame(() => exitoRef.current?.focus());
  }

  function reiniciar() {
    setNombre("");
    setWhatsapp("");
    setEmail("");
    setNivel("");
    setAcepto(false);
    setDisciplina("");
    setDia("");
    setClaseId("");
    setErrores({});
    setEstado("idle");
  }

  // Al corregir un campo, su error desaparece.
  const limpiar = (c: Campo) => errores[c] && setErrores((prev) => ({ ...prev, [c]: undefined }));

  const clase = claseId ? clasePorId[claseId] : undefined;

  if (estado === "listo" && clase) {
    const disc = disciplinaPorId[clase.disciplina];
    return (
      <div ref={exitoRef} tabIndex={-1} className="min-w-0 outline-none" aria-live="polite">
        <div className="relative overflow-hidden bg-[#FF4D00] text-black">
          <div className="flex items-center justify-between border-b-2 border-dashed border-black/30 px-6 py-4 sm:px-8">
            <span className="text-xs font-bold tracking-[0.25em] uppercase">Pase de prueba</span>
            <span className="text-xs font-bold tracking-[0.25em] uppercase">N.º FN-{clase.id.toUpperCase().replace("-", "")}</span>
          </div>
          <div className="grid grid-cols-1 gap-6 px-6 py-8 sm:grid-cols-[1fr_auto] sm:px-8">
            <div>
              <p className="text-sm font-semibold">¡Listo, {nombre.trim().split(" ")[0]}! Tu lugar está guardado.</p>
              <p className={`${display} mt-2 text-[clamp(2.6rem,8vw,4.5rem)] leading-[0.9] uppercase`}>
                {diaPorId[clase.dia].largo}
                <br />
                {clase.hora} hs
              </p>
              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <dt className="text-xs font-bold tracking-widest text-black/60 uppercase">Clase</dt>
                  <dd className="font-semibold">{disc.nombre}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold tracking-widest text-black/60 uppercase">Coach</dt>
                  <dd className="font-semibold">{coachPorId[clase.coach].nombre}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs font-bold tracking-widest text-black/60 uppercase">Dónde</dt>
                  <dd className="font-semibold">Pasaje Los Algarrobos 1180, Barrio Norte. Llegá 10 minutos antes.</dd>
                </div>
              </dl>
            </div>
            <div aria-hidden="true" className="hidden h-full w-16 bg-[repeating-linear-gradient(90deg,#000_0_3px,transparent_3px_5px,#000_5px_6px,transparent_6px_10px)] opacity-80 sm:block" />
          </div>
        </div>
        <p className="mt-5 flex items-start gap-3 border border-white/15 p-4 text-sm text-white/70">
          <Icono nombre="info" className="mt-0.5 size-5 shrink-0 text-[#FF6A2B]" grosor={2.2} />
          <span>
            <strong className="text-[#F2EEE6]">Esto es una demo.</strong> No se envió ningún dato ni se reservó nada: así
            vería la confirmación una persona que reserva en tu sitio.
          </span>
        </p>
        <button
          type="button"
          onClick={reiniciar}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-[#F2EEE6] uppercase underline underline-offset-4 hover:text-[#FF6A2B]"
        >
          Reservar otra clase
        </button>
      </div>
    );
  }

  const listaErrores = (Object.entries(errores) as [Campo, string | undefined][]).filter(([, v]) => v);
  const enviando = estado === "enviando";
  const borde = (c: Campo) => (errores[c] ? "border-[#FF6A2B]" : "border-white/25 focus:border-[#FF4D00]");

  return (
    <form onSubmit={enviar} noValidate aria-describedby={id("aviso")} className="space-y-9">
      {estado === "error" && listaErrores.length > 0 && (
        <div ref={resumenRef} tabIndex={-1} role="alert" className="border-l-4 border-[#FF6A2B] bg-[#FF4D00]/10 p-5 outline-none">
          <p className="font-semibold text-[#F2EEE6]">
            Faltan {listaErrores.length === 1 ? "un dato" : `${listaErrores.length} datos`} para reservar:
          </p>
          <ul className="mt-2 list-inside list-disc text-sm text-white/75">
            {listaErrores.map(([c, m]) => (
              <li key={c}>
                <a href={`#${id(c)}`} className="underline underline-offset-2 hover:text-[#FF6A2B]">
                  {m}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={id("nombre")} className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase">
            Nombre y apellido
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
            placeholder="Cómo te llamás"
            className={`${inputBase} ${borde("nombre")}`}
          />
          {errores.nombre && (
            <p id={id("nombre-err")} className="mt-2 text-sm text-[#FF8A57]">
              {errores.nombre}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={id("whatsapp")} className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase">
            WhatsApp
          </label>
          <input
            id={id("whatsapp")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={whatsapp}
            onChange={(e) => {
              setWhatsapp(e.target.value);
              limpiar("whatsapp");
            }}
            aria-invalid={!!errores.whatsapp}
            aria-describedby={errores.whatsapp ? id("whatsapp-err") : undefined}
            placeholder="351 555 0142"
            className={`${inputBase} ${borde("whatsapp")}`}
          />
          {errores.whatsapp && (
            <p id={id("whatsapp-err")} className="mt-2 text-sm text-[#FF8A57]">
              {errores.whatsapp}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={id("email")} className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase">
            Email <span className="font-medium tracking-normal normal-case text-white/40">(opcional)</span>
          </label>
          <input
            id={id("email")}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              limpiar("email");
            }}
            aria-invalid={!!errores.email}
            aria-describedby={errores.email ? id("email-err") : undefined}
            placeholder="vos@correo.com"
            className={`${inputBase} ${borde("email")}`}
          />
          {errores.email && (
            <p id={id("email-err")} className="mt-2 text-sm text-[#FF8A57]">
              {errores.email}
            </p>
          )}
        </div>
      </div>

      <fieldset id={id("disciplina")} tabIndex={-1} className="min-w-0 outline-none" aria-describedby={errores.disciplina ? id("disciplina-err") : undefined}>
        <legend className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase">Disciplina</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {disciplinas.map((d) => (
            <Pildora
              key={d.id}
              name="disciplina"
              value={d.id}
              checked={disciplina === d.id}
              invalid={!!errores.disciplina}
              onChange={() => {
                setDisciplina(d.id as DisciplinaId);
                limpiar("disciplina");
              }}
            >
              {d.nombre}
            </Pildora>
          ))}
        </div>
        {errores.disciplina && (
          <p id={id("disciplina-err")} className="mt-2 text-sm text-[#FF8A57]">
            {errores.disciplina}
          </p>
        )}
      </fieldset>

      <fieldset id={id("dia")} tabIndex={-1} className="min-w-0 outline-none" aria-describedby={errores.dia ? id("dia-err") : undefined}>
        <legend className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase">Día</legend>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {dias.map((d) => {
            const hay = !disciplina || clases.some((c) => c.dia === d.id && c.disciplina === disciplina);
            return (
              <Pildora
                key={d.id}
                name="dia"
                value={d.id}
                checked={dia === d.id}
                disabled={!hay}
                invalid={!!errores.dia}
                onChange={() => {
                  setDia(d.id as DiaId);
                  limpiar("dia");
                }}
              >
                <span className="w-full text-center">{d.corto}</span>
              </Pildora>
            );
          })}
        </div>
        {errores.dia && (
          <p id={id("dia-err")} className="mt-2 text-sm text-[#FF8A57]">
            {errores.dia}
          </p>
        )}
      </fieldset>

      <fieldset id={id("clase")} tabIndex={-1} className="min-w-0 outline-none" aria-describedby={errores.clase ? id("clase-err") : id("clase-ayuda")}>
        <legend className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase">Horario</legend>
        {opcionesHorario.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {opcionesHorario.map((c) => (
              <Pildora
                key={c.id}
                name="clase"
                value={c.id}
                checked={claseId === c.id}
                disabled={c.libres === 0}
                invalid={!!errores.clase}
                onChange={() => {
                  setClaseId(c.id);
                  limpiar("clase");
                }}
              >
                <span className="tabular-nums">{c.hora}</span>
                <span className="font-medium normal-case opacity-75">
                  {c.libres === 0 ? "completa" : `· ${coachPorId[c.coach].nombre.split(" ")[0]}`}
                </span>
              </Pildora>
            ))}
          </div>
        ) : (
          <p id={id("clase-ayuda")} className="mt-3 border border-dashed border-white/15 px-4 py-3 text-sm text-white/50">
            {disciplina && dia ? "No hay clases de esa disciplina ese día." : "Elegí disciplina y día (o tocá una clase en la grilla) para ver los horarios."}
          </p>
        )}
        {errores.clase && (
          <p id={id("clase-err")} className="mt-2 text-sm text-[#FF8A57]">
            {errores.clase}
          </p>
        )}
      </fieldset>

      <fieldset id={id("nivel")} tabIndex={-1} className="min-w-0 outline-none" aria-describedby={errores.nivel ? id("nivel-err") : undefined}>
        <legend className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase">¿Cómo venís?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {niveles.map((n) => (
            <Pildora
              key={n.id}
              name="nivel"
              value={n.id}
              checked={nivel === n.id}
              invalid={!!errores.nivel}
              onChange={() => {
                setNivel(n.id);
                limpiar("nivel");
              }}
            >
              {n.label}
            </Pildora>
          ))}
        </div>
        {errores.nivel && (
          <p id={id("nivel-err")} className="mt-2 text-sm text-[#FF8A57]">
            {errores.nivel}
          </p>
        )}
      </fieldset>

      <div>
        <label htmlFor={id("acepto")} className="flex cursor-pointer items-start gap-3 text-sm text-white/75">
          <span className="relative mt-0.5 inline-flex">
            <input
              id={id("acepto")}
              type="checkbox"
              checked={acepto}
              onChange={(e) => {
                setAcepto(e.target.checked);
                limpiar("acepto");
              }}
              aria-invalid={!!errores.acepto}
              aria-describedby={errores.acepto ? id("acepto-err") : undefined}
              className={`peer size-5 cursor-pointer appearance-none border-2 bg-transparent checked:border-[#FF4D00] checked:bg-[#FF4D00] ${
                errores.acepto ? "border-[#FF6A2B]" : "border-white/40"
              }`}
            />
            <Icono nombre="check" grosor={3.5} cuadrado className="pointer-events-none absolute inset-0.5 size-4 text-black opacity-0 peer-checked:opacity-100" />
          </span>
          Acepto que me escriban por WhatsApp para confirmar la clase. Nada de spam, prometido.
        </label>
        {errores.acepto && (
          <p id={id("acepto-err")} className="mt-2 text-sm text-[#FF8A57]">
            {errores.acepto}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={enviando}
          className="group inline-flex shrink-0 items-center justify-center gap-3 bg-[#FF4D00] px-6 py-5 text-[15px] font-bold tracking-wide whitespace-nowrap text-black uppercase sm:px-8 sm:text-base transition-[background-color,transform] duration-200 hover:bg-[#FF6A2B] active:scale-[0.98] disabled:cursor-wait disabled:opacity-80"
        >
          {enviando ? (
            <>
              <span aria-hidden="true" className="size-5 animate-spin rounded-full border-[3px] border-black/25 border-t-black motion-reduce:animate-none" />
              Reservando…
            </>
          ) : (
            <>
              Reservá tu clase de prueba
              <Icono nombre="flecha" grosor={2.6} cuadrado className="size-5 transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
        </button>
        <p id={id("aviso")} className="text-xs text-white/45">
          Demo: el formulario valida y simula el envío, pero no manda datos a ningún lado.
        </p>
      </div>
      <p className="sr-only" aria-live="polite">
        {enviando ? "Enviando la reserva…" : ""}
      </p>
    </form>
  );
}
