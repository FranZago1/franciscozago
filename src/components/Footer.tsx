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
    </footer>
  );
}
