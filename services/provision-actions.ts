"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { Lead } from "@/models/Lead";
import { QualifiedLead } from "@/models/QualifiedLead";
import { Solicitor } from "@/models/Solicitor";
import { Psychologist } from "@/models/Psychologist";
import { IndividualClient } from "@/models/IndividualClient";
import { User } from "@/models/User";
import { connectToDatabase } from "@/lib/db";
import { buildId, buildToken } from "@/lib/ids";
import { writeAuditLog } from "@/services/audit";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";
import type { Role } from "@/lib/auth/roles";

export type ProvisionState =
  | { ok: boolean; message?: string; credentials?: { email: string; password: string } }
  | undefined;

const ROLE_BY_KIND: Record<string, Role> = {
  solicitor: "SOLICITOR",
  psychologist: "PSYCHOLOGIST",
  individual: "INDIVIDUAL_CLIENT",
};

type PersonLike = {
  _id: unknown;
  userId?: unknown;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  organisation?: unknown;
  save: () => Promise<unknown>;
};

async function findPerson(kind: string, leadId: unknown): Promise<PersonLike | null> {
  const lead = await Lead.findById(leadId).select("email").lean();
  if (!lead?.email) return null;
  if (kind === "solicitor") {
    const s = await Solicitor.findOne({ email: lead.email });
    return s ? (s as unknown as PersonLike) : null;
  }
  if (kind === "psychologist") {
    const p = await Psychologist.findOne({ email: lead.email });
    return p ? (p as unknown as PersonLike) : null;
  }
  const c = await IndividualClient.findOne({ email: lead.email });
  return c ? (c as unknown as PersonLike) : null;
}

export async function provisionAccount(
  qualifiedId: string
): Promise<ProvisionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "leads:update")) {
    return { ok: false, message: "Permission denied." };
  }
  await connectToDatabase();

  const qualified = await QualifiedLead.findById(qualifiedId).lean();
  if (!qualified) return { ok: false, message: "Qualified lead not found." };
  if (!qualified.converted) {
    return { ok: false, message: "Convert this record before provisioning an account." };
  }

  const person = await findPerson(qualified.kind, qualified.lead);
  if (!person) return { ok: false, message: "Person record not found." };
  if (person.userId) {
    return { ok: false, message: "This person already has a linked account." };
  }

  const lead = await Lead.findById(qualified.lead).select("email firstName lastName").lean();
  const email = (person.email ?? lead?.email ?? "").toLowerCase().trim();
  if (!email) return { ok: false, message: "No email address available for the account." };

  const existing = await User.findOne({ email }).lean();
  if (existing) return { ok: false, message: "An account with this email already exists." };

  const password = buildToken();
  const passwordHash = await bcrypt.hash(password, 10);
  const userId = buildId("USR", (await User.countDocuments().lean()) + 1);

  const role = ROLE_BY_KIND[qualified.kind] ?? "INDIVIDUAL_CLIENT";
  const firstName = person.firstName ?? lead?.firstName ?? "";
  const lastName = person.lastName ?? lead?.lastName ?? "";
  const organisation = person.organisation
    ? new mongoose.Types.ObjectId(String(person.organisation))
    : undefined;

  const created = await User.create({
    userId,
    firstName: firstName || "Pending",
    lastName: lastName || "User",
    email,
    passwordHash,
    role,
    organisation,
    status: "active",
  });

  person.userId = created._id;
  await person.save();

  await writeAuditLog({
    actor: user.id,
    action: "user.provisioned",
    resource: "user",
    resourceId: created.userId,
    metadata: { kind: qualified.kind },
  });

  revalidatePath("/crm/onboarding");
  return {
    ok: true,
    message: "Account provisioned. Share the temporary password with the user.",
    credentials: { email, password },
  };
}

export async function resendProvisionNotice(qualifiedId: string): Promise<ProvisionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "leads:update")) {
    return { ok: false, message: "Permission denied." };
  }
  await connectToDatabase();
  const qualified = await QualifiedLead.findById(qualifiedId).lean();
  if (!qualified) return { ok: false, message: "Qualified lead not found." };
  const person = await findPerson(qualified.kind, qualified.lead);
  if (!person?.userId) return { ok: false, message: "No provisioned account yet." };
  await writeAuditLog({ actor: user.id, action: "user.provision_notice", resource: "user" });
  return { ok: true, message: "Provision notice logged." };
}