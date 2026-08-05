import { Button } from "../../../shared/components/ui/button";
import type { ApiError } from "../../../core/http/api-error";
import type { OperationsTimelineEventView } from "../types/message-hub.types";
import { MessageHubErrorState } from "./message-hub-error-state";

const hiddenDetailKeys = new Set([
  "correlationId",
  "retryAttemptId",
  "traceId",
]);

function visibleDetails(event: OperationsTimelineEventView) {
  return Object.entries(event.details).filter(
    ([key]) => !hiddenDetailKeys.has(key),
  );
}

interface MessageHubTimelineProps {
  events?: OperationsTimelineEventView[];
  error: ApiError | null;
  isLoading: boolean;
  isFetching: boolean;
  onRetry: () => void;
}

export function MessageHubTimeline({
  events,
  error,
  isLoading,
  isFetching,
  onRetry,
}: MessageHubTimelineProps) {
  if (isLoading) {
    return (
      <p role="status" className="text-sm text-slate-300">
        Loading timeline...
      </p>
    );
  }

  if (error) {
    return (
      <MessageHubErrorState
        error={error}
        isRetrying={isFetching}
        onRetry={onRetry}
      />
    );
  }

  if (!events?.length) {
    return (
      <p className="text-sm text-slate-400">
        No processing events are available for this message.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={onRetry}
          disabled={isFetching}
        >
          {isFetching ? "Refreshing..." : "Refresh timeline"}
        </Button>
      </div>
      <ol className="space-y-3">
        {events.map((event, index) => {
          const details = visibleDetails(event);

          return (
            <li
              key={`${event.occurredAt}-${event.type}-${index}`}
              className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-white">
                    {event.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{event.type}</p>
                </div>
                {event.status ? (
                  <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200">
                    {event.status}
                  </span>
                ) : null}
              </div>
              <time
                className="mt-3 block text-xs text-slate-400"
                dateTime={event.occurredAt}
              >
                {new Date(event.occurredAt).toLocaleString()}
              </time>
              {details.length ? (
                <dl className="mt-4 grid gap-2 border-t border-slate-800 pt-3 text-xs sm:grid-cols-2">
                  {details.map(([key, value]) => (
                    <div key={key} className="min-w-0">
                      <dt className="text-slate-500">{key}</dt>
                      <dd className="break-words text-slate-300">{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
