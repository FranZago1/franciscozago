"use client";

import { useState } from "react";
import { faqs } from "./datos";

/** Acordeón accesible: botones con aria-expanded que controlan regiones. Varias pueden quedar abiertas. */
export function Faq() {
  const [abiertas, setAbiertas] = useState<Set<number>>(() => new Set([0]));

  const alternar = (i: number) =>
    setAbiertas((prev) => {
      const s = new Set(prev);
      if (s.has(i)) s.delete(i);
      else s.add(i);
      return s;
    });

  return (
    <div className="divide-y divide-slate-200 border-y border-slate-200">
      {faqs.map((f, i) => {
        const abierta = abiertas.has(i);
        return (
          <div key={f.p}>
            <h3>
              <button
                type="button"
                id={`cc-faq-b${i}`}
                aria-expanded={abierta}
                aria-controls={`cc-faq-r${i}`}
                onClick={() => alternar(i)}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left text-[17px] font-medium text-slate-900 transition-colors hover:text-[#4F46E5]"
              >
                {f.p}
                <span
                  aria-hidden="true"
                  className={`relative flex size-8 shrink-0 items-center justify-center rounded-full ring-1 transition-colors ${
                    abierta ? "bg-[#4F46E5] text-white ring-[#4F46E5]" : "text-slate-500 ring-slate-200 group-hover:ring-slate-300"
                  }`}
                >
                  <span className="absolute h-[1.5px] w-3 rounded-full bg-current" />
                  <span className={`absolute h-3 w-[1.5px] rounded-full bg-current transition-transform duration-300 ${abierta ? "scale-y-0" : ""}`} />
                </span>
              </button>
            </h3>
            <div
              id={`cc-faq-r${i}`}
              role="region"
              aria-labelledby={`cc-faq-b${i}`}
              inert={!abierta}
              className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${abierta ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-6 leading-relaxed text-slate-600">{f.r}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
