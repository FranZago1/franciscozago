/** Íconos de la demo Ventas: trazo 1.75, esquinas redondeadas, 20×20. */

type P = { className?: string };
const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IcoResumen = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="3" y="3" width="6" height="7" rx="1.5" />
    <rect x="11" y="3" width="6" height="4" rx="1.5" />
    <rect x="11" y="9" width="6" height="8" rx="1.5" />
    <rect x="3" y="12" width="6" height="5" rx="1.5" />
  </svg>
);
export const IcoVentas = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M3 15.5 7.5 11l3 3L17 7.5" />
    <path d="M13 7.5h4v4" />
  </svg>
);
export const IcoProductos = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="m10 2.8 6.5 3.4v7.6L10 17.2l-6.5-3.4V6.2Z" />
    <path d="M3.5 6.2 10 9.6l6.5-3.4M10 9.6v7.6" />
  </svg>
);
export const IcoEmbudo = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M3 4h14l-5.2 6.3V16l-3.6-1.8v-3.9Z" />
  </svg>
);
export const IcoCanales = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="10" cy="10" r="7" />
    <path d="M3 10h14M10 3c2 2.2 2.9 4.5 2.9 7S12 14.8 10 17c-2-2.2-2.9-4.5-2.9-7S8 5.2 10 3Z" />
  </svg>
);
export const IcoPedidos = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M3 3.5h2l1.8 9h8.4l1.6-6.5H6.1" />
    <circle cx="8" cy="16" r="1.2" />
    <circle cx="14" cy="16" r="1.2" />
  </svg>
);
export const IcoClientes = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="8" cy="7" r="3" />
    <path d="M2.8 16.5c.7-2.6 2.7-4 5.2-4s4.5 1.4 5.2 4" />
    <path d="M13.5 4.3a3 3 0 0 1 0 5.4M15.4 12.8c1 .7 1.6 1.9 1.9 3.7" />
  </svg>
);
export const IcoAjustes = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="10" cy="10" r="2.5" />
    <path d="M10 2.5v2M10 15.5v2M17.5 10h-2M4.5 10h-2M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4M15.3 15.3l-1.4-1.4M6.1 6.1 4.7 4.7" />
  </svg>
);
export const IcoMenu = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M3 5.5h14M3 10h14M3 14.5h14" />
  </svg>
);
export const IcoCerrar = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="m5 5 10 10M15 5 5 15" />
  </svg>
);
export const IcoDescargar = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M10 3v9.5M6 8.8l4 3.8 4-3.8M3.5 16.5h13" />
  </svg>
);
export const IcoSubida = ({ className }: P) => (
  <svg {...base} viewBox="0 0 20 20" className={className} strokeWidth={2.2}>
    <path d="M10 15V5M5.5 9.5 10 5l4.5 4.5" />
  </svg>
);
export const IcoBajada = ({ className }: P) => (
  <svg {...base} viewBox="0 0 20 20" className={className} strokeWidth={2.2}>
    <path d="M10 5v10M5.5 10.5 10 15l4.5-4.5" />
  </svg>
);
export const IcoCheck = ({ className }: P) => (
  <svg {...base} className={className} strokeWidth={2.2}>
    <path d="m4.5 10.5 3.5 3.5 7.5-8" />
  </svg>
);
export const IcoCamion = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M2.5 5.5h9v8h-9zM11.5 8.5h3.2l2.8 2.8v2.2h-6" />
    <circle cx="6" cy="14.5" r="1.5" />
    <circle cx="14.5" cy="14.5" r="1.5" />
  </svg>
);
export const IcoReloj = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="10" cy="10" r="7" />
    <path d="M10 6v4.2l2.8 1.8" />
  </svg>
);
export const IcoCancelado = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="10" cy="10" r="7" />
    <path d="m7.5 7.5 5 5M12.5 7.5l-5 5" />
  </svg>
);
export const IcoBuscar = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="9" cy="9" r="5.5" />
    <path d="m13.2 13.2 3.3 3.3" />
  </svg>
);
export const IcoCampana = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M5 8.5a5 5 0 0 1 10 0c0 4 1.5 5.5 1.5 5.5h-13S5 12.5 5 8.5ZM8.3 16.5a1.8 1.8 0 0 0 3.4 0" />
  </svg>
);

/** Marca de la tienda: un almacén estilizado con toldo. */
export const Marca = ({ className }: P) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <rect width="32" height="32" rx="9" fill="#14213d" />
    <path d="M7 12.5 9 8h14l2 4.5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
    <path
      d="M7 12.5c0 1.4 1.1 2.4 2.5 2.4s2.4-1 2.4-2.4c0 1.4 1.1 2.4 2.5 2.4s2.4-1 2.4-2.4c0 1.4 1.1 2.4 2.5 2.4s2.4-1 2.4-2.4c0 1.4 1 2.4 2.4 2.4S25 13.9 25 12.5"
      fill="none"
      stroke="#eb6834"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path d="M9 16v8h14v-8M14 24v-4.5h4V24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);
