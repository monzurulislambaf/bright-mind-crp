import "server-only";

import mongoose from "mongoose";
import { Psychologist } from "@/models/Psychologist";
import { Solicitor } from "@/models/Solicitor";
import { IndividualClient } from "@/models/IndividualClient";
import { User } from "@/models/User";
import { Case } from "@/models/Case";
import { Document } from "@/models/Document";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth/dal";
import { nextId } from "@/lib/ids";
import { toBuffer } from "@/lib/utils";

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
      const clientId = await nextId("CLI");
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

/**
 * Lists documents visible to a portal user for a case they can access:
 * documents they uploaded themselves, plus anything explicitly released.
 * Internal drafts and other parties' files are never exposed.
 */
export async function listPortalCaseDocuments(
  id: string,
  person: PortalPerson,
  user: { id: string; role: string }
) {
  const caze = await getPortalCase(id, person);
  if (!caze) return [];

  await connectToDatabase();
  const docs = await Document.find({ case: id })
    // List views never need the raw file bytes — avoid loading them.
    .select("-versions.content")
    .sort({ createdAt: -1 })
    .lean();

  return docs.filter((d) => {
    // Case access is already enforced; within a case, portal users see
    // their own uploads plus documents the team has explicitly released.
    const mine = d.ownerUserId && String(d.ownerUserId) === user.id;
    return mine || d.released === true;
  });
}

/**
 * Returns the latest file content for a document the portal user may download:
 * their own uploads, or released documents for professional roles.
 */
export async function getPortalDocumentForDownload(
  caseId: string,
  documentId: string,
  person: PortalPerson,
  user: { id: string; role: string }
) {
  // Reuse the visibility check (case access + own upload or released),
  // then load the file bytes only for the target document.
  const visible = await listPortalCaseDocuments(caseId, person, user);
  if (!visible.some((d) => String(d._id) === documentId)) return null;

  const doc = await Document.findOne({ _id: documentId, case: caseId })
    .select("title versions.fileName versions.mimeType versions.content")
    .lean();
  if (!doc) return null;

  const v = doc.versions?.[doc.versions.length - 1];
  const content = toBuffer(v?.content);
  if (!content) return null;
  return {
    title: doc.title,
    fileName: v?.fileName ?? doc.title,
    mimeType: v?.mimeType ?? "application/octet-stream",
    content,
  };
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