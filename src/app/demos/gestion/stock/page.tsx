import { DemoBar } from "@/components/demos/DemoBar";
import { StockApp } from "@/demos/gestion/stock/StockApp";

export default function StockDemo() {
  return (
    <>
      <StockApp />
      <DemoBar
        minimizada
        estilo="Stock"
        mensaje="Hola Fran, vi la demo Stock y quiero algo así para mi negocio."
        otrosHref="/demos/gestion"
        pregunta="¿Querés uno así?"
      />
    </>
  );
}
