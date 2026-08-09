"use client";

import { useCallback, useState, useTransition } from "react";
import { FUNNEL, nextFunnelStatus, STATUS_BADGE } from "@/lib/crm/funnel";
import { type LeadStatus } from "@/lib/crm/statuses";
import {
  moveLeadStage,
  qualifyLead,
  convertQualifiedLead,
  type CrmActionState,
} from "@/services/crm-actions";

export function LeadStageMover({
  leadId,
  status,
  qualifiedId,
  permission,
}: {
  leadId: string;
  status: string;
  qualifiedId?: string;
  permission: { move: boolean; qualify: boolean; convert: boolean };
}) {
  const current = status as LeadStatus;
  const [pending, startTransition] = useTransition();
  const [lostReason, setLostReason] = useState("");
  const [kind, setKind] = useState("individual");
  const [message, setMessage] = useState<string | null>(null);

  const act = useCallback((fn: () => Promise<CrmActionState>) => {
    startTransition(async () => {
      const res = await fn();
      setMessage(res?.ok ? null : (res?.message ?? "Action failed."));
    });
  }, []);

  const openLostModal = useCallback(() => {
    const dialog = document.getElementById("lost-modal");
    if (dialog instanceof HTMLDialogElement) dialog.showModal();
  }, []);

  const inFunnel = FUNNEL.includes(current);
  const next = nextFunnelStatus(current);

  return (
    <div className="card card-body card-border bg-base-100">
      <h2 className="card-title">Funnel stage</h2>
      <div className="flex flex-wrap items-center gap-3">
        <span className={`badge badge-lg badge-${STATUS_BADGE[current]}`}>{current}</span>
        {inFunnel && (
          <progress
            className="progress progress-primary w-full max-w-xs"
            value={FUNNEL.indexOf(current) + 1}
            max={FUNNEL.length}
          />
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {FUNNEL.map((stage) => (
          <button
            key={stage}
            className={`btn btn-sm ${stage === current ? "btn-primary" : "btn-ghost"}`}
            disabled={!permission.move || pending}
            onClick={() => act(() => moveLeadStage(leadId, stage))}
          >
            {stage}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {!inFunnel && (current === "Lost" || current === "Unqualified") && (
          <button className="btn btn-ghost" disabled={pending} onClick={() => act(() => moveLeadStage(leadId, "New"))}>
            Reopen
          </button>
        )}
        <button className="btn btn-outline" disabled={pending} onClick={openLostModal}>
          Mark as Lost
        </button>
        {permission.qualify && (
          <div className="flex items-center gap-2">
            <select value={kind} onChange={(e) => setKind(e.target.value)} className="select select-sm bg-base-100">
              <option value="individual">Individual</option>
              <option value="solicitor">Solicitor</option>
              <option value="psychologist">Psychologist</option>
              <option value="other">Other</option>
            </select>
            <button className="btn btn-success" disabled={pending} onClick={() => act(() => qualifyLead(leadId, kind as "individual" | "solicitor" | "psychologist" | "other"))}>
              Qualify
            </button>
          </div>
        )}
        {permission.convert && qualifiedId && (
          <button className="btn btn-primary" disabled={pending} onClick={() => act(() => convertQualifiedLead(qualifiedId))}>
            Convert to Onboarding
          </button>
        )}
      </div>

      {next && (
        <p className="mt-2 text-xs text-base-content/50">
          Suggested next stage: <span className="font-medium">{next}</span>
        </p>
      )}

      {message && (
        <div role="alert" className="alert alert-error alert-soft mt-4 sm:alert-horizontal">
          <span>{message}</span>
        </div>
      )}

      <dialog id="lost-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Mark lead as Lost</h3>
          <p className="py-2 text-sm text-base-content/70">
            A reason is required and recorded on the audit trail.
          </p>
          <textarea
            className="textarea w-full"
            placeholder="Why is this lead lost?"
            value={lostReason}
            onChange={(e) => setLostReason(e.target.value)}
          />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>
            <button
              className="btn btn-error"
              disabled={!lostReason.trim() || pending}
              onClick={() => {
                act(() => moveLeadStage(leadId, "Lost", { lostReason: lostReason.trim() }));
                setLostReason("");
              }}
            >
              Mark Lost
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}