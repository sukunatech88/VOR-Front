import { useState, type FormEvent } from "react";

import {
  PaymentMonitorFilters,
  type PaymentMonitorFilterDraft,
} from "../components/payment-monitor-filters";
import { PaymentMonitorErrorState } from "../components/payment-monitor-error-state";
import { PaymentMonitorTable } from "../components/payment-monitor-table";
import { usePaymentMonitor } from "../hooks/use-payment-monitor";
import {
  paymentInstructionIdSchema,
  paymentMonitorFiltersSchema,
} from "../schemas/payment-monitor.schemas";
import type { PaymentMonitorFilters as PaymentMonitorFilterValues } from "../types/payment-monitor.types";
import { PageHeader } from "../../../shared/components/page-header";
import { Button } from "../../../shared/components/ui/button";
import { Card } from "../../../shared/components/ui/card";

const defaultFilters: PaymentMonitorFilterValues = {
  page: 0,
  size: 25,
  sortField: "updatedAt",
  sortDirection: "desc",
};

const defaultDraft: PaymentMonitorFilterDraft = {
  search: "",
  status: "",
  bankConnectionId: "",
  currency: "",
  requestedExecutionDateFrom: "",
  requestedExecutionDateTo: "",
  updatedFrom: "",
  updatedTo: "",
  size: 25,
  sortField: "updatedAt",
  sortDirection: "desc",
};

function optionalIsoDateTime(value: string) {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function hasActiveFilters(filters: PaymentMonitorFilterValues) {
  return Boolean(
    filters.search ||
    filters.status ||
    filters.bankConnectionId ||
    filters.currency ||
    filters.requestedExecutionDateFrom ||
    filters.requestedExecutionDateTo ||
    filters.updatedFrom ||
    filters.updatedTo,
  );
}

export function PaymentMonitorPage() {
  const [draft, setDraft] = useState(defaultDraft);
  const [filters, setFilters] = useState(defaultFilters);
  const [filterError, setFilterError] = useState<string | null>(null);
  const { data, error, isLoading, isFetching, refetch } =
    usePaymentMonitor(filters);

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const search = draft.search.trim();
    const bankConnectionId = draft.bankConnectionId.trim();
    const currency = draft.currency.trim().toUpperCase();
    const updatedFrom = optionalIsoDateTime(draft.updatedFrom);
    const updatedTo = optionalIsoDateTime(draft.updatedTo);

    if (search.length > 200) {
      setFilterError("Search must not exceed 200 characters.");
      return;
    }

    if (
      bankConnectionId &&
      !paymentInstructionIdSchema.safeParse(bankConnectionId).success
    ) {
      setFilterError("Bank connection ID must be a valid GUID.");
      return;
    }

    if (currency && !/^[A-Z]{3}$/.test(currency)) {
      setFilterError("Currency must contain exactly three letters.");
      return;
    }

    if (updatedFrom === null || updatedTo === null) {
      setFilterError("Updated range must contain valid date and time values.");
      return;
    }

    const result = paymentMonitorFiltersSchema.safeParse({
      search: search || undefined,
      status: draft.status || undefined,
      bankConnectionId: bankConnectionId || undefined,
      currency: currency || undefined,
      requestedExecutionDateFrom: draft.requestedExecutionDateFrom || undefined,
      requestedExecutionDateTo: draft.requestedExecutionDateTo || undefined,
      updatedFrom,
      updatedTo,
      page: 0,
      size: draft.size,
      sortField: draft.sortField,
      sortDirection: draft.sortDirection,
    });

    if (!result.success) {
      setFilterError(result.error.issues[0]?.message || "Filters are invalid.");
      return;
    }

    setFilterError(null);
    setDraft((current) => ({ ...current, currency }));
    setFilters(result.data);
  }

  function clearFilters() {
    setDraft(defaultDraft);
    setFilters(defaultFilters);
    setFilterError(null);
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Payment Monitor"
          description="Monitor payment batches, transactions and bank status responses."
        />
        <div className="mb-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <PaymentMonitorFilters
          draft={draft}
          error={filterError}
          isApplying={isFetching}
          onChange={setDraft}
          onSubmit={applyFilters}
          onClear={clearFilters}
        />
      </div>

      {isLoading && !data ? (
        <Card role="status" aria-live="polite">
          <p className="text-sm text-slate-300">
            Loading payment instructions...
          </p>
        </Card>
      ) : null}

      {error && !data ? (
        <PaymentMonitorErrorState
          error={error}
          isRetrying={isFetching}
          onRetry={() => void refetch()}
        />
      ) : null}

      {data ? (
        <>
          {error ? (
            <Card className="mb-6" role="alert" aria-live="assertive">
              <p className="text-sm text-rose-300">
                Payment instructions could not be refreshed. {error.message}
              </p>
            </Card>
          ) : null}

          {isFetching && !isLoading ? (
            <p className="mb-3 text-sm text-slate-400" role="status">
              Refreshing payment instructions...
            </p>
          ) : null}

          {data.paymentInstructions.length === 0 ? (
            <Card>
              <h2 className="text-lg font-semibold text-white">
                {hasActiveFilters(filters)
                  ? "No matching payment instructions"
                  : "No payment instructions yet"}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {hasActiveFilters(filters)
                  ? "Clear or adjust the selected filters."
                  : "Payment batches will appear here when they are available."}
              </p>
            </Card>
          ) : (
            <PaymentMonitorTable items={data.paymentInstructions} />
          )}

          <nav
            className="mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:flex-row sm:items-center"
            aria-label="Payment Monitor pagination"
          >
            <p className="text-sm text-slate-400">
              {data.page.totalElements} total payment instructions
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
                aria-label="Go to previous payment instructions page"
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
                aria-label="Go to next payment instructions page"
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
