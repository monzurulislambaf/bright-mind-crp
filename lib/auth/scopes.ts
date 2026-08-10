/** Permission scopes — design §6. Combined with RBAC for record-level access. */
export type PermissionScope =
  | "ALL"
  | "OWN"
  | "OWN_TEAM"
  | "ASSIGNED"
  | "ORGANISATION"
  | "CASE_ASSIGNED"
  | "OWN_PROFILE";

export const PERMISSION_SCOPES: readonly PermissionScope[] = [
  "ALL",
  "OWN",
  "OWN_TEAM",
  "ASSIGNED",
  "ORGANISATION",
  "CASE_ASSIGNED",
  "OWN_PROFILE",
] as const;

export type ScopedPermission = {
  permission: string;
  scope: PermissionScope;
};
