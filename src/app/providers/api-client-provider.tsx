import { useMemo, type PropsWithChildren } from "react";

import { getAppEnv } from "../../core/config/env";
import { createApiClient } from "../../core/http/api-client";
import { ApiClientContext } from "../../core/http/api-client-context";
import { useAuth } from "../../features/auth/hooks/use-auth";

export function ApiClientProvider({ children }: PropsWithChildren) {
  const { getAccessToken } = useAuth();
  const { apiBaseUrl } = getAppEnv();
  const client = useMemo(
    () =>
      createApiClient({
        baseUrl: apiBaseUrl,
        getAccessToken,
      }),
    [apiBaseUrl, getAccessToken],
  );

  return (
    <ApiClientContext.Provider value={client}>
      {children}
    </ApiClientContext.Provider>
  );
}
