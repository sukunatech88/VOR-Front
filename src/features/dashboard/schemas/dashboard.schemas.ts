import { z } from "zod";

const uuidSchema = z.guid();
const dateTimeSchema = z.iso.datetime({ offset: true });
const nonNegativeIntegerSchema = z.number().int().nonnegative();

const ownershipSchema = z.looseObject({
  organizationId: uuidSchema,
  organizationName: z.string(),
  bankConnectionId: uuidSchema,
  bankConnectionCode: z.string(),
  bankName: z.string(),
  bankConnectionDisplayName: z.string(),
});

const connectionTestSchema = z.looseObject({
  outcome: z.enum(["SUCCEEDED", "FAILED"]),
  occurredAt: dateTimeSchema,
  connectionEstablished: z.boolean(),
  inboundDirectoryAccessible: z.boolean(),
  outboundDirectoryAccessible: z.boolean(),
  errorCode: z.string().nullable().optional(),
  message: z.string(),
});

const inboundPollSchema = z.looseObject({
  traceId: uuidSchema,
  source: z.string(),
  originalFileName: z.string(),
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
  occurredAt: dateTimeSchema,
  fileId: uuidSchema.nullable().optional(),
  messageId: uuidSchema.nullable().optional(),
  failureReason: z.string().nullable().optional(),
});

const inboundFileSchema = z.looseObject({
  fileId: uuidSchema,
  originalFileName: z.string(),
  status: z.enum([
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
  ]),
  classifiedMessageType: z.string().nullable().optional(),
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
});

const outboundTransferSchema = z.looseObject({
  traceId: uuidSchema,
  fileId: uuidSchema,
  messageId: uuidSchema.nullable().optional(),
  action: z.enum(["DISPATCH_OUTBOUND_FILE"]),
  outcome: z.enum(["DISPATCHED", "FAILED"]),
  occurredAt: dateTimeSchema,
  remotePath: z.string().nullable().optional(),
  failureReason: z.string().nullable().optional(),
});

const connectionErrorSchema = z.looseObject({
  source: z.enum(["TECHNICAL_TEST", "INBOUND_POLL", "OUTBOUND_TRANSFER"]),
  occurredAt: dateTimeSchema,
  code: z.string().nullable().optional(),
  message: z.string(),
  fileId: uuidSchema.nullable().optional(),
  messageId: uuidSchema.nullable().optional(),
});

const dashboardFailureSchema = z.looseObject({
  id: uuidSchema,
  source: z.enum(["FILE", "MESSAGE", "INBOUND_POLL", "OUTBOUND_TRANSFER"]),
  occurredAt: dateTimeSchema,
  status: z.string(),
  reason: z.string().nullable().optional(),
  fileId: uuidSchema.nullable().optional(),
  messageId: uuidSchema.nullable().optional(),
  ownership: ownershipSchema,
});

const connectionHealthSchema = z.looseObject({
  ownership: ownershipSchema,
  administrativeStatus: z.enum(["ACTIVE", "INACTIVE"]),
  technicalStatus: z.enum([
    "HEALTHY",
    "DEGRADED",
    "UNTESTED",
    "STALE",
    "NOT_CONFIGURED",
  ]),
  latestTest: connectionTestSchema.nullable().optional(),
  latestInboundPoll: inboundPollSchema.nullable().optional(),
  latestInboundFile: inboundFileSchema.nullable().optional(),
  latestOutboundTransfer: outboundTransferSchema.nullable().optional(),
  latestError: connectionErrorSchema.nullable().optional(),
});

export const operationsDashboardSchema = z.looseObject({
  metrics: z.looseObject({
    totalFiles: nonNegativeIntegerSchema,
    totalMessages: nonNegativeIntegerSchema,
    pendingMessages: nonNegativeIntegerSchema,
    pendingAcknowledgements: nonNegativeIntegerSchema,
    exceptionFiles: nonNegativeIntegerSchema,
  }),
  connectionConfiguration: z.looseObject({
    configuredConnections: nonNegativeIntegerSchema,
    activeConnections: nonNegativeIntegerSchema,
    technicalHealthAvailable: z.boolean(),
    healthyConnections: nonNegativeIntegerSchema,
    degradedConnections: nonNegativeIntegerSchema,
    untestedConnections: nonNegativeIntegerSchema,
    staleConnections: nonNegativeIntegerSchema,
    unconfiguredConnections: nonNegativeIntegerSchema,
  }),
  recentFailures: z.array(dashboardFailureSchema),
  connectionHealth: z.array(connectionHealthSchema),
});
