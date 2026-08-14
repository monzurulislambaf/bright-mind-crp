# Bright Mind Psychology — Website Update & Enhancement Prompt

You are an expert full-stack web developer, UI/UX designer, SEO specialist, and application architect.

Update the existing **Bright Mind Psychology** website using the attached project brief as the primary source of truth.

The website must look like a **credible, professional psychology organisation**, not simply a report-writing website. The architecture must also be prepared for a future CRM, case-management system, and secure client/solicitor portal.

---

## 1. MAIN OBJECTIVE

Redesign and update the existing website while preserving useful existing content and functionality.

The new website should communicate four major pillars:

1. Psychological Services
2. Expert & Forensic Psychology
3. Country Expertise
4. Training & Research

Primary CTAs:

- **Enquire / Book Psychological Services**
- **Instruct an Expert**

The public website should connect naturally to a future internal CRM where website enquiries become leads and can later become clients and cases.

---

## 2. IMPORTANT DEVELOPMENT RULE

Before changing anything:

1. Inspect the existing project.
2. Identify the current framework, components, routes, styling system, database/API structure and existing functionality.
3. Reuse existing components where appropriate.
4. Do not unnecessarily delete working functionality.
5. Preserve existing useful SEO metadata and content unless it conflicts with the new structure.
6. Refactor duplicated or poor-quality code.
7. Keep the application production-ready.
8. Do not create fake services, qualifications, registrations, statistics, testimonials, certifications or expert credentials.
9. If information is unavailable, create an appropriate editable placeholder rather than inventing facts.

---

# 3. WEBSITE STRUCTURE

Update/create these primary pages:

- Home
- Psychological Services
- Expert & Forensic Psychology
- Country Expertise
- Training & Research
- Our Experts
- About
- Insights
- Contact

The navigation should be simple, professional and mobile-friendly.

Recommended navigation:

**Home | Psychological Services | Expert & Forensic | Country Expertise | Training & Research | Our Experts | About | Insights | Contact**

Add prominent CTA buttons:

**Enquire / Book Psychological Services**

**Instruct an Expert**

---

# 4. HOME PAGE

Create a premium psychology-focused homepage.

### Hero Section

Use a professional, trustworthy headline such as:

**Psychology Expertise for Individuals, Professionals and Legal Services**

Supporting copy should communicate:

- Professional psychological services
- Expert and forensic psychology
- Country expertise
- Training and research

CTA buttons:

- Enquire / Book Psychological Services
- Instruct an Expert

Do not make unsupported claims.

### Homepage Sections

Include:

1. Hero
2. Introduction to Bright Mind
3. Four Core Service Pillars
4. Psychological Services
5. Expert & Forensic Psychology
6. Country Expertise
7. Our Experts
8. Training & Research
9. How It Works
10. Latest Insights
11. FAQs
12. Contact/Enquiry CTA
13. Professional footer

Use tasteful animations and transitions, but avoid excessive animation.

---

# 5. PSYCHOLOGICAL SERVICES

Create a dedicated Psychological Services section.

Possible service categories from the brief:

- Psychological Assessment
- Psychological Consultation
- Counselling / Psychological Support where genuinely provided
- Mental Health Assessment where professionally appropriate
- Psychological Wellbeing
- Remote Services where professionally appropriate

Each service page/card should explain:

- What it is
- Who it is for
- What it involves
- Who provides it
- Process
- Fees where appropriate
- FAQs
- Enquiry/booking route

Do not imply that Bright Mind provides a service unless the organisation can genuinely provide it.

---

# 6. EXPERT & FORENSIC PSYCHOLOGY

Create a clearly separated specialist division.

Include:

- Expert Psychological Reports
- Forensic Psychological Assessment
- Immigration & Asylum Psychological Evidence
- Mental Health Expert Evidence
- Court / Legal Expert Evidence
- Expert Consultation
- Reporting Process
- Instruct an Expert

This section must be presented as a **specialist division**, not as the entire identity of Bright Mind.

Create a strong CTA:

**Instruct an Expert**

The enquiry form should collect appropriate information without requesting unnecessary sensitive information through an insecure public form.

---

# 7. COUNTRY EXPERTISE

Create a professional country expertise directory.

Features:

- Country directory
- Country experts
- Mental-health system information
- Service availability
- Treatment accessibility
- Relevant contextual factors
- Sources
- Last reviewed/updated date
- Request Country Expert Evidence

Country information must be sourced, dated and reviewable.

Never fabricate country expertise or unsupported information.

---

# 8. TRAINING & RESEARCH

Create a Training & Research section containing:

- Professional psychology training
- Workshops
- Webinars
- Professional development where applicable
- Research
- Publications
- Psychology Insights

Training pages should support:

