import Link from "next/link";
import { notFound } from "next/navigation";
import { getMyReport } from "@/services/reports";
import { REPORT_BADGE } from "@/lib/report/statuses";
import { ReportWorkflow } from "@/app/crm/reports/report-workflow";

export const dynamic = "force-dynamic";

export default async function PortalReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await getMyReport(id);
  if (!report) notFound();

  const badge = (REPORT_BADGE as Record<string, string>)[report.status] ?? "neutral";
  const caze = report.case as unknown as { _id: string; caseId?: string; reportType?: string } | null;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <Link href="/portal/psychologist/reports" className="link link-hover text-sm text-base-content/70">
        ← Back to my reports
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
          <Link href={`/portal/cases/${String(caze._id)}`} className="link link-hover">
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
          {report.reviewNote && (
            <div className="mt-3 rounded-lg bg-base-200 p-3 text-sm">
              <span className="font-medium">Reviewer note: </span>
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
              canEdit
              canReview={false}
              canApprove={false}
              canRelease={false}
              title={report.title}
              body={report.body}
            />
          </div>
        </div>
      </div>
    </div>
  );
}