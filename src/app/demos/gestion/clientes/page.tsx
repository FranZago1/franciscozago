import { DemoBar } from "@/components/demos/DemoBar";
import { ClientesApp } from "@/demos/gestion/clientes/ClientesApp";

export default function ClientesDemo() {
  return (
    <>
      <ClientesApp />
      <DemoBar
        minimizada
        estilo="Clientes"
        mensaje="Hola Fran, vi la demo Clientes y quiero algo así para mi negocio."
        otrosHref="/demos/gestion"
        pregunta="¿Querés uno así?"
      />
    </>
  );
}
