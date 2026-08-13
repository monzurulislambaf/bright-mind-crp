import Link from "next/link";
import type { Metadata } from "next";
import { listContacts, contactStats } from "@/services/admin";
import { ContactFilters } from "./filters";
import { NotAuthorised } from "@/components/crm/NotAuthorised";

export const metadata: Metadata = { title: "Contacts" };
export const dynamic = "force-dynamic";

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const search = params.search || undefined;
  const page = Number(params.page || "1") || 1;

  let result: Awaited<ReturnType<typeof listContacts>>;
  let stats: Awaited<ReturnType<typeof contactStats>>;
  try {
    [result, stats] = await Promise.all([
      listContacts({ search, page }),
      contactStats(),
    ]);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Not authorised")) {
      return <NotAuthorised module="Contacts" />;
    }
    throw error;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
        <p className="mt-1 text-base-content/70">
          {result.total} contact(s) — people associated with leads, organisations and cases.
        </p>
      </div>

      <div className="stats stats-vertical w-full bg-base-200 shadow-sm sm:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Total contacts</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Marketing opted-in</div>
          <div className="stat-value text-success">{stats.optedIn}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Do not contact</div>
          <div className="stat-value text-error">{stats.doNotContact}</div>
        </div>
      </div>

      <div className="mt-6">
        <ContactFilters filters={{ search: search ?? "" }} />
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Contact ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Type</th>
              <th>Preferred</th>
              <th>Marketing</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((c) => (
              <tr key={String(c._id)}>
                <td className="font-mono text-xs">{String(c.contactId ?? "")}</td>
                <td className="font-semibold">
                  {String(c.firstName ?? "")} {String(c.lastName ?? "")}
                </td>
                <td>{String(c.email ?? "—")}</td>
                <td>{String(c.telephone || c.phone || "—")}</td>
                <td className="text-xs text-base-content/60">{String(c.contactType ?? "")}</td>
                <td className="text-xs text-base-content/60">{String(c.preferredContactMethod ?? "")}</td>
                <td>
                  {c.marketing && (c.marketing as { doNotContact?: boolean }).doNotContact ? (
                    <span className="badge badge-soft badge-error">DNC</span>
                  ) : (
                    <span className="badge badge-soft badge-success">OK</span>
                  )}
                </td>
              </tr>
            ))}
            {result.items.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-base-content/60">
                  No contacts yet. Contacts are created alongside leads, onboarding
                  and case records.
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
              href={`/crm/contacts?${new URLSearchParams({
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
