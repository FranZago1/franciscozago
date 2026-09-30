import type { Nivel, Pared, Piso, TipoObra } from "./calculo";

const trazo = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** Dibujos técnicos de línea para cada tipo de obra. El amarillo marca lo que se interviene. */
export function DibujoObra({ tipo, className = "h-16 w-auto" }: { tipo: TipoObra; className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden="true">
      {tipo === "cocina" && (
        <g>
          <rect x="14" y="40" width="92" height="28" fill="var(--of-y)" opacity=".9" />
          <g {...trazo}>
            <path d="M8 40h104M14 40v28h92V40M44 40v28M76 40v28" />
            <path d="M14 12h40v16H14zM66 12h40v16H66z" />
            <circle cx="28" cy="36" r="2" />
            <circle cx="38" cy="36" r="2" />
            <path d="M88 40v-8a4 4 0 0 1 8 0" />
            <path d="M24 52h10M56 52h10M86 52h10" />
          </g>
        </g>
      )}
      {tipo === "bano" && (
        <g>
          <path d="M14 46h56v10a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12Z" fill="var(--of-y)" opacity=".9" />
          <g {...trazo}>
            <path d="M8 46h66M14 46v10a12 12 0 0 0 12 12h32a12 12 0 0 0 12-12V46" />
            <path d="M20 46V20a6 6 0 0 1 12 0v2" />
            <path d="M84 30h22v16H84zM86 46l2 22h14l2-22" />
            <path d="M92 30v-6h6v6" />
            <path d="M28 26l-2 4M32 26v4M36 26l2 4" />
          </g>
        </g>
      )}
      {tipo === "integral" && (
        <g>
          <path d="M60 14 104 38v30H16V38Z" fill="var(--of-y)" opacity=".9" />
          <g {...trazo}>
            <path d="M8 42 60 12l52 30" />
            <path d="M16 38v30h88V38" />
            <path d="M52 68V50h16v18" />
            <path d="M26 46h16v10H26zM78 46h16v10H78z" />
            <path d="M88 20v-8h8v12" />
          </g>
        </g>
      )}
      {tipo === "pintura" && (
        <g>
          <rect x="14" y="14" width="46" height="54" fill="var(--of-y)" opacity=".9" />
          <g {...trazo}>
            <path d="M14 14h92v54H14z" />
            <path d="M60 14v54" strokeDasharray="3 3" />
            <path d="M74 30h22v8H74zM96 34h4v10H86v6" />
            <path d="M84 50h4v14h-4z" />
          </g>
        </g>
      )}
      {tipo === "ampliacion" && (
        <g>
          <path d="M64 30h42v38H64Z" fill="var(--of-y)" opacity=".9" />
          <g {...trazo}>
            <path d="M8 36 36 18l28 18" />
            <path d="M14 32v36h50V36" />
            <path d="M64 30h42v38H64" strokeDasharray="4 3" />
            <path d="M64 24h42" />
            <path d="M64 21v6M106 21v6" />
            <path d="M28 50h12v18H28z" />
          </g>
        </g>
      )}
    </svg>
  );
}

