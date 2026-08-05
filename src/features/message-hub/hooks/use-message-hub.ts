import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useApiClient } from "../../../core/http/api-client-context";
import type { ApiError } from "../../../core/http/api-error";
import { getOperationsMessages } from "../api/message-hub.api";
import type {
  MessageHubFilters,
  OperationsMessageList,
} from "../types/message-hub.types";

export function useMessageHub(filters: MessageHubFilters) {
  const client = useApiClient();

  return useQuery<OperationsMessageList, ApiError>({
    queryKey: [
      "operations",
      "messages",
      filters.search ?? null,
      filters.status ?? null,
      filters.direction ?? null,
      filters.messageType ?? null,
      filters.bankConnectionId ?? null,
      filters.page,
      filters.size,
    ],
    queryFn: ({ signal }) => getOperationsMessages(client, filters, signal),
    placeholderData: keepPreviousData,
    retry: false,
  });
}
