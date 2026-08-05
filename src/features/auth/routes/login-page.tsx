import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/use-auth";
import { LoginForm } from "../components/login-form";

function isInternalPath(path: string) {
  return path.startsWith("/") && !path.startsWith("//");
}

export function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const requestedReturnTo =
    typeof location.state === "object" &&
    location.state !== null &&
    "returnTo" in location.state &&
    typeof location.state.returnTo === "string"
      ? location.state.returnTo
      : undefined;
  const returnTo =
    requestedReturnTo && isInternalPath(requestedReturnTo)
      ? requestedReturnTo
      : "/dashboard";

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-sm text-slate-300"
        role="status"
        aria-live="polite"
      >
        Verificando sesión...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={returnTo} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <LoginForm returnTo={returnTo} />
    </div>
  );
}
