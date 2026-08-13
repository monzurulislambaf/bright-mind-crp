import "server-only";
import { User } from "@/models/User";
import { Contact } from "@/models/Contact";
import { Organisation } from "@/models/Organisation";
import { Campaign } from "@/models/Campaign";
import { Quotation } from "@/models/Quotation";
import { Invoice } from "@/models/Invoice";
import { Payment } from "@/models/Payment";
import { AuditLog, AUDIT_ACTIONS } from "@/models/AuditLog";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth/dal";
import {
  hasPermission,
  permissionsForRole,
  type Permission,
} from "@/lib/auth/permissions";
import { ALL_ROLES, ROLE_LABELS } from "@/lib/auth/roles";

/** Escape a user-provided string for use inside a RegExp. */
function rx(value: string): RegExp {
  return new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
}

/** Shared pagination shape used by admin list endpoints. */
export type Paged<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
};

function pagedResult<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number
): Paged<T> {
  return {
    items,
    total,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

// ---------------------------------------------------------------------------
// Users & Access (design §34 "Users & Access")
// ---------------------------------------------------------------------------

export async function listUsers({
  search,
  role,
  status,
  page = 1,
  pageSize = 50,
}: {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<Paged<Record<string, unknown>>> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "users:read")) {
    throw new Error("Not authorised to view users.");
  }

  await connectToDatabase();
  const query: Record<string, unknown> = {};
  if (role) query.role = role;
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { userId: rx(search) },
      { firstName: rx(search) },
      { lastName: rx(search) },
      { email: rx(search) },
      { phone: rx(search) },
      { role: rx(search) },
      { userType: rx(search) },
      { status: rx(search) },
    ];
  }

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select("-passwordHash -mfaSecret")
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();

  return pagedResult(users, total, page, pageSize);
}

export async function userStats() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "users:read")) {
    throw new Error("Not authorised to view users.");
  }
  await connectToDatabase();
  const [total, active, invited, suspended, disabled, byType] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: "active" }),
      User.countDocuments({ status: "invited" }),
      User.countDocuments({ status: "suspended" }),
      User.countDocuments({ status: "disabled" }),
      User.aggregate<{ _id: string; count: number }>([
        { $group: { _id: "$userType", count: { $sum: 1 } } },
      ]),
    ]);
  return { total, active, invited, suspended, disabled, byType };
}

/** Read-only role catalogue for the "Roles & Permissions" view. */
export async function listRoles() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "roles:read")) {
    throw new Error("Not authorised to view roles.");
  }
  return ALL_ROLES.map((role) => ({
    role,
    label: ROLE_LABELS[role] ?? role,
    permissions: permissionsForRole(role),
    internal: role !== "PSYCHOLOGIST" && role !== "SOLICITOR" && role !== "SOLICITOR_FIRM_ADMIN" && role !== "INDIVIDUAL_CLIENT",
  }));
}

export function listAuditActions(): string[] {
  return [...AUDIT_ACTIONS];
}

// ---------------------------------------------------------------------------
// CRM directory (design §34 "CRM")
// ---------------------------------------------------------------------------

export async function listContacts({
  search,
  page = 1,
  pageSize = 50,
}: {
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<Paged<Record<string, unknown>>> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "contacts:read")) {
    throw new Error("Not authorised to view contacts.");
  }

  await connectToDatabase();
  const query: Record<string, unknown> = {};
  if (search) {
    query.$or = [
      { contactId: rx(search) },
      { firstName: rx(search) },
      { lastName: rx(search) },
      { email: rx(search) },
      { telephone: rx(search) },
      { phone: rx(search) },
      { jobTitle: rx(search) },
      { contactType: rx(search) },
      { "address.city": rx(search) },
      { "address.postcode": rx(search) },
    ];
  }

  const total = await Contact.countDocuments(query);
  const contacts = await Contact.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();

  return pagedResult(contacts, total, page, pageSize);
}

export async function contactStats() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "contacts:read")) {
    throw new Error("Not authorised to view contacts.");
  }
  await connectToDatabase();
  const [total, optedIn, doNotContact, byType] = await Promise.all([
    Contact.countDocuments(),
    Contact.countDocuments({ "marketing.optedIn": true }),
    Contact.countDocuments({ "marketing.doNotContact": true }),
    Contact.aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$contactType", count: { $sum: 1 } } },
    ]),
  ]);
  return { total, optedIn, doNotContact, byType };
}

export async function listOrganisations({
  search,
  page = 1,
  pageSize = 50,
}: {
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<Paged<Record<string, unknown>>> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "organisation:read")) {
    throw new Error("Not authorised to view organisations.");
  }

  await connectToDatabase();
  const query: Record<string, unknown> = {};
  if (search) {
    query.$or = [
      { orgId: rx(search) },
      { organisationId: rx(search) },
      { name: rx(search) },
      { type: rx(search) },
      { email: rx(search) },
      { phone: rx(search) },
      { telephone: rx(search) },
      { website: rx(search) },
      { registrationNumber: rx(search) },
      { country: rx(search) },
    ];
  }

  const total = await Organisation.countDocuments(query);
  const organisations = await Organisation.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();

  return pagedResult(organisations, total, page, pageSize);
}

