import { proceso } from "@/content/stack";
import { Section } from "./Section";

export function Proceso() {
  return (
    <Section id="proceso" title="Cómo trabajo">
      <ol className="grid gap-5">
        {proceso.map((p, i) => (
          <li key={p.titulo} className="grid grid-cols-[2rem_1fr] gap-3">
            <span aria-hidden className="text-muted tabular-nums">
              {i + 1}.
            </span>
            <p>
              <strong className="font-semibold">{p.titulo}:</strong>{" "}
              <span className="text-muted">{p.linea}</span>
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
