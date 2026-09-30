"use client";

import { useEffect, useRef } from "react";

/**
 * Modal accesible sobre <dialog> nativo: showModal() deja el resto de la página inerte
 * (el foco no se escapa), Esc cierra, click en el fondo cierra y al cerrar el navegador
 * devuelve el foco al elemento que lo abrió.
 */
export function Dialogo({
  abierto,
  onCerrar,
  labelledBy,
  className = "",
  children,
}: {
  abierto: boolean;
  onCerrar: () => void;
  labelledBy: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierto && !d.open) {
      d.showModal();
      const html = document.documentElement;
      const previo = html.style.overflow;
      html.style.overflow = "hidden";
      return () => {
        html.style.overflow = previo;
      };
    }
    if (!abierto && d.open) d.close();
  }, [abierto]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onCancel={(e) => {
        e.preventDefault();
        onCerrar();
      }}
      onClose={() => {
        if (abierto) onCerrar();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
      className={className}
    >
      {abierto ? children : null}
    </dialog>
  );
}

/** Ícono de cerrar (X) reutilizable. */
export function IconoCerrar({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
