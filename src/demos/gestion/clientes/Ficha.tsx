"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Dialog } from "../shared/Dialog";
import { Icon } from "../shared/Icon";
import { diaDiff, diaRelativo, fechaCorta, haceDias, hora, inputFecha, isoDe, pesos, pesosCorto, usd } from "../shared/util";
import { ETAPAS, PROPIEDADES, TIPOS_TAREA, propiedadDe, type Cliente, type Etapa, type TipoInteraccion, type TipoTarea } from "./data";
import { useCrm } from "./context";
import { Avatar, btn, EtapaBadge, ICONO_INTERACCION, ICONO_TAREA, input, label, PrioridadFlag, Seccion } from "./ui";

const TIPOS_REGISTRO: { id: TipoInteraccion; nombre: string }[] = [
  { id: "nota", nombre: "Nota" },
  { id: "llamada", nombre: "Llamada" },
  { id: "whatsapp", nombre: "WhatsApp" },
  { id: "email", nombre: "Email" },
  { id: "visita", nombre: "Visita" },
];

export function Ficha({ cliente, onClose }: { cliente: Cliente | undefined; onClose: () => void }) {
  return (
    <Dialog
      open={!!cliente}
      onClose={onClose}
      titulo={cliente?.nombre ?? "Ficha"}
      variante="derecha"
      panelClassName="h-full w-full max-w-[560px] bg-white shadow-[-24px_0_60px_-20px_rgba(12,52,64,.35)]"
      overlayClassName="bg-[#0C3440]/30 backdrop-blur-[1px]"
      headerClassName="absolute right-3 top-3 z-10"
      tituloClassName="sr-only"
      cerrarClassName="rounded-lg bg-white/80 text-[#475569] hover:bg-[#F1F5F8]"
    >
      {cliente ? <FichaContenido key={cliente.id} c={cliente} /> : null}
    </Dialog>
  );
}

