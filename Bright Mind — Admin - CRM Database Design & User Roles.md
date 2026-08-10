# Bright Mind — Admin / CRM Database Design & User Roles

## 1. Recommended Architecture

Use one central database:

```text
                    Bright Mind Platform
                           │
             ┌─────────────┴─────────────┐
             │                           │
        Public Website              Admin / CRM
             │                           │
        Lead Capture            Staff / Sales / Operations
             │                           │
             └─────────────┬─────────────┘
                           │
                    Central Identity
                           │
       ┌───────────────────┼────────────────────┐
       │                   │                    │
   Partners             Clients             Employees
       │                   │                    │
 Solicitors          Individuals          Internal Staff
 Psychologists
       │                   │
       └─────────── Cases / Documents ─────────┘
```

The handout requires the CRM and operational portal to share the same contact, organisation, identity, task, ticket, document and audit architecture rather than creating disconnected systems.

---

# 2. Main MongoDB Collections

Recommended collections:

```text
users
roles
permissions
organisations
contacts
leads
qualifiedLeads
campaigns
leadActivities
onboardings
cases
caseAssignments
caseParticipants
documents
documentPermissions
documentVersions
tasks
tickets
ticketMessages
appointments
reports
reportVersions
reportReviews
quotations
invoices
payments
notifications
auditLogs
settings
idSequences
```

---

# 3. Users

Collection:

```text
users
```

Purpose: Central authentication and identity record for every portal user.

```js
{
  _id: ObjectId,
  userId: "BM-USR-000001",

  email: "user@example.com",
  passwordHash: "...",

  firstName: "John",
  lastName: "Smith",
  phone: "+44...",
  
  userType: "EMPLOYEE",
  // EMPLOYEE | PARTNER | PSYCHOLOGIST | CLIENT

  roleIds: [
    ObjectId("...")
  ],

  organisationId: ObjectId("..."),

  contactId: ObjectId("..."),

  status: "ACTIVE",
  // INVITED | ACTIVE | SUSPENDED | DISABLED

  mfaEnabled: true,

  lastLoginAt: Date,

  createdAt: Date,
  updatedAt: Date
}
```

Every user receives an immutable system-generated User ID such as:

```text
BM-USR-000001
```

This follows the identifier framework in the handout.

---

# 4. Roles

Collection:

```text
roles
```

Recommended roles:

### Internal

```text
MASTER_ADMIN
SYSTEM_ADMIN
OPERATIONS
CASEWORKER
QUALITY_REVIEW
FINANCE
MARKETING
SALES_MANAGER
SALES_AGENT
```

### Partner

```text
SOLICITOR_FIRM_ADMIN
SOLICITOR_USER
HCPC_PSYCHOLOGIST
```

### Client

```text
INDIVIDUAL_CLIENT
```

The handout explicitly defines these user groups and roles.

Example:

```js
{
  _id: ObjectId,
  name: "SALES_AGENT",
  displayName: "Sales Agent",

  permissions: [
    "lead.read",
    "lead.create",
    "lead.update",
    "lead.assign",
    "activity.create",
    "task.create",
    "task.read",
    "contact.read",
    "onboarding.create"
  ],

  scope: "OWN_TEAM",

  active: true
}
```

---

# 5. Permission System

Do not hard-code every permission directly into the frontend.

Use:

```text
Role
   ↓
Permissions
   ↓
Resource
   ↓
Action
   ↓
Scope
```

Permission format:

```text
resource.action
```

Examples:

```text
user.read
user.create
user.update
user.delete

lead.read
lead.create
lead.update
lead.assign
lead.import
lead.convert

contact.read
contact.create
contact.update

organisation.read
organisation.create
organisation.update

case.read
case.create
case.update
case.assign

document.read
document.upload
document.download
document.delete
document.release

task.read
task.create
task.update
task.assign

ticket.read
ticket.create
ticket.update

report.read
report.upload
report.review
report.approve
report.release

finance.read
invoice.create
payment.update

audit.read
export.create
```

---

# 6. Permission Scope

Every permission should also have a scope.

```text
ALL
OWN
OWN_TEAM
ASSIGNED
ORGANISATION
CASE_ASSIGNED
OWN_PROFILE
```

Example:

