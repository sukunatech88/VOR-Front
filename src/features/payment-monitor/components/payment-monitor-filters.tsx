import type { FormEvent } from "react";

import { Button } from "../../../shared/components/ui/button";
import { Card } from "../../../shared/components/ui/card";
import type {
  PaymentInstructionStatus,
  PaymentMonitorSortDirection,
  PaymentMonitorSortField,
} from "../types/payment-monitor.types";

export interface PaymentMonitorFilterDraft {
  search: string;
  status: PaymentInstructionStatus | "";
  bankConnectionId: string;
  currency: string;
  requestedExecutionDateFrom: string;
  requestedExecutionDateTo: string;
  updatedFrom: string;
  updatedTo: string;
  size: number;
  sortField: PaymentMonitorSortField;
  sortDirection: PaymentMonitorSortDirection;
}

const paymentMonitorStatuses: PaymentInstructionStatus[] = [
  "CREATED",
  "ACCEPTED",
  "REJECTED",
  "PENDING",
  "PARTIALLY_ACCEPTED",
  "MANUAL_REVIEW",
  "UNKNOWN",
  "DISPATCHED",
  "ACK_PENDING",
  "BANK_ACCEPTED",
  "BANK_REJECTED",
];

const sortFields: Array<{
  value: PaymentMonitorSortField;
  label: string;
}> = [
  { value: "updatedAt", label: "Updated" },
  { value: "createdAt", label: "Created" },
  { value: "requestedExecutionDate", label: "Requested execution date" },
  { value: "status", label: "Status" },
  { value: "controlSum", label: "Control sum" },
];

const controlClassName =
  "h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30";

interface PaymentMonitorFiltersProps {
  draft: PaymentMonitorFilterDraft;
  error: string | null;
  isApplying: boolean;
  onChange: (draft: PaymentMonitorFilterDraft) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
}

export function PaymentMonitorFilters({
  draft,
  error,
  isApplying,
  onChange,
  onSubmit,
  onClear,
}: PaymentMonitorFiltersProps) {
  return (
    <Card>
      <form onSubmit={onSubmit} noValidate>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2 md:col-span-2 xl:col-span-4">
            <label
              className="block text-sm font-medium text-slate-300"
              htmlFor="payment-search"
            >
              Search
            </label>
            <input
              id="payment-search"
              className={controlClassName}
              maxLength={200}
              placeholder="Payment reference, message, file, instruction or end-to-end ID"
              value={draft.search}
              onChange={(event) =>
                onChange({ ...draft, search: event.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-slate-300"
              htmlFor="payment-status"
            >
              Status
            </label>
            <select
              id="payment-status"
              className={controlClassName}
              value={draft.status}
              onChange={(event) =>
                onChange({
                  ...draft,
                  status: event.target.value as PaymentInstructionStatus | "",
                })
              }
            >
              <option value="">All statuses</option>
              {paymentMonitorStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-slate-300"
              htmlFor="payment-bank-connection"
            >
              Bank connection ID
            </label>
            <input
              id="payment-bank-connection"
              className={controlClassName}
              placeholder="GUID"
              value={draft.bankConnectionId}
              onChange={(event) =>
                onChange({ ...draft, bankConnectionId: event.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-slate-300"
              htmlFor="payment-currency"
            >
              Currency
            </label>
            <input
              id="payment-currency"
              className={controlClassName}
              maxLength={3}
              placeholder="EUR"
              value={draft.currency}
              onChange={(event) =>
                onChange({
                  ...draft,
                  currency: event.target.value.toUpperCase(),
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-slate-300"
              htmlFor="payment-page-size"
            >
              Page size
            </label>
            <select
              id="payment-page-size"
              className={controlClassName}
              value={draft.size}
              onChange={(event) =>
                onChange({ ...draft, size: Number(event.target.value) })
              }
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-slate-300"
              htmlFor="payment-execution-from"
            >
              Execution date from
            </label>
            <input
              id="payment-execution-from"
              className={controlClassName}
              type="date"
              value={draft.requestedExecutionDateFrom}
              onChange={(event) =>
                onChange({
                  ...draft,
                  requestedExecutionDateFrom: event.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-slate-300"
              htmlFor="payment-execution-to"
            >
              Execution date to
            </label>
            <input
              id="payment-execution-to"
              className={controlClassName}
              type="date"
              value={draft.requestedExecutionDateTo}
              onChange={(event) =>
                onChange({
                  ...draft,
                  requestedExecutionDateTo: event.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-slate-300"
              htmlFor="payment-updated-from"
            >
              Updated from
            </label>
            <input
              id="payment-updated-from"
              className={controlClassName}
              type="datetime-local"
              value={draft.updatedFrom}
              onChange={(event) =>
                onChange({ ...draft, updatedFrom: event.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-slate-300"
              htmlFor="payment-updated-to"
            >
              Updated to
            </label>
            <input
              id="payment-updated-to"
              className={controlClassName}
              type="datetime-local"
              value={draft.updatedTo}
              onChange={(event) =>
                onChange({ ...draft, updatedTo: event.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-slate-300"
              htmlFor="payment-sort-field"
            >
              Sort field
            </label>
            <select
              id="payment-sort-field"
              className={controlClassName}
              value={draft.sortField}
              onChange={(event) =>
                onChange({
                  ...draft,
                  sortField: event.target.value as PaymentMonitorSortField,
                })
              }
            >
              {sortFields.map((field) => (
                <option key={field.value} value={field.value}>
                  {field.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-slate-300"
              htmlFor="payment-sort-direction"
            >
              Sort direction
            </label>
            <select
              id="payment-sort-direction"
              className={controlClassName}
              value={draft.sortDirection}
              onChange={(event) =>
                onChange({
                  ...draft,
                  sortDirection: event.target
                    .value as PaymentMonitorSortDirection,
                })
              }
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {error ? (
          <p className="mt-4 text-sm text-rose-300" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="submit" disabled={isApplying}>
            {isApplying ? "Applying..." : "Apply filters"}
          </Button>
          <Button type="button" variant="ghost" onClick={onClear}>
            Clear filters
          </Button>
        </div>
      </form>
    </Card>
  );
}
