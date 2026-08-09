"use server";

import { revalidatePath } from "next/cache";
import { Psychologist, PSYCHOLOGIST_STATUS } from "@/models/Psychologist";
import { connectToDatabase } from "@/lib/db";
import { writeAuditLog } from "@/services/audit";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";
import { notify } from "@/services/notifications";
import type { NotificationType } from "@/models/Notification";

export type ReviewState = { ok: boolean; message?: string } | undefined;

const APPROVAL_STEPS: Array<(typeof PSYCHOLOGIST_STATUS)[number]> = [
  "Pending",
  "Under Review",
  "More Information Required",
  "Approved",
  "Rejected",
  "Suspended",
];

export async function reviewPsychologist(
  psychologistId: string,
  to: string,
  rejectReason?: string
): Promise<ReviewState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "processors:review")) {
    return { ok: false, message: "Permission denied." };
  }
  if (!APPROVAL_STEPS.includes(to as (typeof PSYCHOLOGIST_STATUS)[number])) {
    return { ok: false, message: "Invalid status." };
  }

  await connectToDatabase();
  const p = await Psychologist.findById(psychologistId);
  if (!p) return { ok: false, message: "Psychologist not found." };

  const from = p.status;
  p.status = to as (typeof PSYCHOLOGIST_STATUS)[number];
  if (to === "Approved") {
    p.approvedAt = new Date();
    p.rejectedReason = "";
  }
  if (to === "Rejected" || to === "More Information Required") {
    p.rejectedReason = rejectReason?.trim() || p.rejectedReason || "";
  }
  await p.save();

  if (p.userId) {
    const type: NotificationType =
      to === "Approved"
        ? "case_assignment"
        : to === "Rejected" || to === "More Information Required"
        ? "info_request"
        : "quality_review";
    await notify({
      userId: String(p.userId),
      type,
      title:
        to === "Approved"
          ? "Your application was approved"
          : to === "More Information Required"
          ? "More information required"
          : to === "Rejected"
          ? "Application not approved"
          : "Your status changed",
      body: p.rejectedReason || undefined,
      link: "/portal/psychologist/profile",
    });
  }

  await writeAuditLog({
    actor: user.id,
    action: "psychologist.review",
    resource: "psychologist",
    resourceId: p.psychologistId,
    metadata: { from, to },
  });

  revalidatePath("/crm/psychologists");
  return { ok: true, message: `Application marked as ${to}.` };
}

export async function suspendPsychologist(
  psychologistId: string,
  reason?: string
): Promise<ReviewState> {
  return reviewPsychologist(psychologistId, "Suspended", reason);
}