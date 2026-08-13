import type { Permission } from "@/lib/auth/permissions";

/** CRM menu structure (design §34). */
export type CrmNavItem = {
  href: string;
  label: string;
  perm?: Permission | Permission[];
};

export type CrmNavSection = {
  title: string;
  items: CrmNavItem[];
};

export const CRM_NAV: CrmNavSection[] = [
  {
    title: "Overview",
    items: [{ href: "/crm", label: "Dashboard" }],
  },
  {
    title: "CRM",
    items: [
      { href: "/crm/leads", label: "Leads", perm: "leads:read" },
      { href: "/crm/pipeline", label: "Pipeline", perm: "leads:read" },
      { href: "/crm/import", label: "Import Leads", perm: "leads:import" },
      { href: "/crm/onboarding", label: "Onboarding", perm: "onboarding:read" },
      { href: "/crm/contacts", label: "Contacts", perm: "contacts:read" },
      {
        href: "/crm/organisations",
        label: "Organisations",
        perm: "organisation:read",
      },
      { href: "/crm/campaigns", label: "Campaigns", perm: "campaigns:read" },
    ],
  },
  {
    title: "Case Management",
    items: [
      { href: "/crm/cases", label: "All Cases", perm: "cases:read" },
      { href: "/crm/reports", label: "Reports", perm: "reports:read" },
      {
        href: "/crm/psychologists",
        label: "Psychologists",
        perm: "processors:review",
      },
    ],
  },
  {
    title: "Work",
    items: [
      { href: "/crm/tasks", label: "Tasks", perm: "tasks:read" },
      { href: "/crm/tickets", label: "Tickets", perm: "tickets:read" },
      {
        href: "/crm/appointments",
        label: "Appointments",
        perm: "appointments:read",
      },
    ],
  },
  {
    title: "Finance",
    items: [
      { href: "/crm/finance", label: "Overview", perm: "finance:read" },
    ],
  },
  {
    title: "Users & Access",
    items: [
      { href: "/crm/users", label: "Users", perm: "users:read" },
      { href: "/crm/users/roles", label: "Roles", perm: "roles:read" },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/crm/audit", label: "Audit Logs", perm: "audit:read" },
      {
        href: "/crm/notifications",
        label: "Notifications",
        perm: "notifications:read",
      },
      { href: "/crm/search", label: "Search", perm: "cases:read" },
    ],
  },
];

export function navItemAllowed(
  item: CrmNavItem,
  has: (p: Permission) => boolean
): boolean {
  if (!item.perm) return true;
  const required = Array.isArray(item.perm) ? item.perm : [item.perm];
  return required.some((p) => has(p));
}
