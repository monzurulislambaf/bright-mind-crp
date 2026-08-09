"use client";

import { useState, useTransition } from "react";
import { offerToPsychologist, assignPsychologist } from "@/services/case-actions";

type Psych = { _id: unknown; firstName?: string; lastName?: string; psychologistId?: string };

function psychLabel(p: Psych) {
  return `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim() || p.psychologistId || "Unnamed";
}

export function OfferPsychologists({ caseId, psychologists }: { caseId: string; psychologists: Psych[] }) {
  const [psych, setPsych] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="grow">
        <label className="label pb-1 text-sm font-medium">Send an offer</label>
        <select value={psych} onChange={(e) => setPsych(e.target.value)} className="select w-full">
          <option value="" disabled>Select an approved psychologist…</option>
          {psychologists.map((p) => (
            <option key={String(p._id)} value={String(p._id)}>{psychLabel(p)}</option>
          ))}
        </select>
      </div>
      <button
        type="button"
        className="btn btn-primary"
        disabled={!psych || pending}
        onClick={() => startTransition(() => { void offerToPsychologist(caseId, psych); })}
      >
        {pending ? "Sending…" : "Send offer"}
      </button>
    </div>
  );
}

export function AssignPsychologist({ caseId, psychologists }: { caseId: string; psychologists: Psych[] }) {
  const [psych, setPsych] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="grow">
        <label className="label pb-1 text-sm font-medium">Directly assign</label>
        <select value={psych} onChange={(e) => setPsych(e.target.value)} className="select w-full">
          <option value="" disabled>Select a psychologist…</option>
          {psychologists.map((p) => (
            <option key={String(p._id)} value={String(p._id)}>{psychLabel(p)}</option>
          ))}
        </select>
      </div>
      <button
        type="button"
        className="btn btn-outline btn-primary"
        disabled={!psych || pending}
        onClick={() => startTransition(() => { void assignPsychologist(caseId, psych); })}
      >
        {pending ? "Assigning…" : "Assign"}
      </button>
    </div>
  );
}