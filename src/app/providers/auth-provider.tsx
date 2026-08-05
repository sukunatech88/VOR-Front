import { Auth0Provider, type AppState } from "@auth0/auth0-react";
import { useCallback, type PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";

import { VOR_AUTHORIZATION_SCOPE } from "../../core/auth/permissions";
import { getAppEnv } from "../../core/config/env";

function isInternalPath(path: string) {
  return path.startsWith("/") && !path.startsWith("//");
}

export function AuthProvider({ children }: PropsWithChildren) {
  const { auth0Audience, auth0ClientId, auth0Domain } = getAppEnv();
  const navigate = useNavigate();
  const authCallbackUri = `${window.location.origin}/auth/callback`;
  const handleRedirectCallback = useCallback(
    (appState?: AppState) => {
      const requestedPath = appState?.returnTo;
      const returnTo =
        typeof requestedPath === "string" && isInternalPath(requestedPath)
          ? requestedPath
          : "/dashboard";

      navigate(returnTo, { replace: true });
    },
    [navigate],
  );

  return (
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      authorizationParams={{
        audience: auth0Audience,
        redirect_uri: authCallbackUri,
        scope: VOR_AUTHORIZATION_SCOPE,
      }}
      cacheLocation="memory"
      onRedirectCallback={handleRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
}
