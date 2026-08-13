import Link from "next/link";
import type { Metadata } from "next";
import { listUsers, userStats } from "@/services/admin";
import { UserFilters } from "./filters";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { NotAuthorised } from "@/components/crm/NotAuthorised";

export const metadata: Metadata = { title: "Users" };
export const dynamic = "force-dynamic";

const STATUS_BADGE: Record<string, string> = {
  active: "success",
  inactive: "neutral",
  invited: "info",
  suspended: "warning",
  disabled: "error",
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const search = params.search || undefined;
  const role = params.role || undefined;
  const status = params.status || undefined;
  const page = Number(params.page || "1") || 1;

  let result: Awaited<ReturnType<typeof listUsers>>;
  let stats: Awaited<ReturnType<typeof userStats>>;
  try {
    [result, stats] = await Promise.all([
      listUsers({ search, role, status, page }),
      userStats(),
    ]);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Not authorised")) {
      return <NotAuthorised module="Users" />;
    }
    throw error;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="mt-1 text-base-content/70">
            {result.total} user(s) — accounts and access across the platform.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/crm/users/roles" className="btn btn-ghost">
            Roles & Permissions
          </Link>
          <Link href="/crm/users/new" className="btn btn-primary">
            New User
          </Link>
        </div>
      </div>

      <div className="stats stats-vertical w-full bg-base-200 shadow-sm sm:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Total users</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Active</div>
          <div className="stat-value text-success">{stats.active}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Invited</div>
          <div className="stat-value text-info">{stats.invited}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Suspended</div>
          <div className="stat-value text-warning">{stats.suspended}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Disabled</div>
          <div className="stat-value text-error">{stats.disabled}</div>
        </div>
      </div>

      <div className="mt-6">
        <UserFilters filters={{ search: search ?? "", role: role ?? "", status: status ?? "" }} />
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Type</th>
              <th>Status</th>
              <th>Last login</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((u) => (
              <tr key={String(u._id)}>
                <td className="font-mono text-xs">{String(u.userId ?? "")}</td>
                <td className="font-semibold">
                  {String(u.firstName ?? "")} {String(u.lastName ?? "")}
                </td>
                <td>{String(u.email ?? "")}</td>
                <td>
                  <span className="badge badge-soft badge-neutral">
                    {ROLE_LABELS[u.role as keyof typeof ROLE_LABELS] ?? String(u.role ?? "")}
                  </span>
                </td>
                <td className="text-xs text-base-content/60">{String(u.userType ?? "")}</td>
                <td>
                  <span className={`badge badge-soft badge-${STATUS_BADGE[String(u.status)] ?? "neutral"}`}>
                    {String(u.status ?? "")}
                  </span>
                </td>
                <td>
                  {u.lastLoginAt
                    ? new Date(u.lastLoginAt as Date).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
            {result.items.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-base-content/60">
                  No users match your filters.
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
              href={buildHref(p, search, role, status)}
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

function buildHref(page: number, search?: string, role?: string, status?: string) {
  const sp = new URLSearchParams();
  if (search) sp.set("search", search);
  if (role) sp.set("role", role);
  if (status) sp.set("status", status);
  sp.set("page", String(page));
  return `/crm/users?${sp.toString()}`;
}
