import { DemoBar } from "@/components/demos/DemoBar";
import { BarraAnuncio, ComoFunciona, Manifiesto, Pie } from "@/demos/marketplaces/productores/Estaticas";
import { MapaZonas } from "@/demos/marketplaces/productores/Mapa";
import { Overlays } from "@/demos/marketplaces/productores/Overlays";
import { Catalogo, Categorias, Header, Hero, Productores } from "@/demos/marketplaces/productores/Secciones";
import { MercadoProvider } from "@/demos/marketplaces/productores/store";
import { sans, tokens } from "@/demos/marketplaces/productores/ui";

export default function ProductoresDemo() {
  return (
    <div data-demo-root style={tokens} className={`min-h-dvh overflow-x-clip bg-(--dv-papel) text-(--dv-tinta) ${sans}`}>
      <MercadoProvider>
        <BarraAnuncio />
        <Header />
        <main>
          <Hero />
          <Categorias />
          <Productores />
          <Catalogo />
          <MapaZonas />
          <ComoFunciona />
          <Manifiesto />
        </main>
        <Pie />
        <Overlays />
      </MercadoProvider>
      <DemoBar
        estilo="Productores"
        mensaje="Hola Fran, vi la demo Productores y quiero algo así para mi negocio."
        otrosHref="/demos/marketplaces"
        pregunta="¿Querés uno así?"
      />
    </div>
  );
}
