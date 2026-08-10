import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";
import type { Permission } from "@/lib/auth/permissions";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { logout } from "@/lib/auth/actions";
import { CRM_NAV, navItemAllowed, type CrmNavItem } from "@/lib/crm/nav";
import { ThemeToggle } from "@/components/site/ThemeToggle";

export const metadata: Metadata = { title: "CRM" };

export default async function CrmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();
  const has = (p: Permission): boolean => hasPermission(user.role, p);

  const canAccessCrm =
    has("leads:read") || has("leads:create") || has("leads:import");

  if (!canAccessCrm) {
    redirect("/dashboard");
  }

  const sections = CRM_NAV.map((section) => ({
    ...section,
    items: section.items.filter((item: CrmNavItem) =>
      navItemAllowed(item, has)
    ),
  })).filter((section) => section.items.length > 0);

  return (
    <div className="drawer lg:drawer-open">
      <input id="crm-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <div className="navbar sticky top-0 z-30 bg-base-100 shadow-sm">
          <div className="navbar-start">
            <label htmlFor="crm-drawer" className="btn btn-ghost drawer-button lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
            <Link href="/crm" className="btn btn-ghost text-lg font-semibold">
              Bright<span className="text-primary">Mind</span> <span className="badge badge-soft badge-primary ml-1">CRM</span>
            </Link>
          </div>
          <div className="navbar-end gap-2">
            <ThemeToggle />
            <span className="badge badge-soft badge-neutral hidden sm:inline-flex">
              {ROLE_LABELS[user.role] ?? user.role}
            </span>
            <form action={logout}>
              <button type="submit" className="btn btn-ghost btn-sm">
                Logout
              </button>
            </form>
          </div>
        </div>

        <main className="w-full flex-1 bg-base-100">{children}</main>
      </div>

      <div className="drawer-side">
        <label htmlFor="crm-drawer" aria-label="close sidebar" className="drawer-overlay" />
        <div className="menu min-h-full w-72 gap-1 bg-base-200 p-4">
          {sections.map((section) => (
            <div key={section.title}>
              <span className="menu-title">{section.title}</span>
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </div>
          ))}
          <div className="mt-6">
            <span className="menu-title">Navigate</span>
            <li>
              <Link href="/dashboard">Back to Dashboard</Link>
            </li>
          </div>
        </div>
      </div>
    </div>
  );
}