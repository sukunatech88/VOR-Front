import type { OperationsDashboardFailureView } from "../types/dashboard.types";
import { Card } from "../../../shared/components/ui/card";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : dateFormatter.format(date);
}

interface DashboardFailureListProps {
  items: OperationsDashboardFailureView[];
}

export function DashboardFailureList({ items }: DashboardFailureListProps) {
  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Recent failures</h2>
        <p className="mt-1 text-sm text-slate-400">
          Latest operational failures reported by the service.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-400">No recent failures.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-300">
                  {item.source}
                </span>
                <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-200">
                  {item.status}
                </span>
              </div>

              <p className="mt-3 text-sm font-medium text-white">
                {item.ownership.bankConnectionDisplayName}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {item.ownership.bankName}
              </p>
              <p className="mt-3 text-sm text-slate-300">
                {item.reason?.trim() || "No additional detail."}
              </p>
              <time
                className="mt-3 block text-xs text-slate-500"
                dateTime={item.occurredAt}
              >
                {formatDate(item.occurredAt)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
