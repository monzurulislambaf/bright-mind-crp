import Link from "next/link";
import { queryCases, caseStats, listCasesByStatus } from "@/services/cases";
import { CaseFilters } from "./filters";
import { CASE_BADGE, CASE_STATUS } from "@/lib/cases/statuses";

export const dynamic = "force-dynamic";

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const status = params.status || undefined;
  const search = params.search || undefined;
  const page = Number(params.page || "1") || 1;

  const [result, stats, byStatus] = await Promise.all([
    queryCases({ status, search, page }),
    caseStats(),
    listCasesByStatus(),
  ]);
  const countFor = (s: string) => byStatus.find((b) => b._id === s)?.count ?? 0;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cases</h1>
          <p className="mt-1 text-base-content/70">{result.total} case(s)</p>
        </div>
        <Link href="/crm/cases/new" className="btn btn-primary">
          New Case
        </Link>
      </div>

      <div className="stats stats-vertical w-full bg-base-200 shadow-sm sm:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Total</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat">
          <div className="stat-title">In progress</div>
          <div className="stat-value text-warning">{stats.inProgress}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Released</div>
          <div className="stat-value text-success">{stats.released}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Overdue</div>
          <div className="stat-value text-error">{stats.overdue}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Unallocated</div>
          <div className="stat-value text-info">{stats.upforAllocation}</div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-medium text-base-content/60">Filter by status</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {CASE_STATUS.map((s) => (
            <Link
              key={s}
              href={`/crm/cases?status=${encodeURIComponent(s)}`}
              className={`card card-body card-border bg-base-100 hover:bg-base-200 ${status === s ? "ring-2 ring-primary" : ""}`}
            >
              <span className={`badge badge-soft badge-${CASE_BADGE[s]}`}>{countFor(s)}</span>
              <span className="text-xs font-semibold">{s}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <CaseFilters filters={{ status: status ?? "", search: search ?? "" }} />
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Instructing party</th>
              <th>Service</th>
              <th>Deadline</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {result.cases.map((c) => (
              <tr key={String(c._id)}>
                <td className="font-mono text-xs">{c.caseId}</td>
                <td>{c.instructingParty ?? "—"}</td>
                <td>{c.serviceType ?? "—"}</td>
                <td>
                  {c.deadline ? new Date(c.deadline).toLocaleDateString() : "—"}
                </td>
                <td>
                  <span className={`badge badge-soft badge-${CASE_BADGE[c.status]}`}>
                    {c.status}
                  </span>
                </td>
                <td>
                  <Link href={`/crm/cases/${String(c._id)}`} className="btn btn-ghost btn-sm">
                    Open →
                  </Link>
                </td>
              </tr>
            ))}
            {result.cases.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-base-content/60">
                  No cases match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {result.pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: result.pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildHref(p, status, search)}
              className={`btn btn-sm ${p === page ? "btn-primary" : "btn-ghost"}`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function buildHref(page: number, status?: string, search?: string) {
  const sp = new URLSearchParams();
  if (status) sp.set("status", status);
  if (search) sp.set("search", search);
  sp.set("page", String(page));
  return `/crm/cases?${sp.toString()}`;
}