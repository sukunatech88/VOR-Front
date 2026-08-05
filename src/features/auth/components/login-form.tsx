import { useAuth } from "../hooks/use-auth";
import { Button } from "../../../shared/components/ui/button";
import { Card } from "../../../shared/components/ui/card";

interface LoginFormProps {
  returnTo?: string;
}

export function LoginForm({ returnTo }: LoginFormProps) {
  const { error, isLoading, login } = useAuth();

  return (
    <Card className="w-full max-w-md">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">
          VOR
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          Acceso seguro
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Continúa con Auth0 para ingresar a la plataforma operativa VOR.
        </p>
      </div>

      <div className="space-y-4">
        {error ? (
          <p className="text-sm text-rose-300" role="alert">
            No fue posible iniciar la sesión. Intenta nuevamente.
          </p>
        ) : null}

        <Button
          type="button"
          fullWidth
          disabled={isLoading}
          onClick={() => void login(returnTo)}
        >
          {isLoading ? "Preparando acceso..." : "Ingresar con Auth0"}
        </Button>
      </div>
    </Card>
  );
}
