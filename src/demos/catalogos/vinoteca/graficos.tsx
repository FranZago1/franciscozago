"use client";

import { EJES, REGIONES, VINOS, type Maridaje, type Perfil, type Region } from "./datos";

/* SVG propios de Cava Aldea: mapa de regiones, radar de cata e íconos de maridaje. */

const CONTORNO =
  "M98.1,30.1 L115.1,13.1 L147.4,26.7 L172.9,16.5 L188.2,33.5 L220.5,50.5 L254.5,70.9 L261.3,76.0 L244.3,104.9 L288.5,108.3 L312.3,77.7 L327.6,87.9 L325.9,104.9 L295.3,120.2 L261.3,155.9 L251.1,193.3 L247.7,218.8 L247.7,230.7 L268.1,244.3 L276.6,261.3 L261.3,290.2 L237.5,302.1 L183.1,303.8 L181.4,325.9 L135.5,336.1 L133.8,356.5 L18.2,356.5 L23.3,322.5 L33.5,280.0 L43.7,254.5 L50.5,220.5 L45.4,195.0 L52.2,152.5 L60.7,118.5 L79.4,93.0 L74.3,55.6 Z";
const ANDES: [number, number][] = [
  [18.2, 356.5],
  [23.3, 322.5],
  [33.5, 280.0],
  [43.7, 254.5],
  [50.5, 220.5],
  [45.4, 195.0],
  [52.2, 152.5],
  [60.7, 118.5],
  [79.4, 93.0],
  [74.3, 55.6],
  [98.1, 30.1],
];

/** Picos de la cordillera a lo largo del borde oeste, para darle carácter al mapa. */
function cordillera() {
  const picos: string[] = [];
  for (let i = 0; i < ANDES.length - 1; i++) {
    const [x1, y1] = ANDES[i]!;
    const [x2, y2] = ANDES[i + 1]!;
    const n = Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1) / 11));
    for (let k = 0; k < n; k++) {
      const t = (k + 0.5) / n;
      const x = x1 + (x2 - x1) * t + 7;
      const y = y1 + (y2 - y1) * t;
      picos.push(
        `M${(x - 4).toFixed(1)},${(y + 3).toFixed(1)} L${x.toFixed(1)},${(y - 4).toFixed(1)} L${(x + 4).toFixed(1)},${(y + 3).toFixed(1)}`,
      );
    }
  }
  return picos.join(" ");
}
const PICOS = cordillera();

