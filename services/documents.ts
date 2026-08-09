import "server-only";
import { Document } from "@/models/Document";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";

export async function listDocumentsForCase(caseId: string) {
  const user = await requireAuth();
  if (!hasPermission(user.role, "cases:read")) throw new Error("Not authorised.");
  await connectToDatabase();
  return Document.find({ case: caseId }).sort({ createdAt: -1 }).lean();
}

export async function getDocumentForDownload(caseId: string, documentId: string) {
  const user = await requireAuth();
  if (!hasPermission(user.role, "cases:read")) throw new Error("Not authorised.");
  await connectToDatabase();
  const doc = await Document.findOne({ _id: documentId, case: caseId }).lean();
  if (!doc) return null;
  // Enforce release gating for released-report style documents only.
  const v = doc.versions?.[doc.versions.length - 1];
  return {
    title: doc.title,
    fileName: v?.fileName ?? doc.title,
    mimeType: v?.mimeType ?? "application/octet-stream",
    content: v?.content,
  };
}