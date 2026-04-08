import { NavLink } from "react-router-dom";
import {
  FolderKanban,
  LayoutDashboard,
  MessagesSquare,
  Users,
} from "lucide-react";

import { mainNavigation } from "../../core/constants/navigation";
import { cn } from "../../core/utils/cn";

const iconMap = {
  "layout-dashboard": LayoutDashboard,
  "folder-kanban": FolderKanban,
  "messages-square": MessagesSquare,
  users: Users,
};

export function SidebarNav() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-950/80 px-4 py-5">
      <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">VOR</p>
        <h1 className="mt-2 text-lg font-semibold text-white">
          Connected Finance Platform
        </h1>
        <p className="mt-2 text-sm text-slate-400">Phase 1 frontend shell</p>
      </div>

      <nav className="space-y-2">
        {mainNavigation.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors",
                  isActive
                    ? "border-indigo-500/40 bg-indigo-500/10 text-white"
                    : "border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-slate-900",
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <p className="text-xs font-medium text-slate-300">Estado actual</p>
        <p className="mt-2 text-sm text-slate-400">
          Fake auth activa. Backend real pendiente.
        </p>
      </div>
    </aside>
  );
}