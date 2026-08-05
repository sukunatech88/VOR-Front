import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "../../../core/http/api-client-context";
import type { ApiError } from "../../../core/http/api-error";
import { retryOperationsMessage } from "../api/message-hub.api";
import type {
  RetryParseMessageInput,
  RetryParseMessageResponse,
} from "../types/message-hub.types";

export function useRetryMessage() {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation<
    RetryParseMessageResponse,
    ApiError,
    RetryParseMessageInput
  >({
    mutationFn: (input) => retryOperationsMessage(client, input),
    retry: false,
    onSuccess: async (_result, input) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["operations", "messages"],
        }),
        queryClient.invalidateQueries({
          queryKey: [
            "operations",
            "messages",
            "detail",
            input.messageId,
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: ["operations", "timeline", input.messageId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["operations", "dashboard"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["operations", "files"],
        }),
      ]);
    },
  });
}