- Audience
- Objectives
- Duration
- Delivery method
- Trainer
- Certificate/CPD status where applicable
- Fee
- Date
- Registration/enquiry route

---

# 9. OUR EXPERTS

Create a professional expert directory.

Public expert profiles should support:

- Name
- Professional title
- Qualifications
- Registration body/number where appropriate
- Specialisms
- Country expertise
- Languages
- Public biography
- Professional profile
- Availability where appropriate

Keep public expert information separate from confidential internal verification information.

Do not invent expert credentials.

---

# 10. ABOUT PAGE

Create a professional About page explaining:

- Who Bright Mind is
- Mission
- Professional approach
- Psychology-focused services
- Expert/forensic division
- Country expertise
- Training/research
- Professional standards
- Contact/enquiry options

The tone should be authoritative, ethical, professional and reassuring.

---

# 11. INSIGHTS / BLOG

Create a scalable Insights system.

Support:

- Articles
- Psychology insights
- Research
- Professional updates
- Country expertise updates
- Training announcements

Each article should support:

- Title
- Featured image
- Author
- Publication date
- Updated date
- Category
- Tags
- SEO title
- Meta description
- Canonical URL
- Open Graph metadata
- Structured data

Avoid publishing medical or psychological claims that cannot be substantiated.

---

# 12. CONTACT & ENQUIRY SYSTEM

Create professional enquiry forms.

Different user journeys should be supported:

### Individual

Psychological Services → Enquiry/Booking → CRM Lead

### Solicitor

Expert & Forensic Psychology → Instruct an Expert → CRM Lead

### Legal Professional

Country Expertise → Country Expert Request → CRM Lead

### Psychologist

Join Expert Network → Expert Application → CRM

### Training Customer

Training → Register/Enquire → CRM

These user journeys are defined in the project brief.

---

# 13. CRM-READY ARCHITECTURE

Do not build the public website as an isolated contact-form website.

Design the application so enquiries can eventually create or update CRM records.

Example:

Website enquiry:

```text
Name
Contact Details
Requested Service
Source = Website
Date
Status = New Enquiry
```

CRM progression:

```text
New Enquiry
    ↓
Contacted
    ↓
Qualification / Initial Review
    ↓
Converted to Client
    ↓
Case Opened
    ↓
Active Case
    ↓
Completed
    ↓
Closed
```

The system must distinguish:

- Lead
- Client
- Case
- Solicitor
- Law Firm

Do not automatically convert every enquiry into a case.

---

# 14. FUTURE CRM / CASE MANAGEMENT PREPARATION

Architect the project so the following can later be added without rebuilding the public website:

### CRM

- Leads
- Clients
- Solicitors
- Law Firms
- Cases
- Experts
- Country Experts
- Documents
- Tasks
- Deadlines
- Communications
- Reports
- Status
- Audit history

### Case workflow

Support these statuses:

- New
- Instruction Pending
- Conflict Check
- Documents Awaited
- Expert Assigned
- Assessment Scheduled
- Assessment Completed
- Report Drafting
- Quality Review
- Finalised
- Delivered
- Closed

---

# 15. FUTURE SECURE PORTAL

Prepare the architecture for a future secure client/solicitor portal.

Future functionality:

- Secure login
- 2FA where appropriate
- Dashboard
- My Cases
- Documents
- Secure upload/download
- Messages
- Appointments
- Case status
- Reports
- Notifications

The architecture should allow this to be introduced later without rebuilding the entire system.

---

# 16. SECURITY

Treat psychological, medical and legal information as sensitive.

Implement architecture that supports:

- HTTPS/TLS
- Secure authentication
- Role-based permissions
- 2FA for administrators
- Protected document storage
- Audit logs
- Automated backups
- Disaster recovery
- Session/access controls
- Security monitoring
- Data retention/deletion policies

Never store sensitive case documents in a basic public website upload directory.

Do not expose confidential CRM or case data through public APIs.

---

# 17. ROLE-BASED ACCESS

Prepare role architecture for:

- Super Admin
- Management
- Case Manager
- Psychologist / Expert
- Country Expert
- Finance
- Solicitor
- Client

Each role must only access authorised information.

---

# 18. CMS

Create a manageable content architecture so administrators can eventually update:

- Services
- Experts
- Countries
- Training
- Articles
- FAQs
- Homepage content

Public website content must remain logically separated from private CRM/case information.

---

# 19. DESIGN SYSTEM

Create a premium professional visual identity.

Design requirements:

- Modern psychology/healthcare aesthetic
- Clean typography
- Generous whitespace
- Professional colour palette
- Excellent contrast
- Subtle animations
- Premium cards
- Clear CTA buttons
- Responsive navigation
- Accessible forms
- Professional icons
- High-quality imagery
- Mobile-first design

Avoid:

