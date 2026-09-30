"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

export type ToastTono = "ok" | "info" | "alerta" | "error";
type Toast = { id: number; texto: string; tono: ToastTono; accion?: { label: string; fn: () => void } };

type Ctx = (texto: string, opts?: { tono?: ToastTono; accion?: Toast["accion"] }) => void;
const ToastCtx = createContext<Ctx>(() => {});

export function useToast() {
  return useContext(ToastCtx);
}

/**
 * Avisos accesibles: una región `aria-live` siempre presente en el DOM.
 * `render` dibuja cada aviso con la estética de cada demo.
 */
export function ToastProvider({
  children,
  className = "",
  render,
}: {
  children: ReactNode;
  className?: string;
  render: (t: Toast, cerrar: () => void) => ReactNode;
}) {
  const [items, setItems] = useState<Toast[]>([]);
  const next = useRef(1);

  const cerrar = useCallback((id: number) => setItems((xs) => xs.filter((x) => x.id !== id)), []);

  const push = useCallback<Ctx>(
    (texto, opts) => {
      const id = next.current++;
      setItems((xs) => [...xs.slice(-2), { id, texto, tono: opts?.tono ?? "ok", accion: opts?.accion }]);
      window.setTimeout(() => cerrar(id), opts?.accion ? 6500 : 4200);
    },
    [cerrar],
  );

  const value = useMemo(() => push, [push]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="false"
        className={`pointer-events-none fixed z-[80] flex flex-col gap-2 ${className}`}
      >
        {items.map((t) => (
          <div key={t.id} className="gt-toast pointer-events-auto">
            {render(t, () => cerrar(t.id))}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes gt-in { from { opacity: 0; transform: translateY(-8px) scale(.98) } }
        .gt-toast { animation: gt-in .2s cubic-bezier(.2,.8,.2,1) }
        @media (prefers-reduced-motion: reduce) { .gt-toast { animation: none } }
      `}</style>
    </ToastCtx.Provider>
  );
}
