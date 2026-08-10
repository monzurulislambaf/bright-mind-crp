import "server-only";
import { AuditLog } from "@/models/AuditLog";
import { nextId } from "@/lib/ids";

export interface AuditInput {
  actor?: string;
  actorUserId?: string;
  action: string;
  resource: string;
  resourceType?: string;
  resourceId?: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Central audit service. Fire-and-forget writes; never fails the caller.
 * Mandatory for significant changes (design §26).
 */
export async function writeAuditLog(input: AuditInput): Promise<void> {
  try {
    let auditId: string | undefined;
    try {
      auditId = await nextId("AUD");
    } catch {
      auditId = undefined;
    }

    await AuditLog.create({
      auditId,
      actor: input.actor,
      actorUserId: input.actorUserId,
      action: input.action,
      resource: input.resource,
      resourceType: input.resourceType ?? input.resource,
      resourceId: input.resourceId,
      oldValue: input.oldValue,
      newValue: input.newValue,
      ip: input.ip,
      ipAddress: input.ip,
      userAgent: input.userAgent,
      metadata: input.metadata,
    });
  } catch (error) {
    console.error("Audit log write failed", error);
  }
}

export async function listAuditLogs(
  filter: Partial<{ actor: string; resource: string; resourceId: string }>,
  options: { limit?: number; skip?: number } = {}
) {
  const query: Record<string, unknown> = {};
  if (filter.actor) query.actor = filter.actor;
  if (filter.resource) query.resource = filter.resource;
  if (filter.resourceId) query.resourceId = filter.resourceId;

  return AuditLog.find(query)
    .sort({ createdAt: -1 })
    .limit(options.limit ?? 50)
    .skip(options.skip ?? 0)
    .lean();
}
