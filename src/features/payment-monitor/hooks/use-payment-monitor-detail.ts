import { useQuery } from "@tanstack/react-query";

import { useApiClient } from "../../../core/http/api-client-context";
import type { ApiError } from "../../../core/http/api-error";
import { getPaymentInstruction } from "../api/payment-monitor.api";
import { paymentMonitorQueryKeys } from "../query/payment-monitor.query-keys";
import { paymentInstructionIdSchema } from "../schemas/payment-monitor.schemas";
import type { OperationsPaymentInstructionDetails } from "../types/payment-monitor.types";

export function usePaymentMonitorDetail(paymentInstructionId: string) {
  const client = useApiClient();
  const isValidId =
    paymentInstructionIdSchema.safeParse(paymentInstructionId).success;

  return useQuery<OperationsPaymentInstructionDetails, ApiError>({
    queryKey: paymentMonitorQueryKeys.detail(paymentInstructionId),
    queryFn: ({ signal }) =>
      getPaymentInstruction(client, paymentInstructionId, signal),
    enabled: isValidId,
  });
}
