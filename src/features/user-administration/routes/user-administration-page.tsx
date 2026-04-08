import { Card } from "../../../shared/components/ui/card";
import { PageHeader } from "../../../shared/components/page-header";

export function UserAdministrationPage() {
  return (
    <div>
      <PageHeader
        title="User Administration"
        description="Shell inicial del módulo de usuarios, perfiles y roles. Más adelante reemplazaremos fake auth por Auth0/Okta + authz real."
      />

      <Card>
        <p className="text-sm text-slate-300">User Administration shell listo.</p>
      </Card>
    </div>
  );
}