export const homeContent = {
  hero: {
    eyebrow: "Qualified professionals · Ethical practice · Secure systems",
    heading: "Psychology Expertise for Individuals, Professionals and Legal Services",
    description:
      "Bright Mind is a psychology organisation providing professional psychological services, expert and forensic psychology, country expertise, and training and research — delivered by qualified professionals under clear ethical and professional standards.",
    supporting:
      "For individuals we offer assessment, consultation, and psychological support pathways. For legal teams we provide independent expert evidence — from psychological reports to country expert analysis — prepared for court and tribunal scrutiny. For psychologists and professionals we offer an expert network, training, and research-informed insight.",
  },
  stats: [
    { value: "15+", label: "country jurisdictions covered" },
    { value: "5", label: "core service lines" },
    { value: "Worldwide", label: "remote instruction and counselling delivery" },
    { value: "UK-led", label: "reporting model shaped for UK legal scrutiny" },
  ],
  whyInstruct: [
    {
      title: "Legal relevance without advocacy",
      text: "Objective clinical and country evidence for legal scrutiny — not case advocacy.",
    },
    {
      title: "Remote delivery built in",
      text: "Secure video assessment, interpreter-friendly workflows, and cross-border delivery.",
    },
    {
      title: "Specialist expertise",
      text: "Registered psychologists and country experts across key jurisdictions and practice areas.",
    },
    {
      title: "Integrated intake and portal",
      text: "Enquiry capture, secure portal access, and case handling as one system.",
    },
  ],
  audiences: [
    {
      title: "Solicitors and barristers",
      text: "Instruction-ready asylum psychological reports, country evidence, and secure digital delivery.",
      href: "/for-solicitors",
      cta: "For Solicitors",
    },
    {
      title: "HCPC-registered psychologists",
      text: "Join our expert panel for secure allocation, review, and collaboration.",
      href: "/for-psychologists",
      cta: "For Psychologists",
    },
    {
      title: "Asylum seekers and private clients",
      text: "Independent assessments and counselling pathways that prioritise dignity and access.",
      href: "/for-individuals",
      cta: "For Individuals",
    },
  ],
} as const;

export const reportingContent = {
  heading:
    "Independent asylum psychological reports and immigration psychological assessments in the UK",
  intro:
    "Evidence-led reporting for vulnerable clients and legally significant questions — structured for UK tribunal, Home Office, and court scrutiny.",
  useCases: [
    "Immigration and asylum matters",
    "Family law proceedings",
    "Criminal law proceedings",
    "Personal injury cases",
    "Employment tribunal matters",
    "Clinical negligence and institutional matters",
  ],
  reasons: [
    {
      title: "Asylum and immigration appeals",
      summary:
        "Where trauma, memory, vulnerability, fear on return, or mental health impact are relevant to how the case should be understood.",
    },
    {
      title: "Fitness to engage and procedural fairness",
      summary:
        "Where psychological symptoms may affect a person’s ability to recall events, engage consistently, or participate safely in proceedings.",
    },
    {
      title: "Country and clinical context together",
      summary:
        "Where the tribunal or legal team needs both an expert psychological view and a professionally reasoned understanding of conditions in the country of return.",
    },
  ],
  workflow: [
    {
      phase: "Instruction and triage",
      summary:
        "Confirm the legal question, deadlines, supporting records, and whether a psychological report, certificate, or country report is the right output.",
    },
    {
      phase: "Assessment and evidence review",
      summary:
        "Carry out clinical interview, psychometrics where appropriate, and a structured review of relevant documents and background materials.",
    },
    {
      phase: "Drafting and quality review",
      summary:
        "Prepare a cautious, evidence-led report that states findings, limitations, and reasoning clearly enough for scrutiny.",
    },
    {
      phase: "Secure release",
      summary:
        "Deliver the final authorised output digitally through controlled portal-based release.",
    },
  ],
  standards: [
    "Independent conclusions rather than advocacy-led wording.",
    "Clinical interview, behavioural observation, and psychometrics where relevant.",
    "Clear reasoning tied back to the actual legal or institutional question.",
    "Secure digital delivery with audited release controls.",
  ],
} as const;

