import Link from "next/link";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";
import { crmStats, listLeadsByStatus, listLeads } from "@/services/crm";
import { caseStats } from "@/services/cases";
import { reportStats } from "@/services/reports";
import { taskStats, listTasks } from "@/services/tasks";
import { ticketStats, listTickets } from "@/services/tickets";
import { appointmentStats, listAppointments } from "@/services/appointments";
import { STATUS_BADGE, FUNNEL, NON_FUNNEL } from "@/lib/crm/funnel";

export const dynamic = "force-dynamic";

const FUNNEL_BAR: Record<string, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  info: "bg-info",
  neutral: "bg-neutral",
  accent: "bg-accent",
};

const PRIORITY_BADGE: Record<string, string> = {
  low: "neutral",
  medium: "info",
  high: "warning",
  urgent: "error",
};

const TASK_STATUS_BADGE: Record<string, string> = {
  todo: "neutral",
  in_progress: "info",
  in_review: "warning",
  done: "success",
};

const TICKET_STATUS_BADGE: Record<string, string> = {
  open: "error",
  in_progress: "warning",
  resolved: "success",
  closed: "neutral",
};

export default async function CrmDashboardPage() {
  const user = await requireAuth();
  const can = (p: Parameters<typeof hasPermission>[1]) =>
    hasPermission(user.role, p);

  const [stats, byStatus, cstats, rstats] = await Promise.all([
    can("leads:read") ? crmStats() : Promise.resolve({ total: 0, newToday: 0, qualified: 0, converted: 0, lost: 0 }),
    can("leads:read")
      ? listLeadsByStatus()
      : Promise.resolve([] as Array<{ _id: string; count: number }>),
    can("cases:read")
      ? caseStats()
      : Promise.resolve({ total: 0, inProgress: 0, released: 0, closed: 0, overdue: 0, upforAllocation: 0 }),
    can("reports:read")
      ? reportStats()
      : Promise.resolve({ draft: 0, review: 0, approved: 0, amendment: 0, final: 0, released: 0 }),
  ]);

  const [
    recentLeads,
    tstats,
    recentTasks,
    tkstats,
    recentTickets,
    astats,
    upcoming,
  ] = await Promise.all([
    can("leads:read") ? listLeads({ page: 1, pageSize: 6 }) : Promise.resolve(null),
    can("tasks:read") ? taskStats() : Promise.resolve(null),
    can("tasks:read") ? listTasks({}) : Promise.resolve([]),
    can("tickets:read") ? ticketStats() : Promise.resolve(null),
    can("tickets:read") ? listTickets({}) : Promise.resolve([]),
    can("appointments:read") ? appointmentStats() : Promise.resolve(null),
    can("appointments:read")
      ? listAppointments({ status: "scheduled" })
      : Promise.resolve([]),
  ]);

  const countFor = (s: string) => byStatus.find((b) => b._id === s)?.count ?? 0;
  const totalByStatus = byStatus.reduce((sum, b) => sum + b.count, 0) || 1;
  const funnelMax = Math.max(
    1,
    ...FUNNEL.map((s) => countFor(s)),
    ...NON_FUNNEL.map((s) => countFor(s))
  );

  const openTasks = (recentTasks ?? [])
    .filter((t) => t.status !== "done")
    .slice(0, 5);
  const openTickets = (recentTickets ?? [])
    .filter((t) => t.status === "open" || t.status === "in_progress")
    .slice(0, 5);
  const upcomingAppts = (upcoming ?? []).slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM Dashboard</h1>
          <p className="mt-1 text-base-content/70">
            Your sales overview at a glance.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
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

      {/* Sales funnel */}
      <div className="card card-body card-border mt-8 bg-base-100">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Sales funnel</h2>
          <Link href="/crm/pipeline" className="link link-hover text-sm">
            Open pipeline →
          </Link>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {FUNNEL.map((status) => {
            const count = countFor(status);
            const pct = Math.max(4, Math.round((count / funnelMax) * 100));
            return (
              <Link
                key={status}
                href={`/crm/leads?status=${encodeURIComponent(status)}`}
                className="card card-body gap-2 bg-base-200 p-3 hover:bg-base-300"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold">{status}</span>
                  <span className={`badge badge-soft badge-${STATUS_BADGE[status]}`}>
                    {count}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-base-100">
                  <div
                    className={`h-full rounded-full ${FUNNEL_BAR[STATUS_BADGE[status]] ?? "bg-primary"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {NON_FUNNEL.map((status) => (
            <Link
              key={status}
              href={`/crm/leads?status=${encodeURIComponent(status)}`}
              className="badge badge-soft badge-ghost gap-1 py-3 hover:bg-base-200"
            >
              {status}
              <span className={`badge badge-sm badge-${STATUS_BADGE[status]}`}>
                {countFor(status)}
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-2 text-xs text-base-content/50">
          {totalByStatus} lead(s) across all stages.
        </p>
      </div>

      {can("cases:read") && (
        <>
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
        </>
      )}

      {can("reports:read") && (
        <>
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
        </>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {can("leads:read") && recentLeads && (
          <section className="card card-body card-border bg-base-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent leads</h2>
              <Link href="/crm/leads" className="link link-hover text-sm">
                View all →
              </Link>
            </div>
            <div className="mt-2 space-y-2">
              {recentLeads.leads.length === 0 && (
                <p className="py-4 text-center text-sm text-base-content/50">
                  No leads yet.
                </p>
              )}
              {recentLeads.leads.map((lead) => (
                <Link
                  key={String(lead._id)}
                  href={`/crm/leads/${String(lead._id)}`}
                  className="flex items-center justify-between gap-3 rounded-box bg-base-200 px-3 py-2 hover:bg-base-300"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">
                      {lead.firstName} {lead.lastName ?? ""}
                    </div>
                    <div className="truncate text-xs text-base-content/60">
                      {lead.email ?? ""} · {lead.company ?? "—"}
                    </div>
                  </div>
                  <span className={`badge badge-soft badge-${STATUS_BADGE[lead.status as keyof typeof STATUS_BADGE]}`}>
                    {lead.status}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {can("tasks:read") && tstats && (
          <section className="card card-body card-border bg-base-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Tasks</h2>
              <Link href="/crm/tasks" className="link link-hover text-sm">
                View all →
              </Link>
            </div>
            <div className="stats stats-vertical my-2 bg-base-200 shadow-sm sm:stats-horizontal">
              <div className="stat">
                <div className="stat-title">Open</div>
                <div className="stat-value text-warning">{tstats.todo}</div>
              </div>
              <div className="stat">
                <div className="stat-title">In progress</div>
                <div className="stat-value text-info">{tstats.inProgress}</div>
              </div>
              <div className="stat">
                <div className="stat-title">In review</div>
                <div className="stat-value">{tstats.review}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Done</div>
                <div className="stat-value text-success">{tstats.done}</div>
              </div>
            </div>
            <div className="space-y-2">
              {openTasks.length === 0 && (
                <p className="py-2 text-center text-sm text-base-content/50">
                  No open tasks.
                </p>
              )}
              {openTasks.map((task) => (
                <div
                  key={String(task._id)}
                  className="flex items-center justify-between gap-3 rounded-box bg-base-200 px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{task.title}</div>
                    <div className="text-xs text-base-content/60">
                      {task.dueAt
                        ? `Due ${new Date(task.dueAt as Date).toLocaleDateString()}`
                        : "No due date"}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {task.priority && (
                      <span className={`badge badge-soft badge-sm badge-${PRIORITY_BADGE[String(task.priority)] ?? "neutral"}`}>
                        {String(task.priority)}
                      </span>
                    )}
                    <span className={`badge badge-soft badge-sm badge-${TASK_STATUS_BADGE[String(task.status)] ?? "neutral"}`}>
                      {String(task.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {can("appointments:read") && astats && (
          <section className="card card-body card-border bg-base-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Appointments</h2>
              <Link href="/crm/appointments" className="link link-hover text-sm">
                View all →
              </Link>
            </div>
            <div className="stats stats-vertical my-2 bg-base-200 shadow-sm sm:stats-horizontal">
              <div className="stat">
                <div className="stat-title">Scheduled</div>
                <div className="stat-value text-info">{astats.scheduled}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Confirmed</div>
                <div className="stat-value text-success">{astats.confirmed}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Completed</div>
                <div className="stat-value">{astats.completed}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Cancelled</div>
                <div className="stat-value text-error">{astats.cancelled}</div>
              </div>
            </div>
            <div className="space-y-2">
              {upcomingAppts.length === 0 && (
                <p className="py-2 text-center text-sm text-base-content/50">
                  No upcoming appointments.
                </p>
              )}
              {upcomingAppts.map((appt) => (
                <div
                  key={String(appt._id)}
                  className="flex items-center justify-between gap-3 rounded-box bg-base-200 px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">
                      {appt.title || "Assessment"}
                    </div>
                    <div className="text-xs text-base-content/60">
                      {new Date(appt.startsAt as Date).toLocaleString()}
                    </div>
                  </div>
                  <span className="badge badge-soft badge-sm badge-neutral">
                    {String(appt.kind ?? "other")}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {can("tickets:read") && tkstats && (
          <section className="card card-body card-border bg-base-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Tickets</h2>
              <Link href="/crm/tickets" className="link link-hover text-sm">
                View all →
              </Link>
            </div>
            <div className="stats stats-vertical my-2 bg-base-200 shadow-sm sm:stats-horizontal">
              <div className="stat">
                <div className="stat-title">Open</div>
                <div className="stat-value text-error">{tkstats.open}</div>
              </div>
              <div className="stat">
                <div className="stat-title">In progress</div>
                <div className="stat-value text-warning">{tkstats.inProgress}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Escalated</div>
                <div className="stat-value">{tkstats.escalated}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Resolved</div>
                <div className="stat-value text-success">{tkstats.resolved}</div>
              </div>
            </div>
            <div className="space-y-2">
              {openTickets.length === 0 && (
                <p className="py-2 text-center text-sm text-base-content/50">
                  No open tickets.
                </p>
              )}
              {openTickets.map((ticket) => (
                <div
                  key={String(ticket._id)}
                  className="flex items-center justify-between gap-3 rounded-box bg-base-200 px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">
                      {ticket.subject}
                    </div>
                    <div className="text-xs text-base-content/60">
                      {String(ticket.category ?? "")}
                    </div>
                  </div>
                  <span className={`badge badge-soft badge-sm badge-${TICKET_STATUS_BADGE[String(ticket.status)] ?? "neutral"}`}>
                    {String(ticket.status)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
