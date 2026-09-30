// Mapa ilustrado del barrio (SVG propio, sin servicios externos). Calles y referencias ficticias.

const manzanas: [number, number, number, number][] = [];
for (let fila = 0; fila < 5; fila++) {
  for (let col = 0; col < 7; col++) {
    manzanas.push([20 + col * 120, 20 + fila * 104, 100, 84]);
  }
}

export function Mapa() {
  return (
    <div className="relative aspect-square overflow-hidden rounded-[32px] bg-[#DDE3D8] ring-1 ring-[#3E4C43]/10 sm:aspect-[860/540]">
      <svg viewBox="0 0 860 540" preserveAspectRatio="xMidYMid slice" role="img" aria-labelledby="ac-mapa-t ac-mapa-d" className="absolute inset-0 block size-full">
        <title id="ac-mapa-t">Mapa ilustrado de la ubicación de Alma Clara</title>
        <desc id="ac-mapa-d">
          El centro está en Calle de los Tilos 245, frente a la plaza Los Aromos y a dos cuadras de la avenida Las Acacias.
        </desc>
        <rect width="860" height="540" fill="#F2F1EA" />
        {manzanas.map(([x, y, w, h], i) => {
          const plaza = i === 16 || i === 17;
          if (i === 17) return null;
          return plaza ? (
            <g key={i}>
              <rect x={x} y={y} width={w * 2 + 20} height={h} rx="14" fill="#C9D3C2" />
              {[0, 1, 2, 3, 4, 5, 6].map((k) => (
                <circle key={k} cx={x + 24 + k * 30} cy={y + (k % 2 ? 26 : 58)} r={k % 3 ? 11 : 14} fill="#A3B09C" />
              ))}
              <path d={`M${x + 10} ${y + h / 2} q60 -30 120 0 t100 0`} fill="none" stroke="#F6F4EE" strokeWidth="5" strokeLinecap="round" />
            </g>
          ) : (
            <rect key={i} x={x} y={y} width={w} height={h} rx="12" fill={i % 5 === 0 ? "#E6E3EC" : "#E7EAE2"} />
          );
        })}
        {/* avenida diagonal */}
        <path d="M-20 470 L880 130" stroke="#F6F4EE" strokeWidth="30" />
        <path d="M-20 470 L880 130" stroke="#E2DCC9" strokeWidth="2" strokeDasharray="14 12" />
                <g fontSize="15" fill="#5E6B61" letterSpacing="1.5">
          <text x="520" y="271" transform="rotate(-20.7 520 271)">AV. LAS ACACIAS</text>
          <text x="176" y="223">CALLE DE LOS TILOS</text>
          <text x="492" y="15" textAnchor="middle">
            PASAJE CEIBO
          </text>
          <text x="370" y="327" textAnchor="middle" fill="#3E4C43">
            Plaza Los Aromos
          </text>
        </g>
        {/* estacionamiento */}
        <g transform="translate(206 318)">
          <rect width="30" height="30" rx="8" fill="#8F7FA3" />
          <text x="15" y="21" textAnchor="middle" fontSize="17" fontWeight="600" fill="#F6F4EE">
            P
          </text>
        </g>
        {/* parada de colectivo */}
        <g transform="translate(640 190)">
          <circle r="15" fill="#F6F4EE" stroke="#7F8F7A" strokeWidth="2" />
          <rect x="-7" y="-6" width="14" height="10" rx="2" fill="#7F8F7A" />
          <circle cx="-4" cy="6" r="1.8" fill="#7F8F7A" />
          <circle cx="4" cy="6" r="1.8" fill="#7F8F7A" />
        </g>
        {/* pin */}
        <g transform="translate(430 174)">
          <circle cy="44" r="30" fill="#3E4C43" opacity="0.14" className="motion-safe:animate-ping [transform-box:fill-box] [transform-origin:center]" />
          <ellipse cy="46" rx="16" ry="5" fill="#26302A" opacity="0.2" />
          <path d="M0 44 C-6 30 -26 14 -26 -6 a26 26 0 0 1 52 0 C26 14 6 30 0 44Z" fill="#3E4C43" />
          <circle cy="-6" r="10" fill="#C3B6CF" />
        </g>
      </svg>
      <div className="absolute bottom-4 left-4 rounded-2xl bg-[#F6F4EE]/90 px-4 py-3 text-sm text-[#26302A] shadow-[0_10px_30px_-18px_rgba(38,48,42,0.6)] backdrop-blur-sm">
        <span className="block font-medium">Alma Clara</span>
        <span className="text-[#3E4C43]/70">Calle de los Tilos 245</span>
      </div>
    </div>
  );
}