export const countryReportsContent = {
  heading:
    "Country expert reports for asylum proceedings, return-risk questions, and mental-health landscape evidence",
  intro:
    "Professionally prepared country expert analysis for legal teams who need more than generic background research — focused on mental-health systems, return risk, and country conditions.",
  themes: [
    {
      title: "Mental health systems and access to treatment",
      summary:
        "Useful where return risk depends on whether a person can realistically access treatment, medication, specialist care, or safe continuity of support.",
    },
    {
      title: "Social attitudes, stigma, and vulnerability",
      summary:
        "Relevant where a claimant’s mental health, trauma history, minority identity, or social profile could increase exposure to harm on return.",
    },
    {
      title: "Political, social, and human-rights conditions",
      summary:
        "Useful where wider country conditions shape persecution risk, state protection, relocation, or the lived reality behind a claim.",
    },
  ],
  reasons: [
    "Generic internet research rarely carries the same weight as a professionally prepared country expert report.",
    "Tribunals and legal teams often need focused analysis of a claimant’s specific country, region, social group, and return risks.",
    "A tailored country report can complement a psychological report when the case turns on both mental health impact and country conditions.",
  ],
} as const;

export const counsellingContent = {
  heading: "Remote counselling delivered worldwide by qualified professionals",
  intro:
    "Trauma-informed remote counselling for clients navigating displacement, modern slavery, and wider psycho-social needs — kept distinct from forensic reporting pathways.",
  pillars: [
    {
      title: "Trauma-informed care",
      summary:
        "Support for trauma, displacement, modern slavery, and psycho-social strain in a format that is practical for clients living across borders.",
    },
    {
      title: "Worldwide access",
      summary:
        "Remote-first counselling pathways make it possible to support clients internationally while keeping the service operationally lean.",
    },
    {
      title: "Qualified professionals",
      summary:
        "Delivery is designed around certified and professionally accountable clinicians rather than a generic coaching model.",
    },
    {
      title: "Extendable pathway",
      summary:
        "The service can grow into therapist matching, appointment booking, notes permissions, and secure follow-up workflows.",
    },
  ],
  whoHelps: [
    "Asylum seekers and displaced clients navigating uncertainty.",
    "Clients affected by trauma, exploitation, or prolonged stress.",
    "Individuals needing remote access to a qualified professional network.",
    "Referring organisations that want a counselling route alongside reporting.",
  ],
} as const;

export const insightsContent = {
  heading: "Specialist content built for how solicitors and clients search",
  intro:
    "A knowledge layer covering asylum psychological reports, immigration assessments, country expert evidence, remote counselling, and secure legal workflows.",
  cards: [
    {
      title: "When a psychological report may help an asylum case",
      summary:
        "Explains when legal teams seek evidence on trauma, memory, vulnerability, and mental health impact in immigration and asylum proceedings.",
      href: "/reporting",
    },
    {
      title: "How remote immigration psychological assessments work",
      summary:
        "Covers secure video assessment, interpreters, preparation, and what solicitors and clients should expect before instruction.",
      href: "/contact",
    },
    {
      title: "What to include in a letter of instruction",
      summary:
        "Highlights the key information Bright Mind needs to triage a report request efficiently and route it into the right workflow.",
      href: "/for-solicitors",
    },
    {
      title: "When a country expert report is worth commissioning",
      summary:
        "Explains the difference between generic background research and expert country analysis prepared for legal scrutiny.",
      href: "/country-reports",
    },
    {
      title: "Counselling after trauma, displacement, and uncertainty",
      summary:
        "Shows how the counselling pathway can sit alongside reporting without confusing forensic evidence with therapeutic support.",
      href: "/counselling",
    },
    {
      title: "Why secure communication matters in vulnerable-client work",
      summary:
        "Connects website intake, CRM triage, document permissions, and release controls inside the Bright Mind platform.",
      href: "/how-it-works",
    },
  ],
} as const;

