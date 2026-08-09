import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortalPerson, getPortalCase } from "@/services/portal";
import { CASE_BADGE, OFFER_BADGE } from "@/lib/cases/statuses";

export const dynamic = "force-dynamic";

export default async function PortalCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = await getPortalPerson();
  const result = await getPortalCase(id, person);
  if (!result) notFound();

  const { caze, viewerAllowReport, viewerAllowInternalNotes } = result;
  const badge = (CASE_BADGE as Record<string, string>)[caze.status] ?? "neutral";

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <Link href="/portal" className="link link-hover text-sm text-base-content/70">
        ← Back to overview
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{caze.caseId}</h1>
          <p className="mt-1 text-base-content/70">
            {caze.serviceType ?? "Service"} · instructed by {caze.instructingParty ?? "—"}
          </p>
        </div>
        <span className={`badge badge-lg badge-soft badge-${badge}`}>{caze.status}</span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="card card-body card-border mt-6 bg-base-100">
          <h2 className="text-lg font-semibold">Instruction details</h2>
          <dl className="mt-2 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium text-base-content/60">Report type</dt>
              <dd>{caze.reportType ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-base-content/60">Deadline</dt>
              <dd>
                {caze.deadline
                  ? new Date(caze.deadline).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-base-content/60">Created</dt>
              <dd>
                {caze.createdAt
                  ? new Date(caze.createdAt).toLocaleDateString("en-GB")
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-base-content/60">Last updated</dt>
              <dd>
                {caze.updatedAt
                  ? new Date(caze.updatedAt).toLocaleDateString("en-GB")
                  : "—"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="card card-body card-border mt-6 bg-base-100">
          <h2 className="text-lg font-semibold">Assigned expert</h2>
          <p className="mt-2 text-sm text-base-content/70">
            {caze.assignedPsychologist
              ? "A psychologist has been assigned to this case."
              : "An expert has not yet been assigned."}
          </p>
        </div>
      </div>

      {viewerAllowInternalNotes && caze.internalNotes && (
        <div className="card card-body card-border mt-6 bg-base-100">
          <h2 className="text-lg font-semibold">Internal notes</h2>
          <p className="mt-2 text-sm whitespace-pre-wrap text-base-content/70">
            {caze.internalNotes}
          </p>
        </div>
      )}

      {viewerAllowReport && (
        <div className="alert alert-success alert-soft mt-6 sm:alert-horizontal">
          <span>
            This case is released. The report is ready to be downloaded.
          </span>
        </div>
      )}

      {caze.offers && caze.offers.length > 0 && (
        <div className="card card-body card-border mt-6 bg-base-100">
          <h2 className="text-lg font-semibold">Offers</h2>
          <div className="mt-2 space-y-2">
            {caze.offers.map((o, i) => {
              const b = (OFFER_BADGE as Record<string, string>)[o.status] ?? "neutral";
              return (
                <div key={i} className="flex items-center justify-between rounded-lg bg-base-200 p-3">
                  <span className="text-sm">Offer to psychologist</span>
                  <span className={`badge badge-soft badge-${b}`}>{o.status}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}