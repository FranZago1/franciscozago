"use client";

import { useId, useState } from "react";
import { Dialog } from "../shared/Dialog";
import { COLUMNAS, ETIQUETAS, PERSONAS, PRIORIDADES, type ColumnaId, type Tarea } from "./data";
import { IconCheck, IconFlag, IconPlus, IconTrash, IconX } from "./icons";
import { Avatar } from "./ui";

export type EdicionTarea = { tarea: Tarea; columna: ColumnaId; nueva: boolean };

const input =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[14px] text-zinc-900 shadow-[0_1px_0_rgba(0,0,0,0.02)] outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-[#5B5BF7] focus:ring-4 focus:ring-[#5B5BF7]/15";
const label = "mb-1.5 block text-[12.5px] font-semibold text-zinc-700";

export function TaskModal({
  edicion,
  onClose,
  onGuardar,
  onBorrar,
}: {
  edicion: EdicionTarea | null;
  onClose: () => void;
  onGuardar: (t: Tarea, col: ColumnaId, nueva: boolean) => void;
  onBorrar: (id: string) => void;
}) {
  return (
    <Dialog
      abierto={!!edicion}
      onClose={onClose}
      labelledBy="tm-titulo"
      overlayClassName="bg-zinc-950/35 backdrop-blur-[2px] p-0 sm:p-6"
      className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-white font-[family-name:var(--font-tb-body)] [&_:focus-visible]:outline-[#5B5BF7] shadow-[0_24px_80px_-12px_rgba(24,24,27,0.35)] outline-none sm:max-w-[640px] sm:rounded-2xl"
      initialFocus="#tm-input-titulo"
    >
      {edicion && (
        <Form key={edicion.tarea.id} edicion={edicion} onClose={onClose} onGuardar={onGuardar} onBorrar={onBorrar} />
      )}
    </Dialog>
  );
}

function Form({
  edicion,
  onClose,
  onGuardar,
  onBorrar,
}: {
  edicion: EdicionTarea;
  onClose: () => void;
  onGuardar: (t: Tarea, col: ColumnaId, nueva: boolean) => void;
  onBorrar: (id: string) => void;
}) {
  const [t, setT] = useState<Tarea>(() => ({ ...edicion.tarea, checklist: edicion.tarea.checklist.map((c) => ({ ...c })) }));
  const [col, setCol] = useState<ColumnaId>(edicion.columna);
  const [error, setError] = useState("");
  const [nuevoItem, setNuevoItem] = useState("");
  const [confirmarBorrar, setConfirmarBorrar] = useState(false);
  const uid = useId();

  const set = <K extends keyof Tarea>(k: K, v: Tarea[K]) => setT((x) => ({ ...x, [k]: v }));

  const agregarItem = () => {
    const texto = nuevoItem.trim();
    if (!texto) return;
    set("checklist", [...t.checklist, { id: `c${Date.now().toString(36)}`, texto, hecho: false }]);
    setNuevoItem("");
  };

  const guardar = (e: React.FormEvent) => {
    e.preventDefault();
    const titulo = t.titulo.trim();
    if (titulo.length < 3) {
      setError(titulo ? "El título tiene que tener al menos 3 letras." : "Poné un título para la tarea.");
      document.getElementById("tm-input-titulo")?.focus();
      return;
    }
    onGuardar({ ...t, titulo, descripcion: t.descripcion.trim() }, col, edicion.nueva);
  };

  const hechos = t.checklist.filter((c) => c.hecho).length;

  return (
    <form onSubmit={guardar} noValidate className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between gap-3 border-b border-zinc-100 px-5 py-4 sm:px-6">
        <div>
          <p className="text-[12px] font-medium text-zinc-500">{edicion.nueva ? "Nueva tarea" : "Editar tarea"}</p>
          <h2 id="tm-titulo" className="font-[family-name:var(--font-tb-head)] text-[18px] font-semibold tracking-tight text-zinc-900">
            {edicion.nueva ? "Crear tarea" : t.titulo || "Tarea sin título"}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid size-9 place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
          aria-label="Cerrar"
        >
          <IconX className="size-5" />
        </button>
      </header>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
        <div>
          <label htmlFor="tm-input-titulo" className={label}>
            Título <span className="text-[#5B5BF7]">*</span>
          </label>
          <input
            id="tm-input-titulo"
            className={`${input} ${error ? "border-[#E5484D] focus:border-[#E5484D] focus:ring-[#E5484D]/15" : ""}`}
            value={t.titulo}
            onChange={(e) => {
              set("titulo", e.target.value);
              if (error) setError("");
            }}
            placeholder="Ej.: Diseñar flyer para la feria"
            aria-invalid={!!error}
            aria-describedby={error ? `${uid}-err` : undefined}
            maxLength={120}
            autoComplete="off"
          />
          {error && (
            <p id={`${uid}-err`} role="alert" className="mt-1.5 text-[12.5px] font-medium text-[#C62A2F]">
              {error}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${uid}-desc`} className={label}>
            Descripción
          </label>
          <textarea
            id={`${uid}-desc`}
            className={`${input} min-h-20 resize-y`}
            value={t.descripcion}
            onChange={(e) => set("descripcion", e.target.value)}
            placeholder="Contexto, links, lo que haga falta."
            rows={3}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${uid}-col`} className={label}>
              Columna
            </label>
            <select id={`${uid}-col`} className={input} value={col} onChange={(e) => setCol(e.target.value as ColumnaId)}>
              {COLUMNAS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${uid}-fecha`} className={label}>
              Fecha límite
            </label>
            <input id={`${uid}-fecha`} type="date" className={input} value={t.fecha} onChange={(e) => set("fecha", e.target.value)} />
          </div>
        </div>

        <fieldset>
          <legend className={label}>Responsable</legend>
          <div className="flex flex-wrap gap-2">
            {[null, ...PERSONAS].map((p) => {
              const activo = t.responsable === (p?.id ?? null);
              return (
                <label
                  key={p?.id ?? "nadie"}
                  className={`flex cursor-pointer items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-[13px] transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[#5B5BF7]/25 ${
                    activo ? "border-[#5B5BF7] bg-[#F1F0FF] text-zinc-900" : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={`${uid}-resp`}
                    className="sr-only"
                    checked={activo}
                    onChange={() => set("responsable", p?.id ?? null)}
                  />
                  <Avatar p={p} size="sm" />
                  {p ? p.nombre.split(" ")[0] : "Nadie"}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
          <fieldset>
            <legend className={label}>Etiquetas</legend>
            <div className="flex flex-wrap gap-1.5">
              {ETIQUETAS.map((e) => {
                const activo = t.etiquetas.includes(e.id);
                return (
                  <label
                    key={e.id}
                    className="flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1 text-[12.5px] font-semibold transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[#5B5BF7]/25"
                    style={
                      activo
                        ? { background: e.fondo, color: e.texto, borderColor: e.punto }
                        : { borderColor: "#E4E4E7", color: "#52525B" }
                    }
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={activo}
                      onChange={() =>
                        set("etiquetas", activo ? t.etiquetas.filter((x) => x !== e.id) : [...t.etiquetas, e.id])
                      }
                    />
                    {activo ? <IconCheck className="size-3.5" /> : <span className="size-2 rounded-full" style={{ background: e.punto }} aria-hidden="true" />}
                    {e.nombre}
                  </label>
                );
              })}
            </div>
          </fieldset>
          <fieldset>
            <legend className={label}>Prioridad</legend>
            <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-0.5">
              {PRIORIDADES.map((p) => {
                const activo = t.prioridad === p.id;
                return (
                  <label
                    key={p.id}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12.5px] font-semibold transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[#5B5BF7]/25 ${
                      activo ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    <input type="radio" name={`${uid}-prio`} className="sr-only" checked={activo} onChange={() => set("prioridad", p.id)} />
                    <IconFlag color={p.color} className="size-3.5" />
                    {p.nombre}
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        <fieldset>
          <legend className={`${label} flex w-full items-center justify-between`}>
            <span>Checklist</span>
            {t.checklist.length > 0 && (
              <span className="font-medium text-zinc-500">
                {hechos} de {t.checklist.length}
              </span>
            )}
          </legend>
          {t.checklist.length > 0 && (
            <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-[#10B981] transition-[width] duration-300"
                style={{ width: `${(hechos / t.checklist.length) * 100}%` }}
              />
            </div>
          )}
          <ul className="space-y-1">
            {t.checklist.map((c) => (
              <li key={c.id} className="group flex items-center gap-2 rounded-lg px-1 py-0.5 hover:bg-zinc-50">
                <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 py-1 text-[14px]">
                  <input
                    type="checkbox"
                    checked={c.hecho}
                    onChange={() =>
                      set(
                        "checklist",
                        t.checklist.map((x) => (x.id === c.id ? { ...x, hecho: !x.hecho } : x)),
                      )
                    }
                    className="size-4 shrink-0 accent-[#5B5BF7]"
                  />
                  <span className={`min-w-0 break-words ${c.hecho ? "text-zinc-400 line-through" : "text-zinc-800"}`}>{c.texto}</span>
                </label>
                <button
                  type="button"
                  onClick={() => set("checklist", t.checklist.filter((x) => x.id !== c.id))}
                  className="grid size-7 shrink-0 place-items-center rounded-md text-zinc-400 opacity-100 transition hover:bg-zinc-100 hover:text-[#C62A2F] sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                  aria-label={`Quitar "${c.texto}"`}
                >
                  <IconX className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex gap-2">
            <label htmlFor={`${uid}-item`} className="sr-only">
              Nuevo ítem de la checklist
            </label>
            <input
              id={`${uid}-item`}
              className={input}
              value={nuevoItem}
              onChange={(e) => setNuevoItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  agregarItem();
                }
              }}
              placeholder="Agregar ítem y apretar Enter"
              maxLength={80}
            />
            <button
              type="button"
              onClick={agregarItem}
              className="flex shrink-0 items-center gap-1 rounded-lg border border-zinc-200 px-3 text-[13px] font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              <IconPlus className="size-4" /> Agregar
            </button>
          </div>
        </fieldset>
      </div>

      <footer className="flex flex-wrap items-center gap-2 border-t border-zinc-100 bg-zinc-50/70 px-5 py-3.5 sm:px-6">
        {!edicion.nueva &&
          (confirmarBorrar ? (
            <div className="flex items-center gap-2 text-[13px]" role="group" aria-label="Confirmar borrado">
              <span className="font-medium text-zinc-700">¿Borrar la tarea?</span>
              <button
                type="button"
                onClick={() => onBorrar(t.id)}
                className="rounded-lg bg-[#E5484D] px-3 py-1.5 font-semibold text-white transition hover:bg-[#D13C41]"
              >
                Sí, borrar
              </button>
              <button type="button" onClick={() => setConfirmarBorrar(false)} className="rounded-lg px-2 py-1.5 font-medium text-zinc-600 hover:bg-zinc-100">
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmarBorrar(true)}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold text-[#C62A2F] transition hover:bg-[#FDECEC]"
            >
              <IconTrash className="size-4" /> Borrar
            </button>
          ))}
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-[13.5px] font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-lg bg-[#5B5BF7] px-4 py-2 text-[13.5px] font-semibold text-white shadow-[0_1px_2px_rgba(91,91,247,0.4),inset_0_1px_0_rgba(255,255,255,0.18)] transition hover:bg-[#4B4BE6] active:translate-y-px"
          >
            {edicion.nueva ? "Crear tarea" : "Guardar cambios"}
          </button>
        </div>
      </footer>
    </form>
  );
}
