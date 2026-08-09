import Link from "next/link";
import { getPortalPerson, portalStats, listPortalCases } from "@/services/portal";
import PortalCaseTable from "../components/case-table";

export const dynamic = "force-dynamic";

export default async function IndividualPortalPage() {
  const person = await getPortalPerson();
  const [stats, cases] = await Promise.all([portalStats(person), listPortalCases(person)]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-base-content/70">{person.name} — here are your services.</p>
        </div>
        <Link href="/portal/individual/new" className="btn btn-primary">
          New Service Request
        </Link>
      </div>

      <div className="stats stats-vertical w-full bg-base-200 shadow-sm sm:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Your requests</div>
          <div className="stat-value">{stats.a}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Released reports</div>
          <div className="stat-value text-success">{stats.b}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Upcoming deadlines</div>
          <div className="stat-value text-warning">{stats.c}</div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Your requests</h2>
        <PortalCaseTable cases={cases ?? []} />
      </div>
    </div>
  );
}