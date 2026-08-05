import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { PaymentDetailValue } from "../components/payment-detail-value";
import { PaymentMonitorErrorState } from "../components/payment-monitor-error-state";
import { PaymentStatusBadge } from "../components/payment-status-badge";
import { PaymentStatusReports } from "../components/payment-status-reports";
import { PaymentTransactionsTable } from "../components/payment-transactions-table";
import { PaymentTransferTraces } from "../components/payment-transfer-traces";
import { PaymentValidation } from "../components/payment-validation";
import { usePaymentMonitorDetail } from "../hooks/use-payment-monitor-detail";
import { paymentInstructionIdSchema } from "../schemas/payment-monitor.schemas";
import {
  displayText,
  formatDate,
  formatDateTime,
  formatDecimal,
  truncateId,
} from "../utils/payment-monitor-formatters";
import {
  getSafeDownloadFileName,
  type ApiClient,
} from "../../../core/http/api-client";
import { useApiClient } from "../../../core/http/api-client-context";
import { ApiError } from "../../../core/http/api-error";
import { PageHeader } from "../../../shared/components/page-header";
import { Button } from "../../../shared/components/ui/button";
import { Card } from "../../../shared/components/ui/card";
import { FileStatusBadge } from "../../file-registry/components/file-status-badge";
import { downloadOperationsFileRaw } from "../../file-registry/api/file-registry.api";
import { MessageHubTimeline } from "../../message-hub/components/message-hub-timeline";
import { MessageStatusBadge } from "../../message-hub/components/message-status-badge";

function downloadErrorMessage(error: ApiError) {
  if (error.status === 401) {
    return "Your session is unavailable. Sign out and sign in again.";
  }

  if (error.status === 403) {
    return "You do not have permission to download this file.";
  }

  if (error.status === 404) {
    return "The raw file is not available.";
  }

  return error.message;
}

async function triggerDownload(
  client: ApiClient,
  fileId: string,
  fallbackFileName: string,
  signal: AbortSignal,
) {
  const response = await downloadOperationsFileRaw(client, fileId, signal);
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
}

