import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "../../../core/http/api-client-context";
import type { ApiError } from "../../../core/http/api-error";
import { registerFile } from "../api/file-registry.api";
import type {
  RegisterFileInput,
  RegisterFileResponse,
} from "../types/file-registry.types";

export function useRegisterFile() {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation<RegisterFileResponse, ApiError, RegisterFileInput>({
    mutationFn: (input) => registerFile(client, input),
    retry: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["operations", "files"],
      });
    },
  });
}
