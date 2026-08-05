export const VOR_PERMISSIONS = [
  "operations:read",
  "files:register",
  "messages:process",
  "status-reports:apply",
  "dispatch:execute",
  "poller:run",
  "bank-connections:manage",
  "bank-connections:test",
  "bank-connections:lifecycle",
] as const;

export type VorPermission = (typeof VOR_PERMISSIONS)[number];

export const VOR_AUTHORIZATION_SCOPE = [
  "openid",
  "profile",
  "email",
  ...VOR_PERMISSIONS,
].join(" ");
