import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "../../../core/http/api-client-context";
import type { ApiError } from "../../../core/http/api-error";
import { runInboundPoller } from "../api/processing.api";
import type { PollInboundFilesResult } from "../types/processing.types";

export function useRunInboundPoller() {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation<PollInboundFilesResult, ApiError>({
    mutationFn: () => runInboundPoller(client),
    retry: false,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["operations", "files"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["operations", "messages"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["operations", "dashboard"],
        }),
      ]);
    },
  });
}
