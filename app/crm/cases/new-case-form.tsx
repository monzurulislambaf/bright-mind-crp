"use client";

import { useActionState } from "react";
import { createCase, type CaseActionState } from "@/services/case-actions";

type Org = { _id: unknown; name?: string | null };
type Sol = { _id: unknown; contactName?: string | null; organisation?: unknown };
type Cli = { _id: unknown; firstName?: string | null; lastName?: string | null };

export function NewCaseForm({
  organisations,
  solicitors,
  clients,
}: {
  organisations: Org[];
  solicitors: Sol[];
  clients: Cli[];
}) {
  const [state, action, pending] = useActionState<CaseActionState, FormData>(
    createCase,
    undefined
  );

  const err = (f: string) => state?.errors?.[f]?.join(", ");

  return (
    <form action={action} className="space-y-4">
      {state?.ok ? (
        <div role="alert" className="alert alert-success alert-soft">
          <span>{state.message}</span>
        </div>
      ) : (
        state?.message && (
          <div role="alert" className="alert alert-error alert-soft">
            <span>{state.message}</span>
          </div>
        )
      )}

      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="instructingParty">Instructing party</label>
        <input id="instructingParty" name="instructingParty" required className="input w-full" placeholder="e.g. Defence solicitors / John Smith" />
        {err("instructingParty") && <p className="mt-1 text-sm text-error">{err("instructingParty")}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="organisation">Organisation</label>
          <select id="organisation" name="organisation" className="select w-full" defaultValue="">
            <option value="">— None —</option>
            {organisations.map((o) => (
              <option key={String(o._id)} value={String(o._id)}>{o.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="solicitor">Solicitor</label>
          <select id="solicitor" name="solicitor" className="select w-full" defaultValue="">
            <option value="">— None —</option>
            {solicitors.map((s) => (
              <option key={String(s._id)} value={String(s._id)}>{s.contactName ?? "Unnamed"}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="client">Client (individual)</label>
        <select id="client" name="client" className="select w-full" defaultValue="">
          <option value="">— None —</option>
          {clients.map((c) => (
            <option key={String(c._id)} value={String(c._id)}>{`${c.firstName ?? ""} ${c.lastName ?? ""}`.trim() || "Unnamed"}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="serviceType">Service type</label>
          <input id="serviceType" name="serviceType" required className="input w-full" placeholder="e.g. Psychological assessment" />
          {err("serviceType") && <p className="mt-1 text-sm text-error">{err("serviceType")}</p>}
        </div>
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="reportType">Report type</label>
          <input id="reportType" name="reportType" required className="input w-full" placeholder="e.g. Expert witness report" />
          {err("reportType") && <p className="mt-1 text-sm text-error">{err("reportType")}</p>}
        </div>
      </div>

      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="deadline">Deadline</label>
        <input id="deadline" name="deadline" type="date" required className="input w-full" />
        {err("deadline") && <p className="mt-1 text-sm text-error">{err("deadline")}</p>}
      </div>

      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="internalNotes">Internal notes</label>
        <textarea id="internalNotes" name="internalNotes" className="textarea w-full" placeholder="Notes for the case team…" />
      </div>

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Creating…" : "Create case"}
      </button>
    </form>
  );
}