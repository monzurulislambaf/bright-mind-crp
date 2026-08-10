import "server-only";
import type { Role } from "@/lib/auth/roles";
import {
  canAccessClinical,
  hasPermission,
  isInternal,
  scopeForPermission,
  type Permission,
} from "@/lib/auth/permissions";
import type { PermissionScope } from "@/lib/auth/scopes";

/**
 * Record-level security context (design §33).
 * Checks: ROLE → ORGANISATION → ASSIGNMENT → DOCUMENT PERMISSION.
 */
export type AccessContext = {
  userId: string;
  role: Role;
  organisationId?: string | null;
  teamId?: string | null;
  /** Psychologist / client person profile id when external. */
  personId?: string | null;
};

export type ResourceAccessInput = {
  ownerId?: string | null;
  organisationId?: string | null;
  teamId?: string | null;
  assignedUserIds?: string[];
  assignedPsychologistId?: string | null;
  participantUserIds?: string[];
  /** Document released to external parties. */
  released?: boolean;
  isClinical?: boolean;
};

export function assertPermission(
  ctx: AccessContext,
  permission: Permission
): void {
  if (!hasPermission(ctx.role, permission)) {
    throw new Error("Not authorised.");
  }
}

/**
 * Evaluate whether a user may access a specific record given role scope.
 */
export function canAccessRecord(
  ctx: AccessContext,
  permission: Permission,
  resource: ResourceAccessInput
): boolean {
  if (!hasPermission(ctx.role, permission)) return false;

  if (resource.isClinical && !canAccessClinical(ctx.role)) {
    return false;
  }

  const scope: PermissionScope | null = scopeForPermission(ctx.role, permission);
  if (!scope || scope === "ALL") {
    if (isInternal(ctx.role)) return true;
  }

  switch (scope) {
    case "ALL":
      return true;

    case "OWN":
    case "OWN_PROFILE":
      if (resource.ownerId && resource.ownerId === ctx.userId) return true;
      if (
        ctx.personId &&
        resource.assignedPsychologistId &&
        resource.assignedPsychologistId === ctx.personId
      ) {
        return true;
      }
      if (resource.participantUserIds?.includes(ctx.userId)) return true;
      return resource.ownerId === ctx.userId;

    case "OWN_TEAM":
      if (resource.ownerId === ctx.userId) return true;
      if (
        ctx.teamId &&
        resource.teamId &&
        resource.teamId === ctx.teamId
      ) {
        return true;
      }
      // Team scoping without team graph: allow internal sales peers via ALL-like team read
      return isInternal(ctx.role) && !!resource.ownerId;

    case "ORGANISATION":
      if (!ctx.organisationId || !resource.organisationId) return false;
      return ctx.organisationId === resource.organisationId;

    case "ASSIGNED":
    case "CASE_ASSIGNED":
      if (resource.assignedUserIds?.includes(ctx.userId)) return true;
      if (
        ctx.personId &&
        resource.assignedPsychologistId === ctx.personId
      ) {
        return true;
      }
      if (resource.participantUserIds?.includes(ctx.userId)) return true;
      if (resource.ownerId === ctx.userId) return true;
      // Master/ops with ALL already returned; assigned-only roles stop here
      if (ctx.role === "MASTER_ADMIN" || ctx.role === "OPERATIONS") return true;
      return false;

    default:
      return false;
  }
}

/** Document ACL: upload ≠ automatic visibility (design §16). */
export function canAccessDocument(
  ctx: AccessContext,
  doc: {
    ownerId?: string | null;
    organisationId?: string | null;
    released?: boolean;
    distributedUserIds?: string[];
    explicitPermission?: boolean;
    isClinical?: boolean;
  }
): boolean {
  if (doc.isClinical && !canAccessClinical(ctx.role)) return false;

  if (ctx.role === "MASTER_ADMIN" || ctx.role === "OPERATIONS") return true;

  if (doc.ownerId && doc.ownerId === ctx.userId) return true;

  if (doc.explicitPermission) return true;

  if (doc.distributedUserIds?.includes(ctx.userId)) return true;

  if (
    doc.released &&
    ctx.organisationId &&
    doc.organisationId &&
    ctx.organisationId === doc.organisationId
  ) {
    return true;
  }

  if (
    doc.released &&
    (ctx.role === "INDIVIDUAL_CLIENT" ||
      ctx.role === "SOLICITOR" ||
      ctx.role === "SOLICITOR_FIRM_ADMIN")
  ) {
    // Released docs still need org/ownership match for clients/solicitors
    if (doc.ownerId === ctx.userId) return true;
    if (
      ctx.organisationId &&
      doc.organisationId &&
      ctx.organisationId === doc.organisationId
    ) {
      return true;
    }
  }

  return false;
}
