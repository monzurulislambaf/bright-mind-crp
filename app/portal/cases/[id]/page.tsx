import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth/dal";
import {
  getPortalPerson,
  getPortalCase,
  listPortalCaseDocuments,
} from "@/services/portal";
import { CASE_BADGE, OFFER_BADGE } from "@/lib/cases/statuses";

export const dynamic = "force-dynamic";

export default async function PortalCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [user, person] = await Promise.all([requireAuth(), getPortalPerson()]);
  const result = await getPortalCase(id, person);
  if (!result) notFound();

  const { caze, viewerAllowReport, viewerAllowInternalNotes } = result;
  const badge = (CASE_BADGE as Record<string, string>)[caze.status] ?? "neutral";

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <Link href="/portal" className="link link-hover text-sm text-base-content/70">
        ← Back to overview
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{caze.caseId}</h1>
          <p className="mt-1 text-base-content/70">
            {caze.serviceType ?? "Service"} · instructed by {caze.instructingParty ?? "—"}
          </p>
        </div>
        <span className={`badge badge-lg badge-soft badge-${badge}`}>{caze.status}</span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="card card-body card-border mt-6 bg-base-100">
          <h2 className="text-lg font-semibold">Instruction details</h2>
          <dl className="mt-2 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium text-base-content/60">Report type</dt>
              <dd>{caze.reportType ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-base-content/60">Deadline</dt>
              <dd>
                {caze.deadline
                  ? new Date(caze.deadline).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-base-content/60">Created</dt>
              <dd>
                {caze.createdAt
                  ? new Date(caze.createdAt).toLocaleDateString("en-GB")
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-base-content/60">Last updated</dt>
              <dd>
                {caze.updatedAt
                  ? new Date(caze.updatedAt).toLocaleDateString("en-GB")
                  : "—"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="card card-body card-border mt-6 bg-base-100">
          <h2 className="text-lg font-semibold">Assigned expert</h2>
          <p className="mt-2 text-sm text-base-content/70">
            {caze.assignedPsychologist
              ? "A psychologist has been assigned to this case."
              : "An expert has not yet been assigned."}
          </p>
        </div>
      </div>

      {viewerAllowInternalNotes && caze.internalNotes && (
        <div className="card card-body card-border mt-6 bg-base-100">
          <h2 className="text-lg font-semibold">Internal notes</h2>
          <p className="mt-2 text-sm whitespace-pre-wrap text-base-content/70">
            {caze.internalNotes}
          </p>
        </div>
      )}

      {viewerAllowReport && (
        <div className="alert alert-success alert-soft mt-6 sm:alert-horizontal">
          <span>
            This case is released. The report is ready to be downloaded.
          </span>
        </div>
      )}

      <DocumentsSection id={id} person={person} user={user} />

      {caze.offers && caze.offers.length > 0 && (
        <div className="card card-body card-border mt-6 bg-base-100">
          <h2 className="text-lg font-semibold">Offers</h2>
          <div className="mt-2 space-y-2">
            {caze.offers.map((o, i) => {
              const b = (OFFER_BADGE as Record<string, string>)[o.status] ?? "neutral";
              return (
                <div key={i} className="flex items-center justify-between rounded-lg bg-base-200 p-3">
                  <span className="text-sm">Offer to psychologist</span>
                  <span className={`badge badge-soft badge-${b}`}>{o.status}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const CATEGORY_LABELS: Record<string, string> = {
  client_upload: "Client upload",
  report: "Report",
  assessment: "Assessment",
  correspondence: "Correspondence",
  invoice: "Invoice",
};

function categoryLabel(category?: string | null): string {
  if (!category) return "—";
  return CATEGORY_LABELS[category] ?? category.replace(/_/g, " ");
}

async function DocumentsSection({
  id,
  person,
  user,
}: {
  id: string;
  person: { role: string; personId: string; name: string };
  user: { id: string; role: string };
}) {
  const docs = await listPortalCaseDocuments(id, person, user);
  if (docs.length === 0) return null;

  return (
    <div className="card card-body card-border mt-6 bg-base-100">
      <h2 className="text-lg font-semibold">Documents</h2>
      <div className="mt-2 overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Uploaded</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d) => (
              <tr key={String(d._id)}>
                <td className="font-medium">{d.title}</td>
                <td className="text-sm">{categoryLabel(d.category)}</td>
                <td className="text-sm">
                  {d.createdAt
                    ? new Date(d.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </td>
                <td>
                  <a
                    href={`/portal/cases/${id}/documents/${String(d._id)}`}
                    className="btn btn-ghost btn-xs"
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}