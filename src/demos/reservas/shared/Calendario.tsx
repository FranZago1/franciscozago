"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from "react";
import {
  compararMes,
  diaSemana,
  fechaLarga,
  mesDe,
  nombreMes,
  semanasDelMes,
  sumarDias,
  sumarMeses,
  type DiaISO,
} from "./fechas";

/**
 * Calendario accesible (patrón "grid" de WAI-ARIA), sin estilos propios: cada demo lo viste con su tema.
 * Teclado: flechas (día/semana), Inicio/Fin (semana), RePág/AvPág (mes), Enter o Espacio (elegir).
 * Muestra 1 mes en mobile y `mesesDesktop` en pantallas anchas.
 */

export type InfoDia = {
  dia: DiaISO;
  deshabilitado: boolean;
  nota?: string;
  hoy: boolean;
  seleccionado: boolean;
  inicio: boolean;
  fin: boolean;
  enRango: boolean;
  enfocado: boolean;
};

export type TemaCalendario = {
  raiz?: string;
  cabecera: string;
  titulo: string;
  botonNav: string;
  meses: string;
  tabla: string;
  diaSemana: string;
  celda?: string;
  dia: (info: InfoDia) => string;
};

type Props = {
  etiqueta: string;
  hoy: DiaISO;
  minDia: DiaISO;
  maxDia: DiaISO;
  estado: (d: DiaISO) => { deshabilitado: boolean; nota?: string };
  desde?: DiaISO | null;
  hasta?: DiaISO | null;
  /** Fin provisorio mientras se pasa el mouse o el foco (rango). */
  vistaPrevia?: DiaISO | null;
  onElegir: (d: DiaISO) => void;
  onEnfocar?: (d: DiaISO | null) => void;
  mesesDesktop?: 1 | 2;
  tema: TemaCalendario;
  contenidoDia?: (info: InfoDia) => ReactNode;
  iconoAnterior?: ReactNode;
  iconoSiguiente?: ReactNode;
};

const SEMANA = [
  ["L", "lunes"],
  ["M", "martes"],
  ["M", "miércoles"],
  ["J", "jueves"],
  ["V", "viernes"],
  ["S", "sábado"],
  ["D", "domingo"],
] as const;

function suscribirAncho(aviso: () => void) {
  const mq = window.matchMedia("(min-width: 768px)");
  mq.addEventListener("change", aviso);
  return () => mq.removeEventListener("change", aviso);
}

function useAncho(): boolean {
  return useSyncExternalStore(
    suscribirAncho,
    () => window.matchMedia("(min-width: 768px)").matches,
    () => false,
  );
}

function menor(a: DiaISO, b: DiaISO) {
  return a < b ? a : b;
}
function mayor(a: DiaISO, b: DiaISO) {
  return a > b ? a : b;
}

