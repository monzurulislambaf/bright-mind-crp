"use client";

import { useActionState } from "react";
import { addCaseNote, type CaseActionState } from "@/services/case-actions";

export function CaseNoteForm({ caseId }: { caseId: string }) {
  const [state, action, pending] = useActionState<CaseActionState, FormData>(
    addCaseNote,
    undefined
  );

  return (
    <form action={action} className="space-y-3">
      {state?.message && (
        <div role="alert" className="alert alert-soft alert-info sm:alert-horizontal">
          <span>{state.message}</span>
        </div>
      )}
      <input type="hidden" name="caseId" value={caseId} />
      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="internalNotes">
          Internal case note
        </label>
        <textarea
          id="internalNotes"
          name="internalNotes"
          className="textarea w-full"
          placeholder="Update the case team…"
        />
      </div>
      <button type="submit" className="btn btn-ghost" disabled={pending}>
        {pending ? "Saving…" : "Save note"}
      </button>
    </form>
  );
}