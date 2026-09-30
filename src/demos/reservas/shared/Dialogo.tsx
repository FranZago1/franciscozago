"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

/**
 * Modal con <dialog> nativo: el navegador vuelve inerte el resto de la página (foco atrapado)
 * y Escape lo cierra. Al cerrar, el foco vuelve al elemento que lo abrió.
 */
export function Dialogo({
  abierto,
  onCerrar,
  titulo,
  children,
  className,
  claseCuerpo,
  claseTitulo,
  claseCerrar,
  etiquetaCerrar = "Cerrar",
}: {
  abierto: boolean;
  onCerrar: () => void;
  titulo: string;
  children: ReactNode;
  /** Clases del <dialog>: conviene p-0 y dejar el padding en claseCuerpo (el padding del dialog cuenta como "fondo"). */
  className?: string;
  claseCuerpo?: string;
  claseTitulo?: string;
  claseCerrar?: string;
  etiquetaCerrar?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const previo = useRef<HTMLElement | null>(null);
  const idTitulo = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierto && !d.open) {
      previo.current = document.activeElement as HTMLElement | null;
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!abierto && d.open) {
      d.close();
    }
  }, [abierto]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const alCerrar = () => {
      document.documentElement.style.overflow = "";
      previo.current?.focus();
      onCerrar();
    };
    d.addEventListener("close", alCerrar);
    return () => d.removeEventListener("close", alCerrar);
  }, [onCerrar]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={idTitulo}
      className={className}
      onClick={(e) => {
        // Click en el fondo (fuera del contenido) cierra.
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
    >
      {abierto ? (
        <div className={claseCuerpo}>
          <div className="flex items-start justify-between gap-4">
            <h2 id={idTitulo} className={claseTitulo}>
              {titulo}
            </h2>
            <button type="button" className={claseCerrar} onClick={() => ref.current?.close()} aria-label={etiquetaCerrar}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      ) : null}
    </dialog>
  );
}
