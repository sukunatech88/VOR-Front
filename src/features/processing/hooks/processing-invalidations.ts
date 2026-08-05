import type { QueryClient } from "@tanstack/react-query";

export async function invalidateProcessingQueries(
  queryClient: QueryClient,
  identifiers: { fileId?: string; messageId?: string },
  options: { allTimelines?: boolean } = {},
) {
  const invalidations = [
    queryClient.invalidateQueries({ queryKey: ["operations", "files"] }),
    queryClient.invalidateQueries({ queryKey: ["operations", "messages"] }),
    queryClient.invalidateQueries({ queryKey: ["operations", "dashboard"] }),
  ];

  if (identifiers.fileId) {
    invalidations.push(
      queryClient.invalidateQueries({
        queryKey: ["operations", "files", "detail", identifiers.fileId],
      }),
    );
  }

  if (identifiers.messageId) {
    invalidations.push(
      queryClient.invalidateQueries({
        queryKey: [
          "operations",
          "messages",
          "detail",
          identifiers.messageId,
        ],
      }),
      queryClient.invalidateQueries({
        queryKey: ["operations", "timeline", identifiers.messageId],
      }),
    );
  }

  if (options.allTimelines) {
    invalidations.push(
      queryClient.invalidateQueries({
        queryKey: ["operations", "timeline"],
      }),
    );
  }

  await Promise.all(invalidations);
}
