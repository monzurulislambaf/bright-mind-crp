import "server-only";
import { Appointment } from "@/models/Appointment";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";

export async function getAppointment(id: string) {
  const user = await requireAuth();
  if (!hasPermission(user.role, "appointments:read")) throw new Error("Not authorised.");
  await connectToDatabase();
  return Appointment.findById(id).lean();
}

export async function listAppointments({ status }: { status?: string }) {
  const user = await requireAuth();
  if (!hasPermission(user.role, "appointments:read")) throw new Error("Not authorised.");
  await connectToDatabase();
  const query: Record<string, unknown> = {};
  if (status) query.status = status;
  return Appointment.find(query).sort({ startsAt: 1 }).limit(200).lean();
}

export async function appointmentStats() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "appointments:read")) throw new Error("Not authorised.");
  await connectToDatabase();
  const [scheduled, confirmed, completed, cancelled] = await Promise.all([
    Appointment.countDocuments({ status: "scheduled" }),
    Appointment.countDocuments({ status: "confirmed" }),
    Appointment.countDocuments({ status: "completed" }),
    Appointment.countDocuments({ status: "cancelled" }),
  ]);
  return { scheduled, confirmed, completed, cancelled };
}

export async function listAppointmentsForPsychologist(psychologistId: string) {
  const user = await requireAuth();
  if (!hasPermission(user.role, "appointments:read")) throw new Error("Not authorised.");
  await connectToDatabase();
  return Appointment.find({ psychologist: psychologistId }).sort({ startsAt: 1 }).lean();
}

export async function listAppointmentsForCase(caseId: string) {
  const user = await requireAuth();
  if (!hasPermission(user.role, "appointments:read")) throw new Error("Not authorised.");
  await connectToDatabase();
  return Appointment.find({ case: caseId }).sort({ startsAt: 1 }).lean();
}