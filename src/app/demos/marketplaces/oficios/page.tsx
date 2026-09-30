import { DemoBar } from "@/components/demos/DemoBar";
import { ComoFunciona, Pie, Testimonios } from "@/demos/marketplaces/oficios/Estaticas";
import { Perfil } from "@/demos/marketplaces/oficios/Perfil";
import { Presupuesto } from "@/demos/marketplaces/oficios/Presupuesto";
import { Resultados } from "@/demos/marketplaces/oficios/Resultados";
import { Header, Hero, OficiosGrid } from "@/demos/marketplaces/oficios/Secciones";
import { OficiosProvider } from "@/demos/marketplaces/oficios/store";
import { Sumate } from "@/demos/marketplaces/oficios/Sumate";
import { sans, tokens } from "@/demos/marketplaces/oficios/ui";

export default function OficiosDemo() {
  return (
    <div data-demo-root style={tokens} className={`min-h-dvh overflow-x-clip bg-white text-(--ma-tinta) ${sans}`}>
      <OficiosProvider>
        <Header />
        <main>
          <Hero />
          <OficiosGrid />
          <Resultados />
          <ComoFunciona />
          <Testimonios />
          <Sumate />
        </main>
        <Pie />
        <Perfil />
        <Presupuesto />
      </OficiosProvider>
      <DemoBar
        estilo="Oficios"
        mensaje="Hola Fran, vi la demo Oficios y quiero algo así para mi negocio."
        otrosHref="/demos/marketplaces"
        pregunta="¿Querés uno así?"
      />
    </div>
  );
}