```text
Sales Agent
lead.read       → OWN_TEAM
lead.update     → OWN
lead.assign     → OWN_TEAM
case.read       → ASSIGNED
```

This is important because the handout says employees have access according to role, team, organisation and case assignment.

---

# 7. Organisations

Collection:

```text
organisations
```

Used for:

- Solicitor firms
- Partner organisations
- Other professional organisations

```js
{
  _id: ObjectId,
  organisationId: "BM-ORG-000001",

  name: "ABC Solicitors",

  type: "SOLICITOR_FIRM",

  registrationNumber: "...",
  website: "...",

  email: "...",
  telephone: "...",

  address: {
    line1: "...",
    city: "...",
    postcode: "...",
    country: "UK"
  },

  billing: {
    billingEmail: "...",
    address: {}
  },

  status: "ACTIVE",

  createdAt: Date,
  updatedAt: Date
}
```

---

# 8. Contacts

Collection:

```text
contacts
```

A contact is the CRM person record.

```js
{
  _id: ObjectId,
  contactId: "BM-CON-000001",

  firstName: "John",
  lastName: "Smith",

  email: "john@example.com",
  telephone: "+44...",

  jobTitle: "Solicitor",

  organisationId: ObjectId("..."),

  contactType: "PROFESSIONAL",

  preferredContactMethod: "EMAIL",

  address: {},

  marketing: {
    optedIn: true,
    doNotContact: false
  },

  createdAt: Date,
  updatedAt: Date
}
```

---

# 9. Leads

Collection:

```text
leads
```

Every website form, manual entry or imported lead creates a CRM lead.

```js
{
  _id: ObjectId,
  leadId: "BM-LEAD-000001",

  leadType: "SOLICITOR",

  contactId: ObjectId("..."),
  organisationId: ObjectId("..."),

  ownerId: ObjectId("..."),
  teamId: ObjectId("..."),

  status: "NEW",

  priority: "HIGH",

  source: "WEBSITE",
  campaignId: ObjectId("..."),
  landingPage: "/for-solicitors",

  serviceInterest: "PSYCHOLOGICAL_REPORT",

  requirement: "...",
  timescale: "...",

  qualification: {
    score: 80,
    authority: true,
    suitability: true,
    reason: "..."
  },

  expectedConversionDate: Date,

  createdAt: Date,
  updatedAt: Date
}
```

Lead stages should follow:

```text
NEW
ASSIGNED
CONTACT_ATTEMPTED
CONTACT_ESTABLISHED
NEEDS_IDENTIFIED
QUALIFIED
CONSULTATION
PROPOSAL_SENT
ONBOARDING
CONVERTED
FUTURE_OPPORTUNITY
UNQUALIFIED
LOST
```

These stages directly follow the handout's CRM funnel.

---

# 10. Qualified Leads

Collection:

```text
qualifiedLeads
```

Do not overwrite the original Lead ID.

```js
{
  _id: ObjectId,

  qualifiedLeadId: "BM-QL-2026-000001",

  leadId: ObjectId("..."),

  qualificationDate: Date,

  qualificationReason: "...",

  qualificationScore: 85,

  converted: false,

  createdAt: Date
}
```

The handout specifically requires a separate Qualified Lead Number when a lead becomes qualified.

---

# 11. Lead Activities

Collection:

```text
leadActivities
```

```js
{
  _id: ObjectId,

  leadId: ObjectId("..."),

  type: "CALL",
  // CALL | EMAIL | MEETING | WHATSAPP | NOTE

  subject: "...",
  description: "...",

  performedBy: ObjectId("..."),

  activityDate: Date,

  nextAction: "...",

  nextActionDate: Date,

  attachments: [],

  createdAt: Date
}
```

---

# 12. Onboarding

Collection:

```text
onboardings
```

Supports:

```text
SOLICITOR_FIRM
HCPC_PSYCHOLOGIST
INDIVIDUAL_CLIENT
```

```js
{
  _id: ObjectId,

  onboardingId: "BM-ONB-000001",

  leadId: ObjectId("..."),

  type: "HCPC_PSYCHOLOGIST",

  status: "IN_PROGRESS",

  organisationId: ObjectId("..."),
  userId: ObjectId("..."),

  checklist: [
    {
      name: "HCPC Registration",
      completed: true
    },
    {
      name: "Insurance",
      completed: false
    },
    {
      name: "CV",
      completed: true
    }
  ],

  approvedBy: ObjectId("..."),
  approvedAt: Date,

  createdAt: Date,
  updatedAt: Date
}
```