/** Muestras de material para pisos y paredes, dibujadas en SVG. */
export function MuestraPiso({ piso }: { piso: Piso }) {
  const id = `mp-${piso}`;
  return (
    <svg viewBox="0 0 160 96" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-luz`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".35" />
          <stop offset=".6" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {piso === "porcelanato" && (
        <g>
          <rect width="160" height="96" fill="#E4E1DA" />
          {[0, 1, 2, 3].map((i) =>
            [0, 1].map((j) => (
              <rect key={`${i}${j}`} x={i * 42 - 8 + (j % 2) * 0} y={j * 48 - 2} width="41" height="47" fill={["#E9E6DF", "#DEDAD2", "#E6E2DA"][(i + j) % 3]} />
            )),
          )}
          <path d="M20 10c20 4 40-2 60 6s40 2 70 8" stroke="#CFC9BE" strokeWidth=".8" fill="none" />
          <path d="M0 70c30-6 50 4 80-2s50 6 80 0" stroke="#D2CCC1" strokeWidth=".8" fill="none" />
        </g>
      )}
      {piso === "flotante" && (
        <g>
          <rect width="160" height="96" fill="#B98A5E" />
          {[0, 1, 2, 3, 4, 5].map((r) => (
            <g key={r}>
              <rect x="0" y={r * 16} width="160" height="15.4" fill={["#BE9064", "#B08257", "#C49A6F"][r % 3]} />
              <path d={`M${(r * 37) % 90 + 20} ${r * 16}v16M${((r * 37) % 90) + 110} ${r * 16}v16`} stroke="#8F6844" strokeWidth=".8" />
              <path d={`M0 ${r * 16 + 6}c30 -2 60 3 90 0s50 2 70 -1`} stroke="#A67B52" strokeWidth=".6" fill="none" opacity=".7" />
            </g>
          ))}
        </g>
      )}
      {piso === "microcemento" && (
        <g>
          <rect width="160" height="96" fill="#A9A7A1" />
          <circle cx="30" cy="20" r="34" fill="#B4B2AC" opacity=".6" />
          <circle cx="120" cy="70" r="40" fill="#9E9C96" opacity=".5" />
          <circle cx="100" cy="10" r="20" fill="#B8B6B0" opacity=".5" />
          <circle cx="50" cy="80" r="24" fill="#A2A09A" opacity=".6" />
        </g>
      )}
      {piso === "ceramico" && (
        <g>
          <rect width="160" height="96" fill="#C9B8A2" />
          {Array.from({ length: 7 }).map((_, i) =>
            Array.from({ length: 4 }).map((__, j) => (
              <rect key={`${i}-${j}`} x={i * 24 + 1} y={j * 24 + 1} width="22" height="22" rx="1" fill={(i + j) % 2 ? "#D3C4AF" : "#CDBDA7"} />
            )),
          )}
        </g>
      )}
      {piso === "mantener" && (
        <g>
          <rect width="160" height="96" fill="#E7E5E0" />
          {Array.from({ length: 14 }).map((_, i) => (
            <path key={i} d={`M${i * 14 - 40} 96 L${i * 14 + 56} 0`} stroke="#CFCCC4" strokeWidth="1.2" />
          ))}
        </g>
      )}
      <rect width="160" height="96" fill={`url(#${id}-luz)`} />
    </svg>
  );
}

export function MuestraPared({ pared }: { pared: Pared }) {
  return (
    <svg viewBox="0 0 160 96" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {pared === "latex" && (
        <g>
          <rect width="160" height="96" fill="#EDE7DB" />
          <rect x="0" y="0" width="160" height="96" fill="#E4DCCB" opacity=".5" />
          <path d="M110 0h50v96h-50z" fill="#D7CDB9" opacity=".5" />
          <rect x="18" y="58" width="36" height="6" rx="3" fill="#C9BCA3" />
          <rect x="52" y="54" width="6" height="14" rx="2" fill="#2B2B28" />
        </g>
      )}
      {pared === "revestimiento" && (
        <g>
          <rect width="160" height="96" fill="#CFD6D3" />
          {Array.from({ length: 8 }).map((_, r) =>
            Array.from({ length: 6 }).map((__, i) => (
              <rect key={`${r}-${i}`} x={i * 30 - (r % 2 ? 15 : 0) + 1} y={r * 12 + 1} width="28" height="10.4" rx="1.5" fill={(r + i) % 3 ? "#EEF1EF" : "#E6EAE8"} />
            )),
          )}
        </g>
      )}
      {pared === "microcemento" && (
        <g>
          <rect width="160" height="96" fill="#C2BDB3" />
          <ellipse cx="40" cy="30" rx="50" ry="30" fill="#CCC7BD" opacity=".7" />
          <ellipse cx="130" cy="70" rx="50" ry="34" fill="#B8B3A9" opacity=".6" />
        </g>
      )}
      {pared === "mantener" && (
        <g>
          <rect width="160" height="96" fill="#E7E5E0" />
          {Array.from({ length: 14 }).map((_, i) => (
            <path key={i} d={`M${i * 14 - 40} 96 L${i * 14 + 56} 0`} stroke="#CFCCC4" strokeWidth="1.2" />
          ))}
        </g>
      )}
    </svg>
  );
}

export function SimboloNivel({ nivel }: { nivel: Nivel }) {
  const n = nivel === "estandar" ? 1 : nivel === "superior" ? 2 : 3;
  return (
    <svg viewBox="0 0 48 20" className="h-5 w-12" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <rect key={i} x={i * 16} y={14 - i * 6} width="14" height={6 + i * 6} fill={i < n ? "var(--of-y)" : "none"} stroke="currentColor" strokeWidth="1.2" />
      ))}
    </svg>
  );
}

export function LogoObraFina({ className = "h-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" className={className} aria-hidden="true">
      <rect width="44" height="44" fill="#1A1A18" />
      <path d="M8 34V18l14-9 14 9v16" fill="none" stroke="#FFC700" strokeWidth="3" strokeLinejoin="miter" />
      <path d="M17 34V24h10v10" fill="none" stroke="#EFEEEA" strokeWidth="3" />
    </svg>
  );
}

/** Cinta de seguridad de obra (amarillo y negro). */
export function Cinta({ className = "h-2" }: { className?: string }) {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{ backgroundImage: "repeating-linear-gradient(135deg, #FFC700 0 12px, #1A1A18 12px 24px)" }}
    />
  );
}