export const professionalTracks = [
  {
    title: "Consultant Psychologists",
    credential: "Independent assessment and expert reporting",
    summary:
      "Professionals focused on psychological formulation, psychometrics, behavioural observation, and tribunal-ready written evidence.",
  },
  {
    title: "Counsellors and Psychotherapists",
    credential: "Remote care and ongoing therapeutic support",
    summary:
      "Practitioners delivering counselling for trauma, adjustment strain, and wider psycho-social difficulties.",
  },
  {
    title: "Country Experts",
    credential: "Mental-health landscape and contextual risk evidence",
    summary:
      "Specialists who can explain access to treatment, stigma, social pressures, and country-specific risks relevant to a case.",
  },
  {
    title: "Quality Review and Case Support",
    credential: "Structured release and professional oversight",
    summary:
      "An operational layer for secure case handling, document release, review cycles, and collaboration with instructing parties.",
  },
] as const;

export const aboutContent = {
  heading: "Independent Expertise. Clinical Rigour. Court-Ready Evidence.",
  intro:
    "Bright Mind Psychology Care and Reporting was founded to provide legal professionals with independent, high-quality psychological and country expert evidence they can rely on.",
  body: "We understand that the outcome of a case can depend on the clarity, accuracy, and credibility of expert evidence. That's why every report we produce is grounded in clinical rigour, professional independence, and a clear understanding of the legal test it needs to satisfy.",
  whatWeDo:
    "We provide expert psychological reports, mental health status certificates, country expert reports, and counselling services to solicitors, barristers, and legal professionals across Immigration, Family Law, Criminal Law, Personal Injury, Employment Tribunal, and Clinical Negligence matters.",
  network:
    "Our network includes HCPC-registered psychologists, medical professionals, and country experts covering mental health systems and human rights conditions across a wide range of countries.",
  approach: [
    {
      title: "Independence First",
      text: "Our experts provide objective, evidence-based opinions, free from advocacy.",
    },
    {
      title: "Clinically Grounded",
      text: "Every assessment follows recognised clinical and professional standards.",
    },
    {
      title: "Legally Informed",
      text: "Reports are structured to directly address the legal test relevant to your case.",
    },
    {
      title: "Confidential & Secure",
      text: "Sensitive clinical information is handled with the highest standards of data protection.",
    },
  ],
  team: "Bright Mind works with a growing panel of HCPC-registered psychologists, medical professionals, and country experts, each vetted for their qualifications, registration status, and relevant subject-matter expertise.",
} as const;

export const solicitorContent = {
  heading: "Expert Evidence You Can Rely On",
  intro:
    "Bright Mind supports solicitors and legal teams with independent, court-compliant psychological and country expert reports — prepared to meet the evidentiary standards your case requires.",
  support: [
    {
      title: "Expert Psychological Reports",
      text: "Across Immigration, Family Law, Criminal Law, Personal Injury, Employment Tribunal, and Clinical Negligence matters.",
    },
    {
      title: "Mental Health Status Certificates",
      text: "For Litigation Friend matters, PIP, housing, education, and other institutional purposes.",
    },
    {
      title: "Country Expert Reports",
      text: "Covering mental health systems and broader political, social, and human rights conditions.",
    },
    {
      title: "Secure Case Portal",
      text: "Instruct, track, and manage reports from instruction to release.",
    },
  ],
  process: [
    {
      title: "Instruct",
      text: "Submit your instruction and supporting documents securely through our portal or by contacting our team.",
    },
    {
      title: "Allocation",
      text: "We match your case with an appropriately qualified, conflict-checked expert.",
    },
    {
      title: "Assessment",
      text: "The expert conducts the assessment and prepares the report.",
    },
    {
      title: "Quality Review",
      text: "Every report undergoes internal quality review before release.",
    },
    {
      title: "Secure Release",
      text: "The final report is released to you securely, with a full access record.",
    },
  ],
  why: [
    "Independent psychological reports for asylum, immigration, family, personal injury, and related proceedings",
    "Clear explanation of mental health presentation, trauma impact, vulnerability, and functional consequences where relevant",
    "Remote assessment model that works with interpreters, client safeguarding considerations, and urgent legal deadlines",
    "Secure digital communication, document exchange, and release pathway through the Bright Mind portal",
  ],
  instructionChecklist: [
    "Letter of instruction and the legal questions the report must address.",
    "Hearing date, tribunal deadline, or other case-critical timeframe.",
    "Relevant records already available, including witness statements, refusal letters, medical notes, or previous reports.",
    "Interpreter needs, safeguarding considerations, and whether the client can be assessed remotely.",
  ],
} as const;

