"use client";

import { useTransition } from "react";
import { markNotificationsRead } from "@/services/notification-actions";

export function MarkAllRead({ hasUnread }: { hasUnread: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="btn btn-sm btn-outline"
      disabled={pending || !hasUnread}
      onClick={() => startTransition(() => { void markNotificationsRead(); })}
    >
      {pending ? "Marking…" : "Mark all as read"}
    </button>
  );
}