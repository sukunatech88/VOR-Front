import { useQuery } from "@tanstack/react-query";

import { useApiClient } from "../../../core/http/api-client-context";
import type { ApiError } from "../../../core/http/api-error";
import {
  getOperationsMessage,
  getOperationsTimeline,
} from "../api/message-hub.api";
import type {
  OperationsMessageDetails,
  OperationsTimeline,
} from "../types/message-hub.types";

export function useMessageHubDetail(messageId: string, enabled = true) {
  const client = useApiClient();

  return useQuery<OperationsMessageDetails, ApiError>({
    queryKey: ["operations", "messages", "detail", messageId],
    queryFn: ({ signal }) =>
      getOperationsMessage(client, messageId, signal),
    enabled: enabled && Boolean(messageId),
    retry: false,
  });
}

export function useMessageHubTimeline(messageId: string, enabled = true) {
  const client = useApiClient();

  return useQuery<OperationsTimeline, ApiError>({
    queryKey: ["operations", "timeline", messageId],
    queryFn: ({ signal }) =>
      getOperationsTimeline(client, messageId, signal),
    enabled: enabled && Boolean(messageId),
    retry: false,
  });
}
