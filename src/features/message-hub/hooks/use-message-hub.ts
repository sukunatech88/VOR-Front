import { useQuery } from "@tanstack/react-query";

import { getMessageHub, type MessageHubFilters } from "../api/message-hub.api";

export function useMessageHub(filters: MessageHubFilters) {
  return useQuery({
    queryKey: ["message-hub", filters],
    queryFn: () => getMessageHub(filters),
  });
}