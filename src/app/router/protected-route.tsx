import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const location = useLocation();
  const loginStarted = useRef(false);
  const returnTo = `${location.pathname}${location.search}${location.hash}`;

  useEffect(() => {
    if (isLoading || isAuthenticated || loginStarted.current) {
      return;
    }

    loginStarted.current = true;
    void loginWithRedirect({
      appState: { returnTo },
    }).catch(() => {
      loginStarted.current = false;
    });
  }, [isAuthenticated, isLoading, loginWithRedirect, returnTo]);

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

  if (!isAuthenticated) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-sm text-slate-300"
        role="status"
        aria-live="polite"
      >
        Redirigiendo al acceso seguro...
      </div>
    );
  }

  return <Outlet />;
}
