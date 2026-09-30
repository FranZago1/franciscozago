"use client";

import { useRef } from "react";
import { PERIODOS, type Periodo } from "./datos";

/**
 * Control segmentado de período (7 días / 30 días / 12 meses). Es un radiogroup: Tab entra,
 * las flechas cambian la opción. Los estilos llegan por props para que cada demo tenga su look.
 */
export function SelectorPeriodo({
  valor,
  onCambio,
  clases,
}: {
  valor: Periodo;
  onCambio: (p: Periodo) => void;
  clases: { grupo: string; opcion: string; activa: string; inactiva: string };
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const idx = PERIODOS.findIndex((p) => p.id === valor);

  const onKeyDown = (e: React.KeyboardEvent) => {
    let n = idx;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (idx + 1) % PERIODOS.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (idx - 1 + PERIODOS.length) % PERIODOS.length;
    else return;
    e.preventDefault();
    onCambio(PERIODOS[n]!.id);
    refs.current[n]?.focus();
  };

  return (
    <div role="radiogroup" aria-label="Período" className={clases.grupo} onKeyDown={onKeyDown}>
      {PERIODOS.map((p, i) => {
        const activa = p.id === valor;
        return (
          <button
            key={p.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={activa}
            tabIndex={activa ? 0 : -1}
            onClick={() => onCambio(p.id)}
            className={`${clases.opcion} ${activa ? clases.activa : clases.inactiva}`}
          >
            {p.corto}
          </button>
        );
      })}
    </div>
  );
}
