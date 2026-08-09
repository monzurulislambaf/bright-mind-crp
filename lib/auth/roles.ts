export type InternalRole =
  | "MASTER_ADMIN"
  | "SYSTEM_ADMIN"
  | "OPERATIONS"
  | "CASEWORKER"
  | "QUALITY_REVIEW"
  | "FINANCE"
  | "MARKETING"
  | "SALES_MANAGER"
  | "SALES_AGENT";

export type ExternalRole =
  | "SOLICITOR_FIRM_ADMIN"
  | "SOLICITOR"
  | "PSYCHOLOGIST"
  | "INDIVIDUAL_CLIENT";

export type Role = InternalRole | ExternalRole;

export const INTERNAL_ROLES: readonly InternalRole[] = [
  "MASTER_ADMIN",
  "SYSTEM_ADMIN",
  "OPERATIONS",
  "CASEWORKER",
  "QUALITY_REVIEW",
  "FINANCE",
  "MARKETING",
  "SALES_MANAGER",
  "SALES_AGENT",
];

export const EXTERNAL_ROLES: readonly ExternalRole[] = [
  "SOLICITOR_FIRM_ADMIN",
  "SOLICITOR",
  "PSYCHOLOGIST",
  "INDIVIDUAL_CLIENT",
];

export const ALL_ROLES: readonly Role[] = [
  ...INTERNAL_ROLES,
  ...EXTERNAL_ROLES,
];

export const ROLE_LABELS: Record<Role, string> = {
  MASTER_ADMIN: "Master Admin",
  SYSTEM_ADMIN: "System Admin",
  OPERATIONS: "Operations",
  CASEWORKER: "Caseworker",
  QUALITY_REVIEW: "Quality Review",
  FINANCE: "Finance",
  MARKETING: "Marketing",
  SALES_MANAGER: "Sales Manager",
  SALES_AGENT: "Sales Agent",
  SOLICITOR_FIRM_ADMIN: "Solicitor Firm Admin",
  SOLICITOR: "Solicitor",
  PSYCHOLOGIST: "Psychologist / Expert",
  INDIVIDUAL_CLIENT: "Individual Client",
};

/** Roles that are not allowed direct access to unauthorised clinical data. */
export const CLINICAL_ROLES: readonly Role[] = [
  "MASTER_ADMIN",
  "SYSTEM_ADMIN",
  "OPERATIONS",
  "CASEWORKER",
  "QUALITY_REVIEW",
  "PSYCHOLOGIST",
  "SOLICITOR_FIRM_ADMIN",
  "SOLICITOR",
  "INDIVIDUAL_CLIENT",
];