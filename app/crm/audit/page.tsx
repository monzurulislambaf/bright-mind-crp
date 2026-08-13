import Link from "next/link";
import type { Metadata } from "next";
import {
  listAdminAuditLogs,
  auditStats,
  listAuditActions,
} from "@/services/admin";
import { AuditFilters } from "./filters";
import { NotAuthorised } from "@/components/crm/NotAuthorised";

export const metadata: Metadata = { title: "Audit Logs" };
export const dynamic = "force-dynamic";

const ACTION_BADGE: Record<string, string> = {
  CREATE: "success",
  UPDATE: "info",
  DELETE: "error",
  LOGIN: "info",
  LOGOUT: "neutral",
  DOWNLOAD: "warning",
  DOCUMENT_DOWNLOAD: "warning",
  EXPORT: "warning",
  APPROVE: "success",
  REJECT: "error",
  RELEASE: "success",
  ASSIGN: "primary",
  REASSIGN: "primary",
  CONVERT: "success",
  STATUS_CHANGE: "primary",
  PERMISSION_CHANGE: "error",
  ROLE_CHANGE: "error",
  VIEW: "neutral",
};

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const action = params.action || undefined;
  const search = params.search || undefined;
  const page = Number(params.page || "1") || 1;

  let result: Awaited<ReturnType<typeof listAdminAuditLogs>>;
  let stats: Awaited<ReturnType<typeof auditStats>>;
  let actions: string[];
  try {
    [result, stats, actions] = await Promise.all([
      listAdminAuditLogs({ action, search, page }),
      auditStats(),
      Promise.resolve(listAuditActions()),
    ]);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Not authorised")) {
      return <NotAuthorised module="Audit Logs" />;
    }
    throw error;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="mt-1 text-base-content/70">
          Immutable trail of significant actions, downloads and permission changes.
        </p>
      </div>

      <div className="stats stats-vertical w-full bg-base-200 shadow-sm sm:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Total events</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Today</div>
          <div className="stat-value text-info">{stats.today}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Showing</div>
          <div className="stat-value text-primary">{result.total}</div>
        </div>
      </div>

      <div className="mt-6">
        <AuditFilters
          filters={{ action: action ?? "", search: search ?? "" }}
          actions={actions}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Audit ID</th>
              <th>When</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Resource ID</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((log) => (
              <tr key={String(log._id)}>
                <td className="font-mono text-xs">{String(log.auditId ?? "")}</td>
                <td>
                  {log.createdAt
                    ? new Date(log.createdAt as Date).toLocaleString()
                    : "—"}
                </td>
                <td className="text-xs">{String(log.actor ?? log.actorUserId ?? "—")}</td>
                <td>
                  <span className={`badge badge-soft badge-${ACTION_BADGE[String(log.action)] ?? "neutral"}`}>
                    {String(log.action ?? "")}
                  </span>
                </td>
                <td className="text-xs text-base-content/70">{String(log.resourceType ?? log.resource ?? "")}</td>
                <td className="font-mono text-xs">{String(log.resourceId ?? "—")}</td>
              </tr>
            ))}
            {result.items.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-base-content/60">
                  No audit events match your filter.
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
              href={`/crm/audit?${new URLSearchParams({
                ...(action ? { action } : {}),
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
