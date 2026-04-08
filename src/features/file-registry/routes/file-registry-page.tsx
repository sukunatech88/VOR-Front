import { Card } from "../../../shared/components/ui/card";
import { PageHeader } from "../../../shared/components/page-header";

export function FileRegistryPage() {
  return (
    <div>
      <PageHeader
        title="File Registry"
        description="Primer módulo real del frontend. Esta pantalla queda lista para conectar mocks y luego backend real."
      />

      <Card>
        <p className="text-sm text-slate-300">
          Base del módulo file-registry creada.
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Siguiente bloque: tabla, filtros, tipos, mock API y adaptación al backend real.
        </p>
      </Card>
    </div>
  );
}