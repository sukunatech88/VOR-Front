import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import type { DashboardQuickLink } from "../types/dashboard.types";
import { Card } from "../../../shared/components/ui/card";

interface DashboardQuickLinksProps {
  items: DashboardQuickLink[];
}

export function DashboardQuickLinks({ items }: DashboardQuickLinksProps) {
  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Quick actions</h2>
        <p className="mt-1 text-sm text-slate-400">
          Fast access to the most relevant operational modules.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <Link
            key={item.id}
            to={item.to}
            className="block rounded-2xl border border-slate-800 bg-slate-950/50 p-4 transition hover:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="mt-1 text-sm text-slate-400">
                  {item.description}
                </p>
              </div>

              <ArrowRight className="mt-1 h-4 w-4 text-slate-500" />
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}