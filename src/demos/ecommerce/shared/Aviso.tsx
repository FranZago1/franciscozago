"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { IconoCheck } from "./Iconos";
import type { Tienda } from "./tienda";

/**
 * Aviso de cambios del carrito: región aria-live siempre presente (para lectores de pantalla)
 * + un toast visual que se va solo, con acceso directo al carrito.
 */
export function Aviso({ tienda, className, botonClassName }: { tienda: Tienda; className: string; botonClassName: string }) {
  const aviso = tienda.useTienda((e) => e.aviso);
  const capa = tienda.useTienda((e) => e.capa);
  const [cerradoN, setCerradoN] = useState(0);
  const reducir = useReducedMotion();
  const visible = aviso !== null && aviso.n !== cerradoN && capa === null;

  useEffect(() => {
    if (!aviso) return;
    const t = window.setTimeout(() => setCerradoN(aviso.n), 3200);
    return () => window.clearTimeout(t);
  }, [aviso]);

  // El carácter invisible alterna para que un mismo texto se vuelva a anunciar.
  const texto = aviso ? aviso.texto + (aviso.n % 2 ? "​" : "") : "";

  return (
    <>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {texto}
      </div>
      <AnimatePresence>
        {visible ? (
          <motion.div
            key={aviso.n}
            aria-hidden="true"
            initial={reducir ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reducir ? 0 : -10 }}
            transition={{ duration: reducir ? 0 : 0.25 }}
            className={`fixed top-3 right-3 left-3 z-[90] flex items-center gap-3 sm:top-auto sm:bottom-28 sm:left-auto sm:w-[360px] ${className}`}
          >
            <IconoCheck className="size-5 shrink-0" trazo={2.2} />
            <p className="min-w-0 flex-1 text-sm leading-snug">{aviso.texto}</p>
            <button
              type="button"
              tabIndex={-1}
              onClick={() => {
                setCerradoN(aviso.n);
                tienda.abrir("carrito");
              }}
              className={botonClassName}
            >
              Ver carrito
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
