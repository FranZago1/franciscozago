type Props = {
  children: React.ReactNode;
  /** Nombre del frame, como en Figma (arriba a la izquierda). */
  nombre?: string;
  /** Medidas u otra info (abajo al centro). */
  medida?: string;
  tono?: "accent" | "ink";
  className?: string;
  padding?: string;
};

const handle = "pointer-events-none absolute size-2.5 border-[1.5px] bg-white";

/** Marco de selección con handles en las esquinas, como un objeto seleccionado en un editor. */
export function SelectionFrame({ children, nombre, medida, tono = "accent", className = "", padding = "p-3" }: Props) {
  const color = tono === "accent" ? "border-accent" : "border-ink";
  return (
    <div className={`relative border-[1.5px] ${color} ${padding} ${className}`}>
      {nombre ? (
        <span aria-hidden className={`label-mono absolute -top-6 left-0 text-[11px] ${tono === "accent" ? "text-accent" : "text-ink"}`}>
          {nombre}
        </span>
      ) : null}
      <span aria-hidden className={`${handle} ${color} -left-[6px] -top-[6px]`} />
      <span aria-hidden className={`${handle} ${color} -right-[6px] -top-[6px]`} />
      <span aria-hidden className={`${handle} ${color} -bottom-[6px] -left-[6px]`} />
      <span aria-hidden className={`${handle} ${color} -bottom-[6px] -right-[6px]`} />
      {medida ? (
        <span
          aria-hidden
          className="label-mono absolute -bottom-7 left-1/2 -translate-x-1/2 rounded-[3px] bg-accent px-1.5 py-0.5 text-[10px] whitespace-nowrap text-white"
        >
          {medida}
        </span>
      ) : null}
      {children}
    </div>
  );
}
