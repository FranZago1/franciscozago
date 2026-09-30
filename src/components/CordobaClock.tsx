"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

const formato = new Intl.DateTimeFormat("es-AR", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: site.zonaHoraria,
});

/** Hora actual de Córdoba. Se renderiza después del montaje para evitar mismatch de hidratación. */
export function CordobaClock() {
  const [hora, setHora] = useState<string | null>(null);

  useEffect(() => {
    const actualizar = () => setHora(formato.format(new Date()));
    actualizar();
    // Se re-sincroniza al inicio de cada minuto.
    let intervalo: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      actualizar();
      intervalo = setInterval(actualizar, 60_000);
    }, 60_000 - (Date.now() % 60_000));
    return () => {
      clearTimeout(timeout);
      if (intervalo) clearInterval(intervalo);
    };
  }, []);

  return (
    <span className="inline-flex min-w-[2.75rem] justify-end tabular-nums sm:min-w-[7.5rem]">
      {hora ? (
        <time aria-label={`Hora en Córdoba: ${hora}`}>
          {hora}
          <span className="hidden sm:inline"> en Córdoba</span>
        </time>
      ) : null}
    </span>
  );
}
