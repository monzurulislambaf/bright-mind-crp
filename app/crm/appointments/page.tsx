import Link from "next/link";
import { listAppointments, appointmentStats } from "@/services/appointments";
import { CreateAppointmentForm } from "./create-appointment-form";
import { APPOINTMENT_STATUS } from "@/lib/appointment/constants";
import { ListSearch } from "@/components/crm/ListSearch";

export const dynamic = "force-dynamic";

const APPT_STATUS_BADGE: Record<string, string> = {
  scheduled: "info",
  confirmed: "warning",
  completed: "success",
  cancelled: "error",
  no_show: "error",
};

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const status = params.status || undefined;
  const search = params.search || undefined;
  const [appts, stats] = await Promise.all([
    listAppointments({ status, search }),
    appointmentStats(),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="mt-1 text-base-content/70">{appts.length} appointment(s)</p>
        </div>
      </div>

      <div className="stats stats-vertical w-full bg-base-200 shadow-sm sm:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Scheduled</div>
          <div className="stat-value text-info">{stats.scheduled}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Confirmed</div>
          <div className="stat-value text-warning">{stats.confirmed}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Completed</div>
          <div className="stat-value text-success">{stats.completed}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Cancelled</div>
          <div className="stat-value text-error">{stats.cancelled}</div>
        </div>
      </div>

      <ListSearch
        path="/crm/appointments"
        search={search}
        status={status}
        statuses={APPOINTMENT_STATUS}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card card-body card-border mt-6 bg-base-100 lg:col-span-2">
          <h2 className="text-lg font-semibold">All appointments</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Appointment</th>
                  <th>Type</th>
                  <th>Starts</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {appts.map((a) => {
                  const badge = APPT_STATUS_BADGE[a.status] ?? "neutral";
                  return (
                    <tr key={String(a._id)}>
                      <td>
                        <div className="font-medium">{a.title}</div>
                        <div className="text-xs text-base-content/50">{a.appointmentId}</div>
                      </td>
                      <td className="text-sm capitalize">{a.kind}</td>
                      <td className="text-sm">
                        {new Date(a.startsAt).toLocaleString("en-GB", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>
                        <span className={`badge badge-soft badge-${badge}`}>{a.status}</span>
                      </td>
                      <td>
                        <Link href={`/crm/appointments/${String(a._id)}`} className="btn btn-ghost btn-xs">
                          Open →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {appts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-base-content/60">
                      No appointments.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card card-body card-border mt-6 bg-base-100">
          <h2 className="text-lg font-semibold">New appointment</h2>
          <div className="mt-2">
            <CreateAppointmentForm />
          </div>
        </div>
      </div>
    </div>
  );
}