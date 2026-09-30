import Link from "next/link";
import { site } from "@/content/site";

const nav = [
  { href: "/#trabajos", label: "Trabajos" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#demos", label: "Demos" },
  { href: "/#contacto", label: "Contacto" },
];

export function Header({ clock }: { clock?: React.ReactNode }) {
  return (
    <header className="col pt-5 md:pt-8">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="font-semibold tracking-tight">
          {site.nombre}
        </Link>
        <div className="flex items-center gap-3 text-sm text-muted">
          {site.disponible ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-line px-2.5 py-1">
              <span aria-hidden className="size-2 rounded-full bg-accent" />
              <span>
                Disponible<span className="hidden sm:inline"> para proyectos</span>
              </span>
            </span>
          ) : null}
          {clock}
        </div>
      </div>
      <nav aria-label="Principal" className="mt-4">
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
          {nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-muted transition-colors hover:text-ink">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
