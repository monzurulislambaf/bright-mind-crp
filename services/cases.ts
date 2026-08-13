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
      { caseType: rx },
      { instructingParty: rx },
      { serviceType: rx },
      { reportType: rx },
      { status: rx },
      { priority: rx },
      { internalNotes: rx },
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
  const psychs = await Psychologist.find({ status: "Approved" })
    .select("firstName lastName psychologistId hcpcNumber")
    .lean();
  // Map to plain values so the result can cross the server→client boundary
  // (mongoose ObjectIds carry a toJSON method and are rejected by React).
  return psychs.map((p) => ({
    _id: String(p._id),
    firstName: p.firstName ?? null,
    lastName: p.lastName ?? null,
    psychologistId: p.psychologistId ?? null,
    hcpcNumber: p.hcpcNumber ?? null,
  }));
}

export async function listOrganisations() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "cases:create")) throw new Error("Not authorised.");
  await connectToDatabase();
  const orgs = await Organisation.find({}).select("name orgId").sort({ name: 1 }).lean();
  // Plain values only — mongoose ObjectIds carry a toJSON method and cannot
  // cross the server→client boundary (React 19 / Next 16 rejects them).
  return orgs.map((o) => ({
    _id: String(o._id),
    name: o.name ?? null,
    orgId: o.orgId ?? null,
  }));
}

export async function listSolicitorsForOrganisation(orgId?: string) {
  const user = await requireAuth();
  if (!hasPermission(user.role, "cases:create")) throw new Error("Not authorised.");
  await connectToDatabase();
  const query: Record<string, unknown> = {};
  if (orgId) query.organisation = orgId;
  const sols = await Solicitor.find(query)
    .select("contactName solicitorId organisation")
    .sort({ contactName: 1 })
    .lean();
  return sols.map((s) => ({
    _id: String(s._id),
    contactName: s.contactName ?? null,
    solicitorId: s.solicitorId ?? null,
    organisation: s.organisation ? String(s.organisation) : null,
  }));
}

export async function listIndividualClients() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "cases:create")) throw new Error("Not authorised.");
  await connectToDatabase();
  const clients = await IndividualClient.find({})
    .select("firstName lastName clientId")
    .lean();
  return clients.map((c) => ({
    _id: String(c._id),
    firstName: c.firstName ?? null,
    lastName: c.lastName ?? null,
    clientId: c.clientId ?? null,
  }));
}