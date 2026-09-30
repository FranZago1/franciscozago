import Image from "next/image";
import type { Trabajo } from "@/content/trabajos";
import { DevTodo } from "./DevTodo";

/** Captura desktop o video corto de un trabajo, con proporción fija 16:10. */
export function TrabajoMedia({
  trabajo,
  sizes,
  priority = false,
}: {
  trabajo: Trabajo;
  sizes: string;
  priority?: boolean;
}) {
  const { media, nombre } = trabajo;
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-card bg-surface ring-1 ring-line ring-inset">
      {media.video ? (
        <video
          className="size-full object-cover"
          src={media.video}
          poster={media.desktop}
          muted
          loop
          playsInline
          autoPlay
          preload="none"
          aria-label={`Video del sitio de ${nombre}`}
        />
      ) : (
        <Image
          src={media.desktop}
          alt={media.placeholder ? `Espacio para la captura del sitio de ${nombre}` : `Captura del sitio de ${nombre}`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.015]"
        />
      )}
      {media.placeholder ? <DevTodo>captura real de {nombre}</DevTodo> : null}
    </div>
  );
}
