import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "../../../core/http/api-client-context";
import type { ApiError } from "../../../core/http/api-error";
import {
  dispatchOutboundFile,
  identifyMessage,
} from "../api/processing.api";
import type {
  DispatchOutboundFileResult,
  IdentifyMessageResult,
} from "../types/processing.types";
import { invalidateProcessingQueries } from "./processing-invalidations";

export function useIdentifyMessage(fileId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation<IdentifyMessageResult, ApiError>({
    mutationFn: () => identifyMessage(client, fileId),
    retry: false,
    onSuccess: (result) =>
      invalidateProcessingQueries(queryClient, {
        fileId: result.fileId,
        messageId: result.messageId,
      }),
  });
}

export function useDispatchOutboundFile(
  fileId: string,
  associatedMessageId?: string,
) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation<DispatchOutboundFileResult, ApiError>({
    mutationFn: () => dispatchOutboundFile(client, fileId),
    retry: false,
    onSuccess: (result) =>
      invalidateProcessingQueries(queryClient, {
        fileId: result.fileId,
        messageId: result.messageId || associatedMessageId,
      }),
  });
}
