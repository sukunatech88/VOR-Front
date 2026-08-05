import { z } from "zod";

export const messageIdSchema = z.guid();

const dateTimeSchema = z.iso.datetime({ offset: true });
const dateSchema = z.iso.date();
const integerSchema = z.number().int();
const nonNegativeIntegerSchema = integerSchema.nonnegative();
const nullableStringSchema = z.string().nullable().optional();
const nullableGuidSchema = messageIdSchema.nullable().optional();
const nullableDateTimeSchema = dateTimeSchema.nullable().optional();

export const fileDirectionSchema = z.enum(["INBOUND", "OUTBOUND"]);
export const fileStatusSchema = z.enum([
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
export const messageTypeSchema = z.enum([
  "PAIN_001",
  "PAIN_002",
  "CAMT_053",
  "UNSUPPORTED",
]);
export const messageStatusSchema = z.enum([
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
const paymentInstructionStatusSchema = z.enum([
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
const paymentTransactionStatusSchema = z.enum([
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

const ownershipSchema = z.looseObject({
  organizationId: messageIdSchema,
  organizationName: z.string(),
  bankConnectionId: messageIdSchema,
  bankConnectionCode: z.string(),
  bankName: z.string(),
  bankConnectionDisplayName: z.string(),
});

const fileViewSchema = z.looseObject({
  id: messageIdSchema,
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

const messageViewSchema = z.looseObject({
  id: messageIdSchema,
  fileId: messageIdSchema,
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

const timestampsSchema = z.looseObject({
  fileCreatedAt: nullableDateTimeSchema,
  fileUpdatedAt: nullableDateTimeSchema,
  messageCreatedAt: dateTimeSchema,
  messageUpdatedAt: dateTimeSchema,
  identifiedAt: dateTimeSchema,
  parsedAt: nullableDateTimeSchema,
  normalizedAt: nullableDateTimeSchema,
  validatedAt: nullableDateTimeSchema,
  statusReportAppliedAt: nullableDateTimeSchema,
  outboundTransferAt: nullableDateTimeSchema,
  lastActivityAt: dateTimeSchema,
});

const parsedSnapshotSchema = z.looseObject({
  id: messageIdSchema,
  messageId: messageIdSchema,
  createdAt: dateTimeSchema,
  snapshotJson: z.string(),
});

const paymentTransactionSchema = z.looseObject({
  id: messageIdSchema,
  paymentInstructionId: messageIdSchema,
  instructionId: nullableStringSchema,
  endToEndId: nullableStringSchema,
  creditorName: nullableStringSchema,
  creditorAccount: nullableStringSchema,
  amount: z.number().nullable().optional(),
  currency: nullableStringSchema,
  status: paymentTransactionStatusSchema,
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
});

const paymentInstructionSchema = z.looseObject({
  id: messageIdSchema,
  messageId: messageIdSchema,
  instructionReference: nullableStringSchema,
  requestedExecutionDate: dateSchema.nullable().optional(),
  controlSum: z.number().nullable().optional(),
  transactionCount: integerSchema.nullable().optional(),
  status: paymentInstructionStatusSchema,
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
  transactions: z.array(paymentTransactionSchema),
});

const paymentStatusReportPaymentInfoSchema = z.looseObject({
  id: messageIdSchema,
  paymentStatusReportId: messageIdSchema,
  originalPaymentInformationId: nullableStringSchema,
  paymentInformationStatus: nullableStringSchema,
  statusReasonCode: nullableStringSchema,
  statusReasonAdditionalInfo: nullableStringSchema,
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
});

const paymentStatusReportTransactionSchema = z.looseObject({
  id: messageIdSchema,
  paymentStatusReportId: messageIdSchema,
  paymentStatusReportPaymentInfoId: nullableGuidSchema,
  originalPaymentInformationId: nullableStringSchema,
  originalInstructionId: nullableStringSchema,
  originalEndToEndId: nullableStringSchema,
  transactionStatus: nullableStringSchema,
  statusReasonCode: nullableStringSchema,
  statusReasonAdditionalInfo: nullableStringSchema,
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
});

const paymentStatusReportSchema = z.looseObject({
  id: messageIdSchema,
  messageId: messageIdSchema,
  reportReference: nullableStringSchema,
  creationDateTime: nullableStringSchema,
  originalMessageId: nullableStringSchema,
  originalMessageNameId: nullableStringSchema,
  groupStatus: nullableStringSchema,
  groupStatusReasonCode: nullableStringSchema,
  groupStatusReasonAdditionalInfo: nullableStringSchema,
  status: z.enum(["RECEIVED"]),
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
  paymentInfos: z.array(paymentStatusReportPaymentInfoSchema),
  transactions: z.array(paymentStatusReportTransactionSchema),
});

const statementEntrySchema = z.looseObject({
  id: messageIdSchema,
  accountStatementId: messageIdSchema,
  entryReference: nullableStringSchema,
  amount: z.number().nullable().optional(),
  currency: nullableStringSchema,
  creditDebitIndicator: nullableStringSchema,
  status: nullableStringSchema,
  bookingDate: nullableStringSchema,
  valueDate: nullableStringSchema,
  bankTransactionCode: nullableStringSchema,
  accountServicerReference: nullableStringSchema,
  endToEndId: nullableStringSchema,
  transactionId: nullableStringSchema,
  remittanceInformation: nullableStringSchema,
  additionalEntryInformation: nullableStringSchema,
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
});

const accountStatementSchema = z.looseObject({
  id: messageIdSchema,
  messageId: messageIdSchema,
  statementReference: nullableStringSchema,
  electronicSequenceNumber: nullableStringSchema,
  creationDateTime: nullableStringSchema,
  accountId: nullableStringSchema,
  accountCurrency: nullableStringSchema,
  accountOwnerName: nullableStringSchema,
  openingBalanceAmount: z.number().nullable().optional(),
  openingBalanceCurrency: nullableStringSchema,
  closingBalanceAmount: z.number().nullable().optional(),
  closingBalanceCurrency: nullableStringSchema,
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
  entries: z.array(statementEntrySchema),
});

const normalizedObjectsSchema = z.looseObject({
  paymentInstructions: z.array(paymentInstructionSchema),
  paymentStatusReport: paymentStatusReportSchema.nullable().optional(),
  accountStatements: z.array(accountStatementSchema),
});

const validationFindingSchema = z.looseObject({
  id: messageIdSchema,
  code: z.string(),
  severity: z.enum(["ERROR", "WARNING"]),
  targetType: z.string(),
  targetId: nullableStringSchema,
  field: nullableStringSchema,
  description: z.string(),
});

const validationResultSchema = z.looseObject({
  id: messageIdSchema,
  messageId: messageIdSchema,
  messageType: messageTypeSchema,
  status: z.enum(["PASSED", "FAILED"]),
  checkedAt: dateTimeSchema,
  findings: z.array(validationFindingSchema),
});

const statusReportApplicationItemSchema = z.looseObject({
  id: messageIdSchema,
  applicationId: messageIdSchema,
  paymentStatusReportTransactionId: nullableGuidSchema,
  matchStatus: z.enum(["MATCHED", "UNMATCHED", "AMBIGUOUS"]),
  matchStrategy: nullableStringSchema,
  originalInstructionId: nullableStringSchema,
  originalEndToEndId: nullableStringSchema,
  matchedPaymentInstructionId: nullableGuidSchema,
  matchedPaymentTransactionId: nullableGuidSchema,
  previousInstructionStatus: paymentInstructionStatusSchema
    .nullable()
    .optional(),
  newInstructionStatus: paymentInstructionStatusSchema.nullable().optional(),
  previousTransactionStatus: paymentTransactionStatusSchema
    .nullable()
    .optional(),
  newTransactionStatus: paymentTransactionStatusSchema.nullable().optional(),
  reason: nullableStringSchema,
  createdAt: dateTimeSchema,
});

const statusReportApplicationSchema = z.looseObject({
  id: messageIdSchema,
  messageId: messageIdSchema,
  pain002MessageId: messageIdSchema,
  paymentStatusReportId: messageIdSchema,
  status: z.enum([
    "APPLIED",
    "PARTIALLY_APPLIED",
    "NO_MATCH",
    "MANUAL_REVIEW",
  ]),
  matchedTransactionCount: integerSchema,
  unmatchedTransactionCount: integerSchema,
  manualReviewCount: integerSchema,
  appliedAt: dateTimeSchema,
  items: z.array(statusReportApplicationItemSchema),
});

const outboundFileTransferTraceSchema = z.looseObject({
  id: messageIdSchema,
  fileId: messageIdSchema,
  messageId: nullableGuidSchema,
  endpoint: z.string(),
  action: z.enum(["DISPATCH_OUTBOUND_FILE"]),
  attemptNumber: integerSchema,
  startedAt: dateTimeSchema,
  completedAt: nullableDateTimeSchema,
  outcome: z.enum(["DISPATCHED", "FAILED"]),
  remotePath: nullableStringSchema,
  failureReason: nullableStringSchema,
});

const inboundFilePollTraceSchema = z.looseObject({
  id: messageIdSchema,
  source: z.string(),
  originalFileName: z.string(),
  checksum: nullableStringSchema,
  fileId: nullableGuidSchema,
  messageId: nullableGuidSchema,
  detectedAt: dateTimeSchema,
  processedAt: nullableDateTimeSchema,
  outcome: z.enum([
    "DETECTED",
    "PROCESSED",
    "APPLIED_STATUS_REPORT",
    "VALIDATION_FAILED",
    "SKIPPED_ALREADY_DETECTED",
    "SKIPPED_ALREADY_REGISTERED",
    "UNSUPPORTED_MESSAGE_TYPE",
    "FAILED",
  ]),
  failureReason: nullableStringSchema,
});

export const operationsMessageDetailsSchema = z.looseObject({
  file: fileViewSchema.nullable().optional(),
  message: messageViewSchema,
  currentStatus: messageStatusSchema,
  timestamps: timestampsSchema,
  parsedSnapshots: z.array(parsedSnapshotSchema),
  normalized: normalizedObjectsSchema,
  latestValidationResult: validationResultSchema.nullable().optional(),
  validationResults: z.array(validationResultSchema),
  statusReportApplications: z.array(statusReportApplicationSchema),
  outboundFileTransferTraces: z.array(outboundFileTransferTraceSchema),
  inboundFilePollTraces: z.array(inboundFilePollTraceSchema),
});

export const operationsMessageListSchema = z.looseObject({
  messages: z.array(
    z.looseObject({
      messageId: messageIdSchema,
      fileId: messageIdSchema,
      originalFileName: nullableStringSchema,
      messageType: messageTypeSchema,
      messageStatus: messageStatusSchema,
      fileStatus: fileStatusSchema.nullable().optional(),
      effectiveFileStatus: fileStatusSchema.nullable().optional(),
      messageReference: nullableStringSchema,
      createdAt: dateTimeSchema,
      updatedAt: dateTimeSchema,
      ownership: ownershipSchema,
    }),
  ),
  page: z.looseObject({
    number: nonNegativeIntegerSchema,
    size: integerSchema.min(1).max(100),
    totalElements: nonNegativeIntegerSchema,
    totalPages: nonNegativeIntegerSchema,
    first: z.boolean(),
    last: z.boolean(),
  }),
});

export const operationsTimelineSchema = z.looseObject({
  messageId: messageIdSchema,
  events: z.array(
    z.looseObject({
      occurredAt: dateTimeSchema,
      type: z.string(),
      status: nullableStringSchema,
      title: z.string(),
      details: z.record(z.string(), z.string()),
    }),
  ),
});

export const retryParseMessageResponseSchema = z.looseObject({
  retryAttemptId: messageIdSchema,
  messageId: messageIdSchema,
  fileId: messageIdSchema,
  operation: z.enum(["PARSE"]),
  previousStatus: messageStatusSchema,
  currentStatus: messageStatusSchema,
  outcome: z.enum(["STARTED", "SUCCEEDED", "FAILED", "REJECTED"]),
  parsedSnapshotId: nullableGuidSchema,
  correlationId: messageIdSchema,
  startedAt: dateTimeSchema,
  completedAt: dateTimeSchema,
  errorCode: nullableStringSchema,
  errorMessage: nullableStringSchema,
  idempotentReplay: z.boolean(),
});
