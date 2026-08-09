import "server-only";
import { AuditLog } from "@/models/AuditLog";

export interface AuditInput {
  actor?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Central audit service. Fire-and-forget writes; never fails the caller.
 */
export async function writeAuditLog(input: AuditInput): Promise<void> {
  try {
    await AuditLog.create({
      actor: input.actor,
      action: input.action,
      resource: input.resource,
      resourceId: input.resourceId,
      ip: input.ip,
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