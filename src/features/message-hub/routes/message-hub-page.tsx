import { useState, type FormEvent } from "react";

import { MessageHubErrorState } from "../components/message-hub-error-state";
import { MessageHubTable } from "../components/message-hub-table";
import { useMessageHub } from "../hooks/use-message-hub";
import {
  fileDirectionSchema,
  messageIdSchema,
  messageStatusSchema,
  messageTypeSchema,
} from "../schemas/message-hub.schemas";
import type { MessageHubFilters } from "../types/message-hub.types";
import { PageHeader } from "../../../shared/components/page-header";
import { Button } from "../../../shared/components/ui/button";
import { Card } from "../../../shared/components/ui/card";

const statusOptions = messageStatusSchema.options;
const directionOptions = fileDirectionSchema.options;
const messageTypeOptions = messageTypeSchema.options;

const initialFilters: MessageHubFilters = {
  page: 0,
  size: 25,
};

export function MessageHubPage() {
  const [searchDraft, setSearchDraft] = useState("");
  const [statusDraft, setStatusDraft] = useState("");
  const [directionDraft, setDirectionDraft] = useState("");
  const [messageTypeDraft, setMessageTypeDraft] = useState("");
  const [bankConnectionDraft, setBankConnectionDraft] = useState("");
  const [filterError, setFilterError] = useState("");
  const [filters, setFilters] =
    useState<MessageHubFilters>(initialFilters);
  const query = useMessageHub(filters);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const search = searchDraft.trim();
    const bankConnectionId = bankConnectionDraft.trim();

    if (search.length > 200) {
      setFilterError("Search must not exceed 200 characters.");
      return;
    }

    if (
      bankConnectionId &&
      !messageIdSchema.safeParse(bankConnectionId).success
    ) {
      setFilterError("Bank connection ID must be a valid GUID.");
      return;
    }

    setFilterError("");
    setFilters((current) => ({
      search: search || undefined,
      status:
        messageStatusSchema.safeParse(statusDraft).data || undefined,
      direction:
        fileDirectionSchema.safeParse(directionDraft).data || undefined,
      messageType:
        messageTypeSchema.safeParse(messageTypeDraft).data || undefined,
      bankConnectionId: bankConnectionId || undefined,
      page: 0,
      size: current.size,
    }));
  }

  function clearFilters() {
    setSearchDraft("");
    setStatusDraft("");
    setDirectionDraft("");
    setMessageTypeDraft("");
    setBankConnectionDraft("");
    setFilterError("");
    setFilters((current) => ({ page: 0, size: current.size }));
  }

  const page = query.data?.page;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Message Hub"
          description="Operational traceability for messages processed by VOR."
        />
        <div className="mb-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => query.refetch()}
            disabled={query.isFetching}
          >
            {query.isFetching ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label
                className="text-sm font-medium text-slate-300"
                htmlFor="message-search"
              >
                Search
              </label>
              <input
                id="message-search"
                className="mt-2 h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400/40"
                placeholder="Reference, file name, checksum, message or file ID"
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                maxLength={200}
              />
            </div>
            <div>
              <label
                className="text-sm font-medium text-slate-300"
                htmlFor="message-status"
              >
                Message status
              </label>
              <select
                id="message-status"
                className="mt-2 h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400/40"
                value={statusDraft}
                onChange={(event) => setStatusDraft(event.target.value)}
              >
                <option value="">All statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="text-sm font-medium text-slate-300"
                htmlFor="message-direction"
              >
                Direction
              </label>
              <select
                id="message-direction"
                className="mt-2 h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400/40"
                value={directionDraft}
                onChange={(event) => setDirectionDraft(event.target.value)}
              >
                <option value="">All directions</option>
                {directionOptions.map((direction) => (
                  <option key={direction} value={direction}>
                    {direction}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="text-sm font-medium text-slate-300"
                htmlFor="message-type"
              >
                Message type
              </label>
              <select
                id="message-type"
                className="mt-2 h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400/40"
                value={messageTypeDraft}
                onChange={(event) => setMessageTypeDraft(event.target.value)}
              >
                <option value="">All message types</option>
                {messageTypeOptions.map((messageType) => (
                  <option key={messageType} value={messageType}>
                    {messageType}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="text-sm font-medium text-slate-300"
                htmlFor="bank-connection-id"
              >
                Bank connection ID
              </label>
              <input
                id="bank-connection-id"
                className="mt-2 h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400/40"
                value={bankConnectionDraft}
                onChange={(event) =>
                  setBankConnectionDraft(event.target.value)
                }
                inputMode="text"
              />
            </div>
            <div>
              <label
                className="text-sm font-medium text-slate-300"
                htmlFor="message-page-size"
              >
                Page size
              </label>
              <select
                id="message-page-size"
                className="mt-2 h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400/40"
                value={filters.size}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    page: 0,
                    size: Number(event.target.value),
                  }))
                }
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button type="submit">Apply filters</Button>
            <Button type="button" variant="ghost" onClick={clearFilters}>
              Clear
            </Button>
          </div>
          {filterError ? (
            <p role="alert" className="mt-3 text-sm text-rose-300">
              {filterError}
            </p>
          ) : null}
        </form>
      </Card>

      {query.isPending ? (
        <Card role="status">
          <p className="text-sm text-slate-300">Loading messages...</p>
        </Card>
      ) : null}

      {query.error ? (
        <MessageHubErrorState
          error={query.error}
          isRetrying={query.isFetching}
          onRetry={() => query.refetch()}
        />
      ) : null}

      {query.data && query.data.messages.length === 0 ? (
        <Card>
          <h2 className="text-lg font-semibold text-white">
            No messages found
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            No operational messages match the selected filters.
          </p>
        </Card>
      ) : null}

      {query.data && query.data.messages.length > 0 ? (
        <>
          <div
            className="mb-3 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400"
            aria-live="polite"
          >
            <p>{page?.totalElements.toLocaleString()} total messages</p>
            <p>
              Page {(page?.number ?? 0) + 1} of {page?.totalPages || 1}
            </p>
          </div>
          <MessageHubTable items={query.data.messages} />
          <div className="mt-4 flex flex-wrap justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              disabled={page?.first || query.isFetching}
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  page: Math.max(0, current.page - 1),
                }))
              }
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={page?.last || query.isFetching}
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  page: current.page + 1,
                }))
              }
            >
              Next
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
}
