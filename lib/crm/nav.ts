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
    title: "Tools",
    items: [
      { href: "/crm/notifications", label: "Notifications", perm: "notifications:read" },
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
