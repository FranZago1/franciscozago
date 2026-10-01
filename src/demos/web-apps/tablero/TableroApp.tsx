"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Dialog } from "../shared/Dialog";
import { useAvisos, usePersistentState } from "../shared/hooks";
import {
  COLUMNAS,
  ETIQUETAS,
  PERSONAS,
  PRIORIDADES,
  crearTablero,
  diasHasta,
  esTablero,
  etiqueta,
  nuevaTareaVacia,
  persona,
  type ColumnaId,
  type Prioridad,
  type Tablero,
  type Tarea,
} from "./data";
import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconBoard,
  IconChart,
  IconChecklist,
  IconDots,
  IconFilter,
  IconFlag,
  IconKeyboard,
  IconList,
  IconMenu,
  IconPencil,
  IconPlus,
  IconReset,
  IconSearch,
  IconTrash,
  IconX,
  LogoBrujula,
} from "./icons";
import { TaskModal, type EdicionTarea } from "./TaskModal";
import { Avatar, AvatarDe, Chip, FechaChip } from "./ui";

type Filtros = { q: string; personas: string[]; etiquetas: string[]; prioridades: Prioridad[] };
const FILTROS_VACIOS: Filtros = { q: "", personas: [], etiquetas: [], prioridades: [] };
type Vista = "tablero" | "lista";
type Drag = { id: string; over: ColumnaId; index: number };
type Menu = { id: string; top: number; left: number; trigger: HTMLElement };

const ACENTO = "#5B5BF7";

function columnaDe(tab: Tablero, id: string): ColumnaId {
  return (COLUMNAS.find((c) => tab.columnas[c.id].includes(id))?.id ?? "ideas") as ColumnaId;
}

/** Mueve una tarea a `destino`, antes de `antesDe` (o después de `despuesDe` si no hay). */
function mover(tab: Tablero, id: string, destino: ColumnaId, antesDe: string | null, despuesDe: string | null): Tablero {
  const columnas = { ...tab.columnas };
  for (const c of COLUMNAS) columnas[c.id] = columnas[c.id].filter((x) => x !== id);
  const lista = [...columnas[destino]];
  let pos = lista.length;
  if (antesDe && lista.includes(antesDe)) pos = lista.indexOf(antesDe);
  else if (despuesDe && lista.includes(despuesDe)) pos = lista.indexOf(despuesDe) + 1;
  lista.splice(pos, 0, id);
  columnas[destino] = lista;
  return { ...tab, columnas };
}

function coincide(t: Tarea, f: Filtros) {
  if (f.personas.length && !f.personas.includes(t.responsable ?? "__nadie")) return false;
  if (f.etiquetas.length && !t.etiquetas.some((e) => f.etiquetas.includes(e))) return false;
  if (f.prioridades.length && !f.prioridades.includes(t.prioridad)) return false;
  const q = f.q
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  if (!q) return true;
  const texto = [t.titulo, t.descripcion, persona(t.responsable)?.nombre ?? "", ...t.etiquetas.map((e) => etiqueta(e)?.nombre ?? "")]
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  return q.split(/\s+/).every((p) => texto.includes(p));
}

const sinSuscripcion = () => () => {};

/**
 * Las fechas del tablero se calculan relativas a hoy, así que el HTML estático (generado el día del build)
 * no coincidiría con el cliente. Se renderiza recién después de montar.
 */
export function TableroApp() {
  const montado = useSyncExternalStore(sinSuscripcion, () => true, () => false);
  if (!montado) {
    return (
      <div className="grid min-h-dvh place-items-center text-sm text-zinc-500" role="status">
        Cargando tablero…
      </div>
    );
  }
  return <TableroInterno />;
}

