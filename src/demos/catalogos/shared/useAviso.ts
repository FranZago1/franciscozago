"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Mensaje efímero ("Agregado a tu lista") que se borra solo. Pensado para un contenedor aria-live. */
export function useAviso(ms = 2600) {
  const [mensaje, setMensaje] = useState("");
  const timer = useRef<number | undefined>(undefined);

  const avisar = useCallback(
    (m: string) => {
      setMensaje(m);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setMensaje(""), ms);
    },
    [ms],
  );

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return [mensaje, avisar] as const;
}
