"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export type LightboxFoto = { src: string; alt: string; width: number; height: number };

/** Clases para adaptar el lightbox al estilo de cada demo. */
export type LightboxTema = {
  overlay: string;
  boton: string;
  contador: string;
};

type Ctx = { abrir: (index: number) => void };
const LightboxContext = createContext<Ctx | null>(null);

/**
 * Envuelve una galería. Las fotos se abren con <LightboxTrigger index={i}>.
 * Teclado: Esc cierra, ← y → navegan. Swipe horizontal en pantallas táctiles.
 * El foco queda atrapado dentro mientras está abierto y vuelve al disparador al cerrar.
 */
export function LightboxRoot({
  fotos,
  tema,
  children,
}: {
  fotos: LightboxFoto[];
  tema: LightboxTema;
  children: React.ReactNode;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const disparador = useRef<HTMLElement | null>(null);

  const abrir = useCallback((i: number) => {
    disparador.current = document.activeElement as HTMLElement | null;
    setIndex(i);
  }, []);

  const cerrar = useCallback(() => {
    setIndex(null);
    // Devolver el foco al elemento que abrió el lightbox.
    requestAnimationFrame(() => disparador.current?.focus());
  }, []);

  return (
    <LightboxContext.Provider value={{ abrir }}>
      {children}
      <AnimatePresence>
        {index !== null ? (
          <Dialogo
            key="lightbox"
            fotos={fotos}
            index={index}
            setIndex={setIndex}
            cerrar={cerrar}
            tema={tema}
          />
        ) : null}
      </AnimatePresence>
    </LightboxContext.Provider>
  );
}

export function LightboxTrigger({
  index,
  label,
  className = "",
  children,
}: {
  index: number;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = useContext(LightboxContext);
  return (
    <button
      type="button"
      onClick={() => ctx?.abrir(index)}
      aria-label={label}
      aria-haspopup="dialog"
      className={`block w-full cursor-zoom-in ${className}`}
    >
      {children}
    </button>
  );
}

function Dialogo({
  fotos,
  index,
  setIndex,
  cerrar,
  tema,
}: {
  fotos: LightboxFoto[];
  index: number;
  setIndex: (i: number) => void;
  cerrar: () => void;
  tema: LightboxTema;
}) {
  const reducir = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const cerrarBtn = useRef<HTMLButtonElement>(null);
  const inicioSwipe = useRef<{ x: number; y: number } | null>(null);
  const huboSwipe = useRef(false);
  const total = fotos.length;
  const foto = fotos[index];

  const ir = useCallback((delta: number) => setIndex((index + delta + total) % total), [index, total, setIndex]);

  // Foco inicial y bloqueo del scroll de fondo.
  useEffect(() => {
    cerrarBtn.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      cerrar();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      ir(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      ir(-1);
    } else if (e.key === "Tab") {
      // Trampa de foco.
      const focusables = ref.current?.querySelectorAll<HTMLElement>("button:not([disabled])");
      if (!focusables || focusables.length === 0) return;
      const primero = focusables[0]!;
      const ultimo = focusables[focusables.length - 1]!;
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    }
  }

  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType === "mouse") return;
    inicioSwipe.current = { x: e.clientX, y: e.clientY };
  }

  function onPointerUp(e: React.PointerEvent) {
    const inicio = inicioSwipe.current;
    inicioSwipe.current = null;
    if (!inicio) return;
    const dx = e.clientX - inicio.x;
    const dy = e.clientY - inicio.y;
    huboSwipe.current = Math.abs(dx) > 10 || Math.abs(dy) > 10;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) ir(dx < 0 ? 1 : -1);
  }

  if (!foto) return null;

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={`Foto ${index + 1} de ${total}`}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className={`fixed inset-0 z-[60] flex touch-pan-y flex-col ${tema.overlay}`}
      initial={reducir ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reducir ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between gap-4 p-3 sm:p-4">
        <span className={`text-sm tabular-nums ${tema.contador}`} aria-live="polite">
          {index + 1} de {total}
        </span>
        <button ref={cerrarBtn} type="button" onClick={cerrar} className={tema.boton}>
          Cerrar
        </button>
      </div>
      <div
        className="relative min-h-0 flex-1"
        onClick={(e) => {
          if (huboSwipe.current) {
            huboSwipe.current = false;
            return;
          }
          if (e.target === e.currentTarget) cerrar();
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={foto.src}
            className="pointer-events-none absolute inset-0 px-3 sm:px-16"
            initial={reducir ? false : { opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducir ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <Image src={foto.src} alt={foto.alt} fill sizes="100vw" className="object-contain" />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-center gap-3 p-3 sm:p-4">
        <button type="button" onClick={() => ir(-1)} className={tema.boton}>
          Anterior
        </button>
        <button type="button" onClick={() => ir(1)} className={tema.boton}>
          Siguiente
        </button>
      </div>
    </motion.div>
  );
}
