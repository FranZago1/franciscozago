"use client";

import { useId, useState } from "react";

type Estado = "idle" | "enviando" | "listo" | "error";

/** Formulario de un solo email (newsletter, "avisame"). Valida, muestra estados y aclara que es demo. */
export function FormEmail({
  etiqueta,
  boton,
  ok,
  placeholder = "tu@email.com",
  clases,
  etiquetaVisible = false,
}: {
  etiqueta: string;
  boton: string;
  ok: (email: string) => string;
  placeholder?: string;
  etiquetaVisible?: boolean;
  clases: { form?: string; label?: string; input: string; boton: string; mensaje?: string; error?: string };
}) {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<Estado>("idle");
  const id = useId();

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setEstado("error");
      return;
    }
    setEstado("enviando");
    window.setTimeout(() => setEstado("listo"), 900);
  }

  return (
    <form onSubmit={enviar} noValidate className={clases.form}>
      <label htmlFor={id} className={etiquetaVisible ? clases.label : "sr-only"}>
        {etiqueta}
      </label>
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <input
          id={id}
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (estado === "error" || estado === "listo") setEstado("idle");
          }}
          aria-invalid={estado === "error" ? true : undefined}
          aria-describedby={`${id}-msg`}
          className={`min-w-0 flex-1 ${clases.input}`}
        />
        <button type="submit" className={clases.boton} disabled={estado === "enviando"}>
          {estado === "enviando" ? "Enviando…" : boton}
        </button>
      </div>
      <p id={`${id}-msg`} aria-live="polite" className={`min-h-5 text-sm ${estado === "error" ? (clases.error ?? "") : (clases.mensaje ?? "")}`}>
        {estado === "error" ? "Revisá el email: parece que le falta algo." : estado === "listo" ? `${ok(email.trim())} (Es una demo: no se envió nada.)` : ""}
      </p>
    </form>
  );
}
