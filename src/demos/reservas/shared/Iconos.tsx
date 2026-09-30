import type { SVGProps } from "react";

/** Íconos de línea propios (24×24, currentColor). El grosor se ajusta por demo. */
type P = SVGProps<SVGSVGElement> & { grosor?: number };

function Base({ grosor = 1.75, children, ...p }: P & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth={grosor}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...p}
    >
      {children}
    </svg>
  );
}

export const IconoCalendario = (p: P) => (
  <Base {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    <path d="M8 13h2M14 13h2M8 16.5h2" />
  </Base>
);

export const IconoReloj = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Base>
);

export const IconoCheck = (p: P) => (
  <Base {...p}>
    <path d="M5 12.5l4.2 4L19 7" />
  </Base>
);

export const IconoFlecha = (p: P) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
);

export const IconoFlechaIzq = (p: P) => (
  <Base {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Base>
);

export const IconoChevronIzq = (p: P) => (
  <Base {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Base>
);

export const IconoChevronDer = (p: P) => (
  <Base {...p}>
    <path d="M9 5l7 7-7 7" />
  </Base>
);

export const IconoUbicacion = (p: P) => (
  <Base {...p}>
    <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0113 0c0 5-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.4" />
  </Base>
);

export const IconoPersona = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20c.8-3.8 3.9-6 7.5-6s6.7 2.2 7.5 6" />
  </Base>
);

export const IconoPersonas = (p: P) => (
  <Base {...p}>
    <circle cx="9" cy="8.5" r="3.2" />
    <path d="M2.8 19.5c.6-3.3 3.2-5.2 6.2-5.2s5.6 1.9 6.2 5.2" />
    <path d="M15.5 5.6a3.2 3.2 0 010 6.1M17.6 14.6c2 .7 3.3 2.4 3.6 4.9" />
  </Base>
);

export const IconoTelefono = (p: P) => (
  <Base {...p}>
    <rect x="7" y="2.5" width="10" height="19" rx="2.2" />
    <path d="M11 18.5h2" />
  </Base>
);

export const IconoDescarga = (p: P) => (
  <Base {...p}>
    <path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14" />
  </Base>
);

export const IconoEstrella = ({ llena = true, ...p }: P & { llena?: boolean }) => (
  <Base {...p} fill={llena ? "currentColor" : "none"} strokeWidth={1.2}>
    <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z" />
  </Base>
);

export const IconoTicket = (p: P) => (
  <Base {...p}>
    <path d="M3.5 7.5a2 2 0 012-2h13a2 2 0 012 2v2a2.5 2.5 0 000 5v2a2 2 0 01-2 2h-13a2 2 0 01-2-2v-2a2.5 2.5 0 000-5z" />
    <path d="M14 5.5v13" strokeDasharray="2 2.2" />
  </Base>
);

export const IconoInfo = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5M12 7.8v.2" />
  </Base>
);

export const IconoAlerta = (p: P) => (
  <Base {...p}>
    <path d="M12 3.8l9 15.7H3z" />
    <path d="M12 10v4.2M12 17v.2" />
  </Base>
);

export const IconoMas = (p: P) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
);

export const IconoMenos = (p: P) => (
  <Base {...p}>
    <path d="M5 12h14" />
  </Base>
);

export const IconoCerrar = (p: P) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Base>
);

export const IconoTijera = (p: P) => (
  <Base {...p}>
    <circle cx="6" cy="17.5" r="2.8" />
    <circle cx="6" cy="6.5" r="2.8" />
    <path d="M8.3 8.2L20 17M8.3 15.8L20 7" />
  </Base>
);

export const IconoNavaja = (p: P) => (
  <Base {...p}>
    <path d="M3 15.5l9-9 2.5 2.5-9 9H3z" />
    <path d="M12 6.5l2-2 6.5 6.5-2 2" />
  </Base>
);

export const IconoSol = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="3.8" />
    <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
  </Base>
);

export const IconoTecho = (p: P) => (
  <Base {...p}>
    <path d="M2.5 11L12 4.5 21.5 11" />
    <path d="M5 10v9.5M19 10v9.5M3 19.5h18" />
  </Base>
);

export const IconoLuz = (p: P) => (
  <Base {...p}>
    <path d="M9 18h6M10 21h4" />
    <path d="M12 3a6 6 0 00-3.6 10.8c.7.6 1.1 1.4 1.1 2.2h5c0-.8.4-1.6 1.1-2.2A6 6 0 0012 3z" />
  </Base>
);

