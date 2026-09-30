import { stack } from "@/content/stack";
import { Section } from "./Section";

export function StackSection() {
  return (
    <Section id="stack" title="Stack">
      <dl className="grid gap-3">
        {stack.map((fila) => (
          <div key={fila.categoria} className="grid gap-0.5 sm:grid-cols-[9rem_1fr] sm:gap-6">
            <dt className="font-semibold">{fila.categoria}</dt>
            <dd className="text-muted">{fila.items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
