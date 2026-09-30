"use client";

import { Aviso } from "../shared/Aviso";
import { CarritoDrawer } from "../shared/CarritoDrawer";
import { Checkout } from "../shared/Checkout";
import { config, porId } from "./datos";
import { Detalle } from "./Detalle";
import { tema, tienda } from "./tienda";

/** Todo lo que flota sobre la página: detalle, carrito, checkout y aviso. */
export function Capas() {
  return (
    <>
      <Detalle />
      <CarritoDrawer tienda={tienda} productos={porId} tema={tema} config={config} trazo={2} />
      <Checkout tienda={tienda} productos={porId} tema={tema} config={config} trazo={2} />
      <Aviso
        tienda={tienda}
        className="border-2 border-[#0B0B0B] bg-[#D4FF2E] px-4 py-3 font-semibold text-[#0B0B0B] shadow-[6px_6px_0_#0B0B0B]"
        botonClassName="shrink-0 border-b-2 border-[#0B0B0B] text-xs font-black tracking-[0.12em] uppercase"
      />
    </>
  );
}

/** Botón que abre el detalle de un producto desde cualquier sección (lookbook, drop). */
export function BotonProducto({ id, className, children }: { id: string; className?: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={() => tienda.verDetalle(id)} className={className}>
      {children}
    </button>
  );
}
