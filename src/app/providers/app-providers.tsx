import type { PropsWithChildren } from "react";

import { ApiClientProvider } from "./api-client-provider";
import { AuthProvider } from "./auth-provider";
import { QueryProvider } from "./query-provider";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ApiClientProvider>{children}</ApiClientProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