---

# 13. Cases

Collection:

```text
cases
```

```js
{
  _id: ObjectId,

  caseId: "BM-CASE-2026-000001",

  caseType: "PSYCHOLOGICAL_REPORT",

  status: "NEW_INSTRUCTION",

  clientId: ObjectId("..."),

  instructingOrganisationId: ObjectId("..."),

  leadId: ObjectId("..."),

  reportType: "PSYCHOLOGICAL_ASSESSMENT",

  deadline: Date,

  quotationId: ObjectId("..."),

  assignedCaseworkerId: ObjectId("..."),

  assignedPsychologistId: ObjectId("..."),

  priority: "HIGH",

  createdAt: Date,
  updatedAt: Date
}
```

Case stages:

```text
NEW_INSTRUCTION
INITIAL_REVIEW
QUOTATION_APPROVAL
PSYCHOLOGIST_ALLOCATION
ASSESSMENT
REPORT_PREPARATION
QUALITY_REVIEW
FINAL_RELEASE
CLOSURE
ARCHIVED
```

These correspond to the psychological-report case workflow in the handout.

---

# 14. Case Assignments

Collection:

```text
caseAssignments
```

```js
{
  _id: ObjectId,

  caseId: ObjectId("..."),

  userId: ObjectId("..."),

  assignmentType: "PSYCHOLOGIST",

  assignedBy: ObjectId("..."),

  assignedAt: Date,

  acceptedAt: Date,

  declinedAt: Date,

  status: "ACTIVE"
}
```

This is important for enforcing:

```text
Psychologist → assigned cases only
Caseworker → assigned/team cases
```

---

# 15. Case Participants

Collection:

```text
caseParticipants
```

```js
{
  _id: ObjectId,

  caseId: ObjectId("..."),

  userId: ObjectId("..."),

  organisationId: ObjectId("..."),

  participantType: "SOLICITOR",

  accessLevel: "AUTHORISED",

  active: true
}
```

This allows multiple people to participate in one case without giving everyone automatic access.

---

# 16. Documents

Collection:

```text
documents
```

```js
{
  _id: ObjectId,

  documentId: "BM-DOC-000001",

  caseId: ObjectId("..."),

  ownerUserId: ObjectId("..."),

  organisationId: ObjectId("..."),

  category: "FINAL_REPORT",

  title: "Psychological Report",

  currentVersion: 3,

  status: "RELEASED",

  visibility: "RESTRICTED",

  storageKey: "...",

  uploadedBy: ObjectId("..."),

  createdAt: Date,
  updatedAt: Date
}
```

Important:

**Uploading a document to a case must NOT automatically make it visible to every case participant.**

This is explicitly required by the handout.

---

# 17. Document Versions

Collection:

```text
documentVersions
```

```js
{
  _id: ObjectId,

  documentId: ObjectId("..."),

  version: 3,

  fileName: "report-v3.pdf",

  storageKey: "...",

  uploadedBy: ObjectId("..."),

  status: "FINAL",

  checksum: "...",

  createdAt: Date
}
```

Never overwrite an existing report version.

Use:

```text
v1 → Draft
v2 → Revised
v3 → Final
```

The previous versions remain immutable.

---

# 18. Document Permissions

Collection:

```text
documentPermissions
```

```js
{
  _id: ObjectId,

  documentId: ObjectId("..."),

  userId: ObjectId("..."),

  organisationId: ObjectId("..."),

  permissions: [
    "VIEW",
    "DOWNLOAD"
  ],

  grantedBy: ObjectId("..."),

  expiresAt: Date,

  createdAt: Date
}
```

Possible permissions:

```text
VIEW
DOWNLOAD
UPLOAD_VERSION
SHARE
```

---

# 19. Tasks

Collection:

```text
tasks
```

```js
{
  _id: ObjectId,

  taskId: "BM-TSK-2026-000001",

  title: "Review psychologist documents",

  description: "...",

  linkedType: "CASE",
  linkedId: ObjectId("..."),

  assignedTo: ObjectId("..."),

  assignedBy: ObjectId("..."),

  priority: "HIGH",

  status: "OPEN",

  dueDate: Date,

  completedAt: Date,

  createdAt: Date,
  updatedAt: Date
}
```

