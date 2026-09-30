"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

function leer(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as unknown) : undefined;
  } catch {
    return undefined;
  }
}

function guardar(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Modo privado o cuota llena: la demo sigue funcionando sin persistir.
  }
}

function borrar(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Sin acceso a localStorage: no hay nada que borrar.
  }
}

/**
 * Estado que se guarda en localStorage. Arranca con `crear()` (igual en servidor y cliente,
 * para no romper la hidratación) y después del montaje carga lo guardado si pasa `validar`.
 */
export function usePersistentState<T>(key: string, crear: () => T, validar: (v: unknown) => v is T) {
  const [state, setState] = useState<T>(crear);
  const [listo, setListo] = useState(false);
  const crearRef = useRef(crear);
  const validarRef = useRef(validar);

  useEffect(() => {
    const guardado = leer(key);
    if (guardado !== undefined && validarRef.current(guardado)) setState(guardado);
    setListo(true);
  }, [key]);

  useEffect(() => {
    if (listo) guardar(key, state);
  }, [key, state, listo]);

  const reset = useCallback(() => {
    borrar(key);
    setState(crearRef.current());
  }, [key]);

  return [state, setState, reset, listo] as const;
}

function suscribirMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function useReducedMotion() {
  return useSyncExternalStore(
    suscribirMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/** Aviso temporal (toast) con acción opcional, anunciado por lectores de pantalla. */
export type Aviso = { id: number; texto: string; accion?: { label: string; fn: () => void } };

export function useAvisos(duracion = 4200) {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const idRef = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const cerrar = useCallback((id: number) => {
    setAvisos((a) => a.filter((x) => x.id !== id));
    const t = timers.current.get(id);
    if (t) clearTimeout(t);
    timers.current.delete(id);
  }, []);

  const avisar = useCallback(
    (texto: string, accion?: Aviso["accion"]) => {
      const id = ++idRef.current;
      setAvisos((a) => [...a.slice(-2), { id, texto, accion }]);
      timers.current.set(
        id,
        setTimeout(() => cerrar(id), accion ? duracion + 2000 : duracion),
      );
    },
    [cerrar, duracion],
  );

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((x) => clearTimeout(x));
  }, []);

  return { avisos, avisar, cerrar };
}

/** Copia texto al portapapeles con un fallback para navegadores sin permiso. */
export async function copiarTexto(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = texto;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}
