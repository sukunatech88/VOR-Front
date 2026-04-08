import type { PropsWithChildren } from "react";

import { QueryProvider } from "./query-provider";
import { FakeAuthProvider } from "../../shared/lib/fake-auth";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <FakeAuthProvider>{children}</FakeAuthProvider>
    </QueryProvider>
  );
}