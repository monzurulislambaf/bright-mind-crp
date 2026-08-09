# Bright Mind Psychology Care & Reporting

Build a **premium, modern, responsive Next.js website** for Bright Mind Psychology Care and Reporting.

Use `Bright_mind_frontend.md` as the **primary source of truth for all website content**. Do not invent company information, staff, testimonials, pricing, contact details, certifications, statistics, or unsupported claims.

---

## 1. Goal

Create a professional UK website for:

- Solicitors and barristers
- Legal professionals
- HCPC-registered psychologists
- Individual clients

Core message:

> Independent psychological and country expert evidence that legal professionals can rely on.

The design must communicate:

**Trust • Independence • Clinical Rigour • Legal Relevance • Confidentiality • Security**

---

## 2. Tech Stack

Use:

- Next.js latest stable
- App Router
- TypeScript
- Tailwind CSS
- shadcn/ui where useful
- Lucide React
- ESLint
- Prettier
- Next.js Image
- Server Components by default

Avoid unnecessary dependencies.

---

## 3. Visual Design

Create a premium professional design inspired by modern UK legal/healthcare consultancy websites.

### Colors

Use a restrained palette:

- Deep navy
- Soft blue
- Teal accent
- White
- Light blue-gray
- Neutral gray

### Style

- Elegant
- Minimal
- Spacious
- Professional
- Calm
- Trustworthy
- Modern
- Secure

Use:

- Rounded cards
- Subtle borders
- Soft shadows
- Large whitespace
- Professional icons
- Subtle animations
- Strong typography

Avoid generic hospital/medical-template styling.

---

## 4. Pages

Create these routes:

```text
/
 /about
 /services
 /for-solicitors
 /for-psychologists
 /for-individuals
 /how-it-works
 /faqs
 /contact
 /request-a-report
 /join-psychologist-network
 /solicitor-partnership
 /request-callback
 /privacy
 /terms
 /cookies
```

---

## 5. Homepage

Create a premium hero section.

### Hero

**Heading:**

> Independent Psychological & Country Expert Reporting

**Description:**

> Bright Mind Psychology Care and Reporting provides independent, court-compliant psychological and country expert services to solicitors, barristers, and legal professionals across a wide range of practice areas.

CTAs:

- Request a Report
- Speak to Our Team

Add professional visual imagery representing:

- Expert assessment
- Legal documentation
- Professional consultation
- Secure evidence

Avoid cliché medical imagery.

### Homepage sections

Include:

1. Hero
2. Trust/Credibility
3. Our Services
4. Who We Work With
5. Why Bright Mind
6. How It Works
7. Country Expertise
8. Final CTA
9. Footer

---

## 6. Services

Use the supplied content for these five services:

1. Expert Psychological Report
2. Mental Health Status Certificate
3. Country Expert Report: Mental Health Landscape
4. Other Country Expert Reports
5. Counselling Services

Create reusable service cards with:

- Icon
- Number
- Title
- Description
- CTA

---

## 7. Audiences

Create dedicated sections/pages for:

### Solicitors

Show:

- Expert psychological reports
- Mental health status certificates
- Country expert reports
- Secure case portal concept
- Instruct → Allocation → Assessment → Quality Review → Secure Release

### Psychologists

Show:

- Flexible case work
- Secure case portal
- Administrative support
- Transparent process
- Register → Compliance Review → Approval → Case Offers → Report → Quality Review

### Individuals

Show:

- Mental health status certificates
- Psychological assessments
- Counselling
- Enquiry → Suitability Review → Assessment → Secure Documents

Use the exact supplied content.

---

## 8. Country Expertise

Display the countries from the source:

```text
Afghanistan
Albania
Bangladesh
Bangladesh (Rohingya)
Cameroon
Ghana
India
India (Rohingya)
Myanmar
Nepal
Nigeria
Pakistan
Sri Lanka
United Kingdom
Vietnam
```

Provide:

- Search/filter
- Responsive country cards
- Region grouping if useful

Do not add countries that are not in the source.

---

## 9. FAQ

Create an accessible accordion using all supplied FAQ content.

Include questions covering:

- Services
- Who can instruct
- Areas of law
- Country coverage
- Report timescales
- HCPC registration
- Confidentiality
- Partner firms
- Psychologist applications
- Contact

---

## 10. Forms

Create polished responsive forms.

### Request Report

Fields should cover:

- Name
- Email
- Phone
- Organisation
- Case information
- Report required
- Supporting information
- Consent

### Psychologist Application

Include:

- Name
- Email
- Phone
- HCPC registration
- Professional role
- Expertise
- Experience
- Countries
- Availability
- Insurance
- CV upload
- Additional information

### Partnership

Include:

- Firm
- Contact
- Email
- Phone
- Position
- Website
- Areas of law
- Requirements
- Message