Tasks can link to:

```text
Lead
Organisation
Contact
Case
Document
Ticket
```

---

# 20. Tickets

Collection:

```text
tickets
```

```js
{
  _id: ObjectId,

  ticketId: "BM-TKT-2026-000001",

  subject: "Unable to download report",

  category: "DOCUMENT",

  priority: "HIGH",

  status: "OPEN",

  createdBy: ObjectId("..."),

  assignedTo: ObjectId("..."),

  organisationId: ObjectId("..."),

  caseId: ObjectId("..."),

  createdAt: Date,
  updatedAt: Date
}
```

Ticket messages:

```text
ticketMessages
```

```js
{
  _id: ObjectId,

  ticketId: ObjectId("..."),

  senderId: ObjectId("..."),

  message: "...",

  attachments: [],

  internal: false,

  createdAt: Date
}
```

---

# 21. Appointments

Collection:

```text
appointments
```

```js
{
  _id: ObjectId,

  appointmentId: "BM-APT-000001",

  caseId: ObjectId("..."),

  clientId: ObjectId("..."),

  psychologistId: ObjectId("..."),

  appointmentType: "ASSESSMENT",

  startAt: Date,
  endAt: Date,

  location: "ONLINE",

  status: "SCHEDULED",

  attendanceStatus: "PENDING",

  createdBy: ObjectId("..."),

  createdAt: Date
}
```

---

# 22. Reports

Collection:

```text
reports
```

```js
{
  _id: ObjectId,

  reportId: "BM-RPT-000001",

  caseId: ObjectId("..."),

  reportType: "PSYCHOLOGICAL_REPORT",

  psychologistId: ObjectId("..."),

  status: "QUALITY_REVIEW",

  currentVersion: 3,

  finalApprovedBy: ObjectId("..."),

  finalApprovedAt: Date,

  releasedAt: Date,

  releasedBy: ObjectId("..."),

  createdAt: Date
}
```

---

# 23. Report Reviews

Collection:

```text
reportReviews
```

```js
{
  _id: ObjectId,

  reportId: ObjectId("..."),

  version: 2,

  reviewerId: ObjectId("..."),

  status: "AMENDMENTS_REQUIRED",

  comments: "...",

  reviewedAt: Date
}
```

Workflow:

```text
Psychologist
     ↓
Draft Report
     ↓
Quality Reviewer
     ↓
Amendments
     ↓
Revised Report
     ↓
Quality Approval
     ↓
Final Report
     ↓
Authorised Admin
     ↓
Secure Release
```

Final report release must be restricted to authorised roles.

---

# 24. Finance

Collections:

```text
quotations
invoices
payments
```

Quotation:

```js
{
  _id: ObjectId,

  quotationId: "BM-QUO-000001",

  caseId: ObjectId("..."),

  organisationId: ObjectId("..."),

  clientId: ObjectId("..."),

  amount: 500,

  currency: "GBP",

  status: "APPROVED",

  issuedAt: Date,

  approvedAt: Date
}
```

Invoice:

```js
{
  _id: ObjectId,

  invoiceId: "BM-INV-000001",

  caseId: ObjectId("..."),

  quotationId: ObjectId("..."),

  amount: 500,

  paidAmount: 500,

  balance: 0,

  status: "PAID",

  dueDate: Date
}
```

---

# 25. Notifications

Collection:

```text
notifications
```

```js
{
  _id: ObjectId,

  userId: ObjectId("..."),

  type: "TASK_ASSIGNED",

  title: "New Task",

  message: "A new task has been assigned to you.",

  entityType: "TASK",

  entityId: ObjectId("..."),

  read: false,

  emailSent: true,

  createdAt: Date
}
```

---

# 26. Audit Logs

Collection:

```text
auditLogs
```

This is mandatory for the system.

```js
{
  _id: ObjectId,

  auditId: "BM-AUD-000001",

  actorUserId: ObjectId("..."),

  action: "DOCUMENT_DOWNLOAD",

  resourceType: "DOCUMENT",

  resourceId: ObjectId("..."),

  oldValue: {},
  newValue: {},

  ipAddress: "...",

  userAgent: "...",

  metadata: {},

  createdAt: Date
}
```

