import Link from "next/link";
import type { Metadata } from "next";
import { listLeads } from "@/services/crm";
import { FUNNEL } from "@/lib/crm/funnel";

export const metadata: Metadata = { title: "Pipeline" };
export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const byStage = new Map<string, Array<Record<string, unknown>>>();
  for (const stage of FUNNEL) {
    const { leads } = await listLeads({ status: stage, pageSize: 200 });
    byStage.set(stage, leads as unknown as Record<string, unknown>[]);
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Pipeline</h1>
      <p className="mt-1 text-base-content/70">Drag-free funnel overview by stage.</p>

      <div className="mt-6 grid grid-flow-col auto-cols-[minmax(240px,320px)] gap-4 overflow-x-auto pb-4">
        {FUNNEL.map((stage) => {
          const leads = byStage.get(stage) ?? [];
          return (
            <div key={stage} className="card bg-base-200 p-3 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="badge badge-soft">{stage}</span>
                <span className="text-xs text-base-content/50">{leads.length}</span>
              </div>
              <div className="space-y-2">
                {leads.length === 0 && (
                  <p className="text-xs text-base-content/40">No leads</p>
                )}
                {leads.map((lead) => (
                  <Link
                    key={String(lead._id)}
                    href={`/crm/leads/${String(lead._id)}`}
                    className="block rounded-box bg-base-100 p-3 shadow-sm hover:shadow"
                  >
                    <div className="text-sm font-semibold">
                      {String(lead.firstName)} {String(lead.lastName ?? "")}
                    </div>
                    <div className="truncate text-xs text-base-content/60">
                      {String(lead.email ?? "")} · {String(lead.company ?? "—")}
                    </div>
                    <div className="mt-1 font-mono text-[10px] text-base-content/40">
                      {String(lead.leadId)}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}