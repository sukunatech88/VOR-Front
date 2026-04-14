import { useQuery } from "@tanstack/react-query";

import { getMessageHubById } from "../api/message-hub.api";

export function useMessageHubDetail(messageId: string) {
  return useQuery({
    queryKey: ["message-hub-detail", messageId],
    queryFn: () => getMessageHubById(messageId),
    enabled: Boolean(messageId),
  });
}