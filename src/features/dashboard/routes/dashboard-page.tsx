import { Card } from "../../../shared/components/ui/card";
import { PageHeader } from "../../../shared/components/page-header";

export function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Vista inicial de operación para VOR Phase 1. Aquí luego conectaremos KPIs reales, salud operativa y actividad reciente."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-400">Files processed</p>
          <p className="mt-3 text-3xl font-semibold text-white">128</p>
        </Card>

        <Card>
          <p className="text-sm text-slate-400">Pending validations</p>
          <p className="mt-3 text-3xl font-semibold text-white">12</p>
        </Card>

        <Card>
          <p className="text-sm text-slate-400">Exceptions</p>
          <p className="mt-3 text-3xl font-semibold text-white">4</p>
        </Card>
      </div>
    </div>
  );
}