export const IconoPaleta = (p: P) => (
  <Base {...p}>
    <path d="M14.5 3.5a6 6 0 016 6c0 3.3-2.7 6-6 6-1.1 0-2.1-.3-3-.8L6.2 20a1.5 1.5 0 01-2.1-2.1l5.3-5.3a6 6 0 015.1-9.1z" />
    <path d="M13 8h.01M16 8h.01M14.5 11h.01" />
  </Base>
);

export const IconoPelota = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M5 6.5c3 1.5 4.5 4 4.5 5.5S8 16 5 17.5M19 6.5c-3 1.5-4.5 4-4.5 5.5s1.5 4 4.5 5.5" />
  </Base>
);

export const IconoFuego = (p: P) => (
  <Base {...p}>
    <path d="M12 21c-3.9 0-6.5-2.6-6.5-6 0-4 3.5-6 3.5-10 2.5 1.5 4.5 4 4.5 6.5 1-1 1.5-2.2 1.5-3.5 2 1.8 3.5 4.3 3.5 7 0 3.4-2.6 6-6.5 6z" />
  </Base>
);

export const IconoWifi = (p: P) => (
  <Base {...p}>
    <path d="M3 9.5a13 13 0 0118 0M6 12.8a8.5 8.5 0 0112 0M9 16a4 4 0 016 0" />
    <path d="M12 19.2v.1" />
  </Base>
);

export const IconoParrilla = (p: P) => (
  <Base {...p}>
    <path d="M4 10h16a8 8 0 01-16 0z" />
    <path d="M8 18l-2 3M16 18l2 3M8 6c0-1 1-1.5 1-2.5M12 6c0-1 1-1.5 1-2.5M16 6c0-1 1-1.5 1-2.5" />
  </Base>
);

export const IconoPileta = (p: P) => (
  <Base {...p}>
    <path d="M3 17c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0M3 20.5c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0" />
    <path d="M8 14V5.5a2 2 0 014 0M16 14V5.5a2 2 0 00-4 0M8 9h8" />
  </Base>
);

export const IconoAuto = (p: P) => (
  <Base {...p}>
    <path d="M4.5 16.5V12l2-5h11l2 5v4.5" />
    <path d="M3.5 12h17v4.5h-17zM7 16.5v2M17 16.5v2" />
    <circle cx="7.5" cy="14.2" r=".6" />
    <circle cx="16.5" cy="14.2" r=".6" />
  </Base>
);

export const IconoHoja = (p: P) => (
  <Base {...p}>
    <path d="M5 19c0-8 5-13.5 14.5-14.5C19 13 14 19 5 19z" />
    <path d="M5 19l8-8" />
  </Base>
);

export const IconoMascota = (p: P) => (
  <Base {...p}>
    <circle cx="6" cy="10" r="1.8" />
    <circle cx="10" cy="6.5" r="1.8" />
    <circle cx="14" cy="6.5" r="1.8" />
    <circle cx="18" cy="10" r="1.8" />
    <path d="M12 12c-3 0-5.5 3.5-5.5 5.5 0 1.5 1.2 2.5 2.7 2.2 1-.2 1.8-.7 2.8-.7s1.8.5 2.8.7c1.5.3 2.7-.7 2.7-2.2 0-2-2.5-5.5-5.5-5.5z" />
  </Base>
);

export const IconoCama = (p: P) => (
  <Base {...p}>
    <path d="M3 19v-9M21 19v-5a3 3 0 00-3-3h-8v6H3" />
    <circle cx="6.5" cy="12.5" r="1.8" />
    <path d="M3 17h18" />
  </Base>
);

export const IconoDucha = (p: P) => (
  <Base {...p}>
    <path d="M4 20V7a3 3 0 016 0" />
    <path d="M7.5 9.5h5a3.5 3.5 0 00-5 0z" />
    <path d="M8.5 13v.1M10 15v.1M11.5 13v.1M13 15v.1" />
  </Base>
);

export const IconoCafe = (p: P) => (
  <Base {...p}>
    <path d="M4.5 9h12v5a5 5 0 01-5 5h-2a5 5 0 01-5-5z" />
    <path d="M16.5 10.5h1.5a2.5 2.5 0 010 5h-1.8M8 3.5c0 1 1 1.5 1 2.5M12 3.5c0 1 1 1.5 1 2.5" />
  </Base>
);

export const IconoBuscar = (p: P) => (
  <Base {...p}>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="M15 15l5 5" />
  </Base>
);

export const IconoTarjeta = (p: P) => (
  <Base {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="M3 10h18M7 15h3" />
  </Base>
);

export const IconoBanco = (p: P) => (
  <Base {...p}>
    <path d="M3.5 9.5L12 4l8.5 5.5M5 10v7M9.7 10v7M14.3 10v7M19 10v7M3.5 20h17" />
  </Base>
);
