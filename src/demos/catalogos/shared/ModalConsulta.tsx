"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Dialogo, IconoCerrar } from "./Dialogo";
import { copiarTexto } from "./formato";

export type CampoConsulta = {
  id: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  multilinea?: boolean;
};

/** Clases para adaptar el modal a la identidad de cada demo. El "teléfono" mantiene colores de chat. */
export type TemaConsulta = {
  dialogo: string;
  panel: string;
  titulo: string;
  bajada: string;
  label: string;
  input: string;
  primario: string;
  secundario: string;
  aviso: string;
  cerrar: string;
  separador: string;
};

/** Convierte *negrita* (formato de WhatsApp) en <strong>, igual que lo mostraría la app. */
function Formateado({ texto }: { texto: string }) {
  const partes = texto.split(/(\*[^*\n]+\*)/g);
  return (
    <>
      {partes.map((p, i) =>
        p.startsWith("*") && p.endsWith("*") && p.length > 2 ? <strong key={i}>{p.slice(1, -1)}</strong> : <span key={i}>{p}</span>,
      )}
    </>
  );
}

function hora() {
  return new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
}

export function VistaChat({ mensaje, negocio, iniciales }: { mensaje: string; negocio: string; iniciales: string }) {
  const [ahora, setAhora] = useState("");
  useEffect(() => setAhora(hora()), []);
  return (
    <figure className="overflow-hidden rounded-[22px] border border-black/10 bg-[#EAE3D9] font-[system-ui,-apple-system,'Segoe_UI',sans-serif] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.45)]">
      <div className="flex items-center gap-3 bg-[#1F2B31] px-4 py-3 text-white">
        <span
          className="grid size-9 shrink-0 place-items-center rounded-full bg-[#DDE3E6] text-[13px] font-semibold text-[#1F2B31]"
          aria-hidden="true"
        >
          {iniciales}
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[14px] font-medium">{negocio}</p>
          <p className="text-[11.5px] text-white/65">Mensaje nuevo desde el catálogo</p>
        </div>
      </div>
      <div
        className="max-h-[46vh] overflow-y-auto px-3 py-4 sm:max-h-[420px]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.045) 1px, transparent 1.2px), radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1.2px)",
          backgroundSize: "18px 18px, 18px 18px",
          backgroundPosition: "0 0, 9px 9px",
        }}
      >
        <p className="mx-auto mb-3 w-fit rounded-md bg-white/80 px-2.5 py-1 text-[11px] text-[#54656F] shadow-sm">Hoy</p>
        <div className="relative max-w-[92%] rounded-lg rounded-tl-none bg-white px-3 pt-2 pb-5 text-[13.5px] leading-[1.45] text-[#111B21] shadow-[0_1px_0.5px_rgba(0,0,0,0.13)]">
          <span className="absolute top-0 -left-2 h-3 w-2 bg-white [clip-path:polygon(100%_0,0_0,100%_100%)]" aria-hidden="true" />
          <figcaption className="sr-only">Vista previa del mensaje</figcaption>
          <p className="break-words whitespace-pre-wrap">
            <Formateado texto={mensaje} />
          </p>
          <span className="absolute right-2 bottom-1 text-[10.5px] text-[#667781]">{ahora}</span>
        </div>
      </div>
    </figure>
  );
}

/**
 * Modal "Consultar por WhatsApp": pide un par de datos, arma el mensaje en vivo y lo muestra
 * tal como le llegaría al negocio. En la demo no se envía: se puede copiar.
 */
export function ModalConsulta({
  abierto,
  onCerrar,
  titulo,
  bajada,
  negocio,
  iniciales,
  campos,
  construir,
  tema,
  aviso = "Es una demo: el mensaje no se envía a nadie. En tu catálogo real, este botón abre WhatsApp con el texto listo para mandar.",
}: {
  abierto: boolean;
  onCerrar: () => void;
  titulo: string;
  bajada: string;
  negocio: string;
  iniciales: string;
  campos: CampoConsulta[];
  construir: (datos: Record<string, string>) => string;
  tema: TemaConsulta;
  aviso?: string;
}) {
  const uid = useId();
  const tituloId = `${uid}-titulo`;
  const [datos, setDatos] = useState<Record<string, string>>({});
  const [copiado, setCopiado] = useState<"" | "ok" | "error">("");
  const mensaje = useMemo(() => construir(datos), [construir, datos]);

  useEffect(() => {
    if (!copiado) return;
    const t = window.setTimeout(() => setCopiado(""), 2600);
    return () => window.clearTimeout(t);
  }, [copiado]);

  return (
    <Dialogo abierto={abierto} onCerrar={onCerrar} labelledBy={tituloId} className={tema.dialogo}>
      <div className={tema.panel}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={tituloId} className={tema.titulo}>
              {titulo}
            </h2>
            <p className={tema.bajada}>{bajada}</p>
          </div>
          <button type="button" onClick={onCerrar} className={tema.cerrar} aria-label="Cerrar">
            <IconoCerrar />
          </button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:grid-rows-[auto_1fr] md:gap-x-8">
          <div className="flex flex-col gap-4">
            {campos.map((c) => (
              <label key={c.id} className="flex flex-col gap-1.5">
                <span className={tema.label}>{c.label}</span>
                {c.multilinea ? (
                  <textarea
                    rows={2}
                    value={datos[c.id] ?? ""}
                    placeholder={c.placeholder}
                    onChange={(e) => setDatos((d) => ({ ...d, [c.id]: e.target.value }))}
                    className={`${tema.input} resize-none`}
                  />
                ) : (
                  <input
                    type="text"
                    value={datos[c.id] ?? ""}
                    placeholder={c.placeholder}
                    autoComplete={c.autoComplete}
                    onChange={(e) => setDatos((d) => ({ ...d, [c.id]: e.target.value }))}
                    className={tema.input}
                  />
                )}
              </label>
            ))}
          </div>
          <div className="md:col-start-2 md:row-span-2 md:row-start-1">
            <VistaChat mensaje={mensaje} negocio={negocio} iniciales={iniciales} />
          </div>
          <div className="flex flex-col gap-4">
            <div className={`grid gap-2.5 border-t pt-5 sm:grid-cols-[1fr_auto] md:grid-cols-1 lg:grid-cols-[1fr_auto] ${tema.separador}`}>
              <button
                type="button"
                className={tema.primario}
                onClick={async () => setCopiado((await copiarTexto(mensaje)) ? "ok" : "error")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-4.5" aria-hidden="true">
                  {copiado === "ok" ? (
                    <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                  ) : (
                    <>
                      <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
                      <path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" />
                    </>
                  )}
                </svg>
                {copiado === "ok" ? "Mensaje copiado" : "Copiar mensaje"}
              </button>
              <button type="button" className={tema.secundario} onClick={onCerrar}>
                Seguir mirando
              </button>
            </div>
            <p role="status" aria-live="polite" className="sr-only">
              {copiado === "ok" ? "Mensaje copiado al portapapeles" : copiado === "error" ? "No se pudo copiar el mensaje" : ""}
            </p>
            {copiado === "error" ? (
              <p className={tema.aviso}>No pudimos copiar automáticamente. Seleccioná el texto de la vista previa.</p>
            ) : null}
            <p className={tema.aviso}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="mr-1.5 inline size-4 -translate-y-px"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 11v5M12 8h.01" strokeLinecap="round" />
              </svg>
              {aviso}
            </p>
          </div>
        </div>
      </div>
    </Dialogo>
  );
}
