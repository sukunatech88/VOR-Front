export type AppRole = "admin" | "operator" | "viewer";

export interface AuthSessionUser {
  id: string;
  name: string;
  email: string;
  role: AppRole;
}