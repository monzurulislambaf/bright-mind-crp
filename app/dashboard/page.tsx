import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/dal";
import { logout } from "@/lib/auth/actions";
import { ROLE_LABELS, type Role } from "@/lib/auth/roles";
import { hasPermission } from "@/lib/auth/permissions";

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

  return (
    <>
      <div className="navbar bg-base-200">
        <div className="navbar-start">
          <Link href="/" className="btn btn-ghost text-lg font-semibold">
            Bright<span className="text-primary">Mind</span>
          </Link>
        </div>
        <div className="navbar-end gap-2">
          <span className="badge badge-soft badge-primary">{label}</span>
          <form action={logout}>
            <button type="submit" className="btn btn-ghost">
              Logout
            </button>
          </form>
        </div>
      </div>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to your dashboard
        </h1>
        <p className="mt-2 text-base-content/70">
          Your secure {label} area. More modules are rolled out as cases begin.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card card-body card-border bg-base-100">
            <h2 className="card-title">Viewing permissions</h2>
            <p className="text-base-content/70">
              {hasPermission(role, "cases:read")
                ? "You can view case records you are authorised to access."
                : "Your role does not currently grant case access."}
            </p>
          </div>
          <div className="card card-body card-border bg-base-100">
            <h2 className="card-title">Secure by design</h2>
            <p className="text-base-content/70">
              Data access is enforced by role and case-level permissions, with
              every action audited.
            </p>
          </div>
          <div className="card card-body card-border bg-base-100">
            <h2 className="card-title">Need help?</h2>
            <p className="text-base-content/70">
              Open a ticket or contact support from your portal.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}