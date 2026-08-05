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

export interface OperationsOwnershipView {
  organizationId: string;
  organizationName: string;
  bankConnectionId: string;
  bankConnectionCode: string;
  bankName: string;
  bankConnectionDisplayName: string;
}

export interface OperationsPageView {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface OperationsFileSummaryView {
  fileId: string;
  originalFileName: string;
  direction: FileDirection;
  checksum: string;
  fileStatus: FileStatus;
  effectiveFileStatus: FileStatus;
  classifiedMessageType?: string | null;
  messageId?: string | null;
  messageType?: MessageType | null;
  messageStatus?: MessageStatus | null;
  messageReference?: string | null;
  createdAt: string;
  updatedAt: string;
  failureReason?: string | null;
  ownership: OperationsOwnershipView;
}

export interface OperationsFileList {
  files: OperationsFileSummaryView[];
  page: OperationsPageView;
}

export interface OperationsFileView {
  id: string;
  originalFileName: string;
  direction: FileDirection;
  checksum: string;
  status: FileStatus;
  effectiveStatus: FileStatus;
  classifiedMessageType?: string | null;
  createdAt: string;
  updatedAt: string;
  failureReason?: string | null;
  ownership: OperationsOwnershipView;
}

export interface OperationsMessageView {
  id: string;
  fileId: string;
  type: MessageType;
  status: MessageStatus;
  direction: FileDirection;
  detectedNamespace?: string | null;
  detectedRootElement?: string | null;
  parserProfile?: string | null;
  messageReference?: string | null;
  identifiedAt: string;
  createdAt: string;
  updatedAt: string;
  ownership: OperationsOwnershipView;
}

export interface OperationsTimestampsView {
  fileCreatedAt?: string | null;
  fileUpdatedAt?: string | null;
  messageCreatedAt: string;
  messageUpdatedAt: string;
  identifiedAt: string;
  parsedAt?: string | null;
  normalizedAt?: string | null;
  validatedAt?: string | null;
  statusReportAppliedAt?: string | null;
  outboundTransferAt?: string | null;
  lastActivityAt: string;
}

export interface OperationsParsedSnapshotView {
  id: string;
  messageId: string;
  createdAt: string;
  snapshotJson: string;
}

export type PaymentInstructionStatus =
  | "CREATED"
  | "ACCEPTED"
  | "REJECTED"
  | "PENDING"
  | "PARTIALLY_ACCEPTED"
  | "MANUAL_REVIEW"
  | "UNKNOWN"
  | "DISPATCHED"
  | "ACK_PENDING"
  | "BANK_ACCEPTED"
  | "BANK_REJECTED";

export type PaymentTransactionStatus =
  | "CREATED"
  | "ACCEPTED"
  | "REJECTED"
  | "PENDING"
  | "MANUAL_REVIEW"
  | "UNKNOWN"
  | "DISPATCHED"
  | "ACK_PENDING"
  | "BANK_ACCEPTED"
  | "BANK_REJECTED";

export interface OperationsPaymentTransactionView {
  id: string;
  paymentInstructionId: string;
  instructionId?: string | null;
  endToEndId?: string | null;
  creditorName?: string | null;
  creditorAccount?: string | null;
  amount?: number | null;
  currency?: string | null;
  status: PaymentTransactionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OperationsPaymentInstructionView {
  id: string;
  messageId: string;
  instructionReference?: string | null;
  requestedExecutionDate?: string | null;
  controlSum?: number | null;
  transactionCount?: number | null;
  status: PaymentInstructionStatus;
  createdAt: string;
  updatedAt: string;
  transactions: OperationsPaymentTransactionView[];
}

export interface OperationsPaymentStatusReportPaymentInfoView {
  id: string;
  paymentStatusReportId: string;
  originalPaymentInformationId?: string | null;
  paymentInformationStatus?: string | null;
  statusReasonCode?: string | null;
  statusReasonAdditionalInfo?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OperationsPaymentStatusReportTransactionView {
  id: string;
  paymentStatusReportId: string;
  paymentStatusReportPaymentInfoId?: string | null;
  originalPaymentInformationId?: string | null;
  originalInstructionId?: string | null;
  originalEndToEndId?: string | null;
  transactionStatus?: string | null;
  statusReasonCode?: string | null;
  statusReasonAdditionalInfo?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OperationsPaymentStatusReportView {
  id: string;
  messageId: string;
  reportReference?: string | null;
  creationDateTime?: string | null;
  originalMessageId?: string | null;
  originalMessageNameId?: string | null;
  groupStatus?: string | null;
  groupStatusReasonCode?: string | null;
  groupStatusReasonAdditionalInfo?: string | null;
  status: "RECEIVED";
  createdAt: string;
  updatedAt: string;
  paymentInfos: OperationsPaymentStatusReportPaymentInfoView[];
  transactions: OperationsPaymentStatusReportTransactionView[];
}

export interface OperationsStatementEntryView {
  id: string;
  accountStatementId: string;
  entryReference?: string | null;
  amount?: number | null;
  currency?: string | null;
  creditDebitIndicator?: string | null;
  status?: string | null;
  bookingDate?: string | null;
  valueDate?: string | null;
  bankTransactionCode?: string | null;
  accountServicerReference?: string | null;
  endToEndId?: string | null;
  transactionId?: string | null;
  remittanceInformation?: string | null;
  additionalEntryInformation?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OperationsAccountStatementView {
  id: string;
  messageId: string;
  statementReference?: string | null;
  electronicSequenceNumber?: string | null;
  creationDateTime?: string | null;
  accountId?: string | null;
  accountCurrency?: string | null;
  accountOwnerName?: string | null;
  openingBalanceAmount?: number | null;
  openingBalanceCurrency?: string | null;
  closingBalanceAmount?: number | null;
  closingBalanceCurrency?: string | null;
  createdAt: string;
  updatedAt: string;
  entries: OperationsStatementEntryView[];
}

export interface OperationsNormalizedObjectsView {
  paymentInstructions: OperationsPaymentInstructionView[];
  paymentStatusReport?: OperationsPaymentStatusReportView | null;
  accountStatements: OperationsAccountStatementView[];
}

export interface OperationsValidationFindingView {
  id: string;
  code: string;
  severity: "ERROR" | "WARNING";
  targetType: string;
  targetId?: string | null;
  field?: string | null;
  description: string;
}

export interface OperationsValidationResultView {
  id: string;
  messageId: string;
  messageType: MessageType;
  status: "PASSED" | "FAILED";
  checkedAt: string;
  findings: OperationsValidationFindingView[];
}

export interface OperationsStatusReportApplicationItemView {
  id: string;
  applicationId: string;
  paymentStatusReportTransactionId?: string | null;
  matchStatus: "MATCHED" | "UNMATCHED" | "AMBIGUOUS";
  matchStrategy?: string | null;
  originalInstructionId?: string | null;
  originalEndToEndId?: string | null;
  matchedPaymentInstructionId?: string | null;
  matchedPaymentTransactionId?: string | null;
  previousInstructionStatus?: PaymentInstructionStatus | null;
  newInstructionStatus?: PaymentInstructionStatus | null;
  previousTransactionStatus?: PaymentTransactionStatus | null;
  newTransactionStatus?: PaymentTransactionStatus | null;
  reason?: string | null;
  createdAt: string;
}

export interface OperationsStatusReportApplicationView {
  id: string;
  messageId: string;
  pain002MessageId: string;
  paymentStatusReportId: string;
  status: "APPLIED" | "PARTIALLY_APPLIED" | "NO_MATCH" | "MANUAL_REVIEW";
  matchedTransactionCount: number;
  unmatchedTransactionCount: number;
  manualReviewCount: number;
  appliedAt: string;
  items: OperationsStatusReportApplicationItemView[];
}

export interface OperationsOutboundFileTransferTraceView {
  id: string;
  fileId: string;
  messageId?: string | null;
  endpoint: string;
  action: "DISPATCH_OUTBOUND_FILE";
  attemptNumber: number;
  startedAt: string;
  completedAt?: string | null;
  outcome: "DISPATCHED" | "FAILED";
  remotePath?: string | null;
  failureReason?: string | null;
}

export type InboundFilePollOutcome =
  | "DETECTED"
  | "PROCESSED"
  | "APPLIED_STATUS_REPORT"
  | "VALIDATION_FAILED"
  | "SKIPPED_ALREADY_DETECTED"
  | "SKIPPED_ALREADY_REGISTERED"
  | "UNSUPPORTED_MESSAGE_TYPE"
  | "FAILED";

export interface OperationsInboundFilePollTraceView {
  id: string;
  source: string;
  originalFileName: string;
  checksum?: string | null;
  fileId?: string | null;
  messageId?: string | null;
  detectedAt: string;
  processedAt?: string | null;
  outcome: InboundFilePollOutcome;
  failureReason?: string | null;
}

export interface OperationsMessageDetails {
  file?: OperationsFileView | null;
  message: OperationsMessageView;
  currentStatus: MessageStatus;
  timestamps: OperationsTimestampsView;
  parsedSnapshots: OperationsParsedSnapshotView[];
  normalized: OperationsNormalizedObjectsView;
  latestValidationResult?: OperationsValidationResultView | null;
  validationResults: OperationsValidationResultView[];
  statusReportApplications: OperationsStatusReportApplicationView[];
  outboundFileTransferTraces: OperationsOutboundFileTransferTraceView[];
  inboundFilePollTraces: OperationsInboundFilePollTraceView[];
}

export interface OperationsFileDetails {
  file: OperationsFileView;
  message?: OperationsMessageDetails | null;
}

export interface RegisterFileResponse {
  fileId: string;
  status: string;
  checksum: string;
  storagePath?: string | null;
  message: string;
}

export interface FileRegistryFilters {
  search?: string;
  status?: FileStatus;
  direction?: FileDirection;
  messageType?: MessageType;
  bankConnectionId?: string;
  page: number;
  size: number;
}

export interface RegisterFileInput {
  file: File;
  direction: FileDirection;
}
