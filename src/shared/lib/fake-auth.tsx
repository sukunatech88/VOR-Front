import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import type { AuthSessionUser } from "../../core/types/auth";

interface FakeAuthContextValue {
  user: AuthSessionUser | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const FakeAuthContext = createContext<FakeAuthContextValue | null>(null);

const defaultUser: AuthSessionUser = {
  id: "user-001",
  name: "Sukuna Operator",
  email: "operator@vor.local",
  role: "operator",
};

export function FakeAuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthSessionUser | null>(null);

  const value = useMemo<FakeAuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: (email: string) => {
        setUser({
          ...defaultUser,
          email,
          name: email.split("@")[0] || defaultUser.name,
        });
      },
      logout: () => {
        setUser(null);
      },
    }),
    [user],
  );

  return <FakeAuthContext.Provider value={value}>{children}</FakeAuthContext.Provider>;
}

export function useFakeAuthContext() {
  const context = useContext(FakeAuthContext);

  if (!context) {
    throw new Error("useFakeAuthContext must be used within FakeAuthProvider");
  }

  return context;
}