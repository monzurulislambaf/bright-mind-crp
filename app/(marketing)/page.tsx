import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  homeContent,
  insightsContent,
  solicitorContent,
  corePillars,
} from "@/data/content";
import { psychologicalServices, forensicServices, practiceAreas } from "@/data/services";
import { experts } from "@/data/experts";
import { trainingProgrammes } from "@/data/training";
import { faqs } from "@/data/faqs";
import { siteMeta } from "@/data/navigation";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ServiceCard } from "@/components/site/ServiceCard";
import { PillarCard } from "@/components/site/PillarCard";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import { CountryGrid } from "@/components/site/CountryGrid";
import { CTASection } from "@/components/site/CTASection";
import { FAQAccordion } from "@/components/site/FAQAccordion";
import { TrustBadge } from "@/components/site/TrustBadge";
import { CheckIcon } from "@/components/site/icons";
import { FadeIn, Stagger, StaggerItem } from "@/components/site/Motion";

export const metadata: Metadata = {
  title: siteMeta.tagline,
  description: homeContent.hero.description,
  alternates: { canonical: "/" },
};

const trustItems = [
  {
    label: "Professionals",
    value: "Qualified",
    description:
      "Psychologists and country experts reviewed before panel approval.",
  },
  {
    label: "Standards",
    value: "Ethical",
    description:
      "Independent conclusions, honest limitations, professional accountability.",
  },
  {
    label: "Process",
    value: "End-to-end",
    description:
      "Enquire, assess, quality-review, and release through a secure system.",
  },
  {
    label: "Access",
    value: "Permissioned",
    description:
      "Sensitive material stays inside a secure, audited case portal.",
  },
] as const;

