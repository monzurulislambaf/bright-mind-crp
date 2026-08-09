import type { Metadata } from "next";
import { listQualifiedLeads } from "@/services/crm";
import { listProvisionable } from "@/services/provision";
import { ConvertButton } from "@/components/crm/ConvertButton";
import { ProvisionButton } from "@/components/crm/ProvisionButton";

export const metadata: Metadata = { title: "Onboarding" };
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const [qualified, provisionable] = await Promise.all([
    listQualifiedLeads(),
    listProvisionable(),
  ]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Onboarding</h1>
      <p className="mt-1 text-base-content/70">
        Qualified leads ready to begin onboarding as a record.
      </p>

      <div className="mt-6 space-y-3">
        {qualified.length === 0 && (
          <p className="text-base-content/60">
            No qualified leads awaiting onboarding yet.
          </p>
        )}
        {qualified.map((q) => {
          const lead = q.lead as unknown as {
            leadId: string;
            firstName: string;
            lastName?: string;
            email?: string;
            company?: string;
          };
          return (
            <div key={String(q._id)} className="card card-body card-border bg-base-100 sm:flex-row sm:items-center">
              <div className="grow">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {lead?.firstName} {lead?.lastName ?? ""}
                  </span>
                  <span className="badge badge-soft badge-primary">{q.kind}</span>
                </div>
                <p className="text-sm text-base-content/60">
                  {lead?.email} {lead?.company ? `· ${lead.company}` : ""}
                </p>
                <p className="font-mono text-xs text-base-content/50">{q.qualifiedId}</p>
              </div>
              <ConvertButton qualifiedId={String(q._id)} />
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold">Provision accounts</h2>
        <p className="mt-1 text-base-content/70">
          Create login accounts for converted records so they can access their portal.
        </p>
        <div className="mt-4 space-y-3">
          {provisionable.length === 0 && (
            <p className="text-base-content/60">No converted records awaiting accounts.</p>
          )}
          {provisionable.map((p) => (
            <div key={p.qualifiedId} className="card card-body card-border bg-base-100 sm:flex-row sm:items-center">
              <div className="grow">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{p.name}</span>
                  <span className="badge badge-soft badge-secondary">{p.kind}</span>
                  <span className={`badge badge-soft ${p.provisioned ? "badge-success" : "badge-warning"}`}>
                    {p.provisioned ? "Provisioned" : "Not provisioned"}
                  </span>
                </div>
                <p className="text-sm text-base-content/60">{p.email}</p>
              </div>
              {p.provisioned ? (
                <span className="text-xs text-base-content/40">Account linked</span>
              ) : (
                <ProvisionButton qualifiedId={p.qualifiedId} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}