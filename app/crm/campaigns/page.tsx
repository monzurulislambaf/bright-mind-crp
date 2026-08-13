import type { Metadata } from "next";
import { listCampaigns, campaignStats } from "@/services/admin";
import { NotAuthorised } from "@/components/crm/NotAuthorised";
import { ListSearch } from "@/components/crm/ListSearch";

export const metadata: Metadata = { title: "Campaigns" };
export const dynamic = "force-dynamic";

const STATUS_BADGE: Record<string, string> = {
  DRAFT: "neutral",
  ACTIVE: "success",
  PAUSED: "warning",
  COMPLETED: "info",
};

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const search = params.search || undefined;
  let campaigns: Awaited<ReturnType<typeof listCampaigns>>;
  let stats: Awaited<ReturnType<typeof campaignStats>>;
  try {
    [campaigns, stats] = await Promise.all([
      listCampaigns({ search }),
      campaignStats(),
    ]);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Not authorised")) {
      return <NotAuthorised module="Campaigns" />;
    }
    throw error;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
        <p className="mt-1 text-base-content/70">
          {stats.total} campaign(s) — sources and attribution for lead capture.
        </p>
      </div>

      <div className="stats stats-vertical w-full bg-base-200 shadow-sm sm:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Total campaigns</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Active</div>
          <div className="stat-value text-success">{stats.active}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Paused</div>
          <div className="stat-value text-warning">{stats.paused}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Completed</div>
          <div className="stat-value text-info">{stats.completed}</div>
        </div>
      </div>

      <ListSearch
        path="/crm/campaigns"
        search={search}
        placeholder="Search by name, channel, source, status…"
      />

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Campaign ID</th>
              <th>Name</th>
              <th>Channel</th>
              <th>Source</th>
              <th>Status</th>
              <th>Start</th>
              <th>End</th>
              <th>Budget</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={String(c._id)}>
                <td className="font-mono text-xs">{String(c.campaignId ?? "")}</td>
                <td className="font-semibold">{String(c.name ?? "")}</td>
                <td>{String(c.channel ?? "—")}</td>
                <td>{String(c.source ?? "—")}</td>
                <td>
                  <span className={`badge badge-soft badge-${STATUS_BADGE[String(c.status)] ?? "neutral"}`}>
                    {String(c.status ?? "")}
                  </span>
                </td>
                <td>{c.startAt ? new Date(c.startAt as Date).toLocaleDateString() : "—"}</td>
                <td>{c.endAt ? new Date(c.endAt as Date).toLocaleDateString() : "—"}</td>
                <td>
                  {typeof c.budget === "number"
                    ? new Intl.NumberFormat("en-GB", {
                        style: "currency",
                        currency: "GBP",
                      }).format(c.budget as number)
                    : "—"}
                </td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan={8} className="py-10 text-center text-base-content/60">
                  No campaigns yet. Website form submissions record source and
                  landing page for attribution.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
