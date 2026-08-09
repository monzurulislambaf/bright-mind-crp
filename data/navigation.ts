export type NavLink = {
  href: string;
  label: string;
};

export const primaryNav: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/for-solicitors", label: "For Solicitors" },
  { href: "/for-psychologists", label: "For Psychologists" },
  { href: "/for-individuals", label: "For Individuals" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

export const footerNav = {
  company: [
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/faqs", label: "FAQs" },
    { href: "/contact", label: "Contact" },
  ],
  professionals: [
    { href: "/for-solicitors", label: "For Solicitors" },
    { href: "/for-psychologists", label: "For Psychologists" },
    { href: "/solicitor-partnership", label: "Solicitor Partnership" },
    { href: "/join-psychologist-network", label: "Join Psychologist Network" },
  ],
  individuals: [
    { href: "/for-individuals", label: "For Individuals" },
    { href: "/request-callback", label: "Request Callback" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/cookies", label: "Cookies" },
  ],
} as const;

export const siteContact = {
  email: "[insert email]",
  phone: "[insert phone number]",
  address: "[insert registered office address]",
} as const;

export const siteMeta = {
  name: "Bright Mind Psychology Care and Reporting",
  shortName: "Bright Mind",
  tagline: "Independent Psychological & Country Expert Reporting",
  description:
    "Independent, court-compliant psychological and country expert services for solicitors, barristers, and legal professionals.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://brightmind.example",
} as const;
