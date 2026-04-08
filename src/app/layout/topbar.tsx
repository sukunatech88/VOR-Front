import { LogOut } from "lucide-react";

import { useAuth } from "../../features/auth/hooks/use-auth";
import { Button } from "../../shared/components/ui/button";

export function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-6 py-4">
      <div>
        <p className="text-sm font-medium text-white">VOR Phase 1</p>
        <p className="text-xs text-slate-400">Enterprise frontend foundation</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm text-white">{user?.name}</p>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            {user?.role}
          </p>
        </div>

        <Button variant="ghost" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Salir
        </Button>
      </div>
    </header>
  );
}