### Callback

Include:

- Name
- Phone
- Email
- Preferred callback time
- Reason
- Message

Forms should include:

- Validation
- Loading state
- Success state
- Error state
- Accessible labels

If no backend exists, implement frontend validation and clearly separate submission logic for future backend integration.

---

## 11. Header

Create sticky responsive navigation:

```text
Home
About
Services
For Solicitors
For Psychologists
For Individuals
How It Works
FAQs
Contact
```

Primary CTA:

**Request a Report**

Requirements:

- Desktop navigation
- Mobile menu
- Keyboard accessible
- Proper focus states
- Smooth transitions

---

## 12. Footer

Include:

### Company

- About
- Services
- How It Works
- FAQs
- Contact

### Professionals

- For Solicitors
- For Psychologists
- Solicitor Partnership

### Individuals

- For Individuals
- Request Callback
- Contact

### Legal

- Privacy
- Terms
- Cookies

Do not invent company registration information.

---

## 13. Components

Create reusable components:

```text
Header
MobileMenu
Footer
Hero
SectionHeading
ServiceCard
AudienceCard
FeatureCard
ProcessTimeline
CountryCard
CountryGrid
FAQAccordion
CTASection
ContactForm
TrustBadge
Breadcrumbs
```

---

## 14. Data Structure

Keep repeatable content in typed files:

```text
src/
├── app/
├── components/
├── data/
│   ├── services.ts
│   ├── countries.ts
│   ├── faqs.ts
│   └── navigation.ts
├── lib/
└── public/
```

Use TypeScript interfaces for structured content.

---

## 15. SEO

Implement:

- Unique page titles
- Meta descriptions
- Canonical URLs
- Open Graph
- Twitter metadata
- Semantic HTML
- Proper heading hierarchy
- Sitemap
- Robots.txt
- Breadcrumbs where appropriate
- FAQ structured data where appropriate

Create:

```text
src/app/sitemap.ts
src/app/robots.ts
```

Do not invent unsupported organization information.

---

## 16. Accessibility

Follow WCAG principles.

Ensure:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Accessible forms
- Proper labels
- ARIA where necessary
- Good color contrast
- Reduced-motion support
- Meaningful image alt text

---

## 17. Performance

Target:

```text
Performance: 90+
Accessibility: 95+
Best Practices: 95+
SEO: 95+
```

Use:

- Next.js Image
- Lazy loading
- Optimized fonts
- Server Components
- Minimal client-side JavaScript
- No unnecessary libraries

---

## 18. Future Backend Ready

Structure frontend so it can later connect to:

- Next.js API
- MongoDB
- Authentication
- Client portal
- Solicitor portal
- Psychologist portal
- Admin dashboard
- Case management
- Secure documents
- Notifications
- Email services

Do not create fake backend functionality.

Possible future routes:

```text
/client
/solicitor
/psychologist
/admin
```

Keep unfinished portal functionality private/unavailable.

---

## 19. Content Rules

`Bright_mind_frontend.md` is the source of truth.

Never invent:

- Staff names
- Testimonials
- Reviews
- Pricing
- Statistics
- Awards
- Certifications
- Email addresses
- Phone numbers
- Office addresses
- Registration numbers
- Client logos
- Qualifications

Preserve placeholders such as:

```text
[insert email]
[insert phone number]
[insert registered office address]
```

---

## 20. OpenCode Instructions

Before coding:

1. Inspect the existing project.
2. Read `Bright_mind_frontend.md`.
3. Check existing dependencies.
4. Preserve useful configuration.
5. Do not unnecessarily rewrite the project.

Then:

1. Build the complete Next.js site.
2. Implement all public pages.
3. Create reusable components.
4. Add supplied content.
5. Implement responsive design.
6. Implement forms.
7. Add SEO.
8. Add accessibility.
9. Optimize images and performance.
10. Test desktop and mobile.
11. Fix TypeScript errors.
12. Fix ESLint errors.
13. Fix broken links.
14. Check all routes.
15. Check browser console for errors.
16. Remove unused code/dependencies.
17. Ensure there is no Lorem Ipsum.
18. Run a production build.

---

## 21. Final Quality Standard

The final website must look like a **premium UK professional expert-services organisation**, not a generic template.

Prioritize:

```text
Professional UI
Excellent typography
Clear hierarchy
Responsive layout
Strong CTAs
Trust
Confidentiality
Security
Accessibility
SEO
Performance
```

Use subtle animations, elegant cards, professional imagery, generous whitespace, and a polished visual hierarchy.

Build the **complete production-ready frontend**, not just the homepage.

---

## Source

Primary content source:

```text
Bright_mind_frontend.md
```

Use that file for all supplied website copy and factual claims.