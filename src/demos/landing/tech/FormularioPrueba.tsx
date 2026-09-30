"use client";

import { useId, useRef, useState } from "react";
import { esperar } from "../shared/formato";
import { Icono } from "../shared/Icono";

const mono = "[font-family:var(--font-cc-mono)]";

/** Valida el dígito verificador de un CUIT/CUIL (módulo 11). */
function cuitValido(cuit: string) {
  const d = cuit.replace(/\D/g, "");
  if (d.length !== 11) return false;
  const pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const suma = pesos.reduce((acc, p, i) => acc + p * Number(d[i]), 0);
  let dv = 11 - (suma % 11);
  if (dv === 11) dv = 0;
  if (dv === 10) dv = 9;
  return dv === Number(d[10]);
}

/** Da formato 20-12345678-3 mientras se escribe. */
function formatoCuit(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 10) return `${d.slice(0, 2)}-${d.slice(2)}`;
  return `${d.slice(0, 2)}-${d.slice(2, 10)}-${d.slice(10)}`;
}

const perfiles = ["Monotributista", "Responsable inscripto", "Estudio contable"] as const;
type Campo = "nombre" | "email" | "perfil" | "cuit" | "acepto";

export function FormularioPrueba() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [perfil, setPerfil] = useState("");
  const [cuit, setCuit] = useState("");
  const [acepto, setAcepto] = useState(false);
  const [errores, setErrores] = useState<Partial<Record<Campo, string>>>({});
  const [estado, setEstado] = useState<"idle" | "enviando" | "listo" | "error">("idle");
  const uid = useId();
  const id = (c: string) => `${uid}-${c}`;
  const resumen = useRef<HTMLDivElement>(null);
  const exito = useRef<HTMLDivElement>(null);

  const limpiar = (c: Campo) => errores[c] && setErrores((p) => ({ ...p, [c]: undefined }));

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const err: Partial<Record<Campo, string>> = {};
    if (nombre.trim().length < 2) err.nombre = "Ingresá tu nombre.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) err.email = "Ingresá un email válido.";
    if (!perfil) err.perfil = "Elegí cómo facturás.";
    if (cuit && !cuitValido(cuit)) err.cuit = "El CUIT no es válido: revisá el dígito verificador.";
    if (!acepto) err.acepto = "Tenés que aceptar los términos para crear la cuenta.";
    setErrores(err);
    if (Object.keys(err).length) {
      setEstado("error");
      requestAnimationFrame(() => resumen.current?.focus());
      return;
    }
    setEstado("enviando");
    await esperar(1500);
    setEstado("listo");
    requestAnimationFrame(() => exito.current?.focus());
  }

  const input =
    "mt-2 block w-full rounded-xl border-0 bg-white/[0.06] px-4 py-3 text-white ring-1 ring-inset placeholder:text-indigo-200/40 transition-shadow focus:bg-white/[0.09] focus:outline-none focus:ring-2 focus:ring-[#A5B4FC]";
  const anillo = (c: Campo) => (errores[c] ? "ring-rose-400" : "ring-white/15");

  if (estado === "listo") {
    return (
      <div ref={exito} tabIndex={-1} aria-live="polite" className="rounded-2xl bg-white p-7 text-slate-900 outline-none sm:p-9">
        <span className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Icono nombre="check" grosor={2.4} className="size-6" />
        </span>
        <h3 className="mt-6 text-2xl font-semibold tracking-tight">¡Tu prueba está lista, {nombre.trim().split(" ")[0]}!</h3>
        <p className="mt-2 text-slate-600">
          Te mandamos un link de acceso a <span className={`${mono} text-[15px] text-slate-900`}>{email}</span>. Tenés 14 días del plan Monotributo, sin tarjeta.
        </p>
        <ol className="mt-6 space-y-2.5 text-[15px] text-slate-700">
          {["Abrí el link del email", "Conectá tu CUIT con clave fiscal", "Emití tu primera factura"].map((p, i) => (
            <li key={p} className="flex items-center gap-3">
              <span className={`${mono} flex size-6 items-center justify-center rounded-full bg-indigo-50 text-xs text-[#4F46E5]`}>{i + 1}</span>
              {p}
            </li>
          ))}
        </ol>
        <p className="mt-7 flex items-start gap-2.5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 ring-1 ring-slate-200">
          <Icono nombre="info" grosor={1.8} className="mt-0.5 size-4 shrink-0 text-slate-400" />
          <span>
            <strong className="font-medium text-slate-900">Esto es una demo.</strong> No se creó ninguna cuenta ni se envió ningún email.
          </span>
        </p>
        <button
          type="button"
          onClick={() => {
            setEstado("idle");
            setNombre("");
            setEmail("");
            setPerfil("");
            setCuit("");
            setAcepto(false);
          }}
          className="mt-6 text-sm font-medium text-[#4F46E5] underline-offset-4 hover:underline"
        >
          Volver al formulario
        </button>
      </div>
    );
  }

  const listaErrores = Object.entries(errores).filter(([, v]) => v) as [Campo, string][];
  const enviando = estado === "enviando";

  return (
    <form onSubmit={enviar} noValidate className="space-y-5 rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10 backdrop-blur-sm sm:p-8">
      {estado === "error" && listaErrores.length > 0 && (
        <div ref={resumen} tabIndex={-1} role="alert" className="rounded-xl bg-rose-500/15 px-4 py-3 text-sm text-rose-100 ring-1 ring-rose-400/30 outline-none">
          <p className="font-medium text-white">Revisá {listaErrores.length === 1 ? "este dato" : `estos ${listaErrores.length} datos`}:</p>
          <ul className="mt-1.5 list-inside list-disc">
            {listaErrores.map(([c, m]) => (
              <li key={c}>
                <a href={`#${id(c)}`} className="underline underline-offset-2">
                  {m}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={id("nombre")} className="text-sm font-medium text-indigo-100">
            Nombre
          </label>
          <input
            id={id("nombre")}
            autoComplete="given-name"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              limpiar("nombre");
            }}
            aria-invalid={!!errores.nombre}
            aria-describedby={errores.nombre ? id("nombre-e") : undefined}
            placeholder="Sofía"
            className={`${input} ${anillo("nombre")}`}
          />
          {errores.nombre && (
            <p id={id("nombre-e")} className="mt-1.5 text-sm text-rose-300">
              {errores.nombre}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={id("email")} className="text-sm font-medium text-indigo-100">
            Email de trabajo
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
            aria-describedby={errores.email ? id("email-e") : undefined}
            placeholder="sofia@estudio.com"
            className={`${input} ${anillo("email")}`}
          />
          {errores.email && (
            <p id={id("email-e")} className="mt-1.5 text-sm text-rose-300">
              {errores.email}
            </p>
          )}
        </div>
      </div>

      <fieldset id={id("perfil")} tabIndex={-1} className="min-w-0 outline-none">
        <legend className="text-sm font-medium text-indigo-100">¿Cómo facturás?</legend>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {perfiles.map((p) => {
            const sel = perfil === p;
            return (
              <label
                key={p}
                className={`relative flex cursor-pointer items-center gap-2.5 rounded-xl px-3.5 py-3 text-sm ring-1 ring-inset transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#A5B4FC] ${
                  sel ? "bg-white text-slate-900 ring-white" : `${errores.perfil ? "ring-rose-400" : "ring-white/15"} text-indigo-100 hover:bg-white/[0.06]`
                }`}
              >
                <input
                  type="radio"
                  name="cc-perfil"
                  value={p}
                  checked={sel}
                  onChange={() => {
                    setPerfil(p);
                    limpiar("perfil");
                  }}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <span className={`flex size-4 shrink-0 items-center justify-center rounded-full ring-1 ${sel ? "bg-[#4F46E5] ring-[#4F46E5]" : "ring-white/40"}`}>
                  {sel && <span className="size-1.5 rounded-full bg-white" />}
                </span>
                {p}
              </label>
            );
          })}
        </div>
        {errores.perfil && <p className="mt-1.5 text-sm text-rose-300">{errores.perfil}</p>}
      </fieldset>

      <div>
        <label htmlFor={id("cuit")} className="text-sm font-medium text-indigo-100">
          CUIT <span className="font-normal text-indigo-200/60">(opcional, para dejar todo listo)</span>
        </label>
        <input
          id={id("cuit")}
          inputMode="numeric"
          value={cuit}
          onChange={(e) => {
            setCuit(formatoCuit(e.target.value));
            limpiar("cuit");
          }}
          aria-invalid={!!errores.cuit}
          aria-describedby={errores.cuit ? id("cuit-e") : id("cuit-a")}
          placeholder="20-12345678-6"
          className={`${input} ${anillo("cuit")} ${mono}`}
        />
        {errores.cuit ? (
          <p id={id("cuit-e")} className="mt-1.5 text-sm text-rose-300">
            {errores.cuit}
          </p>
        ) : (
          <p id={id("cuit-a")} className="mt-1.5 text-[13px] text-indigo-200/60">
            {cuit.replace(/\D/g, "").length === 11 ? (cuitValido(cuit) ? "CUIT válido." : "Revisá el último dígito.") : "Validamos el dígito verificador mientras escribís."}
          </p>
        )}
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-indigo-100">
        <input
          id={id("acepto")}
          type="checkbox"
          checked={acepto}
          onChange={(e) => {
            setAcepto(e.target.checked);
            limpiar("acepto");
          }}
          aria-invalid={!!errores.acepto}
          className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[#818CF8]"
        />
        Acepto los términos y la política de privacidad de Cuentaclara.
      </label>
      {errores.acepto && <p className="-mt-3 text-sm text-rose-300">{errores.acepto}</p>}

      <button
        type="submit"
        disabled={enviando}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-900 shadow-lg shadow-indigo-950/30 transition-[background-color,transform] hover:bg-indigo-50 active:scale-[0.99] disabled:cursor-wait disabled:opacity-80"
      >
        {enviando ? (
          <>
            <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 motion-reduce:animate-none" />
            Creando tu cuenta…
          </>
        ) : (
          <>
            Empezar prueba gratis
            <Icono nombre="flecha" grosor={2} className="size-4" />
          </>
        )}
      </button>
      <p className="text-center text-[13px] text-indigo-200/70">14 días gratis · Sin tarjeta · Demo: no se envía ningún dato</p>
      <p className="sr-only" aria-live="polite">
        {enviando ? "Creando tu cuenta de prueba…" : ""}
      </p>
    </form>
  );
}
