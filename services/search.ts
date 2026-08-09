import "server-only";
import { Lead } from "@/models/Lead";
import { Case } from "@/models/Case";
import { Organisation } from "@/models/Organisation";
import { Psychologist } from "@/models/Psychologist";
import { IndividualClient } from "@/models/IndividualClient";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";

export async function globalSearch(query: string) {
  const user = await requireAuth();
  if (!hasPermission(user.role, "cases:read") && !hasPermission(user.role, "leads:read")) {
    throw new Error("Not authorised.");
  }
  const q = query.trim();
  if (!q) return { leads: [], cases: [], organisations: [], psychologists: [], clients: [] };

  await connectToDatabase();
  const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  const limit = 10;

  const [leads, cases, organisations, psychologists, clients] = await Promise.all([
    hasPermission(user.role, "leads:read")
      ? Lead.find({ $or: [{ leadId: rx }, { firstName: rx }, { lastName: rx }, { email: rx }] })
          .limit(limit)
          .select("leadId firstName lastName email source status")
          .lean()
      : [],
    hasPermission(user.role, "cases:read")
      ? Case.find({ $or: [{ caseId: rx }, { instructingParty: rx }, { serviceType: rx }] })
          .limit(limit)
          .select("caseId instructingParty serviceType reportType status")
          .lean()
      : [],
    hasPermission(user.role, "cases:read")
      ? Organisation.find({ $or: [{ orgId: rx }, { name: rx }] })
          .limit(limit)
          .select("orgId name type status")
          .lean()
      : [],
    hasPermission(user.role, "cases:read")
      ? Psychologist.find({ $or: [{ firstName: rx }, { lastName: rx }, { hcpcNumber: rx }] })
          .limit(limit)
          .select("firstName lastName hcpcNumber status")
          .lean()
      : [],
    hasPermission(user.role, "cases:read")
      ? IndividualClient.find({ $or: [{ firstName: rx }, { lastName: rx }, { email: rx }] })
          .limit(limit)
          .select("firstName lastName clientId status")
          .lean()
      : [],
  ]);

  return { leads, cases, organisations, psychologists, clients };
}