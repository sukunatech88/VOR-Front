import { useAuth0 } from "@auth0/auth0-react";
import { useCallback, useMemo } from "react";

import type { AuthSessionUser } from "../../../core/types/auth";

export interface GetAccessTokenOptions {
  forceRefresh?: boolean;
}

function isInternalPath(path: string) {
  return path.startsWith("/") && !path.startsWith("//");
}

export function useAuth() {
  const {
    error,
    getAccessTokenSilently,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout: logoutWithRedirect,
    user: auth0User,
  } = useAuth0();

  const user = useMemo<AuthSessionUser | null>(() => {
    if (!isAuthenticated || !auth0User?.sub) {
      return null;
    }

    return {
      id: auth0User.sub,
      name: auth0User.name || auth0User.email || "Usuario VOR",
      email: auth0User.email,
      picture: auth0User.picture,
    };
  }, [auth0User, isAuthenticated]);

  const login = useCallback(
    async (requestedReturnTo = "/dashboard") => {
      const returnTo = isInternalPath(requestedReturnTo)
        ? requestedReturnTo
        : "/dashboard";

      await loginWithRedirect({
        appState: { returnTo },
      });
    },
    [loginWithRedirect],
  );

  const logout = useCallback(async () => {
    await logoutWithRedirect({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }, [logoutWithRedirect]);

  const getAccessToken = useCallback(
    (options?: GetAccessTokenOptions) =>
      options?.forceRefresh
        ? getAccessTokenSilently({ cacheMode: "off" })
        : getAccessTokenSilently(),
    [getAccessTokenSilently],
  );

  return useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      logout,
      getAccessToken,
    }),
    [
      error,
      getAccessToken,
      isAuthenticated,
      isLoading,
      login,
      logout,
      user,
    ],
  );
}
