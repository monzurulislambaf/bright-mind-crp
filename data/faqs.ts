export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: "services" | "process" | "network" | "contact" | "training" | "forensic" | "country";
};

export const faqs: Faq[] = [
  {
    id: "services",
    question: "What services does Bright Mind provide?",
    answer:
      "We provide expert psychological reports, mental health status certificates, country expert reports, and counselling services for legal professionals and individuals.",
    category: "services",
  },
  {
    id: "who-can-instruct",
    question: "Who can instruct a report?",
    answer:
      "Solicitors, barristers, and other legal professionals can instruct reports directly. Individuals can also request certain services, such as mental health status certificates, directly through our Individual Client Enquiry form.",
    category: "services",
  },
  {
    id: "areas-of-law",
    question: "What areas of law do you cover?",
    answer:
      "Immigration, Family Law, Criminal Law, Personal Injury, Employment Tribunal, and Clinical Negligence, among others.",
    category: "services",
  },
  {
    id: "countries",
    question: "Which countries do you cover for country expert reports?",
    answer:
      "We currently have registered country experts for Afghanistan, Albania, Bangladesh (including Rohingya-specific expertise), Cameroon, Ghana, India (including Rohingya-specific expertise), Myanmar, Nepal, Nigeria, Pakistan, Sri Lanka, the United Kingdom, and Vietnam. For countries outside this list, please contact us to discuss availability.",
    category: "services",
  },
  {
    id: "timescales",
    question: "How long does a report take?",
    answer:
      "Timescales vary depending on the type of report and expert availability. Once we've reviewed your instruction, we'll confirm an estimated timeline.",
    category: "process",
  },
  {
    id: "hcpc",
    question: "Are your psychologists registered?",
    answer:
      "Yes. All psychologists in our network are HCPC-registered and undergo a compliance review before joining our panel.",
    category: "network",
  },
  {
    id: "confidentiality",
    question: "How is confidential information protected?",
    answer:
      "All documents and communications are managed through a secure, permission-based portal. Only authorised parties can access case-specific information.",
    category: "process",
  },
  {
    id: "partner-firm",
    question: "How do I become a partner firm?",
    answer:
      "Submit a Solicitor Partnership Enquiry, and our team will guide you through onboarding.",
    category: "network",
  },
  {
    id: "join-psychologist",
    question: "How do I join the psychologist network?",
    answer:
      "Submit a Join Psychologist Network enquiry with your HCPC registration and relevant experience. Our team will review your application.",
    category: "network",
  },
  {
    id: "contact",
    question: "How do I get in touch?",
    answer:
      "Use our Contact form or Request a Callback, and a member of our team will respond promptly.",
    category: "contact",
  },
  {
    id: "forensic-division",
    question: "What is the expert and forensic division?",
    answer:
      "It is a specialist division within Bright Mind that prepares independent expert psychological evidence for courts, tribunals, and legal teams. It is one part of the organisation — alongside psychological services, country expertise, and training & research.",
    category: "forensic",
  },
  {
    id: "instruct-expert",
    question: "How do I instruct an expert for a court or tribunal matter?",
    answer:
      "Submit an 'Instruct an Expert' enquiry with the legal question, deadlines, and any supporting records already available. Our team will confirm whether expert evidence is warranted, scope the instruction, and match a qualified, conflict-checked expert.",
    category: "forensic",
  },
  {
    id: "forensic-vs-services",
    question: "Is expert evidence the same as psychological services?",
    answer:
      "No. Expert and forensic psychology is a specialist division preparing independent evidence for legal proceedings. Psychological services such as assessment, consultation, and counselling are kept clearly separate from forensic evidence pathways.",
    category: "forensic",
  },
  {
    id: "country-sourcing",
    question: "How is country information sourced and kept current?",
    answer:
      "Country reports are prepared by specialists using sourced, dated and reviewable information, and are reviewed before release. Last-reviewed dates and sources are recorded so the evidence can be tested. Never assume a country report is a substitute for checking current sources with our team.",
    category: "country",
  },
  {
    id: "country-request",
    question: "How do I request country expert evidence for a jurisdiction?",
    answer:
      "Submit a Country Expert Request with the jurisdiction, legal questions, and deadlines. For jurisdictions outside our current list, contact us to discuss availability — we never fabricate country expertise.",
    category: "country",
  },
  {
    id: "training",
    question: "Does Bright Mind provide training and CPD?",
    answer:
      "Yes. We develop workshops, webinars, CPD sessions, and in-house training for psychologists, legal teams, and organisations. Programmes are built with our expert panel and confirmed on request — dates, fees, and CPD points are confirmed when you register interest.",
    category: "training",
  },
  {
    id: "training-register",
    question: "How do I register for training?",
    answer:
      "Use the training registration form on the Training & Research page, or contact us directly. Tell us which programme interests you and your organisation, and our team will confirm availability and fees.",
    category: "training",
  },
  {
    id: "expert-profiles",
    question: "Why are some expert profiles not yet published?",
    answer:
      "We do not publish expert credentials unless they are verified. Individual profiles appear on Our Experts as experts are onboarded and compliance-reviewed; in the meantime you can contact us to confirm the current panel for your matter.",
    category: "network",
  },
];
