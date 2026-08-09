import Link from "next/link";
import { notFound } from "next/navigation";
import { getReport } from "@/services/reports";
import { REPORT_BADGE } from "@/lib/report/statuses";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";
import { ReportWorkflow } from "../report-workflow";

export const dynamic = "force-dynamic";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [user, report] = await Promise.all([requireAuth(), getReport(id)]);
  if (!report) notFound();

  const badge = (REPORT_BADGE as Record<string, string>)[report.status] ?? "neutral";
  const canEdit =
    hasPermission(user.role, "reports:create") &&
    String(report.createdBy) === user.id;
  const canReview = hasPermission(user.role, "reports:review");
  const canApprove = hasPermission(user.role, "reports:approve");
  const canRelease = hasPermission(user.role, "reports:release");

  const caze = report.case as unknown as { _id: string; caseId?: string; reportType?: string } | null;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <Link href="/crm/reports" className="link link-hover text-sm text-base-content/70">
        ← Back to reports
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{report.title}</h1>
          <p className="mt-1 text-base-content/70">
            {report.reportId} · v{report.currentVersion}
          </p>
        </div>
        <span className={`badge badge-lg badge-soft badge-${badge}`}>{report.status}</span>
      </div>

      {caze && (
        <div className="mt-4 text-sm text-base-content/70">
          Case:{" "}
          <Link href={`/crm/cases/${String(caze._id)}`} className="link link-hover">
            {caze.caseId ?? "Case"}
          </Link>
          {caze.reportType ? ` · ${caze.reportType}` : ""}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card card-body card-border bg-base-100">
          <h2 className="text-lg font-semibold">Report content</h2>
          {report.body ? (
            <p className="mt-2 rounded-lg bg-base-200 p-3 text-sm whitespace-pre-wrap">
              {report.body}
            </p>
          ) : (
            <p className="mt-2 text-sm text-base-content/60">No content yet.</p>
          )}
          <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium text-base-content/60">Author</dt>
              <dd>{report.authorName ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-base-content/60">Reviewer</dt>
              <dd>{report.reviewer ? String(report.reviewer).slice(0, 8) + "…" : "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-base-content/60">Reviewed</dt>
              <dd>
                {report.reviewedAt
                  ? new Date(report.reviewedAt).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-base-content/60">Released</dt>
              <dd>
                {report.releasedAt
                  ? new Date(report.releasedAt).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </dd>
            </div>
          </dl>
          {report.reviewNote && (
            <div className="mt-3 rounded-lg bg-base-200 p-3 text-sm">
              <span className="font-medium">Review note: </span>
              {report.reviewNote}
            </div>
          )}
        </div>

        <div className="card card-body card-border bg-base-100">
          <h2 className="text-lg font-semibold">Workflow</h2>
          <p className="mt-1 text-sm text-base-content/70">
            Draft → Quality Review → Amendment → Approved → Final → Release
          </p>
          <div className="mt-4">
            <ReportWorkflow
              reportId={id}
              status={report.status}
              canEdit={canEdit}
              canReview={canReview}
              canApprove={canApprove}
              canRelease={canRelease}
              title={report.title}
              body={report.body}
            />
          </div>
        </div>
      </div>

      {report.versions.length > 1 && (
        <div className="card card-body card-border mt-6 bg-base-100">
          <h2 className="text-lg font-semibold">Version history</h2>
          <p className="mt-1 text-sm text-base-content/70">
            Previous versions are never overwritten.
          </p>
          <div className="mt-3 space-y-2">
            {[...report.versions]
              .sort((a, b) => Number(b.version) - Number(a.version))
              .map((v, i) => (
                <details key={i} className="collapse collapse-arrow bg-base-200">
                  <summary className="collapse-title text-sm font-medium">
                    v{v.version} · {v.title}
                    {v.authorName ? ` · ${v.authorName}` : ""}
                  </summary>
                  <div className="collapse-content text-sm whitespace-pre-wrap">
                    {v.body || "No content."}
                  </div>
                </details>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}