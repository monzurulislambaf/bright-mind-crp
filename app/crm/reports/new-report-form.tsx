"use client";

import { useActionState } from "react";
import { createReport, type ReportActionState } from "@/services/report-actions";

export type CaseOption = { _id: string; caseId: string; reportType?: string };

export function NewReportForm({ cases }: { cases: CaseOption[] }) {
  const [state, action, pending] = useActionState<ReportActionState, FormData>(
    createReport,
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
        <label className="label pb-1 text-sm font-medium" htmlFor="case">Case</label>
        <select id="case" name="case" required className="select w-full" defaultValue="">
          <option value="" disabled>Select a case…</option>
          {cases.map((c) => (
            <option key={c._id} value={c._id}>
              {c.caseId}{c.reportType ? ` · ${c.reportType}` : ""}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="title">Title</label>
        <input id="title" name="title" required className="input w-full" placeholder="Report title" />
      </div>
      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="body">Content</label>
        <textarea id="body" name="body" rows={12} className="textarea w-full" placeholder="Draft the report…" />
      </div>
      <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
        {pending ? "Creating…" : "Create report draft"}
      </button>
    </form>
  );
}