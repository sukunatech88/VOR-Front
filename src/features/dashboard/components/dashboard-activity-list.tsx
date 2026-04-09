import type { DashboardActivityItem } from "../types/dashboard.types";
import { Card } from "../../../shared/components/ui/card";

function badgeClasses(status: DashboardActivityItem["status"]) {
  switch (status) {
    case "success":
      return "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20";
    case "warning":
      return "bg-amber-500/10 text-amber-300 border border-amber-500/20";
    case "danger":
      return "bg-rose-500/10 text-rose-300 border border-rose-500/20";
    default:
      return "bg-sky-500/10 text-sky-300 border border-sky-500/20";
  }
}

interface DashboardActivityListProps {
  items: DashboardActivityItem[];
}

export function DashboardActivityList({ items }: DashboardActivityListProps) {
  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Recent activity</h2>
        <p className="mt-1 text-sm text-slate-400">
          Latest operational events across ingestion and processing.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-white">{item.title}</p>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${badgeClasses(item.status)}`}
              >
                {item.status}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-400">{item.description}</p>
            <p className="mt-3 text-xs text-slate-500">
              {new Date(item.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}