export function PaymentMonitorDetailPage() {
  const { paymentInstructionId = "" } = useParams();
  const client = useApiClient();
  const query = usePaymentMonitorDetail(paymentInstructionId);
  const downloadController = useRef<AbortController | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<ApiError | null>(null);
  const isValidId =
    paymentInstructionIdSchema.safeParse(paymentInstructionId).success;

  useEffect(
    () => () => {
      downloadController.current?.abort();
    },
    [],
  );

  async function handleDownload() {
    if (!query.data || !isValidId) {
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
        query.data.file.id,
        query.data.file.originalFileName,
        controller.signal,
      );
    } catch (error) {
      if (!controller.signal.aborted && error instanceof ApiError) {
        setDownloadError(error);
      }
    } finally {
      if (downloadController.current === controller) {
        downloadController.current = null;
        setIsDownloading(false);
      }
    }
  }

  if (!isValidId) {
    return (
      <div className="space-y-4">
        <Card role="alert">
          <h2 className="text-lg font-semibold text-white">
            Payment instruction not found
          </h2>
          <p className="mt-2 text-sm text-rose-300">
            The payment instruction identifier is not valid.
          </p>
        </Card>
        <Link
          className="inline-flex text-sm text-indigo-300 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          to="/payment-monitor"
        >
          Back to Payment Monitor
        </Link>
      </div>
    );
  }

  if (query.isPending) {
    return (
      <Card role="status" aria-live="polite">
        <p className="text-sm text-slate-300">
          Loading payment instruction detail...
        </p>
      </Card>
    );
  }

  if (query.error || !query.data) {
    return (
      <div className="space-y-4">
        <PaymentMonitorErrorState
          error={query.error}
          isRetrying={query.isFetching}
          onRetry={() => void query.refetch()}
        />
        <Link
          className="inline-flex text-sm text-indigo-300 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          to="/payment-monitor"
        >
          Back to Payment Monitor
        </Link>
      </div>
    );
  }

  const data = query.data;
  const currencies = Array.from(
    new Set(
      data.transactions
        .map((transaction) => transaction.currency)
        .filter((currency): currency is string => currency !== null),
    ),
  );
  const currency = currencies.length === 1 ? currencies[0] : null;
  const countsDiffer =
    data.declaredTransactionCount !== null &&
    data.declaredTransactionCount !== data.persistedTransactionCount;

  return (
    <div className="space-y-6">
      <Link
        className="inline-flex h-11 items-center rounded-xl border border-slate-700 px-4 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
        to="/payment-monitor"
      >
        <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
        Back to Payment Monitor
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title={`Payment instruction · ${data.reference || truncateId(data.paymentInstructionId)}`}
          description="Treasury view of the payment batch, bank responses and technical evidence."
        />
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
          >
            {query.isFetching ? "Refreshing..." : "Refresh all"}
          </Button>
        </div>
      </div>

      {downloadError ? (
        <Card role="alert" aria-live="assertive">
          <p className="text-sm text-rose-300">
            {downloadErrorMessage(downloadError)}
          </p>
        </Card>
      ) : null}

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Summary</h2>
          <PaymentStatusBadge status={data.status} />
        </div>
        <dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <PaymentDetailValue label="Payment instruction ID">
            {data.paymentInstructionId}
          </PaymentDetailValue>
          <PaymentDetailValue label="Reference">
            {displayText(data.reference)}
          </PaymentDetailValue>
          <PaymentDetailValue label="Requested execution date">
            {formatDate(data.requestedExecutionDate)}
          </PaymentDetailValue>
          <PaymentDetailValue label="Control sum">
            {formatDecimal(data.controlSum)}
            {currency ? ` ${currency}` : ""}
          </PaymentDetailValue>
          <PaymentDetailValue label="Currency">
            {currency || "—"}
          </PaymentDetailValue>
          <PaymentDetailValue label="Declared transactions">
            {data.declaredTransactionCount ?? "—"}
          </PaymentDetailValue>
          <PaymentDetailValue label="Persisted transactions">
            {data.persistedTransactionCount}
          </PaymentDetailValue>
          <PaymentDetailValue label="Created">
            <time dateTime={data.createdAt}>
              {formatDateTime(data.createdAt)}
            </time>
          </PaymentDetailValue>
          <PaymentDetailValue label="Updated">
            <time dateTime={data.updatedAt}>
              {formatDateTime(data.updatedAt)}
            </time>
          </PaymentDetailValue>
        </dl>
        {countsDiffer ? (
          <p
            className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-200"
            role="status"
          >
            Declared and persisted transaction counts differ. Review the
            transaction list for the persisted records.
          </p>
        ) : null}
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Source file</h2>
            <FileStatusBadge status={data.file.effectiveStatus} />
          </div>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <PaymentDetailValue label="Original file name">
              {data.file.originalFileName}
            </PaymentDetailValue>
            <PaymentDetailValue label="File ID">
              {data.file.id}
            </PaymentDetailValue>
            <PaymentDetailValue label="Direction">
              {data.file.direction}
            </PaymentDetailValue>
            <PaymentDetailValue label="Stored status">
              {data.file.status}
            </PaymentDetailValue>
            <PaymentDetailValue label="Created">
              <time dateTime={data.file.createdAt}>
                {formatDateTime(data.file.createdAt)}
              </time>
            </PaymentDetailValue>
            <PaymentDetailValue label="Updated">
              <time dateTime={data.file.updatedAt}>
                {formatDateTime(data.file.updatedAt)}
              </time>
            </PaymentDetailValue>
          </dl>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              className="inline-flex h-11 items-center rounded-xl border border-slate-700 px-4 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
              to={`/file-registry/${data.file.id}`}
            >
              Open file
              <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
            <Button
              type="button"
              onClick={() => void handleDownload()}
              disabled={isDownloading}
            >
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              {isDownloading ? "Downloading..." : "Download raw"}
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">
              PAIN.001 message
            </h2>
            <MessageStatusBadge status={data.message.status} />
          </div>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <PaymentDetailValue label="Reference">
              {displayText(data.message.messageReference)}
            </PaymentDetailValue>
            <PaymentDetailValue label="Message ID">
              {data.message.id}
            </PaymentDetailValue>
            <PaymentDetailValue label="Type">
              {data.message.type}
            </PaymentDetailValue>
            <PaymentDetailValue label="Direction">
              {data.message.direction}
            </PaymentDetailValue>
            <PaymentDetailValue label="Parser profile">
              {displayText(data.message.parserProfile)}
            </PaymentDetailValue>
            <PaymentDetailValue label="Identified">
              <time dateTime={data.message.identifiedAt}>
                {formatDateTime(data.message.identifiedAt)}
              </time>
            </PaymentDetailValue>
            <PaymentDetailValue label="Updated">
              <time dateTime={data.message.updatedAt}>
                {formatDateTime(data.message.updatedAt)}
              </time>
            </PaymentDetailValue>
          </dl>
          <Link
            className="mt-5 inline-flex h-11 items-center rounded-xl border border-slate-700 px-4 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            to={`/message-hub/${data.message.id}`}
          >
            Open message
            <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-white">Bank connection</h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <PaymentDetailValue label="Display name">
            {data.bankConnection.displayName}
          </PaymentDetailValue>
          <PaymentDetailValue label="Code">
            {data.bankConnection.code}
          </PaymentDetailValue>
          <PaymentDetailValue label="Bank name">
            {data.bankConnection.bankName}
          </PaymentDetailValue>
          <PaymentDetailValue label="Bank connection ID">
            {data.bankConnection.id}
          </PaymentDetailValue>
        </dl>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-white">Transactions</h2>
        <p className="mt-2 text-sm text-slate-400">
          Creditor accounts are displayed only in the masked form supplied by
          VOR.
        </p>
        <PaymentTransactionsTable transactions={data.transactions} />
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-white">
          PAIN.002 bank responses and matching
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Reports are shown in the order returned by VOR. This view does not
          apply or retry status reports.
        </p>
        <PaymentStatusReports reports={data.statusReports} />
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="self-start">
          <h2 className="text-lg font-semibold text-white">Validation</h2>
          <PaymentValidation validationResults={data.validationResults} />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-white">Timeline</h2>
          <p className="mt-2 text-sm text-slate-400">
            Events are shown in the order returned by VOR.
          </p>
          <div className="mt-5">
            <MessageHubTimeline
              events={data.timeline.events}
              error={null}
              isLoading={false}
              isFetching={query.isFetching}
              onRetry={() => void query.refetch()}
            />
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-white">Transfer traces</h2>
        <p className="mt-2 text-sm text-slate-400">
          Outbound attempts are informational. No transfer action is available
          from Payment Monitor.
        </p>
        <PaymentTransferTraces traces={data.transferTraces} />
      </Card>
    </div>
  );
}
