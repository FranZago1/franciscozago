"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Diálogo modal accesible sin estilos propios: foco atrapado, Esc cierra, devuelve el foco
 * al elemento que lo abrió y bloquea el scroll del fondo. Cada demo le pone su estética.
 * Se renderiza en el lugar (sin portal) para heredar las fuentes de la demo.
 */
export function Dialog({
  abierto,
  onClose,
  labelledBy,
  describedBy,
  overlayClassName,
  className,
  children,
  initialFocus,
  lado = "centro",
}: {
  abierto: boolean;
  onClose: () => void;
  labelledBy: string;
  describedBy?: string;
  overlayClassName: string;
  className: string;
  children: React.ReactNode;
  /** Selector del elemento a enfocar al abrir. */
  initialFocus?: string;
  lado?: "centro" | "izquierda" | "derecha";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!abierto) return;
    const previo = document.activeElement as HTMLElement | null;
    const nodo = ref.current;
    const inicial =
      (initialFocus ? nodo?.querySelector<HTMLElement>(initialFocus) : null) ??
      nodo?.querySelector<HTMLElement>(FOCUSABLE) ??
      nodo;
    inicial?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !nodo) return;
      const items = Array.from(nodo.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = overflow;
      if (previo && document.contains(previo)) previo.focus();
    };
  }, [abierto, initialFocus]);

  if (!abierto) return null;

  const pos =
    lado === "izquierda"
      ? "justify-start items-stretch"
      : lado === "derecha"
        ? "justify-end items-stretch"
        : "items-end justify-center sm:items-center";

  return (
    <div
      className={`fixed inset-0 z-[60] flex ${pos} ${overlayClassName}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={className}
      >
        {children}
      </div>
    </div>
  );
}
