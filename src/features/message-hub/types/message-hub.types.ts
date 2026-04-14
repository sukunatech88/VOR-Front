export type MessageDirection = "INBOUND" | "OUTBOUND";

export type MessageStatus =
  | "RECEIVED"
  | "PARSED"
  | "NORMALIZED"
  | "VALIDATED"
  | "DISPATCHED"
  | "FAILED"
  | "MANUAL_REVIEW";

export interface MessageHubItem {
  messageId: string;
  fileId: string;
  messageType: string;
  direction: MessageDirection;
  bankName: string;
  organizationName: string;
  reference: string;
  status: MessageStatus;
  createdAt: string;
}