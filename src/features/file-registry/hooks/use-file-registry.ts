import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useApiClient } from "../../../core/http/api-client-context";
import type { ApiError } from "../../../core/http/api-error";
import { getOperationsFiles } from "../api/file-registry.api";
import type {
  FileRegistryFilters,
  OperationsFileList,
} from "../types/file-registry.types";

export function useFileRegistry(filters: FileRegistryFilters) {
  const client = useApiClient();

  return useQuery<OperationsFileList, ApiError>({
    queryKey: [
      "operations",
      "files",
      filters.search ?? null,
      filters.status ?? null,
      filters.direction ?? null,
      filters.messageType ?? null,
      filters.bankConnectionId ?? null,
      filters.page,
      filters.size,
    ],
    queryFn: ({ signal }) => getOperationsFiles(client, filters, signal),
    placeholderData: keepPreviousData,
  });
}
