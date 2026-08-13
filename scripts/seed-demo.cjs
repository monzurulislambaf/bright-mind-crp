/**
 * Demo data seeder for Bright Mind.
 *
 * Populates every collection with realistic, clearly-labelled demo records so
 * every portal and CRM feature has data to render. Every inserted record is
 * tagged `demo: true` — re-running this script deletes the previous demo set
 * first, so it is safe and idempotent. Real records are never touched.
 *
 * Usage:
 *   node scripts/seed-demo.cjs
 *
 * Demo logins (password for all: DemoPass123!):
 *   system.admin@demo.brightmind.local      SYSTEM_ADMIN
 *   operations@demo.brightmind.local        OPERATIONS
 *   caseworker@demo.brightmind.local        CASEWORKER
 *   quality.review@demo.brightmind.local    QUALITY_REVIEW
 *   finance@demo.brightmind.local           FINANCE
 *   marketing@demo.brightmind.local         MARKETING
 *   sales.manager@demo.brightmind.local     SALES_MANAGER
 *   sales.agent@demo.brightmind.local       SALES_AGENT
 *   firm.admin@demo.brightmind.local        SOLICITOR_FIRM_ADMIN (Hale & Carter)
 *   solicitor@demo.brightmind.local         SOLICITOR (Hale & Carter)
 *   psychologist@demo.brightmind.local      PSYCHOLOGIST (Dr Amara Okafor)
 *   psychologist2@demo.brightmind.local     PSYCHOLOGIST (Dr James Whitmore)
 *   client@demo.brightmind.local            INDIVIDUAL_CLIENT (Sofia Novak)
 */
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

const DEMO_PASSWORD = "DemoPass123!";
const now = new Date();
const daysAgo = (n) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);
const daysAhead = (n) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);

const DEMO_COLLECTIONS = [
  "users",
  "organisations",
  "solicitors",
  "psychologists",
  "individualclients",
  "leads",
  "qualifiedleads",
  "contacts",
  "campaigns",
  "cases",
  "caseassignments",
  "caseparticipants",
  "reports",
  "reportreviews",
  "documents",
  "documentpermissions",
  "tasks",
  "tickets",
  "appointments",
  "quotations",
  "invoices",
  "payments",
  "notifications",
  "activities",
  "onboardings",
  "formsubmissions",
  "auditlogs",
  "roles",
];

let db;