export const psychologistContent = {
  heading: "Join Our Expert Network",
  intro:
    "Bright Mind works with HCPC-registered psychologists to deliver independent, court-compliant psychological reports for legal proceedings across the UK.",
  why: [
    {
      title: "Flexible Case Work",
      text: "Accept or decline case offers based on your availability and expertise.",
    },
    {
      title: "Secure Case Portal",
      text: "Access assigned cases, documents, and communications in one place.",
    },
    {
      title: "Administrative Support",
      text: "We manage instructions, scheduling, and case logistics so you can focus on assessment and reporting.",
    },
    {
      title: "Fair, Transparent Process",
      text: "Clear expectations, quality review support, and visible payment status.",
    },
  ],
  process: [
    {
      title: "Register",
      text: "Submit your profile, HCPC registration, qualifications, CV, and insurance details.",
    },
    {
      title: "Compliance Review",
      text: "Our team reviews your registration and compliance documents.",
    },
    {
      title: "Approval",
      text: "Once approved, you're added to our expert panel and given portal access.",
    },
    {
      title: "Case Offers",
      text: "Review case offers, complete a conflict check, and accept assignments that match your expertise and availability.",
    },
    {
      title: "Report Preparation",
      text: "Conduct the assessment, prepare your report, and upload it securely through the portal.",
    },
    {
      title: "Quality Review",
      text: "Respond to any quality review feedback before the report is finalised.",
    },
  ],
  lookFor: [
    "Current HCPC registration",
    "Relevant clinical experience and areas of expertise",
    "Professional indemnity insurance",
    "Availability for assessments and report writing",
  ],
} as const;

export const individualContent = {
  heading: "Support When You Need It Most",
  intro:
    "Bright Mind provides psychological assessments, mental health status certificates, and counselling services directly to individuals — whether you need evidence for a legal matter or support for your wellbeing.",
  help: [
    {
      title: "Mental Health Status Certificates",
      text: "For Litigation Friend matters, PIP applications, housing, education, or other institutional needs.",
    },
    {
      title: "Psychological Assessments",
      text: "Independent assessments that may be required as part of a legal case.",
    },
    {
      title: "Counselling Services",
      text: "Professional support for trauma, modern slavery-related harm, and other psycho-social difficulties, delivered by qualified mental health professionals.",
    },
  ],
  process: [
    {
      title: "Enquiry",
      text: "Tell us what you need and a bit about your situation.",
    },
    {
      title: "Suitability Review",
      text: "Our team reviews your enquiry to confirm the right service for you.",
    },
    {
      title: "Assessment or Session",
      text: "You'll be booked in with a qualified professional.",
    },
    {
      title: "Secure Documents",
      text: "Any reports, certificates, or correspondence are shared with you securely through your personal portal.",
    },
  ],
  privacy:
    "All assessments and counselling sessions are handled confidentially, in line with UK data protection standards. You will only ever see documents that have been specifically released to you.",
} as const;

export const howItWorksContent = {
  heading: "A Clear, Secure Process From Instruction to Report",
  intro:
    "Whether you're a solicitor instructing a report, a psychologist joining our network, or an individual seeking support, Bright Mind keeps the process simple and transparent.",
  solicitors: solicitorContent.process,
  individuals: individualContent.process,
  psychologists: [
    {
      title: "Register",
      text: "Submit your profile and compliance documents.",
    },
    {
      title: "Approval",
      text: "Our team reviews and approves your registration.",
    },
    {
      title: "Case Offers",
      text: "Review and accept assignments matching your expertise.",
    },
    {
      title: "Report Delivery",
      text: "Complete your assessment and upload your report securely.",
    },
  ],
  secure:
    "All documents, communications, and reports are managed through a secure, permission-based portal — so only authorised parties ever see sensitive information.",
} as const;

export const servicesIntro =
  "Bright Mind provides professional psychological services for individuals and organisations — assessment, consultation, and psychological support delivered by qualified professionals. Where a matter involves legal proceedings, our specialist expert and forensic division prepares independent psychological evidence, and our country expertise service provides sourced, dated and reviewable country analysis.";

