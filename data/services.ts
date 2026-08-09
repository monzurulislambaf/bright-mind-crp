export type Service = {
  id: string;
  number: string;
  title: string;
  shortDescription: string;
  description: string;
  useCases: string[];
  href: string;
  icon: "report" | "certificate" | "country" | "risk" | "counselling";
};

export const services: Service[] = [
  {
    id: "expert-psychological-report",
    number: "01",
    title: "Expert Psychological Report",
    shortDescription:
      "Independent psychological assessments prepared for use in legal proceedings.",
    description:
      "Independent psychological assessments prepared for use in legal proceedings. Each report is tailored to the specific legal test and evidentiary requirements of the case.",
    useCases: [
      "Immigration",
      "Family Law",
      "Criminal Law",
      "Personal Injury",
      "Employment Tribunal",
      "Clinical Negligence",
      "Other legal proceedings",
    ],
    href: "/services#expert-psychological-report",
    icon: "report",
  },
  {
    id: "mental-health-status-certificate",
    number: "02",
    title: "Mental Health Status Certificate",
    shortDescription:
      "A concise, clinically grounded certificate outlining current mental state and functional impact.",
    description:
      "A concise, clinically grounded certificate outlining a person's current mental state and its functional impact, issued following a formal clinical assessment.",
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
    shortDescription:
      "In-depth reports on mental health systems, care accessibility, and societal attitudes.",
    description:
      "In-depth country expert reports examining mental health systems, accessibility of care, and societal attitudes toward mental illness across relevant countries in Asia, Africa, and Europe.",
    useCases: [
      "Country-specific mental health system evidence",
      "Accessibility of care analysis",
      "Societal attitudes toward mental illness",
    ],
    href: "/services#country-expert-mental-health",
    icon: "country",
  },
  {
    id: "other-country-expert-reports",
    number: "04",
    title: "Other Country Expert Reports",
    shortDescription:
      "Political, social, minority, activist and human rights-based risk assessments.",
    description:
      "Country expert reports addressing political, social, minority, online activist, and human rights-based risks — prepared by experienced experts including psychologists, medical professionals, and political or social scientists.",
    useCases: [
      "Political risk assessments",
      "Social and minority conditions",
      "Online activist risk",
      "Human rights-based evidence",
    ],
    href: "/services#other-country-expert-reports",
    icon: "risk",
  },
  {
    id: "counselling-services",
    number: "05",
    title: "Counselling Services",
    shortDescription:
      "Professional support for modern slavery, trauma, and psycho-social difficulties.",
    description:
      "Professional counselling for individuals affected by modern slavery, trauma, and other psycho-social difficulties or psychological disorders, delivered by qualified mental health professionals.",
    useCases: [
      "Modern slavery support",
      "Trauma counselling",
      "Psycho-social difficulties",
      "Psychological disorders",
    ],
    href: "/services#counselling-services",
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
