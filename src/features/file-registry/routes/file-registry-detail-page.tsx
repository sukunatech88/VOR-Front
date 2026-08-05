import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

import {
  getSafeDownloadFileName,
  type ApiClient,
} from "../../../core/http/api-client";
import { useApiClient } from "../../../core/http/api-client-context";
import { ApiError } from "../../../core/http/api-error";
import { Button } from "../../../shared/components/ui/button";
import { Card } from "../../../shared/components/ui/card";
import { PageHeader } from "../../../shared/components/page-header";
import { downloadOperationsFileRaw } from "../api/file-registry.api";
import { FileRegistryErrorState } from "../components/file-registry-error-state";
import { FileStatusBadge } from "../components/file-status-badge";
import { useFileRegistryDetail } from "../hooks/use-file-registry-detail";
import { fileIdSchema } from "../schemas/file-registry.schemas";
import { FileProcessingActions } from "../../processing/components/file-processing-actions";

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

function downloadErrorMessage(error: ApiError) {
  if (error.status === 401) {
    return "Your session is not available. Sign out and sign in again.";
  }

  if (error.status === 403) {
    return "You do not have permission to download this file.";
  }

  if (error.status === 404) {
    return "The raw file is not available.";
  }

  return error.message;
}

function triggerDownload(
  client: ApiClient,
  fileId: string,
  fallbackFileName: string,
  signal: AbortSignal,
) {
  return downloadOperationsFileRaw(client, fileId, signal).then((response) => {
    const fileName = getSafeDownloadFileName(
      response.contentDisposition,
      fallbackFileName,
    );
    const objectUrl = URL.createObjectURL(response.blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);

    try {
      link.click();
    } finally {
      link.remove();
      URL.revokeObjectURL(objectUrl);
    }
  });
}

interface RegistrationLocationState {
  registrationMessage?: string;
}

