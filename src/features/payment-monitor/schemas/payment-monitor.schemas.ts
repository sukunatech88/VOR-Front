import { z } from "zod";

export const paymentInstructionIdSchema = z.guid();

const dateSchema = z.iso.date();
const dateTimeSchema = z.iso.datetime({ offset: true });
const integerSchema = z.number().int();
const nonNegativeIntegerSchema = integerSchema.nonnegative();
const nullableStringSchema = z.string().nullable();
const nullableGuidSchema = paymentInstructionIdSchema.nullable();
const nullableDateSchema = dateSchema.nullable();
const nullableDateTimeSchema = dateTimeSchema.nullable();
const nullableAmountSchema = z.number().nullable();

export const paymentInstructionStatusSchema = z.enum([
  "CREATED",
  "ACCEPTED",
  "REJECTED",
  "PENDING",
  "PARTIALLY_ACCEPTED",
  "MANUAL_REVIEW",
  "UNKNOWN",
  "DISPATCHED",
  "ACK_PENDING",
  "BANK_ACCEPTED",
  "BANK_REJECTED",
]);

export const paymentTransactionStatusSchema = z.enum([
  "CREATED",
  "ACCEPTED",
  "REJECTED",
  "PENDING",
  "MANUAL_REVIEW",
  "UNKNOWN",
  "DISPATCHED",
  "ACK_PENDING",
  "BANK_ACCEPTED",
  "BANK_REJECTED",
]);

export const paymentApplicationStatusSchema = z.enum([
  "APPLIED",
  "PARTIALLY_APPLIED",
  "NO_MATCH",
  "MANUAL_REVIEW",
]);

export const paymentApplicationItemStatusSchema = z.enum([
  "MATCHED",
  "UNMATCHED",
  "AMBIGUOUS",
]);

export const paymentMonitorSortFieldSchema = z.enum([
  "updatedAt",
  "createdAt",
  "requestedExecutionDate",
  "status",
  "controlSum",
]);

export const paymentMonitorSortDirectionSchema = z.enum(["asc", "desc"]);

const currencySchema = z.string().regex(/^[A-Z]{3}$/);
const fileDirectionSchema = z.enum(["INBOUND", "OUTBOUND"]);
const fileStatusSchema = z.enum([
  "RECEIVED",
  "STORED",
  "CLASSIFIED",
  "PROCESSING",
  "PROCESSED",
  "DUPLICATE",
  "UNSUPPORTED",
  "FAILED",
  "MANUAL_REVIEW",
  "IDENTIFIED",
  "REJECTED",
  "DISPATCHED",
  "ACK_PENDING",
  "BANK_ACCEPTED",
  "BANK_REJECTED",
]);
const messageTypeSchema = z.enum([
  "PAIN_001",
  "PAIN_002",
  "CAMT_053",
  "UNSUPPORTED",
]);
const messageStatusSchema = z.enum([
  "IDENTIFIED",
  "PARSED",
  "REJECTED",
  "FAILED",
  "RECEIVED",
  "NORMALIZED",
  "VALIDATED",
  "UNSUPPORTED",
  "DISPATCHED",
  "ACK_PENDING",
  "BANK_ACCEPTED",
  "BANK_REJECTED",
]);

export const paymentMonitorPageSchema = z.object({
  number: nonNegativeIntegerSchema,
  size: integerSchema.min(1).max(100),
  totalElements: nonNegativeIntegerSchema,
  totalPages: nonNegativeIntegerSchema,
  first: z.boolean(),
  last: z.boolean(),
});

export const paymentBankConnectionSchema = z.object({
  id: paymentInstructionIdSchema,
  code: z.string(),
  displayName: z.string(),
  bankName: z.string(),
});

const paymentLatestStatusReportSchema = z.object({
  statusReportId: paymentInstructionIdSchema,
  pain002MessageId: paymentInstructionIdSchema,
  groupStatus: nullableStringSchema,
  reasonCode: nullableStringSchema,
  reasonText: nullableStringSchema,
  applicationStatus: paymentApplicationStatusSchema.nullable(),
  appliedAt: nullableDateTimeSchema,
});

