"use client";

import { useActionState } from "react";
import { replyToTicket, type WorkActionState } from "@/services/work-actions";

export function ReplyForm({ ticketId }: { ticketId: string }) {
  const [state, action, pending] = useActionState<WorkActionState, FormData>(
    replyToTicket,
    undefined
  );

  return (
    <form action={action} className="space-y-3">
      {state?.message && (
        <div role="alert" className="alert alert-info alert-soft">
          <span>{state.message}</span>
        </div>
      )}
      <input type="hidden" name="ticketId" value={ticketId} />
      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="body">Message</label>
        <textarea id="body" name="body" required className="textarea w-full" placeholder="Reply…" />
      </div>
      <label className="label cursor-pointer justify-start gap-3 text-sm">
        <input id="internal" name="internal" type="checkbox" className="checkbox checkbox-sm" />
        Internal note (not visible to the reporter)
      </label>
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Sending…" : "Send reply"}
      </button>
    </form>
  );
}