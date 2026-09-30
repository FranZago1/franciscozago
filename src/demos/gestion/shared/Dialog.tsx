"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Variante = "modal" | "derecha" | "izquierda" | "abajo";

/**
 * Modal / drawer accesible: role="dialog", foco atrapado, Esc cierra, devuelve el foco al cerrar
 * y bloquea el scroll del fondo. Los estilos del panel los pone cada demo.
 */
export function Dialog({
  open,
  onClose,
  titulo,
  children,
  variante = "modal",
  panelClassName = "",
  overlayClassName = "bg-black/40",
  tituloClassName = "",
  subtitulo,
  headerClassName = "",
  cerrarClassName = "",
  bodyClassName = "",
  footer,
  footerClassName = "",
  initialFocus,
}: {
  open: boolean;
  onClose: () => void;
  titulo: string;
  children: ReactNode;
  variante?: Variante;
  panelClassName?: string;
  overlayClassName?: string;
  tituloClassName?: string;
  subtitulo?: ReactNode;
  headerClassName?: string;
  cerrarClassName?: string;
  bodyClassName?: string;
  footer?: ReactNode;
  footerClassName?: string;
  /** Selector CSS del elemento a enfocar al abrir (por defecto, el primero enfocable). */
  initialFocus?: string;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const previo = document.activeElement as HTMLElement | null;
    const root = panel.current;
    const inicial =
      (initialFocus && root?.querySelector<HTMLElement>(initialFocus)) ||
      root?.querySelector<HTMLElement>("[data-autofocus]") ||
      root?.querySelector<HTMLElement>(FOCUSABLE) ||
      root;
    inicial?.focus({ preventScroll: true });

    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (!root) return;
      if (e.key === "Escape") {
        // Si hay otro diálogo encima, que lo maneje ese.
        const abiertos = document.querySelectorAll("[data-gdialog]");
        if (abiertos[abiertos.length - 1] !== root.parentElement) return;
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const abiertos = document.querySelectorAll("[data-gdialog]");
      if (abiertos[abiertos.length - 1] !== root.parentElement) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (e.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !root.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      if (previo && document.contains(previo)) previo.focus({ preventScroll: true });
    };
  }, [open, initialFocus]);

  if (!open) return null;

  const pos: Record<Variante, string> = {
    modal: "items-end justify-center sm:items-center sm:p-6",
    derecha: "items-stretch justify-end",
    izquierda: "items-stretch justify-start",
    abajo: "items-end justify-center",
  };
  const anim: Record<Variante, string> = {
    modal: "gd-in-up",
    derecha: "gd-in-right",
    izquierda: "gd-in-left",
    abajo: "gd-in-up",
  };

  return (
    <div data-gdialog className={`fixed inset-0 z-[70] flex ${pos[variante]}`}>
      <style>{`
        @keyframes gd-fade { from { opacity: 0 } }
        @keyframes gd-up { from { opacity: 0; transform: translateY(16px) } }
        @keyframes gd-right { from { transform: translateX(100%) } }
        @keyframes gd-left { from { transform: translateX(-100%) } }
        .gd-overlay { animation: gd-fade .18s ease-out }
        .gd-in-up { animation: gd-up .22s cubic-bezier(.2,.8,.2,1) }
        .gd-in-right { animation: gd-right .26s cubic-bezier(.2,.8,.2,1) }
        .gd-in-left { animation: gd-left .26s cubic-bezier(.2,.8,.2,1) }
        @media (prefers-reduced-motion: reduce) {
          .gd-overlay, .gd-in-up, .gd-in-right, .gd-in-left { animation: none }
        }
      `}</style>
      <div className={`gd-overlay absolute inset-0 ${overlayClassName}`} onClick={onClose} aria-hidden="true" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative flex max-h-full flex-col outline-none ${anim[variante]} ${panelClassName}`}
      >
        <div className={`flex shrink-0 items-start justify-between gap-4 ${headerClassName}`}>
          <div className="min-w-0">
            <h2 id={titleId} className={tituloClassName}>
              {titulo}
            </h2>
            {subtitulo}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className={`grid size-9 shrink-0 place-items-center transition-colors ${cerrarClassName}`}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className={`min-h-0 flex-1 overflow-y-auto overscroll-contain ${bodyClassName}`}>{children}</div>
        {footer ? <div className={`shrink-0 ${footerClassName}`}>{footer}</div> : null}
      </div>
    </div>
  );
}
