export type ExpertProfile = {
  id: string;
  /** Professional role shown as the card heading, e.g. "Consultant Clinical Psychologist". */
  role: string;
  /** Published name. Left undefined until an expert is onboarded. */
  name?: string;
  title?: string;
  qualifications?: string;
  /** Registration body/status. Kept general here; verified internally before publication. */
  registration?: string;
  specialisms: string[];
  countries: string[];
  languages: string[];
  availability?: string;
  bio?: string;
};

/**
 * Public expert directory.
 *
 * Per the project brief, we do not invent expert credentials. Individual
 * profiles are published as experts are onboarded and verified. Until then,
 * the directory presents the roles on our panel with honest, editable
 * placeholders for the personal fields (name, qualifications, bio).
 */
export const experts: ExpertProfile[] = [
  {
    id: "consultant-clinical-psychologist",
    role: "Consultant Clinical Psychologist",
    title: "Independent assessment and expert reporting",
    registration: "HCPC registration verified before panel approval",
    specialisms: [
      "Trauma & PTSD",
      "Psychological formulation",
      "Psychometric assessment",
      "Asylum & immigration assessment",
    ],
    countries: ["United Kingdom", "Remote worldwide"],
    languages: ["English"],
    availability: "Confirmed per instruction",
    bio: "Public profile being finalised. The panel includes qualified clinical psychologists with experience preparing court- and tribunal-facing assessment and reports.",
  },
  {
    id: "forensic-psychologist",
    role: "Forensic Psychologist",
    title: "Forensic assessment and court evidence",
    registration: "Registration verified before panel approval",
    specialisms: [
      "Forensic psychological assessment",
      "Risk-relevant formulation",
      "Criminal and family proceedings",
    ],
    countries: ["United Kingdom", "Remote worldwide"],
    languages: ["English"],
    availability: "Confirmed per instruction",
    bio: "Public profile being finalised. Forensic assessments are structured around the specific legal or forensic question.",
  },
  {
    id: "counsellor-psychotherapist",
    role: "Counsellor / Psychotherapist",
    title: "Remote therapeutic support",
    registration: "Professional registration verified before panel approval",
    specialisms: [
      "Trauma-informed therapy",
      "Modern slavery support",
      "Adjustment and psycho-social difficulties",
    ],
    countries: ["United Kingdom", "Remote worldwide"],
    languages: ["English"],
    availability: "Confirmed per referral",
    bio: "Public profile being finalised. Counselling is delivered remotely by qualified professionals and kept separate from forensic reporting.",
  },
  {
    id: "country-expert",
    role: "Country Expert",
    title: "Mental-health landscape and contextual risk evidence",
    registration: "Expertise and sourcing standards reviewed before panel approval",
    specialisms: [
      "Mental health systems & treatment access",
      "Return-risk and country conditions",
      "Social attitudes and vulnerability",
    ],
    countries: [
      "Afghanistan",
      "Bangladesh",
      "Cameroon",
      "Ghana",
      "India",
      "Myanmar",
      "Nepal",
      "Nigeria",
      "Pakistan",
      "Sri Lanka",
      "Vietnam",
    ],
    languages: ["English", "Country languages as relevant to the jurisdiction"],
    availability: "Confirmed per instruction",
    bio: "Public profile being finalised. Country evidence is sourced, dated and reviewable, and never presented as generic background research.",
  },
  {
    id: "quality-review-case-support",
    role: "Quality Review & Case Support",
    title: "Structured release and professional oversight",
    registration: "Internal operational role",
    specialisms: [
      "Report quality review",
      "Secure document handling",
      "Case coordination",
    ],
    countries: ["United Kingdom"],
    languages: ["English"],
    availability: "Operational",
    bio: "An operational layer ensuring every output is quality-reviewed before secure release.",
  },
];

export const expertSelectionSteps = [
  {
    title: "Application & documentation",
    text: "Psychologists and country experts submit professional details, qualifications, and relevant experience.",
  },
  {
    title: "Compliance review",
    text: "Registration status (e.g. HCPC), qualifications, professional indemnity insurance, and expertise are verified.",
  },
  {
    title: "Panel approval",
    text: "Approved experts are added to the panel and matched to instructions by expertise, country, and availability.",
  },
  {
    title: "Conflict check & assignment",
    text: "Each instruction includes a conflict check before an expert is assigned.",
  },
] as const;
