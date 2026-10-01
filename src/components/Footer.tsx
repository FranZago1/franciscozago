import { instagramUrl, site } from "@/content/site";

export function Footer() {
  const ig = instagramUrl();
  return (
    <footer className="wrap mt-28 pb-10 md:mt-40">
      <div className="label-mono flex flex-wrap items-center gap-x-6 gap-y-2 border-t-[1.5px] border-ink pt-5 text-[13px]">
        <span>© {new Date().getFullYear()} {site.nombre}</span>
        <span className="text-muted">Hecho en Córdoba</span>
        <span className="flex gap-5 sm:ml-auto">
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="link">
            GitHub
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="link">
            LinkedIn
          </a>
          {ig ? (
            <a href={ig} target="_blank" rel="noopener noreferrer" className="link">
              Instagram
            </a>
          ) : null}
        </span>
      </div>
      {/* Mobile: franja de cierre a todo el ancho, para que el final de la página se lea como final. */}
      <div className="-mb-10 mt-10 ml-[calc(50%-50vw)] w-screen bg-ink px-5 pt-9 pb-12 text-white md:hidden">
        <p className="text-4xl font-medium tracking-[-0.045em]">
          {site.nombre}
          <span className="text-mostaza">.</span>
        </p>
        <div className="label-mono mt-6 flex items-center justify-between text-[12px] text-white/60">
          <span>Desarrollo web</span>
          <a href="#" className="text-white">
            Volver arriba ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
