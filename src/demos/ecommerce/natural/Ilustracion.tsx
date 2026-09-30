import type { IngredienteId } from "./datos";

/** Ilustraciones botánicas propias de cada ingrediente (SVG, trazo + manchas de color). */
export function Ilustracion({ id, className = "size-24" }: { id: IngredienteId; className?: string }) {
  const trazo = { stroke: "#2D3524", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  const linea = { ...trazo, fill: "none" } as const;
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {id === "arcilla" ? (
        <>
          <ellipse cx="60" cy="96" rx="40" ry="8" fill="#2D3524" opacity="0.08" />
          <path d="M22 70c0 18 17 26 38 26s38-8 38-26H22Z" fill="#E3B9AC" />
          <path d="M22 70c0 18 17 26 38 26s38-8 38-26" {...linea} />
          <ellipse cx="60" cy="70" rx="38" ry="9" fill="#F0D6CD" {...trazo} />
          <path d="M36 70c6-14 16-20 24-20s18 6 24 20" fill="#D79C8C" />
          <path d="M36 70c6-14 16-20 24-20s18 6 24 20" {...linea} />
          <path d="M52 58c3-3 8-4 12-2" {...linea} stroke="#F6F5EF" strokeWidth="2" />
          <circle cx="86" cy="36" r="3" fill="#D79C8C" />
          <circle cx="96" cy="46" r="2" fill="#D79C8C" />
          <circle cx="30" cy="40" r="2.5" fill="#D79C8C" />
        </>
      ) : id === "calendula" ? (
        <>
          <path d="M60 64v44" {...linea} />
          <path d="M60 92c-10-2-18-10-20-18 10 0 18 8 20 18ZM60 100c8-4 16-12 16-20-8 2-14 10-16 20Z" fill="#B8C4A6" {...trazo} />
          {Array.from({ length: 14 }, (_, i) => (
            <ellipse key={i} cx="60" cy="30" rx="6" ry="17" transform={`rotate(${i * (360 / 14)} 60 48)`} fill="#F2B45A" stroke="#2D3524" strokeWidth="1.2" />
          ))}
          <circle cx="60" cy="48" r="11" fill="#C9772F" {...trazo} />
          <circle cx="57" cy="45" r="2" fill="#F6F5EF" opacity="0.6" />
        </>
      ) : id === "rosa-mosqueta" ? (
        <>
          <path d="M20 100C40 80 62 58 98 26" {...linea} />
          <path d="M44 76c-10-6-14-16-10-24 8 4 12 14 10 24ZM66 56c2-12 10-18 20-18-2 10-10 16-20 18ZM78 44c-10-6-12-14-8-22 8 4 10 12 8 22Z" fill="#B8C4A6" {...trazo} />
          <ellipse cx="36" cy="92" rx="10" ry="13" transform="rotate(-30 36 92)" fill="#C8553D" {...trazo} />
          <ellipse cx="58" cy="78" rx="9" ry="12" transform="rotate(-30 58 78)" fill="#D96B4F" {...trazo} />
          <path d="M30 80l-4-6 6 2 2-6 2 6 6-2-4 6" {...linea} />
          <path d="M53 67l-3-5 5 2 2-5 1 5 5-2-3 5" {...linea} />
          <path d="M33 88c1-3 4-5 6-5" stroke="#F6F5EF" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
        </>
      ) : id === "aloe" ? (
        <>
          <path d="M40 104h40l-4-12H44Z" fill="#E3B9AC" {...trazo} />
          <path d="M60 92C56 60 58 36 62 14c8 24 6 52-2 78Z" fill="#8FA36F" {...trazo} />
          <path d="M58 92C44 70 34 54 20 44c20 2 34 22 38 48Z" fill="#A9BA8A" {...trazo} />
          <path d="M62 92c12-20 24-34 40-42-18 0-32 18-40 42Z" fill="#A9BA8A" {...trazo} />
          <path d="M60 90c-4-10-12-24-22-32M62 88c6-12 14-22 24-28" {...linea} strokeDasharray="2 5" />
        </>
      ) : id === "avena" ? (
        <>
          <path d="M60 110C58 80 60 50 64 20" {...linea} />
          {[
            [64, 26, -30],
            [58, 38, 30],
            [66, 46, -35],
            [56, 58, 32],
            [66, 66, -30],
            [56, 78, 30],
          ].map(([x, y, r], i) => (
            <g key={i} transform={`rotate(${r} ${x} ${y})`}>
              <ellipse cx={x} cy={y} rx="5.5" ry="11" fill="#E5CFA0" stroke="#2D3524" strokeWidth="1.3" />
              <path d={`M${x} ${y! - 8}v16`} stroke="#2D3524" strokeWidth="0.8" opacity="0.5" />
            </g>
          ))}
          <path d="M60 96c-12-2-22-12-24-22 12 2 22 10 24 22Z" fill="#B8C4A6" {...trazo} />
        </>
      ) : (
        <>
          <path d="M60 110V70M60 70C50 60 40 58 30 60M60 70c10-12 22-16 34-14M60 82c-8-4-14-4-22 0" {...linea} />
          {[
            [30, 50, 16],
            [92, 46, 16],
            [60, 36, 19],
            [38, 82, 11],
          ].map(([x, y, r], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={r} fill={i % 2 ? "#A9BA8A" : "#8FA36F"} stroke="#2D3524" strokeWidth="1.5" />
              <path d={`M${x} ${y! + r!}V${y! - r! * 0.2}M${x} ${y}l${-r! * 0.5} ${-r! * 0.5}M${x} ${y}l${r! * 0.5} ${-r! * 0.5}`} stroke="#2D3524" strokeWidth="1" opacity="0.6" fill="none" />
            </g>
          ))}
        </>
      )}
    </svg>
  );
}