export async function organisationStats() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "organisation:read")) {
    throw new Error("Not authorised to view organisations.");
  }
  await connectToDatabase();
  const [total, pending, approved, suspended] = await Promise.all([
    Organisation.countDocuments(),
    Organisation.countDocuments({
      status: { $in: ["pending", "INACTIVE"] },
    }),
    Organisation.countDocuments({ status: { $in: ["approved", "ACTIVE"] } }),
    Organisation.countDocuments({ status: "suspended" }),
  ]);
  return { total, pending, approved, suspended };
}

export async function listCampaigns({
  search,
}: {
  search?: string;
} = {}) {
  const user = await requireAuth();
  if (!hasPermission(user.role, "campaigns:read")) {
    throw new Error("Not authorised to view campaigns.");
  }
  await connectToDatabase();
  const query: Record<string, unknown> = {};
  if (search) {
    query.$or = [
      { campaignId: rx(search) },
      { name: rx(search) },
      { channel: rx(search) },
      { source: rx(search) },
      { status: rx(search) },
      { notes: rx(search) },
    ];
  }
  return Campaign.find(query).sort({ createdAt: -1 }).limit(200).lean();
}

export async function campaignStats() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "campaigns:read")) {
    throw new Error("Not authorised to view campaigns.");
  }
  await connectToDatabase();
  const [total, active, paused, completed] = await Promise.all([
    Campaign.countDocuments(),
    Campaign.countDocuments({ status: "ACTIVE" }),
    Campaign.countDocuments({ status: "PAUSED" }),
    Campaign.countDocuments({ status: "COMPLETED" }),
  ]);
  return { total, active, paused, completed };
}

// ---------------------------------------------------------------------------
// Finance (design §34 "Finance")
// ---------------------------------------------------------------------------

export async function financeStats() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "finance:read")) {
    throw new Error("Not authorised to view finance records.");
  }
  await connectToDatabase();
  const [quotations, invoices, payments, invoicedTotal, paidTotal] =
    await Promise.all([
      Quotation.countDocuments(),
      Invoice.countDocuments(),
      Payment.countDocuments(),
      Invoice.aggregate<{ total: number }>([
        { $match: { status: { $ne: "VOID" } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Payment.aggregate<{ total: number }>([
        { $match: { status: "COMPLETED" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);
  return {
    quotations,
    invoices,
    payments,
    invoicedTotal: invoicedTotal[0]?.total ?? 0,
    paidTotal: paidTotal[0]?.total ?? 0,
  };
}

export async function listQuotations() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "quotations:read")) {
    throw new Error("Not authorised to view quotations.");
  }
  await connectToDatabase();
  return Quotation.find({}).sort({ createdAt: -1 }).limit(100).lean();
}

export async function listInvoices() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "invoices:read")) {
    throw new Error("Not authorised to view invoices.");
  }
  await connectToDatabase();
  return Invoice.find({}).sort({ createdAt: -1 }).limit(100).lean();
}

export async function listPayments() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "payments:read")) {
    throw new Error("Not authorised to view payments.");
  }
  await connectToDatabase();
  return Payment.find({}).sort({ createdAt: -1 }).limit(100).lean();
}

// ---------------------------------------------------------------------------
// Audit logs (design §26, §34 "System")
// ---------------------------------------------------------------------------

export async function listAdminAuditLogs({
  action,
  search,
  page = 1,
  pageSize = 50,
}: {
  action?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<Paged<Record<string, unknown>>> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "audit:read")) {
    throw new Error("Not authorised to view audit logs.");
  }

  await connectToDatabase();
  const query: Record<string, unknown> = {};
  if (action) query.action = action;
  if (search) {
    query.$and = [
      query.action ? { action: query.action } : {},
      {
        $or: [
          { auditId: rx(search) },
          { actor: rx(search) },
          { action: rx(search) },
          { resource: rx(search) },
          { resourceType: rx(search) },
          { resourceId: rx(search) },
        ],
      },
    ];
  }

  const total = await AuditLog.countDocuments(query);
  const logs = await AuditLog.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();

  return pagedResult(logs, total, page, pageSize);
}

export async function auditStats() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "audit:read")) {
    throw new Error("Not authorised to view audit logs.");
  }
  await connectToDatabase();
  const [total, today] = await Promise.all([
    AuditLog.countDocuments(),
    AuditLog.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }),
  ]);
  return { total, today };
}

export { hasPermission };
export type { Permission };
export { ROLE_LABELS };
