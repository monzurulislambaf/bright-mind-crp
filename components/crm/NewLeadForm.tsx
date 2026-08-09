"use client";

import { useActionState } from "react";
import { createLeadManual, type CrmActionState } from "@/services/crm-actions";

export function NewLeadForm() {
  const [state, action, pending] = useActionState<CrmActionState, FormData>(
    createLeadManual,
    undefined
  );

  const err = (f: string) => state?.errors?.[f]?.join(", ");

  return (
    <form action={action} className="space-y-4">
      {state?.message && (
        <div role="alert" className="alert alert-error alert-soft sm:alert-horizontal">
          <span>{state.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="firstName">First name</label>
          <input id="firstName" name="firstName" required className="input w-full" placeholder="Jane" />
          {err("firstName") && <p className="mt-1 text-sm text-error">{err("firstName")}</p>}
        </div>
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="lastName">Last name</label>
          <input id="lastName" name="lastName" className="input w-full" placeholder="Doe" />
        </div>
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="input w-full" placeholder="you@example.com" />
          {err("email") && <p className="mt-1 text-sm text-error">{err("email")}</p>}
        </div>
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" className="input w-full" placeholder="020 0000 0000" />
        </div>
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="company">Company / Firm</label>
          <input id="company" name="company" className="input w-full" placeholder="Your firm" />
        </div>
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="role">Role</label>
          <input id="role" name="role" className="input w-full" placeholder="Managing Partner" />
        </div>
        <div className="sm:col-span-2">
          <label className="label pb-1 text-sm font-medium" htmlFor="source">Source</label>
          <input id="source" name="source" required className="input w-full" placeholder="e.g. website, referral, trade show" />
          {err("source") && <p className="mt-1 text-sm text-error">{err("source")}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="label pb-1 text-sm font-medium" htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" className="textarea w-full" placeholder="Notes for the sales team…" />
        </div>
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
        {pending ? "Saving…" : "Create lead"}
      </button>
    </form>
  );
}