"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { Task, TASK_STATUS, TASK_PRIORITY } from "@/models/Task";
import { Ticket, TICKET_STATUS, TICKET_PRIORITY, TICKET_CATEGORY } from "@/models/Ticket";
import { connectToDatabase } from "@/lib/db";
import { buildYearId } from "@/lib/ids";
import { writeAuditLog } from "@/services/audit";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";
import { notify } from "@/services/notifications";

export type WorkActionState =
  | { ok: boolean; message?: string; errors?: Record<string, string[]> }
  | undefined;

const toObjId = (v: string) =>
  mongoose.Types.ObjectId.isValid(v) ? new mongoose.Types.ObjectId(v) : undefined;

// ---------------- Tasks ----------------

export async function createTask(
  _prev: WorkActionState,
  formData: FormData
): Promise<WorkActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "tasks:create")) {
    return { ok: false, message: "Permission denied." };
  }
  const title = String(formData.get("title") ?? "").trim();
  const priority = String(formData.get("priority") ?? "medium") as (typeof TASK_PRIORITY)[number];
  const status = String(formData.get("status") ?? "todo") as (typeof TASK_STATUS)[number];
  const dueAtRaw = formData.get("dueAt");
  const assignedTo = formData.get("assignedTo") ?? "";
  const linkType = String(formData.get("linkType") ?? "").trim();
  const linkId = String(formData.get("linkId") ?? "").trim();

  if (!title) return { ok: false, message: "A task title is required." };
  if (!TASK_PRIORITY.includes(priority)) return { ok: false, message: "Invalid priority." };
  if (!TASK_STATUS.includes(status)) return { ok: false, message: "Invalid status." };

  await connectToDatabase();
  const seq = (await Task.countDocuments().lean()) + 1;
  const task = await Task.create({
    taskId: buildYearId("TSK", seq),
    title,
    priority,
    status,
    dueAt: dueAtRaw && String(dueAtRaw) ? new Date(String(dueAtRaw)) : undefined,
    assignedTo: assignedTo && String(assignedTo) ? toObjId(String(assignedTo)) : undefined,
    linkType: linkType && linkType !== "none" ? (linkType as (typeof import("@/models/Task"))["TASK_LINK_TYPES"][number]) : undefined,
    linkId: linkId ? toObjId(linkId) : undefined,
    createdBy: new mongoose.Types.ObjectId(user.id),
  });

  if (task.assignedTo) {
    await notify({
      userId: String(task.assignedTo),
      type: "case_assignment",
      title: "New task assigned",
      body: task.title,
      link: "/crm/tasks",
    });
  }

  await writeAuditLog({
    actor: user.id,
    action: "task.created",
    resource: "task",
    resourceId: task.taskId,
  });
  revalidatePath("/crm/tasks");
  return { ok: true, message: "Task created." };
}

export async function updateTaskStatus(
  taskId: string,
  status: string
): Promise<WorkActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "tasks:update")) {
    return { ok: false, message: "Permission denied." };
  }
  if (!TASK_STATUS.includes(status as (typeof TASK_STATUS)[number])) {
    return { ok: false, message: "Invalid status." };
  }
  await connectToDatabase();
  const task = await Task.findById(taskId);
  if (!task) return { ok: false, message: "Task not found." };
  task.status = status as (typeof TASK_STATUS)[number];
  if (status === "done") task.completedAt = new Date();
  await task.save();
  await writeAuditLog({ actor: user.id, action: "task.status", resource: "task", resourceId: task.taskId });
  revalidatePath("/crm/tasks");
  return { ok: true };
}

// ---------------- Tickets ----------------

export async function createTicket(
  _prev: WorkActionState,
  formData: FormData
): Promise<WorkActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "tickets:create")) {
    return { ok: false, message: "Permission denied." };
  }
  const subject = String(formData.get("subject") ?? "").trim();
  const category = String(formData.get("category") ?? "other") as (typeof TICKET_CATEGORY)[number];
  const priority = String(formData.get("priority") ?? "medium") as (typeof TICKET_PRIORITY)[number];
  const body = String(formData.get("body") ?? "").trim();
  const caseId = String(formData.get("case") ?? "").trim();

  if (!subject) return { ok: false, message: "A subject is required." };
  if (!TICKET_CATEGORY.includes(category)) return { ok: false, message: "Invalid category." };
  if (!TICKET_PRIORITY.includes(priority)) return { ok: false, message: "Invalid priority." };

  await connectToDatabase();
  const seq = (await Ticket.countDocuments().lean()) + 1;
  const ticket = await Ticket.create({
    ticketId: buildYearId("TKT", seq),
    subject,
    category,
    priority,
    reporter: new mongoose.Types.ObjectId(user.id),
    case: caseId ? toObjId(caseId) : undefined,
    messages: body ? [{ author: new mongoose.Types.ObjectId(user.id), body }] : [],
  });

  await writeAuditLog({ actor: user.id, action: "ticket.created", resource: "ticket", resourceId: ticket.ticketId });
  revalidatePath("/crm/tickets");
  return { ok: true, message: "Ticket opened." };
}

export async function replyToTicket(
  _prev: WorkActionState,
  formData: FormData
): Promise<WorkActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "tickets:create") && !hasPermission(user.role, "tickets:read")) {
    return { ok: false, message: "Permission denied." };
  }
  const ticketId = String(formData.get("ticketId") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const internal = formData.get("internal") === "on";
  if (!ticketId || !body) return { ok: false, message: "A message is required." };

  await connectToDatabase();
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return { ok: false, message: "Ticket not found." };
  ticket.messages.push({ author: new mongoose.Types.ObjectId(user.id), body, internal });
  if (ticket.status === "closed") ticket.status = "in_progress";
  await ticket.save();
  await writeAuditLog({ actor: user.id, action: "ticket.reply", resource: "ticket", resourceId: ticket.ticketId });
  revalidatePath(`/crm/tickets/${ticketId}`);
  return { ok: true };
}

export async function updateTicket(
  ticketId: string,
  patch: { status?: string; assignee?: string; priority?: string; escalate?: boolean; resolution?: string }
): Promise<WorkActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "tickets:read")) {
    return { ok: false, message: "Permission denied." };
  }
  await connectToDatabase();
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return { ok: false, message: "Ticket not found." };

  if (patch.status) {
    if (!TICKET_STATUS.includes(patch.status as (typeof TICKET_STATUS)[number])) {
      return { ok: false, message: "Invalid status." };
    }
    ticket.status = patch.status as (typeof TICKET_STATUS)[number];
    if (patch.status === "resolved") {
      ticket.resolution = patch.resolution ?? "Resolved";
      ticket.resolvedAt = new Date();
    }
    if (patch.status === "closed") ticket.closedAt = new Date();
  }
  if (patch.assignee) ticket.assignee = toObjId(patch.assignee);
  if (patch.priority) {
    if (!TICKET_PRIORITY.includes(patch.priority as (typeof TICKET_PRIORITY)[number])) {
      return { ok: false, message: "Invalid priority." };
    }
    ticket.priority = patch.priority as (typeof TICKET_PRIORITY)[number];
  }
  if (patch.escalate !== undefined) ticket.escalated = patch.escalate;

  await ticket.save();
  await writeAuditLog({ actor: user.id, action: "ticket.update", resource: "ticket", resourceId: ticket.ticketId });
  revalidatePath(`/crm/tickets/${ticketId}`);
  return { ok: true };
}