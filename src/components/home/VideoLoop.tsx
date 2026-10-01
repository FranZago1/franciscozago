"use client";

import { useEffect, useRef, useState } from "react";
import { SelectionFrame } from "@/components/canvas/SelectionFrame";

type Props = {
  /** Ruta sin extensión: se sirven .mp4 (H.264) y .webm (VP9). */
  src: string;
  srcMobile: string;
  poster: string;
  label: string;
  nota: string;
};

/**
 * Video en loop: arranca sin sonido cuando entra en pantalla y se pausa al salir.
 * Con "reducir movimiento" no arranca solo: muestra el póster y un botón para reproducir.
 */
export function VideoLoop({ src, srcMobile, poster, label, nota }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [sonido, setSonido] = useState(false);
  const [pausado, setPausado] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const quieto = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e) return;
        if (e.isIntersecting && !quieto) v.play().catch(() => {});
        else if (!e.isIntersecting) v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    const onPlay = () => setPausado(false);
    const onPause = () => setPausado(true);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      io.disconnect();
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

  const alternarSonido = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setSonido(!v.muted);
    if (v.paused) v.play().catch(() => {});
  };

  const alternarPlay = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <figure>
      <SelectionFrame
        tono="ink"
        padding="p-0"
        nombre="motion.mp4"
        medida="1:1 · 14 s · 60 fps"
      >
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          aria-label={label}
          className="block aspect-square w-full bg-[#ECEAE6]"
        >
          {/* H.264 primero (Safari y la mayoría); VP9 como respaldo para navegadores sin H.264. */}
          <source
            src={`${srcMobile}.mp4`}
            type="video/mp4"
            media="(max-width: 767px)"
          />
          <source
            src={`${srcMobile}.webm`}
            type="video/webm"
            media="(max-width: 767px)"
          />
          <source src={`${src}.mp4`} type="video/mp4" />
          <source src={`${src}.webm`} type="video/webm" />
        </video>
      </SelectionFrame>
      <div className="mt-11 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <figcaption className="label-mono max-w-[30ch] text-[12px] text-muted">
          {nota}
        </figcaption>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={alternarPlay}
            className="label-mono inline-flex h-10 items-center bg-ink px-3.5 text-[12px] text-white transition-colors hover:bg-accent"
          >
            {pausado ? "Reproducir" : "Pausar"}
          </button>
          <button
            type="button"
            onClick={alternarSonido}
            aria-pressed={sonido}
            className="label-mono inline-flex h-10 items-center bg-ink px-3.5 text-[12px] text-white transition-colors hover:bg-accent"
          >
            {sonido ? "Silenciar" : "Activar sonido"}
          </button>
        </div>
      </div>
    </figure>
  );
}
