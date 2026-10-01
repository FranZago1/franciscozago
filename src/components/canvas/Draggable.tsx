"use client";

import { useRef } from "react";

let zTop = 20;

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Rotación inicial en grados. */
  rotate?: number;
  /** true si es puramente decorativo (se oculta a lectores de pantalla). */
  decorativo?: boolean;
  style?: React.CSSProperties;
};

/**
 * Elemento que se puede agarrar y mover con mouse o dedo, sin librerías.
 * Queda limitado al contenedor posicionado más cercano. Si hubo arrastre, se cancela el
 * click siguiente (para que soltar un sticker con link no navegue).
 */
export function Draggable({ children, className = "", rotate = 0, decorativo = true, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const estado = useRef({ x: 0, y: 0, inicioX: 0, inicioY: 0, baseX: 0, baseY: 0, activo: false, movio: false });
  const limites = useRef({ minX: 0, maxX: 0, minY: 0, maxY: 0 });

  function aplicar(x: number, y: number, agarrado: boolean) {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--dx", `${x}px`);
    el.style.setProperty("--dy", `${y}px`);
    el.dataset.agarrado = agarrado ? "true" : "false";
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    // En mobile los stickers solo flotan: no se arrastran (el dedo tiene que poder scrollear).
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    const el = ref.current;
    const padre = el?.offsetParent as HTMLElement | null;
    if (!el || !padre) return;
    const s = estado.current;
    const r = el.getBoundingClientRect();
    const p = padre.getBoundingClientRect();
    // Límites: el elemento no puede salir del contenedor.
    limites.current = {
      minX: s.x - (r.left - p.left),
      maxX: s.x + (p.right - r.right),
      minY: s.y - (r.top - p.top),
      maxY: s.y + (p.bottom - r.bottom),
    };
    s.activo = true;
    s.movio = false;
    s.inicioX = e.clientX;
    s.inicioY = e.clientY;
    s.baseX = s.x;
    s.baseY = s.y;
    // La captura del puntero recién se toma cuando hay arrastre (ver onPointerMove):
    // si se tomara acá, un click simple caería en este div y no en un link interno.
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const s = estado.current;
    if (!s.activo) return;
    const dx = e.clientX - s.inicioX;
    const dy = e.clientY - s.inicioY;
    if (!s.movio) {
      if (Math.abs(dx) + Math.abs(dy) <= 4) return;
      s.movio = true;
      const el = ref.current;
      if (el) {
        el.style.zIndex = String(++zTop);
        el.setPointerCapture(e.pointerId);
      }
    }
    const l = limites.current;
    s.x = Math.min(l.maxX, Math.max(l.minX, s.baseX + dx));
    s.y = Math.min(l.maxY, Math.max(l.minY, s.baseY + dy));
    aplicar(s.x, s.y, true);
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const s = estado.current;
    if (!s.activo) return;
    s.activo = false;
    if (ref.current?.hasPointerCapture(e.pointerId)) ref.current.releasePointerCapture(e.pointerId);
    aplicar(s.x, s.y, false);
  }

  return (
    <div
      ref={ref}
      aria-hidden={decorativo || undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={(e) => {
        if (estado.current.movio) {
          e.preventDefault();
          e.stopPropagation();
          estado.current.movio = false;
        }
      }}
      onDragStart={(e) => e.preventDefault()}
      className={`draggable ${className}`}
      style={{ "--r": `${rotate}deg`, ...style } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
