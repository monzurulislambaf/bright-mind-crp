import "server-only";
import { Notification } from "@/models/Notification";
import type { NotificationType } from "@/models/Notification";
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