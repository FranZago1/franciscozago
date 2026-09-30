"use client";

import { useCallback, useState, type ReactNode } from "react";
import { Dialogo } from "./Dialogo";
import type { DiaISO } from "./fechas";
import { useAhora, useEscucharDemo, useReservasGuardadas, type ConId } from "./hooks";
import { descargarIcs, type EventoIcs } from "./ics";
import { IconoDescarga, IconoTicket } from "./Iconos";

export type TemaMisReservas = {
  boton: string;
  contador: string;
  dialogo: string;
  cuerpo: string;
  titulo: string;
  cerrar: string;
  lista: string;
  item: string;
  itemInactivo: string;
  estado: string;
  estadoCancelada: string;
  tituloItem: string;
  texto: string;
  accion: string;
  accionPeligro: string;
  confirmar: string;
  vacio: string;
};

export type DescripcionReserva = {
  titulo: string;
  lineas: string[];
  codigo: string;
  /** Último día de la reserva: sirve para marcarla como pasada. */
  hasta: DiaISO;
  ics: EventoIcs;
  archivo: string;
};

/**
 * "Mis reservas": botón para el encabezado + modal con la lista guardada en este navegador.
 * Permite descargar el .ics de cada una y cancelarlas (con confirmación).
 */
export function MisReservas<T extends ConId & { codigo: string }>({
  demo,
  evento,
  etiqueta,
  titulo,
  vacio,
  tema,
  describir,
  icono,
}: {
  demo: string;
  evento: string;
  etiqueta: string;
  titulo: string;
  vacio: ReactNode;
  tema: TemaMisReservas;
  describir: (r: T) => DescripcionReserva;
  icono?: ReactNode;
}) {
  const { lista, cancelar, borrar } = useReservasGuardadas<T>(demo);
  const ahora = useAhora();
  const [abierto, setAbierto] = useState(false);
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const [aviso, setAviso] = useState("");
  const cerrar = useCallback(() => {
    setAbierto(false);
    setConfirmando(null);
  }, []);

  useEscucharDemo<null>(evento, () => setAbierto(true));

  const activas = ahora ? lista.filter((r) => r.estado === "confirmada" && describir(r).hasta >= ahora.dia).length : 0;

  return (
    <>
      <button type="button" className={`${tema.boton} shrink-0 whitespace-nowrap`} onClick={() => setAbierto(true)} aria-haspopup="dialog">
        {icono ?? <IconoTicket width={18} height={18} />}
        <span>{etiqueta}</span>
        {activas ? (
          <span className={tema.contador}>
            {activas}
            <span className="sr-only"> {activas === 1 ? "reserva activa" : "reservas activas"}</span>
          </span>
        ) : null}
      </button>
      <p className="sr-only" aria-live="polite">
        {aviso}
      </p>
      <Dialogo
        abierto={abierto}
        onCerrar={cerrar}
        titulo={titulo}
        className={tema.dialogo}
        claseCuerpo={tema.cuerpo}
        claseTitulo={tema.titulo}
        claseCerrar={tema.cerrar}
      >
        {lista.length === 0 ? (
          <div className={tema.vacio}>{vacio}</div>
        ) : (
          <ul className={tema.lista}>
            {lista.map((r) => {
              const d = describir(r);
              const pasada = Boolean(ahora && d.hasta < ahora.dia);
              const cancelada = r.estado === "cancelada";
              const inactiva = cancelada || pasada;
              return (
                <li key={r.id} className={inactiva ? tema.itemInactivo : tema.item}>
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                    <p className={tema.tituloItem}>{d.titulo}</p>
                    <span className={cancelada ? tema.estadoCancelada : tema.estado}>
                      {cancelada ? "Cancelada" : pasada ? "Pasada" : "Confirmada"}
                    </span>
                  </div>
                  <ul className={tema.texto}>
                    {d.lineas.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                    <li>
                      Código <span className="font-mono tracking-wider">{d.codigo}</span>
                    </li>
                  </ul>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {!inactiva ? (
                      confirmando === r.id ? (
                        <>
                          <span className="text-sm">¿Seguro que querés cancelarla?</span>
                          <button
                            type="button"
                            className={tema.confirmar}
                            onClick={() => {
                              cancelar(r.id);
                              setConfirmando(null);
                              setAviso(`Reserva ${d.codigo} cancelada.`);
                            }}
                          >
                            Sí, cancelar
                          </button>
                          <button type="button" className={tema.accion} onClick={() => setConfirmando(null)}>
                            No
                          </button>
                        </>
                      ) : (
                        <>
                          <button type="button" className={tema.accion} onClick={() => descargarIcs(d.ics, d.archivo)}>
                            <IconoDescarga width={15} height={15} /> Calendario
                          </button>
                          <button type="button" className={tema.accionPeligro} onClick={() => setConfirmando(r.id)}>
                            Cancelar reserva
                          </button>
                        </>
                      )
                    ) : (
                      <button
                        type="button"
                        className={tema.accion}
                        onClick={() => {
                          borrar(r.id);
                          setAviso("Reserva quitada de la lista.");
                        }}
                      >
                        Quitar de la lista
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-5 text-xs opacity-70">Demo: las reservas se guardan solo en este navegador y no llegan a ningún negocio.</p>
      </Dialogo>
    </>
  );
}
