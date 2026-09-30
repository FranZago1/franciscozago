"use client";

import { useId, useState, type FormEvent } from "react";
import { Icon } from "../shared/Icon";
import { esperar } from "../shared/utils";
import { barrios, oficios } from "./data";
import { ancho, cinta, foco, mono } from "./ui";

type Campos = "nombre" | "oficio" | "matricula" | "zona" | "telefono";

export function Sumate() {
  const id = useId();
  const [datos, setDatos] = useState<Record<Campos, string>>({ nombre: "", oficio: "", matricula: "", zona: "", telefono: "" });
  const [errores, setErrores] = useState<Partial<Record<Campos, string>>>({});
  const [estado, setEstado] = useState<"form" | "enviando" | "listo">("form");

  const set = (k: Campos, v: string) => {
    setDatos((d) => ({ ...d, [k]: v }));
    if (errores[k]) setErrores((e) => ({ ...e, [k]: undefined }));
  };

  async function enviar(e: FormEvent) {
    e.preventDefault();
    const er: Partial<Record<Campos, string>> = {};
    if (datos.nombre.trim().length < 3) er.nombre = "Escribí tu nombre y apellido.";
    if (!datos.oficio) er.oficio = "Elegí tu oficio.";
    if (!/^[A-Za-z]{0,3}\s?\d{3,6}$/.test(datos.matricula.trim())) er.matricula = "Ingresá tu número de matrícula o registro (ej. MP 4471).";
    if (!datos.zona) er.zona = "Elegí la zona donde trabajás.";
    if (datos.telefono.replace(/\D/g, "").length < 8) er.telefono = "Ingresá un teléfono válido.";
    setErrores(er);
    if (Object.keys(er).length) {
      document.getElementById(`${id}-${Object.keys(er)[0]}`)?.focus();
      return;
    }
    setEstado("enviando");
    await esperar(1300);
    setEstado("listo");
  }

  const campo = (k: Campos) =>
    `mt-1.5 w-full rounded-lg border-2 bg-white/[0.06] px-3.5 py-3 text-[0.95rem] text-white outline-none transition placeholder:text-white/40 focus:border-(--ma-amarillo) ${
      errores[k] ? "border-[#FF8A80]" : "border-white/20"
    }`;
  const err = (k: Campos) =>
    errores[k] ? (
      <p id={`${id}-${k}-err`} className="mt-1.5 text-sm font-medium text-[#FFB4AB]">
        {errores[k]}
      </p>
    ) : null;
  const aria = (k: Campos) => ({ "aria-invalid": !!errores[k], "aria-describedby": errores[k] ? `${id}-${k}-err` : undefined });

  return (
    <section id="sumate" aria-labelledby="sumate-titulo" className="relative scroll-mt-16 overflow-hidden bg-(--ma-azul) text-white">
      <div className={`h-3 ${cinta}`} aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_1.05fr] lg:px-8">
        <div>
          <p className={`${mono} text-sm text-(--ma-amarillo)`}>Para profesionales</p>
          <h2 id="sumate-titulo" className={`${ancho} mt-2 text-4xl font-extrabold leading-[1.02] tracking-[-0.02em] sm:text-5xl`}>
            Sumate como profesional y conseguí trabajos en tu zona.
          </h2>
          <p className="mt-5 max-w-lg text-lg text-white/75">
            Te mandamos pedidos de clientes cerca tuyo, con la descripción y las fotos del problema. Vos decidís a cuáles
            responder y cuánto cobrar.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              ["Sin comisión el primer mes", "Después, un 8 % solo de los trabajos que cerrás por acá."],
              ["Tu matrícula, a la vista", "Verificamos tus datos y te damos el sello que genera confianza."],
              ["Pedidos con información", "Descripción, fotos, barrio y horario antes de ir."],
              ["Cobrás directo", "El cliente te paga a vos, como siempre."],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md bg-(--ma-amarillo) text-(--ma-azul)">
                  <Icon name="check" size={16} stroke={3} />
                </span>
                <span>
                  <strong className="block">{t}</strong>
                  <span className="text-white/65">{d}</span>
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/15 pt-6">
            {[
              ["38", "pedidos por día"],
              ["72 %", "responden en 1 h"],
              ["4,8", "promedio general"],
            ].map(([n, t]) => (
              <div key={t}>
                <dt className="sr-only">{t}</dt>
                <dd className={`${ancho} text-3xl font-extrabold text-(--ma-amarillo)`}>{n}</dd>
                <dd className="text-sm text-white/60">{t}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/15 backdrop-blur sm:p-7 lg:sticky lg:top-24 lg:self-start">
          {estado === "listo" ? (
            <div className="py-10 text-center" aria-live="polite">
              <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-(--ma-amarillo) text-(--ma-azul)">
                <Icon name="check" size={32} stroke={3} />
              </span>
              <p className={`${ancho} mt-5 text-2xl font-extrabold`}>¡Gracias, {datos.nombre.split(" ")[0]}!</p>
              <p className="mx-auto mt-2 max-w-sm text-white/70">
                Revisamos tu matrícula <span className={mono}>{datos.matricula.toUpperCase()}</span> y te escribimos en 48 h hábiles para activar tu perfil.
              </p>
              <p className="mx-auto mt-6 max-w-sm rounded-lg bg-white/10 p-3 text-sm text-white/75">Demo: no se envió ningún dato.</p>
              <button
                type="button"
                onClick={() => {
                  setEstado("form");
                  setDatos({ nombre: "", oficio: "", matricula: "", zona: "", telefono: "" });
                }}
                className={`mt-5 rounded-lg border-2 border-white/30 px-4 py-2.5 text-sm font-bold ${foco}`}
              >
                Cargar otro profesional
              </button>
            </div>
          ) : (
            <form onSubmit={enviar} noValidate>
              <p className={`${ancho} text-xl font-extrabold`}>Dejanos tus datos</p>
              <p className="mt-1 text-sm text-white/65">Tarda dos minutos. Te contactamos para completar tu perfil.</p>
              {Object.keys(errores).some((k) => errores[k as Campos]) && (
                <p role="alert" className="mt-4 rounded-lg bg-[#FF8A80]/15 p-3 text-sm text-[#FFD2CC]">
                  Faltan algunos datos. Revisá los campos marcados.
                </p>
              )}
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor={`${id}-nombre`} className="text-sm font-bold">
                    Nombre y apellido
                  </label>
                  <input id={`${id}-nombre`} autoComplete="name" value={datos.nombre} onChange={(e) => set("nombre", e.target.value)} className={campo("nombre")} {...aria("nombre")} />
                  {err("nombre")}
                </div>
                <div>
                  <label htmlFor={`${id}-oficio`} className="text-sm font-bold">
                    Oficio
                  </label>
                  <select id={`${id}-oficio`} value={datos.oficio} onChange={(e) => set("oficio", e.target.value)} className={`${campo("oficio")} [&>option]:text-(--ma-tinta)`} {...aria("oficio")}>
                    <option value="">Elegí uno</option>
                    {oficios.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.nombre}
                      </option>
                    ))}
                  </select>
                  {err("oficio")}
                </div>
                <div>
                  <label htmlFor={`${id}-matricula`} className="text-sm font-bold">
                    Matrícula o registro
                  </label>
                  <input id={`${id}-matricula`} placeholder="MP 4471" value={datos.matricula} onChange={(e) => set("matricula", e.target.value)} className={`${campo("matricula")} ${mono}`} {...aria("matricula")} />
                  {err("matricula")}
                </div>
                <div>
                  <label htmlFor={`${id}-zona`} className="text-sm font-bold">
                    Zona principal
                  </label>
                  <select id={`${id}-zona`} value={datos.zona} onChange={(e) => set("zona", e.target.value)} className={`${campo("zona")} [&>option]:text-(--ma-tinta)`} {...aria("zona")}>
                    <option value="">Elegí un barrio</option>
                    {barrios.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                  {err("zona")}
                </div>
                <div>
                  <label htmlFor={`${id}-telefono`} className="text-sm font-bold">
                    Teléfono
                  </label>
                  <input id={`${id}-telefono`} inputMode="tel" autoComplete="tel" placeholder="351 555 0123" value={datos.telefono} onChange={(e) => set("telefono", e.target.value)} className={campo("telefono")} {...aria("telefono")} />
                  {err("telefono")}
                </div>
              </div>
              <button
                type="submit"
                disabled={estado === "enviando"}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-(--ma-amarillo) px-5 py-3.5 font-extrabold text-(--ma-azul) shadow-[0_3px_0_#C99400] transition hover:bg-(--ma-amarillo2) disabled:opacity-80 ${foco}`}
              >
                {estado === "enviando" ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-(--ma-azul)/30 border-t-(--ma-azul)" aria-hidden="true" />
                    Enviando…
                  </>
                ) : (
                  "Quiero sumarme"
                )}
              </button>
              <p className="mt-3 text-center text-xs text-white/55">Es una demo: el formulario no envía nada.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
