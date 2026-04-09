import { useQuery } from "@tanstack/react-query";

import {
  getFileRegistry,
  type FileRegistryFilters,
} from "../api/file-registry.api";

export function useFileRegistry(filters: FileRegistryFilters) {
  return useQuery({
    queryKey: ["file-registry", filters],
    queryFn: () => getFileRegistry(filters),
  });
}