function TableroInterno() {
  const [tab, setTab, resetTab] = usePersistentState<Tablero>("fz-demo-tablero-v1", crearTablero, esTablero);
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VACIOS);
  const [vista, setVista] = useState<Vista>("tablero");
  const [resumen, setResumen] = useState(true);
  const [edicion, setEdicion] = useState<EdicionTarea | null>(null);
  const [sidebar, setSidebar] = useState(false);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [confirmarReset, setConfirmarReset] = useState(false);
  const { avisos, avisar, cerrar } = useAvisos();
  const buscarRef = useRef<HTMLInputElement>(null);
  const focoPendiente = useRef<string | null>(null);

  // En pantallas chicas el resumen arranca plegado para dejar lugar al tablero.
  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) setResumen(false);
  }, []);

  const visibles = useMemo(() => {
    const r = {} as Record<ColumnaId, string[]>;
    for (const c of COLUMNAS) r[c.id] = tab.columnas[c.id].filter((id) => coincide(tab.tareas[id]!, filtros));
    return r;
  }, [tab, filtros]);

  const hayFiltros = filtros.q.trim() !== "" || filtros.personas.length + filtros.etiquetas.length + filtros.prioridades.length > 0;
  const totalVisibles = COLUMNAS.reduce((n, c) => n + visibles[c.id].length, 0);

  // Devolver el foco a la tarjeta después de moverla con el teclado.
  useLayoutEffect(() => {
    const id = focoPendiente.current;
    if (!id) return;
    focoPendiente.current = null;
    document.querySelector<HTMLElement>(`[data-card-btn="${id}"]`)?.focus();
  });

  const moverTarea = useCallback(
    (id: string, destino: ColumnaId, antesDe: string | null, despuesDe: string | null, anunciar = true) => {
      setTab((prev) => mover(prev, id, destino, antesDe, despuesDe));
      if (anunciar) {
        const t = tab.tareas[id];
        const col = COLUMNAS.find((c) => c.id === destino)!;
        avisar(`«${t?.titulo ?? "Tarea"}» ahora está en ${col.nombre}.`);
      }
    },
    [setTab, tab.tareas, avisar],
  );

  const moverConTeclado = useCallback(
    (id: string, dir: "izq" | "der" | "arriba" | "abajo") => {
      const col = columnaDe(tab, id);
      const lista = visibles[col];
      const i = lista.indexOf(id);
      focoPendiente.current = id;
      if (dir === "arriba" || dir === "abajo") {
        if (dir === "arriba" && i > 0) {
          setTab((p) => mover(p, id, col, lista[i - 1]!, null));
          avisar(`Subiste «${tab.tareas[id]!.titulo}» al puesto ${i} de ${COLUMNAS.find((c) => c.id === col)!.nombre}.`);
        } else if (dir === "abajo" && i < lista.length - 1) {
          setTab((p) => mover(p, id, col, null, lista[i + 1]!));
          avisar(`Bajaste «${tab.tareas[id]!.titulo}» al puesto ${i + 2} de ${COLUMNAS.find((c) => c.id === col)!.nombre}.`);
        } else focoPendiente.current = null;
        return;
      }
      const ci = COLUMNAS.findIndex((c) => c.id === col);
      const ni = dir === "izq" ? ci - 1 : ci + 1;
      const destino = COLUMNAS[ni];
      if (!destino) {
        focoPendiente.current = null;
        return;
      }
      const dest = visibles[destino.id];
      const pos = Math.min(Math.max(i, 0), dest.length);
      moverTarea(id, destino.id, dest[pos] ?? null, dest[dest.length - 1] ?? null);
    },
    [tab, visibles, setTab, avisar, moverTarea],
  );

  const abrirNueva = useCallback((col: ColumnaId = "ideas") => {
    setEdicion({ tarea: nuevaTareaVacia(), columna: col, nueva: true });
  }, []);

  const abrirTarea = useCallback(
    (id: string) => {
      const t = tab.tareas[id];
      if (t) setEdicion({ tarea: t, columna: columnaDe(tab, id), nueva: false });
    },
    [tab],
  );

  const guardarTarea = (t: Tarea, col: ColumnaId, nueva: boolean) => {
    setTab((prev) => {
      const tareas = { ...prev.tareas, [t.id]: t };
      const base = { ...prev, tareas };
      if (nueva) return { ...base, columnas: { ...prev.columnas, [col]: [...prev.columnas[col], t.id] } };
      if (columnaDe(prev, t.id) !== col) return mover(base, t.id, col, null, null);
      return base;
    });
    setEdicion(null);
    avisar(nueva ? `Creaste «${t.titulo}» en ${COLUMNAS.find((c) => c.id === col)!.nombre}.` : "Cambios guardados.");
  };

  const borrarTarea = (id: string) => {
    const antes = tab;
    const titulo = tab.tareas[id]?.titulo ?? "Tarea";
    setTab((prev) => {
      const tareas = { ...prev.tareas };
      delete tareas[id];
      const columnas = { ...prev.columnas };
      for (const c of COLUMNAS) columnas[c.id] = columnas[c.id].filter((x) => x !== id);
      return { ...prev, tareas, columnas };
    });
    setEdicion(null);
    setMenu(null);
    avisar(`Borraste «${titulo}».`, { label: "Deshacer", fn: () => setTab(antes) });
  };

  // Atajos globales: N crea, / busca.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, select, [contenteditable='true'], [role='dialog']")) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        abrirNueva();
      } else if (e.key === "/") {
        e.preventDefault();
        buscarRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abrirNueva]);

  /* ---------------- Arrastrar y soltar con pointer events ---------------- */

  const boardRef = useRef<HTMLDivElement>(null);
  const colRefs = useRef<Partial<Record<ColumnaId, HTMLElement | null>>>({});
  const listRefs = useRef<Partial<Record<ColumnaId, HTMLElement | null>>>({});
  const ghostRef = useRef<HTMLDivElement>(null);
  const suprimirClick = useRef(false);
  const dragRef = useRef<{
    id: string;
    col: ColumnaId;
    index: number;
    x0: number;
    y0: number;
    ox: number;
    oy: number;
    w: number;
    x: number;
    y: number;
    activo: boolean;
    tipo: string;
    timer: ReturnType<typeof setTimeout> | null;
    raf: number;
    over: ColumnaId;
    overIndex: number;
  } | null>(null);

  const posicionarGhost = () => {
    const d = dragRef.current;
    const g = ghostRef.current;
    if (!d || !g) return;
    g.style.transform = `translate3d(${d.x - d.ox}px, ${d.y - d.oy}px, 0) rotate(2.2deg)`;
  };

  const calcularDestino = useCallback(() => {
    const d = dragRef.current;
    if (!d || !d.activo) return;
    let over: ColumnaId | null = null;
    let mejor = Infinity;
    for (const c of COLUMNAS) {
      const el = colRefs.current[c.id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (d.x >= r.left && d.x <= r.right) {
        over = c.id;
        break;
      }
      const dist = Math.min(Math.abs(d.x - r.left), Math.abs(d.x - r.right));
      if (dist < mejor) {
        mejor = dist;
        over = c.id;
      }
    }
    if (!over) return;
    const lista = listRefs.current[over];
    const els = lista ? Array.from(lista.querySelectorAll<HTMLElement>("[data-card-id]:not([data-dragging='true'])")) : [];
    let index = els.length;
    for (let i = 0; i < els.length; i++) {
      const r = els[i]!.getBoundingClientRect();
      if (d.y < r.top + r.height / 2) {
        index = i;
        break;
      }
    }
    if (over !== d.over || index !== d.overIndex) {
      d.over = over;
      d.overIndex = index;
      setDrag({ id: d.id, over, index });
    }
  }, []);

  const bucleAutoScroll = useCallback(() => {
    const d = dragRef.current;
    if (!d || !d.activo) return;
    const board = boardRef.current;
    let movio = false;
    if (board) {
      const r = board.getBoundingClientRect();
      const borde = 56;
      if (d.x < r.left + borde && board.scrollLeft > 0) {
        board.scrollLeft -= Math.ceil((r.left + borde - d.x) / 5);
        movio = true;
      } else if (d.x > r.right - borde && board.scrollLeft < board.scrollWidth - board.clientWidth) {
        board.scrollLeft += Math.ceil((d.x - (r.right - borde)) / 5);
        movio = true;
      }
    }
    const lista = listRefs.current[d.over];
    if (lista) {
      const r = lista.getBoundingClientRect();
      if (d.y < r.top + 40 && lista.scrollTop > 0) {
        lista.scrollTop -= 8;
        movio = true;
      } else if (d.y > r.bottom - 40 && lista.scrollTop < lista.scrollHeight - lista.clientHeight) {
        lista.scrollTop += 8;
        movio = true;
      }
    }
    if (movio) calcularDestino();
    d.raf = requestAnimationFrame(bucleAutoScroll);
  }, [calcularDestino]);

  const iniciarDrag = useCallback(() => {
    const d = dragRef.current;
    if (!d) return;
    d.activo = true;
    d.over = d.col;
    d.overIndex = d.index;
    suprimirClick.current = true;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
    if (d.tipo === "touch") navigator.vibrate?.(12);
    setMenu(null);
    setDrag({ id: d.id, over: d.col, index: d.index });
    d.raf = requestAnimationFrame(bucleAutoScroll);
  }, [bucleAutoScroll]);

  const terminarDrag = useCallback(
    (confirmar: boolean) => {
      const d = dragRef.current;
      if (!d) return;
      if (d.timer) clearTimeout(d.timer);
      cancelAnimationFrame(d.raf);
      dragRef.current = null;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      if (!d.activo) return;
      if (confirmar) {
        const lista = listRefs.current[d.over];
        const els = lista ? Array.from(lista.querySelectorAll<HTMLElement>("[data-card-id]:not([data-dragging='true'])")) : [];
        const antes = els[d.overIndex]?.dataset.cardId ?? null;
        const despues = els[els.length - 1]?.dataset.cardId ?? null;
        const mismaPos = d.over === d.col && d.overIndex === d.index;
        if (!mismaPos) moverTarea(d.id, d.over, antes, despues, d.over !== d.col);
      }
      setDrag(null);
      setTimeout(() => {
        suprimirClick.current = false;
      }, 0);
    },
    [moverTarea],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      d.x = e.clientX;
      d.y = e.clientY;
      if (!d.activo) {
        const dist = Math.hypot(e.clientX - d.x0, e.clientY - d.y0);
        if (d.tipo === "touch") {
          if (dist > 8) terminarDrag(false);
        } else if (dist > 5) iniciarDrag();
        return;
      }
      posicionarGhost();
      calcularDestino();
    };
    const onUp = () => terminarDrag(true);
    const onCancel = () => terminarDrag(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dragRef.current?.activo) {
        e.preventDefault();
        terminarDrag(false);
        avisar("Movimiento cancelado.");
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (dragRef.current?.activo) e.preventDefault();
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
    window.addEventListener("keydown", onKey);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("touchmove", onTouchMove);
    };
  }, [calcularDestino, iniciarDrag, terminarDrag, avisar]);

  useLayoutEffect(() => {
    if (drag) posicionarGhost();
  }, [drag]);

  const onCardPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>, id: string, col: ColumnaId, index: number) => {
      if (e.button !== 0 || dragRef.current) return;
      if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
      const r = e.currentTarget.getBoundingClientRect();
      dragRef.current = {
        id,
        col,
        index,
        x0: e.clientX,
        y0: e.clientY,
        ox: e.clientX - r.left,
        oy: e.clientY - r.top,
        w: r.width,
        x: e.clientX,
        y: e.clientY,
        activo: false,
        tipo: e.pointerType,
        timer: null,
        raf: 0,
        over: col,
        overIndex: index,
      };
      if (e.pointerType === "touch") {
        dragRef.current.timer = setTimeout(iniciarDrag, 280);
      }
    },
    [iniciarDrag],
  );

  /* ---------------- Menú de tarjeta ---------------- */

  const abrirMenu = (id: string, trigger: HTMLElement) => {
    const r = trigger.getBoundingClientRect();
    const ancho = 224;
    const alto = 300;
    const left = Math.max(8, Math.min(window.innerWidth - ancho - 8, r.right - ancho));
    const top = r.bottom + 6 + alto > window.innerHeight ? Math.max(8, r.top - alto - 6) : r.bottom + 6;
    setMenu({ id, top, left, trigger });
  };

  /* ---------------- Métricas ---------------- */

  const metricas = useMemo(() => {
    const ids = Object.keys(tab.tareas);
    const listos = new Set(tab.columnas.listo);
    let vencidas = 0;
    let semana = 0;
    let items = 0;
    let hechos = 0;
    for (const id of ids) {
      const t = tab.tareas[id]!;
      items += t.checklist.length;
      hechos += t.checklist.filter((c) => c.hecho).length;
      if (listos.has(id)) continue;
      const d = diasHasta(t.fecha);
      if (d === null) continue;
      if (d < 0) vencidas++;
      else if (d <= 7) semana++;
    }
    const carga = PERSONAS.map((p) => ({
      p,
      abiertas: ids.filter((id) => tab.tareas[id]!.responsable === p.id && !listos.has(id)).length,
    }));
    return {
      total: ids.length,
      listas: listos.size,
      porCol: COLUMNAS.map((c) => ({ ...c, n: tab.columnas[c.id].length })),
      vencidas,
      semana,
      items,
      hechos,
      carga,
      pct: ids.length ? Math.round((listos.size / ids.length) * 100) : 0,
    };
  }, [tab]);

  const toggle = <K extends "personas" | "etiquetas" | "prioridades">(k: K, v: Filtros[K][number]) =>
    setFiltros((f) => {
      const arr = f[k] as string[];
      return { ...f, [k]: arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v] };
    });

  const restablecer = () => {
    resetTab();
    setFiltros(FILTROS_VACIOS);
    setConfirmarReset(false);
    setSidebar(false);
    avisar("Listo: el tablero volvió a los datos de ejemplo.");
  };

  const dragTarea = drag ? tab.tareas[drag.id] : null;

  const sidebarContenido = (
    <SidebarContenido
      vista={vista}
      setVista={(v) => {
        setVista(v);
        setSidebar(false);
      }}
      metricas={metricas}
      filtros={filtros}
      togglePersona={(id) => toggle("personas", id)}
      toggleEtiqueta={(id) => toggle("etiquetas", id)}
      tab={tab}
      confirmarReset={confirmarReset}
      setConfirmarReset={setConfirmarReset}
      restablecer={restablecer}
    />
  );

  return (
    <div
      data-demo="tablero"
      className="flex h-[calc(100dvh-7rem)] min-h-[600px] w-full overflow-hidden bg-[#F6F6F7] text-zinc-900 sm:h-[calc(100dvh-6rem)] [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#5B5BF7]"
    >
      {/* Sidebar de escritorio */}
      <aside className="hidden w-[256px] shrink-0 flex-col border-r border-zinc-200/80 bg-white lg:flex" aria-label="Menú del espacio de trabajo">
        {sidebarContenido}
      </aside>

      {/* Sidebar mobile */}
      <Dialog
        abierto={sidebar}
        onClose={() => setSidebar(false)}
        labelledBy="tb-sidebar-titulo"
        lado="izquierda"
        overlayClassName="bg-zinc-950/35 lg:hidden"
        className="flex h-full w-[86vw] max-w-[300px] flex-col bg-white shadow-2xl outline-none"
      >
        <div className="flex items-center justify-end px-3 pt-3">
          <button
            type="button"
            onClick={() => setSidebar(false)}
            className="grid size-9 place-items-center rounded-lg text-zinc-500 hover:bg-zinc-100"
            aria-label="Cerrar menú"
          >
            <IconX className="size-5" />
          </button>
        </div>
        {sidebarContenido}
      </Dialog>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex items-center gap-2 border-b border-zinc-200/80 bg-white px-3 py-2.5 sm:gap-3 sm:px-5">
          <button
            type="button"
            onClick={() => setSidebar(true)}
            className="grid size-9 shrink-0 place-items-center rounded-lg text-zinc-600 hover:bg-zinc-100 lg:hidden"
            aria-label="Abrir menú"
          >
            <IconMenu className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="hidden text-[12px] font-medium text-zinc-500 sm:block">Estudio Brújula · Clientes</p>
            <h1 className="truncate font-[family-name:var(--font-tb-head)] text-[17px] font-semibold tracking-tight sm:text-[19px]">
              Octubre en el estudio
            </h1>
          </div>
          <div className="hidden items-center -space-x-1.5 md:flex" aria-label="Equipo del proyecto">
            {PERSONAS.map((p) => (
              <Avatar key={p.id} p={p} size="md" ring />
            ))}
          </div>
          <div className="hidden rounded-lg border border-zinc-200 bg-zinc-50 p-0.5 sm:flex" role="group" aria-label="Vista">
            {(
              [
                ["tablero", "Tablero", IconBoard],
                ["lista", "Lista", IconList],
              ] as const
            ).map(([v, l, I]) => (
              <button
                key={v}
                type="button"
                onClick={() => setVista(v)}
                aria-pressed={vista === v}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-semibold transition ${
                  vista === v ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                <I className="size-4" /> {l}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => abrirNueva()}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#5B5BF7] px-3 py-2 text-[13.5px] font-semibold text-white shadow-[0_1px_2px_rgba(91,91,247,0.4),inset_0_1px_0_rgba(255,255,255,0.18)] transition hover:bg-[#4B4BE6] active:translate-y-px"
            aria-keyshortcuts="N"
          >
            <IconPlus className="size-4" />
            <span>Nueva<span className="hidden sm:inline"> tarea</span></span>
          </button>
        </header>

        {/* Búsqueda y filtros */}
        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200/80 bg-white/70 px-3 py-2 sm:px-5">
          <div className="relative min-w-0 flex-1 sm:max-w-[300px] md:max-w-[220px] 2xl:max-w-[300px]">
            <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <label htmlFor="tb-buscar" className="sr-only">
              Buscar tareas
            </label>
            <input
              ref={buscarRef}
              id="tb-buscar"
              type="search"
              value={filtros.q}
              onChange={(e) => setFiltros((f) => ({ ...f, q: e.target.value }))}
              placeholder="Buscar tareas…"
              className="w-full rounded-lg border border-zinc-200 bg-white py-1.5 pl-8 pr-8 text-[13.5px] outline-none transition placeholder:text-zinc-400 focus:border-[#5B5BF7] focus:ring-4 focus:ring-[#5B5BF7]/15"
              aria-keyshortcuts="/"
            />
            <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-zinc-200 bg-zinc-50 px-1.5 text-[11px] font-medium text-zinc-500 sm:block">
              /
            </kbd>
          </div>

          <button
            type="button"
            onClick={() => setFiltrosAbiertos((v) => !v)}
            aria-expanded={filtrosAbiertos}
            aria-controls="tb-filtros"
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[13px] font-semibold transition md:hidden ${
              hayFiltros ? "border-[#5B5BF7] bg-[#F1F0FF] text-[#4338CA]" : "border-zinc-200 bg-white text-zinc-700"
            }`}
          >
            <IconFilter className="size-4" /> Filtros
            {filtros.personas.length + filtros.etiquetas.length + filtros.prioridades.length > 0 && (
              <span className="rounded-full bg-[#5B5BF7] px-1.5 text-[11px] text-white">
                {filtros.personas.length + filtros.etiquetas.length + filtros.prioridades.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setVista(vista === "tablero" ? "lista" : "tablero")}
            className="grid size-[34px] place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-600 sm:hidden"
            aria-label={vista === "tablero" ? "Ver como lista" : "Ver como tablero"}
          >
            {vista === "tablero" ? <IconList className="size-4" /> : <IconBoard className="size-4" />}
          </button>

          <div
            id="tb-filtros"
            className={`${filtrosAbiertos ? "flex" : "hidden"} w-full flex-wrap items-center gap-x-3 gap-y-2 md:flex md:w-auto md:flex-1`}
          >
            <div className="flex items-center gap-1" role="group" aria-label="Filtrar por persona">
              {PERSONAS.map((p) => {
                const activo = filtros.personas.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggle("personas", p.id)}
                    aria-pressed={activo}
                    title={`Filtrar por ${p.nombre}`}
                    className={`rounded-full p-0.5 transition ${activo ? "ring-2 ring-[#5B5BF7]" : "opacity-80 hover:opacity-100"}`}
                  >
                    <Avatar p={p} size="sm" />
                  </button>
                );
              })}
            </div>
            <span className="hidden h-5 w-px bg-zinc-200 md:block" aria-hidden="true" />
            <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Filtrar por etiqueta">
              {ETIQUETAS.map((e) => {
                const activo = filtros.etiquetas.includes(e.id);
                return (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => toggle("etiquetas", e.id)}
                    aria-pressed={activo}
                    className="flex items-center gap-1.5 rounded-md border px-2 py-1 text-[12px] font-semibold transition"
                    style={
                      activo
                        ? { background: e.fondo, color: e.texto, borderColor: e.punto }
                        : { borderColor: "#E4E4E7", color: "#52525B", background: "white" }
                    }
                  >
                    <span className="size-1.5 rounded-full" style={{ background: e.punto }} aria-hidden="true" />
                    {e.nombre}
                  </button>
                );
              })}
            </div>
            <span className="hidden h-5 w-px bg-zinc-200 xl:block" aria-hidden="true" />
            <div className="flex items-center gap-1" role="group" aria-label="Filtrar por prioridad">
              {PRIORIDADES.map((p) => {
                const activo = filtros.prioridades.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggle("prioridades", p.id)}
                    aria-pressed={activo}
                    className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[12px] font-semibold transition ${
                      activo ? "border-[#5B5BF7] bg-[#F1F0FF] text-zinc-900" : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                    }`}
                  >
                    <IconFlag color={p.color} className="size-3" />
                    {p.nombre}
                  </button>
                );
              })}
            </div>
            {hayFiltros && (
              <button
                type="button"
                onClick={() => setFiltros(FILTROS_VACIOS)}
                className="text-[12.5px] font-semibold text-[#5B5BF7] underline-offset-4 hover:underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Resumen / progreso */}
        <Resumen abierto={resumen} setAbierto={setResumen} m={metricas} />

        <p className="sr-only" aria-live="polite">
          {hayFiltros ? `${totalVisibles} tareas coinciden con los filtros.` : ""}
        </p>

        {vista === "tablero" ? (
          <div
            ref={boardRef}
            className="flex min-h-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-3 py-3 [scrollbar-width:thin] sm:snap-none sm:gap-4 sm:px-5 sm:py-4"
            aria-label="Tablero de tareas"
            role="region"
          >
            {COLUMNAS.map((c) => {
              const ids = visibles[c.id];
              const total = tab.columnas[c.id].length;
              const esDestino = drag?.over === c.id;
              const sinDrag = ids.filter((id) => id !== drag?.id);
              return (
                <section
                  key={c.id}
                  ref={(el) => {
                    colRefs.current[c.id] = el;
                  }}
                  aria-labelledby={`col-${c.id}`}
                  className={`flex max-h-full w-[84vw] max-w-[320px] shrink-0 snap-center flex-col rounded-2xl border transition-colors sm:w-[292px] xl:w-auto xl:min-w-[250px] xl:max-w-none xl:flex-1 ${
                    esDestino ? "border-[#5B5BF7]/40 bg-[#EEEDFE]/60" : "border-zinc-200/70 bg-zinc-100/70"
                  }`}
                >
                  <div className="flex items-center gap-2 px-3 pb-2 pt-3">
                    <span className="size-2.5 rounded-full" style={{ background: c.color }} aria-hidden="true" />
                    <h2 id={`col-${c.id}`} className="font-[family-name:var(--font-tb-head)] text-[14px] font-semibold tracking-tight">
                      {c.nombre}
                    </h2>
                    <span
                      className="rounded-full bg-white px-2 py-px text-[12px] font-semibold tabular-nums text-zinc-600 ring-1 ring-zinc-200"
                      aria-label={hayFiltros ? `${ids.length} de ${total} tareas` : `${total} tareas`}
                    >
                      {hayFiltros ? `${ids.length}/${total}` : total}
                    </span>
                    <button
                      type="button"
                      onClick={() => abrirNueva(c.id)}
                      className="ml-auto grid size-7 place-items-center rounded-md text-zinc-500 transition hover:bg-white hover:text-zinc-900"
                      aria-label={`Agregar tarea en ${c.nombre}`}
                    >
                      <IconPlus className="size-4" />
                    </button>
                  </div>
                  <div
                    ref={(el) => {
                      listRefs.current[c.id] = el;
                    }}
                    className="flex min-h-[72px] flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2 [scrollbar-width:thin]"
                  >
                    {ids.map((id) => {
                      const esArrastrada = drag?.id === id;
                      const vi = sinDrag.indexOf(id);
                      return (
                        <FragmentoConPlaceholder key={id} mostrar={esDestino && !esArrastrada && drag?.index === vi}>
                          <Tarjeta
                            t={tab.tareas[id]!}
                            col={c.id}
                            listo={c.id === "listo"}
                            oculta={esArrastrada}
                            onPointerDown={(e) => onCardPointerDown(e, id, c.id, ids.indexOf(id))}
                            onAbrir={() => {
                              if (!suprimirClick.current) abrirTarea(id);
                            }}
                            onMover={(dir) => moverConTeclado(id, dir)}
                            onMenu={(el) => (menu?.id === id ? setMenu(null) : abrirMenu(id, el))}
                            menuAbierto={menu?.id === id}
                          />
                        </FragmentoConPlaceholder>
                      );
                    })}
                    {esDestino && drag && drag.index >= sinDrag.length && <Placeholder />}
                    {ids.length === 0 && !esDestino && (
                      <div className="grid flex-1 place-items-center rounded-xl border border-dashed border-zinc-300/80 px-4 py-6 text-center text-[12.5px] text-zinc-500">
                        {hayFiltros ? "Nada coincide con los filtros." : "Arrastrá una tarea acá o creá una nueva."}
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
            <div className="w-1 shrink-0" aria-hidden="true" />
          </div>
        ) : (
          <VistaLista tab={tab} visibles={visibles} abrir={abrirTarea} mover={(id, col) => moverTarea(id, col, null, null)} />
        )}
      </div>

      {/* Tarjeta fantasma que sigue al puntero */}
      {drag && dragTarea && (
        <div
          ref={ghostRef}
          className="pointer-events-none fixed left-0 top-0 z-[70]"
          style={{ width: dragRef.current?.w ?? 280 }}
          aria-hidden="true"
        >
          <div className="rounded-xl shadow-[0_18px_40px_-8px_rgba(24,24,27,0.35)] ring-2 ring-[#5B5BF7]">
            <CuerpoTarjeta t={dragTarea} listo={drag.over === "listo"} />
          </div>
        </div>
      )}

      {menu && (
        <MenuTarjeta
          menu={menu}
          col={columnaDe(tab, menu.id)}
          posicion={visibles[columnaDe(tab, menu.id)].indexOf(menu.id)}
          total={visibles[columnaDe(tab, menu.id)].length}
          cerrar={(devolverFoco) => {
            if (devolverFoco) menu.trigger.focus();
            setMenu(null);
          }}
          editar={() => {
            setMenu(null);
            abrirTarea(menu.id);
          }}
          moverA={(col) => {
            const dest = visibles[col];
            focoPendiente.current = menu.id;
            moverTarea(menu.id, col, null, dest[dest.length - 1] ?? null);
            setMenu(null);
          }}
          moverDir={(dir) => {
            moverConTeclado(menu.id, dir);
            setMenu(null);
          }}
          borrar={() => borrarTarea(menu.id)}
        />
      )}

      <TaskModal edicion={edicion} onClose={() => setEdicion(null)} onGuardar={guardarTarea} onBorrar={borrarTarea} />

      {/* Avisos */}
      <div
        className="pointer-events-none fixed inset-x-0 top-3 z-[80] flex flex-col items-center gap-2 px-3 sm:bottom-28 sm:left-auto sm:right-5 sm:top-auto sm:items-end"
        aria-live="polite"
        role="status"
      >
        {avisos.map((a) => (
          <div
            key={a.id}
            className="pointer-events-auto flex max-w-[420px] items-center gap-3 rounded-xl bg-zinc-900 py-2.5 pl-3.5 pr-2 text-[13px] text-white shadow-[0_12px_32px_-8px_rgba(0,0,0,0.45)] motion-safe:animate-[tb-in_220ms_ease-out]"
          >
            <span className="size-1.5 shrink-0 rounded-full bg-[#8B8BFF]" aria-hidden="true" />
            <span className="min-w-0 flex-1">{a.texto}</span>
            {a.accion && (
              <button
                type="button"
                onClick={() => {
                  a.accion!.fn();
                  cerrar(a.id);
                }}
                className="rounded-md px-2 py-1 font-semibold text-[#B4B4FF] hover:bg-white/10"
              >
                {a.accion.label}
              </button>
            )}
            <button type="button" onClick={() => cerrar(a.id)} className="grid size-7 place-items-center rounded-md text-white/60 hover:bg-white/10 hover:text-white" aria-label="Cerrar aviso">
              <IconX className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
      <style>{`@keyframes tb-in{from{opacity:0;transform:translateY(6px) scale(.98)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Placeholder() {
  return <div className="h-14 shrink-0 rounded-xl border-2 border-dashed border-[#5B5BF7]/45 bg-[#5B5BF7]/[0.06]" aria-hidden="true" />;
}

function FragmentoConPlaceholder({ mostrar, children }: { mostrar: boolean; children: React.ReactNode }) {
  return (
    <>
      {mostrar && <Placeholder />}
      {children}
    </>
  );
}

function CuerpoTarjeta({ t, listo }: { t: Tarea; listo: boolean }) {
  const hechos = t.checklist.filter((c) => c.hecho).length;
  const prio = PRIORIDADES.find((p) => p.id === t.prioridad)!;
  return (
    <div className="rounded-xl bg-white p-3">
      {t.etiquetas.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1 pr-7">
          {t.etiquetas.map((e) => (
            <Chip key={e} id={e} />
          ))}
        </div>
      )}
      <p className={`pr-6 text-[13.5px] font-semibold leading-snug tracking-[-0.005em] ${listo ? "text-zinc-500" : "text-zinc-900"}`}>{t.titulo}</p>
      {t.checklist.length > 0 && (
        <div className="mt-2.5 flex items-center gap-2 text-[11.5px] font-medium text-zinc-500">
          <IconChecklist className={`size-3.5 ${hechos === t.checklist.length ? "text-[#10B981]" : ""}`} />
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full"
              style={{ width: `${(hechos / t.checklist.length) * 100}%`, background: hechos === t.checklist.length ? "#10B981" : ACENTO }}
            />
          </div>
          <span className="tabular-nums">
            {hechos}/{t.checklist.length}
          </span>
        </div>
      )}
      <div className="mt-2.5 flex items-center gap-2">
        <FechaChip fecha={t.fecha} listo={listo} />
        <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-zinc-500" title={`Prioridad ${prio.nombre.toLowerCase()}`}>
          <IconFlag color={prio.color} className="size-3.5" />
          <span className="sr-only sm:not-sr-only">{prio.nombre}</span>
        </span>
        <span className="ml-auto">
          <AvatarDe id={t.responsable} size="sm" />
        </span>
      </div>
    </div>
  );
}

function Tarjeta({
  t,
  col,
  listo,
  oculta,
  onPointerDown,
  onAbrir,
  onMover,
  onMenu,
  menuAbierto,
}: {
  t: Tarea;
  col: ColumnaId;
  listo: boolean;
  oculta: boolean;
  onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
  onAbrir: () => void;
  onMover: (dir: "izq" | "der" | "arriba" | "abajo") => void;
  onMenu: (el: HTMLElement) => void;
  menuAbierto: boolean;
}) {
  const colNombre = COLUMNAS.find((c) => c.id === col)!.nombre;
  return (
    <article
      data-card-id={t.id}
      data-dragging={oculta ? "true" : undefined}
      onPointerDown={onPointerDown}
      onContextMenu={(e) => {
        if (e.nativeEvent instanceof PointerEvent && e.nativeEvent.pointerType === "touch") e.preventDefault();
      }}
      className={`group relative shrink-0 cursor-grab touch-manipulation select-none rounded-xl border border-zinc-200/80 shadow-[0_1px_2px_rgba(24,24,27,0.04)] transition-[box-shadow,border-color,transform] duration-150 [-webkit-touch-callout:none] hover:border-zinc-300 hover:shadow-[0_4px_14px_-4px_rgba(24,24,27,0.12)] active:cursor-grabbing has-[[data-card-btn]:focus-visible]:border-[#5B5BF7] has-[[data-card-btn]:focus-visible]:ring-4 has-[[data-card-btn]:focus-visible]:ring-[#5B5BF7]/20 ${
        oculta ? "hidden" : ""
      }`}
    >
      <CuerpoTarjeta t={t} listo={listo} />
      <button
        type="button"
        data-card-btn={t.id}
        onClick={onAbrir}
        onKeyDown={(e) => {
          if (!e.altKey) return;
          const mapa = { ArrowLeft: "izq", ArrowRight: "der", ArrowUp: "arriba", ArrowDown: "abajo" } as const;
          const dir = mapa[e.key as keyof typeof mapa];
          if (dir) {
            e.preventDefault();
            onMover(dir);
          }
        }}
        className="absolute inset-0 rounded-xl !outline-none"
        aria-label={`${t.titulo}. En ${colNombre}. Enter para editar; Alt y flechas para mover.`}
        aria-keyshortcuts="Alt+ArrowLeft Alt+ArrowRight Alt+ArrowUp Alt+ArrowDown"
      />
      <button
        type="button"
        data-no-drag
        onClick={(e) => onMenu(e.currentTarget)}
        aria-haspopup="true"
        aria-expanded={menuAbierto}
        aria-label={`Acciones para «${t.titulo}»`}
        className={`absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 focus-visible:opacity-100 ${
          menuAbierto ? "bg-zinc-100 opacity-100" : "opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
        }`}
      >
        <IconDots className="size-4" />
      </button>
    </article>
  );
}

function MenuTarjeta({
  menu,
  col,
  posicion,
  total,
  cerrar,
  editar,
  moverA,
  moverDir,
  borrar,
}: {
  menu: Menu;
  col: ColumnaId;
  posicion: number;
  total: number;
  cerrar: (devolverFoco: boolean) => void;
  editar: () => void;
  moverA: (c: ColumnaId) => void;
  moverDir: (d: "izq" | "der" | "arriba" | "abajo") => void;
  borrar: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const cerrarRef = useRef(cerrar);
  useEffect(() => {
    cerrarRef.current = cerrar;
  });

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>("[role='menuitem']")?.focus();
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node) && !menu.trigger.contains(e.target as Node)) cerrarRef.current(false);
    };
    const onScroll = (e: Event) => {
      if (!ref.current?.contains(e.target as Node)) cerrarRef.current(false);
    };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [menu]);

  const onKey = (e: React.KeyboardEvent) => {
    const items = Array.from(ref.current?.querySelectorAll<HTMLElement>("[role='menuitem']:not([disabled])") ?? []);
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "Escape") {
      e.preventDefault();
      cerrar(true);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(i + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length]?.focus();
    } else if (e.key === "Tab") {
      cerrar(false);
    }
  };

  const item =
    "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[13px] font-medium text-zinc-700 outline-none transition hover:bg-zinc-100 focus-visible:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40";
  const ci = COLUMNAS.findIndex((c) => c.id === col);

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="Acciones de la tarea"
      onKeyDown={onKey}
      className="fixed z-[65] w-56 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-[0_16px_40px_-10px_rgba(24,24,27,0.3)] motion-safe:animate-[tb-in_140ms_ease-out]"
      style={{ top: menu.top, left: menu.left }}
    >
      <button type="button" role="menuitem" className={item} onClick={editar}>
        <IconPencil className="size-4 text-zinc-400" /> Editar
      </button>
      <div className="my-1 h-px bg-zinc-100" />
      <p className="px-2.5 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Mover a</p>
      {COLUMNAS.filter((c) => c.id !== col).map((c) => (
        <button key={c.id} type="button" role="menuitem" className={item} onClick={() => moverA(c.id)}>
          <span className="ml-1 mr-1 size-2 rounded-full" style={{ background: c.color }} aria-hidden="true" />
          {c.nombre}
        </button>
      ))}
      <div className="my-1 h-px bg-zinc-100" />
      <div className="grid grid-cols-4 gap-1 px-1 py-0.5">
        {(
          [
            ["izq", IconArrowLeft, "Columna anterior", ci === 0],
            ["arriba", IconArrowUp, "Subir", posicion <= 0],
            ["abajo", IconArrowDown, "Bajar", posicion >= total - 1],
            ["der", IconArrowRight, "Columna siguiente", ci === COLUMNAS.length - 1],
          ] as const
        ).map(([d, I, l, dis]) => (
          <button
            key={d}
            type="button"
            role="menuitem"
            disabled={dis}
            onClick={() => moverDir(d)}
            aria-label={l}
            title={`${l} (Alt + flecha)`}
            className="grid h-8 place-items-center rounded-md text-zinc-600 outline-none transition hover:bg-zinc-100 focus-visible:bg-zinc-100 disabled:opacity-30"
          >
            <I className="size-4" />
          </button>
        ))}
      </div>
      <div className="my-1 h-px bg-zinc-100" />
      <button type="button" role="menuitem" className={`${item} text-[#C62A2F] hover:bg-[#FDECEC] focus-visible:bg-[#FDECEC]`} onClick={borrar}>
        <IconTrash className="size-4" /> Borrar tarea
      </button>
    </div>
  );
}

function Resumen({
  abierto,
  setAbierto,
  m,
}: {
  abierto: boolean;
  setAbierto: (v: boolean) => void;
  m: {
    total: number;
    listas: number;
    pct: number;
    porCol: { id: ColumnaId; nombre: string; color: string; n: number }[];
    vencidas: number;
    semana: number;
    items: number;
    hechos: number;
  };
}) {
  return (
    <section aria-labelledby="tb-resumen" className="border-b border-zinc-200/80 bg-white px-3 py-2.5 sm:px-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setAbierto(!abierto)}
          aria-expanded={abierto}
          aria-controls="tb-resumen-cuerpo"
          className="flex items-center gap-2 rounded-md text-[13px] font-semibold text-zinc-700 hover:text-zinc-900"
        >
          <IconChart className="size-4 text-[#5B5BF7]" />
          <span id="tb-resumen">Progreso</span>
          <svg viewBox="0 0 16 16" className={`size-3.5 text-zinc-400 transition-transform ${abierto ? "rotate-180" : ""}`} aria-hidden="true">
            <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-zinc-100" role="img" aria-label={m.porCol.map((c) => `${c.nombre}: ${c.n}`).join(", ")}>
          {m.porCol.map((c) => (
            <div key={c.id} className="h-full transition-[width] duration-500" style={{ width: `${m.total ? (c.n / m.total) * 100 : 0}%`, background: c.color }} />
          ))}
        </div>
        <p className="shrink-0 text-[13px] font-semibold tabular-nums text-zinc-900">
          {m.pct}% <span className="font-medium text-zinc-500">listo</span>
        </p>
      </div>
      {abierto && (
        <div id="tb-resumen-cuerpo" className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat titulo="Terminadas" valor={`${m.listas} de ${m.total}`} detalle={`${m.pct}% del proyecto`} color="#10B981" />
          <Stat titulo="Vencidas" valor={String(m.vencidas)} detalle={m.vencidas ? "Necesitan atención" : "Todo al día"} color={m.vencidas ? "#E5484D" : "#A1A1AA"} />
          <Stat titulo="Vencen en 7 días" valor={String(m.semana)} detalle="Sin contar las listas" color="#F59E0B" />
          <Stat
            titulo="Checklist"
            valor={`${m.hechos}/${m.items}`}
            detalle={`${m.items ? Math.round((m.hechos / m.items) * 100) : 0}% de los ítems`}
            color={ACENTO}
          />
        </div>
      )}
    </section>
  );
}

function Stat({ titulo, valor, detalle, color }: { titulo: string; valor: string; detalle: string; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-200/80 bg-zinc-50/60 px-3 py-2">
      <span className="h-8 w-1 rounded-full" style={{ background: color }} aria-hidden="true" />
      <div className="min-w-0">
        <p className="truncate text-[11.5px] font-medium text-zinc-500">{titulo}</p>
        <p className="font-[family-name:var(--font-tb-head)] text-[17px] font-semibold leading-tight tabular-nums tracking-tight">{valor}</p>
        <p className="truncate text-[11px] text-zinc-500">{detalle}</p>
      </div>
    </div>
  );
}

function SidebarContenido({
  vista,
  setVista,
  metricas,
  filtros,
  togglePersona,
  toggleEtiqueta,
  tab,
  confirmarReset,
  setConfirmarReset,
  restablecer,
}: {
  vista: Vista;
  setVista: (v: Vista) => void;
  metricas: { pct: number; listas: number; total: number; carga: { p: (typeof PERSONAS)[number]; abiertas: number }[] };
  filtros: Filtros;
  togglePersona: (id: string) => void;
  toggleEtiqueta: (id: string) => void;
  tab: Tablero;
  confirmarReset: boolean;
  setConfirmarReset: (v: boolean) => void;
  restablecer: () => void;
}) {
  const maxCarga = Math.max(1, ...metricas.carga.map((c) => c.abiertas));
  const conteoEtiqueta = (id: string) => Object.values(tab.tareas).filter((t) => t.etiquetas.includes(id)).length;
  const r = 15.5;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-2.5 px-4 pb-4 pt-4 lg:pt-5">
        <LogoBrujula className="size-9" />
        <div>
          <p id="tb-sidebar-titulo" className="font-[family-name:var(--font-tb-head)] text-[15px] font-bold tracking-tight">
            Brújula
          </p>
          <p className="text-[12px] text-zinc-500">Estudio creativo · 5 personas</p>
        </div>
      </div>

      <nav aria-label="Vistas" className="px-2.5">
        {(
          [
            ["tablero", "Tablero", IconBoard],
            ["lista", "Lista", IconList],
          ] as const
        ).map(([v, l, I]) => (
          <button
            key={v}
            type="button"
            onClick={() => setVista(v)}
            aria-current={vista === v ? "page" : undefined}
            className={`mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-semibold transition ${
              vista === v ? "bg-[#F1F0FF] text-[#4338CA]" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            <I className="size-[18px]" /> {l}
          </button>
        ))}
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto px-2.5 pb-3">
        <h3 className="mb-1.5 mt-5 px-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-zinc-400">Equipo · tareas abiertas</h3>
        <ul>
          {metricas.carga.map(({ p, abiertas }) => {
            const activo = filtros.personas.includes(p.id);
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => togglePersona(p.id)}
                  aria-pressed={activo}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left transition ${activo ? "bg-[#F1F0FF]" : "hover:bg-zinc-100"}`}
                >
                  <Avatar p={p} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-zinc-800">{p.nombre}</span>
                    <span className="mt-1 block h-1 overflow-hidden rounded-full bg-zinc-100">
                      <span className="block h-full rounded-full" style={{ width: `${(abiertas / maxCarga) * 100}%`, background: p.color }} />
                    </span>
                  </span>
                  <span className="text-[12px] font-semibold tabular-nums text-zinc-500">{abiertas}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <h3 className="mb-1.5 mt-5 px-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-zinc-400">Etiquetas</h3>
        <ul>
          {ETIQUETAS.map((e) => {
            const activo = filtros.etiquetas.includes(e.id);
            return (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => toggleEtiqueta(e.id)}
                  aria-pressed={activo}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[13px] font-medium transition ${
                    activo ? "bg-[#F1F0FF] text-zinc-900" : "text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  <span className="size-2.5 rounded-[4px]" style={{ background: e.punto }} aria-hidden="true" />
                  <span className="flex-1">{e.nombre}</span>
                  <span className="text-[12px] tabular-nums text-zinc-400">{conteoEtiqueta(e.id)}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mx-1 mt-5 rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-3 text-[12px] text-zinc-600">
          <p className="mb-1.5 flex items-center gap-1.5 font-semibold text-zinc-800">
            <IconKeyboard className="size-4" /> Atajos
          </p>
          <ul className="space-y-1">
            <li className="flex justify-between gap-2">
              Nueva tarea <kbd className="rounded border border-zinc-200 bg-white px-1.5 font-sans text-[11px]">N</kbd>
            </li>
            <li className="flex justify-between gap-2">
              Buscar <kbd className="rounded border border-zinc-200 bg-white px-1.5 font-sans text-[11px]">/</kbd>
            </li>
            <li className="flex justify-between gap-2">
              Mover tarjeta <kbd className="rounded border border-zinc-200 bg-white px-1.5 font-sans text-[11px]">Alt + flechas</kbd>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-100 p-3">
        <div className="mb-3 flex items-center gap-3 px-1">
          <svg viewBox="0 0 36 36" className="size-10 -rotate-90" aria-hidden="true">
            <circle cx="18" cy="18" r={r} fill="none" stroke="#EDEDF0" strokeWidth="3.5" />
            <circle
              cx="18"
              cy="18"
              r={r}
              fill="none"
              stroke="#10B981"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - metricas.pct / 100)}
              className="transition-[stroke-dashoffset] duration-700"
            />
          </svg>
          <div>
            <p className="text-[13px] font-semibold">{metricas.pct}% del mes listo</p>
            <p className="text-[12px] text-zinc-500">
              {metricas.listas} de {metricas.total} tareas
            </p>
          </div>
        </div>
        {confirmarReset ? (
          <div className="rounded-lg border border-zinc-200 p-2.5 text-[12.5px]" role="group" aria-label="Confirmar restablecer">
            <p className="mb-2 font-medium text-zinc-700">¿Volver a los datos de ejemplo? Se pierden tus cambios.</p>
            <div className="flex gap-2">
              <button type="button" onClick={restablecer} className="rounded-md bg-zinc-900 px-2.5 py-1.5 font-semibold text-white hover:bg-zinc-700">
                Restablecer
              </button>
              <button type="button" onClick={() => setConfirmarReset(false)} className="rounded-md px-2.5 py-1.5 font-medium text-zinc-600 hover:bg-zinc-100">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmarReset(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-[13px] font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            <IconReset className="size-4" /> Restablecer demo
          </button>
        )}
        <p className="mt-2.5 text-center text-[11.5px] text-zinc-400">Demo con contenido ficticio · se guarda en tu navegador</p>
      </div>
    </div>
  );
}

function VistaLista({
  tab,
  visibles,
  abrir,
  mover,
}: {
  tab: Tablero;
  visibles: Record<ColumnaId, string[]>;
  abrir: (id: string) => void;
  mover: (id: string, col: ColumnaId) => void;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-4">
      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
        <table className="w-full border-collapse text-left text-[13px]">
          <caption className="sr-only">Tareas en formato lista</caption>
          <thead className="hidden bg-zinc-50/80 text-[11.5px] font-semibold uppercase tracking-wide text-zinc-500 md:table-header-group">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-semibold">Tarea</th>
              <th scope="col" className="px-3 py-2.5 font-semibold">Estado</th>
              <th scope="col" className="px-3 py-2.5 font-semibold">Responsable</th>
              <th scope="col" className="px-3 py-2.5 font-semibold">Fecha</th>
              <th scope="col" className="px-3 py-2.5 font-semibold">Prioridad</th>
              <th scope="col" className="px-4 py-2.5 font-semibold">Checklist</th>
            </tr>
          </thead>
          {COLUMNAS.map((c) => (
            <tbody key={c.id} className="border-t border-zinc-100">
              <tr>
                <th colSpan={6} scope="colgroup" className="bg-zinc-50/50 px-4 py-2 text-[12.5px] font-semibold text-zinc-700">
                  <span className="mr-2 inline-block size-2 rounded-full align-middle" style={{ background: c.color }} aria-hidden="true" />
                  {c.nombre} <span className="font-medium text-zinc-400">· {visibles[c.id].length}</span>
                </th>
              </tr>
              {visibles[c.id].length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-3 text-[12.5px] text-zinc-400">
                    Sin tareas.
                  </td>
                </tr>
              )}
              {visibles[c.id].map((id) => {
                const t = tab.tareas[id]!;
                const prio = PRIORIDADES.find((p) => p.id === t.prioridad)!;
                const hechos = t.checklist.filter((x) => x.hecho).length;
                return (
                  <tr key={id} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-zinc-100 px-4 py-3 md:table-row md:p-0">
                    <td className="w-full md:w-auto md:px-4 md:py-2.5">
                      <button type="button" onClick={() => abrir(id)} className="text-left font-semibold text-zinc-900 hover:text-[#4338CA] hover:underline">
                        {t.titulo}
                      </button>
                      {t.etiquetas.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {t.etiquetas.map((e) => (
                            <Chip key={e} id={e} />
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="md:px-3 md:py-2.5">
                      <label className="sr-only" htmlFor={`estado-${id}`}>
                        Estado de {t.titulo}
                      </label>
                      <select
                        id={`estado-${id}`}
                        value={c.id}
                        onChange={(e) => mover(id, e.target.value as ColumnaId)}
                        className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-[12.5px] font-medium outline-none focus:border-[#5B5BF7]"
                      >
                        {COLUMNAS.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.nombre}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="md:px-3 md:py-2.5">
                      <span className="flex items-center gap-2">
                        <AvatarDe id={t.responsable} size="sm" />
                        <span className="hidden text-zinc-700 lg:inline">{persona(t.responsable)?.nombre ?? "Sin asignar"}</span>
                      </span>
                    </td>
                    <td className="md:px-3 md:py-2.5">
                      <FechaChip fecha={t.fecha} listo={c.id === "listo"} />
                    </td>
                    <td className="md:px-3 md:py-2.5">
                      <span className="inline-flex items-center gap-1 text-zinc-600">
                        <IconFlag color={prio.color} className="size-3.5" /> {prio.nombre}
                      </span>
                    </td>
                    <td className="tabular-nums text-zinc-500 md:px-4 md:py-2.5">
                      {t.checklist.length ? `${hechos}/${t.checklist.length}` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}
