/**
 * Wordmark tipográfico: el nombre en la grotesca del sitio, con tracking apretado y un punto
 * en mostaza. Las palabras entran en secuencia (clase .wm-letter en globals.css).
 */
export function Wordmark({ className = "", texto = "Francisco Zago" }: { className?: string; texto?: string }) {
  return (
    <p className={`leading-[0.88] font-semibold tracking-[-0.055em] whitespace-nowrap ${className}`}>
      <span className="sr-only">{texto}</span>
      {texto.split(" ").map((palabra, i) => (
        <span key={i} aria-hidden className="wm-letter inline-block" style={{ "--i": i } as React.CSSProperties}>
          {palabra}
          {i < texto.split(" ").length - 1 ? " " : null}
        </span>
      ))}
      <span
        aria-hidden
        className="wm-letter ml-[0.04em] inline-block size-[0.16em] bg-mostaza align-baseline"
        style={{ "--i": 2 } as React.CSSProperties}
      />
    </p>
  );
}
