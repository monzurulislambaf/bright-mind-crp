"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { Appointment, APPOINTMENT_STATUS, APPOINTMENT_TYPE } from "@/models/Appointment";
import { connectToDatabase } from "@/lib/db";
import { buildYearId } from "@/lib/ids";
import { writeAuditLog } from "@/services/audit";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";
import { notify } from "@/services/notifications";

export type AppointmentActionState = { ok: boolean; message?: string } | undefined;

export async function createAppointment(
  _prev: AppointmentActionState,
  formData: FormData
): Promise<AppointmentActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "appointments:create")) {
    return { ok: false, message: "Permission denied." };
  }
  const title = String(formData.get("title") ?? "").trim();
  const kind = String(formData.get("kind") ?? "other") as (typeof APPOINTMENT_TYPE)[number];
  const status = String(formData.get("status") ?? "scheduled") as (typeof APPOINTMENT_STATUS)[number];
  const startsAtRaw = String(formData.get("startsAt") ?? "");
  const endsAtRaw = formData.get("endsAt");
  const psychologistRaw = String(formData.get("psychologist") ?? "");
  const clientRaw = String(formData.get("client") ?? "");
  const caseRaw = String(formData.get("case") ?? "");
  const organisationRaw = String(formData.get("organisation") ?? "");
  const location = String(formData.get("location") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!title) return { ok: false, message: "A title is required." };
  if (!startsAtRaw) return { ok: false, message: "Start time is required." };
  if (!APPOINTMENT_TYPE.includes(kind)) return { ok: false, message: "Invalid appointment kind." };
  if (!APPOINTMENT_STATUS.includes(status)) return { ok: false, message: "Invalid status." };

  await connectToDatabase();
  const seq = (await Appointment.countDocuments().lean()) + 1;
  const appointment = await Appointment.create({
    appointmentId: buildYearId("APT", seq),
    kind,
    status,
    title,
    startsAt: new Date(startsAtRaw),
    endsAt: typeof endsAtRaw === "string" && endsAtRaw.length > 0 ? new Date(endsAtRaw) : undefined,
    psychologist: psychologistRaw ? new mongoose.Types.ObjectId(psychologistRaw) : undefined,
    client: clientRaw ? new mongoose.Types.ObjectId(clientRaw) : undefined,
    case: caseRaw ? new mongoose.Types.ObjectId(caseRaw) : undefined,
    organisation: organisationRaw ? new mongoose.Types.ObjectId(organisationRaw) : undefined,
    location: location || undefined,
    notes: notes || undefined,
    createdBy: new mongoose.Types.ObjectId(user.id),
  });

  if (appointment.psychologist) {
    await notify({
      userId: String(appointment.psychologist),
      type: "appointment",
      title: "New appointment scheduled",
      body: appointment.title ?? "",
      link: "/portal/psychologist",
    });
  }

  await writeAuditLog({
    actor: user.id,
    action: "appointment.created",
    resource: "appointment",
    resourceId: appointment.appointmentId,
  });
  revalidatePath("/crm/appointments");
  return { ok: true, message: "Appointment created." };
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: string
): Promise<AppointmentActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "appointments:read")) {
    return { ok: false, message: "Permission denied." };
  }
  if (!APPOINTMENT_STATUS.includes(status as (typeof APPOINTMENT_STATUS)[number])) {
    return { ok: false, message: "Invalid status." };
  }
  await connectToDatabase();
  const appt = await Appointment.findById(appointmentId);
  if (!appt) return { ok: false, message: "Appointment not found." };
  appt.status = status as (typeof APPOINTMENT_STATUS)[number];
  await appt.save();
  await writeAuditLog({ actor: user.id, action: "appointment.status", resource: "appointment", resourceId: appt.appointmentId });
  revalidatePath("/crm/appointments");
  return { ok: true, message: `Appointment marked as ${status}.` };
}

export async function cancelAppointment(appointmentId: string): Promise<AppointmentActionState> {
  return updateAppointmentStatus(appointmentId, "cancelled");
}