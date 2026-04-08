import { useFakeAuthContext } from "../../../shared/lib/fake-auth";

export function useAuth() {
  return useFakeAuthContext();
}