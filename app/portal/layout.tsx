import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/dal";
import { ROLE_LABELS, type Role } from "@/lib/auth/roles";
import { logout } from "@/lib/auth/actions";
import { unreadNotificationCount } from "@/services/notifications";

export const metadata: Metadata = { title: "Portal" };

const EXTERNAL_ROLES: Role[] = [
  "PSYCHOLOGIST",
  "SOLICITOR",
  "SOLICITOR_FIRM_ADMIN",
  "INDIVIDUAL_CLIENT",
];

function navForRole(role: Role): Array<{ href: string; label: string }> {
  switch (role) {
    case "PSYCHOLOGIST":
      return [
        { href: "/portal/psychologist", label: "Overview" },
        { href: "/portal/psychologist/reports", label: "My Reports" },
        { href: "/portal/psychologist/profile", label: "My Profile" },
      ];
    case "SOLICITOR":
    case "SOLICITOR_FIRM_ADMIN":
      return [
        { href: "/portal/solicitor", label: "Overview" },
        { href: "/portal/solicitor/new", label: "New Instruction" },
      ];
    case "INDIVIDUAL_CLIENT":
      return [
        { href: "/portal/individual", label: "Overview" },
        { href: "/portal/individual/new", label: "New Service Request" },
      ];
    default:
      return [];
  }
}

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  if (!EXTERNAL_ROLES.includes(user.role)) {
    redirect("/dashboard");
  }

  const nav = navForRole(user.role);
  const [unread] = await Promise.all([unreadNotificationCount()]);

  return (
    <div className="drawer lg:drawer-open">
      <input id="portal-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <div className="navbar sticky top-0 z-30 bg-base-100 shadow-sm">
          <div className="navbar-start">
            <label htmlFor="portal-drawer" className="btn btn-ghost drawer-button lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
            <Link href="/portal" className="btn btn-ghost text-lg font-semibold">
              Bright<span className="text-primary">Mind</span>{" "}
              <span className="badge badge-soft badge-primary ml-1">Portal</span>
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
        <label htmlFor="portal-drawer" aria-label="close sidebar" className="drawer-overlay" />
        <div className="menu min-h-full w-72 gap-1 bg-base-200 p-4">
          <span className="menu-title">My Portal</span>
          {nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
          <li>
            <Link href="/portal/notifications" className="flex items-center justify-between">
              <span>Notifications</span>
              {unread > 0 && <span className="badge badge-primary badge-sm">{unread}</span>}
            </Link>
          </li>
          <span className="menu-title mt-6">Account</span>
          <li>
            <Link href="/dashboard">Back to Dashboard</Link>
          </li>
        </div>
      </div>
    </div>
  );
}