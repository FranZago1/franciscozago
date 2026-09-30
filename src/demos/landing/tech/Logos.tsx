// Wordmarks de "clientes" inventados, dibujados en SVG. Ninguno corresponde a una marca real.

const marcas: { nombre: string; svg: React.ReactNode }[] = [
  {
    nombre: "Nube Alta",
    svg: (
      <>
        <path d="M6 22a6 6 0 0 1 1-11.9A8 8 0 0 1 22 12a5 5 0 0 1-1 10z" fill="currentColor" />
        <text x="30" y="21" fontSize="15" fontWeight="600" letterSpacing="-0.5" fill="currentColor">
          nube alta
        </text>
      </>
    ),
  },
  {
    nombre: "Ferro Diseño",
    svg: (
      <>
        <rect x="2" y="6" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <rect x="8" y="12" width="6" height="6" fill="currentColor" />
        <text x="28" y="21" fontSize="14" fontWeight="700" letterSpacing="2" fill="currentColor">
          FERRO
        </text>
      </>
    ),
  },
  {
    nombre: "Cardumen",
    svg: (
      <>
        <path d="M2 15c5-7 12-7 17 0-5 7-12 7-17 0zM19 15l5-5v10z" fill="currentColor" />
        <text x="30" y="20.5" fontSize="15" fontStyle="italic" fontWeight="500" fill="currentColor">
          cardumen
        </text>
      </>
    ),
  },
  {
    nombre: "Vértice",
    svg: (
      <>
        <path d="M2 24L12 5l10 19z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <text x="30" y="21" fontSize="15" fontWeight="600" letterSpacing="3" fill="currentColor">
          VÉRTICE
        </text>
      </>
    ),
  },
  {
    nombre: "Molle",
    svg: (
      <>
        <circle cx="8" cy="15" r="6" fill="currentColor" />
        <circle cx="17" cy="15" r="6" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <text x="30" y="21" fontSize="16" fontWeight="700" letterSpacing="-0.8" fill="currentColor">
          molle
        </text>
      </>
    ),
  },
  {
    nombre: "Lumo",
    svg: (
      <>
        <path d="M12 4v4M12 22v4M3 15h4M17 15h4M6 9l2.5 2.5M15.5 18.5L18 21M6 21l2.5-2.5M15.5 11.5L18 9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <text x="30" y="21" fontSize="16" fontWeight="500" letterSpacing="0.5" fill="currentColor">
          lumo
        </text>
      </>
    ),
  },
];

export function Logos() {
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
      {marcas.map((m) => (
        <li key={m.nombre} className="flex justify-center">
          <svg
            viewBox="0 0 130 30"
            role="img"
            aria-label={`${m.nombre} (cliente ficticio)`}
            className="h-8 w-auto text-slate-400 transition-colors duration-300 hover:text-slate-700"
          >
            {m.svg}
          </svg>
        </li>
      ))}
    </ul>
  );
}
