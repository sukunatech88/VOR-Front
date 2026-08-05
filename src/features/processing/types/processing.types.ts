import type { z } from "zod";

import type {
  applyStatusReportResultSchema,
  dispatchOutboundFileResultSchema,
  identifyMessageResultSchema,
  normalizeMessageResultSchema,
  parseMessageResultSchema,
  pollInboundFilesResultSchema,
  processingMessageStatusSchema,
  processingMessageTypeSchema,
  validateMessageResultSchema,
} from "../schemas/processing.schemas";

export type ProcessingMessageStatus = z.infer<
  typeof processingMessageStatusSchema
>;
export type ProcessingMessageType = z.infer<
  typeof processingMessageTypeSchema
>;
export type IdentifyMessageResult = z.infer<
  typeof identifyMessageResultSchema
>;
export type ParseMessageResult = z.infer<typeof parseMessageResultSchema>;
export type NormalizeMessageResult = z.infer<
  typeof normalizeMessageResultSchema
>;
export type ValidateMessageResult = z.infer<
  typeof validateMessageResultSchema
>;
export type ApplyStatusReportResult = z.infer<
  typeof applyStatusReportResultSchema
>;
export type DispatchOutboundFileResult = z.infer<
  typeof dispatchOutboundFileResultSchema
>;
export type PollInboundFilesResult = z.infer<
  typeof pollInboundFilesResultSchema
>;

export interface ProcessingEligibility {
  allowed: boolean;
  reason?: string;
}
