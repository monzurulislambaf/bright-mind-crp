"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { Document } from "@/models/Document";
import { Case } from "@/models/Case";
import { connectToDatabase } from "@/lib/db";
import { buildId } from "@/lib/ids";
import { writeAuditLog } from "@/services/audit";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";

export type DocumentActionState =
  | { ok: boolean; message?: string; errors?: Record<string, string[]> }
  | undefined;

const MAX_BYTES = 8 * 1024 * 1024; // 8MB

export async function uploadCaseDocument(
  _prev: DocumentActionState,
  formData: FormData
): Promise<DocumentActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "documents:create")) {
    return { ok: false, message: "You do not have permission to upload documents." };
  }

  const caseId = String(formData.get("caseId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const file = formData.get("file");

  if (!caseId || !title) {
    return { ok: false, message: "A case and document title are required." };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Please choose a file." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, message: "File exceeds the 8MB limit." };
  }

  await connectToDatabase();
  const caze = await Case.findById(caseId).lean();
  if (!caze) return { ok: false, message: "Case not found." };

  const seq = (await Document.countDocuments().lean()) + 1;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const content = Buffer.from(bytes);
  const caseOid = new mongoose.Types.ObjectId(caseId);

  const existing = await Document.findOne({ case: caseId, title: title.trim() });
  let docRef: string | undefined;

  if (existing) {
    const nextVersion = (existing.versions?.length ?? 0) + 1;
    existing.versions.push({
      version: nextVersion,
      fileName: file.name,
      content,
      sizeBytes: file.size,
      mimeType: file.type || "application/octet-stream",
      uploadedBy: new mongoose.Types.ObjectId(user.id),
    });
    if (category) existing.category = category;
    await existing.save();
    docRef = existing.title;
  } else {
    const created = await Document.create({
      documentId: buildId("DOC", seq),
      title,
      category: category || undefined,
      case: caseOid,
      owner: new mongoose.Types.ObjectId(user.id),
      access: "case",
      released: false,
      versions: [
        {
          version: 1,
          fileName: file.name,
          content,
          sizeBytes: file.size,
          mimeType: file.type || "application/octet-stream",
          uploadedBy: new mongoose.Types.ObjectId(user.id),
        },
      ],
    });
    docRef = created.documentId;
  }

  await writeAuditLog({
    actor: user.id,
    action: "document.upload",
    resource: "document",
    resourceId: docRef,
    metadata: { case: caze.caseId, category },
  });

  revalidatePath(`/crm/cases/${caseId}`);
  return { ok: true, message: "Document uploaded." };
}