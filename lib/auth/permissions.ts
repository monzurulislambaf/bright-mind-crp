import { INTERNAL_ROLES, type InternalRole, type Role } from "@/lib/auth/roles";
import type { PermissionScope } from "@/lib/auth/scopes";

/**
 * Permission format: resource:action (design §5 uses resource.action —
 * colon kept for existing code compatibility).
 */
export type Permission =
  | "users:read"
  | "users:create"
  | "users:update"
  | "users:delete"
  | "roles:read"
  | "roles:manage"
  | "leads:read"
  | "leads:create"
  | "leads:update"
  | "leads:delete"
  | "leads:import"
  | "leads:assign"
  | "leads:convert"
  | "contacts:read"
  | "contacts:create"
  | "contacts:update"
  | "organisation:read"
  | "organisation:create"
  | "organisation:update"
  | "campaigns:read"
  | "campaigns:manage"
  | "onboarding:read"
  | "onboarding:create"
  | "onboarding:update"
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
  | "documents:download"
  | "documents:release"
  | "appointments:read"
  | "appointments:create"
  | "appointments:update"
  | "tasks:read"
  | "tasks:create"
  | "tasks:update"
  | "tasks:assign"
  | "tickets:read"
  | "tickets:create"
  | "tickets:update"
  | "finance:read"
  | "finance:create"
  | "finance:update"
  | "quotations:read"
  | "quotations:create"
  | "invoices:read"
  | "invoices:create"
  | "payments:read"
  | "payments:update"
  | "processors:review"
  | "audit:read"
  | "export:create"
  | "settings:manage"
  | "notifications:read";

export type PermissionDef = {
  permission: Permission;
  scope: PermissionScope;
};

const ALL_PERMISSIONS: Permission[] = [
  "users:read",
  "users:create",
  "users:update",
  "users:delete",
  "roles:read",
  "roles:manage",
  "leads:read",
  "leads:create",
  "leads:update",
  "leads:delete",
  "leads:import",
  "leads:assign",
  "leads:convert",
  "contacts:read",
  "contacts:create",
  "contacts:update",
  "organisation:read",
  "organisation:create",
  "organisation:update",
  "campaigns:read",
  "campaigns:manage",
  "onboarding:read",
  "onboarding:create",
  "onboarding:update",
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
  "documents:download",
  "documents:release",
  "appointments:read",
  "appointments:create",
  "appointments:update",
  "tasks:read",
  "tasks:create",
  "tasks:update",
  "tasks:assign",
  "tickets:read",
  "tickets:create",
  "tickets:update",
  "finance:read",
  "finance:create",
  "finance:update",
  "quotations:read",
  "quotations:create",
  "invoices:read",
  "invoices:create",
  "payments:read",
  "payments:update",
  "processors:review",
  "audit:read",
  "export:create",
  "settings:manage",
  "notifications:read",
];

function scoped(
  permissions: Permission[],
  scope: PermissionScope
): PermissionDef[] {
  return permissions.map((permission) => ({ permission, scope }));
}

