import type { Metadata } from "next";
import { listRoles } from "@/services/admin";
import { ALL_ROLES, INTERNAL_ROLES, EXTERNAL_ROLES } from "@/lib/auth/roles";
import { NotAuthorised } from "@/components/crm/NotAuthorised";

export const metadata: Metadata = { title: "Roles & Permissions" };
export const dynamic = "force-dynamic";

export default async function RolesPage() {
  let roles: Awaited<ReturnType<typeof listRoles>>;
  try {
    roles = await listRoles();
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Not authorised")) {
      return <NotAuthorised module="Roles & Permissions" />;
    }
    throw error;
  }

  const grouped = [
    { title: "Internal roles", roles: roles.filter((r) => INTERNAL_ROLES.includes(r.role as (typeof INTERNAL_ROLES)[number])) },
    { title: "External roles", roles: roles.filter((r) => EXTERNAL_ROLES.includes(r.role as (typeof EXTERNAL_ROLES)[number])) },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
        <p className="mt-1 text-base-content/70">
          RBAC matrix — {ALL_ROLES.length} roles defined. Permission format:{" "}
          <code className="rounded bg-base-200 px-1.5 py-0.5 font-mono text-xs">resource:action</code>.
        </p>
      </div>

      {grouped.map((group) => (
        <section key={group.title} className="mb-10">
          <h2 className="mb-3 text-lg font-semibold">{group.title}</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {group.roles.map((r) => (
              <article key={r.role} className="card card-body card-border bg-base-100">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-base font-semibold text-primary">
                    {r.label}
                  </h3>
                  <span className="badge badge-soft badge-neutral">{r.permissions.length} perms</span>
                </div>
                <p className="font-mono text-xs text-base-content/50">{r.role}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {r.permissions.slice(0, 12).map((p) => (
                    <span key={p} className="badge badge-soft badge-ghost text-[10px] font-normal">
                      {p}
                    </span>
                  ))}
                  {r.permissions.length > 12 && (
                    <span className="badge badge-soft text-[10px] font-normal">
                      +{r.permissions.length - 12} more
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <p className="text-sm text-base-content/60">
        Access is also scoped by organisation, case assignment and document
        permission — the matrix above lists capability, not automatic visibility.
      </p>
    </div>
  );
}
