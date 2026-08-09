"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import mongoose from "mongoose";
import { Case } from "@/models/Case";
import { Psychologist } from "@/models/Psychologist";
import { Solicitor } from "@/models/Solicitor";
import { IndividualClient } from "@/models/IndividualClient";
import { connectToDatabase } from "@/lib/db";
import { buildYearId } from "@/lib/ids";
import { writeAuditLog } from "@/services/audit";
import { requireAuth } from "@/lib/auth/dal";

export type PortalActionState =
  | { ok: boolean; message?: string; errors?: Record<string, string[]> }
  | undefined;

async function getPsychologistUser() {
  const user = await requireAuth();
  if (user.role !== "PSYCHOLOGIST") throw new Error("Unauthorised.");
  await connectToDatabase();
  const p = await Psychologist.findOne({ userId: user.id }).lean();
  if (!p) throw new Error("Psychologist record not found.");
  return { userId: user.id, personId: String(p._id) };
}

async function getSolicitorUser() {
  const user = await requireAuth();
  if (user.role !== "SOLICITOR" && user.role !== "SOLICITOR_FIRM_ADMIN") {
    throw new Error("Unauthorised.");
  }
  await connectToDatabase();
  const s = await Solicitor.findOne({ userId: user.id }).lean();
  if (!s) throw new Error("Solicitor record not found.");
  return {
    userId: user.id,
    personId: String(s._id),
    organisationId: s.organisation ? String(s.organisation) : undefined,
  };
}

export async function respondToOffer(
  caseId: string,
  action: "accept" | "decline"
): Promise<PortalActionState> {
  const p = await getPsychologistUser();
  await connectToDatabase();
  const caze = await Case.findById(caseId);
  if (!caze) return { ok: false, message: "Case not found." };

  const offer = (caze.offers ?? []).find((o) => String(o.psychologist) === p.personId);
  if (!offer) return { ok: false, message: "No offer exists for this case." };

  if (action === "accept") {
    if (caze.assignedPsychologist && String(caze.assignedPsychologist) !== p.personId) {
      return { ok: false, message: "This case is already assigned to another expert." };
    }
    offer.status = "Assigned";
    offer.respondedAt = new Date();
    caze.assignedPsychologist = offer.psychologist;
    if (["New Instruction", "Initial Review", "Quotation", "Approved"].includes(caze.status)) {
      caze.status = "Psychologist Allocation";
    }
  } else {
    offer.status = "Declined";
    offer.respondedAt = new Date();
  }

  await caze.save();
  await writeAuditLog({
    actor: p.userId,
    action: `offer.${action}`,
    resource: "case",
    resourceId: caze.caseId,
  });
  revalidatePath("/portal/psychologist");
  return { ok: true, message: action === "accept" ? "Offer accepted." : "Offer declined." };
}

const ProfileSchema = z.object({
  expertise: z.string().optional().default(""),
  availability: z.string().optional().default(""),
  jurisdictions: z.string().optional().default(""),
  qualifications: z.string().optional().default(""),
  insuranceDetails: z.string().optional().default(""),
});

export async function updatePsychologistProfile(
  _prev: PortalActionState,
  formData: FormData
): Promise<PortalActionState> {
  const p = await getPsychologistUser();
  const parsed = ProfileSchema.safeParse({
    expertise: formData.get("expertise"),
    availability: formData.get("availability"),
    jurisdictions: formData.get("jurisdictions"),
    qualifications: formData.get("qualifications"),
    insuranceDetails: formData.get("insuranceDetails"),
  });
  if (!parsed.success) return { ok: false, message: "Invalid profile data." };

  const list = (v: string) => v.split(",").map((s) => s.trim()).filter(Boolean);
  await Psychologist.updateOne(
    { _id: p.personId },
    {
      expertise: list(parsed.data.expertise),
      availability: parsed.data.availability,
      jurisdictions: list(parsed.data.jurisdictions),
      qualifications: list(parsed.data.qualifications),
      insuranceDetails: parsed.data.insuranceDetails,
    }
  );
  await writeAuditLog({ actor: p.userId, action: "profile.update", resource: "psychologist" });
  revalidatePath("/portal/psychologist/profile");
  return { ok: true };
}

const InstructionSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  serviceType: z.string().min(1, "Service type is required"),
  reportType: z.string().min(1, "Report type is required"),
  deadline: z.string().min(1, "Deadline is required"),
  instructingParty: z.string().optional().default(""),
});

export async function createInstruction(
  _prev: PortalActionState,
  formData: FormData
): Promise<PortalActionState> {
  const s = await getSolicitorUser();
  const parsed = InstructionSchema.safeParse({
    clientName: formData.get("clientName"),
    serviceType: formData.get("serviceType"),
    reportType: formData.get("reportType"),
    deadline: formData.get("deadline"),
    instructingParty: formData.get("instructingParty"),
  });
  if (!parsed.success) {
    return { ok: false, message: "Please check the form.", errors: parsed.error.flatten().fieldErrors };
  }

  const seq = (await Case.countDocuments().lean()) + 1;
  const caze = await Case.create({
    caseId: buildYearId("CASE", seq),
    instructingParty: parsed.data.instructingParty || parsed.data.clientName,
    organisation: s.organisationId ? new mongoose.Types.ObjectId(s.organisationId) : undefined,
    solicitor: new mongoose.Types.ObjectId(s.personId),
    serviceType: parsed.data.serviceType,
    reportType: parsed.data.reportType,
    deadline: new Date(parsed.data.deadline),
    status: "New Instruction",
  });

  await writeAuditLog({
    actor: s.userId,
    action: "case.created",
    resource: "case",
    resourceId: caze.caseId,
    metadata: { via: "solicitor" },
  });
  revalidatePath("/portal/solicitor");
  return { ok: true, message: "Instruction created." };
}

export async function submitServiceRequest(
  _prev: PortalActionState,
  formData: FormData
): Promise<PortalActionState> {
  const user = await requireAuth();
  if (user.role !== "INDIVIDUAL_CLIENT") throw new Error("Unauthorised.");

  await connectToDatabase();
  const c = await IndividualClient.findOne({ userId: user.id }).lean();
  if (!c) throw new Error("Client record not found.");

  const serviceType = String(formData.get("serviceType") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  if (!serviceType) return { ok: false, message: "Service type is required." };

  const seq = (await Case.countDocuments().lean()) + 1;
  await Case.create({
    caseId: buildYearId("CASE", seq),
    client: new mongoose.Types.ObjectId(String(c._id)),
    instructingParty: `${c.firstName} ${c.lastName}`.trim(),
    serviceType,
    reportType: serviceType,
    internalNotes: notes || undefined,
    status: "New Instruction",
  });

  await writeAuditLog({
    actor: user.id,
    action: "case.created",
    resource: "case",
    metadata: { via: "individual_request" },
  });
  revalidatePath("/portal/individual");
  return { ok: true };
}