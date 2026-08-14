export type TrainingProgramme = {
  id: string;
  title: string;
  format: "Workshop" | "Webinar" | "CPD Session" | "In-house Training" | "Professional Development";
  audience: string;
  summary: string;
  objectives: string[];
  duration: string;
  delivery: "Online" | "In person" | "Hybrid" | "Online or in person";
  trainer?: string;
  cpd?: string;
  fee: string;
  date?: string;
  /** Honest availability state — programmes are confirmed against the panel before dates are published. */
  status: "available-on-request" | "planned";
};

export const trainingProgrammes: TrainingProgramme[] = [
  {
    id: "psychological-evidence-in-legal-proceedings",
    title: "Psychological Evidence in Legal Proceedings",
    format: "Webinar",
    audience: "Solicitors, barristers, and legal teams",
    summary:
      "A practical introduction to when and how psychological expert evidence helps a case — including instruction, assessment, and report scrutiny.",
    objectives: [
      "Recognise when psychological evidence may be relevant",
      "Understand what a psychological expert can and cannot address",
      "Prepare effective letters of instruction",
    ],
    duration: "90 minutes (including Q&A)",
    delivery: "Online",
    trainer: "Panel expert (confirmed on booking)",
    cpd: "CPD points where applicable — confirmed on booking",
    fee: "Fees on enquiry",
    status: "available-on-request",
  },
  {
    id: "trauma-informed-practice",
    title: "Trauma-Informed Practice for Professionals",
    format: "Workshop",
    audience: "Psychologists, caseworkers, and client-facing teams",
    summary:
      "Principles of trauma-informed practice applied to assessment, support, and vulnerable-client work.",
    objectives: [
      "Understand the core principles of trauma-informed practice",
      "Apply them to assessment and support settings",
      "Protect professional boundaries and wellbeing",
    ],
    duration: "Half day or full day",
    delivery: "Online or in person",
    trainer: "Panel expert (confirmed on booking)",
    cpd: "CPD points where applicable — confirmed on booking",
    fee: "Fees on enquiry",
    status: "available-on-request",
  },
  {
    id: "country-evidence-and-return-risk",
    title: "Country Evidence & Return Risk: A Practical Guide",
    format: "Webinar",
    audience: "Immigration solicitors and legal teams",
    summary:
      "How country expert evidence is prepared, sourced, and tested — and when it adds real evidential weight.",
    objectives: [
      "Understand how country expert evidence is structured",
      "Know what sourcing and reviewability mean in practice",
      "Decide when to commission a country report",
    ],
    duration: "90 minutes (including Q&A)",
    delivery: "Online",
    trainer: "Country expert (confirmed on booking)",
    cpd: "CPD points where applicable — confirmed on booking",
    fee: "Fees on enquiry",
    status: "available-on-request",
  },
  {
    id: "expert-report-writing",
    title: "Expert Report Writing for Psychologists",
    format: "CPD Session",
    audience: "HCPC-registered psychologists joining the expert panel",
    summary:
      "Structured training on writing court- and tribunal-ready reports that withstand scrutiny.",
    objectives: [
      "Structure reports to the legal question",
      "State findings and limitations clearly",
      "Understand quality review and release standards",
    ],
    duration: "Half day",
    delivery: "Online",
    trainer: "Senior panel expert (confirmed on booking)",
    cpd: "CPD points where applicable — confirmed on booking",
    fee: "Fees on enquiry",
    status: "available-on-request",
  },
  {
    id: "in-house-training",
    title: "In-House Training for Law Firms",
    format: "In-house Training",
    audience: "Individual firms and legal teams",
    summary:
      "Tailored sessions on expert evidence, vulnerable clients, and secure instruction workflows — built around your practice.",
    objectives: [
      "Address your firm's specific practice areas",
      "Cover instruction, evidence, and secure workflows",
      "Include practical case examples",
    ],
    duration: "By arrangement",
    delivery: "Online or in person",
    trainer: "Panel experts matched to your needs",
    cpd: "CPD points where applicable — confirmed on booking",
    fee: "Fees on enquiry",
    status: "available-on-request",
  },
];

export const trainingFormats = [
  {
    title: "Workshops",
    summary:
      "Interactive, practical sessions for psychologists, caseworkers, and client-facing teams.",
  },
  {
    title: "Webinars",
    summary:
      "Accessible online sessions for legal teams and professionals across jurisdictions.",
  },
  {
    title: "CPD & Professional Development",
    summary:
      "Structured professional development with CPD points confirmed per programme.",
  },
  {
    title: "In-House Training",
    summary:
      "Tailored programmes designed around a firm's or organisation's specific needs.",
  },
] as const;
