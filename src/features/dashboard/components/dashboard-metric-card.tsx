import type { DashboardMetric } from "../types/dashboard.types";
import { Card } from "../../../shared/components/ui/card";

function toneClasses(tone: DashboardMetric["tone"]) {
  switch (tone) {
    case "success":
      return "text-emerald-300";
    case "warning":
      return "text-amber-300";
    case "danger":
      return "text-rose-300";
    default:
      return "text-white";
  }
}

interface DashboardMetricCardProps {
  metric: DashboardMetric;
}

export function DashboardMetricCard({ metric }: DashboardMetricCardProps) {
  return (
    <Card>
      <p className="text-sm text-slate-400">{metric.label}</p>
      <p className={`mt-3 text-3xl font-semibold ${toneClasses(metric.tone)}`}>
        {metric.value}
      </p>
      {metric.trend ? (
        <p className="mt-2 text-sm text-slate-500">{metric.trend}</p>
      ) : null}
    </Card>
  );
}