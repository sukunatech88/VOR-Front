import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "../../../core/http/api-client-context";
import type { ApiError } from "../../../core/http/api-error";
import {
  applyStatusReport,
  normalizeMessage,
  parseMessage,
  validateMessage,
} from "../api/processing.api";
import type {
  ApplyStatusReportResult,
  NormalizeMessageResult,
  ParseMessageResult,
  ValidateMessageResult,
} from "../types/processing.types";
import { invalidateProcessingQueries } from "./processing-invalidations";

function useMessageMutation<T>(
  messageId: string,
  fileId: string | undefined,
  mutationFn: () => Promise<T>,
  allTimelines = false,
) {
  const queryClient = useQueryClient();

  return useMutation<T, ApiError>({
    mutationFn,
    retry: false,
    onSuccess: () =>
      invalidateProcessingQueries(
        queryClient,
        { fileId, messageId },
        { allTimelines },
      ),
  });
}

export function useParseMessage(messageId: string, fileId?: string) {
  const client = useApiClient();
  return useMessageMutation<ParseMessageResult>(
    messageId,
    fileId,
    () => parseMessage(client, messageId),
  );
}

export function useNormalizeMessage(messageId: string, fileId?: string) {
  const client = useApiClient();
  return useMessageMutation<NormalizeMessageResult>(
    messageId,
    fileId,
    () => normalizeMessage(client, messageId),
  );
}

export function useValidateMessage(messageId: string, fileId?: string) {
  const client = useApiClient();
  return useMessageMutation<ValidateMessageResult>(
    messageId,
    fileId,
    () => validateMessage(client, messageId),
  );
}

export function useApplyStatusReport(messageId: string, fileId?: string) {
  const client = useApiClient();
  return useMessageMutation<ApplyStatusReportResult>(
    messageId,
    fileId,
    () => applyStatusReport(client, messageId),
    true,
  );
}
