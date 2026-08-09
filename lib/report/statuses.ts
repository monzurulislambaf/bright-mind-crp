export const REPORT_STATUS = [
  "Draft",
  "Quality Review",
  "Amendment",
  "Approved",
  "Final",
  "Released",
] as const;

export type ReportStatus = (typeof REPORT_STATUS)[number];

type BadgeTone = "primary" | "success" | "warning" | "error" | "info" | "neutral" | "accent";

export const REPORT_BADGE: Record<ReportStatus, BadgeTone> = {
  Draft: "neutral",
  "Quality Review": "info",
  Amendment: "warning",
  Approved: "success",
  Final: "primary",
  Released: "accent",
};