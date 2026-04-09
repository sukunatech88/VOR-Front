import { useDashboardSummary } from "../hooks/use-dashboard-summary";
import { DashboardMetricCard } from "../components/dashboard-metric-card";
import { DashboardActivityList } from "../components/dashboard-activity-list";
import { DashboardQuickLinks } from "../components/dashboard-quick-links";
import { Card } from "../../../shared/components/ui/card";
import { PageHeader } from "../../../shared/components/page-header";

export function DashboardPage() {
  const { data, isLoading, isError } = useDashboardSummary();

  if (isLoading) {
    return (
      <Card>
        <p className="text-sm text-slate-300">Loading dashboard summary...</p>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card>
        <p className="text-sm text-rose-300">
          Failed to load dashboard summary.
        </p>
      </Card>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Executive operational overview for VOR Phase 1. This view centralizes file activity, exceptions and quick access to core modules."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <DashboardMetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <DashboardActivityList items={data.activity} />
        <DashboardQuickLinks items={data.quickLinks} />
      </div>
    </div>
  );
}