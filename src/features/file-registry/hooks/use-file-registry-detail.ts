import { useQuery } from "@tanstack/react-query";

import { getFileRegistryById } from "../api/file-registry.api";

export function useFileRegistryDetail(fileId: string) {
  return useQuery({
    queryKey: ["file-registry-detail", fileId],
    queryFn: () => getFileRegistryById(fileId),
    enabled: Boolean(fileId),
  });
}