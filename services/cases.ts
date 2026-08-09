import "server-only";
import { Case } from "@/models/Case";
import { Psychologist } from "@/models/Psychologist";
import { Organisation } from "@/models/Organisation";
import { Solicitor } from "@/models/Solicitor";
import { IndividualClient } from "@/models/IndividualClient";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";

export async function queryCases({
  status,
  search,
  page = 1,
  pageSize = 50,
}: {
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const user = await requireAuth();
  if (!hasPermission(user.role, "cases:read")) throw new Error("Not authorised.");

  await connectToDatabase();
  const query: Record<string, unknown> = {};
  if (status) query.status = status;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [
      { caseId: rx },
      { instructingParty: rx },
      { serviceType: rx },
      { reportType: rx },
    ];
  }

  const total = await Case.countDocuments(query);
  const cases = await Case.find(query)
    .sort({ updatedAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();

  return {
    cases,
    total,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getCase(id: string) {
  const user = await requireAuth();
  if (!hasPermission(user.role, "cases:read")) throw new Error("Not authorised.");

  await connectToDatabase();
  const caze = await Case.findById(id)
    .populate<{ solicitor: { contactName?: string } | null }>("solicitor", "contactName email")
    .populate<{ organisation: { name?: string } | null }>("organisation", "name")
    .populate<{ client: { firstName?: string; lastName?: string } | null }>(
      "client",
      "firstName lastName"
    )
    .lean();
  if (!caze) return null;

  const offers = (caze.offers ?? []).map((o) => ({
    psychologistId: String(o.psychologist),
    status: o.status,
    conflict: o.conflict,
    expiresAt: o.expiresAt,
    respondedAt: o.respondedAt,
  }));

  return {
    ...caze,
    offers,
    solicitorName: caze.solicitor?.contactName,
    organisationName: caze.organisation?.name,
    clientName: caze.client
      ? `${caze.client.firstName ?? ""} ${caze.client.lastName ?? ""}`.trim()
      : undefined,
  };
}

export async function caseStats() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "cases:read")) throw new Error("Not authorised.");

  await connectToDatabase();
  const [total, inProgress, released, closed, overdue, upForAllocation] = await Promise.all([
    Case.countDocuments(),
    Case.countDocuments({
      status: { $nin: ["Secure Release", "Closed"] },
    }),
    Case.countDocuments({ status: "Secure Release" }),
    Case.countDocuments({ status: "Closed" }),
    Case.countDocuments({ deadline: { $lt: new Date() }, status: { $ne: "Closed" } }),
    Case.countDocuments({ assignedPsychologist: null, offers: { $size: 0 } }),
  ]);
  return { total, inProgress, released, closed, overdue, upforAllocation: upForAllocation };
}

export async function listCasesByStatus() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "cases:read")) throw new Error("Not authorised.");
  await connectToDatabase();
  const pipeline = [{ $group: { _id: "$status", count: { $sum: 1 } } }];
  const result = await Case.aggregate(pipeline);
  return result as Array<{ _id: string; count: number }>;
}

export async function listApprovedPsychologists() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "cases:update")) throw new Error("Not authorised.");
  await connectToDatabase();
  return Psychologist.find({ status: "Approved" })
    .select("firstName lastName psychologistId hcpcNumber")
    .lean();
}

export async function listOrganisations() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "cases:create")) throw new Error("Not authorised.");
  await connectToDatabase();
  return Organisation.find({}).select("name orgId").sort({ name: 1 }).lean();
}

export async function listSolicitorsForOrganisation(orgId?: string) {
  const user = await requireAuth();
  if (!hasPermission(user.role, "cases:create")) throw new Error("Not authorised.");
  await connectToDatabase();
  const query: Record<string, unknown> = {};
  if (orgId) query.organisation = orgId;
  return Solicitor.find(query)
    .select("contactName solicitorId organisation")
    .sort({ contactName: 1 })
    .lean();
}

export async function listIndividualClients() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "cases:create")) throw new Error("Not authorised.");
  await connectToDatabase();
  return IndividualClient.find({}).select("firstName lastName clientId").lean();
}