export function Mapa({ activas, onToggle }: { activas: Region[]; onToggle: (r: Region) => void }) {
  const conteo = (r: Region) => VINOS.filter((v) => v.region === r).length;
  return (
    <svg
      viewBox="0 0 340 366"
      className="h-auto w-full"
      role="group"
      aria-label="Mapa de regiones vitivinícolas. Elegí una o varias para filtrar."
    >
      <defs>
        <radialGradient id="cava-mapa-brillo" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#2A1D1E" />
          <stop offset="1" stopColor="#170F10" />
        </radialGradient>
        <filter id="cava-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <path d={CONTORNO} fill="url(#cava-mapa-brillo)" stroke="#C9A55A" strokeOpacity="0.45" strokeWidth="0.8" strokeLinejoin="round" />
      <path d={PICOS} fill="none" stroke="#C9A55A" strokeOpacity="0.35" strokeWidth="0.8" />
      <text x="232" y="340" fill="#A8998A" fontSize="9" letterSpacing="2" aria-hidden="true">
        ARGENTINA
      </text>
      {REGIONES.map((r) => {
        const on = activas.includes(r.id);
        return (
          <g
            key={r.id}
            role="button"
            tabIndex={0}
            aria-pressed={on}
            aria-label={`${r.nombre}, ${r.provincia}: ${conteo(r.id)} vinos`}
            onClick={() => onToggle(r.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggle(r.id);
              }
            }}
            className="group cursor-pointer outline-none"
          >
            <circle cx={r.x} cy={r.y} r="16" fill="transparent" />
            {on ? <circle cx={r.x} cy={r.y} r="10" fill="#C9A55A" opacity="0.55" filter="url(#cava-glow)" /> : null}
            <circle
              cx={r.x}
              cy={r.y}
              r={on ? 6.5 : 5}
              fill={on ? "#C9A55A" : "#0E0B0B"}
              stroke="#C9A55A"
              strokeWidth="1.4"
              className="transition-all duration-200 group-hover:fill-[#6E1423] group-focus-visible:stroke-[#EFE6D6] group-focus-visible:stroke-[2.5px]"
            />
            <text
              x={r.x + 13}
              y={r.y + 3.5}
              fontSize="10.5"
              wordSpacing="1.5"
              fontWeight="400"
              fill={on ? "#E3C88A" : "#CFC3B3"}
              className="transition-colors group-hover:fill-[#E3C88A] [font-family:var(--font-cava-sans)]"
            >
              {r.nombre}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function Radar({ perfil, className = "" }: { perfil: Perfil; className?: string }) {
  const c = 110;
  const R = 74;
  const punto = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / EJES.length - Math.PI / 2;
    return [c + (Math.cos(a) * (R * v)) / 5, c + (Math.sin(a) * (R * v)) / 5] as const;
  };
  const poly = EJES.map((e, i) => punto(i, perfil[e.k]).join(",")).join(" ");
  return (
    <svg
      viewBox="0 0 220 220"
      className={className}
      role="img"
      aria-label={`Perfil del vino: ${EJES.map((e) => `${e.nombre} ${perfil[e.k]} de 5`).join(", ")}`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <polygon
          key={n}
          points={EJES.map((_, i) => punto(i, n).join(",")).join(" ")}
          fill={n === 5 ? "#1A1213" : "none"}
          stroke="#C9A55A"
          strokeOpacity={n === 5 ? 0.4 : 0.14}
          strokeWidth="0.8"
        />
      ))}
      {EJES.map((_, i) => {
        const [x, y] = punto(i, 5);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="#C9A55A" strokeOpacity="0.14" strokeWidth="0.8" />;
      })}
      <polygon
        points={poly}
        fill="#8E1B2E"
        fillOpacity="0.55"
        stroke="#E3C88A"
        strokeWidth="1.4"
        strokeLinejoin="round"
        className="motion-safe:animate-[cava-radar_0.6s_ease-out]"
        style={{ transformOrigin: `${c}px ${c}px` }}
      />
      {EJES.map((e, i) => {
        const [x, y] = punto(i, perfil[e.k]);
        return <circle key={e.k} cx={x} cy={y} r="2.6" fill="#E3C88A" />;
      })}
      {EJES.map((e, i) => {
        const [x, y] = punto(i, 6.3);
        return (
          <text
            key={e.k}
            x={x}
            y={y + 3}
            textAnchor="middle"
            fontSize="10"
            fill="#CFC3B3"
            letterSpacing="0.6"
            className="[font-family:var(--font-cava-sans)]"
          >
            {e.nombre}
          </text>
        );
      })}
    </svg>
  );
}

const trazo = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function IconoMaridaje({ id, className = "size-5" }: { id: Maridaje; className?: string }) {
  const p: Record<Maridaje, React.ReactNode> = {
    carnes: (
      <>
        <path {...trazo} d="M6 15c-2-3 0-8 5-9s9 1 9 5-4 7-8 7c-3 0-5-1-6-3z" />
        <path {...trazo} d="M9.5 12.5c0-1.5 1.2-2.5 2.6-2.5s2.4 1 2.4 2.2-1.1 2.3-2.5 2.3" />
        <path {...trazo} d="M6 15l-2.5 3" />
      </>
    ),
    pastas: (
      <>
        <path {...trazo} d="M4 13h16c0 4-3.5 6.5-8 6.5S4 17 4 13z" />
        <path {...trazo} d="M8 13c0-2 1.5-3 2.5-2s-.5 2 .5 2.5 2-1 2.5-2.5M15 5l-1.5 8M18 6l-2.5 7" />
      </>
    ),
    quesos: (
      <>
        <path {...trazo} d="M3.5 16.5L19 9.5l1.5 7z" />
        <path {...trazo} d="M3.5 16.5v2.5h17v-2.5M3.5 16.5L12 7l7 2.5" />
        <circle {...trazo} cx="13" cy="15" r="1.2" />
      </>
    ),
    picadas: (
      <>
        <rect {...trazo} x="3" y="11" width="18" height="7" rx="2" />
        <path {...trazo} d="M17 11V8.5a1.5 1.5 0 0 1 3 0V11" />
        <circle {...trazo} cx="7.5" cy="14.5" r="1.3" />
        <circle {...trazo} cx="11.5" cy="14.5" r="1.3" />
      </>
    ),
    aves: (
      <>
        <path {...trazo} d="M13.5 4.5c3.5 0 6 2.5 6 5.5 0 3.5-3.5 5-6.5 4.5l-4 4-2-2 4-4c-.5-3 1-8 2.5-8z" />
        <path {...trazo} d="M7 18.5l-2.5.5.5-2.5" />
      </>
    ),
    pescados: (
      <>
        <path {...trazo} d="M3 12c2.5-4 7-6 11-5s5 3 6 5c-1 2-3 4-6 5s-8.5-1-11-5z" />
        <path {...trazo} d="M3 12l-1-3M3 12l-1 3" />
        <circle cx="15.5" cy="11" r="0.9" fill="currentColor" />
      </>
    ),
    especiada: (
      <>
        <path {...trazo} d="M7 9c3 0 5 1.5 7 5s4 5 6 5c-5 1-9-1-12-4s-3-6-1-6z" />
        <path {...trazo} d="M7 9c0-2 1-3.5 3-4" />
      </>
    ),
    postres: (
      <>
        <path {...trazo} d="M4 19h16v-6L4 9z" />
        <path {...trazo} d="M4 13.5l16 3M4 9l16 4" />
        <circle {...trazo} cx="7" cy="6.5" r="1.4" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {p[id]}
    </svg>
  );
}
