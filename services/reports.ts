import "server-only";
import { Report } from "@/models/Report";
import { Psychologist } from "@/models/Psychologist";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";

export async function listMyReports() {
  const user = await requireAuth();
  if (user.role !== "PSYCHOLOGIST") return [];
  await connectToDatabase();
  const psych = await Psychologist.findOne({ userId: user.id }).lean();
  if (!psych) return [];
  return Report.find({ author: psych._id })
    .populate({ path: "case", select: "caseId reportType status" })
    .sort({ updatedAt: -1 })
    .limit(100)
    .lean();
}

export async function getMyReport(id: string) {
  const user = await requireAuth();
  if (user.role !== "PSYCHOLOGIST") return null;
  await connectToDatabase();
  const psych = await Psychologist.findOne({ userId: user.id }).lean();
  if (!psych) return null;
  return Report.findOne({ _id: id, author: psych._id })
    .populate({ path: "case", select: "caseId reportType status" })
    .lean();
}

export async function listReports({
  status,
  search,
}: {
  status?: string;
  search?: string;
}) {
  const user = await requireAuth();
  if (!hasPermission(user.role, "reports:read")) throw new Error("Not authorised.");
  await connectToDatabase();
  const query: Record<string, unknown> = {};
  if (status) query.status = status;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [
      { reportId: rx },
      { title: rx },
      { status: rx },
      { authorName: rx },
      { reviewNote: rx },
      { reviewDecision: rx },
    ];
  }
  return Report.find(query)
    .populate({ path: "case", select: "caseId reportType status" })
    .sort({ updatedAt: -1 })
    .limit(200)
    .lean();
}

export async function getReport(id: string) {
  const user = await requireAuth();
  if (!hasPermission(user.role, "reports:read")) throw new Error("Not authorised.");
  await connectToDatabase();
  return Report.findById(id)
    .populate({ path: "case", select: "caseId reportType status" })
    .lean();
}

export async function listReportsForCase(caseId: string) {
  const user = await requireAuth();
  if (!hasPermission(user.role, "reports:read")) throw new Error("Not authorised.");
  await connectToDatabase();
  return Report.find({ case: caseId }).sort({ updatedAt: -1 }).lean();
}

export async function reportStats() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "reports:read")) throw new Error("Not authorised.");
  await connectToDatabase();
  const [draft, review, amendment, approved, final, released] = await Promise.all([
    Report.countDocuments({ status: "Draft" }),
    Report.countDocuments({ status: "Quality Review" }),
    Report.countDocuments({ status: "Amendment" }),
    Report.countDocuments({ status: "Approved" }),
    Report.countDocuments({ status: "Final" }),
    Report.countDocuments({ status: "Released" }),
  ]);
  return { draft, review, approved, amendment, final, released };
}