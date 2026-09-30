"use client";

import { tienda } from "./tienda";

export function BotonDetalle({ id, className, children, label }: { id: string; className?: string; children: React.ReactNode; label?: string }) {
  return (
    <button type="button" onClick={() => tienda.verDetalle(id)} className={className} aria-label={label}>
      {children}
    </button>
  );
}
