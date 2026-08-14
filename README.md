# Bright Mind — OpenCode CLI Short Specification

Build a production-ready **Bright Mind Psychology Care and Reporting** platform using:

* Next.js App Router + TypeScript
* MongoDB + Mongoose
* Tailwind CSS + shadcn/ui
* React Hook Form + Zod
* Secure authentication + RBAC
* Responsive desktop/tablet/mobile UI
* Secure object storage for documents

## Setup

Copy `.env.example` to `.env` and fill in your own values. **Never** commit
real credentials (MongoDB URIs, passwords, secrets) to this repository.

## Maintenance scripts

* `npm run create-admin` — bootstrap a MASTER_ADMIN account.
* `node scripts/repair-id-sequences.cjs` — one-off repair if the `idsequences`
  counters ever drift behind existing record IDs (safe to re-run; only moves
  counters forward).

## Deployment (Firebase App Hosting)

This app is a full-stack Next.js app (server actions, dynamic routes, MongoDB), so it
is deployed to **Firebase App Hosting** — not static hosting.

Config lives in `.firebaserc` (project `bright-mind-d0cd2`) and `apphosting.yaml`
(runtime + env vars). The Firebase CLI is already authenticated on the developer
machine (`firebase login:list`).

**One-time setup (requires the project on the Blaze plan):**

1. Upgrade the project to Blaze (pay-as-you-go):
   https://console.firebase.google.com/project/bright-mind-d0cd2/usage/details
2. Create the App Hosting backend:
   ```bash
   firebase apphosting:backends:create \
     --project bright-mind-d0cd2 \
     --app 1:271763270785:web:f77e0977f31e038450f180 \
     --backend bright-mind \
     --primary-region europe-west1 \
     --non-interactive
   ```
3. Store the secrets referenced in `apphosting.yaml` and grant the backend access:
   ```bash
   firebase apphosting:secrets:set bright-mind-mongodb-uri
   firebase apphosting:secrets:set bright-mind-session-secret
   firebase apphosting:secrets:grantaccess \
     bright-mind-mongodb-uri,bright-mind-session-secret \
     --backend bright-mind
   ```

**Deploy:** `npm run deploy` (runs `firebase deploy --only apphosting` from the
local checkout, which builds on Cloud Build and rolls out the new backend).

> Note: `NEXT_PUBLIC_FIREBASE_*` values in `apphosting.yaml` are the public web-app
> config (safe to commit). `MONGODB_URI` and `SESSION_SECRET` must stay in Secret
> Manager — never inline them.

### Alternative: classic Hosting + Cloud Functions (also Blaze-only)

`firebase.json` also carries a classic-hosting block pinned to the site
`bright-mind-d0cd2-ecd2e`, configured with `"source": "."` and a
`frameworksBackend` so `firebase deploy --only hosting` builds and serves the real
Next.js app instead of the static `public/` folder. The `webframeworks` Firebase
experiment must be enabled locally (`firebase experiments:enable webframeworks`).

**Do not deploy the `public/` folder as a static site** — it only contains Next.js
asset files (images/video) with no `index.html`, which yields the Firebase
"Page Not Found" page. Deploying this app also requires the Blaze plan (Cloud
Functions), and on Windows the framework build step needs Developer Mode enabled
(or an elevated terminal) because it creates symlinks.

## 1. System

Build one unified platform containing:

```text
Public Website
     +
CRM/Admin Portal
     +
Solicitor Portal
     +
Psychologist/Expert Portal
     +
Individual Client Portal
     +
Case & Report Management
     +
Secure Documents
     +
Tasks/Tickets/Appointments
     +
Audit Logs
```

Do NOT create disconnected systems.

---

## 2. Public Website

Pages:

* Home
* About
* Services
* For Solicitors
* For Psychologists
* For Individuals
* How It Works
* FAQs
* Contact
* Login

Forms:

* Request a Report
* Solicitor Partnership Enquiry
* Join Psychologist Network
* Individual Client Enquiry
* Request a Callback
* General Contact

Every form creates/updates a CRM Lead and records source, campaign and landing page.

---

## 3. User Roles

### Internal

* Master Admin
* System Admin
* Operations
* Caseworker
* Quality Review
* Finance
* Marketing
* Sales Manager
* Sales Agent

### External

