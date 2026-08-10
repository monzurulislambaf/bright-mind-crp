"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { Report } from "@/models/Report";
import { Case } from "@/models/Case";
import { Psychologist } from "@/models/Psychologist";
import { connectToDatabase } from "@/lib/db";
import { nextId } from "@/lib/ids";
import { writeAuditLog } from "@/services/audit";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";
import { notify } from "@/services/notifications";

export type ReportActionState = { ok: boolean; message?: string } | undefined;

const caseLink = (caseId: string) => `/crm/cases/${caseId}`;

export async function createReport(
  _prev: ReportActionState,
  formData: FormData
): Promise<ReportActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "reports:create")) {
    return { ok: false, message: "Permission denied." };
  }
  const caseRaw = String(formData.get("case") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!caseRaw) return { ok: false, message: "A case is required." };
  if (!title) return { ok: false, message: "A title is required." };

  await connectToDatabase();
  const caze = await Case.findById(caseRaw);
  if (!caze) return { ok: false, message: "Case not found." };

  let author: mongoose.Types.ObjectId | undefined;
  let authorName: string | undefined;
  if (user.role === "PSYCHOLOGIST") {
    const p = await Psychologist.findOne({ userId: user.id }).lean();
    if (p) {
      author = p._id;
      authorName = `${p.firstName} ${p.lastName}`.trim() || "Psychologist";
    }
  }

  const report = await Report.create({
    reportId: await nextId("RPT"),
    case: new mongoose.Types.ObjectId(caseRaw),
    title,
    body,
    author,
    authorName,
    createdBy: new mongoose.Types.ObjectId(user.id),
    currentVersion: 1,
    versions: [{ version: 1, title, body, author, authorName, submittedBy: user.id }],
  });

  await writeAuditLog({
    actor: user.id,
    action: "report.created",
    resource: "report",
    resourceId: report.reportId,
  });
  revalidatePath(caseLink(caseRaw));
  revalidatePath("/crm/reports");
  revalidatePath("/portal/psychologist");
  return { ok: true, message: `Report ${report.reportId} created.` };
}

export async function updateReportDraft(
  reportId: string,
  title: string,
  body: string
): Promise<ReportActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "reports:create")) {
    return { ok: false, message: "Permission denied." };
  }
  await connectToDatabase();
  const report = await Report.findById(reportId);
  if (!report) return { ok: false, message: "Report not found." };
  if (report.status !== "Draft" && report.status !== "Amendment") {
    return { ok: false, message: "Only draft reports can be edited." };
  }
  if (user.role === "PSYCHOLOGIST") {
    const p = await Psychologist.findOne({ userId: user.id }).lean();
    if (!p || String(p._id) !== String(report.author)) {
      return { ok: false, message: "You are not the report author." };
    }
  }

  const nextVersion = report.currentVersion + 1;
  report.title = title || report.title;
  report.body = body;
  report.currentVersion = nextVersion;
  report.versions.push({
    version: nextVersion,
    title: report.title,
    body,
    author: report.author,
    authorName: report.authorName,
    submittedBy: user.id,
  });

  await report.save();
  await writeAuditLog({
    actor: user.id,
    action: "report.revised",
    resource: "report",
    resourceId: report.reportId,
  });
  revalidatePath(caseLink(String(report.case)));
  revalidatePath("/crm/reports");
  revalidatePath("/portal/psychologist");
  return { ok: true, message: `Revision v${nextVersion} saved.` };
}

export async function submitForReview(reportId: string): Promise<ReportActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "reports:create")) {
    return { ok: false, message: "Permission denied." };
  }
  await connectToDatabase();
  const report = await Report.findById(reportId);
  if (!report) return { ok: false, message: "Report not found." };
  if (report.status !== "Draft" && report.status !== "Amendment") {
    return { ok: false, message: "Only draft/amendment reports can be submitted." };
  }
  report.status = "Quality Review";
  report.reviewNote = undefined;
  await report.save();

  await notify({
    userId: String(report.createdBy),
    type: "quality_review",
    title: "Report submitted for quality review",
    body: report.reportId,
    link: caseLink(String(report.case)),
  });
  await writeAuditLog({
    actor: user.id,
    action: "report.submitted",
    resource: "report",
    resourceId: report.reportId,
  });
  revalidatePath(caseLink(String(report.case)));
  revalidatePath("/crm/reports");
  revalidatePath("/portal/psychologist");
  return { ok: true, message: "Report submitted for quality review." };
}

export async function reviewReport(
  reportId: string,
  decision: "approve" | "amend",
  note: string
): Promise<ReportActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "reports:review")) {
    return { ok: false, message: "Permission denied." };
  }
  await connectToDatabase();
  const report = await Report.findById(reportId);
  if (!report) return { ok: false, message: "Report not found." };
  if (report.status !== "Quality Review") {
    return { ok: false, message: "Only reports in quality review can be reviewed." };
  }
  report.reviewer = new mongoose.Types.ObjectId(user.id);
  report.reviewNote = note || undefined;
  report.reviewedAt = new Date();
  report.reviewDecision = decision;
  report.status = decision === "approve" ? "Approved" : "Amendment";

  await notify({
    userId: String(report.createdBy),
    type: "report_update",
    title:
      decision === "approve"
        ? "Report approved"
        : "Amendments requested",
    body: report.reportId,
    link: caseLink(String(report.case)),
  });
  await writeAuditLog({
    actor: user.id,
    action: decision === "approve" ? "report.approved" : "report.amendment",
    resource: "report",
    resourceId: report.reportId,
  });
  revalidatePath(caseLink(String(report.case)));
  revalidatePath("/crm/reports");
  return { ok: true, message: decision === "approve" ? "Report approved." : "Amendments requested." };
}

export async function finalizeReport(reportId: string): Promise<ReportActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "reports:approve")) {
    return { ok: false, message: "Permission denied." };
  }
  await connectToDatabase();
  const report = await Report.findById(reportId);
  if (!report) return { ok: false, message: "Report not found." };
  if (report.status !== "Approved") {
    return { ok: false, message: "Only approved reports can be finalised." };
  }
  report.status = "Final";
  await report.save();
  await writeAuditLog({
    actor: user.id,
    action: "report.final",
    resource: "report",
    resourceId: report.reportId,
  });
  revalidatePath(caseLink(String(report.case)));
  revalidatePath("/crm/reports");
  return { ok: true, message: "Report marked as Final." };
}

export async function releaseReport(reportId: string): Promise<ReportActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "reports:release")) {
    return { ok: false, message: "Permission denied." };
  }
  await connectToDatabase();
  const report = await Report.findById(reportId);
  if (!report) return { ok: false, message: "Report not found." };
  if (report.status !== "Final") {
    return { ok: false, message: "Only final reports can be released." };
  }
  report.status = "Released";
  report.releasedAt = new Date();
  report.releasedBy = new mongoose.Types.ObjectId(user.id);
  await report.save();

  const caze = await Case.findById(report.case);
  if (caze) {
    caze.status = "Secure Release";
    await caze.save();
  }

  await notify({
    userId: String(report.createdBy),
    type: "report_release",
    title: "Report released",
    body: report.reportId,
    link: caseLink(String(report.case)),
  });
  await writeAuditLog({
    actor: user.id,
    action: "report.released",
    resource: "report",
    resourceId: report.reportId,
  });
  revalidatePath(caseLink(String(report.case)));
  revalidatePath("/crm/reports");
  revalidatePath("/portal/solicitor");
  revalidatePath("/portal/individual");
  return { ok: true, message: "Report released securely." };
}