import Link from "next/link";
import { crmStats, listLeadsByStatus } from "@/services/crm";
import { caseStats } from "@/services/cases";
import { reportStats } from "@/services/reports";
import { STATUS_BADGE } from "@/lib/crm/funnel";
import { LEAD_STATUS } from "@/models/Lead";

export const dynamic = "force-dynamic";

export default async function CrmDashboardPage() {
  const [stats, byStatus, cstats, rstats] = await Promise.all([
    crmStats(),
    listLeadsByStatus(),
    caseStats(),
    reportStats().catch(() => ({
      draft: 0,
      review: 0,
      approved: 0,
      amendment: 0,
      final: 0,
      released: 0,
    })),
  ]);
  const countFor = (s: string) => byStatus.find((b) => b._id === s)?.count ?? 0;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM Dashboard</h1>
          <p className="mt-1 text-base-content/70">Your sales overview at a glance.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/crm/cases/new" className="btn btn-ghost">
            New Case
          </Link>
          <Link href="/crm/leads/new" className="btn btn-primary">
            New Lead
          </Link>
          <Link href="/crm/import" className="btn btn-ghost">
            Import
          </Link>
        </div>
      </div>

      <h2 className="mb-3 text-lg font-semibold">Sales</h2>

      <div className="stats stats-vertical w-full bg-base-200 shadow-sm sm:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Total leads</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat">
          <div className="stat-title">New today</div>
          <div className="stat-value">{stats.newToday}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Qualified</div>
          <div className="stat-value text-success">{stats.qualified}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Converted</div>
          <div className="stat-value text-primary">{stats.converted}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Lost</div>
          <div className="stat-value text-error">{stats.lost}</div>
        </div>
      </div>

      <h2 className="mb-3 mt-10 text-lg font-semibold">Cases</h2>
      <div className="stats stats-vertical w-full bg-base-200 shadow-sm sm:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Total</div>
          <div className="stat-value">{cstats.total}</div>
        </div>
        <div className="stat">
          <div className="stat-title">In progress</div>
          <div className="stat-value text-warning">{cstats.inProgress}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Released</div>
          <div className="stat-value text-success">{cstats.released}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Overdue</div>
          <div className="stat-value text-error">{cstats.overdue}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Unallocated</div>
          <div className="stat-value text-info">{cstats.upforAllocation}</div>
        </div>
      </div>
      <div className="mt-3">
        <Link href="/crm/cases" className="link link-hover text-sm">
          Manage cases →
        </Link>
      </div>

      <h2 className="mb-3 mt-10 text-lg font-semibold">Reports</h2>
      <div className="stats stats-vertical w-full bg-base-200 shadow-sm sm:stats-horizontal">
        <div className="stat">
          <div className="stat-title">In review</div>
          <div className="stat-value text-info">{rstats.review}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Amendments</div>
          <div className="stat-value text-warning">{rstats.amendment}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Approved</div>
          <div className="stat-value text-success">{rstats.approved}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Released</div>
          <div className="stat-value text-accent">{rstats.released}</div>
        </div>
      </div>
      <div className="mt-3">
        <Link href="/crm/reports" className="link link-hover text-sm">
          Manage reports →
        </Link>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Sales funnel</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {LEAD_STATUS.map((status) => (
            <Link
              key={status}
              href={`/crm/leads?status=${encodeURIComponent(status)}`}
              className="card card-body card-border bg-base-100 hover:bg-base-200"
            >
              <span className={`badge badge-soft badge-${STATUS_BADGE[status]}`}>{countFor(status)}</span>
              <span className="text-sm font-semibold">{status}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}