* Solicitor Firm Admin
* Solicitor User
* HCPC-Registered Psychologist / Expert
* Individual Client

Use **Individual Client**, not Patient.

---

## 4. Unique IDs

Generate immutable IDs:

```text
BM-USR-000001
BM-LEAD-000001
BM-QL-2026-000001
BM-CON-000001
BM-ORG-000001
BM-SOL-000001
BM-PSY-000001
BM-CLI-000001
BM-CASE-2026-000001
BM-TSK-2026-000001
BM-TKT-2026-000001
```

---

## 5. Psychologist Registration

Flow:

```text
Join Psychologist Network
        ↓
Application
        ↓
Compliance Review
        ↓
Approved?
   ↓          ↓
No           Yes
             ↓
       Psychologist ID
             ↓
         User Account
             ↓
        Portal Access
```

Collect:

* Name/contact
* HCPC number
* Qualifications
* CV
* Professional indemnity insurance
* Expertise
* Countries/jurisdictions
* Availability
* Compliance documents

Statuses:

`Pending → Under Review → More Information Required → Approved/Rejected/Suspended`

Only approved psychologists receive case offers.

---

## 6. Solicitor Portal

Solicitors can:

* Manage authorised profile/users
* Create instructions
* Upload documents
* View own firm's cases
* View case status
* Manage tasks
* View appointments
* Open tickets
* View quotations/invoices
* Download released reports

Never expose another firm's data.

---

## 7. Psychologist Portal

Psychologists can:

* Manage profile
* HCPC/compliance information
* Expertise/availability
* Receive case offers
* Accept/decline cases
* Conflict check
* View assigned cases
* Manage appointments
* Upload reports
* Respond to quality review
* View payment status if enabled

A psychologist can ONLY access assigned/authorised cases.

---

## 8. Individual Client Portal

Clients can:

* Manage profile
* Submit service requests
* View own cases
* Upload documents
* View appointments
* Open tickets
* View payment status
* Download released reports

Never expose internal notes, drafts, legal correspondence or unauthorised third-party documents.

---

## 9. CRM

Implement:

* Lead capture
* Manual lead creation
* CSV/XLS/XLSX import
* Column mapping
* Validation
* Duplicate detection
* Assignment
* Sales funnel
* Activities
* Calls/emails/meetings/notes
* Follow-ups
* Tasks
* Qualification
* Conversion

Lead funnel:

```text
New
→ Assigned
→ Contact Attempted
→ Contact Established
→ Needs Identified
→ Qualified
→ Consultation
→ Proposal Sent
→ Onboarding
→ Converted
```

Also support:

`Future Opportunity / Unqualified / Lost`

Lost leads require a reason.

---

## 10. Onboarding

### Solicitor

```text
Qualified Lead
→ Organisation
→ Contact
→ Firm/Billing Details
→ Approval
→ Solicitor ID
→ User Account
→ Portal
```

### Psychologist

```text
Qualified Lead
→ Profile
→ HCPC
→ Qualifications
→ CV
→ Insurance
→ Expertise
→ Availability
→ Compliance
→ Approval
→ Psychologist ID
→ Portal
```

### Individual Client

```text
Enquiry
→ Personal/Service Details
→ Consent
→ Suitability
→ Quotation/Payment
→ Client ID
→ Portal
→ Service Case
```

---

## 11. Case Workflow

Implement:

```text
New Instruction
→ Initial Review
→ Quotation/Approval
→ Psychologist Allocation
→ Assessment
→ Report Preparation
→ Quality Review
→ Secure Release
→ Closure
```

Case contains:

* Case ID
* Client
* Instructing party
* Organisation
* Service/report type
* Deadline
* Psychologist
* Caseworker
* Reviewer
* Documents
* Tasks
* Appointments
* Finance
* Audit history

---

## 12. Expert Allocation

Admin/Caseworker:

* Filter approved experts
* Filter expertise/country
* Check availability
* Conflict check
* Send case offer
* Assign expert

Statuses:

`Offered / Accepted / Declined / Expired / Conflict / Assigned`

---

## 13. Report Management

Support:

```text
Draft
→ Quality Review
→ Amendment
→ Revised Version
→ Approval
→ Final
→ Secure Release
```

Never overwrite previous report versions.

