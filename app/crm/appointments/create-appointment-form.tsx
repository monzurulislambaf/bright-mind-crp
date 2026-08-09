"use client";

import { useActionState } from "react";
import { createAppointment, type AppointmentActionState } from "@/services/appointment-actions";
import { APPOINTMENT_STATUS, APPOINTMENT_TYPE } from "@/lib/appointment/constants";

export function CreateAppointmentForm() {
  const [state, action, pending] = useActionState<AppointmentActionState, FormData>(
    createAppointment,
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
        <label className="label pb-1 text-sm font-medium" htmlFor="title">Title</label>
        <input id="title" name="title" required className="input w-full" placeholder="Appointment title" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="kind">Type</label>
          <select id="kind" name="kind" className="select w-full" defaultValue="other">
            {APPOINTMENT_TYPE.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="status">Status</label>
          <select id="status" name="status" className="select w-full" defaultValue="scheduled">
            {APPOINTMENT_STATUS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="startsAt">Starts at</label>
        <input id="startsAt" name="startsAt" type="datetime-local" required className="input w-full" />
      </div>
      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="endsAt">Ends at (optional)</label>
        <input id="endsAt" name="endsAt" type="datetime-local" className="input w-full" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="psychologist">Psychologist (optional)</label>
          <input id="psychologist" name="psychologist" className="input w-full" placeholder="Psychologist Mongo ID" />
        </div>
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="client">Client (optional)</label>
          <input id="client" name="client" className="input w-full" placeholder="Client Mongo ID" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="case">Case (optional)</label>
          <input id="case" name="case" className="input w-full" placeholder="Case Mongo ID" />
        </div>
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="organisation">Organisation (optional)</label>
          <input id="organisation" name="organisation" className="input w-full" placeholder="Organisation Mongo ID" />
        </div>
      </div>
      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="location">Location</label>
        <input id="location" name="location" className="input w-full" placeholder="Room, address or video link" />
      </div>
      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="notes">Notes</label>
        <textarea id="notes" name="notes" className="textarea w-full" placeholder="Notes…" />
      </div>
      <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
        {pending ? "Creating…" : "Create appointment"}
      </button>
    </form>
  );
}