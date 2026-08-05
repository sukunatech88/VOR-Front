import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useApiClient } from "../../../core/http/api-client-context";
import type { ApiError } from "../../../core/http/api-error";
import { getPaymentInstructions } from "../api/payment-monitor.api";
import { paymentMonitorQueryKeys } from "../query/payment-monitor.query-keys";
import type {
  OperationsPaymentInstructionList,
  PaymentMonitorFilters,
} from "../types/payment-monitor.types";

export function usePaymentMonitor(filters: PaymentMonitorFilters) {
  const client = useApiClient();

  return useQuery<OperationsPaymentInstructionList, ApiError>({
    queryKey: paymentMonitorQueryKeys.list(filters),
    queryFn: ({ signal }) => getPaymentInstructions(client, filters, signal),
    placeholderData: keepPreviousData,
  });
}
