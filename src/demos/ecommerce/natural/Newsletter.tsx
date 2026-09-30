"use client";

import { FormEmail } from "../shared/FormEmail";

export function Newsletter() {
  return (
    <FormEmail
      etiqueta="Tu email para recibir novedades"
      boton="Suscribirme"
      ok={(e) => `Gracias. Te mandamos la guía de rutinas a ${e}.`}
      clases={{
        form: "grid w-full gap-2",
        input: "min-h-13 rounded-full border border-[#F6F5EF]/30 bg-[#F6F5EF]/10 px-5 text-[#F6F5EF] placeholder:text-[#F6F5EF]/50 outline-none focus:border-[#F6F5EF] focus:bg-[#F6F5EF]/15",
        boton:
          "min-h-13 rounded-full bg-[#F6F5EF] px-7 font-semibold text-[#2D3524] transition-colors hover:bg-[#E3B9AC] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#F6F5EF] disabled:opacity-60",
        mensaje: "text-[#F6F5EF]/85",
        error: "font-medium text-[#FFC9BD]",
      }}
    />
  );
}
