"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Lead, LEAD_STATUS, type LeadStatus } from "@/models/Lead";
import { Activity, ACTIVITY_TYPES, ACTIVITY_DIRECTIONS } from "@/models/Activity";
import { QualifiedLead, type QualifiedKind } from "@/models/QualifiedLead";
import { Organisation } from "@/models/Organisation";
import { Solicitor } from "@/models/Solicitor";
import { Psychologist } from "@/models/Psychologist";
import { IndividualClient } from "@/models/IndividualClient";
import { connectToDatabase } from "@/lib/db";
import { nextId } from "@/lib/ids";
import { writeAuditLog } from "@/services/audit";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";
import { nextFunnelStatus } from "@/lib/crm/funnel";

export type CrmActionState =
  | { ok: boolean; message?: string; errors?: Record<string, string[]> }
  | undefined;

const ManualLeadSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().trim().optional().default(""),
  email: z.email("Enter a valid email"),
  phone: z.string().optional().default(""),
  company: z.string().optional().default(""),
  role: z.string().optional().default(""),
  source: z.string().min(1, "Source is required"),
  notes: z.string().optional().default(""),
});

export async function createLeadManual(
  _prev: CrmActionState,
  formData: FormData
): Promise<CrmActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "leads:create")) {
    return { ok: false, message: "You do not have permission to create leads." };
  }

  const parsed = ManualLeadSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company"),
    role: formData.get("role"),
    source: formData.get("source"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the form.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  await connectToDatabase();
  const dup = await Lead.findOne({ email: parsed.data.email }).lean();
  if (dup) {
    return { ok: false, message: "A lead with this email already exists." };
  }

  await Lead.create({
    leadId: await nextId("LEAD"),
    qualifier: "general",
    ...parsed.data,
  });

  await writeAuditLog({
    actor: user.id,
    actorUserId: user.id,
    action: "CREATE",
    resource: "lead",
    resourceType: "LEAD",
    metadata: { via: "manual" },
  });

  revalidatePath("/crm/leads");
  return { ok: true };
}

export async function moveLeadStage(
  leadId: string,
  to: LeadStatus,
  opts?: { lostReason?: string }
): Promise<CrmActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "leads:update")) {
    return { ok: false, message: "Permission denied." };
  }
  if (!LEAD_STATUS.includes(to)) {
    return { ok: false, message: "Invalid status." };
  }

  await connectToDatabase();
  const lead = await Lead.findById(leadId);
  if (!lead) return { ok: false, message: "Lead not found." };

  const from = lead.status as LeadStatus;
  lead.status = to;
  if (to === "Lost") {
    if (!opts?.lostReason) {
      return { ok: false, message: "A reason is required when a lead is lost." };
    }
    lead.lostReason = opts.lostReason;
  }
  await lead.save();

  await Activity.create({
    lead: lead._id,
    type: "status_change",
    summary: `Stage changed from ${from} to ${to}`,
    createdBy: user.id,
    movedFrom: from,
    movedTo: to,
  });

  await writeAuditLog({
    actor: user.id,
    action: "lead.status",
    resource: "lead",
    resourceId: lead.leadId,
    metadata: { from, to },
  });

  revalidatePath("/crm/leads");
  return { ok: true, message: "Status updated." };
}

export async function assignLead(
  leadId: string,
  ownerLabel: string
): Promise<CrmActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "leads:update")) {
    return { ok: false, message: "Permission denied." };
  }
  await connectToDatabase();
  const lead = await Lead.findById(leadId);
  if (!lead) return { ok: false, message: "Lead not found." };
  lead.ownerLabel = ownerLabel;
  await lead.save();
  await Activity.create({
    lead: lead._id,
    type: "note",
    summary: `Lead assigned to ${ownerLabel}`,
    createdBy: user.id,
  });
  revalidatePath("/crm/leads");
  return { ok: true };
}

export async function createActivity(
  _prev: CrmActionState,
  formData: FormData
): Promise<CrmActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, ["leads:update", "leads:create"])) {
    return { ok: false, message: "Permission denied." };
  }

  const leadId = String(formData.get("leadId") ?? "");
  const type = String(formData.get("type") ?? "note") as (typeof ACTIVITY_TYPES)[number];
  const summary = String(formData.get("summary") ?? "").trim();
  const detail = String(formData.get("detail") ?? "").trim();
  const direction = (String(formData.get("direction") ?? "").trim() ||
    "outbound") as (typeof ACTIVITY_DIRECTIONS)[number];
  const dueAtRaw = formData.get("dueAt");
  const dueAt = dueAtRaw ? new Date(String(dueAtRaw)) : undefined;

  if (!leadId || !summary) {
    return { ok: false, message: "A summary is required." };
  }

  await connectToDatabase();
  const lead = await Lead.findById(leadId);
  if (!lead) return { ok: false, message: "Lead not found." };

  await Activity.create({
    lead: lead._id,
    type,
    direction: direction || undefined,
    summary,
    detail: detail || undefined,
    dueAt,
    createdBy: user.id,
  });

  if (type === "follow_up" && funnelAhead(lead.status)) {
    const next = nextFunnelStatus(lead.status as LeadStatus);
    if (next) {
      lead.status = next;
      await lead.save();
    }
  }

  await writeAuditLog({
    actor: user.id,
    action: `activity.${type}`,
    resource: "lead",
    resourceId: lead.leadId,
  });

  revalidatePath(`/crm/leads/${leadId}`);
  return { ok: true };
}

