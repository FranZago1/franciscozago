// Set de íconos propio en grilla de 24. Cada demo lo usa con su propio grosor y terminación de trazo,
// así la iconografía es coherente dentro de la demo pero distinta entre demos.

const paths = {
  flecha: "M5 12h14M13 6l6 6-6 6",
  flechaIzq: "M19 12H5M11 6l-6 6 6 6",
  flechaAbajo: "M12 5v14M6 13l6 6 6-6",
  check: "M4.5 12.5l5 5L19.5 7",
  cruz: "M6 6l12 12M18 6L6 18",
  mas: "M12 5v14M5 12h14",
  menos: "M5 12h14",
  menu: "M4 7h16M4 12h16M4 17h16",
  reloj: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
  pin: "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
  usuario: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4.4 3.6-7 8-7s8 2.6 8 7",
  grupo: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2 20c0-3.6 3-6 7-6s7 2.4 7 6M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14c2.4.6 4 2.6 4 6",
  rayo: "M13 2L4 14h7l-1 8 9-12h-7l1-8z",
  llama: "M12 22c4 0 7-2.8 7-7 0-4.5-4-7-5-11-2 2-3 4-3 6-1-1-2-2-2-3-2 2-4 4.5-4 8 0 4.2 3 7 7 7z",
  calendario: "M4 6h16v15H4zM4 10h16M8 3v5M16 3v5",
  estrella: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z",
  telefono: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  camara: "M4 4h16v16H4zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM16.5 7.5h.01",
  play: "M8 5v14l11-7z",
  hoja: "M5 19C5 10 10 5 20 4c0 10-5 15-14 15zM5 19l8-8",
  gota: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z",
  sol: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  escudo: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z",
  chispa: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6",
  factura: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h3",
  grafico: "M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  candado: "M6 11h12v10H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3",
  nube: "M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 9.5 4.3 4.3 0 0 1 17.5 18z",
  medidor: "M4 16a8 8 0 1 1 16 0M12 16l4-5",
  whatsapp: "M4 20l1.3-3.9A8.5 8.5 0 1 1 8.4 19zM9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8c-.9-.4-1.6-1.1-2-2l.8-1-1-2z",
  info: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v5M12 7.5v.01",
} as const;

export type NombreIcono = keyof typeof paths;

export function Icono({
  nombre,
  className = "size-5",
  grosor = 2,
  cuadrado = false,
  relleno = false,
}: {
  nombre: NombreIcono;
  className?: string;
  /** Grosor del trazo. */
  grosor?: number;
  /** Terminaciones rectas (más "industriales") en vez de redondeadas. */
  cuadrado?: boolean;
  relleno?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill={relleno ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={grosor}
      strokeLinecap={cuadrado ? "square" : "round"}
      strokeLinejoin={cuadrado ? "miter" : "round"}
    >
      <path d={paths[nombre]} />
    </svg>
  );
}
