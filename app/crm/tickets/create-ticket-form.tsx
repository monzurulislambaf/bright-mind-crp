"use client";

import { useActionState } from "react";
import { createTicket, type WorkActionState } from "@/services/work-actions";
import { TICKET_CATEGORY, TICKET_PRIORITY } from "@/lib/work/constants";

export function CreateTicketForm() {
  const [state, action, pending] = useActionState<WorkActionState, FormData>(
    createTicket,
    undefined
  );

  return (
    <form action={action} className="space-y-3">
      {state?.ok && (
        <div role="alert" className="alert alert-success alert-soft">
          <span>{state.message}</span>
        </div>
      )}
      {state?.message && !state.ok && (
        <div role="alert" className="alert alert-error alert-soft">
          <span>{state.message}</span>
        </div>
      )}
      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="subject">Subject</label>
        <input id="subject" name="subject" required className="input w-full" placeholder="What can we help with?" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="category">Category</label>
          <select id="category" name="category" className="select w-full" defaultValue="support">
            {TICKET_CATEGORY.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="priority">Priority</label>
          <select id="priority" name="priority" className="select w-full" defaultValue="medium">
            {TICKET_PRIORITY.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="case">Case ID</label>
        <input id="case" name="case" className="input w-full" placeholder="Mongo case id (optional)" />
      </div>
      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="body">First message</label>
        <textarea id="body" name="body" className="textarea w-full" placeholder="Describe the issue…" />
      </div>
      <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
        {pending ? "Opening…" : "Open ticket"}
      </button>
    </form>
  );
}