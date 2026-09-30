import type { ReactNode } from "react";
import { Icon, type IconName } from "../shared/Icon";
import { iniciales } from "../shared/util";
import { etapaDe, type Etapa, type Prioridad, type TipoInteraccion, type TipoTarea } from "./data";

export const btn = {
  primario:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F4C5C] px-3.5 py-2 text-sm font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,.15)_inset,0_1px_2px_rgba(15,76,92,.35)] transition hover:bg-[#0B3D4A] active:translate-y-px disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4C5C]",
  secundario:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-[#D5DDE5] bg-white px-3.5 py-2 text-sm font-semibold text-[#1E293B] shadow-[0_1px_2px_rgba(15,23,42,.05)] transition hover:border-[#B8C4D0] hover:bg-[#F8FAFC] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4C5C]",
  fantasma:
    "inline-flex items-center justify-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-[#475569] transition hover:bg-[#EEF2F6] hover:text-[#0F172A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4C5C]",
  icono:
    "inline-grid size-9 place-items-center rounded-lg text-[#475569] transition hover:bg-[#EEF2F6] hover:text-[#0F172A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4C5C]",
  peligro:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-[#B42318] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#912018] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B42318]",
};

export const input =
  "w-full rounded-lg border border-[#D5DDE5] bg-white px-3 py-2 text-sm text-[#0F172A] shadow-[0_1px_2px_rgba(15,23,42,.04)] placeholder:text-[#94A3B8] transition focus:border-[#0F4C5C] focus:outline-none focus:ring-3 focus:ring-[#0F4C5C]/15 aria-[invalid=true]:border-[#D92D20] aria-[invalid=true]:ring-[#D92D20]/15";

export const label = "mb-1.5 block text-[13px] font-semibold text-[#334155]";

const AVATAR_COLORES = ["#0F4C5C", "#2F7DA8", "#7C5CBF", "#B7791F", "#0F766E", "#BE4B6A", "#4B6584", "#5B7B3A"];

export function Avatar({ nombre, size = "md" }: { nombre: string; size?: "sm" | "md" | "lg" }) {
  let h = 0;
  for (const ch of nombre) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const color = AVATAR_COLORES[h % AVATAR_COLORES.length];
  const cls = size === "sm" ? "size-6 text-[10px]" : size === "lg" ? "size-14 text-lg" : "size-9 text-xs";
  return (
    <span
      aria-hidden="true"
      className={`inline-grid shrink-0 place-items-center rounded-full font-bold tracking-wide text-white ${cls}`}
      style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
    >
      {iniciales(nombre)}
    </span>
  );
}

export function EtapaBadge({ etapa }: { etapa: Etapa }) {
  const e = etapaDe(etapa);
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold"
      style={{ background: e.suave, color: e.color }}
    >
      <span className="size-1.5 rounded-full" style={{ background: e.color }} aria-hidden="true" />
      {e.nombre}
    </span>
  );
}

const PRIO: Record<Prioridad, { c: string; t: string }> = {
  alta: { c: "#D92D20", t: "Prioridad alta" },
  media: { c: "#DC8A0E", t: "Prioridad media" },
  baja: { c: "#94A3B8", t: "Prioridad baja" },
};

export function PrioridadFlag({ p, conTexto = false }: { p: Prioridad; conTexto?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: PRIO[p].c }}>
      <Icon name="flag" className="size-3.5" strokeWidth={2.2} title={conTexto ? undefined : PRIO[p].t} />
      {conTexto ? <span className="capitalize">{p}</span> : null}
    </span>
  );
}

export const ICONO_INTERACCION: Record<TipoInteraccion, IconName> = {
  llamada: "phone",
  email: "mail",
  whatsapp: "chat",
  visita: "home",
  nota: "note",
  etapa: "arrow-right",
  alta: "star",
};

export const ICONO_TAREA: Record<TipoTarea, IconName> = {
  llamada: "phone",
  email: "mail",
  whatsapp: "chat",
  visita: "home",
  reunion: "users",
};

export function Seccion({
  titulo,
  accion,
  children,
  className = "",
}: {
  titulo: string;
  accion?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`border-t border-[#E6EBF0] px-5 py-5 sm:px-6 ${className}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#64748B]">{titulo}</h3>
        {accion}
      </div>
      {children}
    </section>
  );
}

export function Vacio({ icono, titulo, texto, children }: { icono: IconName; titulo: string; texto: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-[#CBD5E1] bg-white/60 px-6 py-10 text-center">
      <span className="mb-3 grid size-11 place-items-center rounded-full bg-[#E7F0F2] text-[#0F4C5C]">
        <Icon name={icono} />
      </span>
      <p className="font-semibold text-[#0F172A]">{titulo}</p>
      <p className="mt-1 max-w-sm text-sm text-[#64748B]">{texto}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
