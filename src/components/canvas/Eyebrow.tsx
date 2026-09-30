/** Rótulo de sección: número entre paréntesis en el color de acento + nombre en mono. */
export function Eyebrow({ n, children, className = "" }: { n?: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={`label-mono flex items-center gap-2 text-[13px] text-muted ${className}`}>
      {n ? <span className="text-accent">({n})</span> : null}
      {children}
    </p>
  );
}
