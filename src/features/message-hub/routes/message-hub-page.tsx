import { Card } from "../../../shared/components/ui/card";
import { PageHeader } from "../../../shared/components/page-header";

export function MessageHubPage() {
  return (
    <div>
      <PageHeader
        title="Message Hub"
        description="Shell inicial del módulo de trazabilidad. Aquí luego montaremos lista, detalle, timeline y payload viewer."
      />

      <Card>
        <p className="text-sm text-slate-300">Message Hub shell listo.</p>
      </Card>
    </div>
  );
}