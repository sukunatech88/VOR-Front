import type { ApiClient } from "../../../core/http/api-client";
import { ApiError } from "../../../core/http/api-error";
import { operationsDashboardSchema } from "../schemas/dashboard.schemas";
import type { OperationsDashboardView } from "../types/dashboard.types";

const dashboardPath = "/api/operations/dashboard";

export async function getOperationsDashboard(
  client: ApiClient,
  signal?: AbortSignal,
): Promise<OperationsDashboardView> {
  const response = await client.get<unknown>(dashboardPath, { signal });
  const result = operationsDashboardSchema.safeParse(response);

  if (!result.success) {
    throw ApiError.protocol("GET", dashboardPath);
  }

  return result.data;
}