function FichaContenido({ c }: { c: Cliente }) {
  const { now, moverEtapa, abrirForm, eliminarCliente, proximaTarea, completarTarea, posponerTarea, crearTarea, registrar, guardarNotas, togglePropiedad } = useCrm();
  const t = proximaTarea(c.id);
  const [agendando, setAgendando] = useState(false);
  const [tipoReg, setTipoReg] = useState<TipoInteraccion>("nota");
  const [textoReg, setTextoReg] = useState("");
  const [errReg, setErrReg] = useState("");
  const [notas, setNotas] = useState(c.notas);
  const [notasEstado, setNotasEstado] = useState<"" | "guardando" | "guardado">("");
  const [agregandoProp, setAgregandoProp] = useState(false);
  const [confirmarBorrar, setConfirmarBorrar] = useState(false);

  // Autoguardado de notas con pausa corta.
  useEffect(() => {
    if (notas === c.notas) return;
    setNotasEstado("guardando");
    const id = window.setTimeout(() => {
      guardarNotas(c.id, notas);
      setNotasEstado("guardado");
    }, 700);
    return () => window.clearTimeout(id);
  }, [notas, c.id, c.notas, guardarNotas]);

  const etapaIdx = ETAPAS.findIndex((e) => e.id === c.etapa);
  const restantes = PROPIEDADES.filter((p) => !c.propiedades.includes(p.id));

  return (
    <div className="pb-10">
      {/* Cabecera */}
      <div className="bg-gradient-to-b from-[#E7F0F2] to-white px-5 pb-5 pt-6 sm:px-6">
        <div className="flex items-start gap-4 pr-10">
          <Avatar nombre={c.nombre} size="lg" />
          <div className="min-w-0">
            <p className="text-xl font-extrabold tracking-tight text-[#0C3440]">{c.nombre}</p>
            <p className="mt-0.5 text-sm text-[#475569]">
              {c.operacion} · {c.zona} ·{" "}
              <span className="font-bold text-[#0F172A]">{c.operacion === "Compra" ? usd(c.presupuesto) : `${pesos(c.presupuesto)}/mes`}</span>
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <EtapaBadge etapa={c.etapa} />
              <span className="rounded-full bg-white px-2 py-0.5 ring-1 ring-[#E2E8F0]"><PrioridadFlag p={c.prioridad} conTexto /></span>
            </div>
          </div>
        </div>

        {/* Stepper de etapas */}
        <div className="mt-5">
          <p className="mb-2 text-xs font-bold text-[#64748B]" id="stepper-label">Etapa del embudo</p>
          <div role="radiogroup" aria-labelledby="stepper-label" className="grid grid-cols-5 gap-1">
            {ETAPAS.map((e, i) => {
              const hecho = i <= etapaIdx;
              return (
                <button
                  key={e.id}
                  type="button"
                  role="radio"
                  aria-checked={e.id === c.etapa}
                  onClick={() => moverEtapa(c.id, e.id as Etapa)}
                  className="group flex flex-col gap-1.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4C5C]"
                >
                  <span className={`h-1.5 rounded-full transition ${hecho ? "" : "bg-[#D5DDE5] group-hover:bg-[#B8C4D0]"}`} style={hecho ? { background: ETAPAS[etapaIdx]!.color } : undefined} />
                  <span className={`truncate text-[11px] font-bold ${e.id === c.etapa ? "text-[#0F172A]" : "text-[#94A3B8] group-hover:text-[#475569]"}`}>{e.nombre}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
          <button type="button" className={btn.secundario} onClick={() => { setTipoReg("llamada"); setTextoReg("Llamada: "); document.getElementById("reg-texto")?.focus(); }}>
            <Icon name="phone" className="size-4" /> <span className="sm:hidden">Llamada</span><span className="max-sm:hidden">Registrar llamada</span>
          </button>
          <button type="button" className={btn.secundario} onClick={() => { setTipoReg("whatsapp"); setTextoReg(""); document.getElementById("reg-texto")?.focus(); }}>
            <Icon name="chat" className="size-4" /> WhatsApp
          </button>
          <button type="button" className={btn.secundario} onClick={() => abrirForm(c.id)}>
            <Icon name="edit" className="size-4" /> Editar
          </button>
        </div>
      </div>

      {/* Próxima acción */}
      <Seccion
        titulo="Próxima acción"
        accion={
          t && !agendando ? (
            <button type="button" className={btn.fantasma} onClick={() => setAgendando(true)}>
              <Icon name="plus" className="size-4" /> Otra
            </button>
          ) : null
        }
      >
        {t && !agendando ? (
          <div
            className={`rounded-xl border p-3.5 ${diaDiff(t.fecha, now) < 0 ? "border-[#F7C6C1] bg-[#FEF6F5]" : diaDiff(t.fecha, now) === 0 ? "border-[#F4DDB0] bg-[#FFFAF0]" : "border-[#E2E8F0] bg-[#F8FAFC]"}`}
          >
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-[#0F4C5C] ring-1 ring-[#E2E8F0]">
                <Icon name={ICONO_TAREA[t.tipo]} className="size-[18px]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#0F172A]">{t.texto}</p>
                <p className={`mt-0.5 text-xs font-semibold ${diaDiff(t.fecha, now) < 0 ? "text-[#B42318]" : "text-[#64748B]"}`}>
                  {diaDiff(t.fecha, now) < 0 ? "Atrasada · " : ""}
                  {diaRelativo(t.fecha, now)} a las {hora(t.fecha)}
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button type="button" className={`${btn.primario} flex-1 sm:flex-none`} onClick={() => completarTarea(t.id)}>
                <Icon name="check" className="size-4" strokeWidth={2.4} /> Marcar hecha
              </button>
              <button type="button" className={`${btn.secundario} flex-1 sm:flex-none`} onClick={() => posponerTarea(t.id)}>
                Posponer 1 día
              </button>
            </div>
          </div>
        ) : agendando || !t ? (
          <AgendarInline
            now={now}
            sinTarea={!t}
            onCancel={t ? () => setAgendando(false) : undefined}
            onSave={(v) => {
              crearTarea({ clienteId: c.id, ...v });
              setAgendando(false);
            }}
          />
        ) : null}
      </Seccion>

      {/* Datos */}
      <Seccion titulo="Datos de contacto">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-sm sm:gap-x-6">
          <Dato icon="phone" k="Teléfono" v={c.telefono} />
          <Dato icon="mail" k="Email" v={c.email} />
          <Dato icon="dollar" k="Presupuesto" v={c.operacion === "Compra" ? usd(c.presupuesto) : `${pesos(c.presupuesto)} por mes`} />
          <Dato icon="flag" k="Origen" v={c.origen} />
          <Dato icon="user" k="Asesor" v={c.asesor} />
          <Dato icon="calendar" k="Cliente desde" v={`${fechaCorta(c.creado)} (${haceDias(c.creado, now)})`} />
        </dl>
      </Seccion>

      {/* Propiedades */}
      <Seccion
        titulo={`Propiedades de interés (${c.propiedades.length})`}
        accion={
          restantes.length ? (
            <button type="button" className={btn.fantasma} aria-expanded={agregandoProp} onClick={() => setAgregandoProp((v) => !v)}>
              <Icon name={agregandoProp ? "x" : "plus"} className="size-4" /> {agregandoProp ? "Cerrar" : "Agregar"}
            </button>
          ) : null
        }
      >
        {agregandoProp ? (
          <ul className="mb-3 max-h-64 space-y-1 overflow-y-auto rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-1.5" aria-label="Propiedades disponibles">
            {restantes.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => togglePropiedad(c.id, p.id)}
                  className="flex w-full items-center gap-3 rounded-lg p-1.5 text-left hover:bg-white"
                >
                  <Image src={`/demos/gestion/clientes/${p.img}.webp`} alt="" width={64} height={44} className="h-11 w-16 rounded-md object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">{p.titulo}</span>
                    <span className="block text-xs text-[#64748B]">{p.barrio} · {p.operacion === "Compra" ? usd(p.precio) : `${pesosCorto(p.precio)}/mes`}</span>
                  </span>
                  <Icon name="plus" className="size-4 text-[#0F4C5C]" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {c.propiedades.length ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {c.propiedades.map((pid) => {
              const p = propiedadDe(pid);
              if (!p) return null;
              return (
                <li key={pid} className="group overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={`/demos/gestion/clientes/${p.img}.webp`}
                      alt={`Ilustración: ${p.titulo} en ${p.barrio}`}
                      fill
                      sizes="(min-width: 640px) 250px, 90vw"
                      className="object-cover"
                    />
                    <span className="absolute left-2 top-2 rounded-md bg-white/90 px-1.5 py-0.5 text-[11px] font-bold text-[#0F4C5C] backdrop-blur">
                      {p.tipo}
                    </span>
                    <button
                      type="button"
                      onClick={() => togglePropiedad(c.id, pid)}
                      aria-label={`Quitar ${p.titulo}`}
                      className="absolute right-2 top-2 grid size-7 place-items-center rounded-md bg-white/90 text-[#475569] opacity-100 backdrop-blur transition hover:text-[#B42318] sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                    >
                      <Icon name="x" className="size-4" />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-bold">{p.titulo}</p>
                    <p className="mt-0.5 text-xs text-[#64748B]">
                      {p.barrio} · {p.ambientes ? `${p.ambientes} amb. · ` : ""}
                      {p.m2} m²
                    </p>
                    <p className="mt-1.5 text-sm font-extrabold tabular-nums text-[#0C3440]">
                      {p.operacion === "Compra" ? usd(p.precio) : `${pesos(p.precio)}/mes`}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="rounded-xl border border-dashed border-[#CBD5E1] px-4 py-5 text-center text-sm text-[#64748B]">
            Todavía no marcaste propiedades para este cliente.
          </p>
        )}
      </Seccion>

      {/* Actividad */}
      <Seccion titulo="Actividad">
        <form
          className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (textoReg.trim().length < 3) {
              setErrReg("Escribí al menos unas palabras.");
              document.getElementById("reg-texto")?.focus();
              return;
            }
            registrar(c.id, tipoReg, textoReg.trim());
            setTextoReg("");
            setErrReg("");
          }}
        >
          <div role="radiogroup" aria-label="Tipo de actividad" className="mb-2 flex flex-wrap gap-1">
            {TIPOS_REGISTRO.map((tp) => (
              <button
                key={tp.id}
                type="button"
                role="radio"
                aria-checked={tipoReg === tp.id}
                onClick={() => setTipoReg(tp.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition ${tipoReg === tp.id ? "bg-[#0F4C5C] text-white" : "bg-white text-[#475569] ring-1 ring-[#E2E8F0] hover:ring-[#B8C4D0]"}`}
              >
                <Icon name={ICONO_INTERACCION[tp.id]} className="size-3.5" />
                {tp.nombre}
              </button>
            ))}
          </div>
          <label htmlFor="reg-texto" className="sr-only">Detalle de la actividad</label>
          <textarea
            id="reg-texto"
            rows={2}
            value={textoReg}
            aria-invalid={!!errReg}
            aria-describedby={errReg ? "reg-err" : undefined}
            onChange={(e) => { setTextoReg(e.target.value); if (errReg) setErrReg(""); }}
            placeholder="¿Qué pasó? Ej.: Le interesa ver el dúplex el sábado."
            className={`${input} resize-none`}
          />
          <div className="mt-2 flex items-center justify-between gap-2">
            <p id="reg-err" className="text-xs font-semibold text-[#B42318]">{errReg}</p>
            <button type="submit" className={btn.primario}>Registrar</button>
          </div>
        </form>

        <ol className="relative mt-5 space-y-4 before:absolute before:bottom-2 before:left-[15px] before:top-2 before:w-px before:bg-[#E2E8F0]">
          {c.interacciones.map((it) => (
            <li key={it.id} className="relative flex gap-3">
              <span
                className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-full ring-4 ring-white ${it.tipo === "etapa" ? "bg-[#FBF1DF] text-[#B7791F]" : it.tipo === "alta" ? "bg-[#E5F4EA] text-[#15803D]" : "bg-[#E7F0F2] text-[#0F4C5C]"}`}
              >
                <Icon name={ICONO_INTERACCION[it.tipo]} className="size-4" />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm text-[#0F172A]">{it.texto}</p>
                <p className="mt-0.5 text-xs text-[#94A3B8]">
                  {diaRelativo(it.fecha, now)} · {hora(it.fecha)} · {it.autor}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Seccion>

      {/* Notas */}
      <Seccion
        titulo="Notas internas"
        accion={
          <span className="text-xs font-semibold text-[#64748B]" aria-live="polite">
            {notasEstado === "guardando" ? "Guardando…" : notasEstado === "guardado" ? "Guardado" : ""}
          </span>
        }
      >
        <label htmlFor="ficha-notas" className="sr-only">Notas internas</label>
        <textarea
          id="ficha-notas"
          rows={4}
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Preferencias, condiciones, familia, lo que haya que recordar…"
          className={`${input} resize-y bg-[#FFFDF5]`}
        />
      </Seccion>

      <div className="border-t border-[#E6EBF0] px-5 pt-5 sm:px-6">
        {confirmarBorrar ? (
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#FEF1F0] p-3">
            <p className="flex-1 text-sm font-semibold text-[#912018]">¿Eliminar a {c.nombre} y sus tareas?</p>
            <button type="button" className={btn.secundario} onClick={() => setConfirmarBorrar(false)}>Cancelar</button>
            <button type="button" className={btn.peligro} onClick={() => eliminarCliente(c.id)}>Eliminar</button>
          </div>
        ) : (
          <button type="button" className={`${btn.fantasma} text-[#B42318] hover:bg-[#FEF1F0] hover:text-[#912018]`} onClick={() => setConfirmarBorrar(true)}>
            <Icon name="trash" className="size-4" /> Eliminar cliente
          </button>
        )}
      </div>
    </div>
  );
}

function Dato({ icon, k, v }: { icon: Parameters<typeof Icon>[0]["name"]; k: string; v: string }) {
  return (
    <div className="flex min-w-0 gap-2.5">
      <Icon name={icon} className="mt-0.5 size-4 shrink-0 text-[#94A3B8]" />
      <div className="min-w-0">
        <dt className="text-xs font-semibold text-[#64748B]">{k}</dt>
        <dd className="truncate font-semibold text-[#0F172A]">{v}</dd>
      </div>
    </div>
  );
}

function AgendarInline({
  now,
  sinTarea,
  onSave,
  onCancel,
}: {
  now: number;
  sinTarea: boolean;
  onSave: (v: { tipo: TipoTarea; texto: string; fecha: string }) => void;
  onCancel?: () => void;
}) {
  const [tipo, setTipo] = useState<TipoTarea>("llamada");
  const [texto, setTexto] = useState("");
  const [fecha, setFecha] = useState(inputFecha(now + 86_400_000));
  const [horaTxt, setHora] = useState("10:00");
  const [err, setErr] = useState("");

  return (
    <form
      className="rounded-xl border border-dashed border-[#B8C4D0] p-3.5"
      onSubmit={(e) => {
        e.preventDefault();
        if (texto.trim().length < 3) {
          setErr("Contá qué hay que hacer.");
          return;
        }
        onSave({ tipo, texto: texto.trim(), fecha: isoDe(fecha, horaTxt) });
      }}
    >
      {sinTarea ? <p className="mb-3 text-sm font-semibold text-[#9A5B0B]">Este cliente no tiene próxima acción. Agendá una para no perderlo.</p> : null}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-[1fr_1fr_110px]">
        <div className="col-span-2 sm:col-span-1">
          <label className={label} htmlFor="ag-tipo">Tipo</label>
          <select id="ag-tipo" className={input} value={tipo} onChange={(e) => setTipo(e.target.value as TipoTarea)}>
            {TIPOS_TAREA.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="ag-fecha">Fecha</label>
          <input id="ag-fecha" type="date" className={input} value={fecha} min={inputFecha(now)} onChange={(e) => setFecha(e.target.value)} required />
        </div>
        <div>
          <label className={label} htmlFor="ag-hora">Hora</label>
          <input id="ag-hora" type="time" className={input} value={horaTxt} onChange={(e) => setHora(e.target.value)} required />
        </div>
      </div>
      <label className={`${label} mt-2.5`} htmlFor="ag-texto">Qué hay que hacer</label>
      <input
        id="ag-texto"
        className={input}
        value={texto}
        aria-invalid={!!err}
        aria-describedby={err ? "ag-err" : undefined}
        onChange={(e) => { setTexto(e.target.value); setErr(""); }}
        placeholder="Ej.: Llamar para confirmar la visita"
      />
      {err ? <p id="ag-err" className="mt-1 text-xs font-semibold text-[#B42318]">{err}</p> : null}
      <div className="mt-3 flex justify-end gap-2">
        {onCancel ? <button type="button" className={btn.secundario} onClick={onCancel}>Cancelar</button> : null}
        <button type="submit" className={btn.primario}><Icon name="calendar" className="size-4" /> Agendar</button>
      </div>
    </form>
  );
}
