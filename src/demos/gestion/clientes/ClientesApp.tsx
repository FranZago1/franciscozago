"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Dialog } from "../shared/Dialog";
import { Icon, type IconName } from "../shared/Icon";
import { usePersistentState, useNow, uid } from "../shared/store";
import { ToastProvider, useToast } from "../shared/Toasts";
import { diaDiff, normalizar } from "../shared/util";
import { crearSemilla, etapaDe, USUARIO, type Cliente, type CrmState, type Etapa } from "./data";
import { Ctx, type ClienteInput, type CrmCtx, type Vista } from "./context";
import { Embudo } from "./Embudo";
import { Ficha } from "./Ficha";
import { FormCliente } from "./FormCliente";
import { FormTarea } from "./FormTarea";
import { TablaClientes } from "./TablaClientes";
import { Tareas } from "./Tareas";
import { Avatar, btn, EtapaBadge } from "./ui";

export function ClientesApp() {
  return (
    <ToastProvider
      className="inset-x-3 top-3 items-center sm:inset-x-auto sm:bottom-28 sm:left-5 sm:top-auto sm:items-start"
      render={(t, cerrar) => (
        <div className="flex w-full max-w-sm items-center gap-3 rounded-xl border border-[#0B3D4A] bg-[#0C3440] py-2.5 pl-3.5 pr-2 text-sm text-white shadow-[0_12px_32px_-8px_rgba(12,52,64,.55)]">
          <span
            className={`grid size-6 shrink-0 place-items-center rounded-full ${t.tono === "error" ? "bg-[#D92D20]" : t.tono === "alerta" ? "bg-[#DC8A0E]" : "bg-[#2BB3A3]"}`}
          >
            <Icon name={t.tono === "ok" ? "check" : t.tono === "info" ? "arrow-right" : "alert"} className="size-3.5" strokeWidth={2.6} />
          </span>
          <span className="min-w-0 flex-1 font-medium">{t.texto}</span>
          {t.accion ? (
            <button
              type="button"
              onClick={() => {
                t.accion!.fn();
                cerrar();
              }}
              className="rounded-md px-2 py-1 text-sm font-bold text-[#7DD3C8] hover:bg-white/10"
            >
              {t.accion.label}
            </button>
          ) : null}
          <button type="button" onClick={cerrar} aria-label="Cerrar aviso" className="grid size-7 place-items-center rounded-md text-white/60 hover:bg-white/10 hover:text-white">
            <Icon name="x" className="size-4" />
          </button>
        </div>
      )}
    >
      <Crm />
    </ToastProvider>
  );
}

const NAV: { id: Vista; label: string; icon: IconName }[] = [
  { id: "embudo", label: "Embudo", icon: "kanban" },
  { id: "clientes", label: "Clientes", icon: "users" },
  { id: "tareas", label: "Tareas de hoy", icon: "tasks" },
];

