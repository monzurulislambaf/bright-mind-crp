import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppointment } from "@/services/appointments";
import { AppointmentControls } from "../appointment-controls";

export const dynamic = "force-dynamic";

const APPT_STATUS_BADGE: Record<string, string> = {
  scheduled: "info",
  confirmed: "warning",
  completed: "success",
  cancelled: "error",
  no_show: "error",
};

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const appt = await getAppointment(id);
  if (!appt) notFound();

  const badge = APPT_STATUS_BADGE[appt.status] ?? "neutral";

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <Link href="/crm/appointments" className="link link-hover text-sm text-base-content/70">
        ← Back to appointments
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{appt.title ?? appt.appointmentId}</h1>
          <p className="mt-1 text-base-content/70">
            {appt.appointmentId} · {appt.kind}
          </p>
        </div>
        <span className={`badge badge-lg badge-soft badge-${badge}`}>{appt.status}</span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card card-body card-border bg-base-100">
          <h2 className="text-lg font-semibold">Schedule</h2>
          <dl className="mt-2 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium text-base-content/60">Starts</dt>
              <dd>
                {new Date(appt.startsAt).toLocaleString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-base-content/60">Ends</dt>
              <dd>
                {appt.endsAt
                  ? new Date(appt.endsAt).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-base-content/60">Location</dt>
              <dd>{appt.location ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-base-content/60">Psychologist</dt>
              <dd>{appt.psychologist ? String(appt.psychologist).slice(0, 8) + "…" : "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-base-content/60">Client</dt>
              <dd>{appt.client ? String(appt.client).slice(0, 8) + "…" : "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-base-content/60">Case</dt>
              <dd>
                {appt.case ? (
                  <Link
                    href={`/crm/cases/${String(appt.case)}`}
                    className="link link-hover"
                  >
                    {String(appt.case).slice(0, 8)}…
                  </Link>
                ) : (
                  "—"
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className="card card-body card-border bg-base-100">
          <h2 className="text-lg font-semibold">Status</h2>
          <p className="mt-1 text-sm text-base-content/70">
            Update this appointment&apos;s status as it progresses.
          </p>
          <div className="mt-3">
            <AppointmentControls appointmentId={id} />
          </div>
        </div>
      </div>

      {appt.notes && (
        <div className="card card-body card-border mt-6 bg-base-100">
          <h2 className="text-lg font-semibold">Notes</h2>
          <p className="mt-2 rounded-lg bg-base-200 p-3 text-sm whitespace-pre-wrap">{appt.notes}</p>
        </div>
      )}
    </div>
  );
}