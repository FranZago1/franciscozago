"use client";

import { useId } from "react";
import { useTransicion } from "./hooks";

/** Tendencia mínima para los KPIs: sin ejes, con lavado y punto final. Decorativa (el dato está al lado). */
export function Sparkline({
  valores,
  color,
  alto = 36,
  className = "",
}: {
  valores: number[];
  color: string;
  alto?: number;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const { valores: v, version } = useTransicion(valores);
  const W = 120;
  const min = Math.min(...v);
  const max = Math.max(...v);
  const rango = max - min || 1;
  const px = (i: number) => (v.length > 1 ? (i / (v.length - 1)) * W : W);
  const py = (x: number) => 3 + (1 - (x - min) / rango) * (alto - 6);
  const d = v.map((x, i) => `${i ? "L" : "M"}${px(i).toFixed(2)},${py(x).toFixed(2)}`).join("");
  const ultimo = v[v.length - 1] ?? 0;

  return (
    <div className={`relative ${className}`} style={{ height: alto }} aria-hidden="true">
      <svg key={version} viewBox={`0 0 ${W} ${alto}`} preserveAspectRatio="none" className="dv-fade block size-full overflow-visible">
        <defs>
          <linearGradient id={`${id}-s`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.18} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={`${d}L${W},${alto}L0,${alto}Z`} fill={`url(#${id}-s)`} />
        <path d={d} fill="none" stroke={color} strokeWidth={1.75} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
      <span
        className="absolute size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: "100%",
          top: `${(py(ultimo) / alto) * 100}%`,
          background: color,
          boxShadow: "0 0 0 2px var(--dv-surface)",
        }}
      />
    </div>
  );
}
