import "server-only";
import { Psychologist, PSYCHOLOGIST_STATUS } from "@/models/Psychologist";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";

export async function listPsychologists({ status }: { status?: string }) {
  const user = await requireAuth();
  if (!hasPermission(user.role, "cases:read") && !hasPermission(user.role, "processors:review")) {
    throw new Error("Not authorised.");
  }
  await connectToDatabase();
  const query: Record<string, unknown> = {};
  if (status && PSYCHOLOGIST_STATUS.includes(status as (typeof PSYCHOLOGIST_STATUS)[number])) {
    query.status = status;
  }
  return Psychologist.find(query).sort({ createdAt: -1 }).limit(200).lean();
}

export async function psychologistStats() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "cases:read") && !hasPermission(user.role, "processors:review")) {
    throw new Error("Not authorised.");
  }
  await connectToDatabase();
  const [pending, underReview, moreInfo, approved, rejected, suspended] = await Promise.all([
    Psychologist.countDocuments({ status: "Pending" }),
    Psychologist.countDocuments({ status: "Under Review" }),
    Psychologist.countDocuments({ status: "More Information Required" }),
    Psychologist.countDocuments({ status: "Approved" }),
    Psychologist.countDocuments({ status: "Rejected" }),
    Psychologist.countDocuments({ status: "Suspended" }),
  ]);
  return { pending, underReview, moreInfo, approved, rejected, suspended };
}

export async function getPsychologistForReview(id: string) {
  const user = await requireAuth();
  if (!hasPermission(user.role, "cases:read") && !hasPermission(user.role, "processors:review")) {
    throw new Error("Not authorised.");
  }
  await connectToDatabase();
  return Psychologist.findById(id).lean();
}