async function main() {
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  db = mongoose.connection.db;

  // ---------------------------------------------------------------------
  // 0. Clean previous demo set (idempotent re-runs)
  // ---------------------------------------------------------------------
  let cleaned = 0;
  for (const coll of DEMO_COLLECTIONS) {
    try {
      const r = await db.collection(coll).deleteMany({ demo: true });
      cleaned += r.deletedCount;
    } catch (e) {
      console.warn(`  ! could not clean ${coll}: ${e.message}`);
    }
  }
  console.log(`Cleaned ${cleaned} previous demo record(s).`);

  const insert = (coll, docs) =>
    docs.length ? db.collection(coll).insertMany(docs) : Promise.resolve();

  // ---------------------------------------------------------------------
  // 1. Users (one per role)
  // ---------------------------------------------------------------------
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const mkUserByEmail = (userId, firstName, lastName, role, userType, email, status = "active") => ({
    userId,
    firstName,
    lastName,
    email,
    phone: "+44 20 7946 0" + (100 + parseInt(userId.slice(-3), 10) % 100),
    passwordHash,
    role,
    userType,
    roleIds: [],
    mfaEnabled: false,
    status,
    demo: true,
    createdAt: daysAgo(45),
    updatedAt: daysAgo(2),
  });

  const users = [
    mkUserByEmail("BM-USR-001001", "System", "Admin", "SYSTEM_ADMIN", "EMPLOYEE", "system.admin@demo.brightmind.local"),
    mkUserByEmail("BM-USR-001002", "Olivia", "Bennett", "OPERATIONS", "EMPLOYEE", "operations@demo.brightmind.local"),
    mkUserByEmail("BM-USR-001003", "Daniel", "Okoye", "CASEWORKER", "EMPLOYEE", "caseworker@demo.brightmind.local"),
    mkUserByEmail("BM-USR-001004", "Grace", "Lin", "QUALITY_REVIEW", "EMPLOYEE", "quality.review@demo.brightmind.local"),
    mkUserByEmail("BM-USR-001005", "Peter", "Ashford", "FINANCE", "EMPLOYEE", "finance@demo.brightmind.local"),
    mkUserByEmail("BM-USR-001006", "Maya", "Rahman", "MARKETING", "EMPLOYEE", "marketing@demo.brightmind.local"),
    mkUserByEmail("BM-USR-001007", "Tom", "Harding", "SALES_MANAGER", "EMPLOYEE", "sales.manager@demo.brightmind.local"),
    mkUserByEmail("BM-USR-001008", "Lucy", "Foster", "SALES_AGENT", "EMPLOYEE", "sales.agent@demo.brightmind.local"),
    mkUserByEmail("BM-USR-001009", "Sarah", "Hale", "SOLICITOR_FIRM_ADMIN", "PARTNER", "firm.admin@demo.brightmind.local"),
    mkUserByEmail("BM-USR-001010", "Jonathan", "Carter", "SOLICITOR", "PARTNER", "solicitor@demo.brightmind.local"),
    mkUserByEmail("BM-USR-001011", "Amara", "Okafor", "PSYCHOLOGIST", "PSYCHOLOGIST", "psychologist@demo.brightmind.local"),
    mkUserByEmail("BM-USR-001012", "James", "Whitmore", "PSYCHOLOGIST", "PSYCHOLOGIST", "psychologist2@demo.brightmind.local"),
    mkUserByEmail("BM-USR-001013", "Sofia", "Novak", "INDIVIDUAL_CLIENT", "CLIENT", "client@demo.brightmind.local"),
    mkUserByEmail("BM-USR-001014", "Rahim", "Ahmed", "INDIVIDUAL_CLIENT", "CLIENT", "client2@demo.brightmind.local"),
  ];
  const userRes = await insert("users", users);
  const userIds = {};
  users.forEach((u, i) => {
    userIds[u.role] = userRes.insertedIds[i];
  });
  console.log(`Inserted ${users.length} demo users.`);

  // ---------------------------------------------------------------------
  // 2. Organisations / solicitors / psychologists / clients
  // ---------------------------------------------------------------------
  const organisations = [
    {
      orgId: "BM-ORG-001001", organisationId: "BM-ORG-001001",
      name: "Hale & Carter Solicitors", type: "SOLICITOR_FIRM",
      registrationNumber: "SRA-654321", website: "https://halecarter.example.com",
      email: "partners@halecarter.example.com", telephone: "+44 20 7946 0880",
      address: { line1: "1 Chancery Lane", city: "London", postcode: "WC2A 1LF", country: "UK" },
      billing: { billingEmail: "accounts@halecarter.example.com" },
      status: "approved", approvedAt: daysAgo(40), demo: true,
      createdAt: daysAgo(42), updatedAt: daysAgo(3),
    },
    {
      orgId: "BM-ORG-001002", organisationId: "BM-ORG-001002",
      name: "Reedham Legal", type: "SOLICITOR_FIRM",
      registrationNumber: "SRA-789012", website: "https://reedhamlegal.example.com",
      email: "contact@reedhamlegal.example.com", telephone: "+44 161 496 0330",
      address: { line1: "12 King Street", city: "Manchester", postcode: "M2 6AW", country: "UK" },
      status: "approved", approvedAt: daysAgo(30), demo: true,
      createdAt: daysAgo(32), updatedAt: daysAgo(5),
    },
    {
      orgId: "BM-ORG-001003", organisationId: "BM-ORG-001003",
      name: "Kingsway Immigration Law", type: "SOLICITOR_FIRM",
      registrationNumber: "SRA-902345", website: "https://kingswayimmigration.example.com",
      email: "info@kingswayimmigration.example.com", telephone: "+44 20 7946 0111",
      status: "pending", demo: true,
      createdAt: daysAgo(6), updatedAt: daysAgo(1),
    },
  ];
  const orgRes = await insert("organisations", organisations);
  const orgIds = {};
  organisations.forEach((o, i) => {
    orgIds[o.orgId] = orgRes.insertedIds[i];
  });
  console.log(`Inserted ${organisations.length} demo organisations.`);

  const solicitors = [
    { solicitorId: "BM-SOL-001001", userId: userIds.SOLICITOR_FIRM_ADMIN, organisation: orgIds["BM-ORG-001001"], contactName: "Sarah Hale", email: "s.hale@halecarter.example.com", phone: "+44 20 7946 0881", status: "approved", approvedAt: daysAgo(40), demo: true, createdAt: daysAgo(40), updatedAt: daysAgo(3) },
    { solicitorId: "BM-SOL-001002", userId: userIds.SOLICITOR, organisation: orgIds["BM-ORG-001001"], contactName: "Jonathan Carter", email: "j.carter@halecarter.example.com", phone: "+44 20 7946 0882", status: "approved", approvedAt: daysAgo(40), demo: true, createdAt: daysAgo(40), updatedAt: daysAgo(3) },
    { solicitorId: "BM-SOL-001003", organisation: orgIds["BM-ORG-001002"], contactName: "Michael Reed", email: "m.reed@reedhamlegal.example.com", phone: "+44 161 496 0331", status: "approved", approvedAt: daysAgo(30), demo: true, createdAt: daysAgo(30), updatedAt: daysAgo(5) },
    { solicitorId: "BM-SOL-001004", organisation: orgIds["BM-ORG-001003"], contactName: "Priya Shah", email: "p.shah@kingswayimmigration.example.com", phone: "+44 20 7946 0112", status: "pending", demo: true, createdAt: daysAgo(6), updatedAt: daysAgo(1) },
  ];
  const solRes = await insert("solicitors", solicitors);
  const solicitorIds = {};
  solicitors.forEach((s, i) => {
    solicitorIds[s.solicitorId] = solRes.insertedIds[i];
  });
  console.log(`Inserted ${solicitors.length} demo solicitors.`);

  const psychologists = [
    {
      psychologistId: "BM-PSY-001001", userId: userIds.PSYCHOLOGIST,
      firstName: "Amara", lastName: "Okafor", email: "psychologist@demo.brightmind.local",
      phone: "+44 7700 900111", hcpcNumber: "PYL37892",
      qualifications: ["DClinPsy (University of Manchester)", "Chartered Psychologist (BPS)"],
      insuranceDetails: "Hiscox PI cover £2m, expiry 2027-01-01",
      expertise: ["Trauma", "Asylum psychology", "PTSD", "Psychometric assessment"],
      jurisdictions: ["Nigeria", "United Kingdom"], availability: "Weekdays + some Saturdays",
      status: "Approved", approvedAt: daysAgo(35), demo: true,
      createdAt: daysAgo(50), updatedAt: daysAgo(2),
    },
    {
      psychologistId: "BM-PSY-001002", userId: userIds.PSYCHOLOGIST2,
      firstName: "James", lastName: "Whitmore", email: "psychologist2@demo.brightmind.local",
      phone: "+44 7700 900222", hcpcNumber: "PYL29110",
      qualifications: ["ClinPsyD (University of Oxford)", "BABCP Accredited CBT Therapist"],
      insuranceDetails: "Zurich PI cover £2m, expiry 2026-09-30",
      expertise: ["Family law psychology", "Parental alienation", "Fitness to plead", "PTSD"],
      jurisdictions: ["United Kingdom", "Sri Lanka"], availability: "Weekdays",
      status: "Approved", approvedAt: daysAgo(28), demo: true,
      createdAt: daysAgo(45), updatedAt: daysAgo(4),
    },
    {
      psychologistId: "BM-PSY-001003",
      firstName: "Priya", lastName: "Nair", email: "priya.nair@example.com",
      phone: "+44 7700 900333", hcpcNumber: "PYL17654",
      qualifications: ["MSc Clinical Psychology"],
      expertise: ["Counselling", "Trauma-informed care"],
      jurisdictions: ["India"], availability: "Evenings",
      status: "More Information Required", demo: true,
      createdAt: daysAgo(12), updatedAt: daysAgo(2),
    },
    {
      psychologistId: "BM-PSY-001004",
      firstName: "Tom", lastName: "Becker", email: "tom.becker@example.com",
      phone: "+44 7700 900444", hcpcNumber: "PYL56231",
      qualifications: ["Doctorate in Counselling Psychology"],
      expertise: ["Counselling", "Modern slavery support"],
      jurisdictions: ["Vietnam", "Myanmar"], availability: "Weekends",
      status: "Pending", demo: true,
      createdAt: daysAgo(3), updatedAt: daysAgo(3),
    },
  ];
  const psyRes = await insert("psychologists", psychologists);
  const psychIds = {};
  psychologists.forEach((p, i) => {
    psychIds[p.psychologistId] = psyRes.insertedIds[i];
  });
  console.log(`Inserted ${psychologists.length} demo psychologists.`);

  const clients = [
    { clientId: "BM-CLI-001001", userId: userIds.INDIVIDUAL_CLIENT, firstName: "Sofia", lastName: "Novak", email: "client@demo.brightmind.local", phone: "+44 7400 100111", dateOfBirth: daysAgo(9000), consent: true, consentAt: daysAgo(20), status: "active", demo: true, createdAt: daysAgo(20), updatedAt: daysAgo(2) },
    { clientId: "BM-CLI-001002", userId: userIds.INDIVIDUAL_CLIENT2, firstName: "Rahim", lastName: "Ahmed", email: "client2@demo.brightmind.local", phone: "+44 7400 100222", dateOfBirth: daysAgo(11000), consent: true, consentAt: daysAgo(14), status: "active", demo: true, createdAt: daysAgo(14), updatedAt: daysAgo(3) },
    { clientId: "BM-CLI-001003", firstName: "Fatima", lastName: "Hussain", email: "fatima.hussain@example.com", phone: "+44 7400 100333", consent: true, consentAt: daysAgo(10), status: "onboarding", demo: true, createdAt: daysAgo(10), updatedAt: daysAgo(1) },
  ];
  const clientRes = await insert("individualclients", clients);
  const clientIds = {};
  clients.forEach((c, i) => {
    clientIds[c.clientId] = clientRes.insertedIds[i];
  });
  console.log(`Inserted ${clients.length} demo individual clients.`);

  // ---------------------------------------------------------------------
  // 3. Campaigns
  // ---------------------------------------------------------------------
  const campaigns = [
    { campaignId: "BM-CMP-001001", name: "Website — Organic", channel: "WEBSITE", source: "organic", status: "ACTIVE", startAt: daysAgo(90), budget: 1500, notes: "SEO and direct traffic", demo: true, createdAt: daysAgo(90), updatedAt: daysAgo(7) },
    { campaignId: "BM-CMP-001002", name: "Legal 500 Directory", channel: "DIRECTORY", source: "legal500", status: "ACTIVE", startAt: daysAgo(60), endAt: daysAhead(300), budget: 2400, notes: "Solicitor firm listings", demo: true, createdAt: daysAgo(60), updatedAt: daysAgo(5) },
    { campaignId: "BM-CMP-001003", name: "Referral partners", channel: "REFERRAL", source: "referral", status: "COMPLETED", startAt: daysAgo(120), endAt: daysAgo(15), budget: 0, notes: "Barrister chambers referrals", demo: true, createdAt: daysAgo(120), updatedAt: daysAgo(15) },
  ];
  const campaignRes = await insert("campaigns", campaigns);
  const campaignIds = {};
  campaigns.forEach((c, i) => {
    campaignIds[c.campaignId] = campaignRes.insertedIds[i];
  });
  console.log(`Inserted ${campaigns.length} demo campaigns.`);

  // ---------------------------------------------------------------------
  // 4. Leads (across the whole funnel) + contacts + activities
  // ---------------------------------------------------------------------
  const leads = [
    { leadId: "BM-LEAD-001001", leadType: "SOLICITOR", source: "WEBSITE", campaign: "Website — Organic", campaignId: campaignIds["BM-CMP-001001"], landingPage: "/request-a-report", firstName: "Amelia", lastName: "Ward", email: "a.ward@wardandco.example.com", phone: "+44 20 7946 0111", company: "Ward & Co", role: "Partner", status: "New", priority: "HIGH", qualifier: "request_report", serviceInterest: "Expert Psychological Report", notes: "Asylum appeal — psychological report required urgently.", consent: true, demo: true, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
    { leadId: "BM-LEAD-001002", leadType: "INDIVIDUAL", source: "WEBSITE", campaign: "Website — Organic", campaignId: campaignIds["BM-CMP-001001"], landingPage: "/contact", firstName: "Hana", lastName: "Yilmaz", email: "hana.yilmaz@example.com", phone: "+44 7400 200111", company: "", status: "New", priority: "MEDIUM", qualifier: "individual", notes: "Enquiry about mental health status certificate.", consent: true, demo: true, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
    { leadId: "BM-LEAD-001003", leadType: "SOLICITOR", source: "DIRECTORY", campaign: "Legal 500 Directory", campaignId: campaignIds["BM-CMP-001002"], landingPage: "/solicitor-partnership", firstName: "Daniel", lastName: "Brooks", email: "d.brooks@brooksllp.example.com", phone: "+44 20 7946 0222", company: "Brooks LLP", role: "Managing Partner", status: "Assigned", priority: "HIGH", qualifier: "solicitor_partner", notes: "Firm partnership enquiry for immigration practice.", consent: true, demo: true, createdAt: daysAgo(6), updatedAt: daysAgo(3) },
    { leadId: "BM-LEAD-001004", leadType: "PSYCHOLOGIST", source: "WEBSITE", campaign: "Website — Organic", campaignId: campaignIds["BM-CMP-001001"], landingPage: "/join-psychologist-network", firstName: "Nadia", lastName: "Hassan", email: "nadia.hassan@example.com", phone: "+44 7700 900555", company: "", role: "Clinical Psychologist", status: "Assigned", priority: "MEDIUM", qualifier: "psychologist", hcpcRegistration: "PYL88213", notes: "Join network — trauma and asylum expertise.", consent: true, demo: true, createdAt: daysAgo(5), updatedAt: daysAgo(2) },
    { leadId: "BM-LEAD-001005", leadType: "SOLICITOR", source: "REFERRAL", campaign: "Referral partners", campaignId: campaignIds["BM-CMP-001003"], landingPage: "/request-a-report", firstName: "Robert", lastName: "Ellis", email: "r.ellis@ellislaw.example.com", phone: "+44 161 496 0444", company: "Ellis Law", role: "Solicitor", status: "Contact Attempted", priority: "MEDIUM", qualifier: "request_report", serviceInterest: "Country Expert Report: Mental Health Landscape", notes: "Country report for Bangladesh (Rohingya) client.", consent: true, demo: true, createdAt: daysAgo(10), updatedAt: daysAgo(4) },
    { leadId: "BM-LEAD-001006", leadType: "SOLICITOR", source: "DIRECTORY", campaign: "Legal 500 Directory", campaignId: campaignIds["BM-CMP-001002"], landingPage: "/for-solicitors", firstName: "Claire", lastName: "Donnelly", email: "c.donnelly@donnellylaw.example.com", phone: "+44 20 7946 0333", company: "Donnelly Law", role: "Partner", status: "Contact Established", priority: "HIGH", qualifier: "solicitor_partner", notes: "Interested in country expert reports for asylum.", consent: true, demo: true, createdAt: daysAgo(14), updatedAt: daysAgo(6) },
    { leadId: "BM-LEAD-001007", leadType: "SOLICITOR", source: "REFERRAL", campaign: "Referral partners", campaignId: campaignIds["BM-CMP-001003"], landingPage: "/request-a-report", firstName: "Henry", lastName: "Palmer", email: "h.palmer@palmerchambers.example.com", phone: "+44 20 7946 0555", company: "Palmer Chambers", role: "Barrister", status: "Needs Identified", priority: "MEDIUM", qualifier: "request_report", serviceInterest: "Expert Psychological Report", notes: "Family proceedings — psychological assessment.", consent: true, demo: true, createdAt: daysAgo(18), updatedAt: daysAgo(8) },
    { leadId: "BM-LEAD-001008", leadType: "SOLICITOR", source: "WEBSITE", campaign: "Website — Organic", campaignId: campaignIds["BM-CMP-001001"], landingPage: "/request-a-report", firstName: "Grace", lastName: "Osei", email: "g.osei@oseilaw.example.com", phone: "+44 20 7946 0666", company: "Osei Law", role: "Solicitor", status: "Qualified", priority: "HIGH", qualifier: "request_report", serviceInterest: "Country Expert Report: Mental Health Landscape", notes: "Ghana return-risk country report.", consent: true, demo: true, createdAt: daysAgo(22), updatedAt: daysAgo(3) },
    { leadId: "BM-LEAD-001009", leadType: "INDIVIDUAL", source: "WEBSITE", campaign: "Website — Organic", campaignId: campaignIds["BM-CMP-001001"], landingPage: "/request-callback", firstName: "Omar", lastName: "Khalil", email: "omar.khalil@example.com", phone: "+44 7400 300111", company: "", status: "Consultation", priority: "MEDIUM", qualifier: "callback", notes: "Callback requested — counselling pathway.", consent: true, demo: true, createdAt: daysAgo(25), updatedAt: daysAgo(5) },
    { leadId: "BM-LEAD-001010", leadType: "SOLICITOR", source: "REFERRAL", campaign: "Referral partners", campaignId: campaignIds["BM-CMP-001003"], landingPage: "/request-a-report", firstName: "Liam", lastName: "O'Connor", email: "l.oconnor@oconnorlaw.example.com", phone: "+44 20 7946 0777", company: "O'Connor Law", role: "Solicitor", status: "Proposal Sent", priority: "HIGH", qualifier: "request_report", serviceInterest: "Expert Psychological Report", notes: "Proposal sent for full psychological report package.", consent: true, demo: true, createdAt: daysAgo(30), updatedAt: daysAgo(4) },
    { leadId: "BM-LEAD-001011", leadType: "SOLICITOR", source: "WEBSITE", campaign: "Website — Organic", campaignId: campaignIds["BM-CMP-001001"], landingPage: "/solicitor-partnership", firstName: "Emma", lastName: "Stone", email: "e.stone@stonepartners.example.com", phone: "+44 20 7946 0888", company: "Stone Partners", role: "Partner", status: "Onboarding", priority: "HIGH", qualifier: "solicitor_partner", notes: "Partnership agreed — onboarding in progress.", consent: true, demo: true, createdAt: daysAgo(35), updatedAt: daysAgo(2) },
    { leadId: "BM-LEAD-001012", leadType: "SOLICITOR", source: "DIRECTORY", campaign: "Legal 500 Directory", campaignId: campaignIds["BM-CMP-001002"], landingPage: "/request-a-report", firstName: "Nathan", lastName: "Cruz", email: "n.cruz@cruzlaw.example.com", phone: "+44 20 7946 0999", company: "Cruz Law", role: "Solicitor", status: "Converted", priority: "MEDIUM", qualifier: "request_report", serviceInterest: "Mental Health Status Certificate", notes: "Converted — first instruction received.", consent: true, demo: true, createdAt: daysAgo(40), updatedAt: daysAgo(10) },
    { leadId: "BM-LEAD-001013", leadType: "SOLICITOR", source: "DIRECTORY", campaign: "Legal 500 Directory", campaignId: campaignIds["BM-CMP-001002"], landingPage: "/request-a-report", firstName: "Isabella", lastName: "Moreau", email: "i.moreau@moreaulaw.example.com", phone: "+44 20 7946 0101", company: "Moreau Law", role: "Partner", status: "Lost", priority: "LOW", qualifier: "request_report", notes: "Chose another provider.", lostReason: "Instructed a different expert provider.", consent: true, demo: true, createdAt: daysAgo(50), updatedAt: daysAgo(12) },
    { leadId: "BM-LEAD-001014", leadType: "SOLICITOR", source: "REFERRAL", campaign: "Referral partners", campaignId: campaignIds["BM-CMP-001003"], landingPage: "/for-solicitors", firstName: "Victor", lastName: "Lange", email: "v.lange@langelaw.example.com", phone: "+44 20 7946 0123", company: "Lange Law", role: "Solicitor", status: "Future Opportunity", priority: "LOW", qualifier: "solicitor_partner", notes: "Not ready yet — follow up in Q4.", consent: true, demo: true, createdAt: daysAgo(55), updatedAt: daysAgo(9) },
    { leadId: "BM-LEAD-001015", leadType: "INDIVIDUAL", source: "WEBSITE", campaign: "Website — Organic", campaignId: campaignIds["BM-CMP-001001"], landingPage: "/for-individuals", firstName: "Dina", lastName: "Petrova", email: "dina.petrova@example.com", phone: "+44 7400 400111", company: "", status: "Unqualified", priority: "LOW", qualifier: "individual", notes: "Outside service area.", demo: true, createdAt: daysAgo(60), updatedAt: daysAgo(11) },
  ];
  const leadRes = await insert("leads", leads);
  const leadIds = {};
  leads.forEach((l, i) => {
    leadIds[l.leadId] = leadRes.insertedIds[i];
  });
  console.log(`Inserted ${leads.length} demo leads.`);

  const contacts = leads.slice(0, 10).map((l, i) => ({
    contactId: `BM-CON-0010${String(i + 1).padStart(2, "0")}`,
    lead: leadIds[l.leadId],
    organisation: l.company ? orgIds[l.company] : undefined,
    firstName: l.firstName,
    lastName: l.lastName,
    email: l.email,
    telephone: l.phone,
    phone: l.phone,
    jobTitle: l.role,
    contactType: l.leadType === "INDIVIDUAL" ? "INDIVIDUAL" : "PROFESSIONAL",
    preferredContactMethod: "EMAIL",
    marketing: { optedIn: true, doNotContact: false },
    demo: true,
    createdAt: l.createdAt,
    updatedAt: l.updatedAt,
  }));
  await insert("contacts", contacts);
  console.log(`Inserted ${contacts.length} demo contacts.`);

  const activities = [
    { lead: leadIds["BM-LEAD-001003"], type: "call", direction: "outbound", summary: "Introductory call with Daniel Brooks", detail: "Discussed partnership structure and report pricing.", createdBy: userIds.SALES_AGENT, createdAt: daysAgo(3), updatedAt: daysAgo(3), demo: true },
    { lead: leadIds["BM-LEAD-001003"], type: "follow_up", direction: "outbound", summary: "Sent partnership pack", detail: "Follow up call scheduled for next week.", createdBy: userIds.SALES_AGENT, createdAt: daysAgo(2), updatedAt: daysAgo(2), demo: true },
    { lead: leadIds["BM-LEAD-001005"], type: "email", direction: "outbound", summary: "Sent country report sample", detail: "Shared sample Bangladesh country report.", createdBy: userIds.SALES_AGENT, createdAt: daysAgo(4), updatedAt: daysAgo(4), demo: true },
    { lead: leadIds["BM-LEAD-001006"], type: "call", direction: "inbound", summary: "Inbound call from Claire Donnelly", detail: "Wants country expert reports for 3 pending asylum cases.", createdBy: userIds.SALES_AGENT, createdAt: daysAgo(6), updatedAt: daysAgo(6), demo: true },
    { lead: leadIds["BM-LEAD-001008"], type: "meeting", direction: "outbound", summary: "Discovery meeting with Grace Osei", detail: "Scoped Ghana country report requirements.", createdBy: userIds.SALES_MANAGER, createdAt: daysAgo(8), updatedAt: daysAgo(8), demo: true },
    { lead: leadIds["BM-LEAD-001008"], type: "status_change", summary: "Stage changed from Needs Identified to Qualified", createdBy: userIds.SALES_MANAGER, movedFrom: "Needs Identified", movedTo: "Qualified", createdAt: daysAgo(3), updatedAt: daysAgo(3), demo: true },
    { lead: leadIds["BM-LEAD-001010"], type: "email", direction: "outbound", summary: "Sent formal proposal", detail: "Proposal for psychological report incl. assessment and review.", createdBy: userIds.SALES_AGENT, createdAt: daysAgo(4), updatedAt: daysAgo(4), demo: true },
    { lead: leadIds["BM-LEAD-001011"], type: "note", summary: "Partnership terms agreed", detail: "Signed onboarding checklist; waiting on firm details.", createdBy: userIds.SALES_MANAGER, createdAt: daysAgo(2), updatedAt: daysAgo(2), demo: true },
  ];
  await insert("activities", activities);
  console.log(`Inserted ${activities.length} demo activities.`);

  const qualifiedLeads = [
    { qualifiedId: "BM-QL-2026-001001", lead: leadIds["BM-LEAD-001008"], kind: "solicitor", notes: "Qualified for country report instruction.", converted: true, convertedTo: "solicitor", qualifiedBy: userIds.SALES_MANAGER, qualifiedAt: daysAgo(3), demo: true, createdAt: daysAgo(3), updatedAt: daysAgo(3) },
    { qualifiedId: "BM-QL-2026-001002", lead: leadIds["BM-LEAD-001004"], kind: "psychologist", notes: "HCPC verified, expertise matches.", converted: true, convertedTo: "psychologist", qualifiedBy: userIds.SALES_MANAGER, qualifiedAt: daysAgo(2), demo: true, createdAt: daysAgo(2), updatedAt: daysAgo(2) },
    { qualifiedId: "BM-QL-2026-001003", lead: leadIds["BM-LEAD-001009"], kind: "individual", notes: "Counselling suitability confirmed.", converted: false, qualifiedBy: userIds.SALES_MANAGER, qualifiedAt: daysAgo(5), demo: true, createdAt: daysAgo(5), updatedAt: daysAgo(5) },
    { qualifiedId: "BM-QL-2026-001004", lead: leadIds["BM-LEAD-001011"], kind: "solicitor", notes: "Partnership onboarding started.", converted: true, convertedTo: "solicitor", qualifiedBy: userIds.SALES_MANAGER, qualifiedAt: daysAgo(2), demo: true, createdAt: daysAgo(2), updatedAt: daysAgo(2) },
  ];
  await insert("qualifiedleads", qualifiedLeads);
  console.log(`Inserted ${qualifiedLeads.length} demo qualified leads.`);

  // ---------------------------------------------------------------------
  // 5. Cases across the workflow
  // ---------------------------------------------------------------------
  const cases = [
    {
      caseId: "BM-CASE-2026-001001", caseType: "PSYCHOLOGICAL_REPORT",
      client: clientIds["BM-CLI-001003"], instructingParty: "Reedham Legal",
      organisation: orgIds["BM-ORG-001002"], instructingOrganisation: orgIds["BM-ORG-001002"],
      solicitor: solicitorIds["BM-SOL-001003"], serviceType: "Expert Psychological Report",
      reportType: "PSYCHOLOGICAL_ASSESSMENT", deadline: daysAhead(21),
      status: "New Instruction", priority: "HIGH", caseworker: userIds.CASEWORKER,
      internalNotes: "Asylum appeal — psychological report requested. Waiting on bundle.",
      demo: true, createdAt: daysAgo(3), updatedAt: daysAgo(1),
    },
    {
      caseId: "BM-CASE-2026-001002", caseType: "PSYCHOLOGICAL_REPORT",
      client: clientIds["BM-CLI-001001"], instructingParty: "Hale & Carter Solicitors",
      organisation: orgIds["BM-ORG-001001"], instructingOrganisation: orgIds["BM-ORG-001001"],
      solicitor: solicitorIds["BM-SOL-001001"], serviceType: "Mental Health Status Certificate",
      reportType: "MENTAL_HEALTH_CERTIFICATE", deadline: daysAhead(14),
      status: "Initial Review", priority: "MEDIUM", caseworker: userIds.CASEWORKER,
      internalNotes: "Litigation friend certificate for family proceedings.",
      demo: true, createdAt: daysAgo(6), updatedAt: daysAgo(2),
    },
    {
      caseId: "BM-CASE-2026-001003", caseType: "COUNTRY_REPORT",
      client: clientIds["BM-CLI-001001"], instructingParty: "Reedham Legal",
      organisation: orgIds["BM-ORG-001002"], instructingOrganisation: orgIds["BM-ORG-001002"],
      solicitor: solicitorIds["BM-SOL-001003"], serviceType: "Country Expert Report",
      reportType: "COUNTRY_MENTAL_HEALTH", deadline: daysAhead(28),
      status: "Quotation", priority: "HIGH", caseworker: userIds.CASEWORKER,
      internalNotes: "Bangladesh mental health landscape — quotation being prepared.",
      demo: true, createdAt: daysAgo(8), updatedAt: daysAgo(1),
    },
    {
      caseId: "BM-CASE-2026-001004", caseType: "PSYCHOLOGICAL_REPORT",
      client: clientIds["BM-CLI-001002"], instructingParty: "Hale & Carter Solicitors",
      organisation: orgIds["BM-ORG-001001"], instructingOrganisation: orgIds["BM-ORG-001001"],
      solicitor: solicitorIds["BM-SOL-001002"], serviceType: "Expert Psychological Report",
      reportType: "PSYCHOLOGICAL_ASSESSMENT", deadline: daysAhead(18),
      status: "Approved", priority: "MEDIUM", caseworker: userIds.CASEWORKER,
      internalNotes: "Quotation approved — awaiting allocation.",
      demo: true, createdAt: daysAgo(10), updatedAt: daysAgo(2),
    },
    {
      caseId: "BM-CASE-2026-001005", caseType: "PSYCHOLOGICAL_REPORT",
      client: clientIds["BM-CLI-001003"], instructingParty: "Hale & Carter Solicitors",
      organisation: orgIds["BM-ORG-001001"], instructingOrganisation: orgIds["BM-ORG-001001"],
      solicitor: solicitorIds["BM-SOL-001002"], serviceType: "Expert Psychological Report",
      reportType: "PSYCHOLOGICAL_ASSESSMENT", deadline: daysAhead(12),
      status: "Psychologist Allocation", priority: "HIGH", caseworker: userIds.CASEWORKER,
      offers: [
        { psychologist: psychIds["BM-PSY-001001"], status: "Offered", conflict: false, expiresAt: daysAhead(3), createdAt: daysAgo(1), updatedAt: daysAgo(1) },
        { psychologist: psychIds["BM-PSY-001002"], status: "Offered", conflict: false, expiresAt: daysAhead(3), createdAt: daysAgo(1), updatedAt: daysAgo(1) },
      ],
      internalNotes: "Two offers sent; awaiting acceptance.",
      demo: true, createdAt: daysAgo(12), updatedAt: daysAgo(1),
    },
    {
      caseId: "BM-CASE-2026-001006", caseType: "PSYCHOLOGICAL_REPORT",
      client: clientIds["BM-CLI-001001"], instructingParty: "Hale & Carter Solicitors",
      organisation: orgIds["BM-ORG-001001"], instructingOrganisation: orgIds["BM-ORG-001001"],
      solicitor: solicitorIds["BM-SOL-001001"], serviceType: "Expert Psychological Report",
      reportType: "PSYCHOLOGICAL_ASSESSMENT", deadline: daysAhead(10),
      status: "Assessment", priority: "HIGH", caseworker: userIds.CASEWORKER,
      assignedPsychologist: psychIds["BM-PSY-001001"],
      offers: [{ psychologist: psychIds["BM-PSY-001001"], status: "Assigned", conflict: false, createdAt: daysAgo(5), updatedAt: daysAgo(5) }],
      internalNotes: "Assessment scheduled remotely with interpreter.",
      demo: true, createdAt: daysAgo(16), updatedAt: daysAgo(1),
    },
    {
      caseId: "BM-CASE-2026-001007", caseType: "PSYCHOLOGICAL_REPORT",
      client: clientIds["BM-CLI-001002"], instructingParty: "Reedham Legal",
      organisation: orgIds["BM-ORG-001002"], instructingOrganisation: orgIds["BM-ORG-001002"],
      solicitor: solicitorIds["BM-SOL-001003"], serviceType: "Expert Psychological Report",
      reportType: "PSYCHOLOGICAL_ASSESSMENT", deadline: daysAhead(6),
      status: "Report Preparation", priority: "URGENT", caseworker: userIds.CASEWORKER,
      reviewer: userIds["QUALITY_REVIEW"],
      assignedPsychologist: psychIds["BM-PSY-001002"],
      offers: [{ psychologist: psychIds["BM-PSY-001002"], status: "Assigned", conflict: false, createdAt: daysAgo(9), updatedAt: daysAgo(9) }],
      internalNotes: "Draft report in preparation.",
      demo: true, createdAt: daysAgo(20), updatedAt: daysAgo(1),
    },
    {
      caseId: "BM-CASE-2026-001008", caseType: "PSYCHOLOGICAL_REPORT",
      client: clientIds["BM-CLI-001001"], instructingParty: "Hale & Carter Solicitors",
      organisation: orgIds["BM-ORG-001001"], instructingOrganisation: orgIds["BM-ORG-001001"],
      solicitor: solicitorIds["BM-SOL-001002"], serviceType: "Expert Psychological Report",
      reportType: "PSYCHOLOGICAL_ASSESSMENT", deadline: daysAgo(-1),
      status: "Quality Review", priority: "HIGH", caseworker: userIds.CASEWORKER,
      reviewer: userIds["QUALITY_REVIEW"],
      assignedPsychologist: psychIds["BM-PSY-001001"],
      offers: [{ psychologist: psychIds["BM-PSY-001001"], status: "Assigned", conflict: false, createdAt: daysAgo(14), updatedAt: daysAgo(14) }],
      internalNotes: "Report with quality reviewer — overdue deadline.",
      demo: true, createdAt: daysAgo(25), updatedAt: daysAgo(1),
    },
    {
      caseId: "BM-CASE-2026-001009", caseType: "PSYCHOLOGICAL_REPORT",
      client: clientIds["BM-CLI-001002"], instructingParty: "Hale & Carter Solicitors",
      organisation: orgIds["BM-ORG-001001"], instructingOrganisation: orgIds["BM-ORG-001001"],
      solicitor: solicitorIds["BM-SOL-001001"], serviceType: "Expert Psychological Report",
      reportType: "PSYCHOLOGICAL_ASSESSMENT", deadline: daysAgo(-3),
      status: "Secure Release", priority: "HIGH", caseworker: userIds.CASEWORKER,
      reviewer: userIds["QUALITY_REVIEW"],
      assignedPsychologist: psychIds["BM-PSY-001002"],
      offers: [{ psychologist: psychIds["BM-PSY-001002"], status: "Assigned", conflict: false, createdAt: daysAgo(20), updatedAt: daysAgo(20) }],
      internalNotes: "Final report released to instructing firm.",
      demo: true, createdAt: daysAgo(32), updatedAt: daysAgo(1),
    },
    {
      caseId: "BM-CASE-2026-001010", caseType: "COUNTRY_REPORT",
      client: clientIds["BM-CLI-001003"], instructingParty: "Reedham Legal",
      organisation: orgIds["BM-ORG-001002"], instructingOrganisation: orgIds["BM-ORG-001002"],
      solicitor: solicitorIds["BM-SOL-001003"], serviceType: "Country Expert Report",
      reportType: "COUNTRY_MENTAL_HEALTH", deadline: daysAgo(-10),
      status: "Closed", priority: "MEDIUM", caseworker: userIds.CASEWORKER,
      reviewer: userIds["QUALITY_REVIEW"],
      assignedPsychologist: psychIds["BM-PSY-001001"],
      offers: [{ psychologist: psychIds["BM-PSY-001001"], status: "Assigned", conflict: false, createdAt: daysAgo(40), updatedAt: daysAgo(40) }],
      internalNotes: "Closed — report released and invoice paid.",
      demo: true, createdAt: daysAgo(45), updatedAt: daysAgo(8),
    },
  ];
  const caseRes = await insert("cases", cases);
  const caseIds = {};
  cases.forEach((c, i) => {
    caseIds[c.caseId] = caseRes.insertedIds[i];
  });
  console.log(`Inserted ${cases.length} demo cases.`);

  const caseAssignments = [
    { case: caseIds["BM-CASE-2026-001001"], user: userIds.CASEWORKER, assignmentType: "CASEWORKER", assignedBy: userIds.OPERATIONS, assignedAt: daysAgo(3), status: "ACTIVE", demo: true, createdAt: daysAgo(3), updatedAt: daysAgo(3) },
    { case: caseIds["BM-CASE-2026-001006"], user: userIds.CASEWORKER, assignmentType: "CASEWORKER", assignedBy: userIds.OPERATIONS, assignedAt: daysAgo(16), status: "ACTIVE", demo: true, createdAt: daysAgo(16), updatedAt: daysAgo(16) },
    { case: caseIds["BM-CASE-2026-001006"], psychologist: psychIds["BM-PSY-001001"], assignmentType: "PSYCHOLOGIST", assignedBy: userIds.CASEWORKER, assignedAt: daysAgo(5), acceptedAt: daysAgo(5), status: "ACTIVE", demo: true, createdAt: daysAgo(5), updatedAt: daysAgo(5) },
    { case: caseIds["BM-CASE-2026-001008"], psychologist: psychIds["BM-PSY-001001"], assignmentType: "PSYCHOLOGIST", assignedBy: userIds.CASEWORKER, assignedAt: daysAgo(14), acceptedAt: daysAgo(14), status: "ACTIVE", demo: true, createdAt: daysAgo(14), updatedAt: daysAgo(14) },
    { case: caseIds["BM-CASE-2026-001008"], user: userIds["QUALITY_REVIEW"], assignmentType: "QUALITY_REVIEW", assignedBy: userIds.OPERATIONS, assignedAt: daysAgo(1), status: "PENDING", demo: true, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
  ];
  await insert("caseassignments", caseAssignments);
  console.log(`Inserted ${caseAssignments.length} demo case assignments.`);

  const caseParticipants = [
    { case: caseIds["BM-CASE-2026-001005"], organisation: orgIds["BM-ORG-001001"], participantType: "SOLICITOR", accessLevel: "AUTHORISED", active: true, addedBy: userIds.OPERATIONS, demo: true, createdAt: daysAgo(12), updatedAt: daysAgo(12) },
    { case: caseIds["BM-CASE-2026-001006"], organisation: orgIds["BM-ORG-001001"], participantType: "SOLICITOR", accessLevel: "AUTHORISED", active: true, addedBy: userIds.OPERATIONS, demo: true, createdAt: daysAgo(16), updatedAt: daysAgo(16) },
    { case: caseIds["BM-CASE-2026-001006"], user: userIds.INDIVIDUAL_CLIENT, participantType: "CLIENT", accessLevel: "VIEW", active: true, addedBy: userIds.OPERATIONS, demo: true, createdAt: daysAgo(16), updatedAt: daysAgo(16) },
    { case: caseIds["BM-CASE-2026-001008"], organisation: orgIds["BM-ORG-001001"], participantType: "SOLICITOR", accessLevel: "AUTHORISED", active: true, addedBy: userIds.OPERATIONS, demo: true, createdAt: daysAgo(25), updatedAt: daysAgo(25) },
    { case: caseIds["BM-CASE-2026-001009"], organisation: orgIds["BM-ORG-001001"], participantType: "SOLICITOR", accessLevel: "AUTHORISED", active: true, addedBy: userIds.OPERATIONS, demo: true, createdAt: daysAgo(32), updatedAt: daysAgo(32) },
  ];
  await insert("caseparticipants", caseParticipants);
  console.log(`Inserted ${caseParticipants.length} demo case participants.`);

  // ---------------------------------------------------------------------
  // 6. Reports across the lifecycle (with immutable versions)
  // ---------------------------------------------------------------------
  const reports = [
    {
      reportId: "BM-RPT-2026-001001", case: caseIds["BM-CASE-2026-001007"],
      title: "Psychological Assessment Report — Rahim Ahmed", status: "Draft",
      currentVersion: 1, author: psychIds["BM-PSY-001002"], authorName: "Dr James Whitmore",
      createdBy: userIds.PSYCHOLOGIST2,
      body: "Assessment completed remotely. Draft in preparation.",
      versions: [{ version: 1, title: "Draft — Psychological Assessment Report", body: "Assessment completed remotely. Draft in preparation.", author: psychIds["BM-PSY-001002"], authorName: "Dr James Whitmore", submittedBy: userIds.PSYCHOLOGIST2, createdAt: daysAgo(3), updatedAt: daysAgo(3) }],
      demo: true, createdAt: daysAgo(3), updatedAt: daysAgo(1),
    },
    {
      reportId: "BM-RPT-2026-001002", case: caseIds["BM-CASE-2026-001008"],
      title: "Psychological Assessment Report — Sofia Novak", status: "Quality Review",
      currentVersion: 1, author: psychIds["BM-PSY-001001"], authorName: "Dr Amara Okafor",
      createdBy: userIds.PSYCHOLOGIST, reviewer: userIds["QUALITY_REVIEW"],
      body: "Submitted for internal quality review.",
      versions: [{ version: 1, title: "Psychological Assessment Report", body: "Submitted for internal quality review.", author: psychIds["BM-PSY-001001"], authorName: "Dr Amara Okafor", submittedBy: userIds.PSYCHOLOGIST, createdAt: daysAgo(2), updatedAt: daysAgo(2) }],
      demo: true, createdAt: daysAgo(2), updatedAt: daysAgo(1),
    },
    {
      reportId: "BM-RPT-2026-001003", case: caseIds["BM-CASE-2026-001004"],
      title: "Psychological Assessment Report — Rahim Ahmed (Family)", status: "Approved",
      currentVersion: 2, author: psychIds["BM-PSY-001002"], authorName: "Dr James Whitmore",
      createdBy: userIds.PSYCHOLOGIST2, reviewer: userIds["QUALITY_REVIEW"],
      reviewDecision: "APPROVED", reviewNote: "Amendments addressed; approved for final.", reviewedAt: daysAgo(2),
      body: "Approved — ready for final version.",
      versions: [
        { version: 1, title: "Draft v1", body: "Initial draft.", author: psychIds["BM-PSY-001002"], authorName: "Dr James Whitmore", submittedBy: userIds.PSYCHOLOGIST2, createdAt: daysAgo(6), updatedAt: daysAgo(6) },
        { version: 2, title: "Revised v2", body: "Revised after review comments.", author: psychIds["BM-PSY-001002"], authorName: "Dr James Whitmore", submittedBy: userIds.PSYCHOLOGIST2, createdAt: daysAgo(2), updatedAt: daysAgo(2) },
      ],
      demo: true, createdAt: daysAgo(6), updatedAt: daysAgo(2),
    },
    {
      reportId: "BM-RPT-2026-001004", case: caseIds["BM-CASE-2026-001006"],
      title: "Psychological Assessment Report — Sofia Novak (Assessment)", status: "Final",
      currentVersion: 3, author: psychIds["BM-PSY-001001"], authorName: "Dr Amara Okafor",
      createdBy: userIds.PSYCHOLOGIST, reviewer: userIds["QUALITY_REVIEW"],
      reviewDecision: "APPROVED", reviewedAt: daysAgo(1),
      body: "Final report approved, pending secure release.",
      versions: [
        { version: 1, title: "Draft v1", body: "Initial draft.", author: psychIds["BM-PSY-001001"], authorName: "Dr Amara Okafor", submittedBy: userIds.PSYCHOLOGIST, createdAt: daysAgo(4), updatedAt: daysAgo(4) },
        { version: 2, title: "Revised v2", body: "Revised after review.", author: psychIds["BM-PSY-001001"], authorName: "Dr Amara Okafor", submittedBy: userIds.PSYCHOLOGIST, createdAt: daysAgo(2), updatedAt: daysAgo(2) },
        { version: 3, title: "Final v3", body: "Final approved report.", author: psychIds["BM-PSY-001001"], authorName: "Dr Amara Okafor", submittedBy: userIds.PSYCHOLOGIST, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
      ],
      demo: true, createdAt: daysAgo(4), updatedAt: daysAgo(1),
    },
    {
      reportId: "BM-RPT-2026-001005", case: caseIds["BM-CASE-2026-001009"],
      title: "Psychological Assessment Report — Rahim Ahmed (Release)", status: "Released",
      currentVersion: 2, author: psychIds["BM-PSY-001002"], authorName: "Dr James Whitmore",
      createdBy: userIds.PSYCHOLOGIST2, reviewer: userIds["QUALITY_REVIEW"],
      reviewDecision: "APPROVED", reviewedAt: daysAgo(4), releasedAt: daysAgo(1), releasedBy: userIds.OPERATIONS,
      body: "Final report securely released to Hale & Carter.",
      versions: [
        { version: 1, title: "Draft v1", body: "Initial draft.", author: psychIds["BM-PSY-001002"], authorName: "Dr James Whitmore", submittedBy: userIds.PSYCHOLOGIST2, createdAt: daysAgo(6), updatedAt: daysAgo(6) },
        { version: 2, title: "Final v2", body: "Final approved and released report.", author: psychIds["BM-PSY-001002"], authorName: "Dr James Whitmore", submittedBy: userIds.PSYCHOLOGIST2, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
      ],
      demo: true, createdAt: daysAgo(6), updatedAt: daysAgo(1),
    },
  ];
  await insert("reports", reports);
  console.log(`Inserted ${reports.length} demo reports.`);

  // Map reports to ids for the review record below.
  const reportDocs = await db.collection("reports").find({ demo: true }).toArray();
  const reportIds = {};
  reportDocs.forEach((r) => {
    reportIds[r.reportId] = r._id;
  });
  await insert("reportreviews", [
    { report: reportIds["BM-RPT-2026-001002"], version: 1, reviewerId: userIds["QUALITY_REVIEW"], status: "AMENDMENTS_REQUIRED", comments: "Clarify methodology and limitations section.", reviewedAt: daysAgo(1), demo: true, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
  ]);
  console.log(`Inserted 1 demo report review.`);

  // ---------------------------------------------------------------------
  // 7. Documents (metadata + small content buffers for download testing)
  // ---------------------------------------------------------------------
  const mkDocVersion = (version, fileName, status, content, mimeType) => ({
    version,
    fileName,
    content,
    mimeType,
    sizeBytes: content ? Buffer.byteLength(content) : undefined,
    status,
    uploadedBy: userIds.CASEWORKER,
    uploadedAt: daysAgo(1),
  });

  const documents = [
    {
      documentId: "BM-DOC-001001", title: "Letter of Instruction — Sofia Novak",
      category: "LETTER_OF_INSTRUCTION", case: caseIds["BM-CASE-2026-001008"],
      organisation: orgIds["BM-ORG-001001"], ownerUserId: userIds.SOLICITOR,
      currentVersion: 1, status: "RELEASED", access: "organisation",
      visibilityLevel: "RESTRICTED", released: true,
      uploadedBy: userIds.SOLICITOR,
      versions: [mkDocVersion(1, "letter-of-instruction.docx", "FINAL", Buffer.from("Demo: letter of instruction for Sofia Novak."), "application/vnd.openxmlformats-officedocument.wordprocessingml.document")],
      demo: true, createdAt: daysAgo(24), updatedAt: daysAgo(24),
    },
    {
      documentId: "BM-DOC-001002", title: "Assessment Notes — Amara Okafor",
      category: "ASSESSMENT_NOTES", case: caseIds["BM-CASE-2026-001008"],
      organisation: orgIds["BM-ORG-001001"], ownerUserId: userIds.PSYCHOLOGIST,
      currentVersion: 1, status: "PENDING_REVIEW", access: "case",
      visibilityLevel: "RESTRICTED", released: false,
      uploadedBy: userIds.PSYCHOLOGIST,
      versions: [mkDocVersion(1, "assessment-notes.pdf", "DRAFT", Buffer.from("Demo: clinical assessment notes (draft)."), "application/pdf")],
      demo: true, createdAt: daysAgo(2), updatedAt: daysAgo(2),
    },
    {
      documentId: "BM-DOC-001003", title: "Final Psychological Report — Released",
      category: "FINAL_REPORT", case: caseIds["BM-CASE-2026-001009"],
      organisation: orgIds["BM-ORG-001001"], ownerUserId: userIds.OPERATIONS,
      currentVersion: 2, status: "RELEASED", access: "released",
      visibilityLevel: "RELEASED", released: true,
      uploadedBy: userIds.OPERATIONS,
      versions: [
        { version: 1, fileName: "report-draft-v1.pdf", content: Buffer.from("Demo: draft report content v1."), mimeType: "application/pdf", status: "DRAFT", uploadedBy: userIds.PSYCHOLOGIST2, uploadedAt: daysAgo(5) },
        { version: 2, fileName: "final-report-v2.pdf", content: Buffer.from("Demo: FINAL psychological report — securely released."), mimeType: "application/pdf", status: "FINAL", uploadedBy: userIds.OPERATIONS, uploadedAt: daysAgo(1) },
      ],
      demo: true, createdAt: daysAgo(5), updatedAt: daysAgo(1),
    },
    {
      documentId: "BM-DOC-001004", title: "Client Consent Form",
      category: "CONSENT", case: caseIds["BM-CASE-2026-001006"],
      organisation: orgIds["BM-ORG-001001"], ownerUserId: userIds.CASEWORKER,
      currentVersion: 1, status: "RELEASED", access: "case",
      visibilityLevel: "CASE", released: true,
      uploadedBy: userIds.CASEWORKER,
      versions: [mkDocVersion(1, "consent-form.pdf", "FINAL", Buffer.from("Demo: signed consent form."), "application/pdf")],
      demo: true, createdAt: daysAgo(15), updatedAt: daysAgo(15),
    },
    {
      documentId: "BM-DOC-001005", title: "Medical Records (Client bundle)",
      category: "EVIDENCE", case: caseIds["BM-CASE-2026-001008"],
      organisation: orgIds["BM-ORG-001001"], ownerUserId: userIds.SOLICITOR,
      currentVersion: 1, status: "PENDING_REVIEW", access: "case",
      visibilityLevel: "RESTRICTED", released: false,
      uploadedBy: userIds.SOLICITOR,
      versions: [mkDocVersion(1, "medical-records.pdf", "DRAFT", Buffer.from("Demo: medical records bundle."), "application/pdf")],
      demo: true, createdAt: daysAgo(20), updatedAt: daysAgo(20),
    },
  ];
  await insert("documents", documents);
  console.log(`Inserted ${documents.length} demo documents.`);

  const docIds = {};
  (await db.collection("documents").find({ demo: true }).toArray()).forEach((d) => {
    docIds[d.documentId] = d._id;
  });

  await insert("documentpermissions", [
    { document: docIds["BM-DOC-001003"], organisation: orgIds["BM-ORG-001001"], permissions: ["VIEW", "DOWNLOAD"], grantedBy: userIds.OPERATIONS, demo: true, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
    { document: docIds["BM-DOC-001001"], organisation: orgIds["BM-ORG-001001"], permissions: ["VIEW", "DOWNLOAD"], grantedBy: userIds.OPERATIONS, demo: true, createdAt: daysAgo(24), updatedAt: daysAgo(24) },
  ]);
  console.log(`Inserted 2 demo document permissions.`);

  // ---------------------------------------------------------------------
  // 8. Tasks / tickets / appointments
  // ---------------------------------------------------------------------
  const tasks = [
    { taskId: "BM-TSK-2026-001001", title: "Review psychologist compliance documents", description: "Verify HCPC registration and PI insurance for Nadia Hassan.", priority: "high", status: "todo", dueAt: daysAhead(2), linkType: "lead", linkId: leadIds["BM-LEAD-001004"], assignedTo: userIds.OPERATIONS, createdBy: userIds.SALES_MANAGER, demo: true, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
    { taskId: "BM-TSK-2026-001002", title: "Prepare quotation for country report", description: "Bangladesh mental health landscape report.", priority: "high", status: "in_progress", dueAt: daysAhead(1), linkType: "case", linkId: caseIds["BM-CASE-2026-001003"], assignedTo: userIds.FINANCE, createdBy: userIds.CASEWORKER, demo: true, createdAt: daysAgo(2), updatedAt: daysAgo(1) },
    { taskId: "BM-TSK-2026-001003", title: "Chase client bundle from instructing firm", description: "Medical records still outstanding.", priority: "medium", status: "todo", dueAt: daysAhead(3), linkType: "case", linkId: caseIds["BM-CASE-2026-001001"], assignedTo: userIds.CASEWORKER, createdBy: userIds.OPERATIONS, demo: true, createdAt: daysAgo(3), updatedAt: daysAgo(3) },
    { taskId: "BM-TSK-2026-001004", title: "Submit draft report for review", description: "Finalise draft and submit to quality review.", priority: "urgent", status: "in_progress", dueAt: daysAhead(1), linkType: "case", linkId: caseIds["BM-CASE-2026-001007"], assignedTo: userIds.PSYCHOLOGIST2, createdBy: userIds.CASEWORKER, demo: true, createdAt: daysAgo(2), updatedAt: daysAgo(1) },
    { taskId: "BM-TSK-2026-001005", title: "Quality review of Sofia report", description: "Review submitted report and issue comments.", priority: "high", status: "in_review", dueAt: daysAhead(1), linkType: "case", linkId: caseIds["BM-CASE-2026-001008"], assignedTo: userIds["QUALITY_REVIEW"], createdBy: userIds.OPERATIONS, demo: true, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
    { taskId: "BM-TSK-2026-001006", title: "Issue invoice for released report", description: "Invoice Hale & Carter for case 001009.", priority: "medium", status: "done", dueAt: daysAgo(2), completedAt: daysAgo(1), linkType: "case", linkId: caseIds["BM-CASE-2026-001009"], assignedTo: userIds.FINANCE, createdBy: userIds.CASEWORKER, demo: true, createdAt: daysAgo(3), updatedAt: daysAgo(1) },
    { taskId: "BM-TSK-2026-001007", title: "Follow up partnership lead", description: "Call Daniel Brooks re partnership pack.", priority: "medium", status: "todo", dueAt: daysAhead(5), linkType: "lead", linkId: leadIds["BM-LEAD-001003"], assignedTo: userIds.SALES_AGENT, createdBy: userIds.SALES_MANAGER, demo: true, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
  ];
  await insert("tasks", tasks);
  console.log(`Inserted ${tasks.length} demo tasks.`);

  const tickets = [
    {
      ticketId: "BM-TKT-2026-001001", subject: "Unable to download released report",
      category: "report", priority: "high", status: "open",
      assignee: userIds.OPERATIONS, reporter: userIds.SOLICITOR,
      organisation: orgIds["BM-ORG-001001"], case: caseIds["BM-CASE-2026-001009"],
      escalated: false,
      messages: [
        { author: userIds.SOLICITOR, body: "The released report for case BM-CASE-2026-001009 will not download — link seems broken.", internal: false, createdAt: daysAgo(1) },
        { author: userIds.OPERATIONS, body: "Investigating now. The release record looks fine; checking permissions.", internal: true, createdAt: daysAgo(1) },
      ],
      demo: true, createdAt: daysAgo(1), updatedAt: daysAgo(1),
    },
    {
      ticketId: "BM-TKT-2026-001002", subject: "Billing query — invoice overpayment",
      category: "billing", priority: "medium", status: "in_progress",
      assignee: userIds.FINANCE, reporter: userIds.SOLICITOR_FIRM_ADMIN,
      organisation: orgIds["BM-ORG-001001"],
      messages: [
        { author: userIds.SOLICITOR_FIRM_ADMIN, body: "Invoice BM-INV-001003 was paid twice from our accounts system.", internal: false, createdAt: daysAgo(3) },
        { author: userIds.FINANCE, body: "Confirmed duplicate payment — refund being processed this week.", internal: false, createdAt: daysAgo(2) },
      ],
      demo: true, createdAt: daysAgo(3), updatedAt: daysAgo(2),
    },
    {
      ticketId: "BM-TKT-2026-001003", subject: "Add colleague to case portal",
      category: "support", priority: "low", status: "open",
      reporter: userIds.SOLICITOR, organisation: orgIds["BM-ORG-001001"],
      escalated: false,
      messages: [
        { author: userIds.SOLICITOR, body: "Please add our paralegal to case BM-CASE-2026-001006.", internal: false, createdAt: daysAgo(1) },
      ],
      demo: true, createdAt: daysAgo(1), updatedAt: daysAgo(1),
    },
    {
      ticketId: "BM-TKT-2026-001004", subject: "Appointment reschedule request",
      category: "support", priority: "medium", status: "resolved",
      assignee: userIds.OPERATIONS, reporter: userIds.PSYCHOLOGIST,
      escalated: false, resolution: "Assessment moved to Friday 2pm.", resolvedAt: daysAgo(2),
      messages: [
        { author: userIds.PSYCHOLOGIST, body: "Need to move the assessment for next week.", internal: false, createdAt: daysAgo(4) },
        { author: userIds.OPERATIONS, body: "Rescheduled to Friday 2pm — client informed.", internal: false, createdAt: daysAgo(2) },
      ],
      demo: true, createdAt: daysAgo(4), updatedAt: daysAgo(2),
    },
    {
      ticketId: "BM-TKT-2026-001005", subject: "Portal login issue",
      category: "technical", priority: "high", status: "in_progress",
      assignee: userIds.SYSTEM_ADMIN, reporter: userIds.SOLICITOR_FIRM_ADMIN,
      organisation: orgIds["BM-ORG-001001"], escalated: true,
      messages: [
        { author: userIds.SOLICITOR_FIRM_ADMIN, body: "Two users cannot sign in since this morning.", internal: false, createdAt: daysAgo(1) },
        { author: userIds.SYSTEM_ADMIN, body: "Session issue identified; rolled back config. Monitoring.", internal: true, createdAt: daysAgo(1) },
      ],
      demo: true, createdAt: daysAgo(1), updatedAt: daysAgo(1),
    },
  ];
  await insert("tickets", tickets);
  console.log(`Inserted ${tickets.length} demo tickets.`);

  const appointments = [
    { appointmentId: "BM-APT-2026-001001", kind: "assessment", status: "scheduled", title: "Remote psychological assessment", startsAt: daysAhead(3), endsAt: new Date(daysAhead(3).getTime() + 90 * 60000), case: caseIds["BM-CASE-2026-001006"], psychologist: psychIds["BM-PSY-001001"], client: clientIds["BM-CLI-001001"], organisation: orgIds["BM-ORG-001001"], location: "ONLINE", notes: "Interpreter required (Farsi).", createdBy: userIds.CASEWORKER, demo: true, createdAt: daysAgo(2), updatedAt: daysAgo(2) },
    { appointmentId: "BM-APT-2026-001002", kind: "assessment", status: "confirmed", title: "Follow-up assessment", startsAt: daysAhead(7), endsAt: new Date(daysAhead(7).getTime() + 90 * 60000), case: caseIds["BM-CASE-2026-001007"], psychologist: psychIds["BM-PSY-001002"], client: clientIds["BM-CLI-001002"], organisation: orgIds["BM-ORG-001002"], location: "ONLINE", createdBy: userIds.CASEWORKER, demo: true, createdAt: daysAgo(3), updatedAt: daysAgo(1) },
    { appointmentId: "BM-APT-2026-001003", kind: "consultation", status: "scheduled", title: "Suitability consultation", startsAt: daysAhead(2), endsAt: new Date(daysAhead(2).getTime() + 45 * 60000), client: clientIds["BM-CLI-001003"], organisation: orgIds["BM-ORG-001002"], location: "ONLINE", createdBy: userIds.CASEWORKER, demo: true, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
    { appointmentId: "BM-APT-2026-001004", kind: "therapy", status: "completed", title: "Counselling session", startsAt: daysAgo(4), endsAt: new Date(daysAgo(4).getTime() + 50 * 60000), client: clientIds["BM-CLI-001001"], psychologist: psychIds["BM-PSY-001003"], location: "ONLINE", createdBy: userIds.OPERATIONS, demo: true, createdAt: daysAgo(8), updatedAt: daysAgo(4) },
    { appointmentId: "BM-APT-2026-001005", kind: "review", status: "cancelled", title: "Case review call", startsAt: daysAgo(2), endsAt: new Date(daysAgo(2).getTime() + 30 * 60000), case: caseIds["BM-CASE-2026-001005"], organisation: orgIds["BM-ORG-001001"], createdBy: userIds.CASEWORKER, demo: true, createdAt: daysAgo(5), updatedAt: daysAgo(2) },
  ];
  await insert("appointments", appointments);
  console.log(`Inserted ${appointments.length} demo appointments.`);

  // ---------------------------------------------------------------------
  // 9. Finance — quotations / invoices / payments
  // ---------------------------------------------------------------------
  const quotations = [
    { quotationId: "BM-QUO-001001", case: caseIds["BM-CASE-2026-001003"], organisation: orgIds["BM-ORG-001002"], client: clientIds["BM-CLI-001001"], amount: 600, currency: "GBP", status: "SENT", description: "Country Expert Report — Bangladesh mental health landscape.", lineItems: [{ description: "Country expert report", amount: 600, quantity: 1 }], issuedAt: daysAgo(1), createdBy: userIds.FINANCE, demo: true, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
    { quotationId: "BM-QUO-001002", case: caseIds["BM-CASE-2026-001004"], organisation: orgIds["BM-ORG-001001"], client: clientIds["BM-CLI-001002"], amount: 800, currency: "GBP", status: "APPROVED", description: "Expert Psychological Report — full assessment.", lineItems: [{ description: "Psychological assessment + report", amount: 800, quantity: 1 }], issuedAt: daysAgo(9), approvedAt: daysAgo(7), createdBy: userIds.FINANCE, demo: true, createdAt: daysAgo(9), updatedAt: daysAgo(7) },
    { quotationId: "BM-QUO-001003", case: caseIds["BM-CASE-2026-001006"], organisation: orgIds["BM-ORG-001001"], client: clientIds["BM-CLI-001001"], amount: 800, currency: "GBP", status: "APPROVED", description: "Expert Psychological Report — assessment & report.", lineItems: [{ description: "Psychological assessment + report", amount: 800, quantity: 1 }], issuedAt: daysAgo(15), approvedAt: daysAgo(14), createdBy: userIds.FINANCE, demo: true, createdAt: daysAgo(15), updatedAt: daysAgo(14) },
    { quotationId: "BM-QUO-001004", case: caseIds["BM-CASE-2026-001009"], organisation: orgIds["BM-ORG-001001"], client: clientIds["BM-CLI-001002"], amount: 800, currency: "GBP", status: "APPROVED", description: "Expert Psychological Report — released.", lineItems: [{ description: "Psychological assessment + report", amount: 800, quantity: 1 }], issuedAt: daysAgo(30), approvedAt: daysAgo(28), createdBy: userIds.FINANCE, demo: true, createdAt: daysAgo(30), updatedAt: daysAgo(28) },
    { quotationId: "BM-QUO-001005", case: caseIds["BM-CASE-2026-001001"], organisation: orgIds["BM-ORG-001002"], client: clientIds["BM-CLI-001003"], amount: 400, currency: "GBP", status: "DRAFT", description: "Mental Health Status Certificate.", lineItems: [{ description: "Status certificate", amount: 400, quantity: 1 }], createdBy: userIds.FINANCE, demo: true, createdAt: daysAgo(2), updatedAt: daysAgo(2) },
  ];
  const quoRes = await insert("quotations", quotations);
  const quotationIds = {};
  quotations.forEach((q, i) => {
    quotationIds[q.quotationId] = quoRes.insertedIds[i];
  });
  console.log(`Inserted ${quotations.length} demo quotations.`);

  const invoices = [
    { invoiceId: "BM-INV-001001", case: caseIds["BM-CASE-2026-001006"], quotation: quotationIds["BM-QUO-001003"], organisation: orgIds["BM-ORG-001001"], client: clientIds["BM-CLI-001001"], amount: 800, paidAmount: 800, balance: 0, currency: "GBP", status: "PAID", dueDate: daysAgo(8), issuedAt: daysAgo(14), paidAt: daysAgo(6), createdBy: userIds.FINANCE, demo: true, createdAt: daysAgo(14), updatedAt: daysAgo(6) },
    { invoiceId: "BM-INV-001002", case: caseIds["BM-CASE-2026-001009"], quotation: quotationIds["BM-QUO-001004"], organisation: orgIds["BM-ORG-001001"], client: clientIds["BM-CLI-001002"], amount: 800, paidAmount: 800, balance: 0, currency: "GBP", status: "PAID", dueDate: daysAgo(20), issuedAt: daysAgo(28), paidAt: daysAgo(12), createdBy: userIds.FINANCE, demo: true, createdAt: daysAgo(28), updatedAt: daysAgo(12) },
    { invoiceId: "BM-INV-001003", case: caseIds["BM-CASE-2026-001004"], quotation: quotationIds["BM-QUO-001002"], organisation: orgIds["BM-ORG-001001"], client: clientIds["BM-CLI-001002"], amount: 800, paidAmount: 400, balance: 400, currency: "GBP", status: "PARTIALLY_PAID", dueDate: daysAhead(5), issuedAt: daysAgo(7), createdBy: userIds.FINANCE, demo: true, createdAt: daysAgo(7), updatedAt: daysAgo(3) },
    { invoiceId: "BM-INV-001004", case: caseIds["BM-CASE-2026-001003"], quotation: quotationIds["BM-QUO-001001"], organisation: orgIds["BM-ORG-001002"], client: clientIds["BM-CLI-001001"], amount: 600, paidAmount: 0, balance: 600, currency: "GBP", status: "ISSUED", dueDate: daysAhead(10), issuedAt: daysAgo(1), createdBy: userIds.FINANCE, demo: true, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
    { invoiceId: "BM-INV-001005", case: caseIds["BM-CASE-2026-001001"], quotation: quotationIds["BM-QUO-001005"], organisation: orgIds["BM-ORG-001002"], client: clientIds["BM-CLI-001003"], amount: 400, paidAmount: 0, balance: 400, currency: "GBP", status: "OVERDUE", dueDate: daysAgo(-2), issuedAt: daysAgo(12), createdBy: userIds.FINANCE, demo: true, createdAt: daysAgo(12), updatedAt: daysAgo(1) },
  ];
  const invRes = await insert("invoices", invoices);
  const invoiceIds = {};
  invoices.forEach((inv, i) => {
    invoiceIds[inv.invoiceId] = invRes.insertedIds[i];
  });
  console.log(`Inserted ${invoices.length} demo invoices.`);

  const payments = [
    { paymentId: "BM-PAY-001001", invoice: invoiceIds["BM-INV-001001"], case: caseIds["BM-CASE-2026-001006"], organisation: orgIds["BM-ORG-001001"], amount: 800, currency: "GBP", method: "BACS", reference: "BM-INV-001001", status: "COMPLETED", paidAt: daysAgo(6), recordedBy: userIds.FINANCE, demo: true, createdAt: daysAgo(6), updatedAt: daysAgo(6) },
    { paymentId: "BM-PAY-001002", invoice: invoiceIds["BM-INV-001002"], case: caseIds["BM-CASE-2026-001009"], organisation: orgIds["BM-ORG-001001"], amount: 800, currency: "GBP", method: "BACS", reference: "BM-INV-001002", status: "COMPLETED", paidAt: daysAgo(12), recordedBy: userIds.FINANCE, demo: true, createdAt: daysAgo(12), updatedAt: daysAgo(12) },
    { paymentId: "BM-PAY-001003", invoice: invoiceIds["BM-INV-001003"], case: caseIds["BM-CASE-2026-001004"], organisation: orgIds["BM-ORG-001001"], amount: 400, currency: "GBP", method: "Card", reference: "CARD-8821", status: "COMPLETED", paidAt: daysAgo(3), recordedBy: userIds.FINANCE, demo: true, createdAt: daysAgo(3), updatedAt: daysAgo(3) },
    { paymentId: "BM-PAY-001004", invoice: invoiceIds["BM-INV-001003"], case: caseIds["BM-CASE-2026-001004"], organisation: orgIds["BM-ORG-001001"], amount: 400, currency: "GBP", method: "BACS", reference: "BM-INV-001003-2", status: "PENDING", recordedBy: userIds.FINANCE, demo: true, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
  ];
  await insert("payments", payments);
  console.log(`Inserted ${payments.length} demo payments.`);

  // ---------------------------------------------------------------------
  // 10. Notifications / onboardings / form submissions / audit logs
  // ---------------------------------------------------------------------
  const notifications = [
    { user: userIds.CASEWORKER, type: "case_assignment", title: "Case assigned", body: "BM-CASE-2026-001001 assigned to you.", link: "/crm/cases", read: false, demo: true, createdAt: daysAgo(3), updatedAt: daysAgo(3) },
    { user: userIds.CASEWORKER, type: "info_request", title: "New task", body: "Chase client bundle from instructing firm.", link: "/crm/tasks", read: false, demo: true, createdAt: daysAgo(3), updatedAt: daysAgo(3) },
    { user: userIds.PSYCHOLOGIST, type: "case_offer", title: "New case offer", body: "Case BM-CASE-2026-001005 offer awaits your decision.", link: "/portal/psychologist", read: false, demo: true, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
    { user: userIds.PSYCHOLOGIST, type: "report_update", title: "Report update", body: "Quality review comments on your report.", link: "/portal/psychologist/reports", read: false, demo: true, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
    { user: userIds.PSYCHOLOGIST2, type: "quality_review", title: "Quality review requested", body: "Please address review comments on BM-RPT-2026-001003.", link: "/portal/psychologist/reports", read: false, demo: true, createdAt: daysAgo(2), updatedAt: daysAgo(2) },
    { user: userIds.SOLICITOR_FIRM_ADMIN, type: "report_release", title: "Report released", body: "Final report released for case BM-CASE-2026-001009.", link: "/portal/solicitor", read: false, demo: true, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
    { user: userIds.SOLICITOR, type: "ticket_update", title: "Ticket updated", body: "Your download issue is being investigated.", link: "/portal/notifications", read: false, demo: true, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
    { user: userIds.INDIVIDUAL_CLIENT, type: "appointment", title: "Appointment scheduled", body: "Assessment confirmed for your case.", link: "/portal/individual", read: false, demo: true, createdAt: daysAgo(2), updatedAt: daysAgo(2) },
    { user: userIds.INDIVIDUAL_CLIENT, type: "payment_update", title: "Invoice issued", body: "Invoice BM-INV-001001 has been issued.", link: "/portal/individual", read: false, demo: true, createdAt: daysAgo(14), updatedAt: daysAgo(14) },
    { user: userIds.SALES_AGENT, type: "lead_assignment", title: "Lead assigned", body: "New lead assigned to you — Daniel Brooks.", link: "/crm/leads", read: false, demo: true, createdAt: daysAgo(6), updatedAt: daysAgo(6) },
  ];
  await insert("notifications", notifications);
  console.log(`Inserted ${notifications.length} demo notifications.`);

  const onboardings = [
    { onboardingId: "BM-ONB-001001", lead: leadIds["BM-LEAD-001011"], type: "SOLICITOR_FIRM", status: "IN_PROGRESS", organisation: orgIds["BM-ORG-001003"], checklist: [{ name: "Firm details", completed: true, completedAt: daysAgo(1) }, { name: "Billing details", completed: false }, { name: "Firm users", completed: false }], demo: true, createdAt: daysAgo(2), updatedAt: daysAgo(1) },
    { onboardingId: "BM-ONB-001002", lead: leadIds["BM-LEAD-001004"], type: "HCPC_PSYCHOLOGIST", status: "AWAITING_REVIEW", checklist: [{ name: "HCPC registration", completed: true, completedAt: daysAgo(2) }, { name: "Insurance", completed: true, completedAt: daysAgo(2) }, { name: "CV", completed: true, completedAt: daysAgo(2) }], demo: true, createdAt: daysAgo(2), updatedAt: daysAgo(1) },
    { onboardingId: "BM-ONB-001003", lead: leadIds["BM-LEAD-001009"], type: "INDIVIDUAL_CLIENT", status: "IN_PROGRESS", user: userIds.INDIVIDUAL_CLIENT, checklist: [{ name: "Consent", completed: true, completedAt: daysAgo(4) }, { name: "Suitability review", completed: false }], demo: true, createdAt: daysAgo(5), updatedAt: daysAgo(2) },
  ];
  await insert("onboardings", onboardings);
  console.log(`Inserted ${onboardings.length} demo onboardings.`);

  const formSubmissions = [
    { formId: "BM-CON-002001-ABC123", formType: "request_report", source: "request_report_page", campaign: "request_report", landingPage: "/request-a-report", lead: leadIds["BM-LEAD-001001"], payload: { firstName: "Amelia", lastName: "Ward", email: "a.ward@wardandco.example.com", reportType: "Expert Psychological Report" }, ip: "10.0.0.1", userAgent: "Mozilla/5.0", demo: true, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
    { formId: "BM-CON-002002-ABC124", formType: "solicitor_partner", source: "solicitor_partnership_page", campaign: "solicitor", landingPage: "/solicitor-partnership", lead: leadIds["BM-LEAD-001003"], payload: { firstName: "Daniel", lastName: "Brooks", email: "d.brooks@brooksllp.example.com", company: "Brooks LLP" }, ip: "10.0.0.2", userAgent: "Mozilla/5.0", demo: true, createdAt: daysAgo(6), updatedAt: daysAgo(6) },
    { formId: "BM-CON-002003-ABC125", formType: "psychologist", source: "join_psychologist_network_page", campaign: "psychologist", landingPage: "/join-psychologist-network", lead: leadIds["BM-LEAD-001004"], payload: { firstName: "Nadia", lastName: "Hassan", email: "nadia.hassan@example.com", hcpcRegistration: "PYL88213" }, ip: "10.0.0.3", userAgent: "Mozilla/5.0", demo: true, createdAt: daysAgo(5), updatedAt: daysAgo(5) },
    { formId: "BM-CON-002004-ABC126", formType: "callback", source: "request_callback_page", campaign: "callback", landingPage: "/request-callback", lead: leadIds["BM-LEAD-001009"], payload: { firstName: "Omar", lastName: "Khalil", email: "omar.khalil@example.com", preferredCallbackTime: "Weekday mornings" }, ip: "10.0.0.4", userAgent: "Mozilla/5.0", demo: true, createdAt: daysAgo(25), updatedAt: daysAgo(25) },
  ];
  await insert("formsubmissions", formSubmissions);
  console.log(`Inserted ${formSubmissions.length} demo form submissions.`);

  const auditLogs = [
    { auditId: "BM-AUD-001001", actor: "BM-USR-001003", actorUserId: userIds.CASEWORKER, action: "CREATE", resource: "case", resourceType: "CASE", resourceId: "BM-CASE-2026-001001", metadata: { event: "demo.seed" }, demo: true, createdAt: daysAgo(3), updatedAt: daysAgo(3) },
    { auditId: "BM-AUD-001002", actor: "BM-USR-001003", actorUserId: userIds.CASEWORKER, action: "STATUS_CHANGE", resource: "case", resourceType: "CASE", resourceId: "BM-CASE-2026-001008", metadata: { from: "Assessment", to: "Quality Review" }, demo: true, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
    { auditId: "BM-AUD-001003", actor: "BM-USR-001004", actorUserId: userIds["QUALITY_REVIEW"], action: "APPROVE", resource: "report", resourceType: "REPORT", resourceId: "BM-RPT-2026-001004", metadata: { event: "quality.approved" }, demo: true, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
    { auditId: "BM-AUD-001004", actor: "BM-USR-001002", actorUserId: userIds.OPERATIONS, action: "RELEASE", resource: "document", resourceType: "DOCUMENT", resourceId: "BM-DOC-001003", metadata: { event: "final.released" }, demo: true, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
    { auditId: "BM-AUD-001005", actor: "BM-USR-001008", actorUserId: userIds.SALES_AGENT, action: "ASSIGN", resource: "lead", resourceType: "LEAD", resourceId: "BM-LEAD-001003", metadata: { to: "Lucy Foster" }, demo: true, createdAt: daysAgo(6), updatedAt: daysAgo(6) },
    { auditId: "BM-AUD-001006", actor: "BM-USR-001005", actorUserId: userIds.FINANCE, action: "CREATE", resource: "invoice", resourceType: "INVOICE", resourceId: "BM-INV-001003", metadata: { event: "invoice.issued" }, demo: true, createdAt: daysAgo(7), updatedAt: daysAgo(7) },
  ];
  await insert("auditlogs", auditLogs);
  console.log(`Inserted ${auditLogs.length} demo audit logs.`);

  // ---------------------------------------------------------------------
  // 11. Roles catalogue (design §4) — kept in sync with the static matrix
  // ---------------------------------------------------------------------
  const roleDefs = [
    ["MASTER_ADMIN", "Master Admin", ["users:read", "users:create", "users:update", "users:delete", "roles:read", "roles:manage", "leads:read", "leads:create", "leads:update", "leads:delete", "leads:import", "leads:assign", "leads:convert", "contacts:read", "contacts:create", "contacts:update", "organisation:read", "organisation:create", "organisation:update", "campaigns:read", "campaigns:manage", "onboarding:read", "onboarding:create", "onboarding:update", "cases:read", "cases:create", "cases:update", "cases:assign", "cases:release", "reports:read", "reports:create", "reports:review", "reports:approve", "reports:release", "documents:read", "documents:create", "documents:delete", "documents:download", "documents:release", "appointments:read", "appointments:create", "appointments:update", "tasks:read", "tasks:create", "tasks:update", "tasks:assign", "tickets:read", "tickets:create", "tickets:update", "finance:read", "finance:create", "finance:update", "quotations:read", "quotations:create", "invoices:read", "invoices:create", "payments:read", "payments:update", "processors:review", "audit:read", "export:create", "settings:manage", "notifications:read"], "ALL"],
    ["SYSTEM_ADMIN", "System Admin", ["users:read", "users:create", "users:update", "users:delete", "roles:read", "roles:manage", "settings:manage", "audit:read", "organisation:read", "organisation:create", "organisation:update", "notifications:read", "leads:read", "cases:read", "finance:read", "documents:read", "tasks:read", "tickets:read"], "ALL"],
    ["OPERATIONS", "Operations", ["contacts:read", "contacts:create", "contacts:update", "organisation:read", "organisation:create", "organisation:update", "onboarding:read", "onboarding:create", "onboarding:update", "cases:read", "cases:create", "cases:update", "cases:assign", "tasks:read", "tasks:create", "tasks:update", "tasks:assign", "tickets:read", "tickets:create", "tickets:update", "appointments:read", "appointments:create", "appointments:update", "documents:read", "documents:create", "documents:download", "reports:read", "finance:read", "leads:read", "leads:update", "users:read", "notifications:read"], "ALL"],
    ["CASEWORKER", "Caseworker", ["cases:read", "cases:create", "cases:update", "cases:assign", "tasks:read", "tasks:create", "tasks:update", "documents:read", "documents:create", "documents:download", "appointments:read", "appointments:create", "appointments:update", "tickets:read", "tickets:create", "tickets:update", "reports:read", "reports:create", "leads:read", "users:read", "notifications:read"], "ASSIGNED"],
    ["QUALITY_REVIEW", "Quality Review", ["reports:read", "reports:review", "reports:approve", "documents:read", "documents:download", "cases:read", "tasks:read", "tickets:read", "users:read", "notifications:read"], "ASSIGNED"],
    ["FINANCE", "Finance", ["finance:read", "finance:create", "finance:update", "quotations:read", "quotations:create", "invoices:read", "invoices:create", "payments:read", "payments:update", "cases:read", "contacts:read", "organisation:read", "leads:read", "users:read", "tasks:read", "tickets:read", "notifications:read"], "ALL"],
    ["MARKETING", "Marketing", ["campaigns:read", "campaigns:manage", "leads:read", "leads:create", "leads:update", "leads:import", "contacts:read", "contacts:update", "tasks:read", "notifications:read"], "ALL"],
    ["SALES_MANAGER", "Sales Manager", ["leads:read", "leads:create", "leads:update", "leads:delete", "leads:import", "leads:assign", "leads:convert", "contacts:read", "contacts:create", "contacts:update", "onboarding:read", "onboarding:create", "tasks:read", "tasks:create", "tasks:update", "tasks:assign", "tickets:read", "users:read", "organisation:read", "campaigns:read", "notifications:read"], "OWN_TEAM"],
    ["SALES_AGENT", "Sales Agent", ["leads:read", "leads:create", "leads:update", "leads:import", "leads:convert", "leads:assign", "contacts:read", "contacts:create", "contacts:update", "onboarding:create", "tasks:read", "tasks:create", "tasks:update", "tickets:read", "notifications:read"], "OWN_TEAM"],
    ["SOLICITOR_FIRM_ADMIN", "Solicitor Firm Admin", ["users:read", "users:create", "users:update", "organisation:read", "organisation:update", "cases:read", "cases:create", "documents:read", "documents:create", "documents:download", "reports:read", "tasks:read", "tasks:create", "tickets:read", "tickets:create", "appointments:read", "finance:read", "quotations:read", "invoices:read", "notifications:read"], "ORGANISATION"],
    ["SOLICITOR", "Solicitor", ["cases:read", "cases:create", "documents:read", "documents:create", "documents:download", "reports:read", "tasks:read", "tickets:read", "tickets:create", "appointments:read", "finance:read", "quotations:read", "invoices:read", "notifications:read"], "ORGANISATION"],
    ["PSYCHOLOGIST", "Psychologist / Expert", ["users:update", "cases:read", "cases:update", "reports:read", "reports:create", "documents:read", "documents:create", "documents:download", "appointments:read", "appointments:create", "appointments:update", "tasks:read", "tasks:update", "tickets:read", "tickets:create", "finance:read", "notifications:read"], "CASE_ASSIGNED"],
    ["INDIVIDUAL_CLIENT", "Individual Client", ["users:update", "cases:read", "cases:create", "reports:read", "documents:read", "documents:create", "documents:download", "appointments:read", "tickets:read", "tickets:create", "finance:read", "invoices:read", "onboarding:read", "onboarding:create", "notifications:read"], "OWN"],
  ];

  const roles = roleDefs.map(([name, displayName, perms, defaultScope]) => ({
    name,
    displayName,
    permissionKeys: perms,
    permissions: perms.map((permission) => ({ permission, scope: defaultScope })),
    defaultScope,
    active: true,
    description: `${displayName} role for the Bright Mind platform.`,
    demo: true,
    createdAt: daysAgo(45),
    updatedAt: daysAgo(45),
  }));
  await insert("roles", roles);
  console.log(`Inserted ${roles.length} demo roles.`);

  // ---------------------------------------------------------------------
  // 12. Bump idSequences so future nextId() calls never collide with demo IDs
  // ---------------------------------------------------------------------
  const seqTargets = [
    ["USR", "users", "userId", "BM-USR-", false],
    ["CASE", "cases", "caseId", "BM-CASE-", true],
    ["LEAD", "leads", "leadId", "BM-LEAD-", false],
    ["QL", "qualifiedleads", "qualifiedId", "BM-QL-", true],
    ["CON", "contacts", "contactId", "BM-CON-", false],
    ["ORG", "organisations", "orgId", "BM-ORG-", false],
    ["SOL", "solicitors", "solicitorId", "BM-SOL-", false],
    ["PSY", "psychologists", "psychologistId", "BM-PSY-", false],
    ["CLI", "individualclients", "clientId", "BM-CLI-", false],
    ["DOC", "documents", "documentId", "BM-DOC-", false],
    ["APT", "appointments", "appointmentId", "BM-APT-", true],
    ["TSK", "tasks", "taskId", "BM-TSK-", true],
    ["TKT", "tickets", "ticketId", "BM-TKT-", true],
    ["RPT", "reports", "reportId", "BM-RPT-", true],
    ["QUO", "quotations", "quotationId", "BM-QUO-", false],
    ["INV", "invoices", "invoiceId", "BM-INV-", false],
    ["PAY", "payments", "paymentId", "BM-PAY-", false],
    ["ONB", "onboardings", "onboardingId", "BM-ONB-", false],
    ["CMP", "campaigns", "campaignId", "BM-CMP-", false],
  ];

  const maxNum = (id, prefix) => {
    if (typeof id !== "string" || !id.startsWith(prefix)) return 0;
    const m = id.slice(prefix.length).match(/(\d+)$/);
    return m ? parseInt(m[1], 10) : 0;
  };

  for (const [key, coll, field, prefix, yearBased] of seqTargets) {
    let max = 0;
    try {
      const docs = await db.collection(coll).find({ [field]: { $exists: true } }, { projection: { [field]: 1 } }).toArray();
      for (const d of docs) {
        const n = maxNum(d[field], prefix);
        if (n > max) max = n;
      }
    } catch (e) {
      console.warn(`  ! could not scan ${coll}: ${e.message}`);
    }
    const year = yearBased ? now.getFullYear() : undefined;
    const keyName = yearBased ? `${key}-${year}` : key;
    const doc = await db.collection("idsequences").findOne({ key: keyName });
    const current = doc?.currentNumber ?? 0;
    const target = Math.max(current, max);
    const ts = new Date();
    if (!doc) {
      await db.collection("idsequences").insertOne({
        key: keyName,
        currentNumber: target,
        prefix: prefix.slice(0, -1),
        yearBased,
        year,
        createdAt: ts,
        updatedAt: ts,
      });
      console.log(`  sequence created ${keyName} = ${target}`);
    } else if (target > current) {
      await db.collection("idsequences").updateOne({ key: keyName }, { $set: { currentNumber: target, updatedAt: ts } });
      console.log(`  sequence bumped ${keyName} ${current} -> ${target}`);
    }
  }

  console.log("");
  console.log("Demo data seeding complete.");
  console.log("Demo password for all accounts: " + DEMO_PASSWORD);
  console.log("Users: system.admin, operations, caseworker, quality.review, finance, marketing, sales.manager, sales.agent, firm.admin, solicitor, psychologist, psychologist2, client, client2 @demo.brightmind.local");

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
