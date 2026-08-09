import Link from "next/link";
import { listLeads } from "@/services/crm";
import { LeadFilters } from "./filters";
import { STATUS_BADGE } from "@/lib/crm/funnel";

export const dynamic = "force-dynamic";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const status = params.status || undefined;
  const search = params.search || undefined;
  const page = Number(params.page || "1") || 1;

  const { leads, total, pages } = await listLeads({ status, search, page });

  const filters = { status: status ?? "", search: search ?? "" };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="mt-1 text-base-content/70">{total} lead(s)</p>
        </div>
        <div className="flex gap-2">
          <Link href="/crm/import" className="btn btn-ghost">
            Import
          </Link>
          <Link href="/crm/leads/new" className="btn btn-primary">
            New Lead
          </Link>
        </div>
      </div>

      <LeadFilters filters={filters} />

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Lead ID</th>
              <th>Name</th>
              <th>Company</th>
              <th>Source</th>
              <th>Status</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={String(lead._id)}>
                <td className="font-mono text-xs">{lead.leadId}</td>
                <td>
                  <div className="font-semibold">
                    {lead.firstName} {lead.lastName}
                  </div>
                  <div className="text-xs text-base-content/60">{lead.email}</div>
                </td>
                <td>{lead.company || "—"}</td>
                <td>{lead.source}</td>
                <td>
                  <span className={`badge badge-soft badge-${STATUS_BADGE[lead.status as keyof typeof STATUS_BADGE]}`}>
                    {lead.status}
                  </span>
                </td>
                <td>{new Date(lead.updatedAt).toLocaleDateString()}</td>
                <td>
                  <Link href={`/crm/leads/${String(lead._id)}`} className="btn btn-ghost btn-sm">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-base-content/60">
                  No leads match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildHref(p, status, search)}
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

function buildHref(page: number, status?: string, search?: string) {
  const sp = new URLSearchParams();
  if (status) sp.set("status", status);
  if (search) sp.set("search", search);
  sp.set("page", String(page));
  return `/crm/leads?${sp.toString()}`;
}