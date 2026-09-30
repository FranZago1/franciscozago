"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

// ---------- prefers-reduced-motion ----------

const QUERY = "(prefers-reduced-motion: reduce)";
function suscribir(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function useMenosMovimiento(): boolean {
  return useSyncExternalStore(
    suscribir,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

// ---------- Ancho de un contenedor (ResizeObserver) ----------

/**
 * Mide el ancho de un elemento. En el servidor y en el primer render del cliente devuelve
 * `inicial` (así la hidratación coincide); `medido` avisa cuándo ya hay un ancho real.
 */
export function useAncho<T extends HTMLElement>(inicial = 640) {
  const ref = useRef<T>(null);
  const [ancho, setAncho] = useState(inicial);
  const [medido, setMedido] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = (w: number) => {
      setAncho(Math.max(120, Math.round(w)));
      setMedido(true);
    };
    const ro = new ResizeObserver((entradas) => {
      const e = entradas[0];
      if (e) medir(e.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, ancho, medido };
}

// ---------- Interpolación de valores al cambiar de período ----------

/**
 * Anima un arreglo de números hacia `destino` (easing out-cubic). Si cambia la cantidad de puntos
 * no interpola: salta y sube `version`, que el gráfico usa como `key` para un fundido suave.
 * Con reduced motion salta directo.
 */
export function useTransicion(destino: readonly number[], duracion = 520) {
  const menos = useMenosMovimiento();
  const [estado, setEstado] = useState({ valores: destino as readonly number[], version: 0 });
  const actual = useRef<readonly number[]>(destino);
  const firma = destino.join("|");
  const destinoRef = useRef(destino);
  destinoRef.current = destino;

  useEffect(() => {
    const hacia = destinoRef.current;
    const desde = actual.current;
    if (desde.join("|") === hacia.join("|")) return;
    if (menos || desde.length !== hacia.length) {
      actual.current = hacia;
      setEstado((e) => ({ valores: hacia, version: desde.length !== hacia.length ? e.version + 1 : e.version }));
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const paso = (t: number) => {
      const k = Math.min(1, (t - t0) / duracion);
      const e = 1 - Math.pow(1 - k, 3);
      const v = hacia.map((h, i) => desde[i]! + (h - desde[i]!) * e);
      actual.current = v;
      setEstado((s) => ({ valores: v, version: s.version }));
      if (k < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [firma, menos, duracion]);

  return estado;
}

/** Un solo número animado (para KPIs). */
export function useNumeroAnimado(valor: number, duracion = 520) {
  const { valores } = useTransicion([valor], duracion);
  return valores[0] ?? valor;
}

// ---------- Recorrido por teclado de un gráfico ----------

/**
 * Índice activo de un gráfico: se mueve con el mouse (hover) o con las flechas cuando el gráfico
 * tiene el foco. Devuelve props para el contenedor focusable.
 */
export function useRecorrido(cantidad: number) {
  const [activo, setActivo] = useState<number | null>(null);
  const [porTeclado, setPorTeclado] = useState(false);
  const idx = activo !== null && activo < cantidad ? activo : null;

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const mover = (n: number) => {
        e.preventDefault();
        setPorTeclado(true);
        setActivo(Math.max(0, Math.min(cantidad - 1, n)));
      };
      const actualIdx = activo ?? -1;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") mover(actualIdx < 0 ? 0 : actualIdx + 1);
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") mover(actualIdx < 0 ? cantidad - 1 : actualIdx - 1);
      else if (e.key === "Home") mover(0);
      else if (e.key === "End") mover(cantidad - 1);
      else if (e.key === "Escape") setActivo(null);
    },
    [activo, cantidad],
  );

  const contenedor = {
    tabIndex: 0,
    onKeyDown,
    onFocus: () => {
      setPorTeclado(true);
      setActivo((a) => a ?? cantidad - 1);
    },
    onBlur: () => {
      setActivo(null);
      setPorTeclado(false);
    },
    onPointerLeave: () => {
      if (!porTeclado) setActivo(null);
    },
  };

  const marcar = useCallback((i: number | null) => {
    setPorTeclado(false);
    setActivo(i);
  }, []);

  return { activo: idx, marcar, contenedor, porTeclado };
}
