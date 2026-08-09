"use client";

import { useActionState } from "react";
import { updatePsychologistProfile, type PortalActionState } from "@/services/portal-actions";

export function PsychologistProfileForm() {
  const [state, action, pending] = useActionState<PortalActionState, FormData>(
    updatePsychologistProfile,
    undefined
  );

  return (
    <form action={action} className="space-y-4">
      {state?.ok && (
        <div role="alert" className="alert alert-success alert-soft sm:alert-horizontal">
          <span>Profile saved.</span>
        </div>
      )}
      {state?.message && !state.ok && (
        <div role="alert" className="alert alert-error alert-soft sm:alert-horizontal">
          <span>{state.message}</span>
        </div>
      )}

      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="expertise">
          Expertise (comma separated)
        </label>
        <input id="expertise" name="expertise" className="input w-full" placeholder="e.g. PTSD, neuropsychology, personal injury" />
      </div>
      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="jurisdictions">
          Jurisdictions (comma separated)
        </label>
        <input id="jurisdictions" name="jurisdictions" className="input w-full" placeholder="e.g. England & Wales, Northern Ireland" />
      </div>
      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="qualifications">
          Qualifications (comma separated)
        </label>
        <input id="qualifications" name="qualifications" className="input w-full" placeholder="e.g. Doctorate in Clinical Psychology, BPS" />
      </div>
      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="availability">
          Availability
        </label>
        <input id="availability" name="availability" className="input w-full" placeholder="e.g. 2 reports per month" />
      </div>
      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="insuranceDetails">
          Professional indemnity insurance
        </label>
        <textarea id="insuranceDetails" name="insuranceDetails" className="textarea w-full" placeholder="Insurer and policy details" />
      </div>

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}