"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

const formato = new Intl.DateTimeFormat("es-AR", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: site.zonaHoraria,
});

/** Hora de Córdoba con segundos. Se renderiza después del montaje para evitar mismatch de hidratación. */
export function LiveClock() {
  const [hora, setHora] = useState<string | null>(null);

  useEffect(() => {
    const actualizar = () => setHora(formato.format(new Date()));
    actualizar();
    const id = setInterval(actualizar, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="label-mono inline-block min-w-[8ch] text-sm tabular-nums">
      {hora ? (
        <time aria-label={`Hora en Córdoba: ${hora.slice(0, 5)}`}>
          {hora}
          <span className="hidden text-muted md:inline"> en Córdoba</span>
        </time>
      ) : (
        <span className="text-transparent">00:00:00</span>
      )}
    </span>
  );
}
