import { useQuery } from "@tanstack/react-query";

import { useApiClient } from "../../../core/http/api-client-context";
import type { ApiError } from "../../../core/http/api-error";
import { getOperationsFile } from "../api/file-registry.api";
import { fileIdSchema } from "../schemas/file-registry.schemas";
import type { OperationsFileDetails } from "../types/file-registry.types";

export function useFileRegistryDetail(fileId: string) {
  const client = useApiClient();
  const isValidFileId = fileIdSchema.safeParse(fileId).success;

  return useQuery<OperationsFileDetails, ApiError>({
    queryKey: ["operations", "files", "detail", fileId],
    queryFn: ({ signal }) => getOperationsFile(client, fileId, signal),
    enabled: isValidFileId,
  });
}
