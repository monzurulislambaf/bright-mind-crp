import { requireAuth } from "@/lib/auth/dal";
import {
  getPortalPerson,
  getPortalDocumentForDownload,
} from "@/services/portal";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  const { id, documentId } = await params;
  const user = await requireAuth();
  const person = await getPortalPerson();

  const doc = await getPortalDocumentForDownload(id, documentId, person, user);
  if (!doc || !doc.content) {
    return new Response("Not found", { status: 404 });
  }

  const safeName = doc.fileName.replace(/[^a-zA-Z0-9._-]/g, "_") || "download";
  return new Response(Buffer.from(doc.content), {
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Disposition": `attachment; filename="${safeName}"`,
      "Content-Length": String(doc.content.length),
      // MIME type originates from the uploader; force a download and never
      // let the browser sniff/execute the payload.
      "X-Content-Type-Options": "nosniff",
      // Sensitive clinical documents must not be served from cache after
      // access is revoked.
      "Cache-Control": "private, no-store",
    },
  });
}
