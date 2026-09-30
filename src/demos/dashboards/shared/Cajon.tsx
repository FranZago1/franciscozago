"use client";

import { useEffect, useRef } from "react";

/**
 * Panel lateral modal para la navegación en mobile. Foco atrapado, Esc cierra y el foco vuelve
 * al botón que lo abrió.
 */
export function Cajon({
  abierto,
  onCerrar,
  etiqueta,
  className,
  children,
}: {
  abierto: boolean;
  onCerrar: () => void;
  etiqueta: string;
  className: string;
  children: React.ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const previo = document.activeElement as HTMLElement | null;
    const el = panel.current;
    const focusables = () =>
      Array.from(el?.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), [tabindex='0']") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCerrar();
        return;
      }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) return;
      const primero = f[0]!;
      const ultimo = f[f.length - 1]!;
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previo?.focus();
    };
  }, [abierto, onCerrar]);

  if (!abierto) return null;
  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onCerrar} aria-hidden="true" />
      <div ref={panel} role="dialog" aria-modal="true" aria-label={etiqueta} className={className}>
        {children}
      </div>
    </div>
  );
}
