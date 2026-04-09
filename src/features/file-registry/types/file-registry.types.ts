export type FileDirection = "INBOUND" | "OUTBOUND";

export type FileProcessingStatus =
  | "DETECTED"
  | "RECEIVED"
  | "STORED"
  | "IDENTIFIED"
  | "PARSED"
  | "FAILED"
  | "UNSUPPORTED";

export interface FileRegistryItem {
  fileId: string;
  fileName: string;
  checksum: string;
  direction: FileDirection;
  bankName: string;
  organizationName: string;
  messageType: string;
  status: FileProcessingStatus;
  receivedAt: string;
  sizeKb: number;
}