"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

/**
 * Diálogo modal accesible (drawer lateral, modal centrado o pantalla completa):
 * foco atrapado, Esc cierra solo el de arriba, bloquea el scroll del fondo y devuelve el foco al cerrar.
 */

const pila: string[] = [];
let bloqueos = 0;

function bloquearScroll() {
  if (bloqueos++ > 0) return;
  const ancho = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.overflow = "hidden";
  if (ancho > 0) document.body.style.paddingRight = `${ancho}px`;
}
function liberarScroll() {
  if (--bloqueos > 0) return;
  document.documentElement.style.overflow = "";
  document.body.style.paddingRight = "";
}

const ENFOCABLES =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const sinSuscripcion = () => () => {};

type Variante = "derecha" | "izquierda" | "centro" | "pantalla";

const contenedor: Record<Variante, string> = {
  derecha: "justify-end",
  izquierda: "justify-start",
  centro: "items-end justify-center sm:items-center sm:p-6",
  pantalla: "items-stretch justify-center md:items-center md:p-6",
};

const base: Record<Variante, string> = {
  derecha: "h-dvh w-full max-w-[440px] overflow-y-auto overscroll-contain",
  izquierda: "h-dvh w-[86%] max-w-[360px] overflow-y-auto overscroll-contain",
  centro: "max-h-[92dvh] w-full overflow-y-auto overscroll-contain",
  pantalla: "h-dvh w-full overflow-y-auto overscroll-contain md:h-auto md:max-h-[92dvh]",
};

export function Dialogo({
  abierto,
  onCerrar,
  titulo,
  variante = "centro",
  className = "",
  overlayClassName = "bg-black/50",
  children,
}: {
  abierto: boolean;
  onCerrar: () => void;
  /** Id del título visible (aria-labelledby) o texto para aria-label si empieza con "texto:". */
  titulo: string;
  variante?: Variante;
  className?: string;
  overlayClassName?: string;
  children: React.ReactNode;
}) {
  const montado = useSyncExternalStore(
    sinSuscripcion,
    () => true,
    () => false,
  );
  const reducir = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const cerrarRef = useRef(onCerrar);
  useEffect(() => {
    cerrarRef.current = onCerrar;
  }, [onCerrar]);

  useEffect(() => {
    if (!abierto) return;
    const previo = document.activeElement as HTMLElement | null;
    pila.push(id);
    bloquearScroll();

    const enfocar = requestAnimationFrame(() => {
      const el = panel.current;
      if (!el) return;
      const auto = el.querySelector<HTMLElement>("[data-autofocus]");
      (auto ?? el).focus({ preventScroll: true });
    });

    function onKey(e: KeyboardEvent) {
      if (pila[pila.length - 1] !== id) return;
      if (e.key === "Escape") {
        e.preventDefault();
        cerrarRef.current();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(ENFOCABLES)).filter((n) => n.offsetParent !== null || n === document.activeElement);
      if (items.length === 0) {
        e.preventDefault();
        panel.current.focus();
        return;
      }
      const primero = items[0]!;
      const ultimo = items[items.length - 1]!;
      const activo = document.activeElement;
      if (e.shiftKey && (activo === primero || activo === panel.current)) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && activo === ultimo) {
        e.preventDefault();
        primero.focus();
      } else if (!panel.current.contains(activo)) {
        e.preventDefault();
        primero.focus();
      }
    }
    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(enfocar);
      document.removeEventListener("keydown", onKey);
      const i = pila.lastIndexOf(id);
      if (i >= 0) pila.splice(i, 1);
      liberarScroll();
      if (previo && document.contains(previo)) previo.focus({ preventScroll: true });
    };
  }, [abierto, id]);

  if (!montado) return null;

  const lateral = variante === "derecha" || variante === "izquierda";
  const desde = variante === "derecha" ? "100%" : "-100%";
  const animPanel = reducir
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : lateral
      ? { initial: { x: desde }, animate: { x: 0 }, exit: { x: desde } }
      : { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 } };

  const etiqueta = titulo.startsWith("texto:") ? { "aria-label": titulo.slice(6) } : { "aria-labelledby": titulo };

  return createPortal(
    <AnimatePresence>
      {abierto ? (
        <div className={`fixed inset-0 z-[80] flex ${contenedor[variante]}`} key="dialogo">
          <motion.div
            aria-hidden="true"
            className={`absolute inset-0 ${overlayClassName}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducir ? 0 : 0.22 }}
            onClick={onCerrar}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            {...etiqueta}
            tabIndex={-1}
            className={`relative outline-none ${base[variante]} ${className}`}
            {...animPanel}
            transition={reducir ? { duration: 0 } : { type: "tween", ease: [0.22, 1, 0.36, 1], duration: lateral ? 0.38 : 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    // Dentro del contenedor de la demo (que define las fuentes con next/font); si no está, al body.
    document.querySelector<HTMLElement>("[data-portal-tienda]") ?? document.body,
  );
}
