import { OcupacionDashboard } from "@/demos/dashboards/ocupacion/Dashboard";
import { BarraDashboards } from "@/demos/dashboards/shared/Barra";

export default function OcupacionDemo() {
  return (
    <>
      <OcupacionDashboard />
      <BarraDashboards estilo="Ocupación" nombre="Ocupación" />
    </>
  );
}
