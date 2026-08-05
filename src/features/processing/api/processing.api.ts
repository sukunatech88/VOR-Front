import type { ApiClient } from "../../../core/http/api-client";
import { ApiError } from "../../../core/http/api-error";
import {
  applyStatusReportResultSchema,
  dispatchOutboundFileResultSchema,
  identifyMessageResultSchema,
  normalizeMessageResultSchema,
  parseMessageResultSchema,
  pollInboundFilesResultSchema,
  validateMessageResultSchema,
} from "../schemas/processing.schemas";
import type {
  ApplyStatusReportResult,
  DispatchOutboundFileResult,
  IdentifyMessageResult,
  NormalizeMessageResult,
  ParseMessageResult,
  PollInboundFilesResult,
  ValidateMessageResult,
} from "../types/processing.types";

async function postAndParse<T>(
  client: ApiClient,
  path: string,
  schema: { safeParse(value: unknown): { success: true; data: T } | { success: false } },
): Promise<T> {
  const response = await client.post<unknown>(path, {
    retryOnUnauthorized: false,
  });
  const result = schema.safeParse(response);

  if (!result.success) {
    throw ApiError.protocol("POST", path);
  }

  return result.data;
}

export function identifyMessage(
  client: ApiClient,
  fileId: string,
): Promise<IdentifyMessageResult> {
  return postAndParse(
    client,
    `/api/files/${fileId}/identify-message`,
    identifyMessageResultSchema,
  );
}

export function parseMessage(
  client: ApiClient,
  messageId: string,
): Promise<ParseMessageResult> {
  return postAndParse(
    client,
    `/api/messages/${messageId}/parse`,
    parseMessageResultSchema,
  );
}

export function normalizeMessage(
  client: ApiClient,
  messageId: string,
): Promise<NormalizeMessageResult> {
  return postAndParse(
    client,
    `/api/messages/${messageId}/normalize`,
    normalizeMessageResultSchema,
  );
}

export function validateMessage(
  client: ApiClient,
  messageId: string,
): Promise<ValidateMessageResult> {
  return postAndParse(
    client,
    `/api/messages/${messageId}/validate`,
    validateMessageResultSchema,
  );
}

export function applyStatusReport(
  client: ApiClient,
  messageId: string,
): Promise<ApplyStatusReportResult> {
  return postAndParse(
    client,
    `/api/messages/${messageId}/apply-status-report`,
    applyStatusReportResultSchema,
  );
}

export function dispatchOutboundFile(
  client: ApiClient,
  fileId: string,
): Promise<DispatchOutboundFileResult> {
  return postAndParse(
    client,
    `/api/files/${fileId}/dispatch-outbound-file`,
    dispatchOutboundFileResultSchema,
  );
}

export function runInboundPoller(
  client: ApiClient,
): Promise<PollInboundFilesResult> {
  return postAndParse(
    client,
    "/api/inbound-poller/run",
    pollInboundFilesResultSchema,
  );
}
