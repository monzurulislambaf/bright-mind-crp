import Link from "next/link";
import { listReports, reportStats } from "@/services/reports";
import { REPORT_BADGE, REPORT_STATUS } from "@/lib/report/statuses";

export const dynamic = "force-dynamic";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const status = params.status || undefined;
  const [reports, stats] = await Promise.all([listReports({ status }), reportStats()]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="mt-1 text-base-content/70">{reports.length} report(s)</p>
        </div>
        <Link href="/crm/reports/new" className="btn btn-primary">
          New report
        </Link>
      </div>

      <div className="stats stats-vertical mt-6 w-full bg-base-200 shadow-sm sm:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Draft</div>
          <div className="stat-value text-neutral">{stats.draft}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Quality review</div>
          <div className="stat-value text-info">{stats.review}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Amendment</div>
          <div className="stat-value text-warning">{stats.amendment}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Approved</div>
          <div className="stat-value text-success">{stats.approved}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Released</div>
          <div className="stat-value text-accent">{stats.released}</div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {["", ...REPORT_STATUS].map((s) => (
          <Link
            key={s || "all"}
            href={s ? `/crm/reports?status=${encodeURIComponent(s)}` : "/crm/reports"}
            className={`btn btn-sm ${(status ?? "") === s ? "btn-primary" : "btn-ghost"}`}
          >
            {s || "All"}
          </Link>
        ))}
      </div>

      <div className="card card-body card-border mt-6 bg-base-100">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Report</th>
                <th>Case</th>
                <th>Author</th>
                <th>Version</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => {
                const badge = (REPORT_BADGE as Record<string, string>)[r.status] ?? "neutral";
                const caze = r.case as unknown as { _id: string; caseId?: string; reportType?: string } | null;
                return (
                  <tr key={String(r._id)}>
                    <td>
                      <div className="font-medium">{r.title}</div>
                      <div className="text-xs text-base-content/50">{r.reportId}</div>
                    </td>
                    <td>
                      {caze ? (
                        <Link href={`/crm/cases/${String(caze._id)}`} className="link link-hover">
                          {caze.caseId ?? "Case"}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="text-sm">{r.authorName ?? "—"}</td>
                    <td className="text-sm">v{r.currentVersion}</td>
                    <td>
                      <span className={`badge badge-soft badge-${badge}`}>{r.status}</span>
                    </td>
                    <td>
                      <Link href={`/crm/reports/${String(r._id)}`} className="btn btn-ghost btn-xs">
                        Open →
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-base-content/60">
                    No reports.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}