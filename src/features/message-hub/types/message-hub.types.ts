import type { z } from "zod";

import type {
  operationsMessageDetailsSchema,
  operationsMessageListSchema,
  operationsTimelineSchema,
  retryParseMessageResponseSchema,
} from "../schemas/message-hub.schemas";

export type FileDirection = "INBOUND" | "OUTBOUND";

export type FileStatus =
  | "RECEIVED"
  | "STORED"
  | "CLASSIFIED"
  | "PROCESSING"
  | "PROCESSED"
  | "DUPLICATE"
  | "UNSUPPORTED"
  | "FAILED"
  | "MANUAL_REVIEW"
  | "IDENTIFIED"
  | "REJECTED"
  | "DISPATCHED"
  | "ACK_PENDING"
  | "BANK_ACCEPTED"
  | "BANK_REJECTED";

export type MessageType =
  | "PAIN_001"
  | "PAIN_002"
  | "CAMT_053"
  | "UNSUPPORTED";

export type MessageStatus =
  | "IDENTIFIED"
  | "PARSED"
  | "REJECTED"
  | "FAILED"
  | "RECEIVED"
  | "NORMALIZED"
  | "VALIDATED"
  | "UNSUPPORTED"
  | "DISPATCHED"
  | "ACK_PENDING"
  | "BANK_ACCEPTED"
  | "BANK_REJECTED";

export type OperationsMessageList = z.infer<
  typeof operationsMessageListSchema
>;
export type OperationsMessageSummaryView =
  OperationsMessageList["messages"][number];
export type OperationsMessageDetails = z.infer<
  typeof operationsMessageDetailsSchema
>;
export type OperationsTimeline = z.infer<typeof operationsTimelineSchema>;
export type OperationsTimelineEventView =
  OperationsTimeline["events"][number];
export type RetryParseMessageResponse = z.infer<
  typeof retryParseMessageResponseSchema
>;

export interface MessageHubFilters {
  search?: string;
  status?: MessageStatus;
  direction?: FileDirection;
  messageType?: MessageType;
  bankConnectionId?: string;
  page: number;
  size: number;
}

export interface RetryParseMessageInput {
  messageId: string;
  reason: string;
  idempotencyKey: string;
}
