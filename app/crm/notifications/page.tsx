import Link from "next/link";
import { listNotificationsForAdmin, listUserEmails } from "@/services/notifications";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  const notifications = await listNotificationsForAdmin(100);
  const userLabels = await listUserEmails(notifications.map((n) => n.user));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <p className="mt-1 text-base-content/70">Latest system notifications across all users.</p>
      </div>

      <div className="mt-6 space-y-2">
        {notifications.length === 0 && (
          <div className="card card-body card-border bg-base-100 text-center text-base-content/60">
            No notifications yet.
          </div>
        )}
        {notifications.map((n) => (
          <div key={String(n._id)} className={`card card-body card-border ${n.read ? "bg-base-100" : "bg-base-200"}`}>
            <div className="flex items-start justify-between gap-3">
              <span className={`font-medium ${n.read ? "text-base-content/80" : "text-primary"}`}>
                {n.title}
              </span>
              <span className="text-xs text-base-content/50">
                {new Date(n.createdAt).toLocaleString("en-GB", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="mt-1 text-sm text-base-content/70">
              For {userLabels.get(String(n.user)) ?? String(n.user)} · type {n.type}
            </p>
            {n.body && <p className="mt-1 text-sm text-base-content/70">{n.body}</p>}
            {n.link && (
              <Link href={n.link} className="link link-hover mt-2 text-sm">
                Open →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}