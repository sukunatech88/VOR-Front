import type { MessageDirection, MessageStatus } from "./message-hub.types";

export interface MessageHubTimelineEvent {
  id: string;
  type: string;
  status: MessageStatus | "INFO";
  timestamp: string;
  description: string;
}

export interface MessageHubDetail {
  messageId: string;
  fileId: string;
  messageType: string;
  direction: MessageDirection;
  bankName: string;
  organizationName: string;
  reference: string;
  status: MessageStatus;
  createdAt: string;
  canonicalStatus: string;
  sourceSystem: string;
  payloadPreview: string;
  notes?: string;
  timeline: MessageHubTimelineEvent[];
}