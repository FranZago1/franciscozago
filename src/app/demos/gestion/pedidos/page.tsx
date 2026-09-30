import { DemoBar } from "@/components/demos/DemoBar";
import { PedidosApp } from "@/demos/gestion/pedidos/PedidosApp";

export default function PedidosDemo() {
  return (
    <>
      <PedidosApp />
      <DemoBar
        minimizada
        estilo="Pedidos"
        mensaje="Hola Fran, vi la demo Pedidos y quiero algo así para mi negocio."
        otrosHref="/demos/gestion"
        pregunta="¿Querés uno así?"
      />
    </>
  );
}
