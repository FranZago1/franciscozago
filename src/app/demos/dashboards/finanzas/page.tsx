import { FinanzasDashboard } from "@/demos/dashboards/finanzas/Dashboard";
import { BarraDashboards } from "@/demos/dashboards/shared/Barra";

export default function FinanzasDemo() {
  return (
    <>
      <FinanzasDashboard />
      <BarraDashboards estilo="Finanzas" nombre="Finanzas" />
    </>
  );
}