export const operationsPaymentInstructionListItemSchema = z.object({
  paymentInstructionId: paymentInstructionIdSchema,
  messageId: paymentInstructionIdSchema,
  fileId: paymentInstructionIdSchema,
  paymentInstructionReference: nullableStringSchema,
  messageReference: nullableStringSchema,
  originalFileName: z.string(),
  bankConnection: paymentBankConnectionSchema,
  requestedExecutionDate: nullableDateSchema,
  declaredTransactionCount: integerSchema.nullable(),
  persistedTransactionCount: nonNegativeIntegerSchema,
  controlSum: nullableAmountSchema,
  currency: currencySchema.nullable(),
  status: paymentInstructionStatusSchema,
  statusReportCount: nonNegativeIntegerSchema,
  latestStatusReport: paymentLatestStatusReportSchema.nullable(),
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
});

export const operationsPaymentInstructionListSchema = z.object({
  paymentInstructions: z.array(operationsPaymentInstructionListItemSchema),
  page: paymentMonitorPageSchema,
});

const ownershipSchema = z.object({
  organizationId: paymentInstructionIdSchema,
  organizationName: z.string(),
  bankConnectionId: paymentInstructionIdSchema,
  bankConnectionCode: z.string(),
  bankName: z.string(),
  bankConnectionDisplayName: z.string(),
});

const paymentFileSchema = z.object({
  id: paymentInstructionIdSchema,
  originalFileName: z.string(),
  direction: fileDirectionSchema,
  checksum: z.string(),
  status: fileStatusSchema,
  effectiveStatus: fileStatusSchema,
  classifiedMessageType: nullableStringSchema,
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
  failureReason: nullableStringSchema,
  ownership: ownershipSchema,
});

const paymentMessageSchema = z.object({
  id: paymentInstructionIdSchema,
  fileId: paymentInstructionIdSchema,
  type: messageTypeSchema,
  status: messageStatusSchema,
  direction: fileDirectionSchema,
  detectedNamespace: nullableStringSchema,
  detectedRootElement: nullableStringSchema,
  parserProfile: nullableStringSchema,
  messageReference: nullableStringSchema,
  identifiedAt: dateTimeSchema,
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
  ownership: ownershipSchema,
});

export const paymentMonitorTransactionSchema = z.object({
  paymentTransactionId: paymentInstructionIdSchema,
  instructionId: nullableStringSchema,
  endToEndId: nullableStringSchema,
  creditorName: nullableStringSchema,
  creditorAccountMasked: nullableStringSchema,
  amount: nullableAmountSchema,
  currency: currencySchema.nullable(),
  status: paymentTransactionStatusSchema,
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
});

export const paymentApplicationItemSchema = z.object({
  applicationItemId: paymentInstructionIdSchema,
  paymentInstructionId: nullableGuidSchema,
  paymentTransactionId: nullableGuidSchema,
  matchingStrategy: nullableStringSchema,
  matchResult: paymentApplicationItemStatusSchema,
  previousInstructionStatus: paymentInstructionStatusSchema.nullable(),
  newInstructionStatus: paymentInstructionStatusSchema.nullable(),
  previousTransactionStatus: paymentTransactionStatusSchema.nullable(),
  newTransactionStatus: paymentTransactionStatusSchema.nullable(),
  reasonCode: nullableStringSchema,
  reasonText: nullableStringSchema,
  originalInstructionId: nullableStringSchema,
  originalEndToEndId: nullableStringSchema,
  createdAt: dateTimeSchema,
});

export const paymentApplicationSchema = z.object({
  applicationId: paymentInstructionIdSchema,
  applicationStatus: paymentApplicationStatusSchema,
  matchedCount: nonNegativeIntegerSchema,
  unmatchedCount: nonNegativeIntegerSchema,
  manualReviewCount: nonNegativeIntegerSchema,
  appliedAt: dateTimeSchema,
  items: z.array(paymentApplicationItemSchema),
});

