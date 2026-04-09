import { z } from "zod";

import { fileRegistryMock } from "../mocks/file-registry.mock";
import { fileRegistryDetailMock } from "../mocks/file-registry-detail.mock";
import type { FileRegistryItem } from "../types/file-registry.types";
import type { FileRegistryDetail } from "../types/file-registry-detail.types";

const fileRegistryItemSchema = z.object({
  fileId: z.string(),
  fileName: z.string(),
  checksum: z.string(),
  direction: z.enum(["INBOUND", "OUTBOUND"]),
  bankName: z.string(),
  organizationName: z.string(),
  messageType: z.string(),
  status: z.enum([
    "DETECTED",
    "RECEIVED",
    "STORED",
    "IDENTIFIED",
    "PARSED",
    "FAILED",
    "UNSUPPORTED",
  ]),
  receivedAt: z.string(),
  sizeKb: z.number(),
});

const fileRegistryTimelineEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  status: z.enum([
    "DETECTED",
    "RECEIVED",
    "STORED",
    "IDENTIFIED",
    "PARSED",
    "FAILED",
    "UNSUPPORTED",
    "INFO",
  ]),
  timestamp: z.string(),
  description: z.string(),
});

const fileRegistryDetailSchema = z.object({
  fileId: z.string(),
  fileName: z.string(),
  checksum: z.string(),
  direction: z.enum(["INBOUND", "OUTBOUND"]),
  bankName: z.string(),
  organizationName: z.string(),
  messageType: z.string(),
  status: z.enum([
    "DETECTED",
    "RECEIVED",
    "STORED",
    "IDENTIFIED",
    "PARSED",
    "FAILED",
    "UNSUPPORTED",
  ]),
  receivedAt: z.string(),
  sizeKb: z.number(),
  storagePath: z.string(),
  sourceSystem: z.string(),
  notes: z.string().optional(),
  timeline: z.array(fileRegistryTimelineEventSchema),
});

const fileRegistryListSchema = z.array(fileRegistryItemSchema);

export interface FileRegistryFilters {
  search?: string;
  status?: string;
}

export async function getFileRegistry(
  filters?: FileRegistryFilters,
): Promise<FileRegistryItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 350));

  let items = [...fileRegistryMock];

  if (filters?.search) {
    const term = filters.search.toLowerCase();

    items = items.filter((item) =>
      [
        item.fileName,
        item.fileId,
        item.bankName,
        item.organizationName,
        item.messageType,
      ].some((value) => value.toLowerCase().includes(term)),
    );
  }

  if (filters?.status && filters.status !== "ALL") {
    items = items.filter((item) => item.status === filters.status);
  }

  return fileRegistryListSchema.parse(items);
}

export async function getFileRegistryById(
  fileId: string,
): Promise<FileRegistryDetail> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  const item = fileRegistryDetailMock.find((entry) => entry.fileId === fileId);

  if (!item) {
    throw new Error("File registry item not found");
  }

  return fileRegistryDetailSchema.parse(item);
}