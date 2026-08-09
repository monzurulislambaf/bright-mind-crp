export const LEAD_STATUS = [
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
  "Future Opportunity",
  "Unqualified",
  "Lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUS)[number];