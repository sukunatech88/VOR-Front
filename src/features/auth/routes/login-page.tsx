import { Navigate } from "react-router-dom";

import { useAuth } from "../hooks/use-auth";
import { LoginForm } from "../components/login-form";

export function LoginPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <LoginForm />
    </div>
  );
}