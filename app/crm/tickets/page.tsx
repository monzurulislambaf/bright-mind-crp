import Link from "next/link";
import { listTickets, ticketStats } from "@/services/tickets";
import { CreateTicketForm } from "./create-ticket-form";
import { TICKET_STATUS_BADGE, TICKET_PRIORITY_BADGE } from "@/lib/work/badges";
import { TICKET_STATUS } from "@/lib/work/constants";
import { ListSearch } from "@/components/crm/ListSearch";

export const dynamic = "force-dynamic";

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const status = params.status || undefined;
  const search = params.search || undefined;
  const [tickets, stats] = await Promise.all([
    listTickets({ status, search }),
    ticketStats(),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Tickets</h1>
        <p className="mt-1 text-base-content/70">{tickets.length} ticket(s)</p>
      </div>

      <ListSearch path="/crm/tickets" search={search} status={status} statuses={TICKET_STATUS} />

      <div className="stats stats-vertical w-full bg-base-200 shadow-sm sm:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Open</div>
          <div className="stat-value text-info">{stats.open}</div>
        </div>
        <div className="stat">
          <div className="stat-title">In progress</div>
          <div className="stat-value text-warning">{stats.inProgress}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Resolved</div>
          <div className="stat-value text-success">{stats.resolved}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Escalated</div>
          <div className="stat-value text-error">{stats.escalated}</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card card-body card-border mt-6 bg-base-100 lg:col-span-2">
          <h2 className="text-lg font-semibold">All tickets</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => {
                  const sb = TICKET_STATUS_BADGE[t.status] ?? "neutral";
                  const pb = TICKET_PRIORITY_BADGE[t.priority] ?? "neutral";
                  return (
                    <tr key={String(t._id)}>
                      <td>
                        <div className="font-medium">{t.subject}</div>
                        <div className="text-xs text-base-content/60">{t.ticketId}</div>
                      </td>
                      <td className="text-sm capitalize">{t.category}</td>
                      <td>
                        <span className={`badge badge-soft badge-${pb}`}>{t.priority}</span>
                      </td>
                      <td>
                        <span className={`badge badge-soft badge-${sb}`}>{t.status}</span>
                      </td>
                      <td>
                        <Link href={`/crm/tickets/${String(t._id)}`} className="btn btn-ghost btn-xs">
                          Open →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {tickets.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-base-content/60">
                      No tickets yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card card-body card-border mt-6 bg-base-100">
          <h2 className="text-lg font-semibold">Open a ticket</h2>
          <div className="mt-2">
            <CreateTicketForm />
          </div>
        </div>
      </div>
    </div>
  );
}