export const paymentStatusReportSchema = z.object({
  paymentStatusReportId: paymentInstructionIdSchema,
  pain002MessageId: paymentInstructionIdSchema,
  pain002MessageReference: nullableStringSchema,
  originalMessageId: nullableStringSchema,
  originalMessageNameId: nullableStringSchema,
  groupStatus: nullableStringSchema,
  reasonCode: nullableStringSchema,
  reasonText: nullableStringSchema,
  reportStatus: z.enum(["RECEIVED"]),
  createdAt: dateTimeSchema,
  application: paymentApplicationSchema.nullable(),
});

const validationFindingSchema = z.object({
  id: paymentInstructionIdSchema,
  code: z.string(),
  severity: z.enum(["ERROR", "WARNING"]),
  targetType: z.string(),
  targetId: nullableStringSchema,
  field: nullableStringSchema,
  description: z.string(),
});

export const paymentValidationResultSchema = z.object({
  id: paymentInstructionIdSchema,
  messageId: paymentInstructionIdSchema,
  messageType: messageTypeSchema,
  status: z.enum(["PASSED", "FAILED"]),
  checkedAt: dateTimeSchema,
  findings: z.array(validationFindingSchema),
});

const timelineEventSchema = z.object({
  occurredAt: dateTimeSchema,
  type: z.string(),
  status: nullableStringSchema,
  title: z.string(),
  details: z.record(z.string(), z.string()),
});

export const paymentTimelineSchema = z.object({
  messageId: paymentInstructionIdSchema,
  events: z.array(timelineEventSchema),
});

export const paymentTransferTraceSchema = z.object({
  id: paymentInstructionIdSchema,
  fileId: paymentInstructionIdSchema,
  messageId: nullableGuidSchema,
  endpoint: z.string(),
  action: z.enum(["DISPATCH_OUTBOUND_FILE"]),
  attemptNumber: integerSchema.min(1),
  startedAt: dateTimeSchema,
  completedAt: nullableDateTimeSchema,
  outcome: z.enum(["DISPATCHED", "FAILED"]),
  remotePath: nullableStringSchema,
  failureReason: nullableStringSchema,
});

export const operationsPaymentInstructionDetailsSchema = z.object({
  paymentInstructionId: paymentInstructionIdSchema,
  reference: nullableStringSchema,
  requestedExecutionDate: nullableDateSchema,
  controlSum: nullableAmountSchema,
  declaredTransactionCount: integerSchema.nullable(),
  persistedTransactionCount: nonNegativeIntegerSchema,
  status: paymentInstructionStatusSchema,
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
  file: paymentFileSchema,
  message: paymentMessageSchema,
  bankConnection: paymentBankConnectionSchema,
  transactions: z.array(paymentMonitorTransactionSchema),
  statusReports: z.array(paymentStatusReportSchema),
  validationResults: z.array(paymentValidationResultSchema),
  timeline: paymentTimelineSchema,
  transferTraces: z.array(paymentTransferTraceSchema),
});

export const paymentMonitorFiltersSchema = z
  .object({
    search: z.string().trim().max(200).optional(),
    status: paymentInstructionStatusSchema.optional(),
    bankConnectionId: paymentInstructionIdSchema.optional(),
    currency: currencySchema.optional(),
    requestedExecutionDateFrom: dateSchema.optional(),
    requestedExecutionDateTo: dateSchema.optional(),
    updatedFrom: dateTimeSchema.optional(),
    updatedTo: dateTimeSchema.optional(),
    page: nonNegativeIntegerSchema,
    size: integerSchema.min(1).max(100),
    sortField: paymentMonitorSortFieldSchema,
    sortDirection: paymentMonitorSortDirectionSchema,
  })
  .superRefine((filters, context) => {
    if (
      filters.requestedExecutionDateFrom &&
      filters.requestedExecutionDateTo &&
      filters.requestedExecutionDateFrom > filters.requestedExecutionDateTo
    ) {
      context.addIssue({
        code: "custom",
        path: ["requestedExecutionDateTo"],
        message: "Requested execution date from must not be after date to.",
      });
    }

    if (
      filters.updatedFrom &&
      filters.updatedTo &&
      filters.updatedFrom > filters.updatedTo
    ) {
      context.addIssue({
        code: "custom",
        path: ["updatedTo"],
        message: "Updated from must not be after updated to.",
      });
    }
  });
