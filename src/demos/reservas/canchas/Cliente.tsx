"use client";

import { fechaLarga, hhmm, pesos } from "../shared/fechas";
import { MisReservas as Base } from "../shared/MisReservas";
import { canchas, club, type ReservaCancha } from "./datos";

export function MisReservas() {
  return (
    <Base<ReservaCancha>
      demo="canchas"
      evento="canchas:mis-reservas"
      etiqueta="Mis reservas"
      titulo="Mis reservas"
      vacio={
        <>
          <p className="[font-family:var(--font-pc-display)] text-3xl font-extrabold uppercase italic">Sin reservas todavía</p>
          <p className="mt-1 text-sm text-[#0a1b3d]/65">Elegí un horario en la grilla y aparece acá.</p>
        </>
      }
      describir={(r) => {
        const c = canchas.find((x) => x.id === r.cancha);
        return {
          titulo: `${c?.nombre ?? "Cancha"} · ${fechaLarga(r.dia)}`,
          lineas: [
            `${hhmm(r.inicio)} a ${hhmm(r.inicio + r.duracion)} (${r.duracion} min)`,
            `Seña ${pesos(r.sena)} · resta ${pesos(r.total - r.sena)}`,
            ...(r.invitados.length ? [`Invitados: ${r.invitados.join(", ")}`] : []),
          ],
          codigo: r.codigo,
          hasta: r.dia,
          archivo: `padel-${r.codigo}`,
          ics: {
            tipo: "horario",
            uid: r.id,
            titulo: `Pádel · ${c?.nombre} · ${club.nombre}`,
            descripcion: `Código ${r.codigo}. Demo con contenido ficticio.`,
            lugar: club.direccion,
            dia: r.dia,
            inicio: r.inicio,
            fin: r.inicio + r.duracion,
          },
        };
      }}
      tema={{
        boton:
          "inline-flex items-center gap-2 rounded-xl bg-[#f4f7fc] px-3 py-2 text-sm font-bold text-[#0a1b3d] ring-1 ring-[#0a1b3d]/10 transition hover:ring-[#1553d6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1553d6]",
        contador: "grid min-w-5 place-items-center rounded-full bg-[#1553d6] px-1.5 text-[11px] leading-5 text-white",
        dialogo:
          "m-auto w-[min(32rem,calc(100vw-2rem))] max-h-[85dvh] rounded-3xl bg-white p-0 text-[#0a1b3d] shadow-2xl backdrop:bg-[#0a1b3d]/70 backdrop:backdrop-blur-sm",
        cuerpo: "p-6 sm:p-7 [font-family:var(--font-pc-sans)]",
        titulo: "[font-family:var(--font-pc-display)] text-4xl font-extrabold uppercase italic leading-none",
        cerrar: "grid size-9 place-items-center rounded-full bg-[#f4f7fc] hover:bg-[#e6ecf7] focus-visible:outline-2 focus-visible:outline-[#1553d6]",
        lista: "mt-5 grid gap-2.5",
        item: "rounded-2xl bg-[#f4f7fc] p-4",
        itemInactivo: "rounded-2xl border-2 border-dashed border-[#0a1b3d]/10 p-4 opacity-60",
        estado: "rounded-full bg-[#d8f03c] px-2.5 py-0.5 text-[11px] font-bold uppercase",
        estadoCancelada: "rounded-full bg-[#0a1b3d]/10 px-2.5 py-0.5 text-[11px] font-bold uppercase",
        tituloItem: "font-bold first-letter:uppercase",
        texto: "mt-1.5 grid gap-0.5 text-sm text-[#0a1b3d]/70",
        accion:
          "inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold ring-1 ring-[#0a1b3d]/12 hover:ring-[#1553d6] focus-visible:outline-2 focus-visible:outline-[#1553d6]",
        accionPeligro: "rounded-lg px-3 py-1.5 text-xs font-bold text-[#d64545] hover:bg-[#fdecec] focus-visible:outline-2 focus-visible:outline-[#d64545]",
        confirmar: "rounded-lg bg-[#d64545] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#c13a3a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d64545]",
        vacio: "mt-5 rounded-2xl bg-[#f4f7fc] p-6 text-center",
      }}
    />
  );
}
