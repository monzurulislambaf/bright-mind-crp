export const APPOINTMENT_TYPE = [
  "consultation",
  "assessment",
  "therapy",
  "review",
  "other",
] as const;

export const APPOINTMENT_STATUS = [
  "scheduled",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
] as const;

export type AppointmentType = (typeof APPOINTMENT_TYPE)[number];
export type AppointmentStatus = (typeof APPOINTMENT_STATUS)[number];