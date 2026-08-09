export const CASE_STATUS = [
  "New Instruction",
  "Initial Review",
  "Quotation",
  "Approved",
  "Psychologist Allocation",
  "Assessment",
  "Report Preparation",
  "Quality Review",
  "Secure Release",
  "Closed",
] as const;

export type CaseStatus = (typeof CASE_STATUS)[number];

export const OFFER_STATUS = [
  "Offered",
  "Accepted",
  "Declined",
  "Expired",
  "Conflict",
  "Assigned",
] as const;

export type OfferStatus = (typeof OFFER_STATUS)[number];

type BadgeTone = "primary" | "success" | "warning" | "error" | "info" | "neutral" | "accent";

export const CASE_BADGE: Record<CaseStatus, BadgeTone> = {
  "New Instruction": "info",
  "Initial Review": "info",
  Quotation: "neutral",
  Approved: "success",
  "Psychologist Allocation": "neutral",
  Assessment: "warning",
  "Report Preparation": "warning",
  "Quality Review": "accent",
  "Secure Release": "success",
  Closed: "neutral",
};

export const OFFER_BADGE: Record<OfferStatus, BadgeTone> = {
  Offered: "info",
  Accepted: "success",
  Declined: "error",
  Expired: "neutral",
  Conflict: "warning",
  Assigned: "primary",
};