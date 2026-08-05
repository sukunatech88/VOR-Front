export interface OperationsDashboardView {
  metrics: OperationsDashboardMetricsView;
  connectionConfiguration: OperationsConnectionConfigurationView;
  recentFailures: OperationsDashboardFailureView[];
  connectionHealth: OperationsConnectionHealthView[];
}

export interface OperationsDashboardMetricsView {
  totalFiles: number;
  totalMessages: number;
  pendingMessages: number;
  pendingAcknowledgements: number;
  exceptionFiles: number;
}

export interface OperationsConnectionConfigurationView {
  configuredConnections: number;
  activeConnections: number;
  technicalHealthAvailable: boolean;
  healthyConnections: number;
  degradedConnections: number;
  untestedConnections: number;
  staleConnections: number;
  unconfiguredConnections: number;
}

export type OperationsDashboardFailureSource =
  | "FILE"
  | "MESSAGE"
  | "INBOUND_POLL"
  | "OUTBOUND_TRANSFER";

export interface OperationsDashboardFailureView {
  id: string;
  source: OperationsDashboardFailureSource;
  occurredAt: string;
  status: string;
  reason?: string | null;
  fileId?: string | null;
  messageId?: string | null;
  ownership: OperationsOwnershipView;
}

export interface OperationsOwnershipView {
  organizationId: string;
  organizationName: string;
  bankConnectionId: string;
  bankConnectionCode: string;
  bankName: string;
  bankConnectionDisplayName: string;
}

export type OperationsAdministrativeStatus = "ACTIVE" | "INACTIVE";

export type OperationsTechnicalStatus =
  | "HEALTHY"
  | "DEGRADED"
  | "UNTESTED"
  | "STALE"
  | "NOT_CONFIGURED";

export interface OperationsConnectionHealthView {
  ownership: OperationsOwnershipView;
  administrativeStatus: OperationsAdministrativeStatus;
  technicalStatus: OperationsTechnicalStatus;
  latestTest?: OperationsConnectionTestView | null;
  latestInboundPoll?: OperationsConnectionInboundPollView | null;
  latestInboundFile?: OperationsConnectionInboundFileView | null;
  latestOutboundTransfer?: OperationsConnectionOutboundTransferView | null;
  latestError?: OperationsConnectionErrorView | null;
}

export interface OperationsConnectionTestView {
  outcome: "SUCCEEDED" | "FAILED";
  occurredAt: string;
  connectionEstablished: boolean;
  inboundDirectoryAccessible: boolean;
  outboundDirectoryAccessible: boolean;
  errorCode?: string | null;
  message: string;
}

export type OperationsInboundPollOutcome =
  | "DETECTED"
  | "PROCESSED"
  | "APPLIED_STATUS_REPORT"
  | "VALIDATION_FAILED"
  | "SKIPPED_ALREADY_DETECTED"
  | "SKIPPED_ALREADY_REGISTERED"
  | "UNSUPPORTED_MESSAGE_TYPE"
  | "FAILED";

export interface OperationsConnectionInboundPollView {
  traceId: string;
  source: string;
  originalFileName: string;
  outcome: OperationsInboundPollOutcome;
  occurredAt: string;
  fileId?: string | null;
  messageId?: string | null;
  failureReason?: string | null;
}

export type OperationsFileStatus =
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

export interface OperationsConnectionInboundFileView {
  fileId: string;
  originalFileName: string;
  status: OperationsFileStatus;
  classifiedMessageType?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OperationsConnectionOutboundTransferView {
  traceId: string;
  fileId: string;
  messageId?: string | null;
  action: "DISPATCH_OUTBOUND_FILE";
  outcome: "DISPATCHED" | "FAILED";
  occurredAt: string;
  remotePath?: string | null;
  failureReason?: string | null;
}

export interface OperationsConnectionErrorView {
  source: "TECHNICAL_TEST" | "INBOUND_POLL" | "OUTBOUND_TRANSFER";
  occurredAt: string;
  code?: string | null;
  message: string;
  fileId?: string | null;
  messageId?: string | null;
}
