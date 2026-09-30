"use client";

import { diferenciaDias, fechaCorta, pesos } from "../shared/fechas";
import { emitirDemo } from "../shared/hooks";
import { MisReservas as Base } from "../shared/MisReservas";
import { cabanas, complejo, type ReservaCabana } from "./datos";
import { EVENTO_CABANA } from "./Reserva";

export function MisReservas() {
  return (
    <Base<ReservaCabana>
      demo="cabanas"
      evento="cabanas:mis-reservas"
      etiqueta="Mis reservas"
      titulo="Mis reservas"
      vacio={
        <>
          <p className="[font-family:var(--font-am-serif)] text-2xl">Todavía no reservaste.</p>
          <p className="mt-1 text-sm text-[#6b6356]">Cuando lo hagas, vas a ver tu estadía acá.</p>
        </>
      }
      describir={(r) => {
        const c = cabanas.find((x) => x.id === r.cabana);
        return {
          titulo: `${c?.nombre ?? "Cabaña"} · ${fechaCorta(r.desde)} → ${fechaCorta(r.hasta)}`,
          lineas: [
            `${diferenciaDias(r.desde, r.hasta)} noches · ${r.adultos + r.menores} huéspedes`,
            `Seña ${pesos(r.sena)} · total ${pesos(r.total)}`,
          ],
          codigo: r.codigo,
          hasta: r.hasta,
          archivo: `arroyo-manso-${r.codigo}`,
          ics: {
            tipo: "dias",
            uid: r.id,
            titulo: `Estadía en ${c?.nombre} · ${complejo.nombre}`,
            descripcion: `Código ${r.codigo}. Demo con contenido ficticio.`,
            lugar: complejo.direccion,
            desde: r.desde,
            hasta: r.hasta,
          },
        };
      }}
      tema={{
        boton:
          "inline-flex items-center gap-2 rounded-full bg-[#fbf8f2]/90 px-4 py-2 text-sm font-semibold text-[#2a2620] ring-1 ring-[#2a2620]/10 backdrop-blur transition hover:ring-[#2f4a3a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b5653a]",
        contador: "grid min-w-5 place-items-center rounded-full bg-[#b5653a] px-1.5 text-[11px] leading-5 text-white",
        dialogo:
          "m-auto w-[min(32rem,calc(100vw-2rem))] max-h-[85dvh] rounded-[1.75rem] bg-[#fbf8f2] p-0 text-[#2a2620] shadow-2xl backdrop:bg-[#243a2d]/60 backdrop:backdrop-blur-sm",
        cuerpo: "p-6 sm:p-8 [font-family:var(--font-am-sans)]",
        titulo: "[font-family:var(--font-am-serif)] text-3xl font-medium",
        cerrar: "grid size-9 place-items-center rounded-full bg-[#efe6d4] hover:bg-[#e4d8c0] focus-visible:outline-2 focus-visible:outline-[#b5653a]",
        lista: "mt-5 grid gap-3",
        item: "rounded-2xl bg-white p-4 ring-1 ring-[#2a2620]/8",
        itemInactivo: "rounded-2xl border border-dashed border-[#2a2620]/20 p-4 opacity-60",
        estado: "rounded-full bg-[#2f4a3a] px-2.5 py-0.5 text-xs font-semibold text-[#f7f2e8]",
        estadoCancelada: "rounded-full bg-[#2a2620]/10 px-2.5 py-0.5 text-xs font-semibold",
        tituloItem: "font-semibold",
        texto: "mt-1.5 grid gap-0.5 text-sm text-[#6b6356]",
        accion:
          "inline-flex items-center gap-1.5 rounded-full bg-[#efe6d4] px-3 py-1.5 text-xs font-semibold hover:bg-[#e4d8c0] focus-visible:outline-2 focus-visible:outline-[#b5653a]",
        accionPeligro: "rounded-full px-3 py-1.5 text-xs font-semibold text-[#a8321e] hover:bg-[#a8321e]/8 focus-visible:outline-2 focus-visible:outline-[#a8321e]",
        confirmar: "rounded-full bg-[#a8321e] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#8f2918] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8321e]",
        vacio: "mt-5 rounded-2xl bg-[#efe6d4] p-6 text-center",
      }}
    />
  );
}

export function VerDisponibilidad({ cabana, className, children }: { cabana: string; className?: string; children: React.ReactNode }) {
  return (
    <a href="#reservar" className={className} onClick={() => emitirDemo(EVENTO_CABANA, cabana)}>
      {children}
    </a>
  );
}
