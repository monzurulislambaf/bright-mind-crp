import "server-only";
import { QualifiedLead } from "@/models/QualifiedLead";
import { Lead } from "@/models/Lead";
import { Solicitor } from "@/models/Solicitor";
import { Psychologist } from "@/models/Psychologist";
import { IndividualClient } from "@/models/IndividualClient";
import { User } from "@/models/User";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";

export type ProvisionItem = {
  qualifiedId: string;
  kind: string;
  email: string;
  name: string;
  personId: string;
  provisioned: boolean;
};

/**
 * Lists qualified leads converted into person records, flagging whether a
 * user account has been provisioned and linked to that person record.
 */
export async function listProvisionable(): Promise<ProvisionItem[]> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "leads:update")) throw new Error("Not authorised.");
  await connectToDatabase();

  const qualified = await QualifiedLead.find({ converted: true })
    .sort({ updatedAt: -1 })
    .limit(100)
    .lean();

  const items: ProvisionItem[] = [];
  for (const q of qualified) {
    const person = await findPerson(q.kind, q.lead);
    if (!person) continue;
    const userId = person.value.userId ? String(person.value.userId) : undefined;

    let email: string;
    let name: string;
    if (q.kind === "solicitor") {
      email = person.value.email ?? "";
      name = person.value.contactName ?? "";
    } else if (q.kind === "psychologist") {
      email = person.value.email ?? "";
      name = `${person.value.firstName ?? ""} ${person.value.lastName ?? ""}`.trim();
    } else {
      email = person.value.email ?? "";
      name = `${person.value.firstName ?? ""} ${person.value.lastName ?? ""}`.trim();
    }

    const linked = userId ? await User.findById(userId).select("email").lean() : null;

    const lead = await Lead.findById(q.lead).select("email firstName lastName").lean();
    if (!lead?.email) continue;

    items.push({
      qualifiedId: String(q._id),
      kind: q.kind,
      email: linked?.email ?? (email || lead.email),
      name: name || `${lead.firstName ?? ""} ${lead.lastName ?? ""}`.trim(),
      personId: String(person.value._id),
      provisioned: !!linked,
    });
  }

  return items;
}

type PersonLike = {
  _id: unknown;
  userId?: unknown;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  contactName?: string | null;
  organisation?: unknown;
};

async function findPerson(
  kind: string,
  leadId: unknown
): Promise<{ kind: string; value: PersonLike } | null> {
  const lead = await Lead.findById(leadId).select("email").lean();
  if (!lead?.email) return null;

  if (kind === "solicitor") {
    const s = await Solicitor.findOne({ email: lead.email }).lean();
    return s ? { kind, value: s as PersonLike } : null;
  }
  if (kind === "psychologist") {
    const p = await Psychologist.findOne({ email: lead.email }).lean();
    return p ? { kind, value: p as PersonLike } : null;
  }
  const c = await IndividualClient.findOne({ email: lead.email }).lean();
  return c ? { kind, value: c as PersonLike } : null;
}