Audit events should include:

```text
CREATE
UPDATE
DELETE
VIEW
DOWNLOAD
EXPORT
LOGIN
LOGOUT
PERMISSION_CHANGE
ASSIGN
REASSIGN
APPROVE
REJECT
CONVERT
RELEASE
STATUS_CHANGE
```

The handout specifically requires auditing of significant record changes, downloads, exports and permission updates.

---

# 27. ID Sequences

Collection:

```text
idSequences
```

```js
{
  _id: ObjectId,

  key: "LEAD",

  prefix: "BM-LEAD",

  currentNumber: 1254,

  yearBased: false,

  updatedAt: Date
}
```

For cases:

```text
BM-CASE-2026-000001
BM-CASE-2026-000002
```

For users:

```text
BM-USR-000001
BM-USR-000002
```

IDs should be generated server-side and never editable.

---

# 28. Admin / CRM Role Structure

## MASTER ADMIN

Highest level.

```text
Users                 FULL
Roles                 FULL
Permissions           FULL
Leads                 FULL
Contacts              FULL
Organisations         FULL
Onboarding            FULL
Cases                 FULL
Documents             FULL
Tasks                 FULL
Tickets               FULL
Appointments          FULL
Reports               FULL
Finance               FULL
Dashboards             FULL
Audit Logs             FULL
System Settings        FULL
Exports                FULL
```

The handout gives Master Admin system-wide visibility and configuration capability.

---

## SYSTEM ADMIN

```text
Users                 FULL
Roles                 FULL
Permissions           FULL
System Settings       FULL
Audit Logs            READ
CRM                   LIMITED
Cases                 LIMITED
Finance               LIMITED
```

Should normally not have unrestricted clinical access unless explicitly granted.

---

## OPERATIONS

```text
Contacts              READ/WRITE
Organisations         READ/WRITE
Onboarding            READ/WRITE
Cases                 READ/WRITE
Tasks                 READ/WRITE
Tickets               READ/WRITE
Documents             GOVERNED
Appointments          READ/WRITE
Reports               LIMITED
Finance               READ
```

---

## CASEWORKER

```text
Assigned Cases        READ/WRITE
Assigned Tasks        READ/WRITE
Case Documents        AUTHORIZED
Appointments          READ/WRITE
Tickets               READ/WRITE
Reports               OPERATIONAL ACCESS
Leads                 LIMITED
Finance               LIMITED
```

---

## QUALITY REVIEW

```text
Assigned Reports      READ/WRITE
Report Versions       READ
Report Review         CREATE/UPDATE
Clinical Documents    AUTHORIZED
Final Approval        YES
Final Release         ONLY IF GRANTED
Finance               NO
Sales CRM             NO
```

---

## FINANCE

```text
Quotations            READ/WRITE
Invoices              READ/WRITE
Payments              READ/WRITE
Cases                 LIMITED
Clients               LIMITED
Organisations         LIMITED
Reports               NO
Clinical Documents    NO
Sales Leads           LIMITED
```

---

## MARKETING

```text
Campaigns             FULL
Leads                 READ/WRITE
Lead Import           YES
Contacts              LIMITED
Analytics             YES
Marketing Preferences READ/WRITE
Clinical Records      NO
Psychological Reports NO
Cases                 NO
```

Sales/marketing users must not automatically receive access to clinical records or psychological reports.

---

## SALES MANAGER

```text
Team Leads            FULL
Sales Funnel          FULL
Lead Assignment       FULL
Lead Import           YES
Activities            FULL
Contacts              READ/WRITE
Onboarding            START
Tasks                 FULL TEAM
Sales Dashboard       FULL
Clinical Records      NO
Reports               NO
```

---

## SALES AGENT

```text
Own Leads             READ/WRITE
Own Activities        FULL
Team Leads            READ
Lead Qualification    YES
Lead Import           YES
Contacts              READ/WRITE
Onboarding            START
Tasks                 OWN/TEAM
Sales Dashboard       OWN
Cases                 LIMITED
Clinical Documents    NO
Psychological Reports NO
```

---

# 29. Solicitor Firm Admin

Scope:

```text
ORGANISATION
```

Can access:

