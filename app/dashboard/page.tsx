import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/dal";
import { logout } from "@/lib/auth/actions";
import { ROLE_LABELS, type Role } from "@/lib/auth/roles";
import { hasPermission } from "@/lib/auth/permissions";
import type { Permission } from "@/lib/auth/permissions";
import { CRM_NAV, navItemAllowed, type CrmNavItem } from "@/lib/crm/nav";
import { ThemeToggle } from "@/components/site/ThemeToggle";

export const dynamic = "force-dynamic";

const EXTERNAL_ROLES: Role[] = [
  "PSYCHOLOGIST",
  "SOLICITOR",
  "SOLICITOR_FIRM_ADMIN",
  "INDIVIDUAL_CLIENT",
];

export default async function DashboardPage() {
  const user = await requireAuth();
  const role = user.role;
  const label = ROLE_LABELS[role] ?? role;

  if (EXTERNAL_ROLES.includes(role)) {
    redirect("/portal");
  }

  const has = (p: Permission): boolean => hasPermission(role, p);
  const sections = CRM_NAV.map((section) => ({
    ...section,
    items: section.items.filter((item: CrmNavItem) => navItemAllowed(item, has)),
  })).filter((section) => section.items.length > 0);

  const canAccessCrm =
    has("leads:read") || has("leads:create") || has("leads:import");

  return (
    <>
      <div className="navbar bg-base-200">
        <div className="navbar-start">
          <Link href="/" className="btn btn-ghost text-lg font-semibold">
            Bright<span className="text-primary">Mind</span>
          </Link>
        </div>
        <div className="navbar-end gap-2">
          {canAccessCrm && (
            <Link href="/crm" className="btn btn-primary btn-sm">
              Open CRM
            </Link>
          )}
          <ThemeToggle />
          <span className="badge badge-soft badge-primary hidden sm:inline-flex">{label}</span>
          <form action={logout}>
            <button type="submit" className="btn btn-ghost">
              Logout
            </button>
          </form>
        </div>
      </div>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {label}
        </h1>
        <p className="mt-2 text-base-content/70">
          Your secure staff area. Use the menu below to manage the platform.
        </p>

        {sections.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <div key={section.title} className="card card-body card-border bg-base-100">
                <h2 className="card-title text-base">{section.title}</h2>
                <ul className="menu menu-sm w-full rounded-box bg-base-200 p-2">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="card card-body card-border bg-base-100">
            <p className="text-base-content/70">
              Your role does not currently grant access to CRM modules.
            </p>
          </div>
        )}
      </main>
    </>
  );
}