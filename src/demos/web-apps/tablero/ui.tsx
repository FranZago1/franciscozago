import { diasHasta, etiqueta, fechaCorta, persona, type Persona } from "./data";
import { IconCalendar } from "./icons";

export function Avatar({
  p,
  size = "md",
  ring = false,
}: {
  p: Persona | null;
  size?: "sm" | "md" | "lg";
  ring?: boolean;
}) {
  const dim = size === "sm" ? "size-6 text-[10px]" : size === "lg" ? "size-9 text-[13px]" : "size-7 text-[11px]";
  if (!p)
    return (
      <span
        className={`${dim} inline-grid shrink-0 place-items-center rounded-full border border-dashed border-zinc-300 bg-white text-zinc-400 ${ring ? "ring-2 ring-white" : ""}`}
        title="Sin responsable"
      >
        <svg viewBox="0 0 16 16" className="size-3" aria-hidden="true">
          <circle cx="8" cy="6" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M3.5 13.5c.8-2.2 2.5-3.2 4.5-3.2s3.7 1 4.5 3.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span className="sr-only">Sin responsable</span>
      </span>
    );
  return (
    <span
      className={`${dim} inline-grid shrink-0 place-items-center rounded-full font-semibold tracking-tight text-white ${ring ? "ring-2 ring-white" : ""}`}
      style={{ background: `linear-gradient(140deg, ${p.color}, color-mix(in oklab, ${p.color} 70%, black))` }}
      title={p.nombre}
    >
      <span aria-hidden="true">{p.iniciales}</span>
      <span className="sr-only">{p.nombre}</span>
    </span>
  );
}

export function AvatarDe({ id, size, ring }: { id: string | null; size?: "sm" | "md" | "lg"; ring?: boolean }) {
  return <Avatar p={persona(id)} size={size} ring={ring} />;
}

export function Chip({ id }: { id: string }) {
  const e = etiqueta(id);
  if (!e) return null;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold leading-4"
      style={{ background: e.fondo, color: e.texto }}
    >
      <span className="size-1.5 rounded-full" style={{ background: e.punto }} aria-hidden="true" />
      {e.nombre}
    </span>
  );
}

export function FechaChip({ fecha, listo }: { fecha: string; listo: boolean }) {
  const d = diasHasta(fecha);
  if (d === null) return null;
  let tono = "text-zinc-500 bg-transparent";
  let texto = fechaCorta(fecha);
  let sr = `Vence el ${texto}`;
  if (!listo) {
    if (d < 0) {
      tono = "text-[#C62A2F] bg-[#FDECEC]";
      sr = `Vencida desde el ${texto}`;
    } else if (d === 0) {
      tono = "text-[#B45309] bg-[#FEF3E2]";
      texto = "Hoy";
      sr = "Vence hoy";
    } else if (d === 1) {
      tono = "text-[#B45309] bg-[#FEF3E2]";
      texto = "Mañana";
      sr = "Vence mañana";
    }
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11.5px] font-medium ${tono}`}>
      <IconCalendar className="size-3.5" />
      <span aria-hidden="true">{texto}</span>
      <span className="sr-only">{sr}</span>
    </span>
  );
}
