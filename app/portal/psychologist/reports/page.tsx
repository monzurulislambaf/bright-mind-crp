import Link from "next/link";
import { listMyReports } from "@/services/reports";
import { REPORT_BADGE } from "@/lib/report/statuses";

export const dynamic = "force-dynamic";

export default async function MyReportsPage() {
  const reports = await listMyReports();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My reports</h1>
          <p className="mt-1 text-base-content/70">Draft, revise and track your reports.</p>
        </div>
        <Link href="/portal/psychologist/reports/new" className="btn btn-primary">
          New draft
        </Link>
      </div>

      <div className="card card-body card-border mt-6 bg-base-100">
        {reports.length === 0 ? (
          <p className="text-sm text-base-content/60">
            No reports yet. Draft one against an assigned case.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Report</th>
                  <th>Case</th>
                  <th>Version</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => {
                  const badge = (REPORT_BADGE as Record<string, string>)[r.status] ?? "neutral";
                  const caze = r.case as unknown as { _id: string; caseId?: string } | null;
                  return (
                    <tr key={String(r._id)}>
                      <td>
                        <div className="font-medium">{r.title}</div>
                        <div className="text-xs text-base-content/50">{r.reportId}</div>
                      </td>
                      <td>
                        {caze ? (
                          <Link href={`/portal/cases/${String(caze._id)}`} className="link link-hover">
                            {caze.caseId ?? "Case"}
                          </Link>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="text-sm">v{r.currentVersion}</td>
                      <td>
                        <span className={`badge badge-soft badge-${badge}`}>{r.status}</span>
                      </td>
                      <td>
                        <Link href={`/portal/reports/${String(r._id)}`} className="btn btn-ghost btn-xs">
                          Open →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}