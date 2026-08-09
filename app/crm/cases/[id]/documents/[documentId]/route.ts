import { getDocumentForDownload } from "@/services/documents";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  const { id, documentId } = await params;
  const doc = await getDocumentForDownload(id, documentId);
  if (!doc || !doc.content) {
    return new Response("Not found", { status: 404 });
  }

  const safeName = doc.fileName.replace(/[^a-zA-Z0-9._-]/g, "_") || "download";
  return new Response(Buffer.from(doc.content), {
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Disposition": `attachment; filename="${safeName}"`,
      "Content-Length": String(doc.content.length),
    },
  });
}