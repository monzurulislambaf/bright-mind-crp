export type NavLink = {
  href: string;
  label: string;
};

export const primaryNav: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Psychological Services" },
  { href: "/expert-forensic", label: "Expert & Forensic" },
  { href: "/country-reports", label: "Country Expertise" },
  { href: "/training-research", label: "Training & Research" },
  { href: "/our-experts", label: "Our Experts" },
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export const footerNav = {
  explore: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/our-experts", label: "Our Experts" },
    { href: "/insights", label: "Insights" },
    { href: "/faqs", label: "FAQs" },
    { href: "/contact", label: "Contact" },
  ],
  services: [
    { href: "/services", label: "Psychological Services" },
    { href: "/expert-forensic", label: "Expert & Forensic Psychology" },
    { href: "/country-reports", label: "Country Expertise" },
    { href: "/training-research", label: "Training & Research" },
    { href: "/counselling", label: "Counselling" },
    { href: "/reporting", label: "Psychological Reporting" },
  ],
  professionals: [
    { href: "/for-solicitors", label: "For Solicitors" },
    { href: "/for-psychologists", label: "For Psychologists" },
    { href: "/for-individuals", label: "For Individuals" },
    { href: "/join-psychologist-network", label: "Join the Expert Network" },
    { href: "/solicitor-partnership", label: "Solicitor Partnership" },
    { href: "/request-a-report", label: "Request a Report" },
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
    "Professional psychological services, expert & forensic psychology, country expertise, and training & research",
  description:
    "Bright Mind Psychology is a psychology organisation providing professional psychological services, expert and forensic psychology evidence for legal proceedings, country expertise, and training & research — delivered by qualified professionals.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://brightmind.care",
  region: "United Kingdom",
} as const;
