import { useQuery } from "@tanstack/react-query";

import { useApiClient } from "../../../core/http/api-client-context";
import type { ApiError } from "../../../core/http/api-error";
import { getOperationsDashboard } from "../api/dashboard.api";
import type { OperationsDashboardView } from "../types/dashboard.types";

export function useDashboardSummary() {
  const client = useApiClient();

  return useQuery<OperationsDashboardView, ApiError>({
    queryKey: ["operations", "dashboard"],
    queryFn: ({ signal }) => getOperationsDashboard(client, signal),
  });
}
