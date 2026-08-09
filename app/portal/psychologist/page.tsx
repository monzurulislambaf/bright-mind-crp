import Link from "next/link";
import { getPortalPerson, portalStats, listPortalCases } from "@/services/portal";
import PortalCaseTable from "../components/case-table";
import OfferActions from "../components/offer-actions";
import { OFFER_BADGE } from "@/lib/cases/statuses";

export const dynamic = "force-dynamic";

export default async function PsychologistPortalPage() {
  const person = await getPortalPerson();
  const [stats, cases] = await Promise.all([portalStats(person), listPortalCases(person)]);

  const pendingOffers = (cases ?? []).filter((c) =>
    (c.offers ?? []).some((o) => String(o.psychologist) === person.personId)
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-base-content/70">{person.name} — here&apos;s your practice overview.</p>
      </div>

      <div className="stats stats-vertical w-full bg-base-200 shadow-sm sm:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Assigned cases</div>
          <div className="stat-value">{stats.a}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Open offers</div>
          <div className="stat-value text-info">{stats.offers}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Deadlines upcoming</div>
          <div className="stat-value text-warning">{stats.upcoming}</div>
        </div>
      </div>

      {pendingOffers.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Pending offers</h2>
          <div className="grid gap-4">
            {pendingOffers.map((c) => {
              const offer = (c.offers ?? []).find(
                (o) => String(o.psychologist) === person.personId
              );
              const badge = (OFFER_BADGE as Record<string, string>)[offer?.status ?? ""] ?? "neutral";
              return (
                <div key={String(c._id)} className="card card-body card-border bg-base-100">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{c.caseId}</span>
                        <span className={`badge badge-soft badge-${badge}`}>{offer?.status}</span>
                      </div>
                      <p className="mt-1 text-sm text-base-content/70">
                        {c.serviceType} · instructed by {c.instructingParty ?? "the firm"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/portal/cases/${String(c._id)}`} className="btn btn-ghost btn-sm">
                        Details
                      </Link>
                      <OfferActions caseId={String(c._id)} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Your cases</h2>
        <PortalCaseTable cases={cases ?? []} />
      </div>
    </div>
  );
}