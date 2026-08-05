import { Card } from "../../../shared/components/ui/card";

type DashboardMetricTone = "default" | "success" | "warning" | "danger";

function toneClasses(tone: DashboardMetricTone) {
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
  label: string;
  value: string;
  tone?: DashboardMetricTone;
}

export function DashboardMetricCard({
  label,
  value,
  tone = "default",
}: DashboardMetricCardProps) {
  return (
    <Card>
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-3 text-3xl font-semibold ${toneClasses(tone)}`}>
        {value}
      </p>
    </Card>
  );
}
