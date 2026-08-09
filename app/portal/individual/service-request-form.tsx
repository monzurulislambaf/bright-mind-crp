"use client";

import { useActionState } from "react";
import { submitServiceRequest, type PortalActionState } from "@/services/portal-actions";

export function ServiceRequestForm() {
  const [state, action, pending] = useActionState<PortalActionState, FormData>(
    submitServiceRequest,
    undefined
  );

  return (
    <form action={action} className="space-y-4">
      {state?.ok ? (
        <div role="alert" className="alert alert-success alert-soft">
          <span>Request submitted. We&apos;ll be in touch soon.</span>
        </div>
      ) : (
        state?.message && (
          <div role="alert" className="alert alert-error alert-soft">
            <span>{state.message}</span>
          </div>
        )
      )}

      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="serviceType">What do you need help with?</label>
        <select id="serviceType" name="serviceType" required className="select w-full" defaultValue="">
          <option value="" disabled>Select a service…</option>
          <option value="Psychological Assessment">Psychological Assessment</option>
          <option value="Therapy / Counselling">Therapy / Counselling</option>
          <option value="Medico-Legal Report">Medico-Legal Report</option>
          <option value="Occupational Health">Occupational Health</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="notes">Notes (optional)</label>
        <textarea id="notes" name="notes" className="textarea w-full" placeholder="Anything that would help us prepare…" />
      </div>

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Submitting…" : "Submit request"}
      </button>
    </form>
  );
}