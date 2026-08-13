import "server-only";
import { Ticket } from "@/models/Ticket";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";

export async function listTickets({
  status,
  search,
}: {
  status?: string;
  search?: string;
}) {
  const user = await requireAuth();
  if (!hasPermission(user.role, "tickets:read") && !hasPermission(user.role, "tickets:create")) {
    throw new Error("Not authorised.");
  }
  await connectToDatabase();
  const query: Record<string, unknown> = {};
  if (status) query.status = status;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [
      { ticketId: rx },
      { subject: rx },
      { category: rx },
      { priority: rx },
      { status: rx },
      { resolution: rx },
      { "messages.body": rx },
    ];
  }
  return Ticket.find(query).sort({ updatedAt: -1 }).limit(100).lean();
}

export async function getTicket(id: string) {
  const user = await requireAuth();
  if (!hasPermission(user.role, "tickets:read") && !hasPermission(user.role, "tickets:create")) {
    throw new Error("Not authorised.");
  }
  await connectToDatabase();
  const ticket = await Ticket.findById(id).lean();
  if (!ticket) return null;
  const isReporter = String(ticket.reporter) === user.id;
  if (
    !hasPermission(user.role, "tickets:read") &&
    !isReporter &&
    String(ticket.assignee) !== user.id
  ) {
    return null;
  }
  return ticket;
}

export async function ticketStats() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "tickets:read") && !hasPermission(user.role, "tickets:create")) {
    throw new Error("Not authorised.");
  }
  await connectToDatabase();
  const [open, inProgress, resolved, escalated] = await Promise.all([
    Ticket.countDocuments({ status: "open" }),
    Ticket.countDocuments({ status: "in_progress" }),
    Ticket.countDocuments({ status: "resolved" }),
    Ticket.countDocuments({ escalated: true, status: { $ne: "closed" } }),
  ]);
  return { open, inProgress, resolved, escalated };
}