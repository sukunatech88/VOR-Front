import type {
  FileDirection,
  FileProcessingStatus,
} from "./file-registry.types";

export interface FileRegistryTimelineEvent {
  id: string;
  type: string;
  status: FileProcessingStatus | "INFO";
  timestamp: string;
  description: string;
}

export interface FileRegistryDetail {
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
  storagePath: string;
  sourceSystem: string;
  notes?: string;
  timeline: FileRegistryTimelineEvent[];
}