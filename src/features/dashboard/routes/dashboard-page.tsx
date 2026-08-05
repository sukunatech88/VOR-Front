import { ApiError } from "../../../core/http/api-error";
import { Button } from "../../../shared/components/ui/button";
import { Card } from "../../../shared/components/ui/card";
import { PageHeader } from "../../../shared/components/page-header";
import { useDashboardSummary } from "../hooks/use-dashboard-summary";
import { DashboardConnectionHealthList } from "../components/dashboard-connection-health-list";
import { DashboardConnectionSummary } from "../components/dashboard-connection-summary";
import { DashboardFailureList } from "../components/dashboard-failure-list";
import { DashboardMetricCard } from "../components/dashboard-metric-card";
import { DashboardQuickLinks } from "../components/dashboard-quick-links";

const numberFormatter = new Intl.NumberFormat();

export function DashboardPage() {
  const { data, error, isLoading, isFetching, refetch } =
    useDashboardSummary();
  const handleRetry = () => {
    void refetch();
  };
  const isUnauthorized = error instanceof ApiError && error.status === 401;
  const isForbidden = error instanceof ApiError && error.status === 403;
  const canRetry =
    error instanceof ApiError &&
    (error.kind === "network" ||
      error.kind === "protocol" ||
      (error.status !== null && error.status >= 500));
  const errorMessage =
    error instanceof ApiError
      ? error.message
      : "The operational dashboard could not be loaded.";

  const metrics = data
    ? [
        {
          label: "Total files",
          value: numberFormatter.format(data.metrics.totalFiles),
        },
        {
          label: "Total messages",
          value: numberFormatter.format(data.metrics.totalMessages),
        },
        {
          label: "Pending messages",
          value: numberFormatter.format(data.metrics.pendingMessages),
          tone: "warning" as const,
        },
        {
          label: "Pending acknowledgements",
          value: numberFormatter.format(data.metrics.pendingAcknowledgements),
          tone: "warning" as const,
        },
        {
          label: "Exception files",
          value: numberFormatter.format(data.metrics.exceptionFiles),
          tone: "danger" as const,
        },
      ]
    : [];

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <PageHeader
          title="Dashboard"
          description="Operational overview of files, messages, bank connections and recent failures."
        />
        {data ? (
          <Button
            type="button"
            variant="secondary"
            onClick={handleRetry}
            disabled={isFetching}
          >
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
        ) : null}
      </div>

      {isLoading && !data ? (
        <Card role="status" aria-live="polite">
          <p className="text-sm text-slate-300">
            Loading operational dashboard...
          </p>
        </Card>
      ) : null}

      {error && !data ? (
        <Card role="alert" aria-live="assertive">
          <h2 className="text-lg font-semibold text-white">
            {isUnauthorized
              ? "Session unavailable"
              : isForbidden
                ? "Access denied"
                : "Dashboard unavailable"}
          </h2>
          <p className="mt-2 text-sm text-rose-300">
            {isForbidden
              ? "You do not have permission to view operational information."
              : errorMessage}
          </p>
          {isUnauthorized ? (
            <p className="mt-2 text-sm text-slate-400">
              Sign out and sign in again to restore your session.
            </p>
          ) : null}
          {canRetry && !isUnauthorized && !isForbidden ? (
            <Button
              className="mt-4"
              type="button"
              variant="secondary"
              onClick={handleRetry}
              disabled={isFetching}
            >
              Retry
            </Button>
          ) : null}
        </Card>
      ) : null}

      {data ? (
        <>
          {error ? (
            <Card className="mb-6" role="alert" aria-live="assertive">
              <p className="text-sm text-rose-300">
                The dashboard could not be refreshed. {errorMessage}
              </p>
            </Card>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {metrics.map((metric) => (
              <DashboardMetricCard
                key={metric.label}
                label={metric.label}
                value={metric.value}
                tone={metric.tone}
              />
            ))}
          </div>

          <div className="mt-6">
            <DashboardConnectionSummary
              configuration={data.connectionConfiguration}
            />
          </div>

          <div className="mt-6">
            <DashboardConnectionHealthList items={data.connectionHealth} />
          </div>

          <div className="mt-6">
            <DashboardFailureList items={data.recentFailures} />
          </div>

          <div className="mt-6">
            <DashboardQuickLinks />
          </div>
        </>
      ) : null}
    </div>
  );
}