- Excessive gradients
- Excessive animations
- Generic AI-looking designs
- Overcrowded layouts
- Unprofessional stock imagery
- Fake testimonials
- Unsupported statistics
- Excessive decorative elements

The website should feel trustworthy enough for individuals, psychologists, legal professionals and solicitors.

---

# 20. RESPONSIVE DESIGN

The website must work correctly on:

- Mobile phones
- Tablets
- Laptops
- Desktop monitors
- Large screens

Test:

- Chrome
- Edge
- Firefox
- Safari where applicable
- Android browsers
- iOS Safari

No horizontal overflow.

---

# 21. ACCESSIBILITY

Implement:

- Semantic HTML
- Keyboard navigation
- Proper heading hierarchy
- Accessible forms
- ARIA where required
- Sufficient colour contrast
- Alt text
- Focus states
- Accessible navigation
- Reduced-motion support

---

# 22. SEO

Implement strong technical SEO.

Include:

- Unique title tags
- Meta descriptions
- Canonical URLs
- Open Graph
- Twitter/X metadata where appropriate
- XML sitemap
- robots.txt
- Clean URLs
- Semantic HTML
- Structured data
- Breadcrumbs
- Internal linking
- Image optimisation
- Fast loading
- Mobile optimisation
- Google Search Console compatibility
- Analytics integration architecture

Use appropriate structured data only where supported by the actual content.

---

# 23. PERFORMANCE

Optimise for excellent Core Web Vitals.

Implement:

- Image optimisation
- Lazy loading
- Code splitting where appropriate
- Optimised fonts
- Minimise unnecessary JavaScript
- Avoid unnecessary third-party scripts
- Efficient API requests
- Caching where appropriate
- Responsive images

The site should load quickly even on slower mobile connections.

---

# 24. CONTENT MANAGEMENT

Do not hard-code content unnecessarily.

Where the existing architecture supports it, create reusable data models/components for:

- Services
- Experts
- Countries
- Training
- Insights
- FAQs
- Testimonials only if verified
- Homepage sections

Make future CMS integration straightforward.

---

# 25. WEBSITE → CRM DATA FLOW

Prepare the architecture for:

```text
Public Website
      ↓
Enquiry Form
      ↓
Validation
      ↓
Secure API
      ↓
CRM Lead
      ↓
Qualification
      ↓
Client
      ↓
Case
      ↓
Expert
      ↓
Documents / Tasks / Reports
      ↓
Future Secure Portal
```

The target system described in the brief is:

```text
Public Psychology Website
        ↓
Website Enquiry
        ↓
Secure CRM
        ↓
Lead
        ↓
Client
        ↓
Case
        ↓
Expert
        ↓
Documents / Tasks / Reports
        ↓
Secure Portal
        ↓
Solicitor / Client
```



---

# 26. HOSTING & OWNERSHIP

Keep business-critical resources under Bright Mind's control:

- Domain
- Hosting
- Source repository
- CRM
- Database
- Analytics
- Storage
- Email/service accounts

The system should support data export if Bright Mind changes developer or hosting provider.

---

# 27. DEVELOPMENT PHASES

Structure the implementation so it can evolve through:

### Phase 1
Psychology-first public website

### Phase 2
Website → CRM integration

### Phase 3
Internal case management + secure document management

### Phase 4
Secure client/solicitor portal

### Phase 5
Advanced automation, reporting, booking/payment/calendar integrations where justified.

Do not overbuild Phase 3–5 functionality if it is not currently required.

---

# 28. FINAL IMPLEMENTATION TASK

After inspecting the existing project:

1. Create a clear implementation plan.
2. Identify existing pages/components that can be reused.
3. Identify outdated pages/content.
4. Implement the new information architecture.
5. Improve UI/UX.
6. Implement responsive layouts.
7. Improve SEO.
8. Improve accessibility.
9. Implement secure enquiry architecture.
10. Prepare CRM-ready data structures/API boundaries.
11. Ensure future portal compatibility.
12. Remove broken links and obsolete components.
13. Test every route.
14. Test all forms.
15. Test mobile responsiveness.
16. Test production build.
17. Fix TypeScript/lint/build errors.
18. Do not leave TODO placeholders for functionality that is explicitly required for the current website.
19. Do not invent business information.
20. Preserve a clean, maintainable and scalable codebase.

---

# 29. SUCCESS CRITERIA

The completed website should give visitors the impression:

> **“Bright Mind is a credible psychology organisation with qualified professionals, broad psychological services, and a specialist expert-evidence division.”**

This is the target visitor impression specified in the project brief.

The final implementation must be:

**Professional + Trustworthy + Accessible + SEO-friendly + Fast + Mobile-first + Secure + CRM-ready + Future-portal-ready**

Do not rebuild functionality unnecessarily. First understand the existing application, then make the update systematically.