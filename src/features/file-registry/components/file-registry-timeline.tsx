import type { FileRegistryTimelineEvent } from "../types/file-registry-detail.types";

function badgeClasses(status: FileRegistryTimelineEvent["status"]) {
  switch (status) {
    case "IDENTIFIED":
    case "PARSED":
      return "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20";
    case "FAILED":
    case "UNSUPPORTED":
      return "bg-rose-500/10 text-rose-300 border border-rose-500/20";
    case "INFO":
      return "bg-sky-500/10 text-sky-300 border border-sky-500/20";
    default:
      return "bg-slate-800 text-slate-300 border border-slate-700";
  }
}

interface FileRegistryTimelineProps {
  events: FileRegistryTimelineEvent[];
}

export function FileRegistryTimeline({ events }: FileRegistryTimelineProps) {
  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div
          key={event.id}
          className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-white">{event.type}</p>
              <p className="mt-1 text-sm text-slate-400">{event.description}</p>
            </div>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${badgeClasses(event.status)}`}
            >
              {event.status}
            </span>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            {new Date(event.timestamp).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}