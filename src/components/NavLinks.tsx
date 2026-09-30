"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  { href: "/#servicios", label: "Servicios", seccion: "servicios" },
  { href: "/#trabajos", label: "Trabajos", seccion: "trabajos" },
  { href: "/sobre-mi", label: "Sobre mí", seccion: "sobre-mi" },
  { href: "/#contacto", label: "Contacto", seccion: "contacto" },
];

const seccionesHome = ["servicios", "trabajos", "contacto"];

/** Sección activa según la ruta; en el home, según la sección que cruza el 40 % de la pantalla. */
function useSeccionActiva(pathname: string): string | null {
  const [enHome, setEnHome] = useState<string | null>(null);

  useEffect(() => {
    if (pathname !== "/") return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const linea = window.innerHeight * 0.4;
      let activa: string | null = null;
      for (const id of seccionesHome) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= linea) activa = id;
      }
      // Al final de la página, Contacto aunque no llegue a la línea.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) activa = "contacto";
      setEnHome(activa);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  if (pathname === "/") return enHome;
  if (pathname.startsWith("/sobre-mi")) return "sobre-mi";
  if (pathname.startsWith("/trabajos")) return "trabajos";
  if (pathname.startsWith("/demos")) return "servicios";
  return null;
}

export function NavLinks() {
  const pathname = usePathname();
  const activa = useSeccionActiva(pathname);

  return (
    <ul className="label-mono flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
      {nav.map((item) => {
        const on = item.seccion === activa;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={on ? (item.href.startsWith("/#") && pathname === "/" ? "location" : "page") : undefined}
              className={`relative inline-flex items-center gap-1.5 transition-colors hover:text-ink ${on ? "text-ink" : "text-muted"}`}
            >
              <span
                aria-hidden
                className={`size-1.5 bg-accent transition-all duration-300 ${on ? "scale-100 opacity-100" : "-ml-3 scale-0 opacity-0"}`}
              />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
