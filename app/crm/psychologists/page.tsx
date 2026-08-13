import Link from "next/link";
import { listPsychologists, psychologistStats } from "@/services/psychologists";
import { PSYCHOLOGIST_STATUS, PSYCH_BADGE } from "@/lib/psychologist/statuses";
import { ListSearch } from "@/components/crm/ListSearch";

export const dynamic = "force-dynamic";

export default async function PsychologistsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const status = params.status || undefined;
  const search = params.search || undefined;
  const [psychs, stats] = await Promise.all([
    listPsychologists({ status, search }),
    psychologistStats(),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Psychologists</h1>
        <p className="mt-1 text-base-content/70">{psychs.length} record(s)</p>
      </div>

      <div className="stats stats-vertical w-full bg-base-200 shadow-sm sm:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Pending</div>
          <div className="stat-value text-info">{stats.pending}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Under review</div>
          <div className="stat-value text-warning">{stats.underReview}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Approved</div>
          <div className="stat-value text-success">{stats.approved}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Rejected</div>
          <div className="stat-value text-error">{stats.rejected}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Suspended</div>
          <div className="stat-value text-error">{stats.suspended}</div>
        </div>
      </div>

      <div className="mt-6">
        <ListSearch
          path="/crm/psychologists"
          search={search}
          status={status}
          statuses={PSYCHOLOGIST_STATUS}
        />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Name</th>
              <th>HCPC</th>
              <th>Email</th>
              <th>Expertise</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {psychs.map((p) => {
              const badge = PSYCH_BADGE[p.status] ?? "neutral";
              return (
                <tr key={String(p._id)}>
                  <td>
                    <div className="font-medium">{p.firstName} {p.lastName}</div>
                    <div className="text-xs text-base-content/50">{p.psychologistId}</div>
                  </td>
                  <td className="font-mono text-xs">{p.hcpcNumber ?? "—"}</td>
                  <td className="text-sm">{p.email ?? "—"}</td>
                  <td className="text-sm">
                    {(p.expertise ?? []).slice(0, 2).join(", ")}
                    {(p.expertise?.length ?? 0) > 2 && " …"}
                  </td>
                  <td>
                    <span className={`badge badge-soft badge-${badge}`}>{p.status}</span>
                  </td>
                  <td>
                    <Link
                      href={`/crm/psychologists/${String(p._id)}`}
                      className="btn btn-ghost btn-xs"
                    >
                      Review →
                    </Link>
                  </td>
                </tr>
              );
            })}
            {psychs.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-base-content/60">
                  No psychologist records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}