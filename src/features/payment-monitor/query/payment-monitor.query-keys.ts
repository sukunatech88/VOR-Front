import type { PaymentMonitorFilters } from "../types/payment-monitor.types";

export const paymentMonitorQueryKeys = {
  all: ["operations", "payment-instructions"] as const,
  list: (filters: PaymentMonitorFilters) =>
    [
      ...paymentMonitorQueryKeys.all,
      "list",
      filters.search ?? null,
      filters.status ?? null,
      filters.bankConnectionId ?? null,
      filters.currency ?? null,
      filters.requestedExecutionDateFrom ?? null,
      filters.requestedExecutionDateTo ?? null,
      filters.updatedFrom ?? null,
      filters.updatedTo ?? null,
      filters.page,
      filters.size,
      filters.sortField,
      filters.sortDirection,
    ] as const,
  detail: (paymentInstructionId: string) =>
    [...paymentMonitorQueryKeys.all, "detail", paymentInstructionId] as const,
};
