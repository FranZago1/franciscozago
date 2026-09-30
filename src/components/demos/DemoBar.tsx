"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/content/site";
import { waLink } from "@/lib/wa";

/**
 * Barra fija de demo. Igual en todas las demos: se puede minimizar, pero nunca ocultar del todo.
 * Usa colores neutros propios para leerse sobre cualquier fondo.
 */
export function DemoBar({
  estilo,
  mensaje,
  otrosHref = "/demos/fotografia",
  pregunta = "¿Querés uno así?",
  minimizada = false,
}: {
  /** Nombre del estilo de la demo (ej. "Impacto"). */
  estilo: string;
  /** Mensaje precargado de WhatsApp. Por defecto, el de portfolios de fotografía. */
  mensaje?: string;
  /** Pantalla con las otras demos de la misma vertical. */
  otrosHref?: string;
  pregunta?: string;
  /** Arranca minimizada (para demos tipo aplicación, donde la barra taparía contenido). */
  minimizada?: boolean;
}) {
  const [min, setMin] = useState(minimizada);
  const wa = waLink(mensaje ?? `Hola Fran, me interesa un portfolio de fotografía estilo ${estilo}.`);

  return (
    <div
      role="region"
      aria-label="Aviso de demo"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-2 font-[system-ui,sans-serif] sm:p-4"
    >
      {min ? (
        <button
          type="button"
          onClick={() => setMin(false)}
          aria-expanded="false"
          className="rounded-full bg-[#111] px-4 py-2 text-sm text-white shadow-[0_2px_12px_rgba(0,0,0,0.25)] ring-1 ring-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4FB3B8]"
        >
          Demo de {site.nombre}
        </button>
      ) : (
        <div className="flex w-full max-w-3xl flex-wrap items-center gap-x-4 gap-y-1.5 rounded-2xl bg-[#111] px-3 py-2.5 text-[13px] text-white sm:px-4 sm:py-3 sm:text-sm shadow-[0_2px_16px_rgba(0,0,0,0.25)] ring-1 ring-white/15">
          <p className="min-w-0 flex-1 basis-64 text-white/90">
            Esta es una demo de {site.nombre}. {pregunta}
          </p>
          <div className="flex w-full items-center gap-2.5 whitespace-nowrap sm:w-auto sm:gap-3">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-3 py-1.5 font-medium sm:px-3.5 sm:py-2 text-[#111] transition-colors hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4FB3B8]"
            >
              Pedilo por WhatsApp
            </a>
            <Link
              href={otrosHref}
              className="hidden text-white/80 underline underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4FB3B8] sm:inline"
            >
              Otros estilos
            </Link>
            <Link
              href="/"
              className="text-white/80 underline underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4FB3B8]"
            >
              Volver al portfolio
            </Link>
            <button
              type="button"
              onClick={() => setMin(true)}
              aria-expanded="true"
              className="ml-auto rounded-full px-1 py-1 text-white/70 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4FB3B8]"
            >
              Minimizar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