function Crm() {
  const { state, update, reset } = usePersistentState<CrmState>("demo-gestion-clientes", 1, crearSemilla, "day");
  const now = useNow(30_000);
  const toast = useToast();

  const [vista, setVistaRaw] = useState<Vista>("embudo");
  const [busqueda, setBusqueda] = useState("");
  const [fichaId, setFichaId] = useState<string | null>(null);
  const [form, setForm] = useState<{ open: boolean; id?: string }>({ open: false });
  const [tareaForm, setTareaForm] = useState<{ open: boolean; clienteId?: string }>({ open: false });
  const [menu, setMenu] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // Vista recordada por visitante (conveniencia, no datos).
  useEffect(() => {
    try {
      const v = window.localStorage.getItem("demo-gestion-clientes-vista") as Vista | null;
      if (v && NAV.some((n) => n.id === v)) setVistaRaw(v);
    } catch {
      /* nada */
    }
  }, []);

  const setVista = useCallback((v: Vista) => {
    setVistaRaw(v);
    setMenu(false);
    try {
      window.localStorage.setItem("demo-gestion-clientes-vista", v);
    } catch {
      /* nada */
    }
    window.scrollTo({ top: 0 });
  }, []);

  const ctx = useMemo<CrmCtx | null>(() => {
    if (!state || !now) return null;
    const cliente = (id: string) => state.clientes.find((c) => c.id === id);

    const patch = (id: string, fn: (c: Cliente) => Cliente) =>
      update((s) => ({ ...s, clientes: s.clientes.map((c) => (c.id === id ? fn(c) : c)) }));

    const log = (c: Cliente, tipo: Cliente["interacciones"][number]["tipo"], texto: string): Cliente => {
      const fecha = new Date().toISOString();
      return {
        ...c,
        ultimoContacto: tipo === "etapa" || tipo === "nota" ? c.ultimoContacto : fecha,
        interacciones: [{ id: uid("i"), tipo, fecha, texto, autor: USUARIO }, ...c.interacciones],
      };
    };

    return {
      state,
      now,
      vista,
      setVista,
      busqueda,
      setBusqueda,
      cliente,
      abrirFicha: (id) => setFichaId(id),
      abrirForm: (id) => setForm({ open: true, id }),
      abrirNuevaTarea: (clienteId) => setTareaForm({ open: true, clienteId }),
      proximaTarea: (clienteId) =>
        state.tareas
          .filter((t) => t.clienteId === clienteId && !t.hecha)
          .sort((a, b) => a.fecha.localeCompare(b.fecha))[0],
      moverEtapa: (id, etapa) => {
        const c = cliente(id);
        if (!c || c.etapa === etapa) return;
        const previa = c.etapa;
        patch(id, (x) => log({ ...x, etapa }, "etapa", `Pasó de ${etapaDe(previa).nombre} a ${etapaDe(etapa).nombre}.`));
        toast(`${c.nombre} pasó a ${etapaDe(etapa).nombre}`, {
          tono: etapa === "cerrado" ? "ok" : "info",
          accion: {
            label: "Deshacer",
            fn: () => patch(id, (x) => ({ ...x, etapa: previa, interacciones: x.interacciones.slice(1) })),
          },
        });
      },
      guardarCliente: (data: ClienteInput, id?: string) => {
        if (id) {
          patch(id, (c) => ({ ...c, ...data }));
          toast("Cambios guardados");
          return id;
        }
        const nuevoId = uid("c");
        const fecha = new Date().toISOString();
        const nuevo: Cliente = {
          ...data,
          id: nuevoId,
          creado: fecha,
          ultimoContacto: fecha,
          propiedades: [],
          interacciones: [{ id: uid("i"), tipo: "alta", fecha, texto: `Alta del cliente (origen: ${data.origen}).`, autor: USUARIO }],
        };
        update((s) => ({ ...s, clientes: [nuevo, ...s.clientes] }));
        toast(`${data.nombre} se agregó al embudo`);
        return nuevoId;
      },
      eliminarCliente: (id) => {
        const c = cliente(id);
        if (!c) return;
        const snapshot = state;
        update((s) => ({
          clientes: s.clientes.filter((x) => x.id !== id),
          tareas: s.tareas.filter((t) => t.clienteId !== id),
        }));
        setFichaId(null);
        toast(`Se eliminó a ${c.nombre}`, { tono: "alerta", accion: { label: "Deshacer", fn: () => update(() => snapshot) } });
      },
      registrar: (id, tipo, texto) => {
        patch(id, (c) => log(c, tipo, texto));
        toast("Actividad registrada");
      },
      guardarNotas: (id, notas) => patch(id, (c) => ({ ...c, notas })),
      togglePropiedad: (id, pid) =>
        patch(id, (c) => ({
          ...c,
          propiedades: c.propiedades.includes(pid) ? c.propiedades.filter((p) => p !== pid) : [...c.propiedades, pid],
        })),
      crearTarea: (t) => {
        update((s) => ({ ...s, tareas: [...s.tareas, { ...t, id: uid("t"), hecha: false }] }));
        const c = cliente(t.clienteId);
        toast(`Tarea agendada${c ? ` para ${c.nombre}` : ""}`);
      },
      completarTarea: (tid) => {
        const t = state.tareas.find((x) => x.id === tid);
        if (!t) return;
        const fecha = new Date().toISOString();
        const tipoInt = t.tipo === "reunion" ? "visita" : t.tipo;
        update((s) => ({
          tareas: s.tareas.map((x) => (x.id === tid ? { ...x, hecha: true, hechaEn: fecha } : x)),
          clientes: s.clientes.map((c) => (c.id === t.clienteId ? log(c, tipoInt, `Hecho: ${t.texto}`) : c)),
        }));
        toast("Tarea completada", {
          accion: {
            label: "Deshacer",
            fn: () =>
              update((s) => ({
                tareas: s.tareas.map((x) => (x.id === tid ? { ...x, hecha: false, hechaEn: undefined } : x)),
                clientes: s.clientes.map((c) =>
                  c.id === t.clienteId ? { ...c, interacciones: c.interacciones.slice(1) } : c,
                ),
              })),
          },
        });
      },
      reabrirTarea: (tid) =>
        update((s) => ({ ...s, tareas: s.tareas.map((x) => (x.id === tid ? { ...x, hecha: false, hechaEn: undefined } : x)) })),
      posponerTarea: (tid) => {
        update((s) => ({
          ...s,
          tareas: s.tareas.map((x) => {
            if (x.id !== tid) return x;
            // Pasa al día siguiente a la misma hora (si estaba atrasada, a mañana).
            const d = new Date(x.fecha);
            const m = diaDiff(x.fecha, Date.now()) < 0 ? new Date() : new Date(d);
            m.setDate(m.getDate() + 1);
            m.setHours(d.getHours(), d.getMinutes(), 0, 0);
            return { ...x, fecha: m.toISOString() };
          }),
        }));
        toast("Tarea pospuesta para mañana", { tono: "info" });
      },
    };
  }, [state, now, vista, setVista, busqueda, update, toast]);

  const pendientesHoy = state && now ? state.tareas.filter((t) => !t.hecha && diaDiff(t.fecha, now) <= 0).length : 0;
  const activos = state ? state.clientes.filter((c) => c.etapa !== "cerrado").length : 0;
  const counts: Record<Vista, number | null> = {
    embudo: state ? activos : null,
    clientes: state ? state.clientes.length : null,
    tareas: state ? pendientesHoy : null,
  };

  const fichaCliente = fichaId && state ? state.clientes.find((c) => c.id === fichaId) : undefined;

  const sidebar = (
    <nav aria-label="Secciones del CRM" className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 pb-6 pt-5">
        <Logo />
        <div className="leading-tight">
          <p className="text-[15px] font-extrabold tracking-tight text-[#0C3440]">Portal Sur</p>
          <p className="text-xs font-medium text-[#5F6E84]">Inmobiliaria · CRM</p>
        </div>
      </div>
      <p className="px-5 pb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#677180]">Gestión</p>
      <ul className="space-y-0.5 px-3">
        {NAV.map((n) => {
          const activo = vista === n.id;
          return (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => setVista(n.id)}
                aria-current={activo ? "page" : undefined}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${activo ? "bg-[#E7F0F2] text-[#0C3440]" : "text-[#475569] hover:bg-[#F1F5F8] hover:text-[#0F172A]"}`}
              >
                <Icon name={n.icon} className={`size-[18px] ${activo ? "text-[#0F4C5C]" : "text-[#94A3B8] group-hover:text-[#5F6E84]"}`} />
                <span className="flex-1 text-left">{n.label}</span>
                {counts[n.id] !== null ? (
                  <span
                    className={`min-w-6 rounded-full px-1.5 py-0.5 text-center text-[11px] font-bold tabular-nums ${n.id === "tareas" && (counts[n.id] ?? 0) > 0 ? "bg-[#0F4C5C] text-white" : "bg-[#EEF2F6] text-[#5F6E84]"}`}
                  >
                    {counts[n.id]}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="px-5 pb-2 pt-7 text-[11px] font-bold uppercase tracking-[0.12em] text-[#677180]">Atajos</p>
      <ul className="space-y-0.5 px-3">
        <li>
          <button type="button" onClick={() => { setMenu(false); setForm({ open: true }); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-[#475569] hover:bg-[#F1F5F8] hover:text-[#0F172A]">
            <Icon name="plus" className="size-[18px] text-[#94A3B8]" /> Nuevo cliente
          </button>
        </li>
        <li>
          <button type="button" onClick={() => { setMenu(false); setTareaForm({ open: true }); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-[#475569] hover:bg-[#F1F5F8] hover:text-[#0F172A]">
            <Icon name="calendar" className="size-[18px] text-[#94A3B8]" /> Nueva tarea
          </button>
        </li>
      </ul>
      <div className="mt-auto p-4">
        <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
          <p className="text-xs font-bold text-[#0F172A]">Demo con datos ficticios</p>
          <p className="mt-1 text-xs leading-relaxed text-[#5F6E84]">Tus cambios se guardan solo en este navegador.</p>
          <button type="button" onClick={() => setConfirmReset(true)} className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-[#0F4C5C] hover:underline">
            <Icon name="refresh" className="size-3.5" strokeWidth={2.2} /> Restablecer demo
          </button>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-dvh bg-[#F3F5F7] text-[#0F172A] [font-family:var(--font-crm)]">
      <div className="lg:grid lg:grid-cols-[252px_minmax(0,1fr)]">
        <div className="hidden border-r border-[#E2E8F0] bg-white lg:block">
          <aside className="sticky top-0 h-dvh overflow-y-auto">{sidebar}</aside>
        </div>

        <div className="min-w-0">
          <Topbar
            onMenu={() => setMenu(true)}
            ctx={ctx}
            pendientes={pendientesHoy}
            onNuevo={() => setForm({ open: true })}
            vistaLabel={NAV.find((n) => n.id === vista)!.label}
          />
          <main ref={mainRef} id="contenido" className="px-4 pb-36 pt-5 sm:px-6 lg:px-8 lg:pt-7">
            {ctx ? (
              <Ctx.Provider value={ctx}>
                {vista === "embudo" ? <Embudo /> : vista === "clientes" ? <TablaClientes /> : <Tareas />}
                <FooterDemo />
              </Ctx.Provider>
            ) : (
              <Esqueleto />
            )}
          </main>
        </div>
      </div>

      <Dialog
        open={menu}
        onClose={() => setMenu(false)}
        titulo="Menú"
        variante="izquierda"
        panelClassName="h-full w-[84vw] max-w-[300px] bg-white shadow-2xl"
        headerClassName="absolute right-2 top-3 z-10"
        tituloClassName="sr-only"
        cerrarClassName="rounded-lg text-[#5F6E84] hover:bg-[#F1F5F8]"
        overlayClassName="bg-[#0C3440]/40 backdrop-blur-[2px]"
      >
        {sidebar}
      </Dialog>

      {ctx ? (
        <Ctx.Provider value={ctx}>
          <Ficha cliente={fichaCliente} onClose={() => setFichaId(null)} />
          <FormCliente
            open={form.open}
            id={form.id}
            onClose={() => setForm({ open: false })}
            onCreado={(id) => setFichaId(id)}
          />
          <FormTarea open={tareaForm.open} clienteId={tareaForm.clienteId} onClose={() => setTareaForm({ open: false })} />
        </Ctx.Provider>
      ) : null}

      <Dialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        titulo="¿Restablecer la demo?"
        panelClassName="w-full rounded-t-2xl bg-white p-6 shadow-2xl sm:max-w-md sm:rounded-2xl"
        tituloClassName="text-lg font-bold text-[#0F172A]"
        cerrarClassName="-mr-2 -mt-1 rounded-lg text-[#5F6E84] hover:bg-[#F1F5F8]"
        footerClassName="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
        footer={
          <>
            <button type="button" className={btn.secundario} onClick={() => setConfirmReset(false)}>
              Cancelar
            </button>
            <button
              type="button"
              className={btn.primario}
              onClick={() => {
                reset();
                setConfirmReset(false);
                setFichaId(null);
                setMenu(false);
                toast("Demo restablecida con los datos de ejemplo", { tono: "info" });
              }}
            >
              Sí, restablecer
            </button>
          </>
        }
      >
        <p className="mt-2 text-sm leading-relaxed text-[#475569]">
          Se borran los clientes, tareas y notas que agregaste, y vuelven los datos de ejemplo.
        </p>
      </Dialog>
    </div>
  );
}

function Logo() {
  return (
    <svg viewBox="0 0 40 40" className="size-9" aria-hidden="true">
      <rect width="40" height="40" rx="10" fill="#0F4C5C" />
      <path d="M9 21.5L20 12l11 9.5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 20v9h14v-9" fill="none" stroke="#7DD3C8" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M18 29v-5h4v5" fill="#7DD3C8" />
    </svg>
  );
}

function Topbar({
  onMenu,
  ctx,
  pendientes,
  onNuevo,
  vistaLabel,
}: {
  onMenu: () => void;
  ctx: CrmCtx | null;
  pendientes: number;
  onNuevo: () => void;
  vistaLabel: string;
}) {
  const [q, setQ] = useState("");
  const [abierto, setAbierto] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  const resultados = useMemo(() => {
    if (!ctx || q.trim().length < 1) return [];
    const n = normalizar(q.trim());
    return ctx.state.clientes
      .filter((c) => normalizar(`${c.nombre} ${c.email} ${c.telefono} ${c.zona}`).includes(n))
      .slice(0, 6);
  }, [ctx, q]);

  useEffect(() => {
    function fuera(e: MouseEvent) {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setAbierto(false);
    }
    document.addEventListener("mousedown", fuera);
    return () => document.removeEventListener("mousedown", fuera);
  }, []);

  function elegir(c: Cliente) {
    ctx?.abrirFicha(c.id);
    setAbierto(false);
    setQ("");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/90 backdrop-blur-md">
      <div className="flex h-16 items-center gap-2 px-3 sm:gap-3 sm:px-6 lg:px-8">
        <button type="button" onClick={onMenu} className={`${btn.icono} lg:hidden`} aria-label="Abrir menú">
          <Icon name="menu" />
        </button>
        <p className="hidden text-sm font-bold text-[#0F172A] sm:block lg:hidden">{vistaLabel}</p>

        <div ref={wrap} className="relative min-w-0 flex-1 sm:max-w-md lg:max-w-lg">
          <label htmlFor="crm-buscar" className="sr-only">
            Buscar clientes
          </label>
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            id="crm-buscar"
            type="search"
            value={q}
            autoComplete="off"
            onChange={(e) => {
              setQ(e.target.value);
              setAbierto(true);
            }}
            onFocus={() => setAbierto(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && resultados[0]) {
                e.preventDefault();
                elegir(resultados[0]);
              }
              if (e.key === "Escape") {
                setQ("");
                setAbierto(false);
              }
              if (e.key === "ArrowDown" && resultados.length) {
                e.preventDefault();
                wrap.current?.querySelector<HTMLButtonElement>("[data-res]")?.focus();
              }
            }}
            placeholder="Buscar cliente, teléfono o zona…"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={abierto && q.length > 0}
            aria-controls="crm-resultados"
            className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-9 pr-3 text-sm placeholder:text-[#94A3B8] transition focus:border-[#0F4C5C] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#0F4C5C]/15"
          />
          {abierto && q.trim().length > 0 ? (
            <div
              id="crm-resultados"
              className="absolute inset-x-0 top-12 z-50 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_16px_40px_-12px_rgba(15,23,42,.25)]"
              onKeyDown={(e) => {
                const items = Array.from(wrap.current?.querySelectorAll<HTMLButtonElement>("[data-res]") ?? []);
                const i = items.indexOf(document.activeElement as HTMLButtonElement);
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  items[Math.min(i + 1, items.length - 1)]?.focus();
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  if (i <= 0) wrap.current?.querySelector("input")?.focus();
                  else items[i - 1]?.focus();
                } else if (e.key === "Escape") {
                  setAbierto(false);
                  wrap.current?.querySelector("input")?.focus();
                }
              }}
            >
              {resultados.length ? (
                <ul>
                  {resultados.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        data-res
                        onClick={() => elegir(c)}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-[#F1F5F8] focus:bg-[#F1F5F8] focus:outline-none"
                      >
                        <Avatar nombre={c.nombre} size="sm" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{c.nombre}</span>
                          <span className="block truncate text-xs text-[#5F6E84]">
                            {c.operacion} · {c.zona}
                          </span>
                        </span>
                        <EtapaBadge etapa={c.etapa as Etapa} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-5 text-center text-sm text-[#5F6E84]">No hay clientes que coincidan con “{q}”.</p>
              )}
            </div>
          ) : null}
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button type="button" onClick={onNuevo} className={`${btn.primario} max-sm:size-10 max-sm:px-0`}>
            <Icon name="plus" className="size-4" strokeWidth={2.4} />
            <span className="max-sm:sr-only">Nuevo cliente</span>
          </button>
          <button
            type="button"
            onClick={() => ctx?.setVista("tareas")}
            className={`${btn.icono} relative`}
            aria-label={`Tareas pendientes para hoy: ${pendientes}`}
          >
            <Icon name="bell" />
            {pendientes > 0 ? (
              <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-[#D92D20] px-1 text-[10px] font-bold leading-4 text-white ring-2 ring-white">
                {pendientes}
              </span>
            ) : null}
          </button>
          <div className="hidden items-center gap-2.5 border-l border-[#E2E8F0] pl-3 md:flex">
            <Avatar nombre={USUARIO} />
            <div className="leading-tight">
              <p className="text-sm font-bold">{USUARIO}</p>
              <p className="text-xs text-[#5F6E84]">Asesora comercial</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Esqueleto() {
  return (
    <div aria-busy="true" aria-label="Cargando" className="animate-pulse motion-reduce:animate-none">
      <div className="h-8 w-48 rounded-lg bg-[#E2E8F0]" />
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-[#E8EDF2]" />
        ))}
      </div>
      <div className="mt-6 grid gap-3 lg:grid-cols-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-80 rounded-xl bg-[#E8EDF2]" />
        ))}
      </div>
    </div>
  );
}

export function FooterDemo(): ReactNode {
  return (
    <footer className="mt-12 flex flex-wrap items-center justify-between gap-2 border-t border-[#E2E8F0] pt-5 text-xs text-[#5F6E84]">
      <p>Demo con contenido ficticio · Inmobiliaria Portal Sur no existe.</p>
      <p>Personas, propiedades y precios inventados.</p>
    </footer>
  );
}
