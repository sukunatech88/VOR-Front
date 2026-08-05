import type { OperationsConnectionConfigurationView } from "../types/dashboard.types";
import { Card } from "../../../shared/components/ui/card";

const numberFormatter = new Intl.NumberFormat();

interface DashboardConnectionSummaryProps {
  configuration: OperationsConnectionConfigurationView;
}

export function DashboardConnectionSummary({
  configuration,
}: DashboardConnectionSummaryProps) {
  const administrativeSummary = [
    ["Configured connections", configuration.configuredConnections],
    ["Active connections", configuration.activeConnections],
  ] as const;
  const technicalSummary = [
    ["Healthy", configuration.healthyConnections],
    ["Degraded", configuration.degradedConnections],
    ["Untested", configuration.untestedConnections],
    ["Stale", configuration.staleConnections],
    ["Not configured", configuration.unconfiguredConnections],
  ] as const;

  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">
          Connection summary
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Administrative configuration and technical health are reported
          separately.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.6fr_1.4fr]">
        <section aria-labelledby="administrative-summary-title">
          <h3
            id="administrative-summary-title"
            className="text-sm font-semibold text-slate-200"
          >
            Administrative
          </h3>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {administrativeSummary.map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
              >
                <dt className="text-sm text-slate-400">{label}</dt>
                <dd className="mt-2 text-2xl font-semibold text-white">
                  {numberFormatter.format(value)}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="technical-summary-title">
          <h3
            id="technical-summary-title"
            className="text-sm font-semibold text-slate-200"
          >
            Technical
          </h3>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {technicalSummary.map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
              >
                <dt className="text-sm text-slate-400">{label}</dt>
                <dd className="mt-2 text-2xl font-semibold text-white">
                  {numberFormatter.format(value)}
                </dd>
              </div>
            ))}
          </dl>
          {!configuration.technicalHealthAvailable ? (
            <p
              className="mt-4 text-sm text-amber-300"
              role="status"
              aria-live="polite"
            >
              Technical health data is not available.
            </p>
          ) : null}
        </section>
      </div>
    </Card>
  );
}
