import { z } from "zod";

const guidSchema = z.guid();
const dateTimeSchema = z.iso.datetime({ offset: true });
const nullableString = z.string().nullable().optional();
const nullableGuid = guidSchema.nullable().optional();
const nullableDateTime = dateTimeSchema.nullable().optional();
const nonNegativeInteger = z.number().int().nonnegative();

export const processingMessageTypeSchema = z.enum([
  "PAIN_001",
  "PAIN_002",
  "CAMT_053",
  "UNSUPPORTED",
]);

export const processingMessageStatusSchema = z.enum([
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

const processingFileStatusSchema = z.enum([
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

export const identifyMessageResultSchema = z.looseObject({
  fileId: guidSchema,
  messageId: guidSchema,
  messageType: z.string(),
  messageStatus: z.string(),
  fileStatus: z.string(),
  detectedNamespace: nullableString,
  detectedRootElement: nullableString,
});

const statusReasonSchema = z.looseObject({
  code: nullableString,
  additionalInfo: z.array(z.string()),
});

const transactionSchema = z.looseObject({
  instructionId: nullableString,
  endToEndId: nullableString,
  creditorName: nullableString,
  creditorAccount: nullableString,
  amount: z.number().nullable().optional(),
  currency: nullableString,
});

const statementEntrySchema = z.looseObject({
  entryReference: nullableString,
  amount: z.number().nullable().optional(),
  currency: nullableString,
  creditDebitIndicator: nullableString,
  status: nullableString,
  bookingDate: nullableString,
  valueDate: nullableString,
  bankTransactionCode: nullableString,
  accountServicerReference: nullableString,
  endToEndId: nullableString,
  transactionId: nullableString,
  remittanceInformation: nullableString,
  additionalEntryInformation: nullableString,
});

export const parseMessageResultSchema = z.looseObject({
  messageId: guidSchema,
  messageType: processingMessageTypeSchema,
  messageStatus: processingMessageStatusSchema,
  parsedSnapshotId: guidSchema,
  groupHeader: z.looseObject({
    msgId: nullableString,
    creDtTm: nullableString,
    nbOfTxs: z.number().int().nullable().optional(),
    ctrlSum: z.number().nullable().optional(),
  }),
  paymentInfo: z.looseObject({
    pmtInfId: nullableString,
    reqdExctnDt: z.iso.date().nullable().optional(),
  }),
  transactions: z.array(transactionSchema),
  statusReport: z
    .looseObject({
      originalMessageId: nullableString,
      originalMessageNameId: nullableString,
      groupStatus: nullableString,
      statusReasons: z.array(statusReasonSchema),
    })
    .nullable()
    .optional(),
  paymentInformationStatuses: z.array(
    z.looseObject({
      originalPaymentInformationId: nullableString,
      paymentInformationStatus: nullableString,
      statusReasons: z.array(statusReasonSchema),
    }),
  ),
  transactionStatuses: z.array(
    z.looseObject({
      originalInstructionId: nullableString,
      originalEndToEndId: nullableString,
      transactionStatus: nullableString,
      statusReasons: z.array(statusReasonSchema),
    }),
  ),
  accountStatements: z.array(
    z.looseObject({
      statementId: nullableString,
      electronicSequenceNumber: nullableString,
      creationDateTime: nullableString,
      accountId: nullableString,
      accountCurrency: nullableString,
      accountOwnerName: nullableString,
      openingBalanceAmount: z.number().nullable().optional(),
      openingBalanceCurrency: nullableString,
      closingBalanceAmount: z.number().nullable().optional(),
      closingBalanceCurrency: nullableString,
      entries: z.array(statementEntrySchema),
    }),
  ),
});

export const normalizeMessageResultSchema = z.looseObject({
  messageId: guidSchema,
  messageStatus: processingMessageStatusSchema,
  paymentInstructionId: nullableGuid,
  createdTransactionIds: z.array(guidSchema),
  transactionCount: nonNegativeInteger,
  paymentStatusReportId: nullableGuid,
  createdStatusPaymentInfoIds: z.array(guidSchema),
  createdStatusTransactionIds: z.array(guidSchema),
  statusTransactionCount: nonNegativeInteger,
  createdAccountStatementIds: z.array(guidSchema),
  createdStatementEntryIds: z.array(guidSchema),
  statementCount: nonNegativeInteger,
  statementEntryCount: nonNegativeInteger,
});

export const validateMessageResultSchema = z.looseObject({
  messageId: guidSchema,
  messageType: processingMessageTypeSchema,
  messageStatus: processingMessageStatusSchema,
  validationResultId: guidSchema,
  validationStatus: z.enum(["PASSED", "FAILED"]),
  findingCount: nonNegativeInteger,
  findings: z.array(
    z.looseObject({
      code: z.string(),
      severity: z.enum(["ERROR", "WARNING"]),
      targetType: z.string(),
      targetId: nullableString,
      field: nullableString,
      description: z.string(),
    }),
  ),
});

export const applyStatusReportResultSchema = z.looseObject({
  messageId: guidSchema,
  paymentStatusReportId: guidSchema,
  applicationId: guidSchema,
  status: z.enum([
    "APPLIED",
    "PARTIALLY_APPLIED",
    "NO_MATCH",
    "MANUAL_REVIEW",
  ]),
  matchedTransactionCount: nonNegativeInteger,
  unmatchedTransactionCount: nonNegativeInteger,
  manualReviewCount: nonNegativeInteger,
  items: z.array(
    z.looseObject({
      itemId: guidSchema,
      paymentStatusReportTransactionId: nullableGuid,
      matchStatus: z.enum(["MATCHED", "UNMATCHED", "AMBIGUOUS"]),
      matchStrategy: nullableString,
      originalInstructionId: nullableString,
      originalEndToEndId: nullableString,
      matchedPaymentInstructionId: nullableGuid,
      matchedPaymentTransactionId: nullableGuid,
      previousInstructionStatus: nullableString,
      newInstructionStatus: nullableString,
      previousTransactionStatus: nullableString,
      newTransactionStatus: nullableString,
      reason: nullableString,
    }),
  ),
  alreadyApplied: z.boolean(),
});

export const dispatchOutboundFileResultSchema = z.looseObject({
  fileId: guidSchema,
  messageId: guidSchema,
  fileStatus: processingFileStatusSchema,
  messageStatus: processingMessageStatusSchema,
  traceId: guidSchema,
  endpoint: z.string(),
  action: z.enum(["DISPATCH_OUTBOUND_FILE"]),
  attemptNumber: z.number().int().positive(),
  startedAt: dateTimeSchema,
  completedAt: nullableDateTime,
  outcome: z.enum(["DISPATCHED", "FAILED"]),
  remotePath: nullableString,
  updatedPaymentInstructionIds: z.array(guidSchema),
  updatedPaymentTransactionIds: z.array(guidSchema),
});

export const pollInboundFilesResultSchema = z.looseObject({
  sourceName: z.string(),
  discoveredCount: nonNegativeInteger,
  processedCount: nonNegativeInteger,
  skippedCount: nonNegativeInteger,
  failedCount: nonNegativeInteger,
  archivedCount: nonNegativeInteger,
  archiveFailedCount: nonNegativeInteger,
  items: z.array(
    z.looseObject({
      source: z.string(),
      originalFileName: z.string(),
      fileId: nullableGuid,
      messageId: nullableGuid,
      messageType: processingMessageTypeSchema.nullable().optional(),
      detectedAt: nullableDateTime,
      processedAt: nullableDateTime,
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
      failureReason: nullableString,
      archiveAttemptId: nullableGuid,
      archiveTarget: z
        .enum(["PROCESSED", "FAILED", "SKIPPED"])
        .nullable()
        .optional(),
      archiveOutcome: z
        .enum(["STARTED", "ARCHIVED", "ALREADY_ARCHIVED", "ARCHIVE_FAILED"])
        .nullable()
        .optional(),
      archivePath: nullableString,
      archiveFailureReason: nullableString,
    }),
  ),
});
