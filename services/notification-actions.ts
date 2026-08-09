"use server";

import { revalidatePath } from "next/cache";
import { Notification } from "@/models/Notification";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth/dal";

export async function markNotificationsRead(): Promise<void> {
  const user = await requireAuth();
  await connectToDatabase();
  await Notification.updateMany(
    { user: user.id, read: false },
    { read: true, readAt: new Date() }
  );
  revalidatePath("/portal/notifications");
}