export function FileRegistryDetailPage() {
  const { fileId = "" } = useParams();
  const location = useLocation();
  const client = useApiClient();
  const downloadController = useRef<AbortController | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<ApiError | null>(null);
  const isValidFileId = fileIdSchema.safeParse(fileId).success;
  const { data, error, isLoading, isFetching, refetch } =
    useFileRegistryDetail(fileId);
  const registrationMessage = (
    location.state as RegistrationLocationState | null
  )?.registrationMessage;

  useEffect(
    () => () => {
      downloadController.current?.abort();
    },
    [],
  );

  const handleRefresh = () => {
    void refetch();
  };

  const handleDownload = async () => {
    if (!data || !isValidFileId) {
      return;
    }

    downloadController.current?.abort();
    const controller = new AbortController();
    downloadController.current = controller;
    setIsDownloading(true);
    setDownloadError(null);

    try {
      await triggerDownload(
        client,
        fileId,
        data.file.originalFileName,
        controller.signal,
      );
    } catch (downloadFailure) {
      if (
        !controller.signal.aborted &&
        downloadFailure instanceof ApiError
      ) {
        setDownloadError(downloadFailure);
      }
    } finally {
      if (downloadController.current === controller) {
        downloadController.current = null;
        setIsDownloading(false);
      }
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Link
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white"
          to="/file-registry"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to File Registry
        </Link>
      </div>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <PageHeader
          title="File detail"
          description="Operational metadata and associated message information."
        />
        {data ? (
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleRefresh}
              disabled={isFetching}
            >
              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>
            <Button
              type="button"
              onClick={() => void handleDownload()}
              disabled={isDownloading}
            >
              {isDownloading ? "Downloading..." : "Download raw"}
            </Button>
          </div>
        ) : null}
      </div>

      {registrationMessage ? (
        <Card className="mb-6" role="status" aria-live="polite">
          <p className="text-sm text-emerald-300">{registrationMessage}</p>
        </Card>
      ) : null}

      {!isValidFileId ? (
        <Card role="alert">
          <h2 className="text-lg font-semibold text-white">
            Invalid file identifier
          </h2>
          <p className="mt-2 text-sm text-rose-300">
            The requested file identifier is not a valid GUID.
          </p>
        </Card>
      ) : null}

      {isValidFileId && isLoading && !data ? (
        <Card role="status" aria-live="polite">
          <p className="text-sm text-slate-300">Loading file detail...</p>
        </Card>
      ) : null}

      {isValidFileId && error && !data ? (
        <FileRegistryErrorState
          error={error}
          isRetrying={isFetching}
          onRetry={handleRefresh}
          notFoundMessage="The requested file does not exist or is not available to this organization."
        />
      ) : null}

      {data ? (
        <div className="space-y-6">
          {error ? (
            <Card role="alert" aria-live="assertive">
              <p className="text-sm text-rose-300">
                The file detail could not be refreshed. {error.message}
              </p>
            </Card>
          ) : null}

          {downloadError ? (
            <Card role="alert" aria-live="assertive">
              <p className="text-sm text-rose-300">
                {downloadErrorMessage(downloadError)}
              </p>
            </Card>
          ) : null}

          <Card>
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {data.file.originalFileName}
                </h2>
                <p className="mt-1 break-all text-xs text-slate-500">
                  File ID: {data.file.id}
                </p>
              </div>
              <FileStatusBadge status={data.file.effectiveStatus} />
            </div>

            <dl className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  Persisted status
                </dt>
                <dd className="mt-1 text-sm text-white">{data.file.status}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  Direction
                </dt>
                <dd className="mt-1 text-sm text-white">
                  {data.file.direction}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  Classified message type
                </dt>
                <dd className="mt-1 text-sm text-white">
                  {data.file.classifiedMessageType ?? "Not classified"}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  Created
                </dt>
                <dd className="mt-1 text-sm text-white">
                  <time dateTime={data.file.createdAt}>
                    {formatDate(data.file.createdAt)}
                  </time>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  Updated
                </dt>
                <dd className="mt-1 text-sm text-white">
                  <time dateTime={data.file.updatedAt}>
                    {formatDate(data.file.updatedAt)}
                  </time>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  Checksum
                </dt>
                <dd className="mt-1 break-all text-sm text-white">
                  {data.file.checksum}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  Organization
                </dt>
                <dd className="mt-1 text-sm text-white">
                  {data.file.ownership.organizationName}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  Bank
                </dt>
                <dd className="mt-1 text-sm text-white">
                  {data.file.ownership.bankName}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  Bank connection
                </dt>
                <dd className="mt-1 text-sm text-white">
                  {data.file.ownership.bankConnectionDisplayName} (
                  {data.file.ownership.bankConnectionCode})
                </dd>
              </div>
            </dl>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Failure reason
              </p>
              <p className="mt-1 text-sm text-slate-300">
                {data.file.failureReason ?? "No failure reported."}
              </p>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-white">
              Associated message
            </h2>

            {data.message ? (
              <dl className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">
                    Message ID
                  </dt>
                  <dd className="mt-1 break-all text-sm text-white">
                    {data.message.message.id}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">
                    Message type
                  </dt>
                  <dd className="mt-1 text-sm text-white">
                    {data.message.message.type}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">
                    Current status
                  </dt>
                  <dd className="mt-1 text-sm text-white">
                    {data.message.currentStatus}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">
                    Message reference
                  </dt>
                  <dd className="mt-1 text-sm text-white">
                    {data.message.message.messageReference ?? "Not available"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">
                    Identified
                  </dt>
                  <dd className="mt-1 text-sm text-white">
                    <time dateTime={data.message.message.identifiedAt}>
                      {formatDate(data.message.message.identifiedAt)}
                    </time>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">
                    Last activity
                  </dt>
                  <dd className="mt-1 text-sm text-white">
                    <time dateTime={data.message.timestamps.lastActivityAt}>
                      {formatDate(data.message.timestamps.lastActivityAt)}
                    </time>
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="mt-3 text-sm text-slate-400">
                No operational message is associated with this file.
              </p>
            )}
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-white">
              Processing actions
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Every operation requires explicit confirmation and runs
              independently.
            </p>
            <div className="mt-5">
              <FileProcessingActions
                file={{
                  id: data.file.id,
                  originalFileName: data.file.originalFileName,
                  direction: data.file.direction,
                  bankConnectionDisplayName:
                    data.file.ownership.bankConnectionDisplayName,
                }}
                message={
                  data.message
                    ? {
                        id: data.message.message.id,
                        status: data.message.currentStatus,
                        type: data.message.message.type,
                      }
                    : undefined
                }
              />
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
