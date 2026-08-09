import "server-only";

import mongoose from "mongoose";
import { Psychologist } from "@/models/Psychologist";
import { Solicitor } from "@/models/Solicitor";
import { IndividualClient } from "@/models/IndividualClient";
import { User } from "@/models/User";
import { Case } from "@/models/Case";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth/dal";
import { buildId } from "@/lib/ids";

export type PortalPerson = {
  role: string;
  personId: string;
  organisationId?: string;
  name: string;
};

/** Resolves the current user's portal record (person), enforcing role fit. */
export async function getPortalPerson(): Promise<PortalPerson> {
  const user = await requireAuth();
  await connectToDatabase();

  const base = { role: user.role };

  if (user.role === "PSYCHOLOGIST") {
    const p = await Psychologist.findOne({ userId: user.id }).lean();
    if (!p) throw new Error("Psychologist record not found for this account.");
    return {
      ...base,
      personId: String(p._id),
      name: `${p.firstName} ${p.lastName}`.trim() || "Psychologist",
    };
  }

  if (user.role === "SOLICITOR" || user.role === "SOLICITOR_FIRM_ADMIN") {
    const s = await Solicitor.findOne({ userId: user.id }).lean();
    if (!s) throw new Error("Solicitor record not found for this account.");
    return {
      ...base,
      personId: String(s._id),
      organisationId: s.organisation ? String(s.organisation) : undefined,
      name: s.contactName || "Solicitor",
    };
  }

  if (user.role === "INDIVIDUAL_CLIENT") {
    let c = await IndividualClient.findOne({ userId: user.id }).lean();

    // Self-heal: legacy accounts registered before person records were
    // created on sign-up get a linked client record created on first visit.
    if (!c) {
      const u = await User.findById(user.id).lean();
      const clientId = buildId("CLI", (await IndividualClient.countDocuments().lean()) + 1);
      await IndividualClient.create({
        clientId,
        userId: new mongoose.Types.ObjectId(user.id),
        firstName: u?.firstName,
        lastName: u?.lastName,
        email: u?.email,
        status: "onboarding",
      });
      c = await IndividualClient.findOne({ userId: user.id }).lean();
    }

    if (!c) throw new Error("Client record not found for this account.");
    return {
      ...base,
      personId: String(c._id),
      name: `${c.firstName} ${c.lastName}`.trim() || "Client",
    };
  }

  // Internal roles operate on a people-less context keyed by their user id.
  return { ...base, personId: user.id, name: "Team" };
}

export async function getPsychologistProfile(personId: string) {
  await connectToDatabase();
  const p = await Psychologist.findById(personId).lean();
  if (!p) return null;
  return {
    firstName: p.firstName,
    lastName: p.lastName,
    email: p.email,
    hcpcNumber: p.hcpcNumber,
    qualifications: p.qualifications,
    insuranceDetails: p.insuranceDetails,
    expertise: p.expertise,
    jurisdictions: p.jurisdictions,
    availability: p.availability,
    status: p.status,
  };
}

export async function portalStats(person: PortalPerson) {
  const byRole = person.role;

  if (byRole === "PSYCHOLOGIST") {
    const [assigned, offers, upcoming] = await Promise.all([
      Case.countDocuments({ assignedPsychologist: person.personId }),
      Case.countDocuments({ "offers.psychologist": person.personId, "offers.status": "Offered" }),
      Case.countDocuments({ assignedPsychologist: person.personId, deadline: { $gte: new Date() } }),
    ]);
    return { a: assigned, offers, upcoming };
  }

  if (byRole === "SOLICITOR" || byRole === "SOLICITOR_FIRM_ADMIN") {
    const [total, released, active] = await Promise.all([
      Case.countDocuments({ organisation: person.organisationId }),
      Case.countDocuments({ organisation: person.organisationId, status: "Secure Release" }),
      Case.countDocuments({ organisation: person.organisationId, status: { $ne: "Closed" } }),
    ]);
    return { a: total, b: released, c: active };
  }

  if (byRole === "INDIVIDUAL_CLIENT") {
    const [total, released, upcoming] = await Promise.all([
      Case.countDocuments({ client: person.personId }),
      Case.countDocuments({ client: person.personId, status: "Secure Release" }),
      Case.countDocuments({ client: person.personId, deadline: { $gte: new Date() } }),
    ]);
    return { a: total, b: released, c: upcoming };
  }

  return { a: 0, b: 0, c: 0 };
}

export async function listPortalCases(person: PortalPerson) {
  const scope =
    person.role === "PSYCHOLOGIST"
      ? {
          $or: [
            { assignedPsychologist: person.personId },
            { "offers.psychologist": person.personId },
          ],
        }
      : person.role === "SOLICITOR" || person.role === "SOLICITOR_FIRM_ADMIN"
      ? { organisation: person.organisationId }
      : person.role === "INDIVIDUAL_CLIENT"
      ? { client: person.personId }
      : {};

  if (Object.keys(scope).length === 0) return [];
  await connectToDatabase();
  return Case.find(scope).sort({ updatedAt: -1 }).limit(100).lean();
}

export async function listAssignedCases(person: PortalPerson) {
  if (person.role !== "PSYCHOLOGIST") return [];
  const scope =
    person.role === "PSYCHOLOGIST"
      ? { assignedPsychologist: person.personId }
      : {};
  await connectToDatabase();
  return Case.find(scope).sort({ updatedAt: -1 }).lean();
}

export async function getPortalCase(id: string, person: PortalPerson) {
  await connectToDatabase();
  const caze = await Case.findById(id).lean();
  if (!caze) return null;

  const allowed =
    person.role === "MASTER_ADMIN" || person.role === "SYSTEM_ADMIN"
      ? true
      : person.role === "PSYCHOLOGIST"
      ? String(caze.assignedPsychologist ?? "") === person.personId ||
        (caze.offers ?? []).some((o) => String(o.psychologist) === person.personId)
      : person.role === "SOLICITOR" || person.role === "SOLICITOR_FIRM_ADMIN"
      ? String(caze.organisation ?? "") === (person.organisationId ?? "")
      : person.role === "INDIVIDUAL_CLIENT"
      ? String(caze.client ?? "") === person.personId
      : false;

  if (!allowed) return null;

  const released = caze.status === "Secure Release" || caze.status === "Closed";
  return {
    caze,
    viewerAllowReport: released,
    viewerAllowInternalNotes: person.role !== "INDIVIDUAL_CLIENT",
  };
}