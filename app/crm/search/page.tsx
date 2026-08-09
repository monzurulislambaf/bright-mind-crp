import Link from "next/link";
import { globalSearch } from "@/services/search";
import { STATUS_BADGE } from "@/lib/crm/funnel";
import { CASE_BADGE } from "@/lib/cases/statuses";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const result = q ? await globalSearch(q) : null;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Search</h1>
      <p className="mt-1 text-base-content/70">
        Permission-aware search across the platform.
      </p>

      <form action="/crm/search" method="get" className="mt-6 flex gap-2">
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="IDs, names, organisations, emails, HCPC…"
          className="input w-full bg-base-100"
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {result && (
        <div className="mt-8 space-y-8">
          <Section title="Leads">
            {result.leads.map((l) => (
              <li key={String(l._id)}>
                <Link href={`/crm/leads/${String(l._id)}`} className="link link-hover">
                  <span className="font-mono text-xs">{l.leadId}</span> — {l.firstName}{" "}
                  {l.lastName} ({l.email ?? "no email"})
                </Link>
                <span className={`badge badge-soft ml-2 badge-${(STATUS_BADGE as Record<string, string>)[l.status] ?? "neutral"}`}>{l.status}</span>
              </li>
            ))}
          </Section>

          <Section title="Cases">
            {result.cases.map((c) => (
              <li key={String(c._id)}>
                <Link href={`/crm/cases/${String(c._id)}`} className="link link-hover">
                  <span className="font-mono text-xs">{c.caseId}</span> — {c.instructingParty}
                </Link>
                <span className={`badge badge-soft badge-${(CASE_BADGE as Record<string, string>)[c.status] ?? "neutral"} ml-2`}>{c.status}</span>
              </li>
            ))}
          </Section>

          <Section title="Organisations">
            {result.organisations.map((o) => (
              <li key={String(o._id)}>
                <span className="font-mono text-xs">{o.orgId}</span> — {o.name}{" "}
                <span className="badge badge-soft badge-neutral">{o.type}</span>
              </li>
            ))}
          </Section>

          <Section title="Psychologists">
            {result.psychologists.map((p) => (
              <li key={String(p._id)}>
                <span className="font-medium">{p.firstName} {p.lastName}</span>{" "}
                <span className="font-mono text-xs">HCPC: {p.hcpcNumber ?? "—"}</span>{" "}
                <span className="badge badge-soft badge-neutral">{p.status}</span>
              </li>
            ))}
          </Section>

          <Section title="Individual clients">
            {result.clients.map((c) => (
              <li key={String(c._id)}>
                <span className="font-medium">{c.firstName} {c.lastName}</span>{" "}
                <span className="font-mono text-xs">{c.clientId}</span>{" "}
                <span className="badge badge-soft badge-neutral">{c.status}</span>
              </li>
            ))}
          </Section>

          {allEmpty(result) && <p className="text-base-content/60">No results for “{q}”.</p>}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-2 text-base font-semibold text-base-content/70">{title}</h2>
      <ul className="space-y-1 text-sm">{children}</ul>
    </div>
  );
}

function allEmpty(r: { leads: unknown[]; cases: unknown[]; organisations: unknown[]; psychologists: unknown[]; clients: unknown[] }) {
  return !r.leads.length && !r.cases.length && !r.organisations.length && !r.psychologists.length && !r.clients.length;
}