export type NavLink = {
  href: string;
  label: string;
};

export const primaryNav: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/reporting", label: "Reporting" },
  { href: "/country-reports", label: "Country Reports" },
  { href: "/counselling", label: "Counselling" },
  { href: "/for-solicitors", label: "For Solicitors" },
  { href: "/for-psychologists", label: "Professionals" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export const footerNav = {
  company: [
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/insights", label: "Insights" },
    { href: "/faqs", label: "FAQs" },
    { href: "/contact", label: "Contact" },
  ],
  services: [
    { href: "/reporting", label: "Psychological Reporting" },
    { href: "/country-reports", label: "Country Expert Reports" },
    { href: "/counselling", label: "Counselling" },
    { href: "/request-a-report", label: "Request a Report" },
  ],
  professionals: [
    { href: "/for-solicitors", label: "For Solicitors" },
    { href: "/for-psychologists", label: "For Psychologists" },
    { href: "/for-individuals", label: "For Individuals" },
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
  email: "info@brightmind.care",
  phone: "[insert phone number]",
  address: "[insert registered office address]",
} as const;

export const siteMeta = {
  name: "Bright Mind Psychology",
  shortName: "Bright Mind",
  tagline:
    "Asylum psychological reports, country expert evidence, and remote counselling",
  description:
    "Bright Mind Psychology provides asylum psychological reports, immigration psychological assessments, country expert reports, and remote counselling for solicitors, asylum seekers, and clients worldwide.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://brightmind.care",
  region: "United Kingdom",
} as const;
