/** Íconos SVG propios, de trazo, coherentes entre sí. El grosor se ajusta por demo con `trazo`. */

type P = { className?: string; trazo?: number };

function Svg({ className = "size-5", trazo = 1.75, children }: P & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={trazo}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

export const IconoBolsa = (p: P) => (
  <Svg {...p}>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </Svg>
);
export const IconoCerrar = (p: P) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);
export const IconoMas = (p: P) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);
export const IconoMenos = (p: P) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
);
export const IconoBasura = (p: P) => (
  <Svg {...p}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
  </Svg>
);
export const IconoFlecha = (p: P) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);
export const IconoVolver = (p: P) => (
  <Svg {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Svg>
);
export const IconoCheck = (p: P) => (
  <Svg {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
);
export const IconoCamion = (p: P) => (
  <Svg {...p}>
    <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" />
    <circle cx="7" cy="17.5" r="1.8" />
    <circle cx="17.5" cy="17.5" r="1.8" />
  </Svg>
);
export const IconoEscudo = (p: P) => (
  <Svg {...p}>
    <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3Z" />
    <path d="M9 12l2 2 4-4" />
  </Svg>
);
export const IconoCandado = (p: P) => (
  <Svg {...p}>
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </Svg>
);
export const IconoTarjeta = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="M3 10h18M7 15h4" />
  </Svg>
);
export const IconoLocal = (p: P) => (
  <Svg {...p}>
    <path d="M4 10l1.5-5h13L20 10M4 10h16M4 10v10h16V10M9 20v-5h6v5" />
  </Svg>
);
export const IconoRayo = (p: P) => (
  <Svg {...p}>
    <path d="M13 3L5 13.5h6L10 21l8-10.5h-6L13 3Z" />
  </Svg>
);
export const IconoFiltro = (p: P) => (
  <Svg {...p}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </Svg>
);
export const IconoRegla = (p: P) => (
  <Svg {...p}>
    <rect x="2.5" y="8" width="19" height="8" rx="1.5" />
    <path d="M6.5 8v3M10 8v4M13.5 8v3M17 8v4" />
  </Svg>
);
export const IconoHoja = (p: P) => (
  <Svg {...p}>
    <path d="M5 19C5 10 10 5 20 4c0 10-5 15-14 15" />
    <path d="M5 19c3-5 6-8 10-10" />
  </Svg>
);
export const IconoBuscar = (p: P) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.2-4.2" />
  </Svg>
);
export const IconoComparar = (p: P) => (
  <Svg {...p}>
    <rect x="3.5" y="4" width="7" height="16" rx="1.5" />
    <rect x="13.5" y="4" width="7" height="16" rx="1.5" />
  </Svg>
);
export const IconoDevolucion = (p: P) => (
  <Svg {...p}>
    <path d="M4 9h11a5 5 0 0 1 0 10H9" />
    <path d="M8 5L4 9l4 4" />
  </Svg>
);
export const IconoMenu = (p: P) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);
export const IconoChevron = (p: P) => (
  <Svg {...p}>
    <path d="M6 9l6 6 6-6" />
  </Svg>
);
export const IconoInfo = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </Svg>
);
export const IconoGota = (p: P) => (
  <Svg {...p}>
    <path d="M12 3.5C9 8 6.5 11 6.5 14.5a5.5 5.5 0 0 0 11 0C17.5 11 15 8 12 3.5Z" />
  </Svg>
);
export const IconoReloj = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
);
export const IconoCorazon = (p: P) => (
  <Svg {...p}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
  </Svg>
);

/** Estrellas de puntuación (0–5, admite medias). */
export function Estrellas({ valor, className = "size-4", colorLleno = "currentColor", colorVacio = "currentColor" }: { valor: number; className?: string; colorLleno?: string; colorVacio?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${String(valor).replace(".", ",")} de 5 estrellas`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const lleno = Math.max(0, Math.min(1, valor - i));
        return (
          <svg key={i} viewBox="0 0 20 20" className={className} aria-hidden="true">
            <defs>
              <linearGradient id={`e-${i}-${Math.round(lleno * 100)}`}>
                <stop offset={lleno} stopColor={colorLleno} />
                <stop offset={lleno} stopColor={colorVacio} stopOpacity="0.25" />
              </linearGradient>
            </defs>
            <path
              d="M10 1.8l2.5 5.3 5.7.7-4.2 3.9 1.1 5.7L10 14.6l-5.1 2.8L6 11.7 1.8 7.8l5.7-.7L10 1.8Z"
              fill={`url(#e-${i}-${Math.round(lleno * 100)})`}
            />
          </svg>
        );
      })}
    </span>
  );
}