function funnelAhead(status?: string): boolean {
  return nextFunnelStatus(status as LeadStatus) !== null;
}

export async function qualifyLead(
  leadId: string,
  kind: QualifiedKind,
  notes?: string
): Promise<CrmActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "leads:update")) {
    return { ok: false, message: "Permission denied." };
  }

  await connectToDatabase();
  const lead = await Lead.findById(leadId);
  if (!lead) return { ok: false, message: "Lead not found." };

  const existing = await QualifiedLead.findOne({ lead: lead._id });
  if (existing) {
    return { ok: false, message: "This lead is already qualified." };
  }

  await QualifiedLead.create({
    qualifiedId: await nextId("QL"),
    lead: lead._id,
    kind,
    notes: notes ?? "",
    qualifiedBy: user.id,
  });
  lead.status = "Qualified";
  await lead.save();

  await writeAuditLog({
    actor: user.id,
    actorUserId: user.id,
    action: "STATUS_CHANGE",
    resource: "lead",
    resourceType: "LEAD",
    resourceId: lead.leadId,
    metadata: { kind, event: "lead.qualified" },
  });

  revalidatePath("/crm/leads");
  revalidatePath("/crm/onboarding");
  return { ok: true, message: "Lead qualified." };
}

export async function convertQualifiedLead(
  qualifiedId: string
): Promise<CrmActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "leads:update")) {
    return { ok: false, message: "Permission denied." };
  }

  await connectToDatabase();
  const qualified = await QualifiedLead.findById(qualifiedId).lean();
  if (!qualified) return { ok: false, message: "Qualified lead not found." };

  const lead = await Lead.findById(qualified.lead);
  if (!lead) return { ok: false, message: "Lead not found." };

  const orgId = await nextId("ORG");
  const org = await Organisation.create({
    orgId,
    organisationId: orgId,
    name: lead.company || lead.firstName || "Organisation",
    type: qualified.kind === "solicitor" ? "solicitor" : "other",
    status: "pending",
  });

  if (qualified.kind === "solicitor") {
    await Solicitor.create({
      solicitorId: await nextId("SOL"),
      organisation: org._id,
      contactName: `${lead.firstName} ${lead.lastName}`.trim(),
      email: lead.email,
      status: "pending",
    });
  } else if (qualified.kind === "psychologist") {
    await Psychologist.create({
      psychologistId: await nextId("PSY"),
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      status: "Pending",
    });
  } else {
    await IndividualClient.create({
      clientId: await nextId("CLI"),
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      status: "enquiry",
    });
  }

  await QualifiedLead.updateOne(
    { _id: qualified._id },
    { converted: true, convertedTo: qualified.kind }
  );
  lead.status = "Converted";
  await lead.save();

  await writeAuditLog({
    actor: user.id,
    actorUserId: user.id,
    action: "CONVERT",
    resource: "lead",
    resourceType: "LEAD",
    resourceId: lead.leadId,
    metadata: { kind: qualified.kind, orgId: org.orgId },
  });

  revalidatePath("/crm/leads");
  revalidatePath("/crm/onboarding");
  return { ok: true, message: "Lead converted to onboarding record." };
}

export async function importLeads(rows: unknown[]): Promise<CrmActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "leads:import")) {
    return { ok: false, message: "Permission denied." };
  }

  await connectToDatabase();
  let created = 0;
  let duplicates = 0;
  let invalid = 0;

  const existingEmails = new Set<string>(
    (await Lead.find({}).select("email")).map((l) => l.email ?? "").filter(Boolean)
  );

  for (const raw of rows) {
    const row = raw as Record<string, unknown>;
    const email = String(row.email ?? "").toLowerCase().trim();
    try {
      if (!email || existingEmails.has(email)) {
        duplicates += 1;
        continue;
      }
      const parsed = ManualLeadSchema.parse({
        firstName: String(row.firstName ?? ""),
        lastName: String(row.lastName ?? ""),
        email,
        phone: String(row.phone ?? ""),
        company: String(row.company ?? ""),
        role: String(row.role ?? ""),
        source: String(row.source ?? "csv_import"),
        notes: String(row.notes ?? ""),
      });
      await Lead.create({ leadId: await nextId("LEAD"), ...parsed });
      existingEmails.add(email);
      created += 1;
    } catch {
      invalid += 1;
    }
  }

  await writeAuditLog({
    actor: user.id,
    action: "lead.import",
    resource: "lead",
    metadata: { rows: rows.length, created, duplicates, invalid },
  });

  revalidatePath("/crm/leads");
  return {
    ok: true,
    message: `Imported ${created} · skipped ${duplicates} duplicates · ${invalid} invalid.`,
  };
}