export const corePillars = [
  {
    id: "psychological-services",
    title: "Psychological Services",
    summary:
      "Assessment, consultation, and psychological support delivered by qualified professionals, with clear pathways for individuals and referring professionals.",
    href: "/services",
    cta: "Enquire / Book Psychological Services",
  },
  {
    id: "expert-forensic",
    title: "Expert & Forensic Psychology",
    summary:
      "A specialist division preparing independent expert psychological evidence for courts, tribunals, and legal teams — clearly separate from our broader service identity.",
    href: "/expert-forensic",
    cta: "Instruct an Expert",
  },
  {
    id: "country-expertise",
    title: "Country Expertise",
    summary:
      "Sourced, dated and reviewable country analysis — mental-health systems, treatment access, and conditions relevant to return risk and asylum proceedings.",
    href: "/country-reports",
    cta: "Request Country Expert Evidence",
  },
  {
    id: "training-research",
    title: "Training & Research",
    summary:
      "Professional development, workshops, webinars, and research-informed insight for psychologists, legal teams, and the wider community.",
    href: "/training-research",
    cta: "Explore Training & Research",
  },
] as const;

export const expertForensicContent = {
  heading:
    "A specialist division for independent expert psychological evidence",
  intro:
    "Bright Mind's expert and forensic division prepares independent psychological evidence for courts, tribunals, and legal teams. It operates as a specialist division within the organisation — not as the whole of what Bright Mind does.",
  whatWeProvide: [
    "Expert psychological reports for civil, criminal, family, and immigration proceedings",
    "Forensic psychological assessment structured to the legal question",
    "Immigration and asylum psychological evidence, including trauma and vulnerability",
    "Mental health expert evidence where relevant to the issues in issue",
    "Court and legal expert evidence with expert consultation for instructing teams",
  ],
  process: [
    {
      title: "Instruction & triage",
      text: "Confirm the legal question, deadline, and supporting records — and whether expert evidence is genuinely needed.",
    },
    {
      title: "Expert allocation",
      text: "Match the matter to a qualified, conflict-checked expert with relevant expertise.",
    },
    {
      title: "Assessment",
      text: "Clinical interview, behavioural observation, psychometrics where appropriate, and structured document review.",
    },
    {
      title: "Drafting & quality review",
      text: "Evidence-led report drafting with internal quality review before release.",
    },
    {
      title: "Secure release",
      text: "Final authorised output delivered securely, with audited release controls.",
    },
  ],
  standards: [
    "Independent conclusions, not advocacy-led wording.",
    "Evidence and limitations stated clearly enough for scrutiny.",
    "Sensitive information handled to high data-protection standards.",
    "Never released outside the instruction and consent framework.",
  ],
} as const;

export const trainingContent = {
  heading: "Training, workshops, and research-informed professional development",
  intro:
    "Bright Mind develops professional training and research-informed insight for psychologists, legal teams, and organisations working with vulnerable people. Programmes are built with our expert panel and confirmed on request.",
  formats: [
    {
      title: "Workshops",
      summary: "Interactive, practical sessions for professionals.",
    },
    {
      title: "Webinars",
      summary: "Accessible online sessions for teams across jurisdictions.",
    },
    {
      title: "CPD & Professional Development",
      summary: "Structured development with CPD confirmed per programme.",
    },
    {
      title: "In-House Training",
      summary: "Tailored programmes designed around an organisation's needs.",
    },
  ],
  research:
    "Research-informed insight — including our Insights hub — shares professional knowledge on psychological evidence, country expertise, and secure legal workflows. We do not publish unsupported clinical or medical claims.",
} as const;

export const ourExpertsContent = {
  heading: "A vetted panel of qualified professionals",
  intro:
    "Bright Mind works with qualified psychologists, counsellors, and country experts, each reviewed for registration, qualifications, and relevant expertise before joining the panel. Public profiles are published as experts are onboarded — nothing is invented.",
  note: "Public profiles show professional information only. Registration status, compliance documents, and verification details are held internally and are not published.",
} as const;
