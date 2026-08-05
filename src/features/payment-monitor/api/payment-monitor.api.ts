import type { ApiClient } from "../../../core/http/api-client";
import { ApiError } from "../../../core/http/api-error";
import {
  operationsPaymentInstructionDetailsSchema,
  operationsPaymentInstructionListSchema,
} from "../schemas/payment-monitor.schemas";
import type {
  OperationsPaymentInstructionDetails,
  OperationsPaymentInstructionList,
  PaymentMonitorFilters,
} from "../types/payment-monitor.types";

const paymentInstructionsPath = "/api/operations/payment-instructions";

export async function getPaymentInstructions(
  client: ApiClient,
  filters: PaymentMonitorFilters,
  signal?: AbortSignal,
): Promise<OperationsPaymentInstructionList> {
  const response = await client.get<unknown>(paymentInstructionsPath, {
    signal,
    query: {
      search: filters.search,
      status: filters.status,
      bankConnectionId: filters.bankConnectionId,
      currency: filters.currency,
      requestedExecutionDateFrom: filters.requestedExecutionDateFrom,
      requestedExecutionDateTo: filters.requestedExecutionDateTo,
      updatedFrom: filters.updatedFrom,
      updatedTo: filters.updatedTo,
      page: filters.page,
      size: filters.size,
      sort: `${filters.sortField},${filters.sortDirection}`,
    },
  });
  const result = operationsPaymentInstructionListSchema.safeParse(response);

  if (!result.success) {
    throw ApiError.protocol("GET", paymentInstructionsPath);
  }

  return result.data;
}

export async function getPaymentInstruction(
  client: ApiClient,
  paymentInstructionId: string,
  signal?: AbortSignal,
): Promise<OperationsPaymentInstructionDetails> {
  const path = `${paymentInstructionsPath}/${paymentInstructionId}`;
  const response = await client.get<unknown>(path, { signal });
  const result = operationsPaymentInstructionDetailsSchema.safeParse(response);

  if (!result.success) {
    throw ApiError.protocol("GET", path);
  }

  return result.data;
}
