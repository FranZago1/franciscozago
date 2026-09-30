"use client";

import { useState } from "react";

export type DemoContactoClases = {
  form: string;
  label: string;
  input: string;
  boton: string;
  aviso: string;
};

/** Formulario visual de las demos: no envía nada, avisa que es una demo. */
export function DemoContacto({ clases, fotografo }: { clases: DemoContactoClases; fotografo: string }) {
  const [enviado, setEnviado] = useState(false);
  return (
    <form
      className={clases.form}
      onSubmit={(e) => {
        e.preventDefault();
        setEnviado(true);
      }}
    >
      <label className={clases.label}>
        Nombre
        <input name="nombre" autoComplete="off" className={clases.input} />
      </label>
      <label className={clases.label}>
        Email
        <input name="email" type="email" autoComplete="off" className={clases.input} />
      </label>
      <label className={clases.label}>
        Contame tu idea
        <textarea name="mensaje" rows={4} className={clases.input} />
      </label>
      <button type="submit" className={clases.boton}>
        Consultar
      </button>
      <p role="status" className={clases.aviso}>
        {enviado
          ? `Esto es una demo: el mensaje no se envía y ${fotografo} es un fotógrafo ficticio.`
          : null}
      </p>
    </form>
  );
}
