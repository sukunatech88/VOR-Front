import { z } from "zod";

export const statementIdSchema = z.guid();
const dateTime = z.iso.datetime({ offset: true });
const nullableString = z.string().nullable();
const amount = z.number().nullable();
const pageSchema = z.object({
  number: z.number().int().nonnegative(),
  size: z.number().int().min(1).max(100),
  totalElements: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  first: z.boolean(),
  last: z.boolean(),
});
export const messageStatusSchema = z.enum([
  "IDENTIFIED", "PARSED", "REJECTED", "FAILED", "RECEIVED", "NORMALIZED",
  "VALIDATED", "UNSUPPORTED", "DISPATCHED", "ACK_PENDING", "BANK_ACCEPTED", "BANK_REJECTED",
]);
export const validationStatusSchema = z.enum(["PASSED", "FAILED"]);
export const statementSortFieldSchema = z.enum([
  "updatedAt", "createdAt", "statementCreationDate", "currency", "openingBalance", "closingBalance",
]);
export const entrySortFieldSchema = z.enum(["bookingDate", "valueDate", "amount", "createdAt", "updatedAt"]);
export const sortDirectionSchema = z.enum(["asc", "desc"]);
const bankConnection = z.object({ id: statementIdSchema, code: z.string(), displayName: z.string(), bankName: z.string() });
const balance = z.object({ amount, currency: nullableString }).nullable();

export const statementListItemSchema = z.object({
  statementId: statementIdSchema,
  messageId: statementIdSchema,
  fileId: statementIdSchema,
  statementReference: nullableString,
  messageReference: nullableString,
  originalFileName: z.string(),
  bankConnection,
  accountMasked: nullableString,
  currency: nullableString,
  statementCreationDate: nullableString,
  electronicSequenceNumber: nullableString,
  openingBalance: balance,
  closingBalance: balance,
  entryCount: z.number().int().nonnegative(),
  creditTotal: z.number(),
  debitTotal: z.number(),
  messageStatus: messageStatusSchema,
  validationStatus: validationStatusSchema.nullable(),
  createdAt: dateTime,
  updatedAt: dateTime,
});

export const statementListSchema = z.object({ statements: z.array(statementListItemSchema), page: pageSchema });

const validationFinding = z.object({
  id: statementIdSchema, code: z.string(), severity: z.enum(["ERROR", "WARNING"]),
  targetType: z.string(), targetId: nullableString, field: nullableString, description: z.string(),
});
const validationResult = z.object({
  id: statementIdSchema, messageId: statementIdSchema, messageType: z.literal("CAMT_053"),
  status: validationStatusSchema, checkedAt: dateTime, findings: z.array(validationFinding),
});
const timeline = z.object({
  messageId: statementIdSchema,
  events: z.array(z.object({ occurredAt: dateTime, type: z.string(), status: nullableString, title: z.string(), details: z.record(z.string(), z.string()) })),
});
const file = z.object({
  fileId: statementIdSchema, originalFileName: z.string(), status: z.string(), effectiveStatus: z.string(),
  createdAt: dateTime, updatedAt: dateTime,
});
const message = z.object({
  messageId: statementIdSchema, type: z.literal("CAMT_053"), status: messageStatusSchema,
  reference: nullableString, identifiedAt: dateTime, createdAt: dateTime, updatedAt: dateTime,
});
const pollTrace = z.object({
  traceId: statementIdSchema, source: z.string(), originalFileName: z.string(), detectedAt: dateTime,
  processedAt: dateTime.nullable(), outcome: z.string(), failureReason: nullableString,
});
const timestamps = z.object({
  fileCreatedAt: dateTime, fileUpdatedAt: dateTime, messageIdentifiedAt: dateTime,
  messageCreatedAt: dateTime, messageUpdatedAt: dateTime, statementCreatedAt: dateTime,
  statementUpdatedAt: dateTime, validatedAt: dateTime.nullable(), lastActivityAt: dateTime,
});

export const statementDetailsSchema = z.object({
  summary: statementListItemSchema,
  file,
  message,
  bankConnection,
  validationResults: z.array(validationResult),
  timeline,
  pollTraces: z.array(pollTrace),
  timestamps,
});

export const statementEntrySchema = z.object({
  entryId: statementIdSchema,
  accountServicerReference: nullableString,
  amount,
  currency: nullableString,
  creditDebitIndicator: nullableString,
  status: nullableString,
  bookingDate: nullableString,
  valueDate: nullableString,
  bankTransactionCode: nullableString,
  proprietaryTransactionCode: nullableString,
  endToEndId: nullableString,
  transactionId: nullableString,
  createdAt: dateTime,
  updatedAt: dateTime,
});
export const statementEntryListSchema = z.object({ entries: z.array(statementEntrySchema), page: pageSchema });

export const statementFiltersSchema = z.object({
  search: z.string().trim().max(200).optional(),
  bankConnectionId: statementIdSchema.optional(),
  currency: z.string().regex(/^[A-Z]{3}$/).optional(),
  messageStatus: messageStatusSchema.optional(),
  validationStatus: validationStatusSchema.optional(),
  page: z.number().int().nonnegative(), size: z.number().int().min(1).max(100),
  sortField: statementSortFieldSchema, sortDirection: sortDirectionSchema,
});

export const entryFiltersSchema = z.object({
  creditDebitIndicator: z.enum(["CRDT", "DBIT"]).optional(),
  currency: z.string().regex(/^[A-Z]{3}$/).optional(),
  status: z.string().trim().max(32).optional(),
  page: z.number().int().nonnegative(), size: z.number().int().min(1).max(100),
  sortField: entrySortFieldSchema, sortDirection: sortDirectionSchema,
});
