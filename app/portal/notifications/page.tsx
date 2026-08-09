import Link from "next/link";
import { listMyNotifications } from "@/services/notifications";
import { MarkAllRead } from "./mark-all-read";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const notifications = await listMyNotifications(50);
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="mt-1 text-base-content/70">
            {hasUnread
              ? `${notifications.filter((n) => !n.read).length} unread`
              : "You're all caught up"}
          </p>
        </div>
        <MarkAllRead hasUnread={hasUnread} />
      </div>

      <div className="mt-6 space-y-2">
        {notifications.length === 0 && (
          <div className="card card-body card-border bg-base-100 text-center text-base-content/60">
            No notifications yet.
          </div>
        )}
        {notifications.map((n) => {
          const inner = (
            <>
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`font-medium ${n.read ? "text-base-content/80" : "text-primary"}`}
                >
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
              {n.body && <p className="mt-1 text-sm text-base-content/70">{n.body}</p>}
              <span className={`badge mt-2 badge-sm badge-soft ${n.read ? "badge-neutral" : "badge-primary"}`}>
                {n.read ? "Read" : "New"}
              </span>
            </>
          );
          return (
            <div
              key={String(n._id)}
              className={`card card-body card-border ${n.read ? "bg-base-100" : "bg-base-200"}`}
            >
              {n.link ? (
                <Link href={n.link} className="link-hover link">
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}