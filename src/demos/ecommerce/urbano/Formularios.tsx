"use client";

import { FormEmail } from "../shared/FormEmail";

const foco = "focus-visible:outline-2 focus-visible:outline-offset-2";

export function AvisoDrop() {
  return (
    <FormEmail
      etiqueta="Tu email para el aviso del drop"
      etiquetaVisible
      boton="Avisame"
      ok={(e) => `Anotado: te avisamos a ${e} una hora antes, con acceso anticipado.`}
      clases={{
        form: "grid gap-2",
        label: "text-[11px] font-bold tracking-[0.2em] text-white/60 uppercase",
        input: `min-h-12 border-2 border-white/20 bg-transparent px-4 text-white placeholder:text-white/35 outline-none focus:border-[#D4FF2E]`,
        boton: `min-h-12 bg-[#D4FF2E] px-7 text-sm font-black tracking-[0.16em] text-[#0B0B0B] uppercase transition-colors hover:bg-white active:translate-y-px disabled:opacity-60 ${foco} focus-visible:outline-[#D4FF2E]`,
        mensaje: "text-[#D4FF2E]",
        error: "font-semibold text-[#FF6B5E]",
      }}
    />
  );
}

export function Newsletter() {
  return (
    <FormEmail
      etiqueta="Tu email para sumarte al club"
      boton="Sumarme"
      ok={(e) => `Bienvenido al club. El cupón PAMPA10 va a ${e}.`}
      clases={{
        form: "grid w-full gap-2",
        input: "min-h-14 border-2 border-[#0B0B0B] bg-transparent px-4 text-lg text-[#0B0B0B] placeholder:text-[#0B0B0B]/45 outline-none focus:bg-white",
        boton: `min-h-14 bg-[#0B0B0B] px-8 text-sm font-black tracking-[0.16em] text-[#D4FF2E] uppercase transition-colors hover:bg-white hover:text-[#0B0B0B] active:translate-y-px ${foco} focus-visible:outline-[#0B0B0B]`,
        mensaje: "font-semibold text-[#0B0B0B]",
        error: "font-bold text-[#8A0F08]",
      }}
    />
  );
}