Only authorised roles can approve/release final reports.

---

## 14. Documents

Implement secure document management:

* Upload
* Download
* Versioning
* Categories
* Case association
* Organisation association
* User association
* Document-level permissions
* Access/download logging

Store files in secure object storage, not directly in MongoDB.

---

## 15. Tasks / Tickets / Notifications

Tasks:

* Assign
* Priority
* Due date
* Reminder
* Status
* Link to Lead/Case/User/Document

Tickets:

* Category
* Priority
* Assignee
* Messages
* Attachments
* Escalation
* Resolution history

Notifications:

* Lead assignment
* Case assignment
* Case offer
* Appointment
* Information request
* Report update
* Quality review
* Report release
* Ticket/payment update

---

## 16. Security

This system handles sensitive psychological information.

Implement:

* Secure authentication
* Password hashing
* MFA for internal/professional users
* RBAC
* Organisation-level permissions
* Case-level permissions
* Document-level permissions
* Secure sessions
* Rate limiting
* Input validation
* Secure headers
* Encryption in transit/at rest where supported
* Audit logging
* Backup/recovery
* Data retention/archival
* UK GDPR-aware architecture

Critical rule:

```text
Solicitor A ≠ Solicitor B data
Psychologist A ≠ Psychologist B cases
Client A ≠ Client B data
Unreleased Report ≠ Downloadable
Sales User ≠ Unauthorised Clinical Data
```

---

## 17. MongoDB Collections

Create appropriate models for:

```text
users
roles
permissions
leads
qualifiedLeads
contacts
organisations
solicitors
psychologists
individualClients
cases
caseAssignments
documents
documentVersions
reports
reportReviews
appointments
tasks
tickets
notifications
quotations
invoices
payments
activities
auditLogs
campaigns
formSubmissions
```

Add indexes for IDs, email, phone, organisation, HCPC number, case, status and assignments.

---

## 18. Dashboard

Create role-specific dashboards.

### Admin

Users, leads, cases, reports, finance, tasks, tickets, system activity.

### Sales

Leads, pipeline, follow-ups, conversions.

### Caseworker

Cases, deadlines, allocations, documents, reviews.

### Psychologist

Offers, assigned cases, appointments, reports, reviews.

### Solicitor

Firm cases, tasks, appointments, documents, reports.

### Individual

Service request, appointment, documents, released reports.

---

## 19. Search

Global permission-aware search:

* IDs
* Names
* Organisation
* Email
* Phone
* HCPC number
* Case
* Document title

Never return unauthorised records.

---

## 20. Architecture

Use clean separation:

```text
app/
components/
lib/
models/
services/
repositories/
types/
hooks/
```

Keep business logic out of UI components.

Use:

* Zod validation
* Service layer
* Repository/database layer
* Central permission middleware
* Central audit service

---

## 21. Development Instructions

Before coding:

1. Inspect existing repository.
2. Preserve useful existing code.
3. Create implementation plan.
4. Set up Next.js/TypeScript.
5. Configure MongoDB.
6. Build authentication/RBAC first.
7. Build public website.
8. Build CRM.
9. Build onboarding.
10. Build portals.
11. Build case/report workflow.
12. Build documents/audit.
13. Add tests.
14. Run lint/type-check/build.
15. Fix all errors.

Do not create fake/mock functionality unless explicitly marked as development-only.

Use `.env.example`; never commit credentials.

---

## 22. Delivery Priority

Implement in this order:

**Phase 1:** Foundation + Auth + RBAC + Website

**Phase 2:** CRM + Leads + Sales + Onboarding

**Phase 3:** Solicitor + Psychologist + Individual portals

**Phase 4:** Cases + Expert allocation + Reports + Quality Review + Secure Release

**Phase 5:** Email + Calendar + Payment + Accounting + E-signature + Analytics

---

## Final Objective

Create a secure, scalable Bright Mind platform:

```text
Website
   ↓
CRM
   ↓
Onboarding
   ↓
Portal
   ↓
Case
   ↓
Expert
   ↓
Assessment
   ↓
Report
   ↓
Quality Review
   ↓
Secure Release
   ↓
Audit / Closure
```

Prioritise **security, permission isolation, data integrity and maintainability** over unnecessary visual features.

Start by inspecting the repository and implement the system incrementally.
