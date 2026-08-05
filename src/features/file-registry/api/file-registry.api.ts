import type {
  ApiBinaryResponse,
  ApiClient,
} from "../../../core/http/api-client";
import { ApiError } from "../../../core/http/api-error";
import {
  operationsFileDetailsSchema,
  operationsFileListSchema,
  registerFileResponseSchema,
} from "../schemas/file-registry.schemas";
import type {
  FileRegistryFilters,
  OperationsFileDetails,
  OperationsFileList,
  RegisterFileInput,
  RegisterFileResponse,
} from "../types/file-registry.types";

const filesPath = "/api/operations/files";
const registerFilePath = "/api/files/register";

export async function getOperationsFiles(
  client: ApiClient,
  filters: FileRegistryFilters,
  signal?: AbortSignal,
): Promise<OperationsFileList> {
  const response = await client.get<unknown>(filesPath, {
    signal,
    query: {
      search: filters.search,
      status: filters.status,
      direction: filters.direction,
      messageType: filters.messageType,
      bankConnectionId: filters.bankConnectionId,
      page: filters.page,
      size: filters.size,
    },
  });
  const result = operationsFileListSchema.safeParse(response);

  if (!result.success) {
    throw ApiError.protocol("GET", filesPath);
  }

  return result.data;
}

export async function getOperationsFile(
  client: ApiClient,
  fileId: string,
  signal?: AbortSignal,
): Promise<OperationsFileDetails> {
  const path = `${filesPath}/${fileId}`;
  const response = await client.get<unknown>(path, { signal });
  const result = operationsFileDetailsSchema.safeParse(response);

  if (!result.success) {
    throw ApiError.protocol("GET", path);
  }

  return result.data;
}

export function downloadOperationsFileRaw(
  client: ApiClient,
  fileId: string,
  signal?: AbortSignal,
): Promise<ApiBinaryResponse> {
  return client.getBinary(`${filesPath}/${fileId}/raw`, { signal });
}

export async function registerFile(
  client: ApiClient,
  input: RegisterFileInput,
): Promise<RegisterFileResponse> {
  const formData = new FormData();
  formData.append("direction", input.direction);
  formData.append("file", input.file, input.file.name);

  const response = await client.post<unknown>(registerFilePath, {
    body: formData,
    retryOnUnauthorized: false,
  });
  const result = registerFileResponseSchema.safeParse(response);

  if (!result.success) {
    throw ApiError.protocol("POST", registerFilePath);
  }

  return result.data;
}
