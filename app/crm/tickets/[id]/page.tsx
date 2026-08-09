import Link from "next/link";
import { notFound } from "next/navigation";
import { getTicket } from "@/services/tickets";
import { TICKET_STATUS_BADGE, TICKET_PRIORITY_BADGE } from "@/lib/work/badges";
import { ReplyForm } from "../reply-form";
import { TicketControls } from "../ticket-controls";

export const dynamic = "force-dynamic";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = await getTicket(id);
  if (!ticket) notFound();

  const sb = TICKET_STATUS_BADGE[ticket.status] ?? "neutral";
  const pb = TICKET_PRIORITY_BADGE[ticket.priority] ?? "neutral";

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <Link href="/crm/tickets" className="link link-hover text-sm text-base-content/70">
        ← Back to tickets
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{ticket.subject}</h1>
          <p className="mt-1 text-base-content/70">{ticket.ticketId}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`badge badge-soft badge-${sb}`}>{ticket.status}</span>
          <span className={`badge badge-soft badge-${pb}`}>{ticket.priority}</span>
          {ticket.escalated && <span className="badge badge-soft badge-error">Escalated</span>}
        </div>
      </div>

      <div className="card card-body card-border mt-6 bg-base-100">
        <h2 className="text-lg font-semibold">Thread</h2>
        {ticket.messages.length === 0 ? (
          <p className="text-sm text-base-content/60">No messages yet.</p>
        ) : (
          <div className="mt-2 space-y-3">
            {ticket.messages.map((m, i) => (
              <div key={i} className="rounded-lg bg-base-200 p-3">
                <div className="mb-1 flex items-center gap-2 text-xs text-base-content/60">
                  <span>Message #{i + 1}</span>
                  {m.internal && <span className="badge badge-soft badge-warning">Internal</span>}
                </div>
                <p className="text-sm whitespace-pre-wrap">{m.body}</p>
              </div>
            ))}
          </div>
        )}
        {ticket.resolution && (
          <div className="mt-3 rounded-lg bg-success/10 p-3">
            <p className="text-sm font-medium text-success">Resolution</p>
            <p className="text-sm">{ticket.resolution}</p>
          </div>
        )}
      </div>

      <div className="card card-body card-border mt-6 bg-base-100">
        <h2 className="text-lg font-semibold">Manage</h2>
        <div className="mt-3">
          <TicketControls ticketId={id} />
        </div>
        <div className="divider" />
        <ReplyForm ticketId={id} />
      </div>
    </div>
  );
}