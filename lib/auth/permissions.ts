import { INTERNAL_ROLES, type InternalRole, type Role } from "@/lib/auth/roles";

/** Permission resource namespaced as "resource:action" e.g. "leads:read". */
export type Permission =
  | "users:read"
  | "users:create"
  | "users:update"
  | "users:delete"
  | "roles:read"
  | "leads:read"
  | "leads:create"
  | "leads:update"
  | "leads:delete"
  | "leads:import"
  | "cases:read"
  | "cases:create"
  | "cases:update"
  | "cases:assign"
  | "cases:release"
  | "reports:read"
  | "reports:create"
  | "reports:review"
  | "reports:approve"
  | "reports:release"
  | "documents:read"
  | "documents:create"
  | "documents:delete"
  | "appointments:read"
  | "appointments:create"
  | "tasks:read"
  | "tasks:create"
  | "tasks:update"
  | "tickets:read"
  | "tickets:create"
  | "finance:read"
  | "processors:review"
  | "organisation:read"
  | "audit:read"
  | "settings:manage";

const ALL_PERMISSIONS: Permission[] = [
  "users:read",
  "users:create",
  "users:update",
  "users:delete",
  "roles:read",
  "leads:read",
  "leads:create",
  "leads:update",
  "leads:delete",
  "leads:import",
  "cases:read",
  "cases:create",
  "cases:update",
  "cases:assign",
  "cases:release",
  "reports:read",
  "reports:create",
  "reports:review",
  "reports:approve",
  "reports:release",
  "documents:read",
  "documents:create",
  "documents:delete",
  "appointments:read",
  "appointments:create",
  "tasks:read",
  "tasks:create",
  "tasks:update",
  "tickets:read",
  "tickets:create",
  "finance:read",
  "processors:review",
  "organisation:read",
  "audit:read",
  "settings:manage",
];

/** Complete set of permissions for a role. */
const definition: Record<Role, Permission[]> = {
  MASTER_ADMIN: ALL_PERMISSIONS,
  SYSTEM_ADMIN: ALL_PERMISSIONS,
  OPERATIONS: [
    "users:read",
    "leads:read",
    "leads:update",
    "cases:read",
    "cases:create",
    "cases:update",
    "cases:assign",
    "reports:read",
    "documents:read",
    "documents:create",
    "appointments:read",
    "appointments:create",
    "tasks:read",
    "tasks:create",
    "tasks:update",
    "tickets:read",
    "tickets:create",
    "finance:read",
  ],
  CASEWORKER: [
    "users:read",
    "leads:read",
    "cases:read",
    "cases:create",
    "cases:update",
    "cases:assign",
    "reports:read",
    "reports:create",
    "documents:read",
    "documents:create",
    "appointments:read",
    "appointments:create",
    "tasks:read",
    "tasks:create",
    "tasks:update",
    "tickets:read",
    "tickets:create",
  ],
  QUALITY_REVIEW: [
    "users:read",
    "cases:read",
    "reports:read",
    "reports:review",
    "reports:approve",
    "documents:read",
    "tasks:read",
    "tickets:read",
  ],
  FINANCE: [
    "users:read",
    "leads:read",
    "cases:read",
    "documents:read",
    "finance:read",
    "tasks:read",
    "tickets:read",
  ],
  MARKETING: ["leads:read", "leads:create", "leads:update", "tasks:read"],
  SALES_MANAGER: [
    "users:read",
    "leads:read",
    "leads:create",
    "leads:update",
    "leads:delete",
    "leads:import",
    "cases:read",
    "tasks:read",
    "tasks:create",
    "tasks:update",
    "tickets:read",
  ],
  SALES_AGENT: [
    "leads:read",
    "leads:create",
    "leads:update",
    "tasks:read",
    "tasks:create",
    "tasks:update",
    "tickets:read",
  ],
  SOLICITOR_FIRM_ADMIN: [
    "users:update",
    "cases:read",
    "reports:read",
    "documents:read",
    "documents:create",
    "appointments:read",
    "tasks:read",
    "tickets:read",
    "tickets:create",
    "finance:read",
  ],
  SOLICITOR: [
    "cases:read",
    "reports:read",
    "documents:read",
    "documents:create",
    "appointments:read",
    "tasks:read",
    "tickets:read",
    "tickets:create",
    "finance:read",
  ],
  PSYCHOLOGIST: [
    "users:update",
    "cases:read",
    "reports:read",
    "reports:create",
    "documents:read",
    "documents:create",
    "appointments:read",
    "appointments:create",
    "tasks:read",
    "tickets:read",
  ],
  INDIVIDUAL_CLIENT: [
    "users:update",
    "cases:read",
    "reports:read",
    "documents:read",
    "documents:create",
    "appointments:read",
    "tickets:read",
    "tickets:create",
    "finance:read",
  ],
};

export function hasPermission(
  role: Role | undefined,
  permission: Permission | Permission[]
): boolean {
  if (!role) return false;
  const allowed = definition[role] ?? [];
  const required = Array.isArray(permission) ? permission : [permission];
  return required.every((p) => allowed.includes(p));
}

export function permissionsForRole(role: Role | undefined): Permission[] {
  if (!role) return [];
  return definition[role] ?? [];
}

export function isInternal(role: Role | undefined): boolean {
  return role !== undefined && INTERNAL_ROLES.includes(role as InternalRole);
}