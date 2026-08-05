import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { MessageHubErrorState } from "../components/message-hub-error-state";
import { MessageHubTimeline } from "../components/message-hub-timeline";
import { MessageStatusBadge } from "../components/message-status-badge";
import { RetryMessageForm } from "../components/retry-message-form";
import {
  useMessageHubDetail,
  useMessageHubTimeline,
} from "../hooks/use-message-hub-detail";
import { messageIdSchema } from "../schemas/message-hub.schemas";
import { PageHeader } from "../../../shared/components/page-header";
import { Button } from "../../../shared/components/ui/button";
import { Card } from "../../../shared/components/ui/card";
import { MessageProcessingActions } from "../../processing/components/message-processing-actions";

function displayValue(value: string | number | null | undefined) {
  return value === null || value === undefined || value === ""
    ? "Not available"
    : String(value);
}

interface DetailValueProps {
  label: string;
  value: string | number | null | undefined;
}

function DetailValue({ label, value }: DetailValueProps) {
  return (
    <div className="min-w-0">
      <dt className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm text-white">
        {displayValue(value)}
      </dd>
    </div>
  );
}

export function MessageHubDetailPage() {
  const { messageId = "" } = useParams();
  const isValidMessageId = messageIdSchema.safeParse(messageId).success;
  const detailQuery = useMessageHubDetail(messageId, isValidMessageId);
  const timelineQuery = useMessageHubTimeline(
    messageId,
    isValidMessageId,
  );

  async function refreshAll() {
    await Promise.all([detailQuery.refetch(), timelineQuery.refetch()]);
  }

  if (!isValidMessageId) {
    return (
      <Card role="alert">
        <h2 className="text-lg font-semibold text-white">
          Message not found
        </h2>
        <p className="mt-2 text-sm text-rose-300">
          The message identifier in the URL is not valid.
        </p>
        <Link
          className="mt-4 inline-flex text-sm text-indigo-300 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          to="/message-hub"
        >
          Back to Message Hub
        </Link>
      </Card>
    );
  }

  if (detailQuery.isPending) {
    return (
      <Card role="status">
        <p className="text-sm text-slate-300">
          Loading message detail...
        </p>
      </Card>
    );
  }

  if (detailQuery.error || !detailQuery.data) {
    return (
      <div className="space-y-4">
        <MessageHubErrorState
          error={detailQuery.error}
          isRetrying={detailQuery.isFetching}
          onRetry={() => detailQuery.refetch()}
        />
        <Link
          className="inline-flex text-sm text-indigo-300 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          to="/message-hub"
        >
          Back to Message Hub
        </Link>
      </div>
    );
  }

  const data = detailQuery.data;
  const message = data.message;
  const file = data.file;
  const normalizedItemCount =
    data.normalized.paymentInstructions.length +
    data.normalized.accountStatements.length +
    (data.normalized.paymentStatusReport ? 1 : 0);

  return (
    <div>
      <div className="mb-4">
        <Link
          className="inline-flex h-11 items-center rounded-xl border border-slate-700 px-4 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          to="/message-hub"
        >
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          Back to Message Hub
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title={`Message · ${message.messageReference || message.id}`}
          description="Operational message details, validation and processing history."
        />
        <div className="mb-6">
          <Button
            type="button"
            variant="secondary"
            onClick={refreshAll}
            disabled={detailQuery.isFetching || timelineQuery.isFetching}
          >
            {detailQuery.isFetching || timelineQuery.isFetching
              ? "Refreshing..."
              : "Refresh all"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-white">Metadata</h2>
              <MessageStatusBadge status={data.currentStatus} />
            </div>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <DetailValue label="Message ID" value={message.id} />
              <DetailValue label="Reference" value={message.messageReference} />
              <DetailValue label="Message type" value={message.type} />
              <DetailValue label="Direction" value={message.direction} />
              <DetailValue
                label="Bank connection"
                value={message.ownership.bankConnectionDisplayName}
              />
              <DetailValue
                label="Organization"
                value={message.ownership.organizationName}
              />
              <DetailValue label="Parser profile" value={message.parserProfile} />
              <DetailValue
                label="Detected root"
                value={message.detectedRootElement}
              />
              <DetailValue
                label="Identified"
                value={new Date(message.identifiedAt).toLocaleString()}
              />
              <DetailValue
                label="Last activity"
                value={new Date(data.timestamps.lastActivityAt).toLocaleString()}
              />
            </dl>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-white">
              Associated file
            </h2>
            {file ? (
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">
                    File
                  </dt>
                  <dd className="mt-1">
                    <Link
                      className="break-words text-sm text-indigo-300 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                      to={`/file-registry/${file.id}`}
                    >
                      {file.originalFileName}
                    </Link>
                  </dd>
                </div>
                <DetailValue label="File ID" value={file.id} />
                <DetailValue label="File status" value={file.status} />
                <DetailValue
                  label="Effective file status"
                  value={file.effectiveStatus}
                />
              </dl>
            ) : (
              <p className="mt-3 text-sm text-slate-400">
                Associated file metadata is not available.
              </p>
            )}
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-white">
              Normalized data
            </h2>
            {normalizedItemCount ? (
              <dl className="mt-5 grid gap-4 sm:grid-cols-3">
                <DetailValue
                  label="Payment instructions"
                  value={data.normalized.paymentInstructions.length}
                />
                <DetailValue
                  label="Status report"
                  value={
                    data.normalized.paymentStatusReport
                      ? data.normalized.paymentStatusReport.status
                      : "Not available"
                  }
                />
                <DetailValue
                  label="Account statements"
                  value={data.normalized.accountStatements.length}
                />
              </dl>
            ) : (
              <p className="mt-3 text-sm text-slate-400">
                No normalized business objects are available.
              </p>
            )}
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-white">Validation</h2>
            {data.latestValidationResult ? (
              <div className="mt-4">
                <p className="text-sm text-slate-300">
                  Latest result:{" "}
                  <span className="font-medium text-white">
                    {data.latestValidationResult.status}
                  </span>
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {new Date(
                    data.latestValidationResult.checkedAt,
                  ).toLocaleString()}
                </p>
                {data.latestValidationResult.findings.length ? (
                  <ul className="mt-4 space-y-2">
                    {data.latestValidationResult.findings.map((finding) => (
                      <li
                        key={finding.id}
                        className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-sm"
                      >
                        <p className="font-medium text-slate-200">
                          {finding.severity} · {finding.code}
                        </p>
                        <p className="mt-1 text-slate-400">
                          {finding.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-slate-400">
                    No validation findings.
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-400">
                No validation result is available.
              </p>
            )}
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-white">
              Processing pipeline
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Each transition is explicit and never starts the next operation
              automatically.
            </p>
            <div className="mt-5">
              <MessageProcessingActions
                messageId={message.id}
                fileId={file?.id}
                status={data.currentStatus}
                type={message.type}
              />
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-white">
              Retry message
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Manually retry the PARSE operation when the backend contract
              permits it.
            </p>
            <div className="mt-5">
              <RetryMessageForm
                messageId={message.id}
                messageStatus={data.currentStatus}
                messageType={message.type}
              />
            </div>
          </Card>
        </div>

        <Card className="self-start">
          <h2 className="text-lg font-semibold text-white">Timeline</h2>
          <p className="mt-2 text-sm text-slate-400">
            Events are shown in the order returned by VOR.
          </p>
          <div className="mt-5">
            <MessageHubTimeline
              events={timelineQuery.data?.events}
              error={timelineQuery.error}
              isLoading={timelineQuery.isPending}
              isFetching={timelineQuery.isFetching}
              onRetry={() => timelineQuery.refetch()}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
