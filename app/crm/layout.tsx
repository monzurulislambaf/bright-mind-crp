import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission, permissionsForRole } from "@/lib/auth/permissions";
import type { Permission } from "@/lib/auth/permissions";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { logout } from "@/lib/auth/actions";

export const metadata: Metadata = { title: "CRM" };

const NAV: Array<{ href: string; label: string; perm?: Permission }> = [
  { href: "/crm", label: "Dashboard" },
  { href: "/crm/leads", label: "Leads", perm: "leads:read" },
  { href: "/crm/pipeline", label: "Pipeline", perm: "leads:read" },
  { href: "/crm/import", label: "Import Leads", perm: "leads:import" },
  { href: "/crm/onboarding", label: "Onboarding", perm: "leads:update" },
  { href: "/crm/cases", label: "Cases", perm: "cases:read" },
  { href: "/crm/reports", label: "Reports", perm: "reports:read" },
  { href: "/crm/tasks", label: "Tasks", perm: "tasks:read" },
  { href: "/crm/tickets", label: "Tickets", perm: "tickets:read" },
  { href: "/crm/appointments", label: "Appointments", perm: "appointments:read" },
  { href: "/crm/psychologists", label: "Psychologists", perm: "processors:review" },
  { href: "/crm/notifications", label: "Notifications", perm: "audit:read" },
  { href: "/crm/search", label: "Search", perm: "cases:read" },
];

export default async function CrmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();
  const perms = permissionsForRole(user.role);

const canAccessCrm =
  perms.includes("leads:read") || perms.includes("leads:create") || perms.includes("leads:import");

  if (!canAccessCrm) {
    redirect("/dashboard");
  }

  const nav = NAV.filter((item) => !item.perm || hasPermission(user.role, item.perm));

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
            <span className="badge badge-soft badge-neutral">{ROLE_LABELS[user.role] ?? user.role}</span>
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
          <span className="menu-title">Sales & CRM</span>
          {nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
          <span className="menu-title mt-6">Tools</span>
          <li>
            <Link href="/dashboard">Back to Dashboard</Link>
          </li>
        </div>
      </div>
    </div>
  );
}