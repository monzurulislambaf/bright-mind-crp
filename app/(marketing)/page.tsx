import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { homeContent, insightsContent, solicitorContent } from "@/data/content";
import { services, practiceAreas } from "@/data/services";
import { siteMeta } from "@/data/navigation";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ServiceCard } from "@/components/site/ServiceCard";
import { AudienceCard } from "@/components/site/AudienceCard";
import { FeatureCard } from "@/components/site/FeatureCard";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import { CountryGrid } from "@/components/site/CountryGrid";
import { CTASection } from "@/components/site/CTASection";
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
    label: "Standards",
    value: "Court-ready",
    description:
      "Evidence prepared to the standards courts and tribunals require.",
  },
  {
    label: "Experts",
    value: "HCPC panel",
    description:
      "Registered psychologists and country experts, compliance-reviewed.",
  },
  {
    label: "Process",
    value: "End-to-end",
    description:
      "Instruct, allocate, assess, quality-review, and release securely.",
  },
  {
    label: "Access",
    value: "Permissioned",
    description:
      "Sensitive material stays inside a secure, audited case portal.",
  },
] as const;

export default function HomePage() {
  return (
    <>
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
              <Link href="/request-a-report" className="btn btn-primary btn-lg gap-2">
                Request a Report
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/contact" className="btn btn-outline btn-lg">
                Speak to Our Team
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

      <section className="section-pad border-b border-base-300">
        <div className="container-page">
          <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {homeContent.stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <article className="surface-card h-full">
                  <div className="card-body gap-1">
                    <strong className="font-display text-3xl font-semibold text-primary">
                      {stat.value}
                    </strong>
                    <span className="text-sm text-base-content/70">
                      {stat.label}
                    </span>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <FadeIn>
            <div className="overflow-hidden rounded-box border border-base-300 bg-base-200">
              <Image
                alt="Bright Mind marketing hero illustration"
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
              Website plus platform
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold text-primary">
              A complete service presence with secure operations behind it
            </h2>
            <p className="mt-4 text-base leading-relaxed text-base-content/70">
              Service marketing, reporting and counselling pathways, a
              professionals network, and a secure operational portal for CRM,
              casework, communication, and documents.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/reporting" className="btn btn-primary gap-2">
                Explore reporting
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/login" className="btn btn-outline">
                Portal login
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section-pad border-y border-base-300 bg-base-200/40">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="Why instruct Bright Mind"
              title="Evidence legal professionals can rely on"
              subtitle="Independent expertise, clinical rigour, and a process designed for legal relevance and confidentiality."
            />
          </FadeIn>
          <Stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {homeContent.whyInstruct.map((item, index) => (
              <StaggerItem key={item.title}>
                <FeatureCard
                  title={item.title}
                  text={item.text}
                  index={String(index + 1).padStart(2, "0")}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="Our services"
              title="Independent psychological and country expert support"
              subtitle="A clear overview of how we support your case — from expert reports to counselling."
            />
          </FadeIn>
          <Stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <StaggerItem key={service.id}>
                <ServiceCard service={service} />
              </StaggerItem>
            ))}
          </Stagger>
          <FadeIn className="mt-10 text-center" delay={0.1}>
            <Link href="/services" className="btn btn-outline gap-2">
              View all services
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </FadeIn>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="Who we work with"
              title="One pathway for every party in the case"
              subtitle="Whether you instruct, assess, or need support for yourself, the process stays clear and secure."
            />
          </FadeIn>
          <Stagger className="grid gap-5 md:grid-cols-3">
            {homeContent.audiences.map((audience, index) => (
              <StaggerItem key={audience.title}>
                <AudienceCard
                  title={audience.title}
                  text={audience.text}
                  href={audience.href}
                  cta={audience.cta}
                  index={String(index + 1).padStart(2, "0")}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section-pad border-y border-base-300 bg-base-200/40">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <FadeIn>
            <SectionHeading
              eyebrow="How it works"
              title="From instruction to secure release"
              subtitle="A calm, transparent journey with quality review built in."
            />
            <Link href="/how-it-works" className="btn btn-ghost gap-1">
              See full process details
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </FadeIn>
          <ProcessTimeline steps={solicitorContent.process} />
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="Country expertise"
              title="Registered country experts across key jurisdictions"
              subtitle="Mental health landscape and broader country expert reports for the countries listed below. For countries outside this list, contact us to discuss availability."
            />
          </FadeIn>
          <FadeIn delay={0.08}>
            <CountryGrid />
          </FadeIn>
        </div>
      </section>

      <section className="border-y border-base-300 bg-primary text-primary-content">
        <div className="container-page grid gap-8 py-14 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
              Why Bright Mind
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Trust, independence, and clinical rigour — for legal relevance.
            </h2>
          </FadeIn>
          <Stagger className="grid gap-4 sm:grid-cols-2">
            {[
              "Independent & court-compliant reporting",
              "HCPC-registered psychologist network",
              "Secure, permission-based case portal",
              "Internal quality review before release",
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

      <section className="section-pad">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="Insights"
              title="Specialist topics for legal and clinical search intent"
              subtitle="Explore pathways covering reporting, country evidence, counselling, and secure workflows."
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

      <CTASection
        title="Have a case that needs expert input?"
        description="Our team is ready to help with instructions, partnership enquiries, and individual support."
        primaryHref="/request-a-report"
        primaryLabel="Request a Report"
        secondaryHref="/request-callback"
        secondaryLabel="Request a Callback"
      />
    </>
  );
}
