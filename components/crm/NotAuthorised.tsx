import Link from "next/link";

/** Friendly denial state shown when a role lacks permission for a module. */
export function NotAuthorised({ module }: { module: string }) {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-16">
      <div className="card card-body card-border bg-base-100 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Access restricted</h1>
        <p className="mt-2 text-base-content/70">
          Your role does not grant access to <strong>{module}</strong>. If you
          believe this is a mistake, contact your administrator.
        </p>
        <div className="mt-6">
          <Link href="/crm" className="btn btn-primary">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
