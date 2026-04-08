import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/use-auth";
import { Button } from "../../../shared/components/ui/button";
import { Card } from "../../../shared/components/ui/card";

export function LoginForm() {
  const [email, setEmail] = useState("operator@vor.local");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(email);
    navigate("/dashboard", { replace: true });
  };

  return (
    <Card className="w-full max-w-md">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">
          VOR
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          Ingreso temporal
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Auth real aún no integrado. Este acceso usa fake auth desacoplado.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm text-slate-300" htmlFor="email">
            Correo
          </label>
          <input
            id="email"
            type="email"
            className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none transition focus:border-indigo-500"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <Button type="submit" fullWidth>
          Entrar
        </Button>
      </form>
    </Card>
  );
}