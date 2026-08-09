"use client";

import { useState, useTransition } from "react";
import { updateCaseStatus } from "@/services/case-actions";

const STEPS = [
  "New Instruction",
  "Initial Review",
  "Quotation",
  "Approved",
  "Psychologist Allocation",
  "Assessment",
  "Report Preparation",
  "Quality Review",
  "Secure Release",
  "Closed",
];

export function StatusMover({ caseId }: { caseId: string }) {
  const [status, setStatus] = useState<string>("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="grow">
        <label className="label pb-1 text-sm font-medium">Move case status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="select w-full"
        >
          <option value="" disabled>
            Choose a status…
          </option>
          {STEPS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        className="btn btn-primary"
        disabled={!status || pending}
        onClick={() => startTransition(() => { void updateCaseStatus(caseId, status); })}
      >
        {pending ? "Updating…" : "Move"}
      </button>
    </div>
  );
}