"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import mongoose from "mongoose";
import { Case, CASE_STATUS } from "@/models/Case";
import type { CaseStatus } from "@/models/Case";
import { Psychologist } from "@/models/Psychologist";
import { connectToDatabase } from "@/lib/db";
import { buildYearId } from "@/lib/ids";
import { writeAuditLog } from "@/services/audit";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";
import { notify } from "@/services/notifications";

export type CaseActionState =
  | { ok: boolean; message?: string; errors?: Record<string, string[]> }
  | undefined;

const CreateCaseSchema = z.object({
  instructingParty: z.string().min(1, "Instructing party is required"),
  organisation: z.string().optional().default(""),
  solicitor: z.string().optional().default(""),
  client: z.string().optional().default(""),
  serviceType: z.string().min(1, "Service type is required"),
  reportType: z.string().min(1, "Report type is required"),
  deadline: z.string().min(1, "Deadline is required"),
  internalNotes: z.string().optional().default(""),
});

export async function createCase(
  _prev: CaseActionState,
  formData: FormData
): Promise<CaseActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "cases:create")) {
    return { ok: false, message: "You do not have permission to create cases." };
  }

  const parsed = CreateCaseSchema.safeParse({
    instructingParty: formData.get("instructingParty"),
    organisation: formData.get("organisation"),
    solicitor: formData.get("solicitor"),
    client: formData.get("client"),
    serviceType: formData.get("serviceType"),
    reportType: formData.get("reportType"),
    deadline: formData.get("deadline"),
    internalNotes: formData.get("internalNotes"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the form.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const toObjId = (v: string) => (mongoose.Types.ObjectId.isValid(v) ? new mongoose.Types.ObjectId(v) : undefined);

  await connectToDatabase();
  const seq = (await Case.countDocuments().lean()) + 1;
  const caze = await Case.create({
    caseId: buildYearId("CASE", seq),
    instructingParty: parsed.data.instructingParty,
    organisation: toObjId(parsed.data.organisation),
    solicitor: toObjId(parsed.data.solicitor),
    client: toObjId(parsed.data.client),
    serviceType: parsed.data.serviceType,
    reportType: parsed.data.reportType,
    deadline: new Date(parsed.data.deadline),
    internalNotes: parsed.data.internalNotes || undefined,
    status: "New Instruction",
  });

  await writeAuditLog({
    actor: user.id,
    action: "case.created",
    resource: "case",
    resourceId: caze.caseId,
    metadata: { via: "crm_admin" },
  });
  revalidatePath("/crm/cases");
  revalidatePath("/crm");
  return { ok: true, message: `Case ${caze.caseId} created.` };
}

export async function updateCaseStatus(
  caseId: string,
  to: string
): Promise<CaseActionState> {
  const user = await requireAuth();
  if (!CASE_STATUS.includes(to as CaseStatus)) {
    return { ok: false, message: "Invalid status." };
  }
  if (to === "Secure Release" && !hasPermission(user.role, "cases:release")) {
    return { ok: false, message: "You do not have permission to release reports." };
  }
  if (to !== "Secure Release" && !hasPermission(user.role, "cases:update")) {
    return { ok: false, message: "Permission denied." };
  }

  await connectToDatabase();
  const caze = await Case.findById(caseId);
  if (!caze) return { ok: false, message: "Case not found." };

  const before = caze.status;
  caze.status = to as CaseStatus;
  await caze.save();

  await writeAuditLog({
    actor: user.id,
    action: "case.status",
    resource: "case",
    resourceId: caze.caseId,
    metadata: { from: before, to },
  });
  revalidatePath(`/crm/cases/${caseId}`);
  revalidatePath("/crm/cases");
  return { ok: true, message: `Case moved to ${to}.` };
}

export async function offerToPsychologist(
  caseId: string,
  psychologistId: string
): Promise<CaseActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "cases:update")) {
    return { ok: false, message: "Permission denied." };
  }
  if (!mongoose.Types.ObjectId.isValid(psychologistId)) {
    return { ok: false, message: "Invalid psychologist." };
  }

  await connectToDatabase();
  const caze = await Case.findById(caseId);
  if (!caze) return { ok: false, message: "Case not found." };

  const psychologist = await Psychologist.findById(psychologistId).select("status").lean();
  if (!psychologist) return { ok: false, message: "Psychologist not found." };
  if (psychologist.status !== "Approved") {
    return { ok: false, message: "Only approved psychologists can receive offers." };
  }

  const exists = (caze.offers ?? []).some(
    (o) => String(o.psychologist) === psychologistId
  );
  if (exists) return { ok: false, message: "Offer already sent to this psychologist." };
  caze.offers.push({
    psychologist: new mongoose.Types.ObjectId(psychologistId),
    status: "Offered",
    conflict: false,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  await caze.save();

  await writeAuditLog({
    actor: user.id,
    action: "case.offer",
    resource: "case",
    resourceId: caze.caseId,
    metadata: { psychologist: psychologistId },
  });
  revalidatePath(`/crm/cases/${caseId}`);
  return { ok: true, message: "Offer sent." };
}

export async function assignPsychologist(
  caseId: string,
  psychologistId: string
): Promise<CaseActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "cases:assign")) {
    return { ok: false, message: "Permission denied." };
  }
  if (!mongoose.Types.ObjectId.isValid(psychologistId)) {
    return { ok: false, message: "Invalid psychologist." };
  }

  await connectToDatabase();
  const caze = await Case.findById(caseId);
  if (!caze) return { ok: false, message: "Case not found." };

  const psychologist = await Psychologist.findById(psychologistId).select("status").lean();
  if (!psychologist) return { ok: false, message: "Psychologist not found." };
  if (psychologist.status !== "Approved") {
    return { ok: false, message: "Only approved psychologists can be assigned." };
  }

  caze.assignedPsychologist = new mongoose.Types.ObjectId(psychologistId);
  if (["New Instruction", "Initial Review", "Quotation", "Approved"].includes(caze.status)) {
    caze.status = "Psychologist Allocation";
  }
  await caze.save();

  const psych = await Psychologist.findById(psychologistId).select("userId").lean();
  if (psych?.userId) {
    await notify({
      userId: String(psych.userId),
      type: "case_assignment",
      title: "You have been assigned a case",
      body: caze.caseId,
      link: "/portal/psychologist",
    });
  }

  await writeAuditLog({
    actor: user.id,
    action: "case.assign",
    resource: "case",
    resourceId: caze.caseId,
    metadata: { psychologist: psychologistId },
  });
  revalidatePath(`/crm/cases/${caseId}`);
  revalidatePath("/crm/cases");
  return { ok: true, message: "Psychologist assigned." };
}

export async function addCaseNote(
  _prev: CaseActionState,
  formData: FormData
): Promise<CaseActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "cases:update")) {
    return { ok: false, message: "Permission denied." };
  }

  const caseId = String(formData.get("caseId") ?? "");
  const note = String(formData.get("internalNotes") ?? "").trim();
  if (!caseId || !note) return { ok: false, message: "A note is required." };

  await connectToDatabase();
  const caze = await Case.findById(caseId);
  if (!caze) return { ok: false, message: "Case not found." };
  caze.internalNotes = note;
  await caze.save();

  await writeAuditLog({
    actor: user.id,
    action: "case.note",
    resource: "case",
    resourceId: caze.caseId,
  });
  revalidatePath(`/crm/cases/${caseId}`);
  return { ok: true, message: "Note saved." };
}