import { Contacto } from "@/components/Contacto";
import { Demos } from "@/components/Demos";
import { Hero } from "@/components/Hero";
import { OtrosProyectos } from "@/components/OtrosProyectos";
import { Proceso } from "@/components/Proceso";
import { Section } from "@/components/Section";
import { Servicios } from "@/components/Servicios";
import { StackSection } from "@/components/StackSection";
import { TrabajoCard } from "@/components/TrabajoCard";
import { trabajosCliente } from "@/content/trabajos";

export default function Home() {
  return (
    <>
      <Hero />
      <Section id="trabajos" title="Trabajos">
        <div className="grid gap-16">
          {trabajosCliente.map((t) => (
            <TrabajoCard key={t.slug} trabajo={t} />
          ))}
        </div>
      </Section>
      <Servicios />
      <Demos />
      <Proceso />
      <OtrosProyectos />
      <StackSection />
      <Contacto />
    </>
  );
}
