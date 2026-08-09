import Link from "next/link";
import { notFound } from "next/navigation";
import { getLead } from "@/services/crm";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";
import { LeadStageMover } from "@/components/crm/LeadStageMover";
import { ActivityLog } from "@/components/crm/ActivityLog";
import { STATUS_BADGE } from "@/lib/crm/funnel";
import { QualifiedLead } from "@/models/QualifiedLead";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAuth();
  const data = await getLead(id);
  if (!data) notFound();

  const { lead, activities } = data;
  const canUpdate = hasPermission(user.role, "leads:update");

  const qualifiedRec = await QualifiedLead.findOne({ lead: lead._id }).lean();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <Link href="/crm/leads" className="link link-hover text-sm">
        ← Back to leads
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {lead.firstName} {lead.lastName}
            </h1>
            <span className={`badge badge-lg badge-soft badge-${STATUS_BADGE[lead.status as keyof typeof STATUS_BADGE]}`}>
              {lead.status}
            </span>
            {qualifiedRec && (
              <span className="badge badge-soft badge-primary">Qualified</span>
            )}
          </div>
          <p className="mt-1 font-mono text-sm text-base-content/60">{lead.leadId}</p>
        </div>
        <div className="text-sm text-base-content/70">
          <p>Source: <span className="font-medium">{lead.source}</span></p>
          {lead.campaign && <p>Campaign: <span className="font-medium">{lead.campaign}</span></p>}
          {lead.landingPage && <p>Landing: <span className="font-medium">{lead.landingPage}</span></p>}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <LeadStageMover
            leadId={String(lead._id)}
            status={lead.status}
            qualifiedId={qualifiedRec ? String(qualifiedRec._id) : undefined}
            permission={{
              move: canUpdate,
              qualify: canUpdate && !qualifiedRec,
              convert: canUpdate && !!qualifiedRec,
            }}
          />

          <div className="card card-body card-border bg-base-100">
            <h2 className="card-title">Contact details</h2>
            <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div><dt className="text-base-content/50">Email</dt><dd className="font-medium">{lead.email || "—"}</dd></div>
              <div><dt className="text-base-content/50">Phone</dt><dd className="font-medium">{lead.phone || "—"}</dd></div>
              <div><dt className="text-base-content/50">Company</dt><dd className="font-medium">{lead.company || "—"}</dd></div>
              <div><dt className="text-base-content/50">Role</dt><dd className="font-medium">{lead.role || "—"}</dd></div>
              <div><dt className="text-base-content/50">Owner</dt><dd className="font-medium">{lead.ownerLabel || "Unassigned"}</dd></div>
              {lead.lostReason && (
                <div className="sm:col-span-2">
                  <dt className="text-error/70">Lost reason</dt>
                  <dd className="font-medium">{lead.lostReason}</dd>
                </div>
              )}
            </dl>
            {lead.notes && (
              <p className="mt-3 border-t border-base-200 pt-3 text-sm text-base-content/70">
                {lead.notes}
              </p>
            )}
          </div>
        </div>

        <ActivityLog
          leadId={String(lead._id)}
          canLog={canUpdate}
          activities={activities.map((a) => ({
            _id: String(a._id),
            type: a.type,
            direction: a.direction ?? undefined,
            summary: a.summary,
            detail: a.detail ?? undefined,
            createdAt: a.createdAt.toISOString(),
            createdBy: a.createdBy ? String(a.createdBy) : undefined,
          }))}
        />
      </div>
    </div>
  );
}