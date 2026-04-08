import { Outlet } from "react-router-dom";

import { SidebarNav } from "./sidebar-nav";
import { Topbar } from "./topbar";

export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex">
        <SidebarNav />

        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />
          <main className="flex-1 px-6 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}