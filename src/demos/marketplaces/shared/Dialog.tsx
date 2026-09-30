"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let bloqueos = 0;
function bloquearScroll() {
  bloqueos += 1;
  if (bloqueos === 1) {
    const ancho = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = "hidden";
    if (ancho > 0) document.documentElement.style.paddingRight = `${ancho}px`;
  }
}
function liberarScroll() {
  bloqueos = Math.max(0, bloqueos - 1);
  if (bloqueos === 0) {
    document.documentElement.style.overflow = "";
    document.documentElement.style.paddingRight = "";
  }
}

export type DialogVariant = "center" | "right" | "sheet";

/**
 * Modal accesible y liviano para las demos: foco atrapado, Esc cierra, devuelve el foco al cerrar
 * y bloquea el scroll de la página. Se renderiza dentro del elemento con `data-demo-root`. "right" es un panel lateral; "sheet" sube desde abajo en mobile
 * y queda centrado en desktop.
 */
export function Dialog({
  open,
  onClose,
  labelledBy,
  variant = "center",
  panelClassName = "",
  overlayClassName = "bg-black/50",
  ancho = variant === "sheet" ? "sm:max-w-xl" : "max-w-lg",
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  variant?: DialogVariant;
  panelClassName?: string;
  overlayClassName?: string;
  /** Ancho máximo del panel (clase literal de Tailwind). En "sheet", con prefijo sm: (ej. "sm:max-w-2xl"). */
  ancho?: string;
  children: ReactNode;
}) {
  const [montado, setMontado] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const capa = useRef<HTMLDivElement>(null);
  const reducir = useReducedMotion();

  useEffect(() => setMontado(true), []);

  useEffect(() => {
    if (!open) return;
    const previo = document.activeElement as HTMLElement | null;
    bloquearScroll();
    // El resto de la página queda inerte (ni foco ni lectores de pantalla) mientras el diálogo está abierto.
    // Los avisos (toasts) se marcan con data-fuera-de-dialogo para que se sigan anunciando.
    const cont = capa.current;
    const otros = cont?.parentElement
      ? (Array.from(cont.parentElement.children).filter((el) => el !== cont && !el.hasAttribute("data-fuera-de-dialogo")) as HTMLElement[])
      : [];
    for (const el of otros) {
      el.dataset.inertes = String(Number(el.dataset.inertes ?? 0) + 1);
      el.inert = true;
    }
    const t = window.setTimeout(() => {
      const root = panel.current;
      if (!root) return;
      const auto = root.querySelector<HTMLElement>("[data-autofocus]");
      (auto ?? root.querySelector<HTMLElement>(FOCUSABLE) ?? root).focus({ preventScroll: true });
    }, 30);
    return () => {
      window.clearTimeout(t);
      liberarScroll();
      for (const el of otros) {
        const n = Number(el.dataset.inertes ?? 1) - 1;
        if (n <= 0) {
          delete el.dataset.inertes;
          el.inert = false;
        } else el.dataset.inertes = String(n);
      }
      if (previo && document.contains(previo)) previo.focus({ preventScroll: true });
    };
  }, [open]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !panel.current) return;
    const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement,
    );
    if (items.length === 0) {
      e.preventDefault();
      return;
    }
    const first = items[0]!;
    const last = items[items.length - 1]!;
    if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  if (!montado) return null;

  const pos =
    variant === "right"
      ? `fixed inset-y-0 right-0 flex w-full ${ancho} flex-col`
      : variant === "sheet"
        ? `${ancho} fixed inset-x-0 bottom-0 flex max-h-[92dvh] flex-col sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:-translate-x-1/2 sm:-translate-y-1/2`
        : `fixed left-1/2 top-1/2 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] ${ancho} -translate-x-1/2 -translate-y-1/2 flex-col`;

  const anim = reducir
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : variant === "right"
      ? { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } }
      : variant === "sheet"
        ? { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 40 } }
        : { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.96 } };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div ref={capa} className="fixed inset-0 z-[60]" onKeyDown={onKeyDown}>
          <motion.div
            className={`absolute inset-0 ${overlayClassName}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <div className={pos} style={{ pointerEvents: "none" }}>
            <motion.div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-labelledby={labelledBy}
              tabIndex={-1}
              className={`pointer-events-auto flex min-h-0 flex-1 flex-col outline-none ${panelClassName}`}
              {...anim}
              transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: reducir ? 0.15 : 0.32 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    // Se monta dentro del contenedor de la demo para heredar sus variables (colores y fuentes).
    document.querySelector("[data-demo-root]") ?? document.body,
  );
}
