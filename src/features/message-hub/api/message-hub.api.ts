import type { ApiClient } from "../../../core/http/api-client";
import { ApiError } from "../../../core/http/api-error";
import {
  operationsMessageDetailsSchema,
  operationsMessageListSchema,
  operationsTimelineSchema,
  retryParseMessageResponseSchema,
} from "../schemas/message-hub.schemas";
import type {
  MessageHubFilters,
  OperationsMessageDetails,
  OperationsMessageList,
  OperationsTimeline,
  RetryParseMessageInput,
  RetryParseMessageResponse,
} from "../types/message-hub.types";

const messagesPath = "/api/operations/messages";
const timelinePath = "/api/operations/timeline";

export async function getOperationsMessages(
  client: ApiClient,
  filters: MessageHubFilters,
  signal?: AbortSignal,
): Promise<OperationsMessageList> {
  const response = await client.get<unknown>(messagesPath, {
    signal,
    query: {
      search: filters.search,
      status: filters.status,
      direction: filters.direction,
      messageType: filters.messageType,
      bankConnectionId: filters.bankConnectionId,
      page: filters.page,
      size: filters.size,
    },
  });
  const result = operationsMessageListSchema.safeParse(response);

  if (!result.success) {
    throw ApiError.protocol("GET", messagesPath);
  }

  return result.data;
}

export async function getOperationsMessage(
  client: ApiClient,
  messageId: string,
  signal?: AbortSignal,
): Promise<OperationsMessageDetails> {
  const path = `${messagesPath}/${messageId}`;
  const response = await client.get<unknown>(path, { signal });
  const result = operationsMessageDetailsSchema.safeParse(response);

  if (!result.success) {
    throw ApiError.protocol("GET", path);
  }

  return result.data;
}

export async function getOperationsTimeline(
  client: ApiClient,
  messageId: string,
  signal?: AbortSignal,
): Promise<OperationsTimeline> {
  const path = `${timelinePath}/${messageId}`;
  const response = await client.get<unknown>(path, { signal });
  const result = operationsTimelineSchema.safeParse(response);

  if (!result.success) {
    throw ApiError.protocol("GET", path);
  }

  return result.data;
}

export async function retryOperationsMessage(
  client: ApiClient,
  input: RetryParseMessageInput,
): Promise<RetryParseMessageResponse> {
  const path = `${messagesPath}/${input.messageId}/retry`;
  const response = await client.post<unknown>(path, {
    headers: {
      "Idempotency-Key": input.idempotencyKey,
    },
    json: {
      reason: input.reason,
    },
    retryOnUnauthorized: false,
  });
  const result = retryParseMessageResponseSchema.safeParse(response);

  if (!result.success) {
    throw ApiError.protocol("POST", path);
  }

  return result.data;
}
