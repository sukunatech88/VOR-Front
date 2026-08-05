import type {
  OperationsAdministrativeStatus,
  OperationsConnectionHealthView,
  OperationsTechnicalStatus,
} from "../types/dashboard.types";
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

function administrativeStatusClasses(status: OperationsAdministrativeStatus) {
  return status === "ACTIVE"
    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
    : "border-slate-700 bg-slate-900 text-slate-300";
}

function technicalStatusClasses(status: OperationsTechnicalStatus) {
  switch (status) {
    case "HEALTHY":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "DEGRADED":
      return "border-rose-500/20 bg-rose-500/10 text-rose-300";
    case "STALE":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    default:
      return "border-slate-700 bg-slate-900 text-slate-300";
  }
}

interface DashboardConnectionHealthListProps {
  items: OperationsConnectionHealthView[];
}

export function DashboardConnectionHealthList({
  items,
}: DashboardConnectionHealthListProps) {
  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Connection health</h2>
        <p className="mt-1 text-sm text-slate-400">
          Administrative and technical status for each bank connection.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-400">
          No bank connections are configured.
        </p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.ownership.bankConnectionId}
              className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4"
            >
              <div className="flex flex-col justify-between gap-4 lg:flex-row">
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {item.ownership.bankConnectionDisplayName}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {item.ownership.bankName} ·{" "}
                    {item.ownership.bankConnectionCode}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${administrativeStatusClasses(item.administrativeStatus)}`}
                  >
                    Administrative: {item.administrativeStatus}
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${technicalStatusClasses(item.technicalStatus)}`}
                  >
                    Technical: {item.technicalStatus}
                  </span>
                </div>
              </div>

              <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Latest test
                  </dt>
                  <dd className="mt-1 text-sm text-slate-300">
                    {item.latestTest
                      ? formatDate(item.latestTest.occurredAt)
                      : "Never tested"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Latest inbound poll
                  </dt>
                  <dd className="mt-1 text-sm text-slate-300">
                    {item.latestInboundPoll
                      ? formatDate(item.latestInboundPoll.occurredAt)
                      : "No inbound poll"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Latest outbound transfer
                  </dt>
                  <dd className="mt-1 text-sm text-slate-300">
                    {item.latestOutboundTransfer
                      ? formatDate(item.latestOutboundTransfer.occurredAt)
                      : "No outbound transfer"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Latest error
                  </dt>
                  <dd className="mt-1 text-sm text-slate-300">
                    {item.latestError ? (
                      <>
                        <span className="block">{item.latestError.message}</span>
                        <time
                          className="mt-1 block text-xs text-slate-500"
                          dateTime={item.latestError.occurredAt}
                        >
                          {formatDate(item.latestError.occurredAt)}
                        </time>
                      </>
                    ) : (
                      "No recent error"
                    )}
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
