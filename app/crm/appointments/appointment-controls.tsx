"use client";

import { useTransition } from "react";
import { updateAppointmentStatus } from "@/services/appointment-actions";

const STATUS_OPTIONS = ["scheduled", "confirmed", "completed", "cancelled", "no_show"] as const;

export function AppointmentControls({ appointmentId }: { appointmentId: string }) {
  const [pending, startTransition] = useTransition();

  const run = (status: string) =>
    startTransition(() => { void updateAppointmentStatus(appointmentId, status); });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        className="select select-sm"
        defaultValue=""
        disabled={pending}
        onChange={(e) => e.target.value && run(e.target.value)}
      >
        <option value="" disabled>Change status…</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button
        type="button"
        className="btn btn-sm btn-outline btn-error"
        disabled={pending}
        onClick={() => run("cancelled")}
      >
        Cancel appointment
      </button>
    </div>
  );
}