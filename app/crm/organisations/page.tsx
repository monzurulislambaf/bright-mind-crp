import Link from "next/link";
import type { Metadata } from "next";
import { listOrganisations, organisationStats } from "@/services/admin";
import { OrganisationFilters } from "./filters";
import { NotAuthorised } from "@/components/crm/NotAuthorised";

export const metadata: Metadata = { title: "Organisations" };
export const dynamic = "force-dynamic";

const STATUS_BADGE: Record<string, string> = {
  pending: "warning",
  approved: "success",
  ACTIVE: "success",
  suspended: "error",
  INACTIVE: "neutral",
};

export default async function OrganisationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const search = params.search || undefined;
  const page = Number(params.page || "1") || 1;

  let result: Awaited<ReturnType<typeof listOrganisations>>;
  let stats: Awaited<ReturnType<typeof organisationStats>>;
  try {
    [result, stats] = await Promise.all([
      listOrganisations({ search, page }),
      organisationStats(),
    ]);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Not authorised")) {
      return <NotAuthorised module="Organisations" />;
    }
    throw error;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Organisations</h1>
        <p className="mt-1 text-base-content/70">
          {result.total} organisation(s) — solicitor firms, partner organisations
          and other professional bodies.
        </p>
      </div>

      <div className="stats stats-vertical w-full bg-base-200 shadow-sm sm:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Total organisations</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Pending</div>
          <div className="stat-value text-warning">{stats.pending}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Approved</div>
          <div className="stat-value text-success">{stats.approved}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Suspended</div>
          <div className="stat-value text-error">{stats.suspended}</div>
        </div>
      </div>

      <div className="mt-6">
        <OrganisationFilters filters={{ search: search ?? "" }} />
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Org ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Website</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((o) => (
              <tr key={String(o._id)}>
                <td className="font-mono text-xs">
                  {String(o.orgId || o.organisationId || "")}
                </td>
                <td className="font-semibold">{String(o.name ?? "")}</td>
                <td className="text-xs text-base-content/60">{String(o.type ?? "")}</td>
                <td>{String(o.email ?? "—")}</td>
                <td>{String(o.phone || o.telephone || "—")}</td>
                <td>
                  {o.website ? (
                    <a
                      href={String(o.website)}
                      target="_blank"
                      rel="noreferrer"
                      className="link link-hover text-xs"
                    >
                      {String(o.website).replace(/^https?:\/\//, "")}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <span className={`badge badge-soft badge-${STATUS_BADGE[String(o.status)] ?? "neutral"}`}>
                    {String(o.status ?? "")}
                  </span>
                </td>
              </tr>
            ))}
            {result.items.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-base-content/60">
                  No organisations yet. They are created during solicitor and
                  partner onboarding.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {result.pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: result.pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/crm/organisations?${new URLSearchParams({
                ...(search ? { search } : {}),
                page: String(p),
              })}`}
              className={`btn btn-sm ${p === page ? "btn-primary" : "btn-ghost"}`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
