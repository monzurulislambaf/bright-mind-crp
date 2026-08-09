"use client";

import { useState, useTransition } from "react";
import { createActivity } from "@/services/crm-actions";

const TYPES = ["call", "email", "meeting", "note", "follow_up"] as const;
const DIRECTIONS = ["outbound", "inbound"] as const;

export function ActivityLog({
  leadId,
  canLog,
  activities,
}: {
  leadId: string;
  canLog: boolean;
  activities: Array<{
    _id: string;
    type: string;
    direction?: string;
    summary: string;
    detail?: string;
    createdAt: string;
    createdBy?: string;
  }>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function submit(formData: FormData) {
    startTransition(async () => {
      const res = await createActivity(undefined, formData);
      if (!res?.ok) setMessage(res?.message ?? "Failed to log activity.");
    });
  }

  return (
    <div className="card card-body card-border bg-base-100">
      <div className="flex items-center justify-between">
        <h2 className="card-title">Activity & timeline</h2>
        {canLog && (
          <button className="btn btn-sm btn-ghost" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Close" : "+ Log activity"}
          </button>
        )}
      </div>

      {message && (
        <div role="alert" className="alert alert-error alert-soft sm:alert-horizontal">
          <span>{message}</span>
        </div>
      )}

      {showForm && canLog && (
        <form action={submit} className="mt-4 max-w-2xl">
          <input type="hidden" name="leadId" value={leadId} />
          <div className="mb-2 flex flex-wrap gap-2">
            <select name="type" defaultValue="note" className="select select-sm bg-base-100">
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === "follow_up" ? "Follow-up / Task" : t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
            <select name="direction" className="select select-sm bg-base-100">
              {DIRECTIONS.map((d) => (
                <option key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </select>
            <input name="dueAt" type="datetime-local" className="input input-sm bg-base-100" aria-label="Due date" />
          </div>
          <input name="summary" required placeholder="Short summary of the activity" className="input mb-2 w-full" />
          <textarea name="detail" placeholder="Additional detail (optional)" className="textarea mb-2 w-full" />
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? "Saving…" : "Save activity"}
          </button>
        </form>
      )}

      <div className="mt-4 space-y-3">
        {activities.length === 0 && (
          <p className="text-sm text-base-content/60">
            No activities recorded yet.
          </p>
        )}
        {activities.map((a) => (
          <div key={a._id} className="border-l-2 border-base-300 pl-4">
            <div className="flex items-center gap-2">
              <span className="badge badge-soft">{a.type}</span>
              {a.direction && <span className="text-xs text-base-content/50">{a.direction}</span>}
              <span className="text-xs text-base-content/50">{new Date(a.createdAt).toLocaleString()}</span>
            </div>
            <p className="mt-1 text-sm font-medium">{a.summary}</p>
            {a.detail && <p className="text-sm text-base-content/70">{a.detail}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}