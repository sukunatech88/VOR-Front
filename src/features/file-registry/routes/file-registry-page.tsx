import { useState } from "react";

import { Button } from "../../../shared/components/ui/button";
import { Card } from "../../../shared/components/ui/card";
import { PageHeader } from "../../../shared/components/page-header";
import { InboundPollerPanel } from "../../processing/components/inbound-poller-panel";
import { FileRegistryErrorState } from "../components/file-registry-error-state";
import { FileRegistryTable } from "../components/file-registry-table";
import { RegisterFileForm } from "../components/register-file-form";
import { useFileRegistry } from "../hooks/use-file-registry";
import { fileIdSchema } from "../schemas/file-registry.schemas";
import type {
  FileDirection,
  FileRegistryFilters,
  FileStatus,
  MessageType,
} from "../types/file-registry.types";

const fileStatuses: FileStatus[] = [
  "RECEIVED",
  "STORED",
  "CLASSIFIED",
  "PROCESSING",
  "PROCESSED",
  "DUPLICATE",
  "UNSUPPORTED",
  "FAILED",
  "MANUAL_REVIEW",
  "IDENTIFIED",
  "REJECTED",
  "DISPATCHED",
  "ACK_PENDING",
  "BANK_ACCEPTED",
  "BANK_REJECTED",
];
const directions: FileDirection[] = ["INBOUND", "OUTBOUND"];
const messageTypes: MessageType[] = [
  "PAIN_001",
  "PAIN_002",
  "CAMT_053",
  "UNSUPPORTED",
];

export function FileRegistryPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<FileStatus | "">("");
  const [direction, setDirection] = useState<FileDirection | "">("");
  const [messageType, setMessageType] = useState<MessageType | "">("");
  const [bankConnectionId, setBankConnectionId] = useState("");
  const [filterError, setFilterError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FileRegistryFilters>({
    page: 0,
    size: 25,
  });
  const { data, error, isLoading, isFetching, refetch } =
    useFileRegistry(filters);

  const handleRefresh = () => {
    void refetch();
  };

  const handleFilterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedSearch = search.trim();
    const normalizedBankConnectionId = bankConnectionId.trim();

    if (
      normalizedBankConnectionId &&
      !fileIdSchema.safeParse(normalizedBankConnectionId).success
    ) {
      setFilterError("Bank connection ID must be a valid GUID.");
      return;
    }

    setFilterError(null);
    setFilters((current) => ({
      search: normalizedSearch || undefined,
      status: status || undefined,
      direction: direction || undefined,
      messageType: messageType || undefined,
      bankConnectionId: normalizedBankConnectionId || undefined,
      page: 0,
      size: current.size,
    }));
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setDirection("");
    setMessageType("");
    setBankConnectionId("");
    setFilterError(null);
    setFilters((current) => ({ page: 0, size: current.size }));
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <PageHeader
          title="File Registry"
          description="Operational files registered and stored by the VOR backend."
        />
        {data ? (
          <Button
            type="button"
            variant="secondary"
            onClick={handleRefresh}
            disabled={isFetching}
          >
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
        ) : null}
      </div>

      <Card className="mb-6">
        <form onSubmit={handleFilterSubmit}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-slate-300"
                htmlFor="file-search"
              >
                Search
              </label>
              <input
                id="file-search"
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none focus:border-indigo-500"
                placeholder="File name, checksum, type or file ID"
                value={search}
                maxLength={200}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-slate-300"
                htmlFor="file-status"
              >
                Status
              </label>
              <select
                id="file-status"
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none focus:border-indigo-500"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as FileStatus | "")
                }
              >
                <option value="">All statuses</option>
                {fileStatuses.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-slate-300"
                htmlFor="file-direction"
              >
                Direction
              </label>
              <select
                id="file-direction"
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none focus:border-indigo-500"
                value={direction}
                onChange={(event) =>
                  setDirection(event.target.value as FileDirection | "")
                }
              >
                <option value="">All directions</option>
                {directions.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-slate-300"
                htmlFor="file-message-type"
              >
                Message type
              </label>
              <select
                id="file-message-type"
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none focus:border-indigo-500"
                value={messageType}
                onChange={(event) =>
                  setMessageType(event.target.value as MessageType | "")
                }
              >
                <option value="">All message types</option>
                {messageTypes.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-slate-300"
                htmlFor="bank-connection-id"
              >
                Bank connection ID
              </label>
              <input
                id="bank-connection-id"
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none focus:border-indigo-500"
                placeholder="GUID"
                value={bankConnectionId}
                onChange={(event) => setBankConnectionId(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-slate-300"
                htmlFor="file-page-size"
              >
                Page size
              </label>
              <select
                id="file-page-size"
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none focus:border-indigo-500"
                value={filters.size}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    page: 0,
                    size: Number(event.target.value),
                  }))
                }
              >
                {[10, 25, 50, 100].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filterError ? (
            <p className="mt-4 text-sm text-rose-300" role="alert">
              {filterError}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-3">
            <Button type="submit">Apply filters</Button>
            <Button type="button" variant="ghost" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        </form>
      </Card>

      <div className="mb-6">
        <RegisterFileForm />
      </div>

      <div className="mb-6">
        <InboundPollerPanel />
      </div>

      {isLoading && !data ? (
        <Card role="status" aria-live="polite">
          <p className="text-sm text-slate-300">Loading file registry...</p>
        </Card>
      ) : null}

      {error && !data ? (
        <FileRegistryErrorState
          error={error}
          isRetrying={isFetching}
          onRetry={handleRefresh}
        />
      ) : null}

      {data ? (
        <>
          {error ? (
            <Card className="mb-6" role="alert" aria-live="assertive">
              <p className="text-sm text-rose-300">
                The file list could not be refreshed. {error.message}
              </p>
            </Card>
          ) : null}

          {data.files.length === 0 ? (
            <Card>
              <p className="text-sm text-slate-400">
                No files match the selected filters.
              </p>
            </Card>
          ) : (
            <FileRegistryTable items={data.files} />
          )}

          <nav
            className="mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:flex-row sm:items-center"
            aria-label="File Registry pagination"
          >
            <p className="text-sm text-slate-400">
              {data.page.totalElements} total files
              {data.page.totalPages > 0
                ? ` · Page ${data.page.number + 1} of ${data.page.totalPages}`
                : ""}
            </p>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  setFilters((current) => ({
                    ...current,
                    page: Math.max(0, current.page - 1),
                  }))
                }
                disabled={data.page.first || isFetching}
                aria-label="Go to previous page"
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  setFilters((current) => ({
                    ...current,
                    page: current.page + 1,
                  }))
                }
                disabled={data.page.last || isFetching}
                aria-label="Go to next page"
              >
                Next
              </Button>
            </div>
          </nav>
        </>
      ) : null}
    </div>
  );
}
