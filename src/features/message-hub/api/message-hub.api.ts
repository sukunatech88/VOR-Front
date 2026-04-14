import { z } from "zod";

import { messageHubMock } from "../mocks/message-hub.mock";
import { messageHubDetailMock } from "../mocks/message-hub-detail.mock";
import type { MessageHubItem } from "../types/message-hub.types";
import type { MessageHubDetail } from "../types/message-hub-detail.types";

const messageHubItemSchema = z.object({
  messageId: z.string(),
  fileId: z.string(),
  messageType: z.string(),
  direction: z.enum(["INBOUND", "OUTBOUND"]),
  bankName: z.string(),
  organizationName: z.string(),
  reference: z.string(),
  status: z.enum([
    "RECEIVED",
    "PARSED",
    "NORMALIZED",
    "VALIDATED",
    "DISPATCHED",
    "FAILED",
    "MANUAL_REVIEW",
  ]),
  createdAt: z.string(),
});

const timelineEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  status: z.enum([
    "RECEIVED",
    "PARSED",
    "NORMALIZED",
    "VALIDATED",
    "DISPATCHED",
    "FAILED",
    "MANUAL_REVIEW",
    "INFO",
  ]),
  timestamp: z.string(),
  description: z.string(),
});

const messageHubDetailSchema = z.object({
  messageId: z.string(),
  fileId: z.string(),
  messageType: z.string(),
  direction: z.enum(["INBOUND", "OUTBOUND"]),
  bankName: z.string(),
  organizationName: z.string(),
  reference: z.string(),
  status: z.enum([
    "RECEIVED",
    "PARSED",
    "NORMALIZED",
    "VALIDATED",
    "DISPATCHED",
    "FAILED",
    "MANUAL_REVIEW",
  ]),
  createdAt: z.string(),
  canonicalStatus: z.string(),
  sourceSystem: z.string(),
  payloadPreview: z.string(),
  notes: z.string().optional(),
  timeline: z.array(timelineEventSchema),
});

const messageHubListSchema = z.array(messageHubItemSchema);

export interface MessageHubFilters {
  search?: string;
  status?: string;
}

export async function getMessageHub(
  filters?: MessageHubFilters,
): Promise<MessageHubItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let items = [...messageHubMock];

  if (filters?.search) {
    const term = filters.search.toLowerCase();
    items = items.filter((item) =>
      [
        item.messageId,
        item.fileId,
        item.reference,
        item.bankName,
        item.organizationName,
        item.messageType,
      ].some((value) => value.toLowerCase().includes(term)),
    );
  }

  if (filters?.status && filters.status !== "ALL") {
    items = items.filter((item) => item.status === filters.status);
  }

  return messageHubListSchema.parse(items);
}

export async function getMessageHubById(
  messageId: string,
): Promise<MessageHubDetail> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  const item = messageHubDetailMock.find((entry) => entry.messageId === messageId);

  if (!item) {
    throw new Error("Message not found");
  }

  return messageHubDetailSchema.parse(item);
}