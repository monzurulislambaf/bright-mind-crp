import Link from "next/link";
import { notFound } from "next/navigation";
import { getCase, listApprovedPsychologists } from "@/services/cases";
import { listDocumentsForCase } from "@/services/documents";
import { listReportsForCase } from "@/services/reports";
import { CASE_BADGE, OFFER_BADGE } from "@/lib/cases/statuses";
import { REPORT_BADGE } from "@/lib/report/statuses";
import { StatusMover } from "../status-mover";
import { OfferPsychologists, AssignPsychologist } from "../team-panels";
import { CaseNoteForm } from "../case-note-form";
import { DocumentUploadForm } from "../document-upload-form";

export const dynamic = "force-dynamic";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [caze, psychologists, documents, reports] = await Promise.all([
    getCase(id),
    listApprovedPsychologists(),
    listDocumentsForCase(id),
    listReportsForCase(id),
  ]);
  if (!caze) notFound();

  const badge = (CASE_BADGE as Record<string, string>)[caze.status] ?? "neutral";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <Link href="/crm/cases" className="link link-hover text-sm text-base-content/70">
        ← Back to cases
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

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card card-body card-border bg-base-100">
          <h2 className="text-lg font-semibold">Case details</h2>
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
              <dt className="font-medium text-base-content/60">Organisation</dt>
              <dd>{caze.organisationName ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-base-content/60">Solicitor</dt>
              <dd>{caze.solicitorName ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-base-content/60">Client</dt>
              <dd>{caze.clientName ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-base-content/60">Assigned expert</dt>
              <dd>{caze.assignedPsychologist ? "Assigned" : "Not assigned"}</dd>
            </div>
          </dl>
        </div>

        <div className="card card-body card-border bg-base-100">
          <h2 className="text-lg font-semibold">Status workflow</h2>
          <div className="mt-3">
            <StatusMover caseId={id} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card card-body card-border bg-base-100">
          <h2 className="text-lg font-semibold">Send offers</h2>
          <p className="mt-1 text-sm text-base-content/70">
            Offer this case to approved psychologists — they can accept or decline in their portal.
          </p>
          <div className="mt-3">
            <OfferPsychologists caseId={id} psychologists={psychologists as []} />
          </div>
          <div className="divider" />
          <h3 className="text-base font-semibold">Direct assignment</h3>
          <div className="mt-3">
            <AssignPsychologist caseId={id} psychologists={psychologists as []} />
          </div>
        </div>

        <div className="card card-body card-border bg-base-100">
          <h2 className="text-lg font-semibold">Offers sent</h2>
          {caze.offers.length === 0 ? (
            <p className="text-sm text-base-content/60">No offers yet.</p>
          ) : (
            <div className="mt-2 space-y-2">
              {caze.offers.map((o, i) => {
                const b = (OFFER_BADGE as Record<string, string>)[o.status] ?? "neutral";
                return (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-base-200 p-3">
                    <span className="text-sm">{o.psychologistId.slice(0, 8)}…</span>
                    <span className={`badge badge-soft badge-${b}`}>{o.status}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="card card-body card-border mt-6 bg-base-100">
        <h2 className="text-lg font-semibold">Internal notes</h2>
        {caze.internalNotes && (
          <p className="mt-2 rounded-lg bg-base-200 p-3 text-sm whitespace-pre-wrap">
            {caze.internalNotes}
          </p>
        )}
        <div className="mt-4">
          <CaseNoteForm caseId={id} />
        </div>
      </div>

      <div className="card card-body card-border mt-6 bg-base-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Reports</h2>
          <Link href="/crm/reports/new" className="btn btn-sm btn-outline">
            New report
          </Link>
        </div>
        {reports.length === 0 ? (
          <p className="text-sm text-base-content/60">No reports for this case.</p>
        ) : (
          <div className="mt-2 space-y-2">
            {reports.map((r) => {
              const b = (REPORT_BADGE as Record<string, string>)[r.status] ?? "neutral";
              return (
                <div
                  key={String(r._id)}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-base-200 p-3"
                >
                  <div>
                    <div className="text-sm font-medium">{r.title}</div>
                    <div className="text-xs text-base-content/50">
                      {r.reportId} · v{r.currentVersion}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge badge-soft badge-${b}`}>{r.status}</span>
                    <Link href={`/crm/reports/${String(r._id)}`} className="btn btn-ghost btn-xs">
                      Open →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card card-body card-border mt-6 bg-base-100">
        <h2 className="text-lg font-semibold">Documents & reports</h2>
        <p className="mt-1 text-sm text-base-content/70">
          Upload reports, assessments and correspondence against this case.
        </p>
        {documents.length > 0 && (
          <div className="mt-3 overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Versions</th>
                  <th>Uploaded</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {documents.map((d) => (
                  <tr key={String(d._id)}>
                    <td>
                      <span className="font-medium">{d.title}</span>
                    </td>
                    <td>{d.category ?? "—"}</td>
                    <td>{d.versions?.length ?? 0}</td>
                    <td>
                      {d.createdAt
                        ? new Date(d.createdAt).toLocaleDateString("en-GB")
                        : "—"}
                    </td>
                    <td>
                      <a
                        href={`/crm/cases/${id}/documents/${String(d._id)}`}
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
        )}
        <div className="divider" />
        <DocumentUploadForm caseId={id} />
      </div>
    </div>
  );
}