import type { LeadStatus } from "@/lib/crm/statuses";

export const FUNNEL: readonly LeadStatus[] = [
  "New",
  "Assigned",
  "Contact Attempted",
  "Contact Established",
  "Needs Identified",
  "Qualified",
  "Consultation",
  "Proposal Sent",
  "Onboarding",
  "Converted",
];

export const NON_FUNNEL: readonly LeadStatus[] = [
  "Future Opportunity",
  "Unqualified",
  "Lost",
];

/** Statuses that mirror the lead funnel order (index used for progression). */
export function funnelIndex(status: LeadStatus): number {
  return FUNNEL.indexOf(status);
}

export function isFunnel(status: LeadStatus): boolean {
  return FUNNEL.includes(status);
}

export function nextFunnelStatus(status: LeadStatus): LeadStatus | null {
  if (!isFunnel(status)) return null;
  const next = FUNNEL[funnelIndex(status) + 1];
  return next ?? null;
}

export const STATUS_BADGE: Record<
  LeadStatus,
  "primary" | "success" | "warning" | "error" | "info" | "neutral"
> = {
  New: "info",
  Assigned: "neutral",
  "Contact Attempted": "neutral",
  "Contact Established": "info",
  "Needs Identified": "info",
  Qualified: "success",
  Consultation: "success",
  "Proposal Sent": "warning",
  Onboarding: "primary",
  Converted: "success",
  "Future Opportunity": "neutral",
  Unqualified: "warning",
  Lost: "error",
};