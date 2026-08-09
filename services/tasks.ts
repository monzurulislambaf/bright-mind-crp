import "server-only";
import { Task } from "@/models/Task";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";

export async function listTasks({ status }: { status?: string }) {
  const user = await requireAuth();
  if (!hasPermission(user.role, "tasks:read")) throw new Error("Not authorised.");
  await connectToDatabase();
  const query: Record<string, unknown> = {};
  if (status) query.status = status;
  return Task.find(query).sort({ createdAt: -1 }).limit(100).lean();
}

export async function taskStats() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "tasks:read")) throw new Error("Not authorised.");
  await connectToDatabase();
  const [todo, inProgress, review, done] = await Promise.all([
    Task.countDocuments({ status: "todo" }),
    Task.countDocuments({ status: "in_progress" }),
    Task.countDocuments({ status: "in_review" }),
    Task.countDocuments({ status: "done" }),
  ]);
  return { todo, inProgress, review, done };
}