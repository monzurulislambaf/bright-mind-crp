import "server-only";
import { Lead } from "@/models/Lead";
import { Activity } from "@/models/Activity";
import { QualifiedLead } from "@/models/QualifiedLead";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";

export async function listLeads({
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
  if (!hasPermission(user.role, "leads:read")) {
    throw new Error("Not authorised to view leads.");
  }

  await connectToDatabase();
  const query: Record<string, unknown> = {};
  if (status) query.status = status;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [
      { leadId: rx },
      { firstName: rx },
      { lastName: rx },
      { email: rx },
      { phone: rx },
      { company: rx },
      { role: rx },
      { source: rx },
      { status: rx },
      { priority: rx },
      { campaign: rx },
      { serviceInterest: rx },
      { ownerLabel: rx },
      { notes: rx },
    ];
  }

  const total = await Lead.countDocuments(query);
  const leads = await Lead.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();

  return {
    leads,
    total,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getLead(id: string) {
  const user = await requireAuth();
  if (!hasPermission(user.role, "leads:read")) {
    throw new Error("Not authorised to view leads.");
  }
  await connectToDatabase();
  const lead = await Lead.findById(id).lean();
  if (!lead) return null;
  const activities = await Activity.find({ lead: lead._id })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
  return { lead, activities };
}

export async function listQualifiedLeads() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "leads:read")) {
    throw new Error("Not authorised.");
  }
  await connectToDatabase();
  const qualified = await QualifiedLead.find({ converted: { $ne: true } })
    .sort({ createdAt: -1 })
    .populate<{ lead: unknown }>("lead")
    .lean();
  return qualified;
}

export async function crmStats() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "leads:read")) {
    throw new Error("Not authorised.");
  }
  await connectToDatabase();
  const [total, qualified, converted, lost, newToday] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ status: "Qualified" }),
    Lead.countDocuments({ status: "Converted" }),
    Lead.countDocuments({ status: "Lost" }),
    Lead.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }),
  ]);
  return { total, qualified, converted, lost, newToday };
}

export async function listLeadsByStatus() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "leads:read")) {
    throw new Error("Not authorised.");
  }
  await connectToDatabase();
  const pipeline = [{ $group: { _id: "$status", count: { $sum: 1 } } }];
  const result = await Lead.aggregate(pipeline);
  return result as Array<{ _id: string; count: number }>;
}