"use client";

import { useActionState } from "react";
import { uploadCaseDocument, type DocumentActionState } from "@/services/document-actions";

export function DocumentUploadForm({ caseId }: { caseId: string }) {
  const [state, action, pending] = useActionState<DocumentActionState, FormData>(
    uploadCaseDocument,
    undefined
  );

  return (
    <form action={action} className="space-y-3">
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

      <input type="hidden" name="caseId" value={caseId} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="title">Title</label>
          <input id="title" name="title" required className="input w-full" placeholder="e.g. Draft report v1" />
        </div>
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="category">Category</label>
          <select id="category" name="category" className="select w-full" defaultValue="">
            <option value="">— None —</option>
            <option value="report">Report</option>
            <option value="assessment">Assessment</option>
            <option value="correspondence">Correspondence</option>
            <option value="invoice">Invoice</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="file">File</label>
        <input id="file" name="file" type="file" required className="file-input w-full" />
      </div>
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}