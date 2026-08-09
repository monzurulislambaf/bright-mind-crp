export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: "services" | "process" | "network" | "contact";
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
];