```text
Own Firm              FULL
Firm Users            MANAGE
Firm Cases            READ
Firm Documents        AUTHORIZED
Tasks                 FIRM
Tickets               FIRM
Appointments          FIRM
Quotations            FIRM
Invoices               FIRM
Released Reports      DOWNLOAD
```

Cannot access:

```text
Other Firms
Internal Notes
Psychologist Compliance
Unauthorised Clinical Documents
```

The handout specifically states that a solicitor firm administrator can manage authorised users and access firm-owned cases, while remaining isolated from other firms.

---

# 30. Solicitor User

Scope:

```text
OWN
+
AUTHORISED FIRM CASES
```

Can:

```text
Create instructions
Create service requests
Upload documents
View authorised cases
View tasks
Open tickets
View appointments
View quotations/invoices
Download released reports
```

Cannot:

```text
Manage all firm users
View internal Bright Mind notes
View psychologist compliance
View unauthorised clinical documents
```

---

# 31. HCPC Psychologist

Scope:

```text
ASSIGNED_CASES
```

Can:

```text
Own Profile          FULL
Compliance            MANAGE
Availability          MANAGE
Assigned Cases        READ/WRITE
Assigned Documents   AUTHORIZED
Appointments          MANAGE
Tasks                 MANAGE
Tickets               MANAGE
Report Upload         YES
Report Revision       YES
Payment Status        LIMITED
```

Cannot:

```text
View unassigned cases
View another psychologist's cases
Release final reports
Access unrelated clinical records
```

The handout explicitly restricts psychologists to assigned cases and authorised documents.

---

# 32. Individual Client

Scope:

```text
OWN_PROFILE
OWN_CASES
OWN_DOCUMENTS
OWN_TICKETS
OWN_APPOINTMENTS
```

Can:

```text
Profile              FULL
Onboarding           FULL
Service Request      CREATE/READ
Documents            RELEASED ONLY
Appointments         READ
Tickets              CREATE/REPLY
Invoices             READ
Payments             READ
Final Reports        DOWNLOAD IF RELEASED
```

Cannot:

```text
Internal Notes
Draft Reports
Legal Correspondence
Third-Party Documents
Unauthorised Clinical Documents
Other Clients
Other Cases
```

This follows the client access restrictions in the handout.

---

# 33. Record-Level Security

The backend should check all four conditions:

```text
1. ROLE
2. ORGANISATION
3. ASSIGNMENT
4. DOCUMENT PERMISSION
```

Example:

```text
User requests Case BM-CASE-2026-000001
                │
                ▼
          Is user active?
                │
                ▼
          Check role
                │
                ▼
       Check organisation
                │
                ▼
        Check assignment
                │
                ▼
      Check case participant
                │
                ▼
       Check document ACL
                │
                ▼
             ALLOW
```

Never rely only on frontend route protection.

---

# 34. Recommended Admin CRM Menu

```text
Dashboard

CRM
 ├── Leads
 ├── Qualified Leads
 ├── Contacts
 ├── Organisations
 ├── Activities
 ├── Campaigns
 └── Import Leads

Sales
 ├── Pipeline
 ├── Follow-ups
 ├── Quotations
 └── Conversion

Onboarding
 ├── Solicitor Firms
 ├── Psychologists
 └── Individual Clients

Case Management
 ├── All Cases
 ├── My Cases
 ├── Assignments
 ├── Assessments
 ├── Reports
 ├── Quality Review
 └── Final Releases

Documents
 ├── All Documents
 ├── Categories
 ├── Pending Review
 └── Released Documents

Tasks
 ├── My Tasks
 ├── Team Tasks
 └── Overdue

Tickets
 ├── Open
 ├── Assigned
 ├── Escalated
 └── Resolved

Finance
 ├── Quotations
 ├── Invoices
 └── Payments

Users & Access
 ├── Users
 ├── Roles
 ├── Permissions
 ├── Organisations
 └── Access Requests

Marketing
 ├── Campaigns
 ├── Sources
 └── Lead Attribution

Reports & Analytics
 ├── Sales
 ├── CRM
 ├── Cases
 ├── Finance
 └── Staff Performance

System
 ├── Settings
 ├── ID Sequences
 ├── Notifications
 └── Audit Logs
```

---

# 35. Core Relationships

