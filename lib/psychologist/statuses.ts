export const PSYCHOLOGIST_STATUS = [
  "Pending",
  "Under Review",
  "More Information Required",
  "Approved",
  "Rejected",
  "Suspended",
] as const;

export type PsychologistStatus = (typeof PSYCHOLOGIST_STATUS)[number];

export const PSYCH_BADGE: Record<PsychologistStatus, string> = {
  Pending: "info",
  "Under Review": "warning",
  "More Information Required": "warning",
  Approved: "success",
  Rejected: "error",
  Suspended: "error",
};