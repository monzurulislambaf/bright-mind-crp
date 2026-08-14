export type ServicePillar = "psychological" | "expert-forensic" | "country";

export type ServiceIconName =
  | "report"
  | "certificate"
  | "country"
  | "risk"
  | "counselling"
  | "assessment"
  | "consultation"
  | "wellbeing"
  | "remote"
  | "forensic"
  | "evidence"
  | "expert-consultation";

export type Service = {
  id: string;
  number: string;
  title: string;
  rate: string;
  pillar: ServicePillar;
  shortDescription: string;
  description: string;
  details: string[];
  useCases: string[];
  href: string;
  icon: ServiceIconName;
};

export const services: Service[] = [
  // ── Psychological Services ─────────────────────────────────────────────
  {
    id: "psychological-assessment",
    number: "01",
    title: "Psychological Assessment",
    rate: "Fees on enquiry",
    pillar: "psychological",
    shortDescription:
      "Structured psychological assessment for individuals and professionals, carried out by qualified psychologists.",
    description:
      "Structured psychological assessment involving clinical interview, history-taking and, where appropriate, standardised measures — undertaken by qualified psychologists and tailored to the purpose of the assessment.",
    details: [
      "Clinical interview and history-taking with the individual.",
      "Standardised measures used where professionally appropriate.",
      "Clear written findings, with limitations stated honestly.",
    ],
    useCases: [
      "Understanding current psychological functioning",
      "Assessment for support or treatment planning",
      "Context for legal or institutional questions",
    ],
    href: "/services",
    icon: "assessment",
  },
  {
    id: "psychological-consultation",
    number: "02",
    title: "Psychological Consultation",
    rate: "Fees on enquiry",
    pillar: "psychological",
    shortDescription:
      "Consultation with a qualified psychologist to clarify needs, options and the right pathway.",
    description:
      "A focused consultation with a qualified psychologist to understand your circumstances, discuss what is available, and identify the most appropriate next step — including whether a formal assessment is warranted.",
    details: [
      "Confidential discussion with a qualified professional.",
      "Honest guidance on suitability and available pathways.",
      "No obligation to proceed with a formal assessment.",
    ],
    useCases: [
      "Understanding whether an assessment is needed",
      "Guidance on psychological support options",
      "Advice for referring professionals and organisations",
    ],
    href: "/services",
    icon: "consultation",
  },
  {
    id: "mental-health-status-certificate",
    number: "03",
    title: "Mental Health Status Certificate",
    rate: "£400",
    pillar: "psychological",
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
    id: "counselling-services",
    number: "04",
    title: "Counselling & Psychological Support",
    rate: "£40 per session",
    pillar: "psychological",
    shortDescription:
      "Professional support for trauma, modern slavery, and psycho-social difficulties.",
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
  {
    id: "psychological-wellbeing",
    number: "05",
    title: "Psychological Wellbeing",
    rate: "Fees on enquiry",
    pillar: "psychological",
    shortDescription:
      "Psychology-informed wellbeing support focused on coping, adjustment, and recovery.",
    description:
      "Psychology-informed support for individuals navigating stress, adjustment, loss, displacement, or life transitions — focused on coping, stability, and recovery where psychological wellbeing support is genuinely appropriate.",
    details: [
      "Delivered by qualified professionals with psychological training.",
      "Suitability confirmed before any ongoing commitment.",
      "Kept clearly separate from forensic or expert evidence pathways.",
    ],
    useCases: [
      "Coping with stress and uncertainty",
      "Adjustment after displacement or major life change",
      "Support alongside other care",
    ],
    href: "/services",
    icon: "wellbeing",
  },
  {
    id: "remote-psychological-services",
    number: "06",
    title: "Remote Psychological Services",
    rate: "Fees on enquiry",
    pillar: "psychological",
    shortDescription:
      "Secure video-delivered psychological services for clients across borders.",
    description:
      "Psychological services delivered securely by video where a remote model is professionally appropriate — supporting clients who are overseas, geographically dispersed, or unable to attend in person.",
    details: [
      "Secure video consultation and assessment.",
      "Interpreter-friendly workflows where needed.",
      "Suitability for remote delivery confirmed case by case.",
    ],
    useCases: [
      "Clients outside the UK",
      "Clients unable to travel",
      "Secure cross-border assessment and support",
    ],
    href: "/services",
    icon: "remote",
  },

  // ── Expert & Forensic Psychology ───────────────────────────────────────
  {
    id: "expert-psychological-report",
    number: "07",
    title: "Expert Psychological Report",
    rate: "£800",
    pillar: "expert-forensic",
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
    id: "forensic-psychological-assessment",
    number: "08",
    title: "Forensic Psychological Assessment",
    rate: "Fees on enquiry",
    pillar: "expert-forensic",
    shortDescription:
      "Psychological assessment structured for forensic and legal questions.",
    description:
      "Psychological assessment structured around forensic questions — psychological functioning, risk-relevant factors, and the psychological issues in issue in criminal, family, and civil proceedings — prepared by qualified psychologists with relevant experience.",
    details: [
      "Assessment structured to the specific legal or forensic question.",
      "Evidence-led reasoning with stated limitations.",
      "Prepared for scrutiny by courts and tribunals.",
    ],
    useCases: [
      "Criminal proceedings",
      "Family proceedings",
      "Civil and tribunal matters",
    ],
    href: "/expert-forensic",
    icon: "forensic",
  },
  {
    id: "immigration-asylum-evidence",
    number: "09",
    title: "Immigration & Asylum Psychological Evidence",
    rate: "Fees on enquiry",
    pillar: "expert-forensic",
    shortDescription:
      "Psychological expert evidence for immigration and asylum proceedings.",
    description:
      "Expert psychological evidence prepared for immigration and asylum proceedings — including the impact of trauma, memory, vulnerability, and mental health on how a person's account and circumstances should be understood.",
    details: [
      "Trauma-informed assessment adapted to the individual.",
      "Evidence on memory, vulnerability, and mental health impact where relevant.",
      "Structured for tribunal and Home Office scrutiny.",
    ],
    useCases: [
      "Asylum and humanitarian protection appeals",
      "Immigration appeals and fresh claims",
      "Vulnerability and fitness-to-engage questions",
    ],
    href: "/expert-forensic",
    icon: "evidence",
  },
  {
    id: "mental-health-expert-evidence",
    number: "10",
    title: "Mental Health Expert Evidence",
    rate: "Fees on enquiry",
    pillar: "expert-forensic",
    shortDescription:
      "Expert evidence on mental health where it is relevant to the legal question.",
    description:
      "Expert evidence on a person's mental health where it is directly relevant to the legal question — functional impact, vulnerability, and the psychological issues in issue — prepared to professional and evidential standards.",
    details: [
      "Clinical assessment by a qualified psychologist.",
      "Findings tied to the specific legal question.",
      "Clear about evidence base and limitations.",
    ],
    useCases: [
      "Vulnerability in proceedings",
      "Mental health impact in civil claims",
      "Procedural fairness and fitness-to-engage questions",
    ],
    href: "/expert-forensic",
    icon: "certificate",
  },
  {
    id: "court-legal-expert-evidence",
    number: "11",
    title: "Court & Legal Expert Evidence",
    rate: "Fees on enquiry",
    pillar: "expert-forensic",
    shortDescription:
      "Expert evidence and court-facing support for legal teams.",
    description:
      "Expert psychological evidence prepared for courts, tribunals, and legal teams — including expert consultation on the issues in issue and, where required, court-facing support from qualified experts.",
    details: [
      "Reports structured to the relevant legal test.",
      "Expert consultation with instructing solicitors and counsel.",
      "Secure release and controlled document handling.",
    ],
    useCases: [
      "Court and tribunal proceedings",
      "Expert consultation for legal teams",
      "Civil, family, criminal, and immigration matters",
    ],
    href: "/expert-forensic",
    icon: "expert-consultation",
  },
  {
    id: "expert-consultation",
    number: "12",
    title: "Expert Consultation",
    rate: "Fees on enquiry",
    pillar: "expert-forensic",
    shortDescription:
      "Early expert input on whether, and how, psychological evidence can help a case.",
    description:
      "Focused consultation with a qualified expert to assess whether psychological evidence is warranted, what it can and cannot address, and how to frame the instruction — before committing to a full assessment.",
    details: [
      "Early, honest assessment of evidential value.",
      "Guidance on instruction and documentation.",
      "Useful for scoping complex or uncertain cases.",
    ],
    useCases: [
      "Scoping an instruction",
      "Deciding whether expert evidence is needed",
      "Preparing a letter of instruction",
    ],
    href: "/expert-forensic",
    icon: "consultation",
  },

  // ── Country Expertise ───────────────────────────────────────────────────
  {
    id: "country-expert-mental-health",
    number: "13",
    title: "Country Expert Report: Mental Health Landscape",
    rate: "£600",
    pillar: "country",
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
    number: "14",
    title: "Other Country Expert Reports",
    rate: "£500–£800",
    pillar: "country",
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
];

export const psychologicalServices = services.filter(
  (service) => service.pillar === "psychological"
);

export const forensicServices = services.filter(
  (service) => service.pillar === "expert-forensic"
);

export const countryServices = services.filter(
  (service) => service.pillar === "country"
);

export const practiceAreas = [
  "Immigration",
  "Family Law",
  "Criminal Law",
  "Personal Injury",
  "Employment Tribunal",
  "Clinical Negligence",
] as const;