```text
USER
 │
 ├──────── ROLE
 │
 ├──────── CONTACT
 │
 └──────── ORGANISATION
                  │
                  └──── USERS
                  │
                  └──── LEADS
                  │
                  └──── CASES


LEAD
 │
 ├──── CONTACT
 ├──── ORGANISATION
 ├──── ACTIVITIES
 ├──── TASKS
 └──── ONBOARDING
             │
             └──── USER
                    │
                    └──── CASE


CASE
 │
 ├──── CLIENT
 ├──── ORGANISATION
 ├──── CASE ASSIGNMENTS
 ├──── CASE PARTICIPANTS
 ├──── DOCUMENTS
 │       └──── DOCUMENT VERSIONS
 │       └──── DOCUMENT PERMISSIONS
 │
 ├──── TASKS
 ├──── TICKETS
 ├──── APPOINTMENTS
 ├──── REPORT
 │       └──── REPORT VERSIONS
 │       └──── REPORT REVIEWS
 │
 └──── FINANCE
         ├──── QUOTATION
         ├──── INVOICE
         └──── PAYMENT
```

---

# 36. Critical Security Rules

### Rule 1 — Never trust frontend permissions

Every API request must perform authorization server-side.

### Rule 2 — Organisation isolation

```text
Solicitor Firm A
       ↓
Only Firm A records

Solicitor Firm B
       ↓
Only Firm B records
```

### Rule 3 — Psychologist isolation

```text
Psychologist A
       ↓
Assigned Cases Only
```

### Rule 4 — Client isolation

```text
Client A
       ↓
Own Records Only
```

### Rule 5 — Draft report protection

```text
DRAFT
 ↓
Psychologist + authorised reviewer

FINAL
 ↓
Authorised release role

RELEASED
 ↓
Only authorised recipients
```

### Rule 6 — Audit everything important

At minimum:

```text
Login
Logout
Create
Update
Delete
View
Download
Export
Assign
Reassign
Approve
Reject
Release
Permission Change
Role Change
Status Change
```

---

# 37. Recommended Indexes

MongoDB indexes should include:

```text
users:
  userId
  email UNIQUE
  organisationId
  roleIds
  status

contacts:
  contactId UNIQUE
  email
  telephone
  organisationId

organisations:
  organisationId UNIQUE
  name
  type

leads:
  leadId UNIQUE
  email
  telephone
  organisationId
  ownerId
  status
  source
  campaignId

qualifiedLeads:
  qualifiedLeadId UNIQUE
  leadId UNIQUE

cases:
  caseId UNIQUE
  clientId
  instructingOrganisationId
  assignedPsychologistId
  assignedCaseworkerId
  status

documents:
  documentId UNIQUE
  caseId
  organisationId
  status

tasks:
  taskId UNIQUE
  assignedTo
  status
  dueDate

tickets:
  ticketId UNIQUE
  assignedTo
  status

auditLogs:
  actorUserId
  resourceType
  resourceId
  action
  createdAt
```

For global search, use MongoDB text/search indexing for:

```text
IDs
Names
Email
Telephone
Organisation
Case Reference
Document Title
```

The handout requires permission-aware global search across these types of identifiers and records.

---

# 38. Final Access Hierarchy

```text
MASTER ADMIN
    │
    ├── SYSTEM ADMIN
    │
    ├── OPERATIONS
    │      ├── CASEWORKER
    │      └── QUALITY REVIEW
    │
    ├── FINANCE
    │
    ├── MARKETING
    │
    └── SALES
           ├── SALES MANAGER
           └── SALES AGENT


EXTERNAL
    │
    ├── SOLICITOR FIRM
    │      ├── FIRM ADMIN
    │      └── SOLICITOR USER
    │
    ├── HCPC PSYCHOLOGIST
    │
    └── INDIVIDUAL CLIENT
```

## Recommended implementation principle

Use **RBAC + ABAC**:

```text
RBAC
Role → Permission

+
 
ABAC
User → Organisation
User → Team
User → Case Assignment
User → Document Permission
User → Record Ownership
```

This is preferable to a simple `isAdmin=true/false` system because the Bright Mind platform has multiple internal roles, professional partners, organisations, case assignments and restricted clinical documents.

The source handout's acceptance criteria require that users can only view records permitted by **role, organisation, assignment and document-level permission**, and that every important change/download/export/permission update is auditable.