/** Role → permission + scope matrix (design §§28–32). */
const definition: Record<Role, PermissionDef[]> = {
  MASTER_ADMIN: scoped(ALL_PERMISSIONS, "ALL"),

  SYSTEM_ADMIN: [
    ...scoped(
      [
        "users:read",
        "users:create",
        "users:update",
        "users:delete",
        "roles:read",
        "roles:manage",
        "settings:manage",
        "audit:read",
        "organisation:read",
        "organisation:create",
        "organisation:update",
        "notifications:read",
      ],
      "ALL"
    ),
    ...scoped(
      ["leads:read", "cases:read", "finance:read", "documents:read", "tasks:read", "tickets:read"],
      "ALL"
    ),
  ],

  OPERATIONS: [
    ...scoped(
      [
        "contacts:read",
        "contacts:create",
        "contacts:update",
        "organisation:read",
        "organisation:create",
        "organisation:update",
        "onboarding:read",
        "onboarding:create",
        "onboarding:update",
        "cases:read",
        "cases:create",
        "cases:update",
        "cases:assign",
        "tasks:read",
        "tasks:create",
        "tasks:update",
        "tasks:assign",
        "tickets:read",
        "tickets:create",
        "tickets:update",
        "appointments:read",
        "appointments:create",
        "appointments:update",
        "documents:read",
        "documents:create",
        "documents:download",
        "reports:read",
        "finance:read",
        "leads:read",
        "leads:update",
        "users:read",
        "notifications:read",
      ],
      "ALL"
    ),
  ],

  CASEWORKER: [
    ...scoped(
      [
        "cases:read",
        "cases:create",
        "cases:update",
        "cases:assign",
        "tasks:read",
        "tasks:create",
        "tasks:update",
        "documents:read",
        "documents:create",
        "documents:download",
        "appointments:read",
        "appointments:create",
        "appointments:update",
        "tickets:read",
        "tickets:create",
        "tickets:update",
        "reports:read",
        "reports:create",
        "leads:read",
        "users:read",
        "notifications:read",
      ],
      "ASSIGNED"
    ),
  ],

  QUALITY_REVIEW: [
    ...scoped(
      [
        "reports:read",
        "reports:review",
        "reports:approve",
        "documents:read",
        "documents:download",
        "cases:read",
        "tasks:read",
        "tickets:read",
        "users:read",
        "notifications:read",
      ],
      "ASSIGNED"
    ),
  ],

  FINANCE: [
    ...scoped(
      [
        "finance:read",
        "finance:create",
        "finance:update",
        "quotations:read",
        "quotations:create",
        "invoices:read",
        "invoices:create",
        "payments:read",
        "payments:update",
        "cases:read",
        "contacts:read",
        "organisation:read",
        "leads:read",
        "users:read",
        "tasks:read",
        "tickets:read",
        "notifications:read",
      ],
      "ALL"
    ),
  ],

  MARKETING: [
    ...scoped(
      [
        "campaigns:read",
        "campaigns:manage",
        "leads:read",
        "leads:create",
        "leads:update",
        "leads:import",
        "contacts:read",
        "contacts:update",
        "tasks:read",
        "notifications:read",
      ],
      "ALL"
    ),
  ],

  SALES_MANAGER: [
    ...scoped(
      [
        "leads:read",
        "leads:create",
        "leads:update",
        "leads:delete",
        "leads:import",
        "leads:assign",
        "leads:convert",
        "contacts:read",
        "contacts:create",
        "contacts:update",
        "onboarding:read",
        "onboarding:create",
        "tasks:read",
        "tasks:create",
        "tasks:update",
        "tasks:assign",
        "tickets:read",
        "users:read",
        "organisation:read",
        "campaigns:read",
        "notifications:read",
      ],
      "OWN_TEAM"
    ),
  ],

  SALES_AGENT: [
    ...scoped(
      [
        "leads:read",
        "leads:create",
        "leads:update",
        "leads:import",
        "leads:convert",
        "contacts:read",
        "contacts:create",
        "contacts:update",
        "onboarding:create",
        "tasks:read",
        "tasks:create",
        "tasks:update",
        "tickets:read",
        "notifications:read",
      ],
      "OWN_TEAM"
    ),
    { permission: "leads:assign", scope: "OWN_TEAM" },
  ],

  SOLICITOR_FIRM_ADMIN: [
    ...scoped(
      [
        "users:read",
        "users:create",
        "users:update",
        "organisation:read",
        "organisation:update",
        "cases:read",
        "cases:create",
        "documents:read",
        "documents:create",
        "documents:download",
        "reports:read",
        "tasks:read",
        "tasks:create",
        "tickets:read",
        "tickets:create",
        "appointments:read",
        "finance:read",
        "quotations:read",
        "invoices:read",
        "notifications:read",
      ],
      "ORGANISATION"
    ),
  ],

  SOLICITOR: [
    ...scoped(
      [
        "cases:read",
        "cases:create",
        "documents:read",
        "documents:create",
        "documents:download",
        "reports:read",
        "tasks:read",
        "tickets:read",
        "tickets:create",
        "appointments:read",
        "finance:read",
        "quotations:read",
        "invoices:read",
        "notifications:read",
      ],
      "ORGANISATION"
    ),
  ],

  PSYCHOLOGIST: [
    ...scoped(
      [
        "users:update",
        "cases:read",
        "cases:update",
        "reports:read",
        "reports:create",
        "documents:read",
        "documents:create",
        "documents:download",
        "appointments:read",
        "appointments:create",
        "appointments:update",
        "tasks:read",
        "tasks:update",
        "tickets:read",
        "tickets:create",
        "finance:read",
        "notifications:read",
      ],
      "CASE_ASSIGNED"
    ),
    { permission: "users:update", scope: "OWN_PROFILE" },
  ],

  INDIVIDUAL_CLIENT: [
    ...scoped(
      [
        "users:update",
        "cases:read",
        "cases:create",
        "reports:read",
        "documents:read",
        "documents:create",
        "documents:download",
        "appointments:read",
        "tickets:read",
        "tickets:create",
        "finance:read",
        "invoices:read",
        "onboarding:read",
        "onboarding:create",
        "notifications:read",
      ],
      "OWN"
    ),
    { permission: "users:update", scope: "OWN_PROFILE" },
  ],
};

function keysFor(role: Role): Permission[] {
  return definition[role]?.map((d) => d.permission) ?? [];
}

export function hasPermission(
  role: Role | undefined,
  permission: Permission | Permission[]
): boolean {
  if (!role) return false;
  const allowed = keysFor(role);
  const required = Array.isArray(permission) ? permission : [permission];
  return required.every((p) => allowed.includes(p));
}

export function permissionsForRole(role: Role | undefined): Permission[] {
  if (!role) return [];
  return keysFor(role);
}

export function scopedPermissionsForRole(role: Role | undefined): PermissionDef[] {
  if (!role) return [];
  return definition[role] ?? [];
}

export function scopeForPermission(
  role: Role | undefined,
  permission: Permission
): PermissionScope | null {
  if (!role) return null;
  const match = definition[role]?.find((d) => d.permission === permission);
  return match?.scope ?? null;
}

export function isInternal(role: Role | undefined): boolean {
  return role !== undefined && INTERNAL_ROLES.includes(role as InternalRole);
}

/** Clinical / report access is never automatic for sales or marketing. */
export function canAccessClinical(role: Role | undefined): boolean {
  if (!role) return false;
  return ![
    "MARKETING",
    "SALES_MANAGER",
    "SALES_AGENT",
    "FINANCE",
  ].includes(role);
}

export { ALL_PERMISSIONS };