export function Calendario({
  etiqueta,
  hoy,
  minDia,
  maxDia,
  estado,
  desde,
  hasta,
  vistaPrevia,
  onElegir,
  onEnfocar,
  mesesDesktop = 1,
  tema,
  contenidoDia,
  iconoAnterior,
  iconoSiguiente,
}: Props) {
  const ancho = useAncho();
  const visibles = ancho ? mesesDesktop : 1;
  const [foco, setFoco] = useState<DiaISO>(() => desde ?? minDia);
  const [mesVista, setMesVista] = useState(() => mesDe(desde ?? minDia));
  const raiz = useRef<HTMLDivElement>(null);
  const moverFoco = useRef(false);

  const minMes = mesDe(minDia);
  const maxMes = mesDe(maxDia);
  const ultimoVisible = sumarMeses(mesVista, visibles - 1);

  // Si cambia la selección desde afuera (ej. "Cambiar fecha"), el foco sigue a la selección.
  const [desdePrevio, setDesdePrevio] = useState(desde);
  if (desde !== desdePrevio) {
    setDesdePrevio(desde);
    if (desde) setFoco(desde);
  }

  useEffect(() => {
    if (!moverFoco.current) return;
    moverFoco.current = false;
    raiz.current?.querySelector<HTMLButtonElement>(`[data-dia="${foco}"]`)?.focus();
  }, [foco, mesVista]);

  function asegurarVisible(d: DiaISO) {
    const m = mesDe(d);
    if (compararMes(m, mesVista) < 0) setMesVista(m);
    else if (compararMes(m, sumarMeses(mesVista, visibles - 1)) > 0) setMesVista(sumarMeses(m, -(visibles - 1)));
  }

  function enfocar(d: DiaISO) {
    const destino = mayor(minDia, menor(maxDia, d));
    moverFoco.current = true;
    setFoco(destino);
    asegurarVisible(destino);
    onEnfocar?.(destino);
  }

  function alTeclear(e: KeyboardEvent<HTMLDivElement>) {
    const t = e.target as HTMLElement;
    const actual = t.dataset.dia;
    if (!actual) return;
    const dow = (diaSemana(actual) + 6) % 7;
    const saltos: Record<string, () => DiaISO> = {
      ArrowLeft: () => sumarDias(actual, -1),
      ArrowRight: () => sumarDias(actual, 1),
      ArrowUp: () => sumarDias(actual, -7),
      ArrowDown: () => sumarDias(actual, 7),
      Home: () => sumarDias(actual, -dow),
      End: () => sumarDias(actual, 6 - dow),
      PageUp: () => sumarDias(actual, -30),
      PageDown: () => sumarDias(actual, 30),
    };
    const fn = saltos[e.key];
    if (!fn) return;
    e.preventDefault();
    enfocar(fn());
  }

  function cambiarMes(n: number) {
    const nuevo = sumarMeses(mesVista, n);
    setMesVista(nuevo);
    // El foco "roving" pasa al primer día válido del mes nuevo.
    const primero = `${nuevo.y}-${String(nuevo.m).padStart(2, "0")}-01`;
    setFoco(mayor(minDia, menor(maxDia, primero)));
  }

  const puedeAtras = compararMes(mesVista, minMes) > 0;
  const puedeAdelante = compararMes(ultimoVisible, maxMes) < 0;
  const finRango = hasta ?? (desde && vistaPrevia && vistaPrevia > desde ? vistaPrevia : null);

  // Si el foco quedó fuera de lo visible (ej. al pasar de 2 meses a 1), se usa el primer día visible.
  const focoVisible =
    compararMes(mesDe(foco), mesVista) >= 0 && compararMes(mesDe(foco), ultimoVisible) <= 0
      ? foco
      : mayor(minDia, `${mesVista.y}-${String(mesVista.m).padStart(2, "0")}-01`);

  return (
    <div ref={raiz} className={tema.raiz} role="group" aria-label={etiqueta}>
      <div className={tema.cabecera}>
        <button
          type="button"
          className={tema.botonNav}
          onClick={() => cambiarMes(-1)}
          disabled={!puedeAtras}
          aria-label="Mes anterior"
        >
          {iconoAnterior ?? "‹"}
        </button>
        <p className="sr-only" aria-live="polite">
          {Array.from({ length: visibles }, (_, i) => {
            const m = sumarMeses(mesVista, i);
            return `${nombreMes(m.m)} ${m.y}`;
          }).join(" y ")}
        </p>
        <button
          type="button"
          className={tema.botonNav}
          onClick={() => cambiarMes(1)}
          disabled={!puedeAdelante}
          aria-label="Mes siguiente"
        >
          {iconoSiguiente ?? "›"}
        </button>
      </div>
      <div className={tema.meses} onKeyDown={alTeclear}>
        {Array.from({ length: visibles }, (_, i) => {
          const m = sumarMeses(mesVista, i);
          const idTitulo = `cal-${etiqueta.replace(/\W+/g, "-")}-${m.y}-${m.m}`;
          return (
            <div key={`${m.y}-${m.m}`}>
              <h4 id={idTitulo} className={tema.titulo}>
                {nombreMes(m.m)} <span className="opacity-65">{m.y}</span>
              </h4>
              <table role="grid" aria-labelledby={idTitulo} className={tema.tabla}>
                <thead>
                  <tr>
                    {SEMANA.map(([c, largo]) => (
                      <th key={largo} scope="col" abbr={largo} className={tema.diaSemana}>
                        <span aria-hidden="true">{c}</span>
                        <span className="sr-only">{largo}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {semanasDelMes(m.y, m.m).map((semana, si) => (
                    <tr key={si}>
                      {semana.map((d, di) => {
                        if (!d) return <td key={di} className={tema.celda} />;
                        const fuera = d < minDia || d > maxDia;
                        const est = fuera ? { deshabilitado: true, nota: undefined } : estado(d);
                        const inicio = d === desde;
                        const fin = d === hasta;
                        const info: InfoDia = {
                          dia: d,
                          deshabilitado: est.deshabilitado,
                          nota: est.nota,
                          hoy: d === hoy,
                          seleccionado: inicio || fin,
                          inicio,
                          fin,
                          enRango: Boolean(desde && finRango && d > desde && d < finRango),
                          enfocado: d === focoVisible,
                        };
                        const partesLabel = [fechaLarga(d)];
                        if (d === hoy) partesLabel.push("hoy");
                        if (est.nota) partesLabel.push(est.nota);
                        if (inicio && hasta !== undefined) partesLabel.push("inicio elegido");
                        if (fin) partesLabel.push("fin elegido");
                        return (
                          <td key={d} role="gridcell" aria-selected={info.seleccionado} className={tema.celda}>
                            <button
                              type="button"
                              data-dia={d}
                              tabIndex={info.enfocado ? 0 : -1}
                              aria-disabled={est.deshabilitado || undefined}
                              aria-current={d === hoy ? "date" : undefined}
                              aria-label={partesLabel.join(", ")}
                              className={tema.dia(info)}
                              onClick={() => {
                                setFoco(d);
                                if (!est.deshabilitado) onElegir(d);
                              }}
                              onMouseEnter={() => onEnfocar?.(d)}
                              onFocus={() => {
                                if (foco !== d) setFoco(d);
                                onEnfocar?.(d);
                              }}
                            >
                              {contenidoDia ? contenidoDia(info) : Number(d.slice(8))}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
