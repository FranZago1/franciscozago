"use client";

import { useRef, useState, type ReactNode } from "react";
import { Dialog } from "../shared/Dialog";
import { Icon } from "../shared/Icon";
import { ASESORES, ETAPAS, ORIGENES, USUARIO, ZONAS, type Etapa, type Operacion, type Origen, type Prioridad } from "./data";
import { useCrm, type ClienteInput } from "./context";
import { btn, input, label } from "./ui";

type Campos = {
  nombre: string;
  telefono: string;
  email: string;
  operacion: Operacion;
  presupuesto: string;
  zona: string;
  origen: Origen;
  asesor: string;
  etapa: Etapa;
  prioridad: Prioridad;
  notas: string;
};

type Errores = Partial<Record<keyof Campos, string>>;

const VACIO: Campos = {
  nombre: "",
  telefono: "",
  email: "",
  operacion: "Compra",
  presupuesto: "",
  zona: "Nueva Córdoba",
  origen: "Web",
  asesor: USUARIO,
  etapa: "nuevo",
  prioridad: "media",
  notas: "",
};

function validar(v: Campos): Errores {
  const e: Errores = {};
  if (v.nombre.trim().length < 3) e.nombre = "Ingresá nombre y apellido.";
  else if (!/\s/.test(v.nombre.trim())) e.nombre = "Falta el apellido.";
  const dig = v.telefono.replace(/\D/g, "");
  if (!dig) e.telefono = "El teléfono es obligatorio.";
  else if (dig.length < 8 || dig.length > 13) e.telefono = "Revisá el número: entre 8 y 13 dígitos.";
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "El email no parece válido.";
  const p = Number(v.presupuesto.replace(/\./g, "").replace(",", "."));
  if (!v.presupuesto) e.presupuesto = "Indicá un presupuesto aproximado.";
  else if (!Number.isFinite(p) || p <= 0) e.presupuesto = "Tiene que ser un número mayor a cero.";
  else if (v.operacion === "Compra" && p < 5000) e.presupuesto = "Para compras, cargalo en dólares (mínimo US$ 5.000).";
  return e;
}

export function FormCliente({
  open,
  id,
  onClose,
  onCreado,
}: {
  open: boolean;
  id?: string;
  onClose: () => void;
  onCreado: (id: string) => void;
}) {
  const { cliente } = useCrm();
  const c = id ? cliente(id) : undefined;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      titulo={c ? `Editar a ${c.nombre}` : "Nuevo cliente"}
      subtitulo={<p className="mt-0.5 text-sm text-[#64748B]">{c ? "Actualizá los datos del cliente." : "Los campos con * son obligatorios."}</p>}
      panelClassName="max-h-[92dvh] w-full rounded-t-2xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-2xl"
      overlayClassName="bg-[#0C3440]/40 backdrop-blur-[2px]"
      headerClassName="border-b border-[#E6EBF0] px-5 py-4 sm:px-6"
      tituloClassName="text-lg font-extrabold tracking-tight text-[#0C3440]"
      cerrarClassName="-mr-2 rounded-lg text-[#64748B] hover:bg-[#F1F5F8]"
    >
      {open ? <Formulario key={id ?? "nuevo"} idEdit={id} onClose={onClose} onCreado={onCreado} /> : null}
    </Dialog>
  );
}

