"use client";

import { fechaLarga, hhmm } from "../shared/fechas";
import { emitirDemo } from "../shared/hooks";
import { MisReservas } from "../shared/MisReservas";
import { barberoPorId, negocio, servicioPorId, type ReservaBarberia } from "./datos";
import { EVENTO_BARBERO, EVENTO_SERVICIO } from "./Reserva";

export function MisTurnos() {
  return (
    <MisReservas<ReservaBarberia>
      demo="barberia"
      evento="barberia:mis-turnos"
      etiqueta="Mis turnos"
      titulo="Mis turnos"
      vacio={
        <>
          <p className="[font-family:var(--font-df-serif)] text-3xl">Todavía no tenés turnos.</p>
          <p className="mt-2 text-sm opacity-70">Reservá uno y lo vas a ver acá, con la opción de cancelarlo.</p>
        </>
      }
      describir={(r) => {
        const b = barberoPorId(r.barbero);
        const servs = r.servicios.map((id) => servicioPorId(id)?.nombre).join(" + ");
        return {
          titulo: `${fechaLarga(r.dia)} · ${hhmm(r.inicio)}`,
          lineas: [servs, `Con ${b?.nombre ?? "—"}${r.asignado ? " (asignado)" : ""}`],
          codigo: r.codigo,
          hasta: r.dia,
          archivo: `turno-don-filo-${r.codigo}`,
          ics: {
            tipo: "horario",
            uid: r.id,
            titulo: `${servs} · ${negocio.nombre}`,
            descripcion: `Código ${r.codigo}. Te atiende ${b?.nombre}. Demo con contenido ficticio.`,
            lugar: negocio.direccion,
            dia: r.dia,
            inicio: r.inicio,
            fin: r.fin,
          },
        };
      }}
      tema={{
        boton:
          "inline-flex items-center gap-2 rounded-[3px] border border-[#efe6d6]/25 px-3 py-2 text-xs font-semibold tracking-[0.12em] text-[#efe6d6] uppercase transition hover:border-[#c29b5a] hover:text-[#c29b5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c29b5a]",
        contador: "grid min-w-5 place-items-center rounded-full bg-[#7a1e2c] px-1.5 text-[11px] leading-5 text-[#efe6d6]",
        dialogo:
          "m-auto w-[min(34rem,calc(100vw-2rem))] max-h-[85dvh] rounded-[4px] bg-[#efe6d6] p-0 text-[#1b1714] shadow-2xl backdrop:bg-[#141210]/75 backdrop:backdrop-blur-sm",
        cuerpo: "p-6 sm:p-8 [font-family:var(--font-df-sans)]",
        titulo: "[font-family:var(--font-df-serif)] text-4xl leading-none",
        cerrar:
          "grid size-9 place-items-center rounded-full border border-[#1b1714]/20 hover:border-[#1b1714] focus-visible:outline-2 focus-visible:outline-[#7a1e2c]",
        lista: "mt-6 grid gap-3",
        item: "rounded-[3px] border border-[#1b1714]/15 bg-[#f6efe3] p-4",
        itemInactivo: "rounded-[3px] border border-dashed border-[#1b1714]/20 p-4 opacity-60",
        estado: "rounded-full bg-[#2f6b45] px-2 py-0.5 text-[11px] font-semibold tracking-wide text-[#efe6d6] uppercase",
        estadoCancelada: "rounded-full bg-[#1b1714]/15 px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
        tituloItem: "font-semibold first-letter:uppercase",
        texto: "mt-1.5 grid gap-0.5 text-sm text-[#5c5247]",
        accion:
          "inline-flex items-center gap-1.5 rounded-[3px] border border-[#1b1714]/20 px-3 py-1.5 text-xs font-semibold tracking-wide uppercase hover:border-[#1b1714] focus-visible:outline-2 focus-visible:outline-[#7a1e2c]",
        accionPeligro:
          "rounded-[3px] px-3 py-1.5 text-xs font-semibold tracking-wide text-[#7a1e2c] uppercase underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[#7a1e2c]",
        confirmar:
          "rounded-[3px] bg-[#7a1e2c] px-3 py-1.5 text-xs font-semibold tracking-wide text-[#efe6d6] uppercase hover:bg-[#8e2536] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a1e2c]",
        vacio: "mt-6 rounded-[3px] border border-dashed border-[#1b1714]/25 p-6 text-center",
      }}
    />
  );
}

/** Botón que lleva al motor de reservas con un servicio o barbero ya elegido. */
export function ReservarCon({
  servicio,
  barbero,
  className,
  children,
}: {
  servicio?: string;
  barbero?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href="#reservar"
      className={className}
      onClick={() => {
        if (servicio) emitirDemo(EVENTO_SERVICIO, servicio);
        if (barbero) emitirDemo(EVENTO_BARBERO, barbero);
      }}
    >
      {children}
    </a>
  );
}
