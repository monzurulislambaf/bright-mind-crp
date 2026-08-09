"use client";

import { useState, useTransition } from "react";
import { reviewPsychologist, suspendPsychologist } from "@/services/psychologist-actions";

export function ReviewForm({ psychologistId, currentStatus }: { psychologistId: string; currentStatus: string }) {
  const [reason, setReason] = useState("");
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const nextSteps = {
    Pending: "approve",
    "Under Review": "approve",
    "More Information Required": "approve",
    Approved: "suspend",
    Rejected: "approve",
    Suspended: "approve",
  };

  const suggested = nextSteps[currentStatus as keyof typeof nextSteps] || "approve";

  function submit(next: "approve" | "reject" | "suspend") {
    setMessage(null);
    const to = next === "approve" ? "Approved" : next === "reject" ? "Rejected" : "Suspended";
    const fn = next === "suspend" ? suspendPsychologist : reviewPsychologist;
    startTransition(async () => {
      const res = await fn(psychologistId, to, reason);
      if (res?.ok) setMessage({ type: "success", text: res.message ?? "Updated." });
      else setMessage({ type: "error", text: res?.message ?? "Failed." });
    });
  }

  if (pending) return <button className="btn btn-primary" disabled>Updating…</button>;

  return (
    <div className="space-y-3">
      {message && (
        <div className={`alert alert-soft ${message.type === "success" ? "alert-success" : "alert-error"}`}>
          <span>{message.text}</span>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button
          className={`btn ${suggested === "approve" ? "btn-primary" : "btn-ghost"}`}
          disabled={suggested === "approve" && currentStatus === "Approved"}
          onClick={() => submit("approve")}
        >
          Approve
        </button>
        <button
          className={`btn ${suggested === "reject" ? "btn-primary" : "btn-ghost"}`}
          disabled={suggested === "reject" && currentStatus === "Rejected"}
          onClick={() => submit("reject")}
        >
          Reject
        </button>
        <button
          className={`btn ${suggested === "suspend" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => submit("suspend")}
        >
          Suspend
        </button>
      </div>
      {["reject", "suspend"].includes(suggested) && (
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="reason">
            Reason (required)
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="textarea w-full"
            placeholder="Explain the decision…"
          />
        </div>
      )}
    </div>
  );
}