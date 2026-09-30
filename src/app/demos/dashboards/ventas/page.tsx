import { BarraDashboards } from "@/demos/dashboards/shared/Barra";
import { VentasDashboard } from "@/demos/dashboards/ventas/Dashboard";

export default function VentasDemo() {
  return (
    <>
      <VentasDashboard />
      <BarraDashboards estilo="Ventas" nombre="Ventas" />
    </>
  );
}
