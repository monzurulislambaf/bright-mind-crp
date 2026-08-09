"use client";

import { useTransition } from "react";
import { updateTicket } from "@/services/work-actions";

export function TicketControls({ ticketId }: { ticketId: string }) {
  const [pending, startTransition] = useTransition();

  const run = (patch: Parameters<typeof updateTicket>[1]) =>
    startTransition(() => { void updateTicket(ticketId, patch); });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        className="select select-sm"
        defaultValue=""
        disabled={pending}
        onChange={(e) => e.target.value && run({ status: e.target.value })}
      >
        <option value="" disabled>Change status…</option>
        <option value="open">Open</option>
        <option value="in_progress">In progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>
      <select
        className="select select-sm"
        defaultValue=""
        disabled={pending}
        onChange={(e) => e.target.value && run({ priority: e.target.value })}
      >
        <option value="" disabled>Priority…</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>
      <button
        type="button"
        className="btn btn-sm btn-outline btn-warning"
        disabled={pending}
        onClick={() => run({ escalate: true })}
      >
        Escalate
      </button>
    </div>
  );
}