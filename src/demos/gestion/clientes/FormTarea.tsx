"use client";

import { useState } from "react";
import { Dialog } from "../shared/Dialog";
import { Icon } from "../shared/Icon";
import { inputFecha, inputHora, isoDe } from "../shared/util";
import { TIPOS_TAREA, type TipoTarea } from "./data";
import { useCrm } from "./context";
import { btn, ICONO_TAREA, input, label } from "./ui";

export function FormTarea({ open, clienteId, onClose }: { open: boolean; clienteId?: string; onClose: () => void }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      titulo="Nueva tarea"
      subtitulo={<p className="mt-0.5 text-sm text-[#5F6E84]">Agendá la próxima acción con un cliente.</p>}
      panelClassName="max-h-[92dvh] w-full rounded-t-2xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl"
      overlayClassName="bg-[#0C3440]/40 backdrop-blur-[2px]"
      headerClassName="border-b border-[#E6EBF0] px-5 py-4 sm:px-6"
      tituloClassName="text-lg font-extrabold tracking-tight text-[#0C3440]"
      cerrarClassName="-mr-2 rounded-lg text-[#5F6E84] hover:bg-[#F1F5F8]"
    >
      {open ? <Form clienteId={clienteId} onClose={onClose} /> : null}
    </Dialog>
  );
}

function Form({ clienteId, onClose }: { clienteId?: string; onClose: () => void }) {
  const { state, now, crearTarea } = useCrm();
  const [cid, setCid] = useState(clienteId ?? "");
  const [tipo, setTipo] = useState<TipoTarea>("llamada");
  const [texto, setTexto] = useState("");
  const [fecha, setFecha] = useState(inputFecha(now));
  const en1h = new Date(now + 3_600_000);
  en1h.setMinutes(0);
  const [horaTxt, setHora] = useState(inputHora(en1h.getTime()));
  const [err, setErr] = useState<{ cid?: string; texto?: string }>({});

  const clientes = [...state.clientes].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const er: typeof err = {};
        if (!cid) er.cid = "Elegí un cliente.";
        if (texto.trim().length < 3) er.texto = "Describí la tarea.";
        setErr(er);
        if (er.cid) return document.getElementById("ft-cliente")?.focus();
        if (er.texto) return document.getElementById("ft-texto")?.focus();
        crearTarea({ clienteId: cid, tipo, texto: texto.trim(), fecha: isoDe(fecha, horaTxt) });
        onClose();
      }}
    >
      <div className="space-y-4 px-5 py-5 sm:px-6">
        <div>
          <label className={label} htmlFor="ft-cliente">Cliente *</label>
          <select id="ft-cliente" className={input} value={cid} onChange={(e) => { setCid(e.target.value); setErr((x) => ({ ...x, cid: undefined })); }} aria-invalid={!!err.cid} aria-describedby={err.cid ? "ft-cliente-err" : undefined} data-autofocus={!clienteId || undefined}>
            <option value="">Elegí un cliente…</option>
            {clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre} — {c.zona}</option>)}
          </select>
          {err.cid ? <p id="ft-cliente-err" className="mt-1.5 text-xs font-semibold text-[#B42318]">{err.cid}</p> : null}
        </div>
        <div>
          <span className={label} id="ft-tipo">Tipo</span>
          <div role="radiogroup" aria-labelledby="ft-tipo" className="grid grid-cols-5 gap-1.5">
            {TIPOS_TAREA.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={tipo === t.id}
                onClick={() => setTipo(t.id)}
                className={`flex flex-col items-center gap-1 rounded-lg border py-2 text-[11px] font-bold transition ${tipo === t.id ? "border-[#0F4C5C] bg-[#E7F0F2] text-[#0F4C5C]" : "border-[#E2E8F0] text-[#5F6E84] hover:border-[#B8C4D0]"}`}
              >
                <Icon name={ICONO_TAREA[t.id]} className="size-[18px]" />
                {t.nombre}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={label} htmlFor="ft-texto">Qué hay que hacer *</label>
          <input id="ft-texto" className={input} value={texto} onChange={(e) => { setTexto(e.target.value); setErr((x) => ({ ...x, texto: undefined })); }} placeholder="Ej.: Enviar tasación actualizada" aria-invalid={!!err.texto} aria-describedby={err.texto ? "ft-texto-err" : undefined} data-autofocus={clienteId ? true : undefined} />
          {err.texto ? <p id="ft-texto-err" className="mt-1.5 text-xs font-semibold text-[#B42318]">{err.texto}</p> : null}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label} htmlFor="ft-fecha">Fecha</label>
            <input id="ft-fecha" type="date" className={input} value={fecha} min={inputFecha(now)} onChange={(e) => setFecha(e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="ft-hora">Hora</label>
            <input id="ft-hora" type="time" className={input} value={horaTxt} onChange={(e) => setHora(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse gap-2 border-t border-[#E6EBF0] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
        <button type="button" className={btn.secundario} onClick={onClose}>Cancelar</button>
        <button type="submit" className={btn.primario}><Icon name="calendar" className="size-4" /> Agendar tarea</button>
      </div>
    </form>
  );
}
