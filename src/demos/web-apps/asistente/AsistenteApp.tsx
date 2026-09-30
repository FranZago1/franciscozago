"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dialog } from "../shared/Dialog";
import { copiarTexto, usePersistentState, useReducedMotion } from "../shared/hooks";
import {
  crearEstado,
  esEstado,
  fechaRelativa,
  horaCorta,
  nuevoId,
  tituloDesde,
  type Conversacion,
  type EstadoChat,
  type Mensaje,
} from "./datos";
import { DOCUMENTOS, FRAGMENTOS, documento, fragmento } from "./documentos";
import { SUGERIDAS, normalizar, responder } from "./motor";

const serif = "font-[family-name:var(--font-as-serif)]";

type Generacion = {
  convId: string;
  msgId: string;
  fase: "pensando" | "escribiendo";
  tokens: string[];
  visibles: number;
  paso: number;
};

/* ---------------- Íconos ---------------- */

type IP = { className?: string };
const I = ({ className = "size-4", children }: IP & { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
    {children}
  </svg>
);
const IcPlus = (p: IP) => (
  <I {...p}>
    <path d="M12 5v14M5 12h14" />
  </I>
);
const IcMenu = (p: IP) => (
  <I {...p}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </I>
);
const IcDocs = (p: IP) => (
  <I {...p}>
    <path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z" />
    <path d="M13.5 3.5V8h4.5M9 12.5h6M9 16h4" />
  </I>
);
const IcSend = (p: IP) => (
  <I {...p}>
    <path d="M5 12h13M12 5l7 7-7 7" />
  </I>
);
const IcStop = (p: IP) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={p.className ?? "size-4"}>
    <rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" />
  </svg>
);
const IcCopy = (p: IP) => (
  <I {...p}>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2.2" />
    <path d="M15.5 8.5V6.2a1.7 1.7 0 0 0-1.7-1.7H6.2a1.7 1.7 0 0 0-1.7 1.7v7.6a1.7 1.7 0 0 0 1.7 1.7h2.3" />
  </I>
);
const IcCheck = (p: IP) => (
  <I {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </I>
);
const IcUp = (p: IP) => (
  <I {...p}>
    <path d="M7.5 20.5h-2a1.5 1.5 0 0 1-1.5-1.5v-6.5a1.5 1.5 0 0 1 1.5-1.5h2M7.5 11l3.6-7a2.2 2.2 0 0 1 2.4 2.4l-.6 3.6h5.2a2 2 0 0 1 2 2.4l-1.3 6.5a2 2 0 0 1-2 1.6H7.5Z" />
  </I>
);
const IcDown = ({ className = "size-4" }: IP) => <IcUp className={`${className} rotate-180`} />;
const IcTrash = (p: IP) => (
  <I {...p}>
    <path d="M4.5 7h15M10 11v6M14 11v6M6.5 7l.8 11.2A2 2 0 0 0 9.3 20h5.4a2 2 0 0 0 2-1.8L17.5 7M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2" />
  </I>
);
const IcX = (p: IP) => (
  <I {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </I>
);
const IcSearch = (p: IP) => (
  <I {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </I>
);
const IcChat = (p: IP) => (
  <I {...p}>
    <path d="M5 18.5V7a2.5 2.5 0 0 1 2.5-2.5h9A2.5 2.5 0 0 1 19 7v6.5a2.5 2.5 0 0 1-2.5 2.5H9Z" />
  </I>
);
const IcReset = (p: IP) => (
  <I {...p}>
    <path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.5" />
    <path d="M4 4v4.5h4.5" />
  </I>
);
const IcChevron = ({ className = "size-4", abierto }: IP & { abierto: boolean }) => (
  <svg viewBox="0 0 16 16" aria-hidden="true" className={`${className} transition-transform ${abierto ? "rotate-90" : ""}`}>
    <path d="m6 4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Marca({ className = "size-9" }: IP) {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true" className={className}>
      <rect width="36" height="36" rx="10" fill="#17312A" />
      <path d="M12 28V10.5l6-3 6 3V28" fill="none" stroke="#9FD4B8" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M15.5 14h5M15.5 18h5M15.5 22h5" stroke="#9FD4B8" strokeWidth="1.6" strokeLinecap="round" opacity=".7" />
      <path d="M8 28h20" stroke="#9FD4B8" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="26.5" cy="9.5" r="2.2" fill="#F2C57C" />
    </svg>
  );
}

function AvatarAsistente() {
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#17312A] ring-1 ring-[#9FD4B8]/30" aria-hidden="true">
      <svg viewBox="0 0 20 20" className="size-4">
        <path d="M10 2.5c.6 3.6 1.9 4.9 5.5 5.5-3.6.6-4.9 1.9-5.5 5.5-.6-3.6-1.9-4.9-5.5-5.5 3.6-.6 4.9-1.9 5.5-5.5Z" fill="#9FD4B8" />
        <circle cx="15.5" cy="15" r="1.6" fill="#F2C57C" />
      </svg>
    </span>
  );
}

/* ---------------- Texto enriquecido ---------------- */

function inline(s: string, fuentes: string[] | undefined, onCita: (id: string, n: number) => void, key: string) {
  const partes = s.split(/(\*\*[^*]+\*\*|\*\*[^*]+$|\[\d+\])/g).filter(Boolean);
  return partes.map((p, i) => {
    const k = `${key}-${i}`;
    if (p.startsWith("**")) return <strong key={k} className="font-semibold text-[#F3F6F4]">{p.replace(/\*\*/g, "")}</strong>;
    const m = p.match(/^\[(\d+)\]$/);
    if (m && fuentes) {
      const n = Number(m[1]);
      const id = fuentes[n - 1];
      const f = id ? fragmento(id) : undefined;
      if (f)
        return (
          <button
            key={k}
            type="button"
            onClick={() => onCita(f.id, n)}
            className="mx-0.5 inline-grid h-[18px] min-w-[18px] -translate-y-[1px] place-items-center rounded-[5px] bg-[#9FD4B8]/15 px-1 align-middle text-[11px] font-semibold leading-none text-[#9FD4B8] ring-1 ring-[#9FD4B8]/30 transition hover:bg-[#9FD4B8] hover:text-[#0E1416]"
            aria-label={`Ver fuente ${n}: ${documento(f.doc).corto}, ${f.ref}`}
            title={`${documento(f.doc).corto} · ${f.ref}`}
          >
            {n}
          </button>
        );
    }
    return <span key={k}>{p}</span>;
  });
}

function Rich({
  texto,
  fuentes,
  onCita,
  cursor,
}: {
  texto: string;
  fuentes?: string[];
  onCita: (id: string, n: number) => void;
  cursor?: boolean;
}) {
  const caret = <span className="ml-0.5 inline-block h-[1.05em] w-[7px] translate-y-[3px] rounded-[1px] bg-[#9FD4B8] motion-safe:animate-pulse" aria-hidden="true" />;
  const bloques = texto.split(/\n{2,}/);
  return (
    <div className="space-y-3 text-[15px] leading-[1.65] text-[#D5DDD9]">
      {bloques.map((b, bi) => {
        const ultimoBloque = bi === bloques.length - 1;
        const lineas = b.split("\n").filter((l, i, arr) => l !== "" || i < arr.length - 1);
        const grupos: { lista: boolean; items: string[] }[] = [];
        for (const l of lineas) {
          const esLista = l.startsWith("- ");
          const ultimo = grupos[grupos.length - 1];
          if (ultimo && ultimo.lista === esLista && esLista) ultimo.items.push(l.slice(2));
          else grupos.push({ lista: esLista, items: [esLista ? l.slice(2) : l] });
        }
        return grupos.map((g, gi) => {
          const conCaret = cursor && ultimoBloque && gi === grupos.length - 1;
          if (g.lista)
            return (
              <ul key={`${bi}-${gi}`} className="space-y-1.5 pl-1">
                {g.items.map((it, ii) => (
                  <li key={ii} className="relative pl-5">
                    <span className="absolute left-1 top-[0.7em] size-1.5 rounded-full bg-[#9FD4B8]/70" aria-hidden="true" />
                    {inline(it, fuentes, onCita, `${bi}-${gi}-${ii}`)}
                    {conCaret && ii === g.items.length - 1 && caret}
                  </li>
                ))}
              </ul>
            );
          return (
            <p key={`${bi}-${gi}`}>
              {g.items.map((t, ti) => (
                <span key={ti}>
                  {ti > 0 && <br />}
                  {inline(t, fuentes, onCita, `${bi}-${gi}-${ti}`)}
                </span>
              ))}
              {conCaret && caret}
            </p>
          );
        });
      })}
    </div>
  );
}

function textoPlano(m: Mensaje) {
  const cuerpo = m.texto.replace(/\*\*/g, "").replace(/ ?\[(\d+)\]/g, " [$1]");
  const fuentes = (m.fuentes ?? [])
    .map((id, i) => {
      const f = fragmento(id);
      return f ? `[${i + 1}] ${documento(f.doc).titulo}, ${f.ref} (${f.titulo})` : "";
    })
    .filter(Boolean);
  return fuentes.length ? `${cuerpo}\n\nFuentes:\n${fuentes.join("\n")}` : cuerpo;
}

/* ---------------- App ---------------- */

export function AsistenteApp() {
  const [estado, setEstado, resetEstado, cargado] = usePersistentState<EstadoChat>("fz-demo-asistente-v1", crearEstado, esEstado);
  const [gen, setGen] = useState<Generacion | null>(null);
  const [entrada, setEntrada] = useState("");
  const [sidebar, setSidebar] = useState(false);
  const [docsMovil, setDocsMovil] = useState(false);
  const [resaltado, setResaltado] = useState<{ id: string; t: number } | null>(null);
  const [anuncio, setAnuncio] = useState("");
  const [confirmarReset, setConfirmarReset] = useState(false);
  const reducir = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const alFondo = useRef(true);

  const conv = estado.conversaciones.find((c) => c.id === estado.activa) ?? estado.conversaciones[0]!;

  const actualizarConv = useCallback(
    (id: string, f: (c: Conversacion) => Conversacion) =>
      setEstado((e) => ({ ...e, conversaciones: e.conversaciones.map((c) => (c.id === id ? f(c) : c)) })),
    [setEstado],
  );

  /* ---- Generación simulada: pensar y escribir token a token ---- */
  useEffect(() => {
    if (!gen) return;
    if (gen.fase === "pensando") {
      const total = reducir ? 1 : 3;
      if (gen.paso < total) {
        const t = setTimeout(() => setGen((g) => (g ? { ...g, paso: g.paso + 1 } : g)), reducir ? 200 : 520 + Math.random() * 240);
        return () => clearTimeout(t);
      }
      setGen((g) => (g ? { ...g, fase: "escribiendo" } : g));
      return;
    }
    if (gen.visibles >= gen.tokens.length) {
      const msg = conv.mensajes.find((m) => m.id === gen.msgId);
      setAnuncio(`Respuesta del asistente: ${msg ? textoPlano(msg) : ""}`);
      setGen(null);
      requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
      return;
    }
    const t = setTimeout(
      () => setGen((g) => (g ? { ...g, visibles: Math.min(g.tokens.length, g.visibles + (reducir ? g.tokens.length : 1 + Math.floor(Math.random() * 3))) } : g)),
      reducir ? 0 : 22 + Math.random() * 30,
    );
    return () => clearTimeout(t);
  }, [gen, reducir, conv.mensajes]);

  // Mantener el scroll abajo mientras se escribe, salvo que el usuario haya subido.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (conv.mensajes.length === 0) el.scrollTop = 0;
    else if (alFondo.current) el.scrollTop = el.scrollHeight;
  }, [gen?.visibles, gen?.fase, conv.mensajes.length, conv.id]);

  const enviar = (texto: string) => {
    const q = texto.trim();
    if (!q || gen) return;
    const r = responder(q);
    const ahora = Date.now();
    const u: Mensaje = { id: nuevoId("u"), rol: "usuario", texto: q, hora: ahora };
    const a: Mensaje = { id: nuevoId("a"), rol: "asistente", texto: r.texto, hora: ahora + 1, fuentes: r.fuentes, relacionadas: r.relacionadas, feedback: null };
    actualizarConv(conv.id, (c) => ({
      ...c,
      titulo: c.mensajes.length === 0 ? tituloDesde(q) : c.titulo,
      mensajes: [...c.mensajes, u, a],
      actualizada: ahora,
    }));
    setEstado((e) => {
      // La conversación activa sube al principio de la lista.
      const c = e.conversaciones.find((x) => x.id === conv.id)!;
      return { ...e, conversaciones: [c, ...e.conversaciones.filter((x) => x.id !== conv.id)] };
    });
    alFondo.current = true;
    setEntrada("");
    setAnuncio("El asistente está buscando en los documentos…");
    setGen({ convId: conv.id, msgId: a.id, fase: "pensando", tokens: r.texto.match(/\s+|[^\s]+/g) ?? [], visibles: 0, paso: 0 });
  };

  const detener = () => {
    if (!gen) return;
    const parcial = gen.tokens.slice(0, gen.visibles).join("").trimEnd();
    actualizarConv(gen.convId, (c) => ({
      ...c,
      mensajes: c.mensajes.map((m) => (m.id === gen.msgId ? { ...m, texto: parcial ? `${parcial}…` : "", detenida: true } : m)),
    }));
    setGen(null);
    setAnuncio("Respuesta detenida.");
  };

  const nuevaConversacion = () => {
    if (gen) return;
    setSidebar(false);
    const vacia = estado.conversaciones.find((c) => c.mensajes.length === 0);
    if (vacia) {
      setEstado((e) => ({ ...e, activa: vacia.id }));
    } else {
      const c: Conversacion = { id: nuevoId("c"), titulo: "Nueva conversación", mensajes: [], actualizada: Date.now() };
      setEstado((e) => ({ ...e, activa: c.id, conversaciones: [c, ...e.conversaciones] }));
    }
    setResaltado(null);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const borrarConversacion = (id: string) => {
    if (gen?.convId === id) return;
    setEstado((e) => {
      let conversaciones = e.conversaciones.filter((c) => c.id !== id);
      if (conversaciones.length === 0) conversaciones = [{ id: nuevoId("c"), titulo: "Nueva conversación", mensajes: [], actualizada: Date.now() }];
      return { ...e, conversaciones, activa: e.activa === id ? conversaciones[0]!.id : e.activa };
    });
    setAnuncio("Conversación borrada.");
  };

  const abrirCita = useCallback((id: string) => {
    setResaltado({ id, t: Date.now() });
    if (!window.matchMedia("(min-width: 1280px)").matches) setDocsMovil(true);
  }, []);

  const restablecer = () => {
    setGen(null);
    resetEstado();
    setResaltado(null);
    setConfirmarReset(false);
    setSidebar(false);
    setAnuncio("La demo volvió a su estado inicial.");
  };

  const sidebarContenido = (
    <Sidebar
      estado={estado}
      activa={conv.id}
      ocupado={!!gen}
      cargado={cargado}
      elegir={(id) => {
        if (gen) return;
        setEstado((e) => ({ ...e, activa: id }));
        setResaltado(null);
        setSidebar(false);
      }}
      nueva={nuevaConversacion}
      borrar={borrarConversacion}
      confirmarReset={confirmarReset}
      setConfirmarReset={setConfirmarReset}
      restablecer={restablecer}
    />
  );

  const fuentesConv = useMemo(() => new Set(conv.mensajes.flatMap((m) => m.fuentes ?? [])), [conv.mensajes]);

  return (
    <div
      data-demo="asistente"
      className="flex h-[calc(100dvh-7rem)] min-h-[560px] w-full overflow-hidden bg-[#0E1416] text-[#E6ECE9] font-[family-name:var(--font-as-sans)] sm:h-[calc(100dvh-6rem)] [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#9FD4B8]"
    >
      <style>{`body:has([data-demo="asistente"]){background:#0B1012}
        @keyframes as-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        @keyframes as-dot{0%,80%,100%{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}
        @keyframes as-flash{0%{background-color:rgba(242,197,124,.32)}100%{background-color:rgba(242,197,124,.1)}}`}</style>
      <p className="sr-only" aria-live="polite">
        {anuncio}
      </p>

      <aside className="hidden w-[272px] shrink-0 flex-col border-r border-white/[0.07] bg-[#0B1113] lg:flex" aria-label="Conversaciones">
        {sidebarContenido}
      </aside>
      <Dialog
        abierto={sidebar}
        onClose={() => setSidebar(false)}
        labelledBy="as-sidebar-titulo"
        lado="izquierda"
        overlayClassName="bg-black/55 lg:hidden"
        className="relative flex h-full w-[86vw] max-w-[310px] flex-col bg-[#0B1113] font-[family-name:var(--font-as-sans)] text-[#E6ECE9] shadow-2xl outline-none [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#9FD4B8]"
      >
        <button
          type="button"
          onClick={() => setSidebar(false)}
          className="absolute right-3 top-4 grid size-9 place-items-center rounded-lg text-[#8FA09C] hover:bg-white/5 hover:text-white"
          aria-label="Cerrar conversaciones"
        >
          <IcX className="size-5" />
        </button>
        {sidebarContenido}
      </Dialog>

      {/* Chat */}
      <section className="flex min-w-0 flex-1 flex-col" aria-label="Chat con el asistente">
        <header className="flex items-center gap-2 border-b border-white/[0.07] px-3 py-2.5 sm:px-5">
          <button
            type="button"
            onClick={() => setSidebar(true)}
            className="grid size-9 shrink-0 place-items-center rounded-lg text-[#AEBBB7] hover:bg-white/5 lg:hidden"
            aria-label="Ver conversaciones"
          >
            <IcMenu className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className={`${serif} truncate text-[18px] font-medium tracking-[-0.01em] text-[#F3F6F4] sm:text-[20px]`}>{conv.titulo}</h1>
            <p className="hidden truncate text-[12.5px] text-[#8FA09C] sm:block">Asistente del Consorcio Torre Alameda · responde con 4 documentos</p>
          </div>
          <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-[#F2C57C]/30 bg-[#F2C57C]/10 px-2.5 py-1 text-[12px] font-medium text-[#F2C57C] md:inline-flex">
            <span className="size-1.5 rounded-full bg-[#F2C57C]" aria-hidden="true" />
            Demo: las respuestas son simuladas
          </span>
          <button
            type="button"
            onClick={() => setDocsMovil(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-[13px] font-medium text-[#D5DDD9] transition hover:border-[#9FD4B8]/40 hover:text-white xl:hidden"
          >
            <IcDocs className="size-4" /> <span className="hidden sm:inline">Documentos</span>
            <span className="sr-only sm:hidden">Ver documentos fuente</span>
          </button>
        </header>
        <p className="border-b border-[#F2C57C]/15 bg-[#F2C57C]/[0.07] px-4 py-1.5 text-center text-[12px] font-medium text-[#F2C57C] md:hidden">
          Demo: las respuestas son simuladas
        </p>

        <div
          ref={scrollRef}
          onScroll={(e) => {
            const el = e.currentTarget;
            alFondo.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
          }}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-color:#2A3A3A_transparent] [scrollbar-width:thin]"
        >
          {conv.mensajes.length === 0 ? (
            <Bienvenida enviar={enviar} />
          ) : (
            <div role="log" aria-label="Mensajes" className="mx-auto w-full max-w-[760px] space-y-7 px-4 py-6 sm:px-6 sm:py-8">
              {conv.mensajes.map((m, i) =>
                m.rol === "usuario" ? (
                  <MensajeUsuario key={m.id} m={m} cargado={cargado} />
                ) : (
                  <MensajeAsistente
                    key={m.id}
                    m={m}
                    gen={gen?.msgId === m.id ? gen : null}
                    ultimo={i === conv.mensajes.length - 1}
                    ocupado={!!gen}
                    cargado={cargado}
                    onCita={abrirCita}
                    resaltado={resaltado?.id ?? null}
                    enviar={enviar}
                    feedback={(v) =>
                      actualizarConv(conv.id, (c) => ({
                        ...c,
                        mensajes: c.mensajes.map((x) => (x.id === m.id ? { ...x, feedback: x.feedback === v ? null : v } : x)),
                      }))
                    }
                  />
                ),
              )}
            </div>
          )}
        </div>

        <Composer entrada={entrada} setEntrada={setEntrada} enviar={() => enviar(entrada)} detener={detener} ocupado={!!gen} inputRef={inputRef} />
      </section>

      {/* Documentos */}
      <aside className="hidden w-[380px] shrink-0 flex-col border-l border-white/[0.07] bg-[#0B1113] xl:flex" aria-label="Documentos fuente">
        <PanelDocs resaltado={resaltado} citados={fuentesConv} reducir={reducir} />
      </aside>
      <Dialog
        abierto={docsMovil}
        onClose={() => setDocsMovil(false)}
        labelledBy="as-docs-titulo"
        lado="derecha"
        overlayClassName="bg-black/55 xl:hidden"
        className="relative flex h-full w-[92vw] max-w-[420px] flex-col bg-[#0B1113] font-[family-name:var(--font-as-sans)] text-[#E6ECE9] shadow-2xl outline-none [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#9FD4B8]"
      >
        <PanelDocs resaltado={resaltado} citados={fuentesConv} reducir={reducir} cerrar={() => setDocsMovil(false)} />
      </Dialog>
    </div>
  );
}

/* ---------------- Sidebar ---------------- */

function Sidebar({
  estado,
  activa,
  ocupado,
  cargado,
  elegir,
  nueva,
  borrar,
  confirmarReset,
  setConfirmarReset,
  restablecer,
}: {
  estado: EstadoChat;
  activa: string;
  ocupado: boolean;
  cargado: boolean;
  elegir: (id: string) => void;
  nueva: () => void;
  borrar: (id: string) => void;
  confirmarReset: boolean;
  setConfirmarReset: (v: boolean) => void;
  restablecer: () => void;
}) {
  const grupos = useMemo(() => {
    const m = new Map<string, Conversacion[]>();
    for (const c of estado.conversaciones) {
      const k = c.mensajes.length === 0 ? "Hoy" : fechaRelativa(c.actualizada);
      m.set(k, [...(m.get(k) ?? []), c]);
    }
    return [...m.entries()];
  }, [estado.conversaciones]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-3 px-4 pb-4 pt-5">
        <Marca />
        <div className="min-w-0">
          <p id="as-sidebar-titulo" className={`${serif} text-[17px] font-medium leading-tight text-[#F3F6F4]`}>
            Torre Alameda
          </p>
          <p className="text-[12px] text-[#8FA09C]">Asistente del consorcio</p>
        </div>
      </div>
      <div className="px-3">
        <button
          type="button"
          onClick={nueva}
          disabled={ocupado}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#9FD4B8] px-3 py-2.5 text-[14px] font-semibold text-[#0E1416] transition hover:bg-[#B5E0C9] disabled:opacity-50"
        >
          <IcPlus className="size-4" /> Nueva conversación
        </button>
      </div>
      <nav aria-label="Historial de conversaciones" className="mt-4 min-h-0 flex-1 overflow-y-auto px-2 pb-3 [scrollbar-width:thin]">
        {grupos.map(([g, lista]) => (
          <div key={g} className="mb-3">
            <h2 className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#667773]">{cargado ? g : " "}</h2>
            <ul>
              {lista.map((c) => {
                const act = c.id === activa;
                return (
                  <li key={c.id} className="group relative">
                    <button
                      type="button"
                      onClick={() => elegir(c.id)}
                      aria-current={act ? "true" : undefined}
                      className={`flex w-full items-center gap-2.5 rounded-lg py-2 pl-2.5 pr-9 text-left text-[13.5px] transition ${
                        act ? "bg-white/[0.07] text-[#F3F6F4]" : "text-[#AEBBB7] hover:bg-white/[0.04] hover:text-[#E6ECE9]"
                      }`}
                    >
                      <IcChat className={`size-4 shrink-0 ${act ? "text-[#9FD4B8]" : "text-[#667773]"}`} />
                      <span className="truncate">{c.titulo}</span>
                    </button>
                    {c.mensajes.length > 0 && (
                      <button
                        type="button"
                        onClick={() => borrar(c.id)}
                        className="absolute right-1.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-[#667773] opacity-100 transition hover:bg-white/10 hover:text-[#F2A38C] focus-visible:opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                        aria-label={`Borrar conversación «${c.titulo}»`}
                      >
                        <IcTrash className="size-3.5" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/[0.07] p-3">
        {confirmarReset ? (
          <div className="rounded-xl border border-white/10 p-3 text-[13px]" role="group" aria-label="Confirmar restablecer">
            <p className="mb-2 text-[#D5DDD9]">¿Borrar tus conversaciones y volver al inicio?</p>
            <div className="flex gap-2">
              <button type="button" onClick={restablecer} className="rounded-lg bg-[#9FD4B8] px-3 py-1.5 font-semibold text-[#0E1416]">
                Restablecer
              </button>
              <button type="button" onClick={() => setConfirmarReset(false)} className="rounded-lg px-3 py-1.5 text-[#AEBBB7] hover:bg-white/5">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmarReset(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-[13px] font-medium text-[#AEBBB7] transition hover:border-white/20 hover:text-white"
          >
            <IcReset className="size-4" /> Restablecer demo
          </button>
        )}
        <p className="mt-2.5 text-center text-[11.5px] leading-snug text-[#667773]">Demo con contenido ficticio. Nada sale de tu navegador.</p>
      </div>
    </div>
  );
}

/* ---------------- Mensajes ---------------- */

function Bienvenida({ enviar }: { enviar: (q: string) => void }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-[720px] flex-col justify-center px-4 py-8 sm:px-6">
      <div className="motion-safe:animate-[as-in_500ms_ease-out]">
        <Image
          src="/demos/web-apps/asistente/torre-alameda.webp"
          alt="Ilustración de la Torre Alameda al atardecer, rodeada de álamos"
          width={240}
          height={240}
          sizes="96px"
          className="mb-5 size-20 rounded-full sm:size-24"
          priority
        />
        <h2 className={`${serif} text-[30px] font-normal leading-[1.1] tracking-[-0.02em] text-[#F3F6F4] sm:text-[40px]`}>
          ¿En qué te ayudo, <em className="text-[#9FD4B8]">vecino</em>?
        </h2>
        <p className="mt-3 max-w-[54ch] text-[15px] leading-relaxed text-[#AEBBB7]">
          Respondo con el reglamento, las actas y la circular de expensas del edificio. Cada dato viene con su cita: tocá el número para ver el fragmento original.
        </p>
        <h3 className="mb-2.5 mt-8 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#667773]">Preguntas frecuentes</h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {SUGERIDAS.map((q) => (
            <li key={q}>
              <button
                type="button"
                onClick={() => enviar(q)}
                className="group flex w-full items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-left text-[14px] text-[#D5DDD9] transition hover:border-[#9FD4B8]/40 hover:bg-[#9FD4B8]/[0.06] hover:text-white"
              >
                {q}
                <IcSend className="size-4 shrink-0 text-[#667773] transition group-hover:translate-x-0.5 group-hover:text-[#9FD4B8]" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MensajeUsuario({ m, cargado }: { m: Mensaje; cargado: boolean }) {
  return (
    <div className="flex justify-end motion-safe:animate-[as-in_250ms_ease-out]">
      <div className="max-w-[85%]">
        <p className="sr-only">Vos dijiste:</p>
        <div className="rounded-2xl rounded-br-md bg-[#1D3A32] px-4 py-2.5 text-[15px] leading-relaxed text-[#EAF4EF]">{m.texto}</div>
        <p className="mt-1 text-right text-[11.5px] text-[#667773]">{cargado ? horaCorta(m.hora) : " "}</p>
      </div>
    </div>
  );
}

function Pensando({ fuentes, paso }: { fuentes: string[]; paso: number }) {
  const pasos = [
    "Buscando en 4 documentos",
    fuentes[0] ? `Leyendo ${documento(fragmento(fuentes[0])!.doc).corto.toLowerCase()}, ${fragmento(fuentes[0])!.ref.toLowerCase()}` : "Revisando reglamento y actas",
    "Redactando la respuesta",
  ];
  return (
    <div className="flex flex-col gap-2 py-1" aria-label="El asistente está pensando">
      <div className="flex items-center gap-2 text-[14px] text-[#AEBBB7]">
        <span className="flex gap-1" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-1.5 rounded-full bg-[#9FD4B8] motion-safe:animate-[as-dot_1.1s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </span>
        <span>{pasos[Math.min(paso, pasos.length - 1)]}…</span>
      </div>
      <ol className="flex flex-wrap gap-1.5">
        {pasos.slice(0, paso).map((p) => (
          <li key={p} className="flex items-center gap-1 rounded-full bg-white/[0.04] px-2 py-0.5 text-[11.5px] text-[#8FA09C]">
            <IcCheck className="size-3 text-[#9FD4B8]" /> {p}
          </li>
        ))}
      </ol>
    </div>
  );
}

function MensajeAsistente({
  m,
  gen,
  ultimo,
  ocupado,
  cargado,
  onCita,
  resaltado,
  enviar,
  feedback,
}: {
  m: Mensaje;
  gen: Generacion | null;
  ultimo: boolean;
  ocupado: boolean;
  cargado: boolean;
  onCita: (id: string, n: number) => void;
  resaltado: string | null;
  enviar: (q: string) => void;
  feedback: (v: "bien" | "mal") => void;
}) {
  const [copiado, setCopiado] = useState(false);
  const escribiendo = !!gen;
  const texto = gen ? gen.tokens.slice(0, gen.visibles).join("") : m.texto;
  const terminado = !gen;
  return (
    <article className="flex gap-3 motion-safe:animate-[as-in_250ms_ease-out]" aria-busy={escribiendo}>
      <AvatarAsistente />
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="mb-1 flex items-center gap-2 text-[12.5px] font-semibold text-[#9FD4B8]">
          Asistente
          {cargado && terminado && <span className="font-normal text-[#667773]">{horaCorta(m.hora)}</span>}
        </p>
        {gen?.fase === "pensando" ? (
          <Pensando fuentes={m.fuentes ?? []} paso={gen.paso} />
        ) : (
          <Rich texto={texto} fuentes={m.fuentes} onCita={onCita} cursor={escribiendo} />
        )}
        {m.detenida && <p className="mt-2 text-[12.5px] italic text-[#8FA09C]">Respuesta detenida.</p>}

        {terminado && (m.fuentes?.length ?? 0) > 0 && (
          <div className="mt-4">
            <p className="mb-1.5 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#667773]">Fuentes</p>
            <ul className="flex flex-wrap gap-1.5">
              {m.fuentes!.map((id, i) => {
                const f = fragmento(id);
                if (!f) return null;
                const act = resaltado === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => onCita(id, i + 1)}
                      className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[12.5px] transition ${
                        act ? "border-[#F2C57C]/60 bg-[#F2C57C]/10 text-[#F7DDB1]" : "border-white/[0.09] bg-white/[0.02] text-[#AEBBB7] hover:border-[#9FD4B8]/40 hover:text-white"
                      }`}
                    >
                      <span className="grid size-[18px] place-items-center rounded-[5px] bg-[#9FD4B8]/15 text-[11px] font-semibold text-[#9FD4B8]">{i + 1}</span>
                      <span>
                        {documento(f.doc).corto} · <span className="text-[#8FA09C]">{f.ref}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {terminado && (
          <div className="mt-3 flex items-center gap-1 text-[#8FA09C]">
            <button
              type="button"
              onClick={async () => {
                const ok = await copiarTexto(textoPlano(m));
                setCopiado(ok);
                setTimeout(() => setCopiado(false), 1800);
              }}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[12.5px] transition hover:bg-white/5 hover:text-white"
            >
              {copiado ? <IcCheck className="size-4 text-[#9FD4B8]" /> : <IcCopy className="size-4" />}
              {copiado ? "Copiado" : "Copiar"}
            </button>
            <span className="sr-only" aria-live="polite">
              {copiado ? "Respuesta copiada al portapapeles" : ""}
            </span>
            <button
              type="button"
              onClick={() => feedback("bien")}
              aria-pressed={m.feedback === "bien"}
              aria-label="Buena respuesta"
              className={`grid size-7 place-items-center rounded-md transition hover:bg-white/5 hover:text-white ${m.feedback === "bien" ? "text-[#9FD4B8]" : ""}`}
            >
              <IcUp className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => feedback("mal")}
              aria-pressed={m.feedback === "mal"}
              aria-label="Mala respuesta"
              className={`grid size-7 place-items-center rounded-md transition hover:bg-white/5 hover:text-white ${m.feedback === "mal" ? "text-[#F2A38C]" : ""}`}
            >
              <IcDown className="size-4" />
            </button>
            {m.feedback && <span className="ml-1 text-[12px] text-[#8FA09C]">¡Gracias por avisar!</span>}
          </div>
        )}

        {terminado && ultimo && (m.relacionadas?.length ?? 0) > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#667773]">Seguí preguntando</p>
            <div className="flex flex-wrap gap-2">
              {m.relacionadas!.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => enviar(q)}
                  disabled={ocupado}
                  className="rounded-full border border-white/[0.09] px-3 py-1.5 text-[13px] text-[#D5DDD9] transition hover:border-[#9FD4B8]/50 hover:bg-[#9FD4B8]/[0.06] hover:text-white disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function Composer({
  entrada,
  setEntrada,
  enviar,
  detener,
  ocupado,
  inputRef,
}: {
  entrada: string;
  setEntrada: (v: string) => void;
  enviar: () => void;
  detener: () => void;
  ocupado: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [entrada, inputRef]);

  return (
    <div className="border-t border-white/[0.07] bg-[#0E1416] px-3 pb-3 pt-3 sm:px-6 sm:pb-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          enviar();
        }}
        className="mx-auto flex max-w-[760px] items-end gap-2 rounded-2xl border border-white/[0.1] bg-[#131C1F] p-2 pl-4 transition focus-within:border-[#9FD4B8]/50 focus-within:shadow-[0_0_0_4px_rgba(159,212,184,0.08)]"
      >
        <label htmlFor="as-entrada" className="sr-only">
          Escribí tu pregunta
        </label>
        <textarea
          id="as-entrada"
          ref={inputRef}
          rows={1}
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              enviar();
            }
          }}
          placeholder="Escribí tu pregunta…"
          maxLength={400}
          className="max-h-40 min-h-[40px] flex-1 resize-none bg-transparent py-2 text-[15px] leading-6 text-[#F3F6F4] outline-none placeholder:text-[#667773] [&:focus-visible]:outline-none"
        />
        {ocupado ? (
          <button
            type="button"
            onClick={detener}
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-white/15 px-3 text-[13px] font-medium text-[#E6ECE9] transition hover:bg-white/5"
          >
            <IcStop className="size-3.5" /> Detener
          </button>
        ) : (
          <button
            type="submit"
            disabled={!normalizar(entrada)}
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#9FD4B8] text-[#0E1416] transition hover:bg-[#B5E0C9] disabled:bg-white/[0.08] disabled:text-[#667773]"
            aria-label="Enviar pregunta"
          >
            <IcSend className="size-5" />
          </button>
        )}
      </form>
      <p className="mx-auto mt-2 max-w-[760px] text-center text-[11.5px] leading-snug text-[#667773]">
        <span className="font-semibold text-[#AEBBB7]">Demo: las respuestas son simuladas</span> con un buscador local sobre documentos ficticios. No se envía nada a
        ningún servidor.
      </p>
    </div>
  );
}

/* ---------------- Panel de documentos ---------------- */

function PanelDocs({
  resaltado,
  citados,
  reducir,
  cerrar,
}: {
  resaltado: { id: string; t: number } | null;
  citados: Set<string>;
  reducir: boolean;
  cerrar?: () => void;
}) {
  const [abiertos, setAbiertos] = useState<Set<string>>(() => new Set(["reglamento"]));
  const [filtro, setFiltro] = useState("");
  const contRef = useRef<HTMLDivElement>(null);

  // Al citar un fragmento: abrir su documento, hacer scroll y enfocarlo.
  useEffect(() => {
    if (!resaltado) return;
    const f = fragmento(resaltado.id);
    if (!f) return;
    setFiltro("");
    setAbiertos((a) => (a.has(f.doc) ? a : new Set([...a, f.doc])));
    const t = setTimeout(() => {
      const el = contRef.current?.querySelector<HTMLElement>(`[data-frag="${resaltado.id}"]`);
      if (!el) return;
      el.scrollIntoView({ behavior: reducir ? "auto" : "smooth", block: "center" });
      el.focus({ preventScroll: true });
    }, 60);
    return () => clearTimeout(t);
  }, [resaltado, reducir]);

  const q = normalizar(filtro);
  const coincide = (texto: string) => !q || normalizar(texto).includes(q);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-white/[0.07] px-4 pb-3 pt-4">
        <div className="flex items-center justify-between gap-2">
          <h2 id="as-docs-titulo" className={`${serif} text-[18px] font-medium text-[#F3F6F4]`}>
            Documentos fuente
          </h2>
          {cerrar && (
            <button type="button" onClick={cerrar} className="grid size-9 place-items-center rounded-lg text-[#8FA09C] hover:bg-white/5 hover:text-white" aria-label="Cerrar documentos">
              <IcX className="size-5" />
            </button>
          )}
        </div>
        <p className="mt-0.5 text-[12.5px] text-[#8FA09C]">{DOCUMENTOS.length} documentos · {FRAGMENTOS.length} fragmentos indexados</p>
        <div className="relative mt-3">
          <IcSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#667773]" />
          <label htmlFor={cerrar ? "as-filtro-m" : "as-filtro"} className="sr-only">
            Buscar en los documentos
          </label>
          <input
            id={cerrar ? "as-filtro-m" : "as-filtro"}
            type="search"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Buscar en los documentos"
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-2 pl-9 pr-3 text-[13.5px] text-[#E6ECE9] outline-none placeholder:text-[#667773] focus:border-[#9FD4B8]/50"
          />
        </div>
      </div>
      <div ref={contRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-3 [scrollbar-width:thin]">
        {DOCUMENTOS.map((d) => {
          const frags = FRAGMENTOS.filter((f) => f.doc === d.id && coincide(`${f.titulo} ${f.texto} ${f.ref}`));
          if (q && frags.length === 0) return null;
          const abierto = !!q || abiertos.has(d.id);
          const nCitados = FRAGMENTOS.filter((f) => f.doc === d.id && citados.has(f.id)).length;
          return (
            <section key={d.id} className="mb-2 rounded-xl border border-white/[0.07] bg-white/[0.015]">
              <h3>
                <button
                  type="button"
                  onClick={() =>
                    setAbiertos((a) => {
                      const n = new Set(a);
                      if (n.has(d.id)) n.delete(d.id);
                      else n.add(d.id);
                      return n;
                    })
                  }
                  aria-expanded={abierto}
                  aria-controls={`doc-${d.id}${cerrar ? "-m" : ""}`}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/[0.03]"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#17312A] text-[#9FD4B8]">
                    <IcDocs className="size-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-semibold text-[#E6ECE9]">{d.titulo}</span>
                    <span className="block text-[12px] text-[#8FA09C]">
                      {d.fecha} · {d.paginas} págs.
                      {nCitados > 0 && <span className="text-[#9FD4B8]"> · {nCitados} citado{nCitados > 1 ? "s" : ""}</span>}
                    </span>
                  </span>
                  <IcChevron abierto={abierto} className="size-4 shrink-0 text-[#8FA09C]" />
                </button>
              </h3>
              {abierto && (
                <div id={`doc-${d.id}${cerrar ? "-m" : ""}`} className="space-y-1 px-2 pb-2">
                  {frags.map((f) => {
                    const act = resaltado?.id === f.id;
                    return (
                      <div
                        key={f.id}
                        data-frag={f.id}
                        tabIndex={-1}
                        className={`rounded-lg px-3 py-2.5 outline-none transition-colors ${
                          act ? "bg-[#F2C57C]/10 ring-1 ring-[#F2C57C]/50 motion-safe:animate-[as-flash_1.6s_ease-out]" : "hover:bg-white/[0.02]"
                        }`}
                      >
                        <p className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-[#8FA09C]">
                          <span className={`shrink-0 whitespace-nowrap ${act ? "text-[#F2C57C]" : "text-[#9FD4B8]"}`}>{f.ref}</span>
                          <span className="truncate normal-case tracking-normal text-[#AEBBB7]">{f.titulo}</span>
                          {act && <span className="ml-auto shrink-0 rounded bg-[#F2C57C]/15 px-1.5 py-0.5 text-[10.5px] text-[#F2C57C]">Citado</span>}
                        </p>
                        <p className={`${serif} mt-1.5 text-[14.5px] leading-[1.6] ${act ? "text-[#F7EBD5]" : "text-[#BFCAC6]"}`}>{f.texto}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
        {q && !FRAGMENTOS.some((f) => coincide(`${f.titulo} ${f.texto} ${f.ref}`)) && (
          <p className="px-2 py-6 text-center text-[13px] text-[#8FA09C]">No hay fragmentos que contengan «{filtro}».</p>
        )}
        <p className="px-2 pb-2 pt-3 text-center text-[11.5px] text-[#667773]">Documentos ficticios redactados para la demo.</p>
      </div>
    </div>
  );
}