function Formulario({ idEdit, onClose, onCreado }: { idEdit?: string; onClose: () => void; onCreado: (id: string) => void }) {
  const { cliente, guardarCliente } = useCrm();
  const c = idEdit ? cliente(idEdit) : undefined;
  const [v, setV] = useState<Campos>(
    c
      ? {
          nombre: c.nombre,
          telefono: c.telefono,
          email: c.email,
          operacion: c.operacion,
          presupuesto: String(c.presupuesto),
          zona: c.zona,
          origen: c.origen,
          asesor: c.asesor,
          etapa: c.etapa,
          prioridad: c.prioridad,
          notas: c.notas,
        }
      : VACIO,
  );
  const [err, setErr] = useState<Errores>({});
  const [enviado, setEnviado] = useState(false);
  const [estado, setEstado] = useState<"idle" | "guardando">("idle");
  const form = useRef<HTMLFormElement>(null);

  function set<K extends keyof Campos>(k: K, val: Campos[K]) {
    const nv = { ...v, [k]: val };
    setV(nv);
    if (enviado) setErr(validar(nv));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setEnviado(true);
    const errores = validar(v);
    setErr(errores);
    const primero = Object.keys(errores)[0];
    if (primero) {
      form.current?.querySelector<HTMLElement>(`[name="${primero}"]`)?.focus();
      return;
    }
    setEstado("guardando");
    window.setTimeout(() => {
      const data: ClienteInput = {
        nombre: v.nombre.trim().replace(/\s+/g, " "),
        telefono: v.telefono.trim(),
        email: v.email.trim(),
        operacion: v.operacion,
        presupuesto: Math.round(Number(v.presupuesto.replace(/\./g, "").replace(",", "."))),
        zona: v.zona,
        origen: v.origen,
        asesor: v.asesor,
        etapa: v.etapa,
        prioridad: v.prioridad,
        notas: v.notas,
      };
      const nuevoId = guardarCliente(data, idEdit);
      onClose();
      if (!idEdit) onCreado(nuevoId);
    }, 450);
  }

  const nErr = Object.keys(err).length;

  return (
    <form ref={form} onSubmit={submit} noValidate className="flex h-full flex-col">
      <div className="space-y-5 px-5 py-5 sm:px-6">
        {enviado && nErr > 0 ? (
          <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-[#F7C6C1] bg-[#FEF6F5] px-3.5 py-3 text-sm text-[#912018]">
            <Icon name="alert" className="mt-0.5 size-4 shrink-0" />
            <span>
              Revisá {nErr === 1 ? "1 campo" : `${nErr} campos`} antes de guardar.
            </span>
          </div>
        ) : null}

        <fieldset>
          <legend className="mb-3 text-[13px] font-bold uppercase tracking-[0.08em] text-[#64748B]">Contacto</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo id="f-nombre" label="Nombre y apellido *" error={err.nombre} className="sm:col-span-2">
              <input id="f-nombre" name="nombre" className={input} value={v.nombre} onChange={(e) => set("nombre", e.target.value)} autoComplete="off" placeholder="Ej.: Carolina Paredes" aria-invalid={!!err.nombre} aria-describedby={err.nombre ? "f-nombre-err" : undefined} data-autofocus />
            </Campo>
            <Campo id="f-telefono" label="Teléfono *" error={err.telefono}>
              <input id="f-telefono" name="telefono" type="tel" inputMode="tel" className={input} value={v.telefono} onChange={(e) => set("telefono", e.target.value)} placeholder="351 555-0000" aria-invalid={!!err.telefono} aria-describedby={err.telefono ? "f-telefono-err" : undefined} />
            </Campo>
            <Campo id="f-email" label="Email" error={err.email}>
              <input id="f-email" name="email" type="email" inputMode="email" className={input} value={v.email} onChange={(e) => set("email", e.target.value)} placeholder="nombre@correo.com" aria-invalid={!!err.email} aria-describedby={err.email ? "f-email-err" : undefined} />
            </Campo>
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-[13px] font-bold uppercase tracking-[0.08em] text-[#64748B]">Búsqueda</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className={label} id="f-op-label">Operación</span>
              <div role="radiogroup" aria-labelledby="f-op-label" className="grid grid-cols-2 gap-1 rounded-lg border border-[#D5DDE5] bg-[#F8FAFC] p-1">
                {(["Compra", "Alquiler"] as const).map((o) => (
                  <button
                    key={o}
                    type="button"
                    role="radio"
                    aria-checked={v.operacion === o}
                    onClick={() => set("operacion", o)}
                    className={`rounded-md py-1.5 text-sm font-bold transition ${v.operacion === o ? "bg-white text-[#0F4C5C] shadow-[0_1px_3px_rgba(15,23,42,.12)]" : "text-[#64748B] hover:text-[#0F172A]"}`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
            <Campo id="f-presupuesto" label={v.operacion === "Compra" ? "Presupuesto (US$) *" : "Presupuesto mensual ($) *"} error={err.presupuesto}>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#94A3B8]">
                  {v.operacion === "Compra" ? "US$" : "$"}
                </span>
                <input
                  id="f-presupuesto"
                  name="presupuesto"
                  inputMode="numeric"
                  className={`${input} ${v.operacion === "Compra" ? "pl-11" : "pl-7"} tabular-nums`}
                  value={v.presupuesto}
                  onChange={(e) => set("presupuesto", e.target.value.replace(/[^\d.,]/g, ""))}
                  placeholder={v.operacion === "Compra" ? "120000" : "550000"}
                  aria-invalid={!!err.presupuesto}
                  aria-describedby={err.presupuesto ? "f-presupuesto-err" : undefined}
                />
              </div>
            </Campo>
            <Campo id="f-zona" label="Zona de interés">
              <select id="f-zona" name="zona" className={input} value={v.zona} onChange={(e) => set("zona", e.target.value)}>
                {ZONAS.map((z) => <option key={z}>{z}</option>)}
              </select>
            </Campo>
            <Campo id="f-origen" label="¿Cómo nos conoció?">
              <select id="f-origen" name="origen" className={input} value={v.origen} onChange={(e) => set("origen", e.target.value as Origen)}>
                {ORIGENES.map((o) => <option key={o}>{o}</option>)}
              </select>
            </Campo>
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-[13px] font-bold uppercase tracking-[0.08em] text-[#64748B]">Seguimiento</legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <Campo id="f-etapa" label="Etapa">
              <select id="f-etapa" name="etapa" className={input} value={v.etapa} onChange={(e) => set("etapa", e.target.value as Etapa)}>
                {ETAPAS.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
              </select>
            </Campo>
            <Campo id="f-asesor" label="Asesor">
              <select id="f-asesor" name="asesor" className={input} value={v.asesor} onChange={(e) => set("asesor", e.target.value)}>
                {ASESORES.map((a) => <option key={a}>{a}</option>)}
              </select>
            </Campo>
            <Campo id="f-prio" label="Prioridad">
              <select id="f-prio" name="prioridad" className={input} value={v.prioridad} onChange={(e) => set("prioridad", e.target.value as Prioridad)}>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </Campo>
            <Campo id="f-notas" label="Notas" className="sm:col-span-3">
              <textarea id="f-notas" name="notas" rows={3} className={`${input} resize-y`} value={v.notas} onChange={(e) => set("notas", e.target.value)} placeholder="Lo que conviene recordar de este cliente" />
            </Campo>
          </div>
        </fieldset>
      </div>

      <div className="sticky bottom-0 mt-auto flex flex-col-reverse gap-2 border-t border-[#E6EBF0] bg-white/95 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:px-6">
        <p className="text-xs text-[#94A3B8] sm:mr-auto">Demo: los datos quedan solo en tu navegador.</p>
        <button type="button" className={btn.secundario} onClick={onClose}>Cancelar</button>
        <button type="submit" className={btn.primario} disabled={estado === "guardando"}>
          {estado === "guardando" ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" aria-hidden="true" /> Guardando…
            </>
          ) : (
            <>
              <Icon name="check" className="size-4" strokeWidth={2.4} /> {c ? "Guardar cambios" : "Crear cliente"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Campo({ id, label: txt, error, className = "", children }: { id: string; label: string; error?: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className={label}>{txt}</label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-[#B42318]">
          <Icon name="alert" className="size-3.5" strokeWidth={2.2} /> {error}
        </p>
      ) : null}
    </div>
  );
}
