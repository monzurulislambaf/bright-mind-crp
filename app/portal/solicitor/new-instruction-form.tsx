"use client";

import { useActionState } from "react";
import { createInstruction, type PortalActionState } from "@/services/portal-actions";
import { CASE_STATUS } from "@/lib/cases/statuses";

export function NewInstructionForm() {
  const [state, action, pending] = useActionState<PortalActionState, FormData>(
    createInstruction,
    undefined
  );

  const err = (f: string) => state?.errors?.[f]?.join(", ");

  return (
    <form action={action} className="space-y-4">
      {state?.ok ? (
        <div role="alert" className="alert alert-success alert-soft">
          <span>Instruction created. We&apos;ll be in touch shortly.</span>
        </div>
      ) : (
        state?.message && (
          <div role="alert" className="alert alert-error alert-soft">
            <span>{state.message}</span>
          </div>
        )
      )}

      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="clientName">Client name</label>
        <input id="clientName" name="clientName" required className="input w-full" placeholder="Client referenced in the instruction" />
        {err("clientName") && <p className="mt-1 text-sm text-error">{err("clientName")}</p>}
      </div>
      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="serviceType">Service type</label>
        <input id="serviceType" name="serviceType" required className="input w-full" placeholder="e.g. Psychological Assessment" />
        {err("serviceType") && <p className="mt-1 text-sm text-error">{err("serviceType")}</p>}
      </div>
      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="reportType">Report type</label>
        <input id="reportType" name="reportType" required className="input w-full" placeholder="e.g. Expert Witness Report" />
        {err("reportType") && <p className="mt-1 text-sm text-error">{err("reportType")}</p>}
      </div>
      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="deadline">Deadline</label>
        <input id="deadline" name="deadline" type="date" required className="input w-full" />
        {err("deadline") && <p className="mt-1 text-sm text-error">{err("deadline")}</p>}
      </div>
      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="instructingParty">Instructing party (optional)</label>
        <input id="instructingParty" name="instructingParty" className="input w-full" placeholder="e.g. Defence solicitors" />
      </div>

      <div>
        <span className="text-sm font-medium text-base-content/70">Suggested status</span>
        <div className="mt-1">
          <span className="badge badge-soft badge-info">{CASE_STATUS[0]}</span>
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Submitting…" : "Submit instruction"}
      </button>
    </form>
  );
}