import "server-only";
import mongoose from "mongoose";
import { Notification } from "@/models/Notification";
import type { NotificationType } from "@/models/Notification";
import { User } from "@/models/User";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";

export interface NotifyInput {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  link?: string;
}

export async function notify(input: NotifyInput): Promise<void> {
  try {
    await connectToDatabase();
    await Notification.create({
      user: input.userId,
      type: input.type,
      title: input.title,
      body: input.body,
      link: input.link,
    });
  } catch (error) {
    console.error("Notification write failed", error);
  }
}

export async function listMyNotifications(limit = 30) {
  const user = await requireAuth();
  await connectToDatabase();
  return Notification.find({ user: user.id })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function unreadNotificationCount() {
  const user = await requireAuth();
  await connectToDatabase();
  return Notification.countDocuments({ user: user.id, read: false });
}

export async function listNotificationsForAdmin(limit = 100) {
  const user = await requireAuth();
  if (!hasPermission(user.role, "audit:read")) throw new Error("Not authorised.");
  await connectToDatabase();
  return Notification.find({}).sort({ createdAt: -1 }).limit(limit).lean();
}

/**
 * Resolve user display names for notification recipients (admin view).
 * Returns a map of user id → display label, falling back to the id.
 */
export async function listUserEmails(
  userIds: unknown[]
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const ids = [
    ...new Set(
      userIds
        .map((u) => String(u))
        // Guard against malformed values that would throw a CastError.
        .filter((id) => mongoose.isValidObjectId(id))
    ),
  ];
  if (ids.length === 0) return map;
  await connectToDatabase();
  const users = await User.find({ _id: { $in: ids } })
    .select("firstName lastName email userId")
    .lean();
  for (const u of users) {
    const label = [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email || u.userId;
    map.set(String(u._id), label);
  }
  return map;
}