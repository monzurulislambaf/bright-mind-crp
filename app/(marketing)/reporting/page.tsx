import type { Metadata } from "next";
import Image from "next/image";
import { reportingContent } from "@/data/content";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import { CTASection } from "@/components/site/CTASection";
import { CheckIcon } from "@/components/site/icons";
import { FadeIn, Stagger, StaggerItem } from "@/components/site/Motion";

export const metadata: Metadata = {
  title: "Psychological Reporting",
  description:
    "Independent asylum psychological reports and immigration psychological assessments structured for UK tribunal, Home Office, and court scrutiny.",
  alternates: { canonical: "/reporting" },
};

export default function ReportingPage() {
  return (
    <>
      <PageHero
        eyebrow="Psychological reporting"
        title={reportingContent.heading}
        description={reportingContent.intro}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "Reporting" },
        ]}
        ctas={[
          { href: "/request-a-report", label: "Request a Report" },
          { href: "/for-solicitors", label: "For solicitors", primary: false },
        ]}
      />

      <section className="section-pad">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <FadeIn>
            <div className="overflow-hidden rounded-box border border-base-300 bg-base-200">
              <Image
                alt="Remote psychological reporting session for immigration and asylum work"
                className="h-auto w-full object-cover"
                height={900}
                priority
                src="/brightmind-reporting.png"
                width={1200}
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
              Core reporting use case
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold text-primary">
              Evidence-led reporting for vulnerable clients and legally significant questions
            </h2>
            <p className="mt-4 text-base leading-relaxed text-base-content/70">
              Clear guidance on who the report is for, why it is needed, and how
              it fits into proceedings — with a secure route into intake and
              case handling.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-pad border-y border-base-300 bg-base-200/40">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="Use cases"
              title="Built for proceedings where psychological evidence must be clear and usable"
            />
          </FadeIn>
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reportingContent.useCases.map((item) => (
              <StaggerItem key={item}>
                <article className="surface-card h-full">
                  <div className="card-body">
                    <h3 className="font-display text-lg font-semibold text-primary">
                      {item}
                    </h3>
                    <p className="text-sm text-base-content/70">
                      Independent reporting shaped around the real evidential
                      question rather than a generic template.
                    </p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="When this helps"
              title="Common reasons legal teams seek a psychological report"
            />
          </FadeIn>
          <Stagger className="grid gap-5 md:grid-cols-3">
            {reportingContent.reasons.map((item) => (
              <StaggerItem key={item.title}>
                <article className="surface-card h-full">
                  <div className="card-body gap-3">
                    <h3 className="font-display text-lg font-semibold text-primary">
                      {item.title}
                    </h3>
                    <p className="text-base-content/70">{item.summary}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section-pad border-y border-base-300 bg-base-200/40">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-start">
          <FadeIn>
            <SectionHeading
              eyebrow="Workflow"
              title="From referral to secure release"
              subtitle="A simple explanation of how instructions move through assessment, drafting, quality review, and controlled release."
            />
          </FadeIn>
          <ProcessTimeline
            steps={reportingContent.workflow.map((step) => ({
              title: step.phase,
              text: step.summary,
            }))}
          />
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-start">
          <FadeIn>
            <SectionHeading
              eyebrow="Evidence standards"
              title="Built for scrutiny, not persuasion"
              subtitle="Reports are independent evidence with named limitations, careful inference, and structured review of available materials."
            />
          </FadeIn>
          <FadeIn delay={0.08}>
            <ul className="space-y-3">
              {reportingContent.standards.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-base-content/80">{item}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      <CTASection
        title="Ready to request an asylum psychological report or immigration assessment?"
        description="Submit a structured instruction and we will route the matter into the Bright Mind CRM and case management pathway."
        primaryHref="/request-a-report"
        primaryLabel="Request a Report"
        secondaryHref="/contact"
        secondaryLabel="Contact the team"
      />
    </>
  );
}
