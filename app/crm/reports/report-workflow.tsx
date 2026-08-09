"use client";

import { useState, useTransition } from "react";
import {
  updateReportDraft,
  submitForReview,
  reviewReport,
  finalizeReport,
  releaseReport,
  type ReportActionState,
} from "@/services/report-actions";

type Props = {
  reportId: string;
  status: string;
  canEdit: boolean;
  canReview: boolean;
  canApprove: boolean;
  canRelease: boolean;
  title: string;
  body: string;
};

export function ReportWorkflow({
  reportId,
  status,
  canEdit,
  canReview,
  canApprove,
  canRelease,
  title,
  body,
}: Props) {
  const [message, setMessage] = useState<ReportActionState>(undefined);
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<ReportActionState>) =>
    startTransition(async () => {
      setMessage(await fn());
    });

  const isDraft = status === "Draft" || status === "Amendment";

  return (
    <div className="space-y-3">
      {message && (
        <div
          role="status"
          className={`alert ${message.ok ? "alert-success" : "alert-error"} alert-soft`}
        >
          <span>{message.message}</span>
        </div>
      )}

      {canEdit && isDraft && (
        <form
          className="space-y-3"
          action={async (formData) => {
            setMessage(
              await updateReportDraft(
                reportId,
                String(formData.get("title") ?? title),
                String(formData.get("body") ?? body)
              )
            );
          }}
        >
          <input name="title" defaultValue={title} className="input w-full" placeholder="Title" />
          <textarea
            name="body"
            defaultValue={body}
            rows={12}
            className="textarea w-full"
            placeholder="Report content…"
          />
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? "Saving…" : "Save revision"}
          </button>
        </form>
      )}

      {canEdit && isDraft && (
        <button
          type="button"
          className="btn btn-primary btn-block"
          disabled={pending}
          onClick={() => run(() => submitForReview(reportId))}
        >
          Submit for quality review
        </button>
      )}

      {status === "Quality Review" && canReview && (
        <div className="space-y-2 rounded-lg bg-base-200 p-3">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="textarea w-full"
            placeholder="Review note (optional)"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-sm btn-success"
              disabled={pending}
              onClick={() => run(() => reviewReport(reportId, "approve", note))}
            >
              Approve
            </button>
            <button
              type="button"
              className="btn btn-sm btn-warning"
              disabled={pending}
              onClick={() => run(() => reviewReport(reportId, "amend", note))}
            >
              Request amendments
            </button>
          </div>
        </div>
      )}

      {status === "Approved" && canApprove && (
        <button
          type="button"
          className="btn btn-primary btn-block"
          disabled={pending}
          onClick={() => run(() => finalizeReport(reportId))}
        >
          Mark as Final
        </button>
      )}

      {status === "Final" && canRelease && (
        <button
          type="button"
          className="btn btn-success btn-block"
          disabled={pending}
          onClick={() => run(() => releaseReport(reportId))}
        >
          Release securely
        </button>
      )}
    </div>
  );
}