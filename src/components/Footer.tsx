import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="col mt-24 pb-10 md:mt-32">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-6 text-sm text-muted">
        <span>© {new Date().getFullYear()} {site.nombre}</span>
        <span>Hecho en Córdoba</span>
        <span className="flex gap-4 sm:ml-auto">
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="link hover:text-ink">
            GitHub
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="link hover:text-ink">
            LinkedIn
          </a>
        </span>
      </div>
    </footer>
  );
}
