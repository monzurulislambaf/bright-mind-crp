export type Service = {
  id: string;
  number: string;
  title: string;
  rate: string;
  shortDescription: string;
  description: string;
  details: string[];
  useCases: string[];
  href: string;
  icon: "report" | "certificate" | "country" | "risk" | "counselling";
};

export const services: Service[] = [
  {
    id: "expert-psychological-report",
    number: "01",
    title: "Expert Psychological Report",
    rate: "£800",
    shortDescription:
      "Independent psychological assessments prepared for use in legal proceedings.",
    description:
      "Independent psychological assessment and expert opinion prepared for immigration, asylum, family, criminal, personal injury, employment, and institutional matters.",
    details: [
      "Clinical interview, behavioural observation, psychometric assessment, and document review.",
      "Structured to answer legal and evidential questions with careful reasoning.",
      "Suitable for UK tribunal and court-facing instruction.",
    ],
    useCases: [
      "Immigration",
      "Family Law",
      "Criminal Law",
      "Personal Injury",
      "Employment Tribunal",
      "Clinical Negligence",
      "Other legal proceedings",
    ],
    href: "/reporting",
    icon: "report",
  },
  {
    id: "mental-health-status-certificate",
    number: "02",
    title: "Mental Health Status Certificate",
    rate: "£400",
    shortDescription:
      "A concise, clinically grounded certificate outlining current mental state and functional impact.",
    description:
      "A concise certificate describing current mental state and functional impact following clinical assessment.",
    details: [
      "Often used for litigation friend matters, PIP, housing, education, and other institutional requests.",
      "Focused, practical output for cases that do not require a full expert report.",
      "Prepared with the same care around clarity, limitations, and release.",
    ],
    useCases: [
      "Litigation Friend matters (Tribunal)",
      "PIP applications (Department for Work and Pensions)",
      "Housing",
      "Education",
      "Other government or institutional purposes",
    ],
    href: "/services#mental-health-status-certificate",
    icon: "certificate",
  },
  {
    id: "country-expert-mental-health",
    number: "03",
    title: "Country Expert Report: Mental Health Landscape",
    rate: "£600",
    shortDescription:
      "In-depth reports on mental health systems, care accessibility, and societal attitudes.",
    description:
      "Country expert evidence on mental-health systems, service accessibility, and societal attitudes in relevant jurisdictions.",
    details: [
      "Useful when the legal question depends on treatment access, stigma, continuity of care, or system capacity.",
      "Current coverage spans jurisdictions across Asia, Africa, and Europe.",
      "Can be paired with psychological evidence when the case requires both clinical and country context.",
    ],
    useCases: [
      "Country-specific mental health system evidence",
      "Accessibility of care analysis",
      "Societal attitudes toward mental illness",
    ],
    href: "/country-reports",
    icon: "country",
  },
  {
    id: "other-country-expert-reports",
    number: "04",
    title: "Other Country Expert Reports",
    rate: "£500–£800",
    shortDescription:
      "Political, social, minority, activist and human rights-based risk assessments.",
    description:
      "Country reports addressing political, social, minority, online activist, and human-rights-based risks.",
    details: [
      "Prepared by experienced country specialists, including psychologists, medical professionals, and social scientists.",
      "Designed for cases where local context materially affects safety, vulnerability, or return risk.",
      "Scoping can be tailored to the legal questions in issue.",
    ],
    useCases: [
      "Political risk assessments",
      "Social and minority conditions",
      "Online activist risk",
      "Human rights-based evidence",
    ],
    href: "/country-reports",
    icon: "risk",
  },
  {
    id: "counselling-services",
    number: "05",
    title: "Counselling Services",
    rate: "£40 per session",
    shortDescription:
      "Professional support for modern slavery, trauma, and psycho-social difficulties.",
    description:
      "Counselling delivered by qualified professionals for trauma, modern slavery, psycho-social strain, and psychological distress.",
    details: [
      "Accessible worldwide through a remote-first delivery model.",
      "Suitable for direct clients, referred clients, and post-assessment support pathways.",
      "Built to extend into therapist matching, scheduling, and secure follow-up.",
    ],
    useCases: [
      "Modern slavery support",
      "Trauma counselling",
      "Psycho-social difficulties",
      "Psychological disorders",
    ],
    href: "/counselling",
    icon: "counselling",
  },
];

export const practiceAreas = [
  "Immigration",
  "Family Law",
  "Criminal Law",
  "Personal Injury",
  "Employment Tribunal",
  "Clinical Negligence",
] as const;