const pillarIcons = {
  "psychological-services": "psychological",
  "expert-forensic": "forensic",
  "country-expertise": "country",
  "training-research": "training",
} as const;

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden border-b border-base-300 bg-base-200/70">
        <div
          className="pointer-events-none absolute inset-0 opacity-50 mesh-bg"
          aria-hidden="true"
        />
        <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <FadeIn>
            <p className="mb-5 text-xs font-semibold tracking-[0.2em] text-accent uppercase">
              {homeContent.hero.eyebrow}
            </p>
            <h1 className="font-display max-w-3xl text-4xl leading-[1.08] font-semibold tracking-tight text-primary sm:text-5xl lg:text-6xl">
              {homeContent.hero.heading}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-base-content/75">
              {homeContent.hero.description}
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-base-content/65">
              {homeContent.hero.supporting}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/services" className="btn btn-primary btn-lg gap-2">
                Enquire / Book Psychological Services
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/request-a-report"
                className="btn btn-outline btn-lg"
              >
                Instruct an Expert
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-2">
              {practiceAreas.map((area) => (
                <span key={area} className="badge badge-soft badge-neutral">
                  {area}
                </span>
              ))}
            </div>
          </FadeIn>

          <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {trustItems.map((item) => (
              <StaggerItem key={item.label}>
                <TrustBadge
                  label={item.label}
                  value={item.value}
                  description={item.description}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 2. Introduction to Bright Mind */}
      <section className="section-pad">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <FadeIn>
            <div className="overflow-hidden rounded-box border border-base-300 bg-base-200">
              <Image
                alt="Bright Mind psychology organisation illustration"
                className="h-auto w-full object-cover"
                height={900}
                priority
                src="/brightmind-hero.png"
                width={1200}
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
              About Bright Mind
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold text-primary">
              A credible psychology organisation, not just a reporting service
            </h2>
            <p className="mt-4 text-base leading-relaxed text-base-content/70">
              Bright Mind brings together professional psychological services,
              a specialist expert and forensic division, country expertise, and
              training and research — with secure systems behind every pathway.
              We are honest about what we provide, and we do not publish
              unsupported claims.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/about" className="btn btn-primary gap-2">
                About Bright Mind
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/our-experts" className="btn btn-outline">
                Meet our experts
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3. Four core service pillars */}
      <section className="section-pad border-y border-base-300 bg-base-200/40">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="What we do"
              title="Four pillars of professional psychology"
              subtitle="Every enquiry flows into a clear pathway — and, in time, into our secure CRM as a lead, client, or case."
            />
          </FadeIn>
          <Stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {corePillars.map((pillar, index) => (
              <StaggerItem key={pillar.id}>
                <PillarCard
                  title={pillar.title}
                  summary={pillar.summary}
                  href={pillar.href}
                  cta={pillar.cta}
                  icon={pillarIcons[pillar.id as keyof typeof pillarIcons]}
                  index={String(index + 1).padStart(2, "0")}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 4. Psychological Services */}
      <section className="section-pad">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="Psychological Services"
              title="Professional psychological support for individuals and organisations"
              subtitle="Assessment, consultation, and support pathways delivered by qualified professionals — with suitability confirmed before any commitment."
            />
          </FadeIn>
          <Stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {psychologicalServices.map((service) => (
              <StaggerItem key={service.id}>
                <ServiceCard service={service} />
              </StaggerItem>
            ))}
          </Stagger>
          <FadeIn className="mt-10 text-center" delay={0.1}>
            <Link href="/services" className="btn btn-outline gap-2">
              View all psychological services
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 5. Expert & Forensic Psychology */}
      <section className="section-pad border-y border-base-300 bg-base-200/40">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="Expert & Forensic Psychology"
              title="A specialist division for independent expert evidence"
              subtitle="Independent psychological evidence prepared for courts, tribunals, and legal teams — clearly separate from our broader service identity."
            />
          </FadeIn>
          <Stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {forensicServices.slice(0, 3).map((service) => (
              <StaggerItem key={service.id}>
                <ServiceCard service={service} />
              </StaggerItem>
            ))}
          </Stagger>
          <FadeIn className="mt-10 text-center" delay={0.1}>
            <Link href="/expert-forensic" className="btn btn-primary gap-2">
              Instruct an Expert
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 6. Country Expertise */}
      <section className="section-pad">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="Country Expertise"
              title="Sourced, dated and reviewable country evidence"
              subtitle="Mental health systems, treatment access, and conditions relevant to return risk — for the jurisdictions listed below. For countries outside this list, contact us to discuss availability."
            />
          </FadeIn>
          <FadeIn delay={0.08}>
            <CountryGrid />
          </FadeIn>
          <FadeIn className="mt-10 text-center" delay={0.12}>
            <Link href="/country-reports" className="btn btn-outline gap-2">
              Explore country expertise
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 7. Our Experts */}
      <section className="section-pad border-y border-base-300 bg-base-200/40">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="Our Experts"
              title="A vetted panel of qualified professionals"
              subtitle="Psychologists, counsellors, and country experts — reviewed for registration, qualifications, and expertise before joining the panel."
            />
          </FadeIn>
          <Stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {experts.map((expert) => (
              <StaggerItem key={expert.id}>
                <article className="surface-card h-full">
                  <div className="card-body gap-3">
                    <h3 className="font-display text-lg font-semibold text-primary">
                      {expert.role}
                    </h3>
                    {expert.title ? (
                      <p className="text-sm text-base-content/70">
                        {expert.title}
                      </p>
                    ) : null}
                    <div className="flex flex-wrap gap-2">
                      {expert.specialisms.slice(0, 3).map((specialism) => (
                        <span
                          key={specialism}
                          className="badge badge-soft badge-neutral badge-sm"
                        >
                          {specialism}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
          <FadeIn className="mt-10 text-center" delay={0.1}>
            <Link href="/our-experts" className="btn btn-outline gap-2">
              View the expert directory
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 8. Training & Research */}
      <section className="section-pad">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="Training & Research"
              title="Professional development and research-informed insight"
              subtitle="Workshops, webinars, CPD, and in-house training built with our expert panel — plus research-informed insight for professionals."
            />
          </FadeIn>
          <Stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {trainingProgrammes.slice(0, 4).map((programme) => (
              <StaggerItem key={programme.id}>
                <article className="surface-card h-full">
                  <div className="card-body gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="badge badge-soft badge-primary badge-sm">
                        {programme.format}
                      </span>
                      <span className="badge badge-soft badge-neutral badge-sm">
                        {programme.delivery}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-primary">
                      {programme.title}
                    </h3>
                    <p className="flex-1 text-sm text-base-content/70">
                      {programme.summary}
                    </p>
                    <p className="text-sm font-medium text-base-content/60">
                      {programme.duration} · {programme.fee}
                    </p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
          <FadeIn className="mt-10 text-center" delay={0.1}>
            <Link href="/training-research" className="btn btn-outline gap-2">
              Explore training & research
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 9. How It Works */}
      <section className="section-pad border-y border-base-300 bg-base-200/40">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <FadeIn>
            <SectionHeading
              eyebrow="How it works"
              title="A clear, secure journey from enquiry to outcome"
              subtitle="Whether you are an individual, a solicitor, or a professional, the process stays transparent and secure."
            />
            <Link href="/how-it-works" className="btn btn-ghost gap-1">
              See full process details
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </FadeIn>
          <ProcessTimeline steps={solicitorContent.process} />
        </div>
      </section>

      {/* 10. Latest insights */}
      <section className="section-pad">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="Insights"
              title="Latest professional insight"
              subtitle="Articles, research notes, and professional updates from across our four pillars."
            />
          </FadeIn>
          <Stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {insightsContent.cards.slice(0, 3).map((card) => (
              <StaggerItem key={card.title}>
                <article className="surface-card h-full">
                  <div className="card-body gap-3">
                    <h3 className="font-display text-lg font-semibold text-primary">
                      {card.title}
                    </h3>
                    <p className="flex-1 text-base-content/70">{card.summary}</p>
                    <Link
                      href={card.href}
                      className="btn btn-ghost btn-sm gap-1 px-0 text-primary"
                    >
                      Open topic
                      <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
          <FadeIn className="mt-8 text-center" delay={0.08}>
            <Link href="/insights" className="btn btn-outline gap-2">
              View all insights
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 11. FAQs */}
      <section className="section-pad border-y border-base-300 bg-base-200/40">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <FadeIn>
            <SectionHeading
              eyebrow="FAQs"
              title="Common questions, answered honestly"
              subtitle="A selection of the questions we hear most. View the full list for more detail."
            />
            <Link href="/faqs" className="btn btn-ghost gap-1">
              View all FAQs
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </FadeIn>
          <FadeIn delay={0.08}>
            <FAQAccordion items={faqs.slice(0, 6)} />
          </FadeIn>
        </div>
      </section>

      {/* 12. Contact / enquiry CTA */}
      <section className="border-y border-base-300 bg-primary text-primary-content">
        <div className="container-page grid gap-8 py-14 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
              Why Bright Mind
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Professional, ethical, and secure — across every pathway.
            </h2>
          </FadeIn>
          <Stagger className="grid gap-4 sm:grid-cols-2">
            {[
              "Qualified professionals, reviewed before approval",
              "Independent expert evidence for legal proceedings",
              "Sourced, dated and reviewable country expertise",
              "Training & research informed by professional practice",
            ].map((item) => (
              <StaggerItem key={item}>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-accent">
                    <CheckIcon className="h-5 w-5" />
                  </span>
                  <span className="text-primary-content/90">{item}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CTASection
        title="How can we help?"
        description="Enquire about psychological services, instruct an expert, request country evidence, or register interest in training."
        primaryHref="/contact"
        primaryLabel="Enquire / Book"
        secondaryHref="/request-a-report"
        secondaryLabel="Instruct an Expert"
      />
    </>
  );
}
