import { DemoBar } from "@/components/demos/DemoBar";
import { Overlays } from "@/demos/marketplaces/usados/Detalle";
import { ComoFunciona, Pie } from "@/demos/marketplaces/usados/Estaticas";
import { Listado } from "@/demos/marketplaces/usados/Listado";
import { Publicar } from "@/demos/marketplaces/usados/Publicar";
import { Categorias, Header, Hero, Marquesina } from "@/demos/marketplaces/usados/Secciones";
import { UsadosProvider } from "@/demos/marketplaces/usados/store";
import { sans, tokens } from "@/demos/marketplaces/usados/ui";

export default function UsadosDemo() {
  return (
    <div data-demo-root style={tokens} className={`min-h-dvh overflow-x-clip bg-(--sv-fondo) text-(--sv-negro) ${sans}`}>
      <UsadosProvider>
        <Header />
        <Marquesina />
        <main>
          <Hero />
          <Categorias />
          <Listado />
          <Publicar />
          <ComoFunciona />
        </main>
        <Pie />
        <Overlays />
      </UsadosProvider>
      <DemoBar
        estilo="Usados"
        mensaje="Hola Fran, vi la demo Usados y quiero algo así para mi negocio."
        otrosHref="/demos/marketplaces"
        pregunta="¿Querés uno así?"
      />
    </div>
  );
}
