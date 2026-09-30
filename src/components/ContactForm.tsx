"use client";

import { useId, useState } from "react";
import { contactoCopy } from "@/content/home";
import { tiposDeProyecto } from "@/content/servicios";
import type { ContactField, ContactResponse } from "@/lib/contact-schema";
import { waLink } from "@/lib/wa";

type Estado = "idle" | "enviando" | "enviado" | "error";

// zod se carga recién cuando la persona interactúa con el formulario, para no sumar
// peso al JS inicial del home. La validación en cliente sigue siendo la misma que en el servidor.
const cargarEsquema = () => import("@/lib/contact-schema");

const inputBase =
  "w-full rounded-[4px] border-[1.5px] bg-white font-sans px-3.5 py-3 text-base text-ink placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent";

export function ContactForm() {
  const id = useId();
  const [estado, setEstado] = useState<Estado>("idle");
  const [errores, setErrores] = useState<Partial<Record<ContactField, string>>>({});
  const [mensajeError, setMensajeError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const datos = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const { contactSchema, erroresPorCampo } = await cargarEsquema();
    const parsed = contactSchema.safeParse(datos);
    if (!parsed.success) {
      const campos = erroresPorCampo(parsed.error);
      setErrores(campos);
      setEstado("idle");
      const primero = Object.keys(campos)[0];
      if (primero) form.querySelector<HTMLElement>(`[name="${primero}"]`)?.focus();
      return;
    }

    setErrores({});
    setEstado("enviando");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      const data = (await res.json()) as ContactResponse;
      if (data.ok) {
        setEstado("enviado");
        form.reset();
      } else {
        setErrores(data.campos ?? {});
        setMensajeError(data.error);
        setEstado("error");
      }
    } catch {
      setMensajeError("No hay conexión o el servidor no respondió.");
      setEstado("error");
    }
  }

  const campo = (name: ContactField) => ({
    id: `${id}-${name}`,
    name,
    "aria-invalid": errores[name] ? true : undefined,
    "aria-describedby": errores[name] ? `${id}-${name}-error` : undefined,
    className: `${inputBase} ${errores[name] ? "border-[#B42318]" : "border-[#d4d4d4]"}`,
  });

  const error = (name: ContactField) =>
    errores[name] ? (
      <p id={`${id}-${name}-error`} className="mt-1.5 text-sm text-[#B42318]">
        {errores[name]}
      </p>
    ) : null;

  if (estado === "enviado") {
    return (
      <div role="status" className="p-2">
        <p className="text-lg font-semibold">Listo, te escribo pronto.</p>
        <button type="button" onClick={() => setEstado("idle")} className="link mt-3 text-muted">
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} onFocus={() => void cargarEsquema()} noValidate className="grid gap-5" aria-describedby={`${id}-ayuda`}>
      <p id={`${id}-ayuda`} className="text-muted">
        O dejame tus datos y te contesto yo. Con tu email o tu WhatsApp alcanza.
      </p>

      <div>
        <label htmlFor={`${id}-nombre`} className="label-mono mb-1.5 block text-[12px] font-medium">
          Nombre
        </label>
        <input type="text" autoComplete="name" {...campo("nombre")} />
        {error("nombre")}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-email`} className="label-mono mb-1.5 block text-[12px] font-medium">
            Email
          </label>
          <input type="email" autoComplete="email" inputMode="email" {...campo("email")} />
          {error("email")}
        </div>
        <div>
          <label htmlFor={`${id}-whatsapp`} className="label-mono mb-1.5 block text-[12px] font-medium">
            WhatsApp
          </label>
          <input type="tel" autoComplete="tel" inputMode="tel" placeholder="351 123 4567" {...campo("whatsapp")} />
          {error("whatsapp")}
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-tipo`} className="label-mono mb-1.5 block text-[12px] font-medium">
          Tipo de proyecto
        </label>
        <select defaultValue="" {...campo("tipo")}>
          <option value="" disabled>
            Elegí una opción
          </option>
          {tiposDeProyecto.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {error("tipo")}
      </div>

      <div>
        <label htmlFor={`${id}-mensaje`} className="label-mono mb-1.5 block text-[12px] font-medium">
          Mensaje
        </label>
        <textarea rows={5} placeholder="Qué necesitás, para cuándo, si ya tenés algo hecho…" {...campo("mensaje")} />
        {error("mensaje")}
      </div>

      {/* Honeypot: oculto para personas y lectores de pantalla. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-empresa`}>Empresa</label>
        <input id={`${id}-empresa`} name="empresa" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={estado === "enviando"}
          className="label-mono inline-flex items-center justify-center rounded-[4px] bg-ink px-5 py-3.5 text-sm font-medium leading-none text-white transition-[translate,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_var(--color-accent)] disabled:cursor-wait disabled:opacity-70"
        >
          {estado === "enviando" ? "Enviando…" : "Enviar mensaje"}
        </button>
      </div>

      <div role="alert" aria-live="assertive">
        {estado === "error" ? (
          <p className="rounded-[10px] border border-[#B42318]/30 bg-[#FEF3F2] p-4 text-[#7A271A]">
            {mensajeError}{" "}
            <a href={waLink(contactoCopy.mensajeWa)} target="_blank" rel="noopener noreferrer" className="font-medium underline">
              Escribime por WhatsApp
            </a>
          </p>
        ) : null}
      </div>
    </form>
  );
}
